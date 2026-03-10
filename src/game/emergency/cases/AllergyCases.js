/**
 * @reflection
 * [IDENTITY]: AllergyCases
 * [PURPOSE]: Allergy emergency cases.
 * [STATE]: Stable
 */

export const ALLERGY_CASES = [
    {
        id: 'anaphylaxis',
        diagnosis: 'Anaphylactic Shock',
        icd10: 'T78.2',
        skdi: '3B',
        category: 'Allergy',
        triageLevel: 1,
        esiLevel: 1,
        symptoms: ['Sesak napas (stridor/wheezing)', 'Urtikaria (biduran) seluruh tubuh', 'Bibir/mata bengkak (angioedema)', 'TD turun (syok)', 'Pucat/lemas'],
        clue: "[CRITICAL] Syok Anafilaksis — Life threatening! Segera berikan Epinefrin IM, jangan tunda. Jaga jalan napas.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [
                { id: 'q_event', text: 'Tadi habis kena apa?', response: 'Habis disuntik antibiotik dok, langsung sesak begini.', priority: 'essential' },
                { id: 'q_skin', text: 'Ada gatal-gatal atau bengkak?', response: 'Iya dok, badan merah semua dan bibirnya tebal.', priority: 'essential' },
                { id: 'q_allergy', text: 'Ada riwayat alergi?', response: 'Pernah alergi seafood bengkak-bengkak juga.', priority: 'essential' }
            ],
            medis: [],
            sosial: []
        },
        essentialQuestions: ['q_event', 'q_skin', 'q_allergy'],
        anamnesis: [
            "Pasien baru disuntik antibiotik, tiba-tiba sesak dan gatal-gatal.",
            "Bibirnya bengkak, kulitnya merah semua, lemes."
        ],
        physicalExamFindings: {
            general: "Tampak sesak berat, gelisah, bibir dan palpebra edema (+).",
            vitals: "TD 80/50, N 120x lemah, RR 26x, S 36.8°C, SpO2 90%",
            skin: "Urtikaria generalisata, eritema difus.",
            thorax: "Auskultasi: Stidor inspiratori (+) dan wheezing (+/+) minimal."
        },
        correctTreatment: [
            ['oxygen', 'epinephrine_inj', 'iv_line', 'iv_fluid_rl'],
            ['diphenhydramine_iv', 'dexamethasone_iv', 'monitor_vitals_15', 'observation_6h']
        ],
        differentialDiagnosis: ['Angioedema herediter', 'Serangan asma akut', 'Reaksi urtikaria berat'],
        risk: 'critical',
        referralRequired: true,
        deteriorationRate: 8
    },
    {
        id: 'angioedema_severe',
        diagnosis: 'Angioedema Berat',
        icd10: 'T78.3',
        icd9cm: ['99.29'],
        skdi: '4A',
        category: 'Allergy',
        triageLevel: 2,
        esiLevel: 2,
        symptoms: ['Bengkak bibir/mata/lidah masif', 'Suara serak', 'Kesulitan menelan', 'Gatal minimal', 'Tanpa urtikaria'],
        clue: "[URGENT] Angioedema tanpa urtikaria — bisa ACE-inhibitor induced! Hentikan obat, berikan steroid + antihistamin. Awasi jalan napas!",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [
                { id: 'q_swell', text: 'Bengkaknya sejak kapan?', response: 'Dari 2 jam lalu dok, makin besar, bibir tebal banget.', priority: 'essential' },
                { id: 'q_breathe', text: 'Ada sesak?', response: 'Agak susah menelan dok, suara juga agak serak.', priority: 'essential' },
                { id: 'q_meds', text: 'Minum obat apa?', response: 'Captopril dok, buat darah tinggi.', priority: 'essential' }
            ],
            rpd: [
                { id: 'q_prev', text: 'Pernah bengkak begini?', response: 'Pernah sekali dulu tapi nggak separah ini.' },
                { id: 'q_allergy', text: 'Ada alergi?', response: 'Nggak ada alergi makanan dok.' }
            ],
            sosial: []
        },
        essentialQuestions: ['q_swell', 'q_breathe', 'q_meds'],
        anamnesis: [
            "Bibir dan mata bengkak besar tiba-tiba, suara serak, susah menelan.",
            "Minum obat tensi baru, 2 jam kemudian muka bengkak-bengkak."
        ],
        physicalExamFindings: {
            general: "Tampak edema masif periorbital bilateral dan labial, suara serak (hoarseness).",
            vitals: "TD 150/90, N 90x, RR 22x, S 36.8°C, SpO2 96%",
            heent: "Edema palpebra bilateral masif, edema labial, lidah edema parsial. Urtikaria (-). Stridor (-).",
            thorax: "Vesikuler normal, wheezing (-)."
        },
        correctTreatment: [
            ['dexamethasone_iv', 'diphenhydramine_iv', 'monitor_vitals_15'],
            ['observation_6h']
        ],
        differentialDiagnosis: ['Anafilaksis', 'Angioedema herediter (HAE)', 'Selulitis fasialis', 'Sindrom nefrotik'],
        risk: 'emergency',
        referralRequired: false,
        referralTarget: '',
        deteriorationRate: 3,
        sisruteData: {
            situation: 'Angioedema berat periorbital+labial, hoarseness, curiga ACE-inhibitor induced.',
            background: 'Captopril rutin. Tanpa urtikaria. Stridor (-).',
            assessment: 'Angioedema non-anafilaktik. Respon baik terhadap steroid+antihistamin.',
            recommendation: 'Observasi 6 jam di IGD, jika stabil pulang dengan ganti anti-HT (ARB).'
        },
        billingItems: {
            tindakan: [{ code: '99.29', name: 'Injeksi IV', actionId: 'dexamethasone_iv' }],
            obat: [{ medId: 'dexamethasone_iv', qty: 1 }, { medId: 'diphenhydramine_iv', qty: 1 }],
            alkes: [{ id: 'spuit_3cc', qty: 2, unitCost: 3000 }],
            estimatedCost: 150000
        },
        wikiKey: 'igd_angioedema'
    }
];
