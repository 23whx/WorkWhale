import React, { useCallback, useState } from 'react';
import { BookMeta, Settings } from '@/types';
import { useTranslation } from '@/i18n/translations';
import './FileImport.css';

interface FileImportProps {
  onFileSelect: (file: File) => void;
  recentBooks: BookMeta[];
  onBookSelect: (book: BookMeta) => void;
  onDeleteBook: (bookId: string) => void;
  onSettingsClick?: () => void;
  settings: Settings;
}

export const FileImport: React.FC<FileImportProps> = ({ 
  onFileSelect, 
  recentBooks, 
  onBookSelect,
  onDeleteBook,
  onSettingsClick,
  settings
}) => {
  const t = useTranslation(settings.language);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  }, [onFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  }, [onFileSelect]);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    const locale = settings.language === 'zh-CN' ? 'zh-CN' 
      : settings.language === 'en-US' ? 'en-US'
      : settings.language === 'ja-JP' ? 'ja-JP'
      : 'ko-KR';
    
    if (days === 0) {
      return { 'zh-CN': '今天', 'en-US': 'Today', 'ja-JP': '今日', 'ko-KR': '오늘' }[settings.language] || 'Today';
    }
    if (days === 1) {
      return { 'zh-CN': '昨天', 'en-US': 'Yesterday', 'ja-JP': '昨日', 'ko-KR': '어제' }[settings.language] || 'Yesterday';
    }
    if (days < 7) {
      const dayText = { 'zh-CN': '天前', 'en-US': ' days ago', 'ja-JP': '日前', 'ko-KR': '일 전' }[settings.language] || ' days ago';
      return settings.language === 'en-US' || settings.language === 'ko-KR' ? `${days}${dayText}` : `${days}${dayText}`;
    }
    return date.toLocaleDateString(locale);
  };

  return (
    <div className="file-import">
      <div className="import-header">
        <div className="word-logo">W</div>
        <div className="header-content">
          <h1>{t.fileImport.title}</h1>
          <p className="subtitle">{t.fileImport.subtitle}</p>
        </div>
        {onSettingsClick && (
          <button className="settings-btn" onClick={onSettingsClick} title={t.settings.title}>
            ⚙️
          </button>
        )}
      </div>

      <div 
        className={`drop-zone ${dragActive ? 'active' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="drop-icon">📁</div>
        <p className="drop-text">{t.fileImport.dragDrop}</p>
        <p className="drop-subtext">{t.fileImport.or}</p>
        <label className="file-select-btn">
          {t.fileImport.selectFile}
          <input 
            type="file" 
            accept=".txt,.epub" 
            onChange={handleFileInput}
            style={{ display: 'none' }}
          />
        </label>
        <p className="supported-formats">{t.fileImport.supportedFormats}: TXT、EPUB</p>
      </div>

      {recentBooks.length > 0 && (
        <div className="recent-books">
          <h2>{t.fileImport.recentBooks}</h2>
          <div className="books-list">
            {recentBooks.map((book) => (
              <div 
                key={book.id} 
                className="book-item"
                onClick={() => onBookSelect(book)}
              >
                <div className="book-icon">📖</div>
                <div className="book-info">
                  <div className="book-title">{book.title}</div>
                  <div className="book-meta">
                    <span>{book.type.toUpperCase()}</span>
                    <span>•</span>
                    <span>{formatFileSize(book.size)}</span>
                    <span>•</span>
                    <span>{formatDate(book.lastReadAt || book.addedAt)}</span>
                  </div>
                </div>
                <button 
                  className="book-delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteBook(book.id);
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <footer className="import-footer">
        <div className="tips">
          <h3>{t.fileImport.usageGuide}</h3>
          <ul>
            <li>{t.fileImport.tip1}</li>
            <li>{t.fileImport.tip2}</li>
            <li>{t.fileImport.tip3}</li>
            <li>{t.fileImport.tip4}</li>
            <li>{t.fileImport.tip5}</li>
          </ul>
        </div>
        
        <div className="contact-info">
          <a href="mailto:wanghongxiang23@gmail.com" title="Contact">✉️</a>
        </div>
      </footer>
    </div>
  );
};

