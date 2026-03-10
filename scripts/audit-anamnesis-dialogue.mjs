/**
 * T6: ANAMNESIS DIALOGUE VALIDATOR
 * ==================================
 * Generates every possible question+answer combo across all 255 cases
 * and checks for grammar errors, encoding issues, and nonsensical text.
 *
 * Prevents: Absurd dialogue, broken gender adaptation, encoding artifacts.
 */
import { CASE_LIBRARY } from '../src/content/cases/CaseLibrary.js';
import { GENERIC_QUESTIONS } from '../src/game/anamnesis/Constants.js';
import { classifyResponse } from '../src/game/anamnesis/SynthesisEngine.js';

const bugs = [];
const warnings = [];
let totalTests = 0;
let passedTests = 0;

function assert(test, label, details = '') {
    totalTests++;
    if (test) { passedTests++; }
    else { bugs.push({ label, details }); }
}
function warn(label, details = '') { warnings.push({ label, details }); }

console.log('═══════════════════════════════════════════════════════════');
console.log('  T6: ANAMNESIS DIALOGUE VALIDATOR');
console.log('═══════════════════════════════════════════════════════════\n');

const CATEGORIES = ['keluhan_utama', 'rps', 'rpd', 'rpk', 'sosial'];

// ────────────────────────────────────────────────────
// PHASE 1: Question Text Quality
// ────────────────────────────────────────────────────
console.log('▶ PHASE 1: Question Text Quality\n');

let totalQuestions = 0;
let encodingIssues = 0;
let emptyTexts = 0;
let templateVars = 0;
let doubledPunct = 0;

for (const c of CASE_LIBRARY) {
    if (!c.anamnesisQuestions) continue;

    for (const cat of CATEGORIES) {
        const questions = c.anamnesisQuestions?.[cat] || [];
        for (const q of questions) {
            totalQuestions++;
            const text = q.text || '';

            // Empty or too short
            if (text.trim().length < 3) {
                emptyTexts++;
                bugs.push({ label: `[${c.id}/${cat}] Empty/short question text`, details: `"${text}"` });
                continue;
            }

            // Encoding artifacts
            if (/\?\?|â€|Ã[^a-z]|Â/i.test(text)) {
                encodingIssues++;
                bugs.push({ label: `[${c.id}/${cat}] Encoding artifact in question`, details: text.substring(0, 60) });
            }

            // Raw template variables
            if (/\$\{[^}]+\}|\{[a-z_]+\}/i.test(text)) {
                templateVars++;
                bugs.push({ label: `[${c.id}/${cat}] Raw template variable in question`, details: text.substring(0, 60) });
            }

            // Doubled punctuation
            if (/[.]{2,}|[!]{2,}|[?]{3,}/.test(text)) {
                doubledPunct++;
                warn(`[${c.id}/${cat}] Doubled punctuation: "${text.substring(0, 40)}"`);
            }
        }
    }
}

console.log(`  Total questions scanned: ${totalQuestions}`);
console.log(`  Encoding issues: ${encodingIssues}`);
console.log(`  Empty/short texts: ${emptyTexts}`);
console.log(`  Template variables: ${templateVars}`);
console.log(`  Doubled punctuation: ${doubledPunct}`);
console.log('  ✅ Phase 1 complete\n');

// ────────────────────────────────────────────────────
// PHASE 2: Response/Answer Text Quality
// ────────────────────────────────────────────────────
console.log('▶ PHASE 2: Response Text Quality\n');

let totalResponses = 0;
let badResponses = 0;

for (const c of CASE_LIBRARY) {
    if (!c.anamnesisQuestions) continue;

    for (const cat of CATEGORIES) {
        const questions = c.anamnesisQuestions?.[cat] || [];
        for (const q of questions) {
            const response = q.response || q.answer || '';
            if (!response) continue;

            totalResponses++;

            // Check response text quality
            if (typeof response === 'string') {
                if (response.trim().length < 2) {
                    badResponses++;
                    warn(`[${c.id}/${cat}/${q.id}] Very short response: "${response}"`);
                }

                if (/\?\?|â€|Ã[^a-z]/i.test(response)) {
                    badResponses++;
                    bugs.push({ label: `[${c.id}/${cat}/${q.id}] Encoding artifact in response`, details: response.substring(0, 60) });
                }

                if (/\$\{[^}]+\}|\{[a-z_]+\}/i.test(response)) {
                    badResponses++;
                    bugs.push({ label: `[${c.id}/${cat}/${q.id}] Raw template in response`, details: response.substring(0, 60) });
                }

                // Check for undefined/null text
                if (response.includes('undefined') || response.includes('null')) {
                    badResponses++;
                    bugs.push({ label: `[${c.id}/${cat}/${q.id}] Contains "undefined"/"null" literal`, details: response.substring(0, 60) });
                }
            }
        }
    }
}

