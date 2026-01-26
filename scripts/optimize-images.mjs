/**
 * Image Optimization Script
 * Compresses oversized PNG images to optimized JPG format
 */

import sharp from "sharp";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imagesToOptimize = [
  {
    input: "../public/images/menu/juices/9yards-food-juice-cocktail.png",
    output: "../public/images/menu/juices/9yards-food-juice-cocktail.jpg",
    quality: 85,
    maxWidth: 800,
  },
  {
    input: "../public/images/lusaniya/9Yards-Food-Lusaniya-01.png",
    output: "../public/images/lusaniya/9Yards-Food-Lusaniya-01.jpg",
    quality: 85,
    maxWidth: 1200,
  },
  {
    input: "../public/images/lusaniya/9Yards-Food-Lusaniya-05.png",
    output: "../public/images/lusaniya/9Yards-Food-Lusaniya-05.jpg",
    quality: 85,
    maxWidth: 1200,
  },
];

async function optimizeImages() {
  console.log("🖼️  Starting image optimization...\n");

  for (const img of imagesToOptimize) {
    const inputPath = path.resolve(__dirname, img.input);
    const outputPath = path.resolve(__dirname, img.output);

    try {
      // Check if input file exists
      if (!fs.existsSync(inputPath)) {
        console.log(`⚠️  Skipping: ${img.input} (file not found)`);
        continue;
      }

      const inputStats = fs.statSync(inputPath);
      const inputSizeMB = (inputStats.size / (1024 * 1024)).toFixed(2);

      console.log(`Processing: ${path.basename(img.input)}`);
      console.log(`  Input size: ${inputSizeMB} MB`);

      // Optimize the image
      await sharp(inputPath)
        .resize(img.maxWidth, null, {
          withoutEnlargement: true,
          fit: "inside",
        })
        .jpeg({
          quality: img.quality,
          progressive: true,
          mozjpeg: true,
        })
        .toFile(outputPath);

      const outputStats = fs.statSync(outputPath);
      const outputSizeKB = (outputStats.size / 1024).toFixed(2);
      const reduction = (
        (1 - outputStats.size / inputStats.size) *
        100
      ).toFixed(1);

      console.log(`  Output size: ${outputSizeKB} KB`);
      console.log(`  Reduction: ${reduction}%`);
      console.log(`  ✅ Saved to: ${path.basename(img.output)}\n`);
    } catch (error) {
      console.error(`❌ Error processing ${img.input}:`, error.message);
    }
  }

  console.log("🎉 Image optimization complete!");
}

optimizeImages();
