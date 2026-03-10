/**
 * @reflection
 * [IDENTITY]: psychiatry
 * [PURPOSE]: Psychiatry (Mental health) cases for CaseLibrary.
 * [STATE]: Experimental
 * [LAST_UPDATE]: 2026-02-12
 */

export const PSYCHIATRY_CASES = [
    {
        id: 'insomnia',
        diagnosis: 'Insomnia',
        icd10: 'F51.0',
        category: 'Psychiatry',
        skdi: '4A',
        anamnesis: ["Susah tidur dok, gelisah terus tiap malem.", "Mengalami insomnia sejak sebulan terakhir, sulit masuk tidur."],
        physicalExamFindings: { general: "Tampak lelah, konjungtiva tidak anemis.", vitals: "TD 120/80, N 84x, RR 18x, S 36.6°C" },
        labs: {},
        vitals: { temp: 36.6, bp: '120/80', hr: 84, rr: 18 },
        correctTreatment: ['diazepam_2'], // Fallback medication
        correctProcedures: [],
        requiredEducation: ['sleep_hygiene', 'stress_management'],
        risk: 'medium', nonReferrable: true, referralExceptions: ['depression_major', 'psychosis'],
        differentialDiagnosis: ['F51.0', 'F41.1']
    },
    {
        id: 'gangguan_cemas',
        diagnosis: 'Gangguan Cemas Menyeluruh (GAD)',
        icd10: 'F41.1',
        skdi: '4A',
        category: 'Psychiatry',
        symptoms: ['Cemas berlebihan', 'Gelisah', 'Jantung berdebar', 'Sulit tidur', 'Ketegangan otot'],
        clue: "Cemas berlebihan >6 bulan, tidak proporsional, sulit dikendalikan. Gejala somatik: palpitasi, tremor, berkeringat. CBT + SSRI atau benzodiazepin sementara.",
        relevantLabs: ['TSH'],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Apa yang sedang dirasakan pak/bu?', response: 'Cemas terus dok, jantung berdebar, gelisah, pikiran nggak bisa tenang.', sentiment: 'confirmation', priority: 'essential' }],
            rps: [
                { id: 'q_duration', text: 'Sudah berapa lama merasa begini?', response: 'Sudah 8 bulan begini dok, makin parah.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_trigger', text: 'Ada hal tertentu yang memicu perasaan cemas ini?', response: 'Nggak ada yang spesifik, cemas aja terus.', sentiment: 'denial' }
            ],
            rpd: [], rpk: [{ id: 'q_fam', text: 'Di keluarga ada yang punya keluhan serupa?', response: 'Ibu saya juga pencemas.', sentiment: 'confirmation' }],
            sosial: [{ id: 'q_work', text: 'Sehari-harinya kerja apa pak/bu?', response: 'Karyawan swasta, tekanan kerja tinggi.', sentiment: 'neutral' }]
        },
        essentialQuestions: ['q_main', 'q_duration'],
        anamnesis: ["Cemas terus, gelisah, jantung berdebar.", "Nggak bisa tenang, pikiran kemana-mana, sulit tidur."],
        physicalExamFindings: { general: "Tampak tegang, gelisah.", vitals: "TD 130/85, N 92x, RR 20x, S 36.7°C", neuro: "Tremor halus (+), refleks fisiologis normal, tidak ada defisit neurologis." },
        labs: { "TSH": { result: "2.5 mIU/L (normal — r/o hipertiroid)", cost: 100000 } },
        vitals: { temp: 36.7, bp: '130/85', hr: 92, rr: 20 },
        correctTreatment: ['alprazolam_025', 'sertraline_50'],
        correctProcedures: [],
        requiredEducation: ['relaxation_techniques', 'regular_exercise', 'limit_caffeine', 'sleep_hygiene', 'counseling_referral'],
        risk: 'medium', nonReferrable: true, referralExceptions: ['suicidal_ideation', 'psychosis', 'substance_abuse'],
        differentialDiagnosis: ['F41.1', 'F41.0']
    },
    {
        id: 'gangguan_somatoform',
        diagnosis: 'Gangguan Somatoform',
        icd10: 'F45.0',
        skdi: '4A',
        category: 'Psychiatry',
        symptoms: ['Keluhan fisik berulang', 'Pemeriksaan normal', 'Doctor shopping', 'Cemas berlebihan soal penyakit'],
        clue: "Keluhan somatik multipel berulang (nyeri, pusing, mual, dll) tanpa temuan organik. Medical check-up berulang selalu normal. Doctor shopping. Edukasi + psikoterapi + SSRI dosis rendah.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Apa keluhan utamanya pak/bu?', response: 'Sakit di mana-mana dok, perut sakit, kepala pusing, dada sesak, badan lemes terus.', sentiment: 'confirmation', priority: 'essential' }],
            rps: [
                { id: 'q_duration', text: 'Sudah berapa lama keluhannya?', response: 'Sudah berbulan-bulan dok, periksa ke mana-mana hasilnya selalu normal.', sentiment: 'denial', priority: 'essential' },
                { id: 'q_doctor', text: 'Sudah periksa ke dokter lain sebelumnya?', response: 'Sudah ke 5 dokter dok, semuanya bilang nggak ada apa-apa tapi saya tetap sakit.', sentiment: 'confirmation' }
            ],
            rpd: [{ id: 'q_stress', text: 'Ada masalah pikiran atau stres yang berat?', response: 'Sebenarnya ada masalah keluarga dok... tapi ini sakit beneran kok.', sentiment: 'confirmation' }],
            rpk: [],
            sosial: [{ id: 'q_work', text: 'Keluhan ini sampai mengganggu aktivitas sehari-hari?', response: 'Iya dok, saya sampai nggak bisa kerja, takut sakit parah.', sentiment: 'confirmation' }]
        },
        essentialQuestions: ['q_main', 'q_duration'],
        anamnesis: ["Sakit di mana-mana dok, periksa ke mana-mana hasilnya normal.", "Sudah ke banyak dokter, tetap merasa sakit."],
        physicalExamFindings: { general: "Tampak cemas, kooperatif.", vitals: "TD 120/80, N 82x, RR 18x, S 36.5°C", neuro: "Dalam batas normal, tidak ada defisit neurologis." },
        labs: { "Darah Lengkap": { result: "Dalam batas normal", cost: 50000 } },
        vitals: { temp: 36.5, bp: '120/80', hr: 82, rr: 18 },
        correctTreatment: ['sertraline_50', 'paracetamol_500'],
        correctProcedures: ['brief_psychotherapy'],
        requiredEducation: ['mind_body_connection', 'stress_management', 'regular_followup', 'avoid_unnecessary_tests'],
        risk: 'low', nonReferrable: true, referralExceptions: ['suicidal_ideation', 'severe_disability', 'comorbid_depression'],
        differentialDiagnosis: ['F45.0', 'F41.1']
    },
    // === SKDI 1-3 REFERRAL CASES ===
    {
        id: 'skizofrenia',
        diagnosis: 'Skizofrenia',
        icd10: 'F20.9',
        skdi: '3A',
        category: 'Psychiatry',
        symptoms: ['Halusinasi auditorik', 'Waham', 'Perilaku kacau', 'Bicara kacau', 'Menarik diri'],
        clue: "Psikosis: halusinasi auditorik (dengar suara bisikan), waham (keyakinan aneh), bicara kacau, perilaku disorganisasi. Onset usia muda. Haloperidol IM jika agitasi akut. Antipsikotik + rujuk psikiater untuk maintenance. JANGAN abaikan risiko kekerasan!",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Apa yang terjadi?', response: 'Anak saya bicara sendiri dok, katanya dengar suara-suara yang menyuruh dia, sudah sebulan.', sentiment: 'neutral', priority: 'essential' }],
            rps: [
                { id: 'q_hallucination', text: 'Suara-suaranya bilang apa?', response: 'Katanya ada yang nyuruh-nyuruh dia, kadang mengejek.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_behavior', text: 'Perilakunya gimana?', response: 'Nggak mau mandi, nggak mau makan, ngomong sendiri, kadang marah-marah tiba-tiba.', sentiment: 'denial' }
            ],
            rpd: [], rpk: [{ id: 'q_fam', text: 'Keluarga ada yang begini?', response: 'Pamannya juga pernah dirawat di RSJ.', sentiment: 'neutral' }],
            sosial: [{ id: 'q_drugs', text: 'Pernah pakai narkoba?', response: 'Setahu saya tidak dok.', sentiment: 'denial' }]
        },
        essentialQuestions: ['q_main', 'q_hallucination'],
        anamnesis: ["Bicara sendiri, dengar suara bisikan sebulan.", "Marah tiba-tiba, nggak mau mandi/makan, paman pernah di RSJ."],
        physicalExamFindings: { general: "Penampilan tidak terawat, kontak mata buruk.", vitals: "Normal", psych: "Afek datar. Proses pikir: asosiasi longgar. Isi pikir: waham kejar (merasa diikuti). Persepsi: halusinasi auditorik (+). Tilikan: buruk (derajat 1)." },
        labs: {}, vitals: { temp: 36.7, bp: '120/80', hr: 82, rr: 18 },
        correctTreatment: ['haloperidol_5_im', 'risperidone_2'],
        correctProcedures: ['safety_assessment'],
        requiredEducation: ['chronic_illness', 'medication_compliance', 'family_psychoeducation', 'psychiatry_referral'],
        risk: 'high', nonReferrable: false, referralTarget: 'rs_kabupaten',
        differentialDiagnosis: ['F20.9', 'F23.9']
    },
    {
        id: 'depresi_berat',
        diagnosis: 'Episode Depresif Berat',
        icd10: 'F32.2',
        skdi: '3A',
        category: 'Psychiatry',
        symptoms: ['Perasaan sedih mendalam', 'Hilang minat', 'Gangguan tidur', 'Penurunan nafsu makan', 'Ide bunuh diri'],
        clue: "Trias depresi: mood depresif + anhedonia + anergia. PHQ-9 ≥20 (berat). WAJIB tanya ide bunuh diri! Tanya: Apakah pernah berpikir lebih baik mati? Ada rencana? SSRI (sertraline) + psikoterapi + rujuk jika risiko bunuh diri tinggi.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Apa yang dirasakan?', response: 'Saya nggak berguna dok, nggak ada gunanya hidup lagi, sudah 2 bulan kayak gini.', sentiment: 'denial', priority: 'essential' }],
            rps: [
                { id: 'q_suicidal', text: 'Pernah berpikir untuk menyakiti diri sendiri?', response: 'Iya dok... pernah berpikir lebih baik mati, tapi belum berani.', sentiment: 'denial', priority: 'essential' },
                { id: 'q_sleep', text: 'Tidurnya gimana?', response: 'Susah tidur, bangun jam 3 pagi, nggak bisa tidur lagi.', sentiment: 'confirmation' }
            ],
            rpd: [{ id: 'q_prev', text: 'Pernah begini sebelumnya?', response: 'Pernah 5 tahun lalu, tapi nggak separah ini.', sentiment: 'denial' }],
            rpk: [], sosial: [{ id: 'q_stressor', text: 'Ada masalah yang berat?', response: 'Suami saya meninggal 3 bulan lalu, saya sendirian.', sentiment: 'neutral' }]
        },
        essentialQuestions: ['q_main', 'q_suicidal'],
        anamnesis: ["Merasa nggak berguna, nggak ada gunanya hidup, 2 bulan.", "Pernah berpikir lebih baik mati, insomnia, suami meninggal."],
        physicalExamFindings: { general: "Penampilan kurang terawat, kontak mata kurang, psikomotor retardasi.", vitals: "Normal", psych: "Afek depresif. Mood: 'Sedih banget'. Isi pikir: ide bunuh diri pasif, tanpa rencana spesifik. Derealisasi (-). Tilikan: baik (derajat 5-6). PHQ-9: 22." },
        labs: {}, vitals: { temp: 36.7, bp: '110/70', hr: 70, rr: 16 },
        correctTreatment: ['sertraline_50'],
        correctProcedures: ['safety_assessment', 'suicidal_risk_assessment'],
        requiredEducation: ['suicidal_hotline', 'medication_takes_2_4_weeks', 'psychotherapy_needed', 'psychiatry_referral'],
        risk: 'high', nonReferrable: false, referralTarget: 'rs_kabupaten',
        differentialDiagnosis: ['F32.2', 'F33.2']
    },
    {
        id: 'bipolar_manik',
        diagnosis: 'Gangguan Bipolar - Episode Manik',
        icd10: 'F31.1',
        skdi: '3A',
        category: 'Psychiatry',
        symptoms: ['Euforia berlebihan', 'Bicara cepat/banyak', 'Kurang tidur tapi energik', 'Impulsif', 'Grandiosity'],
        clue: "Episode manik: mood euforia/iritabel + energi meningkat + kurang tidur (merasa nggak perlu tidur!) + bicara pressured + grandiosity + perilaku impulsif (belanja gila-gilaan, seks bebas). Mood stabilizer (valproate/lithium) + rujuk psikiater.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Apa yang terjadi?', response: 'Istri saya nggak tidur 4 hari dok, tapi energinya luar biasa, ngomong terus, belanja online jutaan!', sentiment: 'denial', priority: 'essential' }],
            rps: [
                { id: 'q_sleep', text: 'Nggak tidur berapa hari?', response: '4 hari dok, katanya nggak perlu tidur, dia merasa punya kekuatan super.', sentiment: 'denial', priority: 'essential' },
                { id: 'q_grandiose', text: 'Ada keyakinan yang aneh?', response: 'Dia bilang dia dipilih jadi presiden, mau bikin perusahaan besar.', sentiment: 'confirmation' }
            ],
            rpd: [{ id: 'q_depression', text: 'Pernah depresi sebelumnya?', response: 'Iya dok, 2 tahun lalu pernah depresi berat sampai nggak bisa kerja.', sentiment: 'confirmation' }],
            rpk: [], sosial: []
        },
        essentialQuestions: ['q_main', 'q_sleep'],
        anamnesis: ["Nggak tidur 4 hari, energi berlebihan, belanja jutaan.", "Merasa punya kekuatan super, riwayat depresi berat sebelumnya."],
        physicalExamFindings: { general: "Penampilan berlebihan (dandan menor), hiperaktif.", vitals: "Normal", psych: "Afek ekspansif. Mood: 'Luar biasa baik!' Bicara: pressured, flight of ideas. Isi pikir: waham kebesaran. Tilikan: buruk (derajat 1). GAF: 30." },
        labs: {}, vitals: { temp: 36.7, bp: '130/80', hr: 90, rr: 18 },
        correctTreatment: ['haloperidol_5_im', 'diazepam_10_im'],
        correctProcedures: ['safety_assessment'],
        requiredEducation: ['psychiatric_emergency', 'mood_stabilizer_needed', 'chronic_relapsing', 'psychiatry_referral'],
        risk: 'high', nonReferrable: false, referralTarget: 'rs_kabupaten',
        differentialDiagnosis: ['F31.1', 'F30.1']
    },
    {
        id: 'intoksikasi_zat_psikoaktif',
        diagnosis: 'Intoksikasi Zat Psikoaktif',
        icd10: 'F19.0',
        skdi: '3B',
        category: 'Psychiatry',
        symptoms: ['Penurunan kesadaran', 'Pupil miosis/midriasis', 'Perilaku abnormal', 'Riwayat penggunaan zat'],
        clue: "Identifikasi zat: OPIOID (miosis pinpoint, RR rendah, somnolen → naloxone), AMFETAMIN (midriasis, agitasi, takikardia, hipertermia → benzodiazepin), ALKOHOL (ataksia, slurred speech → suportif). Stabilisasi ABC + antidotum spesifik + rujuk!",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Apa yang terjadi?', response: 'Teman saya nggak sadar dok, tadi pakai putaw.', sentiment: 'denial', priority: 'essential' }],
            rps: [
                { id: 'q_substance', text: 'Zat apa yang dipakai?', response: 'Heroin dok, disuntik.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_amount', text: 'Berapa banyak?', response: 'Nggak tau dok, tapi lebih banyak dari biasanya.', sentiment: 'denial' }
            ],
            rpd: [], rpk: [], sosial: [{ id: 'q_history', text: 'Sudah lama pakainya?', response: 'Sudah 3 tahun dok.', sentiment: 'confirmation' }]
        },
        essentialQuestions: ['q_main', 'q_substance'],
        anamnesis: ["Nggak sadar setelah pakai heroin suntik.", "Lebih banyak dari biasa, sudah 3 tahun pakai."],
        physicalExamFindings: { general: "Stupor, GCS E2V2M4=8.", vitals: "TD 90/60, N 60x, RR 6x, S 36°C, SpO2 85%", neuro: "Pupil: MIOSIS PINPOINT bilateral. Refleks menurun. Track marks (+) lengan bilateral." },
        labs: {}, vitals: { temp: 36, bp: '90/60', hr: 60, rr: 6 },
        correctTreatment: ['naloxone_04_iv', 'rl_500'],
        correctProcedures: ['airway_management', 'o2_mask_10lpm', 'iv_access', 'monitor_vital'],
        requiredEducation: ['overdose_risk', 'naloxone_may_repeat', 'rehabilitation_referral', 'harm_reduction'],
        risk: 'critical', nonReferrable: false, referralTarget: 'rs_kabupaten',
        differentialDiagnosis: ['F19.0', 'F11.0']
    }
];
