/**
 * Deep Dialogue Simulation Script
 * Tests ALL cases × ALL persona combos × ALL questions
 * Checks for: repetition, absurdity, denial-on-dramatic, length anomalies,
 *              illogical responses, and template collisions.
 *
 * Run: node scripts/simulate-dialogue.mjs
 */

import { CASE_LIBRARY } from '../src/content/cases/CaseLibrary.js';
import {
    applyPersonaAdaptation,
    calculateVaguenessScore,
    pickFromPool,
    resetPersonaMemory
} from '../src/game/anamnesis/EmotionEngine.js';
import { adaptTextForGender, getPrefix, getDoctorAcknowledgment, getInitialComplaintResponse } from '../src/game/anamnesis/TextAdapter.js';
import { getInformantMode } from '../src/game/anamnesis/InformantSystem.js';
import { generateGreeting, getGenericDemeanor } from '../src/game/anamnesis/DialogueEngine.js';

// ── Persona Combos to Test ──
const COMMUNICATION_STYLES = ['concise', 'verbose', 'vague'];
const DEMEANORS = ['stoic', 'anxious', 'dramatic', 'normal'];

// ── Issue Trackers ──
const issues = {
    absurd: [],          // Denial + dramatic = contradiction
    repetition: [],      // Same phrase in same session
    tooLong: [],         // Response > 200 chars (UI overflow risk)
    tooShort: [],        // Adapted response < 5 chars (lost the content)
    emptyResponse: [],   // Response is empty/null
    denialLeakage: [],   // Denial getting dramatic wrapping
    logicalErrors: [],    // Contradictions or nonsensical adaptations
    templateStacking: [], // Multiple suffixes stacked
    lengthStats: [],      // Track length distribution
};

let totalTests = 0;
let totalCases = 0;
let totalQuestions = 0;

// ── Denial Detection Mirror (same as EmotionEngine) ──
const DENIAL_RE = /\b(tidak|nggak|belum|enggak|bukan|nggak ada|tidak ada|belum ada|tidak pernah|nggak pernah|belum pernah|biasa aja|normal|baik-baik|itu aja|itu saja|disangkal|negatif)\b/i;
const COMPLAINT_RE = /\b(sakit|nyeri|sesak|demam|panas|pusing|lemas|batuk|muntah|mual|gatal|bengkak|berdarah|darah|linu|pecah|berat|parah|kambuh|nggak bisa|sulit|susah|terganggu|meler|serak|kesakitan|ngilu|perih|pegel|luka|infeksi|radang|diare|mencret|napas|kejang|tremor|lumpuh|biru|pucat|kuning|buruk|turun|hilang|nggak kuat)\b/i;
const NEUTRAL_RE = /\b(suka|kadang-kadang|jarang|pernah|biasa|dulu|minum|makan|merokok|olahraga|kerja|tidur|bangun|anak|suami|istri|guru|petani|teman|tetangga|kantor|rumah|sekolah|kampung)\b/i;

// ── Run Simulation ──
console.log('═══════════════════════════════════════════════════════════');
console.log('  PRIMER — Deep Dialogue Simulation Audit');
console.log('  Testing ALL cases × ALL personas × ALL questions');
console.log('═══════════════════════════════════════════════════════════\n');

