// 简化的 EPUB 解析器（备用方案）
import JSZip from 'jszip';

export async function parseEpubSimple(file: File): Promise<string> {
  try {
    const zip = new JSZip();
    const contents = await zip.loadAsync(file);
    
    let fullText = '';
    const htmlFiles: string[] = [];
    
    // 找到所有 HTML/XHTML 文件
    contents.forEach((relativePath, file) => {
      if (relativePath.match(/\.(x?html?)$/i) && !file.dir) {
        htmlFiles.push(relativePath);
      }
    });
    
    console.log('找到 HTML 文件:', htmlFiles.length);
    
    // 按顺序读取文件
    htmlFiles.sort();
    
    for (const htmlFile of htmlFiles) {
      try {
        const content = await contents.file(htmlFile)?.async('string');
        if (content) {
          // 简单的 HTML 标签移除
          const text = content
            .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
            .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
            .replace(/<[^>]+>/g, ' ')
            .replace(/&nbsp;/g, ' ')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&amp;/g, '&')
            .replace(/&quot;/g, '"')
            .replace(/\s+/g, ' ')
            .trim();
          
          if (text.length > 0) {
            fullText += text + '\n\n';
          }
        }
      } catch (e) {
        console.warn('读取文件失败:', htmlFile);
      }
    }
    
    return fullText.trim();
  } catch (error) {
    console.error('简单 EPUB 解析失败:', error);
    throw error;
  }
}

