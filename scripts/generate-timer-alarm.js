// Pişirme zamanlayıcısı alarm sesi (assets/sounds/timer_alarm.wav) üretir.
// Telifsiz: tamamen sentezlenmiş sinüs bip'leri. Yeniden üretmek için:
//   node scripts/generate-timer-alarm.js
// Bildirim sesi olarak kullanılıyor: iOS en fazla 30 sn çalar, Android dosyayı
// sonuna kadar çalar. ~6 sn: 5 kez "bip-bip" (880 Hz + 1320 Hz).
const fs = require('fs');
const path = require('path');

const RATE = 22050;
const samples = [];
const silence = (sec) => { for (let i = 0; i < sec * RATE; i++) samples.push(0); };
const tone = (freq, sec, vol = 0.6) => {
  const n = Math.floor(sec * RATE);
  const fade = Math.floor(0.008 * RATE); // tık sesini önlemek için kısa fade
  for (let i = 0; i < n; i++) {
    const env = Math.min(1, i / fade, (n - i) / fade);
    // Hafif harmonik: daha "alarm" gibi, telefon hoparlöründe daha duyulur.
    const s = Math.sin(2 * Math.PI * freq * i / RATE) * 0.8 + Math.sin(4 * Math.PI * freq * i / RATE) * 0.2;
    samples.push(s * vol * env);
  }
};

for (let r = 0; r < 5; r++) {
  tone(880, 0.16); silence(0.06);
  tone(1320, 0.16); silence(0.06);
  tone(880, 0.16); silence(0.06);
  tone(1320, 0.16);
  silence(0.42);
}

const data = Buffer.alloc(samples.length * 2);
samples.forEach((s, i) => data.writeInt16LE(Math.round(Math.max(-1, Math.min(1, s)) * 32767), i * 2));
const header = Buffer.alloc(44);
header.write('RIFF', 0); header.writeUInt32LE(36 + data.length, 4); header.write('WAVE', 8);
header.write('fmt ', 12); header.writeUInt32LE(16, 16); header.writeUInt16LE(1, 20); header.writeUInt16LE(1, 22);
header.writeUInt32LE(RATE, 24); header.writeUInt32LE(RATE * 2, 28); header.writeUInt16LE(2, 32); header.writeUInt16LE(16, 34);
header.write('data', 36); header.writeUInt32LE(data.length, 40);

const out = path.join(__dirname, '..', 'assets', 'sounds', 'timer_alarm.wav');
fs.writeFileSync(out, Buffer.concat([header, data]));
console.log(`${out} (${(samples.length / RATE).toFixed(1)} sn, ${Math.round((44 + data.length) / 1024)} KB)`);
