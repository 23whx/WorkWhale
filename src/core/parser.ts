// 文件解析器
import { BookSource, ChapterIndex } from '@/types';

// 生成文件ID（基于文件名和大小，确保同一文件ID相同）
function generateFileId(name: string, size: number): string {
  // 使用文件名和大小生成唯一ID，同一文件会生成相同ID
  // 这样可以避免同一本书在最近列表中重复出现
  return `${name}-${size}`;
}

// 提取章节信息（改进版：更精确的章节识别）
function extractChapters(text: string): ChapterIndex[] {
  const candidates: { title: string; start: number; priority: number }[] = [];

  // 按行扫描，识别独立成行的章节标题
  const lines = text.split('\n');
  let currentPos = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    // 跳过空行和过长的行（内容行）
    if (!trimmed || trimmed.length > 100) {
      currentPos += line.length + 1;
      continue;
    }

    // 章节标题模式（优先级从高到低）
    const patterns = [
      { regex: /^第[零一二三四五六七八九十百千0-9]+[章回节卷部]/i, priority: 10 },
      { regex: /^第\s*\d+\s*[章回节卷部]/i, priority: 9 },
      { regex: /^chapter\s+\d+/i, priority: 8 },
      { regex: /^第[零一二三四五六七八九十百千0-9]+[章回节卷部][：:\s]+.{1,30}$/i, priority: 10 },
      { regex: /^[【\[]第[零一二三四五六七八九十百千0-9]+[章回节卷部][】\]]/i, priority: 9 },
      { regex: /^\d+[\s.、]+.{1,30}$/i, priority: 5 },
      { regex: /^[一二三四五六七八九十百千]+[、.\s]+.{1,30}$/i, priority: 6 },
    ];

    for (const pattern of patterns) {
      if (pattern.regex.test(trimmed)) {
        // 提取完整标题（可能包含副标题）
        let title = trimmed;
        
        // 清理多余的空格和标点
        title = title
          .replace(/\s+/g, ' ')
          .replace(/[：:]\s*/g, ' ')
          .trim();

        candidates.push({
          title,
          start: currentPos,
          priority: pattern.priority,
        });
        break;
      }
    }

    currentPos += line.length + 1;
  }

  // 排序：先按位置，后按优先级去重
  const sorted = candidates
    .sort((a, b) => a.start - b.start)
    .filter((cand, idx, arr) => {
      if (idx === 0) return true;
      const prev = arr[idx - 1];
      // 相近位置（50字符内）保留优先级高的
      if (cand.start - prev.start < 50) {
        return cand.priority > prev.priority;
      }
      return true;
    });

  const chapters: ChapterIndex[] = sorted.map((c, i) => ({
    id: `chapter-${i}`,
    title: c.title,
    start: c.start,
  }));

  // 设置结束位置
  for (let i = 0; i < chapters.length; i++) {
    chapters[i].end = i < chapters.length - 1 ? chapters[i + 1].start : text.length;
  }

  console.log(`📚 提取到 ${chapters.length} 个章节:`, chapters.slice(0, 5).map(c => c.title));

  return chapters;
}

// TXT 解析器
async function parseTxt(file: File): Promise<BookSource> {
  const text = await file.text();
  const cleanText = text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  const chapters = extractChapters(cleanText);

  return {
    id: generateFileId(file.name, file.size),
    type: 'txt',
    title: file.name.replace(/\.txt$/i, ''),
    content: cleanText,
    chapters: chapters,
    size: file.size,
  };
}

// PDF 解析器（简化版，实际需要 PDF.js）
// 暂时不使用，保留作为未来扩展
// async function parsePdf(file: File): Promise<BookSource> {
//   try {
//     const { getDocument, GlobalWorkerOptions } = await import('pdfjs-dist');
//     
//     // 设置 worker
//     GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js`;
//     
//     const arrayBuffer = await file.arrayBuffer();
//     const pdf = await getDocument({ data: arrayBuffer }).promise;
//     
//     let fullText = '';
//     
//     for (let i = 1; i <= pdf.numPages; i++) {
//       const page = await pdf.getPage(i);
//       const content = await page.getTextContent();
//       const pageText = content.items
//         .map((item: any) => item.str)
//         .join(' ');
//       fullText += pageText + '\n\n';
//     }

