/**
 * @reflection
 * [IDENTITY]: respiratory_infectious
 * [PURPOSE]: Respiratory infectious cases (ISPA, Pneumonia, TB, etc.).
 * [STATE]: Stable
 * [ANCHOR]: respiratory_infectious
 */
export const respiratory_infectious = [
    {
        id: 'ispa_common',
        diagnosis: 'Acute Nasopharyngitis (Common Cold)',
        icd10: 'J00',
        skdi: '4A',
        category: 'Respiratory',
        symptoms: ['Pilek', 'Hidung tersumbat', 'Demam ringan', 'Tenggorokan gatal'],
        clue: "[EBM: ISPA viral self-limiting 5-7 hari] Sekret hidung serous + demam ringan tanpa sesak/mengi. Tidak perlu antibiotik (Kemenkes RI).",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [
                { id: 'q_main_complaint', text: 'Apa keluhan utamanya?', response: 'Hidung saya meler terus dok, cairannya bening.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_duration', text: 'Sudah berapa lama?', response: 'Sudah 3 hari ini dok.', sentiment: 'confirmation', priority: 'essential' }
            ],
            rps: [
                { id: 'q_fever', text: 'Apakah ada demam?', response: 'Ada, tapi cuma sumer-sumer aja (hangat), nggak tinggi.', sentiment: 'denial' },
                { id: 'q_cough', text: 'Apakah ada batuk?', response: 'Belum ada sih dok, cuma gatal aja tenggorokannya.', sentiment: 'confirmation' },
                { id: 'q_sob', text: 'Apakah sesak napas?', response: 'Nggak sesak dok, napas biasa aja.', sentiment: 'confirmation' },
                { id: 'q_ear_pain', text: 'Ada sakit telinga?', response: 'Nggak ada dok.', sentiment: 'denial' }
            ],
            rpd: [
                { id: 'q_allergy', text: 'Ada alergi obat atau makanan?', response: 'Nggak ada dok.', sentiment: 'denial' }
            ],
            rpk: [
                { id: 'q_family_sick', text: 'Di rumah ada yang sakit sama?', response: 'Anak saya juga lagi pilek dok.', sentiment: 'neutral' }
            ],
            sosial: [
                { id: 'q_smoking', text: 'Apakah merokok?', response: 'Kadang-kadang aja dok.', sentiment: 'neutral' }
            ]
        },
        essentialQuestions: ['q_main_complaint', 'q_duration', 'q_fever', 'q_sob'],
        anamnesis: [
            "Hidung saya meler terus dok, cairannya bening.",
            "Tenggorokan agak gatal dan badan sumer-sumer."
        ],
        physicalExamFindings: {
            general: "Compos Mentis, tampak sakit ringan, tidak sesak.",
            vitals: "TD 110/70, N 82x, RR 18x, S 37.6°C",
            heent: "Konjungtiva tidak anemis. Hidung: Sekret serous (+), Mukosa edema. Faring: Hiperemis ringan.",
            thorax: "Cor: S1/S2 reguler, murmur (-). Pulmo: Vesikuler +/+, Ronkhi -/-, Wheezing -/-.",
            abdomen: "Datar, supel, BU (+) normal, nyeri tekan (-)."
        },
        labs: {
            "Darah Lengkap": { result: "Hb 13.5, Leuko 8.000, Trombo 250.000 (Normal)", cost: 50000 }
        },
        vitals: { temp: 37.6, bp: '110/70', hr: 82, rr: 18, spo2: 99 },
        correctTreatment: ['paracetamol_500', 'ctm_4', 'ambroxol_30', 'vit_c_50'],
        correctProcedures: [],
        requiredEducation: ['sleep_hygiene', 'fluid_intake', 'hand_hygiene', 'cough_etiquette', 'wear_mask'],
        risk: 'low',
        nonReferrable: true,
        referralExceptions: ['emergency', 'comorbidity', 'no_improvement'],
        differentialDiagnosis: ['J06.9', 'J02.9']
    },
    {
        id: 'pneumonia_bacterial',
        diagnosis: 'Bacterial Pneumonia',
        icd10: 'J15.9',
        skdi: '4A',
        category: 'Respiratory',
        symptoms: ['Sesak napas', 'Batuk berdahak kuning/hijau', 'Demam tinggi', 'Nyeri dada pleuritik'],
        clue: "[EBM: PNPK Pneumonia Dewasa 2023] Dyspnea + demam tinggi + ronkhi basah. Rontgen thorax konfirmasi infiltrat. Antibiotik empiris: Amoxicillin 3x500mg (PDPI).",
        relevantLabs: ['Darah Lengkap', 'Rontgen Thorax'],
        anamnesisQuestions: {
            keluhan_utama: [
                { id: 'q_main', text: 'Keluhannya apa Pak?', response: 'Saya sesak dok, napas rasanya berat. Batuknya ada dahak kuning kehijauan.', sentiment: 'confirmation', priority: 'essential' }
            ],
            rps: [
                { id: 'q_cough_type', text: 'Batuknya berdahak atau kering?', response: 'Berdahak dok, warnanya kuning kehijauan.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_duration', text: 'Sudah berapa hari demamnya?', response: 'Demam tinggi sudah 3 hari ini.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_chest_pain', text: 'Ada nyeri dada saat batuk/napas?', response: 'Iya sakit di dada kanan kalau tarik napas dalam.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_sob_severity', text: 'Sesaknya sampai mengganggu tidur?', response: 'Iya dok, saya harus pakai bantal tinggi.', sentiment: 'confirmation' }
            ],
            rpd: [
                { id: 'q_history', text: 'Punya riwayat asma atau TBC?', response: 'Nggak ada dok.', sentiment: 'denial' }
            ],
            rpk: [
                { id: 'q_family', text: 'Keluarga ada yang batuk lama?', response: 'Tidak ada dok.', sentiment: 'denial' }
            ],
            sosial: [
                { id: 'q_smoke', text: 'Bapak/Ibu perokok aktif?', response: 'Iya dok, sehari sebungkus.', sentiment: 'confirmation' }
            ]
        },
        essentialQuestions: ['q_main', 'q_chest_pain', 'q_cough_type'],
        anamnesis: [
            "Saya sesak dok, napas rasanya berat. Batuknya ada dahak kuning kehijauan.",
            "Dada sakit kalau dipakai napas dalam, demam sudah 3 hari."
        ],
        physicalExamFindings: {
            general: "Tampak sakit sedang, napas cepat dan dangkal.",
            vitals: "TD 130/80, N 105x, RR 26x, S 39.2°C, SpO2 93%",
            heent: "Napas cuping hidung (+).",
            thorax: "Retraksi dinding dada (+). Perkusi: Redup di basal paru kanan. Auskultasi: Ronkhi basah kasar (+) di lapang paru kanan bawah, bronkial breathing.",
            abdomen: "Dalam batas normal."
        },
        labs: {
            "Darah Lengkap": { result: "Leukositosis (18.000), Shift to the left", cost: 50000 },
            "Rontgen Thorax": { result: "Infiltrat (+) pada lobus bawah kanan. Kesan: Bronkopneumonia.", cost: 100000 }
        },
        vitals: { temp: 39.2, bp: '130/80', hr: 105, rr: 28, spo2: 92 },
        correctTreatment: ['amoxicillin_500', 'paracetamol_500', 'ambroxol_30'],
        correctProcedures: ['nebulizer'],
        requiredEducation: ['red_flag_monitor', 'cough_etiquette', 'wear_mask', 'fluid_intake'],
        risk: 'high',
        nonReferrable: true,
        referralExceptions: ['emergency', 'comorbidity', 'no_improvement'],
        differentialDiagnosis: ['J18.9', 'A15.0']
    },
    {
        id: 'acute_pharyngitis',
        diagnosis: 'Acute Pharyngitis',
        icd10: 'J02.9',
        skdi: '4A',
        category: 'Respiratory',
        symptoms: ['Sakit tenggorokan', 'Nyeri menelan', 'Demam', 'Batuk'],
        clue: "Nyeri menelan (odinofagia) dengan faring hiperemis. Centor criteria untuk menilai kemungkinan bakteri vs viral.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [
                { id: 'q_main', text: 'Apa keluhan utamanya?', response: 'Tenggorokan saya sakit banget dok, menelan kayak ada yang nyangkut.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_fever', text: 'Ada demam?', response: 'Iya demam tinggi sejak kemarin sore.', sentiment: 'confirmation' }
            ],
            rps: [
                { id: 'q_cough', text: 'Ada batuk pilek?', response: 'Batuk dikit, nggak pilek.', sentiment: 'confirmation' },
                { id: 'q_lump', text: 'Ada benjolan di leher?', response: 'Iya dok, di bawah rahang rasanya bengkak dan sakit.', sentiment: 'confirmation' }
            ],
            rpd: [
                { id: 'q_tonsil', text: 'Punya amandel?', response: 'Kata dokter dulu amandel saya memang agak besar.', sentiment: 'neutral' }
            ],
            rpk: [
                { id: 'q_fam_infection', text: 'Orang rumah ada yang sakit tenggorokan?', response: 'Suami saya baru sembuh batuk pilek dok.', sentiment: 'confirmation' }
            ],
            sosial: [
                { id: 'q_drink', text: 'Suka minum es/gorengan?', response: 'Kemarin habis makan gorengan banyak dok.', sentiment: 'neutral' }
            ]
        },
        essentialQuestions: ['q_main', 'q_fever', 'q_drink'],
        anamnesis: [
            "Tenggorokan saya sakit banget dok, menelan kayak ada yang nyangkut. Demam juga.",
            "Batuk kering, badan pegal-pegal."
        ],
        physicalExamFindings: {
            general: "Tampak sakit ringan.",
            vitals: "TD 115/75, N 88x, RR 18x, S 38.2°C",
            heent: "Faring hiperemis (+), Tonsil T2/T2 hiperemis tanpa eksudat.KGB submandibula teraba, nyeri tekan (+)."
        },
        labs: {},
        vitals: { temp: 38.2, bp: '115/75', hr: 88, rr: 18 },
        correctTreatment: ['paracetamol_500', 'ambroxol_30', 'lozenges'],
        correctProcedures: [],
        requiredEducation: ['gargle_salt', 'fluid_intake', 'sleep_hygiene', 'cough_etiquette'],
        risk: 'low',
        nonReferrable: true,
        referralExceptions: ['emergency', 'comorbidity'],
        differentialDiagnosis: ['J03.9', 'J06.9']
    },
    {
        id: 'tonsillitis_acute',
        diagnosis: 'Tonsilitis Akut',
        icd10: 'J03.9',
        skdi: '4A',
        category: 'Respiratory',
        symptoms: ['Nyeri menelan berat', 'Demam', 'Amandel bengkak merah', 'Pembesaran KGB leher'],
        clue: "Nyeri menelan (odinofagia) dengan tonsil T3/T3 hiperemis, eksudat (+). Centor score untuk menilai etiologi bakteri vs viral.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [
                { id: 'q_main', text: 'Tenggorokannya kenapa?', response: 'Tenggorokan sakit banget dok, demam tinggi.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_fever', text: 'Ada demam?', response: 'Demam tinggi dok, 3 hari ini.', sentiment: 'confirmation', priority: 'essential' }
            ],
            rps: [
                { id: 'q_cough', text: 'Ada batuk?', response: 'Nggak batuk dok.', sentiment: 'confirmation' },
                { id: 'q_swelling', text: 'Leher bengkak?', response: 'Iya di bawah rahang agak bengkak dan sakit.', sentiment: 'confirmation' }
            ],
            rpd: [
                { id: 'q_history', text: 'Sering radang amandel?', response: 'Iya dok, setahun bisa 3-4 kali.', sentiment: 'confirmation' }
            ],
            rpk: [
                { id: 'q_fam', text: 'Orang rumah ada yang sakit?', response: 'Nggak ada dok.', sentiment: 'denial' }
            ],
            sosial: [
                { id: 'q_food', text: 'Suka minum es?', response: 'Suka banget minum es teh manis dok.', sentiment: 'neutral' }
            ]
        },
        essentialQuestions: ['q_main', 'q_fever', 'q_history'],
        anamnesis: ["Tenggorokan sakit banget dok, demam tinggi.", "Tenggorokan saya radang lagi dok, setahun ini sudah 3-4 kali kambuh."],
        physicalExamFindings: {
            general: "Tampak sakit sedang, wajah memerah.",
            vitals: "TD 110/70, N 100x, RR 20x, S 39.0°C",
            heent: "Tonsil T3/T3, hiperemis (+), eksudat putih (+). KGB submandibula teraba, nyeri tekan (+)."
        },
        labs: {},
        vitals: { temp: 39.0, bp: '110/70', hr: 100, rr: 20 },
        correctTreatment: ['amoxicillin_500', 'paracetamol_500', 'lozenges'],
        correctProcedures: [],
        requiredEducation: ['gargle_salt', 'fluid_intake', 'sleep_hygiene', 'cough_etiquette'],
        risk: 'low',
        nonReferrable: true,
        referralExceptions: ['emergency', 'comorbidity', 'recurrent'],
        differentialDiagnosis: ['J02.9', 'J36']
    },
    {
        id: 'tb_pulmonary',
        diagnosis: 'Tuberkulosis Paru',
        icd10: 'A15',
        skdi: '4A',
        category: 'Respiratory',
        symptoms: ['Batuk lama >2 minggu', 'Batuk darah', 'Keringat malam', 'Berat badan turun', 'Demam subfebris'],
        clue: "Batuk produktif >2 minggu adalah red flag TB. Cek dahak BTA 3x, Rontgen thorax. Ini program nasional DOTS.",
        relevantLabs: ['BTA Sputum', 'Rontgen Thorax'],
        anamnesisQuestions: {
            keluhan_utama: [
                { id: 'q_main', text: 'Batuknya sudah lama?', response: 'Batuk sudah 3 minggu dok, kadang ada darahnya.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_blood', text: 'Ada batuk darah?', response: 'Kadang ada bercak darah dok.', sentiment: 'confirmation', priority: 'essential' }
            ],
            rps: [
                { id: 'q_weight', text: 'Berat badan turun?', response: 'Iya dok, turun 5 kg sebulan ini.', sentiment: 'confirmation' },
                { id: 'q_sweat', text: 'Keringat malam?', response: 'Sering banget, bangun sudah basah baju.', sentiment: 'neutral' },
                { id: 'q_fever', text: 'Ada demam?', response: 'Demam naik turun dok, sumer-sumer.', sentiment: 'confirmation' }
            ],
            rpd: [
                { id: 'q_history', text: 'Pernah TB sebelumnya?', response: 'Belum pernah dok.', sentiment: 'denial' }
            ],
            rpk: [
                { id: 'q_fam', text: 'Keluarga ada yang TB?', response: 'Bapak saya dulu pernah berobat TB.', sentiment: 'neutral', priority: 'essential' }
            ],
            sosial: [
                { id: 'q_contact', text: 'Serumah ada yang sakit sama?', response: 'Nggak ada dok.', sentiment: 'denial' }
            ]
        },
        essentialQuestions: ['q_main', 'q_blood', 'q_fam'],
        anamnesis: ["Batuk sudah 3 minggu dok, kadang ada darahnya.", "Berat badan turun, keringat malam, demam naik turun."],
        physicalExamFindings: {
            general: "Tampak kurus, pucat, lemah.",
            vitals: "TD 100/70, N 90x, RR 22x, S 37.8°C",
            thorax: "Ronkhi basah di apex paru kanan. Suara napas bronkial."
        },
        labs: {
            "BTA Sputum": { result: "BTA (+) 2+", cost: 0 },
            "Rontgen Thorax": { result: "Infiltrat di apex paru kanan, kavitas (+). Kesan: TB Paru aktif.", cost: 100000 }
        },
        vitals: { temp: 37.8, bp: '100/70', hr: 90, rr: 22 },
        correctTreatment: ['oat_kat1'],
        correctProcedures: [],
        requiredEducation: ['med_compliance', 'cough_etiquette', 'wear_mask', 'routine_control', 'family_screening'],
        risk: 'medium',
        nonReferrable: true,
        referralExceptions: ['emergency', 'comorbidity', 'no_improvement'],
        differentialDiagnosis: ['J18.9', 'A16']
    },
    {
        id: 'bronchitis_acute',
        diagnosis: 'Bronkitis Akut',
        icd10: 'J20.9',
        skdi: '4A',
        category: 'Respiratory',
        symptoms: ['Batuk berdahak', 'Demam ringan', 'Sesak ringan', 'Nyeri dada saat batuk'],
        clue: "Batuk produktif akut <3 minggu, sering pasca ISPA. Ronkhi (+), wheezing ringan mungkin ada.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [
                { id: 'q_main', text: 'Batuknya gimana?', response: 'Batuk berdahak sudah seminggu dok, dahaknya warna kuning.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_duration', text: 'Sudah berapa lama?', response: 'Seminggu ini dok.', sentiment: 'confirmation', priority: 'essential' }
            ],
            rps: [
                { id: 'q_fever', text: 'Ada demam?', response: 'Demam ringan dok, 37.8.', sentiment: 'confirmation' },
                { id: 'q_sob', text: 'Sesak?', response: 'Agak berat kalau napas dalam.', sentiment: 'confirmation' }
            ],
            rpd: [{ id: 'q_asthma', text: 'Punya asma?', response: 'Nggak ada dok.', sentiment: 'denial' }],
            rpk: [{ id: 'q_fam', text: 'Keluarga ada?', response: 'Nggak ada dok.', sentiment: 'denial' }],
            sosial: [{ id: 'q_smoke', text: 'Merokok?', response: 'Iya dok, sehari sebungkus.', sentiment: 'confirmation' }]
        },
        essentialQuestions: ['q_main', 'q_duration'],
        anamnesis: ["Batuk berdahak seminggu dok, warna putih.", "Demam ringan, agak sesak."],
        physicalExamFindings: {
            general: "Tampak sakit ringan.",
            vitals: "TD 120/80, N 88x, RR 20x, S 37.8°C",
            thorax: "Ronkhi basah (+/+), wheezing minimal."
        },
        labs: {},
        vitals: { temp: 37.8, bp: '120/80', hr: 88, rr: 20 },
        correctTreatment: ['ambroxol_30', 'paracetamol_500', 'ctm_4'],
        correctProcedures: [],
        requiredEducation: ['fluid_intake', 'stop_smoking', 'cough_etiquette', 'wear_mask'],
        risk: 'low',
        nonReferrable: true,
        referralExceptions: ['emergency', 'comorbidity', 'no_improvement'],
        differentialDiagnosis: ['J18.9', 'J06.9']
    },
    {
        id: 'laryngitis_acute',
        diagnosis: 'Laringitis Akut',
        icd10: 'J04.0',
        skdi: '4A',
        category: 'Respiratory',
        symptoms: ['Suara serak', 'Batuk kering', 'Tenggorokan gatal', 'Nyeri menelan ringan'],
        clue: "Suara serak/parau akut, batuk kering. Sering viral pasca ISPA. Voice rest penting.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [
                { id: 'q_main', text: 'Suaranya kenapa?', response: 'Suara serak hampir hilang dok, batuk-batuk kering juga.', sentiment: 'confirmation', priority: 'essential' }
            ],
            rps: [
                { id: 'q_cough', text: 'Batuk?', response: 'Batuk kering dok.', sentiment: 'confirmation' },
                { id: 'q_sob', text: 'Sesak?', response: 'Tidak sesak dok.', sentiment: 'confirmation' }
            ],
            rpd: [{ id: 'q_cold', text: 'Sebelumnya pilek?', response: 'Iya, seminggu lalu pilek batuk.', sentiment: 'confirmation' }],
            rpk: [{ id: 'q_fam', text: 'Keluarga?', response: 'Nggak ada dok.', sentiment: 'denial' }],
            sosial: [{ id: 'q_talk', text: 'Banyak bicara?', response: 'Iya, saya guru, ngomong terus tiap hari.', sentiment: 'neutral' }]
        },
        essentialQuestions: ['q_main', 'q_sob'],
        anamnesis: ["Suara serak hampir hilang, batuk kering.", "Seminggu lalu pilek, saya guru banyak bicara."],
        physicalExamFindings: {
            general: "Tampak baik.",
            vitals: "TD 120/80, N 78x, RR 18x, S 36.8°C",
            heent: "Faring hiperemis ringan. Suara serak."
        },
        labs: {},
        vitals: { temp: 36.8, bp: '120/80', hr: 78, rr: 18 },
        correctTreatment: ['paracetamol_500', 'lozenges'],
        correctProcedures: [],
        requiredEducation: ['voice_rest', 'fluid_intake', 'steam_inhalation'],
        risk: 'low',
        nonReferrable: true,
        referralExceptions: ['no_improvement'],
        differentialDiagnosis: ['J06.9', 'J02.9']
    },
    {
        id: 'influenza',
        diagnosis: 'Influenza',
        icd10: 'J11',
        skdi: '4A',
        category: 'Respiratory',
        symptoms: ['Demam tinggi mendadak', 'Nyeri otot', 'Sakit kepala', 'Batuk kering', 'Lemas'],
        clue: "Onset akut demam tinggi + myalgia + sakit kepala. Lebih berat dari common cold.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [
                { id: 'q_main', text: 'Sakit apa?', response: 'Demam tinggi mendadak dok, badan linu semua dan pusing.', sentiment: 'confirmation', priority: 'essential' }
            ],
            rps: [
                { id: 'q_myalgia', text: 'Nyeri otot?', response: 'Iya dok, linu semua terutama punggung.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_headache', text: 'Pusing?', response: 'Pusing banget dok.', sentiment: 'confirmation' }
            ],
            rpd: [{ id: 'q_history', text: 'Pernah flu?', response: 'Pernah setahun lalu juga begini.', sentiment: 'neutral' }],
            rpk: [{ id: 'q_fam', text: 'Di kantor ada yang sakit?', response: 'Banyak teman kantor yang sakit flu.', sentiment: 'confirmation' }],
            sosial: []
        },
        essentialQuestions: ['q_main', 'q_myalgia'],
        anamnesis: ["Demam tinggi mendadak, badan linu semua, pusing.", "Banyak teman kantor sakit flu."],
        physicalExamFindings: {
            general: "Tampak sakit sedang, lemah.",
            vitals: "TD 110/70, N 100x, RR 20x, S 39.0°C",
            heent: "Faring hiperemis, sekret (-). Konjungtiva injeksi ringan."
        },
        labs: {},
        vitals: { temp: 39.0, bp: '110/70', hr: 100, rr: 20 },
        correctTreatment: ['paracetamol_500', 'ctm_4', 'vit_c_50'],
        correctProcedures: [],
        requiredEducation: ['bed_rest', 'fluid_intake', 'wear_mask', 'cough_etiquette'],
        risk: 'low',
        nonReferrable: true,
        referralExceptions: ['emergency', 'comorbidity'],
        differentialDiagnosis: ['J06.9', 'A91']
    },
    {
        id: 'pertussis',
        diagnosis: 'Pertusis (Batuk Rejan)',
        icd10: 'A37.9',
        skdi: '4A',
        category: 'Respiratory',
        symptoms: ['Batuk paroksismal', 'Whoop', 'Muntah setelah batuk', 'Sianosis saat batuk'],
        clue: "Batuk paroksismal diikuti inspirasi berbunyi (whoop). Stadium: kataral, paroksismal, konvalesens. Biasanya anak belum imunisasi lengkap.",
        relevantLabs: ['Darah Lengkap'],
        anamnesisQuestions: {
            keluhan_utama: [
                {
                    id: 'q_main',
                    text: 'Batuknya gimana?',
                    response: 'Batuk keras berturut-turut dok, sampai biru, terus muntah.', sentiment: 'confirmation',
                    variations: {
                        low_education: 'Batuke saben-saben dok, ngos-ngosan terus muntah.',
                        high_education: 'Batuk paroksismal dengan inspiratory whoop, disertai post-tussive vomiting.',
                        skeptical: 'Batuk keras terus-terusan.'
                    },
                    priority: 'essential'
                }
            ],
            rps: [
                { id: 'q_whoop', text: 'Ada bunyi ngik waktu tarik napas?', response: 'Iya dok, kayak ayam berkokok.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_vomit', text: 'Muntah setelah batuk?', response: 'Iya dok, hampir tiap batuk muntah.', sentiment: 'confirmation' },
                { id: 'q_duration', text: 'Sudah berapa lama?', response: '2 minggu ini dok, makin parah.', sentiment: 'confirmation' }
            ],
            rpd: [
                { id: 'q_vaccine', text: 'Imunisasi DPT lengkap?', response: 'Belum lengkap dok, baru 2 kali.', sentiment: 'denial', priority: 'essential' }
            ],
            rpk: [{ id: 'q_contact', text: 'Ada yang batuk juga di rumah?', response: 'Kakaknya juga batuk dok.', sentiment: 'confirmation' }],
            sosial: []
        },
        essentialQuestions: ['q_main', 'q_whoop', 'q_vaccine'],
        anamnesis: ["Anak saya batuk hebat dok, sampai muntah-muntah. Sudah 2 minggu.", "Batuknya nggak berhenti-berhenti dok, sampai sesak dan muntah. Belum lengkap imunisasinya."],
        physicalExamFindings: {
            general: "Anak tampak lelah, sianosis perioral saat batuk.",
            vitals: "TD -, N 120x, RR 28x, S 37.2°C",
            thorax: "Vesikuler normal, ronkhi (-), wheezing (-). Petechiae subkonjungtiva (+)."
        },
        labs: {
            "Darah Lengkap": { result: "Leukositosis (25.000) dengan limfositosis absolut", cost: 50000 }
        },
        vitals: { temp: 37.2, bp: '-', hr: 120, rr: 28 },
        correctTreatment: ['azithromycin_sirup', 'paracetamol_syr'],
        correctProcedures: [],
        requiredEducation: ['isolation', 'complete_vaccination', 'cough_etiquette', 'contact_prophylaxis'],
        risk: 'medium',
        nonReferrable: true,
        referralExceptions: ['emergency', 'comorbidity', 'no_improvement'],
        differentialDiagnosis: ['J06.9', 'J20.9']
    }
];
