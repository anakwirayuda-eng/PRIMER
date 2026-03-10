import fs from 'fs';

const data = JSON.parse(fs.readFileSync('megalog/outputs/eslint.json', 'utf8'));
const targetRules = ['no-undef', 'react-hooks/purity', 'react-hooks/set-state-in-effect', 'no-case-declarations'];

data.forEach(file => {
    file.messages.forEach(msg => {
        if (targetRules.includes(msg.ruleId)) {
            console.log(`--- ${file.filePath} ---`);
            console.log(`Rule: ${msg.ruleId} (Line ${msg.line}:${msg.column})`);
            console.log(`Message: ${msg.message}`);
            // Show a snippet if source is available
            if (file.source) {
                const lines = file.source.split('\n');
                const start = Math.max(0, msg.line - 3);
                const end = Math.min(lines.length, msg.line + 2);
                for (let i = start; i < end; i++) {
                    console.log(`${i + 1}: ${lines[i]}`);
                    if (i + 1 === msg.line) {
                        console.log(' '.repeat(msg.column + 2) + '^');
                    }
                }
            }
            console.log('\n');
        }
    });
});
