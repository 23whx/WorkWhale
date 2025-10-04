import React from 'react';
import { Settings } from '@/types';
import { useTranslation } from '@/i18n/translations';
import './Ribbon.css';

interface RibbonProps {
  onTocClick?: () => void;
  hasChapters?: boolean;
  fontSize?: number;
  fontFamily?: string;
  onFontSizeChange?: (size: number) => void;
  onFontFamilyChange?: (family: string) => void;
  onSettingsClick?: () => void;
  settings: Settings;
}

export const Ribbon: React.FC<RibbonProps> = ({ 
  onTocClick, 
  hasChapters = false,
  fontSize = 16,
  fontFamily = 'Calibri',
  onFontSizeChange,
  onFontFamilyChange,
  onSettingsClick,
  settings
}) => {
  const t = useTranslation(settings.language);
  const fontSizes = [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72];
  const fontFamilies = [
    'Calibri',
    'Arial',
    'Times New Roman',
    'Georgia',
    'Verdana',
    'Comic Sans MS',
    '宋体',
    '微软雅黑',
    '黑体',
    '楷体'
  ];

  return (
    <div className="ribbon">
      <div className="ribbon-tabs">
        <div className="ribbon-tab file-tab">{t.ribbon.file}</div>
        <div className="ribbon-tab active">{t.ribbon.home}</div>
        <div className="ribbon-tab">{t.ribbon.insert}</div>
        <div className="ribbon-tab">{t.ribbon.design}</div>
        <div className="ribbon-tab">{t.ribbon.layout}</div>
        <div className="ribbon-tab">{t.ribbon.references}</div>
        <div className="ribbon-tab">{t.ribbon.mailings}</div>
        <div className="ribbon-tab">{t.ribbon.review}</div>
        <div className="ribbon-tab">{t.ribbon.view}</div>
        <div className="ribbon-tab help-tab">{t.ribbon.help}</div>
      </div>
      <div className="ribbon-content">
        {/* 剪贴板组 */}
        <div className="ribbon-group">
          <div className="ribbon-group-header">{t.ribbon.clipboard}</div>
          <div className="ribbon-buttons clipboard-group">
            <button className="ribbon-btn-large" title="粘贴">
              <span className="btn-icon">📋</span>
              <span className="btn-label">粘贴</span>
            </button>
            <div className="ribbon-btn-column">
              <button className="ribbon-btn-small" title="剪切">✂️</button>
              <button className="ribbon-btn-small" title="复制">📄</button>
              <button className="ribbon-btn-small" title="格式刷">🖌️</button>
            </div>
          </div>
        </div>

        {/* 字体组 */}
        <div className="ribbon-group ribbon-group-wide">
          <div className="ribbon-group-header">{t.ribbon.font}</div>
          <div className="ribbon-buttons ribbon-font-controls">
            <div className="font-row">
              <select 
                className="ribbon-select"
                value={fontFamily}
                onChange={(e) => onFontFamilyChange?.(e.target.value)}
                title="字体"
              >
                {fontFamilies.map(font => (
                  <option key={font} value={font} style={{ fontFamily: font }}>
                    {font}
                  </option>
                ))}
              </select>
              <select 
                className="ribbon-select-size"
                value={fontSize}
                onChange={(e) => onFontSizeChange?.(Number(e.target.value))}
                title="字号"
              >
                {fontSizes.map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
              <button className="ribbon-btn-tiny" title="增大字号" onClick={() => {
                const currentIndex = fontSizes.indexOf(fontSize);
                if (currentIndex < fontSizes.length - 1) {
                  onFontSizeChange?.(fontSizes[currentIndex + 1]);
                }
              }}>
                <span style={{ fontSize: '10px' }}>▲</span>
              </button>
              <button className="ribbon-btn-tiny" title="减小字号" onClick={() => {
                const currentIndex = fontSizes.indexOf(fontSize);
                if (currentIndex > 0) {
                  onFontSizeChange?.(fontSizes[currentIndex - 1]);
                }
              }}>
                <span style={{ fontSize: '10px' }}>▼</span>
              </button>
            </div>
            <div className="font-row">
              <button className="ribbon-btn-icon" title="加粗"><b>B</b></button>
              <button className="ribbon-btn-icon" title="倾斜"><i>I</i></button>
              <button className="ribbon-btn-icon" title="下划线"><u>U</u></button>
              <button className="ribbon-btn-icon" title="删除线"><s>abc</s></button>
              <button className="ribbon-btn-icon" title="下标">x₂</button>
              <button className="ribbon-btn-icon" title="上标">x²</button>
              <button className="ribbon-btn-icon" title="文本效果" style={{ fontWeight: 'bold', color: '#2b579a' }}>A</button>
              <button className="ribbon-btn-icon" title="突出显示" style={{ background: '#ffff00', padding: '2px' }}>ab</button>
              <button className="ribbon-btn-icon" title="字体颜色" style={{ color: '#ff0000' }}>A</button>
            </div>
          </div>
        </div>

        {/* 段落组 */}
        <div className="ribbon-group">
          <div className="ribbon-group-header">{t.ribbon.paragraph}</div>
          <div className="ribbon-buttons paragraph-group">
            <div className="paragraph-row">
              <button className="ribbon-btn-icon" title="项目符号">•</button>
              <button className="ribbon-btn-icon" title="编号">1.</button>
              <button className="ribbon-btn-icon" title="多级列表">≡</button>
              <button className="ribbon-btn-icon" title="减少缩进">◄</button>
              <button className="ribbon-btn-icon" title="增加缩进">►</button>
              <button className="ribbon-btn-icon" title="排序">↕</button>
              <button className="ribbon-btn-icon" title="显示段落标记">¶</button>
            </div>
            <div className="paragraph-row">
              <button className="ribbon-btn-icon" title="左对齐">≡</button>
              <button className="ribbon-btn-icon" title="居中">☰</button>
              <button className="ribbon-btn-icon" title="右对齐">≣</button>
              <button className="ribbon-btn-icon" title="两端对齐">▭</button>
              <button className="ribbon-btn-icon" title="行距">↕</button>
              <button className="ribbon-btn-icon" title="底纹">▦</button>
              <button className="ribbon-btn-icon" title="边框">▢</button>
            </div>
          </div>
        </div>

        {/* 样式组 */}
        <div className="ribbon-group ribbon-group-styles">
          <div className="ribbon-group-header">{t.ribbon.styles}</div>
          <div className="ribbon-buttons styles-group">
            <button className="style-btn" title="正文">
              <span style={{ fontSize: '11px' }}>AaBbCcDd</span>
              <span className="style-label">正文</span>
            </button>
            <button className="style-btn" title="无格式">
              <span style={{ fontSize: '11px' }}>AaBbCcDd</span>
              <span className="style-label">无格式</span>
            </button>
            <button className="style-btn" title="标题 1">
              <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#2e5090' }}>AaBbCcDd</span>
              <span className="style-label">标题 1</span>
            </button>
            <button className="style-btn" title="标题 2">
              <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#2e5090' }}>AaBbCcDd</span>
              <span className="style-label">标题 2</span>
            </button>
            <button className="style-btn" title="标题">
              <span style={{ fontSize: '16px', fontWeight: 'bold' }}>AaBbCcDd</span>
              <span className="style-label">标题</span>
            </button>
            <button className="style-btn" title="副标题">
              <span style={{ fontSize: '12px', color: '#595959' }}>AaBbCcDd</span>
              <span className="style-label">副标题</span>
            </button>
          </div>
        </div>

        {/* 编辑组 */}
        <div className="ribbon-group">
          <div className="ribbon-group-header">{t.ribbon.editing}</div>
          <div className="ribbon-buttons">
            <button className="ribbon-btn-small" title="查找">🔍 查找</button>
            <button className="ribbon-btn-small" title="替换">🔄 替换</button>
            <button className="ribbon-btn-small" title="选择">☰ 选择</button>
          </div>
        </div>

        {/* 导航组 */}
        <div className="ribbon-group">
          <div className="ribbon-group-header">{t.ribbon.navigation}</div>
          <div className="ribbon-buttons">
            <button 
              className={`ribbon-btn ${!hasChapters ? 'disabled' : ''}`}
              onClick={hasChapters ? onTocClick : undefined}
              title={hasChapters ? t.toc.title : t.toc.noChapters}
            >
              <span className="btn-icon">📚</span>
              <span className="btn-label">{t.ribbon.toc}</span>
            </button>
          </div>
        </div>

        {/* 设置组 */}
        <div className="ribbon-group">
          <div className="ribbon-group-header">{t.common.settings}</div>
          <div className="ribbon-buttons">
            <button 
              className="ribbon-btn" 
              onClick={onSettingsClick}
              title={t.ribbon.hotkeySettings}
            >
              <span className="btn-icon">⚙️</span>
              <span className="btn-label">{t.ribbon.hotkeySettings}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

