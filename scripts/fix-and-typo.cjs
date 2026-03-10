// Fix ALL " and " → " dan " in case module .js files
// Broader approach: replace within ALL string content that contains Indonesian text
const fs = require('fs');
const path = require('path');

const dir = 'd:/Dev/PRIMER/src/content/cases/modules';
let totalFixed = 0;
let totalReplacements = 0;

function walk(d) {
    const items = fs.readdirSync(d, { withFileTypes: true });
    for (const it of items) {
        const fp = path.join(d, it.name);
        if (it.isDirectory()) { walk(fp); continue; }
        if (!it.name.endsWith('.js')) continue;

        let content = fs.readFileSync(fp, 'utf8');
        const original = content;
        let fileReplacements = 0;

        // Split content into string and non-string portions
        // Replace " and " with " dan " inside ALL quoted strings
        content = content.replace(/(["'])((?:(?!\1|\\).|\\.)*)(\1)/g, (match, openQ, inner, closeQ) => {
            if (!inner.includes(' and ')) return match;
            // Skip if it looks like an import/require path or pure English comment
            if (inner.startsWith('./') || inner.startsWith('../') || inner.startsWith('http')) return match;
            // Skip if it's a purpose/identity line (English metadata)
            if (/^\[PURPOSE\]|^\[IDENTITY\]|^\[STATE\]|^\[ANCHOR\]/.test(inner)) return match;
            const fixed = inner.replace(/ and /g, ' dan ');
            if (fixed !== inner) fileReplacements++;
            return openQ + fixed + closeQ;
        });

        if (content !== original) {
            fs.writeFileSync(fp, content, 'utf8');
            totalFixed++;
            totalReplacements += fileReplacements;
            console.log(`Fixed ${fileReplacements} in: ${path.relative(dir, fp)}`);
        }
    }
}

walk(dir);
console.log(`\nTotal: ${totalFixed} files, ${totalReplacements} string replacements`);
