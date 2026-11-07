import { execFileSync } from 'child_process';
import path from 'path';
import ffmpegPath from 'ffmpeg-static';

const newVideoPath = path.resolve('create_now.mp4');
const oldVideoPath = path.resolve('public/Create_a_seamless_ultra_reali.mp4');

console.log('--- Inspecting NEW Video (create_now.mp4) ---');
try {
  const infoOutput = execFileSync(ffmpegPath, ['-i', newVideoPath], { encoding: 'utf8', stdio: 'pipe' });
  console.log(infoOutput);
} catch (err) {
  if (err.stderr) {
    const lines = err.stderr.split('\n').filter(l => l.includes('Stream') || l.includes('Duration') || l.includes('Video:'));
    console.log(lines.join('\n'));
  }
}

console.log('\n--- Inspecting OLD Video (Create_a_seamless_ultra_reali.mp4) ---');
try {
  const infoOutputOld = execFileSync(ffmpegPath, ['-i', oldVideoPath], { encoding: 'utf8', stdio: 'pipe' });
  console.log(infoOutputOld);
} catch (err) {
  if (err.stderr) {
    const lines = err.stderr.split('\n').filter(l => l.includes('Stream') || l.includes('Duration') || l.includes('Video:'));
    console.log(lines.join('\n'));
  }
}
