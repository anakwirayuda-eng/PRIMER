/**
 * @reflection
 * [IDENTITY]: ophthalmology
 * [PURPOSE]: Ophthalmology (Eye) cases for CaseLibrary.
 * [STATE]: Experimental
 * [LAST_UPDATE]: 2026-02-12
 */

export const OPHTHALMOLOGY_CASES = [
    {
        id: 'hordeolum',
        diagnosis: 'Hordeolum (Bintitan)',
        icd10: 'H00.0',
        skdi: '4A',
        category: 'Ophthalmology',
        symptoms: ['Benjolan di kelopak mata', 'Nyeri', 'Bengkak merah', 'Mata berair'],
        clue: "Infeksi kelenjar kelopak mata (Meibom/Zeis). Benjolan nyeri di tepi kelopak. Kompres hangat.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [
                { id: 'q_main', text: 'Matanya kenapa bu/pak?', response: 'Ada benjolan di kelopak mata dok, sakit dan merah.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_duration', text: 'Sejak kapan?', response: '3 hari yang lalu dok.', sentiment: 'confirmation' }
            ],
            rps: [
                { id: 'q_pain', text: 'Apakah terasa nyeri?', response: 'Iya dok, cekot-cekot terutama kalau ditekan.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_vision', text: 'Penglihatan terganggu atau kabur?', response: 'Nggak dok, penglihatan biasa saja, cuma kelopak mata ini mengganjal.', sentiment: 'denial', priority: 'essential' }
            ],
            rpd: [
                { id: 'q_history', text: 'Sering bintitan?', response: 'Baru pertama kali ini.', sentiment: 'confirmation' }
            ],
            rpk: [
                { id: 'q_fam', text: 'Di keluarga ada yang pernah sakit mata juga?', response: 'Nggak ada dok.', sentiment: 'denial' }
            ],
            sosial: [
                { id: 'q_hygiene', text: 'Sering kucek mata?', response: 'Iya dok, kalau ngantuk suka kucek.', sentiment: 'neutral' }
            ]
        },
        essentialQuestions: ['q_main', 'q_pain', 'q_vision'],
        anamnesis: ["Ada benjolan di kelopak mata, sakit.", "Mata saya merah dan berair dok, sudah 3 hari. Agak silau juga."],
        physicalExamFindings: {
            general: "Tampak tidak nyaman.",
            vitals: "TD 120/80, N 78x, RR 18x, S 36.7°C",
            heent: "Nodul eritematosa, nyeri tekan (+) di margo palpebra superior kanan. Edema palpebra minimal. Visus normal."
        },
        labs: {},
        vitals: { temp: 36.7, bp: '120/80', hr: 78, rr: 18 },
        correctTreatment: ['chloramphenicol_ed', 'paracetamol_500'],
        correctProcedures: [],
        requiredEducation: ['hand_hygiene', 'avoid_scratching', 'warm_compress'],
        risk: 'low',
        nonReferrable: true,
        referralExceptions: ['no_improvement'],
        differentialDiagnosis: ['H00.1', 'H01.0']
    },
    {
        id: 'konjungtivitas_bakterial',
        diagnosis: 'Konjungtivitas Bakterial',
        icd10: 'H10.0',
        skdi: '4A',
        category: 'Ophthalmology',
        anamnesis: ["Mata merah dan berlendir dok, lengket pas bangun tidur.", "Sudah 2 hari matanya merah, gatal, dan keluar kotoran terus. Kakak saya juga kena kemarin."],
        physicalExamFindings: { general: "Tampak baik.", vitals: "TD 120/80, N 78x, RR 18x, S 36.7°C", heent: "Mata: Konjungtiva palpebra hiperemis (+), sekret mukopurulen (+), kornea jernih. Visus normal." },
        labs: {}, vitals: { temp: 36.7, bp: '120/80', hr: 78, rr: 18 },
        correctTreatment: ['chloramphenicol_ed', 'artificial_tears'],
        correctProcedures: [],
        requiredEducation: ['hand_hygiene', 'dont_share_towels', 'avoid_scratching'],
        risk: 'low', nonReferrable: true, referralExceptions: ['vision_loss', 'corneal_involvement'],
        differentialDiagnosis: ['H10.0', 'H10.1']
    },
    {
        id: 'hordeolum_eksternum',
        diagnosis: 'Hordeolum Eksternum',
        icd10: 'H00.0',
        skdi: '4A',
        category: 'Ophthalmology',
        anamnesis: ["Ada bisul kecil di pinggir bulu mata dok, sakit.", "Baru muncul kemarin, merah dan bengkak. Malu dok jadi bintitan begini."],
        physicalExamFindings: { general: "Tampak baik.", vitals: "TD 120/80, N 76x, RR 18x, S 36.8°C", heent: "Mata: Benjolan (nodul) kecil, merah, nyeri tekan (+), fluktuatif (+) minimal di margo palpebra." },
        labs: {}, vitals: { temp: 36.8, bp: '120/80', hr: 76, rr: 18 },
        correctTreatment: ['chloramphenicol_ed', 'paracetamol_500'],
        correctProcedures: [],
        requiredEducation: ['warm_compress', 'hand_hygiene', 'dont_squeeze'],
        risk: 'low', nonReferrable: true, referralExceptions: ['no_improvement', 'preseptal_cellulitis'],
        differentialDiagnosis: ['H00.0', 'H00.1']
    },
    {
        id: 'presbyopia',
        diagnosis: 'Presbiopia (Mata Tua)',
        icd10: 'H52.4',
        skdi: '4A',
        category: 'Ophthalmology',
        anamnesis: ["Mata saya susah baca dekat dok, harus dijauhkan baru keliatan.", "Tulisan kecil nggak keliatan dok, harus menjauh dulu. Umur saya 45 tahun."],
        physicalExamFindings: {
            general: "Tampak baik, dewasa.",
            vitals: "TD 120/80, N 78x, RR 18x, S 36.7°C",
            heent: "Mata: Visus jauh 6/6 OU. Visus dekat: Jaeger 4 pada 33 cm. Add +1.50 -> Jaeger 1. Near point of accommodation 50 cm (normal usia 45: ~33 cm)."
        },
        labs: {}, vitals: { temp: 36.7, bp: '120/80', hr: 78, rr: 18 },
        correctTreatment: ['reading_glasses'],
        correctProcedures: ['near_vision_test'],
        requiredEducation: ['normal_aging', 'need_reading_glasses', 'regular_check_yearly'],
        risk: 'low', nonReferrable: true, referralExceptions: [],
        differentialDiagnosis: ['H52.4', 'H52.7']
    },
    {
        id: 'benda_asing_konjungtiva',
        diagnosis: 'Benda Asing di Konjungtiva',
        icd10: 'T15.1',
        skdi: '4A',
        category: 'Ophthalmology',
        symptoms: ['Mata terasa mengganjal', 'Berair', 'Merah', 'Nyeri saat berkedip'],
        clue: "Rasa mengganjal di mata setelah terkena partikel (debu, pasir, serangga). Inspeksi + eversi palpebra → temukan & angkat benda asing. Irigasi NaCl.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [
                { id: 'q_main', text: 'Matanya kenapa pak?', response: 'Mata saya terasa mengganjal dok, kelilipan tadi pagi saat naik motor.', sentiment: 'confirmation', priority: 'essential' }
            ],
            rps: [
                { id: 'q_onset', text: 'Sejak kapan mulai terasa?', response: 'Beberapa jam lalu dok, nggak hilang-hilang.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_vision', text: 'Penglihatannya kabur nggak?', response: 'Sedikit kabur karena berair terus.', sentiment: 'confirmation' }
            ],
            rpd: [], rpk: [], sosial: [{ id: 'q_work', text: 'Sehari-harinya kerja apa pak?', response: 'Tukang las, tapi tadi nggak pakai kacamata pelindung.', sentiment: 'denial' }]
        },
        essentialQuestions: ['q_main', 'q_onset'],
        anamnesis: ["Mata saya kelilipan dok, terasa mengganjal terus.", "Mata merah dan berair, ada yang masuk tadi saat kerja."],
        physicalExamFindings: { general: "Tampak baik.", vitals: "TD 120/80, N 78x, RR 18x, S 36.7°C", eyes: "Konjungtiva bulbi hiperemis (+), lakrimasi (+). Eversi palpebra: benda asing (partikel kecil) di konjungtiva tarsalis superior. Kornea jernih, fluorescein (-). Visus 6/6." },
        labs: {}, vitals: { temp: 36.7, bp: '120/80', hr: 78, rr: 18 },
        correctTreatment: ['chloramphenicol_eye_drops'],
        correctProcedures: ['foreign_body_removal_eye', 'eye_irrigation'],
        requiredEducation: ['wear_eye_protection', 'dont_rub_eye', 'follow_up_if_worse'],
        risk: 'low', nonReferrable: true, referralExceptions: ['corneal_involvement', 'intraocular_fb'],
        differentialDiagnosis: ['T15.0', 'H10.3']
    },
    {
        id: 'perdarahan_subkonjungtiva',
        diagnosis: 'Perdarahan Subkonjungtiva',
        icd10: 'H11.3',
        skdi: '4A',
        category: 'Ophthalmology',
        symptoms: ['Mata merah terang', 'Tanpa nyeri', 'Tanpa gangguan penglihatan', 'Muncul tiba-tiba'],
        clue: "Bercak merah terang di sklera, well-demarcated, tanpa nyeri/gangguan visus. Self-limiting 1-2 minggu. Cek tekanan darah! Jika recurrent → cek bleeding disorder.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [
                { id: 'q_main', text: 'Matanya kenapa pak/bu?', response: 'Mata saya merah banget dok, tiba-tiba aja tadi pagi cermin udah merah.', sentiment: 'confirmation', priority: 'essential' }
            ],
            rps: [
                { id: 'q_pain', text: 'Terasa sakit nggak matanya?', response: 'Nggak sakit sama sekali dok.', sentiment: 'confirmation' },
                { id: 'q_vision', text: 'Penglihatannya terganggu nggak?', response: 'Nggak dok, lihat jelas.', sentiment: 'denial', priority: 'essential' }
            ],
            rpd: [{ id: 'q_ht', text: 'Ada riwayat darah tinggi?', response: 'Iya dok, tapi obatnya sering lupa minum.', sentiment: 'neutral' }],
            rpk: [], sosial: [{ id: 'q_strain', text: 'Akhir-akhir ini habis angkat berat atau batuk keras nggak?', response: 'Iya dok, kemarin batuk keras banget.', sentiment: 'confirmation' }]
        },
        essentialQuestions: ['q_main', 'q_vision'],
        anamnesis: ["Mata saya merah banget dok, tapi nggak sakit.", "Bangun tidur mata sudah merah, kayak berdarah, tapi nggak nyeri dan lihat jelas."],
        physicalExamFindings: { general: "Tampak baik.", vitals: "TD 150/95, N 78x, RR 18x, S 36.7°C", eyes: "Perdarahan subkonjungtiva homogen di konjungtiva bulbi temporalis OD, flat, well-demarcated. Visus 6/6 ODS. Pupil isokor. TIO normal." },
        labs: {}, vitals: { temp: 36.7, bp: '150/95', hr: 78, rr: 18 },
        correctTreatment: ['artificial_tears'],
        correctProcedures: [],
        requiredEducation: ['self_limiting', 'control_blood_pressure', 'follow_up_if_recurrent'],
        risk: 'low', nonReferrable: true, referralExceptions: ['recurrent', 'bilateral', 'vision_loss'],
        differentialDiagnosis: ['H11.3', 'H10.3']
    },
    {
        id: 'mata_kering',
        diagnosis: 'Mata Kering (Dry Eye Syndrome)',
        icd10: 'H04.1',
        skdi: '4A',
        category: 'Ophthalmology',
        symptoms: ['Mata perih/pedas', 'Rasa berpasir', 'Cepat lelah', 'Berair paradoksal'],
        clue: "Rasa berpasir, perih, mata cepat lelah. Sering pada pekerja layar/AC. Schirmer test rendah. Artificial tears reguler. Kurangi screen time.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [
                { id: 'q_main', text: 'Matanya kenapa bu/pak?', response: 'Mata saya pedas dan kering dok, rasanya kayak berpasir.', sentiment: 'confirmation', priority: 'essential' }
            ],
            rps: [
                { id: 'q_screen', text: 'Sehari-harinya sering di depan layar komputer/HP?', response: 'Iya dok, kerja depan komputer 10 jam sehari.', sentiment: 'neutral', priority: 'essential' },
                { id: 'q_ac', text: 'Ruangannya ber-AC nggak?', response: 'Iya, AC nyala terus.', sentiment: 'confirmation' }
            ],
            rpd: [], rpk: [], sosial: []
        },
        essentialQuestions: ['q_main', 'q_screen'],
        anamnesis: ["Mata saya pedas dan kayak berpasir dok, terutama kalau kerja depan komputer.", "Mata cepat lelah dan kadang berair sendiri dok, aneh tapi terasa kering."],
        physicalExamFindings: { general: "Tampak baik.", vitals: "TD 120/80, N 78x, RR 18x, S 36.7°C", eyes: "Konjungtiva bulbi: injeksi minimal. Tear film: break-up time <5 detik. Kornea: punctate epithelial erosions (fluorescein +). Visus 6/6." },
        labs: {}, vitals: { temp: 36.7, bp: '120/80', hr: 78, rr: 18 },
        correctTreatment: ['artificial_tears'],
        correctProcedures: [],
        requiredEducation: ['screen_break_20_20', 'blink_exercise', 'humidifier', 'reduce_ac'],
        risk: 'low', nonReferrable: true, referralExceptions: ['no_improvement', 'corneal_ulcer'],
        differentialDiagnosis: ['H04.1', 'H10.4']
    },
    {
        id: 'blefaritis',
        diagnosis: 'Blefaritis',
        icd10: 'H01.0',
        skdi: '4A',
        category: 'Ophthalmology',
        symptoms: ['Kelopak mata merah', 'Sisik/krusta di bulu mata', 'Gatal', 'Mata lengket pagi hari'],
        clue: "Peradangan kelopak mata, skuama/krusta di dasar bulu mata. Anterior (stafilokokal/seboroik) vs posterior (disfungsi kelenjar meibom). Lid hygiene + kompres hangat.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [
                { id: 'q_main', text: 'Kelopak matanya kenapa ini?', response: 'Kelopak mata saya merah dan ada sisik-sisik di bulu mata dok, gatal.', sentiment: 'confirmation', priority: 'essential' }
            ],
            rps: [
                { id: 'q_morning', text: 'Kalau pagi hari, matanya suka lengket nggak?', response: 'Iya dok, bangun tidur mata lengket susah dibuka.', sentiment: 'confirmation' }
            ],
            rpd: [{ id: 'q_seboroik', text: 'Punya masalah ketombe juga nggak?', response: 'Iya dok, ketombe juga banyak.', sentiment: 'confirmation' }],
            rpk: [], sosial: []
        },
        essentialQuestions: ['q_main'],
        anamnesis: ["Kelopak mata saya merah dan gatal dok, ada sisik-sisik.", "Bangun tidur mata lengket, ada kerak kuning di bulu mata dok."],
        physicalExamFindings: { general: "Tampak baik.", vitals: "TD 120/80, N 78x, RR 18x, S 36.7°C", eyes: "Margo palpebra: eritema, skuama berminyak di dasar silia bilateral. Konjungtiva hiperemis ringan. Kornea jernih." },
        labs: {}, vitals: { temp: 36.7, bp: '120/80', hr: 78, rr: 18 },
        correctTreatment: ['chloramphenicol_eye_oint', 'artificial_tears'],
        correctProcedures: ['lid_hygiene'],
        requiredEducation: ['warm_compress', 'lid_scrub_routine', 'face_hygiene'],
        risk: 'low', nonReferrable: true, referralExceptions: ['no_improvement'],
        differentialDiagnosis: ['H00.0', 'H01.0']
    },
    {
        id: 'trikiasis',
        diagnosis: 'Trikiasis',
        icd10: 'H02.0',
        skdi: '4A',
        category: 'Ophthalmology',
        symptoms: ['Bulu mata tumbuh ke dalam', 'Mata perih', 'Berair', 'Rasa mengganjal'],
        clue: "Bulu mata tumbuh ke arah dalam (menusuk kornea). Bisa akibat blefaritis kronik, trakoma. Epilasi (cabut bulu mata) + profilaksis antibiotik tetes. Rekuren → rujuk.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [
                { id: 'q_main', text: 'Matanya sakit yang gimana ini?', response: 'Mata saya perih dok, kayak ada yang nusuk-nusuk, berair terus.', sentiment: 'confirmation', priority: 'essential' }
            ],
            rps: [
                { id: 'q_lash', text: 'Bulu matanya pernah dicabut sebelumnya?', response: 'Iya dok, dulu pernah dicabut tapi tumbuh lagi.', sentiment: 'neutral', priority: 'essential' }
            ],
            rpd: [{ id: 'q_trachoma', text: 'Dulu pernah punya riwayat sakit mata yang lama nggak?', response: 'Dulu waktu kecil sering sakit mata dok.', sentiment: 'confirmation' }],
            rpk: [], sosial: []
        },
        essentialQuestions: ['q_main', 'q_lash'],
        anamnesis: ["Mata saya perih terus dok, bulu mata tumbuh ke dalam.", "Ada bulu mata yang nusuk bola mata saya, sakit dan berair."],
        physicalExamFindings: { general: "Tampak baik.", vitals: "TD 120/80, N 78x, RR 18x, S 36.7°C", eyes: "Silia (bulu mata) tumbuh ke arah kornea pada palpebra inferior OD (3 helai). Kornea: erosi punctata (+), injeksi konjungtiva. Entropion (-)." },
        labs: {}, vitals: { temp: 36.7, bp: '120/80', hr: 78, rr: 18 },
        correctTreatment: ['chloramphenicol_eye_drops'],
        correctProcedures: ['epilation'],
        requiredEducation: ['follow_up_recurrence', 'dont_rub_eye'],
        risk: 'low', nonReferrable: true, referralExceptions: ['recurrent', 'corneal_ulcer'],
        differentialDiagnosis: ['H02.0', 'H02.4']
    },
    {
        id: 'episkleritis',
        diagnosis: 'Episkleritis',
        icd10: 'H15.1',
        skdi: '4A',
        category: 'Ophthalmology',
        symptoms: ['Mata merah sektoral', 'Nyeri ringan', 'Tidak ada gangguan visus', 'Unilateral'],
        clue: "Mata merah sektoral, nyeri ringan, tanpa discharge, visus normal. Phenylephrine test: blanching (+) → episkleritis (bukan skleritis). Self-limiting, NSAID oral/topikal.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [
                { id: 'q_main', text: 'Matanya ini yang bikin nggak nyaman gimana?', response: 'Mata saya merah di satu bagian dok, agak nyeri ringan.', sentiment: 'confirmation', priority: 'essential' }
            ],
            rps: [
                { id: 'q_vision', text: 'Penglihatannya ada yang terganggu?', response: 'Nggak dok, lihat jelas.', sentiment: 'denial', priority: 'essential' },
                { id: 'q_discharge', text: 'Keluar kotoran atau belek nggak?', response: 'Nggak ada dok.', sentiment: 'denial' }
            ],
            rpd: [{ id: 'q_autoimmune', text: 'Ada riwayat penyakit lupus atau rematik?', response: 'Nggak ada dok.', sentiment: 'denial' }],
            rpk: [], sosial: []
        },
        essentialQuestions: ['q_main', 'q_vision'],
        anamnesis: ["Mata saya merah di satu sisi dok, agak nyeri tapi lihat tetap jelas.", "Mata merah sudah beberapa hari dok, nggak ada kotoran."],
        physicalExamFindings: { general: "Tampak baik.", vitals: "TD 120/80, N 78x, RR 18x, S 36.7°C", eyes: "Injeksi episkleral sektoral di temporal OD, nyeri tekan ringan. Phenylephrine test: blanching (+). Visus 6/6 ODS. Kornea jernih." },
        labs: {}, vitals: { temp: 36.7, bp: '120/80', hr: 78, rr: 18 },
        correctTreatment: ['artificial_tears', 'ibuprofen_400'],
        correctProcedures: [],
        requiredEducation: ['self_limiting', 'follow_up_if_worse'],
        risk: 'low', nonReferrable: true, referralExceptions: ['recurrent', 'scleritis_suspicion'],
        differentialDiagnosis: ['H15.0', 'H10.3']
    },
    {
        id: 'hipermetropia_ringan',
        diagnosis: 'Hipermetropia Ringan',
        icd10: 'H52.0',
        skdi: '4A',
        category: 'Ophthalmology',
        symptoms: ['Sulit melihat dekat', 'Mata cepat lelah', 'Sakit kepala saat baca', 'Penglihatan jauh normal'],
        clue: "Rabun dekat, sulit fokus objek dekat. Pada anak sering asimptomatik (akomodasi kuat). Dewasa: eyestrain, sakit kepala. Koreksi lensa plus (+). SKDI 4A jika ringan.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [
                { id: 'q_main', text: 'Penglihatannya kenapa pak/bu?', response: 'Saya sulit membaca dok, hurufnya kabur kalau dekat tapi jauh jelas.', sentiment: 'confirmation', priority: 'essential' }
            ],
            rps: [
                { id: 'q_headache', text: 'Sering sakit kepala nggak, terutama habis baca lama?', response: 'Iya dok, kalau baca lama sering pusing.', sentiment: 'confirmation' }
            ],
            rpd: [], rpk: [{ id: 'q_fam', text: 'Di keluarga ada yang pakai kacamata juga?', response: 'Bapak saya pakai kacamata baca.', sentiment: 'confirmation' }], sosial: []
        },
        essentialQuestions: ['q_main'],
        anamnesis: ["Sulit baca buku dok, hurufnya kabur kalau dekat.", "Mata cepat capek kalau baca, sering sakit kepala."],
        physicalExamFindings: { general: "Tampak baik.", vitals: "TD 120/80, N 78x, RR 18x, S 36.7°C", eyes: "Visus: OD 6/6, OS 6/6 (jauh). Near vision: OD J3, OS J3. Koreksi: OD S+1.50, OS S+1.50 → J1. Segmen anterior normal." },
        labs: {}, vitals: { temp: 36.7, bp: '120/80', hr: 78, rr: 18 },
        correctTreatment: ['corrective_lenses_plus'],
        correctProcedures: ['refraction_test'],
        requiredEducation: ['proper_lighting', 'reading_distance', 'regular_eye_check'],
        risk: 'low', nonReferrable: true, referralExceptions: ['high_degree', 'strabismus'],
        differentialDiagnosis: ['H52.0', 'H52.1']
    },
    {
        id: 'miopia_ringan',
        diagnosis: 'Miopia Ringan',
        icd10: 'H52.1',
        skdi: '4A',
        category: 'Ophthalmology',
        symptoms: ['Sulit melihat jauh', 'Menyipitkan mata', 'Penglihatan dekat normal', 'Sakit kepala'],
        clue: "Rabun jauh, sulit melihat objek jauh (papan tulis, rambu). Sering pada anak usia sekolah. Koreksi lensa minus (-). Ringan: ≤ -3.00 D. Progresif → cek retina.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [
                { id: 'q_main', text: 'Penglihatannya si kecil kenapa bu?', response: 'Anak saya nggak bisa lihat papan tulis dok, katanya kabur.', sentiment: 'confirmation', priority: 'essential' }
            ],
            rps: [
                { id: 'q_squint', text: 'Anaknya sering menyipitkan mata kalau lihat jauh?', response: 'Iya dok, kalau lihat jauh mata disipitin.', sentiment: 'confirmation', priority: 'essential' }
            ],
            rpd: [], rpk: [{ id: 'q_fam', text: 'Orangtuanya ada yang pakai kacamata minus?', response: 'Iya, saya minus 5 dok.', sentiment: 'confirmation' }],
            sosial: [{ id: 'q_screen', text: 'Anaknya sering main HP atau tablet nggak?', response: 'Iya dok, tiap hari main game dari siang sampai malam.', sentiment: 'confirmation' }]
        },
        essentialQuestions: ['q_main', 'q_squint'],
        anamnesis: ["Anak saya nggak bisa lihat papan tulis di sekolah dok.", "Mata saya kabur kalau lihat jauh, harus disipitin baru agak jelas."],
        physicalExamFindings: { general: "Tampak baik.", vitals: "TD -, N 82x, RR 18x, S 36.7°C", eyes: "Visus: OD 6/15, OS 6/12. Koreksi: OD S-1.50, OS S-1.25 → 6/6. Near vision: normal. Segmen anterior normal." },
        labs: {}, vitals: { temp: 36.7, bp: '-', hr: 82, rr: 18 },
        correctTreatment: ['corrective_lenses_minus'],
        correctProcedures: ['refraction_test'],
        requiredEducation: ['limit_screen_time', 'outdoor_activity', 'regular_eye_check'],
        risk: 'low', nonReferrable: true, referralExceptions: ['high_degree', 'rapid_progression'],
        differentialDiagnosis: ['H52.1', 'H44.2']
    },
    {
        id: 'buta_senja',
        diagnosis: 'Buta Senja / Xeroftalmia (Defisiensi Vitamin A)',
        icd10: 'E50.5',
        skdi: '4A',
        category: 'Ophthalmology',
        symptoms: ['Sulit melihat saat gelap', 'Mata kering', 'Bercak putih konjungtiva (Bitot)', 'Gizi buruk'],
        clue: "Buta senja (night blindness) + konjungtiva kering + Bitot spot (bercak putih berbusa di konjungtiva). Defisiensi vitamin A pada malnutrisi anak. Vitamin A dosis tinggi segera!",
        relevantLabs: ['Darah Lengkap'],
        anamnesisQuestions: {
            keluhan_utama: [
                { id: 'q_main', text: 'Mata anaknya kenapa bu?', response: 'Anak saya nggak bisa lihat kalau gelap dok, sering nabrak-nabrak kalau malam.', sentiment: 'confirmation', priority: 'essential' }
            ],
            rps: [
                { id: 'q_dry', text: 'Matanya terasa kering nggak?', response: 'Iya dok, matanya kayak kering dan jarang berkedip.', sentiment: 'neutral', priority: 'essential' },
                { id: 'q_nutrition', text: 'Anaknya sering makan sayur dan buah nggak?', response: 'Jarang dok, nggak suka sayur.', sentiment: 'denial', priority: 'essential' }
            ],
            rpd: [{ id: 'q_gizi', text: 'Berat badan anaknya turun nggak akhir-akhir ini?', response: 'Iya dok, badannya kurus banget.', sentiment: 'confirmation' }],
            rpk: [], sosial: [{ id: 'q_economy', text: 'Kalau boleh tau, kondisi ekonomi keluarganya gimana bu?', response: 'Susah dok, sehari bisa makan satu kali aja.', sentiment: 'confirmation' }]
        },
        essentialQuestions: ['q_main', 'q_dry', 'q_nutrition'],
        anamnesis: ["Anak saya nggak bisa lihat kalau malam/gelap dok.", "Matanya kering dok, sering kebentur kalau jalan malam-malam."],
        physicalExamFindings: { general: "Anak tampak kurus, pucat, rambut kemerahan.", vitals: "TD -, N 100x, RR 22x, S 36.5°C", eyes: "Konjungtiva: kering, Bitot spot (+) di temporal bilateral. Kornea: sedikit haze. Visus sulit dinilai (anak kecil). Funduskopi: normal." },
        labs: { "Darah Lengkap": { result: "Hb 9.0, MCV rendah (anemia def besi)", cost: 50000 } },
        vitals: { temp: 36.5, bp: '-', hr: 100, rr: 22 },
        correctTreatment: ['vitamin_a_200000iu', 'nutritional_support'],
        correctProcedures: [],
        requiredEducation: ['vitamin_a_rich_food', 'balanced_diet', 'posyandu_routine'],
        risk: 'medium', nonReferrable: true, referralExceptions: ['corneal_ulcer', 'keratomalacia'],
        differentialDiagnosis: ['E50.5', 'H04.1']
    },
    // === SKDI 1-3 REFERRAL CASES ===
    {
        id: 'glaukoma_akut',
        diagnosis: 'Glaukoma Akut (Angle-Closure)',
        icd10: 'H40.2',
        skdi: '3B',
        category: 'Ophthalmology',
        symptoms: ['Mata merah nyeri hebat mendadak', 'Pandangan kabur', 'Melihat halo/pelangi', 'Pupil mid-dilatasi'],
        clue: "EMERGENCY MATA! Nyeri mata hebat mendadak + mata merah + pandangan turun drastis + pupil MID-DILATASI (non-reaktif). TIO sangat tinggi. Mual-muntah menyertai. Timolol tetes + asetazolamid oral + rujuk Sp.M CITO!",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Mata kenapa bu?', response: 'Mata kanan saya sakit banget dok, mendadak, pandangan kabur, nggak bisa lihat, merah banget.', sentiment: 'confirmation', priority: 'essential' }],
            rps: [
                { id: 'q_halo', text: 'Lihat pelangi atau halo di sekitar lampu?', response: 'Iya dok, ada kayak pelangi di sekitar lampu.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_nausea', text: 'Ada mual?', response: 'Iya mual muntah juga dok.', sentiment: 'confirmation' }
            ],
            rpd: [], rpk: [], sosial: []
        },
        essentialQuestions: ['q_main', 'q_halo'],
        anamnesis: ["Mata kanan nyeri hebat mendadak, pandangan kabur, merah.", "Lihat halo, mual muntah."],
        physicalExamFindings: { general: "Kesakitan, mual.", vitals: "TD 150/90, N 90x, RR 20x, S 36.7°C", eyes: "OD: injeksi siliar (+), kornea edema/hazy, COA dangkal, pupil mid-dilatasi non-reaktif. Palpasi: bola mata KERAS (TIO tinggi). Visus OD: 1/300. OS: normal." },
        labs: {}, vitals: { temp: 36.7, bp: '150/90', hr: 90, rr: 20 },
        correctTreatment: ['timolol_eye_drops', 'asetazolamid_250'],
        correctProcedures: ['visual_acuity_check'],
        requiredEducation: ['vision_threatening', 'immediate_ophthalmology', 'iridotomy_needed'],
        risk: 'critical', nonReferrable: false, referralTarget: 'rs_kabupaten',
        differentialDiagnosis: ['H40.2', 'H10.0']
    },
    {
        id: 'keratitis',
        diagnosis: 'Keratitis',
        icd10: 'H16.9',
        skdi: '3A',
        category: 'Ophthalmology',
        symptoms: ['Mata merah', 'Nyeri', 'Fotofobia', 'Pandangan turun', 'Infiltrat kornea'],
        clue: "Mata merah + nyeri + fotofobia + pandangan TURUN = RED FLAG keratitis! Fluorescein staining (+): ulkus/infiltrat kornea. BEDA dengan konjungtivitis: visus turun + fotofobia + nyeri. Jangan steroid! Rujuk Sp.M!",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Matanya kenapa?', response: 'Mata saya merah, nyeri, silau kalau kena cahaya, pandangan turun dok.', sentiment: 'confirmation', priority: 'essential' }],
            rps: [
                { id: 'q_vision', text: 'Pandangannya turun?', response: 'Iya dok, kabur, nggak bisa baca.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_cl', text: 'Pakai kontak lens?', response: 'Iya dok, kadang tidur pakai.', sentiment: 'neutral' }
            ],
            rpd: [], rpk: [], sosial: []
        },
        essentialQuestions: ['q_main', 'q_vision'],
        anamnesis: ["Mata merah, nyeri, silau, pandangan turun.", "Pakai kontak lens, kadang tidur pakai."],
        physicalExamFindings: { general: "Blefarospasme.", vitals: "Normal", eyes: "OD: injeksi perikorneal (+), kornea: infiltrat/opasitas parasentral, fluorescein (+) ulkus kornea. Visus OD: 6/30. OS: normal." },
        labs: {}, vitals: { temp: 36.7, bp: '120/80', hr: 78, rr: 18 },
        correctTreatment: ['levofloxacin_eye_drops'],
        correctProcedures: ['fluorescein_test', 'visual_acuity_check'],
        requiredEducation: ['vision_threatening', 'no_steroid_eye_drops', 'contact_lens_hygiene', 'ophthalmology_referral'],
        risk: 'high', nonReferrable: false, referralTarget: 'rs_kabupaten',
        differentialDiagnosis: ['H16.9', 'H10.0']
    },
    {
        id: 'pterigium',
        diagnosis: 'Pterigium',
        icd10: 'H11.0',
        skdi: '3A',
        category: 'Ophthalmology',
        symptoms: ['Selaput tumbuh di mata', 'Iritasi', 'Mata merah', 'Gangguan kosmetik'],
        clue: "Jaringan fibrovaskular segitiga dari konjungtiva nasal → tumbuh ke kornea. UV exposure kronik. Jika belum menutup pupil: artificial tears + sunglasses. Rujuk bedah jika menutup axis visual/mengganggu visus.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Matanya kenapa pak?', response: 'Ada selaput tumbuh di mata saya dok, sudah lama, makin besar.', sentiment: 'confirmation', priority: 'essential' }],
            rps: [
                { id: 'q_vision', text: 'Pandangannya terganggu?', response: 'Mulai agak kabur dok, selaputnya hampir menutupi bagian hitam mata.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_duration', text: 'Sudah berapa lama?', response: '2 tahun dok, pelan-pelan makin besar.', sentiment: 'confirmation' }
            ],
            rpd: [], rpk: [],
            sosial: [{ id: 'q_outdoor', text: 'Sering di luar ruangan?', response: 'Iya dok, saya nelayan, setiap hari di laut.', sentiment: 'confirmation' }]
        },
        essentialQuestions: ['q_main', 'q_vision'],
        anamnesis: ["Selaput tumbuh di mata, makin besar 2 tahun.", "Nelayan, pandangan mulai terganggu."],
        physicalExamFindings: { general: "Tampak baik.", vitals: "Normal", eyes: "OD: pterigium nasal grade III, ujung mencapai tepi pupil. Kornea: Stocker line (+). Visus: 6/12." },
        labs: {}, vitals: { temp: 36.7, bp: '120/80', hr: 78, rr: 18 },
        correctTreatment: ['artificial_tears'],
        correctProcedures: ['visual_acuity_check'],
        requiredEducation: ['uv_protection', 'sunglasses_outdoor', 'surgery_if_progressive', 'recurrence_risk'],
        risk: 'low', nonReferrable: false, referralTarget: 'rs_kabupaten',
        differentialDiagnosis: ['H11.0', 'H11.1']
    },
    {
        id: 'katarak',
        diagnosis: 'Katarak Senilis',
        icd10: 'H25.9',
        skdi: '2',
        category: 'Ophthalmology',
        symptoms: ['Pandangan kabur perlahan', 'Silau', 'Penglihatan ganda monocular', 'Shadow test positif'],
        clue: "Penurunan visus PERLAHAN + shadow test (+) = katarak imatur. Lensa keruh pada slit lamp. Penyebab kebutaan terbanyak di Indonesia. Observasi jika belum berat, rujuk bedah (phacoemulsification) jika mengganggu ADL.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Penglihatannya gimana bu?', response: 'Makin lama makin kabur dok, kayak berkabut, nggak bisa baca lagi.', sentiment: 'confirmation', priority: 'essential' }],
            rps: [
                { id: 'q_progression', text: 'Pelan-pelan atau tiba-tiba?', response: 'Pelan-pelan dok, setahun terakhir makin parah.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_glare', text: 'Silau?', response: 'Iya dok, kalau kena sinar matahari atau lampu silau banget.', sentiment: 'confirmation' }
            ],
            rpd: [{ id: 'q_dm', text: 'Ada kencing manis?', response: 'Iya dok, sudah 15 tahun.', sentiment: 'confirmation' }],
            rpk: [], sosial: []
        },
        essentialQuestions: ['q_main', 'q_progression'],
        anamnesis: ["Pandangan makin kabur setahun, berkabut, nggak bisa baca.", "Silau, DM 15 tahun."],
        physicalExamFindings: { general: "Tampak baik.", vitals: "Normal", eyes: "OU: shadow test (+). Lensa: kekeruhan lentikular. Visus OD 6/60, OS 6/30." },
        labs: {}, vitals: { temp: 36.7, bp: '130/80', hr: 76, rr: 18 },
        correctTreatment: [],
        correctProcedures: ['visual_acuity_check', 'shadow_test'],
        requiredEducation: ['surgery_only_treatment', 'phaco_referral', 'dm_control_important'],
        risk: 'low', nonReferrable: false, referralTarget: 'rs_kabupaten',
        differentialDiagnosis: ['H25.9', 'H40.1']
    }
];
