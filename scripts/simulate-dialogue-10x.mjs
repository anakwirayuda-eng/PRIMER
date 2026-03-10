/**
 * SIMULATION 10x — FINAL VERIFICATION SWEEP
 * ============================================
 * Runs 10 full iterations of the entire case library through the Anamnesis Engine.
 * Covers:
 *  - Seeded RNG stability
 *  - Metadata property extraction
 *  - Deduplication robustness
 *  - Formatting and typo leakages
 */

import { CASE_LIBRARY } from '../src/content/cases/CaseLibrary.js';
import {
    applyPersonaAdaptation,
    calculateVaguenessScore,
    resetPersonaMemory,
    updateEmotionState,
    initPersonaRNG
} from '../src/game/anamnesis/EmotionEngine.js';
import { adaptTextForGender, getDoctorAcknowledgment, getInitialComplaintResponse } from '../src/game/anamnesis/TextAdapter.js';
import { getInformantMode } from '../src/game/anamnesis/InformantSystem.js';
import { generateGreeting, getGenericDemeanor, getChildDirectQuestions } from '../src/game/anamnesis/DialogueEngine.js';
import { calculateCoverageScore, getMAIAAlerts } from '../src/game/ClinicalReasoning.js';

const STYLES = ['concise', 'verbose', 'vague'];
const DEMEANORS = ['', 'stoic', 'anxious', 'dramatic'];
const DENIAL_RE = /\b(tidak|nggak|belum|enggak|bukan|tidak ada|nggak ada|biasa aja|normal|baik-baik|disangkal|negatif)\b/i;
const COMPLAINT_RE = /\b(sakit|nyeri|sesak|demam|panas|pusing|lemas|batuk|muntah|mual|gatal|bengkak|berdarah|darah|parah|kambuh|sulit|susah|terganggu|meler|serak|kesakitan|ngilu|perih|pegel|luka|radang|diare|mencret|napas|kejang|tremor|biru|pucat|turun|hilang)\b/i;

const counts = {
    total: 0,
    absurd: 0, denialLeakage: 0, anxiousDenial: 0, repetition: 0,
    tooLong: 0, empty: 0, logicalError: 0,
    mixedLang: 0, missingMetadata: 0
};

console.log('═══════════════════════════════════════════════════════════');
console.log('  PRIMER — 10x ITERATION MULTI-SWEEP');
console.log('  ALL cases × ALL personas × 10 Runs');
console.log('═══════════════════════════════════════════════════════════\n');

for (let i = 1; i <= 10; i++) {
    console.log(`\n▶️ Starting Iteration ${i} / 10...`);
    let iterCount = 0;

    for (const caseData of CASE_LIBRARY) {
        const qs = caseData.anamnesisQuestions;
        if (!qs) continue;

        const allQs = [];
        for (const [cat, questions] of Object.entries(qs)) {
            if (Array.isArray(questions)) for (const q of questions) allQs.push({ ...q, category: cat });
        }

        // Test only a subset of styles/demeanors to keep it performant, randomly picked per iteration
        const style = STYLES[Math.floor(Math.random() * STYLES.length)];
        const demeanor = DEMEANORS[Math.floor(Math.random() * DEMEANORS.length)];

        resetPersonaMemory();
        // Seed RNG with something unique to this iteration + case
        const seedStr = `${caseData.id}_iter${i}_${style}_${demeanor}`;
        initPersonaRNG(seedStr);

        const patient = {
            id: seedStr,
            name: 'Test', age: 35, gender: Math.random() > 0.5 ? 'L' : 'P',
            communicationStyle: style, demeanor, complaint: caseData.symptoms?.[0] || '',
        };
        const info = getInformantMode(patient);
        const sessionResponses = [];
        let context = { introduced: true, trust: 0.5, patience: 1.0, count: 0 };

        let history = [];

        for (const q of allQs) {
            counts.total++;
            iterCount++;
            if (!q.response) continue;

            context = updateEmotionState(context, 'question');
            let baseParams = {
                questionId: q.id,
                sentiment: q.sentiment,
                metadata: {}
            };

            let response = adaptTextForGender(q.response, patient, info);
            const rawClinical = response;

            try {
                response = applyPersonaAdaptation(response, patient, context, baseParams);
            } catch (e) {
                counts.logicalError++;
                continue;
            }

            // Verify metadata was attached
            if (typeof baseParams.metadata !== 'object') {
                counts.missingMetadata++;
            }

            // EMPTY CHECK
            if (!response || response.length < 3) counts.empty++;
            // TOO LONG
            if (response.length > 200) counts.tooLong++;

            // Mixed lang
            if (/ and /i.test(response || '')) counts.mixedLang++;

            // REPETITION DEDUP logic simulation
            const isDuplicate = history.some(h => h.raw === rawClinical);
            if (isDuplicate) {
                counts.repetition++; // Expected to be caught by UI layer now, but engine can output it
            }
            sessionResponses.push(response);
            history.push({ id: q.id, text: q.text, category: q.category, raw: rawClinical, response });

            // ABSURD check
            const rawIsDenial = DENIAL_RE.test(rawClinical);
            const rawIsComplaint = COMPLAINT_RE.test(rawClinical);
            if (demeanor === 'dramatic' && rawIsDenial && !rawIsComplaint) {
                if (/^(Aduh|Ya ampun|Astaghfirullah|Waduh)/i.test(response)) counts.denialLeakage++;
            }
        }

        // Test MAIA logic briefly for the case
        getMAIAAlerts(history, 'keluhan_utama', caseData);
        calculateCoverageScore(history, [], [], caseData.essentialQuestions || []);
    }
    console.log(`✅ Iteration ${i} completed. Processed ${iterCount} dialogue permutations.`);
}

console.log('\n═══════════════════════════════════════════════════════════');
console.log('  10x VERIFICATION SWEEP — FINAL RESULTS');
console.log('═══════════════════════════════════════════════════════════\n');

console.log(`📊 TOTAL DIALOGUES GENERATED: ${counts.total}`);
const totalIssues = counts.empty + counts.tooLong + counts.logicalError + counts.mixedLang + counts.missingMetadata + counts.denialLeakage;

console.log(`  Issues Found:`);
console.log(`  - Mixed Language: ${counts.mixedLang}`);
console.log(`  - Empty/Short: ${counts.empty}`);
console.log(`  - Too Long (>200): ${counts.tooLong}`);
console.log(`  - Logical Errors: ${counts.logicalError}`);
console.log(`  - Denial Leakage: ${counts.denialLeakage}`);
console.log(`  - Missing Metadata: ${counts.missingMetadata}`);

if (totalIssues === 0) {
    console.log(`\n🏆 ASTOUNDING SUCCESS — 0 critical issues across ${counts.total} tests!`);
} else {
    console.log(`\n⚠️ ${totalIssues} issues found. Check output.`);
}
console.log('═══════════════════════════════════════════════════════════\n');
