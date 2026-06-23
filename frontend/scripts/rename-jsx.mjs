import { readFileSync, renameSync, readdirSync, statSync } from 'fs';
import { join, extname, dirname, basename } from 'path';

const srcDir = join(import.meta.dirname, '..', 'src');

const JSX_REGEX = /return\s+\(?\s*<|jsx|createElement|Fragment>|<\/[A-Z]|from\s+['"]react['"]|<>/;

function walk(dir) {
  const files = [];
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory() && !entry.name.startsWith('.')) {
      files.push(...walk(full));
    } else if (entry.isFile() && extname(entry.name) === '.js') {
      files.push(full);
    }
  }
  return files;
}

const jsFiles = walk(srcDir);
console.log(`Scanning ${jsFiles.length} .js files for JSX content...`);

let renamed = 0;

for (const file of jsFiles) {
  try {
    const content = readFileSync(file, 'utf-8');
    if (JSX_REGEX.test(content)) {
      const newPath = file.slice(0, -3) + '.jsx';
      renameSync(file, newPath);
      console.log(`  ✓ ${file.replace(srcDir, '.')} → .jsx`);
      renamed++;
    }
  } catch (e) {
    console.error(`  ✗ ${file.replace(srcDir, '.')}: ${e.message}`);
  }
}

console.log(`\nDone! ${renamed} files renamed to .jsx`);
