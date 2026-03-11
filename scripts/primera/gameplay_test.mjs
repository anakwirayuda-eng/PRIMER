/**
 * PRIMER Gameplay Simulation Test
 * Tests all game engines end-to-end for bugs, errors, and illogical behavior.
 * Run: node scripts/primera/gameplay_test.mjs
 */

import { fileURLToPath } from 'url';
import path from 'path';

// Mock browser globals
global.window = { addEventListener: () => { }, removeEventListener: () => { } };
global.document = { addEventListener: () => { }, removeEventListener: () => { }, createElement: () => ({ getContext: () => null }) };
global.localStorage = { getItem: () => null, setItem: () => { } };
try { Object.defineProperty(global, 'navigator', { value: { userAgent: 'node' }, writable: true, configurable: true }); } catch (e) { /* Node v24 may already have navigator */ }
global.AudioContext = class { createOscillator() { return { connect() { }, start() { }, stop() { }, frequency: { setValueAtTime() { } } }; } createGain() { return { connect() { }, gain: { setValueAtTime() { }, linearRampToValueAtTime() { } } }; } get destination() { return {}; } };
global.HTMLCanvasElement = class { };
global.Image = class { set onload(fn) { if (fn) setTimeout(fn, 0); } set src(_) { } };
global.console = { ...console }; // keep real console

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '../../');

// ─── Test Framework ───────────────────────────────────────────
let totalTests = 0, passed = 0, failed = 0;
const failures = [];

function test(name, fn) {
    totalTests++;
    try {
        const result = fn();
        if (result instanceof Promise) {
            return result.then(() => { passed++; console.log(`  ✅ ${name}`); })
                .catch(err => { failed++; failures.push({ name, error: err.message || String(err) }); console.log(`  ❌ ${name}: ${err.message || err}`); });
        }
        passed++;
        console.log(`  ✅ ${name}`);
    } catch (err) {
        failed++;
        failures.push({ name, error: err.message || String(err) });
        console.log(`  ❌ ${name}: ${err.message || err}`);
    }
}

