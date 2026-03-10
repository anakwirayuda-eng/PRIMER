/**
 * @reflection
 * [IDENTITY]: TraumaCases
 * [PURPOSE]: Trauma and injury emergency cases.
 * [STATE]: Stable
 */

export const TRAUMA_CASES = [
    {
        id: 'laceration_minor',
        diagnosis: 'Minor Laceration',
        icd10: 'T14.1',
        skdi: '4A',
        category: 'Trauma',
        triageLevel: 3,
        esiLevel: 4,
        symptoms: ['Luka terbuka', 'Perdarahan terkontrol', 'Nyeri moderat'],
        clue: "[OBSERVATION] Luka robek sederhana. Bersihkan dengan NaCl, jahit (hecting), dan cek status imunisasi tetanus.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [
                { id: 'q_incident', text: 'Kenapa lukanya?', response: 'Kena pisau waktu potong bawang tadi dok.', priority: 'essential' },
                { id: 'q_move', text: 'Masih bisa digerakkan jarinya?', response: 'Masih bisa dok, cuma sakit aja kalau ditekuk.', priority: 'essential' },
                { id: 'q_tetanus', text: 'Kapan terakhir suntik TT?', response: 'Waktu SD kayaknya dok, sudah lama banget.', priority: 'essential' }
            ],
            medis: [
                { id: 'q_keloid', text: 'Punya bakat keloid?', response: 'Nggak ada dok.' }
            ],
            sosial: []
        },
        essentialQuestions: ['q_incident', 'q_move', 'q_tetanus'],
        anamnesis: [
            "Tangan saya kena pisau dok waktu masak, lukanya lumayan panjang.",
            "Sudah saya tekan pakai kain, darahnya sudah agak berhenti."
        ],
        physicalExamFindings: {
            general: "Tampak sadar penuh, memegangi lukanya.",
            vitals: "TD 120/80, N 88x, RR 18x, S 36.6°C",
            extremities: "Vulnus laceratum regio manus dextra panjang 4cm dalam 0.5cm, tepi rata, perdarahan aktif minimal. Neurovascular distal intak."
        },
        correctTreatment: [
            ['wound_cleaning', 'lidocaine_inj', 'suturing'],
            ['ats_injection', 'amoxicillin_500']
        ],
        differentialDiagnosis: ['Laserasi dengan cedera tendon', 'Fraktur terbuka', 'Vulnus punctum'],
        risk: 'low',
        referralRequired: false,
        deteriorationRate: 0
    },
    {
        id: 'head_injury_mild',
        diagnosis: 'Cedera Kepala Ringan (CKR)',
        icd10: 'S09.9',
        skdi: '4A',
        category: 'Trauma',
        triageLevel: 3,
        esiLevel: 4,
        symptoms: ['Nyeri kepala pasca benturan', 'Pusing', 'Mual', 'Luka lecet/hematoma kepala'],
        clue: "[OBSERVATION] Cedera kepala ringan GCS 15 — observasi kesadaran, cari tanda bahaya (muntah, amnesia, pupil anisokor).",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [
                { id: 'q_event', text: 'Kejadiannya bagaimana?', response: 'Jatuh dari motor dok, kepala kena aspal.', priority: 'essential' },
                { id: 'q_conscious', text: 'Sempat pingsan?', response: 'Nggak pingsan dok, cuma pusing aja.' }
            ],
            rps: [
                { id: 'q_vomit', text: 'Ada muntah?', response: 'Belum muntah dok, cuma mual.', priority: 'essential' },
                { id: 'q_amnesia', text: 'Ingat kejadiannya?', response: 'Ingat dok, semua ingat.' },
                { id: 'q_headache', text: 'Sakitnya makin berat?', response: 'Masih sama aja dok, nggak tambah berat.' }
            ],
            rpd: [
                { id: 'q_blood_thin', text: 'Minum obat pengencer darah?', response: 'Tidak ada dok.' }
            ],
            sosial: [
                { id: 'q_helmet', text: 'Pakai helm?', response: 'Nggak pakai dok, cuma deket rumah.' }
            ]
        },
        essentialQuestions: ['q_event', 'q_conscious', 'q_vomit'],
        anamnesis: [
            "Baru kecelakaan motor dok, kepala kena aspal. Pusing tapi nggak pingsan.",
            "Jatuh dari tangga, kepala kebentur tembok. Mual tapi belum muntah."
        ],
        physicalExamFindings: {
            general: "Tampak sadar penuh, kesakitan lokasi benturan.",
            vitals: "TD 130/80, N 88x, RR 18x, S 36.8°C",
            heent: "Hematoma regio frontalis sinistra ∅ 3cm, vulnus excoriatum 2cm. Pupil isokor 3mm/3mm, RC +/+.",
            neuro: "GCS E4V5M6 = 15, kekuatan motorik 5/5/5/5, refleks fisiologis normal."
        },
        correctTreatment: [
            ['cold_compress', 'wound_cleaning', 'monitor_vitals_15'],
            ['paracetamol_500', 'observation_6h']
        ],
        differentialDiagnosis: ['Cedera kepala sedang (CKS)', 'Perdarahan epidural', 'Fraktur basis cranii'],
        risk: 'medium',
        referralRequired: false,
        deteriorationRate: 1
    },
    {
        id: 'snake_bite',
        diagnosis: 'Gigitan Ular Berbisa',
        icd10: 'T63.0',
        skdi: '3B',
        category: 'Trauma',
        triageLevel: 2,
        esiLevel: 2,
        symptoms: ['Luka gigitan 2 puncture marks', 'Bengkak progresif', 'Nyeri hebat', 'Mual', 'Perdarahan dari luka'],
        clue: "[URGENT] Gigitan ular dengan tanda envenomasi: bengkak progresif, nyeri hebat. Imobilisasi + SABU jika tersedia!",
        relevantLabs: ['Darah Lengkap', 'PT/APTT'],
        anamnesisQuestions: {
            keluhan_utama: [
                { id: 'q_event', text: 'Kapan digigitnya?', response: 'Baru setengah jam lalu dok, di sawah.', priority: 'essential' },
                { id: 'q_snake', text: 'Ularnya seperti apa?', response: 'Hijau dok, kecil, di pohon.', priority: 'essential' }
            ],
            rps: [
                { id: 'q_swell', text: 'Bengkaknya bertambah?', response: 'Iya dok, tadi cuma di jari, sekarang sampai pergelangan.', priority: 'essential' },
                { id: 'q_numb', text: 'Ada mati rasa?', response: 'Kesemutan sampai lengan dok.' },
                { id: 'q_nausea', text: 'Mual atau pusing?', response: 'Iya mual dok, pusing juga.' }
            ],
            rpd: [
                { id: 'q_allergy', text: 'Pernah alergi?', response: 'Nggak pernah dok.' }
            ],
            sosial: [
                { id: 'q_treatment', text: 'Sudah diapakan lukanya?', response: 'Dibalut sama tetangga dok, dikasih obat tradisional.' }
            ]
        },
        essentialQuestions: ['q_event', 'q_snake', 'q_swell'],
        anamnesis: [
            "Digigit ular di sawah dok, kakinya bengkak besar, sakitnya luar biasa.",
            "Baru digigit ular hijau setengah jam lalu, bengkaknya cepat sekali naik."
        ],
        physicalExamFindings: {
            general: "Tampak cemas, gelisah, berkeringat.",
            vitals: "TD 100/70, N 110x, RR 22x, S 37.0°C",
            extremities: "Edema progresif digiti III-V manus dextra sampai wrist, fang marks 2 titik jarak 1.5cm, ekimosis perilesional, nyeri tekan hebat. Neurovascular distal intak."
        },
        correctTreatment: [
            ['immobilize_limb', 'iv_line', 'saep_antivenom'],
            ['ats_injection', 'ketorolac_iv', 'monitor_vitals_15', 'observation_6h']
        ],
        differentialDiagnosis: ['Gigitan serangga', 'Selulitis', 'Reaksi alergi lokal'],
        risk: 'emergency',
        referralRequired: true,
        deteriorationRate: 3
    },
    {
        id: 'burn_second_degree',
        diagnosis: 'Combustio Grade II (<20% TBSA)',
        icd10: 'T30.2',
        skdi: '4A',
        category: 'Trauma',
        triageLevel: 2,
        esiLevel: 2,
        symptoms: ['Luka melepuh (bula)', 'Nyeri hebat', 'Kulit merah basah', 'Edema lokal'],
        clue: "[URGENT] Luka bakar grade II — cooling 20 menit, jangan pecahkan bula! Hitung %TBSA untuk keputusan resusitasi.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [
                { id: 'q_event', text: 'Kenapa bisa kena?', response: 'Kena air panas dok, tumpah dari kompor.', priority: 'essential' },
                { id: 'q_when', text: 'Kejadiannya kapan?', response: 'Baru 30 menit lalu dok.', priority: 'essential' }
            ],
            rps: [
                { id: 'q_area', text: 'Kena di mana saja?', response: 'Lengan kanan sama dada dok.', priority: 'essential' },
                { id: 'q_pain', text: 'Sakitnya seperti apa?', response: 'Perih dan panas banget dok, nggak tahan.' },
                { id: 'q_first_aid', text: 'Sudah diapakan?', response: 'Dikasih pasta gigi sama tetangga dok.' }
            ],
            rpd: [
                { id: 'q_dm', text: 'Ada kencing manis?', response: 'Nggak ada dok.' }
            ],
            sosial: []
        },
        essentialQuestions: ['q_event', 'q_when', 'q_area'],
        anamnesis: [
            "Kena air mendidih dok, lengan sama dada melepuh-lepuh perih sekali.",
            "Tumpah minyak goreng panas, kulitnya langsung merah melepuh."
        ],
        physicalExamFindings: {
            general: "Tampak kesakitan hebat, menangis.",
            vitals: "TD 110/70, N 100x, RR 22x, S 37.0°C",
            skin: "Combustio grade II pada antebrachii dextra et regio pectoralis dextra. Bula (+) multipel, dasar luka merah basah, nyeri sentuh (+). Estimasi luas ±12% TBSA (rule of 9s: lengan 9% + dada parsial 3%)."
        },
        correctTreatment: [
            ['burn_cooling', 'iv_line', 'ketorolac_iv', 'burn_wrap'],
            ['silver_sulfadiazine', 'ats_injection', 'iv_fluid_rl']
        ],
        differentialDiagnosis: ['Combustio grade III', 'Chemical burn', 'Sunburn berat'],
        risk: 'emergency',
        referralRequired: false,
        deteriorationRate: 1
    },
    {
        id: 'open_fracture',
        diagnosis: 'Fraktur Terbuka (Open Fracture)',
        icd10: 'S82.1',
        icd9cm: ['79.30', '86.22'],
        skdi: '3B',
        category: 'Trauma',
        triageLevel: 2,
        esiLevel: 2,
        symptoms: ['Tulang terlihat menonjol', 'Deformitas ekstremitas', 'Perdarahan aktif dari luka', 'Nyeri hebat', 'Tidak bisa digerakkan'],
        clue: "[URGENT] Fraktur terbuka — tulang terlihat! Jangan reposisi di lapangan! Irigasi NaCl, tutup kasa basah steril, bidai, ATS, antibiotik!",
        relevantLabs: ['Darah Lengkap'],
        anamnesisQuestions: {
            keluhan_utama: [
                { id: 'q_event', text: 'Apa yang terjadi?', response: 'Kecelakaan motor dok, kaki kanan tertindih motor, sekarang tulangnya keluar.', priority: 'essential' },
                { id: 'q_move', text: 'Bisa digerakkan?', response: 'Nggak bisa sama sekali dok, sakit luar biasa.', priority: 'essential' },
                { id: 'q_bleed', text: 'Darahnya banyak?', response: 'Banyak dok, sudah dibalut tapi masih merembes.', priority: 'essential' }
            ],
            rps: [
                { id: 'q_numbness', text: 'Ada mati rasa di bawahnya?', response: 'Agak kebas di telapak kaki dok.' }
            ],
            rpd: [
                { id: 'q_tt', text: 'Kapan terakhir suntik tetanus?', response: 'Nggak ingat dok.' }
            ],
            sosial: []
        },
        essentialQuestions: ['q_event', 'q_move', 'q_bleed'],
        anamnesis: [
            "KLL motor, kaki kanan bengkok, tulang keluar dari kulit, darah banyak.",
            "Tertindih motor, fraktur terbuka tibia, perdarahan aktif."
        ],
        physicalExamFindings: {
            general: "Tampak kesakitan hebat, pucat.",
            vitals: "TD 100/70 (blood loss), N 110x, RR 24x, S 36.5°C",
            extremities: "Fraktur terbuka 1/3 proksimal tibia dextra Gustilo II. Fragment tulang terlihat ±2cm. Deformitas angulasi (+). Perdarahan aktif terkontrol. Neurovascular distal: dorsalis pedis teraba lemah, sensasi menurun."
        },
        correctTreatment: [
            ['iv_line', 'iv_fluid_rl', 'ketorolac_iv', 'wound_cleaning'],
            ['splint_fracture', 'ats_injection', 'amoxicillin_500', 'hemostasis']
        ],
        differentialDiagnosis: ['Fraktur tertutup', 'Dislokasi', 'Sindrom kompartemen', 'Crush injury'],
        risk: 'emergency',
        referralRequired: true,
        referralTarget: 'SpOT',
        deteriorationRate: 3,
        sisruteData: {
            situation: 'Fraktur terbuka tibia dextra Gustilo II, perdarahan aktif, NV distal terganggu.',
            background: 'KLL motor. Sudah dibidai + irigasi NaCl + ATS + antibiotik profilaksis.',
            assessment: 'Fraktur terbuka grade II, butuh debridement + fiksasi operatif dalam 6 jam.',
            recommendation: 'SpOT untuk debridement, fiksasi (ORIF/external fixator), cegah infeksi.'
        },
        billingItems: {
            tindakan: [{ code: '79.30', name: 'Bidai', actionId: 'splint_fracture' }, { code: '86.22', name: 'Debridement', actionId: 'wound_cleaning' }],
            obat: [{ medId: 'ketorolac_iv', qty: 1 }, { medId: 'amoxicillin_500', qty: 1 }, { medId: 'ats_injection', qty: 1 }],
            alkes: [{ id: 'bidai_set', qty: 1, unitCost: 30000 }, { id: 'kasa_steril', qty: 10, unitCost: 5000 }, { id: 'iv_cannula', qty: 1, unitCost: 15000 }],
            estimatedCost: 400000
        },
        wikiKey: 'igd_open_fracture'
    },
    {
        id: 'organophosphate_poisoning',
        diagnosis: 'Keracunan Organofosfat (Pestisida)',
        icd10: 'T60.0',
        icd9cm: ['99.29', '96.35'],
        skdi: '3B',
        category: 'Trauma',
        triageLevel: 1,
        esiLevel: 1,
        symptoms: ['Hipersalivasi (mulut berbusa)', 'Miosis (pupil kecil)', 'Bradikardia', 'Diare/inkontinensia', 'Kejang', 'Bau pestisida'],
        clue: "[CRITICAL] SLUDGE: Salivation, Lacrimation, Urination, Defecation, GI distress, Emesis. Antidot: Atropin + Pralidoxime!",
        relevantLabs: ['Darah Lengkap'],
        anamnesisQuestions: {
            keluhan_utama: [
                { id: 'q_event', text: 'Apa yang terjadi?', response: 'Minum racun serangga dok, sengaja.', priority: 'essential' },
                { id: 'q_what', text: 'Merk apa yang diminum?', response: 'Baygon cair dok, sekitar setengah botol.', priority: 'essential' },
                { id: 'q_when', text: 'Kapan minumnya?', response: 'Baru 30 menit lalu dok.', priority: 'essential' }
            ],
            rps: [
                { id: 'q_vomit', text: 'Sudah muntah?', response: 'Muntah-muntah terus dok, keluar busa dari mulut.' },
                { id: 'q_breathe', text: 'Sesak?', response: 'Iya napasnya bunyi-bunyi dok.' }
            ],
            rpd: [
                { id: 'q_psych', text: 'Ada masalah?', response: 'Stres dok, baru putus sama pacar.', priority: 'essential' }
            ],
            sosial: []
        },
        essentialQuestions: ['q_event', 'q_what', 'q_when'],
        anamnesis: [
            "Minum racun serangga 30 menit lalu, muntah berbusa, keringat banyak, kencing di celana.",
            "Intentional self-harm organofosfat, SLUDGE syndrome, pupil pinpoint."
        ],
        physicalExamFindings: {
            general: "Tampak gelisah kemudian stupor, mulut hipersalivasi (foaming), bau pestisida menyengat.",
            vitals: "TD 90/60, N 50x (bradikardia), RR 30x, S 36.0°C",
            heent: "Pupil miosis pinpoint bilateral 1mm/1mm, lakrimasi (+). Hipersalivasi masif.",
            abdomen: "Bising usus hiperaktif, inkontinensia fekal (+).",
            thorax: "Ronkhi basah bilateral (bronkorea), wheezing (+)."
        },
        correctTreatment: [
            ['protect_airway', 'suction_airway', 'atropine_iv', 'iv_line'],
            ['pralidoxime_iv', 'gastric_lavage', 'activated_charcoal', 'monitor_vitals_15']
        ],
        differentialDiagnosis: ['Keracunan karbamat', 'Keracunan jamur', 'Myasthenia gravis', 'Overdosis opioid'],
        risk: 'critical',
        referralRequired: true,
        referralTarget: 'SpPD',
        deteriorationRate: 9,
        sisruteData: {
            situation: 'Keracunan organofosfat 30 menit, SLUDGE (+), bradikardia N 50x, miosis pinpoint.',
            background: 'Minum Baygon cair ±100ml (intentional self-harm). Stressor psikososial.',
            assessment: 'Intoksikasi organofosfat berat. Atropin loading dimulai. Butuh ICU + psikiatri.',
            recommendation: 'ICU SpPD untuk drip atropin + pralidoxime. Konsultasi psikiatri pasca-stabil.'
        },
        billingItems: {
            tindakan: [{ code: '96.35', name: 'Bilas Lambung', actionId: 'gastric_lavage' }, { code: '99.29', name: 'Antidot IV', actionId: 'atropine_iv' }],
            obat: [{ medId: 'atropine_iv', qty: 10 }, { medId: 'pralidoxime_iv', qty: 1 }, { medId: 'activated_charcoal', qty: 1 }],
            alkes: [{ id: 'ngt_tube', qty: 1, unitCost: 25000 }, { id: 'spuit_3cc', qty: 10, unitCost: 3000 }],
            estimatedCost: 750000
        },
        wikiKey: 'igd_organophosphate_poisoning'
    }
];
