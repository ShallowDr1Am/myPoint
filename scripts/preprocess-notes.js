#!/usr/bin/env node
/**
 * 预处理 Obsidian 笔记，转换为 Astro 兼容格式
 * [[wikilinks]] → 标准链接
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const NOTES_DIR = './src/content/notes';

function textToSlug(text) {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w一-鿿\-]/g, '');
}

function processContent(content) {
  // [[wikilinks]] → [text](/slug/)
  content = content.replace(/\[\[([^\]]+)\]\]/g, (_, linkText) => {
    const slug = textToSlug(linkText);
    return `[${linkText}](/${slug}/)`;
  });

  return content;
}

function main() {
  const files = readdirSync(NOTES_DIR).filter(f => f.endsWith('.md'));
  let processedCount = 0;

  for (const file of files) {
    const filePath = join(NOTES_DIR, file);
    const content = readFileSync(filePath, 'utf-8');
    const processed = processContent(content);

    if (content !== processed) {
      writeFileSync(filePath, processed, 'utf-8');
      console.log(`✓ Processed: ${file}`);
      processedCount++;
    }
  }

  console.log(`\nDone! Processed ${processedCount} files.`);
}

main();