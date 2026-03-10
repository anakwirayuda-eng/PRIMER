/**
 * @reflection
 * [IDENTITY]: DentalProcedureEngine
 * [PURPOSE]: Minigame mechanics for dental procedures — ART filling, extraction, scaling with step-by-step scoring.
 * [STATE]: Experimental
 * [ANCHOR]: generateProcedure
 * [DEPENDS_ON]: None (pure logic)
 * [LAST_UPDATE]: 2026-02-18
 */

// ═══════════════════════════════════════════════════════════════
// PROCEDURE DEFINITIONS
// ═══════════════════════════════════════════════════════════════

const PROCEDURE_TYPES = {
    art_filling: {
        id: 'art_filling',
        name: 'Penambalan ART (Atraumatic Restorative Treatment)',
        description: 'Tambalan GIC tanpa bor — cocok untuk Puskesmas dan lapangan.',
        steps: [
            { id: 'isolasi', name: 'Isolasi area kerja', instruction: 'Pasang cotton roll di sekitar gigi.', difficulty: 1, criticalError: 'kontaminasi' },
            { id: 'ekskavas', name: 'Eksavasi karies', instruction: 'Buang jaringan karies lunak dengan ekskavator. Jangan terlalu dalam!', difficulty: 3, criticalError: 'eksposur_pulpa' },
            { id: 'kondisioner', name: 'Aplikasi kondisioner', instruction: 'Oleskan polyacrylic acid 10 detik, bilas, keringkan.', difficulty: 1, criticalError: null },
            { id: 'campur_gic', name: 'Campur GIC', instruction: 'Aduk GIC hingga konsistensi kental (30 detik). Jangan terlalu encer!', difficulty: 2, criticalError: 'gic_gagal' },
            { id: 'aplikasi', name: 'Aplikasi GIC', instruction: 'Masukkan GIC ke kavitas, tekan dengan jari berpetroleum jelly.', difficulty: 2, criticalError: 'void' },
            { id: 'finishing', name: 'Cek oklusi & finishing', instruction: 'Periksa gigitan, buang kelebihan material.', difficulty: 2, criticalError: null }
        ],
        tools: ['ekskavator', 'aplikator_gic', 'cotton_roll', 'petroleum_jelly', 'gic_capsule'],
        timeBase: 90,
        xpReward: 30
    },
    extraction: {
        id: 'extraction',
        name: 'Ekstraksi Gigi (Pencabutan)',
        description: 'Cabut gigi dengan forceps — prosedur bedah minor.',
        steps: [
            { id: 'anamnesis_confirm', name: 'Konfirmasi indikasi', instruction: 'Pastikan gigi benar-benar perlu dicabut. Cek riwayat perdarahan.', difficulty: 1, criticalError: 'salah_gigi' },
            { id: 'anestesi', name: 'Anestesi lokal', instruction: 'Infiltrasi/blok lidokain 2% + epinefrin 1:100.000. Tunggu onset 3-5 menit.', difficulty: 2, criticalError: 'anestesi_gagal' },
            { id: 'sindesmotomi', name: 'Sindesmotomi', instruction: 'Lepaskan perlekatan gingiva dari gigi dengan rasparatorium.', difficulty: 2, criticalError: null },
            { id: 'luksasi', name: 'Luksasi (goyang gigi)', instruction: 'Goyang gigi ke bukal-lingual secara bertahap dengan tang.', difficulty: 3, criticalError: 'fraktur_akar' },
            { id: 'traksi', name: 'Traksi (tarik gigi)', instruction: 'Tarik gigi keluar dengan gerakan menyapu. Periksa apakah utuh.', difficulty: 3, criticalError: 'fraktur_akar' },
            { id: 'kuretase', name: 'Kuretase soket', instruction: 'Bersihkan soket dari jaringan granulasi.', difficulty: 1, criticalError: null },
            { id: 'hemostasis', name: 'Hemostasis', instruction: 'Kompres soket dengan kasa, instruksikan pasien gigit 30 menit.', difficulty: 1, criticalError: 'perdarahan' },
            { id: 'instruksi', name: 'Instruksi pasca cabut', instruction: 'Edukasi: jangan kumur kuat, jangan hisap soket, makan lunak.', difficulty: 1, criticalError: null }
        ],
        tools: ['tang_gigi', 'rasparatorium', 'spuit_anestesi', 'lidokain_2persen', 'kasa_steril'],
        timeBase: 120,
        xpReward: 40
    },
    scaling: {
        id: 'scaling',
        name: 'Scaling (Pembersihan Karang Gigi)',
        description: 'Bersihkan kalkulus supragingival dengan scaler manual.',
        steps: [
            { id: 'identifikasi', name: 'Identifikasi area kalkulus', instruction: 'Periksa semua permukaan gigi, tandai area dengan kalkulus.', difficulty: 1, criticalError: null },
            { id: 'scaling_anterior', name: 'Scaling gigi anterior', instruction: 'Gunakan sickle scaler untuk area anterior (gigi depan).', difficulty: 2, criticalError: 'trauma_gingiva' },
            { id: 'scaling_posterior', name: 'Scaling gigi posterior', instruction: 'Gunakan curette untuk area posterior (geraham).', difficulty: 3, criticalError: 'trauma_gingiva' },
            { id: 'polishing', name: 'Polishing', instruction: 'Poles permukaan gigi agar licin, cegah deposit ulang.', difficulty: 1, criticalError: null },
            { id: 'evaluasi', name: 'Evaluasi akhir', instruction: 'Periksa semua area, pastikan tidak ada kalkulus tersisa.', difficulty: 2, criticalError: null },
            { id: 'edukasi_ohi', name: 'Edukasi OHI', instruction: 'Ajarkan teknik sikat gigi yang benar. Berikan edukasi ke pasien.', difficulty: 1, criticalError: null }
        ],
        tools: ['sickle_scaler', 'curette', 'polishing_cup', 'polishing_paste', 'kaca_mulut'],
        timeBase: 60,
        xpReward: 25
    }
};

