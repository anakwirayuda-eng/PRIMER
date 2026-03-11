/**
 * @reflection
 * [IDENTITY]: hematology
 * [PURPOSE]: Medical cases for Hematology specialty.
 * [STATE]: Experimental
 * [LAST_UPDATE]: 2026-02-12
 */

export const HEMATOLOGY_CASES = [
    {
        id: 'anemia_deficiency',
        diagnosis: 'Anemia Defisiensi Besi',
        icd10: 'D50.9',
        skdi: '4A',
        category: 'Hematology',
        symptoms: ["Pucat","Lemas","Pusing","Sesak saat aktivitas"],
        clue: "[EBM: WHO] Anemia defisiensi besi — Hb rendah + MCV rendah (mikrositik hipokrom). Evaluasi penyebab: diet, menstruasi, cacing. Suplementasi Fe 2-3 bulan.",
        relevantLabs: ["Darah Lengkap"],
        anamnesisQuestions: {
            keluhan_utama: [
                { id: 'q_main', text: 'Ada keluhan apa?', response: 'Badan lemas terus dok, muka pucat, pusing.', sentiment: 'confirmation', priority: 'essential' },
            ],
            rps: [
                { id: 'q_activity', text: 'Ngos-ngosan kalau aktivitas?', response: 'Iya dok, naik tangga aja sudah ngos-ngosan.', sentiment: 'confirmation' },
                { id: 'q_diet', text: 'Makannya gimana? Cukup daging/sayur?', response: 'Jarang makan daging dok, nasi sayur aja.', sentiment: 'confirmation', priority: 'essential' },
            ],
            rpd: [],
            rpk: [],
            sosial: [
                { id: 'q_menstruation', text: 'Haidnya banyak?', response: 'Iya dok, banyak banget sampai ganti pembalut 5-6x.', sentiment: 'confirmation' },
            ],
        },
        essentialQuestions: ["q_main","q_diet"],
        anamnesis: ["Badan lemes dok, cepat capek dan mata berkunang-kunang.", "Pucat, sering pusing, dan konsentrasi berkurang. Sudah sebulan merasa begini."],
        physicalExamFindings: { general: "Tampak pucat (konjungtiva anemis +/+).", vitals: "TD 110/70, N 88x, RR 18x, S 36.5°C", skin: "Koilonychia (+) minimal, pucat (+)." },
        labs: { "Darah Lengkap": { result: "Hb 9.2, MCV 72, MCH 24", cost: 50000 } },
        vitals: { temp: 36.5, bp: '110/70', hr: 88, rr: 18 },
        correctTreatment: ['sulfas_ferosus', 'vit_c_250'],
        correctProcedures: [],
        requiredEducation: ['diet_iron_rich', 'long_term_therapy'],
        risk: 'medium', nonReferrable: true, referralExceptions: ['hb_below_7', 'pregnancy_severe'],
        differentialDiagnosis: ['D50', 'D51']
    },
    {
        id: 'anemia_defisiensi_besi_simptomatik',
        diagnosis: 'Anemia Defisiensi Besi (Simptomatik)',
        icd10: 'D50.9',
        skdi: '4A',
        category: 'Hematology',
        symptoms: ["Pucat berat","Lemas hebat","Takikardia","Koilonychia"],
        clue: "[EBM: BSH 2021] Anemia def. besi simptomatik — Hb <8, evaluasi kehilangan darah kronik. GI workup jika pria/>50th. Fe oral + cari sumber perdarahan.",
        relevantLabs: ["Darah Lengkap","Ferritin"],
        anamnesisQuestions: {
            keluhan_utama: [
                { id: 'q_main', text: 'Lemas banget ya?', response: 'Iya dok, nggak kuat ngapa-ngapain, kepala pusing terus.', sentiment: 'confirmation', priority: 'essential' },
            ],
            rps: [
                { id: 'q_bleeding', text: 'Ada perdarahan? BAB hitam?', response: 'BAB kadang hitam dok.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_pica', text: 'Suka ngidam makan es/tanah?', response: 'Iya dok, suka ngunyah es batu terus.', sentiment: 'confirmation' },
            ],
            rpd: [
                { id: 'q_prev', text: 'Pernah kurang darah sebelumnya?', response: 'Pernah dok, dikasih tablet tambah darah.', sentiment: 'confirmation' },
            ],
            rpk: [],
            sosial: [],
        },
        essentialQuestions: ["q_main","q_bleeding"],
        anamnesis: ["Dada berdebar-debar dok, sesak kalau jalan jauh.", "Wajah dan telapak tangan pucat sekali. Sudah 2 minggu jalan sedikit saja capek banget."],
        physicalExamFindings: { general: "Tampak pucat sekali.", vitals: "TD 100/60, N 105x (takikardi), RR 22x, S 36.6°C", heent: "Konjungtiva anemis (+/+), atrofi papil lidah (+)." },
        labs: { "Darah Lengkap": { result: "Hb 7.5, MCV 68, MCH 21", cost: 50000 } },
        vitals: { temp: 36.6, bp: '100/60', hr: 105, rr: 22 },
        correctTreatment: ['sulfas_ferosus', 'folic_acid_0_4'],
        correctProcedures: ['hospital_referral'],
        requiredEducation: ['diet_iron_rich', 'emergency_signs'],
        risk: 'medium', nonReferrable: true, referralExceptions: ['hb_below_7', 'heart_failure_risk'],
        differentialDiagnosis: ['D50', 'D56']
    },
    {
        id: 'dbd_grade_1',
        diagnosis: 'DBD Grade 1',
        icd10: 'A91',
        skdi: '4A',
        category: 'Hematology',
        symptoms: ["Demam tinggi mendadak","Nyeri otot/sendi","Rumple Leede positif","Trombositopenia"],
        clue: "[EBM: WHO DHF 2011] DBD grade 1 — demam + Rumple Leede (+) + trombositopenia. Monitor ketat fase kritis (hari 3-7). Terapi cairan agresif.",
        relevantLabs: ["Darah Lengkap","NS1 Ag"],
        anamnesisQuestions: {
            keluhan_utama: [
                { id: 'q_main', text: 'Demamnya gimana?', response: 'Demam tinggi mendadak dok, badan linu semua.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_day', text: 'Hari ke berapa demam?', response: 'Sudah hari ke-4 dok.', sentiment: 'confirmation', priority: 'essential' },
            ],
            rps: [
                { id: 'q_bleeding', text: 'Ada mimisan atau gusi berdarah?', response: 'Nggak ada dok.', sentiment: 'denial', priority: 'essential' },
                { id: 'q_warning', text: 'Muntah terus? Nyeri perut?', response: 'Mual aja dok, belum muntah.', sentiment: 'denial' },
            ],
            rpd: [],
            rpk: [
                { id: 'q_neighbor', text: 'Tetangga ada DB?', response: 'Ada dok, RT sebelah banyak.', sentiment: 'confirmation' },
            ],
            sosial: [],
        },
        essentialQuestions: ["q_main","q_day","q_bleeding"],
        anamnesis: ["Demam tinggi mendadak sudah 3 hari, nyeri sendi.", "Kepala pusing banget, mual, dan nggak nafsu makan. Ada bintik-bintik merah di lengan."],
        physicalExamFindings: { general: "Tampak sakit sedang, febris.", vitals: "TD 110/70, N 96x, RR 20x, S 39.2°C", skin: "Uji Rumple Leed (+), petechiae di ekstremitas (+)." },
        labs: { "Darah Lengkap": { result: "Hb 12.5, Hematokrit 40%, Trombosit 98.000", cost: 50000 }, "NS1 Antigen": { result: "Positif (+)", cost: 150000 } },
        relevantLabs: ['lab_hematology', 'lab_ns1'],
        vitals: { temp: 39.2, bp: '110/70', hr: 96, rr: 20 },
        correctTreatment: ['paracetamol_500', 'oralit'],
        correctProcedures: ['hospital_referral'],
        requiredEducation: ['warning_signs_dhf', 'adequate_fluids'],
        risk: 'high', nonReferrable: true, referralExceptions: ['emergency', 'warning_signs_present'],
        differentialDiagnosis: ['A91', 'A90']
    },
    {
        id: 'demam_dengue',
        diagnosis: 'Demam Dengue (Tanpa Warning Signs)',
        icd10: 'A90',
        skdi: '4A',
        category: 'Hematology',
        symptoms: ['Demam tinggi mendadak', 'Nyeri retro-orbital', 'Mialgia', 'Trombosit >100.000'],
        clue: "Dengue TANPA warning signs: demam + nyeri retro-orbital + mialgia + artralgia. Trombosit masih >100.000. Rawat jalan + pantau warning signs. Beda dari DBD!",
        relevantLabs: ['Darah Lengkap', 'NS1 Antigen'],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Demamnya gimana ini pak/bu?', response: 'Demam tinggi mendadak 2 hari, nyeri di belakang mata, badan pegal-pegal.', sentiment: 'confirmation', priority: 'essential' }],
            rps: [{ id: 'q_bleeding', text: 'Ada tanda-tanda perdarahan nggak, kayak mimisan atau gusi berdarah?', response: 'Nggak ada dok.', sentiment: 'denial' }],
            rpd: [], rpk: [], sosial: []
        },
        essentialQuestions: ['q_main', 'q_bleeding'],
        anamnesis: ["Demam tinggi mendadak, pegal-pegal, nyeri belakang mata.", "Demam 2 hari, pusing, mual, nggak nafsu makan."],
        physicalExamFindings: { general: "Sakit sedang, febris.", vitals: "TD 110/70, N 88x, RR 18x, S 39.0°C", skin: "Rumple Leed (-). Petechiae (-)." },
        labs: {
            "Darah Lengkap": { result: "Hb 13.0, Ht 38%, Trombosit 125.000, Leukosit 3.500 (leukopenia)", cost: 50000 },
            "NS1 Antigen": { result: "Positif (+)", cost: 150000 }
        },
        vitals: { temp: 39.0, bp: '110/70', hr: 88, rr: 18 },
        correctTreatment: ['paracetamol_500', 'oralit'],
        correctProcedures: [],
        requiredEducation: ['adequate_fluids', 'warning_signs_dhf', 'daily_platelet_check', 'no_nsaids'],
        risk: 'medium', nonReferrable: true, referralExceptions: ['warning_signs', 'platelet_drop'],
        differentialDiagnosis: ['A90', 'A91']
    },
    {
        id: 'leptospirosis_ringan',
        diagnosis: 'Leptospirosis Ringan',
        icd10: 'A27.9',
        skdi: '4A',
        category: 'Hematology',
        symptoms: ['Demam', 'Nyeri betis', 'Ikterik', 'Riwayat banjir/tikus'],
        clue: "Kontak air terkontaminasi urin tikus (banjir). Demam + nyeri betis + ikterik + conjunctival suffusion. Ringan: doxycycline oral. Berat (Weil's disease) → rujuk!",
        relevantLabs: ['Darah Lengkap'],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Apa yang dirasakan pak/bu?', response: 'Demam tinggi, betis saya sakit banget, mata kuning.', sentiment: 'confirmation', priority: 'essential' }],
            rps: [{ id: 'q_flood', text: 'Akhir-akhir ini kena banjir atau kontak air kotor?', response: 'Iya dok, minggu lalu rumah kebanjiran.', sentiment: 'neutral', priority: 'essential' }],
            rpd: [], rpk: [], sosial: []
        },
        essentialQuestions: ['q_main', 'q_flood'],
        anamnesis: ["Demam tinggi, betis sakit, mata kuning, habis kebanjiran.", "Setelah banjir, demam tinggi dan kaki pegal-pegal banget."],
        physicalExamFindings: { general: "Sakit sedang, ikterik.", vitals: "TD 110/70, N 96x, RR 20x, S 39.0°C", heent: "Conjunctival suffusion (+), sklera ikterik (+).", extremities: "Nyeri tekan otot gastrocnemius bilateral." },
        labs: { "Darah Lengkap": { result: "Leukosit 12.000, trombosit 120.000", cost: 50000 } },
        vitals: { temp: 39.0, bp: '110/70', hr: 96, rr: 20 },
        correctTreatment: ['doxycycline_100', 'paracetamol_500'],
        correctProcedures: [],
        requiredEducation: ['complete_antibiotics', 'avoid_flood_water', 'rat_control'],
        risk: 'medium', nonReferrable: true, referralExceptions: ['weil_disease', 'renal_failure', 'hemorrhagic'],
        differentialDiagnosis: ['A27.9', 'A91']
    },
    {
        id: 'limfadenitis',
        diagnosis: 'Limfadenitis',
        icd10: 'L04.9',
        skdi: '4A',
        category: 'Hematology',
        symptoms: ['Benjolan nyeri di leher/ketiak/selangkangan', 'Merah bengkak', 'Demam'],
        clue: "Kelenjar getah bening membesar, nyeri, ertema → infeksi. Cari fokus infeksi primer! AB empiris (amox-clav). Jika abses → insisi drainase. KGB keras/tidak nyeri → curiga keganasan → rujuk!",
        relevantLabs: ['Darah Lengkap'],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Benjolannya yang di mana ini pak/bu?', response: 'Benjolan di leher dok, sakit dan makin besar.', sentiment: 'confirmation', priority: 'essential' }],
            rps: [{ id: 'q_infection', text: 'Akhir-akhir ini ada sakit gigi atau sakit tenggorokan?', response: 'Iya dok, sakit gigi sudah seminggu sebelumnya.', sentiment: 'confirmation' }],
            rpd: [], rpk: [], sosial: []
        },
        essentialQuestions: ['q_main', 'q_infection'],
        anamnesis: ["Benjolan di leher sakit dan membesar.", "Ada benjolan di ketiak, merah nyeri."],
        physicalExamFindings: { general: "Sakit ringan.", vitals: "TD 120/80, N 84x, RR 18x, S 37.8°C", neck: "KGB submandibular sinistra: 3x2 cm, nyeri tekan (+), mobile, eritema (+), hangat, fluktuasi (-). Gigi karies (+) regio molar inferior." },
        labs: { "Darah Lengkap": { result: "Leukosit 14.000 (shift to the left)", cost: 50000 } },
        vitals: { temp: 37.8, bp: '120/80', hr: 84, rr: 18 },
        correctTreatment: ['amoxicillin_clavulanate_625', 'paracetamol_500'],
        correctProcedures: [],
        requiredEducation: ['complete_antibiotics', 'treat_primary_infection'],
        risk: 'low', nonReferrable: true, referralExceptions: ['abscess', 'suspected_malignancy', 'tb_lymphadenitis'],
        differentialDiagnosis: ['L04.9', 'C77.9']
    },
    {
        id: 'reaksi_anafilaktik',
        diagnosis: 'Reaksi Anafilaktik',
        icd10: 'T78.2',
        skdi: '4A',
        category: 'Hematology',
        symptoms: ['Sesak napas mendadak', 'Gatal seluruh tubuh', 'Bengkak bibir/lidah', 'Tekanan darah turun', 'Urtikaria difus'],
        clue: "Reaksi hipersensitivitas tipe I BERAT: onset menit setelah paparan allergen. Urtikaria difus, angioedema, bronkospasme, hipotensi → SYOK. EPINEFRIN IM 0.3ml (1:1000) di paha anterolateral! ABC stabilization!",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Apa yang terjadi?', response: 'Sesak napas mendadak dok, badan gatal semua, bibir bengkak.', sentiment: 'confirmation', priority: 'essential' }],
            rps: [
                { id: 'q_trigger', text: 'Habis makan atau minum obat apa?', response: 'Habis minum obat amoxicillin tadi dok, belum 15 menit langsung begini.', sentiment: 'denial', priority: 'essential' },
                { id: 'q_allergy', text: 'Pernah alergi obat sebelumnya?', response: 'Belum pernah dok, ini pertama kali.', sentiment: 'denial' }
            ],
            rpd: [], rpk: [], sosial: []
        },
        essentialQuestions: ['q_main', 'q_trigger'],
        anamnesis: ["Sesak napas mendadak habis minum obat, gatal seluruh tubuh.", "Bibir bengkak, pusing, lemas banget."],
        physicalExamFindings: { general: "Tampak gelisah, sesak berat, diaforetik.", vitals: "TD 80/50, N 120x, RR 30x, S 36.5°C, SpO2 90%", skin: "Urtikaria generalisata, angioedema bibir dan kelopak mata (+).", thorax: "Wheezing (+/+) bilateral." },
        labs: {}, vitals: { temp: 36.5, bp: '80/50', hr: 120, rr: 30 },
        correctTreatment: ['epinefrin_im', 'rl_500', 'dexamethasone_inj', 'diphenhydramine_inj'],
        correctProcedures: ['airway_management', 'iv_access', 'monitor_vital'],
        requiredEducation: ['allergen_avoidance', 'epipen_education', 'medic_alert_bracelet'],
        risk: 'critical', nonReferrable: false,
        differentialDiagnosis: ['T78.2', 'T78.0']
    },
    // === SKDI 1-3 REFERRAL CASES ===
    {
        id: 'dss',
        diagnosis: 'Dengue Shock Syndrome (DSS)',
        icd10: 'A91',
        skdi: '3B',
        category: 'Hematology',
        symptoms: ['Demam tinggi turun mendadak', 'Akral dingin', 'Nadi cepat lemah', 'Hemokonsentrasi'],
        clue: "DBD grade III-IV: syok! Demam turun (hari 3-7) + tanda syok: nadi cepat lemah, TD sempit (<20mmHg) atau hipotensi, akral dingin, gelisah. Hemokonsentrasi (Ht naik >20%). RESUSITASI CAIRAN AGRESIF: RL 20ml/kg guyur!",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Apa yang terjadi?', response: 'Anak saya demam 4 hari, tadi sore demamnya turun tapi malah lemas banget, tangan kakinya dingin!', sentiment: 'confirmation', priority: 'essential' }],
            rps: [
                { id: 'q_defervescence', text: 'Demamnya turun kapan?', response: 'Tadi sore dok, saya kira sudah sembuh, tapi malah makin lemas.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_bleeding', text: 'Ada perdarahan?', response: 'Mimisan tadi, gusi juga berdarah.', sentiment: 'confirmation' }
            ],
            rpd: [], rpk: [], sosial: []
        },
        essentialQuestions: ['q_main', 'q_defervescence'],
        anamnesis: ["Demam 4 hari lalu turun, malah lemas, akral dingin.", "Mimisan, gusi berdarah."],
        physicalExamFindings: { general: "Gelisah, pucat, akral dingin dan lembab.", vitals: "TD 80/60 (pulse pressure <20), N 130x lemah, RR 28x, S 36°C", skin: "Petekie (+) difus. Rumple Leede (+). CRT >3 detik. Hepatomegali (+)." },
        labs: { "Darah Lengkap": { result: "Hb 16.5, Ht 48% (naik dari 38%), Trombosit 25.000, Leukosit 3.500", cost: 50000 } },
        vitals: { temp: 36, bp: '80/60', hr: 130, rr: 28 },
        correctTreatment: ['rl_20ml_kg_guyur', 'rl_maintenance'],
        correctProcedures: ['iv_access', 'monitor_vital_15min', 'foley_catheter', 'cek_ht_serial'],
        requiredEducation: ['life_threatening', 'icu_monitoring', 'transfusion_may_needed'],
        risk: 'critical', nonReferrable: false, referralTarget: 'rs_kabupaten',
        differentialDiagnosis: ['A91', 'A97.0']
    },
    {
        id: 'sepsis',
        diagnosis: 'Sepsis',
        icd10: 'A41.9',
        skdi: '3B',
        category: 'Hematology',
        symptoms: ['Demam tinggi atau hipotermia', 'Takikardia', 'Takipnea', 'Altered mental status', 'Sumber infeksi'],
        clue: "qSOFA ≥2: RR ≥22, altered mental, SBP ≤100. HOUR-1 BUNDLE: kultur darah → antibiotik broad-spectrum IV dalam 1 JAM → resusitasi cairan 30ml/kg → cek laktat → vasopressor jika hipotensi persisten. JANGAN TUNDA!",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Apa yang terjadi?', response: 'Bapak saya demam tinggi 3 hari dok, sekarang nggak sadar, ngomong ngelantur.', sentiment: 'confirmation', priority: 'essential' }],
            rps: [
                { id: 'q_source', text: 'Ada luka atau infeksi sebelumnya?', response: 'Luka di kaki yang nggak sembuh-sembuh dok, makin merah dan bengkak.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_altered', text: 'Kapan mulai nggak sadar?', response: 'Tadi pagi mulai ngelantur, sekarang cuma bisa dipanggil.', sentiment: 'confirmation' }
            ],
            rpd: [{ id: 'q_dm', text: 'Ada kencing manis?', response: 'Iya dok, kencing manis, nggak kontrol.', sentiment: 'denial' }],
            rpk: [], sosial: []
        },
        essentialQuestions: ['q_main', 'q_source'],
        anamnesis: ["Demam 3 hari, sekarang nggak sadar, ngelantur.", "Luka kaki nggak sembuh, DM nggak terkontrol."],
        physicalExamFindings: { general: "Somnolen, GCS E3V3M5=11, tampak sakit berat.", vitals: "TD 85/50, N 130x, RR 28x, S 39.5°C", extremity: "Kaki kanan: ulkus 5x3cm, dasar nekrotik, pus (+), selulitis meluas, bau. Lainnya: akral hangat (warm shock), CRT 2 detik." },
        labs: { "Darah Lengkap": { result: "Leukosit 22.000, shift to left, trombosit 80.000", cost: 50000 } },
        vitals: { temp: 39.5, bp: '85/50', hr: 130, rr: 28 },
        correctTreatment: ['meropenem_1g_iv', 'rl_30ml_kg', 'paracetamol_1g_iv'],
        correctProcedures: ['iv_access_2_lines', 'foley_catheter', 'monitor_vital', 'blood_culture'],
        requiredEducation: ['life_threatening', 'icu_needed', 'source_control_surgery'],
        risk: 'critical', nonReferrable: false, referralTarget: 'rs_kabupaten',
        differentialDiagnosis: ['A41.9', 'R65.2']
    },
    {
        id: 'anemia_hemolitik',
        diagnosis: 'Anemia Hemolitik',
        icd10: 'D59.9',
        skdi: '3A',
        category: 'Hematology',
        symptoms: ['Pucat', 'Ikterik', 'Urin gelap', 'Splenomegali', 'Lemas'],
        clue: "Trias anemia hemolitik: anemia + ikterik + splenomegali. Urin gelap (hemoglobinuria). Bilirubin indirek naik, retikulosit naik, LDH naik. Coombs test untuk autoimun vs non-autoimun. Suportif + asam folat + rujuk hematologi.",
        relevantLabs: ['lab_cbc'],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Ada keluhan apa?', response: 'Badan lemas banget dok, mata kuning, BAK warnanya gelap kayak teh pekat.', sentiment: 'confirmation', priority: 'essential' }],
            rps: [
                { id: 'q_onset', text: 'Kapan mulainya?', response: 'Seminggu ini makin pucat dan lemas, mata kuning 3 hari.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_dark_urine', text: 'BAK-nya gelap?', response: 'Iya dok, kayak coca-cola.', sentiment: 'confirmation' }
            ],
            rpd: [{ id: 'q_drugs', text: 'Minum obat baru?', response: 'Minum obat malaria dapson baru-baru ini.', sentiment: 'neutral' }],
            rpk: [{ id: 'q_fam', text: 'Keluarga ada yang kuning juga?', response: 'Adik saya pernah dok.', sentiment: 'neutral' }],
            sosial: []
        },
        essentialQuestions: ['q_main', 'q_onset'],
        anamnesis: ["Lemas, mata kuning, BAK gelap kayak teh.", "Baru minum dapson, adik pernah kuning juga."],
        physicalExamFindings: { general: "Pucat, ikterik (+).", vitals: "TD 110/70, N 100x, RR 20x, S 37°C", abdomen: "Splenomegali schuffner II. Hepatomegali (-). Konjungtiva anemis (+)." },
        labs: { "Darah Lengkap": { result: "Hb 6.5, retikulosit 8%, MCV 95", cost: 50000 }, "Bilirubin Indirek": { result: "4.2 mg/dL", cost: 50000 } },
        vitals: { temp: 37, bp: '110/70', hr: 100, rr: 20 },
        correctTreatment: ['asam_folat_1', 'stop_offending_drug'],
        correctProcedures: [],
        requiredEducation: ['avoid_oxidant_drugs', 'g6pd_testing', 'transfusion_if_severe', 'hematology_referral'],
        risk: 'high', nonReferrable: false, referralTarget: 'rs_kabupaten',
        differentialDiagnosis: ['D59.9', 'D55.0']
    },
    {
        id: 'artritis_reumatoid',
        diagnosis: 'Artritis Reumatoid',
        icd10: 'M06.9',
        skdi: '3A',
        category: 'Hematology',
        symptoms: ['Nyeri sendi simetris', 'Kaku pagi >1 jam', 'Bengkak sendi MCP/PIP', 'Deformitas'],
        clue: "Poliartritis SIMETRIS kronik + kaku pagi >1 jam. Predileksi: MCP, PIP, pergelangan tangan. Deformitas: boutonniere, swan neck, ulnar deviation. RF (+), anti-CCP (+). NSAID + rujuk DMARD (methotrexate) dari reumatolog.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Sendi mana yang sakit?', response: 'Jari-jari tangan saya bengkak dan sakit dok, dua-duanya, kaku banget kalau pagi.', sentiment: 'confirmation', priority: 'essential' }],
            rps: [
                { id: 'q_stiffness', text: 'Kakunya berapa lama?', response: 'Lebih dari 2 jam dok, baru bisa gerak normal setelah siang.', sentiment: 'denial', priority: 'essential' },
                { id: 'q_symmetry', text: 'Kiri dan kanan sama?', response: 'Iya dok, dua-duanya.', sentiment: 'confirmation' }
            ],
            rpd: [], rpk: [], sosial: []
        },
        essentialQuestions: ['q_main', 'q_stiffness'],
        anamnesis: ["Jari tangan bengkak sakit dua sisi, kaku pagi >2 jam.", "Simetris, sulit menggenggam."],
        physicalExamFindings: { general: "Tampak baik.", vitals: "Normal", musculoskeletal: "Bilateral MCP 2-4 dan PIP 2-3: bengkak, nyeri tekan (+), hangat. Rheumatoid nodule (+) siku kanan. ROM terbatas. Deformitas ulnar deviation awal." },
        labs: { "RF": { result: "Positif (titer 1:160)", cost: 80000 }, "LED": { result: "65 mm/jam", cost: 30000 } },
        vitals: { temp: 36.7, bp: '120/80', hr: 78, rr: 18 },
        correctTreatment: ['natrium_diklofenak_50', 'paracetamol_500'],
        correctProcedures: [],
        requiredEducation: ['chronic_autoimmune', 'dmard_needed', 'joint_protection', 'rheumatology_referral'],
        risk: 'medium', nonReferrable: false, referralTarget: 'rs_kabupaten',
        differentialDiagnosis: ['M06.9', 'M10.9']
    }
];
