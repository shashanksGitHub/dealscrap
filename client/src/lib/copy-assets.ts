import fs from 'fs';
import path from 'path';

const sourceDir = path.join(__dirname, '../../../attached_assets');
const targetDir = path.join(__dirname, '../../public/images');

// Erstelle den images Ordner, falls er nicht existiert
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Liste der zu kopierenden Bilder
const imagesToCopy = [
  'DEU_Hamburg_COA.svg.png',
  'Logo_570px_ihk.png',
  'dsgvo-grey-523x480.png',
  'Testvid.mp4',
  'favicon.svg',
  'new-leadscraper-logo.png',
  'logo-blue.png'
];

// Kopiere die Bilder
imagesToCopy.forEach(image => {
  const sourceImage = path.join(sourceDir, image);
  const targetImage = path.join(targetDir, image);

  try {
    if (fs.existsSync(sourceImage)) {
      fs.copyFileSync(sourceImage, targetImage);
      console.log(`Copied ${image} to public/images`);
    } else {
      console.warn(`Warning: Source image ${image} not found at ${sourceImage}`);
    }
  } catch (error) {
    console.error(`Error copying ${image}:`, error);
  }
});