import fs from 'fs';
import path from 'path';

const COMPLAINT_KEYWORDS = /\b(sakit|nyeri|sesak|demam|panas|pusing|lemas|batuk|muntah|mual|gatal|bengkak|berdarah|darah|linu|pecah|berat|parah|kambuh|nggak bisa|sulit|susah|terganggu|meler|serak|kesakitan|ngilu|perih|pegel|luka|infeksi|radang|diare|mencret|napas|kejang|tremor|lumpuh|biru|pucat|kuning|buruk|turun|hilang|nggak kuat)\b/i;
const DENIAL_OR_NEUTRAL_RE = /\b(tidak|nggak|belum|enggak|bukan|nggak ada|tidak ada|belum ada|tidak pernah|nggak pernah|belum pernah|biasa aja|normal|baik-baik|itu aja|itu saja|disangkal|negatif)\b/i;
const NEUTRAL_RESPONSE_RE = /\b(suka|kadang-kadang|jarang|pernah|biasa|dulu|minum|makan|merokok|olahraga|kerja|tidur|bangun|anak|suami|istri|guru|petani|teman|tetangga|kantor|rumah|sekolah|kampung)\b/i;

function getSentiment(text) {
    if (COMPLAINT_KEYWORDS.test(text)) return 'confirmation'; // complaint
    if (DENIAL_OR_NEUTRAL_RE.test(text)) return 'denial';
    if (NEUTRAL_RESPONSE_RE.test(text)) return 'neutral';
    return 'confirmation'; // Default
}

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.js')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            const re = /(response\s*:\s*(['"`])([\s\S]*?)\2)(?!\s*,\s*sentiment)/g;
            let changes = 0;
            const newContent = content.replace(re, (match, p1, p2, responseText) => {
                const sentiment = getSentiment(responseText);
                changes++;
                return `${p1}, sentiment: '${sentiment}'`;
            });
            if (changes > 0) {
                fs.writeFileSync(fullPath, newContent);
                console.log(`Updated ${changes} responses in ${path.basename(fullPath)}`);
            }
        }
    }
}

processDir('d:/Dev/PRIMER/src/content/cases/modules');
console.log('Done mapping semantics');
