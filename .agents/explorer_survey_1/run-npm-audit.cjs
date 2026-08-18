const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const tempDir = path.join(__dirname, 'temp_audit');
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

fs.copyFileSync('package.json', path.join(tempDir, 'package.json'));
fs.copyFileSync(path.join(__dirname, 'clean-package-lock.json'), path.join(tempDir, 'package-lock.json'));

try {
  const stdout = execSync('npm audit --json', { cwd: tempDir, encoding: 'utf8' });
  console.log('npm audit succeeded (no vulns or returned json):');
  console.log(stdout);
} catch (e) {
  console.log('npm audit returned vulnerabilities or error (code ' + e.status + '):');
  console.log(e.stdout || e.message);
} finally {
  try {
    fs.rmSync(tempDir, { recursive: true, force: true });
  } catch (err) {}
}
