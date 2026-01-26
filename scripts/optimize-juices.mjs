/**
 * Optimize Juice Images - Compress large JPG files
 */

import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const juiceDir = path.resolve(__dirname, '../public/images/juices');

async function optimizeJuiceImages() {
  console.log('🧃 Optimizing juice images...\n');

  const files = fs.readdirSync(juiceDir).filter(f => f.endsWith('.jpg'));
  
  for (const file of files) {
    const inputPath = path.join(juiceDir, file);
    const tempPath = path.join(juiceDir, `temp_${file}`);
    
    try {
      const inputStats = fs.statSync(inputPath);
      const inputSizeKB = (inputStats.size / 1024).toFixed(0);
      
      // Skip if already small (under 200KB)
      if (inputStats.size < 200 * 1024) {
        console.log(`✓ ${file}: ${inputSizeKB} KB (already optimized)`);
        continue;
      }

      // Optimize the image
      await sharp(inputPath)
        .resize(600, null, { 
          withoutEnlargement: true,
          fit: 'inside'
        })
        .jpeg({ 
          quality: 80,
          progressive: true,
          mozjpeg: true
        })
        .toFile(tempPath);

      const outputStats = fs.statSync(tempPath);
      const outputSizeKB = (outputStats.size / 1024).toFixed(0);
      const reduction = ((1 - outputStats.size / inputStats.size) * 100).toFixed(0);

      // Replace original with optimized
      fs.unlinkSync(inputPath);
      fs.renameSync(tempPath, inputPath);

      console.log(`✓ ${file}: ${inputSizeKB} KB → ${outputSizeKB} KB (-${reduction}%)`);

    } catch (error) {
      console.error(`✗ ${file}: Error - ${error.message}`);
      // Clean up temp file if exists
      if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
    }
  }

  console.log('\n🎉 Juice image optimization complete!');
}

optimizeJuiceImages();
