/**
 * @reflection
 * [IDENTITY]: musculoskeletal
 * [PURPOSE]: Medical cases for Musculoskeletal specialty.
 * [STATE]: Experimental
 * [LAST_UPDATE]: 2026-02-12
 */

export const MUSCULOSKELETAL_CASES = [
    {
        id: 'lbp_mechanical',
        diagnosis: 'Low Back Pain (Mechanical)',
        icd10: 'M54.5',
        skdi: '4A',
        category: 'Musculoskeletal',
        anamnesis: ["Pinggang saya sakit dok, apalagi kalau habis angkut-angkut barang.", "Sakitnya nggak sampai menjalar ke kaki. Membaik kalau rebahan sebentar."],
        physicalExamFindings: { general: "Tampak menahan nyeri saat bergerak.", vitals: "TD 130/80, N 80x, RR 18x, S 36.6°C", musculoskeletal: "Nyeri tekan otot paravertebral lumbal (+), Lasegue test (-) / (>70 deg)." },
        labs: {}, vitals: { temp: 36.6, bp: '130/80', hr: 80, rr: 18 },
        correctTreatment: ['natrium_diklofenak_50', 'diazepam_2'],
        correctProcedures: [],
        requiredEducation: ['proper_lifting_technique', 'back_exercises', 'avoid_prolonged_sitting'],
        risk: 'medium', nonReferrable: true, referralExceptions: ['red_flags_lbp', 'no_improvement'],
        differentialDiagnosis: ['M54.5', 'M51.2']
    },
    {
        id: 'gout_arthritis',
        diagnosis: 'Gout Arthritis (Asam Urat)',
        icd10: 'M10.9',
        skdi: '4A',
        category: 'Musculoskeletal',
        anamnesis: ["Jempol kaki saya bengkak dan merah dok, sakit sekali buat jalan.", "Tiba-tiba begini pas bangun tidur. Kemarin habis makan emping dan jeroan."],
        physicalExamFindings: { general: "Tampak sakit sedang, pincang.", vitals: "TD 125/80, N 88x, RR 20x, S 37.2°C", musculoskeletal: "MTP-1 dekstra: Hiperemis, edema, panas, nyeri tekan (+)." },
        labs: { "Asam Urat": { result: "8.8 mg/dL", cost: 30000 } },
        vitals: { temp: 37.2, bp: '125/80', hr: 88, rr: 20 },
        correctTreatment: ['colchicine_0_5', 'natrium_diklofenak_50'],
        correctProcedures: [],
        requiredEducation: ['low_purine_diet', 'adequate_hydration', 'weight_management'],
        risk: 'medium', nonReferrable: true, referralExceptions: ['multiple_joints', 'no_improvement'],
        differentialDiagnosis: ['M10.9', 'M13.9']
    },
    {
        id: 'gout_akut',
        diagnosis: 'Gout Akut',
        icd10: 'M10.9',
        skdi: '4A',
        category: 'Musculoskeletal',
        anamnesis: ["Lutut saya tiba-tiba bengkak dan merah, nyeri sekali dok.", "Sakitnya ngenyut banget, nggak bisa ditekuk. Sudah 1 hari begini."],
        physicalExamFindings: { general: "Tampak kesakitan.", vitals: "TD 120/80, N 92x, RR 18x, S 37.5°C", musculoskeletal: "Genu sinistra: Edema, eritema, kalor, nyeri tekan (+), ROM terbatas." },
        labs: { "Asam Urat": { result: "9.2 mg/dL", cost: 30000 } },
        vitals: { temp: 37.5, bp: '120/80', hr: 92, rr: 18 },
        correctTreatment: ['colchicine_0_5', 'natrium_diklofenak_50'],
        correctProcedures: [],
        requiredEducation: ['diet_low_purine', 'acute_attack_care'],
        risk: 'medium', nonReferrable: true, referralExceptions: ['septic_arthritis_suspicion'],
        differentialDiagnosis: ['M10.9', 'M00.9']
    },
    {
        id: 'myalgia',
        diagnosis: 'Myalgia',
        icd10: 'M79.1',
        skdi: '4A',
        category: 'Musculoskeletal',
        symptoms: ['Nyeri otot', 'Kaku', 'Pegal-pegal', 'Diperburuk aktivitas'],
        clue: "Nyeri otot tanpa tanda radang sendi. Penyebab: overuse, postur buruk, stres. R/ analgesik + muscle relaxant + edukasi postur. Singkirkan penyebab sekunder.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Nyerinya di mana ini pak/bu?', response: 'Bahu dan leher pegal-pegal dok, kaku.', sentiment: 'confirmation', priority: 'essential' }],
            rps: [{ id: 'q_activity', text: 'Sehari-harinya kerja apa pak/bu?', response: 'Kerja di depan komputer seharian dok.', sentiment: 'neutral', priority: 'essential' }],
            rpd: [], rpk: [], sosial: []
        },
        essentialQuestions: ['q_main', 'q_activity'],
        anamnesis: ["Bahu dan leher pegal-pegal kaku dok.", "Seluruh badan pegal, terutama punggung."],
        physicalExamFindings: { general: "Tampak baik.", vitals: "TD 120/80, N 78x, RR 18x, S 36.7°C", musculoskeletal: "Nyeri tekan otot trapezius bilateral, trigger point (+), ROM cervical sedikit terbatas. Sendi: tidak ada efusi/eritema." },
        labs: {}, vitals: { temp: 36.7, bp: '120/80', hr: 78, rr: 18 },
        correctTreatment: ['paracetamol_500', 'eperisone_50'],
        correctProcedures: [],
        requiredEducation: ['posture_correction', 'stretching_exercises', 'ergonomic_workspace'],
        risk: 'low', nonReferrable: true, referralExceptions: ['chronic_pain', 'neurological_signs'],
        differentialDiagnosis: ['M79.1', 'M54.2']
    },
    {
        id: 'osteoarthritis',
        diagnosis: 'Osteoarthritis',
        icd10: 'M17.9',
        skdi: '4A',
        category: 'Musculoskeletal',
        symptoms: ['Nyeri sendi lutut', 'Kaku pagi <30 menit', 'Krepitasi', 'Lansia/obesitas'],
        clue: "Degeneratif: nyeri sendi saat beraktivitas, membaik istirahat. Kaku pagi <30 menit. Krepitasi (+). Beda OA vs RA: OA unilateral, RA bilateral/simetris.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Lututnya kenapa ini pak/bu?', response: 'Lutut saya sakit kalau jalan, bunyi krek-krek.', sentiment: 'confirmation', priority: 'essential' }],
            rps: [{ id: 'q_morning', text: 'Kalau pagi hari, lututnya terasa kaku nggak?', response: 'Iya agak kaku tapi setelah 15 menit sudah enakan.', sentiment: 'confirmation', priority: 'essential' }],
            rpd: [], rpk: [], sosial: []
        },
        essentialQuestions: ['q_main', 'q_morning'],
        anamnesis: ["Lutut sakit kalau jalan, bunyi krek-krek.", "Sendi lutut nyeri terutama naik tangga, sudah lama."],
        physicalExamFindings: { general: "BB lebih, lanjut usia.", vitals: "TD 130/80, N 78x, RR 18x, S 36.7°C", musculoskeletal: "Genu bilateral: krepitasi (+), efusi minimal, ROM sedikit terbatas, nyeri tekan garis sendi medial (+). Deformitas varus ringan." },
        labs: {}, vitals: { temp: 36.7, bp: '130/80', hr: 78, rr: 18 },
        correctTreatment: ['paracetamol_500', 'natrium_diklofenak_50'],
        correctProcedures: [],
        requiredEducation: ['weight_loss', 'low_impact_exercise', 'joint_protection', 'avoid_stairs'],
        risk: 'low', nonReferrable: true, referralExceptions: ['severe_deformity', 'joint_replacement_candidate'],
        differentialDiagnosis: ['M17.9', 'M06.9']
    },
    {
        id: 'lipoma',
        diagnosis: 'Lipoma',
        icd10: 'D17.9',
        skdi: '4A',
        category: 'Musculoskeletal',
        symptoms: ['Benjolan lunak', 'Bisa digerakkan', 'Tidak nyeri', 'Tumbuh lambat'],
        clue: "Massa subkutan lunak, mobile, tidak nyeri, batas tegas, konsistensi kenyal ('rubbery'). Tumbuh lambat. Tidak perlu tindakan kecuali estetik atau ukuran besar.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Ada keluhan apa pak/bu?', response: 'Ada benjolan di punggung dok, sudah lama tapi nggak sakit.', sentiment: 'confirmation', priority: 'essential' }],
            rps: [
                { id: 'q_duration', text: 'Benjolannya sudah berapa lama?', response: 'Sudah setahun lebih dok, makin lama makin besar pelan-pelan.', sentiment: 'confirmation' },
                { id: 'q_pain', text: 'Sakitnya gimana, nyeri nggak?', response: 'Nggak sakit sama sekali dok, cuma risih aja.', sentiment: 'confirmation' }
            ],
            rpd: [], rpk: [],
            sosial: []
        },
        essentialQuestions: ['q_main'],
        anamnesis: ["Ada benjolan di punggung dok, sudah lama nggak sakit.", "Makin lama makin besar pelan-pelan, lunak kalau dipegang."],
        physicalExamFindings: { general: "Tampak baik.", vitals: "TD 120/80, N 78x, RR 18x, S 36.5°C", musculoskeletal: "Massa subkutan regio dorsal, diameter 3cm, lunak, mobile, tidak nyeri tekan, batas tegas, permukaan licin." },
        labs: {}, vitals: { temp: 36.5, bp: '120/80', hr: 78, rr: 18 },
        correctTreatment: ['observation'],
        correctProcedures: ['excision_lipoma'],
        requiredEducation: ['benign_tumor', 'monitor_growth', 'surgery_if_cosmetic'],
        risk: 'low', nonReferrable: true, referralExceptions: ['rapid_growth', 'pain', 'suspected_liposarcoma'],
        differentialDiagnosis: ['D17.9', 'C49.9']
    },
    {
        id: 'ulkus_tungkai',
        diagnosis: 'Ulkus pada Tungkai',
        icd10: 'L97',
        skdi: '4A',
        category: 'Musculoskeletal',
        symptoms: ['Luka kronik di kaki', 'Tidak sembuh-sembuh', 'Nyeri', 'Edema tungkai'],
        clue: "Ulkus kronik di tungkai bawah, sering akibat insufisiensi vena (medial) atau arterial (lateral). Luka tidak sembuh >2 minggu. Perawatan luka + kompresi (jika vena) + atasi penyebab dasar.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Ada apa ini pak/bu?', response: 'Kaki saya ada luka dok, nggak sembuh-sembuh sudah sebulan.', sentiment: 'confirmation', priority: 'essential' }],
            rps: [
                { id: 'q_duration', text: 'Lukanya sudah berapa lama?', response: 'Sudah sebulan lebih dok, malah makin melebar.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_cause', text: 'Awalnya kenapa sampai luka?', response: 'Awalnya kebentur sedikit, biasanya sembuh tapi ini nggak mau nutup.', sentiment: 'denial' }
            ],
            rpd: [{ id: 'q_dm', text: 'Punya kencing manis atau varises?', response: 'Iya dok, kencing manis sudah 5 tahun. Kaki juga sering bengkak.', sentiment: 'confirmation' }],
            rpk: [], sosial: []
        },
        essentialQuestions: ['q_main', 'q_duration'],
        anamnesis: ["Kaki saya ada luka nggak sembuh-sembuh dok.", "Sudah sebulan, makin lebar. Punya kencing manis."],
        physicalExamFindings: { general: "Tampak sakit ringan.", vitals: "TD 130/80, N 82x, RR 18x, S 37.0°C", musculoskeletal: "Regio cruris sinistra: Ulkus diameter 4cm, dasar jaringan granulasi, tepi ireguler, eksudat serosa, edema pretibial (+)." },
        labs: { "GDS": { result: "230 mg/dL", cost: 15000 } },
        vitals: { temp: 37.0, bp: '130/80', hr: 82, rr: 18 },
        correctTreatment: ['metronidazole_500', 'wound_dressing'],
        correctProcedures: ['wound_debridement', 'compression_bandage'],
        requiredEducation: ['wound_care_home', 'diabetes_control', 'leg_elevation', 'proper_footwear'],
        risk: 'medium', nonReferrable: true, referralExceptions: ['osteomyelitis', 'arterial_ulcer', 'non_healing_3months'],
        differentialDiagnosis: ['L97', 'I83.0']
    },
    // === SKDI 1-3 REFERRAL CASES ===
    {
        id: 'fraktur_terbuka',
        diagnosis: 'Fraktur Terbuka (Open Fracture)',
        icd10: 'T14.2',
        skdi: '3B',
        category: 'Musculoskeletal',
        symptoms: ['Luka terbuka dengan tulang terlihat', 'Nyeri hebat', 'Deformitas', 'Perdarahan aktif'],
        clue: "Gustilo classification! Grade I: luka <1cm bersih. Grade II: 1-10cm. Grade III: >10cm/kontaminasi berat. ABC → hentikan perdarahan → splinting → antibiotik (cefazolin+gentamicin) → tetanus → RUJUK ORTOPEDI. JANGAN reposisi paksa!",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Apa yang terjadi?', response: 'Kecelakaan motor dok, kaki kanan patah, tulangnya keluar!', sentiment: 'confirmation', priority: 'essential' }],
            rps: [
                { id: 'q_mechanism', text: 'Kecelakaannya gimana?', response: 'Ditabrak truk, kaki kanan ketindis.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_time', text: 'Berapa jam lalu?', response: '2 jam lalu dok.', sentiment: 'confirmation' }
            ],
            rpd: [], rpk: [], sosial: []
        },
        essentialQuestions: ['q_main', 'q_mechanism'],
        anamnesis: ["Kecelakaan motor, kaki patah tulang keluar.", "Ditabrak truk, 2 jam lalu."],
        physicalExamFindings: { general: "Sakit berat, pucat.", vitals: "TD 100/70, N 110x, RR 24x, S 37°C", extremity: "Cruris dextra: deformitas angulasi, luka terbuka 5cm dengan ujung tulang tibia terekspos (Gustilo II). Perdarahan aktif minimal. NVD distal: dorsoflexion lemah, pulse dorsalis pedis teraba lemah." },
        labs: { "Darah Lengkap": { result: "Hb 10.5, Leukosit 12.000", cost: 50000 } },
        vitals: { temp: 37, bp: '100/70', hr: 110, rr: 24 },
        correctTreatment: ['cefazolin_1g_iv', 'gentamicin_80_iv', 'ketorolac_30_iv', 'rl_500', 'tetanus_toxoid'],
        correctProcedures: ['wound_irrigation_saline', 'splinting', 'sterile_dressing', 'iv_access'],
        requiredEducation: ['surgery_needed', 'infection_risk', 'orthopedic_referral'],
        risk: 'high', nonReferrable: false, referralTarget: 'rs_kabupaten',
        differentialDiagnosis: ['T14.2', 'S82.9']
    },
    {
        id: 'osteomielitis',
        diagnosis: 'Osteomielitis',
        icd10: 'M86.9',
        skdi: '3B',
        category: 'Musculoskeletal',
        symptoms: ['Nyeri tulang', 'Demam', 'Bengkak lokal', 'Kemerahan', 'Fistula drainase'],
        clue: "Infeksi tulang! Akut: demam + nyeri tulang + bengkak (anak: hematogen, S.aureus). Kronik: fistula drainase, sequestrum. LED/CRP naik. X-ray: periosteal reaction, lytic. Antibiotik IV jangka panjang + debridement → rujuk ortopedi.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Apa keluhannya?', response: 'Kaki anak saya bengkak dan sakit dok, demam terus 5 hari, nggak mau jalan.', sentiment: 'confirmation', priority: 'essential' }],
            rps: [
                { id: 'q_fever', text: 'Demam berapa hari?', response: '5 hari dok, tinggi terus.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_weight_bear', text: 'Bisa jalan?', response: 'Nggak mau jalan, disentuh aja nangis.', sentiment: 'denial' }
            ],
            rpd: [], rpk: [], sosial: []
        },
        essentialQuestions: ['q_main', 'q_fever'],
        anamnesis: ["Kaki bengkak, demam 5 hari, nggak mau jalan.", "Disentuh aja nangis."],
        physicalExamFindings: { general: "Demam, tidak mau mobilisasi.", vitals: "TD 100/60, N 110x, RR 22x, S 39°C", extremity: "Tibia proksimal sinistra: bengkak, hangat, eritema, nyeri tekan hebat, pseudoparalysis." },
        labs: { "Darah Lengkap": { result: "Leukosit 18.000", cost: 50000 }, "LED": { result: "85 mm/jam", cost: 30000 } },
        vitals: { temp: 39, bp: '100/60', hr: 110, rr: 22 },
        correctTreatment: ['cefazolin_1g_iv', 'paracetamol_500'],
        correctProcedures: ['iv_access', 'immobilization'],
        requiredEducation: ['long_term_antibiotics', 'surgery_may_needed', 'orthopedic_referral'],
        risk: 'high', nonReferrable: false, referralTarget: 'rs_kabupaten',
        differentialDiagnosis: ['M86.9', 'M86.1']
    }
];