//     return {
//       id: generateFileId(file.name, file.size),
//       type: 'pdf',
//       title: file.name.replace(/\.pdf$/i, ''),
//       content: fullText.trim(),
//       chapters: [],
//       size: file.size,
//     };
//   } catch (error) {
//     console.error('PDF 解析失败:', error);
//     throw new Error('PDF 解析失败，请尝试其他文件');
//   }
// }

// 清理 HTML 文本，保留结构和可读性
function cleanHtmlText(element: HTMLElement): string {
  // 移除脚本和样式标签
  const clone = element.cloneNode(true) as HTMLElement;
  clone.querySelectorAll('script, style, svg, img').forEach(el => el.remove());
  
  // 处理段落和换行
  const paragraphs: string[] = [];
  let currentParagraph = '';
  
  const processNode = (node: Node, inHeading = false) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const content = node.textContent || '';
      // 保留文本，清理多余空白
      const cleaned = content.replace(/\s+/g, ' ').trim();
      if (cleaned) {
        currentParagraph += cleaned;
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      const tag = el.tagName.toLowerCase();
      
      // 处理不同类型的元素
      if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag)) {
        // 标题：前后加空行，内容加粗标记
        if (currentParagraph.trim()) {
          paragraphs.push(currentParagraph.trim());
          currentParagraph = '';
        }
        paragraphs.push(''); // 标题前空行
        
        el.childNodes.forEach(child => processNode(child, true));
        
        if (currentParagraph.trim()) {
          // 标题内容
          paragraphs.push(currentParagraph.trim());
          currentParagraph = '';
        }
        paragraphs.push(''); // 标题后空行
        
      } else if (tag === 'p') {
        // 段落：添加首行缩进
        if (currentParagraph.trim()) {
          paragraphs.push(currentParagraph.trim());
          currentParagraph = '';
        }
        
        el.childNodes.forEach(child => processNode(child));
        
        if (currentParagraph.trim()) {
          // 中文段落添加首行缩进（两个全角空格）
          const para = currentParagraph.trim();
          // 判断是否主要是中文内容
          const chineseChars = para.match(/[\u4e00-\u9fa5]/g);
          const isChinese = chineseChars && chineseChars.length > para.length * 0.3;
          
          if (isChinese) {
            paragraphs.push('　　' + para); // 全角空格缩进
          } else {
            paragraphs.push(para);
          }
          currentParagraph = '';
        }
        
      } else if (tag === 'br') {
        // 换行符
        if (currentParagraph.trim()) {
          paragraphs.push(currentParagraph.trim());
          currentParagraph = '';
        }
        
      } else if (['div', 'section', 'article'].includes(tag)) {
        // 块级容器：递归处理
        el.childNodes.forEach(child => processNode(child));
        
      } else if (tag === 'li') {
        // 列表项
        if (currentParagraph.trim()) {
          paragraphs.push(currentParagraph.trim());
          currentParagraph = '';
        }
        currentParagraph = '• '; // 列表标记
        el.childNodes.forEach(child => processNode(child));
        if (currentParagraph.trim() && currentParagraph !== '• ') {
          paragraphs.push(currentParagraph.trim());
          currentParagraph = '';
        }
        
      } else {
        // 其他元素（如 span, strong, em 等）：保持内容
        el.childNodes.forEach(child => processNode(child, inHeading));
      }
    }
  };
  
  clone.childNodes.forEach(node => processNode(node));
  
  // 收尾：如果还有未处理的段落
  if (currentParagraph.trim()) {
    paragraphs.push(currentParagraph.trim());
  }
  
  // 组合段落，保持段落间空行
  const text = paragraphs
    .filter(p => p !== null && p !== undefined) // 过滤空值
    .join('\n')
    .replace(/\n{4,}/g, '\n\n\n') // 最多保留3个换行（2个空行）
    .trim();
  
  return text;
}

