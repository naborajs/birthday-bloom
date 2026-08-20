import fs from 'fs';
import path from 'path';
import ts from 'typescript';

const walk = (dir) => {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
      continue;
    }
    if (!full.endsWith('.ts') && !full.endsWith('.tsx')) continue;
    const source = fs.readFileSync(full, 'utf8');
    const sf = ts.createSourceFile(full, source, ts.ScriptTarget.Latest, true, full.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
    const printer = ts.createPrinter({ removeComments: true });
    const output = printer.printFile(sf);
    fs.writeFileSync(full, output, 'utf8');
    console.log('Stripped comments from', full);
  }
};

walk(path.join(process.cwd(), 'src'));
