/**
 * @reflection
 * [IDENTITY]: chronic
 * [PURPOSE]: Game engine module providing: CHRONIC_CASES.
 * [STATE]: Experimental
 * [ANCHOR]: CHRONIC_CASES
 * [DEPENDS_ON]: None
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-12
 */

export const CHRONIC_CASES = [
    {
        "id": "heart_failure_congestive",
        "diagnosis": "Gagal Jantung Kongestif (NYHA III/IV)",
        "category": "Cardiovascular",
        "icd10": "I50.0",
        "skdi": "3B",
        "risk": "high",
        "symptoms": ["Sesak napas saat beraktivitas ringan", "Sesak saat berbaring", "Bengkak pada kedua kaki", "Cepat lelah"],
        "anamnesis": [
            "Dok, saya sesak banget kalau jalan sedikit aja. Kaki saya juga bengkak-bengkak sudah seminggu ini.",
            "Napas saya terasa berat kalau tidur terlentang, harus pakai bantal tinggi dok baru bisa napas lega."
        ],
        "vitals": {
            "bp": "150/90",
            "hr": 105,
            "rr": 26,
            "temp": 36.5,
            "eye": "konjungtiva anemis (-)",
            "tongue": "normal"
        },
        "physicalExamFindings": {
            "chest": "Ronkhi basah halus di kedua basal paru",
            "heart": "Jantung membesar (cardiomegaly), gallop S3 (+)",
            "abdomen": "Ascites minimal, hepar teraba 2 jari di bawah arkus kosta",
            "extremities": "Edema pitting (+) pada kedua bipedis"
        },
        "referralRequired": true,
        "clue": "Pasien dengan sesak napas, bengkak kaki, dan gallop. Ini adalah tanda gagal jantung yang butuh stabilisasi dan rujuk ke RS.",
        "correctTreatment": ["furosemide_inj", "nrb_mask"],
        "referralLevel": "Hospital",
        "storylineOnly": false
    },
    {
        "id": "leukemia_suspicion",
        "diagnosis": "Susp. Leukemia / Kelainan Darah",
        "category": "Hematology",
        "icd10": "C95.9",
        "skdi": "2",
        "risk": "moderate",
        "symptoms": ["Pucat lemas", "Banyak lebam di tubuh tanpa sebab", "Demam naik turun", "Gusi sering berdarah"],
        "anamnesis": [
            "Anak saya lemas sekali dok, pucat, dan di badannya banyak biru-biru kayak memar padahal nggak jatuh.",
            "Dok, gusi saya sering berdarah sendiri kalau sikat gigi, terus badan rasanya gregesi terus nggak enak."
        ],
        "vitals": {
            "bp": "100/60",
            "hr": 110,
            "rr": 20,
            "temp": 37.8,
            "eye": "konjungtiva sangat anemis (+/+)",
            "tongue": "pucat (+)"
        },
        "physicalExamFindings": {
            "skin": "Petekie dan ekimosis di seluruh tubuh",
            "abdomen": "Splenomegali (Schuffner II) dan Hepatomegali teraba kenyal",
            "lymph_nodes": "Limfadenopati multipel di leher dan ketiak (+)"
        },
        "referralRequired": true,
        "clue": "Kombinasi anemia, perdarahan (memar/petekie), dan organomegali sangat mencurigakan ke arah keganasan darah. Rujuk segera untuk BMP.",
        "correctTreatment": ["rl_500"],
        "referralLevel": "Hospital",
        "storylineOnly": true
    }
];
