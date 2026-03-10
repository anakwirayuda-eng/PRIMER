/**
 * @reflection
 * [IDENTITY]: Feature Guard Utility
 * [PURPOSE]: Checks for locked/unlocked game features based on state.
 * [STATE]: Production
 */
import { promises as fs } from 'node:fs';

const results = [];

export function fgCheck(name, fn) {
    try {
        fn();
        results.push({ name, ok: true });
    } catch (e) {
        results.push({ name, ok: false, detail: String(e?.message || e) });
    }
}

export async function fgWriteReport() {
    const reportDir = 'megalog';
    await fs.mkdir(reportDir, { recursive: true });

    const failed = results.filter((r) => !r.ok);
    const score = Math.max(0, 100 - failed.length * 15);

    const json = {
        gate: 'GAMEPLAY_FEATURE_GUARD',
        score,
        total: results.length,
        failed: failed.length,
        results,
        generatedAt: new Date().toISOString(),
    };

    await fs.writeFile(`${reportDir}/feature_guard.json`, JSON.stringify(json, null, 2), 'utf8');

    const md = [
        `# 🎮 Gameplay Feature Guard`,
        `Generated: ${new Date().toLocaleString()}`,
        ``,
        `**Score:** ${score}/100`,
        `**Checks:** ${results.length}`,
        `**Failed:** ${failed.length}`,
        ``
    ];

    if (failed.length) {
        md.push(`## ❌ Failures`);
        for (const f of failed) {
            md.push(`- **${f.name}**  \n  ↳ ${f.detail}`);
        }
    } else {
        md.push(`✅ All required gameplay features are present.`);
    }

    await fs.writeFile(`${reportDir}/feature_guard.md`, md.join('\n'), 'utf8');

    if (failed.length) {
        throw new Error(`GAMEPLAY_FEATURE_GUARD FAILED`);
    }
}
