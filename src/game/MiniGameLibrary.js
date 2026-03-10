/**
 * @reflection
 * [IDENTITY]: MiniGameLibrary.js
 * [PURPOSE]: Definitions for UKM behavior change mini-games and micro-tasks.
 *            Each game maps to specific COM-B intervention functions and has
 *            clear success/fail criteria. Used by MiniGameModal.jsx to render
 *            interactive gameplay during behavior change case phases.
 * [STATE]: Experimental
 * [ANCHOR]: MINI_GAMES
 * [DEPENDS_ON]: DiseaseScenarios (intervention functions), BehaviorCaseEngine
 */

// ═══════════════════════════════════════════════════════════════
// CORE MINI-GAMES (4 types, ~2-3 min each)
// ═══════════════════════════════════════════════════════════════

/**
 * Core mini-games used during the Intervention phase of Deep Cases.
 * Each targets specific COM-B barriers and intervention functions.
 */
export const MINI_GAMES = {
    // ─── 1. Inspeksi Kilat (Hidden Object / Spot the Hazard) ───
    inspeksi_kilat: {
        id: 'inspeksi_kilat',
        title: 'Inspeksi Kilat',
        subtitle: 'Temukan Bahaya Tersembunyi',
        icon: '🔍',
        description: 'Temukan faktor risiko di lingkungan rumah warga dalam waktu terbatas.',
        gameType: 'hidden_object',
        targetBarriers: ['opp_phy'],
        interventionFunction: 'environmental',
        timeLimit: 60, // seconds
        difficulty: {
            easy: { hazards: 4, fakeItems: 2, timeLimit: 90 },
            normal: { hazards: 6, fakeItems: 4, timeLimit: 60 },
            hard: { hazards: 8, fakeItems: 6, timeLimit: 45 }
        },
        scoring: {
            correct: 15,        // Per correct hazard found
            incorrect: -10,     // Per false positive
            timeBonus: 5,       // Per 10 seconds remaining
            perfectBonus: 25    // All hazards, no false positives
        },
        scenes: {
            scabies: {
                background: 'interior_rumah_sempit',
                hazards: [
                    { id: 'shared_bed', label: 'Kasur untuk 6 orang', x: 20, y: 40, comB: 'opp_phy' },
                    { id: 'shared_towel', label: 'Handuk dipakai bergantian', x: 55, y: 30, comB: 'opp_phy' },
                    { id: 'shared_soap', label: 'Sabun batang shared', x: 70, y: 60, comB: 'opp_phy' },
                    { id: 'dirty_sheets', label: 'Sprei lama tidak dicuci', x: 30, y: 50, comB: 'opp_phy' },
                    { id: 'overcrowded', label: 'Ruangan sempit penuh barang', x: 45, y: 25, comB: 'opp_phy' },
                    { id: 'no_ventilation', label: 'Jendela tertutup rapat', x: 85, y: 15, comB: 'opp_phy' }
                ],
                fakeItems: [
                    { id: 'clean_floor', label: 'Lantai bersih', x: 50, y: 80 },
                    { id: 'good_light', label: 'Lampu terang', x: 80, y: 10 }
                ]
            },
            dengue: {
                background: 'halaman_rumah',
                hazards: [
                    { id: 'old_tire', label: 'Ban bekas berisi air', x: 15, y: 65, comB: 'opp_phy' },
                    { id: 'flower_pot', label: 'Pot bunga ada jentik', x: 40, y: 55, comB: 'opp_phy' },
                    { id: 'open_bucket', label: 'Ember terbuka', x: 60, y: 45, comB: 'opp_phy' },
                    { id: 'dirty_gutter', label: 'Got tersumbat', x: 80, y: 70, comB: 'opp_phy' },
                    { id: 'uncovered_tank', label: 'Bak mandi terbuka', x: 25, y: 35, comB: 'mot_aut' },
                    { id: 'junk_pile', label: 'Tumpukan barang bekas', x: 50, y: 75, comB: 'mot_aut' }
                ],
                fakeItems: [
                    { id: 'covered_well', label: 'Sumur tertutup', x: 70, y: 30 },
                    { id: 'clean_yard', label: 'Halaman bersih', x: 35, y: 20 }
                ]
            },
            tb: {
                background: 'interior_rumah_gelap',
                hazards: [
                    { id: 'no_ventilation', label: 'Ventilasi tertutup kain', x: 80, y: 20, comB: 'opp_phy' },
                    { id: 'dark_room', label: 'Ruangan gelap & lembab', x: 40, y: 35, comB: 'opp_phy' },
                    { id: 'crowded', label: 'Tidur berdesakan', x: 25, y: 50, comB: 'opp_phy' },
                    { id: 'no_mask', label: 'Tidak ada masker', x: 60, y: 40, comB: 'cap_psy' },
                    { id: 'shared_utensils', label: 'Piring makan bersama', x: 50, y: 65, comB: 'opp_phy' },
                    { id: 'sputum_anywhere', label: 'Dahak dibuang sembarangan', x: 70, y: 55, comB: 'mot_aut' }
                ],
                fakeItems: [
                    { id: 'clean_kitchen', label: 'Dapur bersih', x: 30, y: 70 },
                    { id: 'soap', label: 'Sabun cuci tangan', x: 85, y: 60 }
                ]
            },
            general: {
                background: 'interior_rumah_general',
                hazards: [
                    { id: 'dirty_water', label: 'Air minum tidak dimasak', x: 30, y: 40, comB: 'opp_phy' },
                    { id: 'no_handwash', label: 'Tidak ada tempat cuci tangan', x: 65, y: 35, comB: 'opp_phy' },
                    { id: 'open_food', label: 'Makanan tidak tertutup', x: 45, y: 55, comB: 'mot_aut' },
                    { id: 'trash', label: 'Sampah berserakan', x: 20, y: 70, comB: 'opp_phy' },
                    { id: 'flies', label: 'Lalat di makanan', x: 50, y: 50, comB: 'opp_phy' },
                    { id: 'no_latrine', label: 'Tidak ada jamban', x: 85, y: 65, comB: 'opp_phy' }
                ],
                fakeItems: [
                    { id: 'shoes', label: 'Sepatu rapi', x: 15, y: 30 },
                    { id: 'calendar', label: 'Kalender', x: 90, y: 10 }
                ]
            }
        }
    },

    // ─── 2. Baca Ekspresi (Read the Expression) ───
    baca_ekspresi: {
        id: 'baca_ekspresi',
        title: 'Baca Ekspresi',
        subtitle: 'Pahami Perasaan Warga',
        icon: '😐',
        description: 'Baca ekspresi dan bahasa tubuh NPC untuk memahami barrier motivasi mereka.',
        gameType: 'expression_reading',
        targetBarriers: ['mot_ref', 'opp_soc'],
        interventionFunction: 'persuasion',
        timeLimit: 45,
        difficulty: {
            easy: { rounds: 3, options: 3 },
            normal: { rounds: 5, options: 4 },
            hard: { rounds: 7, options: 5 }
        },
        scoring: {
            correct: 20,
            incorrect: -5,
            streak: 10, // Bonus per consecutive correct
        },
        expressions: [
            {
                id: 'denial',
                emoji: '😤',
                npcLine: '"Nggak, anak saya nggak sakit kok!"',
                correctRead: 'Penolakan (Denial)',
                barrier: 'mot_ref',
                options: ['Penolakan (Denial)', 'Marah', 'Kelelahan', 'Malu'],
                followUp: 'Gunakan motivational interviewing — jangan confrontasi.'
            },
            {
                id: 'shame',
                emoji: '😔',
                npcLine: '"Saya malu bilang ke tetangga soal penyakit ini..."',
                correctRead: 'Malu (Shame)',
                barrier: 'opp_soc',
                options: ['Malu (Shame)', 'Sedih', 'Bingung', 'Takut'],
                followUp: 'Normalisasi — ceritakan bahwa banyak yang mengalami hal serupa.'
            },
            {
                id: 'distrust',
                emoji: '🤨',
                npcLine: '"Dokter kemarin juga bilang gitu, tapi nggak ada hasilnya."',
                correctRead: 'Ketidakpercayaan (Distrust)',
                barrier: 'mot_ref',
                options: ['Ketidakpercayaan (Distrust)', 'Bosan', 'Marah', 'Cemas'],
                followUp: 'Validasi pengalaman mereka. Tunjukkan bukti nyata.'
            },
            {
                id: 'confusion',
                emoji: '😵‍💫',
                npcLine: '"Saya bingung, kata orang minum jamu juga bisa sembuh..."',
                correctRead: 'Bingung (Confusion)',
                barrier: 'cap_psy',
                options: ['Bingung (Confusion)', 'Penasaran', 'Frustrasi', 'Pasrah'],
                followUp: 'Edukasi sederhana dengan bahasa yang mudah dipahami.'
            },
            {
                id: 'fear',
                emoji: '😰',
                npcLine: '"Kalau divaksin nanti anak saya autis gimana?"',
                correctRead: 'Takut (Fear)',
                barrier: 'mot_ref',
                options: ['Takut (Fear)', 'Cemas', 'Marah', 'Bingung'],
                followUp: 'Berikan data keamanan vaksin. Gunakan cerita keberhasilan warga lain.'
            },
            {
                id: 'resignation',
                emoji: '😑',
                npcLine: '"Yah mau gimana lagi Dok, memang nasib kami begini..."',
                correctRead: 'Pasrah (Resignation)',
                barrier: 'mot_ref',
                options: ['Pasrah (Resignation)', 'Lelah', 'Sedih', 'Acuh'],
                followUp: 'Bangun self-efficacy — tunjukkan langkah kecil yang bisa dilakukan SEKARANG.'
            },
            {
                id: 'anger',
                emoji: '😡',
                npcLine: '"Kenapa Puskesmas baru datang sekarang?! Kemarin ke mana aja!"',
                correctRead: 'Marah (Anger)',
                barrier: 'opp_soc',
                options: ['Marah (Anger)', 'Kecewa', 'Frustrasi', 'Takut'],
                followUp: 'Dengarkan dulu. Akui kekurangan. Fokus pada solusi ke depan.'
            }
        ]
    },

    // ─── 3. Susun Strategi (Strategy Card Matching) ───
    susun_strategi: {
        id: 'susun_strategi',
        title: 'Susun Strategi',
        subtitle: 'Padankan Intervensi dengan Barrier',
        icon: '🃏',
        description: 'Cocokkan kartu intervensi dengan barrier COM-B yang tepat. Drag & drop.',
        gameType: 'card_matching',
        targetBarriers: ['cap_psy', 'opp_phy', 'opp_soc', 'mot_ref', 'mot_aut'],
        interventionFunction: 'all',
        timeLimit: 90,
        difficulty: {
            easy: { cards: 4, distractors: 1 },
            normal: { cards: 6, distractors: 2 },
            hard: { cards: 8, distractors: 3 }
        },
        scoring: {
            correct: 20,
            incorrect: -15,
            speedBonus: 10, // If placed within 5 seconds
        },
        /**
         * Intervention cards — each card maps to specific barriers.
         * Player must drag cards onto the correct barrier slots.
         */
        cards: [
            { id: 'card_education', label: 'Edukasi Kesehatan', icon: '📚', matchBarriers: ['cap_psy'], function: 'education' },
            { id: 'card_persuasion', label: 'Motivational Interviewing', icon: '💬', matchBarriers: ['mot_ref'], function: 'persuasion' },
            { id: 'card_modelling', label: 'Tunjukkan Contoh Sukses', icon: '👀', matchBarriers: ['opp_soc', 'mot_ref'], function: 'modelling' },
            { id: 'card_enablement', label: 'Fasilitasi (Alat/Bahan)', icon: '🧰', matchBarriers: ['cap_phy', 'opp_phy'], function: 'enablement' },
            { id: 'card_environmental', label: 'Modifikasi Lingkungan', icon: '🏠', matchBarriers: ['opp_phy'], function: 'environmental' },
            { id: 'card_training', label: 'Pelatihan Keterampilan', icon: '🎓', matchBarriers: ['cap_phy', 'cap_psy'], function: 'training' },
            { id: 'card_incentive', label: 'Insentif/Reward', icon: '🏆', matchBarriers: ['mot_aut'], function: 'incentivisation' },
            { id: 'card_coercion', label: 'Aturan/Regulasi', icon: '📋', matchBarriers: ['mot_aut', 'opp_soc'], function: 'coercion' },
            { id: 'card_restriction', label: 'Batasi Akses (Harm)', icon: '🚫', matchBarriers: ['opp_phy'], function: 'restriction' }
        ],
        // Distractor cards (wrong answers)
        distractors: [
            { id: 'card_magic', label: 'Minum Jamu Ajaib', icon: '🧪' },
            { id: 'card_ignore', label: 'Biarkan Saja', icon: '🙈' },
            { id: 'card_blame', label: 'Salahkan Warga', icon: '👉' }
        ]
    },

    // ─── 4. Tebak-Tebakan Sehat (Health Quiz Rapid-Fire) ───
    tebak_sehat: {
        id: 'tebak_sehat',
        title: 'Tebak-Tebakan Sehat',
        subtitle: 'Kuis Kesehatan Kilat',
        icon: '❓',
        description: 'Jawab pertanyaan kesehatan cepat untuk menguji dan membangun pengetahuan warga.',
        gameType: 'quiz_rapid',
        targetBarriers: ['cap_psy'],
        interventionFunction: 'education',
        timeLimit: 60,
        difficulty: {
            easy: { questions: 5, timePerQuestion: 15 },
            normal: { questions: 8, timePerQuestion: 10 },
            hard: { questions: 12, timePerQuestion: 7 }
        },
        scoring: {
            correct: 15,
            incorrect: -5,
            perfectBonus: 30 // All correct
        },
        questionBanks: {
            scabies: [
                { q: 'Scabies (kudis) disebabkan oleh:', a: 'Tungau Sarcoptes scabiei', wrong: ['Virus', 'Bakteri', 'Darah kotor'] },
                { q: 'Pengobatan scabies harus:', a: 'Serentak seluruh keluarga', wrong: ['Hanya yang gatal', 'Satu per satu', 'Yang terparah dulu'] },
                { q: 'Sprei penderita scabies harus:', a: 'Dicuci air panas & dijemur', wrong: ['Dibuang', 'Dibiarkan saja', 'Dilipat rapi'] }
            ],
            dengue: [
                { q: 'Nyamuk Aedes aegypti bertelur di:', a: 'Air bersih tergenang', wrong: ['Got kotor', 'Sawah', 'Air sungai'] },
                { q: '3M Plus artinya:', a: 'Menguras, Menutup, Mengubur + tambahan', wrong: ['Mandi 3 kali', 'Makan 3 kali', 'Minum 3 liter'] },
                { q: 'ABJ (Angka Bebas Jentik) yang ideal:', a: '≥ 95%', wrong: ['≥ 50%', '≥ 70%', '100%'] }
            ],
            tb: [
                { q: 'Batuk berapa lama dicurigai TB?', a: '≥ 2 minggu', wrong: ['≥ 1 bulan', '≥ 3 hari', '≥ 1 minggu'] },
                { q: 'TB menular melalui:', a: 'Droplet (percik renik)', wrong: ['Sentuhan kulit', 'Makanan', 'Air mandi'] },
                { q: 'Pengobatan TB memakan waktu:', a: '6-8 bulan', wrong: ['1 minggu', '1 bulan', 'Sampai batuk hilang'] }
            ],
            immunization: [
                { q: 'Vaksin DPT melindungi dari:', a: 'Difteri, Pertusis, Tetanus', wrong: ['Demam, Pilek, TBC', 'Diare, Polio, Tifus', 'DBD, Pneumonia, TB'] },
                { q: 'KIPI ringan setelah vaksin:', a: 'Normal — demam ringan, nyeri lokal', wrong: ['Tanda vaksin palsu', 'Harus bawa ke RS', 'Tidak boleh vaksin lagi'] },
                { q: 'Cakupan imunisasi desa yang ideal:', a: '≥ 95% (herd immunity)', wrong: ['≥ 50%', '≥ 70%', '100%'] }
            ],
            general: [
                { q: 'CTPS artinya:', a: 'Cuci Tangan Pakai Sabun', wrong: ['Cek Tekanan Puskesmas', 'Check-up Tahunan', 'Cuci Tubuh Pagi Sore'] },
                { q: 'Oralit buatan rumah:', a: '1 liter air + 1 sdt garam + 8 sdt gula', wrong: ['Air kelapa saja', 'Teh manis', 'Air garam saja'] },
                { q: 'PHBS artinya:', a: 'Perilaku Hidup Bersih dan Sehat', wrong: ['Pengobatan Herbal Bersama Suster', 'Pemerintah Hibah Beras Sehat', 'Penanganan Hewan Buas Segera'] }
            ]
        }
    }
};

