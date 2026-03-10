/**
 * @reflection
 * [IDENTITY]: forensik
 * [PURPOSE]: Forensic medicine / Kedokteran Forensik cases for CaseLibrary.
 * [STATE]: Experimental
 * [LAST_UPDATE]: 2026-02-17
 */

export const FORENSIK_CASES = [
    {
        id: 'visum_et_repertum_hidup',
        diagnosis: 'Pembuatan Visum et Repertum (Korban Hidup)',
        icd10: 'Z04.5',
        skdi: '4A',
        category: 'Forensik',
        symptoms: ['Korban kekerasan', 'Luka-luka', 'Permintaan visum dari polisi'],
        clue: "Pembuatan VeR adalah KEWAJIBAN dokter (KUHAP pasal 133). Periksa & dokumentasi seluruh luka: jenis, ukuran, lokasi, mekanisme. Beda luka tajam vs tumpul!",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Bisa ceritakan apa yang terjadi pak?', response: 'Saya dipukul orang dok, untuk laporan polisi.', sentiment: 'confirmation', priority: 'essential' }],
            rps: [
                { id: 'q_mechanism', text: 'Dipukulnya pakai apa bisa diceritakan?', response: 'Pakai kayu dok.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_when', text: 'Kapan kejadiannya pak?', response: 'Tadi malam dok.', sentiment: 'confirmation', priority: 'essential' }
            ],
            rpd: [], rpk: [], sosial: []
        },
        essentialQuestions: ['q_main', 'q_mechanism', 'q_when'],
        anamnesis: ["Saya dipukul orang, mau minta visum.", "Korban penganiayaan dok, polisi minta visum."],
        physicalExamFindings: {
            general: "Tampak sakit ringan.",
            vitals: "TD 130/85, N 88x, RR 20x, S 36.7°C",
            skin: "Regio frontalis: Hematoma subkutan 3x2cm. Regio brachii sinistra: Vulnus contussum 5x3cm dengan tepi tidak rata. Regio dorsi: Excoriasi multipel.",
            extremities: "ROM dalam batas normal, tidak ada fraktur."
        },
        labs: {}, vitals: { temp: 36.7, bp: '130/85', hr: 88, rr: 20 },
        correctTreatment: ['paracetamol_500'],
        correctProcedures: ['visum_documentation', 'wound_care'],
        requiredEducation: ['legal_rights', 'follow_up_if_worse'],
        risk: 'low', nonReferrable: true, referralExceptions: ['severe_injury', 'sexual_assault'],
        differentialDiagnosis: ['Z04.5', 'T14.9']
    },
    {
        id: 'keracunan_makanan',
        diagnosis: 'Keracunan Makanan (Food Poisoning)',
        icd10: 'T62.9',
        skdi: '4A',
        category: 'Forensik',
        symptoms: ['Mual muntah setelah makan', 'Diare', 'Nyeri perut', 'Beberapa orang sakit bersamaan'],
        clue: "Food poisoning: onset cepat setelah makan, beberapa orang terkena. Identifikasi toksin (staph: 1-6 jam, salmonella: 6-72 jam). Rehidrasi agresif! Kumpulkan sampel makanan.",
        relevantLabs: ['Darah Lengkap'],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Apa yang dirasakan pak/bu?', response: 'Mual muntah dan diare parah dok, habis makan dari warung.', sentiment: 'confirmation', priority: 'essential' }],
            rps: [
                { id: 'q_food', text: 'Tadi makan apa pak/bu?', response: 'Nasi padang tadi siang dok.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_others', text: 'Teman-teman yang makan bareng ada yang sakit juga?', response: 'Iya dok, 3 orang yang makan bareng semuanya sakit.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_onset', text: 'Mulai mual berapa lama setelah makan?', response: 'Sekitar 4 jam kemudian.', sentiment: 'confirmation' }
            ],
            rpd: [], rpk: [], sosial: []
        },
        essentialQuestions: ['q_main', 'q_food', 'q_others'],
        anamnesis: ["Mual muntah diare habis makan, teman juga sakit.", "Keracunan makanan dok, banyak yang kena."],
        physicalExamFindings: { general: "Tampak lemas, dehidrasi ringan.", vitals: "TD 100/60, N 96x, RR 20x, S 37.5°C", abdomen: "BU meningkat, nyeri tekan difus, defans (-). Turgor kulit sedikit menurun." },
        labs: { "Darah Lengkap": { result: "Leukosit 11.000, Hb 13.0", cost: 50000 } },
        vitals: { temp: 37.5, bp: '100/60', hr: 96, rr: 20 },
        correctTreatment: ['oralit', 'ondansetron_4', 'rl_500'],
        correctProcedures: ['food_sample_collection'],
        requiredEducation: ['rehydration', 'food_safety', 'report_to_health_office'],
        risk: 'medium', nonReferrable: true, referralExceptions: ['severe_dehydration', 'botulism_suspicion', 'mass_poisoning'],
        differentialDiagnosis: ['T62.9', 'A05.9']
    },
    {
        id: 'kekerasan_tumpul',
        diagnosis: 'Luka Akibat Kekerasan Tumpul',
        icd10: 'T14.0',
        skdi: '4A',
        category: 'Forensik',
        symptoms: ['Memar/lebam', 'Bengkak', 'Nyeri tekan', 'Bekas pukulan/benturan'],
        clue: "Kekerasan tumpul → luka memar (kontusio), hematoma, atau abrasi. Dokumentasi forensik: lokasi, ukuran, warna (estimasi usia luka), mekanisme. Visum et repertum wajib jika ada laporan polisi.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Ada apa ini pak/bu?', response: 'Saya dipukul suami dok, muka dan badan lebam-lebam.', sentiment: 'neutral', priority: 'essential' }],
            rps: [
                { id: 'q_mechanism', text: 'Dipukulnya pakai apa?', response: 'Pakai tangan kosong dok, ditampar dan dipukul berkali-kali.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_when', text: 'Kapan kejadiannya?', response: 'Tadi malam dok, sekitar 12 jam yang lalu.', sentiment: 'confirmation' }
            ],
            rpd: [{ id: 'q_repeat', text: 'Ini pertama kali atau sudah pernah sebelumnya?', response: 'Sudah beberapa kali dok...', sentiment: 'confirmation' }],
            rpk: [], sosial: []
        },
        essentialQuestions: ['q_main', 'q_mechanism'],
        anamnesis: ["Saya dipukul suami, muka dan badan lebam.", "Ditampar dan dipukul berkali-kali tadi malam."],
        physicalExamFindings: { general: "Tampak ketakutan, menangis.", vitals: "TD 130/90, N 92x, RR 20x, S 36.7°C", skin: "Regio zigomatika sinistra: Hematoma 4x3cm, warna biru keunguan. Regio brachii dekstra: Abrasi 2x1cm, hematoma 3x2cm. Tidak ada fraktur pada palpasi." },
        labs: {}, vitals: { temp: 36.7, bp: '130/90', hr: 92, rr: 20 },
        correctTreatment: ['paracetamol_500', 'cold_compress'],
        correctProcedures: ['visum_et_repertum', 'photo_documentation', 'wound_measurement'],
        requiredEducation: ['legal_rights', 'domestic_violence_hotline', 'safety_planning', 'psychological_support'],
        risk: 'medium', nonReferrable: true, referralExceptions: ['fracture', 'internal_bleeding', 'head_injury'],
        differentialDiagnosis: ['T14.0', 'T00.9']
    },
    {
        id: 'kekerasan_tajam',
        diagnosis: 'Luka Akibat Kekerasan Tajam',
        icd10: 'T14.1',
        skdi: '4A',
        category: 'Forensik',
        symptoms: ['Luka sayat/iris', 'Tepi rata', 'Perdarahan aktif', 'Riwayat benda tajam'],
        clue: "Kekerasan tajam → luka iris (insisi) atau tusuk. Tepi luka rata (beda dengan vulnus laceratum yang ireguler). Hair bridging (-). Dokumentasi forensik penting: arah, kedalaman, jumlah, defense wound.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Ada apa ini pak/bu, lukanya kenapa?', response: 'Saya disayat pisau dok, tangan kena waktu berantem.', sentiment: 'confirmation', priority: 'essential' }],
            rps: [
                { id: 'q_weapon', text: 'Benda tajamnya apa?', response: 'Pisau dapur dok, panjang kira-kira 15 cm.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_defense', text: 'Tangan kena waktu menangkis?', response: 'Iya dok, saya tangkis pakai tangan, terus kena di lengan.', sentiment: 'confirmation' }
            ],
            rpd: [], rpk: [], sosial: []
        },
        essentialQuestions: ['q_main', 'q_weapon'],
        anamnesis: ["Saya disayat pisau dok, tangan kena.", "Lukanya berdarah banyak, waktu berantem tadi."],
        physicalExamFindings: { general: "Tampak kesakitan, tangan dipegangi.", vitals: "TD 110/70, N 96x, RR 22x, S 36.7°C", skin: "Regio antebrachii dekstra: Vulnus scissum 6cm, tepi rata, dasar otot superfisial terpapar, perdarahan aktif (+). Defense wound (+) di palmar telapak tangan." },
        labs: { "Darah Lengkap": { result: "Hb 11.5, leukosit 9.800", cost: 50000 } },
        vitals: { temp: 36.7, bp: '110/70', hr: 96, rr: 22 },
        correctTreatment: ['cefadroxil_500', 'paracetamol_500', 'att_injection'],
        correctProcedures: ['wound_suturing', 'visum_et_repertum', 'photo_documentation'],
        requiredEducation: ['wound_care', 'suture_removal_schedule', 'legal_rights'],
        risk: 'medium', nonReferrable: true, referralExceptions: ['tendon_damage', 'deep_penetration', 'neurovascular_injury'],
        differentialDiagnosis: ['T14.1', 'T01.9']
    },
    // === SKDI 1-3 REFERRAL CASE ===
    {
        id: 'tenggelam',
        diagnosis: 'Tenggelam (Near-Drowning)',
        icd10: 'T75.1',
        skdi: '3A',
        category: 'Forensik',
        symptoms: ['Sesak napas', 'Batuk', 'Sianosis', 'Penurunan kesadaran', 'Hipotermia'],
        clue: "ABC first! Near-drowning: hipoksia + aspirasi air → edema paru → ARDS. Fresh water vs salt water mechanism beda tapi tatalaksana sama: oksigenasi agresif + ventilasi + cegah hipotermia. Monitor 24 jam karena risiko secondary drowning!",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Apa yang terjadi?', response: 'Anak saya tenggelam di kolam renang dok, sudah diangkat, batuk-batuk.', sentiment: 'confirmation', priority: 'essential' }],
            rps: [
                { id: 'q_duration', text: 'Berapa lama tenggelamnya?', response: 'Kira-kira 3 menit di bawah air.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_cpr', text: 'Sudah diberi napas buatan?', response: 'Sudah dok, langsung muntahkan air.', sentiment: 'confirmation' }
            ],
            rpd: [], rpk: [], sosial: []
        },
        essentialQuestions: ['q_main', 'q_duration'],
        anamnesis: ["Tenggelam di kolam renang, sudah diangkat.", "3 menit di bawah air, sudah CPR."],
        physicalExamFindings: { general: "Sadar, sesak, batuk, menggigil.", vitals: "TD 100/60, N 110x, RR 30x, S 35°C, SpO2 88%", thorax: "Ronki basah bilateral difus." },
        labs: {}, vitals: { temp: 35, bp: '100/60', hr: 110, rr: 30 },
        correctTreatment: ['o2_nrm_15lpm', 'rl_500'],
        correctProcedures: ['airway_management', 'warming_blanket', 'monitor_vital', 'iv_access'],
        requiredEducation: ['24h_observation', 'secondary_drowning_risk', 'icu_monitoring'],
        risk: 'high', nonReferrable: false, referralTarget: 'rs_kabupaten',
        differentialDiagnosis: ['T75.1', 'J68.1']
    }
];
