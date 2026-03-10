/**
 * @reflection
 * [IDENTITY]: dermatology_infectious
 * [PURPOSE]: Dermatology infectious cases (Tinea, Herpes, Impetigo, etc.).
 * [STATE]: Stable
 * [ANCHOR]: dermatology_infectious
 */
export const dermatology_infectious = [
    {
        id: 'impetigo',
        diagnosis: 'Impetigo',
        icd10: 'L01.0',
        skdi: '4A',
        category: 'Dermatology',
        symptoms: ['Luka keropeng kuning', 'Lesi merah basah', 'Gatal ringan', 'Mudah menular'],
        clue: "Infeksi kulit superfisial, sering pada anak. Krusta 'honey-colored'. Sangat menular.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [
                { id: 'q_main', text: 'Kulit anaknya kenapa bu?', response: 'Muka anak saya ada luka keropeng-keropeng kuning dok, makin banyak.', sentiment: 'confirmation', priority: 'essential' }
            ],
            rps: [
                { id: 'q_itch', text: 'Gatal?', response: 'Gatal sedikit dok.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_spread', text: 'Sangat mudah menyebar ya?', response: 'Iya dok, dari satu sekarang jadi banyak (menular).', sentiment: 'confirmation', priority: 'essential' }
            ],
            rpd: [{ id: 'q_allergy', text: 'Ada alergi?', response: 'Nggak ada dok.', sentiment: 'denial' }],
            rpk: [{ id: 'q_fam', text: 'Saudara ada yang kena?', response: 'Adiknya juga mulai muncul di muka.', sentiment: 'confirmation' }],
            sosial: []
        },
        essentialQuestions: ['q_main', 'q_spread'],
        anamnesis: ["Muka anak saya ada luka keropeng-keropeng kuning dok, makin banyak.", "Ada koreng di muka anak saya dok, kayaknya nular ke adiknya juga."],
        physicalExamFindings: {
            general: "Tampak baik.",
            vitals: "TD 100/70, N 80x, RR 18x, S 36.8°C",
            skin: "Krusta kuning kecoklatan (honey-colored) multipel di perioral dan nasal. Erosi basah di bawah krusta."
        },
        labs: {},
        vitals: { temp: 36.8, bp: '100/70', hr: 80, rr: 18 },
        correctTreatment: ['mupirocin_oint', 'cefalexin_500'],
        correctProcedures: [],
        requiredEducation: ['hand_hygiene', 'dont_touch_wound', 'family_screening'],
        risk: 'low',
        nonReferrable: true,
        referralExceptions: ['no_improvement', 'comorbidity'],
        differentialDiagnosis: ['B00.9', 'L02']
    },
    {
        id: 'herpes_zoster',
        diagnosis: 'Herpes Zoster',
        icd10: 'B02.9',
        skdi: '4A',
        category: 'Dermatology',
        symptoms: ['Nyeri seperti terbakar', 'Vesikel berkelompok', 'Mengikuti dermatom', 'Satu sisi tubuh'],
        clue: "Vesikel berkelompok mengikuti dermatom unilateral. Nyeri neuralgia. Reaktivasi VZV.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [
                { id: 'q_main', text: 'Ada bintil di mana?', response: 'Ada bintil-bintil berair di pinggang kiri dok, perih banget kayak terbakar.', sentiment: 'confirmation', priority: 'essential' }
            ],
            rps: [
                { id: 'q_pain', text: 'Nyerinya bagaimana?', response: 'Nyeri seperti ditusuk-tusuk dan terbakar.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_before', text: 'Sebelum muncul?', response: 'Gatal dan pegal dulu 2 hari.', sentiment: 'confirmation' }
            ],
            rpd: [{ id: 'q_varicella', text: 'Pernah cacar air?', response: 'Dulu waktu kecil pernah.', sentiment: 'neutral' }],
            rpk: [{ id: 'q_fam', text: 'Keluarga?', response: 'Nggak ada dok.', sentiment: 'denial' }],
            sosial: []
        },
        essentialQuestions: ['q_main', 'q_pain'],
        anamnesis: ["Ada bintil-bintil berair di pinggang kiri dok, perih banget kayak terbakar.", "Kulit saya melepuh di satu sisi badan dok, nyeri dan panas."],
        physicalExamFindings: {
            general: "Tampak kesakitan.",
            vitals: "TD 130/85, N 88x, RR 18x, S 37.2°C",
            skin: "Vesikel berkelompok pada dasar eritematosa, sesuai dermatom T10-T11 sinistra, tidak melewati garis tengah."
        },
        labs: {},
        vitals: { temp: 37.2, bp: '130/85', hr: 88, rr: 18 },
        correctTreatment: ['acyclovir_800', 'paracetamol_500', 'gabapentin_100'],
        correctProcedures: [],
        requiredEducation: ['avoid_scratching', 'wound_care', 'med_compliance'],
        risk: 'medium',
        nonReferrable: true,
        referralExceptions: ['emergency', 'comorbidity'],
        differentialDiagnosis: ['B00.9', 'L01.0']
    },
    {
        id: 'pityriasis_versicolor',
        diagnosis: 'Pitiriasis Versikolor (Panu)',
        icd10: 'B36.0',
        skdi: '4A',
        category: 'Dermatology',
        symptoms: ['Bercak putih/coklat', 'Sisik halus', 'Di badan/punggung', 'Gatal ringan'],
        clue: "Makula hipopigmentasi dengan skuama halus, biasanya di punggung/dada. Infeksi Malassezia furfur.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [
                {
                    id: 'q_main',
                    text: 'Bercaknya sudah berapa lama?',
                    response: 'Sudah berbulan-bulan dok, makin melebar.', sentiment: 'confirmation',
                    variations: {
                        low_education: 'Wes suwe dok, tambah lebar panune.',
                        high_education: 'Beberapa bulan, lesinya progresif meluas.',
                        skeptical: 'Lama.'
                    },
                    priority: 'essential'
                }
            ],
            rps: [
                { id: 'q_itch', text: 'Gatal?', response: 'Sedikit gatal kalau keringatan.', sentiment: 'confirmation' },
                { id: 'q_location', text: 'Di bagian mana?', response: 'Di punggung dan dada dok.', sentiment: 'confirmation', priority: 'essential' }
            ],
            rpd: [{ id: 'q_history', text: 'Pernah panu sebelumnya?', response: 'Dulu pernah juga, sembuh terus kambuh lagi.', sentiment: 'confirmation' }],
            rpk: [{ id: 'q_fam', text: 'Keluarga ada?', response: 'Nggak ada dok.', sentiment: 'denial' }],
            sosial: [{ id: 'q_sweat', text: 'Sering berkeringat?', response: 'Iya dok, kerja di pabrik panas.', sentiment: 'confirmation' }]
        },
        essentialQuestions: ['q_main', 'q_location'],
        anamnesis: ["Ada bercak-bercak putih di punggung sama dada dok, sudah berbulan-bulan.", "Kulit saya belang-belang putih dok, agak gatal sedikit. Sering keringatan."],
        physicalExamFindings: {
            general: "Tampak baik.",
            vitals: "TD 120/80, N 78x, RR 18x, S 36.7°C",
            skin: "Makula hipopigmentasi multipel dengan skuama halus (fine scale) di regio thoracalis anterior dan posterior. KOH test positif."
        },
        labs: {},
        vitals: { temp: 36.7, bp: '120/80', hr: 78, rr: 18 },
        correctTreatment: ['ketoconazole_shampoo', 'miconazole_cream'],
        correctProcedures: [],
        requiredEducation: ['keep_skin_dry', 'wear_loose_clothes', 'antifungal_maintenance'],
        risk: 'low',
        nonReferrable: true,
        referralExceptions: ['no_improvement'],
        differentialDiagnosis: ['B36.1', 'L30.0']
    },
    {
        id: 'dermatitis_kontak',
        diagnosis: 'Dermatitis Kontak Iritan',
        icd10: 'L24',
        skdi: '4A',
        category: 'Dermatology',
        symptoms: ['Ruam terlokalisir', 'Gatal', 'Riwayat kontak iritan', 'Eritema berbatas tegas'],
        clue: "Reaksi inflamasi kulit akibat kontak zat iritan (deterjen, semen, bahan kimia). Batas tegas sesuai area kontak. Hindari iritan + steroid topikal.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Keluhannya?', response: 'Tangan merah gatal dok, perih.', sentiment: 'confirmation', priority: 'essential' }],
            rps: [{ id: 'q_irritant', text: 'Kontak dengan apa?', response: 'Sering cuci piring tanpa sarung tangan, pakai sabun keras.', sentiment: 'confirmation', priority: 'essential' }],
            rpd: [], rpk: [], sosial: [{ id: 'q_work', text: 'Pekerjaan?', response: 'Ibu rumah tangga, sering cuci baju.', sentiment: 'neutral' }]
        },
        essentialQuestions: ['q_main', 'q_irritant'],
        anamnesis: ["Tangan saya merah dan gatal dok, kena sabun keras terus.", "Kulit tangan saya kasar dan perih dok, tiap hari pegang deterjen tanpa sarung tangan."],
        physicalExamFindings: { general: "Tampak baik.", vitals: "TD 120/80, N 78x, RR 18x, S 36.7°C", skin: "Tangan: eritema berbatas tegas di dorsum manus bilateral, vesikel (+), fisura (+), skuama. Sesuai area kontak." },
        labs: {}, vitals: { temp: 36.7, bp: '120/80', hr: 78, rr: 18 },
        correctTreatment: ['hydrocortisone_cream', 'cetirizine_10'],
        correctProcedures: [],
        requiredEducation: ['avoid_irritant', 'wear_gloves', 'moisturizer_routine'],
        risk: 'low',
        nonReferrable: true,
        referralExceptions: ['no_improvement'],
        differentialDiagnosis: ['L23', 'L20']
    },
    {
        id: 'paronychia_acute',
        diagnosis: 'Paronikia Akut',
        icd10: 'L03.0',
        skdi: '4A',
        category: 'Skin',
        symptoms: ['Nyeri dipinggir kuku', 'Bengkak merah', 'Ada nanah (pus)', 'Berdenyut'],
        clue: "Infeksi lipat kuku (nail fold). Jika ada fluktuasi (nanah) → harus insisi/drainase atau roserplasty (ekstraksi kuku partially).",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Kenapa jarinya?', response: 'Sakit banget dok di pinggir kuku, bengkak merah dan ada nanahnya.', sentiment: 'confirmation', priority: 'essential' }],
            rps: [{ id: 'q_trauma', text: 'Pernah kejepit atau potong kuku kependekan?', response: 'Iya dok, kemarin abis potong kuku agak dalem.', sentiment: 'confirmation' }],
            rpd: [], rpk: [], sosial: []
        },
        essentialQuestions: ['q_main'],
        anamnesis: ["Pinggir kuku saya bengkak merah dan bernanah dok, sakit berdenyut.", "Jempol kaki saya cantengan dok, mau pake sepatu sakit banget."],
        physicalExamFindings: { general: "Tampak baik.", vitals: "Dalam batas normal.", skin: "Digiti I pedis: Edema, hiperemis, nyeri tekan (+), fluktuasi (+) pada paronikhium." },
        labs: {}, vitals: { temp: 37.0, bp: '120/80', hr: 80, rr: 18 },
        correctTreatment: ['cloxacillin_500', 'paracetamol_500', 'mupirocin_ointment'],
        correctProcedures: ['roserplasty', 'incision_drainage'],
        requiredEducation: ['proper_nail_care', 'dont_wear_tight_shoes', 'keep_foot_dry'],
        risk: 'low',
        nonReferrable: true,
        referralExceptions: [],
        differentialDiagnosis: ['L02.0', 'B35.1']
    },
    {
        id: 'herpes_simplex',
        diagnosis: 'Herpes Simpleks',
        icd10: 'B00.9',
        skdi: '4A',
        category: 'Dermatology',
        symptoms: ['Vesikel bergerombol', 'Nyeri', 'Gatal', 'Demam'],
        clue: "Vesikel bergerombol di atas dasar eritema, nyeri. HSV-1 (orolabial) atau HSV-2 (genital). Kambuh saat imunitas turun.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [
                {
                    id: 'q_main',
                    text: 'Lukanya gimana?',
                    response: 'Lenting-lenting kecil bergerombol dok, perih.', sentiment: 'confirmation',
                    variations: {
                        low_education: 'Bintil-bintil cilik dok, lara pedes.',
                        high_education: 'Ada vesikel berkelompok dengan dasar eritematous, sangat nyeri.',
                        skeptical: 'Lenting perih.'
                    },
                    priority: 'essential'
                }
            ],
            rps: [
                { id: 'q_location', text: 'Di mana?', response: 'Di bibir dok.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_prodrome', text: 'Awalnya gimana?', response: 'Awalnya gatal kesemutan, terus jadi lenting.', sentiment: 'confirmation' },
                { id: 'q_fever', text: 'Demam?', response: 'Agak hangat dok.', sentiment: 'confirmation' }
            ],
            rpd: [{ id: 'q_recurrent', text: 'Sering kambuh?', response: 'Iya dok, kalau capek atau kena matahari sering muncul.', sentiment: 'confirmation' }],
            rpk: [],
            sosial: [{ id: 'q_stress', text: 'Lagi stres?', response: 'Iya dok, lagi banyak kerjaan.', sentiment: 'confirmation' }]
        },
        essentialQuestions: ['q_main', 'q_location', 'q_recurrent'],
        anamnesis: ["Bibir saya melepuh bergerombol dok, nyeri dan gatal.", "Ada luka berair di bibir dok, sering kambuh kalau capek atau stres."],
        physicalExamFindings: {
            general: "Tampak baik.",
            vitals: "TD 120/80, N 78x, RR 18x, S 37.2°C",
            skin: "Vesikel bergerombol multipel diameter 2-3 mm di regio labialis, dasar eritematous. Sebagian sudah erosi dengan krusta."
        },
        labs: {},
        vitals: { temp: 37.2, bp: '120/80', hr: 78, rr: 18 },
        correctTreatment: ['acyclovir_400', 'paracetamol_500'],
        correctProcedures: [],
        requiredEducation: ['avoid_trigger', 'dont_touch_lesion', 'hand_hygiene', 'avoid_kissing'],
        risk: 'low',
        nonReferrable: true,
        referralExceptions: ['no_improvement', 'comorbidity'],
        differentialDiagnosis: ['B02.9', 'K12.0']
    },
    {
        id: 'verruca_vulgaris',
        diagnosis: 'Veruka Vulgaris (Kutil)',
        icd10: 'B07.9',
        skdi: '4A',
        category: 'Dermatology',
        symptoms: ['Benjolan kasar di kulit', 'Permukaan tidak rata', 'Tidak nyeri', 'Bisa di tangan/kaki'],
        clue: "Papul berbatas tegas dengan permukaan verukosa (kasar). HPV. Dapat hilang spontan. Cryotherapy/elektrokauterisasi.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [
                { id: 'q_main', text: 'Ada benjolan di mana Pak/Bu?', response: 'Tangan saya ada benjolan-benjolan kasar dok, makin banyak.', sentiment: 'confirmation', priority: 'essential' }
            ],
            rps: [
                { id: 'q_location', text: 'Di mana saja?', response: 'Di jari tangan dok, sudah 5-6 buah.', sentiment: 'confirmation' },
                { id: 'q_pain', text: 'Sakit?', response: 'Nggak sakit dok, tapi jelek.', sentiment: 'confirmation' }
            ],
            rpd: [{ id: 'q_history', text: 'Pernah sebelumnya?', response: 'Belum pernah dok.', sentiment: 'denial' }],
            rpk: [], sosial: []
        },
        essentialQuestions: ['q_main'],
        anamnesis: ["Tangan saya ada benjolan-benjolan kasar dok, makin banyak.", "Ada kutil di tangan saya dok, nggak sakit tapi makin nambah."],
        physicalExamFindings: { general: "Tampak baik.", vitals: "TD 120/80, N 78x, RR 18x, S 36.7°C", skin: "Papul verukosa multipel diameter 3-8 mm di dorsum manus bilateral, permukaan kasar, black dots (+)." },
        labs: {}, vitals: { temp: 36.7, bp: '120/80', hr: 78, rr: 18 },
        correctTreatment: ['salicylic_acid_plaster'],
        correctProcedures: ['cryotherapy'],
        requiredEducation: ['avoid_autoinoculation', 'hand_hygiene'],
        risk: 'low',
        nonReferrable: true,
        referralExceptions: ['no_improvement'],
        differentialDiagnosis: ['B07.0', 'B08.1']
    },
    {
        id: 'molluscum',
        diagnosis: 'Moluskum Kontagiosum',
        icd10: 'B08.1',
        skdi: '4A',
        category: 'Dermatology',
        symptoms: ['Benjolan kecil berumbilasi', 'Seperti mutiara', 'Tidak nyeri', 'Bisa menyebar'],
        clue: "Papul dome-shaped dengan central umbilication (delle). Poxvirus. Anak-anak bisa self-limiting 6-12 bulan.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [
                { id: 'q_main', text: 'Bintilnya kenapa bu?', response: 'Ada bintil-bintil kecil di kulit anak saya dok, makin lama makin banyak.', sentiment: 'neutral', priority: 'essential' }
            ],
            rps: [
                { id: 'q_spread', text: 'Makin banyak?', response: 'Iya dok, dari satu jadi banyak.', sentiment: 'confirmation' }
            ],
            rpd: [], rpk: [], sosial: []
        },
        essentialQuestions: ['q_main'],
        anamnesis: ["Ada bintil-bintil kecil di kulit anak saya dok, makin lama makin banyak.", "Bintil-bintil di kulit anak saya dok, kayak mutiara kecil, nggak sakit tapi nyebar."],
        physicalExamFindings: { general: "Tampak baik.", vitals: "TD 120/80, N 78x, RR 18x, S 36.7°C", skin: "Papul dome-shaped multipel (10+) diameter 2-5 mm, flesh-colored, central umbilication (+) di badan." },
        labs: {}, vitals: { temp: 36.7, bp: '120/80', hr: 78, rr: 18 },
        correctTreatment: ['betamethasone_cream'],
        correctProcedures: ['curettage', 'cryotherapy'],
        requiredEducation: ['avoid_sharing_towels', 'dont_scratch'],
        risk: 'low',
        nonReferrable: true,
        referralExceptions: ['no_improvement'],
        differentialDiagnosis: ['B07.9', 'L72.1']
    },
    {
        id: 'erythrasma',
        diagnosis: 'Eritrasma',
        icd10: 'L08.1',
        skdi: '4A',
        category: 'Dermatology',
        symptoms: ['Bercak coklat kemerahan', 'Di lipatan', 'Gatal ringan', 'Batas tegas'],
        clue: "Patch coklat-kemerahan well-demarcated di intertriginous area. Corynebacterium minutissimum. Wood lamp: coral-red fluorescence.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [
                { id: 'q_main', text: 'Gatalnya di mana?', response: 'Selangkangan saya gatal dok, ada bercak coklat kemerahan.', sentiment: 'confirmation', priority: 'essential' }
            ],
            rps: [{ id: 'q_itch', text: 'Gatal?', response: 'Agak gatal kalau berkeringat.', sentiment: 'confirmation' }],
            rpd: [], rpk: [], sosial: [{ id: 'q_sweat', text: 'Sering berkeringat?', response: 'Iya dok, kerja outdoor.', sentiment: 'neutral' }]
        },
        essentialQuestions: ['q_main'],
        anamnesis: ["Selangkangan saya gatal dok, ada bercak coklat kemerahan.", "Gatal di lipatan paha dok, apalagi kalau keringatan."],
        physicalExamFindings: { general: "Tampak baik.", vitals: "TD 120/80, N 78x, RR 18x, S 36.7°C", skin: "Patch eritematosa-coklat well-demarcated di inguinal bilateral. Skuama halus (+). Wood lamp: coral-red fluorescence (+)." },
        labs: {}, vitals: { temp: 36.7, bp: '120/80', hr: 78, rr: 18 },
        correctTreatment: ['erythromycin_cream', 'miconazole_cream'],
        correctProcedures: [],
        requiredEducation: ['keep_skin_dry', 'wear_loose_clothes'],
        risk: 'low',
        nonReferrable: true,
        referralExceptions: ['no_improvement'],
        differentialDiagnosis: ['B35.6', 'B36.0']
    },
    {
        id: 'erysipelas',
        diagnosis: 'Erisipelas',
        icd10: 'A46',
        skdi: '4A',
        category: 'Dermatology',
        symptoms: ['Kulit merah terang', 'Bengkak', 'Batas tegas', 'Demam'],
        clue: "Infeksi dermis superfisial oleh Streptococcus. Eritema terang well-demarcated, raised edge. Sering di wajah/tungkai bawah.",
        relevantLabs: ['Darah Lengkap'],
        anamnesisQuestions: {
            keluhan_utama: [
                { id: 'q_main', text: 'Kulitnya kenapa Pak?', response: 'Tungkai merah bengkak, terasa panas dan demam.', sentiment: 'confirmation', priority: 'essential' }
            ],
            rps: [
                { id: 'q_fever', text: 'Demam?', response: 'Iya dok, menggigil.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_wound', text: 'Ada luka sebelumnya?', response: 'Iya, luka kecil di kaki.', sentiment: 'confirmation' }
            ],
            rpd: [{ id: 'q_dm', text: 'Kencing manis?', response: 'Nggak ada dok.', sentiment: 'denial' }],
            rpk: [], sosial: []
        },
        essentialQuestions: ['q_main', 'q_fever'],
        anamnesis: ["Tungkai merah bengkak, demam.", "Ada luka kecil sebagai port d'entrée."],
        physicalExamFindings: { general: "Tampak sakit sedang, febris.", vitals: "TD 120/80, N 96x, RR 20x, S 38.5°C", skin: "Plak eritematosa terang well-demarcated, raised edge, warm, tender di cruris dextra. Edema (+). Tidak ada fluktuasi." },
        labs: { "Darah Lengkap": { result: "Leukositosis 15.000, shift to the left", cost: 50000 } },
        vitals: { temp: 38.5, bp: '120/80', hr: 96, rr: 20 },
        correctTreatment: ['amoxicillin_500', 'paracetamol_500'],
        correctProcedures: [],
        requiredEducation: ['leg_elevation', 'wound_care', 'skin_hygiene'],
        risk: 'medium',
        nonReferrable: true,
        referralExceptions: ['no_improvement', 'comorbidity'],
        differentialDiagnosis: ['L03.1', 'A46']
    },
    {
        id: 'scrofuloderma',
        diagnosis: 'Skrofuloderma',
        icd10: 'A18.4',
        skdi: '4A',
        category: 'Dermatology',
        symptoms: ['Benjolan yang pecah', 'Fistula kulit', 'Kelenjar membesar', 'Lama sembuh'],
        clue: "TB kulit: nodus subkutan yang pecah membentuk ulkus/fistula, sering di leher (dari KGB). OAT regimen standar.",
        relevantLabs: ['BTA Sputum', 'Rontgen Thorax'],
        anamnesisQuestions: {
            keluhan_utama: [
                { id: 'q_main', text: 'Benjolannya kenapa?', response: 'Benjolan di leher saya pecah dok, keluar nanahnya.', sentiment: 'confirmation', priority: 'essential' }
            ],
            rps: [
                { id: 'q_duration', text: 'Sudah berapa lama?', response: 'Berbulan-bulan dok.', sentiment: 'confirmation' },
                { id: 'q_cough', text: 'Batuk lama?', response: 'Iya, batuk sudah 3 bulan.', sentiment: 'confirmation' }
            ],
            rpd: [{ id: 'q_tb_contact', text: 'Kontak TB?', response: 'Tetangga pernah TB.', sentiment: 'neutral' }],
            rpk: [], sosial: []
        },
        essentialQuestions: ['q_main', 'q_cough'],
        anamnesis: ["Benjolan di leher saya pecah dok, keluar nanahnya.", "Leher saya ada bengkak yang pecah-pecah dok, keluar cairan. Saya batuk lama juga."],
        physicalExamFindings: { general: "Tampak kurus, pucat.", vitals: "TD 110/70, N 86x, RR 20x, S 37.5°C", skin: "Nodus subkutan pecah di regio colli dextra, fistula (+), sekret serous, scar irregular. KGB teraba." },
        labs: { "BTA Sputum": { result: "BTA (+) 1", cost: 30000 } },
        vitals: { temp: 37.5, bp: '110/70', hr: 86, rr: 20 },
        correctTreatment: ['oat_kat1'],
        correctProcedures: [],
        requiredEducation: ['oat_compliance', 'nutrition', 'contact_screening'],
        risk: 'medium',
        nonReferrable: true,
        referralExceptions: ['no_improvement', 'comorbidity'],
        differentialDiagnosis: ['A15', 'L02.1']
    },
    {
        id: 'tinea_capitis',
        diagnosis: 'Tinea Kapitis',
        icd10: 'B35.0',
        skdi: '4A',
        category: 'Dermatology',
        symptoms: ['Rambut rontok melingkar', 'Kulit kepala bersisik', 'Gatal', 'Titik hitam di scalp'],
        clue: "Alopecia patch di scalp, skuama, kadang kerion. Dermatofita. Perlu terapi oral (topikal tidak cukup di scalp).",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Keluhannya apa?', response: 'Rambut anak rontok melingkar dok, kulit kepalanya sisikan.', sentiment: 'neutral', priority: 'essential' }],
            rps: [{ id: 'q_itch', text: 'Gatal?', response: 'Gatal dok.', sentiment: 'confirmation' }],
            rpd: [], rpk: [{ id: 'q_contact', text: 'Ada teman yang sama?', response: 'Iya dok, teman sekolahnya.', sentiment: 'neutral' }], sosial: []
        },
        essentialQuestions: ['q_main'],
        anamnesis: ["Rambut anak saya rontok di satu tempat dok, botak bulat.", "Kepala anak saya ada yang botak dok, temennya juga ada yang sama."],
        physicalExamFindings: { general: "Anak tampak baik.", vitals: "TD -, N 90x, RR 20x, S 36.7°C", skin: "Patch alopecia diameter 3 cm di vertex, skuama keputihan, broken hair (black dots). KOH (+) hifa." },
        labs: {}, vitals: { temp: 36.7, bp: '-', hr: 90, rr: 20 },
        correctTreatment: ['griseofulvin_500'],
        correctProcedures: [],
        requiredEducation: ['dont_share_comb', 'scalp_hygiene', 'finish_medication'],
        risk: 'low',
        nonReferrable: true,
        referralExceptions: ['no_improvement'],
        differentialDiagnosis: ['L21', 'L63.9']
    },
    {
        id: 'tinea_cruris',
        diagnosis: 'Tinea Kruris',
        icd10: 'B35.6',
        skdi: '4A',
        category: 'Dermatology',
        symptoms: ['Ruam merah di selangkangan', 'Gatal', 'Batas tegas', 'Tepi aktif'],
        clue: "Plak eritematosa annular dengan central clearing dan active border di inguinal. Dermatofita. KOH (+).",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Gatalnya di mana?', response: 'Di selangkangan dok, merah-merah melingkar.', sentiment: 'confirmation', priority: 'essential' }],
            rps: [{ id: 'q_spread', text: 'Makin melebar?', response: 'Iya dok.', sentiment: 'confirmation' }],
            rpd: [], rpk: [], sosial: [{ id: 'q_sweat', text: 'Sering berkeringat?', response: 'Iya dok.', sentiment: 'confirmation' }]
        },
        essentialQuestions: ['q_main'],
        anamnesis: ["Ruam annular di inguinal, gatal.", "Kaki saya gatal dan kulit mengelupas dok, sering berkeringat dan pakai sepatu terus."],
        physicalExamFindings: { general: "Tampak baik.", vitals: "TD 120/80, N 78x, RR 18x, S 36.7°C", skin: "Plak eritematosa annular bilateral di inguinal, tepi aktif (vesikel, papul), central clearing. KOH (+)." },
        labs: {}, vitals: { temp: 36.7, bp: '120/80', hr: 78, rr: 18 },
        correctTreatment: ['miconazole_cream', 'ketoconazole_cream'],
        correctProcedures: [],
        requiredEducation: ['keep_skin_dry', 'wear_loose_clothes', 'dont_share_towels'],
        risk: 'low',
        nonReferrable: true,
        referralExceptions: ['no_improvement'],
        differentialDiagnosis: ['L08.1', 'L30.0']
    },
    {
        id: 'tinea_pedis',
        diagnosis: 'Tinea Pedis',
        icd10: 'B35.3',
        skdi: '4A',
        category: 'Dermatology',
        symptoms: ['Gatal di sela jari kaki', 'Kulit mengelupas', 'Maserasi', 'Bau kaki'],
        clue: "Maserasi dan skuama di interdigital kaki, terutama sela jari ke-4/5. Athlete's foot. Dermatofita.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Keluhannya?', response: 'Sela jari kaki gatal dok, ngelupas, bau.', sentiment: 'confirmation', priority: 'essential' }],
            rps: [{ id: 'q_shoes', text: 'Sering pakai sepatu tertutup?', response: 'Iya dok, tiap hari.', sentiment: 'confirmation' }],
            rpd: [], rpk: [], sosial: []
        },
        essentialQuestions: ['q_main'],
        anamnesis: ["Sela jari kaki saya gatal lembab dok, kulit mengelupas.", "Kaki saya gatal banget dok di sela-sela jarinya, sering pakai sepatu tertutup sih."],
        physicalExamFindings: { general: "Tampak baik.", vitals: "TD 120/80, N 78x, RR 18x, S 36.7°C", skin: "Maserasi, skuama, eritema di interdigital pedis IV-V bilateral. Bau (+). KOH (+)." },
        labs: {}, vitals: { temp: 36.7, bp: '120/80', hr: 78, rr: 18 },
        correctTreatment: ['miconazole_cream'],
        correctProcedures: [],
        requiredEducation: ['keep_feet_dry', 'wear_sandals', 'cotton_socks'],
        risk: 'low',
        nonReferrable: true,
        referralExceptions: ['no_improvement'],
        differentialDiagnosis: ['L30.4', 'B35.6']
    },
    {
        id: 'tinea_unguium',
        diagnosis: 'Tinea Unguium (Onikomikosis)',
        icd10: 'B35.1',
        skdi: '4A',
        category: 'Dermatology',
        symptoms: ['Kuku berubah warna', 'Kuku menebal', 'Kuku rapuh', 'Debris subungual'],
        clue: "Kuku distrofik: menebal, warna kuning-coklat, subungual debris. Distal-lateral paling sering. Terapi oral antifungal lama.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Kukunya kenapa?', response: 'Kuku kaki tebal dok, kuning, rapuh.', sentiment: 'confirmation', priority: 'essential' }],
            rps: [{ id: 'q_duration', text: 'Sudah berapa lama?', response: 'Berbulan-bulan dok.', sentiment: 'confirmation' }],
            rpd: [], rpk: [], sosial: []
        },
        essentialQuestions: ['q_main'],
        anamnesis: ["Kuku saya menebal dan berubah warna dok, sudah berbulan-bulan.", "Kuku kaki saya rusak dok, tebal dan kuning. Sudah lama begini."],
        physicalExamFindings: { general: "Tampak baik.", vitals: "TD 120/80, N 78x, RR 18x, S 36.7°C", skin: "Onikolisis, subungual hiperkeratosis, perubahan warna kuning-coklat di hallux bilateral. KOH (+)." },
        labs: {}, vitals: { temp: 36.7, bp: '120/80', hr: 78, rr: 18 },
        correctTreatment: ['terbinafine_250'],
        correctProcedures: [],
        requiredEducation: ['finish_medication_long', 'keep_feet_dry', 'proper_nail_care'],
        risk: 'low',
        nonReferrable: true,
        referralExceptions: ['no_improvement'],
        differentialDiagnosis: ['L60.3', 'L60.0']
    },
    {
        id: 'tinea_manus',
        diagnosis: 'Tinea Manus',
        icd10: 'B35.2',
        skdi: '4A',
        category: 'Dermatology',
        symptoms: ['Gatal di telapak tangan', 'Kulit mengelupas', 'Bersisik', 'Unilateral'],
        clue: "Sering unilateral (two feet-one hand syndrome). Skuama difus di palmar atau vesikel di dorsum manus.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Tangan kenapa?', response: 'Telapak tangan kiri mengelupas dok, gatal.', sentiment: 'confirmation', priority: 'essential' }],
            rps: [
                { id: 'q_pedis', text: 'Kaki sela jari gatal juga?', response: 'Iya dok, kaki sudah lama gatal dan bersisik.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_itch', text: 'Gatal memberat saat berkeringat?', response: 'Iya dok, kalau gerah makin gatal.', sentiment: 'confirmation' }
            ],
            rpd: [{ id: 'q_history', text: 'Pernah begini?', response: 'Pernah dulu dok.', sentiment: 'neutral' }],
            rpk: [],
            sosial: [{ id: 'q_hobby', text: 'Sering main air atau tanah?', response: 'Sering berkebun dok.', sentiment: 'confirmation' }]
        },
        essentialQuestions: ['q_main'],
        anamnesis: ["Telapak tangan saya gatal dan kulit mengelupas dok.", "Tangan saya satu gatal dok, kulitnya kering mengelupas."],
        physicalExamFindings: { general: "Tampak baik.", vitals: "TD 120/80, N 78x, RR 18x, S 36.7°C", skin: "Skuama difus di palmar sinistra, fisura (+). KOH (+). Pedis: tinea pedis bilateral." },
        labs: {}, vitals: { temp: 36.7, bp: '120/80', hr: 78, rr: 18 },
        correctTreatment: ['miconazole_cream'],
        correctProcedures: [],
        requiredEducation: ['hand_hygiene', 'keep_skin_dry'],
        risk: 'low',
        nonReferrable: true,
        referralExceptions: ['no_improvement'],
        differentialDiagnosis: ['L24', 'L30.1']
    },
    {
        id: 'tinea_facialis',
        diagnosis: 'Tinea Fasialis',
        icd10: 'B35.8',
        skdi: '4A',
        category: 'Dermatology',
        symptoms: ['Ruam merah di wajah', 'Batas tegas melingkar', 'Gatal', 'Skuama'],
        clue: "Plak eritematosa annular di wajah, central clearing. Sering misdiagnosis sebagai lupus/dermatitis.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Wajahnya kenapa?', response: 'Merah melingkar dok, gatal.', sentiment: 'confirmation', priority: 'essential' }],
            rps: [
                { id: 'q_pet', text: 'Ada pelihara kucing/anjing?', response: 'Ada kucing sering saya gendong.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_spread', text: 'Makin melebar?', response: 'Iya, awalnya kecil sekarang makin besar.', sentiment: 'confirmation' }
            ],
            rpd: [{ id: 'q_history', text: 'Sering gatal di tempat lain?', response: 'Nggak ada dok.', sentiment: 'denial' }],
            rpk: [],
            sosial: []
        },
        essentialQuestions: ['q_main'],
        anamnesis: ["Ada lingkaran merah gatal di wajah saya dok.", "Muka saya ada bercak bentuk bulat gatal dok, tepinya merah."],
        physicalExamFindings: { general: "Tampak baik.", vitals: "TD 120/80, N 78x, RR 18x, S 36.7°C", skin: "Plak eritematosa annular di regio malaris sinistra, tepi aktif, central clearing. KOH (+)." },
        labs: {}, vitals: { temp: 36.7, bp: '120/80', hr: 78, rr: 18 },
        correctTreatment: ['miconazole_cream'],
        correctProcedures: [],
        requiredEducation: ['face_hygiene', 'finish_medication'],
        risk: 'low',
        nonReferrable: true,
        referralExceptions: ['no_improvement'],
        differentialDiagnosis: ['L20', 'L93.0']
    },
    {
        id: 'tinea_barbae',
        diagnosis: 'Tinea Barbae',
        icd10: 'B35.0',
        skdi: '4A',
        category: 'Dermatology',
        symptoms: ['Gatal di jenggot', 'Kulit merah', 'Folikulitis', 'Rambut mudah dicabut'],
        clue: "Infeksi jamur di area berjenggot. Papul-pustul folikuler, kadang kerion. Rambut mudah tercabut.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Keluhannya?', response: 'Daerah jenggot merah, gatal, rambut rontok.', sentiment: 'confirmation', priority: 'essential' }],
            rps: [
                { id: 'q_shave', text: 'Sering pakai pisau cukur bergantian?', response: 'Nggak sih dok, pakai sendiri.', sentiment: 'denial', priority: 'essential' },
                { id: 'q_pet', text: 'Kontak dengan hewan ternak?', response: 'Saya sering kasih makan kambing di kandang.', sentiment: 'neutral' }
            ],
            rpd: [{ id: 'q_history', text: 'Dulu pernah?', response: 'Baru ini dok.', sentiment: 'confirmation' }],
            rpk: [],
            sosial: []
        },
        essentialQuestions: ['q_main'],
        anamnesis: ["Daerah jenggot saya merah dan gatal dok, rambutnya gampang tercabut.", "Kulit di dagu saya gatal-gatal dok, kayak infeksi di daerah kumis dan jenggot."],
        physicalExamFindings: { general: "Tampak baik.", vitals: "TD 120/80, N 78x, RR 18x, S 36.7°C", skin: "Eritema, papul folikuler, pustul di regio barbae. Rambut mudah tercabut. KOH (+)." },
        labs: {}, vitals: { temp: 36.7, bp: '120/80', hr: 78, rr: 18 },
        correctTreatment: ['griseofulvin_500'],
        correctProcedures: [],
        requiredEducation: ['dont_share_razor', 'finish_medication'],
        risk: 'low',
        nonReferrable: true,
        referralExceptions: ['no_improvement'],
        differentialDiagnosis: ['L73.9', 'L01.0']
    },
    {
        id: 'candidiasis_mucocutan',
        diagnosis: 'Kandidiasis Mukokutan Ringan',
        icd10: 'B37.2',
        skdi: '4A',
        category: 'Dermatology',
        symptoms: ['Ruam merah di lipatan', 'Gatal', 'Lesi satelit', 'Maserasi'],
        clue: "Eritema merah terang di lipatan kulit dengan satellite lesions (papul-pustul di tepi). Candida. Sering di obese/DM.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Keluhannya?', response: 'Di bawah payudara merah-merah gatal dok.', sentiment: 'confirmation', priority: 'essential' }],
            rps: [{ id: 'q_dm', text: 'Kencing manis?', response: 'Iya dok, gula darah tinggi.', sentiment: 'confirmation' }],
            rpd: [], rpk: [], sosial: []
        },
        essentialQuestions: ['q_main'],
        anamnesis: ["Lipatan kulit saya merah dan gatal dok, basah terus.", "Gatal dan merah di lipatan badan dok, nggak kering-kering. Saya ada kencing manis juga."],
        physicalExamFindings: { general: "Obese.", vitals: "TD 130/80, N 80x, RR 18x, S 36.8°C", skin: "Eritema merah terang dengan maserasi di inframammary fold bilateral. Satellite papulo-pustules (+) di tepi." },
        labs: {}, vitals: { temp: 36.8, bp: '130/80', hr: 80, rr: 18 },
        correctTreatment: ['miconazole_cream', 'nystatin_cream'],
        correctProcedures: [],
        requiredEducation: ['keep_skin_dry', 'treat_underlying_dm'],
        risk: 'low',
        nonReferrable: true,
        referralExceptions: ['no_improvement'],
        differentialDiagnosis: ['L08.1', 'L30.4']
    },
    {
        id: 'cutaneous_larva_migrans',
        diagnosis: 'Cutaneous Larva Migrans',
        icd10: 'B76.9',
        skdi: '4A',
        category: 'Dermatology',
        symptoms: ['Garis merah berkelok', 'Gatal hebat', 'Di kaki', 'Berjalan perlahan'],
        clue: "Serpiginous track (jalur berkelok eritematosa) di kulit, sangat gatal. Larva cacing tambang anjing/kucing menembus kulit.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Keluhannya?', response: 'Ada garis merah berkelok di kaki dok, gatal banget, kayak ada yang jalan.', sentiment: 'confirmation', priority: 'essential' }],
            rps: [],
            rpd: [],
            rpk: [],
            sosial: [{ id: 'q_bare', text: 'Sering tanpa alas kaki?', response: 'Iya dok, sering main di pantai tanpa sandal.', sentiment: 'confirmation', priority: 'essential' }]
        },
        essentialQuestions: ['q_main', 'q_bare'],
        anamnesis: ["Kaki saya ada garis-garis merah gatal dok, kayak jalur cacing.", "Gatal banget di kaki dok, kemarin habis jalan-jalan tanpa sandal di pantai."],
        physicalExamFindings: { general: "Tampak baik.", vitals: "TD 120/80, N 78x, RR 18x, S 36.7°C", skin: "Serpiginous erythematous track di dorsum pedis dextra, slightly raised, advancing 1-2 cm/hari." },
        labs: {}, vitals: { temp: 36.7, bp: '120/80', hr: 78, rr: 18 },
        correctTreatment: ['albendazole_400'],
        correctProcedures: [],
        requiredEducation: ['wear_shoes', 'avoid_sandy_soil'],
        risk: 'low',
        nonReferrable: true,
        referralExceptions: [],
        differentialDiagnosis: ['B76.0', 'L50.9']
    },
    {
        id: 'pediculosis_capitis',
        diagnosis: 'Pedikulosis Kapitis (Kutu Rambut)',
        icd10: 'B85.0',
        skdi: '4A',
        category: 'Dermatology',
        symptoms: ['Gatal kepala', 'Kutu terlihat', 'Telur kutu (nits)', 'Garukan eksoriasi'],
        clue: "Pruritus scalp + nits (telur kutu menempel di batang rambut). Sering pada anak sekolah, menular lewat kontak langsung.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Keluhannya?', response: 'Anak saya kepala gatal terus dok, ada kutunya.', sentiment: 'confirmation', priority: 'essential' }],
            rps: [], rpd: [], rpk: [{ id: 'q_contact', text: 'Teman ada yang sama?', response: 'Iya, banyak teman sekelasnya.', sentiment: 'neutral' }], sosial: []
        },
        essentialQuestions: ['q_main'],
        anamnesis: ["Kepala anak saya gatal terus dok, ada kutunya.", "Anak saya garuk-garuk kepala terus dok, temennya di sekolah banyak yang kutuan."],
        physicalExamFindings: { general: "Anak tampak garuk-garuk.", vitals: "TD -, N 90x, RR 20x, S 36.7°C", skin: "Nits multipel menempel di batang rambut. Kutu dewasa (+). Eksoriasi di occipital." },
        labs: {}, vitals: { temp: 36.7, bp: '-', hr: 90, rr: 20 },
        correctTreatment: ['permethrin_1_lotion'],
        correctProcedures: ['nit_combing'],
        requiredEducation: ['wash_bedding', 'dont_share_comb', 'treat_contacts'],
        risk: 'low',
        nonReferrable: true,
        referralExceptions: [],
        differentialDiagnosis: ['L21', 'B85.2']
    },
    {
        id: 'pediculosis_pubis',
        diagnosis: 'Pedikulosis Pubis (Kutu Kelamin)',
        icd10: 'B85.3',
        skdi: '4A',
        category: 'Dermatology',
        symptoms: ['Gatal pubis', 'Kutu terlihat', 'Bintik biru (maculae ceruleae)', 'Nits di rambut pubis'],
        clue: "Pruritus di regio pubis, kutu Phthirus pubis terlihat. Tranmisi kontak seksual. Maculae ceruleae patognomonik.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Gatalnya di mana?', response: 'Di bulu kemaluan dok, gatal banget.', sentiment: 'confirmation', priority: 'essential' }],
            rps: [],
            rpd: [],
            rpk: [],
            sosial: [{ id: 'q_partner', text: 'Pasangan ada keluhan?', response: 'Iya, gatal juga.', sentiment: 'confirmation' }]
        },
        essentialQuestions: ['q_main'],
        anamnesis: ["Gatal pubis, kutu terlihat.", "Pasangan gatal juga."],
        physicalExamFindings: { general: "Tampak baik.", vitals: "TD 120/80, N 78x, RR 18x, S 36.7°C", skin: "Kutu Phthirus pubis dan nits di rambut pubis. Maculae ceruleae (+) di lower abdomen." },
        labs: {}, vitals: { temp: 36.7, bp: '120/80', hr: 78, rr: 18 },
        correctTreatment: ['permethrin_1_lotion'],
        correctProcedures: [],
        requiredEducation: ['partner_treatment', 'wash_bedding', 'safe_sex'],
        risk: 'low',
        nonReferrable: true,
        referralExceptions: [],
        differentialDiagnosis: ['B85.0', 'B86']
    },
    {
        id: 'folikulitis_superfisialis',
        diagnosis: 'Folikulitis Superfisialis',
        icd10: 'L73.9',
        skdi: '4A',
        category: 'Dermatology',
        symptoms: ['Bintil merah di folikel rambut', 'Gatal', 'Pustul kecil-kecil', 'Di daerah berambut'],
        clue: "Pustul kecil-kecil di folikel rambut, terutama di daerah yang sering bergesekan (paha, bokong, punggung). Staphylococcus aureus. Antibiotik topikal + higiene.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [
                { id: 'q_main', text: 'Bintilnya di mana?', response: 'Di paha dan bokong dok, bintil-bintil merah kecil bernanah, gatal.', sentiment: 'confirmation', priority: 'essential' }
            ],
            rps: [
                { id: 'q_itch', text: 'Gatal?', response: 'Gatal dok, apalagi kalau berkeringat.', sentiment: 'confirmation' },
                { id: 'q_shave', text: 'Baru cukur/waxing?', response: 'Iya dok, habis cukur bulu kaki.', sentiment: 'confirmation' }
            ],
            rpd: [{ id: 'q_dm', text: 'Kencing manis?', response: 'Nggak ada dok.', sentiment: 'denial' }],
            rpk: [], sosial: [{ id: 'q_hygiene', text: 'Mandi teratur?', response: 'Kadang cuma sekali sehari dok.', sentiment: 'confirmation' }]
        },
        essentialQuestions: ['q_main'],
        anamnesis: ["Bintil-bintil kecil bernanah di paha dan bokong dok, gatal.", "Ada jerawat-jerawat kecil di kulit saya dok, terutama di bagian yang sering bergesekan."],
        physicalExamFindings: { general: "Tampak baik.", vitals: "TD 120/80, N 78x, RR 18x, S 36.7°C", skin: "Papul dan pustul folikuler multipel diameter 2-4 mm di regio femoralis posterior bilateral. Eritema perifolikuler (+)." },
        labs: {}, vitals: { temp: 36.7, bp: '120/80', hr: 78, rr: 18 },
        correctTreatment: ['mupirocin_oint', 'cefalexin_500'],
        correctProcedures: [],
        requiredEducation: ['skin_hygiene', 'wear_loose_clothes', 'avoid_shaving_irritation'],
        risk: 'low', nonReferrable: true, referralExceptions: ['no_improvement'],
        differentialDiagnosis: ['L02', 'L01.0']
    },
    {
        id: 'furunkel_karbunkel',
        diagnosis: 'Furunkel / Karbunkel',
        icd10: 'L02.9',
        skdi: '4A',
        category: 'Dermatology',
        symptoms: ['Bisul besar', 'Nyeri berdenyut', 'Bengkak merah', 'Ada mata bisul (fluktuasi)'],
        clue: "Nodus eritematosa nyeri di folikel rambut, berkembang menjadi abses dengan fluktuasi. Karbunkel = beberapa furunkel bergabung. Insisi drainase jika sudah matang.",
        relevantLabs: ['Darah Lengkap'],
        anamnesisQuestions: {
            keluhan_utama: [
                { id: 'q_main', text: 'Bisulnya di mana?', response: 'Di bokong dok, bisul besar banget, sakit berdenyut-denyut.', sentiment: 'confirmation', priority: 'essential' }
            ],
            rps: [
                { id: 'q_pus', text: 'Sudah pecah?', response: 'Belum pecah dok, tapi kayaknya sudah matang, ada mata bisulnya.', sentiment: 'confirmation' },
                { id: 'q_fever', text: 'Demam?', response: 'Agak hangat dok.', sentiment: 'confirmation' }
            ],
            rpd: [{ id: 'q_dm', text: 'Kencing manis?', response: 'Iya dok, gula darah saya tinggi.', sentiment: 'confirmation', priority: 'essential' }],
            rpk: [], sosial: []
        },
        essentialQuestions: ['q_main', 'q_dm'],
        anamnesis: ["Bisul besar di bokong dok, sakit berdenyut, belum pecah.", "Ada bengkak merah besar dok, nyeri banget sampai nggak bisa duduk."],
        physicalExamFindings: { general: "Tampak kesakitan.", vitals: "TD 120/80, N 84x, RR 18x, S 37.5°C", skin: "Nodus eritematosa diameter 4 cm di regio gluteal dextra, nyeri tekan (+), fluktuasi (+), warm. Selulitis minimal perilesional." },
        labs: { "Darah Lengkap": { result: "Leukosit 12.000, shift to the left", cost: 50000 } },
        vitals: { temp: 37.5, bp: '120/80', hr: 84, rr: 18 },
        correctTreatment: ['cloxacillin_500', 'paracetamol_500'],
        correctProcedures: ['incision_drainage'],
        requiredEducation: ['wound_care', 'skin_hygiene', 'dm_control'],
        risk: 'low', nonReferrable: true, referralExceptions: ['comorbidity', 'no_improvement'],
        differentialDiagnosis: ['L02.2', 'L73.9']
    },
    {
        id: 'dermatitis_atopik',
        diagnosis: 'Dermatitis Atopik',
        icd10: 'L20.9',
        skdi: '4A',
        category: 'Dermatology',
        symptoms: ['Kulit kering dan gatal', 'Ruam di lipatan siku/lutut', 'Eksim kambuhan', 'Riwayat atopi keluarga'],
        clue: "Gatal kronik-residif di daerah fleksural (lipatan siku, lutut, leher). Sering ada stigmata atopi: asma, rhinitis alergi. Kulit kering (xerosis). Emolien + steroid topikal.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [
                { id: 'q_main', text: 'Gatalnya di mana bu?', response: 'Di lipatan siku dan belakang lutut anak saya dok, merah dan kering, gatal banget.', sentiment: 'confirmation', priority: 'essential' }
            ],
            rps: [
                { id: 'q_recur', text: 'Sering kambuh?', response: 'Iya dok, dari kecil sudah begini, kambuh-kambuhan.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_trigger', text: 'Apa pencetusnya?', response: 'Kalau kena debu atau cuaca dingin sering kambuh.', sentiment: 'confirmation' }
            ],
            rpd: [{ id: 'q_asma', text: 'Ada asma atau alergi?', response: 'Iya, anak saya juga punya asma.', sentiment: 'neutral' }],
            rpk: [{ id: 'q_fam', text: 'Keluarga ada alergi?', response: 'Bapaknya asma dan rinitis alergi dok.', sentiment: 'confirmation', priority: 'essential' }],
            sosial: []
        },
        essentialQuestions: ['q_main', 'q_recur', 'q_fam'],
        anamnesis: ["Kulit anak saya gatal-gatal di lipatan siku dan lutut dok, kering dan merah.", "Eksim anak saya kambuh lagi dok, gatal sampai digaruk berdarah."],
        physicalExamFindings: { general: "Anak tampak garuk-garuk.", vitals: "TD -, N 88x, RR 20x, S 36.7°C", skin: "Plak eritematosa, likenifikasi, ekskoriasi di fossa cubiti bilateral dan poplitea. Xerosis difus. Dennie-Morgan fold (+)." },
        labs: {}, vitals: { temp: 36.7, bp: '-', hr: 88, rr: 20 },
        correctTreatment: ['hydrocortisone_cream', 'cetirizine_10', 'emollient'],
        correctProcedures: [],
        requiredEducation: ['moisturizer_routine', 'avoid_triggers', 'short_nails', 'cotton_clothes'],
        risk: 'low', nonReferrable: true, referralExceptions: ['no_improvement', 'comorbidity'],
        differentialDiagnosis: ['L20.8', 'L30.0']
    },
    {
        id: 'dermatitis_numularis',
        diagnosis: 'Dermatitis Numularis',
        icd10: 'L30.0',
        skdi: '4A',
        category: 'Dermatology',
        symptoms: ['Bercak bulat eksim', 'Gatal', 'Basah/keropeng', 'Di tungkai bawah'],
        clue: "Plak eritematosa nummular (berbentuk koin) dengan vesikel, krusta, eksudasi. Sering di tungkai bawah. Kronik-residif. Steroid topikal potensi sedang.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [
                { id: 'q_main', text: 'Keluhannya?', response: 'Ada bercak-bercak bulat merah di kaki dok, gatal dan basah.', sentiment: 'confirmation', priority: 'essential' }
            ],
            rps: [
                { id: 'q_itch', text: 'Gatal?', response: 'Gatal banget dok, kalau digaruk makin basah.', sentiment: 'confirmation' }
            ],
            rpd: [{ id: 'q_history', text: 'Pernah sebelumnya?', response: 'Dulu pernah dok, sembuh terus kambuh.', sentiment: 'confirmation' }],
            rpk: [], sosial: [{ id: 'q_dry', text: 'Kulit kering?', response: 'Iya dok, kulit saya memang kering.', sentiment: 'confirmation' }]
        },
        essentialQuestions: ['q_main'],
        anamnesis: ["Ada bercak bulat-bulat merah di kaki dok, gatal dan basah.", "Eksim di kaki saya kambuh lagi dok, bentuknya bulat-bulat."],
        physicalExamFindings: { general: "Tampak baik.", vitals: "TD 120/80, N 78x, RR 18x, S 36.7°C", skin: "Plak nummular eritematosa diameter 2-5 cm multipel di cruris bilateral, vesikel (+), ekskoriasi (+), krusta serous." },
        labs: {}, vitals: { temp: 36.7, bp: '120/80', hr: 78, rr: 18 },
        correctTreatment: ['betamethasone_cream', 'cetirizine_10'],
        correctProcedures: [],
        requiredEducation: ['moisturizer_routine', 'avoid_scratching'],
        risk: 'low', nonReferrable: true, referralExceptions: ['no_improvement'],
        differentialDiagnosis: ['L20.9', 'B35.4']
    },
    {
        id: 'dermatitis_seboroik',
        diagnosis: 'Dermatitis Seboroik',
        icd10: 'L21.9',
        skdi: '4A',
        category: 'Dermatology',
        symptoms: ['Serpihan kulit berminyak', 'Kemerahan', 'Di wajah/kulit kepala', 'Gatal ringan'],
        clue: "Skuama berminyak kekuningan di daerah seboroik (scalp, alis, nasolabial, dada). Malassezia furfur berperan. Ketoconazole shampoo/krim + steroid ringan.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [
                { id: 'q_main', text: 'Keluhannya?', response: 'Kulit kepala saya bersisik kekuningan dok, gatal, muka juga merah di pinggir hidung.', sentiment: 'confirmation', priority: 'essential' }
            ],
            rps: [
                { id: 'q_dandruff', text: 'Ketombean banyak?', response: 'Iya dok, parah banget, baju saya penuh ketombe.', sentiment: 'confirmation' }
            ],
            rpd: [{ id: 'q_recur', text: 'Sering kambuh?', response: 'Iya dok, dari dulu begini.', sentiment: 'neutral' }],
            rpk: [], sosial: [{ id: 'q_stress', text: 'Lagi stres?', response: 'Iya dok, kerja lembur terus.', sentiment: 'neutral' }]
        },
        essentialQuestions: ['q_main'],
        anamnesis: ["Kulit kepala bersisik kekuningan dok, gatal, muka juga merah.", "Ketombean banyak banget dok, gatal, dan di pinggir hidung juga ada merah bersisik."],
        physicalExamFindings: { general: "Tampak baik.", vitals: "TD 120/80, N 78x, RR 18x, S 36.7°C", skin: "Eritema dengan skuama berminyak kekuningan di scalp, alis, sulcus nasolabialis bilateral, dan retroaurikular." },
        labs: {}, vitals: { temp: 36.7, bp: '120/80', hr: 78, rr: 18 },
        correctTreatment: ['ketoconazole_shampoo', 'hydrocortisone_cream'],
        correctProcedures: [],
        requiredEducation: ['regular_shampoo', 'stress_management', 'face_hygiene'],
        risk: 'low', nonReferrable: true, referralExceptions: ['no_improvement'],
        differentialDiagnosis: ['L21.0', 'B36.0']
    },
    {
        id: 'napkin_eczema',
        diagnosis: 'Napkin Eczema (Ruam Popok)',
        icd10: 'L22',
        skdi: '4A',
        category: 'Dermatology',
        symptoms: ['Ruam merah di area popok', 'Kulit lecet', 'Bayi rewel', 'Didaerah pantat/selangkangan'],
        clue: "Dermatitis di area popok (konveksitas — lipatan biasanya tidak kena). Iritasi urin/feses + kelembaban. Jika ada satellite lesions → curigai Candida. Barrier cream (zinc oxide).",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [
                { id: 'q_main', text: 'Adik bayi kenapa bu?', response: 'Pantat bayi saya merah-merah dok, lecet, nangis kalau diganti popok.', sentiment: 'confirmation', priority: 'essential' }
            ],
            rps: [
                { id: 'q_diaper', text: 'Pakai popok sekali pakai?', response: 'Iya dok, kadang jarang ganti.', sentiment: 'neutral', priority: 'essential' },
                { id: 'q_diarrhea', text: 'Ada diare?', response: 'Iya dok, BAB-nya encer dan sering.', sentiment: 'confirmation' }
            ],
            rpd: [], rpk: [], sosial: []
        },
        essentialQuestions: ['q_main', 'q_diaper'],
        anamnesis: ["Pantat bayi saya merah-merah dan lecet dok, rewel terus.", "Ruam popok bayi saya parah dok, nangis kalau kena air."],
        physicalExamFindings: { general: "Bayi tampak rewel.", vitals: "TD -, N 120x, RR 30x, S 36.7°C", skin: "Eritema difus di regio perianal, gluteal, inguinal. Lesi di konveksitas, lipatan relatif spared. Erosi superfisial (+). Satellite lesion (-)." },
        labs: {}, vitals: { temp: 36.7, bp: '-', hr: 120, rr: 30 },
        correctTreatment: ['zinc_oxide_cream'],
        correctProcedures: [],
        requiredEducation: ['frequent_diaper_change', 'barrier_cream', 'air_dry_skin'],
        risk: 'low', nonReferrable: true, referralExceptions: ['candida_superinfection'],
        differentialDiagnosis: ['L22', 'B37.2']
    },
    {
        id: 'akne_vulgaris',
        diagnosis: 'Akne Vulgaris Ringan',
        icd10: 'L70.0',
        skdi: '4A',
        category: 'Dermatology',
        symptoms: ['Jerawat di wajah', 'Komedo', 'Papul/pustul', 'Berminyak'],
        clue: "Komedo (terbuka/tertutup) + papul/pustul di wajah. Ringan: komedo dominan, papul <10. Retinoid topikal + benzoyl peroxide. Sedang-berat → perlu rujukan.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [
                { id: 'q_main', text: 'Jerawatnya sudah lama?', response: 'Sudah beberapa bulan dok, makin banyak.', sentiment: 'confirmation', priority: 'essential' }
            ],
            rps: [
                { id: 'q_scar', text: 'Ada bekas luka?', response: 'Ada beberapa bekas hitam dok.', sentiment: 'confirmation' },
                { id: 'q_period', text: 'Jerawat memberat saat mens?', response: 'Iya dok, sebelum haid biasanya makin banyak.', sentiment: 'confirmation' }
            ],
            rpd: [], rpk: [{ id: 'q_fam', text: 'Orangtua berjerawat juga?', response: 'Iya, ibu saya dulu jerawatan juga.', sentiment: 'neutral' }],
            sosial: [{ id: 'q_cosmetic', text: 'Pakai kosmetik?', response: 'Iya dok, pakai foundation tebal tiap hari.', sentiment: 'confirmation' }]
        },
        essentialQuestions: ['q_main'],
        anamnesis: ["Jerawat saya makin banyak dok, malu keluar rumah.", "Wajah saya bruntusan dan berjerawat dok, sudah coba macam-macam tapi nggak sembuh."],
        physicalExamFindings: { general: "Tampak baik.", vitals: "TD 110/70, N 78x, RR 18x, S 36.7°C", skin: "Komedo terbuka dan tertutup multipel di regio frontalis dan malaris. Papul eritematosa 5-8 buah. Pustul 2-3. Nodulus (-). Skin type: berminyak." },
        labs: {}, vitals: { temp: 36.7, bp: '110/70', hr: 78, rr: 18 },
        correctTreatment: ['benzoyl_peroxide_gel', 'adapalene_gel'],
        correctProcedures: [],
        requiredEducation: ['face_wash_routine', 'non_comedogenic_cosmetics', 'dont_squeeze'],
        risk: 'low', nonReferrable: true, referralExceptions: ['severe_acne', 'no_improvement'],
        differentialDiagnosis: ['L70.0', 'L73.9']
    },
    {
        id: 'miliaria',
        diagnosis: 'Miliaria (Biang Keringat)',
        icd10: 'L74.3',
        skdi: '4A',
        category: 'Dermatology',
        symptoms: ['Bintil kecil-kecil', 'Gatal', 'Di daerah banyak keringat', 'Cuaca panas'],
        clue: "Papul/vesikel kecil di area oklusif (punggung, dada, lipatan). Obstruksi ductus keringat. Miliaria rubra (merah gatal) vs kristalina (vesikel bening). Hindari panas + pakaian longgar.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [
                { id: 'q_main', text: 'Bintilnya kenapa?', response: 'Muncul bintil-bintil kecil merah di dada dan punggung dok, gatal, apalagi kalau panas.', sentiment: 'confirmation', priority: 'essential' }
            ],
            rps: [
                { id: 'q_heat', text: 'Cuaca panas?', response: 'Iya dok, sekarang lagi panas-panasnya.', sentiment: 'confirmation', priority: 'essential' }
            ],
            rpd: [], rpk: [], sosial: [{ id: 'q_clothes', text: 'Pakaiannya?', response: 'Sering pakai baju ketat dan bahan sintetis.', sentiment: 'confirmation' }]
        },
        essentialQuestions: ['q_main', 'q_heat'],
        anamnesis: ["Bintil-bintil kecil merah di dada dan punggung dok, gatal banget kalau panas.", "Biang keringat anak saya banyak banget dok, rewel terus."],
        physicalExamFindings: { general: "Tampak baik.", vitals: "TD 120/80, N 78x, RR 18x, S 36.7°C", skin: "Papul eritematosa dan vesikel kecil multipel non-folikuler di regio thoracalis anterior/posterior. Distribusi di area oklusif." },
        labs: {}, vitals: { temp: 36.7, bp: '120/80', hr: 78, rr: 18 },
        correctTreatment: ['calamine_lotion', 'hydrocortisone_cream'],
        correctProcedures: [],
        requiredEducation: ['wear_loose_clothes', 'cool_environment', 'avoid_excessive_sweating'],
        risk: 'low', nonReferrable: true, referralExceptions: [],
        differentialDiagnosis: ['L74.0', 'L73.9']
    },
    {
        id: 'urtikaria_akut',
        diagnosis: 'Urtikaria Akut',
        icd10: 'L50.9',
        skdi: '4A',
        category: 'Dermatology',
        symptoms: ['Bentol merah gatal', 'Muncul tiba-tiba', 'Berpindah-pindah', 'Hilang <24 jam per lesi'],
        clue: "Wheal (bentol) eritematosa, pruritus, edematus, berpindah-pindah, individual lesion hilang <24 jam. Reaksi hipersensitivitas tipe I. Antihistamin. WASPADA anafilaksis jika ada angioedema/sesak!",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [
                { id: 'q_main', text: 'Bentolnya kapan?', response: 'Tiba-tiba muncul bentol-bentol merah di seluruh badan dok, gatal banget.', sentiment: 'confirmation', priority: 'essential' }
            ],
            rps: [
                { id: 'q_trigger', text: 'Habis makan/minum obat apa?', response: 'Habis makan udang dok.', sentiment: 'neutral', priority: 'essential' },
                { id: 'q_sob', text: 'Sesak napas atau bengkak bibir?', response: 'Nggak ada dok, cuma gatal aja.', sentiment: 'confirmation', priority: 'essential' }
            ],
            rpd: [{ id: 'q_allergy', text: 'Riwayat alergi?', response: 'Dulu pernah gatal-gatal juga habis makan seafood.', sentiment: 'confirmation' }],
            rpk: [], sosial: []
        },
        essentialQuestions: ['q_main', 'q_trigger', 'q_sob'],
        anamnesis: ["Bentol-bentol merah di seluruh badan dok, gatal banget, tiba-tiba habis makan udang.", "Kulit saya gatal biduran dok, bentol-bentol besar, pindah-pindah."],
        physicalExamFindings: { general: "Tampak tidak nyaman, garuk-garuk.", vitals: "TD 120/80, N 82x, RR 18x, S 36.7°C", skin: "Wheal (urtika) eritematosa dan edematosa multipel berbagai ukuran di trunk dan ekstremitas. Angioedema (-). Stridor (-)." },
        labs: {}, vitals: { temp: 36.7, bp: '120/80', hr: 82, rr: 18 },
        correctTreatment: ['cetirizine_10', 'loratadine_10'],
        correctProcedures: [],
        requiredEducation: ['avoid_trigger_food', 'carry_antihistamine', 'seek_er_if_swelling'],
        risk: 'low', nonReferrable: true, referralExceptions: ['angioedema', 'anaphylaxis'],
        differentialDiagnosis: ['L50.0', 'T78.3']
    },
    {
        id: 'drug_eruption',
        diagnosis: 'Exanthematous Drug Eruption / Fixed Drug Eruption',
        icd10: 'L27.0',
        skdi: '4A',
        category: 'Dermatology',
        symptoms: ['Ruam merah setelah minum obat', 'Gatal', 'Bercak hiperpigmentasi', 'Muncul ulang di tempat sama'],
        clue: "Erupsi kulit setelah konsumsi obat. Fixed drug eruption: plak eritema-violaseus berulang di tempat yang SAMA. Exanthematous: ruam morbiliformis difus. Stop obat penyebab!",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [
                { id: 'q_main', text: 'Kapan munculnya?', response: 'Setelah minum obat dari warung dok, muncul bercak merah keunguan di bibir dan kemaluan.', sentiment: 'neutral', priority: 'essential' }
            ],
            rps: [
                { id: 'q_drug', text: 'Obat apa yang diminum?', response: 'Antalgin dok, karena sakit kepala.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_recur', text: 'Pernah begini sebelumnya?', response: 'Iya dok, dulu juga pernah di tempat yang sama persis.', sentiment: 'neutral' }
            ],
            rpd: [{ id: 'q_allergy', text: 'Alergi obat?', response: 'Kayaknya alergi obat ini dok.', sentiment: 'confirmation' }],
            rpk: [], sosial: []
        },
        essentialQuestions: ['q_main', 'q_drug'],
        anamnesis: ["Muncul bercak merah keunguan setelah minum obat dok, di tempat yang sama kayak dulu.", "Kulit saya ruam-ruam merah setelah minum antibiotik dok, gatal seluruh badan."],
        physicalExamFindings: { general: "Tampak baik.", vitals: "TD 120/80, N 78x, RR 18x, S 36.7°C", skin: "Plak eritematosa-violaseus soliter diameter 3 cm di labialis inferior, well-demarcated. Hiperpigmentasi residual (+) dari episode sebelumnya." },
        labs: {}, vitals: { temp: 36.7, bp: '120/80', hr: 78, rr: 18 },
        correctTreatment: ['stop_offending_drug', 'cetirizine_10', 'betamethasone_cream'],
        correctProcedures: [],
        requiredEducation: ['avoid_culprit_drug', 'bring_allergy_card', 'inform_all_doctors'],
        risk: 'low', nonReferrable: true, referralExceptions: ['sjs_ten_suspicion', 'mucous_involvement'],
        differentialDiagnosis: ['L27.1', 'L51.9']
    },
    {
        id: 'gigitan_serangga',
        diagnosis: 'Reaksi Gigitan Serangga',
        icd10: 'T63.4',
        skdi: '4A',
        category: 'Dermatology',
        symptoms: ['Bentol merah setelah digigit', 'Gatal', 'Bengkak lokal', 'Ada punctum (titik gigitan)'],
        clue: "Papul/urtika eritematosa dengan central punctum (tanda gigitan). Bisa tunggal atau multipel (bedbugs: linear). Antihistamin + steroid topikal. Waspada infeksi sekunder.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [
                { id: 'q_main', text: 'Kenapa kulitnya?', response: 'Bentol-bentol gatal dok, kayaknya digigit serangga. Muncul setelah tidur.', sentiment: 'confirmation', priority: 'essential' }
            ],
            rps: [
                { id: 'q_when', text: 'Kapan munculnya?', response: 'Bangun tidur sudah ada dok.', sentiment: 'neutral' },
                { id: 'q_pattern', text: 'Polanya?', response: 'Berjajar lurus dok.', sentiment: 'confirmation' }
            ],
            rpd: [], rpk: [], sosial: [{ id: 'q_environment', text: 'Kasur bersih?', response: 'Kayaknya ada kutu kasur dok.', sentiment: 'confirmation' }]
        },
        essentialQuestions: ['q_main'],
        anamnesis: ["Bentol-bentol gatal dok, kayaknya digigit serangga semalam.", "Anak saya digigit serangga dok, bentol-bentol merah di kaki, gatal."],
        physicalExamFindings: { general: "Tampak baik.", vitals: "TD 120/80, N 78x, RR 18x, S 36.7°C", skin: "Papul eritematosa, urtikaria dengan central punctum (+) multipel di ekstremitas. Distribusi linear (breakfast-lunch-dinner pattern). Ekskoriasi (+)." },
        labs: {}, vitals: { temp: 36.7, bp: '120/80', hr: 78, rr: 18 },
        correctTreatment: ['cetirizine_10', 'hydrocortisone_cream'],
        correctProcedures: [],
        requiredEducation: ['clean_bedding', 'insect_repellent', 'avoid_scratching'],
        risk: 'low', nonReferrable: true, referralExceptions: ['anaphylaxis', 'severe_reaction'],
        differentialDiagnosis: ['L50.9', 'B85']
    },
    {
        id: 'hidradenitis_supurativa',
        diagnosis: 'Hidradenitis Supurativa',
        icd10: 'L73.2',
        skdi: '4A',
        category: 'Dermatology',
        symptoms: ['Bisul berulang di ketiak/selangkangan', 'Fistula/sinus tract', 'Nyeri', 'Sekret berbau'],
        clue: "Nodus/abses berulang di daerah apokrin (aksila, inguinal, perianal). Bisa membentuk sinus tract dan fistula. Kronik-residif. Stadium ringan: antibiotik + perawatan. Berat: rujuk dermatologi.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [
                { id: 'q_main', text: 'Bisulnya di mana?', response: 'Di ketiak dan selangkangan dok, bolak-balik bisul, pecah terus tumbuh lagi.', sentiment: 'confirmation', priority: 'essential' }
            ],
            rps: [
                { id: 'q_recur', text: 'Sudah berapa kali?', response: 'Berkali-kali dok, dari beberapa bulan lalu. Ada lubang-lubang yang nggak menutup.', sentiment: 'denial', priority: 'essential' },
                { id: 'q_discharge', text: 'Keluar cairan?', response: 'Iya dok, nanah bau.', sentiment: 'confirmation' }
            ],
            rpd: [{ id: 'q_dm', text: 'Kencing manis?', response: 'Nggak ada dok.', sentiment: 'denial' }],
            rpk: [], sosial: [{ id: 'q_smoke', text: 'Merokok?', response: 'Iya dok, sehari satu bungkus.', sentiment: 'confirmation' }]
        },
        essentialQuestions: ['q_main', 'q_recur'],
        anamnesis: ["Bisul berulang di ketiak dan selangkangan dok, ada lubang-lubang yang keluar nanah.", "Bokong saya sering bisul dok, pecah tapi nggak pernah sembuh, timbul lagi terus."],
        physicalExamFindings: { general: "Tampak sakit ringan.", vitals: "TD 120/80, N 80x, RR 18x, S 37.0°C", skin: "Nodus dan sinus tract multipel di aksila bilateral dan inguinal dextra. Sekret purulent (+). Scar irregular dari lesi lama. Komedo ganda (+)." },
        labs: {}, vitals: { temp: 37.0, bp: '120/80', hr: 80, rr: 18 },
        correctTreatment: ['clindamycin_300', 'rifampicin_300', 'clindamycin_topical'],
        correctProcedures: ['incision_drainage'],
        requiredEducation: ['weight_loss', 'stop_smoking', 'loose_clothes', 'wound_care'],
        risk: 'medium', nonReferrable: true, referralExceptions: ['severe_stage', 'no_improvement'],
        differentialDiagnosis: ['L02.4', 'L02.2']
    }
];
