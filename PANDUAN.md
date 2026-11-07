# Panduan produksi konten psikologi populer (untuk sesi Claude terjadwal)

## Akun & jalur posting
- Instagram: akun `agilpamungks`, Windsor account id `17841469060726674`, connector `instagram`, action `create_video_post` (share_to_feed: true).
- Hosting video: repo ini, GitHub Pages → `https://agilpamungkas-ui.github.io/konten-psikologi/videos/<nama>.mp4` (aktif ±1–2 menit setelah push).
- TikTok `senjaprinting` & YouTube: hanya analisa (Windsor read-only), tidak diposting.

## Gaya video
- 9:16, 1080x1920, 30 fps, 25–40 detik, teks bergerak + SFX halus (tanpa narasi; belum ada TTS di cloud).
- Latar gelap bergrid, aksen neon (kuning #FFD23F, merah muda #FF5A5F, hijau #5BE49B, biru), font Inter Display. Teks layar singkat, ≤ ~8 kata per baris.
- Kerangka HEIA: Hook (0–2 dtk) → Empati → Isi (2–3 poin) → Aksi/CTA (≥2 dtk).
- Template animasi: `tools/template.html` (fungsi `seek(t)`, `window.DUR`). Salin ke file baru, ganti teks/timing.

## Render
```
node tools/render.js frames x tools/NAMA.html     # cek still frame (f_*.png di folder tools/)
node tools/render.js video /tmp/silent.mp4 tools/NAMA.html
python3 tools/sfx.py /tmp/sfx.wav <durasi> "<waktu pop,...>" "<waktu transisi,...>"
ffmpeg -i /tmp/silent.mp4 -i /tmp/sfx.wav -c:v copy -c:a aac -shortest videos/<topik>_9x16_vN.mp4
```
Puppeteer: `/opt/npm-tools/node_modules/puppeteer` dengan `/usr/bin/google-chrome`; kalau path beda, ubah baris require atau `npm i puppeteer`.

## Aturan isi (wajib)
- Label "psikologi populer", BUKAN mengaku psikolog. Jangan mendiagnosis penonton.
- Klaim/angka harus bersumber (riset web); kalau tak terverifikasi, jangan dipakai.
- Hindari topik bunuh diri, self-harm, gangguan makan, kekerasan/trauma berat. Topik aman: emosi sehari-hari, kebiasaan, hubungan, overthinking, burnout ringan, bias kognitif, komunikasi.
- Bila relevan, ajak bicara ke orang tepercaya / psikolog / konselor.
- Jangan ulang topik yang sudah ada di `log-posting.md`.

## Alur tiap run
1. Baca `log-posting.md` dan laporan terbaru di `analisa/` (kalau ada) → pilih topik.
2. Riset singkat, tulis naskah HEIA + caption (Bahasa Indonesia santai, CTA komen, 5–7 hashtag).
3. Render, cek still frame, push MP4 ke `videos/`.
4. Kirim ke Agil: file MP4 + caption + link Pages. Tunggu balasan "post". Tanpa "post" = jangan posting.
5. Setelah "post": execute_action Windsor, lalu catat di `log-posting.md` (tanggal, topik, nama file, media id) dan push.
