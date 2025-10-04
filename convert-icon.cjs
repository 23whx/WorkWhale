const fs = require('fs');
const path = require('path');

// 简单的图像转换脚本
const iconPath = path.join(__dirname, 'public', 'icon.png');
const webpPath = path.join(__dirname, 'public', 'icon.webp');

// 检查 icon.png 是否存在
if (fs.existsSync(iconPath)) {
  console.log('✅ icon.png 存在');
  
  // 尝试使用 sharp 转换
  try {
    const sharp = require('sharp');
    
    sharp(iconPath)
      .webp({ quality: 90 })
      .toFile(webpPath)
      .then(() => {
        console.log('✅ 成功转换为 WebP 格式');
        console.log('📦 输出文件: public/icon.webp');
        
        // 获取文件大小对比
        const pngSize = fs.statSync(iconPath).size;
        const webpSize = fs.statSync(webpPath).size;
        const savings = ((1 - webpSize / pngSize) * 100).toFixed(1);
        console.log(`📊 PNG: ${(pngSize / 1024).toFixed(1)} KB → WebP: ${(webpSize / 1024).toFixed(1)} KB (节省 ${savings}%)`);
        
        // 清理脚本自身
        fs.unlinkSync(__filename);
      })
      .catch(err => {
        console.log('⚠️ Sharp 转换失败:', err.message);
        // 清理脚本自身
        fs.unlinkSync(__filename);
      });
  } catch (err) {
    console.log('⚠️ Sharp 加载失败:', err.message);
    // 清理脚本自身
    fs.unlinkSync(__filename);
  }
} else {
  console.log('❌ icon.png 不存在');
  fs.unlinkSync(__filename);
}
