/**
 * @reflection
 * [IDENTITY]: head_neck_infectious
 * [PURPOSE]: Head and Neck infectious cases (Otitis, Sinusitis, Conjunctivitis).
 * [STATE]: Stable
 * [ANCHOR]: head_neck_infectious
 */
export const head_neck_infectious = [
    {
        id: 'otitis_media_acute',
        diagnosis: 'Otitis Media Akut',
        icd10: 'H65.0',
        skdi: '4A',
        category: 'ENT',
        symptoms: ['Nyeri telinga', 'Demam', 'Pendengaran berkurang', 'Keluar cairan telinga'],
        clue: "Otalgia dengan demam, sering pasca ISPA. Membran timpani bulging, hiperemis.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [
                { id: 'q_main', text: 'Telinganya kenapa Pak/Bu?', response: 'Telinga saya sakit banget dok, rasanya penuh dan pendengaran berkurang.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_fever', text: 'Ada demam?', response: 'Iya demam tinggi dok.', sentiment: 'confirmation', priority: 'essential' }
            ],
            rps: [
                { id: 'q_ear_discharge', text: 'Keluar cairan dari telinga?', response: 'Belum ada dok, cuma rasa penuh/tersumbat.', sentiment: 'denial' },
                { id: 'q_history_ispa', text: 'Sebelumnya ada batuk pilek?', response: 'Iya dok, seminggu ini saya pilek.', sentiment: 'confirmation', priority: 'essential' }
            ],
            rpd: [
                { id: 'q_history', text: 'Sering sakit telinga?', response: 'Kalau lagi pilek parah kadang telinga terasa nggak enak.', sentiment: 'confirmation' }
            ],
            rpk: [],
            sosial: []
        },
        essentialQuestions: ['q_main', 'q_fever', 'q_history_ispa'],
        anamnesis: ["Telinga saya sakit banget dok, rasanya penuh dan pendengaran berkurang.", "Demam tinggi, sebelumnya ada batuk pilek seminggu ini."],
        physicalExamFindings: {
            general: "Tampak sakit sedang, gelisah.",
            vitals: "TD 120/80, N 90x, RR 18x, S 38.5°C",
            heent: "Otoskopi: Membran timpani hiperemis, bulging (+), refleks cahaya (-), perforasi (-)."
        },
        labs: {},
        vitals: { temp: 38.5, bp: '120/80', hr: 90, rr: 18 },
        correctTreatment: ['amoxicillin_500', 'paracetamol_500', 'pseudoephedrine_30'],
        correctProcedures: [],
        requiredEducation: ['med_compliance', 'avoid_water_ear', 'red_flag_monitor'],
        risk: 'low',
        nonReferrable: true,
        referralExceptions: ['emergency', 'comorbidity', 'perforation'],
        differentialDiagnosis: ['H66.0', 'H60.0']
    },
    {
        id: 'sinusitis_acute',
        diagnosis: 'Sinusitis Akut',
        icd10: 'J01',
        skdi: '4A',
        category: 'ENT',
        symptoms: ['Hidung tersumbat', 'Ingus kental', 'Nyeri wajah', 'Nyeri kepala depan'],
        clue: "Hidung tersumbat + ingus kental purulen + nyeri wajah/kepala depan. Sering pasca ISPA.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [
                { id: 'q_main', text: 'Keluhannya apa?', response: 'Hidung mampet dok, ingus kuning kental dan nyeri wajah.', sentiment: 'confirmation', priority: 'essential' }
            ],
            rps: [
                { id: 'q_pain', text: 'Nyeri wajah?', response: 'Iya dok, di atas mata terasa nyeri tekan.', sentiment: 'confirmation' },
                { id: 'q_headache', text: 'Pusing?', response: 'Pusing di dahi terutama pagi.', sentiment: 'confirmation' }
            ],
            rpd: [{ id: 'q_cold', text: 'Sebelumnya pilek?', response: 'Iya dok, minggu lalu pilek biasa.', sentiment: 'neutral' }],
            rpk: [{ id: 'q_fam', text: 'Keluarga ada?', response: 'Nggak ada dok.', sentiment: 'denial' }],
            sosial: []
        },
        essentialQuestions: ['q_main', 'q_pain'],
        anamnesis: ["Hidung mampet, ingus kuning kental.", "Nyeri di atas mata, pusing pagi hari."],
        physicalExamFindings: {
            general: "Tampak sakit ringan.",
            vitals: "TD 120/80, N 80x, RR 18x, S 37.5°C",
            heent: "Nyeri tekan sinus frontalis (+), sekret mukopurulen dari meatus medius."
        },
        labs: {},
        vitals: { temp: 37.5, bp: '120/80', hr: 80, rr: 18 },
        correctTreatment: ['amoxicillin_500', 'pseudoephedrine', 'paracetamol_500'],
        correctProcedures: [],
        requiredEducation: ['steam_inhalation', 'fluid_intake', 'med_compliance'],
        risk: 'low',
        nonReferrable: true,
        referralExceptions: ['no_improvement', 'recurrent'],
        differentialDiagnosis: ['J00', 'J30.4']
    },
    {
        id: 'conjunctivitis_bacterial',
        diagnosis: 'Konjungtivitis Bakterial',
        icd10: 'H10.9',
        skdi: '4A',
        category: 'Ophthalmology',
        symptoms: ['Mata merah', 'Belekan (kotoran mata)', 'Mata lengket pagi hari', 'Tidak ada penurunan visus'],
        clue: "Mata merah visus normal + sekret purulen (belekan). Sering bilateral.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [
                { id: 'q_main', text: 'Matanya kenapa?', response: 'Mata merah dok, belekan banyak banget, susah melek pas bangun tidur.', sentiment: 'confirmation', priority: 'essential' }
            ],
            rps: [
                { id: 'q_vision', text: 'Pandangan kabur?', response: 'Nggak burem dok, cuma terhalang kotoran aja.', sentiment: 'denial' },
                { id: 'q_itch', text: 'Gatal?', response: 'Gatal sedikit, tapi lebih ke ngeres/pedih.', sentiment: 'confirmation' }
            ],
            rpd: [{ id: 'q_allergy', text: 'Ada alergi?', response: 'Nggak ada dok.', sentiment: 'denial' }],
            rpk: [{ id: 'q_fam', text: 'Keluarga ada yang sakit mata?', response: 'Anak saya juga sakit mata dok.', sentiment: 'confirmation' }],
            sosial: []
        },
        essentialQuestions: ['q_main', 'q_vision'],
        anamnesis: ["Mata merah dok, belekan banyak kuning kental.", "Bangun tidur mata lengket susah dibuka. Pandangan tidak kabur."],
        physicalExamFindings: {
            general: "Tampak baik.",
            vitals: "TD 120/80, N 80x, RR 18x, S 36.8°C",
            heent: "Visus ODS 6/6. Konjungtiva bulbi hiperemis (+/+), sekret mukopurulen (+/+). Kornea jernih."
        },
        labs: {},
        vitals: { temp: 36.8, bp: '120/80', hr: 80, rr: 18 },
        correctTreatment: ['chloramphenicol_eye_drop'],
        correctProcedures: ['eye_irrigation'],
        requiredEducation: ['eye_hygiene', 'dont_share_towel', 'discard_tissue'],
        risk: 'low',
        nonReferrable: true,
        referralExceptions: ['visual_impairment', 'no_improvement'],
        differentialDiagnosis: ['H10.1', 'B30.9']
    }
];
