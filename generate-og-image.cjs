const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const iconPath = path.join(__dirname, 'public', 'icon.png');
const ogImagePath = path.join(__dirname, 'public', 'og-image.png');

console.log('🎨 开始生成 Open Graph 分享图片...\n');

// 先将图标调整为合适的大小（500x500）
sharp(iconPath)
  .resize(500, 500, {
    fit: 'contain',
    background: { r: 0, g: 0, b: 0, alpha: 0 }
  })
  .toBuffer()
  .then(iconBuffer => {
    // 创建 1200x630 的背景并居中放置图标
    return sharp({
      create: {
        width: 1200,
        height: 630,
        channels: 4,
        background: { r: 245, g: 247, b: 250, alpha: 1 } // 浅灰色背景
      }
    })
    .composite([
      {
        input: iconBuffer,
        gravity: 'center'
      }
    ])
    .png()
    .toFile(ogImagePath);
  })
  .then(() => {
    const ogSize = fs.statSync(ogImagePath).size;
    console.log(`✅ og-image.png 生成完成 (1200x630) - ${(ogSize / 1024).toFixed(1)} KB`);
    
    // 同时生成 twitter-image.png (和 og-image 一样)
    const twitterImagePath = path.join(__dirname, 'public', 'twitter-image.png');
    fs.copyFileSync(ogImagePath, twitterImagePath);
    console.log(`✅ twitter-image.png 生成完成`);
    
    console.log('\n🎉 所有分享图片生成完成！');
    
    // 清理脚本自身
    fs.unlinkSync(__filename);
  })
  .catch(err => {
    console.error('❌ 生成失败:', err);
    fs.unlinkSync(__filename);
  });

