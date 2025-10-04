const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const iconPath = path.join(__dirname, 'public', 'icon.png');

// 需要生成的尺寸
const sizes = [
  { size: 192, name: 'icon-192' },
  { size: 512, name: 'icon-512' },
  { size: 180, name: 'apple-touch-icon' }, // iOS
  { size: 32, name: 'favicon-32x32' },
  { size: 16, name: 'favicon-16x16' }
];

console.log('🎨 开始生成不同尺寸的图标...\n');

Promise.all(
  sizes.map(({ size, name }) => {
    const pngPath = path.join(__dirname, 'public', `${name}.png`);
    const webpPath = path.join(__dirname, 'public', `${name}.webp`);
    
    return Promise.all([
      // 生成 PNG
      sharp(iconPath)
        .resize(size, size)
        .png()
        .toFile(pngPath)
        .then(() => {
          const fileSize = fs.statSync(pngPath).size;
          console.log(`✅ ${name}.png (${size}x${size}) - ${(fileSize / 1024).toFixed(1)} KB`);
        }),
      
      // 生成 WebP
      sharp(iconPath)
        .resize(size, size)
        .webp({ quality: 90 })
        .toFile(webpPath)
        .then(() => {
          const fileSize = fs.statSync(webpPath).size;
          console.log(`✅ ${name}.webp (${size}x${size}) - ${(fileSize / 1024).toFixed(1)} KB`);
        })
    ]);
  })
)
.then(() => {
  console.log('\n🎉 所有图标生成完成！');
  // 清理脚本自身
  fs.unlinkSync(__filename);
})
.catch(err => {
  console.error('❌ 生成图标失败:', err);
  fs.unlinkSync(__filename);
});

