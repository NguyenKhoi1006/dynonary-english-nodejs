import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const srcDir = join(import.meta.dirname, '..', 'src');

function walk(dir) {
  const files = [];
  try {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory() && entry.name[0] !== '.' && entry.name !== 'node_modules')
        files.push(...walk(full));
      else if (entry.isFile() && /\.(js|jsx|ts|tsx)$/.test(entry.name))
        files.push(full);
    }
  } catch {}
  return files;
}

const allFiles = walk(srcDir);
let count = 0;

for (const file of allFiles) {
  try {
    let content = readFileSync(file, 'utf-8');
    const orig = content;
    // @material-ui/styles -> @mui/styles
    content = content.replace(/@material-ui\/styles/g, '@mui/styles');
    if (content !== orig) {
      writeFileSync(file, content, 'utf-8');
      count++;
    }
  } catch {}
}

console.log(`Fixed ${count} files.`);
