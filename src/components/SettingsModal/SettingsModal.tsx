import React, { useState, useEffect } from 'react';
import { Settings, Hotkeys, Language } from '@/types';
import { useTranslation } from '@/i18n/translations';
import './SettingsModal.css';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: Settings;
  onSave: (settings: Settings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSave,
}) => {
  const t = useTranslation(settings.language);
  const [language, setLanguage] = useState<Language>(settings.language);
  const [hotkeys, setHotkeys] = useState<Hotkeys>(settings.hotkeys);
  const [editingKey, setEditingKey] = useState<keyof Hotkeys | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setHotkeys(settings.hotkeys);
    setLanguage(settings.language);
  }, [settings]);

  useEffect(() => {
    if (!isOpen) {
      setEditingKey(null);
      setErrorMessage('');
    }
  }, [isOpen]);

  const handleKeyCapture = (e: React.KeyboardEvent, field: keyof Hotkeys) => {
    e.preventDefault();
    e.stopPropagation();
    
    let keyValue = e.key;
    
    // 处理特殊键
    if (keyValue === ' ') {
      keyValue = ' '; // Space
    }
    
    // 检查是否与其他热键冲突
    const existingKeys = Object.entries(hotkeys).filter(([k]) => k !== field);
    const isDuplicate = existingKeys.some(([_, v]) => v === keyValue);
    
    if (isDuplicate) {
      setErrorMessage(`热键 "${keyValue === ' ' ? 'Space' : keyValue}" 已被占用，请选择其他键`);
      return;
    }
    
    // 更新热键
    setHotkeys(prev => ({
      ...prev,
      [field]: keyValue,
    }));
    
    setEditingKey(null);
    setErrorMessage('');
  };

  const handleSave = () => {
    const newSettings: Settings = {
      ...settings,
      hotkeys: hotkeys,
      language: language,
    };
    onSave(newSettings);
    onClose();
  };

  const handleReset = () => {
    setHotkeys({
      toggleDecoy: 'Enter',
      recall: 'Backspace',
      fastReveal: ' ',
      skipAhead: 'Tab',
    });
    setErrorMessage('');
  };

  const displayKey = (key: string): string => {
    if (key === ' ') return 'Space';
    if (key === 'Enter') return 'Enter';
    if (key === 'Backspace') return 'Backspace';
    if (key === 'Tab') return 'Tab';
    return key;
  };

  const getKeyDescription = (field: keyof Hotkeys): string => {
    const descriptions: Record<keyof Hotkeys, string> = {
      toggleDecoy: '切换阅读/伪装模式',
      recall: '回退已显示的内容',
      fastReveal: '快速显示4个字符',
      skipAhead: '快进50个字符',
    };
    return descriptions[field];
  };

  if (!isOpen) return null;

  return (
    <div className="settings-modal-overlay" onClick={onClose}>
      <div className="settings-modal-content" onClick={e => e.stopPropagation()}>
        <div className="settings-modal-header">
          <h2>⚙️ {t.settings.title}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="settings-modal-body">
          {/* 语言设置 */}
          <div className="settings-section">
            <h3>🌐 {t.settings.language}</h3>
            <div className="language-selector">
              {(['zh-CN', 'en-US', 'ja-JP', 'ko-KR'] as Language[]).map((lang) => (
                <button
                  key={lang}
                  className={`language-btn ${language === lang ? 'active' : ''}`}
                  onClick={() => setLanguage(lang)}
                >
                  {t.settings.languageLabel[lang]}
                </button>
              ))}
            </div>
          </div>

          {/* 热键设置 */}
          <div className="settings-section">
            <h3>⌨️ {t.settings.hotkeys}</h3>
            <p className="settings-hint">{t.settings.clickToChange}</p>

            {errorMessage && (
              <div className="error-message">{errorMessage}</div>
            )}

            <div className="hotkey-list">
              {(Object.keys(hotkeys) as Array<keyof Hotkeys>).map((field) => (
                <div key={field} className="hotkey-item">
                  <div className="hotkey-info">
                    <div className="hotkey-label">
                      {field === 'toggleDecoy' && `🔄 ${t.settings.hotkeyLabels.toggleDecoy}`}
                      {field === 'recall' && `↩️ ${t.settings.hotkeyLabels.recall}`}
                      {field === 'fastReveal' && `⚡ ${t.settings.hotkeyLabels.fastReveal}`}
                      {field === 'skipAhead' && `⏩ ${t.settings.hotkeyLabels.skipAhead}`}
                    </div>
                    <div className="hotkey-description">
                      {getKeyDescription(field)}
                    </div>
                  </div>
                  <button
                    className={`hotkey-button ${editingKey === field ? 'editing' : ''}`}
                    onClick={() => setEditingKey(field)}
                    onKeyDown={(e) => {
                      if (editingKey === field) {
                        handleKeyCapture(e, field);
                      }
                    }}
                    tabIndex={0}
                  >
                    {editingKey === field ? t.settings.pressKey : displayKey(hotkeys[field])}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="settings-modal-footer">
          <button className="btn-secondary" onClick={handleReset}>
            {t.settings.resetToDefault}
          </button>
          <div className="btn-group">
            <button className="btn-secondary" onClick={onClose}>
              {t.common.cancel}
            </button>
            <button className="btn-primary" onClick={handleSave}>
              {t.common.save}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

