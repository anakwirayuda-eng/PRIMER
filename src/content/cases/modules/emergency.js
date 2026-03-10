/**
 * @reflection
 * [IDENTITY]: emergency
 * [PURPOSE]: Game engine module providing: EMERGENCY_CASES.
 * [STATE]: Experimental
 * [ANCHOR]: EMERGENCY_CASES
 * [DEPENDS_ON]: None
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-12
 */

export const EMERGENCY_CASES = [
    {
        id: 'ami_stemi',
        diagnosis: 'Acute Myocardial Infarction (STEMI)',
        icd10: 'I21.9',
        skdi: '3B',
        category: 'Cardiovascular',
        symptoms: ['Nyeri dada kiri menjalar ke lengan/rahang', 'Keringat dingin', 'Sesak', 'Mual'],
        clue: "Nyeri dada tipikal angina + keringat dingin adalah red flag. Segera EKG! Cari ST-elevasi. Ini butuh rujukan segera.",
        relevantLabs: ['EKG', 'Troponin (Rapid)'],
        anamnesisQuestions: {
            keluhan_utama: [
                { id: 'q_main', text: 'Apa keluhan utamanya?', response: 'Dada sakit seperti ditindih gajah dok, menjalar ke rahang dan lengan kiri.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_duration', text: 'Sudah berapa lama nyerinya?', response: 'Sekitar 2 jam yang lalu, nggak hilang-hilang.', sentiment: 'confirmation' }
            ],
            rps: [
                { id: 'q_sweat', text: 'Keluar keringat dingin?', response: 'Iya dok, baju saya sampai basah kuyup (diaphoresis).', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_nausea', text: 'Ada mual atau muntah?', response: 'Mual dok, mau muntah rasanya.', sentiment: 'confirmation' },
                { id: 'q_sob', text: 'Sesak napas?', response: 'Agak sesak, napas pendek-pendek.', sentiment: 'confirmation' }
            ],
            rpd: [
                { id: 'q_heart', text: 'Punya riwayat sakit jantung?', response: 'Pernah dibilang jantung koroner tapi saya nggak kontrol.', sentiment: 'denial' },
                { id: 'q_ht_dm', text: 'Ada darah tinggi atau kencing manis?', response: 'Darah tinggi ada dok.', sentiment: 'confirmation' }
            ],
            rpk: [
                { id: 'q_fam_heart', text: 'Keluarga ada riwayat sakit jantung?', response: 'Bapak saya meninggal karena serangan jantung dok.', sentiment: 'confirmation' }
            ],
            sosial: [
                { id: 'q_smoke', text: 'Merokok Pak?', response: 'Perokok berat dok, 2 bungkus sehari.', sentiment: 'confirmation' }
            ]
        },
        essentialQuestions: ['q_main', 'q_sweat', 'q_duration'],
        anamnesis: [
            "Dada sakit seperti ditindih gajah, menjalar ke rahang dan lengan kiri. Keringat dingin.",
            "Sesak napas, mual. Awalnya saya kira masuk angin biasa."
        ],
        physicalExamFindings: {
            general: "Tampak cemas, gelisah, berkeringat (diaphoresis), pucat.",
            vitals: "TD 90/60, N 110x, RR 24x, S 36.5°C, SpO2 95%",
            thorax: "Cor: Takikardia, S1/S2 menjauh. Pulmo: vesikuler, ronkhi basal (+) minimal."
        },
        labs: {
            "EKG": { result: "ST-Elevation di lead V1-V4 (STEMI Anterior)", cost: 50000 },
            "Troponin (Rapid)": { result: "Positif", cost: 100000 }
        },
        vitals: { temp: 36.5, bp: '90/60', hr: 110, rr: 24, spo2: 95 },
        correctTreatment: ['aspilet_80', 'clopidogrel_75', 'isdn_5'],
        correctProcedures: ['iv_fluid', 'iv_injection', 'ecg'],
        requiredEducation: ['red_flag_monitor', 'routine_control'],
        risk: 'emergency',
        referralRequired: true,
        differentialDiagnosis: ['I20.9', 'K21.0']
    }
];
