/**
 * @reflection
 * [IDENTITY]: usePatientEMR
 * [PURPOSE]: React hook: usePatientEMR — manages patientemr state and logic.
 * [STATE]: Experimental
 * [ANCHOR]: usePatientEMR
 * [DEPENDS_ON]: GameContext, ICD10, ICD9CM, ProceduresDB, CaseLibrary, AnamnesisEngine, ClinicalReasoning, MedicationDatabase, SoundManager
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-12
 */

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
// useGame not needed — this hook reads directly from useGameStore
import { findICD10 } from '../data/ICD10.js';
import { findICD9CM } from '../data/ICD9CM.js';
import { PROCEDURES_DB } from '../data/ProceduresDB.js';
import { validateDiagnosis, validateTreatment, validateEducation, validateExams, validateAnamnesis } from '../content/cases/CaseLibrary.js';
import { getAdaptiveResponse, generateGreeting, deriveCategory } from '../game/AnamnesisEngine.js';
import { updateEmotionState, resetPersonaMemory, initPersonaRNG } from '../game/AnamnesisEngine.js';
import {
    initDiagnosticTracker, updateDiagnosticProbability, getDiagnosticConfidence,
    calculateCoverageScore, getMAIAAlerts, getExamLabSuggestions
} from '../game/ClinicalReasoning.js';
import { getMedicationById } from '../data/MedicationDatabase.js';
import { useGameStore } from '../store/useGameStore.js';
import { useShallow } from 'zustand/react/shallow';
import { selectClinical, selectPlayerStats, selectDerivedFinance } from '../store/selectors.js';
import { soundManager } from '../utils/SoundManager.js';
import { guardStability } from '../utils/prophylaxis.js';
import { classifyResponse } from '../game/anamnesis/SynthesisEngine.js';
import { evaluateConsequences } from '../game/ConsequenceEngine.js';
import { showToast, confirmToast } from '../utils/ToastManager.js';

