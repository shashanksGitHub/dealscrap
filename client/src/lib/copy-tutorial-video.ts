```typescript
import fs from 'fs';
import path from 'path';

const sourceVideo = path.join(__dirname, '../../../attached_assets/Testvid.mp4');
const targetDir = path.join(__dirname, '../../public');
const targetVideo = path.join(targetDir, 'Testvid.mp4');

// Erstelle den public Ordner, falls er nicht existiert
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Kopiere das Video
fs.copyFileSync(sourceVideo, targetVideo);
```