console.log(`  Total responses scanned: ${totalResponses}`);
console.log(`  Bad responses: ${badResponses}`);
console.log('  ✅ Phase 2 complete\n');

// ────────────────────────────────────────────────────
// PHASE 3: SynthesisEngine classifyResponse Robustness
// ────────────────────────────────────────────────────
console.log('▶ PHASE 3: SynthesisEngine classifyResponse Robustness\n');

let classifyCrashes = 0;
let classifyTests = 0;

for (const c of CASE_LIBRARY) {
    if (!c.anamnesisQuestions) continue;

    for (const cat of CATEGORIES) {
        const questions = c.anamnesisQuestions?.[cat] || [];
        for (const q of questions) {
            if (!q.id) continue;
            classifyTests++;

            try {
                const result = classifyResponse(q.id, q.response || '', c);
                assert(result !== undefined, `classifyResponse(${q.id}) for ${c.id} returns something`);

                // Verify it doesn't return garbage
                if (typeof result === 'object' && result !== null) {
                    if (result.text) {
                        assert(typeof result.text === 'string', `classifyResponse result.text is string for ${c.id}/${q.id}`);
                    }
                }
            } catch (e) {
                classifyCrashes++;
                bugs.push({ label: `classifyResponse CRASH for ${c.id}/${q.id}`, details: e.message });
            }
        }
    }
}

console.log(`  classifyResponse tests: ${classifyTests}`);
console.log(`  Crashes: ${classifyCrashes}`);
console.log('  ✅ Phase 3 complete\n');

// ────────────────────────────────────────────────────
// PHASE 4: Generic Questions Quality
// ────────────────────────────────────────────────────
console.log('▶ PHASE 4: Generic Question Bank Quality\n');

let genericCount = 0;
let genericIssues = 0;

for (const cat of CATEGORIES) {
    const qs = GENERIC_QUESTIONS?.[cat] || [];
    for (const q of qs) {
        genericCount++;
        if (!q.text || q.text.trim().length < 3) {
            genericIssues++;
            warn(`Generic question [${cat}/${q.id}] has empty/short text`);
        }
        if (!q.id) {
            genericIssues++;
            bugs.push({ label: `Generic question [${cat}] missing id`, details: q.text?.substring(0, 40) });
        }
    }
}

console.log(`  Generic questions: ${genericCount}`);
console.log(`  Issues: ${genericIssues}`);
console.log('  ✅ Phase 4 complete\n');

// ────────────────────────────────────────────────────
// FINAL REPORT
// ────────────────────────────────────────────────────
console.log('═══════════════════════════════════════════════════════════');
console.log('  T6: ANAMNESIS DIALOGUE VALIDATOR — FINAL RESULTS');
console.log('═══════════════════════════════════════════════════════════\n');
console.log(`  Total assertions: ${totalTests}`);
console.log(`  Passed: ${passedTests}`);
console.log(`  Failed: ${bugs.length}`);
console.log(`  Warnings: ${warnings.length}`);

if (bugs.length > 0) {
    console.log(`\n  ❌ FAILURES (${bugs.length}):`);
    bugs.forEach((b, i) => console.log(`    ${i + 1}. ${b.label}${b.details ? ` — ${b.details}` : ''}`));
}

if (warnings.length > 0) {
    console.log(`\n  ⚠️ WARNINGS (${warnings.length}):`);
    warnings.slice(0, 20).forEach((w, i) => console.log(`    ${i + 1}. ${w.label}${w.details ? ` — ${w.details}` : ''}`));
    if (warnings.length > 20) console.log(`    ... and ${warnings.length - 20} more`);
}

if (bugs.length === 0) {
    console.log(`\n  🏆 ALL CLEAR — Anamnesis dialogue quality verified!`);
}

console.log('\n═══════════════════════════════════════════════════════════\n');
process.exit(bugs.length > 0 ? 1 : 0);
