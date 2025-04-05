import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define source and destination directories
const sourceDir = path.resolve(__dirname, 'attached_assets');
const publicDir = path.resolve(__dirname, 'public');
const publicAssetsDir = path.resolve(publicDir, 'attached_assets');

// Create the public directory if it doesn't exist
if (!fs.existsSync(publicDir)) {
  console.log('Creating public directory...');
  fs.mkdirSync(publicDir, { recursive: true });
}

// Create or recreate the public assets directory
if (fs.existsSync(publicAssetsDir)) {
  console.log('Removing existing public assets directory...');
  fs.rmSync(publicAssetsDir, { recursive: true, force: true });
}

console.log('Creating public assets directory...');
fs.mkdirSync(publicAssetsDir, { recursive: true });

// Copy all files from attached_assets to public/attached_assets
console.log('Copying assets...');
const files = fs.readdirSync(sourceDir);

let copiedCount = 0;
for (const file of files) {
  const sourcePath = path.join(sourceDir, file);
  const destPath = path.join(publicAssetsDir, file);
  
  // Skip directories, only copy files
  if (fs.statSync(sourcePath).isFile()) {
    fs.copyFileSync(sourcePath, destPath);
    copiedCount++;
    console.log(`Copied: ${file}`);
  }
}

console.log(`Successfully copied ${copiedCount} assets.`);

// Also create a symlink to make assets available during development
const createSymlink = () => {
  try {
    const clientPublicDir = path.resolve(__dirname, 'client', 'public');
    
    // Create client/public if it doesn't exist
    if (!fs.existsSync(clientPublicDir)) {
      fs.mkdirSync(clientPublicDir, { recursive: true });
    }
    
    const symlinkPath = path.join(clientPublicDir, 'attached_assets');
    
    // Remove existing symlink if it exists
    if (fs.existsSync(symlinkPath)) {
      if (fs.lstatSync(symlinkPath).isSymbolicLink()) {
        fs.unlinkSync(symlinkPath);
      } else {
        fs.rmSync(symlinkPath, { recursive: true, force: true });
      }
    }
    
    // Create relative symlink
    const relativeSourcePath = path.relative(clientPublicDir, sourceDir);
    fs.symlinkSync(relativeSourcePath, symlinkPath, 'dir');
    console.log(`Created symlink at ${symlinkPath}`);
  } catch (error) {
    console.error('Failed to create symlink:', error.message);
    // Continue if symlink creation fails, it's not critical
  }
};

createSymlink();

console.log('Assets copy completed!');