/**
 * @reflection
 * [IDENTITY]: DigestiveCases
 * [PURPOSE]: Digestive emergency cases.
 * [STATE]: Stable
 */

export const DIGESTIVE_CASES = [
    {
        id: 'food_poisoning_acute',
        diagnosis: 'Keracunan Makanan Akut',
        icd10: 'T62.9',
        skdi: '4A',
        category: 'Digestive',
        triageLevel: 2,
        esiLevel: 3,
        symptoms: ['Mual muntah hebat', 'Diare profus', 'Nyeri perut kolik', 'Lemas/pucat', 'Banyak berkeringat'],
        clue: "[URGENT] Riwayat makan makanan mencurigakan diikuti muntah+diare masif. Cegah dehidrasi, identifikasi zat penyebab!",
        relevantLabs: ['Darah Lengkap'],
        anamnesisQuestions: {
            keluhan_utama: [
                { id: 'q_event', text: 'Makan apa terakhir?', response: 'Makan nasi bungkus dari warung dok, 3 jam lalu.', priority: 'essential' },
                { id: 'q_onset', text: 'Mulai kapan mualnya?', response: 'Baru 2 jam ini dok, langsung muntah terus.' }
            ],
            rps: [
                { id: 'q_vomit_freq', text: 'Sudah berapa kali muntah?', response: 'Sudah 6-7 kali dok, nggak berhenti.', priority: 'essential' },
                { id: 'q_diarrhea', text: 'Ada diare?', response: 'Iya cair banget dok, sudah 4 kali.' },
                { id: 'q_others', text: 'Yang lain juga sakit?', response: 'Teman saya yang makan bareng juga muntah-muntah dok.', priority: 'essential' }
            ],
            rpd: [],
            sosial: []
        },
        essentialQuestions: ['q_event', 'q_vomit_freq', 'q_others'],
        anamnesis: [
            "Muntah-muntah terus dok setelah makan nasi bungkus. Teman saya juga kena.",
            "Baru makan 3 jam lalu, langsung mual, muntah, diare cair, lemas sekali."
        ],
        physicalExamFindings: {
            general: "Tampak lemas, gelisah, mukosa bibir kering.",
            vitals: "TD 100/60, N 110x, RR 22x, S 37.5°C",
            abdomen: "Bising usus meningkat (hiperaktif), nyeri tekan difus terutama epigastrium, defans (-), turgor kulit menurun."
        },
        correctTreatment: [
            ['iv_line', 'iv_fluid_rl', 'activated_charcoal'],
            ['paracetamol_500', 'monitor_vitals_15', 'observation_6h']
        ],
        differentialDiagnosis: ['Gastroenteritis akut', 'Keracunan pestisida', 'Apendisitis akut', 'Kolera'],
        risk: 'emergency',
        referralRequired: false,
        deteriorationRate: 2
    },
    {
        id: 'severe_dehydration_shock',
        diagnosis: 'Syok Hipovolemik (Dehidrasi Berat)',
        icd10: 'R57.1',
        skdi: '3B',
        category: 'Digestive',
        triageLevel: 1,
        esiLevel: 1,
        symptoms: ['Tidak sadar/gelisah', 'Mata cekung', 'Kulit kering/turgor sangat lambat', 'Nadi lemah cepat', 'Tidak bisa minum'],
        clue: "[CRITICAL] Diare berat dengan tanda syok: nadi lemah, akral dingin, turgor sangat lambat. Resusitasi cairan SEGERA!",
        relevantLabs: ['Darah Lengkap', 'Elektrolit'],
        anamnesisQuestions: {
            keluhan_utama: [
                { id: 'q_event', text: 'Diare sudah berapa hari?', response: 'Sudah 2 hari dok, makin parah.', priority: 'essential' },
                { id: 'q_vomit', text: 'Ada muntah?', response: 'Iya dok, minum apa aja keluar lagi.', priority: 'essential' },
                { id: 'q_urine', text: 'Terakhir BAK kapan?', response: 'Sudah dari tadi pagi nggak kencing dok.', priority: 'essential' }
            ],
            rps: [
                { id: 'q_frequency', text: 'Berapa kali BAB cair?', response: 'Sudah nggak bisa dihitung dok, >10 kali sehari.' },
                { id: 'q_drink', text: 'Masih bisa minum?', response: 'Nggak kuat minum dok, dimuntahkan lagi.' }
            ],
            rpd: [],
            sosial: []
        },
        essentialQuestions: ['q_event', 'q_vomit', 'q_urine'],
        anamnesis: [
            "Anak saya diare 2 hari nggak berhenti, sekarang lemas nggak sadar dok!",
            "Diare cair terus, sudah nggak bisa minum, matanya cekung, nggak kencing dari pagi."
        ],
        physicalExamFindings: {
            general: "Gelisah → somnolen, sangat lemah, mata cekung, air mata (-), mukosa sangat kering.",
            vitals: "TD 70/50, N 140x lemah (thready), RR 30x cepat dan dalam, S 38.2°C, CRT >3 detik",
            abdomen: "Bising usus meningkat, turgor kulit sangat lambat (>2 detik)."
        },
        correctTreatment: [
            ['iv_line', 'rehydration_bolus', 'oxygen'],
            ['iv_fluid_rl', 'monitor_vitals_15', 'check_cause']
        ],
        differentialDiagnosis: ['Kolera', 'Keracunan', 'Intususepsi (pada anak)', 'Syok septik'],
        risk: 'critical',
        referralRequired: true,
        deteriorationRate: 7
    },
    {
        id: 'hematemesis_melena',
        diagnosis: 'Hematemesis Melena (Perdarahan Saluran Cerna Atas)',
        icd10: 'K92.0',
        icd9cm: ['44.43', '96.6'],
        skdi: '3B',
        category: 'Digestive',
        triageLevel: 1,
        esiLevel: 1,
        symptoms: ['Muntah darah (hitam/merah segar)', 'BAB hitam (melena)', 'Pucat lemas', 'Hipotensi', 'Takikardia'],
        clue: "[CRITICAL] Hematemesis — perdarahan GI atas! Resusitasi cairan + NGT + crossmatch! Cari sumber: varises/erosif/ulkus!",
        relevantLabs: ['Darah Lengkap', 'GDS'],
        anamnesisQuestions: {
            keluhan_utama: [
                { id: 'q_vomit', text: 'Muntah darah warnanya apa?', response: 'Hitam kayak ampas kopi dok, banyak banget.', priority: 'essential' },
                { id: 'q_stool', text: 'BAB warnanya gimana?', response: 'Hitam-hitam lengket kayak aspal dok.', priority: 'essential' },
                { id: 'q_dizzy', text: 'Pusing?', response: 'Pusing banget dok, kayak mau pingsan kalau berdiri.', priority: 'essential' }
            ],
            rpd: [
                { id: 'q_ulcer', text: 'Ada maag atau sakit lambung?', response: 'Sering maag dok, sering minum jamu campur piroxicam.' },
                { id: 'q_liver', text: 'Ada penyakit hati?', response: 'Nggak tahu dok, belum pernah periksa.' }
            ],
            sosial: [
                { id: 'q_alcohol', text: 'Minum alkohol?', response: 'Kadang-kadang dok, pas kumpulan.' }
            ]
        },
        essentialQuestions: ['q_vomit', 'q_stool', 'q_dizzy'],
        anamnesis: [
            "Muntah hitam seperti ampas kopi, BAB hitam, pusing, lemas.",
            "Hematemesis massive + melena, pucat berat, curiga perdarahan GI atas."
        ],
        physicalExamFindings: {
            general: "Tampak pucat berat, berkeringat dingin, gelisah.",
            vitals: "TD 80/50, N 130x lemah, RR 26x, S 36.5°C",
            abdomen: "Nyeri tekan epigastrium, defans (-), bising usus metalik. RT: melena (+).",
            extremities: "Pucat berat, CRT >3 detik, akral dingin."
        },
        correctTreatment: [
            ['iv_line', 'nacl_resus', 'ngt_decompression', 'blood_crossmatch'],
            ['tranexamic_acid_iv', 'ondansetron_iv', 'monitor_vitals_15', 'catheter_urine']
        ],
        differentialDiagnosis: ['Varises esofagus pecah', 'Ulkus peptikum perforasi', 'Gastritis erosif', 'Mallory-Weiss tear'],
        risk: 'critical',
        referralRequired: true,
        referralTarget: 'SpPD_Gastro',
        deteriorationRate: 8,
        sisruteData: {
            situation: 'Hematemesis masif (coffee ground) + melena, TD 80/50, Hb estimated rendah.',
            background: 'Riwayat maag kronik, konsumsi NSAID (piroxicam) jangka panjang.',
            assessment: 'Perdarahan GI atas masif curiga ulkus peptikum/varises. Resusitasi dimulai.',
            recommendation: 'SpPD Gastro untuk endoskopi urgent + hemostasis. Siapkan PRC 2 kolf.'
        },
        billingItems: {
            tindakan: [{ code: '96.6', name: 'IV Line', actionId: 'iv_line' }, { code: '44.43', name: 'NGT', actionId: 'ngt_decompression' }],
            obat: [{ medId: 'nacl_resus', qty: 2 }, { medId: 'tranexamic_acid_iv', qty: 1 }, { medId: 'ondansetron_iv', qty: 1 }],
            alkes: [{ id: 'iv_cannula', qty: 2, unitCost: 15000 }, { id: 'ngt_tube', qty: 1, unitCost: 25000 }, { id: 'kateter_foley', qty: 1, unitCost: 25000 }],
            estimatedCost: 600000
        },
        wikiKey: 'igd_hematemesis'
    }
];
