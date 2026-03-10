/**
 * @reflection
 * [IDENTITY]: CardiovascularCases
 * [PURPOSE]: Cardiovascular emergency cases.
 * [STATE]: Stable
 */

export const CARDIOVASCULAR_CASES = [
    {
        id: 'chest_pain_acs',
        diagnosis: 'Acute Coronary Syndrome',
        icd10: 'I20.0',
        skdi: '3B',
        category: 'Cardiovascular',
        triageLevel: 2,
        esiLevel: 2,
        symptoms: ['Nyeri dada kiri/tengah', 'Menjalar ke lengan/rahang', 'Keringat dingin', 'Mual', 'Sesak'],
        clue: "[URGENT] Nyeri dada tipikal + keringat dingin pada usia >40th. Curiga ACS! MONA + EKG segera.",
        relevantLabs: ['EKG', 'Troponin'],
        anamnesisQuestions: {
            keluhan_utama: [
                { id: 'q_pain', text: 'Sakit dadanya seperti apa?', response: 'Kayak ditindih batu besar dok, berat sekali.', priority: 'essential' },
                { id: 'q_location', text: 'Menjalar ke mana?', response: 'Sampai ke rahang sama pundak kiri dok.', priority: 'essential' },
                { id: 'q_sweat', text: 'Ada keringat dingin?', response: 'Iya dok, sampai bajunya basah semua.', priority: 'essential' }
            ],
            rps: [
                { id: 'q_duration', text: 'Sudah berapa lama sakitnya?', response: 'Sudah 30 menit nggak hilang-hilang dok.' },
                { id: 'q_nitrat', text: 'Sudah minum obat bawah lidah?', response: 'Belum dok.' }
            ],
            rpd: [
                { id: 'q_ht', text: 'Ada darah tinggi atau kencing manis?', response: 'Iya saya darah tinggi rutin minum amlodipine.' }
            ],
            sosial: [
                { id: 'q_smoker', text: 'Bapak merokok?', response: 'Iya merokok 1 bungkus sehari.' }
            ]
        },
        essentialQuestions: ['q_pain', 'q_sweat', 'q_location'],
        anamnesis: [
            "Dada saya sakit berat dok, seperti ditindih, tembus ke punggung.",
            "Keluar keringat dingin, mual, sesak napas."
        ],
        physicalExamFindings: {
            general: "Tampak cemas, pucat, diaphoresis (+).",
            vitals: "TD 100/70, N 100x, RR 22x, S 36.8°C, SpO2 94%",
            thorax: "Cor: S1 S2 normal, Gallop (-). Pulmo: Vesikuler (+/+)."
        },
        correctTreatment: [
            ['oxygen', 'aspilet_160', 'clopidogrel_300', 'isdn_5', 'ecg'],
            ['iv_line', 'monitor_vitals_15']
        ],
        differentialDiagnosis: ['GERD/Dispepsia', 'Diseksi aorta', 'Emboli paru', 'Perikarditis'],
        risk: 'emergency',
        referralRequired: true,
        deteriorationRate: 4
    },
    {
        id: 'hypertensive_crisis',
        diagnosis: 'Krisis Hipertensi (HT Emergency)',
        icd10: 'I11',
        icd9cm: ['99.29'],
        skdi: '3B',
        category: 'Cardiovascular',
        triageLevel: 2,
        esiLevel: 2,
        symptoms: ['TD sistolik >180 / diastolik >120', 'Nyeri kepala hebat', 'Pandangan kabur', 'Mimisan', 'Sesak napas'],
        clue: "[URGENT] TD >180/120 dengan kerusakan organ target (otak/mata/ginjal). Turunkan TD bertahap, JANGAN terlalu cepat!",
        relevantLabs: ['Urinalisa', 'Darah Lengkap'],
        anamnesisQuestions: {
            keluhan_utama: [
                { id: 'q_headache', text: 'Sakitnya di mana?', response: 'Kepala saya sakit luar biasa dok, rasanya mau pecah, belakang tengkuk.', priority: 'essential' },
                { id: 'q_vision', text: 'Pandangan gimana?', response: 'Agak kabur dok, kayak berkunang-kunang.', priority: 'essential' },
                { id: 'q_nosebleed', text: 'Ada mimisan?', response: 'Tadi sempat keluar darah dari hidung.', priority: 'essential' }
            ],
            rpd: [
                { id: 'q_ht', text: 'Rutin minum obat tensi?', response: 'Sudah habis 2 minggu lalu dok, belum beli lagi.' },
                { id: 'q_meds', text: 'Obat apa biasanya?', response: 'Amlodipine 10 sama Captopril dok.' }
            ],
            sosial: [
                { id: 'q_salt', text: 'Suka makan asin?', response: 'Iya dok, suka lauk ikan asin.' }
            ]
        },
        essentialQuestions: ['q_headache', 'q_vision', 'q_nosebleed'],
        anamnesis: [
            "Kepala sakit hebat, mau pecah, pandangan kabur, tadi mimisan.",
            "Obat darah tinggi habis 2 minggu, sekarang tensinya naik tinggi sekali."
        ],
        physicalExamFindings: {
            general: "Tampak gelisah, wajah merah (flushing), memegangi kepala.",
            vitals: "TD 220/130, N 100x, RR 24x, S 36.8°C",
            heent: "Funduskopi: papil edema, flame hemorrhage. Epistaksis anterior terkontrol.",
            neuro: "GCS 15, kekuatan motorik 5/5/5/5, tidak ada tanda lateralisasi."
        },
        correctTreatment: [
            ['nicardipine_drip', 'iv_line', 'monitor_vitals_15'],
            ['furosemide_iv', 'observation_6h', 'catheter_urine']
        ],
        differentialDiagnosis: ['Stroke hemoragik', 'Feokromositoma', 'Pre-eklampsia (jika hamil)', 'Diseksi aorta'],
        risk: 'emergency',
        referralRequired: true,
        referralTarget: 'SpPD/SpJP',
        deteriorationRate: 5,
        sisruteData: {
            situation: 'Pasien TD 220/130 dengan nyeri kepala hebat, pandangan kabur, epistaksis.',
            background: 'HT kronik, putus obat 2 minggu. Amlodipine + Captopril sebelumnya.',
            assessment: 'Krisis hipertensi dengan target organ damage (retinopati HT). Butuh titrasi anti-HT IV.',
            recommendation: 'ICU/HCU SpPD untuk nicardipine drip dengan monitoring TD tiap 15 menit.'
        },
        billingItems: {
            tindakan: [{ code: '99.29', name: 'Anti-HT IV', actionId: 'nicardipine_drip' }, { code: '96.6', name: 'IV Line', actionId: 'iv_line' }],
            obat: [{ medId: 'nicardipine_drip', qty: 1 }, { medId: 'furosemide_iv', qty: 1 }],
            alkes: [{ id: 'iv_cannula', qty: 1, unitCost: 15000 }, { id: 'kateter_foley', qty: 1, unitCost: 25000 }],
            estimatedCost: 450000
        },
        wikiKey: 'igd_hypertensive_crisis'
    },
    {
        id: 'chf_acute_pulmonary_edema',
        diagnosis: 'Gagal Jantung Akut (Edema Paru)',
        icd10: 'I50.1',
        icd9cm: ['89.52', '96.04'],
        skdi: '3B',
        category: 'Cardiovascular',
        triageLevel: 1,
        esiLevel: 1,
        symptoms: ['Sesak napas berat tiba-tiba', 'Ortopnea', 'Batuk berbusa pink', 'Ronkhi basah bilateral', 'JVP meningkat'],
        clue: "[CRITICAL] Sesak akut + batuk berbusa pink + ronkhi bilateral = Edema Paru akut. Posisi duduk + O2 + Furosemide IV SEGERA!",
        relevantLabs: ['EKG', 'Darah Lengkap'],
        anamnesisQuestions: {
            keluhan_utama: [
                { id: 'q_breathe', text: 'Sesaknya sejak kapan?', response: 'Tadi malam tiba-tiba sesak banget dok, nggak bisa tidur.', priority: 'essential' },
                { id: 'q_foam', text: 'Ada batuk?', response: 'Iya dok, batuk keluar busa kemerahan.', priority: 'essential' },
                { id: 'q_position', text: 'Tidur pakai bantal berapa?', response: 'Harus duduk dok, kalau tiduran makin sesak.', priority: 'essential' }
            ],
            rpd: [
                { id: 'q_heart', text: 'Ada riwayat penyakit jantung?', response: 'Pernah dibilang jantungnya lemah 2 tahun lalu.' },
                { id: 'q_meds', text: 'Obat rutin apa?', response: 'Furosemide, Captopril, tapi sering lupa minum.' }
            ],
            sosial: []
        },
        essentialQuestions: ['q_breathe', 'q_foam', 'q_position'],
        anamnesis: [
            "Tengah malam sesak mendadak, batuk berbusa pink, nggak bisa tidur terlentang.",
            "Jantung lemah kambuh, kaki bengkak, sekarang sesak berat sampai nggak bisa napas."
        ],
        physicalExamFindings: {
            general: "Tampak sesak berat, duduk tegak, berkeringat, batuk produktif berbusa pink.",
            vitals: "TD 160/100, N 120x, RR 36x, S 36.5°C, SpO2 82%",
            thorax: "Ronkhi basah bilateral difus, gallop S3 (+), JVP meningkat 8cm.",
            extremities: "Edema tungkai bilateral pitting (+), akral dingin."
        },
        correctTreatment: [
            ['oxygen', 'iv_line', 'furosemide_iv', 'isdn_5'],
            ['morphine_iv', 'monitor_vitals_15', 'catheter_urine']
        ],
        differentialDiagnosis: ['Pneumonia bilateral', 'ARDS', 'Emboli paru masif', 'Tamponade jantung'],
        risk: 'critical',
        referralRequired: true,
        referralTarget: 'SpJP',
        deteriorationRate: 7,
        sisruteData: {
            situation: 'Pasien CHF akut edema paru, SpO2 82%, ronkhi bilateral, batuk berbusa pink.',
            background: 'CHF 2 tahun, putus obat (Furosemide, Captopril). Tipikal flash pulmonary edema.',
            assessment: 'Edema paru akut. Sudah diberikan O2 + Furosemide + ISDN. Butuh ICU kardio.',
            recommendation: 'ICCU SpJP untuk monitoring hemodinamik, vasodilator IV, echocardiography.'
        },
        billingItems: {
            tindakan: [{ code: '96.04', name: 'Oksigen', actionId: 'oxygen' }, { code: '89.52', name: 'EKG', actionId: 'ecg' }],
            obat: [{ medId: 'furosemide_iv', qty: 2 }, { medId: 'isdn_5', qty: 3 }, { medId: 'morphine_iv', qty: 1 }],
            alkes: [{ id: 'iv_cannula', qty: 1, unitCost: 15000 }, { id: 'kateter_foley', qty: 1, unitCost: 25000 }],
            estimatedCost: 400000
        },
        wikiKey: 'igd_chf_acute'
    }
];