for (const caseData of CASE_LIBRARY) {
    totalCases++;
    const caseId = caseData.id;
    const questions = caseData.anamnesisQuestions;
    if (!questions) continue;

    // Flatten all questions from all categories
    const allQuestions = [];
    for (const [category, qs] of Object.entries(questions)) {
        if (!Array.isArray(qs)) continue;
        for (const q of qs) {
            allQuestions.push({ ...q, category });
        }
    }
    totalQuestions += allQuestions.length;

    // Test each persona combo
    for (const style of COMMUNICATION_STYLES) {
        for (const demeanor of DEMEANORS) {
            const patient = {
                id: `test_${caseId}`,
                name: 'Test Patient',
                age: caseData.category === 'Pediatric' ? 5 : 35,
                gender: Math.random() > 0.5 ? 'L' : 'P',
                communicationStyle: style,
                demeanor: demeanor === 'normal' ? '' : demeanor,
                complaint: caseData.symptoms?.[0] || '',
                social: {}
            };

            resetPersonaMemory();
            const sessionPhrases = [];
            const sessionResponses = [];

            // Simulate greeting
            try {
                const greetData = generateGreeting(patient, 'Dr. Test', 480, { introduced: false });
                if (!greetData.patientResponse || greetData.patientResponse.length < 3) {
                    issues.emptyResponse.push({
                        case: caseId, style, demeanor, phase: 'greeting',
                        text: greetData.patientResponse
                    });
                }
            } catch (e) {
                issues.logicalErrors.push({
                    case: caseId, style, demeanor, phase: 'greeting',
                    error: e.message
                });
            }

            // Simulate initial complaint
            try {
                const complaint = getInitialComplaintResponse(patient, caseData.symptoms?.[0] || 'sakit');
                if (!complaint.response || complaint.response.length < 3) {
                    issues.emptyResponse.push({
                        case: caseId, style, demeanor, phase: 'initial_complaint',
                        text: complaint.response
                    });
                }
            } catch (e) {
                issues.logicalErrors.push({
                    case: caseId, style, demeanor, phase: 'initial_complaint',
                    error: e.message
                });
            }

            // Simulate doctor acknowledgment
            try {
                const ack = getDoctorAcknowledgment(caseData.symptoms?.[0] || '', patient);
                if (!ack.text || ack.text.length < 3) {
                    issues.emptyResponse.push({
                        case: caseId, style, demeanor, phase: 'acknowledgment',
                        text: ack.text
                    });
                }
            } catch (e) {
                issues.logicalErrors.push({
                    case: caseId, style, demeanor, phase: 'acknowledgment',
                    error: e.message
                });
            }

            // Simulate each question 3 times (to catch randomness issues)
            for (let run = 0; run < 3; run++) {
                for (const q of allQuestions) {
                    totalTests++;
                    const baseResponse = q.response;
                    if (!baseResponse) continue;

                    // Apply gender adaptation
                    const info = getInformantMode(patient);
                    let response = adaptTextForGender(baseResponse, patient, info);
                    const rawClinical = response;

                    // Apply persona adaptation
                    const context = { trust: 0.5, patience: 0.8, count: run * allQuestions.length + allQuestions.indexOf(q) };
                    try {
                        response = applyPersonaAdaptation(response, patient, context, {
                            questionId: q.id
                        });
                    } catch (e) {
                        issues.logicalErrors.push({
                            case: caseId, style, demeanor, qId: q.id, run,
                            error: `applyPersonaAdaptation threw: ${e.message}`
                        });
                        continue;
                    }

                    // ── CHECK 1: Empty / Too Short ──
                    if (!response || response.length < 3) {
                        issues.emptyResponse.push({
                            case: caseId, style, demeanor, qId: q.id, run,
                            text: response
                        });
                    }

                    // ── CHECK 2: Too Long (UI overflow) ──
                    if (response.length > 200) {
                        issues.tooLong.push({
                            case: caseId, style, demeanor, qId: q.id, run,
                            len: response.length,
                            text: response.substring(0, 100) + '...'
                        });
                    }

                    // ── CHECK 3: Repetition within session ──
                    if (sessionResponses.includes(response) && response !== rawClinical) {
                        issues.repetition.push({
                            case: caseId, style, demeanor, qId: q.id, run,
                            text: response.substring(0, 80)
                        });
                    }
                    sessionResponses.push(response);

                    // ── CHECK 4: Denial + Dramatic Leakage ──
                    // Check if the RAW (pre-adaptation) response is a denial but got dramatic wrapping
                    if (demeanor === 'dramatic') {
                        const rawIsDenial = DENIAL_RE.test(rawClinical);
                        const rawIsNotComplaint = !COMPLAINT_RE.test(rawClinical);
                        const rawIsNeutral = NEUTRAL_RE.test(rawClinical) && rawIsNotComplaint;
                        const hasDramaticPrefix = /^(Aduh|Ya ampun|Astaghfirullah|Waduh|Duh|Haduh|Ya Allah|Ampun|Tolong|Innalillahi|Masyaallah|Astaga|Alamak|Kok bisa|Parah|Nggak kuat|Kasian|Susah banget|Ya Tuhan|Dok, saya|Mau pingsan|Saya tersiksa|Nggak tahan|Capek banget|Ya gimana|Wah gawat|Duh Gusti|Tobat|Hem|Saya pasrah|Udah putus|Bingung|Pening|Aduh aduh|Gimana ya|Duuh|Dok, serius)/i.test(response);
                        if ((rawIsDenial || rawIsNeutral) && hasDramaticPrefix) {
                            issues.denialLeakage.push({
                                case: caseId, qId: q.id, run,
                                raw: rawClinical.substring(0, 60),
                                adapted: response.substring(0, 80)
                            });
                        }
                    }

                    // ── CHECK 5: Absurdity — denial in RAW response but dramatic wrapping applied ──
                    if (demeanor === 'dramatic') {
                        const rawHasDenial = DENIAL_RE.test(rawClinical);
                        const hasDramaticSuffix = /( Parah| Nggak kuat| Mau nangis| Susah banget| Saya pasrah| Sakitnya| Tersiksa| Bikin lemas| Nggak tahan| Tolong, Dok| Mau mati rasanya| Mau pingsan)/i.test(response);
                        const hasDramaticPrefix = /^(Aduh|Ya ampun|Astaghfirullah|Waduh|Duh|Haduh|Ya Allah|Ampun|Tolong|Innalillahi)/i.test(response);
                        if (rawHasDenial && (hasDramaticSuffix || hasDramaticPrefix)) {
                            issues.absurd.push({
                                case: caseId, qId: q.id, run,
                                text: response.substring(0, 100),
                                reason: 'RAW is denial but dramatic wrapping was applied'
                            });
                        }
                    }

                    // ── CHECK 6: Template Stacking (multiple suffixes) ──
                    // Count how many suffix patterns appear in the response
                    const baseLen = rawClinical.length;
                    const addedLen = response.length - baseLen;
                    if (addedLen > 100) {
                        issues.templateStacking.push({
                            case: caseId, style, demeanor, qId: q.id, run,
                            baseLen, totalLen: response.length, addedLen,
                            text: response.substring(0, 120) + '...'
                        });
                    }

                    // ── CHECK 7: Logical error — stoic parenthetical inside dramatic prefix ──
                    if (demeanor !== 'stoic' && /\(tampak datar\)|\(menjawab singkat\)|\(ekspresi tidak berubah\)/.test(response)) {
                        issues.logicalErrors.push({
                            case: caseId, style, demeanor, qId: q.id, run,
                            error: 'Non-stoic patient showing stoic parenthetical',
                            text: response.substring(0, 80)
                        });
                    }

                    // Track length distribution
                    issues.lengthStats.push(response.length);
                }
            }
        }
    }
}

