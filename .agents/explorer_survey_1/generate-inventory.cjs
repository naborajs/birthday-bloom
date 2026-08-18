const fs = require('fs');
const path = require('path');

const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

// Find all imports in src
const imports = new Set();
function scanDir(dir) {
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, f.name);
    if (f.isDirectory()) {
      scanDir(full);
    } else if (/\.(tsx?|jsx?|css)$/.test(f.name)) {
      const content = fs.readFileSync(full, 'utf8');
      const matches = content.matchAll(/(?:from\s+['"]|import\s+['"]|import\s*\(\s*['"])([@a-zA-Z0-9_\-\.\/]+)['"]/g);
      for (const m of matches) {
        imports.add(m[1]);
      }
    }
  }
}
scanDir('src');

console.log('Total unique import paths in src:', imports.size);
console.log('\n--- Checking dependencies usage ---');
for (const dep of Object.keys(pkg.dependencies || {})) {
  const isUsed = Array.from(imports).some(imp => imp === dep || imp.startsWith(dep + '/'));
  console.log(`${dep}: ${isUsed ? 'USED' : 'UNUSED IN SRC'}`);
}
