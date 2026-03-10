/**
 * @reflection
 * [IDENTITY]: sti_urinary_infectious
 * [PURPOSE]: STI and Urinary infectious cases (UTI, Gonorrhea, Syphilis, etc.).
 * [STATE]: Stable
 * [ANCHOR]: sti_urinary_infectious
 */
export const sti_urinary_infectious = [
    {
        id: 'uti_uncomplicated',
        diagnosis: 'Infeksi Saluran Kemih (ISK) Bawah',
        icd10: 'N39.0',
        skdi: '4A',
        category: 'Urinary',
        symptoms: ['Nyeri saat kencing', 'Anyang-anyangan', 'Nyeri perut bawah', 'Urin keruh'],
        clue: "Disuria + frekuensi + urgensi. Nyeri tekan suprapubik. Tidak ada demam tinggi/nyeri pinggang (beda dengan pielonefritis).",
        relevantLabs: ['Urinalisis'],
        anamnesisQuestions: {
            keluhan_utama: [
                {
                    id: 'q_main',
                    text: 'Keluhannya apa bu?',
                    response: 'Kalau pipis perih dok, terus rasanya pengen pipis terus tapi keluarnya sedikit.', sentiment: 'confirmation',
                    variations: {
                        low_education: 'Anyang-anyangan dok, pipis sakit.',
                        high_education: 'Disuria dan frekuensi meningkat dok.',
                        skeptical: 'Susah pipis.'
                    },
                    priority: 'essential'
                }
            ],
            rps: [
                { id: 'q_fever', text: 'Ada demam?', response: 'Nggak ada dok.', sentiment: 'denial' },
                { id: 'q_backpain', text: 'Pinggang sakit?', response: 'Nggak dok, cuma perut bawah aja nggak enak.', sentiment: 'denial' },
                { id: 'q_color', text: 'Warnanya keruh/berdarah?', response: 'Agak keruh dok baunya menyengat.', sentiment: 'confirmation' }
            ],
            rpd: [
                { id: 'q_history', text: 'Sering begini?', response: 'Baru pertama kali dok.', sentiment: 'confirmation' }
            ],
            rpk: [],
            sosial: [
                { id: 'q_water', text: 'Kurang minum?', response: 'Iya dok, saya jarang minum air putih.', sentiment: 'neutral' },
                { id: 'q_hold', text: 'Sering nahan pipis?', response: 'Sering dok kalau lagi kerja.', sentiment: 'neutral' }
            ]
        },
        essentialQuestions: ['q_main', 'q_color', 'q_backpain'],
        anamnesis: ["Kalau pipis perih dok, terus rasanya pengen pipis terus tapi keluarnya sedikit.", "Urin keruh, perut bawah nyeri. Sering nahan pipis."],
        physicalExamFindings: {
            general: "Tampak sakit ringan, compos mentis.",
            vitals: "TD 120/80, N 88x, RR 18x, S 37.0°C",
            abdomen: "Nyeri tekan suprapubik (+). Nyeri ketok CVA (-).",
            genital: "Tidak diperiksa (jika tidak ada indikasi keputihan)."
        },
        labs: {
            "Urinalisis": { result: "Leukosit 10-15/LPB, Nitrit (+), Bakteri (+)", cost: 30000 }
        },
        vitals: { temp: 37.0, bp: '120/80', hr: 88, rr: 18 },
        correctTreatment: ['ciprofloxacin_500', 'paracetamol_500', 'ciprofloxacin_500'],
        correctProcedures: [],
        requiredEducation: ['fluid_intake', 'dont_hold_urine', 'perineal_hygiene'],
        risk: 'low',
        nonReferrable: true,
        referralExceptions: ['recurrent', 'comorbidity', 'pregnancy'],
        differentialDiagnosis: ['N34.1', 'N76.0']
    },
    {
        id: 'pyelonephritis',
        diagnosis: 'Pielonefritis Akut',
        icd10: 'N10',
        skdi: '4A',
        category: 'Urinary',
        symptoms: ['Demam tinggi', 'Nyeri pinggang', 'Nyeri ketok CVA', 'Mual muntah'],
        clue: "ISK atas. Demam tinggi + nyeri kostovertebral (CVA tenderness). Urinalisis: leukosituria, bakteriuria. Lebih berat dari sistitis.",
        relevantLabs: ['Urinalisis', 'Kultur Urin'],
        anamnesisQuestions: {
            keluhan_utama: [
                {
                    id: 'q_main',
                    text: 'Keluhannya apa?',
                    response: 'Demam tinggi dok, pinggang sakit banget.', sentiment: 'confirmation',
                    variations: {
                        low_education: 'Panas tinggi dok, boyok lara banget.',
                        high_education: 'Febris tinggi disertai nyeri costovertebral unilateral.',
                        skeptical: 'Demam, pinggang sakit.'
                    },
                    priority: 'essential'
                }
            ],
            rps: [
                { id: 'q_urinary', text: 'Kencing gimana?', response: 'Anyang-anyangan dok, perih.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_nausea', text: 'Mual muntah?', response: 'Iya dok, mual terus.', sentiment: 'confirmation' },
                { id: 'q_fever', text: 'Demam berapa?', response: 'Sampai 39 dok, menggigil.', sentiment: 'confirmation' }
            ],
            rpd: [{ id: 'q_isk', text: 'Sering ISK?', response: 'Dulu pernah anyang-anyangan tapi nggak berobat.', sentiment: 'denial' }],
            rpk: [],
            sosial: [{ id: 'q_fluid', text: 'Minum cukup?', response: 'Jarang minum dok.', sentiment: 'neutral' }]
        },
        essentialQuestions: ['q_main', 'q_urinary'],
        anamnesis: ["Demam tinggi dan nyeri pinggang dok, kencing juga perih.", "Badan saya panas dan sakit di pinggang dok, dulu pernah infeksi kencing."],
        physicalExamFindings: {
            general: "Tampak sakit sedang, febris.",
            vitals: "TD 110/70, N 100x, RR 20x, S 39.0°C",
            abdomen: "Datar, supel, nyeri tekan suprapubik (+). Nyeri ketok CVA kanan (+)."
        },
        labs: {
            "Urinalisis": { result: "Leukosit penuh/LPB, nitrit (+), bakteri (+)", cost: 30000 }
        },
        vitals: { temp: 39.0, bp: '110/70', hr: 100, rr: 20 },
        correctTreatment: ['ciprofloxacin_500', 'paracetamol_500'],
        correctProcedures: [],
        requiredEducation: ['fluid_intake', 'complete_antibiotic', 'voiding_hygiene', 'routine_control'],
        risk: 'medium',
        nonReferrable: true,
        referralExceptions: ['emergency', 'no_improvement', 'comorbidity'],
        differentialDiagnosis: ['N30.0', 'N39.0']
    },
    {
        id: 'gonorrhea',
        diagnosis: 'Gonore',
        icd10: 'A54.9',
        skdi: '4A',
        category: 'STI',
        symptoms: ['Kencing nanah', 'Nyeri kencing', 'Keputihan berbau', 'Duh genital'],
        clue: "Duh tubuh purulen dari uretra (pria) atau vagina (wanita). Riwayat seksual risiko tinggi. Diplokokus gram negatif.",
        relevantLabs: ['Gram Stain Sekret'],
        anamnesisQuestions: {
            keluhan_utama: [
                {
                    id: 'q_main',
                    text: 'Keluhannya apa?',
                    response: 'Keluar nanah dari kencing dok, perih.', sentiment: 'confirmation',
                    variations: {
                        low_education: 'Pipis keluar nanah dok, pedes perih.',
                        high_education: 'Ada discharge purulent dari uretra dan disuria.',
                        skeptical: 'Keluar nanah.'
                    },
                    priority: 'essential'
                }
            ],
            rps: [
                { id: 'q_onset', text: 'Sudah berapa lama?', response: 'Baru 3 hari ini dok.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_discharge', text: 'Cairannya warna apa?', response: 'Kuning kehijauan dok, kental.', sentiment: 'confirmation' }
            ],
            rpd: [{ id: 'q_sti', text: 'Pernah penyakit kelamin sebelumnya?', response: 'Belum pernah dok.', sentiment: 'denial' }],
            rpk: [],
            sosial: [
                { id: 'q_partner', text: 'Hubungan dengan siapa?', response: 'Dengan pacar dok, tanpa kondom.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_multiple', text: 'Lebih dari 1 partner?', response: 'Iya dok.', sentiment: 'confirmation' }
            ]
        },
        essentialQuestions: ['q_main', 'q_onset', 'q_partner'],
        anamnesis: ["Ada cairan kuning keluar dari kemaluan dok, sudah 3 hari.", "Kelamin saya keluar nanah dok, perih waktu kencing."],
        physicalExamFindings: {
            general: "Tampak malu, tidak nyaman.",
            vitals: "TD 120/80, N 80x, RR 18x, S 37.0°C",
            genital: "Duh purulen dari OUE (+), eritema meatus (+). Tidak ada ulkus/lesi."
        },
        labs: {
            "Gram Stain Sekret": { result: "Diplokokus gram negatif intraseluler (+)", cost: 50000 }
        },
        vitals: { temp: 37.0, bp: '120/80', hr: 80, rr: 18 },
        correctTreatment: ['ceftriaxone_inj', 'azithromycin_1g'],
        correctProcedures: [],
        requiredEducation: ['safe_sex', 'partner_notification', 'abstinence_during_treatment', 'followup_test'],
        risk: 'medium',
        nonReferrable: true,
        referralExceptions: ['no_improvement', 'comorbidity'],
        differentialDiagnosis: ['A56.0', 'N34.1']
    },
    {
        id: 'vaginitis',
        diagnosis: 'Vaginitis',
        icd10: 'N76.0',
        skdi: '4A',
        category: 'Reproductive',
        symptoms: ['Keputihan abnormal', 'Gatal vagina', 'Bau tidak sedap', 'Nyeri saat berhubungan'],
        clue: "Keputihan abnormal dengan gatal/bau/nyeri. Bisa infeksi Candida, Trichomonas, atau bakteri.",
        relevantLabs: ['Gram Stain Sekret Vagina'],
        anamnesisQuestions: {
            keluhan_utama: [
                {
                    id: 'q_main',
                    text: 'Keputihannya gimana bu?',
                    response: 'Banyak banget dok, gatal sama bau nggak enak.', sentiment: 'confirmation',
                    variations: {
                        low_education: 'Keputihan banyak banget dok, gatel, bau amis.',
                        high_education: 'Vaginal discharge berlebihan dengan pruritus dan malodor.',
                        skeptical: 'Keputihan banyak.'
                    },
                    priority: 'essential'
                }
            ],
            rps: [
                { id: 'q_color', text: 'Warnanya?', response: 'Putih kekuningan dok, kadang kehijauan.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_smell', text: 'Baunya gimana?', response: 'Bau amis dok, apalagi setelah hubungan.', sentiment: 'confirmation' }
            ],
            rpd: [{ id: 'q_prev', text: 'Pernah keputihan begini sebelumnya?', response: 'Pernah dok, sudah beberapa kali.', sentiment: 'neutral' }],
            rpk: [],
            sosial: [
                { id: 'q_hygiene', text: 'Bilas vagina dengan apa?', response: 'Sabun biasa dok, kadang pakai douche.', sentiment: 'neutral' },
                { id: 'q_partner', text: 'Suami ada keluhan?', response: 'Nggak ada dok.', sentiment: 'denial' }
            ]
        },
        essentialQuestions: ['q_main', 'q_color'],
        anamnesis: ["Keputihan banyak, gatal, bau.", "Keputihan dan gatal di bawah dok, sering pakai sabun pembersih kewanitaan."],
        physicalExamFindings: {
            general: "Tampak tidak nyaman.",
            vitals: "TD 110/70, N 78x, RR 18x, S 36.8°C",
            genital: "Vulva eritema ringan. Discharge putih kekuningan, berbau (whiff test +). pH vagina >4.5."
        },
        labs: {},
        vitals: { temp: 36.8, bp: '110/70', hr: 78, rr: 18 },
        correctTreatment: ['metronidazole_500', 'clotrimazole_vaginal'],
        correctProcedures: [],
        requiredEducation: ['avoid_douching', 'wear_cotton', 'proper_hygiene', 'partner_treatment'],
        risk: 'low',
        nonReferrable: true,
        referralExceptions: ['no_improvement', 'recurrent'],
        differentialDiagnosis: ['N77.1', 'A59.0']
    },
    {
        id: 'syphilis_12',
        diagnosis: 'Sifilis Stadium 1 dan 2',
        icd10: 'A51.9',
        skdi: '4A',
        category: 'STI',
        symptoms: ['Luka tidak nyeri di genital', 'Ruam telapak tangan/kaki', 'Demam', 'Kelenjar membesar'],
        clue: "Stadium 1: chancre (ulkus keras tidak nyeri). Stadium 2: ruam makulopapular palmoplantar, condylomata lata. VDRL/RPR (+).",
        relevantLabs: ['VDRL'],
        anamnesisQuestions: {
            keluhan_utama: [
                { id: 'q_main', text: 'Ada luka di mana?', response: 'Ada luka di kemaluan saya dok, nggak sakit tapi nggak sembuh.', sentiment: 'confirmation', priority: 'essential' }
            ],
            rps: [
                { id: 'q_rash', text: 'Ada ruam?', response: 'Iya, di telapak tangan juga ada bintik merah.', sentiment: 'confirmation', priority: 'essential' }
            ],
            rpd: [],
            rpk: [],
            sosial: [{ id: 'q_partner', text: 'Riwayat hubungan?', response: 'Dengan PSK, tanpa kondom.', sentiment: 'confirmation', priority: 'essential' }]
        },
        essentialQuestions: ['q_main', 'q_rash', 'q_partner'],
        anamnesis: ["Ada luka di kemaluan saya dok, nggak sakit tapi nggak sembuh.", "Kelamin saya ada lukanya dok, terus muncul bintik merah juga di badan."],
        physicalExamFindings: { general: "Tampak baik.", vitals: "TD 120/80, N 78x, RR 18x, S 37.0°C", genital: "Ulkus tunggal berbatas tegas, dasar bersih, indolen di glans penis. KGB inguinal bilateral teraba.", skin: "Makula eritematosa di palmar bilateral (roseola syphilitica)." },
        labs: { "VDRL": { result: "VDRL reaktif, titer 1:32", cost: 50000 } },
        vitals: { temp: 37.0, bp: '120/80', hr: 78, rr: 18 },
        correctTreatment: ['benzathine_penicillin_inj'],
        correctProcedures: [],
        requiredEducation: ['safe_sex', 'partner_notification', 'followup_test'],
        risk: 'medium',
        nonReferrable: true,
        referralExceptions: ['no_improvement', 'comorbidity'],
        differentialDiagnosis: ['A54.9', 'A60.0']
    }
];
