import React, { useEffect, useRef } from 'react';
import './AdSense.css';

interface AdSenseProps {
  adSlot: string;
  adFormat?: 'auto' | 'fluid' | 'rectangle' | 'vertical' | 'horizontal';
  adLayout?: string;
  adStyle?: React.CSSProperties;
  className?: string;
}

/**
 * Google AdSense 广告组件
 * 
 * 使用方法：
 * 1. 在 index.html 中已添加 AdSense 脚本
 * 2. 替换 index.html 中的 ca-pub-XXXXXXXXXXXXXXXX 为您的发布商ID
 * 3. 替换下方 adSlot 为您的广告单元ID
 * 
 * @example
 * <AdSense adSlot="1234567890" adFormat="auto" />
 */
export const AdSense: React.FC<AdSenseProps> = ({
  adSlot,
  adFormat = 'auto',
  adLayout,
  adStyle = { display: 'block' },
  className = '',
}) => {
  const adRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    try {
      // 确保 adsbygoogle 已加载
      if (window.adsbygoogle && adRef.current) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (error) {
      console.error('AdSense加载失败:', error);
    }
  }, []);

  return (
    <div className={`adsense-container ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={adStyle}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" // 替换为您的发布商ID
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-ad-layout={adLayout}
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
};

// TypeScript 声明
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

