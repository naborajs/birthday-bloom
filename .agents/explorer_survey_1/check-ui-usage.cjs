const fs = require('fs');
const path = require('path');

const uiFiles = fs.readdirSync('src/components/ui').filter(f => f.endsWith('.tsx') || f.endsWith('.ts'));

const usedUiComponents = new Set();
function scanDir(dir) {
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, f.name);
    if (f.isDirectory()) {
      if (full === path.join('src', 'components', 'ui')) continue; // Skip ui folder itself
      scanDir(full);
    } else if (/\.(tsx?|jsx?)$/.test(f.name)) {
      const content = fs.readFileSync(full, 'utf8');
      for (const ui of uiFiles) {
        const baseName = ui.replace(/\.tsx?$/, '');
        if (content.includes(`@/components/ui/${baseName}`) || content.includes(`./components/ui/${baseName}`) || content.includes(`../components/ui/${baseName}`) || content.includes(`components/ui/${baseName}`)) {
          usedUiComponents.add(ui);
        }
      }
    }
  }
}
scanDir('src');

console.log(`Total UI files in src/components/ui: ${uiFiles.length}`);
console.log(`UI files directly imported by application code: ${usedUiComponents.size}`);
console.log('\n--- Used UI Components ---');
for (const ui of Array.from(usedUiComponents).sort()) {
  console.log('USED:', ui);
}
console.log('\n--- Unused UI Components (Shadcn boilerplate) ---');
for (const ui of uiFiles) {
  if (!usedUiComponents.has(ui)) {
    console.log('UNUSED:', ui);
  }
}
