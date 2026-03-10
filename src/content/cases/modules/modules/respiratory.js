/**
 * @reflection
 * [IDENTITY]: respiratory
 * [PURPOSE]: Respiratory cases for CaseLibrary.
 * [STATE]: Experimental
 * [LAST_UPDATE]: 2026-02-12
 */

export const RESPIRATORY_CASES = [
    {
        id: 'asthma_bronchiale',
        diagnosis: 'Asma Bronkiale',
        icd10: 'J45.9',
        skdi: '4A',
        category: 'Respiratory',
        symptoms: ['Sesak napas', 'Mengi/wheezing', 'Batuk kering', 'Dada terasa berat'],
        clue: "Sesak napas episodik dengan mengi, dipicu alergen/dingin/aktivitas. Ekspirasi memanjang, wheezing (+).",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [
                { id: 'q_main', text: 'Sesaknya gimana ini pak/bu?', response: 'Sesak napas bunyi ngik-ngik dok, dicetuskan debu/dingin.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_trigger', text: 'Ada yang jadi pencetusnya nggak?', response: 'Biasanya kalau kena debu atau udara dingin.', sentiment: 'confirmation', priority: 'essential' }
            ],
            rps: [
                { id: 'q_cough', text: 'Batuknya ada nggak?', response: 'Iya batuk kering, lebih parah malam hari.', sentiment: 'confirmation' },
                { id: 'q_frequency', text: 'Seberapa sering kambuh?', response: 'Seminggu 2-3 kali akhir-akhir ini.', sentiment: 'confirmation' }
            ],
            rpd: [
                { id: 'q_history', text: 'Punya riwayat asma?', response: 'Iya dok, sejak kecil.', sentiment: 'confirmation' }
            ],
            rpk: [
                { id: 'q_fam', text: 'Di keluarga ada yang punya asma atau alergi juga?', response: 'Ibu saya asma, kakak alergi debu.', sentiment: 'confirmation' }
            ],
            sosial: [
                { id: 'q_smoke', text: 'Merokok nggak pak/bu?', response: 'Nggak, tapi suami merokok.', sentiment: 'denial' }
            ]
        },
        essentialQuestions: ['q_main', 'q_trigger', 'q_history'],
        anamnesis: ["Sesak napas bunyi ngik-ngik dok, dicetuskan debu/dingin.", "Saya asma sejak kecil, ibu juga asma."],
        physicalExamFindings: {
            general: "Tampak sesak, berbicara kalimat tidak lengkap.",
            vitals: "TD 120/80, N 100x, RR 26x, S 36.8°C, SpO2 94%",
            thorax: "Ekspirasi memanjang, Wheezing (+/+) bilateral. Retraksi intercostal ringan."
        },
        labs: {},
        vitals: { temp: 36.8, bp: '120/80', hr: 100, rr: 26, spo2: 94 },
        correctTreatment: ['salbutamol_inhaler', 'budesonide_inhaler'],
        correctProcedures: ['nebulizer'],
        requiredEducation: ['allergen_avoid', 'med_compliance', 'red_flag_monitor'],
        risk: 'medium',
        nonReferrable: true,
        referralExceptions: ['emergency', 'no_improvement', 'comorbidity'],
        differentialDiagnosis: ['J44.9', 'J18.9']
    },
    {
        id: 'asma_bronkiale_akut',
        diagnosis: 'Asma Bronkiale (Serangan Akut)',
        icd10: 'J45.9',
        skdi: '4A',
        category: 'Respiratory',
        anamnesis: ["Napas saya bunyi ngik-ngik dok, sesak banget.", "Barusan kena debu pas bersih-bersih rumah langsung sesak. Sudah pakai inhaler nggak mendingan."],
        physicalExamFindings: { general: "Tampak sesak berat, bicara terputus.", vitals: "TD 120/80, N 110x, RR 28x, S 36.6°C, SpO2 92%", thorax: "I: Retraksi interkostal (+). A: Wheezing (+/+) di seluruh lapang paru, fase ekspirasi diperpanjang." },
        labs: {}, vitals: { temp: 36.6, bp: '120/80', hr: 110, rr: 28, spo2: 92 },
        correctTreatment: ['salbutamol_inhaler', 'ipratropium_nasal', 'dexamethasone_inj'],
        correctProcedures: ['nebulizer', 'nasal_cannula'],
        requiredEducation: ['avoid_triggers', 'peak_flow_monitoring', 'emergency_plan'],
        risk: 'medium', nonReferrable: true, referralExceptions: ['emergency', 'status_asthmaticus'],
        differentialDiagnosis: ['J45', 'J46']
    },
    {
        id: 'bronkhitis_akut',
        diagnosis: 'Bronkhitis Akut',
        icd10: 'J20.9',
        skdi: '4A',
        category: 'Respiratory',
        anamnesis: ["Batuk berdahak sudah 5 hari dok, dadanya agak nyeri kalau batuk.", "Awalnya pilek terus jadi batuk, dahaknya kuning kental. Suara agak serak juga."],
        physicalExamFindings: { general: "Tampak lelah.", vitals: "TD 120/80, N 84x, RR 20x, S 37.5°C", thorax: "A: Vesikuler normal, Ronkhi basah kasar (+/+) minimal, wheezing (-)." },
        labs: {}, vitals: { temp: 37.5, bp: '120/80', hr: 84, rr: 20 },
        correctTreatment: ['ambroxol_syr', 'paracetamol_500', 'amoxicillin_500'],
        correctProcedures: [],
        requiredEducation: ['rest_and_fluids', 'stop_smoking', 'complete_antibiotics'],
        risk: 'low', nonReferrable: true, referralExceptions: ['high_fever', 'shortness_of_breath'],
        differentialDiagnosis: ['J20.9', 'J18.9']
    },
    {
        id: 'pneumonia_bakterial',
        diagnosis: 'Pneumonia Bakterial',
        icd10: 'J15.9',
        skdi: '4A',
        category: 'Respiratory',
        anamnesis: ["Sesak napas dan batuk berdahak dok, demamnya tinggi.", "Sudah 3 hari begini, dahaknya hijau dan kadang ada becak darahnya sedikit. Badan lemes banget."],
        physicalExamFindings: { general: "Tampak sakit sedang, sesak.", vitals: "TD 110/70, N 100x, RR 26x, S 38.8°C, SpO2 94%", thorax: "A: Ronkhi basah halus (+/+) di basal paru kanan. P: Fremitus suara meningkat di kanan." },
        labs: { "Rontgen Thorax": { result: "Infiltrat pada lobus kanan bawah.", cost: 100000 } },
        vitals: { temp: 38.8, bp: '110/70', hr: 100, rr: 26, spo2: 94 },
        correctTreatment: ['azithromycin_500', 'paracetamol_500', 'ambroxol_30'],
        correctProcedures: ['nasal_cannula'],
        requiredEducation: ['rest_and_fluids', 'med_compliance', 'follow_up_xray'],
        risk: 'medium', nonReferrable: true, referralExceptions: ['emergency', 'severe_pneumonia', 'elderly'],
        differentialDiagnosis: ['J15.9', 'A15']
    },
    {
        id: 'ppok_exacerbation',
        diagnosis: 'PPOK Eksaserbasi Akut',
        icd10: 'J44.1',
        skdi: '4A',
        category: 'Respiratory',
        symptoms: ['Makin sesak', 'Batuk dahak banyak', 'Riwayat merokok lama', 'Suara napas wheezing'],
        clue: "Riwayat merokok berat (>20 tahun). Sesak napas kronis yang memberat. Dada spt tong (barrel chest). Pemeriksaan: Spirometri guna konfirmasi (post-bronkodilator).",
        relevantLabs: ['Rontgen Thorax'],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Apa yang dirasakan pak/bu?', response: 'Sesak saya makin parah dok, udah seminggu ini.', sentiment: 'confirmation', priority: 'essential' }],
            rps: [{ id: 'q_smoke', text: 'Merokok nggak pak?', response: 'Iya dok, saya merokok dari muda, sudah 30 tahun.', sentiment: 'neutral', priority: 'essential' }],
            rpd: [{ id: 'q_asthma', text: 'Punya riwayat asma nggak?', response: 'Nggak tahu dok, tapi sering sesak kalau capek.', sentiment: 'confirmation' }],
            rpk: [], sosial: []
        },
        essentialQuestions: ['q_main', 'q_smoke'],
        anamnesis: ["Napas saya sesak banget dok, berdahak juga. Saya perokok dari SMP.", "Dada rasanya ampek dok, udah biasa gini tapi ini yang paling parah."],
        physicalExamFindings: {
            general: "Tampak sesak, pursed-lip breathing.",
            vitals: "TD 140/90, N 92x, RR 26x, S 37.0°C, SpO2 92%",
            thorax: "I: Barrel chest (+). P: Fremitus menurun. P: Hipersonor seluruh lapang paru. A: Vesikuler menurun, Wheezing +/+ (ekspirasi memanjang)."
        },
        labs: { "Rontgen Thorax": { result: "Hiperinflasi paru, diafragma mendatar, jantung pendulum.", cost: 100000 } },
        vitals: { temp: 37.0, bp: '140/90', hr: 92, rr: 26, spo2: 92 },
        correctTreatment: ['salbutamol_inhaler', 'prednisone_5', 'azithromycin_500'],
        correctProcedures: ['spirometry', 'nebulizer', 'nasal_cannula'],
        requiredEducation: ['stop_smoking', 'red_flag_monitor', 'routine_control'],
        risk: 'high', nonReferrable: false, referralExceptions: ['frequent_exacerbations'],
        differentialDiagnosis: ['J45', 'J15']
    },
    // === SKDI 1-3 REFERRAL CASES ===
    {
        id: 'status_asmatikus',
        diagnosis: 'Status Asmatikus (Asma Akut Berat)',
        icd10: 'J46',
        skdi: '3B',
        category: 'Respiratory',
        symptoms: ['Sesak berat tidak respon bronkodilator', 'Wheezing berat', 'Tidak bisa bicara kalimat lengkap', 'Sianosis'],
        clue: "Serangan asma berat yang TIDAK respon terhadap bronkodilator awal. Sesak berat, bicara kata per kata, posisi tripod, retraksi berat, SpO2 <90%. Nebulizer serial + steroid IV + O2 + rujuk ICU SEGERA!",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Apa yang terjadi?', response: 'Sesak banget dok, sudah nebulizer di rumah tapi nggak mempan!', sentiment: 'confirmation', priority: 'essential' }],
            rps: [
                { id: 'q_severity', text: 'Bisa ngomong kalimat lengkap?', response: 'Nggak... bisa... dok...', sentiment: 'denial', priority: 'essential' },
                { id: 'q_trigger', text: 'Ada pencetusnya?', response: 'Habis kena debu dok, tapi biasanya nebulizer langsung enak.', sentiment: 'confirmation' }
            ],
            rpd: [{ id: 'q_asthma', text: 'Riwayat asmanya?', response: 'Sejak kecil dok, sebulan bisa 3-4 kali kambuh.', sentiment: 'confirmation' }],
            rpk: [], sosial: []
        },
        essentialQuestions: ['q_main', 'q_severity'],
        anamnesis: ["Sesak banget, nebulizer nggak mempan!", "Bicara sepatah-patah, asma sejak kecil."],
        physicalExamFindings: { general: "Sesak berat, posisi tripod, bicara kata per kata, sianosis (+).", vitals: "TD 130/80, N 130x, RR 36x, S 37°C, SpO2 85%", respiratory: "Retraksi supraklavikula dan interkostal (+). Wheezing ekspirasi dan inspirasi bilateral. Silent chest di basal kanan." },
        labs: {}, vitals: { temp: 37, bp: '130/80', hr: 130, rr: 36 },
        correctTreatment: ['salbutamol_nebulizer_serial', 'ipratropium_nebulizer', 'methylprednisolone_iv'],
        correctProcedures: ['o2_mask_10lpm', 'iv_access', 'monitor_vital', 'nebulizer_serial'],
        requiredEducation: ['life_threatening', 'icu_needed', 'step_up_therapy'],
        risk: 'critical', nonReferrable: false, referralTarget: 'rs_kabupaten',
        differentialDiagnosis: ['J46', 'J45.9']
    },
    {
        id: 'bronkiolitis_akut',
        diagnosis: 'Bronkiolitis Akut',
        icd10: 'J21.9',
        skdi: '3B',
        category: 'Respiratory',
        symptoms: ['Bayi sesak napas', 'Wheezing', 'Retraksi dada', 'Riwayat pilek sebelumnya'],
        clue: "Bayi <2 tahun, ISPA → wheezing + retraksi + sesak. RSV paling sering. BUKAN asma! Bronkodilator kontroversial. O2 suportif, tetes hidung NaCl, monitor apnea pada neonatus. Rujuk jika SpO2<92%.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Bayinya kenapa bu?', response: 'Sesak napas dok, napasnya cepat banget, bunyi ngik-ngik.', sentiment: 'confirmation', priority: 'essential' }],
            rps: [
                { id: 'q_age', text: 'Usianya berapa bulan?', response: '5 bulan dok.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_feeding', text: 'Masih bisa minum susu?', response: 'Susah dok, minum sedikit-sedikit terus berhenti karena sesak.', sentiment: 'confirmation' }
            ],
            rpd: [{ id: 'q_cold', text: 'Sebelumnya pilek?', response: '3 hari lalu pilek batuk, sekarang makin sesak.', sentiment: 'confirmation' }],
            rpk: [], sosial: []
        },
        essentialQuestions: ['q_main', 'q_age'],
        anamnesis: ["Bayi 5 bulan sesak napas, bunyi ngik-ngik.", "Pilek 3 hari lalu, susah minum susu."],
        physicalExamFindings: { general: "Bayi tampak sesak, napas cuping hidung (+).", vitals: "N 160x, RR 60x, S 38°C, SpO2 89%", respiratory: "Retraksi subkostal dan interkostal (+). Wheezing dan crackles bilateral. Ekspirasi memanjang." },
        labs: {}, vitals: { temp: 38, bp: '-', hr: 160, rr: 60 },
        correctTreatment: ['nacl_nasal_drops', 'paracetamol_syrup'],
        correctProcedures: ['o2_nasal_2lpm', 'monitor_vital', 'suction_if_needed'],
        requiredEducation: ['keep_hydrated', 'monitor_breathing', 'apnea_risk_neonate'],
        risk: 'high', nonReferrable: false, referralTarget: 'rs_kabupaten',
        differentialDiagnosis: ['J21.9', 'J45.9']
    },
    {
        id: 'efusi_pleura',
        diagnosis: 'Efusi Pleura',
        icd10: 'J90',
        skdi: '3A',
        category: 'Respiratory',
        symptoms: ['Sesak napas memberat', 'Nyeri dada pleuritik', 'Suara napas menurun unilateral', 'Dullness perkusi'],
        clue: "Sesak + nyeri dada pleuritik. Pemeriksaan fisik ASIMETRIS: suara napas MENURUN satu sisi, perkusi redup (dullness), stem fremitus menurun. Penyebab terbanyak: TB, infeksi, keganasan. Rontgen thorax + rujuk torakosintesis.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Apa keluhannya?', response: 'Sesak napas dok, makin hari makin berat, nggak bisa tidur miring ke kanan.', sentiment: 'confirmation', priority: 'essential' }],
            rps: [
                { id: 'q_duration', text: 'Sudah berapa lama?', response: '2 minggu dok, makin berat.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_cough', text: 'Ada batuk?', response: 'Iya batuk kering, kadang nyeri di dada kanan kalau batuk.', sentiment: 'confirmation' }
            ],
            rpd: [{ id: 'q_tb', text: 'Pernah minum OAT atau kontak TB?', response: 'Tetangga saya berobat TB dok.', sentiment: 'neutral' }],
            rpk: [], sosial: []
        },
        essentialQuestions: ['q_main', 'q_duration'],
        anamnesis: ["Sesak napas makin berat 2 minggu, nggak bisa tidur miring kanan.", "Batuk kering, tetangga berobat TB."],
        physicalExamFindings: { general: "Sesak, posisi setengah duduk.", vitals: "TD 110/70, N 96x, RR 26x, S 37.5°C", respiratory: "Hemithorax kanan: pergerakan tertinggal, stem fremitus menurun, perkusi redup dari iga VI ke bawah, suara napas vesikuler MENURUN. Kiri: normal." },
        labs: { "Rontgen Thorax": { result: "Perselubungan homogen hemithorax dextra, pendorongan mediastinum ke kiri", cost: 75000 } },
        vitals: { temp: 37.5, bp: '110/70', hr: 96, rr: 26 },
        correctTreatment: ['paracetamol_500'],
        correctProcedures: ['rontgen_thorax'],
        requiredEducation: ['thoracocentesis_needed', 'tb_evaluation', 'fluid_analysis'],
        risk: 'high', nonReferrable: false, referralTarget: 'rs_kabupaten',
        differentialDiagnosis: ['J90', 'A15.6']
    },
    {
        id: 'edema_paru_akut',
        diagnosis: 'Edema Paru Akut',
        icd10: 'J81',
        skdi: '3B',
        category: 'Respiratory',
        symptoms: ['Sesak napas akut berat', 'Sputum berbuih pink', 'Orthopnea', 'Ronkhi bilateral'],
        clue: "EMERGENCY! Sesak akut + sputum PINK FROTHY + ronkhi basah bilateral sampai apex. Posisi duduk tegak (fowler), O2 tinggi, furosemide IV STAT, nitrogliserin SL. Biasanya akibat gagal jantung akut.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Apa yang terjadi?', response: 'Sesak banget dok tiba-tiba, sampai nggak bisa tidur, batuk keluar dahak pink berbuih!', sentiment: 'confirmation', priority: 'essential' }],
            rps: [
                { id: 'q_onset', text: 'Kapan mulainya?', response: '2 jam lalu tiba-tiba, tadinya lagi tidur.', sentiment: 'neutral', priority: 'essential' },
                { id: 'q_sputum', text: 'Dahaknya seperti apa?', response: 'Berbuih-buih warna merah muda dok.', sentiment: 'confirmation' }
            ],
            rpd: [{ id: 'q_heart', text: 'Ada sakit jantung?', response: 'Gagal jantung dok, sudah 2 tahun, obat sering lupa minum.', sentiment: 'neutral' }],
            rpk: [], sosial: []
        },
        essentialQuestions: ['q_main', 'q_onset'],
        anamnesis: ["Sesak tiba-tiba, dahak pink berbuih!", "Gagal jantung 2 tahun, obat sering lupa."],
        physicalExamFindings: { general: "Sesak berat, posisi duduk tegak, diaforesis (+), sianosis (+).", vitals: "TD 180/110, N 120x, RR 36x, S 37°C, SpO2 82%", respiratory: "Ronkhi basah bilateral sampai lapangan atas paru. JVP meningkat. Gallop S3 (+)." },
        labs: {}, vitals: { temp: 37, bp: '180/110', hr: 120, rr: 36 },
        correctTreatment: ['furosemide_40_iv', 'isdn_5_sublingual', 'morfin_2_iv'],
        correctProcedures: ['o2_mask_15lpm', 'iv_access', 'posisi_duduk_fowler', 'monitor_vital', 'foley_catheter'],
        requiredEducation: ['life_threatening', 'icu_needed', 'heart_failure_management'],
        risk: 'critical', nonReferrable: false, referralTarget: 'rs_kabupaten',
        differentialDiagnosis: ['J81', 'I50.1']
    },
    {
        id: 'pneumothorax',
        diagnosis: 'Pneumothorax',
        icd10: 'J93.9',
        skdi: '3A',
        category: 'Respiratory',
        symptoms: ['Nyeri dada mendadak', 'Sesak napas akut', 'Suara napas hilang unilateral', 'Hipersonor perkusi'],
        clue: "Nyeri dada MENDADAK + sesak. Suara napas HILANG satu sisi + perkusi HIPERSONOR. Tension pneumothorax: deviasi trakea + syok → DARURAT! Needle decompression iga II linea midklavikula jika tension.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Apa yang terjadi?', response: 'Dada kiri saya tiba-tiba nyeri banget dok, sesak napas, pas lagi duduk.', sentiment: 'confirmation', priority: 'essential' }],
            rps: [
                { id: 'q_onset', text: 'Mendadak ya?', response: 'Iya dok, tiba-tiba tanpa sebab.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_progression', text: 'Makin berat?', response: 'Iya makin sesak dok.', sentiment: 'confirmation' }
            ],
            rpd: [{ id: 'q_body', text: 'Posturnya bagaimana?', response: 'Saya kurus tinggi dok, umur 22 tahun.', sentiment: 'confirmation' }],
            rpk: [], sosial: [{ id: 'q_smoke', text: 'Merokok?', response: 'Iya dok.', sentiment: 'confirmation' }]
        },
        essentialQuestions: ['q_main', 'q_onset'],
        anamnesis: ["Dada kiri nyeri tiba-tiba, sesak napas.", "Laki-laki 22 tahun, kurus tinggi, perokok."],
        physicalExamFindings: { general: "Sesak, takipneu.", vitals: "TD 120/80, N 110x, RR 28x, S 36.8°C, SpO2 92%", respiratory: "Hemithorax kiri: pergerakan tertinggal, perkusi HIPERSONOR, suara napas HILANG. Trakea midline (non-tension)." },
        labs: { "Rontgen Thorax": { result: "Pneumothorax sinistra ~40%, garis pleura visceralis terlihat", cost: 75000 } },
        vitals: { temp: 36.8, bp: '120/80', hr: 110, rr: 28 },
        correctTreatment: ['analgesik'],
        correctProcedures: ['o2_nasal_4lpm', 'rontgen_thorax', 'monitor_vital'],
        requiredEducation: ['chest_tube_at_hospital', 'tension_pneumothorax_risk', 'no_flying'],
        risk: 'high', nonReferrable: false, referralTarget: 'rs_kabupaten',
        differentialDiagnosis: ['J93.9', 'J93.0']
    }
];