// ═══════════════════════════════════════════════════════════════
// MICRO-TASKS (6 types, ~30-60 sec each)
// Used during Quick Visit mode
// ═══════════════════════════════════════════════════════════════

export const MICRO_TASKS = {
    // ─── Inspect Skin (Scabies) ───
    inspect_skin: {
        id: 'inspect_skin',
        title: 'Periksa Kulit',
        icon: '🔬',
        description: 'Periksa tanda-tanda scabies pada anggota keluarga.',
        gameType: 'tap_sequence',
        duration: 30,
        instructions: 'Tap area tubuh yang perlu diperiksa untuk tanda scabies.',
        checkpoints: [
            { area: 'sela_jari', label: 'Sela Jari Tangan', isCorrect: true, finding: 'Papul, terowongan (+)' },
            { area: 'pergelangan', label: 'Pergelangan Tangan', isCorrect: true, finding: 'Lesi eritematosa' },
            { area: 'ketiak', label: 'Ketiak', isCorrect: true, finding: 'Nodul pruritus' },
            { area: 'genital', label: 'Area Genital', isCorrect: true, finding: 'Nodul skabies' },
            { area: 'wajah', label: 'Wajah', isCorrect: false, finding: 'Normal (jarang pada dewasa)' },
            { area: 'telapak_kaki', label: 'Telapak Kaki', isCorrect: false, finding: 'Normal' }
        ],
        successThreshold: 3 // Min correct taps
    },

    // ─── Check KMS (Growth Chart — STH/Stunting) ───
    check_kms: {
        id: 'check_kms',
        title: 'Cek KMS Anak',
        icon: '📊',
        description: 'Baca Kartu Menuju Sehat dan tentukan status gizi anak.',
        gameType: 'chart_reading',
        duration: 45,
        instructions: 'Plotkan berat badan anak pada grafik KMS dan tentukan zona.',
        data: {
            childAge: 24,     // months
            childWeight: 8.5, // kg
            expectedWeight: 12.0, // kg for age
            zone: 'merah' // BGM (Bawah Garis Merah)
        },
        options: [
            { id: 'hijau', label: 'Zona Hijau (Normal)', correct: false },
            { id: 'kuning', label: 'Zona Kuning (Perlu Perhatian)', correct: false },
            { id: 'merah', label: 'Di Bawah Garis Merah (BGM)', correct: true },
            { id: 'naik', label: 'Garis Naik (Tumbuh Baik)', correct: false }
        ],
        successThreshold: 1
    },

    // ─── Check Jentik (Larvae Survey — Dengue) ───
    check_jentik: {
        id: 'check_jentik',
        title: 'Survei Jentik',
        icon: '🦟',
        description: 'Periksa kontainer air untuk keberadaan jentik nyamuk.',
        gameType: 'tap_sequence',
        duration: 30,
        instructions: 'Tap kontainer air yang perlu diperiksa. Catat mana yang positif jentik.',
        checkpoints: [
            { area: 'bak_mandi', label: 'Bak Mandi', isCorrect: true, finding: 'Jentik (+++) — banyak sekali!' },
            { area: 'pot_bunga', label: 'Tatakan Pot Bunga', isCorrect: true, finding: 'Jentik (+) — beberapa' },
            { area: 'ban_bekas', label: 'Ban Bekas', isCorrect: true, finding: 'Jentik (++) — sedang' },
            { area: 'tempayan', label: 'Tempayan Tertutup', isCorrect: false, finding: 'Negatif — tertutup rapat' },
            { area: 'ember_kering', label: 'Ember Kering', isCorrect: false, finding: 'Negatif — tidak ada air' },
            { area: 'galon', label: 'Galon Air Minum', isCorrect: false, finding: 'Negatif — tertutup' }
        ],
        successThreshold: 2
    },

    // ─── Check Temperature (TB/Measles screening) ───
    check_temp: {
        id: 'check_temp',
        title: 'Cek Suhu & Gejala',
        icon: '🌡️',
        description: 'Ukur suhu tubuh dan tanyakan gejala penyerta.',
        gameType: 'triage_quick',
        duration: 30,
        instructions: 'Tentukan triase berdasarkan suhu dan gejala.',
        vitals: { temp: 38.8, rr: 24, hr: 100 },
        symptoms: ['Batuk > 2 minggu', 'BB turun', 'Keringat malam'],
        options: [
            { id: 'suspect_tb', label: 'Suspek TB — Rujuk ke Poli', correct: true },
            { id: 'ispa', label: 'ISPA Biasa — Obat Simptomatik', correct: false },
            { id: 'normal', label: 'Normal — Tidak Perlu Tindakan', correct: false },
            { id: 'emergency', label: 'Emergency — Rujuk RS', correct: false }
        ],
        successThreshold: 1
    },

    // ─── Cuci Tangan Tutorial (Hand Washing) ───
    cuci_tangan: {
        id: 'cuci_tangan',
        title: 'Tutorial Cuci Tangan',
        icon: '🧼',
        description: 'Ajarkan teknik cuci tangan 6 langkah WHO kepada warga.',
        gameType: 'sequence',
        duration: 45,
        instructions: 'Urutkan langkah cuci tangan 6 langkah WHO dengan benar.',
        correctSequence: [
            { step: 1, label: 'Gosok telapak tangan', icon: '🤲' },
            { step: 2, label: 'Gosok punggung tangan', icon: '✋' },
            { step: 3, label: 'Gosok sela jari', icon: '🤞' },
            { step: 4, label: 'Kunci jari-jari', icon: '🤝' },
            { step: 5, label: 'Putar ibu jari', icon: '👍' },
            { step: 6, label: 'Gosok ujung jari di telapak', icon: '🤏' }
        ],
        successThreshold: 5 // At least 5 of 6 in correct order
    },

    // ─── Buat Oralit (Make ORS) ───
    buat_oralit: {
        id: 'buat_oralit',
        title: 'Buat Oralit Rumahan',
        icon: '🥄',
        description: 'Ajarkan warga membuat oralit dari bahan dapur.',
        gameType: 'recipe',
        duration: 30,
        instructions: 'Pilih bahan dan takaran yang tepat untuk membuat oralit.',
        correctRecipe: { air: '1 liter', garam: '1 sendok teh', gula: '8 sendok teh' },
        options: [
            { ingredient: 'air', amounts: ['1 gelas', '1 liter', '2 liter'] },
            { ingredient: 'garam', amounts: ['1 sendok makan', '1 sendok teh', '3 sendok teh'] },
            { ingredient: 'gula', amounts: ['1 sendok teh', '8 sendok teh', '1 sendok makan'] }
        ],
        successThreshold: 3 // All 3 correct
    }
};

