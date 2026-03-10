/**
 * @reflection
 * [IDENTITY]: metabolic
 * [PURPOSE]: Game engine module providing: METABOLIC_CASES.
 * [STATE]: Experimental
 * [ANCHOR]: METABOLIC_CASES
 * [DEPENDS_ON]: None
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-12
 */

export const METABOLIC_CASES = [
    {
        id: 'hypertension_primary',
        diagnosis: 'Essential Hypertension',
        icd10: 'I10',
        skdi: '4A',
        category: 'Cardiovascular',
        symptoms: ['Sakit kepala tengkuk', 'Pusing', 'Kadang tidak bergejala'],
        clue: "Sering asimptomatik ('silent killer'). Cek tekanan darah berulang. Pastikan tidak ada kerusakan organ target (jantung, ginjal, mata).",
        relevantLabs: ['Profil Lipid', 'Gula Darah Puasa', 'Ureum/Kreatinin'],
        anamnesisQuestions: {
            keluhan_utama: [
                {
                    id: 'q_main_complaint',
                    text: 'Apa keluhan yang dirasakan?',
                    response: 'Leher belakang kenceng banget dok, sama kepala pusing.', sentiment: 'confirmation',
                    variations: {
                        low_education: 'Tengkuk berat dok, cengeng, pusing mumet terus.',
                        high_education: 'Saya merasa tension di area occipital, disertai dizziness.',
                        skeptical: 'Pusing aja dok.'
                    },
                    priority: 'essential'
                },
                {
                    id: 'q_duration',
                    text: 'Sejak kapan?',
                    response: 'Sudah 2-3 hari ini.', sentiment: 'confirmation',
                    variations: {
                        low_education: 'Wes pirang hari dok.',
                        high_education: 'Sekitar 2-3 hari terakhir ini.',
                        skeptical: 'pirang hari.'
                    }
                }
            ],
            rps: [
                { id: 'q_symptoms_other', text: 'Ada pandangan kabur atau mual?', response: 'Nggak ada dok.', sentiment: 'denial' },
                { id: 'q_chest_pain', text: 'Ada nyeri dada?', response: 'Nggak ada.', sentiment: 'denial' }
            ],
            rpd: [
                {
                    id: 'q_ht_history',
                    text: 'Punya riwayat darah tinggi sebelumnya?',
                    response: 'Dulu pernah dibilang tinggi, tapi saya jarang kontrol.', sentiment: 'neutral',
                    variations: {
                        low_education: 'Dulu pernah diomelin dokter katanya tinggi, tapi ya nggak berobat.',
                        high_education: 'Ya, pernah terdeteksi hipertensi tapi saya tidak compliance dengan terapi.',
                        skeptical: 'Pernah katanya.'
                    },
                    priority: 'essential'
                },
                {
                    id: 'q_meds_routine',
                    text: 'Rutin minum obat?',
                    response: 'Nggak dok, kalau pusing aja beli obat warung.', sentiment: 'confirmation',
                    variations: {
                        low_education: 'Nggak pernah dok, paling beli bodrex kalau pusing.',
                        high_education: 'Sayangnya tidak rutin, hanya symptomatik saja.',
                        skeptical: 'Nggak.'
                    }
                }
            ],
            rpk: [
                { id: 'q_family_ht', text: 'Orang tua ada darah tinggi?', response: 'Iya, bapak ibu saya darah tinggi semua.', sentiment: 'confirmation' }
            ],
            sosial: [
                {
                    id: 'q_diet',
                    text: 'Suka makanan asin/berlemak?',
                    response: 'Suka banget yang gurih-gurih dan jerohan dok.', sentiment: 'neutral',
                    variations: {
                        low_education: 'Demen banget makan gorengan sama soto babat dok.',
                        high_education: 'Memang diet saya cenderung tinggi sodium dan kolesterol.',
                        skeptical: 'Biasa aja.'
                    }
                },
                {
                    id: 'q_exercise',
                    text: 'Olahraga teratur?',
                    response: 'Jarang gerak dok, kerja duduk terus.', sentiment: 'neutral',
                    variations: {
                        low_education: 'Nggak pernah olah raga dok, mana sempat.',
                        high_education: 'Aktivitas fisik saya memang sedentary.',
                        skeptical: 'Nggak.'
                    }
                }
            ]
        },
        essentialQuestions: ['q_main_complaint', 'q_ht_history', 'q_family_ht'],
        anamnesis: [
            "Leher belakang kenceng banget dok, pusing-pusing.",
            "Saya jarang cek tensi, makan memang suka yang asin-asin."
        ],
        physicalExamFindings: {
            general: "Tampak sehat, obesitas sentral (+), BMI 28.",
            vitals: { bp: '150/95', hr: 78, rr: 18, temp: 36.8 },
            neck: "JVP 5-2 cmH2O (normal).",
            thorax: "Cor: S1/S2 murni reguler, batas jantung normal, murmur (-). Pulmo: vesikuler, ronkhi (-)."
        },
        labs: {
            "Profil Lipid": { result: "Kolesterol Total 240, LDL 160, HDL 35, TG 200. Kesan: Dislipidemia.", cost: 80000 },
            "Gula Darah Puasa": { result: "95 mg/dL (Normal)", cost: 30000 },
            "Ureum/Kreatinin": { result: "Ureum 30, Kreatinin 1.0 (Normal)", cost: 50000 }
        },
        vitals: { temp: 36.8, bp: '150/95', hr: 78, rr: 18 },
        correctTreatment: ['amlodipine_5', 'hct_25'],
        correctProcedures: [],
        requiredEducation: ['diet_low_salt', 'activity_aerobic', 'stop_smoking', 'routine_control', 'weight_loss'],
        risk: 'medium',
        nonReferrable: true,
        referralExceptions: ['emergency', 'comorbidity'],
        differentialDiagnosis: ['I11.9', 'I15.9']
    },
    {
        id: 'dm_type2',
        diagnosis: 'Diabetes Melitus Tipe 2',
        icd10: 'E11',
        skdi: '4A',
        category: 'Endocrine',
        symptoms: ['Sering kencing', 'Sering haus', 'Berat badan turun', 'Lemas', 'Pandangan kabur'],
        clue: "Trias: poliuri, polidipsi, polifagi. GDP ≥126 atau GDS ≥200. Kontrol di FKTP kecuali ada komplikasi akut.",
        relevantLabs: ['Gula Darah Puasa', 'HbA1c'],
        anamnesisQuestions: {
            keluhan_utama: [
                {
                    id: 'q_main',
                    text: 'Ada keluhan apa bu?',
                    response: 'Saya sering sekali BAK dok, haus terus padahal minum banyak.', sentiment: 'neutral',
                    priority: 'essential'
                },
                {
                    id: 'q_weight',
                    text: 'Berat badan turun?',
                    response: 'Iya dok, turun 5 kg padahal makan banyak.', sentiment: 'confirmation'
                }
            ],
            rps: [
                { id: 'q_vision', text: 'Pandangan kabur?', response: 'Agak kabur dok belakangan ini.', sentiment: 'confirmation' },
                { id: 'q_wound', text: 'Luka sulit sembuh?', response: 'Belum ada luka dok.', sentiment: 'confirmation' },
                { id: 'q_tingling', text: 'Kesemutan di kaki?', response: 'Kadang-kadang kesemutan.', sentiment: 'neutral' }
            ],
            rpd: [
                {
                    id: 'q_history',
                    text: 'Pernah dicek gula darah?',
                    response: 'Dulu pernah dikatakan tinggi tapi saya nggak kontrol.', sentiment: 'denial'
                }
            ],
            rpk: [
                {
                    id: 'q_fam',
                    text: 'Keluarga ada diabetes?',
                    response: 'Bapak dan ibu saya diabetes semua dok.', sentiment: 'confirmation'
                }
            ],
            sosial: [
                {
                    id: 'q_diet',
                    text: 'Pola makannya gimana?',
                    response: 'Saya suka manis-manis dok, nasi banyak.', sentiment: 'neutral'
                },
                { id: 'q_exercise', text: 'Olahraga teratur?', response: 'Jarang gerak dok.', sentiment: 'neutral' }
            ]
        },
        essentialQuestions: ['q_main', 'q_weight', 'q_fam'],
        anamnesis: ["Sering kencing terus dok, haus, berat badan turun.", "Badan lemas dan sering haus terus dok, berat badan juga turun padahal makan banyak."],
        physicalExamFindings: {
            general: "Tampak lemas, kulit kering, BMI 28 (obesitas).",
            vitals: "TD 140/90, N 88x, RR 18x, S 36.7°C",
            extremities: "Pulsasi dorsalis pedis (+), sensibilitas sedikit menurun di kaki."
        },
        labs: {
            "Gula Darah Puasa": { result: "185 mg/dL (Tinggi, N: <100)", cost: 30000 },
            "HbA1c": { result: "8.5% (Tidak terkontrol, N: <7%)", cost: 150000 }
        },
        vitals: { temp: 36.7, bp: '140/90', hr: 88, rr: 18 },
        correctTreatment: ['metformin_500', 'glimepiride_2'],
        correctProcedures: [],
        requiredEducation: ['diet_low_sugar', 'activity_aerobic', 'weight_loss', 'routine_control', 'red_flag_monitor'],
        risk: 'medium',
        nonReferrable: true,
        referralExceptions: ['emergency', 'comorbidity', 'no_improvement'],
        differentialDiagnosis: ['E10', 'E13']
    },
    {
        id: 'dyslipidemia',
        diagnosis: 'Dislipidemia',
        icd10: 'E78.5',
        skdi: '4A',
        category: 'Endocrine',
        symptoms: ['Biasanya asimptomatik', 'Xanthelasma', 'Arcus senilis'],
        clue: "Sering asimptomatik, ditemukan saat skrining. Kolesterol total >200, LDL >130, TG >150.",
        relevantLabs: ['Profil Lipid'],
        anamnesisQuestions: {
            keluhan_utama: [
                { id: 'q_main', text: 'Ada keluhan apa?', response: 'Saya mau cek kolesterol rutin dok, dulu pernah dikatakan tinggi.', sentiment: 'neutral', priority: 'essential' }
            ],
            rps: [
                { id: 'q_symptoms', text: 'Ada keluhan lain?', response: 'Nggak ada dok, sehat-sehat saja.', sentiment: 'denial' }
            ],
            rpd: [
                { id: 'q_history', text: 'Dulu pernah tinggi kolesterolnya?', response: 'Pernah dikatakan tinggi 5 tahun lalu, tapi nggak minum obat.', sentiment: 'denial' }
            ],
            rpk: [
                { id: 'q_fam', text: 'Keluarga ada kolesterol/jantung?', response: 'Bapak saya stroke dok, katanya kolesterolnya tinggi.', sentiment: 'confirmation', priority: 'essential' }
            ],
            sosial: [
                { id: 'q_diet', text: 'Pola makannya?', response: 'Suka gorengan, daging, jarang sayur.', sentiment: 'neutral' },
                { id: 'q_exercise', text: 'Olahraga?', response: 'Jarang gerak dok, kerjanya duduk terus.', sentiment: 'neutral' }
            ]
        },
        essentialQuestions: ['q_main', 'q_fam'],
        anamnesis: ["Cek kolesterol rutin dok, dulu pernah dikatakan tinggi.", "Mau kontrol kolesterol dok, sudah lama nggak periksa."],
        physicalExamFindings: {
            general: "Tampak sehat, obesitas sentral.",
            vitals: "TD 135/85, N 78x, RR 18x, S 36.7°C",
            heent: "Xanthelasma (-), arcus senilis (-)."
        },
        labs: {
            "Profil Lipid": { result: "Total 265, LDL 175, HDL 38, TG 280 mg/dL. Kesan: Dislipidemia campuran.", cost: 80000 }
        },
        vitals: { temp: 36.7, bp: '135/85', hr: 78, rr: 18 },
        correctTreatment: ['simvastatin_20', 'gemfibrozil_300'],
        correctProcedures: [],
        requiredEducation: ['diet_low_fat', 'activity_aerobic', 'weight_loss', 'routine_control'],
        risk: 'medium',
        nonReferrable: true,
        referralExceptions: ['comorbidity', 'no_improvement'],
        differentialDiagnosis: ['E78.0', 'E78.1']
    },
    {
        id: 'obesity',
        diagnosis: 'Obesitas',
        icd10: 'E66.9',
        skdi: '4A',
        category: 'Endocrine',
        symptoms: ['Berat badan berlebih', 'BMI >30', 'Sesak saat aktivitas', 'Mudah lelah'],
        clue: "BMI ≥25 (overweight Asia), ≥30 (obesitas). Faktor risiko DM, HT, dislipidemia.",
        relevantLabs: ['Profil Lipid', 'Gula Darah Puasa'],
        anamnesisQuestions: {
            keluhan_utama: [
                { id: 'q_main', text: 'Ada yang bisa dibantu?', response: 'Berat badan saya sudah 95 kg dok, ingin diturunkan. Nafas juga cepat capek.', sentiment: 'confirmation', priority: 'essential' }
            ],
            rps: [
                { id: 'q_sob', text: 'Sesak aktivitas?', response: 'Iya, naik tangga sudah ngos-ngosan.', sentiment: 'confirmation' },
                { id: 'q_snore', text: 'Mendengkur?', response: 'Kata istri saya ngorok keras.', sentiment: 'neutral' }
            ],
            rpd: [{ id: 'q_dm', text: 'Ada gula/darah tinggi?', response: 'Belum pernah cek dok.', sentiment: 'denial' }],
            rpk: [{ id: 'q_fam', text: 'Keluarga obesitas/DM?', response: 'Ibu saya diabetes dan gemuk.', sentiment: 'confirmation' }],
            sosial: [
                { id: 'q_diet', text: 'Pola makan?', response: 'Makan banyak, suka gorengan, ngemil malam.', sentiment: 'neutral' },
                { id: 'q_exercise', text: 'Olahraga?', response: 'Jarang gerak dok.', sentiment: 'neutral' }
            ]
        },
        essentialQuestions: ['q_main', 'q_fam'],
        anamnesis: ["Berat badan saya sudah 95 kg dok, ingin diturunkan. Nafas juga cepat capek.", "Saya mau turunkan berat badan dok, sudah nggak kuat napas pendek terus."],
        physicalExamFindings: {
            general: "Obesitas sentral, BMI 32.",
            vitals: "TD 140/90, N 85x, RR 20x, S 36.8°C",
            abdomen: "Lingkar perut 110 cm (obesitas sentral)."
        },
        labs: {
            "Profil Lipid": { result: "Total 245, LDL 160, HDL 35, TG 250", cost: 80000 },
            "Gula Darah Puasa": { result: "115 mg/dL (Pre-DM)", cost: 30000 }
        },
        vitals: { temp: 36.8, bp: '140/90', hr: 85, rr: 20 },
        correctTreatment: ['metformin_500'],
        correctProcedures: [],
        requiredEducation: ['diet_low_calorie', 'activity_aerobic', 'weight_loss', 'routine_control'],
        risk: 'medium',
        nonReferrable: true,
        referralExceptions: ['comorbidity'],
        differentialDiagnosis: ['E66.0', 'E66.1']
    },
    {
        id: 'dm_complicated',
        diagnosis: 'DM Tipe 2 dengan Nefropati',
        icd10: 'E11.2',
        skdi: '3A',
        category: 'Endocrine',
        symptoms: ['Kencing berbuioh', 'Mata bengkak', 'Lemas', 'Gula darah tidak terkontrol'],
        clue: "Pasien DM lama dengan tanda kerusakan ginjal (Albuminuria). Membutuhkan rujukan spesialis penyakit dalam.",
        relevantLabs: ['Urinalisis', 'Ureum/Kreatinin', 'Gula Darah Puasa'],
        anamnesisQuestions: {
            keluhan_utama: [
                { id: 'q_main', text: 'Keluhannya apa Pak?', response: 'Kencing berbuioh dok, lemas, mata bengkak.', sentiment: 'confirmation', priority: 'essential' }
            ],
            rps: [
                { id: 'q_edema', text: 'Ada bengkak di bagian tubuh?', response: 'Mata sering bengkak kalau pagi hari, kaki juga terasa sedikit berat.', sentiment: 'confirmation' },
                { id: 'q_vision', text: 'Bagaimana penglihatan bapak?', response: 'Agak kabur belakangan ini dok, seperti berkabut.', sentiment: 'confirmation' },
                { id: 'q_tingling', text: 'Ada rasa kesemutan di tangan atau kaki?', response: 'Iya dok, kaki sering kesemutan dan rasanya tebal.', sentiment: 'confirmation' },
                { id: 'q_wound', text: 'Pernah ada luka yang sulit sembuh?', response: 'Pernah ada luka di jempol kaki, sembuhnya lama sekali, hampir sebulan.', sentiment: 'confirmation' }
            ],
            rpd: [
                { id: 'q_dm', text: 'Sudah berapa lama sakit gula?', response: 'Sudah 10 tahun dok, didiagnosis sejak usia 45.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_med_compliance', text: 'Obatnya rutin diminum?', response: 'Kadang lupa dok, kalau badan terasa enak saya nggak minum obat.', sentiment: 'denial' }
            ],
            rpk: [
                { id: 'q_fam_hx', text: 'Keluarga ada yang sakit gula atau ginjal?', response: 'Ibu saya dulu DM juga, sampai harus cuci darah di akhir hayatnya.', sentiment: 'confirmation', priority: 'essential' }
            ],
            sosial: [
                { id: 'q_diet', text: 'Bagaimana pola makan sehari-hari?', response: 'Saya masih suka makan nasi banyak dan teh manis setiap pagi.', sentiment: 'neutral', priority: 'essential' }
            ]
        },
        essentialQuestions: ['q_main', 'q_dm', 'q_fam_hx', 'q_diet'],
        anamnesis: ["Kencing berbuioh, lemas, mata bengkak.", "Kaki saya kesemutan dan kebas dok, saya ada kencing manis sudah 10 tahun."],
        physicalExamFindings: {
            general: "Tampak sakit sedang.",
            vitals: "TD 150/90, N 84x, RR 18x, S 36.6°C",
            heent: "Edema palpebra (+/+).",
            extremities: "Edema pretibial minimal."
        },
        labs: {
            "Urinalisis": { result: "Proteinuria (+++), Glukosuria (+++)", cost: 30000 },
            "Gula Darah Puasa": { result: "210 mg/dL", cost: 30000 },
            "Ureum/Kreatinin": { result: "Ureum 50, Kreatinin 1.4", cost: 80000 }
        },
        vitals: { temp: 36.6, bp: '150/90', hr: 84, rr: 18 },
        correctTreatment: ['metformin_500', 'captopril_25', 'insulin_lantus'],
        correctProcedures: [],
        requiredEducation: ['diet_low_sugar', 'diet_low_salt', 'routine_control', 'med_compliance'],
        risk: 'high',
        referralRequired: true,
        differentialDiagnosis: ['E11.5', 'N08.3']
    },
    {
        id: 'dm_type1',
        diagnosis: 'Diabetes Melitus Tipe 1',
        icd10: 'E10.9',
        skdi: '4A',
        category: 'Endocrine',
        symptoms: ['Poliuria', 'Polidipsia', 'Penurunan BB kurang', 'Anak/remaja'],
        clue: "Onset akut, biasanya anak/remaja. 3P + penurunan BB drastis. GDS >200 + gejala klasik. BUTUH INSULIN (bukan OAD).",
        relevantLabs: ['Gula Darah'],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Keluhannya?', response: 'Anak saya minum terus, kencing terus, badan kurus padahal makan banyak.', sentiment: 'neutral', priority: 'essential' }],
            rps: [{ id: 'q_weight', text: 'Berat badan turun?', response: 'Turun 8 kg dalam sebulan dok.', sentiment: 'confirmation', priority: 'essential' }],
            rpd: [], rpk: [{ id: 'q_fam', text: 'Keluarga DM?', response: 'Nggak ada dok.', sentiment: 'denial' }], sosial: []
        },
        essentialQuestions: ['q_main', 'q_weight'],
        anamnesis: ["Anak saya kurus drastis dok, kencing terus, haus terus, makan banyak.", "Berat badan anak saya turun cepat dok, minum banyak dan sering kencing."],
        physicalExamFindings: { general: "Tampak kurus, dehidrasi ringan.", vitals: "TD 100/60, N 98x, RR 22x, S 36.7°C", abdomen: "BU normal." },
        labs: { "Gula Darah": { result: "GDS 380 mg/dL (Sangat Tinggi)", cost: 15000 } },
        vitals: { temp: 36.7, bp: '100/60', hr: 98, rr: 22 },
        correctTreatment: ['insulin_injection'],
        correctProcedures: ['gds_monitoring'],
        requiredEducation: ['insulin_technique', 'hypoglycemia_signs', 'diet_dm', 'exercise'],
        risk: 'high', nonReferrable: true, referralExceptions: ['emergency', 'comorbidity'],
        differentialDiagnosis: ['E11', 'E16.2']
    },
    {
        id: 'hypoglycemia_mild',
        diagnosis: 'Hipoglikemia Ringan',
        icd10: 'E16.2',
        skdi: '4A',
        category: 'Endocrine',
        symptoms: ['Gemetar', 'Berkeringat dingin', 'Lapar', 'Pusing'],
        clue: "Trias Whipple: gejala hipoglikemia + GDS <70 + membaik setelah koreksi glukosa. Sering pada DM yang minum obat/insulin.",
        relevantLabs: ['Gula Darah'],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Keluhannya?', response: 'Gemetar, keringat dingin, pusing dok.', sentiment: 'confirmation', priority: 'essential' }],
            rps: [{ id: 'q_dm', text: 'Ada diabetes?', response: 'Iya dok, minum glibenklamid.', sentiment: 'neutral', priority: 'essential' },
            { id: 'q_meal', text: 'Sudah makan?', response: 'Belum makan dari pagi, tapi sudah minum obat.', sentiment: 'denial' }],
            rpd: [], rpk: [], sosial: []
        },
        essentialQuestions: ['q_main', 'q_dm'],
        anamnesis: ["Saya keringat dingin dan gemetar dok, minum obat gula tapi belum makan.", "Badan saya lemes gemetar dok, tadi minum obat diabetes tapi lupa makan."],
        physicalExamFindings: { general: "Tampak pucat, berkeringat, gemetar.", vitals: "TD 100/60, N 100x, RR 20x, S 36.5°C" },
        labs: { "Gula Darah": { result: "GDS 45 mg/dL (Rendah)", cost: 15000 } },
        vitals: { temp: 36.5, bp: '100/60', hr: 100, rr: 20 },
        correctTreatment: ['dextrose_oral', 'd40_iv'],
        correctProcedures: ['gds_monitoring'],
        requiredEducation: ['eat_before_medication', 'carry_candy', 'regular_meals'],
        risk: 'high', nonReferrable: true, referralExceptions: ['emergency'],
        differentialDiagnosis: ['E10', 'R55']
    },
    {
        id: 'pem',
        diagnosis: 'Malnutrisi Energi Protein (KEP)',
        icd10: 'E44.1',
        skdi: '4A',
        category: 'Nutrition',
        symptoms: ['BB kurang', 'Pertumbuhan terlambat', 'Lemas', 'Rambut kemerahan'],
        clue: "BB/U <-2SD (gizi kurang) atau <-3SD (gizi buruk). Kwashiorkor: edema + moon face. Marasmus: kurus kering. PMT + edukasi gizi.",
        relevantLabs: ['Darah Lengkap'],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Keluhan anaknya?', response: 'Anak saya kurus banget dok, nggak mau makan.', sentiment: 'denial', priority: 'essential' }],
            rps: [{ id: 'q_diet', text: 'Makannya apa?', response: 'Nasi sama kerupuk aja dok, susah sayur dan lauk.', sentiment: 'confirmation', priority: 'essential' }],
            rpd: [], rpk: [], sosial: [{ id: 'q_ekonomi', text: 'Ekonomi?', response: 'Susah dok, bapaknya kerja serabutan.', sentiment: 'confirmation' }]
        },
        essentialQuestions: ['q_main', 'q_diet'],
        anamnesis: ["Anak saya kurus dok, makannya susah.", "Berat badan anak saya nggak naik-naik dok, susah makan."],
        physicalExamFindings: { general: "Anak tampak kurus, apatis.", vitals: "TD -, N 100x, RR 22x, S 36.5°C", skin: "Rambut kemerahan, mudah dicabut. Kulit kering. BB/U <-2SD." },
        labs: { "Darah Lengkap": { result: "Hb 9.0 (Anemia ringan), Albumin 2.8 (Rendah)", cost: 50000 } },
        vitals: { temp: 36.5, bp: '-', hr: 100, rr: 22 },
        correctTreatment: ['pmt_pemulihan', 'vit_a_200000', 'sulfas_ferosus'],
        correctProcedures: [],
        requiredEducation: ['nutrition_counseling', 'local_food_recipes', 'growth_monitoring'],
        risk: 'high', nonReferrable: true, referralExceptions: ['emergency', 'comorbidity'],
        differentialDiagnosis: ['E40', 'E46']
    },
    {
        id: 'vitamin_deficiency',
        diagnosis: 'Defisiensi Vitamin',
        icd10: 'E56.9',
        skdi: '4A',
        category: 'Nutrition',
        symptoms: ['Mudah lelah', 'Sariawan berulang', 'Kulit kering', 'Lidah merah'],
        clue: "Berbagai manifestasi: angular chiilitis (B2), glossitis (B12), dermatitis (B3/niasin), scurvy (C). Suplementasi + perbaikan diet.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Keluhannya?', response: 'Bibir pecah-pecah terus dok, sariawan, lidah sakit.', sentiment: 'confirmation', priority: 'essential' }],
            rps: [{ id: 'q_diet', text: 'Diet?', response: 'Jarang makan buah sayur dok.', sentiment: 'neutral' }],
            rpd: [], rpk: [], sosial: []
        },
        essentialQuestions: ['q_main'],
        anamnesis: ["Badan saya lemes dan sering sariawan dok, makan nggak teratur.", "Gampang capek dan sariawan terus dok, jarang makan sayur buah."],
        physicalExamFindings: { general: "Tampak pucat.", vitals: "TD 110/70, N 80x, RR 18x, S 36.7°C", heent: "Angular cheilitis (+) bilateral. Lidah: glossitis (+), merah halus." },
        labs: {}, vitals: { temp: 36.7, bp: '110/70', hr: 80, rr: 18 },
        correctTreatment: ['vit_b_complex', 'vit_c_50'],
        correctProcedures: [],
        requiredEducation: ['diet_balanced', 'eat_fruits_vegetables'],
        risk: 'low', nonReferrable: true, referralExceptions: ['no_improvement'],
        differentialDiagnosis: ['E53.9', 'D50']
    },
    {
        id: 'mineral_deficiency',
        diagnosis: 'Defisiensi Mineral',
        icd10: 'E61.9',
        skdi: '4A',
        category: 'Nutrition',
        symptoms: ['Kram otot', 'Rambut rontok', 'Kuku rapuh', 'Lemas'],
        clue: "Zinc: diare kronik + dermatitis + alopecia. Kalsium: kram. Iodium: gondok. Suplementasi spesifik.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Keluhannya?', response: 'Sering kram dok, rambut rontok, kuku gampang patah.', sentiment: 'confirmation', priority: 'essential' }],
            rps: [{ id: 'q_diet', text: 'Makannya gimana?', response: 'Kurang bervariasi dok.', sentiment: 'confirmation' }],
            rpd: [], rpk: [], sosial: []
        },
        essentialQuestions: ['q_main'],
        anamnesis: ["Rambut saya rontok dan kuku rapuh dok.", "Badan nggak fit terus dok, rambut rontok, kuku gampang patah."],
        physicalExamFindings: { general: "Tampak baik.", vitals: "TD 110/70, N 78x, RR 18x, S 36.7°C", skin: "Kuku rapuh, koilonychia (+). Rambut tipis." },
        labs: {}, vitals: { temp: 36.7, bp: '110/70', hr: 78, rr: 18 },
        correctTreatment: ['calcium', 'zinc_tab'],
        correctProcedures: [],
        requiredEducation: ['diet_balanced', 'mineral_rich_foods'],
        risk: 'low', nonReferrable: true, referralExceptions: [],
        differentialDiagnosis: ['E58', 'D50']
    },
    {
        id: 'hyperuricemia',
        diagnosis: 'Hiperurisemia / Artritis Gout',
        icd10: 'E79.0',
        skdi: '4A',
        category: 'Endocrine',
        symptoms: ['Nyeri sendi mendadak', 'Bengkak merah', 'Jempol kaki', 'Setelah makan jeroan'],
        clue: "Artritis monoartikular akut + hiperurisemia. MTP-1 (podagra) paling sering. Kristal MSU. Akut: kolkisin/NSAID. Kronik: allopurinol.",
        relevantLabs: ['Asam Urat'],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Keluhannya?', response: 'Jempol kaki mendadak nyeri banget dok, merah bengkak.', sentiment: 'confirmation', priority: 'essential' }],
            rps: [{ id: 'q_food', text: 'Habis makan apa?', response: 'Kemarin makan jeroan dan bir.', sentiment: 'neutral', priority: 'essential' }],
            rpd: [{ id: 'q_prior', text: 'Pernah sebelumnya?', response: 'Sering kambuh kalau makan jeroan.', sentiment: 'confirmation' }],
            rpk: [], sosial: []
        },
        essentialQuestions: ['q_main', 'q_food'],
        anamnesis: ["Jempol kaki saya bengkak merah nyeri banget dok, tiba-tiba semalam.", "Kaki saya nyeri banget dok di jempol, bengkak merah. Kemarin makan jeroan."],
        physicalExamFindings: { general: "Tampak kesakitan.", vitals: "TD 130/80, N 85x, RR 18x, S 37.0°C", extremities: "MTP-1 sinistra: eritema, edema, tender, warm. ROM limitasi karena nyeri." },
        labs: { "Asam Urat": { result: "Asam urat 9.8 mg/dL (Tinggi)", cost: 30000 } },
        vitals: { temp: 37.0, bp: '130/80', hr: 85, rr: 18 },
        correctTreatment: [['colchicine_0_5', 'naproxen_500'], 'allopurinol_100'],
        correctProcedures: [],
        requiredEducation: ['low_purine_diet', 'avoid_alcohol', 'drink_water', 'routine_uric_acid_check'],
        risk: 'low', nonReferrable: true, referralExceptions: ['no_improvement'],
        differentialDiagnosis: ['M10.9', 'M13.9']
    }
];
