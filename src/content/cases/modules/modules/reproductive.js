/**
 * @reflection
 * [IDENTITY]: reproductive
 * [PURPOSE]: Medical cases for Reproductive/KIA specialty.
 * [STATE]: Experimental
 * [LAST_UPDATE]: 2026-02-12
 */

export const REPRODUCTIVE_CASES = [
    {
        id: 'sifilis_stadium_1',
        diagnosis: 'Sifilis Stadium 1 (Chancre)',
        icd10: 'A51.0',
        skdi: '4A',
        category: 'Reproductive',
        symptoms: ["Ulkus genital tidak nyeri","Tepi teratur","Indurasi","Limfadenopati inguinal"],
        clue: "[EBM: CDC STI 2021] Sifilis primer — chancre: ulkus tunggal, tidak nyeri, indurasi, dasar bersih. VDRL/RPR screening. Benzathine penicillin G 2.4 MU IM single dose.",
        relevantLabs: ["VDRL"],
        anamnesisQuestions: {
            keluhan_utama: [
                { id: 'q_main', text: 'Ada keluhan apa?', response: 'Ada luka di kemaluan dok, nggak sakit.', sentiment: 'confirmation', priority: 'essential' },
            ],
            rps: [
                { id: 'q_onset', text: 'Mulai kapan?', response: 'Sekitar 2 minggu lalu dok.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_pain', text: 'Sakit?', response: 'Nggak sakit sama sekali dok.', sentiment: 'denial', priority: 'essential' },
            ],
            rpd: [],
            rpk: [],
            sosial: [
                { id: 'q_sexual', text: 'Riwayat hubungan seksual?', response: 'Baru ganti pasangan dok.', sentiment: 'confirmation' },
            ],
        },
        essentialQuestions: ["q_main","q_onset","q_pain"],
        anamnesis: ["Ada luka di kemaluan dok, tapi tidak sakit sama sekali.", "Baru muncul seminggu yang lalu. Lukanya bersih dan pinggirannya keras."],
        physicalExamFindings: { general: "Tampak baik.", vitals: "TD 120/80, N 80x, RR 18x, S 36.5°C", genitalia: "Ulkus durum: Ulkus tunggal, diameter 1cm, dasar bersih, indurasi (+), nyeri tekan (-)." },
        labs: { "VDRL/RPR": { result: "Reaktif 1:4", cost: 80000 }, "TPHA": { result: "Reaktif (+)", cost: 100000 } },
        vitals: { temp: 36.5, bp: '120/80', hr: 80, rr: 18 },
        correctTreatment: ['benzathine_penicillin_inj'],
        correctProcedures: ['partner_tracing'],
        requiredEducation: ['sexual_abstinence', 'sti_prevention', 'partner_treatment'],
        risk: 'medium', nonReferrable: true, referralExceptions: ['pregnancy', 'penicillin_allergy'],
        differentialDiagnosis: ['A51.0', 'A60.0']
    },
    {
        id: 'gonore_uncomplicated',
        diagnosis: 'Gonore (Uncomplicated)',
        icd10: 'A54.0',
        skdi: '4A',
        category: 'Reproductive',
        symptoms: ["Duh tubuh purulen","Disuria","Uretritis","Onset akut"],
        clue: "[EBM: CDC STI 2021] Gonore — duh tubuh mukopurulen + disuria. Dual therapy: ceftriaxone 500mg IM + azithromycin 1g PO. Test of cure 2 minggu.",
        relevantLabs: ["Gram Stain"],
        anamnesisQuestions: {
            keluhan_utama: [
                { id: 'q_main', text: 'Keluhannya apa?', response: 'Keluar nanah dari kemaluan dok, perih kencing.', sentiment: 'confirmation', priority: 'essential' },
            ],
            rps: [
                { id: 'q_onset', text: 'Kapan mulainya?', response: '3 hari lalu dok, makin banyak nanahnya.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_color', text: 'Warna cairan?', response: 'Kuning kental dok.', sentiment: 'confirmation' },
            ],
            rpd: [],
            rpk: [],
            sosial: [
                { id: 'q_partner', text: 'Pasangan perlu diperiksa juga?', response: 'Iya dok.', sentiment: 'confirmation' },
            ],
        },
        essentialQuestions: ["q_main","q_onset"],
        anamnesis: ["Kencing nanah dok, perih sekali kalau buang air kecil.", "Ujung kemaluan merah dan bengkak. Sudah 3 hari begini setelah kontak berisiko seminggu lalu."],
        physicalExamFindings: { general: "Tampak tidak nyaman.", vitals: "TD 120/80, N 84x, RR 18x, S 37.2°C", genitalia: "OUE: Edema, eritema, discharge mukopurulen (+) kental kekuningan." },
        labs: { "Gram Stain": { result: "Diplokokus Gram Negatif intra-ekstraseluler (+)", cost: 40000 } },
        vitals: { temp: 37.2, bp: '120/80', hr: 84, rr: 18 },
        correctTreatment: ['cefixime_400', 'azithromycin_1g'],
        correctProcedures: ['partner_tracing'],
        requiredEducation: ['sexual_abstinence', 'sti_prevention', 'med_compliance_full'],
        risk: 'medium', nonReferrable: true, referralExceptions: ['complicated_gonorrhea', 'no_improvement'],
        differentialDiagnosis: ['A54.0', 'N34.1']
    },
    {
        id: 'normal_pregnancy',
        diagnosis: 'Persalinan Normal (Kala II)',
        icd10: 'O80.9',
        skdi: '4A',
        category: 'Maternal',
        symptoms: ["Telat haid","Mual pagi","Payudara tegang","Tes kehamilan positif"],
        clue: "[EBM: WHO ANC 2016] Kehamilan normal — ANC minimal 8x. Skrining: Hb, goldarah, HBsAg, HIV, urin, GDS. Suplementasi: asam folat + Fe.",
        relevantLabs: ["Darah Lengkap","Urinalisis"],
        anamnesisQuestions: {
            keluhan_utama: [
                { id: 'q_main', text: 'Ada keluhan apa bu?', response: 'Telat haid 2 bulan dok, testpack positif.', sentiment: 'confirmation', priority: 'essential' },
            ],
            rps: [
                { id: 'q_lmp', text: 'Haid terakhir kapan?', response: '2 bulan lalu dok.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_nausea', text: 'Mual?', response: 'Mual tiap pagi dok, kadang muntah.', sentiment: 'confirmation' },
                { id: 'q_bleeding', text: 'Ada perdarahan?', response: 'Nggak ada dok.', sentiment: 'denial', priority: 'essential' },
            ],
            rpd: [
                { id: 'q_gravida', text: 'Kehamilan ke berapa?', response: 'Kedua dok, yang pertama normal.', sentiment: 'confirmation' },
            ],
            rpk: [],
            sosial: [],
        },
        essentialQuestions: ["q_main","q_lmp","q_bleeding"],
        anamnesis: ["Perut mules-mules dok, rasanya pengen mengejan terus.", "Ketuban sudah pecah tadi di rumah. Mulasnya makin sering dan makin kuat."],
        physicalExamFindings: { general: "Tampak gelisah, mengejan.", vitals: "TD 120/80, N 90x, RR 24x, S 37.0°C", obstetric: "VT: Pembukaan lengkap (10cm), ketuban (-), kepala H-IV, peritineum menonjol, anus membuka." },
        labs: {}, vitals: { temp: 37.0, bp: '120/80', hr: 90, rr: 24 },
        correctTreatment: ['oxytocin_inj'],
        correctProcedures: ['apn_procedures', 'newborn_care'],
        requiredEducation: ['postpartum_care', 'exclusive_breastfeeding'],
        risk: 'high', nonReferrable: true, referralExceptions: ['malpresentation', 'pph', 'fetal_distress'],
        differentialDiagnosis: ['O80.9', 'O62.0']
    },
    {
        id: 'vulvitis',
        diagnosis: 'Vulvitis',
        icd10: 'N76.0',
        skdi: '4A',
        category: 'Reproductive',
        symptoms: ['Gatal vulva', 'Kemerahan', 'Nyeri', 'Keputihan'],
        clue: "Peradangan vulva: eritema, edema, pruritus. Penyebab: iritasi, infeksi (Candida, bakteri), alergi. Identifikasi penyebab + topikal anti-jamur/steroid.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Keluhannya bu?', response: 'Kemaluan saya gatal dan merah dok, perih.', sentiment: 'confirmation', priority: 'essential' }],
            rps: [{ id: 'q_discharge', text: 'Ada keputihan?', response: 'Iya dok, putih kental kayak susu basi.', sentiment: 'confirmation' }],
            rpd: [], rpk: [], sosial: []
        },
        essentialQuestions: ['q_main'],
        anamnesis: ["Kemaluan gatal merah dok, perih.", "Gatal di bawah dok, ada keputihan juga."],
        physicalExamFindings: { general: "Tampak tidak nyaman.", vitals: "TD 120/80, N 78x, RR 18x, S 36.7°C", genitalia: "Vulva: eritema (+), edema minimal, discharge putih kental (cottage cheese-like). Vagina: eritema." },
        labs: {}, vitals: { temp: 36.7, bp: '120/80', hr: 78, rr: 18 },
        correctTreatment: ['clotrimazole_vag', 'fluconazole_150'],
        correctProcedures: [],
        requiredEducation: ['genital_hygiene', 'cotton_underwear', 'avoid_douching'],
        risk: 'low', nonReferrable: true, referralExceptions: ['recurrent'],
        differentialDiagnosis: ['N76.0', 'B37.3']
    },
    {
        id: 'vaginosis_bakterialis',
        diagnosis: 'Vaginosis Bakterialis',
        icd10: 'N77.1',
        skdi: '4A',
        category: 'Reproductive',
        symptoms: ['Keputihan abu-abu', 'Bau amis (fishy)', 'Tanpa gatal'],
        clue: "Keputihan encer abu-abu, bau amis (fishy), pH >4.5, whiff test (+), clue cells. Bukan radang (osis bukan itis). Metronidazole/klindamisin.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Keputihannya gimana bu?', response: 'Keputihan abu-abu bau amis dok, terutama habis hubungan.', sentiment: 'confirmation', priority: 'essential' }],
            rps: [{ id: 'q_itch', text: 'Terasa gatal nggak?', response: 'Nggak gatal dok, cuma bau aja.', sentiment: 'confirmation' }],
            rpd: [], rpk: [], sosial: []
        },
        essentialQuestions: ['q_main'],
        anamnesis: ["Keputihan abu-abu bau amis dok.", "Bau nggak enak di bawah dok, terutama habis hubungan."],
        physicalExamFindings: { general: "Tampak baik.", vitals: "TD 120/80, N 78x, RR 18x, S 36.7°C", genitalia: "Discharge homogen abu-abu tipis, fishy odor. Whiff test (+). pH >4.5." },
        labs: {}, vitals: { temp: 36.7, bp: '120/80', hr: 78, rr: 18 },
        correctTreatment: ['metronidazole_500'],
        correctProcedures: [],
        requiredEducation: ['avoid_douching', 'complete_antibiotics'],
        risk: 'low', nonReferrable: true, referralExceptions: ['pregnancy'],
        differentialDiagnosis: ['N77.1', 'B37.3']
    },
    {
        id: 'salpingitis',
        diagnosis: 'Salpingitis (Pelvic Inflammatory Disease)',
        icd10: 'N70.9',
        skdi: '4A',
        category: 'Reproductive',
        symptoms: ['Nyeri perut bawah', 'Keputihan', 'Demam', 'Nyeri goyang serviks'],
        clue: "PID: nyeri perut bawah + nyeri goyang serviks + keputihan purulent + demam. IMS ascending. AB spektrum luas (doxycycline + metronidazole + ceftriaxone).",
        relevantLabs: ['Darah Lengkap'],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Keluhannya bu?', response: 'Perut bawah sakit banget dok, keputihan bau, demam.', sentiment: 'confirmation', priority: 'essential' }],
            rps: [
                { id: 'q_sex', text: 'Bagaimana aktivitas seksualnya bu?', response: 'Aktif dok, pakai IUD.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_discharge', text: 'Keputihannya seperti apa?', response: 'Kekuningan, bau.', sentiment: 'confirmation' }
            ],
            rpd: [], rpk: [], sosial: []
        },
        essentialQuestions: ['q_main', 'q_sex'],
        anamnesis: ["Perut bawah sakit, keputihan bau, demam.", "Nyeri saat hubungan, keputihan kuning-hijau."],
        physicalExamFindings: { general: "Sakit sedang.", vitals: "TD 110/70, N 92x, RR 20x, S 38.5°C", abdomen: "Nyeri tekan suprapubik (+).", genitalia: "Nyeri goyang serviks (+). Discharge mukopurulen dari OUE." },
        labs: { "Darah Lengkap": { result: "Leukosit 15.000", cost: 50000 } },
        vitals: { temp: 38.5, bp: '110/70', hr: 92, rr: 20 },
        correctTreatment: ['doxycycline_100', 'metronidazole_500', 'ceftriaxone_inj'],
        correctProcedures: ['partner_tracing'],
        requiredEducation: ['complete_antibiotics', 'partner_treatment', 'sti_prevention'],
        risk: 'medium', nonReferrable: true, referralExceptions: ['toa_suspicion', 'no_improvement'],
        differentialDiagnosis: ['N70.9', 'N73.0']
    },
    {
        id: 'kehamilan_normal_anc',
        diagnosis: 'Kehamilan Normal (Antenatal Care)',
        icd10: 'Z34.0',
        skdi: '4A',
        category: 'Maternal',
        symptoms: ['Telat haid', 'Mual muntah pagi', 'Payudara tegang', 'Test pack positif'],
        clue: "ANC terencana: cek kehamilan, TFU, DJJ, tekanan darah, BB, Hb, goldar, HBsAg, HIV, sifilis. Suplementasi Fe + asam folat. 4x ANC minimum.",
        relevantLabs: ['Darah Lengkap', 'Urinalisis', 'Golongan Darah'],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Keluhannya bu?', response: 'Telat haid 2 bulan dok, test pack positif, mual-mual.', sentiment: 'confirmation', priority: 'essential' }],
            rps: [
                { id: 'q_lmp', text: 'HPHT kapan?', response: '2 bulan lalu dok, tanggal 15.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_gravida', text: 'Kehamilan ke berapa?', response: 'Yang pertama dok.', sentiment: 'confirmation', priority: 'essential' }
            ],
            rpd: [{ id: 'q_ht', text: 'Darah tinggi?', response: 'Nggak ada dok.', sentiment: 'denial' }],
            rpk: [], sosial: []
        },
        essentialQuestions: ['q_main', 'q_lmp', 'q_gravida'],
        anamnesis: ["Telat haid 2 bulan, test pack positif, mual.", "Saya hamil dok, mau periksa kehamilan."],
        physicalExamFindings: { general: "Tampak baik.", vitals: "TD 110/70, N 80x, RR 18x, S 36.7°C", obstetric: "TFU: setinggi simfisis (sesuai 8 minggu). DJJ: belum terdengar. Edema (-). Conjunctiva anemis (-)." },
        labs: {
            "Darah Lengkap": { result: "Hb 12.0, Gol. Darah A Rh (+)", cost: 50000 },
            "Urinalisis": { result: "Protein (-), Glukosa (-)", cost: 30000 }
        },
        vitals: { temp: 36.7, bp: '110/70', hr: 80, rr: 18 },
        correctTreatment: ['ferrous_sulfate_300', 'folic_acid_0_4', 'calcium_500'],
        correctProcedures: ['anc_examination'],
        requiredEducation: ['anc_schedule', 'balanced_nutrition', 'danger_signs_pregnancy', 'immunization_tt'],
        risk: 'low', nonReferrable: true, referralExceptions: ['high_risk_pregnancy'],
        differentialDiagnosis: ['Z34.0', 'O02.1']
    },
    {
        id: 'aborsi_komplit',
        diagnosis: 'Abortus Komplit',
        icd10: 'O03.9',
        skdi: '4A',
        category: 'Maternal',
        symptoms: ['Perdarahan per vaginam', 'Nyeri perut bawah', 'Sudah keluar jaringan', 'Perdarahan berkurang'],
        clue: "Hasil konsepsi sudah keluar lengkap, perdarahan berkurang, OUE menutup. Konfirmasi USG: kavum uteri kosong. Observasi + suplementasi Fe.",
        relevantLabs: ['Darah Lengkap'],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Apa yang terjadi bu?', response: 'Saya keguguran dok, sudah keluar gumpalan daging, sekarang darahnya berkurang.', sentiment: 'confirmation', priority: 'essential' }],
            rps: [{ id: 'q_ga', text: 'Umur kehamilan?', response: '8 minggu dok.', sentiment: 'confirmation', priority: 'essential' }],
            rpd: [], rpk: [], sosial: []
        },
        essentialQuestions: ['q_main', 'q_ga'],
        anamnesis: ["Keguguran, sudah keluar jaringan, darah berkurang.", "Saya habis keguguran dok, sekarang masih flek sedikit."],
        physicalExamFindings: { general: "Pucat ringan.", vitals: "TD 100/60, N 84x, RR 18x, S 36.7°C", obstetric: "VT: OUE menutup, uterus antefleksi sesuai 6 minggu, nyeri tekan minimal. Perdarahan aktif (-)." },
        labs: { "Darah Lengkap": { result: "Hb 10.0", cost: 50000 } },
        vitals: { temp: 36.7, bp: '100/60', hr: 84, rr: 18 },
        correctTreatment: ['ferrous_sulfate_300', 'methylergometrine'],
        correctProcedures: [],
        requiredEducation: ['rest', 'adequate_nutrition', 'follow_up_1_week', 'contraception_counseling'],
        risk: 'medium', nonReferrable: true, referralExceptions: ['incomplete_suspicion', 'heavy_bleeding'],
        differentialDiagnosis: ['O03.9', 'O06.9']
    },
    {
        id: 'anemia_kehamilan',
        diagnosis: 'Anemia Defisiensi Besi pada Kehamilan',
        icd10: 'O99.0',
        skdi: '4A',
        category: 'Maternal',
        symptoms: ['Lemas', 'Pucat', 'Pusing', 'Hamil'],
        clue: "Anemia pada ibu hamil (Hb <11 g/dL). Hemodilusi fisiologis + kebutuhan Fe meningkat. Suplementasi Fe + asam folat dosis terapi.",
        relevantLabs: ['Darah Lengkap'],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Keluhannya bu?', response: 'Lemas terus dok, pucat, pusing. Saya hamil 6 bulan.', sentiment: 'confirmation', priority: 'essential' }],
            rps: [{ id: 'q_diet', text: 'Sehari-harinya makan apa bu?', response: 'Jarang makan daging dok, sayur juga jarang.', sentiment: 'neutral' }],
            rpd: [], rpk: [], sosial: []
        },
        essentialQuestions: ['q_main'],
        anamnesis: ["Lemas dan pucat dok, saya hamil 6 bulan.", "Pusing terus, mata berkunang-kunang, hamil."],
        physicalExamFindings: { general: "Pucat, konjungtiva anemis.", vitals: "TD 100/60, N 92x, RR 20x, S 36.7°C", obstetric: "TFU 24 cm, DJJ 140x, presentasi kepala." },
        labs: { "Darah Lengkap": { result: "Hb 9.0, MCV 70 (mikrositik hipokrom)", cost: 50000 } },
        vitals: { temp: 36.7, bp: '100/60', hr: 92, rr: 20 },
        correctTreatment: ['ferrous_sulfate_300', 'folic_acid_0_4', 'vit_c_250'],
        correctProcedures: [],
        requiredEducation: ['iron_rich_food', 'take_with_vitamin_c', 'avoid_tea_with_iron'],
        risk: 'medium', nonReferrable: true, referralExceptions: ['hb_below_7', 'severe_symptoms'],
        differentialDiagnosis: ['O99.0', 'D50.9']
    },
    {
        id: 'ruptur_perineum_12',
        diagnosis: 'Ruptur Perineum Tingkat 1-2',
        icd10: 'O70.0',
        skdi: '4A',
        category: 'Maternal',
        symptoms: ['Robekan perineum pasca persalinan', 'Perdarahan dari laserasi', 'Nyeri perineum'],
        clue: "Tingkat 1: mukosa vagina/kulit perineum. Tingkat 2: otot perineum. Dijahit lapis demi lapis dengan chromic catgut. Tingkat 3-4 → rujuk!",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Bagaimana persalinannya?', response: 'Baru saja melahirkan normal dok, tapi perineum robek.', sentiment: 'denial', priority: 'essential' }],
            rps: [], rpd: [], rpk: [], sosial: []
        },
        essentialQuestions: ['q_main'],
        anamnesis: ["Baru melahirkan, perineum robek.", "Jahitan dok, bawah robek."],
        physicalExamFindings: { general: "Post partum.", vitals: "TD 110/70, N 84x, RR 18x, S 36.7°C", obstetric: "Ruptur perineum grade 2: melibatkan mukosa vagina, kulit perineum, dan otot perineum. Sfingter ani intak." },
        labs: {}, vitals: { temp: 36.7, bp: '110/70', hr: 84, rr: 18 },
        correctTreatment: ['paracetamol_500', 'amoxicillin_500'],
        correctProcedures: ['perineum_repair'],
        requiredEducation: ['perineal_care', 'sitz_bath', 'pelvic_floor_exercise'],
        risk: 'low', nonReferrable: true, referralExceptions: ['grade_3_4', 'hematoma'],
        differentialDiagnosis: ['O70.0', 'O70.1']
    },
    {
        id: 'mastitis',
        diagnosis: 'Mastitis',
        icd10: 'O91.2',
        skdi: '4A',
        category: 'Maternal',
        symptoms: ['Payudara bengkak merah', 'Nyeri', 'Demam', 'Ibu menyusui'],
        clue: "Ibu menyusui + payudara merah, bengkak, nyeri, demam → mastitis. Lanjutkan menyusui! AB (cloxacillin/amox-clav) + kompres hangat. Abses → insisi drainase.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Ada apa ini bu?', response: 'Payudara saya bengkak merah sakit dok, demam juga.', sentiment: 'confirmation', priority: 'essential' }],
            rps: [{ id: 'q_bf', text: 'Masih menyusui bu?', response: 'Iya dok, tapi sakit banget.', sentiment: 'confirmation', priority: 'essential' }],
            rpd: [], rpk: [], sosial: []
        },
        essentialQuestions: ['q_main', 'q_bf'],
        anamnesis: ["Payudara bengkak merah sakit, demam.", "Payudara saya meradang dok, nggak bisa nyusuin."],
        physicalExamFindings: { general: "Sakit sedang, demam.", vitals: "TD 110/70, N 88x, RR 18x, S 38.5°C", breast: "Payudara kanan: eritema sektoral kuadran lateral atas, edema, nyeri tekan (+), hangat. Fluktuasi (-). ASI masih keluar." },
        labs: {}, vitals: { temp: 38.5, bp: '110/70', hr: 88, rr: 18 },
        correctTreatment: ['cloxacillin_500', 'paracetamol_500'],
        correctProcedures: [],
        requiredEducation: ['continue_breastfeeding', 'warm_compress', 'proper_latch', 'empty_breast'],
        risk: 'medium', nonReferrable: true, referralExceptions: ['abscess', 'no_improvement'],
        differentialDiagnosis: ['O91.2', 'N61']
    },
    {
        id: 'cracked_nipple',
        diagnosis: 'Cracked Nipple (Puting Lecet)',
        icd10: 'O92.1',
        skdi: '4A',
        category: 'Maternal',
        symptoms: ['Puting lecet/pecah-pecah', 'Nyeri saat menyusui', 'Perdarahan puting'],
        clue: "Lecet/fissura puting akibat posisi dan perlekatan menyusui yang salah. Koreksi latch! Oleskan ASI pada puting setelah menyusui, lanolin.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Putingnya kenapa bu?', response: 'Puting saya lecet dan berdarah dok, sakit banget kalau nyusuin.', sentiment: 'confirmation', priority: 'essential' }],
            rps: [{ id: 'q_latch', text: 'Cara menyusuinya gimana bu, bisa ceritakan?', response: 'Bayi cuma nempel di ujung puting aja dok.', sentiment: 'confirmation', priority: 'essential' }],
            rpd: [], rpk: [], sosial: []
        },
        essentialQuestions: ['q_main', 'q_latch'],
        anamnesis: ["Puting lecet berdarah, sakit nyusuin.", "Nggak bisa kasih ASI dok, puting pecah-pecah."],
        physicalExamFindings: { general: "Tampak baik.", vitals: "TD 110/70, N 78x, RR 18x, S 36.7°C", breast: "Puting: fissura (+) pada puting kanan, eritema, crust hemoragik. Tanda mastitis (-)." },
        labs: {}, vitals: { temp: 36.7, bp: '110/70', hr: 78, rr: 18 },
        correctTreatment: ['lanolin_nipple_cream'],
        correctProcedures: ['breastfeeding_counseling'],
        requiredEducation: ['proper_latch_technique', 'apply_breastmilk_on_nipple', 'air_dry'],
        risk: 'low', nonReferrable: true, referralExceptions: ['infection'],
        differentialDiagnosis: ['O92.1', 'O91.0']
    },
    {
        id: 'inverted_nipple',
        diagnosis: 'Inverted Nipple (Puting Masuk)',
        icd10: 'Q83.8',
        skdi: '4A',
        category: 'Maternal',
        symptoms: ['Puting tenggelam', 'Sulit menyusui', 'Bayi sulit melekat'],
        clue: "Puting tidak menonjol/tertarik ke dalam. Hoffman technique + nipple shield. Bayi tetap bisa menyusui dengan teknik yang benar.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Ada apa ini bu, bisa diceritakan?', response: 'Puting saya masuk ke dalam dok, bayi nggak bisa nyusu.', sentiment: 'confirmation', priority: 'essential' }],
            rps: [{ id: 'q_since', text: 'Ini sudah dari kapan putingnya begini?', response: 'Dari sebelum hamil memang begini dok.', sentiment: 'confirmation' }],
            rpd: [], rpk: [], sosial: []
        },
        essentialQuestions: ['q_main'],
        anamnesis: ["Puting masuk ke dalam, bayi nggak bisa nyusu.", "Puting saya tenggelam dok."],
        physicalExamFindings: { general: "Tampak baik.", vitals: "TD 110/70, N 78x, RR 18x, S 36.7°C", breast: "Puting bilateral: grade 2 inverted (dapat dieversi dengan stimulasi tapi retraksi kembali). ASI ada." },
        labs: {}, vitals: { temp: 36.7, bp: '110/70', hr: 78, rr: 18 },
        correctTreatment: ['nipple_shield'],
        correctProcedures: ['breastfeeding_counseling', 'hoffman_technique'],
        requiredEducation: ['hoffman_exercise', 'nipple_stimulation', 'alternative_feeding'],
        risk: 'low', nonReferrable: true, referralExceptions: ['grade_3', 'failure_to_breastfeed'],
        differentialDiagnosis: ['Q83.8', 'N64.5']
    },
    {
        id: 'abses_kelenjar_sebasea',
        diagnosis: 'Abses Folikel Rambut / Kelenjar Sebasea',
        icd10: 'L02.9',
        skdi: '4A',
        category: 'Reproductive',
        symptoms: ['Benjolan nyeri', 'Bengkak merah', 'Fluktuasi', 'Di area genital/perineal'],
        clue: "Abses di area kelamin/perineum dari folikel rambut/kelenjar sebasea. Insisi drainase jika fluktuasi (+). Antibiotik + perawatan luka.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Benjolannya di mana ini pak/bu?', response: 'Di selangkangan dok, bengkak merah sakit banget.', sentiment: 'confirmation', priority: 'essential' }],
            rps: [{ id: 'q_duration', text: 'Sudah berapa hari benjolannya?', response: '3 hari dok, makin besar.', sentiment: 'confirmation' }],
            rpd: [], rpk: [], sosial: []
        },
        essentialQuestions: ['q_main'],
        anamnesis: ["Benjolan sakit di selangkangan dok.", "Ada bisul di area kemaluan, bengkak besar."],
        physicalExamFindings: { general: "Tampak kesakitan.", vitals: "TD 120/80, N 82x, RR 18x, S 37.5°C", genitalia: "Nodus eritematosa diameter 3cm di regio inguinal, nyeri tekan (+), fluktuasi (+), hangat." },
        labs: {}, vitals: { temp: 37.5, bp: '120/80', hr: 82, rr: 18 },
        correctTreatment: ['cloxacillin_500', 'paracetamol_500'],
        correctProcedures: ['incision_drainage'],
        requiredEducation: ['wound_care', 'skin_hygiene', 'follow_up'],
        risk: 'low', nonReferrable: true, referralExceptions: ['bartholin_abscess', 'recurrent'],
        differentialDiagnosis: ['L02.2', 'N75.1']
    },
    // === SKDI 1-3 REFERRAL CASES ===
    {
        id: 'preeklampsia_berat',
        diagnosis: 'Preeklampsia Berat',
        icd10: 'O14.1',
        skdi: '3B',
        category: 'Reproductive',
        symptoms: ['Tekanan darah sangat tinggi (≥160/110)', 'Protein urin', 'Nyeri kepala hebat', 'Pandangan kabur', 'Nyeri ulu hati'],
        clue: "Ibu hamil >20mg, TD ≥160/110 + proteinuria. Tanda impending eklampsia: nyeri kepala hebat, pandangan kabur, nyeri epigastrium. MgSO4 loading dose SEGERA (cegah kejang) + antihipertensi (nifedipine) + rujuk CITO!",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Apa keluhannya bu?', response: 'Kepala saya pusing banget dok, pandangan kabur, ulu hati nyeri, saya hamil 34 minggu.', sentiment: 'confirmation', priority: 'essential' }],
            rps: [
                { id: 'q_visual', text: 'Pandangannya gimana?', response: 'Kayak ada kilatan-kilatan cahaya dok, kabur.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_edema', text: 'Kaki bengkak?', response: 'Bengkak banget dok, muka juga bengkak.', sentiment: 'confirmation' }
            ],
            rpd: [{ id: 'q_anc', text: 'Kontrol kehamilannya teratur?', response: 'Terakhir sebulan lalu, waktu itu darah tinggi 140/90, disuruh istirahat.', sentiment: 'confirmation' }],
            rpk: [{ id: 'q_fam', text: 'Keluarga ada riwayat preeklampsia?', response: 'Ibu saya juga dulu preeklampsia.', sentiment: 'neutral' }],
            sosial: []
        },
        essentialQuestions: ['q_main', 'q_visual'],
        anamnesis: ["Hamil 34 minggu, pusing hebat, pandangan kabur, nyeri ulu hati.", "Kaki dan muka bengkak, darah tinggi bulan lalu."],
        physicalExamFindings: { general: "Tampak kesakitan, edema generalisata.", vitals: "TD 180/120, N 100x, RR 22x, S 36.8°C", extremity: "Edema pretibial bilateral (+3), edema fasial (+). Refleks patella HIPERAKTIF bilateral." },
        labs: { "Protein Urin": { result: "+3", cost: 20000 } },
        vitals: { temp: 36.8, bp: '180/120', hr: 100, rr: 22 },
        correctTreatment: ['mgso4_loading_dose', 'nifedipine_10'],
        correctProcedures: ['iv_access', 'foley_catheter', 'monitor_vital', 'pasang_mgso4'],
        requiredEducation: ['life_threatening', 'eclampsia_risk', 'delivery_may_needed'],
        risk: 'critical', nonReferrable: false, referralTarget: 'rs_kabupaten',
        differentialDiagnosis: ['O14.1', 'O15.0']
    },
    {
        id: 'eklampsia',
        diagnosis: 'Eklampsia',
        icd10: 'O15.0',
        skdi: '3B',
        category: 'Reproductive',
        symptoms: ['Kejang pada ibu hamil', 'Tekanan darah sangat tinggi', 'Penurunan kesadaran', 'Proteinuria'],
        clue: "EMERGENCY OBSTETRI! Kejang pada ibu hamil/nifas + hipertensi + proteinuria. MgSO4 LOADING + MAINTENANCE dosis (4g IV bolus pelan + 6g drip). Stabilisasi → rujuk SEGERA untuk terminasi kehamilan!",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Apa yang terjadi?', response: 'Istri saya kejang-kejang dok, dia hamil 8 bulan!', sentiment: 'confirmation', priority: 'essential' }],
            rps: [
                { id: 'q_seizure', text: 'Kejangnya kapan?', response: 'Barusan dok, tadi di rumah tiba-tiba kejang seluruh badan.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_bp', text: 'Tekanan darahnya tinggi?', response: 'Iya dok, kemarin kontrol 170/110.', sentiment: 'confirmation' }
            ],
            rpd: [], rpk: [], sosial: []
        },
        essentialQuestions: ['q_main', 'q_seizure'],
        anamnesis: ["Ibu hamil 8 bulan kejang-kejang!", "TD kemarin 170/110."],
        physicalExamFindings: { general: "Post-ictal, somnolen, GCS 10.", vitals: "TD 190/120, N 110x, RR 24x, S 37.5°C", neuro: "Post-ictal confusion. Refleks patella hiperaktif. Proteinuria +3." },
        labs: {}, vitals: { temp: 37.5, bp: '190/120', hr: 110, rr: 24 },
        correctTreatment: ['mgso4_loading_dose', 'mgso4_maintenance', 'nifedipine_10'],
        correctProcedures: ['airway_protection', 'iv_access', 'foley_catheter', 'o2_mask', 'monitor_vital', 'left_lateral_position'],
        requiredEducation: ['life_threatening', 'immediate_delivery', 'magnesium_toxicity_monitoring'],
        risk: 'critical', nonReferrable: false, referralTarget: 'rs_kabupaten',
        differentialDiagnosis: ['O15.0', 'G40.9']
    },
    {
        id: 'pph',
        diagnosis: 'Perdarahan Post Partum',
        icd10: 'O72.1',
        skdi: '3B',
        category: 'Reproductive',
        symptoms: ['Perdarahan banyak setelah melahirkan', 'Rahim lembek (atonia)', 'Syok', 'Pucat'],
        clue: "Perdarahan >500ml post-partum. Penyebab terbanyak: ATONIA UTERI (rahim lembek!). 4T: Tone, Tissue, Trauma, Thrombin. Masase fundus + oksitosin 10 IU IV/IM + resusitasi cairan. Kompresi bimanual jika atonia persisten!",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Apa yang terjadi?', response: 'Istri saya habis melahirkan tapi darahnya keluar terus dok, banyak banget!', sentiment: 'neutral', priority: 'essential' }],
            rps: [
                { id: 'q_amount', text: 'Darahnya banyak?', response: 'Banyak banget dok, alas sudah basah semua merah.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_delivery', text: 'Melahirkannya kapan?', response: '1 jam lalu dok, plasenta sudah keluar lengkap.', sentiment: 'confirmation' }
            ],
            rpd: [], rpk: [], sosial: []
        },
        essentialQuestions: ['q_main', 'q_amount'],
        anamnesis: ["Habis melahirkan 1 jam lalu, darah keluar terus banyak.", "Plasenta sudah lengkap."],
        physicalExamFindings: { general: "Pucat, akral dingin.", vitals: "TD 80/50, N 130x, RR 26x, S 36.5°C", abdomen: "Fundus uterus setinggi pusat, konsistensi LUNAK (atonia uteri). Kontraksi tidak adekuat." },
        labs: {}, vitals: { temp: 36.5, bp: '80/50', hr: 130, rr: 26 },
        correctTreatment: ['oksitosin_10_iv', 'rl_1000_guyur', 'misoprostol_800_rektal'],
        correctProcedures: ['uterine_massage', 'bimanual_compression', 'iv_access_2_lines', 'foley_catheter', 'monitor_vital'],
        requiredEducation: ['life_threatening', 'blood_transfusion_needed', 'surgery_if_persistent'],
        risk: 'critical', nonReferrable: false, referralTarget: 'rs_kabupaten',
        differentialDiagnosis: ['O72.1', 'O72.0']
    },
    {
        id: 'kpd',
        diagnosis: 'Ketuban Pecah Dini (KPD)',
        icd10: 'O42.9',
        skdi: '3B',
        category: 'Reproductive',
        symptoms: ['Keluar air dari jalan lahir', 'Sebelum waktu persalinan', 'Cairan jernih bau amis', 'Belum ada kontraksi'],
        clue: "Ketuban pecah sebelum inpartu. Air ketuban: jernih, bau amis, lakmus (+). BAHAYA: infeksi ascending + prolaps tali pusat! Periksa DJJ, jangan VT berulang, antibiotik profilaksis, nilai maturitas janin → rujuk!",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Ada apa bu?', response: 'Keluar air dari bawah dok, banyak, saya hamil 35 minggu tapi belum mules.', sentiment: 'denial', priority: 'essential' }],
            rps: [
                { id: 'q_fluid', text: 'Cairannya seperti apa?', response: 'Jernih agak kekuningan, bau amis, terus-terusan merembes.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_contraction', text: 'Ada kontraksi?', response: 'Belum ada dok, perutnya belum mules.', sentiment: 'denial' }
            ],
            rpd: [], rpk: [], sosial: []
        },
        essentialQuestions: ['q_main', 'q_fluid'],
        anamnesis: ["Hamil 35 minggu keluar air dari jalan lahir, belum mules.", "Cairan jernih bau amis, terus merembes."],
        physicalExamFindings: { general: "Tampak cemas.", vitals: "TD 110/70, N 84x, RR 18x, S 36.8°C", obstetric: "TFU 30cm, DJJ 142x/mnt reguler. Inspekulo: cairan jernih mengalir dari OUE. Lakmus test (+). Kontraksi (-). VT tidak dilakukan." },
        labs: {}, vitals: { temp: 36.8, bp: '110/70', hr: 84, rr: 18 },
        correctTreatment: ['ampicillin_1g_iv', 'dexamethasone_6_im'],
        correctProcedures: ['lakmus_test', 'inspekulo', 'monitor_djj'],
        requiredEducation: ['infection_risk', 'cord_prolapse_risk', 'maturity_assessment_needed'],
        risk: 'high', nonReferrable: false, referralTarget: 'rs_kabupaten',
        differentialDiagnosis: ['O42.9', 'N39.0']
    },
    {
        id: 'abortus_inkomplit',
        diagnosis: 'Abortus Inkomplit',
        icd10: 'O03.4',
        skdi: '3B',
        category: 'Reproductive',
        symptoms: ['Perdarahan pervaginam pada hamil muda', 'Nyeri perut bawah', 'Serviks terbuka', 'Jaringan keluar sebagian'],
        clue: "Perdarahan pervaginam + hamil <20 minggu + serviks TERBUKA + jaringan terlihat/keluar sebagian. Resusitasi jika syok, atasi perdarahan, keluarkan jaringan jika terlihat di OUE, antibiotik profilaksis, rujuk kuretase!",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Apa yang terjadi bu?', response: 'Saya hamil 3 bulan dok, keluar darah banyak dari bawah, ada jaringan ikut keluar.', sentiment: 'confirmation', priority: 'essential' }],
            rps: [
                { id: 'q_bleeding', text: 'Darahnya banyak?', response: 'Banyak dok, ganti pembalut tiap jam.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_pain', text: 'Ada nyeri?', response: 'Sakit perut bawah kayak mules-mules kuat.', sentiment: 'confirmation' }
            ],
            rpd: [], rpk: [], sosial: []
        },
        essentialQuestions: ['q_main', 'q_bleeding'],
        anamnesis: ["Hamil 3 bulan, perdarahan banyak, jaringan keluar.", "Nyeri perut bawah, ganti pembalut tiap jam."],
        physicalExamFindings: { general: "Pucat, tampak kesakitan.", vitals: "TD 90/60, N 110x, RR 22x, S 37°C", obstetric: "Inspekulo: OUE terbuka, jaringan terlihat di kanalis servikalis, perdarahan aktif. VT: serviks terbuka 2 jari, uterus sesuai 10 minggu." },
        labs: { "Hb": { result: "8.0 g/dL", cost: 30000 } },
        vitals: { temp: 37, bp: '90/60', hr: 110, rr: 22 },
        correctTreatment: ['rl_1000', 'oksitosin_10_drip', 'cefadroxil_500'],
        correctProcedures: ['iv_access', 'remove_tissue_at_oue', 'monitor_vital'],
        requiredEducation: ['curettage_needed', 'complete_evacuation', 'blood_transfusion_if_needed'],
        risk: 'high', nonReferrable: false, referralTarget: 'rs_kabupaten',
        differentialDiagnosis: ['O03.4', 'O20.0']
    },
    {
        id: 'hiperemesis_gravidarum',
        diagnosis: 'Hiperemesis Gravidarum',
        icd10: 'O21.1',
        skdi: '3B',
        category: 'Reproductive',
        symptoms: ['Mual muntah berlebihan', 'Dehidrasi', 'Penurunan berat badan', 'Ketosis'],
        clue: "Muntah persisten pada kehamilan trimester 1 → dehidrasi + BB turun >5% + ketosis. Beda dengan morning sickness biasa: tidak bisa makan/minum sama sekali, turgor menurun, mata cekung. Rehidrasi IV + antiemetik + koreksi elektrolit.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Apa keluhannya bu?', response: 'Muntah terus dok, makan nggak bisa, minum juga dimuntahin, saya hamil 2 bulan.', sentiment: 'confirmation', priority: 'essential' }],
            rps: [
                { id: 'q_frequency', text: 'Sehari berapa kali muntah?', response: 'Lebih dari 10 kali dok, isinya cairan kuning.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_intake', text: 'Masih bisa makan minum?', response: 'Nggak bisa sama sekali dok, semua keluar lagi.', sentiment: 'confirmation' }
            ],
            rpd: [], rpk: [], sosial: []
        },
        essentialQuestions: ['q_main', 'q_frequency'],
        anamnesis: ["Hamil 2 bulan, muntah >10x sehari, nggak bisa makan minum.", "Isi muntahan cairan kuning, semua dimuntahin."],
        physicalExamFindings: { general: "Tampak lemah, dehidrasi berat, mata cekung.", vitals: "TD 90/60, N 110x, RR 20x, S 36.5°C", skin: "Turgor kulit menurun, bibir kering pecah-pecah." },
        labs: { "Urinalisa": { result: "Keton +3, BJ >1.030", cost: 30000 } },
        vitals: { temp: 36.5, bp: '90/60', hr: 110, rr: 20 },
        correctTreatment: ['rl_1000', 'ondansetron_4_iv', 'vitamin_b6_25'],
        correctProcedures: ['iv_access', 'monitor_vital', 'intake_output_chart'],
        requiredEducation: ['small_frequent_meals', 'avoid_triggers', 'electrolyte_monitoring'],
        risk: 'medium', nonReferrable: false, referralTarget: 'rs_kabupaten',
        differentialDiagnosis: ['O21.1', 'O21.0']
    }
];