/**
 * Complications that can occur during procedures
 */
const COMPLICATIONS = {
    eksposur_pulpa: { name: 'Eksposur Pulpa', severity: 'major', description: 'Terlalu dalam saat eksavasi — pulpa terbuka!', action: 'Kapping pulpa dengan Ca(OH)₂ atau rujuk.' },
    kontaminasi: { name: 'Kontaminasi Saliva', severity: 'minor', description: 'Isolasi kurang baik — tambalan bisa gagal.', action: 'Ulangi isolasi, keringkan area kerja.' },
    gic_gagal: { name: 'GIC Terlalu Encer', severity: 'minor', description: 'Konsistensi tidak tepat — tambalan tidak adhesif.', action: 'Buang dan campur ulang GIC baru.' },
    void: { name: 'Void dalam Tambalan', severity: 'minor', description: 'Ada rongga udara — risiko karies sekunder.', action: 'Tambahkan lapisan GIC, tekan kembali.' },
    salah_gigi: { name: 'Hampir Cabut Gigi Salah!', severity: 'major', description: 'Gigi yang ditandai tidak sesuai!', action: 'STOP — konfirmasi ulang dengan pasien dan rontgen.' },
    anestesi_gagal: { name: 'Anestesi Tidak Efektif', severity: 'minor', description: 'Pasien masih merasakan nyeri.', action: 'Tunggu 5 menit, tambah infiltrasi jika perlu.' },
    fraktur_akar: { name: 'Fraktur Akar Gigi', severity: 'major', description: 'Akar patah saat pencabutan!', action: 'Ambil sisa akar dengan bein/root tip pick, atau rujuk.' },
    perdarahan: { name: 'Perdarahan Pasca Cabut', severity: 'moderate', description: 'Perdarahan tidak berhenti > 30 menit.', action: 'Kompres tambahan, jahit soket jika perlu.' },
    trauma_gingiva: { name: 'Trauma Gingiva', severity: 'minor', description: 'Gusi terluka saat scaling.', action: 'Kompres, instruksikan kumur antiseptik.' },
};

export { PROCEDURE_TYPES, COMPLICATIONS };

// ═══════════════════════════════════════════════════════════════
// PROCEDURE GENERATION
// ═══════════════════════════════════════════════════════════════

/**
 * Generate a dental procedure challenge
 * @param {string} type - Procedure type from PROCEDURE_TYPES
 * @param {number} difficulty - 1-5
 * @returns {{ procedure, steps[], timeLimit, targetZones[], tools[] }}
 */
export function generateProcedure(type, difficulty = 1) {
    const proc = PROCEDURE_TYPES[type];
    if (!proc) return null;

    // Calculate time limit — decreases with difficulty
    const timeLimit = Math.max(30, proc.timeBase - (difficulty - 1) * 15);

    // For harder difficulties, some steps have reduced margin for error
    const steps = proc.steps.map(step => ({
        ...step,
        adjustedDifficulty: Math.min(5, step.difficulty + Math.floor(difficulty / 2)),
        errorMargin: Math.max(0.3, 1 - (difficulty * 0.12)),
        targetZone: {
            min: 0.3 + (step.difficulty * 0.05),
            max: 0.7 + (step.difficulty * 0.05),
            sweet: 0.5 // Perfect center
        }
    }));

    return {
        procedure: { id: proc.id, name: proc.name, description: proc.description },
        steps,
        timeLimit,
        tools: proc.tools,
        xpReward: proc.xpReward,
        difficulty
    };
}

// ═══════════════════════════════════════════════════════════════
// STEP EVALUATION
// ═══════════════════════════════════════════════════════════════

/**
 * Evaluate a single procedure step
 * @param {string} stepId - Step ID within the procedure
 * @param {Object} playerInput - { timing, pressure, accuracy } (0-1 range each)
 * @param {Object} procedureContext - The generated procedure context
 * @returns {{ accuracy, complication, feedback, xpStep }}
 */
