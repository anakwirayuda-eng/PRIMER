/**
 * @reflection
 * [IDENTITY]: pediatric
 * [PURPOSE]: Pediatric (Children's health) cases for CaseLibrary.
 * [STATE]: Experimental
 * [LAST_UPDATE]: 2026-02-12
 */

export const PEDIATRIC_CASES = [
    {
        id: 'asphyxia_neonatorum',
        diagnosis: 'Asfiksia Neonatorum',
        icd10: 'P21.9',
        skdi: '4A',
        category: 'Pediatrics',
        symptoms: ['Bayi tidak menangis', 'Warna kulit biru', 'Lemas', 'Napas megap-megap'],
        clue: "Bayi baru lahir (freshly delivered). Tidak bernapas spontan. Langkah awal: Hangatkan, posisikan, isap lendir, rangsang taktil. Berlanjut ke VTP jika belum napas.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Bayinya kenapa bu?', response: 'Nggak nangis dok pas lahir, lemes banget.', sentiment: 'denial', priority: 'essential' }],
            rps: [], rpd: [], rpk: [], sosial: []
        },
        essentialQuestions: ['q_main'],
        anamnesis: ["Bayi saya baru lahir tapi kok nggak nangis ya dok? Diem aja.", "Tolong dok, bayinya biru dan nggak gerak-gerak pas lahir."],
        physicalExamFindings: {
            general: "Bayi tampak biru/pucat, tonus otot lemas.",
            vitals: "HR 80x, RR 0 (apneu), S 36.2°C",
            thorax: "Napas megap-megap (gasping)."
        },
        labs: {}, vitals: { temp: 36.2, bp: 'N/A', hr: 80, rr: 0 },
        correctTreatment: ['nasal_cannula'],
        correctProcedures: ['neonatal_resuscitation', 'suction'],
        requiredEducation: ['red_flag_newborn'],
        risk: 'emergency', nonReferrable: false, referralExceptions: ['emergency_stabilization'],
        differentialDiagnosis: ['P22.0']
    }
];
