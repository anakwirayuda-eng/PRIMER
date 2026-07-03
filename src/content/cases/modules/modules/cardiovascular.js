/**
 * @reflection
 * [IDENTITY]: cardiovascular
 * [PURPOSE]: Medical cases for Cardiovascular specialty.
 * [STATE]: Experimental
 * [LAST_UPDATE]: 2026-04-16
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
        clue: "[EBM: PERKI 2024] Nyeri dada substernal tipikal >20 menit, menjalar ke lengan kiri/rahang, tidak hilang dengan istirahat. Tata laksana awal: EKG segera, aspirin kunyah, antiplatelet tambahan bila tersedia, oksigen bila hipoksemia, dan rujuk reperfusi secepat mungkin. Nitrat hanya bila tidak ada hipotensi atau kecurigaan infark ventrikel kanan; pada kasus ini pasien sudah hipotensi.",
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
        physicalExamFindings: {
            general: "Tampak kesakitan, pucat, diaphoresis (+).",
            vitals: "TD 90/60, N 110x, RR 28x, S 36.5C, SpO2 89%",
            cardio: "BJ I-II lemah, reguler, gallop S3 (+). Ronkhi basal paru bilateral."
        },
        labs: {},
        vitals: { temp: 36.5, bp: '90/60', hr: 110, rr: 28, spo2: 89 },
        correctTreatment: ['aspirin_320_kunyah', 'clopidogrel_300'],
        correctProcedures: ['o2_nasal_4lpm', 'iv_access', 'monitor_vital', 'ecg_12lead'],
        requiredEducation: ['life_threatening', 'golden_period_pci', 'do_not_delay'],
        treatmentNote: 'Nitrat tidak dijadikan terapi wajib pada kasus ini karena pasien sudah hipotensi. Oksigen tetap relevan karena pasien hipoksemik (SpO2 89%).',
        risk: 'critical',
        nonReferrable: false,
        referralTarget: 'rs_kabupaten',
        differentialDiagnosis: ['I20.0']
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
            rpk: [],
            sosial: []
        },
        essentialQuestions: ['q_main', 'q_orthopnea'],
        anamnesis: ["Sesak makin berat sebulan, kaki bengkak dua-duanya.", "Tidur pakai 3 bantal, sering terbangun sesak malam."],
        physicalExamFindings: {
            general: "Sesak, posisi setengah duduk.",
            vitals: "TD 160/100, N 100x, RR 28x, S 36.6C",
            cardio: "JVP meningkat (5+3 cmH2O). BJ I-II, gallop S3 (+). Ronkhi basal bilateral. Hepatomegali (+) 2 jari. Edema pretibial bilateral pitting (+)."
        },
        labs: { "Rontgen Thorax": { result: "Kardiomegali CTR >55%, kongesti paru", cost: 75000 } },
        vitals: { temp: 36.6, bp: '160/100', hr: 100, rr: 28 },
        correctTreatment: ['furosemide_40', 'captopril_12_5', 'spironolakton_25'],
        correctProcedures: ['fluid_restriction'],
        requiredEducation: ['fluid_and_salt_restriction', 'daily_weight_monitoring', 'med_compliance', 'echo_referral'],
        risk: 'high',
        nonReferrable: false,
        referralTarget: 'rs_kabupaten',
        differentialDiagnosis: ['J81']
    },
    {
        id: 'angina_pektoris',
        diagnosis: 'Angina Pektoris Stabil',
        icd10: 'I20.9',
        skdi: '3B',
        category: 'Cardiovascular',
        symptoms: ['Nyeri dada saat aktivitas', 'Hilang dengan istirahat', 'Durasi <20 menit', 'Riwayat faktor risiko'],
        clue: "[EBM: chronic coronary syndrome] Nyeri dada tipikal tercetus aktivitas, membaik dengan istirahat dalam beberapa menit, dan tidak menetap >20 menit atau disertai diaphoresis berat seperti MI. Terapi dasar berfokus pada antianginal jangka panjang serta pencegahan sekunder; nitrat sublingual dapat dipakai sebagai obat serangan bila tekanan darah memadai.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Apa keluhannya pak?', response: 'Dada saya sering sakit kalau jalan agak jauh atau naik tangga dok.', sentiment: 'confirmation', priority: 'essential' }],
            rps: [
                { id: 'q_relief', text: 'Kalau istirahat bagaimana?', response: 'Enak dok, duduk 5 menit hilang.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_duration', text: 'Kalau kambuh biasanya berapa lama sampai reda?', response: 'Biasanya 5-10 menit dok, hilang kalau saya berhenti aktivitas.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_character', text: 'Sakitnya seperti apa?', response: 'Kayak ditekan, agak sesak juga.', sentiment: 'confirmation' }
            ],
            rpd: [{ id: 'q_risk', text: 'Ada kolesterol tinggi atau darah tinggi?', response: 'Dua-duanya ada dok.', sentiment: 'confirmation' }],
            rpk: [],
            sosial: [{ id: 'q_smoke', text: 'Merokok?', response: 'Iya dok, tapi sudah dikurangi.', sentiment: 'confirmation' }]
        },
        essentialQuestions: ['q_main', 'q_relief', 'q_duration'],
        anamnesis: ["Dada sakit kalau jalan jauh atau naik tangga.", "Biasanya 5-10 menit lalu reda saat saya berhenti dan duduk istirahat."],
        physicalExamFindings: {
            general: "Tampak baik saat istirahat.",
            vitals: "TD 140/90, N 78x, RR 18x, S 36.5C",
            cardio: "BJ I-II normal, reguler, bising (-)."
        },
        labs: { "Kolesterol Total": { result: "260 mg/dL", cost: 40000 } },
        vitals: { temp: 36.5, bp: '140/90', hr: 78, rr: 18 },
        correctTreatment: ['bisoprolol_2_5', 'aspirin_80', 'atorvastatin_20'],
        correctProcedures: [],
        requiredEducation: ['when_to_emergency', 'risk_factor_modification', 'med_compliance'],
        treatmentNote: 'Nitrat sublingual dapat diberikan sebagai obat serangan bila tekanan darah memadai, tetapi tidak dijadikan terapi wajib utama pada authored case ini.',
        risk: 'high',
        nonReferrable: false,
        referralTarget: 'rs_kabupaten',
        differentialDiagnosis: ['I21.9']
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
            rpd: [],
            rpk: [],
            sosial: []
        },
        essentialQuestions: ['q_main', 'q_bleeding'],
        anamnesis: ["Kecelakaan motor, perdarahan banyak dari paha.", "Lemas, ngantuk, bicara nggak jelas."],
        physicalExamFindings: {
            general: "Somnolen, pucat, akral dingin dan basah.",
            vitals: "TD 70/40, N 130x lemah, RR 30x, S 36C, SpO2 90%",
            extremity: "CRT >4 detik. Luka laserasi paha kanan 15cm, perdarahan aktif."
        },
        labs: { "Hb": { result: "6.5 g/dL", cost: 30000 } },
        vitals: { temp: 36, bp: '70/40', hr: 130, rr: 30 },
        correctTreatment: ['rl_1000_guyur', 'rl_1000_guyur_2'],
        correctProcedures: ['iv_access_2_lines', 'pressure_bandage', 'o2_mask_10lpm', 'foley_catheter', 'monitor_vital'],
        requiredEducation: ['life_threatening', 'blood_transfusion_needed', 'surgery_likely'],
        risk: 'critical',
        nonReferrable: false,
        referralTarget: 'rs_kabupaten',
        differentialDiagnosis: ['R57.0']
    },
    {
        id: 'fibrilasi_atrial',
        diagnosis: 'Fibrilasi Atrial',
        icd10: 'I48.9',
        skdi: '3A',
        category: 'Cardiovascular',
        symptoms: ['Jantung berdebar tidak teratur', 'Sesak napas', 'Pusing', 'Irama tidak teratur'],
        clue: "[EBM: PERKI 2019] Palpitasi + nadi ireguler. EKG 12 sadapan wajib untuk konfirmasi. Tata laksana awal di FKTP berfokus pada stabilitas hemodinamik dan kendali laju. Keputusan antikoagulan harus didasarkan pada stratifikasi CHA2DS2-VASc dan HAS-BLED, sehingga tidak semua pasien FA langsung mendapat warfarin saat kunjungan awal.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Ada keluhan apa bu?', response: 'Jantung saya berdebar-debar nggak beraturan dok, rasanya kayak mau copot.', sentiment: 'confirmation', priority: 'essential' }],
            rps: [
                { id: 'q_pattern', text: 'Debar-debarnya terus-terusan atau hilang timbul?', response: 'Hilang timbul dok, kadang tiba-tiba di tengah aktivitas.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_syncope', text: 'Pernah pingsan?', response: 'Belum, tapi sering pusing dan lemas.', sentiment: 'confirmation' },
                { id: 'q_trigger', text: 'Ada pencetus seperti aktivitas, emosi, kopi, atau alkohol?', response: 'Biasanya muncul kalau lagi capek atau habis minum kopi banyak.', sentiment: 'confirmation' }
            ],
            rpd: [
                { id: 'q_ht', text: 'Punya darah tinggi?', response: 'Iya dok, darah tinggi sudah lama.', sentiment: 'confirmation' },
                { id: 'q_stroke', text: 'Pernah stroke atau TIA sebelumnya?', response: 'Belum pernah dok.', sentiment: 'denial' }
            ],
            rpk: [],
            sosial: []
        },
        essentialQuestions: ['q_main', 'q_pattern'],
        anamnesis: ["Jantung berdebar nggak beraturan, kayak mau copot.", "Hilang timbul, sering pusing."],
        physicalExamFindings: {
            general: "Tampak cemas.",
            vitals: "TD 130/80, N 120x ireguler, RR 20x, S 36.7C",
            cardio: "BJ I-II intensitas bervariasi, irama tidak teratur (irregularly irregular). Pulse deficit (+)."
        },
        labs: {},
        vitals: { temp: 36.7, bp: '130/80', hr: 120, rr: 20 },
        correctTreatment: ['bisoprolol_2_5'],
        correctProcedures: ['ecg_12lead'],
        requiredEducation: ['stroke_risk', 'echo_referral', 'rate_control', 'red_flag_monitor'],
        treatmentNote: 'Antikoagulan tidak diwajibkan otomatis pada case ini karena keputusan terapi harus mengikuti skor CHA2DS2-VASc dan risiko perdarahan.',
        risk: 'high',
        nonReferrable: false,
        referralTarget: 'rs_kabupaten',
        differentialDiagnosis: ['I47.1']
    },
    {
        id: 'dvt',
        diagnosis: 'Deep Vein Thrombosis (DVT)',
        icd10: 'I80.2',
        skdi: '3A',
        category: 'Cardiovascular',
        symptoms: ['Kaki bengkak satu sisi', 'Nyeri betis', 'Kemerahan', 'Riwayat operasi atau imobilisasi'],
        clue: "[EBM: tata laksana VTE] Edema tungkai unilateral + nyeri betis. Homan sign tidak sensitif dan tidak spesifik. Gunakan Wells score, lakukan USG Doppler secepatnya, dan mulai antikoagulan bila diagnosis sangat mungkin atau sudah terkonfirmasi. Stoking kompresi tidak rutin untuk pencegahan kekambuhan, dan tirah baring total bukan target utama pada pasien stabil yang sudah ditangani.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Kaki kenapa bu?', response: 'Kaki kiri saya bengkak dok, nyeri banget di betis, merah.', sentiment: 'confirmation', priority: 'essential' }],
            rps: [
                { id: 'q_unilateral', text: 'Satu kaki saja yang bengkak?', response: 'Iya dok, kaki kiri saja, yang kanan normal.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_immobile', text: 'Akhir-akhir ini banyak tiduran, operasi, atau perjalanan jauh?', response: 'Habis operasi caesar 10 hari lalu, banyak tiduran.', sentiment: 'confirmation' }
            ],
            rpd: [{ id: 'q_prev_clot', text: 'Pernah ada riwayat bekuan darah atau keluhan serupa sebelumnya?', response: 'Belum pernah dok.', sentiment: 'denial' }],
            rpk: [],
            sosial: []
        },
        essentialQuestions: ['q_main', 'q_unilateral'],
        anamnesis: ["Kaki kiri bengkak, nyeri betis, merah.", "Habis operasi caesar dan banyak tiduran."],
        physicalExamFindings: {
            general: "Tampak kesakitan saat berjalan.",
            vitals: "TD 120/80, N 86x, RR 18x, S 37.2C",
            extremity: "Tungkai kiri: edema (+), eritema (+), nyeri tekan betis (+), Homan sign (+). Selisih lingkar betis kiri-kanan: 3 cm."
        },
        labs: {},
        vitals: { temp: 37.2, bp: '120/80', hr: 86, rr: 18 },
        correctTreatment: ['heparin_subkutan', 'analgesik'],
        correctProcedures: [],
        requiredEducation: ['no_massage', 'pe_risk', 'usg_doppler_referral', 'anticoagulant_compliance', 'leg_elevation'],
        treatmentNote: 'Bebat kompresi dan tirah baring total tidak dijadikan tindakan wajib rutin; fokus utama adalah antikoagulasi dan konfirmasi imaging segera.',
        risk: 'high',
        nonReferrable: false,
        referralTarget: 'rs_kabupaten',
        differentialDiagnosis: ['I87.0']
    }
];
