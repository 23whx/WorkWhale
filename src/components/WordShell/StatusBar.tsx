import React, { useState } from 'react';
import { Settings } from '@/types';
import { useTranslation } from '@/i18n/translations';
import './StatusBar.css';

interface StatusBarProps {
  pageCount?: number;
  wordCount?: number;
  progress?: number;
  totalChars?: number;
  onProgressChange?: (progress: number) => void;
  settings: Settings;
}

export const StatusBar: React.FC<StatusBarProps> = ({ 
  wordCount = 0,
  progress = 0,
  totalChars = 0,
  onProgressChange,
  settings
}) => {
  const t = useTranslation(settings.language);
  const [isDragging, setIsDragging] = useState(false);

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = parseFloat(e.target.value);
    if (onProgressChange) {
      onProgressChange(newProgress);
    }
  };

  const handleJumpBackward = () => {
    const newProgress = Math.max(0, progress - 5);
    if (onProgressChange) {
      onProgressChange(newProgress);
    }
  };

  const handleJumpForward = () => {
    const newProgress = Math.min(100, progress + 5);
    if (onProgressChange) {
      onProgressChange(newProgress);
    }
  };

  return (
    <div className="status-bar">
      <div className="status-left">
        <span className="status-item">{t.statusBar.read} {wordCount} {t.statusBar.words}</span>
        <span className="status-separator">|</span>
        <span className="status-item">{t.statusBar.total} {totalChars} {t.statusBar.words}</span>
        <span className="status-separator">|</span>
        <span className="status-item">{t.statusBar.progress}: {progress.toFixed(1)}%</span>
      </div>
      <div className="status-right">
        <span className="progress-label">📖 {t.statusBar.readingProgress}</span>
        <button 
          className="progress-btn" 
          onClick={handleJumpBackward}
          title={t.statusBar.backward}
        >
          ◀
        </button>
        <div className={`progress-slider ${isDragging ? 'dragging' : ''}`}>
          <input 
            type="range" 
            min="0" 
            max="100" 
            step="0.1"
            value={progress}
            onChange={handleProgressChange}
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            title={`${t.statusBar.dragToAdjust} (${progress.toFixed(1)}%)`}
          />
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <button 
          className="progress-btn" 
          onClick={handleJumpForward}
          title={t.statusBar.forward}
        >
          ▶
        </button>
      </div>
    </div>
  );
};

