import { useEffect, useState, useCallback, useRef } from 'react';
import { TitleBar } from './components/WordShell/TitleBar';
import { Ribbon } from './components/WordShell/Ribbon';
import { StatusBar } from './components/WordShell/StatusBar';
import { ReaderView } from './components/ReaderView/ReaderView';
import { DecoyView } from './components/DecoyView/DecoyView';
import { FileImport } from './components/FileImport/FileImport';
import { TableOfContents } from './components/TableOfContents/TableOfContents';
import { Modal } from './components/Modal/Modal';
import { SettingsModal } from './components/SettingsModal/SettingsModal';
import { useAppStore } from './store/useAppStore';
import { RevealEngine } from './core/reveal-engine';
import { parseFile } from './core/parser';
import { 
  saveBook, 
  getAllBooks, 
  saveProgress, 
  getProgress, 
  saveBookContent, 
  getBookContent,
  deleteBook as deleteBookFromDB,
  getSettings,
  saveSettings,
  defaultSettings,
  cleanupDuplicateBooks
} from './core/storage';
import { getRandomTemplate } from './data/decoy-templates';
import { BookMeta } from './types';
import './App.css';

function App() {
  const {
    viewMode,
    setViewMode,
    currentBook,
    setCurrentBook,
    revealedText,
    setRevealedText,
    appendRevealedText,
    readingIndex,
    setReadingIndex,
    settings,
    setSettings,
    recentBooks,
    setRecentBooks,
    isLoading,
    setLoading,
    fontSize,
    setFontSize,
    fontFamily,
    setFontFamily,
  } = useAppStore();

  const engineRef = useRef<RevealEngine>(new RevealEngine());
  const [decoyContent, setDecoyContent] = useState('');
  const [progress, setProgress] = useState(0);
  const [totalChars, setTotalChars] = useState(0);
  const [isTocOpen, setIsTocOpen] = useState(false);
  const [errorModal, setErrorModal] = useState({ isOpen: false, message: '' });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const keyPressCountRef = useRef(0); // 按键计数器，用于定期保存进度

  // 初始化
  useEffect(() => {
    const init = async () => {
      // 加载设置
      const savedSettings = await getSettings();
      if (savedSettings) {
        // 合并默认设置以确保向后兼容（添加新字段如hotkeys、language）
        const mergedSettings = {
          ...defaultSettings,
          ...savedSettings,
          // 确保hotkeys字段存在
          hotkeys: savedSettings.hotkeys || defaultSettings.hotkeys,
          // 确保language字段存在
          language: savedSettings.language || defaultSettings.language
        };
        setSettings(mergedSettings);
        // 如果设置被更新，保存回数据库
        if (!savedSettings.hotkeys || !savedSettings.language) {
          await saveSettings(mergedSettings);
        }
      } else {
        await saveSettings(defaultSettings);
        setSettings(defaultSettings);
      }

      // 清理重复的书籍记录
      await cleanupDuplicateBooks();

      // 加载最近书籍
      const books = await getAllBooks();
      setRecentBooks(books);
    };

    init();
  }, [setSettings, setRecentBooks]);

  // 更新文档标题
  useEffect(() => {
    if (viewMode === 'reader' || viewMode === 'decoy') {
      document.title = settings.fakeTitle;
    }
  }, [viewMode, settings.fakeTitle]);

  // 保存进度（需要在使用它的useEffect之前定义）
  const saveCurrentProgress = useCallback(async () => {
    if (!currentBook) return;
    
    const index = engineRef.current.getIndex();
    await saveProgress({
      bookId: currentBook.id,
      index: index,
      updatedAt: Date.now(),
    });
  }, [currentBook]);

  // 定时自动保存进度（每30秒）
  useEffect(() => {
    if (!currentBook) return;
    
    const autoSaveInterval = setInterval(() => {
      saveCurrentProgress();
      console.log('⏰ 定时自动保存阅读进度');
    }, 30000); // 30秒

    return () => clearInterval(autoSaveInterval);
  }, [currentBook, saveCurrentProgress]);

  // 页面关闭/刷新前保存进度
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (currentBook) {
        saveCurrentProgress();
        console.log('👋 页面关闭前保存阅读进度');
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [currentBook, saveCurrentProgress]);

  // 处理文件选择
  const handleFileSelect = useCallback(async (file: File) => {
    // 验证文件格式
    const fileName = file.name.toLowerCase();
    const validExtensions = ['.txt', '.epub'];
    const isValidFile = validExtensions.some(ext => fileName.endsWith(ext));
    
    if (!isValidFile) {
      const fileExt = fileName.split('.').pop()?.toUpperCase() || '未知';
      setErrorModal({
        isOpen: true,
        message: `您上传的是 ${fileExt} 格式文件。\n\n📚 本阅读器仅支持以下格式：\n• TXT 文本文件\n• EPUB 电子书\n\n请选择正确的文件格式后重试。`
      });
      return;
    }
    
    setLoading(true, '正在解析文件...');
    
    try {
      const bookSource = await parseFile(file);
      
      console.log('书籍解析成功:', {
        title: bookSource.title,
        type: bookSource.type,
        contentLength: bookSource.content.length,
        preview: bookSource.content.substring(0, 100)
      });
      
      // 检查内容是否为空
      if (!bookSource.content || bookSource.content.trim().length === 0) {
        throw new Error('文件内容为空，请检查文件是否正确');
      }
      
      // 保存书籍元数据
      const bookMeta: BookMeta = {
        id: bookSource.id,
        title: bookSource.title,
        type: bookSource.type,
        size: bookSource.size,
        chapters: bookSource.chapters,
        addedAt: Date.now(),
        lastReadAt: Date.now(),
      };
      
      await saveBook(bookMeta);
      await saveBookContent(bookSource.id, bookSource.content);
      
      // 检查是否有保存的进度
      const savedProgress = await getProgress(bookSource.id);
      const startIndex = savedProgress?.index || 0;
      
      // 初始化引擎
      engineRef.current.init(bookSource.content, startIndex);
      engineRef.current.setConfig(settings.charsPerKey, settings.charsPerSpace);
      
      // 如果有保存的进度，恢复已显露的文本
      if (startIndex > 0) {
        setRevealedText(bookSource.content.slice(0, startIndex));
        setProgress((startIndex / bookSource.content.length) * 100);
        console.log('✅ 恢复上次阅读进度:', startIndex, '/', bookSource.content.length, `(${((startIndex / bookSource.content.length) * 100).toFixed(1)}%)`);
      } else {
        console.log('📖 从头开始阅读');
      }
      
      console.log('引擎初始化完成，准备阅读');
      
      setCurrentBook(bookSource, bookMeta);
      setTotalChars(bookSource.content.length);
      setViewMode('reader');
      
      // 刷新最近书籍列表
      const books = await getAllBooks();
      setRecentBooks(books);
    } catch (error) {
      console.error('文件解析失败:', error);
      alert(error instanceof Error ? error.message : '文件解析失败');
    } finally {
      setLoading(false);
    }
  }, [setCurrentBook, setViewMode, setRecentBooks, setLoading, settings]);

  // 处理书籍选择（从最近列表）
  const handleBookSelect = useCallback(async (book: BookMeta) => {
    setLoading(true, '正在加载书籍...');
    
    try {
      const content = await getBookContent(book.id);
      if (!content) {
        alert('书籍内容已丢失');
        return;
      }
      
      const savedProgress = await getProgress(book.id);
      const startIndex = savedProgress?.index || 0;
      
      // 初始化引擎
      engineRef.current.init(content, startIndex);
      engineRef.current.setConfig(settings.charsPerKey, settings.charsPerSpace);
      
      // 恢复已显露的文本
      if (startIndex > 0) {
        setRevealedText(content.slice(0, startIndex));
        setProgress((startIndex / content.length) * 100);
      }
      
      const bookSource = {
        id: book.id,
        type: book.type,
        title: book.title,
        chapters: book.chapters || [],
        content: content,
        size: book.size,
      };
      
      setCurrentBook(bookSource, book);
      setTotalChars(content.length);
      setViewMode('reader');
      
      // 更新最后阅读时间
      await saveBook({ ...book, lastReadAt: Date.now() });
      const books = await getAllBooks();
      setRecentBooks(books);
    } catch (error) {
      console.error('加载书籍失败:', error);
      alert('加载书籍失败');
    } finally {
      setLoading(false);
    }
  }, [setCurrentBook, setViewMode, setRevealedText, setRecentBooks, setLoading, settings]);

  // 处理书籍删除
  const handleDeleteBook = useCallback(async (bookId: string) => {
    if (!confirm('确定要删除这本书吗？')) return;
    
    try {
      await deleteBookFromDB(bookId);
      const books = await getAllBooks();
      setRecentBooks(books);
    } catch (error) {
      console.error('删除书籍失败:', error);
      alert('删除书籍失败');
    }
  }, [setRecentBooks]);

  // 键盘事件处理
  const handleKeyPress = useCallback((key: string) => {
    console.log('按键触发:', key, '当前模式:', viewMode);
    
    // 安全获取热键配置，如果不存在则使用默认值
    const hotkeys = settings.hotkeys || defaultSettings.hotkeys;
    
    // 切换阅读/伪装模式
    if (key === hotkeys.toggleDecoy) {
      if (viewMode === 'reader') {
        // 切换到伪装文本
        const template = getRandomTemplate();
        setDecoyContent(template.content);
        setViewMode('decoy');
        console.log('切换到伪装模式');
      } else if (viewMode === 'decoy') {
        // 返回阅读
        setViewMode('reader');
        console.log('返回阅读模式');
      }
      return;
    }

    // 只有在阅读模式下才响应其他按键
    if (viewMode !== 'reader') return;

    // 回退
    if (key === hotkeys.recall) {
      engineRef.current.recall(1);
      const newText = engineRef.current.getRevealedText();
      setRevealedText(newText);
      setReadingIndex(engineRef.current.getIndex());
      setProgress(engineRef.current.getProgress());
      return;
    }

    // 快速显露
    if (key === hotkeys.fastReveal) {
      const revealed = engineRef.current.revealSpace();
      if (revealed) {
        appendRevealedText(revealed);
        setReadingIndex(engineRef.current.getIndex());
        setProgress(engineRef.current.getProgress());
        saveCurrentProgress();
      }
      return;
    }

    // 快进
    if (key === hotkeys.skipAhead) {
      const revealed = engineRef.current.reveal(50);
      if (revealed) {
        appendRevealedText(revealed);
        setReadingIndex(engineRef.current.getIndex());
        setProgress(engineRef.current.getProgress());
        saveCurrentProgress();
      }
      return;
    }

    // 其他按键: 正常显露
    if (key.length === 1 || key === 'Process') {
      const revealed = engineRef.current.revealKey();
      console.log('显露字符:', revealed, '当前索引:', engineRef.current.getIndex());
      if (revealed) {
        appendRevealedText(revealed);
        setReadingIndex(engineRef.current.getIndex());
        setProgress(engineRef.current.getProgress());
        
        // 定期保存进度（每50次按键保存一次）
        keyPressCountRef.current += 1;
        if (keyPressCountRef.current >= 50) {
          saveCurrentProgress();
          keyPressCountRef.current = 0;
          console.log('💾 自动保存阅读进度');
        }
      } else {
        console.warn('没有内容可显露，可能已到末尾');
      }
    }
  }, [viewMode, setViewMode, appendRevealedText, setReadingIndex, saveCurrentProgress, settings]);

  // 处理进度条拖动
  const handleProgressChange = useCallback((newProgress: number) => {
    if (!currentBook) return;
    
    const newIndex = Math.floor((newProgress / 100) * currentBook.content.length);
    engineRef.current.jumpTo(newIndex);
    
    const newText = currentBook.content.slice(0, newIndex);
    setRevealedText(newText);
    setReadingIndex(newIndex);
    setProgress(newProgress);
    
    console.log('进度调整到:', newProgress.toFixed(1) + '%', '索引:', newIndex);
    
    // 保存进度
    saveProgress({
      bookId: currentBook.id,
      index: newIndex,
      updatedAt: Date.now(),
    });
  }, [currentBook, setRevealedText, setReadingIndex]);

  // 处理章节点击
  const handleChapterClick = useCallback((chapter: any) => {
    if (!currentBook) return;
    
    const newIndex = chapter.start;
    engineRef.current.jumpTo(newIndex);
    
    const newText = currentBook.content.slice(0, newIndex);
    setRevealedText(newText);
    setReadingIndex(newIndex);
    setProgress((newIndex / currentBook.content.length) * 100);
    
    console.log('跳转到章节:', chapter.title, '索引:', newIndex);
    
    // 保存进度
    saveProgress({
      bookId: currentBook.id,
      index: newIndex,
      updatedAt: Date.now(),
    });
  }, [currentBook, setRevealedText, setReadingIndex]);

  // 处理设置保存
  const handleSaveSettings = useCallback(async (newSettings: any) => {
    setSettings(newSettings);
    await saveSettings(newSettings);
    console.log('⚙️ 设置已保存:', newSettings);
  }, [setSettings]);

  // 计算字数
  const wordCount = typeof revealedText === 'string' ? revealedText.replace(/\s/g, '').length : 0;

  // 如果没有当前书籍，显示导入界面
  if (!currentBook) {
    return (
      <>
        <FileImport
          onFileSelect={handleFileSelect}
          recentBooks={recentBooks}
          onBookSelect={handleBookSelect}
          onDeleteBook={handleDeleteBook}
          onSettingsClick={() => setIsSettingsOpen(true)}
          settings={settings}
        />
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          settings={settings}
          onSave={handleSaveSettings}
        />
      </>
    );
  }

  // 加载中
  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>加载中...</p>
      </div>
    );
  }

  return (
    <div className="app">
      <TitleBar title={settings.fakeTitle} />
      <Ribbon 
        onTocClick={() => setIsTocOpen(true)}
        hasChapters={currentBook?.chapters && currentBook.chapters.length > 0}
        fontSize={fontSize}
        fontFamily={fontFamily}
        onFontSizeChange={setFontSize}
        onFontFamilyChange={setFontFamily}
        onSettingsClick={() => setIsSettingsOpen(true)}
        settings={settings}
      />
      
      {viewMode === 'reader' && (
        <ReaderView 
          content={revealedText} 
          onKeyPress={handleKeyPress}
          fontSize={fontSize}
          fontFamily={fontFamily}
        />
      )}
      
      {viewMode === 'decoy' && (
        <DecoyView 
          content={decoyContent} 
          onKeyPress={handleKeyPress}
          fontSize={fontSize}
          fontFamily={fontFamily}
        />
      )}
      
      <TableOfContents
        chapters={currentBook?.chapters || []}
        currentIndex={readingIndex}
        isOpen={isTocOpen}
        onClose={() => setIsTocOpen(false)}
        onChapterClick={handleChapterClick}
      />
      
      <Modal
        isOpen={errorModal.isOpen}
        onClose={() => setErrorModal({ isOpen: false, message: '' })}
        title="不支持的文件格式"
        message={errorModal.message}
        icon="❌"
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSave={handleSaveSettings}
      />
      
      <StatusBar 
        pageCount={1} 
        wordCount={wordCount}
        progress={progress}
        totalChars={totalChars}
        onProgressChange={handleProgressChange}
        settings={settings}
      />
    </div>
  );
}

export default App;

