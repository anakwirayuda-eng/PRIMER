/**
 * @reflection
 * [IDENTITY]: NeurologyCases
 * [PURPOSE]: Neurology emergency cases.
 * [STATE]: Stable
 */

export const NEUROLOGY_CASES = [
    {
        id: 'seizure_ongoing',
        diagnosis: 'Status Epilepticus',
        icd10: 'G41.9',
        skdi: '3B',
        category: 'Neurology',
        triageLevel: 1,
        esiLevel: 1,
        symptoms: ['Kejang tidak berhenti (>5 menit)', 'Tidak sadar di antara kejang', 'Kekakuan seluruh tubuh', 'Sianosis'],
        clue: "[CRITICAL] Status Epilepticus. Kejang >5 menit atau berulang tanpa sadar diantaranya. Segera berikan Diazepam IV/Rektal!",
        relevantLabs: ['Gula Darah Sewaktu (GDS)'],
        anamnesisQuestions: {
            keluhan_utama: [
                { id: 'q_event', text: 'Kejangnya sudah berapa lama?', response: 'Sudah 10 menit nggak berhenti-berhenti dok!', priority: 'essential' },
                { id: 'q_epilepsy', text: 'Ada riwayat epilepsi?', response: 'Ada dok, bapak memang punya sakit ayan.', priority: 'essential' }
            ],
            rps: [
                { id: 'q_conscious', text: 'Tadi sempat sadar di antara kejang?', response: 'Enggak dok, dari tadi kaku terus matanya mendelik.' }
            ],
            rpd: [
                { id: 'q_compliance', text: 'Rutin minum obat?', response: 'Sering lupa dok.' }
            ],
            sosial: []
        },
        essentialQuestions: ['q_event', 'q_epilepsy'],
        anamnesis: [
            "Pasien sudah kejang 10 menit tidak berhenti!",
            "Ada riwayat epilepsi, tadi lupa minum obat."
        ],
        physicalExamFindings: {
            general: "Tampak kejang tonik-klonik umum, mulut berbusa, sianosis minimal.",
            vitals: "TD 140/90, N 120x, RR 28x, S 37.5°C",
            neuro: "Sedang kejang, pupil isokor, reflex cahaya sulit dinilai."
        },
        correctTreatment: [
            ['protect_airway', 'diazepam_10mg', 'phenytoin_iv'],
            ['iv_line', 'oxygen', 'monitor_vitals_15', 'check_cause']
        ],
        differentialDiagnosis: ['Kejang simptomatik (hipoglikemia)', 'Meningitis/Ensefalitis', 'Trauma kepala'],
        risk: 'critical',
        referralRequired: true,
        deteriorationRate: 10
    },
    {
        id: 'febrile_convulsion',
        diagnosis: 'Simple Febrile Seizure',
        icd10: 'R56.0',
        skdi: '4A',
        category: 'Neurology',
        triageLevel: 3,
        esiLevel: 3,
        symptoms: ['Kejang saat demam', 'Usia 6 bulan - 5 tahun', 'Kejang <15 menit', 'Pasca kejang sadar'],
        clue: "[OBSERVATION] Kejang demam sederhana pada balita - sudah berhenti, anak sadar. Cari fokus infeksi, turunkan demam.",
        relevantLabs: ['Darah Lengkap'],
        anamnesisQuestions: {
            keluhan_utama: [
                { id: 'q_event', text: 'Kejangnya berapa lama?', response: 'Sebentar dok, paling cuma 1-2 menit.', priority: 'essential' },
                { id: 'q_fever', text: 'Demamnya tinggi?', response: 'Panas banget dok badannya pas kejang tadi.' }
            ],
            rps: [
                { id: 'q_conscious', text: 'Setelah kejang langsung nangis?', response: 'Iya dok, langsung nangis dan sadar.' },
                { id: 'q_repeat', text: 'Kejang berulang?', response: 'Cuma sekali ini aja dok.' }
            ],
            rpd: [
                { id: 'q_prev', text: 'Pernah kejang sebelumnya?', response: 'Belum pernah dok.', priority: 'essential' },
                { id: 'q_family', text: 'Keluarga ada riwayat kejang demam?', response: 'Ayahnya dulu waktu kecil suka step.' }
            ],
            sosial: []
        },
        essentialQuestions: ['q_event', 'q_fever', 'q_prev'],
        anamnesis: [
            "Anak saya kejang dok, tadi demamnya tinggi banget.",
            "Kejangnya sekitar 2 menit, sekarang sudah berhenti dan sudah mulai sadar."
        ],
        physicalExamFindings: {
            general: "Anak rewel, post-iktal, demam.",
            vitals: "TD -, N 120x, RR 28x, S 39.5°C",
            heent: "Faring hiperemis, tonsil T2/T2 hiperemis.",
            neuro: "GCS 15 (pasca iktal sudah sadar penuh), rangsang meningeal (-)"
        },
        correctTreatment: [
            ['paracetamol_syr', 'warm_compress', 'find_focus'],
            ['education_seizure', 'diazepam_rectal_prn']
        ],
        differentialDiagnosis: ['Meningitis', 'Epilepsi', 'Kejang demam kompleks'],
        risk: 'medium',
        referralRequired: false,
        deteriorationRate: 0
    },
    {
        id: 'cva_stroke',
        diagnosis: 'Stroke / CVA (Cerebrovascular Accident)',
        icd10: 'I63',
        icd9cm: ['89.17'],
        skdi: '3B',
        category: 'Neurology',
        triageLevel: 1,
        esiLevel: 1,
        symptoms: ['Kelemahan separuh badan', 'Bicara pelo', 'Wajah mencong', 'Penurunan kesadaran', 'Nyeri kepala hebat'],
        clue: "[CRITICAL] FAST: Face drooping, Arm weakness, Speech difficulty, Time to call! Golden period 3-4.5 jam untuk trombolisis!",
        relevantLabs: ['GDS', 'Darah Lengkap'],
        anamnesisQuestions: {
            keluhan_utama: [
                { id: 'q_onset', text: 'Kapan gejalanya mulai?', response: 'Baru 1 jam lalu dok, tiba-tiba tangan kiri nggak bisa diangkat.', priority: 'essential' },
                { id: 'q_face', text: 'Wajahnya mencong?', response: 'Iya dok, yang kiri turun, air liur keluar terus.', priority: 'essential' },
                { id: 'q_speech', text: 'Bicaranya normal?', response: 'Pelo dok, susah ngomong.', priority: 'essential' }
            ],
            rpd: [
                { id: 'q_ht', text: 'Ada darah tinggi?', response: 'Iya dok, nggak rutin minum obat.' },
                { id: 'q_dm', text: 'Ada kencing manis?', response: 'Ada juga dok.' }
            ],
            sosial: [
                { id: 'q_smoke', text: 'Merokok?', response: 'Sudah 20 tahun merokok dok.' }
            ]
        },
        essentialQuestions: ['q_onset', 'q_face', 'q_speech'],
        anamnesis: [
            "Tiba-tiba tangan kiri nggak bisa diangkat, mulut mencong, bicara pelo.",
            "Onset akut 1 jam, hemiparesis kiri, disartria, wajah asimetris."
        ],
        physicalExamFindings: {
            general: "Tampak gelisah, paresis fasialis kiri sentral, disartria.",
            vitals: "TD 180/100, N 90x, RR 20x, S 36.8°C",
            neuro: "GCS E4V4M6 = 14, paresis N.VII kiri sentral, hemiparesis kiri (3/5), refleks Babinski kiri (+). NIHSS: 8."
        },
        correctTreatment: [
            ['reagen_gds', 'iv_line', 'oxygen', 'monitor_vitals_15'],
            ['ecg', 'observation_6h']
        ],
        differentialDiagnosis: ['Hipoglikemia', 'Bells palsy', 'Ensefalitis', 'Tumor intrakranial'],
        risk: 'critical',
        referralRequired: true,
        referralTarget: 'SpS',
        deteriorationRate: 6,
        sisruteData: {
            situation: 'Onset akut 1 jam, hemiparesis kiri, disartria, TD 180/100, NIHSS 8.',
            background: 'Hipertensi + DM tidak terkontrol. Perokok 20 tahun.',
            assessment: 'Stroke iskemik akut dalam golden period. Butuh CT scan + evaluasi trombolisis.',
            recommendation: 'SpS SEGERA untuk CT scan non-kontras + pertimbangan trombolisis rtPA (<4.5 jam).'
        },
        billingItems: {
            tindakan: [{ code: '89.17', name: 'Pemeriksaan Neuro', actionId: 'check_cause' }, { code: '96.6', name: 'IV Line', actionId: 'iv_line' }],
            obat: [],
            alkes: [{ id: 'iv_cannula', qty: 1, unitCost: 15000 }],
            estimatedCost: 250000
        },
        wikiKey: 'igd_cva_stroke'
    },
    {
        id: 'head_injury_moderate',
        diagnosis: 'Cedera Kepala Sedang (CKS)',
        icd10: 'S06.0',
        icd9cm: ['89.14'],
        skdi: '3B',
        category: 'Trauma',
        triageLevel: 2,
        esiLevel: 2,
        symptoms: ['Penurunan kesadaran (GCS 9-13)', 'Muntah proyektil', 'Amnesia', 'Pupil anisokor', 'Lucid interval'],
        clue: "[URGENT] CKS GCS 9-13. AWAS lucid interval → bisa herniasi! Immobilisasi C-spine, head-up 30°, monitor GCS tiap 15 menit!",
        relevantLabs: ['Darah Lengkap'],
        anamnesisQuestions: {
            keluhan_utama: [
                { id: 'q_event', text: 'Bagaimana kejadiannya?', response: 'Kecelakaan motor kecepatan tinggi, kepala kena trotoar.', priority: 'essential' },
                { id: 'q_conscious', text: 'Pingsan berapa lama?', response: 'Pingsan sekitar 10 menit dok, sekarang bingung-bingung.', priority: 'essential' },
                { id: 'q_vomit', text: 'Ada muntah?', response: 'Muntah 3 kali dok, menyembur.', priority: 'essential' }
            ],
            rps: [
                { id: 'q_amnesia', text: 'Ingat kejadiannya?', response: 'Nggak ingat dok, tahu-tahu sudah di sini.' },
                { id: 'q_helmet', text: 'Pakai helm?', response: 'Pakai tapi helmnya pecah.' }
            ],
            rpd: [
                { id: 'q_blood_thin', text: 'Minum obat pengencer darah?', response: 'Tidak dok.' }
            ],
            sosial: []
        },
        essentialQuestions: ['q_event', 'q_conscious', 'q_vomit'],
        anamnesis: [
            "KLL motor, pingsan 10 menit, sekarang bingung, muntah proyektil 3x.",
            "Cedera kepala berat, amnesia, GCS turun, pupil mulai anisokor."
        ],
        physicalExamFindings: {
            general: "Somnolen, gelisah, merintih kesakitan.",
            vitals: "TD 150/90 (Cushing), N 60x (bradikardia), RR 22x, S 36.5°C",
            heent: "Hematoma temporoparietal kanan, vulnus laceratum 5cm, Battle sign (-), Raccoon eyes (-). Pupil kanan 4mm, kiri 3mm, RC kanan lambat.",
            neuro: "GCS E3V4M5 = 12, lateralisasi: kekuatan motorik kiri 4/5."
        },
        correctTreatment: [
            ['protect_airway', 'iv_line', 'oxygen', 'cold_compress'],
            ['wound_cleaning', 'monitor_vitals_15', 'observation_6h']
        ],
        differentialDiagnosis: ['Epidural hematoma', 'Subdural hematoma', 'Contusio serebri', 'Fraktur basis cranii'],
        risk: 'emergency',
        referralRequired: true,
        referralTarget: 'SpBS',
        deteriorationRate: 5,
        sisruteData: {
            situation: 'CKS GCS 12, pupil anisokor kanan>kiri, muntah proyektil, amnesia pasca-KLL.',
            background: 'KLL motor kecepatan tinggi, LOC 10 menit, helm pecah. Cushing response (+).',
            assessment: 'CKS curiga EDH/SDH, risiko herniasi. Butuh CT scan + evaluasi SpBS.',
            recommendation: 'SpBS SEGERA untuk CT scan kepala dan evaluasi trepanasi/kraniotomi.'
        },
        billingItems: {
            tindakan: [{ code: '89.14', name: 'Neuro Monitoring', actionId: 'monitor_vitals_15' }, { code: '96.6', name: 'IV Line', actionId: 'iv_line' }],
            obat: [{ medId: 'paracetamol_500', qty: 2 }],
            alkes: [{ id: 'iv_cannula', qty: 1, unitCost: 15000 }, { id: 'kasa_steril', qty: 5, unitCost: 5000 }],
            estimatedCost: 300000
        },
        wikiKey: 'igd_head_injury_moderate'
    }
];
