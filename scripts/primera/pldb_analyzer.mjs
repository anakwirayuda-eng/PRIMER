import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../../');
const DIAG_DIR = path.join(ROOT, 'diagnostics');
const REPORT_JSON = path.join(DIAG_DIR, 'eslint-report.json');
const WATCHDOG_JSON = path.join(ROOT, 'megalog/outputs/eslint.json');

async function main() {
    // Use diagnostics report if available, otherwise fallback to watchdog output
    const reportPath = fs.existsSync(REPORT_JSON) ? REPORT_JSON : WATCHDOG_JSON;
    if (!fs.existsSync(reportPath)) {
        console.error("❌ No ESLint report found. Run diag:export or megalog watchdog first.");
        return;
    }

    const data = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
    const summary = {};
    const undefinedLedger = [];

    data.forEach(file => {
        file.messages.forEach(msg => {
            // Summary count
            summary[msg.ruleId] = (summary[msg.ruleId] || 0) + 1;

            // Undefined Symbols
            if (msg.ruleId === 'no-undef') {
                const symbol = msg.message.match(/'(.+)' is not defined/)?.[1];
                if (symbol) {
                    undefinedLedger.push({
                        symbol,
                        file: path.relative(ROOT, file.filePath),
                        line: msg.line,
                        context: msg.source?.trim()
                    });
                }
            }
        });
    });

    // 1. Save Summary
    fs.writeFileSync(path.join(DIAG_DIR, 'lint-rules-summary.json'), JSON.stringify(summary, null, 2));

    // 2. Generate Ledger Markdown
    let md = "# 🔍 Undefined Symbols Ledger\n\n";
    md += "Daftar identifier yang `no-undef` dan analisis posisinya.\n\n";
    md += "| Symbol | File | Line | Context |\n";
    md += "| :--- | :--- | :--- | :--- |\n";

    undefinedLedger.sort((a, b) => a.symbol.localeCompare(b.symbol)).forEach(item => {
        md += `| \`${item.symbol}\` | [${path.basename(item.file)}](file://${path.join(ROOT, item.file)}) | ${item.line} | \`${item.context || ''}\` |\n`;
    });

    fs.writeFileSync(path.join(DIAG_DIR, 'undefined-ledger.md'), md);

    console.log("✅ Forensic Analysis Complete!");
    console.log(`- Summary: diagnostics/lint-rules-summary.json`);
    console.log(`- Ledger: diagnostics/undefined-ledger.md`);
}

main();
