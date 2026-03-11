/**
 * @reflection
 * [IDENTITY]: neurology
 * [PURPOSE]: Medical cases for Neurology specialty.
 * [STATE]: Experimental
 * [LAST_UPDATE]: 2026-02-12
 */

export const NEUROLOGY_CASES = [
    {
        id: 'tension_headache',
        diagnosis: 'Tension-type Headache',
        icd10: 'G44.2',
        skdi: '4A',
        category: 'Neurology',
        symptoms: ['Nyeri kepala seperti diikat', 'Nyeri tekan otot leher', 'Tidak mual/muntah'],
        symptoms: ["Nyeri kepala bilateral","Seperti diikat","Tidak berdenyut","Tidak mual"],
        clue: "[EBM: IHS/ICHD-3] TTH — nyeri bilateral, pressing/tightening, intensitas ringan-sedang, tanpa mual/fotofobia. Beda migrain: unilateral + pulsating + mual.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [
                { id: 'q_main', text: 'Sakit kepalanya gimana?', response: 'Kepala saya sakit kayak diikat dok, pusing terus.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_onset', text: 'Sudah berapa lama?', response: 'Sudah 3 hari dok.', sentiment: 'confirmation', priority: 'essential' },
            ],
            rps: [
                { id: 'q_character', text: 'Sakitnya berdenyut atau kayak ditekan?', response: 'Kayak ditekan/diikat dok, nggak berdenyut.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_nausea', text: 'Ada mual atau silau cahaya?', response: 'Nggak ada dok.', sentiment: 'denial' },
                { id: 'q_location', text: 'Di sebelah mana?', response: 'Dua-duanya dok, kanan kiri sama.', sentiment: 'confirmation' },
            ],
            rpd: [
                { id: 'q_history', text: 'Sering sakit kepala?', response: 'Kalau capek sering dok.', sentiment: 'confirmation' },
            ],
            rpk: [],
            sosial: [
                { id: 'q_stress', text: 'Lagi banyak pikiran?', response: 'Iya dok, kerjaan numpuk.', sentiment: 'confirmation' },
            ],
        },
        essentialQuestions: ["q_main","q_onset","q_character"],
        anamnesis: ["Kepala rasanya berat dok, kayak diikat kencang.", "Sudah 2 hari nyut-nyutan, tapi nggak mual. Lagi banyak kerjaan di kantor."],
        physicalExamFindings: { general: "Tampak lelah.", vitals: "TD 125/80, N 84x, RR 18x, S 36.8°C", neuro: "Status lokalis: Nyeri tekan otot perikranial (+) minimal." },
        labs: {}, vitals: { temp: 36.8, bp: '125/80', hr: 84, rr: 18 },
        correctTreatment: ['paracetamol_500', 'diazepam_2'],
        correctProcedures: [],
        requiredEducation: ['stress_mgmt', 'sleep_hygiene'],
        risk: 'low', nonReferrable: true, referralExceptions: ['red_flags_headache'],
        differentialDiagnosis: ['G44.2', 'G43.9']
    },
    {
        id: 'vertigo_bppv',
        diagnosis: 'Vertigo (BPPV)',
        icd10: 'H81.1',
        skdi: '4A',
        category: 'Neurology',
        symptoms: ['Pusing berputar', 'Dipicu perubahan posisi kepala', 'Mual dan muntah'],
        symptoms: ["Pusing berputar","Dipicu perubahan posisi","Mual","Nistagmus"],
        clue: "[EBM: AAO-HNS 2017] BPPV — vertigo posisional <1 menit, dipicu perubahan posisi kepala. Dix-Hallpike (+). Terapi: Epley maneuver. BUKAN stroke!",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [
                { id: 'q_main', text: 'Pusingnya gimana?', response: 'Pusing berputar dok, kayak mau jatuh.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_trigger', text: 'Kapan pusingnya muncul?', response: 'Pas miring ke kanan atau tengadah.', sentiment: 'confirmation', priority: 'essential' },
            ],
            rps: [
                { id: 'q_duration', text: 'Berapa lama pusingnya?', response: 'Sebentar dok, kurang dari semenit, tapi sering kambuh.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_nausea', text: 'Mual?', response: 'Iya mual, sempat muntah 1x.', sentiment: 'confirmation' },
                { id: 'q_hearing', text: 'Pendengaran berubah?', response: 'Nggak dok, masih normal.', sentiment: 'denial' },
            ],
            rpd: [],
            rpk: [],
            sosial: [],
        },
        essentialQuestions: ["q_main","q_trigger","q_duration"],
        anamnesis: ["Pusing tujuh keliling dok, rasanya kayak diputar-putar.", "Kalau berubah posisi kepala langsung kumat, mual dan muntah. Sudah 1 hari begini."],
        physicalExamFindings: { general: "Tampak tidak nyaman, menunduk.", vitals: "TD 120/80, N 88x, RR 20x, S 36.7°C", neuro: "Dix-Hallpike test (+): nistagmus (+)." },
        labs: {}, vitals: { temp: 36.7, bp: '120/80', hr: 88, rr: 20 },
        correctTreatment: ['betahistine_6', 'dimenhydrinate_50'],
        correctProcedures: ['epley_maneuver'],
        requiredEducation: ['home_maneuver', 'avoid_sudden_movement'],
        risk: 'medium', nonReferrable: true, referralExceptions: ['central_vertigo', 'no_improvement'],
        differentialDiagnosis: ['H81.1', 'H81.4']
    },
    {
        id: 'migraine',
        diagnosis: 'Migraine',
        icd10: 'G43.9',
        skdi: '4A',
        category: 'Neurology',
        symptoms: ['Sakit kepala berdenyut', 'Sakit kepala sebelah', 'Fotofobia (silau)'],
        symptoms: ["Nyeri kepala unilateral","Berdenyut","Mual/muntah","Fotofobia"],
        clue: "[EBM: ICHD-3] Migrain tanpa aura — unilateral, pulsating, sedang-berat, diperburuk aktivitas fisik, +mual/fotofobia. Durasi 4-72 jam.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [
                { id: 'q_main', text: 'Sakit kepalanya gimana?', response: 'Kepala sebelah kiri berdenyut-denyut dok, sakit banget.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_duration', text: 'Sudah berapa lama?', response: 'Dari tadi pagi dok, makin lama makin sakit.', sentiment: 'confirmation', priority: 'essential' },
            ],
            rps: [
                { id: 'q_nausea', text: 'Ada mual?', response: 'Mual banget dok, muntah 2 kali.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_light', text: 'Silau sama cahaya?', response: 'Iya dok, mau di ruang gelap aja.', sentiment: 'confirmation' },
                { id: 'q_activity', text: 'Makin sakit kalau gerak?', response: 'Iya, jalan aja tambah nyut-nyutan.', sentiment: 'confirmation' },
            ],
            rpd: [
                { id: 'q_prev', text: 'Sering begini?', response: 'Sudah beberapa kali dok, tiap bulan.', sentiment: 'confirmation' },
            ],
            rpk: [
                { id: 'q_family', text: 'Keluarga ada migrain?', response: 'Ibu saya juga sering migrain.', sentiment: 'confirmation' },
            ],
            sosial: [
                { id: 'q_trigger', text: 'Ada pencetusnya?', response: 'Kurang tidur dok kemarin.', sentiment: 'confirmation' },
            ],
        },
        essentialQuestions: ["q_main","q_duration","q_nausea"],
        anamnesis: ["Sakit kepala sebelah dok, berdenyut-denyut.", "Mual dan muntah, rasanya silau kalau kena cahaya. Sudah kumat-kumatan sejak remaja."],
        physicalExamFindings: { general: "Tampak menahan nyeri.", vitals: "TD 130/80, N 80x, RR 18x, S 36.5°C", neuro: "Fungsi motorik/sensorik normal, meningeal sign (-)." },
        labs: {}, vitals: { temp: 36.5, bp: '130/80', hr: 80, rr: 18 },
        correctTreatment: ['sumatriptan_50', 'metoclopramide_10'],
        correctProcedures: [],
        requiredEducation: ['trigger_avoidance', 'dark_room_rest'],
        risk: 'medium', nonReferrable: true, referralExceptions: ['status_migrainosus'],
        differentialDiagnosis: ['G43.9', 'G44.2']
    },
    {
        id: 'kejang_demam',
        diagnosis: 'Kejang Demam',
        icd10: 'R56.0',
        skdi: '4A',
        category: 'Neurology',
        symptoms: ['Kejang kaku-kelojot', 'Demam tinggi (>38°C)', 'Mata mendelik'],
        symptoms: ["Kejang saat demam","Usia 6 bulan-5 tahun","Kejang tonik-klonik","Durasi <15 menit"],
        clue: "[EBM: AAP 2011] Kejang demam sederhana — usia 6bln-5thn, kejang <15 menit, tonik-klonik umum, tidak berulang 24 jam. Turunkan demam, singkirkan meningitis.",
        relevantLabs: ["Darah Lengkap"],
        anamnesisQuestions: {
            keluhan_utama: [
                { id: 'q_main', text: 'Kejangnya gimana bu?', response: 'Anak saya tiba-tiba kejang dok, badannya kaku terus tangan kaki kelojotan.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_duration_seizure', text: 'Berapa lama kejangnya?', response: 'Sekitar 3 menit dok.', sentiment: 'confirmation', priority: 'essential' },
            ],
            rps: [
                { id: 'q_fever', text: 'Sebelumnya demam?', response: 'Iya dok, demam tinggi dari tadi siang.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_after', text: 'Setelah kejang gimana?', response: 'Nangis terus tidur, sekarang sudah sadar.', sentiment: 'confirmation' },
                { id: 'q_focal', text: 'Kejangnya seluruh badan atau satu sisi?', response: 'Seluruh badan dok.', sentiment: 'confirmation' },
            ],
            rpd: [
                { id: 'q_prev_seizure', text: 'Pernah kejang sebelumnya?', response: 'Belum pernah dok.', sentiment: 'denial' },
            ],
            rpk: [
                { id: 'q_family_seizure', text: 'Keluarga ada riwayat kejang demam?', response: 'Kakaknya dulu juga pernah.', sentiment: 'confirmation' },
            ],
            sosial: [],
        },
        essentialQuestions: ["q_main","q_duration_seizure","q_fever"],
        anamnesis: ["Anak saya kejang dok, badannya kaku dan mata mendelik ke atas.", "Tadi badannya panas tinggi sekali, langsung kejang sebentar . Sekarang sudah sadar tapi lemes."],
        physicalExamFindings: { general: "Tampak lemas, post-ictal.", vitals: "TD - (pediatrik), N 110x, RR 24x, S 39.2°C", neuro: "Status neurologis saat ini normal, kaku kuduk (-)." },
        labs: { "Darah Lengkap": { result: "Leukosit 14.200", cost: 50000 } },
        vitals: { temp: 39.2, hr: 110, rr: 24 },
        correctTreatment: ['diazepam_supp_5', 'paracetamol_syr', 'ibuprofen_syr_100'],
        correctProcedures: [],
        requiredEducation: ['fever_reduction', 'seizure_first_aid'],
        risk: 'high', nonReferrable: true, referralExceptions: ['complex_febrile_seizure', 'recurrent'],
        differentialDiagnosis: ['R56.0', 'G00.9']
    },
    {
        id: 'migrain',
        diagnosis: 'Migrain (Ulang)',
        icd10: 'G43.9',
        skdi: '4A',
        category: 'Neurology',
        symptoms: ['Sakit kepala berdenyut', 'Silau jika kena cahaya', 'Mual dan muntah'],
        symptoms: ["Nyeri kepala unilateral berdenyut","Mual muntah","Fotofobia/fonofobia","Aura visual"],
        clue: "[EBM: ICHD-3] Migrain — unilateral pulsating, moderate-severe, aggravated by activity, +nausea/photo-phonophobia. Triptans jika NSAID gagal.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [
                { id: 'q_main', text: 'Sakit kepalanya gimana?', response: 'Sakit sebelah dok, kayak ditusuk-tusuk, berdenyut.', sentiment: 'confirmation', priority: 'essential' },
            ],
            rps: [
                { id: 'q_nausea', text: 'Mual?', response: 'Mual banget, muntah terus.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_aura', text: 'Sebelum sakit ada lihat cahaya/kilatan?', response: 'Kadang ada dok, lihat bintik-bintik.', sentiment: 'confirmation' },
            ],
            rpd: [
                { id: 'q_freq', text: 'Seberapa sering?', response: '2-3 kali sebulan dok.', sentiment: 'confirmation' },
            ],
            rpk: [],
            sosial: [],
        },
        essentialQuestions: ["q_main","q_nausea"],
        anamnesis: ["Kepala saya sakit sebelah dok, berdenyut-denyut.", "Sakitnya parah banget dok, sampai mual dan muntah. Kalau kena cahaya silau banget."],
        physicalExamFindings: { general: "Tampak sakit sedang.", vitals: "TD 125/80, N 88x, RR 18x, S 36.6°C", neuro: "Status neurologis normal, meningeal sign (-)." },
        labs: {}, vitals: { temp: 36.6, bp: '125/80', hr: 88, rr: 18 },
        correctTreatment: ['metoclopramide_10', 'paracetamol_500'],
        correctProcedures: [],
        requiredEducation: ['trigger_avoidance', 'med_compliance'],
        risk: 'medium', nonReferrable: true, referralExceptions: ['status_migrainosus'],
        differentialDiagnosis: ['G43.9', 'G44.2']
    },
    {
        id: 'tension_headache_chronic',
        diagnosis: 'Tension-type Headache (Chronic)',
        icd10: 'G44.2',
        skdi: '3A',
        category: 'Neurology',
        symptoms: ['Sakit kepala hampir tiap hari', 'Kepala seperti diikat kencang', 'Faktor psikologis (+)'],
        symptoms: ["Nyeri kepala >15 hari/bulan","Bilateral pressing","Intensitas ringan-sedang","Kronik >3 bulan"],
        clue: "[EBM: ICHD-3] CTTH — nyeri kepala ≥15 hari/bulan selama >3 bulan. Evaluasi medication overuse headache. Amitriptilin profilaksis.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [
                { id: 'q_main', text: 'Pusing terus ya?', response: 'Iya dok, hampir tiap hari kepala sakit, sudah berbulan-bulan.', sentiment: 'confirmation', priority: 'essential' },
            ],
            rps: [
                { id: 'q_frequency', text: 'Sebulan berapa hari sakitnya?', response: 'Hampir tiap hari dok, kadang sebulan penuh.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_meds', text: 'Sering minum obat sakit kepala?', response: 'Tiap hari minum paracetamol dok.', sentiment: 'confirmation', priority: 'essential' },
            ],
            rpd: [],
            rpk: [],
            sosial: [
                { id: 'q_stress', text: 'Ada masalah atau stres?', response: 'Banyak pikiran dok.', sentiment: 'confirmation' },
            ],
        },
        essentialQuestions: ["q_main","q_frequency","q_meds"],
        anamnesis: ["Kepala saya rasanya berat terus dok, kayak diikat kencang.", "Sudah hampir tiap hari nyutan dok, tapi nggak mual. Lagi banyak pikiran di rumah."],
        physicalExamFindings: { general: "Tampak cemas/lelah.", vitals: "TD 130/85, N 80x, RR 20x, S 36.8°C", neuro: "Fungsi motorik/sensorik normal, nyeri tekan otot pericranial (+)." },
        labs: {}, vitals: { temp: 36.8, bp: '130/85', hr: 80, rr: 20 },
        correctTreatment: ['amitriptyline_25', 'paracetamol_500'],
        correctProcedures: [],
        requiredEducation: ['stress_mgmt', 'lifestyle_mod'],
        risk: 'medium', nonReferrable: true, referralExceptions: ['red_flags_headache'],
        differentialDiagnosis: ['G44.2', 'G43.9']
    },
    {
        id: 'alzheimers_early',
        diagnosis: 'Demensia (Alzheimer Early)',
        icd10: 'F03.90',
        skdi: '3A',
        category: 'Neurology',
        symptoms: ['Sering lupa barang/kejadian', 'Disorientasi jalan', 'Emosi labil'],
        symptoms: ["Lupa baru","Disorientasi","Kesulitan bahasa","Perubahan perilaku"],
        clue: "[EBM: NIA-AA 2018] Early Alzheimer — gangguan memori episodik progresif >6 bulan. MMSE screening. Evaluasi reversible causes (B12, TSH, depresi).",
        relevantLabs: ["Darah Lengkap"],
        anamnesisQuestions: {
            keluhan_utama: [
                { id: 'q_main', text: 'Ibu/Bapak keluhannya apa?', response: 'Bapak saya pelupa banget dok, sering lupa nama cucu, lupa sudah makan.', sentiment: 'confirmation', priority: 'essential' },
            ],
            rps: [
                { id: 'q_progression', text: 'Makin parah?', response: 'Makin lama makin parah dok, sudah setahun.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_daily', text: 'Bisa aktivitas sendiri?', response: 'Sudah mulai nggak bisa masak sendiri dok.', sentiment: 'denial' },
            ],
            rpd: [],
            rpk: [
                { id: 'q_family', text: 'Keluarga ada yang pikun?', response: 'Neneknya dulu juga pikun.', sentiment: 'confirmation' },
            ],
            sosial: [],
        },
        essentialQuestions: ["q_main","q_progression"],
        anamnesis: ["Ibu saya sering lupa dok, naruh barang atau nanya hal yang sama terus.", "Kadang bingung kalau mau ke pasar, padahal sudah puluhan tahun lewat situ. Emosinya juga labil."],
        physicalExamFindings: { general: "Tampak bingung, kooperatif.", vitals: "TD 130/80, N 80x, RR 18x, S 36.5°C", neuro: "MMSE Score: 22/30 (Mild cognitive impairment)." },
        labs: {}, vitals: { temp: 36.5, bp: '130/80', hr: 80, rr: 18 },
        correctTreatment: ['donepezil_5'],
        correctProcedures: ['neuro_referral'],
        requiredEducation: ['caregiver_support', 'safety_at_home'],
        risk: 'medium', nonReferrable: true, referralExceptions: ['rapid_decline', 'behavioral_emergency'],
        differentialDiagnosis: ['F03', 'G30.9']
    },
    {
        id: 'bells_palsy',
        diagnosis: "Bell's Palsy",
        icd10: 'G51.0',
        skdi: '4A',
        category: 'Neurology',
        symptoms: ['Wajah perot mendadak', 'Mata tidak bisa menutup', 'Sudut mulut turun', 'Lipatan dahi hilang'],
        clue: "Paralisis fasialis perifer akut UNILATERAL. Dahi tidak bisa diangkat (beda dengan stroke: dahi masih bisa). Onset mendadak <72 jam. Kortikosteroid dini + pelindung mata!",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Ada apa ini pak/bu, wajahnya kenapa?', response: 'Wajah saya perot dok, tiba-tiba pas bangun tidur tadi pagi.', sentiment: 'neutral', priority: 'essential' }],
            rps: [
                { id: 'q_onset', text: 'Kapan mulai perotnya?', response: 'Baru tadi pagi dok, bangun tidur langsung begini.', sentiment: 'neutral', priority: 'essential' },
                { id: 'q_eye', text: 'Matanya bisa ditutup nggak?', response: 'Mata kanan nggak bisa menutup dok, perih kena angin.', sentiment: 'confirmation' },
                { id: 'q_ear', text: 'Ada nyeri di sekitar telinga?', response: 'Iya dok, belakang telinga kanan agak nyeri.', sentiment: 'confirmation' }
            ],
            rpd: [{ id: 'q_dm', text: 'Punya riwayat kencing manis atau darah tinggi?', response: 'Nggak ada dok.', sentiment: 'denial' }],
            rpk: [],
            sosial: [{ id: 'q_stress', text: 'Belakangan ini ada capek atau stres berat?', response: 'Iya dok, lagi banyak kerjaan, kurang tidur.', sentiment: 'neutral' }]
        },
        essentialQuestions: ['q_main', 'q_onset'],
        anamnesis: ["Wajah saya perot dok, tiba-tiba pas bangun tidur.", "Mata kanan nggak bisa menutup, mulut juga miring."],
        physicalExamFindings: { general: "Wajah asimetris.", vitals: "TD 120/80, N 80x, RR 18x, S 36.6°C", neuro: "N. VII perifer dekstra: Dahi tidak bisa diangkat (+), mata tidak bisa menutup (lagoftalmos +), sudut mulut turun. Tidak ada defisit N. kranial lain." },
        labs: {}, vitals: { temp: 36.6, bp: '120/80', hr: 80, rr: 18 },
        correctTreatment: ['prednisone_60', 'methylcobalamin_500', 'artificial_tears'],
        correctProcedures: ['eye_protection'],
        requiredEducation: ['facial_exercise', 'eye_care', 'prognosis_good'],
        risk: 'low', nonReferrable: true, referralExceptions: ['bilateral_palsy', 'no_improvement_4weeks', 'recurrent'],
        differentialDiagnosis: ['G51.0', 'I63.9']
    },
    // === SKDI 1-3 REFERRAL CASES ===
    {
        id: 'epilepsi',
        diagnosis: 'Epilepsi',
        icd10: 'G40.9',
        skdi: '3A',
        category: 'Neurology',
        symptoms: ['Kejang berulang', 'Kehilangan kesadaran', 'Lidah tergigit', 'Inkontinensia urin saat kejang'],
        clue: "Kejang tonik-klonik berulang (≥2 episode unprovoked). Onset mendadak, penurunan kesadaran, post-ictal confusion. Inisiasi AED (fenitoin/asam valproat) + rujuk Sp.S untuk EEG.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Apa yang terjadi pak/bu?', response: 'Anak saya kejang-kejang lagi dok, ini sudah yang ketiga kalinya.', sentiment: 'confirmation', priority: 'essential' }],
            rps: [
                { id: 'q_pattern', text: 'Kejangnya seperti apa?', response: 'Seluruh badan kaku terus kelojotan, matanya melotot ke atas.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_duration', text: 'Berapa lama kejangnya?', response: 'Sekitar 2-3 menit dok, terus setelahnya bingung tidur.', sentiment: 'neutral' }
            ],
            rpd: [{ id: 'q_prev', text: 'Sebelumnya pernah kejang?', response: 'Sudah 3 kali dok, pertama 6 bulan lalu.', sentiment: 'confirmation' }],
            rpk: [{ id: 'q_fam', text: 'Keluarga ada riwayat kejang?', response: 'Paman dari ayah ada epilepsi juga.', sentiment: 'confirmation' }],
            sosial: []
        },
        essentialQuestions: ['q_main', 'q_pattern'],
        anamnesis: ["Anak saya kejang-kejang lagi dok, sudah ketiga kalinya.", "Seluruh badan kaku terus kelojotan, setelahnya bingung."],
        physicalExamFindings: { general: "Post-ictal, somnolen.", vitals: "TD 120/80, N 96x, RR 20x, S 36.8°C", neuro: "Post-ictal: somnolen, lidah tergigit lateral (+). Defisit neurologis fokal (-). Refleks fisiologis normal." },
        labs: {}, vitals: { temp: 36.8, bp: '120/80', hr: 96, rr: 20 },
        correctTreatment: ['fenitoin_100', 'diazepam_5_prn'],
        correctProcedures: ['airway_protection', 'safety_position'],
        requiredEducation: ['medication_compliance', 'seizure_safety', 'driving_restriction', 'trigger_avoidance'],
        risk: 'high', nonReferrable: false, referralTarget: 'rs_kabupaten',
        differentialDiagnosis: ['G40.9', 'R56.8']
    },
    {
        id: 'stroke_infark',
        diagnosis: 'Infark Serebral (Stroke Iskemik)',
        icd10: 'I63.9',
        skdi: '3B',
        category: 'Neurology',
        symptoms: ['Kelemahan separuh badan mendadak', 'Bicara pelo', 'Wajah perot', 'Onset akut'],
        clue: "Defisit neurologis fokal AKUT: hemiparesis, afasia, facial droop. GOLDEN PERIOD <4.5jam untuk trombolisis! Stabilisasi ABC, jangan turunkan TD agresif, rujuk SEGERA!",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Apa yang terjadi?', response: 'Tangan kiri dan kaki kiri saya tiba-tiba lemas nggak bisa digerakkan dok.', sentiment: 'confirmation', priority: 'essential' }],
            rps: [
                { id: 'q_onset', text: 'Kapan mulainya?', response: 'Baru 2 jam yang lalu dok, tiba-tiba saat makan pagi.', sentiment: 'neutral', priority: 'essential' },
                { id: 'q_speech', text: 'Bicaranya berubah?', response: 'Iya dok, mulutnya miring, ngomong pelo.', sentiment: 'confirmation' }
            ],
            rpd: [{ id: 'q_risk', text: 'Punya darah tinggi atau kencing manis?', response: 'Darah tinggi sudah 10 tahun, minum obat nggak teratur.', sentiment: 'confirmation' }],
            rpk: [], sosial: [{ id: 'q_smoke', text: 'Merokok?', response: 'Iya dok, 1 bungkus sehari sudah 30 tahun.', sentiment: 'confirmation' }]
        },
        essentialQuestions: ['q_main', 'q_onset'],
        anamnesis: ["Tangan kiri dan kaki kiri lemas mendadak.", "Baru 2 jam lalu, mulut miring, bicara pelo."],
        physicalExamFindings: { general: "Composmentis, GCS 14 (E4M6V4).", vitals: "TD 180/100, N 88x, RR 20x, S 36.7°C", neuro: "Hemiparesis sinistra (motorik 2/5), facial droop dekstra, afasia motorik. Babinski (+) sinistra." },
        labs: { "GDS": { result: "145 mg/dL", cost: 15000 } },
        vitals: { temp: 36.7, bp: '180/100', hr: 88, rr: 20 },
        correctTreatment: ['rl_500', 'citicoline_500_iv'],
        correctProcedures: ['head_elevation_30', 'iv_access', 'monitor_vital', 'ngt_if_dysphagia'],
        requiredEducation: ['golden_period', 'do_not_lower_bp_aggressively', 'urgent_ct_scan'],
        risk: 'critical', nonReferrable: false, referralTarget: 'rs_kabupaten',
        differentialDiagnosis: ['I63.9', 'I61.9']
    },
    {
        id: 'meningitis_bakterial',
        diagnosis: 'Meningitis Bakterialis',
        icd10: 'G00.9',
        skdi: '3B',
        category: 'Neurology',
        symptoms: ['Demam tinggi', 'Kaku kuduk', 'Nyeri kepala hebat', 'Penurunan kesadaran'],
        clue: "Trias meningitis: demam + kaku kuduk + penurunan kesadaran. Kernig/Brudzinski (+). LP: DARURAT! Antibiotik empiris segera (ceftriaxone) sebelum rujuk. Jangan tunda!",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Apa keluhannya?', response: 'Demam tinggi 3 hari, kepala sakit banget, leher kaku nggak bisa nunduk.', sentiment: 'confirmation', priority: 'essential' }],
            rps: [
                { id: 'q_consciousness', text: 'Kesadarannya bagaimana?', response: 'Makin lama makin ngantuk, kadang bingung, nggak nyambung kalau diajak ngomong.', sentiment: 'denial', priority: 'essential' },
                { id: 'q_vomit', text: 'Ada muntah?', response: 'Iya dok, muntah menyembur beberapa kali.', sentiment: 'confirmation' }
            ],
            rpd: [{ id: 'q_infection', text: 'Sebelumnya ada infeksi telinga atau paru?', response: 'Sempat pilek batuk seminggu sebelumnya.', sentiment: 'confirmation' }],
            rpk: [], sosial: []
        },
        essentialQuestions: ['q_main', 'q_consciousness'],
        anamnesis: ["Demam tinggi 3 hari, kepala sakit, leher kaku.", "Makin ngantuk, bingung, muntah menyembur."],
        physicalExamFindings: { general: "Somnolen, GCS 12 (E3M5V4), tampak sakit berat.", vitals: "TD 130/80, N 110x, RR 24x, S 39.5°C", neuro: "Kaku kuduk (+), Kernig (+), Brudzinski (+). Pupil isokor, refleks cahaya (+/+). Defisit fokal (-)." },
        labs: { "Darah Lengkap": { result: "Leukosit 18.000, shift to left", cost: 50000 } },
        vitals: { temp: 39.5, bp: '130/80', hr: 110, rr: 24 },
        correctTreatment: ['ceftriaxone_2g_iv', 'dexamethasone_inj', 'paracetamol_infus'],
        correctProcedures: ['iv_access', 'monitor_vital', 'head_elevation_30'],
        requiredEducation: ['life_threatening', 'urgent_lp_at_hospital', 'contact_tracing'],
        risk: 'critical', nonReferrable: false, referralTarget: 'rs_kabupaten',
        differentialDiagnosis: ['G00.9', 'A87.9']
    },
    {
        id: 'status_epileptikus',
        diagnosis: 'Status Epileptikus',
        icd10: 'G41.9',
        skdi: '3B',
        category: 'Neurology',
        symptoms: ['Kejang terus-menerus >5 menit', 'Tidak sadar di antara kejang', 'Sianosis', 'Gagal napas'],
        clue: "Kejang berkelanjutan >5 menit ATAU kejang berulang tanpa recovery kesadaran. EMERGENCY! Diazepam IV/rektal → fenitoin loading. Airway protection! Rujuk ICU!",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Apa yang terjadi?', response: 'Kejang terus-terusan dok sudah 10 menit nggak berhenti!', sentiment: 'confirmation', priority: 'essential' }],
            rps: [
                { id: 'q_duration', text: 'Sudah berapa lama kejangnya?', response: 'Dari rumah sudah 15 menit dok, di jalan masih kejang.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_med', text: 'Minum obat anti-kejang rutin?', response: 'Iya tapi 3 hari ini habis, belum beli lagi.', sentiment: 'denial' }
            ],
            rpd: [{ id: 'q_epilepsy', text: 'Ada riwayat epilepsi?', response: 'Iya sudah 5 tahun minum fenitoin.', sentiment: 'neutral' }],
            rpk: [], sosial: []
        },
        essentialQuestions: ['q_main', 'q_duration'],
        anamnesis: ["Kejang terus-terusan 15 menit nggak berhenti!", "Obat anti-kejang habis 3 hari nggak minum."],
        physicalExamFindings: { general: "Kejang tonik-klonik generalisata, sianosis (+), GCS 3.", vitals: "TD 160/100, N 130x, RR 8x, S 38.5°C, SpO2 85%", neuro: "Kejang aktif, pupil dilatasi bilateral, refleks tidak dapat dinilai." },
        labs: {}, vitals: { temp: 38.5, bp: '160/100', hr: 130, rr: 8 },
        correctTreatment: ['diazepam_10_iv', 'fenitoin_loading_iv'],
        correctProcedures: ['airway_management', 'o2_mask', 'iv_access', 'monitor_vital', 'safety_position'],
        requiredEducation: ['life_threatening', 'icu_needed', 'medication_compliance'],
        risk: 'critical', nonReferrable: false, referralTarget: 'rs_kabupaten',
        differentialDiagnosis: ['G41.9', 'G40.9']
    },
    {
        id: 'carpal_tunnel',
        diagnosis: 'Carpal Tunnel Syndrome',
        icd10: 'G56.0',
        skdi: '3A',
        category: 'Neurology',
        symptoms: ['Kesemutan jari 1-3', 'Nyeri malam hari', 'Kelemahan genggaman', 'Night pain'],
        clue: "Kompresi n. medianus di terowongan karpal. Kesemutan/nyeri jari 1-3 dan setengah jari 4, memburuk malam hari. Tinel (+), Phalen (+). Wrist splint + NSAID + rujuk EMG.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Ada keluhan apa?', response: 'Tangan saya kesemutan terus dok, terutama jari-jari ini, sampai nggak bisa tidur.', sentiment: 'confirmation', priority: 'essential' }],
            rps: [
                { id: 'q_night', text: 'Lebih parah kapan?', response: 'Malam hari dok, sering kebangun karena kesemutan dan nyeri.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_grip', text: 'Genggamannya masih kuat?', response: 'Lemah dok, sering jatuhkan gelas.', sentiment: 'confirmation' }
            ],
            rpd: [], rpk: [],
            sosial: [{ id: 'q_work', text: 'Pekerjaannya apa?', response: 'Kasir dok, 8 jam sehari mengetik dan scan barang.', sentiment: 'confirmation' }]
        },
        essentialQuestions: ['q_main', 'q_night'],
        anamnesis: ["Tangan kesemutan terus, jari 1-3, parah malam hari.", "Genggaman lemah, sering jatuhkan barang."],
        physicalExamFindings: { general: "Tampak baik.", vitals: "TD 120/80, N 78x, RR 18x, S 36.5°C", neuro: "Tinel test (+) di pergelangan tangan kanan. Phalen test (+) setelah 30 detik. Atrofi tenar (+) ringan. Sensibilitas jari 1-3 menurun." },
        labs: {}, vitals: { temp: 36.5, bp: '120/80', hr: 78, rr: 18 },
        correctTreatment: ['ibuprofen_400', 'wrist_splint'],
        correctProcedures: [],
        requiredEducation: ['ergonomic_work', 'rest_breaks', 'wrist_splint_night', 'emg_referral'],
        risk: 'low', nonReferrable: false, referralTarget: 'rs_kabupaten',
        differentialDiagnosis: ['G56.0', 'M54.1']
    },
    {
        id: 'gbs',
        diagnosis: 'Guillain-Barré Syndrome',
        icd10: 'G61.0',
        skdi: '3B',
        category: 'Neurology',
        symptoms: ['Kelemahan ascending', 'Dimulai dari kaki naik ke atas', 'Refleks hilang', 'Riwayat infeksi 2 minggu sebelumnya'],
        clue: "Paralisis asendens akut pasca-infeksi: kelemahan dimulai kaki → naik ke atas. Refleks tendon HILANG (arefleksia). BAHAYA: bisa naik ke otot napas → gagal napas! Monitor RR ketat, rujuk SEGERA.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Ada apa ini pak/bu?', response: 'Kaki saya lemas nggak bisa jalan dok, sekarang merambat ke tangan juga.', sentiment: 'confirmation', priority: 'essential' }],
            rps: [
                { id: 'q_ascending', text: 'Kelemahan mulainya dari mana?', response: 'Dari kaki dulu 3 hari lalu, sekarang naik ke paha, tangan juga mulai lemas.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_breathing', text: 'Napasnya masih enak?', response: 'Agak susah napas dok akhir-akhir ini.', sentiment: 'confirmation' }
            ],
            rpd: [{ id: 'q_infection', text: 'Sebelumnya ada sakit?', response: '2 minggu lalu sempat diare berat 3 hari.', sentiment: 'confirmation' }],
            rpk: [], sosial: []
        },
        essentialQuestions: ['q_main', 'q_ascending'],
        anamnesis: ["Kaki lemas, sekarang merambat ke tangan.", "Dimulai 3 hari lalu, 2 minggu sebelumnya diare berat."],
        physicalExamFindings: { general: "Tampak lemah, tidak bisa berdiri.", vitals: "TD 110/70, N 90x, RR 24x, S 36.7°C", neuro: "Tetraparesis: motorik ekstremitas bawah 2/5, atas 3/5. Refleks patella dan Achilles HILANG bilateral (arefleksia). Sensibilitas: glove-and-stocking pattern." },
        labs: {}, vitals: { temp: 36.7, bp: '110/70', hr: 90, rr: 24 },
        correctTreatment: ['rl_500'],
        correctProcedures: ['monitor_respiratory_rate', 'iv_access', 'airway_preparation'],
        requiredEducation: ['respiratory_failure_risk', 'icu_needed', 'ivig_at_hospital'],
        risk: 'critical', nonReferrable: false, referralTarget: 'rs_provinsi',
        differentialDiagnosis: ['G61.0', 'G82.0']
    },
    {
        id: 'neuropati_dm',
        diagnosis: 'Neuropati Perifer Diabetikum',
        icd10: 'G63.2',
        skdi: '3A',
        category: 'Neurology',
        symptoms: ['Kesemutan kaki', 'Baal seperti pakai kaos kaki', 'Nyeri terbakar malam hari', 'Riwayat DM lama'],
        clue: "Neuropati sensoris distal simetris: 'stocking distribution' (baal, kesemutan, nyeri terbakar di kaki bilateral). DM tidak terkontrol. Monofilamen test abnormal → risiko ulkus! Gabapentin + kontrol GDS.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Apa keluhannya pak/bu?', response: 'Kaki saya baal terus dok, kayak pakai kaos kaki, kadang nyeri terbakar malam-malam.', sentiment: 'confirmation', priority: 'essential' }],
            rps: [
                { id: 'q_bilateral', text: 'Kedua kaki ya?', response: 'Iya dok, kanan kiri sama, dari ujung kaki naik ke betis.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_injury', text: 'Pernah ada luka kaki nggak kerasa?', response: 'Pernah dok, keinjak paku nggak terasa, baru tahu setelah berdarah.', sentiment: 'confirmation' }
            ],
            rpd: [{ id: 'q_dm', text: 'Kencing manisnya sudah berapa lama?', response: '10 tahun dok, gulanya sering tinggi.', sentiment: 'confirmation' }],
            rpk: [], sosial: []
        },
        essentialQuestions: ['q_main', 'q_bilateral'],
        anamnesis: ["Kaki baal kayak pakai kaos kaki, nyeri terbakar malam.", "DM 10 tahun, gula nggak terkontrol."],
        physicalExamFindings: { general: "Tampak baik.", vitals: "TD 140/90, N 80x, RR 18x, S 36.6°C", neuro: "Sensibilitas: Monofilamen test (-) di kedua kaki. Vibrasi tuning fork menurun distal. Refleks Achilles bilateral menurun. Motorik 5/5. Pedis: kulit kering, callus (+)." },
        labs: { "GDS": { result: "250 mg/dL", cost: 15000 }, "HbA1c": { result: "9.5%", cost: 150000 } },
        vitals: { temp: 36.6, bp: '140/90', hr: 80, rr: 18 },
        correctTreatment: ['gabapentin_300', 'metformin_500'],
        correctProcedures: ['monofilamen_test', 'foot_examination'],
        requiredEducation: ['foot_care_diabetic', 'blood_sugar_control', 'proper_footwear', 'daily_foot_inspection'],
        risk: 'medium', nonReferrable: false, referralTarget: 'rs_kabupaten',
        differentialDiagnosis: ['G63.2', 'G62.9']
    },
    {
        id: 'hnp_lumbal',
        diagnosis: 'Hernia Nucleus Pulposus (HNP) Lumbal',
        icd10: 'M51.1',
        skdi: '3A',
        category: 'Neurology',
        symptoms: ['Nyeri punggung bawah menjalar ke kaki', 'Kesemutan kaki', 'Laseque positif', 'Kelemahan kaki'],
        clue: "Nyeri punggung bawah radikuler: menjalar ke bokong-paha-betis mengikuti dermatom (L4-S1). SLR/Laseque (+) <70°. RED FLAGS: saddle anesthesia, inkontinensia urin → cauda equina syndrome → DARURAT!",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Apa keluhan utamanya?', response: 'Pinggang sakit banget dok, nyerinya tembus sampai ke kaki kanan, nggak bisa jalan.', sentiment: 'confirmation', priority: 'essential' }],
            rps: [
                { id: 'q_radicular', text: 'Nyerinya menjalar ke mana?', response: 'Dari pinggang tembus bokong, paha belakang, sampai ke betis dan telapak kaki kanan.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_tingling', text: 'Ada kesemutan atau baal?', response: 'Iya kesemutan di kaki kanan, telapak kaki agak baal.', sentiment: 'confirmation' }
            ],
            rpd: [{ id: 'q_heavy', text: 'Pernah angkat berat sebelumnya?', response: 'Iya dok, seminggu lalu angkat karung beras.', sentiment: 'confirmation' }],
            rpk: [], sosial: [{ id: 'q_work', text: 'Pekerjaannya apa?', response: 'Kuli bangunan dok, sering angkat-angkat berat.', sentiment: 'confirmation' }]
        },
        essentialQuestions: ['q_main', 'q_radicular'],
        anamnesis: ["Pinggang sakit tembus ke kaki kanan, nggak bisa jalan.", "Habis angkat karung beras seminggu lalu."],
        physicalExamFindings: { general: "Tampak kesakitan, posisi antalgik.", vitals: "TD 130/80, N 84x, RR 18x, S 36.5°C", neuro: "SLR/Laseque (+) kanan pada 40°. Cross SLR (+). Motorik dorsofleksi kaki kanan 4/5. Refleks Achilles kanan menurun. Sensibilitas dermatom L5-S1 kanan menurun." },
        labs: {}, vitals: { temp: 36.5, bp: '130/80', hr: 84, rr: 18 },
        correctTreatment: ['ketorolac_30_im', 'gabapentin_300', 'bed_rest'],
        correctProcedures: [],
        requiredEducation: ['avoid_heavy_lifting', 'proper_posture', 'mri_referral', 'red_flag_cauda_equina'],
        risk: 'medium', nonReferrable: false, referralTarget: 'rs_kabupaten',
        differentialDiagnosis: ['M51.1', 'M54.5']
    }
];