// ═══════════════════════════════════════════════════════════════
// HELPER: Get mini-game for a scenario
// ═══════════════════════════════════════════════════════════════

/**
 * Get the appropriate mini-game for a behavior change scenario.
 * @param {Object} scenario - From DiseaseScenarios
 * @param {string} mode - 'quick' or 'deep'
 * @returns {Object} Mini-game or micro-task definition
 */
export function getMiniGameForScenario(scenario, mode = 'deep') {
    if (mode === 'quick') {
        // Quick mode uses micro-tasks from scenario's quickVisitVariant
        const microTaskId = scenario.quickVisitVariant?.microTask;
        if (microTaskId && MICRO_TASKS[microTaskId]) {
            return { type: 'micro', ...MICRO_TASKS[microTaskId] };
        }
        // Fallback to general check
        return { type: 'micro', ...MICRO_TASKS.check_temp };
    }

    // Deep mode: select based on primary barriers and best interventions
    const bestIntervention = scenario.bestInterventions?.[0];
    const primaryBarrier = scenario.primaryBarriers?.[0];

    // Match by intervention function
    if (bestIntervention === 'environmental' || primaryBarrier === 'opp_phy') {
        return { type: 'core', ...MINI_GAMES.inspeksi_kilat };
    }
    if (bestIntervention === 'persuasion' || primaryBarrier === 'mot_ref' || primaryBarrier === 'opp_soc') {
        return { type: 'core', ...MINI_GAMES.baca_ekspresi };
    }
    if (bestIntervention === 'education' || primaryBarrier === 'cap_psy') {
        return { type: 'core', ...MINI_GAMES.tebak_sehat };
    }

    // Default: strategy matching
    return { type: 'core', ...MINI_GAMES.susun_strategi };
}

