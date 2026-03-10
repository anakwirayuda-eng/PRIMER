/**
 * @reflection
 * [IDENTITY]: oral
 * [PURPOSE]: Medical cases for Dental/Oral specialty.
 * [STATE]: Experimental
 * [LAST_UPDATE]: 2026-02-12
 */

export const ORAL_CASES = [
    {
        id: 'stomatitis_aftosa',
        diagnosis: 'Stomatitis Aftosa (Sariawan)',
        icd10: 'K12.0',
        skdi: '4A',
        category: 'Dental',
        anamnesis: ["Ada sariawan di lidah dan bibir dok, perih banget kalau makan.", "Sudah 3 hari, rasanya kayak kebakar. Sering kumat kalau lagi kurang tidur."],
        physicalExamFindings: { general: "Tampak baik.", vitals: "TD 120/80, N 78x, RR 18x, S 36.6°C", oral: "Ulkus dangkal, diameter 2-3mm, dasar kekuningan dengan halo eritematosa (+)." },
        labs: {}, vitals: { temp: 36.6, bp: '120/80', hr: 78, rr: 18 },
        correctTreatment: ['betamethasone_cream', 'betamethasone_cream'],
        correctProcedures: [],
        requiredEducation: ['avoid_spicy_food', 'oral_hygiene', 'stress_management'],
        risk: 'low', nonReferrable: true, referralExceptions: ['persistent_ulcer_gt_2weeks'],
        differentialDiagnosis: ['K12.0', 'B37.0']
    }
];
