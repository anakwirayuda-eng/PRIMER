/**
 * @reflection
 * [IDENTITY]: dermatology
 * [PURPOSE]: Medical cases for Dermatology specialty.
 * [STATE]: Experimental
 * [LAST_UPDATE]: 2026-02-12
 */

export const DERMATOLOGY_CASES = [
    {
        id: 'contact_dermatitis',
        diagnosis: 'Dermatitis Kontak Alergi',
        icd10: 'L23.9',
        skdi: '4A',
        category: 'Dermatology',
        anamnesis: ["Kulit saya gatal dan merah dok, habis pakai sabun cuci baru.", "Rasanya perih, bengkak, dan ada bintil-bintil air sedikit. Sudah 2 hari."],
        physicalExamFindings: { general: "Tampak baik.", vitals: "TD 120/80, N 78x, RR 18x, S 36.5°C", skin: "Eritema (+), vesikel (+), papul eritematosa (+), batas tegas pada area kontak." },
        labs: {}, vitals: { temp: 36.5, bp: '120/80', hr: 78, rr: 18 },
        correctTreatment: ['cetirizine_10', 'hydrocortisone_cream', 'betamethasone_cream'],
        correctProcedures: [],
        requiredEducation: ['avoid_irritants', 'barrier_protection', 'moisturizer_use'],
        risk: 'low', nonReferrable: true, referralExceptions: ['erythroderma', 'no_improvement'],
        differentialDiagnosis: ['L25.9', 'L23.9']
    },
    {
        id: 'scabies',
        diagnosis: 'Skabies (Kudis)',
        icd10: 'B86',
        skdi: '4A',
        category: 'Dermatology',
        anamnesis: ["Gatal banget dok kalau malam, di sela-sela jari.", "Teman satu pesantren juga banyak yang begini. Sudah seminggu gatalnya makin parah."],
        physicalExamFindings: { general: "Tampak tidak nyaman, menggaruk.", vitals: "TD 120/80, N 80x, RR 18x, S 36.7°C", skin: "Papul eritematosa (+), kanalikuli (+), ekskoriasi (+) pada sela jari, pergelangan tangan, dan regio umbilikus." },
        labs: { "Skin Scraping": { result: "Sarcoptes scabiei (+)", cost: 30000 } },
        vitals: { temp: 36.7, bp: '120/80', hr: 80, rr: 18 },
        correctTreatment: ['permethrin_5_cream', 'cetirizine_10'],
        correctProcedures: ['family_tracing'],
        requiredEducation: ['wash_bedding', 'treat_contacts', 'hygiene'],
        risk: 'medium', nonReferrable: true, referralExceptions: ['scabies_norwegian', 'secondary_infection_severe'],
        differentialDiagnosis: ['B86', 'L20.9']
    },
    {
        id: 'tinea_corporis',
        diagnosis: 'Tinea Korporis',
        icd10: 'B35.4',
        skdi: '4A',
        category: 'Dermatology',
        anamnesis: ["Gatal di badan dok, bentuknya kayak pulau merah-merah.", "Kalau berkeringat makin gatal. Sudah 2 minggu, awalnya kecil terus makin melebar."],
        physicalExamFindings: { general: "Tampak baik.", vitals: "TD 120/80, N 76x, RR 18x, S 36.5°C", skin: "Makula eritematosa numular, central healing (+), tepi aktif elevated (+), squama (+)." },
        labs: { "KOH Test": { result: "Hifa panjang bercabang (+)", cost: 30000 } },
        vitals: { temp: 36.5, bp: '120/80', hr: 76, rr: 18 },
        correctTreatment: ['ketoconazole_cream', 'cetirizine_10'],
        correctProcedures: [],
        requiredEducation: ['keep_skin_dry', 'avoid_sharing_towels', 'med_compliance'],
        risk: 'low', nonReferrable: true, referralExceptions: ['extensive_infection', 'no_improvement'],
        differentialDiagnosis: ['B35.4', 'L40.0']
    },
    {
        id: 'scabies_infeksi',
        diagnosis: 'Skabies dengan Infeksi Sekunder',
        icd10: 'B86',
        skdi: '4A',
        category: 'Dermatology',
        anamnesis: ["Gatal skabies saya jadi bernanah dok, sakit.", "Sudah digaruk terus sampai luka dan sekarang bengkak merah dan ada nanahnya."],
        physicalExamFindings: { general: "Tampak sakit ringan.", vitals: "TD 110/70, N 88x, RR 20x, S 37.8°C", skin: "Pustul (+), krusta keemasan (+), edema, eritema pada area skabies." },
        labs: {}, vitals: { temp: 37.8, bp: '110/70', hr: 88, rr: 20 },
        correctTreatment: ['mupirocin_ointment', 'cloxacillin_500', 'permethrin_5_cream'],
        correctProcedures: [],
        requiredEducation: ['hygiene', 'wound_care'],
        risk: 'medium', nonReferrable: true, referralExceptions: ['cellulitis_suspicion'],
        differentialDiagnosis: ['B86', 'L01.0']
    },
    {
        id: 'tinea_corporis_extensive',
        diagnosis: 'Tinea Korporis (Extensive)',
        icd10: 'B35.4',
        skdi: '4A',
        category: 'Dermatology',
        anamnesis: ["Gatal sebadan-badan dok, bercak merahnya banyak sekali.", "Sudah sebulan lebih, sudah pakai salep beli sendiri di warung nggak sembuh-sembuh."],
        physicalExamFindings: { general: "Tampak baik.", vitals: "TD 120/80, N 80x, RR 18x, S 36.6°C", skin: "Multiple plaques, eritematosa, central healing (+), tersebar di thorax, abdomen, dan punggung." },
        labs: { "KOH 10%": { result: "Hifa (+)", cost: 30000 } },
        vitals: { temp: 36.6, bp: '120/80', hr: 80, rr: 18 },
        correctTreatment: ['griseofulvin_500', 'ketoconazole_cream'],
        correctProcedures: [],
        requiredEducation: ['med_compliance', 'hygiene'],
        risk: 'medium', nonReferrable: true, referralExceptions: ['no_improvement_with_systemic'],
        differentialDiagnosis: ['B35.4', 'L30.9']
    },
    {
        id: 'dermatitis_kontak_iritan',
        diagnosis: 'Dermatitis Kontak Iritan',
        icd10: 'L24.9',
        skdi: '4A',
        category: 'Dermatology',
        anamnesis: ["Tangan saya panas dan perih dok, rasanya kayak kebakar.", "Tadi habis bersihin kamar mandi pakai cairan pembersih kuat, lupa pake sarung tangan."],
        physicalExamFindings: { general: "Tampak menahan perih.", vitals: "TD 120/80, N 82x, RR 18x, S 36.5°C", skin: "Eritema, edema, bula (+), nyeri tekan (+) pada area paparan cairan kimia." },
        labs: {}, vitals: { temp: 36.5, bp: '120/80', hr: 82, rr: 18 },
        correctTreatment: ['betamethasone_cream', 'cetirizine_10'],
        correctProcedures: ['wound_debridement'],
        requiredEducation: ['use_protective_gear', 'immediate_wash_after_contact'],
        risk: 'medium', nonReferrable: true, referralExceptions: ['extensive_burn', 'eye_involvement'],
        differentialDiagnosis: ['L24.9', 'L23.9']
    },
    {
        id: 'exanthem_subitum',
        diagnosis: 'Exanthem Subitum (Roseola Infantum)',
        icd10: 'B08.2',
        skdi: '4A',
        category: 'Dermatology',
        symptoms: ['Demam tinggi mendadak', 'Ruam muncul setelah demam turun', 'Usia 6 bulan - 2 tahun', 'Anak aktif saat demam'],
        clue: "Demam tinggi 3-5 hari pada bayi/toddler, ANAK TETAP AKTIF saat demam. Begitu demam turun → ruam makulopapular muncul di trunkus lalu menyebar. Self-limited, HHV-6.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Anaknya kenapa ini bu?', response: 'Demam tinggi sudah 3 hari dok, terus tadi demamnya turun tiba-tiba muncul ruam merah di badan.', sentiment: 'confirmation', priority: 'essential' }],
            rps: [
                { id: 'q_rash', text: 'Ruamnya muncul setelah demam turun ya?', response: 'Iya dok, pas demamnya hilang, badannya langsung merah-merah.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_activity', text: 'Waktu demam, anaknya masih aktif main?', response: 'Masih dok, mau makan mau minum, cuma panas aja.', sentiment: 'confirmation' }
            ],
            rpd: [], rpk: [], sosial: []
        },
        essentialQuestions: ['q_main', 'q_rash'],
        anamnesis: ["Anak demam tinggi 3 hari, pas turun muncul ruam merah.", "Waktu demam masih aktif, mau makan minum."],
        physicalExamFindings: { general: "Tampak aktif, afebris.", vitals: "TD -, N 110x, RR 28x, S 36.8°C", skin: "Ruam makulopapular eritematosa di trunkus dan leher, menyebar ke ekstremitas. Ruam blanching (+), tidak gatal." },
        labs: {}, vitals: { temp: 36.8, bp: '-', hr: 110, rr: 28 },
        correctTreatment: ['paracetamol_syrup', 'supportive_care'],
        correctProcedures: [],
        requiredEducation: ['self_limited', 'fever_management', 'adequate_fluids'],
        risk: 'low', nonReferrable: true, referralExceptions: ['febrile_seizure', 'immunocompromised'],
        differentialDiagnosis: ['B08.2', 'B05.9']
    },
    {
        id: 'pitiriasis_rosea',
        diagnosis: 'Pitiriasis Rosea',
        icd10: 'L42',
        skdi: '4A',
        category: 'Dermatology',
        symptoms: ['Herald patch', 'Ruam oval mengikuti garis Langer', 'Skuama kolaret', 'Gatal ringan'],
        clue: "Herald patch (plak oval besar) muncul duluan, 1-2 minggu kemudian diikuti erupsi sekunder: makula oval mengikuti garis Langer ('christmas tree pattern'). Self-limited 6-8 minggu.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Kulitnya kenapa ini pak/bu?', response: 'Awalnya ada bercak merah satu gede di perut dok, terus seminggu kemudian muncul banyak bercak kecil-kecil di badan.', sentiment: 'confirmation', priority: 'essential' }],
            rps: [
                { id: 'q_herald', text: 'Bercak yang pertama kali muncul yang mana?', response: 'Yang paling gede ini dok, di perut, baru seminggu kemudian yang kecil-kecil muncul.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_itch', text: 'Gatal nggak?', response: 'Agak gatal sedikit dok, nggak terlalu parah.', sentiment: 'confirmation' }
            ],
            rpd: [], rpk: [], sosial: []
        },
        essentialQuestions: ['q_main', 'q_herald'],
        anamnesis: ["Bercak merah gede di perut, terus muncul banyak bercak kecil.", "Agak gatal, sudah 2 minggu makin banyak."],
        physicalExamFindings: { general: "Tampak baik.", vitals: "TD 120/80, N 78x, RR 18x, S 36.5°C", skin: "Herald patch: Plak oval 3x2cm, eritematosa, skuama kolaret di abdomen. Erupsi sekunder: Multiple makula oval, mengikuti garis Langer, di trunkus (christmas tree pattern)." },
        labs: {}, vitals: { temp: 36.5, bp: '120/80', hr: 78, rr: 18 },
        correctTreatment: ['cetirizine_10', 'calamine_lotion'],
        correctProcedures: [],
        requiredEducation: ['self_limited_6_8_weeks', 'avoid_hot_bath', 'moisturizer'],
        risk: 'low', nonReferrable: true, referralExceptions: ['atypical_distribution', 'persistent_beyond_3months'],
        differentialDiagnosis: ['L42', 'B35.4']
    },
    {
        id: 'eritema_nodosum',
        diagnosis: 'Eritema Nodosum',
        icd10: 'L52',
        skdi: '4A',
        category: 'Dermatology',
        symptoms: ['Nodul merah nyeri di tulang kering', 'Demam ringan', 'Nyeri sendi', 'Bilateral simetris'],
        clue: "Nodul subkutan eritematosa, nyeri tekan, di permukaan anterior tibia (shin). Bilateral simetris. Panikulitis (inflamasi lemak subkutan). Cari penyebab: infeksi strep, TB, sarkoid, obat.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Kakinya kenapa ini pak/bu?', response: 'Ada benjolan-benjolan merah di tulang kering dok, sakit banget kalau kesentuh.', sentiment: 'confirmation', priority: 'essential' }],
            rps: [
                { id: 'q_bilateral', text: 'Di kedua kaki ya?', response: 'Iya dok, kanan kiri sama-sama ada.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_fever', text: 'Ada demam atau pegal-pegal?', response: 'Iya agak demam, sendi-sendi pegal juga.', sentiment: 'confirmation' }
            ],
            rpd: [{ id: 'q_tb', text: 'Punya riwayat batuk lama atau pengobatan TB?', response: 'Nggak ada dok.', sentiment: 'denial' }],
            rpk: [], sosial: []
        },
        essentialQuestions: ['q_main', 'q_bilateral'],
        anamnesis: ["Benjolan merah sakit di tulang kering kedua kaki.", "Agak demam, sendi pegal-pegal juga."],
        physicalExamFindings: { general: "Tampak tidak nyaman.", vitals: "TD 120/80, N 82x, RR 18x, S 37.5°C", skin: "Regio pretibial bilateral: Nodul subkutan 2-4cm, eritematosa, nyeri tekan (+), hangat, tidak berfluktuasi. Bilateral simetris." },
        labs: { "LED": { result: "45 mm/jam (meningkat)", cost: 25000 } },
        vitals: { temp: 37.5, bp: '120/80', hr: 82, rr: 18 },
        correctTreatment: ['ibuprofen_400', 'bed_rest'],
        correctProcedures: [],
        requiredEducation: ['rest_and_elevation', 'treat_underlying_cause', 'self_limited_3_6_weeks'],
        risk: 'low', nonReferrable: true, referralExceptions: ['recurrent', 'suspected_sarcoidosis', 'ulceration'],
        differentialDiagnosis: ['L52', 'M79.3']
    },
    {
        id: 'kornu_kutaneum',
        diagnosis: 'Kornu Kutaneum',
        icd10: 'L85.8',
        skdi: '4A',
        category: 'Dermatology',
        symptoms: ['Tanduk kulit', 'Pertumbuhan keratin berlebih', 'Area terpajan matahari', 'Basis perlu dievaluasi'],
        clue: "Proyeksi keratin berbentuk tanduk di kulit, sering di area terpajan matahari (wajah, telinga, punggung tangan). Perlu EVALUASI BASIS: >1/3 base-to-height ratio → curiga keganasan (SCC). Eksisi + PA!",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Ini kenapa ya pak/bu, di kulitnya?', response: 'Ada tumbuh kayak tanduk kecil di telinga dok, sudah berbulan-bulan.', sentiment: 'confirmation', priority: 'essential' }],
            rps: [
                { id: 'q_growth', text: 'Tumbuhnya cepat nggak?', response: 'Pelan-pelan dok, tapi makin lama makin panjang.', sentiment: 'confirmation' },
                { id: 'q_pain', text: 'Sakit nggak?', response: 'Nggak sakit dok, cuma mengganggu aja.', sentiment: 'confirmation' }
            ],
            rpd: [{ id: 'q_sun', text: 'Sering terpapar sinar matahari?', response: 'Iya dok, saya petani, tiap hari di sawah.', sentiment: 'neutral' }],
            rpk: [], sosial: []
        },
        essentialQuestions: ['q_main'],
        anamnesis: ["Ada tumbuh kayak tanduk kecil di telinga dok.", "Pelan-pelan tumbuhnya, nggak sakit, saya sering di matahari."],
        physicalExamFindings: { general: "Tampak baik.", vitals: "TD 130/80, N 76x, RR 18x, S 36.5°C", skin: "Regio aurikula dekstra: Proyeksi keratin conical 1.5cm, basis eritematosa 0.5cm, tidak nyeri tekan, tidak ada ulserasi." },
        labs: {}, vitals: { temp: 36.5, bp: '130/80', hr: 76, rr: 18 },
        correctTreatment: ['observation'],
        correctProcedures: ['excision_biopsy'],
        requiredEducation: ['sun_protection', 'monitor_regrowth', 'pathology_check_basis'],
        risk: 'low', nonReferrable: true, referralExceptions: ['suspected_scc', 'recurrence', 'large_base'],
        differentialDiagnosis: ['L85.8', 'C44.9']
    },
    // === SKDI 1-3 REFERRAL CASES ===
    {
        id: 'sjs',
        diagnosis: 'Sindrom Stevens-Johnson',
        icd10: 'L51.1',
        skdi: '3B',
        category: 'Dermatology',
        symptoms: ['Lesi target kulit luas', 'Erosi mukosa mulut/mata/genital', 'Demam', 'Riwayat obat baru'],
        clue: "EMERGENCY KULIT! Reaksi obat berat: lesi target atypical + erosi 2+ mukosa (mulut, mata, genital) + epidermolisis <10% BSA. Trigger obat tersering: sulfonamid, NSAID, allopurinol, antikonvulsan. STOP obat penyebab! Rujuk ICU/burn unit!",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Apa yang terjadi?', response: 'Kulit saya melepuh-melepuh dok, mulut sariawan parah, mata merah, nggak bisa makan.', sentiment: 'confirmation', priority: 'essential' }],
            rps: [
                { id: 'q_drug', text: 'Minum obat baru akhir-akhir ini?', response: 'Iya dok, baru minum obat asam urat seminggu lalu (allopurinol).', sentiment: 'neutral', priority: 'essential' },
                { id: 'q_mucosa', text: 'Lubang badan lain terkena?', response: 'Mata merah bernanah, kemaluan juga luka perih.', sentiment: 'confirmation' }
            ],
            rpd: [], rpk: [], sosial: []
        },
        essentialQuestions: ['q_main', 'q_drug'],
        anamnesis: ["Kulit melepuh, sariawan parah, mata merah, nggak bisa makan.", "Baru minum allopurinol seminggu lalu."],
        physicalExamFindings: { general: "Demam 39°C, tampak sakit berat.", vitals: "TD 100/60, N 110x, RR 22x, S 39°C", skin: "Lesi target atipikal dan makulopapular eritematosus difus. Nikolsky (+) fokal. BSA terlibat ~8%. Erosi mukosa oral (+), konjungtiva (+), genital (+)." },
        labs: {}, vitals: { temp: 39, bp: '100/60', hr: 110, rr: 22 },
        correctTreatment: ['stop_offending_drug', 'rl_1000', 'dexamethasone_inj'],
        correctProcedures: ['iv_access', 'monitor_vital', 'wound_care'],
        requiredEducation: ['life_threatening', 'burn_unit_care', 'drug_allergy_card', 'never_use_offending_drug'],
        risk: 'critical', nonReferrable: false, referralTarget: 'rs_provinsi',
        differentialDiagnosis: ['L51.1', 'L51.2']
    },
    {
        id: 'psoriasis_vulgaris',
        diagnosis: 'Psoriasis Vulgaris',
        icd10: 'L40.0',
        skdi: '3A',
        category: 'Dermatology',
        symptoms: ['Plak merah bersisik tebal putih', 'Predileksi siku lutut scalp', 'Auspitz sign', 'Kuku pitting'],
        clue: "Plak eritematosus batas tegas + skuama putih tebal (silvery scale). Predileksi: siku, lutut, scalp, lumbosakral. Auspitz sign (+): pinpoint bleeding setelah kerokan. Koebner phenomenon. Topikal steroid kuat + emolien + rujuk sistremik jika luas.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Kulitnya kenapa?', response: 'Kulit saya muncul bercak-bercak merah tebal bersisik putih dok, di siku, lutut, dan kepala.', sentiment: 'confirmation', priority: 'essential' }],
            rps: [
                { id: 'q_chronic', text: 'Sudah berapa lama?', response: '2 tahun dok, hilang timbul, makin luas.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_itch', text: 'Gatal?', response: 'Kadang gatal, tapi lebih malu karena kelihatan.', sentiment: 'confirmation' }
            ],
            rpd: [], rpk: [{ id: 'q_fam', text: 'Keluarga ada yang begini?', response: 'Ayah saya juga ada psoriasis.', sentiment: 'confirmation' }],
            sosial: [{ id: 'q_stress', text: 'Akhir-akhir ini stres?', response: 'Iya dok, pekerjaan banyak deadline.', sentiment: 'confirmation' }]
        },
        essentialQuestions: ['q_main', 'q_chronic'],
        anamnesis: ["Bercak merah bersisik putih di siku, lutut, kepala, 2 tahun.", "Hilang timbul, ayah juga psoriasis, stres."],
        physicalExamFindings: { general: "Tampak baik.", vitals: "Normal", skin: "Plak eritematosus batas tegas dengan skuama silvery di bilateral siku, lutut, dan scalp. Auspitz sign (+). Kuku: pitting (+) beberapa jari. PASI score ~12 (moderate)." },
        labs: {}, vitals: { temp: 36.7, bp: '120/80', hr: 78, rr: 18 },
        correctTreatment: ['betamethasone_valerate_cream', 'emollient', 'calcipotriol_cream'],
        correctProcedures: [],
        requiredEducation: ['chronic_disease', 'trigger_avoidance', 'stress_management', 'systemic_therapy_referral'],
        risk: 'low', nonReferrable: false, referralTarget: 'rs_kabupaten',
        differentialDiagnosis: ['L40.0', 'L30.9']
    },
    {
        id: 'pemfigus_vulgaris',
        diagnosis: 'Pemfigus Vulgaris',
        icd10: 'L10.0',
        skdi: '2',
        category: 'Dermatology',
        symptoms: ['Bula kendor mudah pecah', 'Erosi luas', 'Nikolsky sign positif', 'Erosi mulut'],
        clue: "Bula KENDOR (flaccid) pada kulit normal → mudah pecah → erosi luas yang sulit sembuh. Nikolsky sign (+): kulit terkelupas saat digeser. Sering mulai di MUKOSA ORAL. Autoimun berat. Rujuk SEGERA untuk imunosupresan!",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Kulitnya kenapa?', response: 'Kulit saya melepuh-lepuh terus dok, pecah jadi luka, nggak sembuh-sembuh, mulut juga sariawan parah.', sentiment: 'confirmation', priority: 'essential' }],
            rps: [
                { id: 'q_oral', text: 'Mulut dulu ya yang kena?', response: 'Iya dok, awalnya sariawan parah 2 bulan lalu, baru setelah itu kulit ikut.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_healing', text: 'Lukanya sembuh nggak?', response: 'Susah sembuh dok, yang lama belum tutup sudah muncul yang baru.', sentiment: 'confirmation' }
            ],
            rpd: [], rpk: [], sosial: []
        },
        essentialQuestions: ['q_main', 'q_oral'],
        anamnesis: ["Kulit melepuh pecah jadi luka nggak sembuh, sariawan parah.", "Mulut duluan 2 bulan lalu, baru kulit."],
        physicalExamFindings: { general: "Tampak lemah, nyeri.", vitals: "TD 110/70, N 88x, RR 18x, S 37.5°C", skin: "Bula flaksid multipel pada batang tubuh dan ekstremitas. Erosi luas dengan dasar merah basah. Nikolsky sign (+). Erosi mukosa oral difus." },
        labs: {}, vitals: { temp: 37.5, bp: '110/70', hr: 88, rr: 18 },
        correctTreatment: ['wound_care', 'paracetamol_500'],
        correctProcedures: ['wound_dressing'],
        requiredEducation: ['autoimmune_disease', 'immunosuppressant_needed', 'dermatology_referral_urgent'],
        risk: 'high', nonReferrable: false, referralTarget: 'rs_provinsi',
        differentialDiagnosis: ['L10.0', 'L12.0']
    },
    {
        id: 'luka_bakar_derajat_3',
        diagnosis: 'Luka Bakar Derajat 3 (Full Thickness)',
        icd10: 'T30.3',
        skdi: '3B',
        category: 'Dermatology',
        symptoms: ['Luka bakar putih/coklat', 'Tidak nyeri (nerve damage)', 'Kulit seperti lilin/kulit', 'Luas >20% BSA'],
        clue: "Luka bakar FULL THICKNESS: kulit putih/coklat seperti lilin, TIDAK NYERI (saraf rusak). Rule of 9 untuk BSA. Resusitasi Parkland formula: 4ml x kg x %BSA (50% dalam 8 jam pertama). Intubasi jika inhalasi injury!",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Apa yang terjadi?', response: 'Kebakaran di rumah dok, tangan dan badan kena api.', sentiment: 'neutral', priority: 'essential' }],
            rps: [
                { id: 'q_mechanism', text: 'Apinya dari apa?', response: 'Kompor gas meledak dok, langsung kena badan.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_inhalation', text: 'Sempat hirup asap? Sesak napas?', response: 'Iya dok, banyak asap, agak sesak.', sentiment: 'confirmation' }
            ],
            rpd: [], rpk: [], sosial: []
        },
        essentialQuestions: ['q_main', 'q_mechanism'],
        anamnesis: ["Kompor gas meledak, kena tangan dan badan.", "Hirup asap, agak sesak."],
        physicalExamFindings: { general: "Tampak sakit berat, luka luas.", vitals: "TD 90/60, N 120x, RR 26x, S 36.5°C", skin: "Luka bakar grade III: kulit putih seperti lilin di lengan kanan, dada anterior, perut. Tidak nyeri saat pinprick. Estimasi BSA: 27% (Rule of 9). Vibrissae nasal TERBAKAR (inhalation injury suspected)." },
        labs: {}, vitals: { temp: 36.5, bp: '90/60', hr: 120, rr: 26 },
        correctTreatment: ['rl_parkland_formula', 'morfin_2_iv', 'ceftriaxone_1g_iv'],
        correctProcedures: ['iv_access_2_lines', 'foley_catheter', 'o2_mask', 'wound_cover_saline_gauze', 'monitor_vital'],
        requiredEducation: ['burn_unit_needed', 'skin_graft_likely', 'inhalation_injury_risk'],
        risk: 'critical', nonReferrable: false, referralTarget: 'rs_provinsi',
        differentialDiagnosis: ['T30.3', 'T30.2']
    }
];
