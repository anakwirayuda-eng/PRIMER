/**
 * @reflection
 * [IDENTITY]: ent
 * [PURPOSE]: ENT (Ear, Nose, Throat) cases for CaseLibrary.
 * [STATE]: Experimental
 * [LAST_UPDATE]: 2026-02-12
 */

export const ENT_CASES = [
    {
        id: 'rhinitis_allergic',
        diagnosis: 'Rinitis Alergi',
        icd10: 'J30.4',
        skdi: '4A',
        category: 'ENT',
        symptoms: ['Bersin beruntun', 'Hidung gatal', 'Hidung meler encer', 'Hidung tersumbat'],
        clue: "Bersin-bersin >3x beruntun, hidung gatal meler encer, sering pagi hari. Riwayat atopi.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [
                { id: 'q_main', text: 'Hidungnya kenapa ini pak/bu?', response: 'Hidung saya bersin-bersin terus, gatal, dan meler encer.', sentiment: 'confirmation', priority: 'essential' }
            ],
            rps: [
                { id: 'q_trigger', text: 'Ada pencetusnya nggak? Kapan biasanya kambuh?', response: 'Kalau kena debu atau bangun tidur pagi.', sentiment: 'neutral', priority: 'essential' },
                { id: 'q_eyes', text: 'Matanya juga ikut gatal nggak?', response: 'Iya kadang mata juga gatal berair.', sentiment: 'confirmation' }
            ],
            rpd: [
                { id: 'q_history', text: 'Punya riwayat alergi?', response: 'Iya dok, alergi debu sejak kecil.', sentiment: 'confirmation' }
            ],
            rpk: [
                { id: 'q_fam', text: 'Keluarga ada alergi?', response: 'Ibu saya asma, adik juga alergi.', sentiment: 'confirmation' }
            ],
            sosial: []
        },
        essentialQuestions: ['q_main', 'q_trigger'],
        anamnesis: ["Bersin-bersin terus dok, hidung gatal meler.", "Sesak napas kambuh lagi dok, kena debu langsung kumat. Ibu saya juga asma."],
        physicalExamFindings: {
            general: "Tampak baik.",
            vitals: "TD 120/80, N 78x, RR 18x, S 36.7°C",
            heent: "Mukosa konka edema, pucat (livid), sekret serous (+). Allergic shiners (+)."
        },
        labs: {},
        vitals: { temp: 36.7, bp: '120/80', hr: 78, rr: 18 },
        correctTreatment: ['cetirizine_10', 'pseudoephedrine', 'fluticasone_nasal'],
        correctProcedures: [],
        requiredEducation: ['allergen_avoid', 'hand_hygiene'],
        risk: 'low',
        nonReferrable: true,
        referralExceptions: ['no_improvement', 'comorbidity'],
        differentialDiagnosis: ['J00', 'J30.0']
    },
    {
        id: 'faringitis_akut',
        diagnosis: 'Faringitis Akut',
        icd10: 'J02.9',
        skdi: '4A',
        category: 'ENT',
        anamnesis: ["Tenggorokan sakit buat menelan dok, sudah 2 hari.", "Badan agak greges-greges, batuk pilek sedikit. Suara agak serak."],
        physicalExamFindings: { general: "Tampak sakit ringan.", vitals: "TD 120/80, N 82x, RR 18x, S 37.8°C", heent: "Faring: Hiperemis (+), tonsil T1/T1 tidak hiperemis, uvula di tengah. KGB leher: Teraba membesar minimal, nyeri tekan (+)." },
        labs: {}, vitals: { temp: 37.8, bp: '120/80', hr: 82, rr: 18 },
        correctTreatment: ['paracetamol_500', 'amoxicillin_500', 'lozenges'],
        correctProcedures: [],
        requiredEducation: ['rest_and_fluids', 'avoid_spicy_food', 'warm_saltwater_gargle'],
        risk: 'low', nonReferrable: true, referralExceptions: ['abscess_suspicion', 'dyspnea'],
        differentialDiagnosis: ['J02.9', 'J03.9']
    },
    {
        id: 'tonsilitis_akut',
        diagnosis: 'Tonsilitis Akut',
        icd10: 'J03.9',
        skdi: '4A',
        category: 'ENT',
        anamnesis: ["Tenggorokan sakit banget dok, amandel saya bengkak.", "Suara jadi bindeng, susah nelan makanan. Demam sudah 3 hari naik turun."],
        physicalExamFindings: { general: "Tampak sakit sedang.", vitals: "TD 110/70, N 88x, RR 20x, S 38.5°C", heent: "Tonsil: T3/T3 hiperemis (+), detritus (+), kripta melebar. Faring: Hiperemis (+)." },
        labs: {}, vitals: { temp: 38.5, bp: '110/70', hr: 88, rr: 20 },
        correctTreatment: ['amoxicillin_500', 'paracetamol_500', 'lozenges'],
        correctProcedures: [],
        requiredEducation: ['rest_and_fluids', 'diet_soft', 'med_compliance'],
        risk: 'low', nonReferrable: true, referralExceptions: ['tonsil_hypertrophy_obs', 'recurrent_tonsillitis'],
        differentialDiagnosis: ['J03.9', 'J35.0']
    },
    {
        id: 'otitis_media_akut',
        diagnosis: 'Otitis Media Akut (OMA)',
        icd10: 'H66.9',
        skdi: '4A',
        category: 'ENT',
        anamnesis: ["Telinga kanan sakit banget dok, rasanya kayak penuh.", "Sedang batuk pilek dok sudah seminggu. Telinga rasanya ngenyut dan pendengaran berkurang sedikit."],
        physicalExamFindings: { general: "Tampak tidak nyaman, memegang telinga.", vitals: "TD 120/80, N 84x, RR 18x, S 38.2°C", heent: "Telinga: Membran timpani hiperemis, bulging (+), refleks cahaya (-), tidak ada perforasi. Serumen (-)." },
        labs: {}, vitals: { temp: 38.2, bp: '120/80', hr: 84, rr: 18 },
        correctTreatment: ['amoxicillin_500', 'paracetamol_500', 'pseudoephedrine', 'boric_acid_ear'],
        correctProcedures: [],
        requiredEducation: ['dont_swim', 'med_compliance', 'red_flag_perforation'],
        risk: 'low', nonReferrable: true, referralExceptions: ['perforation', 'chronic_discharge'],
        differentialDiagnosis: ['H66.0', 'H60.0']
    },
    {
        id: 'furunkel_hidung',
        diagnosis: 'Furunkel Hidung',
        icd10: 'J34.0',
        skdi: '4A',
        category: 'ENT',
        anamnesis: ["Hidung saya sakit dok, ada bisul di dalamnya.", "Hidung bengkak dan merah, kalau kesentuh dikit sakit banget. Sudah 2 hari."],
        physicalExamFindings: { general: "Tampak tidak nyaman.", vitals: "TD 120/80, N 80x, RR 18x, S 37.4°C", heent: "Hidung: Vestibulum nasi tampak nodul eritematosa, edema, nyeri tekan (+), fluktuasi (+) minimal." },
        labs: {}, vitals: { temp: 37.4, bp: '120/80', hr: 80, rr: 18 },
        correctTreatment: ['mupirocin_ointment', 'amoxicillin_500', 'paracetamol_500'],
        correctProcedures: [],
        requiredEducation: ['dont_squeeze', 'warm_compress', 'hand_hygiene'],
        risk: 'low', nonReferrable: true, referralExceptions: ['cellulitis_face'],
        differentialDiagnosis: ['J34.0', 'L02.0']
    },
    {
        id: 'faringitis_streptokokus',
        diagnosis: 'Faringitis Streptokokus',
        icd10: 'J02.0',
        skdi: '4A',
        category: 'ENT',
        anamnesis: ["Tenggorokan sakit sekali untuk menelan, demam tinggi.", "Nggak ada batuk pilek dok, murni tenggorokan kering dan sakit. Ada bintik-bintik merah di langit-langit mulut."],
        physicalExamFindings: { general: "Tampak sakit sedang, febris.", vitals: "TD 110/70, N 94x, RR 22x, S 39.0°C", heent: "Faring: Hiperemis, eksudat (+), petechiae pada palatum molle. KGB leher ant: Pembesaran (+), nyeri tekan (+)." },
        labs: { "Rapid Strep Test": { result: "Positif (Group A Streptococcus)", cost: 150000 } },
        vitals: { temp: 39.0, bp: '110/70', hr: 94, rr: 22 },
        correctTreatment: ['amoxicillin_500', 'paracetamol_500'],
        correctProcedures: [],
        requiredEducation: ['complete_antibiotics', 'rest_and_fluids', 'diet_soft'],
        risk: 'low', nonReferrable: true, referralExceptions: ['rheumatic_fever_history'],
        differentialDiagnosis: ['J02.0', 'B27.0']
    },
    {
        id: 'otitis_eksterna',
        diagnosis: 'Otitis Eksterna',
        icd10: 'H60.9',
        skdi: '4A',
        category: 'ENT',
        symptoms: ['Telinga nyeri hebat', 'Gatal', 'Keluar cairan', 'Nyeri tarik tragus'],
        clue: "Nyeri telinga hebat diprovokasi tarik tragus/pinna. Swimmer's ear. Liang telinga edema, debris. Ear toilet + eardrops AB+steroid.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Telinganya kenapa pak/bu?', response: 'Telinga kanan sakit banget dok, nyeri kalau disentuh.', sentiment: 'confirmation', priority: 'essential' }],
            rps: [{ id: 'q_swim', text: 'Akhir-akhir ini habis berenang nggak?', response: 'Iya dok, kemarin renang.', sentiment: 'confirmation', priority: 'essential' }],
            rpd: [], rpk: [], sosial: [{ id: 'q_cotton', text: 'Suka pakai cotton bud buat bersihin telinga nggak?', response: 'Sering pakai cotton bud.', sentiment: 'confirmation' }]
        },
        essentialQuestions: ['q_main', 'q_swim'],
        anamnesis: ["Telinga saya sakit banget dok, apalagi kalau ditarik.", "Telinga nyeri habis renang, sekarang keluar cairan."],
        physicalExamFindings: { general: "Tampak kesakitan.", vitals: "TD 120/80, N 80x, RR 18x, S 37.2°C", heent: "Tragus sign (+), nyeri tarik pinna (+). Liang telinga edema, hiperemis, debris (+)." },
        labs: {}, vitals: { temp: 37.2, bp: '120/80', hr: 80, rr: 18 },
        correctTreatment: ['ofloxacin_ear_drops', 'paracetamol_500'],
        correctProcedures: ['ear_toilet'],
        requiredEducation: ['keep_ear_dry', 'no_cotton_buds', 'ear_plugs_swimming'],
        risk: 'low', nonReferrable: true, referralExceptions: ['malignant_oe'],
        differentialDiagnosis: ['H60.9', 'H66.9']
    },
    {
        id: 'serumen_prop',
        diagnosis: 'Serumen Prop (Impacted Cerumen)',
        icd10: 'H61.2',
        skdi: '4A',
        category: 'ENT',
        symptoms: ['Telinga tersumbat', 'Pendengaran berkurang', 'Tinnitus'],
        clue: "Tuli konduktif, telinga penuh. Otoskopi: serumen menutupi lumen. Irigasi/kait serumen. Lunak dulu jika keras (karbogliserin).",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Telinganya kenapa ini?', response: 'Telinga budeg sebelah dok, kayak tersumbat.', sentiment: 'confirmation', priority: 'essential' }],
            rps: [{ id: 'q_pain', text: 'Terasa sakit nggak telinganya?', response: 'Nggak sakit, cuma penuh aja.', sentiment: 'confirmation' }],
            rpd: [], rpk: [], sosial: [{ id: 'q_cotton', text: 'Sehari-hari sering pakai cotton bud nggak?', response: 'Iya dok, tiap habis mandi.', sentiment: 'confirmation' }]
        },
        essentialQuestions: ['q_main'],
        anamnesis: ["Telinga budeg sebelah dok, penuh.", "Pendengaran berkurang, ada yang nyumbat."],
        physicalExamFindings: { general: "Tampak baik.", vitals: "TD 120/80, N 78x, RR 18x, S 36.7°C", heent: "Serumen obturans coklat keras menutupi lumen. Rinne (-), Weber lateralisasi ke telinga sakit." },
        labs: {}, vitals: { temp: 36.7, bp: '120/80', hr: 78, rr: 18 },
        correctTreatment: ['carboglycerin_ear_drops'],
        correctProcedures: ['ear_irrigation', 'cerumen_removal'],
        requiredEducation: ['no_cotton_buds', 'normal_ear_wax'],
        risk: 'low', nonReferrable: true, referralExceptions: ['perforation_suspected'],
        differentialDiagnosis: ['H61.2', 'H68.1']
    },
    {
        id: 'mabuk_perjalanan',
        diagnosis: 'Mabuk Perjalanan (Motion Sickness)',
        icd10: 'T75.3',
        skdi: '4A',
        category: 'ENT',
        symptoms: ['Mual di kendaraan', 'Muntah', 'Pusing', 'Keringat dingin'],
        clue: "Mual muntah pusing saat bepergian. Konflik sensorik vestibular-visual. Dimenhidrinat sebelum perjalanan, duduk depan, fokus horizon.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Keluhannya apa pak/bu?', response: 'Selalu mual muntah kalau naik kendaraan dok, apalagi jalan berliku.', sentiment: 'confirmation', priority: 'essential' }],
            rps: [{ id: 'q_trigger', text: 'Biasanya naik kendaraan apa yang bikin mual?', response: 'Bus dan mobil, duduk belakang makin parah.', sentiment: 'confirmation', priority: 'essential' }],
            rpd: [{ id: 'q_vertigo', text: 'Pernah pusing berputar-putar di luar kendaraan?', response: 'Nggak, cuma di kendaraan aja.', sentiment: 'denial' }],
            rpk: [], sosial: []
        },
        essentialQuestions: ['q_main', 'q_trigger'],
        anamnesis: ["Selalu mabuk perjalanan dok, mual muntah.", "Nggak kuat naik kendaraan, pusing mual kalau jalan jauh."],
        physicalExamFindings: { general: "Pucat, keringat dingin.", vitals: "TD 110/70, N 88x, RR 20x, S 36.7°C", heent: "DBN. Nystagmus (-)." },
        labs: {}, vitals: { temp: 36.7, bp: '110/70', hr: 88, rr: 20 },
        correctTreatment: ['dimenhydrinate_50', 'ondansetron_4'],
        correctProcedures: [],
        requiredEducation: ['sit_in_front', 'look_at_horizon', 'light_meal_before'],
        risk: 'low', nonReferrable: true, referralExceptions: [],
        differentialDiagnosis: ['T75.3', 'H81.0']
    },
    {
        id: 'rhinitis_akut',
        diagnosis: 'Rhinitis Akut (Common Cold)',
        icd10: 'J00',
        skdi: '4A',
        category: 'ENT',
        symptoms: ['Hidung mampet', 'Pilek encer', 'Bersin', 'Demam ringan'],
        clue: "ISPA virus. Self-limiting 5-7 hari. Simptomatik: dekongestan, antihistamin gen-1. JANGAN antibiotik!",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Apa yang dirasakan pak/bu?', response: 'Pilek, hidung mampet, bersin-bersin, badan meriang.', sentiment: 'confirmation', priority: 'essential' }],
            rps: [{ id: 'q_duration', text: 'Sudah berapa hari ini?', response: 'Baru 2 hari dok.', sentiment: 'confirmation', priority: 'essential' }],
            rpd: [], rpk: [], sosial: []
        },
        essentialQuestions: ['q_main', 'q_duration'],
        anamnesis: ["Pilek, hidung mampet, bersin-bersin dok.", "Flu ringan, badan meriang, hidung meler terus."],
        physicalExamFindings: { general: "Sakit ringan.", vitals: "TD 120/80, N 80x, RR 18x, S 37.4°C", heent: "Mukosa konka edema, hiperemis, sekret serous." },
        labs: {}, vitals: { temp: 37.4, bp: '120/80', hr: 80, rr: 18 },
        correctTreatment: ['paracetamol_500', 'pseudoephedrine', 'ctm_4'],
        correctProcedures: [],
        requiredEducation: ['rest_and_fluids', 'hand_hygiene', 'self_limiting_viral'],
        risk: 'low', nonReferrable: true, referralExceptions: [],
        differentialDiagnosis: ['J00', 'J30.4']
    },
    {
        id: 'rhinitis_vasomotor',
        diagnosis: 'Rhinitis Vasomotor',
        icd10: 'J30.0',
        skdi: '4A',
        category: 'ENT',
        symptoms: ['Hidung tersumbat bergantian', 'Bersin', 'Dipicu suhu/bau'],
        clue: "Non-alergi, trigger: perubahan suhu, bau menyengat, emosi. Skin prick test (-). Steroid nasal/ipratropium.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Hidungnya kenapa ini pak/bu?', response: 'Hidung tersumbat bergantian kiri-kanan dok, bersin-bersin.', sentiment: 'confirmation', priority: 'essential' }],
            rps: [{ id: 'q_trigger', text: 'Ada yang jadi pencetusnya nggak?', response: 'Kalau pindah dari AC ke panas, atau bau menyengat.', sentiment: 'confirmation', priority: 'essential' }],
            rpd: [], rpk: [], sosial: []
        },
        essentialQuestions: ['q_main', 'q_trigger'],
        anamnesis: ["Hidung tersumbat bergantian, bersin kalau perubahan suhu.", "Pilek bukan alergi, tes alergi negatif tapi tetap kambuh."],
        physicalExamFindings: { general: "Tampak baik.", vitals: "TD 120/80, N 78x, RR 18x, S 36.7°C", heent: "Mukosa konka edema, livid, sekret serous. Polip (-)." },
        labs: {}, vitals: { temp: 36.7, bp: '120/80', hr: 78, rr: 18 },
        correctTreatment: ['fluticasone_nasal', 'ipratropium_nasal'],
        correctProcedures: [],
        requiredEducation: ['avoid_triggers', 'nasal_spray_technique'],
        risk: 'low', nonReferrable: true, referralExceptions: ['no_improvement'],
        differentialDiagnosis: ['J30.0', 'J30.4']
    },
    {
        id: 'benda_asing_hidung',
        diagnosis: 'Benda Asing di Hidung',
        icd10: 'T17.1',
        skdi: '4A',
        category: 'ENT',
        symptoms: ['Hidung tersumbat satu sisi', 'Sekret berbau busuk', 'Anak-anak'],
        clue: "Anak + hidung tersumbat UNILATERAL + sekret foul smelling → benda asing! Rhinoskopi → ekstraksi. Hati-hati aspirasi ke distal!",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Hidung anaknya kenapa bu?', response: 'Mampet sebelah, keluar ingus bau busuk.', sentiment: 'confirmation', priority: 'essential' }],
            rps: [{ id: 'q_fb', text: 'Apakah anaknya pernah masukin sesuatu ke hidung?', response: 'Kayaknya manik-manik dok.', sentiment: 'confirmation', priority: 'essential' }],
            rpd: [], rpk: [], sosial: []
        },
        essentialQuestions: ['q_main', 'q_fb'],
        anamnesis: ["Hidung anak mampet sebelah, bau busuk.", "Anak masukin manik-manik ke hidung, nggak bisa keluar."],
        physicalExamFindings: { general: "Anak rewel.", vitals: "TD -, N 100x, RR 22x, S 37.0°C", heent: "Benda asing (manik-manik) di kavum nasi sinistra, sekret mukopurulen berbau." },
        labs: {}, vitals: { temp: 37.0, bp: '-', hr: 100, rr: 22 },
        correctTreatment: ['amoxicillin_250_ped'],
        correctProcedures: ['nasal_foreign_body_removal'],
        requiredEducation: ['child_safety', 'keep_small_objects_away'],
        risk: 'low', nonReferrable: true, referralExceptions: ['failed_removal', 'button_battery'],
        differentialDiagnosis: ['T17.1', 'J32.0']
    },
    {
        id: 'epistaksis',
        diagnosis: 'Epistaksis (Mimisan)',
        icd10: 'R04.0',
        skdi: '4A',
        category: 'ENT',
        symptoms: ['Hidung berdarah', 'Spontan/trauma'],
        clue: "Mayoritas anterior (plexus Kiesselbach). Tekan cuping hidung 10-15 menit, duduk condong depan. Cek TD! Posterior → rujuk!",
        relevantLabs: ['Darah Lengkap'],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Hidungnya berdarah sejak kapan?', response: 'Tiba-tiba 20 menit lalu, belum berhenti.', sentiment: 'denial', priority: 'essential' }],
            rps: [{ id: 'q_side', text: 'Yang berdarah sebelah mana?', response: 'Yang kanan dok.', sentiment: 'confirmation', priority: 'essential' }],
            rpd: [{ id: 'q_ht', text: 'Ada riwayat darah tinggi nggak?', response: 'Iya dok, sering tinggi.', sentiment: 'confirmation' }],
            rpk: [], sosial: []
        },
        essentialQuestions: ['q_main', 'q_side'],
        anamnesis: ["Hidung berdarah, belum berhenti.", "Mimisan, darah keluar terus."],
        physicalExamFindings: { general: "Cemas.", vitals: "TD 140/90, N 84x, RR 18x, S 36.7°C", heent: "Epistaksis anterior OD aktif dari plexus Kiesselbach. Setelah tekan 10 menit berhenti." },
        labs: { "Darah Lengkap": { result: "Hb 12.0, Trombosit 200.000, CT/BT normal", cost: 50000 } },
        vitals: { temp: 36.7, bp: '140/90', hr: 84, rr: 18 },
        correctTreatment: ['nasal_packing_anterior'],
        correctProcedures: ['epistaxis_management', 'anterior_nasal_packing'],
        requiredEducation: ['pinch_nose_technique', 'sit_forward', 'control_bp'],
        risk: 'low', nonReferrable: true, referralExceptions: ['posterior_epistaxis', 'uncontrolled'],
        differentialDiagnosis: ['R04.0', 'D68.9']
    },
    // === SKDI 1-3 REFERRAL CASES ===
    {
        id: 'abses_peritonsil',
        diagnosis: 'Abses Peritonsil (Quinsy)',
        icd10: 'J36',
        skdi: '3A',
        category: 'ENT',
        symptoms: ['Sakit tenggorok hebat satu sisi', 'Sulit menelan', 'Trismus', 'Suara gumam'],
        clue: "Komplikasi tonsilitis: nyeri tenggorok UNILATERAL hebat + trismus (sulit buka mulut) + hot potato voice. Tonsil terdorong ke medial, uvula deviasi kontralateral. Antibiotik IV + analgesik + rujuk drainase!",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Tenggorokannya kenapa?', response: 'Sakit banget dok di sebelah kanan, nggak bisa menelan sama sekali, buka mulut aja susah.', sentiment: 'confirmation', priority: 'essential' }],
            rps: [
                { id: 'q_swallow', text: 'Makan minum bisa?', response: 'Nggak bisa dok, air liur aja nggak bisa ditelan, keluar terus.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_trismus', text: 'Buka mulutnya bisa lebar?', response: 'Nggak bisa dok, cuma bisa sedikit.', sentiment: 'confirmation' }
            ],
            rpd: [{ id: 'q_tonsil', text: 'Sering radang tenggorok?', response: 'Iya dok, setahun bisa 5-6 kali.', sentiment: 'confirmation' }],
            rpk: [], sosial: []
        },
        essentialQuestions: ['q_main', 'q_swallow'],
        anamnesis: ["Sakit tenggorok kanan hebat, nggak bisa telan.", "Buka mulut susah, sering radang tenggorok."],
        physicalExamFindings: { general: "Tampak kesakitan, drooling.", vitals: "TD 130/80, N 96x, RR 20x, S 38.5°C", heent: "Trismus (+). Orofaring: tonsil kanan membesar, dinding faring lateral kanan bulging, uvula deviasi ke kiri. Fluktuasi (+)." },
        labs: {}, vitals: { temp: 38.5, bp: '130/80', hr: 96, rr: 20 },
        correctTreatment: ['ampicillin_sulbactam_1_5g_iv', 'metronidazole_500_iv', 'ketorolac_30_iv'],
        correctProcedures: ['iv_access'],
        requiredEducation: ['drainage_needed', 'airway_risk', 'tonsillectomy_after_recovery'],
        risk: 'high', nonReferrable: false, referralTarget: 'rs_kabupaten',
        differentialDiagnosis: ['J36', 'J03.9']
    },
    {
        id: 'omsk',
        diagnosis: 'Otitis Media Supuratif Kronik (OMSK)',
        icd10: 'H66.1',
        skdi: '3A',
        category: 'ENT',
        symptoms: ['Keluar cairan telinga kronik', 'Pendengaran menurun', 'Perforasi membran timpani'],
        clue: "Otore purulen >2 bulan + perforasi MT. OMSK benigna (tipe aman): perforasi sentral. OMSK maligna (tipe bahaya): kolesteatoma → komplikasi intrakranial! Ear toilet + tetes telinga antibiotik + rujuk audiometri.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Telinga kenapa?', response: 'Telinga kiri saya keluar cairan terus dok, sudah berbulan-bulan, bau.', sentiment: 'confirmation', priority: 'essential' }],
            rps: [
                { id: 'q_hearing', text: 'Pendengarannya gimana?', response: 'Kurang dengar dok di telinga kiri, kalau diajak ngomong suka nggak kedengar.', sentiment: 'denial', priority: 'essential' },
                { id: 'q_duration', text: 'Sudah berapa lama keluar cairan?', response: '6 bulan lebih dok, hilang timbul.', sentiment: 'confirmation' }
            ],
            rpd: [{ id: 'q_oma', text: 'Dulu pernah infeksi telinga?', response: 'Iya waktu kecil sering congek.', sentiment: 'confirmation' }],
            rpk: [], sosial: []
        },
        essentialQuestions: ['q_main', 'q_hearing'],
        anamnesis: ["Telinga kiri keluar cairan berbau 6 bulan.", "Pendengaran menurun, dulu sering congek."],
        physicalExamFindings: { general: "Tampak baik.", vitals: "Normal", heent: "Otoskopi AS: perforasi sentral MT, mukosa telinga tengah edema, discharge mukopurulen. AD: normal." },
        labs: {}, vitals: { temp: 36.8, bp: '120/80', hr: 78, rr: 18 },
        correctTreatment: ['ofloxacin_ear_drops', 'ciprofloxacin_500'],
        correctProcedures: ['ear_toilet', 'otoskopi'],
        requiredEducation: ['keep_ear_dry', 'no_swimming', 'audiometry_referral', 'surgery_if_cholesteatoma'],
        risk: 'medium', nonReferrable: false, referralTarget: 'rs_kabupaten',
        differentialDiagnosis: ['H66.1', 'H72.9']
    },
    {
        id: 'sinusitis_akut',
        diagnosis: 'Sinusitis Akut',
        icd10: 'J01.9',
        skdi: '3A',
        category: 'ENT',
        symptoms: ['Nyeri wajah', 'Hidung tersumbat', 'Sekret purulen', 'Demam'],
        clue: "Nyeri wajah/kepala sesuai lokasi sinus + sekret purulen > 10 hari + post-nasal drip. Transilluminasi sinus redup. Antibiotik (amoxicillin-clavulanate) + dekongestan + analgesik. Rujuk jika rekuren/komplikasi.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Apa keluhannya?', response: 'Pilek nggak sembuh-sembuh dok, ingus kuning kental, pipi dan dahi sakit.', sentiment: 'confirmation', priority: 'essential' }],
            rps: [
                { id: 'q_duration', text: 'Sudah berapa lama?', response: '2 minggu lebih dok, makin berat.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_postnasal', text: 'Ada ingus turun ke tenggorok?', response: 'Iya dok, terasa mengalir ke belakang, sering batuk.', sentiment: 'confirmation' }
            ],
            rpd: [{ id: 'q_allergy', text: 'Ada alergi?', response: 'Rhinitis alergi sejak kecil.', sentiment: 'confirmation' }],
            rpk: [], sosial: []
        },
        essentialQuestions: ['q_main', 'q_duration'],
        anamnesis: ["Pilek 2 minggu, ingus kuning kental, pipi dahi sakit.", "Post-nasal drip, rhinitis alergi."],
        physicalExamFindings: { general: "Tampak tidak nyaman.", vitals: "TD 120/80, N 80x, RR 18x, S 37.8°C", heent: "Nyeri tekan sinus maksilaris dan frontalis bilateral. Rinoskopi anterior: konka edema, sekret mukopurulen di meatus medius." },
        labs: {}, vitals: { temp: 37.8, bp: '120/80', hr: 80, rr: 18 },
        correctTreatment: ['amoxicillin_clavulanate_625', 'pseudoefedrin_60', 'paracetamol_500'],
        correctProcedures: ['transilluminasi_sinus'],
        requiredEducation: ['complete_antibiotic_course', 'steam_inhalation', 'ct_scan_if_recurrent'],
        risk: 'low', nonReferrable: false, referralTarget: 'rs_kabupaten',
        differentialDiagnosis: ['J01.9', 'J30.4']
    },
    {
        id: 'ca_nasofaring',
        diagnosis: 'Karsinoma Nasofaring',
        icd10: 'C11.9',
        skdi: '2',
        category: 'ENT',
        symptoms: ['Benjolan leher', 'Hidung tersumbat satu sisi', 'Epistaksis berulang', 'Tuli konduktif unilateral'],
        clue: "TRIAD karsinoma nasofaring: massa leher (metastasis KGB) + gejala telinga (tuli konduktif, tinnitus) + gejala hidung (sumbat unilateral, epistaksis). PENTING: semua benjolan leher lateral > 2minggu → curiga KNF! Rujuk biopsi!",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Ada keluhan apa pak?', response: 'Ada benjolan di leher saya dok, makin lama makin besar, sebulan ini hidung sering berdarah.', sentiment: 'confirmation', priority: 'essential' }],
            rps: [
                { id: 'q_ear', text: 'Telinganya gimana?', response: 'Telinga kiri agak budek dok, berdengung.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_nose', text: 'Hidungnya ada yang tersumbat?', response: 'Hidung kiri tersumbat terus, kadang berdarah.', sentiment: 'confirmation' }
            ],
            rpd: [], rpk: [],
            sosial: [{ id: 'q_salt_fish', text: 'Suka makan ikan asin?', response: 'Iya dok, sering banget dari kecil.', sentiment: 'confirmation' }]
        },
        essentialQuestions: ['q_main', 'q_ear'],
        anamnesis: ["Benjolan leher membesar, epistaksis berulang.", "Tuli kiri, hidung kiri tersumbat, suka ikan asin."],
        physicalExamFindings: { general: "Tampak baik.", vitals: "Normal", heent: "KGB regio jugulodigastrik sinistra: massa 3x4cm, keras, fixed, tidak nyeri. Rinoskopi posterior: massa di fossa Rosenmuller sinistra. Otoskopi AS: retraksi MT, efusi." },
        labs: {}, vitals: { temp: 36.7, bp: '120/80', hr: 78, rr: 18 },
        correctTreatment: [],
        correctProcedures: [],
        requiredEducation: ['biopsy_needed', 'staging_ct_scan', 'early_detection_important'],
        risk: 'high', nonReferrable: false, referralTarget: 'rs_provinsi',
        differentialDiagnosis: ['C11.9', 'L04.0']
    }
];