export function usePatientEMR() {
    // 1. Clinical Base Data & Actions
    const { queue, activePatientId, history } = useGameStore(useShallow(selectClinical));
    const { dischargePatient, updatePatient, orderLab, logCaseOutcome, pushConsequence, setActiveReferral } = useGameStore(useShallow(s => s.clinicalActions));

    // 2. Player Profile & Status
    const playerProfile = useGameStore(useShallow(selectPlayerStats));
    const { morningStatus } = playerProfile; // Derived from profile in store logic

    // 3. Finance & Inventory
    const finance = useGameStore(useShallow(selectDerivedFinance));
    const { stats, pharmacyInventory } = finance;
    const { enrollProlanis } = useGameStore(useShallow(s => s.financeActions));
    const prolanisRoster = useGameStore(useShallow(s => s.finance.prolanisRoster));

    // 4. Global State & Navigation
    const world = useGameStore(useShallow(s => s.world));
    const { time } = world;
    const { navigate } = useGameStore(useShallow(s => s.navActions));
    const { openWiki } = useGameStore(useShallow(s => s.metaActions));
    const activeOutbreaks = useGameStore(useShallow(s => s.publicHealth.activeOutbreaks));

    // 5. Player Actions (for followup XP/reputation — avoids getState() anti-pattern)
    const { gainXp, setPlayerStats } = useGameStore(useShallow(s => s.playerActions || {}));

    const patient = queue.find(p => p.id === activePatientId);

    // Tabs and UI state
    const [activeTab, setActiveTab] = useState('anamnesis');
    const [anamnesisCategory, setAnamnesisCategory] = useState('keluhan_utama');
    const [anamnesisHistory, setAnamnesisHistory] = useState([]);
    const [showAnamnesisHint, setShowAnamnesisHint] = useState(false);
    const [icdQuery, setIcdQuery] = useState('');
    const [selectedDiagnoses, setSelectedDiagnoses] = useState([]);
    const [selectedMeds, setSelectedMeds] = useState([]);
    const [selectedProcedures, setSelectedProcedures] = useState([]);
    const [examsPerformed, setExamsPerformed] = useState({});
    const [labsRevealed, setLabsRevealed] = useState({});
    const [_maiaFeedback, _setMaiaFeedback] = useState(null);
    const [showValidation, setShowValidation] = useState(false);
    const [medQuery, setMedQuery] = useState('');
    const [icd9Query, setIcd9Query] = useState('');
    const [eduQuery, setEduQuery] = useState('');

    // Search results state (async)
    const [icd10SearchResults, setIcd10SearchResults] = useState([]);
    const [icd9SearchResults, setIcd9SearchResults] = useState([]);

    const [showClue, setShowClue] = useState(false);
    const [showAnswer, setShowAnswer] = useState(false);
    const [selectedEducation, setSelectedEducation] = useState([]);
    const [hasAskedComplaint, setHasAskedComplaint] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSigned, setIsSigned] = useState(false);
    const [anamnesisContext, setAnamnesisContext] = useState({ introduced: false, trust: 0.5, patience: 1.0, count: 0 });
    const [diagnosticTracker, setDiagnosticTracker] = useState(null);
    const [maiaAlerts, setMaiaAlertsLocal] = useState([]);
    const [coverageScore, setCoverageScore] = useState(null);

    const chatEndRef = useRef(null);
    const examResultsRef = useRef(null);

    const lastPatientIdRef = useRef(null);

    // Reset state when patient changes
    useEffect(() => {
        if (!patient || patient.id === lastPatientIdRef.current) return;
        lastPatientIdRef.current = patient.id;

        // Wrap in setTimeout to avoid synchronous setState warnings in strict mode
        setTimeout(() => {
            // Prophylaxis: Detect if we are looping
            if (!guardStability('EMR_PATIENT_RESET', 2000, 3)) {
                console.error("🛑 PRIMERA PROPHYLAXIS: Detected infinite reset loop in usePatientEMR. Tab switch blocked to preserve state.");
                return;
            }

            setActiveTab('anamnesis');
            resetPersonaMemory(); // Clear anti-repetition memory for new patient
            initPersonaRNG(patient.id); // Seed RNG for reproducible sessions (8.1-D)
            setIcdQuery('');
            setSelectedDiagnoses([]);
            setSelectedMeds([]);
            setSelectedProcedures([]);
            setExamsPerformed({});
            setLabsRevealed(patient.labsOrdered ? patient.medicalData.labs : {});
            setShowValidation(false);
            setMedQuery('');
            setIcd9Query('');
            setEduQuery('');
            setShowClue(false);
            setShowAnswer(false);
            setSelectedEducation([]);
            setHasAskedComplaint(false);
            setIsSigned(false);
            setAnamnesisContext({ introduced: false, trust: 0.5, patience: 1.0, count: 0 });
            setDiagnosticTracker(initDiagnosticTracker(patient.medicalData));
            setMaiaAlertsLocal([]);

            // Initial score calculation
            if (patient.anamnesisState?.askedQuestions) {
                const history = patient.anamnesisState.askedQuestions;
                setAnamnesisHistory(history);
                const alreadyAskedComplaint = history.some(q => q.id === 'initial_complaint');
                setAnamnesisCategory(alreadyAskedComplaint ? (patient.anamnesisState.lastCategory || 'keluhan_utama') : 'keluhan_utama');
                setHasAskedComplaint(alreadyAskedComplaint);

                // Sync tracker with existing history
                let tracker = initDiagnosticTracker(patient.medicalData);
                const essentialIds = patient.medicalData?.essentialQuestions || [];
                history.forEach(q => {
                    if (q.id && !q.isGreeting && q.response) {
                        const responseStatus = classifyResponse(q.response);
                        tracker = updateDiagnosticProbability(tracker, q.id, responseStatus, essentialIds);
                    }
                });
                setDiagnosticTracker(tracker);
            } else {
                const doctorName = playerProfile?.name || '...';
                const greetData = generateGreeting(patient, doctorName, time, { introduced: false });
                const initialHistory = [{
                    text: greetData.doctorText,
                    response: greetData.patientResponse,
                    id: 'greeting',
                    auto: true,
                    isGreeting: true
                }];

                setAnamnesisHistory(initialHistory);
                setAnamnesisCategory('keluhan_utama');
                setAnamnesisContext(greetData.context);
                setDiagnosticTracker(initDiagnosticTracker(patient.medicalData));
            }
        }, 0);
    }, [patient?.id, playerProfile?.name, time, patient]); // patient included for greeting logic guard

    const recalculateClinicalScores = useCallback((history, exams, labs) => {
        if (!patient) return;
        const essentialIds = patient.medicalData?.essentialQuestions || [];
        const isEmergency = patient.isEmergency || patient.category === 'emergency' || patient.serviceId === 'igd';
        const newCoverage = calculateCoverageScore(history, exams, labs, essentialIds, {
            caseType: isEmergency ? 'emergency' : 'general'
        });
        setCoverageScore(newCoverage);
        return newCoverage;
    }, [patient]); // Added patient dependency

    // Initial score sync effect
    useEffect(() => {
        if (patient) {
            // Delay update to avoid synchronous setState in effect warning
            const timer = setTimeout(() => {
                recalculateClinicalScores(anamnesisHistory, examsPerformed, labsRevealed);
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [patient, recalculateClinicalScores, anamnesisHistory, examsPerformed, labsRevealed]); // Removed patient?.id, patient is already checked

    // Real-Time MAIA Assistant (Sprint 2.5)
    const liveMaiaFeedback = useMemo(() => {
        if (!patient) return null;
        const caseData = patient.medicalData;

        const diagValidation = validateDiagnosis(caseData, selectedDiagnoses);
        const treatValidation = validateTreatment(
            caseData,
            selectedMeds,
            selectedProcedures.map(p => p.id || p.code || p)
        );
        const eduValidation = validateEducation(
            { requiredEducation: patient.hidden?.requiredEducation || [] },
            selectedEducation
        );
        const examValidation = validateExams(
            { relevantLabs: patient.hidden?.relevantLabs || [], physicalExamFindings: caseData?.physicalExamFindings || {} },
            Object.keys(examsPerformed),
            Object.keys(labsRevealed)
        );
        const anamnesisValidation = validateAnamnesis(caseData, anamnesisHistory);

        // MAIA Exam/Lab Suggestions (new feature)
        const examLabHints = getExamLabSuggestions(
            caseData,
            Object.keys(examsPerformed),
            Object.keys(labsRevealed),
            anamnesisValidation?.score ?? 0
        );

        return {
            diagnosis: diagValidation,
            treatment: treatValidation,
            education: eduValidation,
            exams: examValidation,
            anamnesis: anamnesisValidation,
            examLabSuggestions: examLabHints
        };
    }, [patient, selectedDiagnoses, selectedMeds, selectedProcedures, selectedEducation, examsPerformed, labsRevealed, anamnesisHistory]);

    // Auto-scroll anamnesis
    useEffect(() => {
        if (activeTab === 'anamnesis' && chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [anamnesisHistory, activeTab]);

    // Auto-scroll physical exam
    useEffect(() => {
        if (activeTab === 'physical' && examResultsRef.current) {
            examResultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    }, [examsPerformed, activeTab]);

    // Async search effects
    useEffect(() => {
        if (icdQuery.length <= 1) {
            setTimeout(() => setIcd10SearchResults(prev => prev.length === 0 ? prev : []), 0);
            return;
        }

        let isCancelled = false;
        findICD10(icdQuery).then(results => {
            if (!isCancelled) setIcd10SearchResults(results);
        });
        return () => { isCancelled = true; };
    }, [icdQuery]);

    useEffect(() => {
        if (icd9Query.length <= 1) {
            setTimeout(() => setIcd9SearchResults(prev => prev.length === 0 ? prev : []), 0);
            return;
        }

        let isCancelled = false;
        const query = icd9Query.toLowerCase();
        findICD9CM(icd9Query).then(icdMatches => {
            if (isCancelled) return;

            const procMatches = PROCEDURES_DB.filter(p =>
                p.id.toLowerCase().includes(query) ||
                p.name.toLowerCase().includes(query) ||
                (p.indication && p.indication.some(ind => ind.toLowerCase().includes(query)))
            ).map(p => ({
                code: p.code || p.id,
                name: p.name,
                id: p.id
            }));

            const combined = [...procMatches];
            icdMatches.forEach(match => {
                if (!combined.some(c => c.code === match.code)) {
                    combined.push(match);
                }
            });
            setIcd9SearchResults(combined.slice(0, 15));
        });
        return () => { isCancelled = true; };
    }, [icd9Query]);

    const handleAskQuestion = useCallback(async (question) => { // Made async
        if (isProcessing) return;

        const delay = morningStatus === 'groggy' ? 1500 : 0;
        if (delay > 0) setIsProcessing(true);

        const capturedPatientId = patient.id;

        setTimeout(async () => {
            if (capturedPatientId !== activePatientId) {
                setIsProcessing(false);
                return;
            }

            const caseId = patient.medicalData?.id || patient.hidden?.diseaseId || null;
            const rawResponse = await getAdaptiveResponse(question, patient, caseId, anamnesisContext);

            // getAdaptiveResponse always returns { text, rawClinical, isVague?, clarifiedResponse?, metadata? }
            const responseText = rawResponse.text;
            const rawClinical = rawResponse.rawClinical || responseText;
            const isVague = rawResponse.isVague || false;
            const clarifiedResponse = rawResponse.clarifiedResponse || null;
            const metadata = rawResponse.metadata || {};

            // Inject the current category into the question record for tracking
            // P0-A: Use inherent category from question ID; fallback to active tab
            const questionWithContext = {
                ...question,
                response: responseText,
                rawClinical,  // Pre-persona text for accurate classification & re-ask
                category: deriveCategory(question.id) || anamnesisCategory,
                isVague,
                clarifiedResponse,
                metadata
            };

            // Dedup guard: prevent identical responses appearing in conversation
            const isDuplicate = anamnesisHistory.some(h => h.response === responseText);
            if (isDuplicate && responseText && responseText.length > 10) {
                const dedupSuffixes = [
                    ' (sambil mengangguk)',
                    ' (menghela nafas)',
                    ' (berpikir sejenak)',
                    ' (tampak berusaha mengingat)',
                    ' (sambil memegang bagian yang sakit)'
                ];
                const suffix = dedupSuffixes[Math.floor(Math.random() * dedupSuffixes.length)];
                questionWithContext.response = responseText + suffix;
            }

            const newHistory = [...anamnesisHistory, questionWithContext];
            setAnamnesisHistory(newHistory);

            // Update context (trust, patience, count)
            const updatedContext = updateEmotionState(anamnesisContext, 'question');
            setAnamnesisContext(updatedContext);

            // === SPRINT 2: Clinical Reasoning Updates ===
            // Classify using rawClinical (pre-persona text) to avoid false positives
            // from persona suffixes like 'takut parah', 'nggak kuat' etc.
            const responseStatus = classifyResponse(rawClinical);

            // Update diagnostic tracker
            const essentialIds = patient.medicalData?.essentialQuestions || [];
            const updatedTracker = updateDiagnosticProbability(
                diagnosticTracker, question.id, responseStatus, essentialIds
            );
            setDiagnosticTracker(updatedTracker);

            // === SPRINT 2 (Synchronized) ===
            // 1. Calculate new coverage
            recalculateClinicalScores(newHistory, examsPerformed, labsRevealed);

            // 2. Context-aware MAIA feedback
            const caseDataForMAIA = patient.medicalData || null;
            const alerts = getMAIAAlerts(newHistory, anamnesisCategory, caseDataForMAIA);
            setMaiaAlertsLocal(alerts);

            updatePatient(capturedPatientId, {
                anamnesisState: {
                    askedQuestions: newHistory,
                    lastCategory: anamnesisCategory,
                    context: updatedContext
                }
            });
            setIsProcessing(false);
        }, delay);
    }, [isProcessing, morningStatus, patient, activePatientId, anamnesisHistory, anamnesisCategory, updatePatient, anamnesisContext, diagnosticTracker, examsPerformed, labsRevealed, recalculateClinicalScores]);

    // BUG-2 FIX: Pipeline for initial complaint (bypassed handleAskQuestion)
    const handleInitialComplaint = useCallback((newHistory, complaintEntry) => {
        if (!patient) return;

        // Update emotion state for the greeting event
        const updatedContext = updateEmotionState(anamnesisContext, 'greeting');
        setAnamnesisContext(updatedContext);

        // Classify the complaint response
        const responseStatus = classifyResponse(complaintEntry.rawClinical || complaintEntry.response);
        const essentialIds = patient.medicalData?.essentialQuestions || [];
        const updatedTracker = updateDiagnosticProbability(
            diagnosticTracker, complaintEntry.id, responseStatus, essentialIds
        );
        setDiagnosticTracker(updatedTracker);

        // Recalculate coverage and MAIA
        recalculateClinicalScores(newHistory, examsPerformed, labsRevealed);
        const alerts = getMAIAAlerts(newHistory, 'keluhan_utama', patient.medicalData || null);
        setMaiaAlertsLocal(alerts);
    }, [patient, anamnesisContext, diagnosticTracker, examsPerformed, labsRevealed, recalculateClinicalScores]);

    const handleExam = useCallback((examKey) => {
        if (isProcessing) return;

        const delay = morningStatus === 'groggy' ? 2000 : 0;
        if (delay > 0) setIsProcessing(true);

        setTimeout(() => {
            const finding = patient.medicalData?.physicalExamFindings?.[examKey] || "Dalam batas normal / Tidak ada kelainan.";
            const updatedExams = { ...examsPerformed, [examKey]: finding };
            setExamsPerformed(updatedExams);
            recalculateClinicalScores(anamnesisHistory, updatedExams, labsRevealed);
            setIsProcessing(false);
        }, delay);
    }, [isProcessing, morningStatus, patient, examsPerformed, anamnesisHistory, labsRevealed, recalculateClinicalScores]);

    const handleOrderLab = useCallback((labName, cost) => {
        if (stats.funds < cost) {
            showToast('Dana Kapitasi tidak cukup untuk pemeriksaan ini!', 'error');
            return;
        }
        orderLab(patient.id, labName, cost);
        const updatedLabs = { ...labsRevealed, [labName]: true };
        setLabsRevealed(updatedLabs);
        recalculateClinicalScores(anamnesisHistory, examsPerformed, updatedLabs);
        soundManager.playConfirm();
    }, [stats.funds, patient, orderLab, labsRevealed, anamnesisHistory, examsPerformed, recalculateClinicalScores]);

    const addDiagnosis = useCallback((d) => {
        if (!selectedDiagnoses.find(x => x.code === d.code)) {
            setSelectedDiagnoses(prev => [...prev, d]);
        }
        setIcdQuery('');
    }, [selectedDiagnoses]);

    const removeDiagnosis = useCallback((code) => {
        setSelectedDiagnoses(prev => prev.filter(d => d.code !== code));
    }, []);

    const toggleMed = useCallback((med) => {
        if (isSigned) return;
        const medId = typeof med === 'string' ? med : med.id;
        const medData = typeof med === 'object' ? med : getMedicationById(medId);

        if (selectedMeds.find(m => m.id === medId)) {
            setSelectedMeds(prev => prev.filter(m => m.id !== medId));
            soundManager.playCancel();
        } else {
            setSelectedMeds(prev => [...prev, {
                id: medId,
                name: medData?.name || medId,
                frequency: 3,
                duration: 3,
                price: medData?.sellPrice || medData?.price || 0
            }]);
            soundManager.playConfirm();
        }
    }, [isSigned, selectedMeds]);

    const updateMedConfig = useCallback((medId, updates) => {
        if (isSigned) return;
        setSelectedMeds(prev => prev.map(m =>
            m.id === medId ? { ...m, ...updates } : m
        ));
    }, [isSigned]);

    const toggleProcedure = useCallback((p) => {
        if (isSigned) return;
        const pId = typeof p === 'string' ? p : (p.id || p.code);
        const pData = typeof p === 'object' ? p : PROCEDURES_DB.find(x => x.id === pId);

        if (selectedProcedures.find(x => (x.id || x.code) === pId)) {
            setSelectedProcedures(prev => prev.filter(x => (x.id || x.code) !== pId));
            soundManager.playCancel();
        } else {
            setSelectedProcedures(prev => [...prev, {
                id: pId,
                code: pData?.code || pId,
                name: pData?.name || pId
            }]);
            soundManager.playConfirm();
        }
        setIcd9Query('');
    }, [isSigned, selectedProcedures]);

    const handleMaiaValidate = useCallback(() => {
        // Now just a visual trigger to show the validation tab
        setShowClue(false);
        setShowValidation(true);
    }, []);

    const handleEnrollProlanis = useCallback(() => {
        const isDM = selectedDiagnoses.some(d =>
            d.code.startsWith('E10') || d.code.startsWith('E11') || d.code.startsWith('E13')
        );
        const isHT = selectedDiagnoses.some(d =>
            d.code.startsWith('I10') || d.code.startsWith('I11') ||
            d.code.startsWith('I12') || d.code.startsWith('I13') || d.code.startsWith('I15')
        );

        if (!isDM && !isHT) {
            showToast('Pasien harus didiagnosis DM (E10/E11/E13) atau Hipertensi (I10-I15) untuk mendaftar Prolanis!', 'warning');
            return;
        }

        const diseaseType = isDM ? 'dm_type2' : 'hypertension';
        const success = enrollProlanis(patient, diseaseType);

        if (success) {
            showToast(`Berhasil mendaftarkan ${patient.name} ke klub Prolanis! 💗`, 'success');
            soundManager.playSuccess();
        } else {
            showToast('Pasien sudah terdaftar di Prolanis.', 'warning');
        }
    }, [selectedDiagnoses, enrollProlanis, patient]);

    const handleDischarge = useCallback(async (action) => {
        if (selectedDiagnoses.length === 0 && action === 'treat') {
            showToast('Pilih minimal 1 diagnosis sebelum menyelesaikan!', 'error');
            return;
        }

        if (action === 'refer') {
            const needsRef = patient.hidden?.requiredAction === 'refer'
                || patient.hidden?.referralRequired === true
                || patient.hidden?.risk === 'emergency';
            const skdi = patient.hidden?.skdi || '4A';

            if (!needsRef) {
                const msg = skdi === '4A'
                    ? `⚠️ Pasien SKDI ${skdi} — WAJIB tuntas di FKTP. Merujuk akan menurunkan skor BPJS. Yakin?`
                    : `⚠️ Kondisi ini tidak memerlukan spesialistik. Merujuk berisiko ditolak RS tujuan. Yakin?`;
                const confirmed = await confirmToast(msg, 'warning');
                if (!confirmed) return;
            }

            if (selectedDiagnoses.length === 0) {
                showToast('Pilih minimal 1 diagnosis sebelum merujuk!', 'error');
                return;
            }

            // Open SISRUTE modal (hospital picker, SBAR form, ambulance) instead of direct discharge.
            // The modal's handleComplete() calls dischargePatient with isSISRUTE: true and referralDetails.
            const caseData = patient.medicalData;
            setActiveReferral({
                patient,
                decisionData: {
                    action: 'refer',
                    diagnoses: selectedDiagnoses.map(d => d.code),
                    medications: selectedMeds.map(m => m.id),
                    procedures: selectedProcedures.map(p => p.id || p.code),
                    examsPerformed: Object.keys(examsPerformed),
                    education: selectedEducation,
                    anamnesisScore: validateAnamnesis(caseData, anamnesisHistory).score,
                    anamnesisHistory,
                    labsRevealed
                },
                isEmergency: patient.isEmergency || patient.category === 'emergency' || patient.serviceId === 'igd'
            });
            return; // Don't discharge yet — modal handles it
        }

        const caseData = patient.medicalData;
        dischargePatient(patient, {
            action,
            diagnoses: selectedDiagnoses.map(d => d.code),
            medications: selectedMeds.map(m => m.id),
            procedures: selectedProcedures.map(p => p.id || p.code),
            examsPerformed: Object.keys(examsPerformed),
            education: selectedEducation,
            anamnesisScore: validateAnamnesis(caseData, anamnesisHistory).score,
            anamnesisHistory,
            labsRevealed
        });

        // Phase 0: Log case outcome for debrief + evaluate consequences
        // Cache validation results to avoid redundant calls
        const diagResult = validateDiagnosis(caseData, selectedDiagnoses);
        const treatResult = validateTreatment(caseData, selectedMeds, selectedProcedures.map(p => p.id || p.code));
        const caseOutcome = {
            patientName: patient.name,
            age: patient.age,
            diagnosis: selectedDiagnoses[0]?.code || 'unknown',
            correctDiagnosis: caseData?.correctDiagnosis || caseData?.id || '',
            wasCorrect: diagResult?.isPrimaryCorrect ?? false,
            diagnosisScore: diagResult?.isPrimaryCorrect ? 100 : 0,
            action,
            medications: selectedMeds.map(m => m.id),
            keyLearning: caseData?.keyLearning || '',
            guidelineRef: caseData?.guidelineRef || null,
            timestamp: Date.now()
        };
        logCaseOutcome(caseOutcome);

        // D3: Post-discharge feedback toast with scores
        const coveragePct = Math.round((coverageScore || 0) * 100);
        const diagPct = caseOutcome.diagnosisScore;
        const treatPct = Math.round((treatResult?.score ?? 0));
        const emoji = caseOutcome.wasCorrect ? '🎯' : '⚠️';
        const toastType = caseOutcome.wasCorrect ? 'success' : 'warning';
        showToast(
            `${emoji} ${patient.name} — Dx: ${diagPct}% | Tx: ${treatPct}% | Coverage: ${coveragePct}%${caseData?.keyLearning ? ` • ${caseData.keyLearning}` : ''}`,
            toastType,
            5000
        );

        // Evaluate consequences (delayed patient outcomes)
        const consequences = evaluateConsequences(caseData, {
            action,
            diagnosis: selectedDiagnoses.map(d => d.code),
            medications: selectedMeds.map(m => m.id),
            labsRevealed,
            diagnosisScore: caseOutcome.diagnosisScore,
            treatmentScore: treatScore
        }, world.day || 1);
        if (consequences) pushConsequence(consequences);

        // Phase 0: Apply followupData impacts if this is a returning patient
        if (patient.isFollowup && patient.followupData) {
            const { xpImpact, reputationImpact } = patient.followupData;
            if (xpImpact && gainXp) {
                gainXp(xpImpact);
            }
            if (reputationImpact && setPlayerStats) {
                setPlayerStats(prev => ({
                    reputation: Math.max(0, Math.min(100, (prev.reputation || 50) + reputationImpact))
                }));
            }
        }

        // State reset for the next patient is handled by the initial patient-change useEffect
    }, [selectedDiagnoses, patient, selectedMeds, selectedProcedures, examsPerformed, selectedEducation, anamnesisHistory, labsRevealed, dischargePatient, logCaseOutcome, pushConsequence, gainXp, setPlayerStats, setActiveReferral]);

    return {
        patient,
        activeTab, setActiveTab,
        anamnesisCategory, setAnamnesisCategory,
        anamnesisHistory, setAnamnesisHistory,
        showAnamnesisHint, setShowAnamnesisHint,
        icdQuery, setIcdQuery,
        selectedDiagnoses, setSelectedDiagnoses,
        selectedMeds, setSelectedMeds,
        selectedProcedures, setSelectedProcedures,
        examsPerformed, setExamsPerformed,
        labsRevealed, setLabsRevealed,
        maiaFeedback: liveMaiaFeedback,
        showValidation, setShowValidation,
        medQuery, setMedQuery,
        icd9Query, setIcd9Query,
        eduQuery, setEduQuery,
        icd10SearchResults,
        icd9SearchResults,
        showClue, setShowClue,
        showAnswer, setShowAnswer,
        selectedEducation, setSelectedEducation,
        hasAskedComplaint, setHasAskedComplaint,
        isProcessing, setIsProcessing,
        isSigned, setIsSigned,
        chatEndRef,
        examResultsRef,
        handleAskQuestion,
        handleInitialComplaint,
        handleExam,
        handleOrderLab,
        addDiagnosis,
        removeDiagnosis,
        toggleMed,
        updateMedConfig,
        toggleProcedure,
        handleMaiaValidate,
        handleEnrollProlanis,
        handleDischarge,
        // Sprint 2: Clinical Reasoning
        diagnosticTracker,
        maiaAlerts, setMaiaAlerts: setMaiaAlertsLocal,
        coverageScore,
        getDiagnosticConfidence: () => getDiagnosticConfidence(diagnosticTracker, coverageScore),
        // Game state exposure for convenience
        stats, time, playerProfile, navigate, history,
        morningStatus, pharmacyInventory, activeOutbreaks, openWiki, prolanisRoster, updatePatient,
        anamnesisContext
    };
}
