import React, { useEffect, useRef } from 'react';
import './ReaderView.css';

interface ReaderViewProps {
  content: string;
  onKeyPress?: (key: string, event: KeyboardEvent) => void;
  fontSize?: number;
  fontFamily?: string;
}

export const ReaderView: React.FC<ReaderViewProps> = ({ 
  content, 
  onKeyPress,
  fontSize = 16,
  fontFamily = 'Calibri'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 防止默认行为
      if (['Enter', 'Backspace', 'Tab', ' '].includes(e.key)) {
        e.preventDefault();
      }
      
      if (onKeyPress) {
        onKeyPress(e.key, e);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onKeyPress]);

  useEffect(() => {
    // 智能滚动：只在用户接近底部时才自动滚动
    if (containerRef.current) {
      const container = containerRef.current;
      const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;
      
      // 只有当用户在底部附近时才自动滚动
      if (isNearBottom) {
        container.scrollTop = container.scrollHeight;
      }
    }
  }, [content]);

  return (
    <div className="reader-view" ref={containerRef}>
      <div className="document-container">
        <div className="document-content">
          <div 
            className="text-content"
            style={{
              fontSize: `${fontSize}px`,
              fontFamily: fontFamily,
              lineHeight: fontSize < 14 ? 1.8 : fontSize > 20 ? 1.4 : 1.6
            }}
          >
            {content}
            <span 
              className="cursor-blink"
              style={{ height: `${fontSize + 4}px` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

