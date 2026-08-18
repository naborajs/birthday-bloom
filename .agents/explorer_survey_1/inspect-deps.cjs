const fs = require('fs');
const path = require('path');

const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

function getInstalledVersion(name) {
  try {
    const p = path.join('node_modules', ...name.split('/'), 'package.json');
    if (fs.existsSync(p)) {
      const data = JSON.parse(fs.readFileSync(p, 'utf8'));
      return data.version;
    }
  } catch (e) {
    return 'ERROR: ' + e.message;
  }
  return 'MISSING';
}

console.log('=== DEPENDENCIES ===');
for (const [dep, ver] of Object.entries(pkg.dependencies || {})) {
  const inst = getInstalledVersion(dep);
  console.log(`${dep} | declared: ${ver} | installed: ${inst}`);
}

console.log('\n=== DEV DEPENDENCIES ===');
for (const [dep, ver] of Object.entries(pkg.devDependencies || {})) {
  const inst = getInstalledVersion(dep);
  console.log(`${dep} | declared: ${ver} | installed: ${inst}`);
}
