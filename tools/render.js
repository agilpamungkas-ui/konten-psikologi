const puppeteer = require('/opt/npm-tools/node_modules/puppeteer');
const { spawn } = require('child_process');
const path = require('path');
const [,, mode, out] = process.argv; // mode: "frames" (test stills) or "video"
(async () => {
  const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox', '--disable-gpu'] });
  const p = await b.newPage();
  await p.setViewport({ width: 1080, height: 1920 });
  await p.goto('file://' + path.resolve(process.argv[4] || path.join(__dirname,'template.html')));
  await p.evaluateHandle('document.fonts.ready');
  const D = await p.evaluate(() => window.DUR);
  if (mode === 'frames') {
    for (const t of [2.4, 5.5, 8.6, 11.8, 18.8, 22.5, 27]) {
      await p.evaluate(t => seek(t), t);
      await p.screenshot({ path: path.join(__dirname, `f_${t}.png`) });
    }
  } else {
    const fps = 30, n = Math.round(D * fps);
    const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-',
      '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '18', '-pix_fmt', 'yuv420p', out], { stdio: ['pipe', 'inherit', 'inherit'] });
    for (let i = 0; i < n; i++) {
      await p.evaluate(t => seek(t), i / fps);
      const buf = await p.screenshot({ type: 'jpeg', quality: 92 });
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    }
    ff.stdin.end(); await new Promise(r => ff.on('close', r));
  }
  await b.close();
})();
