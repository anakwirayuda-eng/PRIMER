/**
 * @reflection
 * [IDENTITY]: digestive
 * [PURPOSE]: Digestive (Gastrointestinal) cases for CaseLibrary.
 * [STATE]: Experimental
 * [LAST_UPDATE]: 2026-02-12
 */

export const DIGESTIVE_CASES = [
    {
        id: 'gerd',
        diagnosis: 'Gastro-esophageal reflux disease (GERD)',
        icd10: 'K21.0',
        skdi: '4A',
        category: 'Digestive',
        symptoms: ['Heartburn (dada panas)', 'Regurgitasi (mulut asam/pahit)', 'Mual', 'Sering bersendawa'],
        clue: "[EBM: Konsensus GERD PGI 2024] Heartburn + regurgitasi. PPI first-line (Omeprazole 2x20mg). R/O kardiak dengan EKG jika >50th.",
        relevantLabs: ['EKG'], // Rule out cardiac
        anamnesisQuestions: {
            keluhan_utama: [
                {
                    id: 'q_main_complaint',
                    text: 'Apa keluhan utamanya?',
                    response: 'Dada saya panas dok (heartburn), kayak terbakar.', sentiment: 'confirmation',
                    variations: {
                        low_education: 'Ulu hati panas dok, perih kayak kebakar, rasanya nggak enak.',
                        high_education: 'Saya mengalami sensasi terbakar di dada, seperti heartburn, terutama setelah makan.',
                        skeptical: 'Dada panas.'
                    },
                    priority: 'essential'
                },
                {
                    id: 'q_duration',
                    text: 'Sudah berapa lama?',
                    response: 'Sudah semingguan ini, hilang timbul.', sentiment: 'confirmation',
                    variations: {
                        low_education: 'Sudah seminggu lah dok, kadang ilang kadang kambuh.',
                        high_education: 'Sekitar satu minggu ini dok, sifatnya intermiten.',
                        skeptical: 'Seminggu.'
                    },
                    priority: 'essential'
                }
            ],
            rps: [
                {
                    id: 'q_timing',
                    text: 'Kapan biasanya nyeri muncul?',
                    response: 'Terutama habis makan dok, atau pas lagi baring.', sentiment: 'neutral',
                    variations: {
                        low_education: 'Habis makan langsung perih, apalagi kalau tiduran abis makan.',
                        high_education: 'Biasanya postprandial dan memburuk saat berbaring.',
                        skeptical: 'Habis makan.'
                    }
                },
                {
                    id: 'q_regurgitation',
                    text: 'Ada rasa pahit di mulut?',
                    response: 'Iya, kadang kayak ada cairan naik ke mulut, asem/pahit.', sentiment: 'confirmation',
                    variations: {
                        low_education: 'Sering banget dok, kayak muntah tapi nggak jadi, asem pahit gitu.',
                        high_education: 'Ya, ada regurgitasi asam, terasa sensasi cairan naik ke esofagus.',
                        skeptical: 'Kadang-kadang.'
                    }
                },
                { id: 'q_chest_pain', text: 'Nyerinya menjalar ke lengan?', response: 'Nggak dok, cuma di ulu hati dan dada tengah aja', sentiment: 'denial' },
                { id: 'q_sob', text: 'Apakah sesak napas?', response: 'Agak sesak karena perut penuh (begah), tapi bukan sesak napas berat.', sentiment: 'confirmation' }
            ],
            rpd: [
                { id: 'q_meds', text: 'Sudah minum obat apa?', response: 'Cuma minum antasida warung, mendingan sebentar terus sakit lagi.', sentiment: 'confirmation' }
            ],
            rpk: [
                { id: 'q_fam_gerd', text: 'Keluarga ada yang sakit maag?', response: 'Iya, ibu saya maag-nya parah dok.', sentiment: 'confirmation' }
            ],
            sosial: [
                { id: 'q_coffee', text: 'Sering minum kopi atau soda?', response: 'Saya ngopi 3x sehari dok, ngerokok juga.', sentiment: 'confirmation' },
                { id: 'q_eat_sleep', text: 'Sering langsung tidur habis makan?', response: 'Iya dok, sering ketiduran habis makan malam.', sentiment: 'neutral' }
            ]
        },
        essentialQuestions: ['q_main_complaint', 'q_timing', 'q_regurgitation', 'q_chest_pain'],
        anamnesis: [
            "Dada saya panas dok (heartburn), kayak terbakar, terutama setelah makan.",
            "Kalau tidur terlentang rasanya cairannya naik ke mulut, pahit. Suka ngopi dan telat makan."
        ],
        physicalExamFindings: {
            general: "Compos Mentis, tampak tidak nyaman.",
            vitals: "TD 120/80, N 80x, RR 20x, S 36.6°C",
            abdomen: "Datar, supel, nyeri tekan epigastrium ringan, tidak ada tanda peritonitis."
        },
        labs: {
            "EKG": { result: "Sinus Rhythm, normal axis, ST-T changes (-). Kesan: Normal.", cost: 50000 }
        },
        vitals: { temp: 36.6, bp: '120/80', hr: 80, rr: 20 },
        correctTreatment: ['omeprazole_20', 'antasida_doen', 'domperidone_10'],
        correctProcedures: [],
        requiredEducation: ['diet_reflux', 'diet_meal_freq', 'elevate_head', 'diet_soft'],
        risk: 'medium',
        nonReferrable: true,
        referralExceptions: ['emergency', 'no_improvement'],
        differentialDiagnosis: ['K29.7', 'I20.9']
    },
    {
        id: 'gastritis_acute',
        diagnosis: 'Gastritis Akut',
        icd10: 'K29.7',
        skdi: '4A',
        category: 'Digestive',
        symptoms: ['Nyeri ulu hati', 'Mual', 'Perut kembung', 'Tidak nafsu makan'],
        clue: "Dyspepsia/maag. Nyeri epigastrium, mual, kembung. Tidak ada red flags (hematemesis, melena, weight loss).",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [
                { id: 'q_main', text: 'Perutnya kenapa ini pak/bu?', response: 'Perut ulu hati sakit dok, mual terus.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_duration', text: 'Sejak kapan?', response: 'Sudah 3 hari dok.', sentiment: 'confirmation', priority: 'essential' }
            ],
            rps: [
                { id: 'q_eating', text: 'Makannya teratur nggak sehari-hari?', response: 'Jarang dok, sering telat makan karena kerja.', sentiment: 'neutral' },
                { id: 'q_vomit', text: 'Pernah ada muntah darah nggak?', response: 'Nggak ada dok.', sentiment: 'denial' },
                { id: 'q_stool', text: 'BAB-nya seperti apa, ada yang hitam?', response: 'Nggak dok, normal.', sentiment: 'denial' }
            ],
            rpd: [
                { id: 'q_history', text: 'Punya riwayat maag?', response: 'Iya dok, sering kambuh.', sentiment: 'confirmation' }
            ],
            rpk: [
                { id: 'q_fam', text: 'Keluarga ada sakit maag?', response: 'Bapak saya juga maag.', sentiment: 'confirmation' }
            ],
            sosial: [
                { id: 'q_coffee', text: 'Minum kopi/alkohol?', response: 'Ngopi 3x sehari dok.', sentiment: 'confirmation' },
                { id: 'q_nsaid', text: 'Sering minum obat pereda nyeri kayak aspirin?', response: 'Kadang minum aspirin buat sakit kepala.', sentiment: 'confirmation' }
            ]
        },
        essentialQuestions: ['q_main', 'q_duration', 'q_vomit'],
        anamnesis: ["Perut ulu hati sakit dok, mual terus.", "Perut saya perih dok, sering telat makan karena kerja. Ngopi terus juga sih."],
        physicalExamFindings: {
            general: "Tampak tidak nyaman.",
            vitals: "TD 120/80, N 82x, RR 18x, S 36.8°C",
            abdomen: "Datar, supel, nyeri tekan epigastrium (+), tidak ada defans, BU normal."
        },
        labs: {},
        vitals: { temp: 36.8, bp: '120/80', hr: 82, rr: 18 },
        correctTreatment: ['omeprazole_20', 'antasida_doen', 'sucralfate_tab'],
        correctProcedures: [],
        requiredEducation: ['diet_reflux', 'diet_meal_freq', 'med_compliance'],
        risk: 'low',
        nonReferrable: true,
        referralExceptions: ['emergency', 'comorbidity', 'no_improvement'],
        differentialDiagnosis: ['K21.0', 'K25.9']
    },
    {
        id: 'ascariasis',
        diagnosis: 'Askariasis (Cacingan)',
        icd10: 'B77.9',
        skdi: '4A',
        category: 'Digestive',
        symptoms: ['Nyeri perut', 'Perut buncit', 'Nafsu makan berkurang', 'Kurus', 'Gatal anus'],
        clue: "Anak dengan perut buncit, kurus. Mungkin keluar cacing dari mulut/anus. Higiene buruk.",
        relevantLabs: ['Feses Rutin'],
        anamnesisQuestions: {
            keluhan_utama: [
                { id: 'q_main', text: 'Anak ini keluhannya apa bu/pak?', response: 'Anak saya perutnya buncit, kurus, dan nafsu makan berkurang.', sentiment: 'neutral', priority: 'essential' }
            ],
            rps: [
                { id: 'q_pain', text: 'Ada nyeri perut?', response: 'Kadang-kadang sakit perut terutama di sekitar pusar.', sentiment: 'confirmation' },
                { id: 'q_worm', text: 'Pernah lihat cacing keluar dari BAB-nya?', response: 'Pernah dok, keluar dari BAB.', sentiment: 'neutral', priority: 'essential' }
            ],
            rpd: [
                { id: 'q_deworm', text: 'Sudah pernah dikasih obat cacing belum?', response: 'Belum pernah dok.', sentiment: 'denial' }
            ],
            rpk: [
                { id: 'q_fam', text: 'Saudaranya ada yang cacingan juga?', response: 'Adiknya juga perutnya buncit.', sentiment: 'confirmation' }
            ],
            sosial: [
                { id: 'q_hygiene', text: 'Cuci tangannya gimana, rajin nggak sebelum makan?', response: 'Jarang dok, suka main tanah langsung makan.', sentiment: 'neutral' }
            ]
        },
        essentialQuestions: ['q_main', 'q_worm'],
        anamnesis: ["Anak saya perutnya buncit, kurus, makan susah.", "Pernah keluar cacing dari BAB."],
        physicalExamFindings: {
            general: "Tampak kurus, pucat.",
            vitals: "TD 90/60, N 90x, RR 20x, S 36.8°C",
            abdomen: "Perut membuncit, supel, teraba massa seperti tali di abdomen."
        },
        labs: {
            "Feses Rutin": { result: "Telur Ascaris lumbricoides (+)", cost: 20000 }
        },
        vitals: { temp: 36.8, bp: '90/60', hr: 90, rr: 20 },
        correctTreatment: ['albendazole_400', 'mebendazole_500'],
        correctProcedures: [],
        requiredEducation: ['hand_hygiene', 'food_hygiene', 'family_screening'],
        risk: 'low',
        nonReferrable: true,
        referralExceptions: ['emergency', 'comorbidity'],
        differentialDiagnosis: ['B76.0', 'B78.9']
    },
    {
        id: 'gerd_erosive',
        diagnosis: 'GERD (Gastroesophageal Reflux Disease)',
        icd10: 'K21.0',
        skdi: '4A',
        category: 'Digestive',
        symptoms: ['Heartburn berat', 'Regurgitasi asam', 'Odinofagia', 'Disfagia intermiten'],
        clue: "[EBM: ACG 2022] GERD erosif — heartburn refrakter terhadap antasida OTC. Skrining alarm symptoms (disfagia, BB turun, hematemesis). PPI dosis ganda jika gagal standar.",
        relevantLabs: ['EKG'],
        anamnesisQuestions: {
            keluhan_utama: [
                { id: 'q_main', text: 'Apa keluhan utamanya?', response: 'Dada saya panas banget dok, udah perih sampai tenggorokan.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_duration', text: 'Sudah berapa lama?', response: 'Sudah 2 mingguan dok, makin berat.', sentiment: 'confirmation', priority: 'essential' }
            ],
            rps: [
                { id: 'q_timing', text: 'Kapan paling parah?', response: 'Habis makan dan pas tiduran malam dok.', sentiment: 'confirmation' },
                { id: 'q_regurg', text: 'Ada rasa asam naik ke mulut?', response: 'Sering sendawa asam, lidah pahit.', sentiment: 'confirmation' },
                { id: 'q_dysphagia', text: 'Susah menelan nggak?', response: 'Kadang agak nyangkut kalau makan nasi dok.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_weight', text: 'Berat badan turun?', response: 'Nggak dok, tetap.', sentiment: 'denial' }
            ],
            rpd: [
                { id: 'q_prev_med', text: 'Sudah minum obat apa?', response: 'Antasida warung nggak mempan, promag juga nggak.', sentiment: 'confirmation' }
            ],
            rpk: [],
            sosial: [
                { id: 'q_lifestyle', text: 'Sering makan pedas atau kopi?', response: 'Ngopi 3x sehari, suka pedas, rokok juga.', sentiment: 'confirmation' }
            ]
        },
        essentialQuestions: ['q_main', 'q_duration', 'q_dysphagia'],
        anamnesis: ["Dada saya panas banget dok, udah perih sampai tenggorokan.", "Sering sendawa asam, lidah pahit. Sudah minum obat maag biasa nggak mempan."],
        physicalExamFindings: { general: "Tampak tidak nyaman.", vitals: "TD 125/80, N 84x, RR 20x, S 36.7°C", abdomen: "Nyeri tekan epigastrium (++)" },
        labs: {}, vitals: { temp: 36.7, bp: '125/80', hr: 84, rr: 20 },
        correctTreatment: ['omeprazole_20', 'sucralfate_tab', 'domperidone_10'],
        correctProcedures: ['endoscopy_referral'],
        requiredEducation: ['diet_reflux', 'diet_meal_freq', 'elevate_head'],
        risk: 'medium', nonReferrable: true, referralExceptions: ['emergency', 'no_improvement', 'alarm_symptoms'],
        differentialDiagnosis: ['K21.0', 'K29.1']
    },
    {
        id: 'gastritis_erosive',
        diagnosis: 'Gastritis Erosiva',
        icd10: 'K29.0',
        skdi: '4A',
        category: 'Digestive',
        symptoms: ['Nyeri epigastrium berat', 'Mual muntah', 'Hematemesis coffee-ground', 'Perut kembung'],
        clue: "[EBM: NICE NG12] Gastritis erosiva — nyeri ulu hati + tanda red flag (hematemesis). Evaluasi NSAID use dan H. pylori. PPI + sucralfate + pantau tanda perdarahan GI.",
        relevantLabs: ['Darah Lengkap'],
        anamnesisQuestions: {
            keluhan_utama: [
                { id: 'q_main', text: 'Perutnya kenapa dok?', response: 'Ulu hati perih banget dok, mual muntah.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_onset', text: 'Sejak kapan?', response: 'Sudah 4 hari dok, makin parah.', sentiment: 'confirmation', priority: 'essential' }
            ],
            rps: [
                { id: 'q_hematemesis', text: 'Muntahnya ada darah nggak?', response: 'Kemarin sempat muntah ada bercak hitam sedikit dok.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_melena', text: 'BAB-nya hitam?', response: 'Nggak dok, BAB biasa.', sentiment: 'denial' },
                { id: 'q_appetite', text: 'Nafsu makan?', response: 'Nggak ada dok, mual terus.', sentiment: 'denial' }
            ],
            rpd: [
                { id: 'q_nsaid', text: 'Sering minum obat pereda nyeri?', response: 'Sering minum ibuprofen buat sakit gigi.', sentiment: 'confirmation' }
            ],
            rpk: [],
            sosial: [
                { id: 'q_alcohol', text: 'Minum alkohol?', response: 'Kadang-kadang dok.', sentiment: 'confirmation' }
            ]
        },
        essentialQuestions: ['q_main', 'q_onset', 'q_hematemesis'],
        anamnesis: ["Ulu hati perih banget dok, mual muntah.", "Kemarin sempat muntah ada bercak hitam sedikit dok, perut kembung banget."],
        physicalExamFindings: { general: "Tampak pucat, menahan nyeri.", vitals: "TD 110/70, N 90x, RR 22x, S 36.8°C", abdomen: "Nyeri tekan epigastrium (+)" },
        labs: {}, vitals: { temp: 36.8, bp: '110/70', hr: 90, rr: 22 },
        correctTreatment: ['omeprazole_20', 'sucralfate_tab', 'phytomenadione_10'],
        correctProcedures: ['endoscopy_referral'],
        requiredEducation: ['diet_reflux', 'diet_soft', 'med_compliance'],
        risk: 'medium', nonReferrable: true, referralExceptions: ['emergency', 'hematemesis_melena'],
        differentialDiagnosis: ['K29.0', 'K25.9']
    },
    {
        id: 'diare_akut_non_spesifik',
        diagnosis: 'Diare Akut Non-Spesifik',
        icd10: 'A09.9',
        skdi: '4A',
        category: 'Digestive',
        symptoms: ['BAB cair > 3x/hari', 'Nyeri perut kolik', 'Mual', 'Lemas'],
        clue: "[EBM: WHO-UNICEF] Diare akut < 14 hari tanpa darah/lendir. Kunci: derajat dehidrasi (turgor, mata cekung, CRT). Terapi: ORS + Zinc 20mg 10 hari. JANGAN antibiotik rutin!",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [
                { id: 'q_main', text: 'BAB-nya gimana?', response: 'Buang air besar cair dok, sudah 5 kali hari ini.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_onset', text: 'Mulai kapan?', response: 'Tadi malam dok, habis jajan sembarangan.', sentiment: 'confirmation', priority: 'essential' }
            ],
            rps: [
                { id: 'q_blood', text: 'Ada darah atau lendir di BAB?', response: 'Nggak ada dok, cuma cair aja.', sentiment: 'denial', priority: 'essential' },
                { id: 'q_vomit', text: 'Ada muntah?', response: 'Mual aja, belum muntah.', sentiment: 'denial' },
                { id: 'q_thirst', text: 'Haus nggak?', response: 'Haus banget dok.', sentiment: 'confirmation' },
                { id: 'q_urine', text: 'Kencing masih banyak?', response: 'Agak sedikit dari biasanya.', sentiment: 'confirmation' }
            ],
            rpd: [],
            rpk: [
                { id: 'q_family', text: 'Di rumah ada yang diare juga?', response: 'Nggak ada dok.', sentiment: 'denial' }
            ],
            sosial: [
                { id: 'q_food', text: 'Kemarin makan apa?', response: 'Jajan bakso pinggir jalan dok.', sentiment: 'confirmation' }
            ]
        },
        essentialQuestions: ['q_main', 'q_onset', 'q_blood'],
        anamnesis: ["Buang air besar cair dok, sudah 5 kali hari ini.", "Perut mules banget, BAB nggak ada darah atau lendir. Tadi jajan sembarangan."],
        physicalExamFindings: { general: "Tampak lemas, turgor baik.", vitals: "TD 110/70, N 88x, RR 20x, S 37.2°C", abdomen: "Bising usus meningkat (++)" },
        labs: {}, vitals: { temp: 37.2, bp: '110/70', hr: 88, rr: 20 },
        correctTreatment: ['oralit', 'zinc_20', 'attapulgite'],
        correctProcedures: [],
        requiredEducation: ['hand_hygiene', 'food_hygiene', 'rehydration'],
        risk: 'low', nonReferrable: true, referralExceptions: ['dehydration_severe'],
        differentialDiagnosis: ['A09', 'A00']
    },
    {
        id: 'demam_tifoid',
        diagnosis: 'Demam Tifoid',
        icd10: 'A01.0',
        skdi: '4A',
        category: 'Digestive',
        symptoms: ['Demam stepladder', 'Lidah kotor', 'Nyeri perut', 'Konstipasi', 'Sakit kepala'],
        clue: "[EBM: IDI/PAPDI 2023] Demam stepladder ≥7 hari, sore-malam lebih tinggi. Typhoid tongue (lidah kotor tepi hiperemis). Bradikardi relatif. Widal ≥1/320 atau Tubex ≥4.",
        relevantLabs: ['Widal Test', 'Tubex TF'],
        anamnesisQuestions: {
            keluhan_utama: [
                { id: 'q_main', text: 'Demamnya gimana?', response: 'Demam sudah seminggu dok, makin sore makin panas.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_duration', text: 'Berapa hari demam?', response: 'Sudah 7 hari dok, nggak turun-turun.', sentiment: 'confirmation', priority: 'essential' }
            ],
            rps: [
                { id: 'q_pattern', text: 'Pola demamnya gimana?', response: 'Pagi agak turun, sore-malam naik lagi.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_headache', text: 'Sakit kepala?', response: 'Pusing banget dok.', sentiment: 'confirmation' },
                { id: 'q_stool', text: 'BAB-nya gimana?', response: 'Susah BAB dok, konstipasi.', sentiment: 'confirmation' },
                { id: 'q_appetite', text: 'Nafsu makan?', response: 'Nggak ada, lidah pahit terus.', sentiment: 'denial' }
            ],
            rpd: [
                { id: 'q_history', text: 'Pernah tipes sebelumnya?', response: 'Belum pernah dok.', sentiment: 'denial' }
            ],
            rpk: [],
            sosial: [
                { id: 'q_food', text: 'Sering jajan di luar?', response: 'Sering beli makanan pinggir jalan dok.', sentiment: 'confirmation' },
                { id: 'q_water', text: 'Air minumnya dari mana?', response: 'Air sumur dok, kadang nggak dimasak.', sentiment: 'confirmation' }
            ]
        },
        essentialQuestions: ['q_main', 'q_duration', 'q_pattern'],
        anamnesis: ["Demam sudah seminggu dok, makin sore makin panas.", "Lidah terasa pahit, perut kaku, susah BAB. Sudah minum obat penurun panas tapi naik lagi."],
        physicalExamFindings: { general: "Tampak sakit sedang, apatis.", vitals: "TD 110/70, N 72x (bradikardi relatif), RR 20x, S 38.9°C", heent: "Typhoid tongue (+), Rose spots (-)" },
        labs: { "Widal Test": { result: "S. Typhi O 1/320, H 1/320", cost: 50000 } },
        vitals: { temp: 38.9, bp: '110/70', hr: 72, rr: 20 },
        correctTreatment: ['chloramphenicol_500', 'paracetamol_500'],
        correctProcedures: [],
        requiredEducation: ['bed_rest', 'diet_soft', 'med_compliance'],
        risk: 'medium', nonReferrable: true, referralExceptions: ['emergency', 'complication_intestinal'],
        differentialDiagnosis: ['A01.0', 'A75.9']
    },
    {
        id: 'ulkus_mulut',
        diagnosis: 'Ulkus Mulut (Stomatitis Aftosa)',
        icd10: 'K12.0',
        skdi: '4A',
        category: 'Digestive',
        symptoms: ['Sariawan nyeri', 'Sulit makan', 'Lesi bulat putih di mukosa mulut'],
        clue: "Ulkus dangkal bulat/oval, dasar kuning-putih, tepi eritema, nyeri. Self-limiting 7-10 hari. Topikal: triamcinolone in orabase.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Sariawannya di mana ini?', response: 'Di bibir bawah bagian dalam dok, sakit banget susah makan.', sentiment: 'confirmation', priority: 'essential' }],
            rps: [{ id: 'q_recur', text: 'Sering sariawan kayak gini nggak?', response: 'Iya dok, sering kalau lagi capek.', sentiment: 'confirmation' }],
            rpd: [], rpk: [], sosial: []
        },
        essentialQuestions: ['q_main'],
        anamnesis: ["Sariawan sakit banget dok, susah makan.", "Mulut saya banyak sariawan, mau minum aja perih."],
        physicalExamFindings: { general: "Tampak baik.", vitals: "TD 120/80, N 78x, RR 18x, S 36.7°C", heent: "Ulkus aftosa soliter diameter 5mm di mukosa labialis inferior, dasar kuning-putih, tepi eritema, nyeri tekan (+)." },
        labs: {}, vitals: { temp: 36.7, bp: '120/80', hr: 78, rr: 18 },
        correctTreatment: ['triamcinolone_orabase', 'multivitamin'],
        correctProcedures: [],
        requiredEducation: ['avoid_spicy_food', 'oral_hygiene', 'adequate_sleep'],
        risk: 'low', nonReferrable: true, referralExceptions: ['large_ulcer', 'no_improvement_2w'],
        differentialDiagnosis: ['K12.0', 'B00.2']
    },
    {
        id: 'infeksi_umbilikus',
        diagnosis: 'Infeksi pada Umbilikus (Omfalitis)',
        icd10: 'P38',
        skdi: '4A',
        category: 'Digestive',
        symptoms: ['Pusar merah', 'Keluar nanah', 'Berbau', 'Neonatus'],
        clue: "Neonatus dengan eritema periumbilikal, sekret purulent, berbau. Bisa cepat menjadi sepsis! AB topikal + sistemik. Waspada tanda bahaya.",
        relevantLabs: ['Darah Lengkap'],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Pusarnya bayi kenapa bu?', response: 'Pusar bayi merah dan keluar nanah bau dok.', sentiment: 'confirmation', priority: 'essential' }],
            rps: [{ id: 'q_onset', text: 'Mulai merahnya kapan?', response: 'Baru 2 hari, makin merah dan bau.', sentiment: 'confirmation', priority: 'essential' }],
            rpd: [], rpk: [], sosial: [{ id: 'q_clean', text: 'Perawatan pusarnya di rumah gimana bu?', response: 'Dikasih minyak dan ditutup kain dok.', sentiment: 'confirmation' }]
        },
        essentialQuestions: ['q_main', 'q_onset'],
        anamnesis: ["Pusar bayi merah dan bernanah bau dok.", "Tali pusat bayi kayaknya infeksi, bengkak merah."],
        physicalExamFindings: { general: "Neonatus tampak rewel.", vitals: "TD -, N 140x, RR 42x, S 37.5°C", abdomen: "Eritema periumbilikal, sekret purulent, foul smelling. Selulitis minimal periumbilikal." },
        labs: { "Darah Lengkap": { result: "Leukosit 18.000, shift to the left", cost: 50000 } },
        vitals: { temp: 37.5, bp: '-', hr: 140, rr: 42 },
        correctTreatment: ['gentamicin_topical', 'amoxicillin_ped'],
        correctProcedures: ['wound_care_umbilical'],
        requiredEducation: ['umbilical_care', 'keep_dry_clean', 'danger_signs_neonate'],
        risk: 'medium', nonReferrable: true, referralExceptions: ['sepsis_signs', 'necrotizing'],
        differentialDiagnosis: ['P38', 'L08.8']
    },
    {
        id: 'intoleransi_makanan',
        diagnosis: 'Intoleransi Makanan',
        icd10: 'K90.4',
        skdi: '4A',
        category: 'Digestive',
        symptoms: ['Kembung setelah makan tertentu', 'Diare', 'Mual', 'Nyeri perut'],
        clue: "Gejala GI setelah konsumsi makanan tertentu (susu=laktosa, gandum=gluten). Bukan imunologis (beda dari alergi). Diet eliminasi & reintroduksi.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Perutnya kenapa ini pak/bu?', response: 'Kembung dan diare tiap habis minum susu dok.', sentiment: 'confirmation', priority: 'essential' }],
            rps: [{ id: 'q_food', text: 'Biasanya habis makan apa yang bikin kambuh?', response: 'Susu sapi dok, kalau minum langsung mules.', sentiment: 'neutral', priority: 'essential' }],
            rpd: [], rpk: [], sosial: []
        },
        essentialQuestions: ['q_main', 'q_food'],
        anamnesis: ["Kembung dan diare tiap habis minum susu dok.", "Perut mules kalau makan roti/gandum."],
        physicalExamFindings: { general: "Tampak baik.", vitals: "TD 120/80, N 78x, RR 18x, S 36.7°C", abdomen: "Datar, supel, BU meningkat, nyeri tekan (-), defans (-)." },
        labs: {}, vitals: { temp: 36.7, bp: '120/80', hr: 78, rr: 18 },
        correctTreatment: ['dietary_modification'],
        correctProcedures: [],
        requiredEducation: ['elimination_diet', 'food_diary', 'lactose_free_alternatives'],
        risk: 'low', nonReferrable: true, referralExceptions: ['weight_loss', 'malabsorption'],
        differentialDiagnosis: ['K90.4', 'T78.1']
    },
    {
        id: 'alergi_makanan',
        diagnosis: 'Alergi Makanan',
        icd10: 'T78.1',
        skdi: '4A',
        category: 'Digestive',
        symptoms: ['Gatal/urtikaria setelah makan', 'Bengkak bibir', 'Mual muntah', 'Bisa sesak napas'],
        clue: "Reaksi imunologis (IgE-mediated) terhadap makanan: urtikaria, angioedema, GI symptoms. WASPADA anafilaksis! Hindari allergen + antihistamin. Severe → epinefrin!",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Apa yang dirasakan pak/bu?', response: 'Habis makan kacang, gatal-gatal seluruh badan, bibir bengkak.', sentiment: 'confirmation', priority: 'essential' }],
            rps: [
                { id: 'q_food', text: 'Tadi habis makan apa sebelum gatal-gatal?', response: 'Kacang tanah dok.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_sob', text: 'Ada rasa sesak napas nggak?', response: 'Nggak sesak dok.', sentiment: 'confirmation', priority: 'essential' }
            ],
            rpd: [{ id: 'q_allergy', text: 'Punya riwayat alergi makanan sebelumnya?', response: 'Pernah gatal juga habis makan seafood.', sentiment: 'confirmation' }],
            rpk: [], sosial: []
        },
        essentialQuestions: ['q_main', 'q_food', 'q_sob'],
        anamnesis: ["Gatal-gatal seluruh badan habis makan kacang, bibir bengkak.", "Anak saya alergi telur, tiap makan langsung muntah dan gatal."],
        physicalExamFindings: { general: "Tidak nyaman, garuk.", vitals: "TD 120/80, N 84x, RR 18x, S 36.7°C", skin: "Urtika multipel di trunk dan extremitas. Angioedema labialis minimal. Stridor (-)." },
        labs: {}, vitals: { temp: 36.7, bp: '120/80', hr: 84, rr: 18 },
        correctTreatment: ['cetirizine_10', 'dexamethasone_05'],
        correctProcedures: [],
        requiredEducation: ['avoid_allergen', 'read_food_labels', 'carry_antihistamine', 'seek_er_if_severe'],
        risk: 'medium', nonReferrable: true, referralExceptions: ['anaphylaxis', 'angioedema_severe'],
        differentialDiagnosis: ['T78.1', 'L50.0']
    },
    {
        id: 'cacing_tambang',
        diagnosis: 'Penyakit Cacing Tambang (Hookworm)',
        icd10: 'B76.0',
        skdi: '4A',
        category: 'Digestive',
        symptoms: ['Pucat/anemia', 'Lemas', 'Nyeri perut', 'BAB darah samar'],
        clue: "Anemia defisiensi besi kronik + ground itch (kalau lewat kulit). Petani/pekerja tanah tanpa alas kaki. Feses: telur cacing tambang. Albendazole + Fe.",
        relevantLabs: ['Feses Rutin', 'Darah Lengkap'],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Apa yang dirasakan pak/bu?', response: 'Lemas terus dok, muka pucat, nggak bertenaga.', sentiment: 'confirmation', priority: 'essential' }],
            rps: [{ id: 'q_soil', text: 'Sehari-harinya kerja di kebun atau ladang?', response: 'Iya petani dok, jarang pakai sandal.', sentiment: 'neutral', priority: 'essential' }],
            rpd: [], rpk: [], sosial: []
        },
        essentialQuestions: ['q_main', 'q_soil'],
        anamnesis: ["Lemas terus dan pucat dok.", "Badan nggak kuat, muka pucat kayak kurang darah."],
        physicalExamFindings: { general: "Pucat, konjungtiva anemis.", vitals: "TD 100/60, N 92x, RR 20x, S 36.7°C", abdomen: "Supel, nyeri tekan epigastrium ringan." },
        labs: {
            "Feses Rutin": { result: "Telur Ancylostoma/Necator (+), occult blood (+)", cost: 20000 },
            "Darah Lengkap": { result: "Hb 8.0, MCV 68 (mikrositik hipokrom), Fe rendah", cost: 50000 }
        },
        vitals: { temp: 36.7, bp: '100/60', hr: 92, rr: 20 },
        correctTreatment: ['albendazole_400', 'ferrous_sulfate_300'],
        correctProcedures: [],
        requiredEducation: ['wear_shoes', 'hand_hygiene', 'food_hygiene'],
        risk: 'low', nonReferrable: true, referralExceptions: ['severe_anemia'],
        differentialDiagnosis: ['B76.0', 'B77.9']
    },
    {
        id: 'strongiloidiasis',
        diagnosis: 'Strongiloidiasis',
        icd10: 'B78.9',
        skdi: '4A',
        category: 'Digestive',
        symptoms: ['Nyeri perut', 'Diare', 'Ruam kulit (larva currens)', 'Eosinofilia'],
        clue: "Cacing Strongyloides stercoralis. Bisa autoinfeksi → hyperinfection di immunocompromised. Larva currens (urtikaria serpiginosa). Ivermectin/albendazole.",
        relevantLabs: ['Feses Rutin', 'Darah Lengkap'],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Perut kenapa ini pak/bu?', response: 'Perut mules diare dok, kadang ada ruam garis-garis gatal di perut.', sentiment: 'confirmation', priority: 'essential' }],
            rps: [{ id: 'q_rash', text: 'Ruam gatalnya itu pindah-pindah nggak?', response: 'Iya dok, garis merah gatal yang pindah-pindah.', sentiment: 'confirmation' }],
            rpd: [], rpk: [], sosial: [{ id: 'q_soil', text: 'Sering jalan tanpa sandal di tanah nggak?', response: 'Sering jalan tanpa sandal di kebun.', sentiment: 'confirmation' }]
        },
        essentialQuestions: ['q_main'],
        anamnesis: ["Perut mules diare, ada ruam gatal di perut.", "Diare kronik dan kulit gatal garis-garis."],
        physicalExamFindings: { general: "Tampak kurus.", vitals: "TD 110/70, N 82x, RR 18x, S 36.8°C", skin: "Larva currens: linear urticaria di abdomen.", abdomen: "BU meningkat, nyeri tekan difus ringan." },
        labs: {
            "Feses Rutin": { result: "Larva Strongyloides (+)", cost: 20000 },
            "Darah Lengkap": { result: "Eosinofilia 12%", cost: 50000 }
        },
        vitals: { temp: 36.8, bp: '110/70', hr: 82, rr: 18 },
        correctTreatment: ['albendazole_400'],
        correctProcedures: [],
        requiredEducation: ['wear_shoes', 'hand_hygiene', 'food_hygiene'],
        risk: 'low', nonReferrable: true, referralExceptions: ['immunocompromised', 'hyperinfection'],
        differentialDiagnosis: ['B78.9', 'B76.0']
    },
    {
        id: 'skistosomiasis',
        diagnosis: 'Skistosomiasis',
        icd10: 'B65.9',
        skdi: '4A',
        category: 'Digestive',
        symptoms: ['Diare berdarah', 'Nyeri perut', 'Hepatosplenomegali', 'Riwayat kontak air tawar'],
        clue: "Schistosoma: kontak air tawar endemik (Sulawesi Tengah). Swimmer's itch → Katayama fever → intestinal/hepatosplenic. Praziquantel.",
        relevantLabs: ['Feses Rutin'],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Apa yang dirasakan pak/bu?', response: 'BAB berdarah dan perut buncit dok.', sentiment: 'confirmation', priority: 'essential' }],
            rps: [{ id: 'q_water', text: 'Sering kontak air tawar, mandi di sungai atau danau?', response: 'Sering mandi di danau dok.', sentiment: 'confirmation', priority: 'essential' }],
            rpd: [], rpk: [], sosial: [{ id: 'q_area', text: 'Asalnya dari mana pak/bu?', response: 'Sulawesi Tengah dok.', sentiment: 'confirmation' }]
        },
        essentialQuestions: ['q_main', 'q_water'],
        anamnesis: ["BAB berdarah dan perut buncit dok.", "Dari Sulawesi, sering mandi danau, sekarang perut membesar."],
        physicalExamFindings: { general: "Tampak sakit kronik.", vitals: "TD 110/70, N 82x, RR 18x, S 37.5°C", abdomen: "Hepatomegali 3cm BAC, splenomegali Schuffner II." },
        labs: { "Feses Rutin": { result: "Telur Schistosoma japonicum (+)", cost: 20000 } },
        vitals: { temp: 37.5, bp: '110/70', hr: 82, rr: 18 },
        correctTreatment: ['praziquantel_600'],
        correctProcedures: [],
        requiredEducation: ['avoid_freshwater_contact', 'public_health_reporting'],
        risk: 'medium', nonReferrable: true, referralExceptions: ['hepatosplenic_severe'],
        differentialDiagnosis: ['B65.9', 'B77.9']
    },
    {
        id: 'taeniasis',
        diagnosis: 'Taeniasis',
        icd10: 'B68.9',
        skdi: '4A',
        category: 'Digestive',
        symptoms: ['Keluar proglotid dari anus', 'Nyeri perut', 'Mual', 'BB turun'],
        clue: "Cacing pita (Taenia). Keluar segmen/proglotid dari anus. Makan daging sapi/babi kurang matang. Praziquantel/niklosamid. Cysticercosis jika T. solium!",
        relevantLabs: ['Feses Rutin'],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Apa yang dirasakan pak/bu?', response: 'Ada cacing pipih keluar dari BAB dok, kayak pita.', sentiment: 'confirmation', priority: 'essential' }],
            rps: [{ id: 'q_meat', text: 'Sering makan daging mentah atau kurang matang?', response: 'Sering makan lawar (daging babi mentah).', sentiment: 'neutral', priority: 'essential' }],
            rpd: [], rpk: [], sosial: []
        },
        essentialQuestions: ['q_main', 'q_meat'],
        anamnesis: ["Ada cacing pipih keluar dari BAB, kayak pita.", "BB turun terus, ada segmen cacing keluar dari dubur."],
        physicalExamFindings: { general: "Tampak kurus.", vitals: "TD 110/70, N 78x, RR 18x, S 36.7°C", abdomen: "Supel, nyeri ringan, BU normal." },
        labs: { "Feses Rutin": { result: "Proglotid dan telur Taenia sp. (+)", cost: 20000 } },
        vitals: { temp: 36.7, bp: '110/70', hr: 78, rr: 18 },
        correctTreatment: ['praziquantel_600', 'niclosamide_2g'],
        correctProcedures: [],
        requiredEducation: ['cook_meat_thoroughly', 'hand_hygiene', 'food_hygiene'],
        risk: 'low', nonReferrable: true, referralExceptions: ['cysticercosis_suspicion'],
        differentialDiagnosis: ['B68.9', 'B77.9']
    },
    {
        id: 'hemoroid_grade12',
        diagnosis: 'Hemoroid Grade 1-2',
        icd10: 'K64.0',
        skdi: '4A',
        category: 'Digestive',
        symptoms: ['BAB berdarah merah segar', 'Benjolan di anus', 'Gatal anus', 'Nyeri saat BAB'],
        clue: "Darah segar menetes saat BAB, benjolan di anus yang bisa masuk sendiri (grade 2). Diet tinggi serat + flavonoid. Grade 3-4 → rujuk bedah.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'BAB-nya berdarah pak/bu?', response: 'Iya dok, darah menetes segar habis BAB, sudah beberapa kali.', sentiment: 'confirmation', priority: 'essential' }],
            rps: [
                { id: 'q_lump', text: 'Ada benjolan yang keluar dari dubur?', response: 'Ada dok, keluar kalau ngeden tapi masuk sendiri.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_constipation', text: 'BAB-nya lancar nggak atau sering sembelit?', response: 'Iya dok, BAB keras terus.', sentiment: 'confirmation' }
            ],
            rpd: [], rpk: [], sosial: [{ id: 'q_fiber', text: 'Sehari-harinya sering makan sayur dan buah nggak?', response: 'Jarang dok, makan gorengan terus.', sentiment: 'neutral' }]
        },
        essentialQuestions: ['q_main', 'q_lump'],
        anamnesis: ["BAB berdarah merah segar menetes dok, ada benjolan.", "Ambeien saya kambuh dok, sakit kalau BAB."],
        physicalExamFindings: { general: "Tampak baik.", vitals: "TD 120/80, N 78x, RR 18x, S 36.7°C", rectal: "Inspeksi perianal: hemorrhoid external minimal. RT: tonus sfingter baik, massa (-), hemorrhoid internal grade II." },
        labs: {}, vitals: { temp: 36.7, bp: '120/80', hr: 78, rr: 18 },
        correctTreatment: ['high_fiber_diet', 'diosmin_flavonoid', 'lidocaine_suppository'],
        correctProcedures: [],
        requiredEducation: ['high_fiber_diet', 'adequate_water', 'avoid_straining', 'sitz_bath'],
        risk: 'low', nonReferrable: true, referralExceptions: ['grade_3_4', 'thrombosed', 'rectal_bleeding_severe'],
        differentialDiagnosis: ['K64.0', 'K62.5']
    },
    // === SKDI 1-3 REFERRAL CASES ===
    {
        id: 'apendisitis_akut',
        diagnosis: 'Apendisitis Akut',
        icd10: 'K35.9',
        skdi: '3B',
        category: 'Digestive',
        symptoms: ['Nyeri perut kanan bawah', 'Demam', 'Mual muntah', 'Nyeri berpindah dari ulu hati'],
        clue: "Nyeri khas: mulai ulu hati → BERPINDAH ke McBurney point (RLQ). Rovsing (+), psoas sign (+), obturator sign (+). Demam subfebris. JANGAN beri enema/laksatif! Puasakan, IV, antibiotik, rujuk bedah!",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Perutnya sakit di mana?', response: 'Awalnya sakit di ulu hati dok, sekarang pindah ke perut kanan bawah, makin sakit.', sentiment: 'confirmation', priority: 'essential' }],
            rps: [
                { id: 'q_migration', text: 'Nyerinya pindah ya?', response: 'Iya dok, tadi malam mulai di ulu hati, pagi ini sudah di kanan bawah, makin nggak ketahan.', sentiment: 'denial', priority: 'essential' },
                { id: 'q_nausea', text: 'Ada mual muntah?', response: 'Mual dari tadi malam, muntah 2 kali.', sentiment: 'confirmation' }
            ],
            rpd: [], rpk: [], sosial: []
        },
        essentialQuestions: ['q_main', 'q_migration'],
        anamnesis: ["Sakit dari ulu hati pindah ke perut kanan bawah.", "Mual muntah, nyeri makin berat."],
        physicalExamFindings: { general: "Tampak kesakitan, posisi fleksi.", vitals: "TD 120/80, N 96x, RR 20x, S 38.2°C", abdomen: "Nyeri tekan McBurney (+), lepas (+/rebound tenderness). Rovsing sign (+), psoas sign (+), obturator sign (+). Defans muskuler lokal RLQ." },
        labs: { "Darah Lengkap": { result: "Leukosit 14.500, shift to left", cost: 50000 } },
        vitals: { temp: 38.2, bp: '120/80', hr: 96, rr: 20 },
        correctTreatment: ['ceftriaxone_1g_iv', 'metronidazole_500_iv', 'ketorolac_30_iv'],
        correctProcedures: ['iv_access', 'puasakan', 'ngt_if_vomiting'],
        requiredEducation: ['surgery_needed', 'perforation_risk', 'no_laxatives'],
        risk: 'high', nonReferrable: false, referralTarget: 'rs_kabupaten',
        differentialDiagnosis: ['K35.9', 'K37']
    },
    {
        id: 'kolesistitis_akut',
        diagnosis: 'Kolesistitis Akut',
        icd10: 'K81.0',
        skdi: '3B',
        category: 'Digestive',
        symptoms: ['Nyeri perut kanan atas', 'Demam', 'Murphy sign positif', 'Mual muntah pasca makanan berlemak'],
        clue: "Nyeri kolik RUQ setelah makan berlemak → persisten + demam = kolesistitis. Murphy sign (+): nyeri + arrest inspirasi saat palpasi deep RUQ. Antibiotik + analgesik + puasakan + rujuk USG dan bedah.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Nyerinya di mana?', response: 'Perut kanan atas dok, sakit banget, sampai ke punggung kanan.', sentiment: 'confirmation', priority: 'essential' }],
            rps: [
                { id: 'q_food', text: 'Hubungan dengan makan?', response: 'Habis makan sate kambing tadi malam, beberapa jam kemudian mulai sakit.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_fever', text: 'Ada demam?', response: 'Iya dok, menggigil dari tadi malam.', sentiment: 'confirmation' }
            ],
            rpd: [{ id: 'q_prev', text: 'Pernah sakit begini sebelumnya?', response: 'Sudah beberapa kali dok, tapi biasanya hilang sendiri.', sentiment: 'confirmation' }],
            rpk: [], sosial: []
        },
        essentialQuestions: ['q_main', 'q_food'],
        anamnesis: ["Perut kanan atas sakit banget, tembus punggung.", "Habis makan berlemak, demam menggigil."],
        physicalExamFindings: { general: "Tampak kesakitan, febris.", vitals: "TD 130/80, N 100x, RR 22x, S 38.8°C", abdomen: "Nyeri tekan RUQ (+), Murphy sign (+). Tidak ada tanda peritonitis difus." },
        labs: { "Darah Lengkap": { result: "Leukosit 15.000", cost: 50000 } },
        vitals: { temp: 38.8, bp: '130/80', hr: 100, rr: 22 },
        correctTreatment: ['ceftriaxone_1g_iv', 'ketorolac_30_iv', 'ranitidine_50_iv'],
        correctProcedures: ['iv_access', 'puasakan'],
        requiredEducation: ['surgery_may_needed', 'usg_referral', 'low_fat_diet'],
        risk: 'high', nonReferrable: false, referralTarget: 'rs_kabupaten',
        differentialDiagnosis: ['K81.0', 'K80.0']
    },
    {
        id: 'hepatitis_b',
        diagnosis: 'Hepatitis B Akut',
        icd10: 'B16.9',
        skdi: '3A',
        category: 'Digestive',
        symptoms: ['Ikterik (mata kuning)', 'Lemas', 'Mual', 'Urin gelap', 'Nyeri perut kanan atas'],
        clue: "Fase prodromal (mual, anoreksia, myalgia) → fase ikterik (kuning, urin teh, feses pucat). Hepatomegali nyeri tekan. SGOT/SGPT meningkat tinggi. Cek HBsAg! Suportif + pantau + edukasi transmisi.",
        relevantLabs: ['lab_liver_function'],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Apa keluhannya?', response: 'Badan lemas banget dok, mata kuning, BAK warnanya kayak teh.', sentiment: 'confirmation', priority: 'essential' }],
            rps: [
                { id: 'q_duration', text: 'Sudah berapa lama kuning?', response: 'Seminggu dok, awalnya mual nggak nafsu makan dulu.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_stool', text: 'BAB-nya gimana?', response: 'Pucat dok, kayak dempul.', sentiment: 'confirmation' }
            ],
            rpd: [], rpk: [],
            sosial: [{ id: 'q_risk', text: 'Ada risiko penularan? Tattoo, suntikan, hubungan seksual?', response: 'Saya pernah di-tato dok, setahun lalu.', sentiment: 'neutral' }]
        },
        essentialQuestions: ['q_main', 'q_duration'],
        anamnesis: ["Lemas, mata kuning, BAK teh pekat.", "Seminggu, awalnya mual dulu, pernah di-tato."],
        physicalExamFindings: { general: "Ikterik (+), tampak lemah.", vitals: "TD 110/70, N 76x, RR 18x, S 37.5°C", abdomen: "Hepatomegali 2 jari BAC, nyeri tekan (+). Splenomegali (-)." },
        labs: { "SGOT": { result: "450 U/L", cost: 40000 }, "SGPT": { result: "520 U/L", cost: 40000 }, "Bilirubin Total": { result: "8.5 mg/dL", cost: 50000 }, "HBsAg": { result: "Reaktif (+)", cost: 80000 } },
        vitals: { temp: 37.5, bp: '110/70', hr: 76, rr: 18 },
        correctTreatment: ['bed_rest', 'diet_tinggi_kalori'],
        correctProcedures: ['cek_hbsag'],
        requiredEducation: ['transmission_prevention', 'no_alcohol', 'serial_liver_function', 'chronic_monitoring'],
        risk: 'high', nonReferrable: false, referralTarget: 'rs_kabupaten',
        differentialDiagnosis: ['B16.9', 'B15.9']
    },
    {
        id: 'perdarahan_gi_atas',
        diagnosis: 'Perdarahan Gastrointestinal Atas',
        icd10: 'K92.2',
        skdi: '3B',
        category: 'Digestive',
        symptoms: ['Muntah darah (hematemesis)', 'BAB hitam (melena)', 'Pucat', 'Penurunan kesadaran'],
        clue: "Hematemesis (muntah darah/coffee ground) dan/atau melena (BAB hitam seperti aspal). Tanda syok? Resusitasi cairan AGRESIF! 2 jalur IV, NGT untuk lavage, pantau Hb. Penyebab: varises esofagus, tukak peptik. Rujuk endoskopi!",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Apa yang terjadi?', response: 'Muntah darah dok, sudah 3 kali, BAB juga hitam kayak aspal!', sentiment: 'confirmation', priority: 'essential' }],
            rps: [
                { id: 'q_amount', text: 'Darahnya banyak?', response: 'Banyak dok, kira-kira segelas setiap muntah.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_melena', text: 'BAB hitamnya sejak kapan?', response: 'Dari tadi pagi dok, bau amis.', sentiment: 'confirmation' }
            ],
            rpd: [{ id: 'q_liver', text: 'Ada riwayat penyakit liver atau maag?', response: 'Liver dok, perut sering kembung, kaki bengkak.', sentiment: 'confirmation' }],
            rpk: [], sosial: [{ id: 'q_alcohol', text: 'Minum alkohol?', response: 'Dulu sering dok, sekarang sudah jarang.', sentiment: 'neutral' }]
        },
        essentialQuestions: ['q_main', 'q_amount'],
        anamnesis: ["Muntah darah 3 kali, segelas tiap kali. BAB hitam.", "Riwayat liver, perut kembung, kaki bengkak."],
        physicalExamFindings: { general: "Pucat, akral dingin, somnolen.", vitals: "TD 80/50, N 120x lemah, RR 24x, S 36.5°C", abdomen: "Abdomen distensi, shifting dullness (+). Hepatomegali sulit dinilai. Spider nevi (+)." },
        labs: { "Hb": { result: "5.8 g/dL", cost: 30000 } },
        vitals: { temp: 36.5, bp: '80/50', hr: 120, rr: 24 },
        correctTreatment: ['rl_1000_guyur', 'omeprazole_40_iv', 'asam_traneksamat_500_iv'],
        correctProcedures: ['iv_access_2_lines', 'ngt_lavage', 'foley_catheter', 'monitor_vital', 'head_down'],
        requiredEducation: ['life_threatening', 'blood_transfusion_needed', 'endoscopy_needed'],
        risk: 'critical', nonReferrable: false, referralTarget: 'rs_kabupaten',
        differentialDiagnosis: ['K92.2', 'I85.0']
    },
    {
        id: 'ileus_obstruktif',
        diagnosis: 'Ileus Obstruktif (Obstruksi Usus)',
        icd10: 'K56.6',
        skdi: '3B',
        category: 'Digestive',
        symptoms: ['Nyeri perut kolik', 'Muntah', 'Tidak bisa BAB dan buang angin', 'Distensi abdomen'],
        clue: "Trias obstruksi: nyeri kolik + muntah + obstipasi (tidak BAB/buang angin). Distensi abdomen + metallic sound auskultasi. BNO: air-fluid level multiple. Puasakan + NGT dekompresi + IV + rujuk bedah!",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Ada keluhan apa?', response: 'Perut saya kembung banget dok, sakit melilit-lilit, sudah 2 hari nggak bisa BAB dan buang angin.', sentiment: 'confirmation', priority: 'essential' }],
            rps: [
                { id: 'q_vomit', text: 'Ada muntah?', response: 'Iya dok, muntah terus, warnanya hijau.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_obstipation', text: 'Terakhir BAB kapan?', response: '3 hari lalu dok, sejak itu nggak pernah lagi.', sentiment: 'denial' }
            ],
            rpd: [{ id: 'q_surgery', text: 'Pernah operasi perut?', response: 'Pernah operasi usus buntu 5 tahun lalu.', sentiment: 'neutral' }],
            rpk: [], sosial: []
        },
        essentialQuestions: ['q_main', 'q_vomit'],
        anamnesis: ["Perut kembung, melilit, 2 hari nggak BAB/buang angin.", "Muntah hijau, pernah operasi usus buntu."],
        physicalExamFindings: { general: "Tampak kesakitan, dehidrasi sedang.", vitals: "TD 100/60, N 110x, RR 22x, S 37.5°C", abdomen: "Distensi (+), bising usus MENINGKAT metallic sound. Nyeri tekan difus, tanda peritonitis (-). Bekas scar operasi RLQ." },
        labs: { "BNO 3 posisi": { result: "Multiple air-fluid level, distensi usus halus", cost: 100000 } },
        vitals: { temp: 37.5, bp: '100/60', hr: 110, rr: 22 },
        correctTreatment: ['rl_1000', 'ketorolac_30_iv', 'ranitidine_50_iv'],
        correctProcedures: ['ngt_decompression', 'iv_access', 'puasakan', 'foley_catheter', 'monitor_vital'],
        requiredEducation: ['surgery_likely', 'strangulation_risk', 'adhesion_cause'],
        risk: 'critical', nonReferrable: false, referralTarget: 'rs_kabupaten',
        differentialDiagnosis: ['K56.6', 'K56.5']
    }
];
