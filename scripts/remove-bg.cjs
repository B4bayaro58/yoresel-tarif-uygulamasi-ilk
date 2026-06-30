const sharp = require('sharp');

const input = 'C:\\Users\\FAZEON\\Desktop\\WhatsApp Image 2026-06-24 at 16.01.56.jpeg';
const output = 'C:\\Users\\FAZEON\\yoresel-tarif-uygulamasi\\web\\public\\logo.png';

sharp(input)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true })
  .then(({ data, info }) => {
    const { width, height, channels } = info;
    for (let i = 0; i < data.length; i += channels) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      if (r > 240 && g > 240 && b > 240) {
        data[i + 3] = 0;
      } else if (r > 215 && g > 215 && b > 215) {
        const brightness = (r + g + b) / 3;
        data[i + 3] = Math.round(((255 - brightness) / 40) * 255);
      }
    }
    return sharp(Buffer.from(data), { raw: { width, height, channels } })
      .png()
      .toFile(output);
  })
  .then(() => console.log('Done! logo.png saved.'))
  .catch(err => console.error('Error:', err));
