/**
 * @reflection
 * [IDENTITY]: MetabolicCases
 * [PURPOSE]: Metabolic emergency cases.
 * [STATE]: Stable
 */

export const METABOLIC_CASES = [
    {
        id: 'hypoglycemia_severe',
        diagnosis: 'Severe Hypoglycemia',
        icd10: 'E16.2',
        skdi: '3B',
        category: 'Metabolic',
        triageLevel: 1,
        esiLevel: 1,
        symptoms: ['Penurunan kesadaran', 'Keringat dingin', 'Gemetar', 'Lemas', 'Pucat'],
        clue: "[CRITICAL] Penurunan kesadaran pada pasien DM. Cek GDS segera sebelum melakukan tindakan lain!",
        relevantLabs: ['Gula Darah Sewaktu (GDS)'],
        anamnesisQuestions: {
            keluhan_utama: [
                { id: 'q_event', text: 'Gimana kejadiannya tadi?', response: 'Tadi pagi bapak minum obat gula, tapi lupa nggak sarapan. Terus tiba-tiba bingung dan pingsan.', priority: 'essential' },
                { id: 'q_food', text: 'Kapan terakhir makan?', response: 'Tadi malam dok, belum makan apa-apa hari ini.', priority: 'essential' },
                { id: 'q_symptoms', text: 'Ada keringat dingin?', response: 'Iya dok, badannya basah semua.', priority: 'essential' }
            ],
            medis: [
                { id: 'q_meds', text: 'Obat apa yang diminum?', response: 'Glimiperide dok.' }
            ],
            sosial: [
                { id: 'q_habit', text: 'Sering seperti ini?', response: 'Pernah sekali dulu waktu telat makan juga.' }
            ]
        },
        essentialQuestions: ['q_event', 'q_food', 'q_symptoms'],
        anamnesis: [
            "Pasien dibawa keluarga, tadi pagi minum obat diabetes tapi belum makan.",
            "Awalnya keluar keringat dingin and gemetar, lama-lama jadi linglung."
        ],
        physicalExamFindings: {
            general: "GCS E3V2M5 (Somnolen), tampak pucat, diaphoresis (keringat dingin) profus (+).",
            vitals: "TD 110/70, N 104x (Tachicardia), RR 18x, S 36.2°C",
            neurology: "Pupil isokor, reflex cahaya (+/+), tidak ada tanda lateralisasi.",
            limbs: "Tremor halus pada tangan (+)."
        },
        correctTreatment: [
            ['reagen_gds', 'iv_line', 'd40_iv', 'd10_maintenance'],
            ['monitor_gds', 'monitor_vitals_15']
        ],
        differentialDiagnosis: ['Stroke (CVA)', 'Intoksikasi alkohol', 'Ketoasidosis diabetik'],
        risk: 'critical',
        referralRequired: false,
        deteriorationRate: 5
    },
    {
        id: 'dka_adult',
        diagnosis: 'Ketoasidosis Diabetik (KAD)',
        icd10: 'E10.1',
        icd9cm: ['99.18', '96.6'],
        skdi: '3B',
        category: 'Metabolic',
        triageLevel: 1,
        esiLevel: 1,
        symptoms: ['Napas Kussmaul', 'Dehidrasi berat', 'Bau aseton', 'Nyeri perut', 'Penurunan kesadaran'],
        clue: "[CRITICAL] DM tipe 1/2 dengan napas Kussmaul + bau aseton + GDS >300. Resusitasi NaCl + insulin drip. Monitor kalium!",
        relevantLabs: ['GDS', 'Elektrolit', 'Darah Lengkap', 'AGD'],
        anamnesisQuestions: {
            keluhan_utama: [
                { id: 'q_event', text: 'Apa yang terjadi?', response: 'Muntah-muntah dari kemarin dok, lemas, napasnya cepat.', priority: 'essential' },
                { id: 'q_insulin', text: 'Injeksi insulin rutin?', response: 'Sudah 3 hari nggak suntik dok, insulinnya habis.', priority: 'essential' },
                { id: 'q_thirst', text: 'Banyak minum?', response: 'Haus terus dan kencing terus dok.', priority: 'essential' }
            ],
            rpd: [
                { id: 'q_dm', text: 'DM sudah berapa lama?', response: 'Sejak umur 22 dok, DM tipe 1.' },
                { id: 'q_prev_dka', text: 'Pernah KAD sebelumnya?', response: 'Pernah 2 kali, harus dirawat juga.' }
            ],
            sosial: []
        },
        essentialQuestions: ['q_event', 'q_insulin', 'q_thirst'],
        anamnesis: [
            "Insulin habis 3 hari, sekarang lemas, muntah, napas cepat dan dalam, bau aseton.",
            "Pasien DM tipe 1 putus obat, datang dengan dehidrasi berat dan penurunan kesadaran."
        ],
        physicalExamFindings: {
            general: "Tampak somnolen, dehidrasi berat, napas Kussmaul, bau aseton jelas.",
            vitals: "TD 90/60, N 120x, RR 32x (Kussmaul), S 37.2°C",
            abdomen: "Nyeri tekan difus, bising usus menurun.",
            neuro: "GCS E3V4M5 = 12."
        },
        correctTreatment: [
            ['reagen_gds', 'iv_line', 'nacl_resus', 'catheter_urine'],
            ['insulin_drip', 'monitor_gds', 'monitor_vitals_15']
        ],
        differentialDiagnosis: ['HHS', 'Asidosis laktat', 'Keracunan metanol', 'Uremia'],
        risk: 'critical',
        referralRequired: true,
        referralTarget: 'SpPD',
        deteriorationRate: 6,
        sisruteData: {
            situation: 'DM tipe 1, GCS 12, GDS >500, napas Kussmaul, dehidrasi berat, bau aseton.',
            background: 'DM tipe 1 sejak usia 22. Putus insulin 3 hari. Riwayat KAD 2x.',
            assessment: 'KAD berat. Resusitasi cairan dimulai di IGD. Butuh drip insulin + monitoring ICU.',
            recommendation: 'ICU SpPD untuk insulin drip, koreksi elektrolit, AGD serial.'
        },
        billingItems: {
            tindakan: [{ code: '99.18', name: 'Insulin Drip', actionId: 'insulin_drip' }, { code: '96.6', name: 'IV Line', actionId: 'iv_line' }],
            obat: [{ medId: 'insulin_drip', qty: 1 }, { medId: 'nacl_resus', qty: 3 }],
            alkes: [{ id: 'iv_cannula', qty: 1, unitCost: 15000 }, { id: 'kateter_foley', qty: 1, unitCost: 25000 }],
            estimatedCost: 550000
        },
        wikiKey: 'igd_dka'
    },
    {
        id: 'hhs_hyperosmolar',
        diagnosis: 'Status Hiperglikemik Hiperosmolar (HHS)',
        icd10: 'E11.0',
        icd9cm: ['99.18', '96.6'],
        skdi: '3B',
        category: 'Metabolic',
        triageLevel: 1,
        esiLevel: 1,
        symptoms: ['Penurunan kesadaran berat', 'Dehidrasi berat', 'GDS >600', 'Tidak ada bau aseton', 'Kejang'],
        clue: "[CRITICAL] DM tipe 2 lansia dengan GDS >600 + dehidrasi masif TANPA aseton. HHS! Mortalitas tinggi — rehidrasi agresif!",
        relevantLabs: ['GDS', 'Elektrolit', 'Darah Lengkap'],
        anamnesisQuestions: {
            keluhan_utama: [
                { id: 'q_event', text: 'Kapan mulai lemas?', response: 'Sudah seminggu makin lemas, tadi pagi nggak bisa bangun.', priority: 'essential' },
                { id: 'q_drink', text: 'Banyak minum?', response: 'Haus terus tapi tetap lemas, kencing sangat banyak.', priority: 'essential' }
            ],
            rpd: [
                { id: 'q_dm', text: 'Ada kencing manis?', response: 'Ada dok, minum Metformin, tapi sering lupa.', priority: 'essential' },
                { id: 'q_infeksi', text: 'Ada demam atau infeksi?', response: 'Batuk pilek dari 2 minggu lalu dok.' }
            ],
            sosial: []
        },
        essentialQuestions: ['q_event', 'q_drink', 'q_dm'],
        anamnesis: [
            "Nenek 70 tahun DM, makin lemas seminggu, sekarang nggak sadar, GDS >600.",
            "Pasien DM tipe 2 lansia, dehidrasi berat, coma, tanpa napas Kussmaul."
        ],
        physicalExamFindings: {
            general: "Stupor/koma, dehidrasi sangat berat, lidah kering, mata cekung.",
            vitals: "TD 80/50, N 130x lemah, RR 22x, S 38.0°C",
            neuro: "GCS E2V2M4 = 8, refleks fisiologis melemah, kejang fokal (+)."
        },
        correctTreatment: [
            ['reagen_gds', 'iv_line', 'nacl_resus', 'catheter_urine'],
            ['insulin_drip', 'monitor_gds', 'monitor_vitals_15']
        ],
        differentialDiagnosis: ['KAD', 'Stroke', 'Sepsis', 'Keracunan'],
        risk: 'critical',
        referralRequired: true,
        referralTarget: 'SpPD',
        deteriorationRate: 8,
        sisruteData: {
            situation: 'Lansia 70 tahun GCS 8, GDS >600, dehidrasi berat, tanpa aseton.',
            background: 'DM tipe 2, Metformin tidak rutin. ISPA 2 minggu (faktor pencetus).',
            assessment: 'HHS. Mortalitas tinggi. Butuh resusitasi cairan agresif + insulin drip ICU.',
            recommendation: 'ICU SpPD untuk rehidrasi masif (6-9L/24jam), insulin low-dose, monitor elektrolit.'
        },
        billingItems: {
            tindakan: [{ code: '99.18', name: 'Insulin Drip', actionId: 'insulin_drip' }, { code: '96.6', name: 'IV Line', actionId: 'iv_line' }],
            obat: [{ medId: 'insulin_drip', qty: 1 }, { medId: 'nacl_resus', qty: 4 }],
            alkes: [{ id: 'iv_cannula', qty: 2, unitCost: 15000 }, { id: 'kateter_foley', qty: 1, unitCost: 25000 }],
            estimatedCost: 650000
        },
        wikiKey: 'igd_hhs'
    }
];
