/**
 * Compress PNG with transparency preserved
 */

import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function compressPngWithTransparency() {
  const inputPath = path.resolve(__dirname, '../public/images/lusaniya/9Yards-Food-Lusaniya-05.png');
  const outputPath = path.resolve(__dirname, '../public/images/lusaniya/9Yards-Food-Lusaniya-05-optimized.png');

  try {
    const inputStats = fs.statSync(inputPath);
    const inputSizeMB = (inputStats.size / (1024 * 1024)).toFixed(2);
    console.log(`Input: ${inputSizeMB} MB`);

    // Compress PNG while preserving transparency
    await sharp(inputPath)
      .resize(800, null, { 
        withoutEnlargement: true,
        fit: 'inside'
      })
      .png({ 
        quality: 80,
        compressionLevel: 9,
        palette: true  // Use palette-based PNG for smaller size
      })
      .toFile(outputPath);

    const outputStats = fs.statSync(outputPath);
    const outputSizeKB = (outputStats.size / 1024).toFixed(2);
    const reduction = ((1 - outputStats.size / inputStats.size) * 100).toFixed(1);

    console.log(`Output: ${outputSizeKB} KB`);
    console.log(`Reduction: ${reduction}%`);

    // Replace original with optimized version
    fs.unlinkSync(inputPath);
    fs.renameSync(outputPath, inputPath);
    console.log('✅ Replaced original with optimized version');

  } catch (error) {
    console.error('Error:', error.message);
  }
}

compressPngWithTransparency();
