import React, { useEffect } from 'react';
import './DecoyView.css';

interface DecoyViewProps {
  content: string;
  onKeyPress?: (key: string, event: KeyboardEvent) => void;
  fontSize?: number;
  fontFamily?: string;
}

export const DecoyView: React.FC<DecoyViewProps> = ({ 
  content, 
  onKeyPress,
  fontSize = 16,
  fontFamily = 'Calibri'
}) => {
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

  return (
    <div className="decoy-view">
      <div className="document-container">
        <div className="document-content">
          <div 
            className="decoy-content"
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

