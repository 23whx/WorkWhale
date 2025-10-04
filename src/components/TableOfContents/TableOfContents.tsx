import React from 'react';
import { ChapterIndex } from '@/types';
import './TableOfContents.css';

interface TableOfContentsProps {
  chapters: ChapterIndex[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onChapterClick: (chapter: ChapterIndex) => void;
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({
  chapters,
  currentIndex,
  isOpen,
  onClose,
  onChapterClick,
}) => {
  // 确定当前在哪个章节
  const getCurrentChapter = () => {
    for (let i = 0; i < chapters.length; i++) {
      if (currentIndex >= chapters[i].start && (!chapters[i].end || currentIndex < chapters[i].end!)) {
        return i;
      }
    }
    return -1;
  };

  const currentChapter = getCurrentChapter();

  if (chapters.length === 0) {
    return null;
  }

  return (
    <>
      {isOpen && <div className="toc-overlay" onClick={onClose} />}
      <div className={`table-of-contents ${isOpen ? 'open' : ''}`}>
        <div className="toc-header">
          <h3>📖 目录</h3>
          <button className="toc-close" onClick={onClose} title="关闭目录">
            ×
          </button>
        </div>
        
        <div className="toc-info">
          共 {chapters.length} 章
          {currentChapter >= 0 && (
            <span className="current-chapter-hint">
              · 当前第 {currentChapter + 1} 章
            </span>
          )}
        </div>

        <div className="toc-list">
          {chapters.map((chapter, index) => (
            <div
              key={chapter.id}
              className={`toc-item ${index === currentChapter ? 'active' : ''}`}
              onClick={() => {
                onChapterClick(chapter);
                onClose();
              }}
              title={chapter.title}
            >
              <span className="toc-number">{index + 1}</span>
              <span className="toc-title">{chapter.title}</span>
              {index === currentChapter && (
                <span className="toc-badge">正在阅读</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

