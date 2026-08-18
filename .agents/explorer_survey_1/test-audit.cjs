const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Read lockfile and resolve conflict markers by taking incoming (origin/main)
const raw = fs.readFileSync('package-lock.json', 'utf8');

// Regex to replace conflict blocks taking the second half (between ======= and >>>>>>> origin/main)
const resolved = raw.replace(/<<<<<<< HEAD[\s\S]*?=======\r?\n([\s\S]*?)>>>>>>> origin\/main\r?\n/g, '$1');

try {
  JSON.parse(resolved);
  console.log('Successfully resolved package-lock.json to valid JSON!');
  fs.writeFileSync(path.join(__dirname, 'clean-package-lock.json'), resolved);
} catch (e) {
  console.error('Failed to parse resolved lockfile:', e.message);
}