// ── Report ──
console.log(`\n📊 SIMULATION SUMMARY`);
console.log(`   Cases tested: ${totalCases}`);
console.log(`   Total questions: ${totalQuestions}`);
console.log(`   Total test iterations: ${totalTests}`);
console.log(`   Persona combos: ${COMMUNICATION_STYLES.length} × ${DEMEANORS.length} = ${COMMUNICATION_STYLES.length * DEMEANORS.length}\n`);

console.log('═══════════════════════════════════════════════════════════');
console.log('  RESULTS');
console.log('═══════════════════════════════════════════════════════════\n');

const printIssues = (label, list, maxShow = 10) => {
    if (list.length === 0) {
        console.log(`✅ ${label}: 0 issues\n`);
        return;
    }
    console.log(`❌ ${label}: ${list.length} issues found`);
    list.slice(0, maxShow).forEach((item, i) => {
        console.log(`   ${i + 1}. ${JSON.stringify(item)}`);
    });
    if (list.length > maxShow) console.log(`   ... and ${list.length - maxShow} more`);
    console.log('');
};

printIssues('ABSURD (denial + dramatic contradiction)', issues.absurd);
printIssues('DENIAL LEAKAGE (dramatic wrapping on denial)', issues.denialLeakage);
printIssues('REPETITION (same response in session)', issues.repetition);
printIssues('TOO LONG (>200 chars)', issues.tooLong);
printIssues('TOO SHORT (<3 chars)', issues.tooShort);
printIssues('EMPTY RESPONSE', issues.emptyResponse);
printIssues('LOGICAL ERRORS', issues.logicalErrors);
printIssues('TEMPLATE STACKING (>100 chars added)', issues.templateStacking);

// Length distribution
if (issues.lengthStats.length > 0) {
    const sorted = [...issues.lengthStats].sort((a, b) => a - b);
    const p10 = sorted[Math.floor(sorted.length * 0.1)];
    const p50 = sorted[Math.floor(sorted.length * 0.5)];
    const p90 = sorted[Math.floor(sorted.length * 0.9)];
    const p99 = sorted[Math.floor(sorted.length * 0.99)];
    const avg = Math.round(sorted.reduce((a, b) => a + b, 0) / sorted.length);
    console.log('📏 LENGTH DISTRIBUTION:');
    console.log(`   p10=${p10}  p50=${p50}  avg=${avg}  p90=${p90}  p99=${p99}  max=${sorted[sorted.length - 1]}\n`);

    // Length buckets
    const buckets = { '0-30': 0, '31-60': 0, '61-100': 0, '101-150': 0, '151-200': 0, '200+': 0 };
    for (const len of sorted) {
        if (len <= 30) buckets['0-30']++;
        else if (len <= 60) buckets['31-60']++;
        else if (len <= 100) buckets['61-100']++;
        else if (len <= 150) buckets['101-150']++;
        else if (len <= 200) buckets['151-200']++;
        else buckets['200+']++;
    }
    console.log('   Length buckets:');
    for (const [range, count] of Object.entries(buckets)) {
        const pct = ((count / sorted.length) * 100).toFixed(1);
        const bar = '█'.repeat(Math.round(pct / 2));
        console.log(`   ${range.padEnd(8)} ${String(count).padStart(5)} (${pct.padStart(5)}%) ${bar}`);
    }
}

// Total score
const totalIssues = issues.absurd.length + issues.denialLeakage.length +
    issues.repetition.length + issues.tooLong.length + issues.emptyResponse.length +
    issues.logicalErrors.length + issues.templateStacking.length;

console.log('\n═══════════════════════════════════════════════════════════');
if (totalIssues === 0) {
    console.log('  🏆 ALL CHECKS PASSED — 0 issues found!');
} else {
    console.log(`  ⚠️ ${totalIssues} total issues found — review above`);
}
console.log('═══════════════════════════════════════════════════════════\n');
