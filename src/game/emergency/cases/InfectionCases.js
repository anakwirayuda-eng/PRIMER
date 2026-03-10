/**
 * @reflection
 * [IDENTITY]: InfectionCases
 * [PURPOSE]: Infection emergency cases.
 * [STATE]: Stable
 */

export const INFECTION_CASES = [
    {
        id: 'dengue_warning_signs',
        diagnosis: 'Dengue with Warning Signs',
        icd10: 'A91',
        skdi: '4A',
        category: 'Infection',
        triageLevel: 2,
        esiLevel: 2,
        symptoms: ['Demam tinggi', 'Nyeri perut hebat', 'Muntah persisten', 'Perdarahan gusi/hidung', 'Lemas berat'],
        clue: "[URGENT] DBD dengan warning signs: nyeri perut, muntah, perdarahan, letargi. Monitor ketat kebocoran plasma!",
        relevantLabs: ['Darah Lengkap', 'NS1'],
        anamnesisQuestions: {
            keluhan_utama: [
                { id: 'q_fever', text: 'Demam hari ke berapa?', response: 'Hari ke-4 dok, tapi hari ini suhunya agak turun.', priority: 'essential' },
                { id: 'q_pain', text: 'Ada nyeri perut?', response: 'Iya perut saya sakit sekali dok, ulu hati rasanya ditekan.', priority: 'essential' },
                { id: 'q_bleed', text: 'Ada perdarahan gusi atau mimisan?', response: 'Tadi pagi sikat gigi berdarah terus dok.', priority: 'essential' }
            ],
            rps: [
                { id: 'q_vomit', text: 'Ada muntah?', response: 'Muntah terus dok, minum aja dimuntahin.' },
                { id: 'q_urine', text: 'BAK masih banyak?', response: 'Agak berkurang dok jumlahnya.' }
            ],
            rpd: [],
            sosial: []
        },
        essentialQuestions: ['q_fever', 'q_pain', 'q_bleed'],
        anamnesis: [
            "Sudah demam 4 hari dok, tapi hari ini perut sakit banget dan muntah terus.",
            "Gusinya berdarah sendiri, badan lemas banget."
        ],
        physicalExamFindings: {
            general: "Tampak lemah, letargi, pucat.",
            vitals: "TD 90/70, N 110x, RR 22x, S 37.5°C",
            heent: "Perdarahan subkonjungtiva (-), perdarahan gusi (+).",
            abdomen: "Nyeri tekan epigastrium dan hipokondrium kanan (+), hepatomegali 2 jari BAC.",
            extremities: "Rumple Leede (+), ptekie (+)."
        },
        correctTreatment: [
            ['iv_line', 'iv_fluid_rl', 'paracetamol_500'],
            ['monitor_vitals_15', 'reagen_gds']
        ],
        differentialDiagnosis: ['Demam Tifoid', 'Leptospirosis', 'Chikungunya', 'Malaria'],
        risk: 'emergency',
        referralRequired: true,
        deteriorationRate: 2
    },
    {
        id: 'severe_malaria',
        diagnosis: 'Malaria Berat (P. falciparum)',
        icd10: 'B50.0',
        icd9cm: ['99.29', '96.6'],
        skdi: '3B',
        category: 'Infection',
        triageLevel: 1,
        esiLevel: 1,
        symptoms: ['Demam tinggi periodik', 'Penurunan kesadaran', 'Anemia berat (pucat)', 'Ikterus', 'Urin gelap (black water)'],
        clue: "[CRITICAL] Malaria berat — demam + penurunan kesadaran + anemia berat. Artesunate IV SEGERA! Jangan tunggu hasil lab!",
        relevantLabs: ['Darah Lengkap', 'Malaria Rapid Test', 'GDS'],
        anamnesisQuestions: {
            keluhan_utama: [
                { id: 'q_fever', text: 'Demamnya pola gimana?', response: 'Panas-dingin bergantian dok, sudah 5 hari, makin parah.', priority: 'essential' },
                { id: 'q_travel', text: 'Baru dari mana?', response: 'Baru pulang dari Papua 2 minggu lalu dok.', priority: 'essential' },
                { id: 'q_urine', text: 'Warna kencing gimana?', response: 'Gelap kayak teh pekat dok, kadang coklat.', priority: 'essential' }
            ],
            rpd: [
                { id: 'q_malaria', text: 'Pernah malaria?', response: 'Pernah 2 kali waktu di Papua dok.' }
            ],
            sosial: []
        },
        essentialQuestions: ['q_fever', 'q_travel', 'q_urine'],
        anamnesis: [
            "Demam 5 hari periodik, baru dari Papua, sekarang nggak sadar, pucat berat.",
            "Demam panas-dingin, kuning, kencing gelap, lemas berat."
        ],
        physicalExamFindings: {
            general: "Somnolen, anemis berat, ikterik, febris.",
            vitals: "TD 90/60, N 120x, RR 28x, S 40.2°C",
            abdomen: "Splenomegali Schuffner III-IV, hepatomegali 2 jari BAC.",
            extremities: "Pucat berat, conjungtiva anemis."
        },
        correctTreatment: [
            ['iv_line', 'iv_fluid_rl', 'oxygen', 'reagen_gds'],
            ['paracetamol_500', 'monitor_vitals_15']
        ],
        differentialDiagnosis: ['Demam Tifoid', 'Leptospirosis', 'Hepatitis akut', 'Sepsis'],
        risk: 'critical',
        referralRequired: true,
        referralTarget: 'SpPD',
        deteriorationRate: 8,
        sisruteData: {
            situation: 'Pasien somnolen, demam 40.2°C periodik, anemis berat, ikterik, splenomegali.',
            background: 'Riwayat dari Papua 2 minggu lalu. Riwayat malaria 2x.',
            assessment: 'Malaria berat P. falciparum. Butuh Artesunate IV (tidak tersedia di PKM).',
            recommendation: 'SpPD untuk Artesunate IV, transfusi PRC jika Hb <7, monitoring ketat.'
        },
        billingItems: {
            tindakan: [{ code: '96.6', name: 'IV Line', actionId: 'iv_line' }, { code: '96.04', name: 'Oksigen', actionId: 'oxygen' }],
            obat: [{ medId: 'paracetamol_500', qty: 3 }],
            alkes: [{ id: 'iv_cannula', qty: 1, unitCost: 15000 }],
            estimatedCost: 300000
        },
        wikiKey: 'igd_severe_malaria'
    },
    {
        id: 'sepsis',
        diagnosis: 'Sepsis',
        icd10: 'R65.2',
        icd9cm: ['99.29', '96.6'],
        skdi: '3B',
        category: 'Infection',
        triageLevel: 1,
        esiLevel: 1,
        symptoms: ['Demam tinggi / hipotermia', 'Takikardia', 'Hipotensi', 'Perubahan kesadaran', 'Akral dingin mottled'],
        clue: "[CRITICAL] qSOFA ≥2 (TD ≤100, RR ≥22, kesadaran berubah). Curiga Sepsis! Resusitasi cairan 30ml/kg + antibiotik dalam 1 jam!",
        relevantLabs: ['Darah Lengkap', 'GDS', 'Urinalisa'],
        anamnesisQuestions: {
            keluhan_utama: [
                { id: 'q_event', text: 'Apa keluhannya?', response: 'Ibu saya demam tinggi 3 hari, sekarang nggak sadar dok.', priority: 'essential' },
                { id: 'q_source', text: 'Ada infeksi sebelumnya?', response: 'Dari kencing sakit, demam-demam terus.', priority: 'essential' },
                { id: 'q_cold', text: 'Tangan kakinya dingin?', response: 'Iya dok dingin banget, kulitnya belang-belang.', priority: 'essential' }
            ],
            rpd: [
                { id: 'q_dm', text: 'Ada kencing manis?', response: 'Ada dok, DM tapi nggak kontrol.' }
            ],
            sosial: []
        },
        essentialQuestions: ['q_event', 'q_source', 'q_cold'],
        anamnesis: [
            "Demam tinggi 3 hari dari ISK, sekarang nggak sadar, tangan kaki dingin belang-belang.",
            "Sepsis curiga sumber urologis, hipotensi, akral mottled."
        ],
        physicalExamFindings: {
            general: "Somnolen/delirium, tampak toksik, diaphoresis.",
            vitals: "TD 80/50, N 130x lemah, RR 28x, S 39.5°C (atau <36°C), CRT >3 detik",
            abdomen: "Nyeri suprapubik, nyeri ketok CVA kanan (+).",
            extremities: "Mottling di lutut, akral dingin basah, pucat."
        },
        correctTreatment: [
            ['iv_line', 'nacl_resus', 'oxygen', 'catheter_urine'],
            ['amoxicillin_500', 'monitor_vitals_15', 'reagen_gds']
        ],
        differentialDiagnosis: ['Syok kardiogenik', 'Syok anafilaktik', 'KAD', 'Malaria berat'],
        risk: 'critical',
        referralRequired: true,
        referralTarget: 'SpPD',
        deteriorationRate: 8,
        sisruteData: {
            situation: 'Pasien somnolen, TD 80/50, N 130x, akral mottled, CRT >3 detik, curiga sepsis sumber ISK.',
            background: 'DM tidak terkontrol, ISK 3 hari demam tidak membaik.',
            assessment: 'Sepsis / syok septik curiga sumber urosepsis. qSOFA 3/3. Hour-1 bundle dimulai.',
            recommendation: 'ICU SpPD untuk antibiotik IV spektrum luas, vasopressor, kultur darah & urin.'
        },
        billingItems: {
            tindakan: [{ code: '96.6', name: 'IV Line', actionId: 'iv_line' }, { code: '96.04', name: 'Oksigen', actionId: 'oxygen' }],
            obat: [{ medId: 'nacl_resus', qty: 2 }, { medId: 'amoxicillin_500', qty: 1 }],
            alkes: [{ id: 'iv_cannula', qty: 2, unitCost: 15000 }, { id: 'kateter_foley', qty: 1, unitCost: 25000 }],
            estimatedCost: 500000
        },
        wikiKey: 'igd_sepsis'
    }
];
