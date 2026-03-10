/**
 * @reflection
 * [IDENTITY]: trauma
 * [PURPOSE]: Trauma & Emergency cases for CaseLibrary.
 * [STATE]: Experimental
 * [LAST_UPDATE]: 2026-02-12
 */

export const TRAUMA_CASES = [
    {
        id: 'tension_pneumothorax',
        diagnosis: 'Tension Pneumothorax',
        icd10: 'J93.0',
        skdi: '4A',
        category: 'Respiratory', // Clinical category is respiratory, but utility is trauma/emergency
        symptoms: ['Sesak napas berat', 'Nyeri dada mendadak', 'Gelisah', 'JVP meningkat'],
        clue: "GAGAL NAPAS EMERGENCY. Deviasi trakea ke sisi sehat, perkusi hipersonor, suara napas hilang. Tindakan: Needle Decompression segera!",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Ada apa ini pak, bisa ceritakan?', response: '...(Pasien cuma bisa menganga, sesak berat sekali)...', sentiment: 'confirmation', priority: 'essential' }],
            rps: [{ id: 'q_onset', text: 'Sesaknya sejak kapan?', response: 'Baru saja dok, tiba-tiba sesak setelah kecelakaan.', sentiment: 'confirmation' }],
            rpd: [], rpk: [], sosial: []
        },
        essentialQuestions: ['q_main'],
        anamnesis: ["(Pasien sesak napas berat, tidak bisa bicara lancar, memegang dada).", "Tiba-tiba dada sesak sekali dok, rasanya mau mati."],
        physicalExamFindings: {
            general: "Gelisah, distress napas berat, sianosis.",
            vitals: "TD 80/60 (Syok Obstruktif), N 120x, RR 34x, S 36.5°C, SpO2 85%",
            thorax: "I: Statis/Dinamis asimetris (kanan tertinggal). P: Trakea deviasi ke kiri. P: Hipersonor pada hemitoraks kanan. A: Suara napas kanan hilang."
        },
        labs: {}, vitals: { temp: 36.5, bp: '80/60', hr: 120, rr: 34, spo2: 85 },
        correctTreatment: ['nasal_cannula', 'rl_500'],
        correctProcedures: ['needle_decompression', 'airway_management'],
        requiredEducation: ['red_flag_monitor'],
        risk: 'emergency', nonReferrable: false, referralExceptions: ['emergency_stabilization'],
        differentialDiagnosis: ['I21.9', 'I26.9']
    },
    {
        id: 'bone_fracture_simple',
        diagnosis: 'Fraktur Tertutup (Simple)',
        icd10: 'S52.9',
        skdi: '4A',
        category: 'Skeletal',
        symptoms: ['Nyeri hebat setelah trauma', 'Deformitas', 'Bengkak', 'Tidak bisa digerakkan'],
        clue: "Trauma (jatuh/kecelakaan). Look: Bengkak, deformitas (+/-). Feel: Nyeri tekan (+), krepitasi (+). Move: ROM terhambat. Pertolongan pertama: Bidai (Splinting).",
        relevantLabs: ['Rontgen Antebrachii'],
        anamnesisQuestions: {
            keluhan_utama: [
                { id: 'q_main', text: 'Tangannya kenapa ini pak/bu?', response: 'Habis jatuh dok, sakit banget, nggak bisa digerakin.', sentiment: 'confirmation', priority: 'essential' }
            ],
            rps: [
                { id: 'q_trauma', text: 'Kejadiannya gimana ceritanya?', response: 'Tadi habis jatuh dari motor, miring kena tangan kanan.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_open_wound', text: 'Ada luka terbuka atau tulangnya yang keluar nggak?', response: 'Enggak ada dok, cuma bengkak sama biru aja.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_numbness', text: 'Jari-jarinya bisa digerakin nggak? Ada kesemutan?', response: 'Bisa digerakin dok, tapi agak kaku karena bengkak. Nggak kesemutan.', sentiment: 'confirmation' },
                { id: 'q_onset_time', text: 'Kejadiannya tadi jam berapa?', response: 'Sekitar 1 jam yang lalu dok.', sentiment: 'confirmation' }
            ],
            rpd: [],
            rpk: [],
            sosial: []
        },
        essentialQuestions: ['q_main', 'q_trauma', 'q_open_wound'],
        anamnesis: ["Tangannya sakit habis jatuh dok, nggak bisa gerak sama sekali.", "Tolong dok, lengan saya kayak bengkok gini habis kepeleset tadi."],
        physicalExamFindings: {
            general: "Tampak meringis menahan sakit.",
            vitals: "Dalam batas normal.",
            extremities: "Status Lokalis Antebrachii Dextra: L: Edema (+), Angulasi (+). F: Nyeri tekan (+), krepitasi (+), pulsasi arteri distal (+). M: ROM terbatas karena nyeri."
        },
        labs: { "Rontgen Antebrachii": { result: "Fraktur transversal pada 1/3 tengah radius ulna.", cost: 100000 } },
        vitals: { temp: 36.6, bp: '120/80', hr: 88, rr: 20 },
        correctTreatment: ['ibuprofen_400', 'paracetamol_500'],
        correctProcedures: ['fracture_splinting'],
        requiredEducation: ['dont_strain', 'routine_control'],
        risk: 'medium', nonReferrable: false, referralExceptions: ['conservative_management'],
        differentialDiagnosis: ['S50', 'S53']
    },
    {
        id: 'luka_bakar_minor',
        diagnosis: 'Luka Bakar Derajat I-II (<20% BSA)',
        icd10: 'T30.0',
        skdi: '4A',
        category: 'Trauma',
        symptoms: ['Kulit merah/melepuh', 'Nyeri', 'Riwayat terpapar panas', 'Bula (+)'],
        clue: "Derajat I: eritema, nyeri, kulit utuh. Derajat II: bula, nyeri hebat. BSA <20% dewasa bisa rawat jalan. Pendinginan + SSD cream + balut steril. BSA >20% atau anak/inhalasi → RUJUK!",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Kenapa ini, apa yang terjadi pak/bu?', response: 'Kena minyak panas dok, tangan melepuh.', sentiment: 'confirmation', priority: 'essential' }],
            rps: [
                { id: 'q_cause', text: 'Kena apa panasnya?', response: 'Minyak goreng panas dok.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_extent', text: 'Seberapa luas lukanya?', response: 'Lengan bawah aja dok.', sentiment: 'confirmation' }
            ],
            rpd: [], rpk: [], sosial: []
        },
        essentialQuestions: ['q_main', 'q_cause'],
        anamnesis: ["Tangan saya kena minyak panas, melepuh.", "Kulit lengan merah dan ada gelembung air, perih banget."],
        physicalExamFindings: { general: "Tampak nyeri.", vitals: "TD 120/80, N 88x, RR 18x, S 36.7°C", skin: "Luka bakar derajat II pada antebrachii sinistra: BSA ~5%. Bula (+) multipel, dasar luka merah muda, nyeri tekan (+). Kulit sekitar eritema." },
        labs: {}, vitals: { temp: 36.7, bp: '120/80', hr: 88, rr: 18 },
        correctTreatment: ['silver_sulfadiazine', 'paracetamol_500'],
        correctProcedures: ['wound_care_burn', 'sterile_dressing'],
        requiredEducation: ['wound_care_home', 'bulla_care', 'follow_up_burn', 'tetanus_status'],
        risk: 'medium', nonReferrable: true, referralExceptions: ['bsa_over_20', 'inhalation_injury', 'face_hands_genitalia', 'pediatric'],
        differentialDiagnosis: ['T30.0', 'T31.0']
    },
    {
        id: 'vulnus_laceratum',
        diagnosis: 'Vulnus Laceratum (Luka Robek)',
        icd10: 'T14.1',
        skdi: '4A',
        category: 'Trauma',
        symptoms: ['Luka robek', 'Perdarahan', 'Tepi luka tidak rata', 'Riwayat trauma'],
        clue: "Luka robek: tepi tidak rata, jaringan rusak. Bersihkan (debridement), irigasi NaCl, jahit primer jika <8 jam (golden period). Cek status tetanus!",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Kenapa kakinya, apa yang terjadi?', response: 'Kaki saya robek dok, kena besi karatan.', sentiment: 'confirmation', priority: 'essential' }],
            rps: [
                { id: 'q_cause', text: 'Bisa ceritakan kejadiannya gimana?', response: 'Tadi jatuh kena besi dok, 2 jam lalu.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_tetanus', text: 'Pernah suntik tetanus terakhir kapan?', response: 'Nggak ingat dok.', sentiment: 'denial', priority: 'essential' }
            ],
            rpd: [], rpk: [], sosial: []
        },
        essentialQuestions: ['q_main', 'q_cause', 'q_tetanus'],
        anamnesis: ["Kaki robek kena besi, berdarah.", "Luka robek di lengan habis jatuh."],
        physicalExamFindings: { general: "Tampak nyeri.", vitals: "TD 120/80, N 84x, RR 18x, S 36.7°C", extremities: "Vulnus laceratum regio cruris dextra: ukuran 5x2cm, kedalaman subkutis, tepi tidak rata, perdarahan aktif minimal, kontaminasi (+). Pulsasi distal baik, motorik dan sensorik distal intak." },
        labs: {}, vitals: { temp: 36.7, bp: '120/80', hr: 84, rr: 18 },
        correctTreatment: ['amoxicillin_500', 'paracetamol_500'],
        correctProcedures: ['wound_debridement', 'wound_suturing', 'tetanus_prophylaxis'],
        requiredEducation: ['wound_care_home', 'signs_of_infection', 'follow_up_suture_removal'],
        risk: 'medium', nonReferrable: true, referralExceptions: ['tendon_nerve_vessel_injury', 'deep_contamination'],
        differentialDiagnosis: ['T14.1', 'T14.0']
    }
];
