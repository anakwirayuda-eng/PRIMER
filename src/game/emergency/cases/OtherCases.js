/**
 * @reflection
 * [IDENTITY]: OtherEmergencyCases
 * [PURPOSE]: Miscellaneous emergency cases (Pediatric, Environmental, etc.).
 * [STATE]: Stable
 */

export const OTHER_EMERGENCY_CASES = [
    {
        id: 'near_drowning',
        diagnosis: 'Near Drowning (Hampir Tenggelam)',
        icd10: 'T75.1',
        skdi: '3B',
        category: 'Environmental',
        triageLevel: 1,
        esiLevel: 1,
        symptoms: ['Sesak napas berat', 'Batuk berbusa', 'Sianosis', 'Penurunan kesadaran', 'Hipotermia'],
        clue: "[CRITICAL] Korban tenggelam — ABC! Jaga napas, cegah hipotermia, awasi edema paru sekunder.",
        relevantLabs: ['Darah Lengkap'],
        anamnesisQuestions: {
            keluhan_utama: [
                { id: 'q_event', text: 'Tenggelamnya di mana?', response: 'Di sungai dok, lagi mandi.', priority: 'essential' },
                { id: 'q_duration', text: 'Berapa lama di dalam air?', response: 'Katanya tetangga sekitar 3-5 menit dok.', priority: 'essential' },
                { id: 'q_cpr', text: 'Sudah ditolong di tempat?', response: 'Iya dok, ditekan-tekan dadanya sama warga sampai batuk keluar air.', priority: 'essential' }
            ],
            rps: [
                { id: 'q_conscious', text: 'Sempat pingsan?', response: 'Pingsan sebentar dok, sekarang sudah mulai sadar tapi sesak.' }
            ],
            rpd: [],
            sosial: []
        },
        essentialQuestions: ['q_event', 'q_duration', 'q_cpr'],
        anamnesis: [
            "Anak tenggelam di sungai dok, sudah dipijit-pijit warga tapi masih sesak napas.",
            "Korban tenggelam di kolam, sudah batuk keluar air tapi masih lemas dan sesak berat."
        ],
        physicalExamFindings: {
            general: "Tampak somnolen, sesak napas, sianosis perifer, hipotermia, basah kuyup.",
            vitals: "TD 90/60, N 120x, RR 34x, S 35.0°C, SpO2 82%",
            thorax: "Ronkhi basah bilateral difus, wheezing minimal. Suara napas menurun basal."
        },
        correctTreatment: [
            ['protect_airway', 'head_tilt', 'oxygen', 'rescue_breathing', 'iv_line', 'warm_compress'],
            ['iv_fluid_rl', 'monitor_vitals_15', 'observation_6h']
        ],
        differentialDiagnosis: ['Edema paru akut', 'Aspirasi pneumonia', 'Hipotermia berat', 'Cedera servikal'],
        risk: 'critical',
        referralRequired: true,
        deteriorationRate: 6
    },
    {
        id: 'eclampsia',
        diagnosis: 'Eklampsia',
        icd10: 'O15',
        icd9cm: ['99.25', '96.6'],
        skdi: '3B',
        category: 'Maternal',
        triageLevel: 1,
        esiLevel: 1,
        symptoms: ['Kejang pada ibu hamil', 'TD sangat tinggi', 'Edema anasarka', 'Proteinuria masif', 'Penurunan kesadaran'],
        clue: "[CRITICAL] Ibu hamil kejang + TD >160/110 = EKLAMPSIA! MgSO4 SEGERA sebagai anti-kejang! JANGAN diazepam! Rujuk untuk terminasi!",
        relevantLabs: ['Darah Lengkap', 'Urinalisa'],
        anamnesisQuestions: {
            keluhan_utama: [
                { id: 'q_seizure', text: 'Kejangnya berapa kali?', response: 'Sudah 2 kali dok, di rumah tadi.', priority: 'essential' },
                { id: 'q_gest', text: 'Hamil berapa bulan?', response: '8 bulan dok.', priority: 'essential' },
                { id: 'q_headache', text: 'Ada nyeri kepala sebelumnya?', response: 'Dari kemarin pusing berat dan pandangan kabur.', priority: 'essential' }
            ],
            rpd: [
                { id: 'q_anc', text: 'Kontrol kehamilan rutin?', response: 'Cuma 2 kali dok, di bidan.' },
                { id: 'q_prev_pe', text: 'Kehamilan sebelumnya ada tekanan tinggi?', response: 'Anak pertama ini dok.' }
            ],
            sosial: []
        },
        essentialQuestions: ['q_seizure', 'q_gest', 'q_headache'],
        anamnesis: [
            "Ibu hamil 8 bulan kejang 2 kali di rumah, tensinya tinggi, kaki bengkak besar.",
            "Primigravida eklampsia, onset seizure 2x, TD >160/110, pandangan kabur."
        ],
        physicalExamFindings: {
            general: "Post-iktal, somnolen, edema anasarka, wajah bengkak.",
            vitals: "TD 190/120, N 100x, RR 24x, S 37.5°C",
            abdomen: "Uterus gravidus sesuai 32 minggu, DJJ 145x regular. Nyeri tekan epigastrium.",
            extremities: "Edema tungkai bilateral +3 pitting, edema pretibial dan fasial."
        },
        correctTreatment: [
            ['magnesium_sulfate_iv', 'iv_line', 'protect_airway', 'catheter_urine'],
            ['nicardipine_drip', 'monitor_vitals_15', 'oxygen']

        ],
        differentialDiagnosis: ['Epilepsi pada kehamilan', 'Stroke', 'Meningitis', 'Hipoglikemia'],
        risk: 'critical',
        referralRequired: true,
        referralTarget: 'SpOG',
        deteriorationRate: 9,
        sisruteData: {
            situation: 'Primigravida 32 minggu, eklampsia (kejang 2x), TD 190/120, post-iktal somnolen.',
            background: 'ANC tidak lengkap (2x). Primigravida. Edema anasarka progresif 1 minggu.',
            assessment: 'Eklampsia. MgSO4 loading dose sudah diberikan. Butuh terminasi kehamilan segera.',
            recommendation: 'SpOG untuk SC cito / terminasi kehamilan. ICU maternal pasca-operasi.'
        },
        billingItems: {
            tindakan: [{ code: '99.25', name: 'MgSO4 IV', actionId: 'magnesium_sulfate_iv' }, { code: '96.6', name: 'IV Line', actionId: 'iv_line' }],
            obat: [{ medId: 'magnesium_sulfate_iv', qty: 2 }, { medId: 'nicardipine_drip', qty: 1 }],
            alkes: [{ id: 'spuit_10cc', qty: 2, unitCost: 5000 }, { id: 'kateter_foley', qty: 1, unitCost: 25000 }, { id: 'iv_cannula', qty: 1, unitCost: 15000 }],
            estimatedCost: 500000
        },
        wikiKey: 'igd_eclampsia'
    },
    {
        id: 'suicide_attempt',
        diagnosis: 'Percobaan Bunuh Diri (Deliberate Self-Harm)',
        icd10: 'X84',
        icd9cm: ['89.04'],
        skdi: '3B',
        category: 'Psychiatric',
        triageLevel: 2,
        esiLevel: 2,
        symptoms: ['Luka sayatan di pergelangan tangan', 'Perdarahan aktif', 'Tenang abnormal / agitasi', 'Riwayat ideasi bunuh diri'],
        clue: "[URGENT] DSH — atasi luka fisik DULU, lalu asesmen psikiatri. JANGAN tinggalkan sendiri! Safety first, empati second.",
        relevantLabs: ['Darah Lengkap'],
        anamnesisQuestions: {
            keluhan_utama: [
                { id: 'q_event', text: 'Apa yang terjadi?', response: '(Diam)... Saya nggak mau hidup lagi dok.', priority: 'essential' },
                { id: 'q_method', text: 'Pakai apa?', response: 'Silet dok, di pergelangan.', priority: 'essential' },
                { id: 'q_intent', text: 'Sudah lama mau melakukan ini?', response: 'Sudah beberapa bulan mikir terus dok.', priority: 'essential' }
            ],
            rpd: [
                { id: 'q_psych', text: 'Pernah ke psikiater?', response: 'Belum pernah dok.' },
                { id: 'q_prev', text: 'Pernah coba sebelumnya?', response: 'Pernah minum obat nyamuk tapi dimuntahkan.', priority: 'essential' }
            ],
            sosial: [
                { id: 'q_trigger', text: 'Ada masalah yang berat?', response: 'Masalah utang dok, rumah tangga juga berantakan.' }
            ]
        },
        essentialQuestions: ['q_event', 'q_method', 'q_intent'],
        anamnesis: [
            "Sayatan di pergelangan tangan bilateral, pasien dalam keadaan tenang abnormal.",
            "Percobaan bunuh diri dengan silet, riwayat percobaan sebelumnya (+)."
        ],
        physicalExamFindings: {
            general: "Tampak tenang abnormal (flat affect), kooperatif pasif, perdarahan terkontrol.",
            vitals: "TD 110/70, N 88x, RR 18x, S 36.5°C",
            extremities: "Vulnus scissum multipel di pergelangan tangan bilateral (superfisial), orientasi transversal. Perdarahan aktif terkontrol. Tendons intak, neurovascular intak.",
            psych: "Afek datar, kontak mata minimal, pikiran bunuh diri masih ada, tidak ada gejala psikotik."
        },
        correctTreatment: [
            ['wound_cleaning', 'hemostasis', 'lidocaine_inj', 'suturing'],
            ['monitor_vitals_15', 'observation_6h']
        ],
        differentialDiagnosis: ['Self-harm non-suicidal', 'Gangguan kepribadian borderline', 'Depresi berat', 'Psikosis'],
        risk: 'emergency',
        referralRequired: true,
        referralTarget: 'SpKJ',
        deteriorationRate: 1,
        sisruteData: {
            situation: 'DSH luka sayat bilateral wrist, perdarahan terkontrol. Ideasi bunuh diri masih aktif.',
            background: 'Riwayat percobaan bunuh diri sebelumnya (minum pestisida). Stressor ekonomi + rumah tangga.',
            assessment: 'Luka fisik tertangani. High-risk suicide — butuh rawat inap psikiatri.',
            recommendation: 'SpKJ untuk rawat inap psikiatri, suicide watch, asesmen risiko bunuh diri komprehensif.'
        },
        billingItems: {
            tindakan: [{ code: '89.04', name: 'Asesmen Psikiatri', actionId: 'check_cause' }, { code: '86.59', name: 'Hecting', actionId: 'suturing' }],
            obat: [{ medId: 'lidocaine_inj', qty: 1 }],
            alkes: [{ id: 'suturing_kit_disposable', qty: 1, unitCost: 35000 }, { id: 'kasa_steril', qty: 5, unitCost: 5000 }],
            estimatedCost: 250000
        },
        wikiKey: 'igd_suicide_attempt'
    }
];