export function evaluateStep(stepId, playerInput, procedureContext) {
    const step = procedureContext?.steps?.find(s => s.id === stepId);
    if (!step) return { accuracy: 0, complication: null, feedback: 'Step tidak ditemukan', xpStep: 0 };

    const { timing = 0.5, pressure = 0.5, accuracy: inputAccuracy = 0.5 } = playerInput;

    // Check if within target zone
    const zone = step.targetZone;
    const timingScore = 1 - Math.abs(timing - zone.sweet) * 2;
    const pressureScore = 1 - Math.abs(pressure - zone.sweet) * 2;
    const accuracyScore = inputAccuracy;

    const overallAccuracy = Math.round(((timingScore + pressureScore + accuracyScore) / 3) * 100);

    // Complication check — lower accuracy = higher chance
    let complication = null;
    if (step.criticalError && overallAccuracy < 40) {
        const compChance = (100 - overallAccuracy) / 100 * 0.5;
        if (Math.random() < compChance) {
            complication = COMPLICATIONS[step.criticalError] || null;
        }
    }

    // Too much pressure on extraction
    if (stepId === 'luksasi' && pressure > 0.85) {
        if (Math.random() < 0.3) {
            complication = COMPLICATIONS.fraktur_akar;
        }
    }

    let feedback;
    if (overallAccuracy >= 80) feedback = `✅ ${step.name} — sangat baik!`;
    else if (overallAccuracy >= 60) feedback = `👍 ${step.name} — cukup baik`;
    else if (overallAccuracy >= 40) feedback = `⚠️ ${step.name} — perlu lebih hati-hati`;
    else feedback = `❌ ${step.name} — kurang tepat, risiko komplikasi!`;

    if (complication) {
        feedback += ` | 🚨 KOMPLIKASI: ${complication.name}`;
    }

    const xpStep = Math.round(overallAccuracy * 0.1) + (complication ? -5 : 0);

    return { accuracy: overallAccuracy, complication, feedback, xpStep: Math.max(0, xpStep) };
}

// ═══════════════════════════════════════════════════════════════
// PROCEDURE SCORING
// ═══════════════════════════════════════════════════════════════

/**
 * Score an entire procedure
 * @param {Object[]} stepResults - Array of evaluateStep results
 * @param {number} totalTimeMs - Total time taken
 * @param {number} timeLimitMs - Time limit in ms
 * @returns {{ totalScore, avgAccuracy, complications[], xpTotal, grade, feedback }}
 */
export function scoreProcedure(stepResults, totalTimeMs = 0, timeLimitMs = 0) {
    if (!stepResults || stepResults.length === 0) {
        return { totalScore: 0, avgAccuracy: 0, complications: [], xpTotal: 0, grade: 'F', feedback: 'Tidak ada prosedur yang dilakukan' };
    }

    const avgAccuracy = Math.round(stepResults.reduce((sum, s) => sum + s.accuracy, 0) / stepResults.length);
    const complications = stepResults.filter(s => s.complication).map(s => s.complication);
    const majorComplications = complications.filter(c => c.severity === 'major');

    // Time bonus
    let timeBonus = 0;
    if (timeLimitMs > 0 && totalTimeMs < timeLimitMs) {
        timeBonus = Math.round((1 - totalTimeMs / timeLimitMs) * 20);
    }

    // Penalty for complications
    const complicationPenalty = complications.reduce((sum, c) => {
        if (c.severity === 'major') return sum + 20;
        if (c.severity === 'moderate') return sum + 10;
        return sum + 5;
    }, 0);

    const totalScore = Math.max(0, Math.min(100, avgAccuracy + timeBonus - complicationPenalty));

    // XP calculation
    let xpTotal = stepResults.reduce((sum, s) => sum + (s.xpStep || 0), 0);
    if (totalScore >= 90) xpTotal += 15; // excellence bonus
    if (majorComplications.length > 0) xpTotal = Math.max(0, xpTotal - 10);

    // Grade
    let grade, feedback;
    if (majorComplications.length > 0) {
        grade = 'D';
        feedback = `⚠️ Komplikasi mayor terjadi: ${majorComplications.map(c => c.name).join(', ')}. Perlu latihan lebih lanjut.`;
    } else if (totalScore >= 90) {
        grade = 'A';
        feedback = '🏆 Prosedur sempurna! Teknik sangat baik.';
    } else if (totalScore >= 75) {
        grade = 'B';
        feedback = '👍 Prosedur baik. Sedikit perbaikan di teknik.';
    } else if (totalScore >= 60) {
        grade = 'C';
        feedback = '⚠️ Prosedur cukup. Perlu latihan lagi.';
    } else {
        grade = 'D';
        feedback = '❌ Perlu banyak latihan. Pastikan mengikuti langkah-langkah dengan benar.';
    }

    return { totalScore, avgAccuracy, complications, xpTotal, grade, feedback, timeBonus };
}
