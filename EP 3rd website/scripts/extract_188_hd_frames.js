import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
import ffmpegPath from 'ffmpeg-static';
import sharp from 'sharp';

const videoPath = path.resolve('create_now.mp4');
const backupDir = path.resolve('public/earth-frames-backup-120');
const currentFramesDir = path.resolve('public/earth-frames');
const tempPngDir = path.resolve('temp_180_hd_png');

console.log('Video Path:', videoPath);
console.log('FFmpeg Executable Path:', ffmpegPath);

// Step A: Backup existing 120 frames if backup does not exist yet
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
  if (fs.existsSync(currentFramesDir)) {
    const existing = fs.readdirSync(currentFramesDir);
    existing.forEach(f => fs.copyFileSync(path.join(currentFramesDir, f), path.join(backupDir, f)));
    console.log(`Backed up ${existing.length} previous frames to ${backupDir}`);
  }
}

if (!fs.existsSync(tempPngDir)) {
  fs.mkdirSync(tempPngDir, { recursive: true });
}

// Step B: Extract 180 raw lossless PNG frames from create_now.mp4
console.log('--- Extracting 180 Lossless PNG Frames ---');
fs.readdirSync(tempPngDir).forEach(f => fs.unlinkSync(path.join(tempPngDir, f)));

// 240 total frames in 10s @ 24fps -> select 180 evenly distributed frames
// Using fps filter or select filter for 180 frames: -vf "fps=18" or select
const ffmpegArgs = [
  '-i', videoPath,
  '-vf', 'fps=18',
  '-vframes', '180',
  path.join(tempPngDir, 'frame_%03d.png')
];

execFileSync(ffmpegPath, ffmpegArgs, { stdio: 'inherit' });

const pngFiles = fs.readdirSync(tempPngDir).filter(f => f.endsWith('.png')).sort();
console.log(`Extracted ${pngFiles.length} raw PNG frames.`);

// Step C: Convert PNGs to High-Quality WebP (Q=92, effort=6)
console.log('--- Converting PNGs to High-Quality WebP ---');
if (!fs.existsSync(currentFramesDir)) {
  fs.mkdirSync(currentFramesDir, { recursive: true });
} else {
  fs.readdirSync(currentFramesDir).forEach(f => fs.unlinkSync(path.join(currentFramesDir, f)));
}

let totalBytes = 0;
let sampleWidth = 0;
let sampleHeight = 0;
let pngSampleSize = 0;
let webpSampleSize = 0;

for (let i = 0; i < pngFiles.length; i++) {
  const pngFile = pngFiles[i];
  const frameIndex = String(i + 1).padStart(3, '0');
  const inputPath = path.join(tempPngDir, pngFile);
  const outputPath = path.join(currentFramesDir, `frame_${frameIndex}.webp`);

  const metadata = await sharp(inputPath).metadata();
  if (i === 0) {
    sampleWidth = metadata.width;
    sampleHeight = metadata.height;
    pngSampleSize = fs.statSync(inputPath).size;
  }

  await sharp(inputPath)
    .webp({ quality: 92, effort: 6 })
    .toFile(outputPath);

  const stat = fs.statSync(outputPath);
  totalBytes += stat.size;

  if (i === 0) {
    webpSampleSize = stat.size;
  }

  if ((i + 1) % 45 === 0 || i === pngFiles.length - 1) {
    console.log(`Converted ${i + 1}/${pngFiles.length} WebP frames...`);
  }
}

const avgSizeBytes = Math.round(totalBytes / pngFiles.length);

console.log('\n=============================================');
console.log('🎉 180 HD FRAME EXTRACTION COMPLETE!');
console.log(`Total Frames Generated: ${pngFiles.length}`);
console.log(`Frame Resolution: ${sampleWidth} x ${sampleHeight} px (Original Source Resolution)`);
console.log(`Sample Frame 1 PNG Size: ${(pngSampleSize / 1024).toFixed(2)} KB`);
console.log(`Sample Frame 1 WebP Size: ${(webpSampleSize / 1024).toFixed(2)} KB`);
console.log(`Total Sequence Size: ${(totalBytes / (1024 * 1024)).toFixed(2)} MB`);
console.log(`Average Frame Size: ${(avgSizeBytes / 1024).toFixed(2)} KB`);
console.log('=============================================\n');
