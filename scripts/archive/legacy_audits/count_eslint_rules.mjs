import fs from 'fs';

const data = JSON.parse(fs.readFileSync('megalog/outputs/eslint.json', 'utf8'));
const counts = {};

data.forEach(file => {
    file.messages.forEach(msg => {
        const ruleId = msg.ruleId || 'fatal';
        counts[ruleId] = (counts[ruleId] || 0) + 1;
    });
});

const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
console.log('Rule Counts:');
sorted.forEach(([rule, count]) => {
    console.log(`${rule}: ${count}`);
});
