import React from 'react';
import './TitleBar.css';

interface TitleBarProps {
  title?: string;
}

export const TitleBar: React.FC<TitleBarProps> = ({ title = 'Document1 - Microsoft Word' }) => {
  return (
    <div className="title-bar">
      <div className="title-bar-left">
        <div className="word-icon">W</div>
        <span className="title-text">{title}</span>
      </div>
      <div className="title-bar-controls">
        <button className="title-btn minimize">−</button>
        <button className="title-btn maximize">□</button>
        <button className="title-btn close">×</button>
      </div>
    </div>
  );
};

