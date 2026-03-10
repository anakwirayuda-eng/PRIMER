/**
 * @reflection
 * [IDENTITY]: cardiovascular
 * [PURPOSE]: Medical cases for Cardiovascular specialty.
 * [STATE]: Experimental
 * [LAST_UPDATE]: 2026-02-12
 */

export const CARDIOVASCULAR_CASES = [
    // NOTE: hypertension_primary and dyslipidemia are in metabolic.js (richer versions with anamnesis variations)
    // === SKDI 1-3 REFERRAL CASES ===
    {
        id: 'acute_mi_stemi',
        diagnosis: 'Infark Miokard Akut (STEMI)',
        icd10: 'I21.9',
        skdi: '3B',
        category: 'Cardiovascular',
        symptoms: ['Nyeri dada kiri menjalar ke lengan', 'Keringat dingin', 'Sesak napas', 'Mual'],
        clue: "Nyeri dada substernal tipikal: seperti ditekan benda berat, menjalar ke lengan kiri/rahang, >20 menit, tidak hilang dengan istirahat. MONA protocol: Morfin-Oksigen-Nitrat-Aspirin. GOLDEN PERIOD <12jam!",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Apa yang dirasakan pak?', response: 'Dada saya sakit banget dok, kayak ditekan beban berat, tembus ke lengan kiri.', sentiment: 'confirmation', priority: 'essential' }],
            rps: [
                { id: 'q_onset', text: 'Kapan mulainya?', response: '3 jam yang lalu dok, waktu lagi istirahat tiba-tiba sakit banget.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_cold_sweat', text: 'Ada keringat dingin?', response: 'Iya dok, keringat dingin, mual, rasanya mau mati.', sentiment: 'confirmation' }
            ],
            rpd: [{ id: 'q_risk', text: 'Ada darah tinggi, kencing manis, atau kolesterol tinggi?', response: 'Darah tinggi dan kolesterol tinggi sudah bertahun-tahun.', sentiment: 'confirmation' }],
            rpk: [{ id: 'q_fam', text: 'Keluarga ada riwayat sakit jantung?', response: 'Bapak saya meninggal mendadak umur 50 tahun.', sentiment: 'confirmation' }],
            sosial: [{ id: 'q_smoke', text: 'Merokok?', response: 'Iya dok, 2 bungkus sehari sudah 25 tahun.', sentiment: 'confirmation' }]
        },
        essentialQuestions: ['q_main', 'q_onset'],
        anamnesis: ["Dada sakit banget kayak ditekan, tembus ke lengan kiri.", "3 jam lalu, keringat dingin, mual."],
        physicalExamFindings: { general: "Tampak kesakitan, pucat, diaphoresis (+).", vitals: "TD 90/60, N 110x, RR 28x, S 36.5°C, SpO2 92%", cardio: "BJ I-II lemah, reguler, gallop S3 (+). Ronkhi basal paru bilateral." },
        labs: {}, vitals: { temp: 36.5, bp: '90/60', hr: 110, rr: 28 },
        correctTreatment: ['aspirin_320_kunyah', 'isdn_5_sublingual', 'morfin_2_iv'],
        correctProcedures: ['o2_nasal_4lpm', 'iv_access', 'monitor_vital', 'ecg_12lead'],
        requiredEducation: ['life_threatening', 'golden_period_pci', 'do_not_delay'],
        risk: 'critical', nonReferrable: false, referralTarget: 'rs_kabupaten',
        differentialDiagnosis: ['I21.9', 'I20.0']
    },
    {
        id: 'gagal_jantung_kronik',
        diagnosis: 'Gagal Jantung Kronik (CHF)',
        icd10: 'I50.9',
        skdi: '3A',
        category: 'Cardiovascular',
        symptoms: ['Sesak napas bertahap', 'Kaki bengkak', 'Orthopnea', 'PND'],
        clue: "Sesak progresif + edema tungkai + orthopnea/PND. JVP meningkat, kardiomegali, ronkhi basal. Diuretik + ACE-inhibitor + pembatasan cairan. Klasifikasi NYHA. Rujuk ekokardiografi.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Ada keluhan apa?', response: 'Sudah sebulan ini sesak dok, makin lama makin berat, kaki bengkak dua-duanya.', sentiment: 'confirmation', priority: 'essential' }],
            rps: [
                { id: 'q_orthopnea', text: 'Tidurnya pakai bantal berapa?', response: '3 bantal dok, kalau tiduran langsung sesak banget.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_pnd', text: 'Pernah terbangun malam karena sesak?', response: 'Sering dok, jam 2-3 pagi tiba-tiba sesak, harus duduk baru enak.', sentiment: 'confirmation' }
            ],
            rpd: [{ id: 'q_ht', text: 'Ada riwayat darah tinggi?', response: 'Iya sudah 15 tahun, obat nggak teratur.', sentiment: 'denial' }],
            rpk: [], sosial: []
        },
        essentialQuestions: ['q_main', 'q_orthopnea'],
        anamnesis: ["Sesak makin berat sebulan, kaki bengkak dua-duanya.", "Tidur pakai 3 bantal, sering terbangun sesak malam."],
        physicalExamFindings: { general: "Sesak, posisi setengah duduk.", vitals: "TD 160/100, N 100x, RR 28x, S 36.6°C", cardio: "JVP meningkat (5+3 cmH2O). BJ I-II, gallop S3 (+). Ronkhi basal bilateral. Hepatomegali (+) 2 jari. Edema pretibial bilateral pitting (+)." },
        labs: { "Rontgen Thorax": { result: "Kardiomegali CTR >55%, kongesti paru", cost: 75000 } },
        vitals: { temp: 36.6, bp: '160/100', hr: 100, rr: 28 },
        correctTreatment: ['furosemide_40', 'captopril_12_5', 'spironolakton_25'],
        correctProcedures: ['fluid_restriction'],
        requiredEducation: ['fluid_and_salt_restriction', 'daily_weight_monitoring', 'med_compliance', 'echo_referral'],
        risk: 'high', nonReferrable: false, referralTarget: 'rs_kabupaten',
        differentialDiagnosis: ['I50.9', 'J81']
    },
    {
        id: 'angina_pektoris',
        diagnosis: 'Angina Pektoris Stabil',
        icd10: 'I20.9',
        skdi: '3B',
        category: 'Cardiovascular',
        symptoms: ['Nyeri dada saat aktivitas', 'Hilang dengan istirahat', 'Durasi <20 menit', 'Riwayat faktor risiko'],
        clue: "Nyeri dada tipikal saat aktivitas, hilang dengan istirahat/nitrat sublingual dalam 5 menit. Durasi <20 menit. Beda dengan MI: bisa di-reproduce dan hilang istirahat. ISDN sublingual + rujuk stress test.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Apa keluhannya pak?', response: 'Dada saya sering sakit kalau jalan agak jauh atau naik tangga dok.', sentiment: 'confirmation', priority: 'essential' }],
            rps: [
                { id: 'q_relief', text: 'Kalau istirahat bagaimana?', response: 'Enak dok, duduk 5 menit hilang.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_character', text: 'Sakitnya seperti apa?', response: 'Kayak ditekan, agak sesak juga.', sentiment: 'confirmation' }
            ],
            rpd: [{ id: 'q_risk', text: 'Ada kolesterol tinggi atau darah tinggi?', response: 'Dua-duanya ada dok.', sentiment: 'confirmation' }],
            rpk: [], sosial: [{ id: 'q_smoke', text: 'Merokok?', response: 'Iya dok, tapi sudah dikurangi.', sentiment: 'confirmation' }]
        },
        essentialQuestions: ['q_main', 'q_relief'],
        anamnesis: ["Dada sakit kalau jalan jauh atau naik tangga.", "Istirahat 5 menit hilang, kayak ditekan."],
        physicalExamFindings: { general: "Tampak baik saat istirahat.", vitals: "TD 140/90, N 78x, RR 18x, S 36.5°C", cardio: "BJ I-II normal, reguler, bising (-)." },
        labs: { "Kolesterol Total": { result: "260 mg/dL", cost: 40000 } },
        vitals: { temp: 36.5, bp: '140/90', hr: 78, rr: 18 },
        correctTreatment: ['isdn_5_sublingual', 'aspirin_80', 'atorvastatin_20'],
        correctProcedures: [],
        requiredEducation: ['nitrat_usage', 'when_to_emergency', 'risk_factor_modification'],
        risk: 'high', nonReferrable: false, referralTarget: 'rs_kabupaten',
        differentialDiagnosis: ['I20.9', 'I21.9']
    },
    {
        id: 'syok_hipovolemik',
        diagnosis: 'Syok Hipovolemik',
        icd10: 'R57.1',
        skdi: '3B',
        category: 'Cardiovascular',
        symptoms: ['Tekanan darah turun drastis', 'Nadi cepat lemah', 'Kulit dingin pucat', 'Penurunan kesadaran'],
        clue: "Tanda syok: TD <90/60, nadi >120 lemah, CRT >3 detik, kulit dingin-pucat-basah, oliguria. Penyebab: perdarahan, diare berat, luka bakar. RESUSITASI CAIRAN AGRESIF: 2 jalur IV kristaloid!",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Apa yang terjadi?', response: 'Suami saya kecelakaan motor dok, banyak darahnya, sekarang lemas banget.', sentiment: 'confirmation', priority: 'essential' }],
            rps: [
                { id: 'q_bleeding', text: 'Perdarahannya dari mana?', response: 'Dari luka di paha kanan dok, darahnya banyak banget.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_conscious', text: 'Kesadarannya gimana?', response: 'Tadi masih sadar, sekarang ngantuk terus, ngomong nggak jelas.', sentiment: 'denial' }
            ],
            rpd: [], rpk: [], sosial: []
        },
        essentialQuestions: ['q_main', 'q_bleeding'],
        anamnesis: ["Kecelakaan motor, perdarahan banyak dari paha.", "Lemas, ngantuk, bicara nggak jelas."],
        physicalExamFindings: { general: "Somnolen, pucat, akral dingin dan basah.", vitals: "TD 70/40, N 130x lemah, RR 30x, S 36°C, SpO2 90%", extremity: "CRT >4 detik. Luka laserasi paha kanan 15cm, perdarahan aktif." },
        labs: { "Hb": { result: "6.5 g/dL", cost: 30000 } },
        vitals: { temp: 36, bp: '70/40', hr: 130, rr: 30 },
        correctTreatment: ['rl_1000_guyur', 'rl_1000_guyur_2'],
        correctProcedures: ['iv_access_2_lines', 'pressure_bandage', 'o2_mask_10lpm', 'foley_catheter', 'monitor_vital'],
        requiredEducation: ['life_threatening', 'blood_transfusion_needed', 'surgery_likely'],
        risk: 'critical', nonReferrable: false, referralTarget: 'rs_kabupaten',
        differentialDiagnosis: ['R57.1', 'R57.0']
    },
    {
        id: 'fibrilasi_atrial',
        diagnosis: 'Fibrilasi Atrial',
        icd10: 'I48.9',
        skdi: '3A',
        category: 'Cardiovascular',
        symptoms: ['Jantung berdebar tidak teratur', 'Sesak napas', 'Pusing', 'Irama tidak teratur'],
        clue: "Palpitasi + nadi irreguler. Pulse deficit (+): nadi radialis < HR auskultasi. ECG: gelombang f (no P wave) + irama irreguler. Rate control (bisoprolol/diltiazem) + antikoagulan + rujuk ekokardiografi.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Ada keluhan apa bu?', response: 'Jantung saya berdebar-debar nggak beraturan dok, rasanya kayak mau copot.', sentiment: 'denial', priority: 'essential' }],
            rps: [
                { id: 'q_pattern', text: 'Debar-debarnya terus-terusan atau hilang timbul?', response: 'Hilang timbul dok, kadang tiba-tiba di tengah aktivitas.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_syncope', text: 'Pernah pingsan?', response: 'Belum, tapi sering pusing dan lemas.', sentiment: 'confirmation' }
            ],
            rpd: [{ id: 'q_ht', text: 'Punya darah tinggi?', response: 'Iya dok, darah tinggi sudah lama.', sentiment: 'confirmation' }],
            rpk: [], sosial: []
        },
        essentialQuestions: ['q_main', 'q_pattern'],
        anamnesis: ["Jantung berdebar nggak beraturan, kayak mau copot.", "Hilang timbul, sering pusing."],
        physicalExamFindings: { general: "Tampak cemas.", vitals: "TD 130/80, N 120x irreguler, RR 20x, S 36.7°C", cardio: "BJ I-II intensitas bervariasi, irama tidak teratur (irregularly irregular). Pulse deficit (+)." },
        labs: {}, vitals: { temp: 36.7, bp: '130/80', hr: 120, rr: 20 },
        correctTreatment: ['bisoprolol_2_5', 'warfarin_2'],
        correctProcedures: ['ecg_12lead'],
        requiredEducation: ['stroke_risk', 'anticoagulant_compliance', 'echo_referral', 'rate_control'],
        risk: 'high', nonReferrable: false, referralTarget: 'rs_kabupaten',
        differentialDiagnosis: ['I48.9', 'I47.1']
    },
    {
        id: 'dvt',
        diagnosis: 'Deep Vein Thrombosis (DVT)',
        icd10: 'I80.2',
        skdi: '3A',
        category: 'Cardiovascular',
        symptoms: ['Kaki bengkak satu sisi', 'Nyeri betis', 'Kemerahan', 'Riwayat immobilisasi lama'],
        clue: "Edema tungkai UNILATERAL + nyeri betis. Homan sign (+) tapi sensitivitas rendah. Skor Wells tinggi. BAHAYA: bisa PE (emboli paru)! Jangan pijat! Antikoagulan + bed rest + elevasi + rujuk USG Doppler.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Kaki kenapa bu?', response: 'Kaki kiri saya bengkak dok, nyeri banget di betis, merah.', sentiment: 'confirmation', priority: 'essential' }],
            rps: [
                { id: 'q_unilateral', text: 'Satu kaki saja yang bengkak?', response: 'Iya dok, kaki kiri saja, yang kanan normal.', sentiment: 'denial', priority: 'essential' },
                { id: 'q_immobile', text: 'Akhir-akhir ini banyak tiduran atau perjalanan jauh?', response: 'Habis operasi caesar 10 hari lalu, banyak tiduran.', sentiment: 'confirmation' }
            ],
            rpd: [{ id: 'q_pil', text: 'Minum obat KB?', response: 'Iya dok, pil KB sudah 2 tahun.', sentiment: 'confirmation' }],
            rpk: [], sosial: []
        },
        essentialQuestions: ['q_main', 'q_unilateral'],
        anamnesis: ["Kaki kiri bengkak, nyeri betis, merah.", "Habis operasi caesar, banyak tiduran, minum pil KB."],
        physicalExamFindings: { general: "Tampak kesakitan saat berjalan.", vitals: "TD 120/80, N 86x, RR 18x, S 37.2°C", extremity: "Tungkai kiri: edema (+), eritema (+), nyeri tekan betis (+), Homan sign (+). Selisih lingkar betis kiri-kanan: 3 cm." },
        labs: {}, vitals: { temp: 37.2, bp: '120/80', hr: 86, rr: 18 },
        correctTreatment: ['heparin_subkutan', 'analgesik'],
        correctProcedures: ['bed_rest', 'leg_elevation', 'compression_bandage'],
        requiredEducation: ['no_massage', 'pe_risk', 'usg_doppler_referral', 'mobilization_restriction'],
        risk: 'high', nonReferrable: false, referralTarget: 'rs_kabupaten',
        differentialDiagnosis: ['I80.2', 'I87.0']
    }
];
