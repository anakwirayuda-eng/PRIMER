import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

/**
 * @reflection
 * [IDENTITY]: PRIMERA Auto-Fix Orchestrator
 * [PURPOSE]: Orchestrates existing audit and fix scripts to self-heal the codebase.
 * [STATE]: Stable
 * [LAST_UPDATE]: 2026-02-12
 */

const AUDIT_SCRIPTS = [
    'audit_master.mjs',
    'audit_anamnesis.mjs',
    'consistency_audit.mjs',
    'audit_inventory_sync.js'
];

const FIX_SCRIPTS = [
    'fix_categories.mjs',
    'fix_duplicates.cjs'
];

async function main() {
    console.log('--- PRIMERA AUTO-FIX ORCHESTRATOR INITIATED ---');

    console.log('\n[PHASE 1] Running Fix Scripts (Pre-emptive Cleanup)...');
    for (const script of FIX_SCRIPTS) {
        if (fs.existsSync(path.join(ROOT_DIR, script))) {
            console.log(`Running: ${script}...`);
            try {
                const out = execSync(`node ${script}`, { cwd: ROOT_DIR, encoding: 'utf8' });
                console.log(out.split('\n').slice(0, 3).join('\n') + '...');
            } catch (e) {
                console.error(`Error running ${script}: ${e.message}`);
            }
        }
    }

    console.log('\n[PHASE 2] Running Audit Scripts (Health Verification)...');
    let auditLog = '--- AUTO-FIX AUDIT LOG ---\n\n';

    for (const script of AUDIT_SCRIPTS) {
        if (fs.existsSync(path.join(ROOT_DIR, script))) {
            console.log(`Auditing: ${script}...`);
            try {
                const out = execSync(`node ${script}`, { cwd: ROOT_DIR, encoding: 'utf8' });
                auditLog += `### Audit Result: ${script}\n\`\`\`\n${out.slice(0, 500)}...\n\`\`\`\n\n`;
            } catch (e) {
                console.error(`Error auditing ${script}: ${e.message}`);
            }
        }
    }

    // Append audit log to a temp file for Megalog to pick up
    fs.writeFileSync(path.join(ROOT_DIR, 'build_error.log'), auditLog);

    console.log('\n[PHASE 3] Finalizing Sync...');
    execSync('node scripts/reflect_and_sync.mjs', { cwd: ROOT_DIR });

    console.log('\n--- AUTO-FIX COMPLETED ---');
}

main().catch(console.error);