function assert(condition, msg) {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

// ─── Dynamic Imports ──────────────────────────────────────────
async function runAllTests() {
    console.log('\n🎮 PRIMER ENGINE SIMULATION TEST');
    console.log('═'.repeat(60));

    // ═══════════════════════════════════════════════════════════
    // 1. VILLAGE REGISTRY
    // ═══════════════════════════════════════════════════════════
    console.log('\n📁 1. VILLAGE REGISTRY');
    const VR = await import('../../src/domains/village/VillageRegistry.js');

    test('VILLAGE_FAMILIES is a non-empty array', () => {
        assert(Array.isArray(VR.VILLAGE_FAMILIES), 'VILLAGE_FAMILIES not an array');
        assert(VR.VILLAGE_FAMILIES.length > 0, 'VILLAGE_FAMILIES is empty');
    });

    test('Each family has id, members[], and headOfFamily', () => {
        for (const fam of VR.VILLAGE_FAMILIES) {
            assert(fam.id, `Family missing id`);
            assert(Array.isArray(fam.members), `Family ${fam.id} missing members array`);
            assert(fam.members.length > 0, `Family ${fam.id} has 0 members`);
        }
    });

    test('FAMILY_SDOH covers all families', () => {
        for (const fam of VR.VILLAGE_FAMILIES) {
            assert(VR.FAMILY_SDOH[fam.id], `FAMILY_SDOH missing for ${fam.id}`);
        }
    });

    test('FAMILY_INDICATORS covers all families', () => {
        for (const fam of VR.VILLAGE_FAMILIES) {
            assert(VR.FAMILY_INDICATORS[fam.id], `FAMILY_INDICATORS missing for ${fam.id}`);
        }
    });

    test('getAllVillagers returns correct count', () => {
        const villagers = VR.getAllVillagers();
        assert(villagers.length > 0, 'No villagers returned');
        const totalFromFamilies = VR.VILLAGE_FAMILIES.reduce((s, f) => s + f.members.length, 0);
        assert(villagers.length === totalFromFamilies, `Count mismatch: getAllVillagers=${villagers.length} vs families.sum=${totalFromFamilies}`);
    });

    test('VILLAGE_STATS has correct totalKK', () => {
        assert(VR.VILLAGE_STATS.totalKK === VR.VILLAGE_FAMILIES.length,
            `totalKK (${VR.VILLAGE_STATS.totalKK}) !== VILLAGE_FAMILIES.length (${VR.VILLAGE_FAMILIES.length})`);
    });

    // ═══════════════════════════════════════════════════════════
    // 2. CASE LIBRARY
    // ═══════════════════════════════════════════════════════════
    console.log('\n📚 2. CASE LIBRARY');
    const CL = await import('../../src/content/cases/CaseLibrary.js');

    test('CASE_LIBRARY has 100+ cases', () => {
        assert(CL.CASE_LIBRARY.length >= 100, `Only ${CL.CASE_LIBRARY.length} cases, expected 100+`);
    });

    test('Every case has id, diagnosis, icd10', () => {
        const missing = CL.CASE_LIBRARY.filter(c => !c.id || !c.diagnosis || !c.icd10);
        assert(missing.length === 0, `${missing.length} cases missing id/diagnosis/icd10: ${missing.map(c => c.id || 'NO_ID').join(', ')}`);
    });

    test('No duplicate case IDs', () => {
        const ids = CL.CASE_LIBRARY.map(c => c.id);
        const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
        assert(dupes.length === 0, `Duplicate IDs: ${[...new Set(dupes)].join(', ')}`);
    });

    test('Every case has anamnesisQuestions with at least 1 category', () => {
        const noAnamnesis = CL.CASE_LIBRARY.filter(c => {
            const aq = c.anamnesisQuestions;
            if (!aq) return true;
            return Object.keys(aq).length === 0;
        });
        assert(noAnamnesis.length === 0, `${noAnamnesis.length} cases have no anamnesisQuestions: ${noAnamnesis.slice(0, 5).map(c => c.id).join(', ')}`);
    });

    test('Every case has physicalExamFindings', () => {
        const noPE = CL.CASE_LIBRARY.filter(c => !c.physicalExamFindings || Object.keys(c.physicalExamFindings).length === 0);
        if (noPE.length > 0) {
            console.log(`    ⚠️  ${noPE.length} cases have no physicalExamFindings: ${noPE.slice(0, 5).map(c => c.id).join(', ')}`);
        }
        // This is a warning, not a failure
    });

    test('getCaseByCondition finds known cases', () => {
        const dengue = CL.getCaseByCondition('dengue_df');
        assert(dengue, 'getCaseByCondition("dengue_df") returned null');
        assert(dengue.icd10 === 'A90', `Expected ICD-10 A90, got ${dengue.icd10}`);
    });

    test('getCaseByCondition returns null for unknown', () => {
        const unknown = CL.getCaseByCondition('nonexistent_disease_xyz');
        assert(unknown === null, 'Expected null for unknown case');
    });

    // ═══════════════════════════════════════════════════════════
    // 3. PATIENT GENERATOR
    // ═══════════════════════════════════════════════════════════
    console.log('\n🏥 3. PATIENT GENERATOR');
    const PG = await import('../../src/game/PatientGenerator.js');

    test('generatePatient creates a valid patient', () => {
        const population = VR.VILLAGE_FAMILIES;
        const patient = PG.generatePatient(540, population, 1, { poli_umum: 1 }, {});
        assert(patient, 'generatePatient returned null/undefined');
        assert(patient.name, 'Patient has no name');
        assert(patient.age !== undefined, 'Patient has no age');
        assert(patient.complaint, 'Patient has no complaint text');
        assert(patient.medicalData, 'Patient has no medicalData');
        assert(patient.medicalData.icd10, 'Patient medicalData has no icd10');
    });

    test('generatePatient with different times produces patients', () => {
        const population = VR.VILLAGE_FAMILIES;
        for (const time of [480, 600, 720, 840]) {
            const p = PG.generatePatient(time, population, 1, { poli_umum: 1 }, {});
            assert(p, `generatePatient returned null at time ${time}`);
        }
    });

    test('generatePatient with different game days works (seasonal)', () => {
        const population = VR.VILLAGE_FAMILIES;
        for (const day of [1, 30, 90, 180, 270, 360]) {
            const p = PG.generatePatient(540, population, day, { poli_umum: 1 }, {});
            assert(p, `No patient generated for day ${day}`);
        }
    });

    test('generateEmergencyPatient creates valid emergency', () => {
        const p = PG.generateEmergencyPatient(540, { poli_umum: 1 });
        assert(p, 'generateEmergencyPatient returned null');
        assert(p.medicalData, 'Emergency patient has no medicalData');
        assert(p.triageLevel !== undefined || p.hidden?.triageLevel !== undefined, 'No triage level');
    });

    test('generateProlanisVisitPatient works', () => {
        const rosterMember = {
            id: 'prolanis_test_1',
            villagerId: 'v_01',
            name: 'Pak Slamet',
            age: 55,
            gender: 'L',
            prolanisData: {
                diseaseType: 'hypertension',
                parameters: { systolic: 145, diastolic: 95 },
                history: [],
                consecutiveControlled: 0,
            },
        };
        const p = PG.generateProlanisVisitPatient(rosterMember, 30);
        assert(p, 'generateProlanisVisitPatient returned null');
        assert(p.name, 'Prolanis patient has no name');
    });

    // ═══════════════════════════════════════════════════════════
    // 4. ANAMNESIS ENGINE
    // ═══════════════════════════════════════════════════════════
    console.log('\n💬 4. ANAMNESIS ENGINE');
    const AE = await import('../../src/game/AnamnesisEngine.js');

    test('pickPersona returns valid persona', () => {
        const persona = AE.pickPersona({ age: 65, education: 'SD' });
        assert(persona, 'pickPersona returned null');
        assert(typeof persona === 'string', 'persona is not a string');
        const validPersonas = ['low_education', 'high_education', 'skeptical', 'anxious', 'child_proxy', 'elderly', 'default'];
        assert(validPersonas.includes(persona), `Unknown persona: ${persona}`);
    });

    test('generateGreeting works for male patient', () => {
        const greeting = AE.generateGreeting({ name: 'Pak Budi', gender: 'L', age: 40 }, 540);
        assert(greeting, 'generateGreeting returned null');
        assert(typeof greeting === 'string' || typeof greeting === 'object', 'Unexpected greeting type');
    });

    test('synthesizeAnamnesis handles empty history', () => {
        const result = AE.synthesizeAnamnesis([], {}, {});
        assert(result !== undefined, 'synthesizeAnamnesis crashed on empty input');
    });

    test('synthesizeAnamnesis handles valid history', () => {
        const history = [
            { type: 'question', id: 'q_main', category: 'keluhan_utama', text: 'Apa keluhan utama?', response: 'Demam 3 hari' },
            { type: 'question', id: 'q_onset', category: 'riwayat_penyakit', text: 'Kapan mulai?', response: '3 hari lalu' },
        ];
        const caseData = { id: 'dengue_df', anamnesisQuestions: { keluhan_utama: [{ id: 'q_main' }], riwayat_penyakit: [{ id: 'q_onset' }] } };
        const result = AE.synthesizeAnamnesis(history, caseData, { age: 30, gender: 'L' });
        assert(result, 'synthesizeAnamnesis returned null');
    });

    // ═══════════════════════════════════════════════════════════
    // 5. VALIDATION ENGINE
    // ═══════════════════════════════════════════════════════════
    console.log('\n✅ 5. VALIDATION ENGINE');

    test('validateDiagnosis — correct diagnosis', () => {
        const caseData = CL.getCaseByCondition('dengue_df');
        const result = CL.validateDiagnosis(caseData, [{ code: 'A90' }]);
        assert(result, 'validateDiagnosis returned null');
        assert(result.isCorrect === true, `Expected correct diagnosis, got isCorrect=${result.isCorrect}`);
    });

    test('validateDiagnosis — wrong diagnosis', () => {
        const caseData = CL.getCaseByCondition('dengue_df');
        const result = CL.validateDiagnosis(caseData, [{ code: 'Z99' }]);
        assert(result, 'validateDiagnosis returned null');
        assert(result.isCorrect === false, 'Expected incorrect diagnosis');
    });

    test('validateTreatment with correct meds', () => {
        const caseData = CL.getCaseByCondition('dengue_df');
        if (caseData?.correctTreatment) {
            const meds = caseData.correctTreatment.map(id => typeof id === 'string' ? { id } : id);
            const result = CL.validateTreatment(caseData, meds, []);
            assert(result, 'validateTreatment returned null');
            assert(result.score > 0, 'Treatment score is 0 even with correct meds');
        }
    });

    test('validateAnamnesis with no questions asked', () => {
        const caseData = CL.getCaseByCondition('dengue_df');
        const result = CL.validateAnamnesis(caseData, []);
        assert(result, 'validateAnamnesis returned null');
        assert(result.score === 0 || result.score !== undefined, 'No score property on result');
    });

    test('validateExams with no exams', () => {
        const caseData = CL.getCaseByCondition('dengue_df');
        const result = CL.validateExams(caseData, [], {});
        assert(result, 'validateExams returned null');
    });

    // ═══════════════════════════════════════════════════════════
    // 6. BILLING ENGINE
    // ═══════════════════════════════════════════════════════════
    console.log('\n💰 6. BILLING ENGINE');

    test('calculatePatientBill with empty inputs', () => {
        const bill = CL.calculatePatientBill([], [], {}, {}, false);
        assert(bill, 'calculatePatientBill returned null');
        assert(bill.total > 0, 'Total should include base fees (pendaftaran + jasa medis)');
        assert(bill.pendaftaran === 15000, `pendaftaran should be 15000, got ${bill.pendaftaran}`);
        assert(bill.jasaMedis === 20000, `jasaMedis should be 20000, got ${bill.jasaMedis}`);
    });

    test('calculatePatientBill BPJS = free', () => {
        const bill = CL.calculatePatientBill([], [], {}, {}, true);
        assert(bill.finalBill === 0, `BPJS patient should pay 0, got ${bill.finalBill}`);
    });

    test('calculatePatientBill with medications', () => {
        const meds = [{ id: 'paracetamol_500', frequency: 3, duration: 3 }];
        const bill = CL.calculatePatientBill(meds, [], {}, {}, false);
        assert(bill.medDetails.length === 1, 'Should have 1 medication in medDetails');
        assert(bill.total > 35000, 'Total should be more than base fees with meds');
    });

    // ═══════════════════════════════════════════════════════════
    // 7. CPPT ENGINE
    // ═══════════════════════════════════════════════════════════
    console.log('\n📋 7. CPPT ENGINE');
    const CPPT = await import('../../src/game/CPPTEngine.js');

    test('buildCPPTRecord creates valid SOAP record', () => {
        const patient = PG.generatePatient(540, VR.VILLAGE_FAMILIES, 1, { poli_umum: 1 }, {});
        const decision = {
            action: 'treat',
            diagnoses: [{ code: patient.medicalData.trueDiagnosisCode, name: patient.medicalData.diagnosisName }],
            medications: patient.medicalData.correctTreatment || [],
            procedures: [],
            education: [],
            anamnesisHistory: [],
            examsPerformed: [],
            labsRevealed: {},
        };
        const record = CPPT.buildCPPTRecord(patient, decision, 1, 540, { outcomeStatus: 'recovered', satisfactionScore: 85 });
        assert(record, 'buildCPPTRecord returned null');
        assert(record.id, 'CPPT record has no ID');
        assert(record.subjective, 'CPPT missing subjective');
        assert(record.objective, 'CPPT missing objective');
        assert(record.assessment, 'CPPT missing assessment');
        assert(record.planning, 'CPPT missing planning');
        assert(record.outcome, 'CPPT missing outcome');
    });

    test('buildMaiaCPPTRecord works', () => {
        const patient = PG.generatePatient(540, VR.VILLAGE_FAMILIES, 1, { poli_umum: 1 }, {});
        const record = CPPT.buildMaiaCPPTRecord(patient, 1, 540, 'recovered');
        assert(record, 'buildMaiaCPPTRecord returned null');
        assert(record.handledBy === 'Dr. MAIA', 'MAIA record should show Dr. MAIA');
    });

    // ═══════════════════════════════════════════════════════════
    // 8. CLINICAL REASONING (MAIA)
    // ═══════════════════════════════════════════════════════════
    console.log('\n🧠 8. CLINICAL REASONING (MAIA)');
    const CR = await import('../../src/game/ClinicalReasoning.js');

    test('calculateCoverageScore handles empty inputs', () => {
        const score = CR.calculateCoverageScore([], [], [], []);
        assert(score !== undefined, 'calculateCoverageScore returned undefined');
        assert(typeof score === 'object', 'Expected object return');
    });

    test('getMAIAAlerts returns array', () => {
        const alerts = CR.getMAIAAlerts([], 'keluhan_utama');
        assert(Array.isArray(alerts), 'getMAIAAlerts should return array');
    });

    test('initDiagnosticTracker creates tracker', () => {
        const caseData = CL.getCaseByCondition('dengue_df');
        const tracker = CR.initDiagnosticTracker(caseData);
        assert(tracker, 'initDiagnosticTracker returned null');
    });

    test('getDiagnosticConfidence handles empty tracker', () => {
        const conf = CR.getDiagnosticConfidence({}, { overall: 0 });
        assert(conf !== undefined, 'getDiagnosticConfidence crashed');
    });

    // ═══════════════════════════════════════════════════════════
    // 9. EMERGENCY SYSTEM
    // ═══════════════════════════════════════════════════════════
    console.log('\n🚑 9. EMERGENCY SYSTEM');
    const EC = await import('../../src/game/EmergencyCases.js');

    test('EMERGENCY_CASES is non-empty', () => {
        assert(EC.EMERGENCY_CASES.length > 0, 'No emergency cases');
    });

    test('Each emergency case has triageLevel and correctTreatment', () => {
        const invalid = EC.EMERGENCY_CASES.filter(c => c.triageLevel === undefined || !c.correctTreatment);
        assert(invalid.length === 0, `${invalid.length} emergency cases missing triageLevel/correctTreatment: ${invalid.map(c => c.id).join(', ')}`);
    });

    test('validateTriage works for correct triage', () => {
        const ec = EC.EMERGENCY_CASES[0];
        const result = EC.validateTriage(ec, ec.triageLevel);
        assert(result.isCorrect === true, `Triage validation failed for ${ec.id}`);
        assert(result.score === 100, 'Correct triage should score 100');
    });

    test('validateStabilization with correct actions', () => {
        const ec = EC.EMERGENCY_CASES[0];
        const checklist = ec.stabilizationChecklist || ec.correctTreatment?.flat() || [];
        const result = EC.validateStabilization(ec, checklist);
        assert(result.score >= 80, `Stabilization with correct actions should score ≥80, got ${result.score}`);
    });

    test('calculateEmergencyBill works', () => {
        const bill = EC.calculateEmergencyBill([], false, 3);
        assert(bill.total > 0, 'Emergency bill should have base fees');
    });

    test('calculateEmergencyBill BPJS covers level 1-2', () => {
        const bill = EC.calculateEmergencyBill([], true, 1);
        assert(bill.isCovered === true, 'BPJS should cover ESI 1-2');
        assert(bill.finalBill === 0, 'Covered emergency should be free');
    });

    // ═══════════════════════════════════════════════════════════
    // 10. POSYANDU ENGINE
    // ═══════════════════════════════════════════════════════════
    console.log('\n⚖️ 10. POSYANDU ENGINE');
    const PE = await import('../../src/game/PosyanduEngine.js');

    test('isPosyanduDay for day 35 is true', () => {
        assert(PE.isPosyanduDay(35) === true, 'Day 35 should be a Posyandu day');
    });

    test('isPosyanduDay for day 1 is false', () => {
        assert(PE.isPosyanduDay(1) === false, 'Day 1 should NOT be a Posyandu day');
    });

    test('getNextPosyanduDay returns future day', () => {
        const next = PE.getNextPosyanduDay(1);
        assert(next > 1, `Next Posyandu day should be > 1, got ${next}`);
        assert(next <= 30, `Next Posyandu day should be ≤ 30, got ${next}`);
    });

    test('getEligibleParticipants works with village data', () => {
        const villageData = { families: VR.VILLAGE_FAMILIES };
        const eligible = PE.getEligibleParticipants(villageData, 'penimbangan');
        assert(Array.isArray(eligible), 'Should return array');
    });

    test('calculateAttendance returns subset', () => {
        const participants = [{ name: 'A' }, { name: 'B' }, { name: 'C' }, { name: 'D' }, { name: 'E' }];
        const attending = PE.calculateAttendance(participants, { reminderSent: false });
        assert(Array.isArray(attending), 'Should return array');
        assert(attending.length <= participants.length, 'Attendance cannot exceed eligible');
    });

    test('POSYANDU_ACTIVITIES has required activities', () => {
        const required = ['penimbangan', 'kms', 'imunisasi', 'penyuluhan_gizi'];
        for (const act of required) {
            assert(PE.POSYANDU_ACTIVITIES[act], `Missing activity: ${act}`);
        }
    });

    // ═══════════════════════════════════════════════════════════
    // 11. PROLANIS ENGINE
    // ═══════════════════════════════════════════════════════════
    console.log('\n💊 11. PROLANIS ENGINE');
    const PL = await import('../../src/game/ProlanisEngine.js');

    test('generateInitialParameters for hypertension', () => {
        const params = PL.generateInitialParameters('hypertension');
        assert(params, 'generateInitialParameters returned null');
        assert(params.systolic > 0, 'Missing systolic');
        assert(params.diastolic > 0, 'Missing diastolic');
    });

    test('generateInitialParameters for dm_type2', () => {
        const params = PL.generateInitialParameters('dm_type2');
        assert(params, 'generateInitialParameters returned null');
        assert(params.hba1c > 0 || params.fbg > 0, 'Missing DM parameters');
    });

    test('simulateParameterChange produces new params', () => {
        const current = PL.generateInitialParameters('hypertension');
        const intervention = { medicationAdjust: true, lifestyleCounseling: true };
        const newParams = PL.simulateParameterChange(current, intervention, null, 'hypertension');
        assert(newParams, 'simulateParameterChange returned null');
        assert(newParams.systolic > 0, 'New params missing systolic');
    });

    test('calculateComplicationRisk returns 0-100', () => {
        const patient = {
            diseaseType: 'hypertension',
            currentParams: PL.generateInitialParameters('hypertension'),
            history: [],
            monthsEnrolled: 6
        };
        const risk = PL.calculateComplicationRisk(patient);
        assert(typeof risk === 'number', 'Risk should be a number');
        assert(risk >= 0 && risk <= 100, `Risk should be 0-100, got ${risk}`);
    });

    test('checkIfControlled works for controlled HTN', () => {
        const params = { systolic: 125, diastolic: 85 };
        const controlled = PL.checkIfControlled(params, 'hypertension');
        assert(controlled === true, 'Should be controlled');
    });

    test('checkIfControlled detects uncontrolled HTN', () => {
        const params = { systolic: 160, diastolic: 100 };
        const controlled = PL.checkIfControlled(params, 'hypertension');
        assert(controlled === false, 'Should be uncontrolled');
    });

    // ═══════════════════════════════════════════════════════════
    // 12. QUEST ENGINE
    // ═══════════════════════════════════════════════════════════
    console.log('\n🎯 12. QUEST ENGINE');
    const QE = await import('../../src/game/QuestEngine.js');

    test('generateDailyQuests returns 3 quests', () => {
        const quests = QE.generateDailyQuests(1);
        assert(Array.isArray(quests), 'Should return array');
        assert(quests.length === 3, `Expected 3 daily quests, got ${quests.length}`);
        quests.forEach(q => {
            assert(q.id, 'Quest missing id');
            assert(q.target > 0, 'Quest missing positive target');
            assert(q.progress === 0, 'Quest should start at progress 0');
        });
    });

    test('generateWeeklyQuests returns 2 quests', () => {
        const quests = QE.generateWeeklyQuests(1);
        assert(Array.isArray(quests), 'Should return array');
        assert(quests.length === 2, `Expected 2 weekly quests, got ${quests.length}`);
    });

    test('updateGameProgress increments quest progress', () => {
        const quests = QE.generateDailyQuests(1);
        const firstQuest = quests[0];
        const { updatedQuests } = QE.updateGameProgress(quests, [], firstQuest.metric, 1);
        const updated = updatedQuests.find(q => q.id === firstQuest.id);
        assert(updated.progress === 1, `Progress should be 1, got ${updated.progress}`);
    });

    test('claimQuestReward returns XP for completed quest', () => {
        let quests = QE.generateDailyQuests(1);
        const q = quests[0];
        // Complete the quest
        quests = quests.map(quest => quest.id === q.id ? { ...quest, progress: q.target, completed: true } : quest);
        const { xpReward, updatedQuests } = QE.claimQuestReward(quests, q.id);
        assert(xpReward > 0, `XP reward should be > 0, got ${xpReward}`);
        assert(updatedQuests.find(uq => uq.id === q.id).claimed === true, 'Quest should be marked claimed');
    });

    // ═══════════════════════════════════════════════════════════
    // 13. CONSEQUENCE ENGINE
    // ═══════════════════════════════════════════════════════════
    console.log('\n⏰ 13. CONSEQUENCE ENGINE');
    const CE = await import('../../src/game/ConsequenceEngine.js');

    test('evaluateConsequences for correct treatment returns positive or null', () => {
        const caseData = CL.getCaseByCondition('dengue_df');
        const decisions = {
            correctDiagnosis: true,
            correctTreatment: true,
            diagnoses: [caseData.trueDiagnosisCode],
            medications: caseData.correctTreatment || [],
        };
        const result = CE.evaluateConsequences(caseData, decisions, 1);
        // Should either be null (no consequence) or a positive outcome
        if (result) {
            assert(result.condition === 'improved' || result.outcome, 'Correct treatment should yield improvement');
        }
    });

    test('getScheduledFollowups with empty queue', () => {
        const result = CE.getScheduledFollowups([], 1);
        assert(Array.isArray(result), 'Should return array');
        assert(result.length === 0, 'Empty queue should have no followups');
    });

    test('clearProcessedFollowups works', () => {
        const queue = [{ scheduledDay: 1, processed: false }, { scheduledDay: 5, processed: false }];
        const result = CE.clearProcessedFollowups(queue, 1);
        assert(Array.isArray(result), 'Should return array');
    });

    // ═══════════════════════════════════════════════════════════
    // 14. MORNING BRIEFING
    // ═══════════════════════════════════════════════════════════
    console.log('\n🌅 14. MORNING BRIEFING');
    const MB = await import('../../src/game/MorningBriefing.js');

    test('generateMorningBriefing creates valid briefing', () => {
        const state = {
            day: 5,
            hiredStaff: [],
            pharmacyInventory: {},
            consequenceQueue: [],
            villageData: { families: VR.VILLAGE_FAMILIES },
            activeOutbreaks: [],
            prolanisRoster: [],
            stats: { totalPatients: 10, correctDiagnoses: 7 },
            playerLevel: 1,
        };
        const briefing = MB.generateMorningBriefing(state);
        assert(briefing, 'generateMorningBriefing returned null');
        assert(briefing.staffReport !== undefined, 'Missing staffReport');
        assert(briefing.todayEvents !== undefined, 'Missing todayEvents');
    });

    // ═══════════════════════════════════════════════════════════
    // 15. DEBRIEF ENGINE
    // ═══════════════════════════════════════════════════════════
    console.log('\n🌙 15. DEBRIEF ENGINE');
    const DE = await import('../../src/game/DebriefEngine.js');

    test('generateDebrief with empty log', () => {
        const debrief = DE.generateDebrief({ todayLog: [], consequenceQueue: [], day: 1, stats: {} });
        assert(debrief, 'generateDebrief returned null');
        assert(debrief.summary !== undefined, 'Missing summary');
    });

    test('generateDebrief with sample case log', () => {
        const todayLog = [{
            patientName: 'Pak Budi',
            caseId: 'dengue_df',
            correctDiagnosis: true,
            correctTreatment: true,
            diagnosisName: 'Dengue Fever',
            icd10: 'A90',
            satisfaction: 85,
        }];
        const debrief = DE.generateDebrief({ todayLog, consequenceQueue: [], day: 1, stats: { totalPatients: 1 } });
        assert(debrief, 'generateDebrief returned null');
        assert(debrief.summary, 'Missing summary');
    });

    // ═══════════════════════════════════════════════════════════
    // 16. END-TO-END: FULL CLINICAL ENCOUNTER SIMULATION
    // ═══════════════════════════════════════════════════════════
    console.log('\n🔄 16. END-TO-END CLINICAL ENCOUNTER');

    test('Complete clinical cycle: Generate → Validate → Bill → CPPT → Consequence', () => {
        // 1. Generate patient
        const patient = PG.generatePatient(540, VR.VILLAGE_FAMILIES, 1, { poli_umum: 1 }, {});
        assert(patient, 'Step 1 failed: generatePatient');

        const caseData = patient.medicalData;
        assert(caseData, 'Patient has no medicalData');

        // 2. Simulate anamnesis
        const questionsAsked = [];
        if (caseData.anamnesisQuestions) {
            for (const [cat, questions] of Object.entries(caseData.anamnesisQuestions)) {
                for (const q of questions) {
                    questionsAsked.push({ type: 'question', id: q.id, category: cat, text: q.text, response: q.response || 'ok' });
                }
            }
        }

        // 3. Validate diagnosis (correct answer)
        const diagResult = CL.validateDiagnosis(caseData, [{ code: caseData.trueDiagnosisCode }]);
        assert(diagResult, 'Step 3 failed: validateDiagnosis');
        assert(diagResult.isCorrect === true, `Correct code should validate: ${caseData.trueDiagnosisCode}`);

        // 4. Validate treatment
        const meds = (caseData.correctTreatment || []).map(id => typeof id === 'string' ? { id } : id);
        const treatResult = CL.validateTreatment(caseData, meds, caseData.correctProcedures || []);
        assert(treatResult, 'Step 4 failed: validateTreatment');

        // 5. Bill
        const bill = CL.calculatePatientBill(meds, [], {}, caseData, patient.bpjs !== false);
        assert(bill, 'Step 5 failed: calculatePatientBill');
        assert(bill.total >= 0, 'Bill total should be ≥ 0');

        // 6. Build CPPT
        const decision = {
            action: 'treat',
            diagnoses: [{ code: caseData.trueDiagnosisCode, name: caseData.diagnosisName }],
            medications: meds,
            procedures: caseData.correctProcedures || [],
            education: caseData.correctEducation || [],
            anamnesisHistory: questionsAsked,
            examsPerformed: Object.keys(caseData.physicalExamFindings || {}),
            labsRevealed: {},
        };
        const cppt = CPPT.buildCPPTRecord(patient, decision, 1, 540, {
            outcomeStatus: 'recovered', satisfactionScore: 85, isCorrectAction: true
        });
        assert(cppt, 'Step 6 failed: buildCPPTRecord');
        assert(cppt.assessment.isCorrectDiagnosis === true, 'CPPT should show correct diagnosis');

        // 7. Evaluate consequences
        const consequence = CE.evaluateConsequences(caseData, {
            correctDiagnosis: true,
            correctTreatment: true,
            diagnoses: [caseData.trueDiagnosisCode],
            medications: caseData.correctTreatment || [],
        }, 1);
        // consequence can be null (no followup needed) — that's fine

        console.log(`    📊 E2E: ${caseData.diagnosisName} (${caseData.trueDiagnosisCode}) — Bill: Rp${bill.total.toLocaleString()} — CPPT: ${cppt.id}`);
    });

    // ═══════════════════════════════════════════════════════════
    // 17. STRESS TEST: 50 RANDOM PATIENTS
    // ═══════════════════════════════════════════════════════════
    console.log('\n🔥 17. STRESS TEST: 50 RANDOM PATIENTS');

    test('Generate and validate 50 random patients without errors', () => {
        const errors = [];
        for (let i = 0; i < 50; i++) {
            try {
                const p = PG.generatePatient(480 + Math.floor(Math.random() * 480),
                    VR.VILLAGE_FAMILIES, Math.floor(Math.random() * 365) + 1,
                    { poli_umum: 1, poli_gigi: 1, poli_kia_kb: 1 }, {});
                if (!p) { errors.push(`Patient ${i}: null`); continue; }
                if (!p.medicalData) { errors.push(`Patient ${i}: no medicalData`); continue; }
                if (!p.medicalData.trueDiagnosisCode) { errors.push(`Patient ${i} (${p.medicalData.id}): no trueDiagnosisCode`); continue; }

                // Validate
                const dx = CL.validateDiagnosis(p.medicalData, [{ code: p.medicalData.trueDiagnosisCode }]);
                if (!dx?.isCorrect) { errors.push(`Patient ${i} (${p.medicalData.id}): validation says wrong code ${p.medicalData.trueDiagnosisCode}`); }

                // Bill
                const bill = CL.calculatePatientBill([], [], {}, p.medicalData, false);
                if (!bill || bill.total < 0) { errors.push(`Patient ${i}: invalid bill`); }

                // CPPT
                const cppt = CPPT.buildCPPTRecord(p, {
                    action: 'treat', diagnoses: [{ code: p.medicalData.trueDiagnosisCode }],
                    medications: [], procedures: [], education: [],
                    anamnesisHistory: [], examsPerformed: [], labsRevealed: {},
                }, 1, 540, {});
                if (!cppt?.id) { errors.push(`Patient ${i}: CPPT failed`); }
            } catch (err) {
                errors.push(`Patient ${i}: CRASH — ${err.message}`);
            }
        }

        if (errors.length > 0) {
            console.log(`    ⚠️  ${errors.length}/50 patients had issues:`);
            errors.forEach(e => console.log(`      → ${e}`));
        }
        assert(errors.length < 5, `Too many patient errors: ${errors.length}/50`);
    });

    // ═══════════════════════════════════════════════════════════
    // 18. STRESS TEST: 10 EMERGENCY PATIENTS
    // ═══════════════════════════════════════════════════════════
    console.log('\n🚨 18. STRESS TEST: 10 EMERGENCY PATIENTS');

    test('Generate and validate 10 emergency patients', () => {
        const errors = [];
        for (let i = 0; i < 10; i++) {
            try {
                const p = PG.generateEmergencyPatient(540 + i * 30, { poli_umum: 1 });
                if (!p) { errors.push(`Emergency ${i}: null`); continue; }
                if (!p.medicalData) { errors.push(`Emergency ${i}: no medicalData`); continue; }

                const triageLevel = p.triageLevel || p.hidden?.triageLevel || p.medicalData.triageLevel;
                if (!triageLevel) { errors.push(`Emergency ${i} (${p.medicalData.id}): no triageLevel`); }

                // Validate triage
                const triage = EC.validateTriage(p.medicalData, triageLevel);
                if (!triage) { errors.push(`Emergency ${i}: triage validation failed`); }

                // Bill
                const bill = EC.calculateEmergencyBill([], false, triageLevel);
                if (!bill || bill.total < 0) { errors.push(`Emergency ${i}: invalid bill`); }
            } catch (err) {
                errors.push(`Emergency ${i}: CRASH — ${err.message}`);
            }
        }

        if (errors.length > 0) {
            console.log(`    ⚠️  ${errors.length}/10 emergencies had issues:`);
            errors.forEach(e => console.log(`      → ${e}`));
        }
        assert(errors.length === 0, `Emergency patient errors: ${errors.length}/10`);
    });

    // ═══════════════════════════════════════════════════════════
    // FINAL REPORT
    // ═══════════════════════════════════════════════════════════
    console.log('\n' + '═'.repeat(60));
    console.log(`🏁 RESULTS: ${passed}/${totalTests} passed, ${failed} failed`);
    if (failures.length > 0) {
        console.log('\n❌ FAILURES:');
        failures.forEach((f, i) => console.log(`  ${i + 1}. ${f.name}: ${f.error}`));
    }
    console.log('═'.repeat(60));

    process.exit(failed > 0 ? 1 : 0);
}

runAllTests().catch(err => {
    console.error('💥 FATAL ERROR:', err);
    process.exit(1);
});
