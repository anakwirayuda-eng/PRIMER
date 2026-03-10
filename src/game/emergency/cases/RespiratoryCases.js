/**
 * @reflection
 * [IDENTITY]: RespiratoryCases
 * [PURPOSE]: Respiratory emergency cases.
 * [STATE]: Stable
 */

export const RESPIRATORY_CASES = [
    {
        id: 'asthma_acute_severe',
        diagnosis: 'Acute Severe Asthma',
        icd10: 'J46',
        skdi: '3B',
        category: 'Respiratory',
        triageLevel: 2,
        esiLevel: 2,
        symptoms: ['Sesak napas berat', 'Wheezing inspiratori/ekspiratori', 'Bicara terputus-putus', 'Penggunaan otot bantu napas'],
        clue: "[URGENT] Serangan Asma Berat. Silent chest adalah tanda fatal! Segera Nebulizer + Steroid IV.",
        relevantLabs: ['Pemeriksaan Fisik Paru', 'SpO2'],
        anamnesisQuestions: {
            keluhan_utama: [
                { id: 'q_main', text: 'Sesaknya sudah berapa lama?', response: 'Sejak tadi malam dok, makin lama makin berat.', priority: 'essential' },
                { id: 'q_trigger', text: 'Ada pemicunya?', response: 'Kena debu waktu beresin gudang.', priority: 'essential' },
                { id: 'q_meds', text: 'Sudah pakai inhaler?', response: 'Sudah 3 kali tapi nggak mempan.', priority: 'essential' }
            ],
            medis: [
                { id: 'q_freq', text: 'Sering serangan seperti ini?', response: 'Sering, tapi biasanya sembuh pakai inhaler.' },
                { id: 'q_smoke', text: 'Ada yang merokok di rumah?', response: 'Suami saya merokok.' }
            ],
            sosial: []
        },
        essentialQuestions: ['q_main', 'q_trigger', 'q_meds'],
        anamnesis: [
            "Sesak napas berat dok, inhaler yang biasa nggak mempan.",
            "Tadi malam kena debu, langsung kambuh parah."
        ],
        physicalExamFindings: {
            general: "Tampak sesak berat, posisi tripod, bicara kata demi kata.",
            vitals: "TD 130/80, N 110x, RR 32x, S 36.5°C, SpO2 92% (on Room Air)",
            thorax: "Inspeksi: Retraksi suprasternal & interkostal (+). Auskultasi: Wheezing (+) di seluruh lapangan paru.",
            extremities: "CRT < 2 detik, akral hangat."
        },
        correctTreatment: [
            ['oxygen', 'salbutamol_neb', 'ipratropium_neb', 'methylprednisolone_iv'],
            ['iv_line', 'observation_6h']
        ],
        differentialDiagnosis: ['PPOK eksaserbasi akut', 'Gagal jantung kongestif', 'Pneumothorax'],
        risk: 'emergency',
        referralRequired: false,
        deteriorationRate: 3
    },
    {
        id: 'copd_exacerbation',
        diagnosis: 'PPOK Eksaserbasi Akut',
        icd10: 'J44.1',
        icd9cm: ['93.94', '96.04'],
        skdi: '3B',
        category: 'Respiratory',
        triageLevel: 2,
        esiLevel: 2,
        symptoms: ['Sesak napas memburuk', 'Batuk produktif purulen', 'Wheezing', 'Barrel chest', 'Sianosis'],
        clue: "[URGENT] Pasien PPOK dengan sesak memberat + sputum purulen. Nebulizer + steroid + antibiotik. Awasi gagal napas!",
        relevantLabs: ['SpO2', 'Darah Lengkap'],
        anamnesisQuestions: {
            keluhan_utama: [
                { id: 'q_main', text: 'Sesaknya makin berat sejak kapan?', response: 'Dari 2 hari ini dok, biasanya nggak separah ini.', priority: 'essential' },
                { id: 'q_sputum', text: 'Dahaknya gimana?', response: 'Banyak banget dok, kuning-hijau kental.', priority: 'essential' },
                { id: 'q_smoke', text: 'Masih merokok?', response: 'Masih 1 bungkus sehari dok, sudah 30 tahun.', priority: 'essential' }
            ],
            rpd: [
                { id: 'q_copd', text: 'Sudah didiagnosa PPOK?', response: 'Iya dok, sudah 5 tahun, rutin kontrol di poli paru.' },
                { id: 'q_inhaler', text: 'Pakai inhaler rutin?', response: 'Kadang lupa dok, kalau nggak sesak nggak dipakai.' }
            ],
            sosial: []
        },
        essentialQuestions: ['q_main', 'q_sputum', 'q_smoke'],
        anamnesis: [
            "Sesak makin berat 2 hari ini, dahak kental hijau, inhaler nggak mempan lagi.",
            "PPOK kambuh dok, batuknya berdahak terus, napas bunyi."
        ],
        physicalExamFindings: {
            general: "Tampak sesak, duduk membungkuk, pursed-lip breathing, barrel chest.",
            vitals: "TD 140/90, N 100x, RR 30x, S 37.8°C, SpO2 89%",
            thorax: "Ekspirasi memanjang, wheezing bilateral, ronkhi basah basal. Hipersonor perkusi.",
            extremities: "Clubbing finger (+), sianosis perifer."
        },
        correctTreatment: [
            ['oxygen', 'salbutamol_neb', 'ipratropium_neb'],
            ['methylprednisolone_iv', 'amoxicillin_500', 'iv_line', 'monitor_vitals_15']
        ],
        differentialDiagnosis: ['Pneumonia', 'Gagal jantung kongestif', 'Pneumothorax', 'Emboli paru'],
        risk: 'emergency',
        referralRequired: true,
        referralTarget: 'SpParu',
        deteriorationRate: 4,
        sisruteData: {
            situation: 'Pasien PPOK berat eksaserbasi akut, SpO2 89%, sesak berat, sputum purulen.',
            background: 'PPOK 5 tahun, perokok 30 tahun 1 bungkus/hari, inhaler tidak rutin.',
            assessment: 'Eksaserbasi akut PPOK berat curiga infeksi sekunder. Risiko gagal napas.',
            recommendation: 'Rawat SpParu untuk bronkodilator intensif, monitoring SpO2, curiga butuh NIV.'
        },
        billingItems: {
            tindakan: [{ code: '93.94', name: 'Nebulizer', actionId: 'salbutamol_neb' }, { code: '96.04', name: 'Oksigen', actionId: 'oxygen' }],
            obat: [{ medId: 'salbutamol_neb', qty: 2 }, { medId: 'ipratropium_neb', qty: 1 }, { medId: 'methylprednisolone_iv', qty: 1 }],
            alkes: [{ id: 'nebulizer_kit', qty: 1, unitCost: 25000 }],
            estimatedCost: 350000
        },
        wikiKey: 'igd_copd_exacerbation'
    },
    {
        id: 'foreign_body_aspiration',
        diagnosis: 'Aspirasi Benda Asing',
        icd10: 'T17.9',
        icd9cm: ['98.15'],
        skdi: '3B',
        category: 'Respiratory',
        triageLevel: 1,
        esiLevel: 1,
        symptoms: ['Tersedak tiba-tiba', 'Stridor', 'Batuk paroksismal', 'Sianosis', 'Tidak bisa bicara/menangis'],
        clue: "[CRITICAL] Anak tersedak, stridor, masih batuk → dorong batuk. Silent/sianosis → Heimlich/back blow SEGERA!",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [
                { id: 'q_event', text: 'Apa yang terjadi?', response: 'Tadi lagi makan kacang, tiba-tiba tersedak nggak bisa napas!', priority: 'essential' },
                { id: 'q_what', text: 'Kira-kira benda apa?', response: 'Kacang tanah dok, nggak digigit langsung ditelan.', priority: 'essential' },
                { id: 'q_breathe', text: 'Masih bisa napas?', response: 'Susah banget, suaranya bunyi.', priority: 'essential' }
            ],
            rps: [
                { id: 'q_cough', text: 'Masih batuk?', response: 'Tadi batuk-batuk kuat, sekarang udah nggak kuat batuk lagi.' }
            ],
            rpd: [],
            sosial: []
        },
        essentialQuestions: ['q_event', 'q_what', 'q_breathe'],
        anamnesis: [
            "Anak tersedak kacang, sekarang sesak napas berat, suara napasnya bunyi.",
            "Tiba-tiba tersedak sambil makan, nggak bisa nangis, wajahnya biru."
        ],
        physicalExamFindings: {
            general: "Anak 3 tahun, agitasi, stridor, universal choking sign, sianosis.",
            vitals: "N 150x, RR 45x, SpO2 78%",
            thorax: "Stridor inspiratori, air entry menurun unilateral (kanan), wheezing lokal. Retraksi suprasternal (+)."
        },
        correctTreatment: [
            ['heimlich_maneuver', 'protect_airway', 'oxygen'],
            ['suction_airway', 'monitor_vitals_15']
        ],
        differentialDiagnosis: ['Croup', 'Epiglotitis', 'Angioedema', 'Asma akut'],
        risk: 'critical',
        referralRequired: true,
        referralTarget: 'SpA',
        deteriorationRate: 9,
        sisruteData: {
            situation: 'Anak 3 tahun aspirasi benda asing (kacang), stridor, SpO2 78%, sianosis.',
            background: 'Onset akut saat makan. Heimlich berhasil parsial, masih stridor.',
            assessment: 'Benda asing jalan napas, gagal dikeluarkan. Butuh bronkoskopi rigid.',
            recommendation: 'SpA / SpTHT-KL untuk bronkoskopi rigid ekstraksi benda asing.'
        },
        billingItems: {
            tindakan: [{ code: '98.15', name: 'Heimlich', actionId: 'heimlich_maneuver' }, { code: '96.04', name: 'Oksigen', actionId: 'oxygen' }],
            obat: [],
            alkes: [],
            estimatedCost: 100000
        },
        wikiKey: 'igd_foreign_body_aspiration'
    }
];
