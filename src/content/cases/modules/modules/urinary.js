/**
 * @reflection
 * [IDENTITY]: urinary
 * [PURPOSE]: Medical cases for Urinary specialty.
 * [STATE]: Experimental
 * [LAST_UPDATE]: 2026-02-12
 */

export const URINARY_CASES = [
    {
        id: 'isk_uncomplicated',
        diagnosis: 'Infeksi Saluran Kemih (Uncomplicated)',
        icd10: 'N39.0',
        skdi: '4A',
        category: 'Urinary',
        anamnesis: ["Anyang-anyangan dok, kencing dikit-dikit dan perih.", "Perut bagian bawah rasanya nyeri. Air kencingnya agak keruh dan baunya tajam."],
        physicalExamFindings: { general: "Tampak tidak nyaman.", vitals: "TD 110/70, N 84x, RR 18x, S 37.4°C", abdomen: "Nyeri tekan suprapubik (+)." },
        labs: { "Urinalisis": { result: "Leukosuria (+++), Nitrit (+)", cost: 40000 } },
        vitals: { temp: 37.4, bp: '110/70', hr: 84, rr: 18 },
        correctTreatment: ['ciprofloxacin_500', 'phenazopyridine_100'],
        correctProcedures: [],
        requiredEducation: ['increased_fluid_intake', 'hygiene_education', 'med_compliance'],
        risk: 'medium', nonReferrable: true, referralExceptions: ['pyelonephritis', 'pregnancy', 'no_improvement'],
        differentialDiagnosis: ['N39.0', 'N30.9']
    },
    {
        id: 'fimosis',
        diagnosis: 'Fimosis',
        icd10: 'N47',
        skdi: '4A',
        category: 'Urinary',
        symptoms: ['Kulup tidak bisa ditarik', 'Sulit kencing', 'Mengembung saat kencing'],
        clue: "Prepuce (kulup) tidak dapat diretraksi. Fisiologis pada bayi <3 tahun. Patologis: BXO (putih, fibrosis). Sirkumsisi jika simptomatik.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Keluhannya apa ini pak/bu?', response: 'Kulup anak saya nggak bisa ditarik dok, pipis susah dan mengembung.', sentiment: 'confirmation', priority: 'essential' }],
            rps: [{ id: 'q_age', text: 'Anaknya umur berapa sekarang?', response: '5 tahun dok.', sentiment: 'confirmation', priority: 'essential' }],
            rpd: [], rpk: [], sosial: []
        },
        essentialQuestions: ['q_main', 'q_age'],
        anamnesis: ["Kulup anak nggak bisa ditarik, kencing susah.", "Pipis anak mengembung di ujung, susah keluar."],
        physicalExamFindings: { general: "Anak tampak baik.", vitals: "TD -, N 90x, RR 20x, S 36.7°C", genitalia: "Prepuce tidak dapat diretraksi. Orifisium preputii sempit (pinhole). Tanda BXO (-). Infeksi (-)." },
        labs: {}, vitals: { temp: 36.7, bp: '-', hr: 90, rr: 20 },
        correctTreatment: ['betamethasone_cream_topical'],
        correctProcedures: ['circumcision'],
        requiredEducation: ['genital_hygiene', 'follow_up'],
        risk: 'low', nonReferrable: true, referralExceptions: ['recurrent_uti', 'bxo'],
        differentialDiagnosis: ['N47', 'N47.1']
    },
    {
        id: 'parafimosis',
        diagnosis: 'Parafimosis',
        icd10: 'N47.2',
        skdi: '4A',
        category: 'Urinary',
        symptoms: ['Kulup terjepit di belakang glans', 'Bengkak glans', 'Nyeri', 'Darurat!'],
        clue: "DARURAT! Kulup terjepit di belakang glans → edema, iskemia. Reduksi manual segera (kompresi + push). Jika gagal → dorsal slit. Jangan biarkan!",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Ada apa ini pak/bu?', response: 'Kulup anak saya ketarik ke belakang nggak bisa balik, bengkak banget.', sentiment: 'confirmation', priority: 'essential' }],
            rps: [{ id: 'q_onset', text: 'Kapan mulai bengkaknya?', response: 'Beberapa jam lalu, makin bengkak.', sentiment: 'confirmation', priority: 'essential' }],
            rpd: [], rpk: [], sosial: []
        },
        essentialQuestions: ['q_main', 'q_onset'],
        anamnesis: ["Kulup anak ketarik ke belakang, bengkak nggak bisa balik!", "Kemaluan anak bengkak dok, kulupnya nyangkut."],
        physicalExamFindings: { general: "Anak menangis kesakitan.", vitals: "TD -, N 110x, RR 24x, S 36.7°C", genitalia: "Prepuce terjepit di corona glandis. Glans edema (+), eritema (+), nyeri tekan (+). Tanda iskemia (-)." },
        labs: {}, vitals: { temp: 36.7, bp: '-', hr: 110, rr: 24 },
        correctTreatment: [],
        correctProcedures: ['manual_reduction_paraphimosis'],
        requiredEducation: ['always_retract_foreskin_back', 'circumcision_counseling'],
        risk: 'high', nonReferrable: true, referralExceptions: ['failed_reduction', 'necrosis'],
        differentialDiagnosis: ['N47.2', 'N48.1']
    },
    // === SKDI 1-3 REFERRAL CASES ===
    {
        id: 'batu_saluran_kemih',
        diagnosis: 'Batu Saluran Kemih (Kolik Renal)',
        icd10: 'N20.0',
        skdi: '3A',
        category: 'Urinary',
        symptoms: ['Nyeri pinggang kolik hebat', 'Hematuria', 'Mual muntah', 'Nyeri menjalar ke selangkangan'],
        clue: "Nyeri kolik HEBAT di pinggang/flank → menjalar ke selangkangan/genital. Hematuria mikroskopis. Nyeri ketok CVA (+). Analgesik kuat (ketorolac/tramadol) + hidrasi + USG ginjal → rujuk urologi.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Nyerinya di mana?', response: 'Pinggang kanan sakit luar biasa dok, menjalar ke bawah.', sentiment: 'confirmation', priority: 'essential' }],
            rps: [
                { id: 'q_radiation', text: 'Menjalar ke mana?', response: 'Ke selangkangan kanan dan kemaluan dok.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_hematuria', text: 'BAK-nya gimana?', response: 'Agak merah dok.', sentiment: 'confirmation' }
            ],
            rpd: [{ id: 'q_stone', text: 'Pernah batu ginjal?', response: 'Pernah dok, 3 tahun lalu.', sentiment: 'neutral' }],
            rpk: [], sosial: []
        },
        essentialQuestions: ['q_main', 'q_radiation'],
        anamnesis: ["Pinggang kanan sakit luar biasa, menjalar ke selangkangan.", "BAK merah, riwayat batu ginjal."],
        physicalExamFindings: { general: "Gelisah, rolling pain.", vitals: "TD 150/90, N 100x, RR 22x, S 37°C", abdomen: "Nyeri ketok CVA kanan (+). Supel." },
        labs: { "Urinalisa": { result: "Eritrosit 50/lpb, kristal kalsium oksalat (+)", cost: 30000 } },
        vitals: { temp: 37, bp: '150/90', hr: 100, rr: 22 },
        correctTreatment: ['ketorolac_30_iv', 'tramadol_50_iv'],
        correctProcedures: ['iv_access', 'usg_ginjal'],
        requiredEducation: ['adequate_hydration', 'urology_referral'],
        risk: 'medium', nonReferrable: false, referralTarget: 'rs_kabupaten',
        differentialDiagnosis: ['N20.0', 'N23']
    },
    {
        id: 'torsio_testis',
        diagnosis: 'Torsio Testis',
        icd10: 'N44.0',
        skdi: '3B',
        category: 'Urinary',
        symptoms: ['Nyeri testis mendadak hebat', 'Testis high-riding', 'Mual muntah', 'Refleks kremaster hilang'],
        clue: "EMERGENCY! Nyeri testis MENDADAK + high-riding + refleks kremaster HILANG. Window <6 JAM! Prehn sign negatif. Manual detorsion → RUJUK BEDAH SEGERA!",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Apa yang terjadi?', response: 'Buah zakar kanan sakit banget mendadak dok!', sentiment: 'confirmation', priority: 'essential' }],
            rps: [
                { id: 'q_onset', text: 'Mendadak ya?', response: 'Tiba-tiba dok, lagi tidur.', sentiment: 'neutral', priority: 'essential' },
                { id: 'q_nausea', text: 'Mual?', response: 'Iya mual muntah.', sentiment: 'confirmation' }
            ],
            rpd: [], rpk: [], sosial: []
        },
        essentialQuestions: ['q_main', 'q_onset'],
        anamnesis: ["Buah zakar kanan sakit mendadak.", "Mual muntah, onset saat tidur."],
        physicalExamFindings: { general: "Kesakitan hebat.", vitals: "TD 140/90, N 110x, RR 22x, S 37°C", genital: "Testis kanan: HIGH-RIDING, transversal, nyeri hebat. Refleks kremaster HILANG. Prehn sign NEGATIF." },
        labs: {}, vitals: { temp: 37, bp: '140/90', hr: 110, rr: 22 },
        correctTreatment: ['ketorolac_30_iv'],
        correctProcedures: ['manual_detorsion_attempt', 'iv_access'],
        requiredEducation: ['6_hour_window', 'surgery_needed_urgently'],
        risk: 'critical', nonReferrable: false, referralTarget: 'rs_kabupaten',
        differentialDiagnosis: ['N44.0', 'N45.9']
    },
    {
        id: 'gna',
        diagnosis: 'Glomerulonefritis Akut (GNA)',
        icd10: 'N00.9',
        skdi: '3A',
        category: 'Urinary',
        symptoms: ['Kencing merah/cola', 'Edema wajah', 'Hipertensi', 'Oliguria'],
        clue: "Post-streptococcal: 2 minggu pasca faringitis → hematuria (warna coca-cola) + edema wajah + hipertensi + oliguria. ASTO (+). Restriksi cairan + garam + furosemide + rujuk nefrologi.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Apa yang terjadi?', response: 'Anak saya kencingnya merah kayak coca-cola, muka bengkak.', sentiment: 'confirmation', priority: 'essential' }],
            rps: [
                { id: 'q_pharyngitis', text: '2 minggu lalu sakit tenggorok?', response: 'Iya dok, radang tenggorok.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_oliguria', text: 'Kencingnya sedikit?', response: 'Iya dok, sedikit banget.', sentiment: 'confirmation' }
            ],
            rpd: [], rpk: [], sosial: []
        },
        essentialQuestions: ['q_main', 'q_pharyngitis'],
        anamnesis: ["Kencing merah kayak coca-cola, muka bengkak.", "Radang tenggorok 2 minggu lalu."],
        physicalExamFindings: { general: "Edema periorbital (+), anak 8 tahun.", vitals: "TD 140/100, N 88x, RR 20x, S 37°C", extremity: "Edema pretibial minimal." },
        labs: { "Urinalisa": { result: "Eritrosit penuh, proteinuria +2, silinder eritrosit (+)", cost: 30000 }, "ASTO": { result: "400 IU/mL (tinggi)", cost: 60000 } },
        vitals: { temp: 37, bp: '140/100', hr: 88, rr: 20 },
        correctTreatment: ['furosemide_20', 'amlodipine_5'],
        correctProcedures: ['fluid_restriction', 'monitor_vital'],
        requiredEducation: ['bed_rest', 'salt_restriction', 'nephrology_referral'],
        risk: 'high', nonReferrable: false, referralTarget: 'rs_kabupaten',
        differentialDiagnosis: ['N00.9', 'N03.9']
    }
];
