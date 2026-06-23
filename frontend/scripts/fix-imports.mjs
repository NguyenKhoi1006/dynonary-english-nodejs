import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const srcDir = join(import.meta.dirname, '..', 'src');

function walk(dir) {
  const files = [];
  try {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory() && entry.name[0] !== '.' && entry.name !== 'node_modules') {
        files.push(...walk(full));
      } else if (entry.isFile() && /\.(js|jsx|ts|tsx)$/.test(entry.name)) {
        files.push(full);
      }
    }
  } catch {}
  return files;
}

const allFiles = walk(srcDir);
console.log(`Scanning ${allFiles.length} files...`);

// Case 1: @material-ui/core/XXX -> @mui/material/XXX
const re1 = /@material-ui\/core(\/[^'"]*)?/g;
// Case 2: @material-ui/icons/XXX -> @mui/icons-material/XXX
const re2 = /@material-ui\/icons(\/[^'"]*)?/g;
// Case 3: @material-ui/lab -> @mui/material
const re3 = /@material-ui\/lab(\/[^'"]*)?/g;
// Case 4: createMuiTheme -> createTheme
const re4 = /createMuiTheme/g;
// Case 5: process.env.REACT_APP_ -> import.meta.env.VITE_
const re5 = /process\.env\.REACT_APP_/g;

let count = 0;
for (const file of allFiles) {
  let content;
  try { content = readFileSync(file, 'utf-8'); } catch { continue; }
  const original = content;
  content = content.replace(re1, '@mui/material$1');
  content = content.replace(re2, '@mui/icons-material$1');
  content = content.replace(re3, '@mui/material$1');
  content = content.replace(re4, 'createTheme');
  content = content.replace(re5, 'import.meta.env.VITE_');
  if (content !== original) {
    writeFileSync(file, content, 'utf-8');
    count++;
  }
}
console.log(`Updated ${count} files.`);
