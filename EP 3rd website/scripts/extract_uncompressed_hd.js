import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
import ffmpegPath from 'ffmpeg-static';
import sharp from 'sharp';

const videoPath = path.resolve('public/Create_a_seamless_ultra_reali.mp4');
const tempPngDir = path.resolve('temp_hd_png');
const outputWebpDir = path.resolve('public/earth-frames');

console.log('Video Path:', videoPath);
console.log('FFmpeg Executable Path:', ffmpegPath);

if (!fs.existsSync(tempPngDir)) {
  fs.mkdirSync(tempPngDir, { recursive: true });
}
if (!fs.existsSync(outputWebpDir)) {
  fs.mkdirSync(outputWebpDir, { recursive: true });
}

// 1. Inspect Video Metadata
console.log('--- Inspecting Video Metadata ---');
try {
  const infoOutput = execFileSync(ffmpegPath, ['-i', videoPath], { encoding: 'utf8', stdio: 'pipe' });
  console.log(infoOutput);
} catch (err) {
  if (err.stderr) {
    const lines = err.stderr.split('\n').filter(l => l.includes('Stream') || l.includes('Duration'));
    console.log(lines.join('\n'));
  }
}

// 2. Extract ~120 HD PNG frames directly from video
console.log('--- Extracting 120 Full-Resolution PNG Frames ---');
fs.readdirSync(tempPngDir).forEach(f => fs.unlinkSync(path.join(tempPngDir, f)));

const ffmpegArgs = [
  '-i', videoPath,
  '-vf', "select='not(mod(n,2))'",
  '-vframes', '120',
  '-vsync', 'vfr',
  path.join(tempPngDir, 'frame_%03d.png')
];

execFileSync(ffmpegPath, ffmpegArgs, { stdio: 'inherit' });

const pngFiles = fs.readdirSync(tempPngDir).filter(f => f.endsWith('.png')).sort();
console.log(`Extracted ${pngFiles.length} raw PNG frames.`);

// 3. Clear public/earth-frames and convert PNGs to High-Quality WebP
console.log('--- Converting PNGs to High-Quality WebP ---');
fs.readdirSync(outputWebpDir).forEach(f => fs.unlinkSync(path.join(outputWebpDir, f)));

let totalBytes = 0;
let sampleWidth = 0;
let sampleHeight = 0;

for (let i = 0; i < pngFiles.length; i++) {
  const pngFile = pngFiles[i];
  const frameIndex = String(i + 1).padStart(3, '0');
  const inputPath = path.join(tempPngDir, pngFile);
  const outputPath = path.join(outputWebpDir, `frame_${frameIndex}.webp`);

  const metadata = await sharp(inputPath).metadata();
  if (i === 0) {
    sampleWidth = metadata.width;
    sampleHeight = metadata.height;
  }

  // Encode with high quality WebP settings (quality: 90, effort: 6) preserving exact video resolution
  await sharp(inputPath)
    .webp({ quality: 90, effort: 6 })
    .toFile(outputPath);

  const stat = fs.statSync(outputPath);
  totalBytes += stat.size;

  if ((i + 1) % 30 === 0 || i === pngFiles.length - 1) {
    console.log(`Converted ${i + 1}/${pngFiles.length} high-quality WebP frames...`);
  }
}

const avgSizeBytes = Math.round(totalBytes / pngFiles.length);

console.log('\n=============================================');
console.log('🎉 HD FRAME EXTRACTION COMPLETE!');
console.log(`Total Frames Generated: ${pngFiles.length}`);
console.log(`Frame Resolution: ${sampleWidth} x ${sampleHeight} px (Original Native Video Resolution)`);
console.log(`Total Sequence Size: ${(totalBytes / (1024 * 1024)).toFixed(2)} MB`);
console.log(`Average Frame Size: ${(avgSizeBytes / 1024).toFixed(2)} KB`);
console.log('=============================================\n');
