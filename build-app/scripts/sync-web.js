#!/usr/bin/env node
/**
 * sync-web.js — copia webroot do projeto principal pra build-app/www/
 * Uso: node scripts/sync-web.js [source]
 * Source default: ../ (projeto pai)
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');          // c:/Users/Kazuki/Documents/Projeto
const DEST = path.resolve(__dirname, '..', 'www');         // build-app/www
const INCLUDE = [
  'index.html',
  'manifest.webmanifest',
  'sw.js',
  'icons'
];
const EXCLUDE_DIRS = new Set(['.git', '.github', '.vscode', '.claude', 'node_modules', 'build-app', 'docs']);

function copyRecursive(src, dst) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    if (!fs.existsSync(dst)) fs.mkdirSync(dst, { recursive: true });
    for (const entry of fs.readdirSync(src)) {
      if (EXCLUDE_DIRS.has(entry)) continue;
      copyRecursive(path.join(src, entry), path.join(dst, entry));
    }
  } else {
    fs.copyFileSync(src, dst);
  }
}

function clean(dir) {
  if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
}

function main() {
  console.log(`[sync-web] ROOT: ${ROOT}`);
  console.log(`[sync-web] DEST: ${DEST}`);
  clean(DEST);
  let count = 0;
  for (const name of INCLUDE) {
    const src = path.join(ROOT, name);
    const dst = path.join(DEST, name);
    if (!fs.existsSync(src)) {
      console.warn(`  skip (not found): ${name}`);
      continue;
    }
    copyRecursive(src, dst);
    count++;
    console.log(`  + ${name}`);
  }
  console.log(`[sync-web] copied ${count} top-level items.`);
}

main();
