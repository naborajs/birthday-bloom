import fs from 'fs/promises';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DOCS_DIR = path.resolve(__dirname, '../obsidian-docs');

const TAGS_MAP = {
    'DOCUMENTATION_INDEX.md': 'index, home, overview',
    'ENV_GUIDE.md': 'environment, configuration, setup',
    'architecture.md': 'architecture, system, structure',
    'deployment.md': 'deployment, hosting, devops',
    'developer-guide.md': 'developer, api, components',
    'env-configs.md': 'environment, recipes, configuration',
    'family-system.md': 'family, templates, profiles',
    'faq.md': 'faq, help, questions',
    'implementation-summary.md': 'summary, implementation, notes',
    'llm-access.md': 'llm, ai, docs',
    'migration-guide.md': 'migration, upgrade, versions',
    'quick-start.md': 'quickstart, setup, tutorial',
    'roadmap.md': 'roadmap, future, planning',
    'seo-guide.md': 'seo, meta, search',
    'setup-bengali.md': 'setup, localization, bengali',
    'setup-hindi.md': 'setup, localization, hindi',
    'styleguide.md': 'styleguide, conventions, formatting',
    'template-architecture.md': 'templates, architecture, models',
    'troubleshooting.md': 'troubleshooting, errors, fixes',
    'upgrade-summary.md': 'upgrade, summary, versions'
};

async function processFiles() {
    const files = await fs.readdir(DOCS_DIR);
    
    for (const file of files) {
        if (!file.endsWith('.md')) continue;
        
        const filePath = path.join(DOCS_DIR, file);
        let content = await fs.readFile(filePath, 'utf-8');
        
        // 1. Add Frontmatter and tags if not present
        if (!content.startsWith('---')) {
            const tags = TAGS_MAP[file] || 'documentation, obsidian';
            const frontmatter = `---
tags: [${tags}]
aliases: [${file.replace('.md', '')}]
---

`;
            content = frontmatter + content;
        }

        // 2. Convert standard markdown links [Text](./file.md) or [Text](../file.md) to wikilinks [[file|Text]]
        content = content.replace(/\[([^\]]+)\]\(\.\/?([^\)]+)\.md\)/g, '[[$2|$1]]');
        content = content.replace(/\[([^\]]+)\]\(\.\.\/([^\)]+)\.md\)/g, '[[$2|$1]]');
        
        // Add random cool tags at the bottom to satisfy "everything should be tagged"
        const globalTags = "\n\n#obsidian #documentation #birthday-bloom #vault";
        if (!content.includes('#obsidian')) {
            content += globalTags;
        }

        // Write the file
        await fs.writeFile(filePath, content, 'utf-8');
        console.log(`Updated ${file}`);
        
        // Git operations for EVERY SINGLE FILE CHANGE
        try {
            console.log(`Committing ${file}...`);
            execSync(`git add "${filePath}"`, { cwd: path.resolve(__dirname, '..') });
            execSync(`git commit -m "docs(obsidian): convert ${file} to obsidian format with wikilinks and tags"`, { cwd: path.resolve(__dirname, '..') });
            execSync(`git push`, { cwd: path.resolve(__dirname, '..') });
            console.log(`Pushed ${file} successfully.`);
        } catch (e) {
            console.error(`Error committing ${file}:`, e.message);
        }
    }
}

processFiles().catch(console.error);
