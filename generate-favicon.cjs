const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const iconPath = path.join(__dirname, 'public', 'icon.png');
const faviconPath = path.join(__dirname, 'public', 'favicon.ico');
const ogImagePath = path.join(__dirname, 'public', 'og-image.png');

console.log('🎨 开始生成 favicon.ico 和 og-image.png...\n');

// 生成多种尺寸的 favicon 图标
// ICO 文件通常包含 16x16, 32x32, 48x48 三种尺寸
const faviconSizes = [16, 32, 48];
const faviconBuffers = [];

Promise.all(
  faviconSizes.map(size => 
    sharp(iconPath)
      .resize(size, size)
      .png()
      .toBuffer()
      .then(buffer => {
        console.log(`✅ 生成 ${size}x${size} favicon 尺寸`);
        return buffer;
      })
  )
)
.then(buffers => {
  faviconBuffers.push(...buffers);
  
  // 生成 favicon.ico (使用 32x32 作为主图标)
  return sharp(iconPath)
    .resize(32, 32)
    .toFormat('png')
    .toFile(faviconPath.replace('.ico', '-temp.png'));
})
.then(() => {
  // 将 PNG 重命名为 ICO（简化方案，直接使用 32x32 PNG）
  // 注：真正的 ICO 需要特殊库，但现代浏览器也支持 PNG 格式的 .ico 文件
  const tempPath = faviconPath.replace('.ico', '-temp.png');
  
  // 使用 32x32 PNG 作为 favicon.ico
  sharp(iconPath)
    .resize(32, 32)
    .png()
    .toFile(faviconPath)
    .then(() => {
      console.log('✅ favicon.ico 生成完成 (32x32)');
      // 清理临时文件
      if (fs.existsSync(tempPath)) {
        fs.unlinkSync(tempPath);
      }
    });
})
.then(() => {
  // 生成 Open Graph 图片 (1200x630 是标准尺寸)
  // 使用白色背景 + 居中的图标
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
      input: iconPath,
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
  
  console.log('\n🎉 所有图标和分享图片生成完成！');
  console.log('\n📋 生成的文件：');
  console.log('  - public/favicon.ico (32x32, PNG 格式)');
  console.log('  - public/og-image.png (1200x630, 用于社交分享)');
  console.log('  - public/twitter-image.png (1200x630, Twitter 分享)');
  
  // 清理脚本自身
  fs.unlinkSync(__filename);
})
.catch(err => {
  console.error('❌ 生成失败:', err);
  fs.unlinkSync(__filename);
});

