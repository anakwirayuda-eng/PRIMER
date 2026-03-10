import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const SRC_DIR = path.join(ROOT_DIR, 'src');

/**
 * @reflection
 * [IDENTITY]: PRIMERA Watchdog
 * [PURPOSE]: Watches src/ for file changes and auto-syncs the Megalog with debounce.
 * [STATE]: Stable
 * [ANCHOR]: main
 * [DEPENDS_ON]: reflect_and_sync
 * [LAST_UPDATE]: 2026-02-12
 */

// ─── ANSI Colors ───────────────────────────────────────────
const C = {
    reset: '\x1b[0m', bold: '\x1b[1m', dim: '\x1b[2m',
    green: '\x1b[32m', yellow: '\x1b[33m', red: '\x1b[31m',
    cyan: '\x1b[36m', magenta: '\x1b[35m', blue: '\x1b[34m',
    clear: '\x1b[2J\x1b[H',
};

// ─── Config ────────────────────────────────────────────────
const DEBOUNCE_MS = 500;
const IGNORE_PATTERNS = [
    'node_modules', '.git', 'dist', 'build',
    '.json', '.md', '.css', '.png', '.jpg', '.mp3', '.zip', '.log'
];

let debounceTimer = null;
let syncCount = 0;
let lastChangeFile = '';
let lastChangeTime = '';
let isRunning = true;

// ─── Status Display ────────────────────────────────────────
function displayStatus() {
    const now = new Date();
    const uptime = process.uptime();
    const mins = Math.floor(uptime / 60);
    const secs = Math.floor(uptime % 60);

    console.log(C.clear);
    console.log(`${C.cyan}${C.bold}╔══════════════════════════════════════════════════╗`);
    console.log(`║   🐕 PRIMERA WATCHDOG — Live Sync Mode           ║`);
    console.log(`╠══════════════════════════════════════════════════╣${C.reset}`);
    console.log(`${C.cyan}║${C.reset}  Status:     ${C.green}${C.bold}WATCHING${C.reset}                             ${C.cyan}║${C.reset}`);
    console.log(`${C.cyan}║${C.reset}  Directory:  ${C.dim}src/${C.reset}                                 ${C.cyan}║${C.reset}`);
    console.log(`${C.cyan}║${C.reset}  Uptime:     ${mins}m ${secs}s                             ${C.cyan}║${C.reset}`);
    console.log(`${C.cyan}║${C.reset}  Syncs:      ${C.bold}${syncCount}${C.reset}                                    ${C.cyan}║${C.reset}`);
    if (lastChangeFile) {
        console.log(`${C.cyan}║${C.reset}  Last File:  ${C.yellow}${lastChangeFile.slice(0, 35)}${C.reset}     ${C.cyan}║${C.reset}`);
        console.log(`${C.cyan}║${C.reset}  Last Time:  ${C.dim}${lastChangeTime}${C.reset}                  ${C.cyan}║${C.reset}`);
    }
    console.log(`${C.cyan}╠══════════════════════════════════════════════════╣`);
    console.log(`║${C.reset}  ${C.dim}Press Ctrl+C to stop${C.reset}                            ${C.cyan}║`);
    console.log(`╚══════════════════════════════════════════════════╝${C.reset}`);
    console.log('');
}

// ─── Sync Trigger ──────────────────────────────────────────
function triggerSync(changedFile) {
    console.log(`  ${C.yellow}⟳${C.reset} Change detected: ${C.cyan}${changedFile}${C.reset}`);
    console.log(`  ${C.dim}Running sync...${C.reset}`);

    try {
        execSync('node scripts/reflect_and_sync.mjs', {
            cwd: ROOT_DIR,
            encoding: 'utf8',
            stdio: 'pipe'
        });
        syncCount++;
        lastChangeFile = changedFile;
        lastChangeTime = new Date().toLocaleTimeString('id-ID');
        console.log(`  ${C.green}✓${C.reset} Sync #${syncCount} complete!`);
    } catch (e) {
        console.error(`  ${C.red}✗${C.reset} Sync error: ${e.message}`);
    }

    setTimeout(displayStatus, 1000);
}

// ─── File Watcher ──────────────────────────────────────────
function shouldIgnore(filePath) {
    return IGNORE_PATTERNS.some(pattern =>
        filePath.includes(pattern)
    );
}

function watchDirectory(dir) {
    try {
        fs.watch(dir, { recursive: true }, (eventType, filename) => {
            if (!filename) return;
            if (shouldIgnore(filename)) return;
            if (!filename.endsWith('.js') && !filename.endsWith('.jsx')) return;

            // Debounce
            if (debounceTimer) clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                triggerSync(filename);
            }, DEBOUNCE_MS);
        });
    } catch (e) {
        console.error(`${C.red}Error watching directory: ${e.message}${C.reset}`);
    }
}

// ─── Graceful Shutdown ─────────────────────────────────────
process.on('SIGINT', () => {
    console.log(`\n\n  ${C.yellow}${C.bold}🐕 Watchdog shutting down...${C.reset}`);
    console.log(`  ${C.dim}Total syncs: ${syncCount}${C.reset}`);
    console.log(`  ${C.green}Goodbye!${C.reset}\n`);
    process.exit(0);
});

// ─── Main ──────────────────────────────────────────────────
function main() {
    displayStatus();

    // Initial sync
    console.log(`  ${C.cyan}⟳${C.reset} Running initial sync...`);
    try {
        execSync('node scripts/reflect_and_sync.mjs', { cwd: ROOT_DIR, encoding: 'utf8', stdio: 'pipe' });
        syncCount++;
        lastChangeTime = new Date().toLocaleTimeString('id-ID');
        console.log(`  ${C.green}✓${C.reset} Initial sync complete!`);
    } catch (e) {
        console.error(`  ${C.red}✗${C.reset} Initial sync error: ${e.message}`);
    }

    // Start watching
    watchDirectory(SRC_DIR);

    console.log(`\n  ${C.green}${C.bold}🐕 Watching for changes...${C.reset}\n`);

    // Keep alive
    setInterval(() => {
        // Heartbeat - prevent process from exiting
    }, 60000);
}

main();
