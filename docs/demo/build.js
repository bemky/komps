import { readFileSync, writeFileSync, readdirSync, mkdirSync, cpSync } from 'fs';
import { join, basename } from 'path';
import { fileURLToPath } from 'url';

const dir = fileURLToPath(new URL('.', import.meta.url));
const pagesDir = join(dir, 'pages');
const projectRoot = join(dir, '..', '..');
const distDir = join(projectRoot, '_docs', 'demo');
const layout = readFileSync(join(dir, 'layout.html'), 'utf8');

mkdirSync(distDir, { recursive: true });

// Copy demo stylesheet
cpSync(join(dir, 'demo.css'), join(distDir, 'demo.css'));

// Copy lib/ and vendor dependencies
cpSync(join(projectRoot, 'lib'), join(distDir, 'lib'), { recursive: true });
cpSync(join(projectRoot, 'node_modules', 'dolla', 'lib'), join(distDir, 'vendor', 'dolla'), { recursive: true });
cpSync(
    join(projectRoot, 'node_modules', '@floating-ui', 'dom', 'dist', 'floating-ui.dom.browser.mjs'),
    join(distDir, 'vendor', 'floating-ui-dom.mjs')
);
cpSync(
    join(projectRoot, 'node_modules', '@floating-ui', 'core', 'dist', 'floating-ui.core.browser.mjs'),
    join(distDir, 'vendor', 'floating-ui-core.mjs')
);
cpSync(
    join(projectRoot, 'node_modules', '@floating-ui', 'utils', 'dist', 'floating-ui.utils.mjs'),
    join(distDir, 'vendor', 'floating-ui-utils.mjs')
);
cpSync(
    join(projectRoot, 'node_modules', '@floating-ui', 'utils', 'dist', 'floating-ui.utils.dom.mjs'),
    join(distDir, 'vendor', 'floating-ui-utils-dom.mjs')
);

const pages = readdirSync(pagesDir).filter(f => f.endsWith('.html'));

// Build each page
const index = [];
for (const file of pages) {
    const raw = readFileSync(join(pagesDir, file), 'utf8');

    // Extract title from front matter comment: <!-- title: Name -->
    const titleMatch = raw.match(/<!--\s*\n?\s*title:\s*(.+?)\s*\n?\s*-->/);
    const title = titleMatch ? titleMatch[1].trim() : basename(file, '.html');
    const body = raw.replace(/<!--\s*\n?\s*title:\s*.+?\s*\n?\s*-->\s*/, '');

    const html = layout
        .replace(/\{\{title\}\}/g, title)
        .replace('{{body}}', body);

    writeFileSync(join(distDir, file), html);
    index.push({ title, file });
    console.log(`  ${file}`);
}

// Build index page
const indexHtml = layout
    .replace(/\{\{title\}\}/g, 'Demos')
    .replace('{{body}}', `
    <ul>
        ${index.map(p => `<li><a href="${p.file}">${p.title}</a></li>`).join('\n        ')}
    </ul>
`);
writeFileSync(join(distDir, 'index.html'), indexHtml);
console.log(`  index.html\nWrote ${pages.length + 1} files to _docs/demo/`);
