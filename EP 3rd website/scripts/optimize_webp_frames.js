import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const framesDir = path.resolve('public/earth-frames');
const files = fs.readdirSync(framesDir).filter(f => f.endsWith('.webp')).sort();

console.log(`Inspecting ${files.length} frames in ${framesDir}`);

let currentTotalBytes = 0;
files.forEach(f => currentTotalBytes += fs.statSync(path.join(framesDir, f)).size);
console.log(`Current Total Sequence Size: ${(currentTotalBytes / (1024 * 1024)).toFixed(2)} MB`);

// Optimize compression with sharp (quality: 85, effort: 6)
let newTotalBytes = 0;
for (let i = 0; i < files.length; i++) {
  const filePath = path.join(framesDir, files[i]);
  const buffer = fs.readFileSync(filePath);
  
  const optimizedBuffer = await sharp(buffer)
    .webp({ quality: 85, effort: 6 })
    .toBuffer();

  fs.writeFileSync(filePath, optimizedBuffer);
  newTotalBytes += optimizedBuffer.length;
}

console.log(`Optimized Total Sequence Size: ${(newTotalBytes / (1024 * 1024)).toFixed(2)} MB`);
console.log(`Reduction: ${(((currentTotalBytes - newTotalBytes) / currentTotalBytes) * 100).toFixed(1)}% lighter!`);