// EPUB 解析器（改进：美化文本格式 + 准确章节）
async function parseEpub(file: File): Promise<BookSource> {
  try {
    const ePub = (await import('epubjs')).default;
    const arrayBuffer = await file.arrayBuffer();
    const book = ePub(arrayBuffer);
    
    await book.ready;
    
    const spine = await book.loaded.spine;
    const navigation = await book.loaded.navigation;
    let fullText = '';
    const sections: { href: string; start: number; end: number }[] = [];
    
    console.log('📘 EPUB 解析开始，spine 数:', spine.length);
    
    // 遍历 spine，记录每节文本的起止位置
    for (let i = 0; i < spine.length; i++) {
      const item = spine[i];
      try {
        const startPos = fullText.length;
        
        const section = book.spine.get(item.href);
        await section.load(book.load.bind(book));
        
        const contents = section.document;
        if (contents && contents.body) {
          // 使用改进的文本清理函数
          const text = cleanHtmlText(contents.body);
          
          if (text.length > 0) {
            fullText += text + '\n\n';
            sections.push({ href: item.href || '', start: startPos, end: fullText.length });
            console.log(`✓ 第 ${i + 1} 节: ${text.length} 字`);
          }
        }
      } catch (e) {
        console.warn('⚠ 章节加载失败:', item.href, e);
      }
    }

    const metadata = await book.loaded.metadata;
    console.log('✅ EPUB 解析完成，总字数:', fullText.length);
    
    if (fullText.length === 0) {
      throw new Error('EPUB 文件内容为空或无法解析');
    }

    // 根据 toc 与 spine 的 href 映射，生成准确的章节
    const normalizeHref = (h: string) => {
      return h.split('#')[0]
        .replace(/^\.\//, '')
        .replace(/\\/g, '/')
        .toLowerCase()
        .trim();
    };
    
    const spineMap = new Map<string, { start: number; end: number }>();
    sections.forEach(s => {
      const normalized = normalizeHref(s.href);
      spineMap.set(normalized, { start: s.start, end: s.end });
    });

    const chapters: ChapterIndex[] = [];
    
    // 从 TOC 提取章节（支持嵌套目录）
    if (navigation && Array.isArray(navigation.toc) && navigation.toc.length > 0) {
      console.log('📚 TOC 原始结构:', navigation.toc.length, '项');
      console.log('🗂️ Spine Map 包含:', Array.from(spineMap.keys()));
      
      // 递归处理TOC项（包括子章节）
      const processTocItem = (tocItem: any, level = 0) => {
        const rawHref = tocItem.href || tocItem.hrefCFI || '';
        const href = normalizeHref(rawHref);
        const title = (tocItem.label || tocItem.id || '').toString().trim();
        
        console.log(`${'  '.repeat(level)}🔍 TOC项: "${title}" -> 原始href: "${rawHref}"`);
        
        if (!title) {
          console.warn(`  ${'  '.repeat(level)}⚠️ 章节标题为空，跳过`);
          return;
        }
        
        // 尝试多种匹配策略
        let seg = spineMap.get(href);
        
        // 如果直接匹配失败，尝试部分匹配
        if (!seg && href) {
          for (const [spineHref, spineData] of spineMap.entries()) {
            if (spineHref.includes(href) || href.includes(spineHref)) {
              console.log(`  ${'  '.repeat(level)}✅ 部分匹配: "${spineHref}"`);
              seg = spineData;
              break;
            }
          }
        }
        
        // 尝试在文本中找到章节标题
        let actualStart = 0;
        let actualEnd = fullText.length;
        let found = false;
        
        if (seg) {
          // 如果找到segment，优先在segment中搜索
          const segmentText = fullText.slice(seg.start, seg.end);
          actualStart = seg.start;
          actualEnd = seg.end;
          
          const titleVariations = [
            title,
            title.replace(/\s+/g, ''),  // 去除空格
            title.replace(/\s+/g, ' ').trim(),  // 标准化空格
          ];
          
          for (const titleVar of titleVariations) {
            const titleIndex = segmentText.indexOf(titleVar);
            if (titleIndex !== -1) {
              actualStart = seg.start + titleIndex;
              found = true;
              console.log(`  ${'  '.repeat(level)}🎯 在segment中找到标题，位置偏移: ${titleIndex}`);
              break;
            }
          }
          
          if (!found) {
            console.log(`  ${'  '.repeat(level)}⚠️ 未在segment中找到标题，使用segment起始位置`);
            found = true;  // segment本身也算找到了
          }
        }
        
        // 如果segment匹配失败，在全文中搜索标题
        if (!found) {
          console.warn(`  ${'  '.repeat(level)}⚠️ 未找到匹配的spine: "${href}"，尝试在全文中搜索...`);
          
          const titleVariations = [
            title,
            title.replace(/\s+/g, ''),
            title.replace(/\s+/g, ' ').trim(),
            title.split(/\s+/).join(''),  // 完全去除空格
            title.substring(0, 20),  // 使用前20个字符
          ];
          
          for (const titleVar of titleVariations) {
            if (titleVar.length < 3) continue;  // 标题太短，跳过
            
            const titleIndex = fullText.indexOf(titleVar);
            if (titleIndex !== -1) {
              actualStart = titleIndex;
              actualEnd = fullText.length;  // 暂时设置为文末
              found = true;
              console.log(`  ${'  '.repeat(level)}✅ 在全文中找到标题，位置: ${titleIndex}`);
              break;
            }
          }
          
          if (!found) {
            console.warn(`  ${'  '.repeat(level)}⚠️ 无法在全文中找到标题 "${title}"，跳过该章节`);
            return;  // 实在找不到就跳过
          }
        }
        
        // 添加章节
        chapters.push({
          id: `chapter-${chapters.length}`,
          title: title.replace(/\s+/g, ' '),
          start: actualStart,
          end: actualEnd,
        });
        console.log(`  ${'  '.repeat(level)}✅ 章节已添加: "${title}" [${actualStart} - ${actualEnd}]`);
        
        // 递归处理子项
        if (tocItem.subitems && Array.isArray(tocItem.subitems)) {
          tocItem.subitems.forEach((subitem: any) => processTocItem(subitem, level + 1));
        }
      };
      
      navigation.toc.forEach((tocItem: any) => processTocItem(tocItem));

      // 过滤无效目录项（封面/目录/空白等）
      const invalidTitlePattern = /(空白|目录|封面|copyright|版权|致谢|扉页|前言|封底)/i;
      const filteredChapters = chapters.filter((c) => !invalidTitlePattern.test(c.title || ''));
      if (filteredChapters.length !== chapters.length) {
        console.log(`🧹 过滤无效目录项: ${chapters.length - filteredChapters.length} 条`);
      }
      // 用过滤后的结果继续
      chapters.length = 0;
      filteredChapters.forEach((c) => chapters.push({ ...c }));

      // 后处理：修复章节位置冲突
      console.log('🔧 后处理章节位置...');
      for (let i = 0; i < chapters.length; i++) {
        // 如果当前章节和前一个章节start相同，尝试调整
        if (i > 0 && chapters[i].start === chapters[i - 1].start) {
          console.warn(`⚠️ 章节 "${chapters[i].title}" 与前一章节位置相同`);
          
          // 尝试在前一章节和当前章节的范围内分段
          const prevChapter = chapters[i - 1];
          const rangeLength = (prevChapter.end ?? fullText.length) - prevChapter.start;
          
          if (rangeLength > 100) {
            // 如果范围足够大，平均分配
            const splitPoint = prevChapter.start + Math.floor(rangeLength / 2);
            prevChapter.end = splitPoint;
            chapters[i].start = splitPoint;
            console.log(`  ✅ 已调整: 前章结束于 ${splitPoint}, 当前章开始于 ${splitPoint}`);
          } else {
            // 范围太小，稍微偏移一下
            chapters[i].start = prevChapter.start + 1;
            console.log(`  ✅ 已微调: 当前章开始于 ${chapters[i].start}`);
          }
        }
        
        // 设置end位置
        if (i < chapters.length - 1) {
          chapters[i].end = chapters[i + 1].start;
        } else {
          chapters[i].end = fullText.length;
        }
      }
      
      console.log('📖 从TOC提取到的章节数:', chapters.length);
      chapters.forEach((ch, idx) => {
        console.log(`  ${idx + 1}. "${ch.title}" [${ch.start} - ${ch.end ?? fullText.length}] (${(ch.end ?? fullText.length) - ch.start} 字)`);
      });

      // 质量评估：若目录项太少或位置重复比例高，则回退为全文识别
      const uniqueStarts = new Set(chapters.map((c) => c.start)).size;
      const duplicateRatio = chapters.length > 0 ? 1 - uniqueStarts / chapters.length : 1;
      const tooFew = chapters.length <= 5; // 章节过少

      if (tooFew || duplicateRatio > 0.3) {
        console.warn(`⚠️ TOC 质量较差：章节数=${chapters.length}，重复比例=${duplicateRatio.toFixed(2)}，尝试使用全文章节识别替代`);
        const autoChapters = extractChapters(fullText);
        if (autoChapters.length >= Math.max(chapters.length + 3, 8)) {
          console.log(`✅ 启用全文识别结果，章节数: ${autoChapters.length}`);
          chapters.length = 0;
          autoChapters.forEach((c) => chapters.push(c));
        } else {
          console.log(`ℹ️ 全文识别章节数(${autoChapters.length})不足以替换TOC，保留TOC结果`);
        }
      }
    } else {
      console.log('⚠️ navigation.toc 不存在或为空');
      console.log('📋 navigation 对象:', navigation);
    }

    // 若 TOC 为空，尝试从文本中提取章节
    if (chapters.length === 0) {
      console.log('⚠ TOC 为空，尝试从文本提取章节...');
      const extractedChapters = extractChapters(fullText);
      
      if (extractedChapters.length > 0) {
        chapters.push(...extractedChapters);
      } else {
        // 最后退化为按 spine 节划分
        sections.forEach((s, i) => {
          chapters.push({ 
            id: `chapter-${i}`, 
            title: `第 ${i + 1} 节`, 
            start: s.start, 
            end: s.end 
          });
        });
      }
    }

    console.log('📖 最终章节数:', chapters.length);

    return {
      id: generateFileId(file.name, file.size),
      type: 'epub',
      title: metadata.title || file.name.replace(/\.epub$/i, ''),
      author: metadata.creator,
      content: fullText.trim(),
      chapters,
      size: file.size,
    };
  } catch (error) {
    console.error('❌ EPUB 解析失败:', error);
    throw new Error(`EPUB 解析失败: ${error instanceof Error ? error.message : '未知错误'}`);
  }
}

// 统一解析入口
export async function parseFile(file: File): Promise<BookSource> {
  const ext = file.name.split('.').pop()?.toLowerCase();
  
  switch (ext) {
    case 'txt':
      return parseTxt(file);
    case 'epub':
      return parseEpub(file);
    case 'pdf':
      throw new Error('PDF 格式暂不支持，请使用 TXT 或 EPUB 格式');
    default:
      throw new Error(`不支持的文件格式: ${ext ? ext.toUpperCase() : '未知'}。请使用 TXT 或 EPUB 格式。`);
  }
}