/**
 * Calculate score for a completed mini-game.
 * @param {string} gameId - Mini-game or micro-task ID
 * @param {Object} results - Player's results { correct, incorrect, timeRemaining, attempts }
 * @returns {{ score: number, maxScore: number, normalized: number, feedback: string }}
 */
export function scoreMiniGame(gameId, results) {
    const game = MINI_GAMES[gameId] || MICRO_TASKS[gameId];
    if (!game) return { score: 0, maxScore: 100, normalized: 0, feedback: 'Game not found' };

    const scoring = game.scoring || { correct: 20, incorrect: -5 };
    let score = 0;

    score += (results.correct || 0) * (scoring.correct || 20);
    score += (results.incorrect || 0) * (scoring.incorrect || -5);

    if (scoring.timeBonus && results.timeRemaining) {
        score += Math.floor(results.timeRemaining / 10) * scoring.timeBonus;
    }

    if (scoring.perfectBonus && results.incorrect === 0 && results.correct > 0) {
        score += scoring.perfectBonus;
    }

    if (scoring.streak && results.streak) {
        score += results.streak * scoring.streak;
    }

    const maxScore = 100;
    const normalized = Math.max(0, Math.min(100, score));

    let feedback;
    if (normalized >= 90) feedback = '🌟 Luar biasa! Anda sangat terampil!';
    else if (normalized >= 70) feedback = '👍 Bagus! Pemahaman Anda sudah baik.';
    else if (normalized >= 50) feedback = '⚠️ Cukup, tapi masih perlu latihan.';
    else feedback = '❌ Perlu perbaikan. Coba lagi!';

    return { score, maxScore, normalized, feedback };
}

// ═══════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════

export default {
    MINI_GAMES,
    MICRO_TASKS,
    getMiniGameForScenario,
    scoreMiniGame
};
