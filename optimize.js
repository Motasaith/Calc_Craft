const sharp = require('sharp');
const fs = require('fs');

async function processImage(file, width) {
  try {
    if (!fs.existsSync(`public/${file}.png`)) {
      console.log(`File public/${file}.png does not exist, skipping`);
      return;
    }
    await sharp(`public/${file}.png`)
      .resize(width)
      .webp({ quality: 80 })
      .toFile(`public/${file}.webp`);
    console.log(`Optimized ${file}`);
    fs.unlinkSync(`public/${file}.png`); // Delete original
  } catch (e) {
    console.log(`Error processing ${file}: ${e.message}`);
  }
}

async function run() {
  await processImage('why_choose_calccraft', 800);
  await processImage('logo', 200);
  await processImage('footer_logo', 200);
  await processImage('hero', 1200);
}

run();
