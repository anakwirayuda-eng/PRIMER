/**
 * Bulk patch: Add anamnesisQuestions to 31 remaining cases
 * EBM-based structured anamnesis for PRIMER case library
 */
const fs = require('fs');
const path = require('path');

const CASES_DIR = path.join(__dirname, '..', 'src', 'content', 'cases', 'modules');

// All 31 remaining cases with EBM-based anamnesisQuestions
const PATCHES = {
  // === NEUROLOGY (7) ===
  'tension_headache': {
    symptoms: ['Nyeri kepala bilateral', 'Seperti diikat', 'Tidak berdenyut', 'Tidak mual'],
    clue: "[EBM: IHS/ICHD-3] TTH — nyeri bilateral, pressing/tightening, intensitas ringan-sedang, tanpa mual/fotofobia. Beda migrain: unilateral + pulsating + mual.",
    relevantLabs: [],
    anamnesisQuestions: {
      keluhan_utama: [
        { id: 'q_main', text: 'Sakit kepalanya gimana?', response: 'Kepala saya sakit kayak diikat dok, pusing terus.', sentiment: 'confirmation', priority: 'essential' },
        { id: 'q_onset', text: 'Sudah berapa lama?', response: 'Sudah 3 hari dok.', sentiment: 'confirmation', priority: 'essential' }
      ],
      rps: [
        { id: 'q_character', text: 'Sakitnya berdenyut atau kayak ditekan?', response: 'Kayak ditekan/diikat dok, nggak berdenyut.', sentiment: 'confirmation', priority: 'essential' },
        { id: 'q_nausea', text: 'Ada mual atau silau cahaya?', response: 'Nggak ada dok.', sentiment: 'denial' },
        { id: 'q_location', text: 'Di sebelah mana?', response: 'Dua-duanya dok, kanan kiri sama.', sentiment: 'confirmation' }
      ],
      rpd: [{ id: 'q_history', text: 'Sering sakit kepala?', response: 'Kalau capek sering dok.', sentiment: 'confirmation' }],
      rpk: [],
      sosial: [{ id: 'q_stress', text: 'Lagi banyak pikiran?', response: 'Iya dok, kerjaan numpuk.', sentiment: 'confirmation' }]
    },
    essentialQuestions: ['q_main', 'q_onset', 'q_character']
  },
  'vertigo_bppv': {
    symptoms: ['Pusing berputar', 'Dipicu perubahan posisi', 'Mual', 'Nistagmus'],
    clue: "[EBM: AAO-HNS 2017] BPPV — vertigo posisional <1 menit, dipicu perubahan posisi kepala. Dix-Hallpike (+). Terapi: Epley maneuver. BUKAN stroke!",
    relevantLabs: [],
    anamnesisQuestions: {
      keluhan_utama: [
        { id: 'q_main', text: 'Pusingnya gimana?', response: 'Pusing berputar dok, kayak mau jatuh.', sentiment: 'confirmation', priority: 'essential' },
        { id: 'q_trigger', text: 'Kapan pusingnya muncul?', response: 'Pas miring ke kanan atau tengadah.', sentiment: 'confirmation', priority: 'essential' }
      ],
      rps: [
        { id: 'q_duration', text: 'Berapa lama pusingnya?', response: 'Sebentar dok, kurang dari semenit, tapi sering kambuh.', sentiment: 'confirmation', priority: 'essential' },
        { id: 'q_nausea', text: 'Mual?', response: 'Iya mual, sempat muntah 1x.', sentiment: 'confirmation' },
        { id: 'q_hearing', text: 'Pendengaran berubah?', response: 'Nggak dok, masih normal.', sentiment: 'denial' }
      ],
      rpd: [], rpk: [],
      sosial: []
    },
    essentialQuestions: ['q_main', 'q_trigger', 'q_duration']
  },
  'migraine': {
    symptoms: ['Nyeri kepala unilateral', 'Berdenyut', 'Mual/muntah', 'Fotofobia'],
    clue: "[EBM: ICHD-3] Migrain tanpa aura — unilateral, pulsating, sedang-berat, diperburuk aktivitas fisik, +mual/fotofobia. Durasi 4-72 jam.",
    relevantLabs: [],
    anamnesisQuestions: {
      keluhan_utama: [
        { id: 'q_main', text: 'Sakit kepalanya gimana?', response: 'Kepala sebelah kiri berdenyut-denyut dok, sakit banget.', sentiment: 'confirmation', priority: 'essential' },
        { id: 'q_duration', text: 'Sudah berapa lama?', response: 'Dari tadi pagi dok, makin lama makin sakit.', sentiment: 'confirmation', priority: 'essential' }
      ],
      rps: [
        { id: 'q_nausea', text: 'Ada mual?', response: 'Mual banget dok, muntah 2 kali.', sentiment: 'confirmation', priority: 'essential' },
        { id: 'q_light', text: 'Silau sama cahaya?', response: 'Iya dok, mau di ruang gelap aja.', sentiment: 'confirmation' },
        { id: 'q_activity', text: 'Makin sakit kalau gerak?', response: 'Iya, jalan aja tambah nyut-nyutan.', sentiment: 'confirmation' }
      ],
      rpd: [{ id: 'q_prev', text: 'Sering begini?', response: 'Sudah beberapa kali dok, tiap bulan.', sentiment: 'confirmation' }],
      rpk: [{ id: 'q_family', text: 'Keluarga ada migrain?', response: 'Ibu saya juga sering migrain.', sentiment: 'confirmation' }],
      sosial: [{ id: 'q_trigger', text: 'Ada pencetusnya?', response: 'Kurang tidur dok kemarin.', sentiment: 'confirmation' }]
    },
    essentialQuestions: ['q_main', 'q_duration', 'q_nausea']
  },
  'kejang_demam': {
    symptoms: ['Kejang saat demam', 'Usia 6 bulan-5 tahun', 'Kejang tonik-klonik', 'Durasi <15 menit'],
    clue: "[EBM: AAP 2011] Kejang demam sederhana — usia 6bln-5thn, kejang <15 menit, tonik-klonik umum, tidak berulang 24 jam. Turunkan demam, singkirkan meningitis.",
    relevantLabs: ['Darah Lengkap'],
    anamnesisQuestions: {
      keluhan_utama: [
        { id: 'q_main', text: 'Kejangnya gimana bu?', response: 'Anak saya tiba-tiba kejang dok, badannya kaku terus tangan kaki kelojotan.', sentiment: 'confirmation', priority: 'essential' },
        { id: 'q_duration_seizure', text: 'Berapa lama kejangnya?', response: 'Sekitar 3 menit dok.', sentiment: 'confirmation', priority: 'essential' }
      ],
      rps: [
        { id: 'q_fever', text: 'Sebelumnya demam?', response: 'Iya dok, demam tinggi dari tadi siang.', sentiment: 'confirmation', priority: 'essential' },
        { id: 'q_after', text: 'Setelah kejang gimana?', response: 'Nangis terus tidur, sekarang sudah sadar.', sentiment: 'confirmation' },
        { id: 'q_focal', text: 'Kejangnya seluruh badan atau satu sisi?', response: 'Seluruh badan dok.', sentiment: 'confirmation' }
      ],
      rpd: [{ id: 'q_prev_seizure', text: 'Pernah kejang sebelumnya?', response: 'Belum pernah dok.', sentiment: 'denial' }],
      rpk: [{ id: 'q_family_seizure', text: 'Keluarga ada riwayat kejang demam?', response: 'Kakaknya dulu juga pernah.', sentiment: 'confirmation' }],
      sosial: []
    },
    essentialQuestions: ['q_main', 'q_duration_seizure', 'q_fever']
  },
  'migrain': {
    symptoms: ['Nyeri kepala unilateral berdenyut', 'Mual muntah', 'Fotofobia/fonofobia', 'Aura visual'],
    clue: "[EBM: ICHD-3] Migrain — unilateral pulsating, moderate-severe, aggravated by activity, +nausea/photo-phonophobia. Triptans jika NSAID gagal.",
    relevantLabs: [],
    anamnesisQuestions: {
      keluhan_utama: [
        { id: 'q_main', text: 'Sakit kepalanya gimana?', response: 'Sakit sebelah dok, kayak ditusuk-tusuk, berdenyut.', sentiment: 'confirmation', priority: 'essential' }
      ],
      rps: [
        { id: 'q_nausea', text: 'Mual?', response: 'Mual banget, muntah terus.', sentiment: 'confirmation', priority: 'essential' },
        { id: 'q_aura', text: 'Sebelum sakit ada lihat cahaya/kilatan?', response: 'Kadang ada dok, lihat bintik-bintik.', sentiment: 'confirmation' }
      ],
      rpd: [{ id: 'q_freq', text: 'Seberapa sering?', response: '2-3 kali sebulan dok.', sentiment: 'confirmation' }],
      rpk: [], sosial: []
    },
    essentialQuestions: ['q_main', 'q_nausea']
  },
  'tension_headache_chronic': {
    symptoms: ['Nyeri kepala >15 hari/bulan', 'Bilateral pressing', 'Intensitas ringan-sedang', 'Kronik >3 bulan'],
    clue: "[EBM: ICHD-3] CTTH — nyeri kepala ≥15 hari/bulan selama >3 bulan. Evaluasi medication overuse headache. Amitriptilin profilaksis.",
    relevantLabs: [],
    anamnesisQuestions: {
      keluhan_utama: [
        { id: 'q_main', text: 'Pusing terus ya?', response: 'Iya dok, hampir tiap hari kepala sakit, sudah berbulan-bulan.', sentiment: 'confirmation', priority: 'essential' }
      ],
      rps: [
        { id: 'q_frequency', text: 'Sebulan berapa hari sakitnya?', response: 'Hampir tiap hari dok, kadang sebulan penuh.', sentiment: 'confirmation', priority: 'essential' },
        { id: 'q_meds', text: 'Sering minum obat sakit kepala?', response: 'Tiap hari minum paracetamol dok.', sentiment: 'confirmation', priority: 'essential' }
      ],
      rpd: [], rpk: [],
      sosial: [{ id: 'q_stress', text: 'Ada masalah atau stres?', response: 'Banyak pikiran dok.', sentiment: 'confirmation' }]
    },
    essentialQuestions: ['q_main', 'q_frequency', 'q_meds']
  },
  'alzheimers_early': {
    symptoms: ['Lupa baru', 'Disorientasi', 'Kesulitan bahasa', 'Perubahan perilaku'],
    clue: "[EBM: NIA-AA 2018] Early Alzheimer — gangguan memori episodik progresif >6 bulan. MMSE screening. Evaluasi reversible causes (B12, TSH, depresi).",
    relevantLabs: ['Darah Lengkap'],
    anamnesisQuestions: {
      keluhan_utama: [
        { id: 'q_main', text: 'Ibu/Bapak keluhannya apa?', response: 'Bapak saya pelupa banget dok, sering lupa nama cucu, lupa sudah makan.', sentiment: 'confirmation', priority: 'essential' }
      ],
      rps: [
        { id: 'q_progression', text: 'Makin parah?', response: 'Makin lama makin parah dok, sudah setahun.', sentiment: 'confirmation', priority: 'essential' },
        { id: 'q_daily', text: 'Bisa aktivitas sendiri?', response: 'Sudah mulai nggak bisa masak sendiri dok.', sentiment: 'denial' }
      ],
      rpd: [], rpk: [{ id: 'q_family', text: 'Keluarga ada yang pikun?', response: 'Neneknya dulu juga pikun.', sentiment: 'confirmation' }],
      sosial: []
    },
    essentialQuestions: ['q_main', 'q_progression']
  },

  // === RESPIRATORY (3) ===
  'asma_bronkiale_akut': {
    symptoms: ['Sesak napas', 'Mengi/wheezing', 'Batuk malam', 'Riwayat atopi'],
    clue: "[EBM: GINA 2023] Asma akut — sesak + wheezing + batuk. Klasifikasi derajat serangan. Nebulisasi SABA first-line. Steroid sistemik jika sedang-berat.",
    relevantLabs: [],
    anamnesisQuestions: {
      keluhan_utama: [
        { id: 'q_main', text: 'Sesaknya gimana?', response: 'Sesak napas dok, bunyi ngik-ngik, susah napas.', sentiment: 'confirmation', priority: 'essential' },
        { id: 'q_onset', text: 'Mulai kapan?', response: 'Tadi malam dok, tiba-tiba kambuh.', sentiment: 'confirmation', priority: 'essential' }
      ],
      rps: [
        { id: 'q_trigger', text: 'Ada pencetusnya?', response: 'Habis bersih-bersih rumah, kena debu banyak.', sentiment: 'confirmation', priority: 'essential' },
        { id: 'q_talk', text: 'Bisa ngomong kalimat penuh?', response: 'Agak putus-putus dok.', sentiment: 'confirmation' }
      ],
      rpd: [{ id: 'q_asthma', text: 'Memang asma ya?', response: 'Iya dok, dari kecil.', sentiment: 'confirmation' }],
      rpk: [{ id: 'q_atopy', text: 'Keluarga ada asma/alergi?', response: 'Ibu saya juga asma.', sentiment: 'confirmation' }],
      sosial: []
    },
    essentialQuestions: ['q_main', 'q_onset', 'q_trigger']
  },
  'bronkhitis_akut': {
    symptoms: ['Batuk produktif', 'Demam ringan', 'Nyeri dada saat batuk', 'Ronki basah'],
    clue: "[EBM: NICE CG69] Bronkitis akut — batuk produktif <3 minggu, sering viral. JANGAN antibiotik rutin! Simptomatik. AB hanya jika risiko tinggi/komorbid.",
    relevantLabs: [],
    anamnesisQuestions: {
      keluhan_utama: [
        { id: 'q_main', text: 'Batuknya gimana?', response: 'Batuk berdahak dok, warnanya putih kekuningan.', sentiment: 'confirmation', priority: 'essential' },
        { id: 'q_duration', text: 'Sudah berapa hari?', response: 'Sudah 5 hari dok.', sentiment: 'confirmation', priority: 'essential' }
      ],
      rps: [
        { id: 'q_fever', text: 'Demam?', response: 'Agak hangat aja dok.', sentiment: 'confirmation' },
        { id: 'q_sob', text: 'Sesak?', response: 'Nggak sesak dok, cuma batuk terus.', sentiment: 'denial' }
      ],
      rpd: [], rpk: [],
      sosial: [{ id: 'q_smoke', text: 'Merokok?', response: 'Iya dok, sehari sebungkus.', sentiment: 'confirmation' }]
    },
    essentialQuestions: ['q_main', 'q_duration']
  },
  'pneumonia_bakterial': {
    symptoms: ['Demam tinggi', 'Batuk produktif purulen', 'Sesak napas', 'Nyeri dada pleuritik'],
    clue: "[EBM: IDSA/ATS 2019] CAP — demam+batuk purulen+sesak. CRB-65 scoring. Amoksisilin first-line. Makrolid jika alergi penisilin.",
    relevantLabs: ['Darah Lengkap', 'Rontgen Thorax'],
    anamnesisQuestions: {
      keluhan_utama: [
        { id: 'q_main', text: 'Apa keluhannya?', response: 'Batuk berdahak kuning kental dok, demam tinggi, sesak.', sentiment: 'confirmation', priority: 'essential' },
        { id: 'q_onset', text: 'Sudah berapa hari?', response: 'Seminggu dok, makin berat.', sentiment: 'confirmation', priority: 'essential' }
      ],
      rps: [
        { id: 'q_chest_pain', text: 'Dada sakit?', response: 'Sakit kalau napas dalam dok, sebelah kanan.', sentiment: 'confirmation', priority: 'essential' },
        { id: 'q_sob', text: 'Sesak?', response: 'Iya dok, ngos-ngosan.', sentiment: 'confirmation' }
      ],
      rpd: [{ id: 'q_comorbid', text: 'Ada penyakit lain?', response: 'Nggak ada dok.', sentiment: 'denial' }],
      rpk: [], sosial: []
    },
    essentialQuestions: ['q_main', 'q_onset', 'q_chest_pain']
  },

  // === HEMATOLOGY (3) ===
  'anemia_deficiency': {
    symptoms: ['Pucat', 'Lemas', 'Pusing', 'Sesak saat aktivitas'],
    clue: "[EBM: WHO] Anemia defisiensi besi — Hb rendah + MCV rendah (mikrositik hipokrom). Evaluasi penyebab: diet, menstruasi, cacing. Suplementasi Fe 2-3 bulan.",
    relevantLabs: ['Darah Lengkap'],
    anamnesisQuestions: {
      keluhan_utama: [
        { id: 'q_main', text: 'Ada keluhan apa?', response: 'Badan lemas terus dok, muka pucat, pusing.', sentiment: 'confirmation', priority: 'essential' }
      ],
      rps: [
        { id: 'q_activity', text: 'Ngos-ngosan kalau aktivitas?', response: 'Iya dok, naik tangga aja sudah ngos-ngosan.', sentiment: 'confirmation' },
        { id: 'q_diet', text: 'Makannya gimana? Cukup daging/sayur?', response: 'Jarang makan daging dok, nasi sayur aja.', sentiment: 'confirmation', priority: 'essential' }
      ],
      rpd: [], rpk: [],
      sosial: [{ id: 'q_menstruation', text: 'Haidnya banyak?', response: 'Iya dok, banyak banget sampai ganti pembalut 5-6x.', sentiment: 'confirmation' }]
    },
    essentialQuestions: ['q_main', 'q_diet']
  },
  'anemia_defisiensi_besi_simptomatik': {
    symptoms: ['Pucat berat', 'Lemas hebat', 'Takikardia', 'Koilonychia'],
    clue: "[EBM: BSH 2021] Anemia def. besi simptomatik — Hb <8, evaluasi kehilangan darah kronik. GI workup jika pria/>50th. Fe oral + cari sumber perdarahan.",
    relevantLabs: ['Darah Lengkap', 'Ferritin'],
    anamnesisQuestions: {
      keluhan_utama: [
        { id: 'q_main', text: 'Lemas banget ya?', response: 'Iya dok, nggak kuat ngapa-ngapain, kepala pusing terus.', sentiment: 'confirmation', priority: 'essential' }
      ],
      rps: [
        { id: 'q_bleeding', text: 'Ada perdarahan? BAB hitam?', response: 'BAB kadang hitam dok.', sentiment: 'confirmation', priority: 'essential' },
        { id: 'q_pica', text: 'Suka ngidam makan es/tanah?', response: 'Iya dok, suka ngunyah es batu terus.', sentiment: 'confirmation' }
      ],
      rpd: [{ id: 'q_prev', text: 'Pernah kurang darah sebelumnya?', response: 'Pernah dok, dikasih tablet tambah darah.', sentiment: 'confirmation' }],
      rpk: [], sosial: []
    },
    essentialQuestions: ['q_main', 'q_bleeding']
  },
  'dbd_grade_1': {
    symptoms: ['Demam tinggi mendadak', 'Nyeri otot/sendi', 'Rumple Leede positif', 'Trombositopenia'],
    clue: "[EBM: WHO DHF 2011] DBD grade 1 — demam + Rumple Leede (+) + trombositopenia. Monitor ketat fase kritis (hari 3-7). Terapi cairan agresif.",
    relevantLabs: ['Darah Lengkap', 'NS1 Ag'],
    anamnesisQuestions: {
      keluhan_utama: [
        { id: 'q_main', text: 'Demamnya gimana?', response: 'Demam tinggi mendadak dok, badan linu semua.', sentiment: 'confirmation', priority: 'essential' },
        { id: 'q_day', text: 'Hari ke berapa demam?', response: 'Sudah hari ke-4 dok.', sentiment: 'confirmation', priority: 'essential' }
      ],
      rps: [
        { id: 'q_bleeding', text: 'Ada mimisan atau gusi berdarah?', response: 'Nggak ada dok.', sentiment: 'denial', priority: 'essential' },
        { id: 'q_warning', text: 'Muntah terus? Nyeri perut?', response: 'Mual aja dok, belum muntah.', sentiment: 'denial' }
      ],
      rpd: [], rpk: [{ id: 'q_neighbor', text: 'Tetangga ada DB?', response: 'Ada dok, RT sebelah banyak.', sentiment: 'confirmation' }],
      sosial: []
    },
    essentialQuestions: ['q_main', 'q_day', 'q_bleeding']
  },

  // === OPHTHALMOLOGY (3) ===
  'konjungtivitas_bakterial': {
    symptoms: ['Mata merah', 'Sekret purulen', 'Kelopak lengket pagi', 'Tidak nyeri'],
    clue: "[EBM: AAO PPP 2018] Konjungtivitis bakterial — sekret mukopurulen, kelopak lengket pagi. AB topikal (kloramfenikol/gentamisin tetes). Self-limited 5-7 hari.",
    relevantLabs: [],
    anamnesisQuestions: {
      keluhan_utama: [
        { id: 'q_main', text: 'Matanya kenapa?', response: 'Mata merah dok, keluar kotoran kuning kental.', sentiment: 'confirmation', priority: 'essential' }
      ],
      rps: [
        { id: 'q_discharge', text: 'Pagi hari lengket?', response: 'Iya dok, pagi susah buka mata karena lengket.', sentiment: 'confirmation', priority: 'essential' },
        { id: 'q_pain', text: 'Nyeri?', response: 'Nggak nyeri dok, cuma gatal sedikit.', sentiment: 'denial' },
        { id: 'q_vision', text: 'Penglihatan terganggu?', response: 'Agak kabur karena kotoran, tapi kalau dilap bisa lihat.', sentiment: 'confirmation' }
      ],
      rpd: [], rpk: [{ id: 'q_contact', text: 'Ada yang sakit mata juga?', response: 'Anak saya yang satu juga mulai merah.', sentiment: 'confirmation' }],
      sosial: []
    },
    essentialQuestions: ['q_main', 'q_discharge']
  },
  'hordeolum_eksternum': {
    symptoms: ['Benjolan nyeri di kelopak mata', 'Kemerahan lokal', 'Bengkak', 'Nyeri tekan'],
    clue: "[EBM: AAO] Hordeolum — infeksi kelenjar Zeiss/Moll (eksternum). Kompres hangat 10-15 menit 4x/hari. AB topikal. Insisi drainase jika tidak respon.",
    relevantLabs: [],
    anamnesisQuestions: {
      keluhan_utama: [
        { id: 'q_main', text: 'Matanya kenapa?', response: 'Ada bintitan dok, sakit dan bengkak.', sentiment: 'confirmation', priority: 'essential' }
      ],
      rps: [
        { id: 'q_onset', text: 'Baru muncul kapan?', response: '2 hari lalu dok.', sentiment: 'confirmation', priority: 'essential' },
        { id: 'q_vision', text: 'Penglihatan terganggu?', response: 'Nggak dok, cuma sakit aja.', sentiment: 'denial' }
      ],
      rpd: [{ id: 'q_recur', text: 'Sering bintitan?', response: 'Kadang-kadang dok.', sentiment: 'confirmation' }],
      rpk: [], sosial: []
    },
    essentialQuestions: ['q_main', 'q_onset']
  },
  'presbyopia': {
    symptoms: ['Sulit membaca dekat', 'Menjauhkan bacaan', 'Mata lelah', 'Usia >40 tahun'],
    clue: "[EBM: AAO] Presbiopi — penurunan akomodasi fisiologis usia >40. Koreksi: kacamata baca (+). Bukan penyakit, aging process normal.",
    relevantLabs: [],
    anamnesisQuestions: {
      keluhan_utama: [
        { id: 'q_main', text: 'Matanya kenapa pak/bu?', response: 'Susah baca dok, hurufnya kabur kalau dekat.', sentiment: 'confirmation', priority: 'essential' }
      ],
      rps: [
        { id: 'q_distance', text: 'Kalau jauh gimana?', response: 'Kalau jauh masih jelas dok, yang dekat aja nggak bisa.', sentiment: 'confirmation', priority: 'essential' },
        { id: 'q_fatigue', text: 'Mata cepat lelah?', response: 'Iya dok, apalagi baca lama.', sentiment: 'confirmation' }
      ],
      rpd: [], rpk: [], sosial: []
    },
    essentialQuestions: ['q_main', 'q_distance']
  },

  // === ENT (5) ===
  'faringitis_akut': {
    symptoms: ['Nyeri tenggorokan', 'Nyeri menelan', 'Demam', 'Faring hiperemis'],
    clue: "[EBM: IDSA 2012] Faringitis akut — mayoritas viral. Centor score ≥3 → rapid strep test/kultur. AB hanya jika Strep GBS (+).",
    relevantLabs: [],
    anamnesisQuestions: {
      keluhan_utama: [
        { id: 'q_main', text: 'Tenggorokannya kenapa?', response: 'Sakit nelan dok, perih banget.', sentiment: 'confirmation', priority: 'essential' }
      ],
      rps: [
        { id: 'q_fever', text: 'Demam?', response: 'Iya dok, agak panas.', sentiment: 'confirmation', priority: 'essential' },
        { id: 'q_cough', text: 'Batuk pilek?', response: 'Pilek sedikit dok.', sentiment: 'confirmation' }
      ],
      rpd: [], rpk: [], sosial: []
    },
    essentialQuestions: ['q_main', 'q_fever']
  },
  'tonsilitis_akut': {
    symptoms: ['Nyeri menelan berat', 'Tonsil membesar', 'Demam tinggi', 'Detritus/eksudat'],
    clue: "[EBM: AAO-HNS] Tonsilitis akut — tonsil membesar, hiperemis, detritus (+). Centor ≥3 → AB (amoksisilin). Rekuren ≥7x/tahun → tonsilektomi.",
    relevantLabs: [],
    anamnesisQuestions: {
      keluhan_utama: [
        { id: 'q_main', text: 'Tenggorokan sakit?', response: 'Sakit banget dok, nelan ludah aja perih.', sentiment: 'confirmation', priority: 'essential' }
      ],
      rps: [
        { id: 'q_fever', text: 'Demam berapa?', response: 'Panas tinggi dok, 39 derajat.', sentiment: 'confirmation', priority: 'essential' },
        { id: 'q_eat', text: 'Bisa makan?', response: 'Susah makan dok, sakit banget.', sentiment: 'denial' }
      ],
      rpd: [{ id: 'q_recur', text: 'Sering radang tenggorokan?', response: 'Sering dok, sudah 4-5 kali tahun ini.', sentiment: 'confirmation' }],
      rpk: [], sosial: []
    },
    essentialQuestions: ['q_main', 'q_fever']
  },
  'otitis_media_akut': {
    symptoms: ['Nyeri telinga akut', 'Demam', 'Pendengaran menurun', 'Setelah ISPA'],
    clue: "[EBM: AAP 2013] OMA — nyeri telinga + membran timpani bulging. Amoksisilin first-line. Watchful waiting 48-72 jam jika ringan, >2 tahun.",
    relevantLabs: [],
    anamnesisQuestions: {
      keluhan_utama: [
        { id: 'q_main', text: 'Telinganya kenapa?', response: 'Telinga anak saya sakit dok, nangis terus megangin telinga.', sentiment: 'confirmation', priority: 'essential' }
      ],
      rps: [
        { id: 'q_ispa', text: 'Sebelumnya pilek?', response: 'Iya dok, habis batuk pilek seminggu lalu.', sentiment: 'confirmation', priority: 'essential' },
        { id: 'q_discharge', text: 'Keluar cairan dari telinga?', response: 'Belum dok.', sentiment: 'denial' }
      ],
      rpd: [{ id: 'q_prev', text: 'Pernah sakit telinga sebelumnya?', response: 'Pernah dok, setahun lalu juga pernah.', sentiment: 'confirmation' }],
      rpk: [], sosial: []
    },
    essentialQuestions: ['q_main', 'q_ispa']
  },
  'furunkel_hidung': {
    symptoms: ['Bisul di hidung', 'Nyeri hebat', 'Bengkak', 'Demam'],
    clue: "[EBM: UpToDate] Furunkel hidung — infeksi folikel rambut di vestibulum nasi. JANGAN dipencet! Risiko trombosis sinus kavernosus. AB anti-staph oral.",
    relevantLabs: [],
    anamnesisQuestions: {
      keluhan_utama: [
        { id: 'q_main', text: 'Hidungnya kenapa?', response: 'Ada bisul di dalam hidung dok, sakit banget.', sentiment: 'confirmation', priority: 'essential' }
      ],
      rps: [
        { id: 'q_onset', text: 'Mulai kapan?', response: '3 hari lalu dok, makin besar dan sakit.', sentiment: 'confirmation', priority: 'essential' },
        { id: 'q_squeeze', text: 'Sudah dipencet?', response: 'Sempat coba dipencet dok tapi nggak keluar.', sentiment: 'confirmation' }
      ],
      rpd: [], rpk: [], sosial: []
    },
    essentialQuestions: ['q_main', 'q_onset']
  },
  'faringitis_streptokokus': {
    symptoms: ['Nyeri menelan akut', 'Demam >38.5', 'Eksudatif tonsilofaringeal', 'Limfadenopati servikal anterior'],
    clue: "[EBM: IDSA 2012] Centor score ≥3: demam >38, eksudatif tonsil, limfadenopati servikal anterior tender, TANPA batuk. AB: amoksisilin 10 hari (cegah RF).",
    relevantLabs: [],
    anamnesisQuestions: {
      keluhan_utama: [
        { id: 'q_main', text: 'Tenggorokannya sakit?', response: 'Sakit banget dok, nelan apa aja perih, demam tinggi.', sentiment: 'confirmation', priority: 'essential' }
      ],
      rps: [
        { id: 'q_cough', text: 'Batuk?', response: 'Nggak batuk dok, cuma tenggorokan perih.', sentiment: 'denial', priority: 'essential' },
        { id: 'q_fever', text: 'Demam berapa?', response: 'Tinggi dok, 39 derajat.', sentiment: 'confirmation' }
      ],
      rpd: [], rpk: [], sosial: []
    },
    essentialQuestions: ['q_main', 'q_cough']
  },

  // === PSYCHIATRY (1) ===
  'insomnia': {
    symptoms: ['Sulit tidur', 'Sering terbangun', 'Tidak segar bangun', 'Kantuk siang'],
    clue: "[EBM: AASM 2017] Insomnia — sulit inisiasi/maintenance tidur ≥3x/minggu selama ≥3 bulan. CBT-I first-line. Sleep hygiene education. Farmako: short-term.",
    relevantLabs: [],
    anamnesisQuestions: {
      keluhan_utama: [
        { id: 'q_main', text: 'Tidurnya gimana?', response: 'Nggak bisa tidur dok, melek terus sampai subuh.', sentiment: 'confirmation', priority: 'essential' }
      ],
      rps: [
        { id: 'q_duration', text: 'Sudah berapa lama?', response: 'Sudah 2 bulan lebih dok.', sentiment: 'confirmation', priority: 'essential' },
        { id: 'q_daytime', text: 'Siang ngantuk?', response: 'Ngantuk terus dok, kerja nggak fokus.', sentiment: 'confirmation' },
        { id: 'q_pattern', text: 'Sulit mulai tidur atau sering terbangun?', response: 'Dua-duanya dok.', sentiment: 'confirmation' }
      ],
      rpd: [{ id: 'q_anxiety', text: 'Ada cemas atau depresi?', response: 'Cemas terus dok, banyak pikiran.', sentiment: 'confirmation' }],
      rpk: [],
      sosial: [{ id: 'q_habits', text: 'Main HP sebelum tidur?', response: 'Iya dok, scrolling terus.', sentiment: 'confirmation' }]
    },
    essentialQuestions: ['q_main', 'q_duration']
  },

  // === URINARY (1) ===
  'isk_uncomplicated': {
    symptoms: ['Nyeri saat BAK', 'Sering BAK', 'Urgensi', 'Nyeri suprapubik'],
    clue: "[EBM: IDSA/ESCMID 2011] ISK non-komplikata — disuria+frekuensi+urgensi pada wanita. Nitrofurantoin 5 hari first-line. TIDAK perlu kultur jika uncomplicated.",
    relevantLabs: ['Urinalisis'],
    anamnesisQuestions: {
      keluhan_utama: [
        { id: 'q_main', text: 'BAK-nya kenapa?', response: 'Perih banget dok kalau kencing, anyang-anyangan.', sentiment: 'confirmation', priority: 'essential' }
      ],
      rps: [
        { id: 'q_frequency', text: 'Sering bolak-balik kencing?', response: 'Iya dok, tiap 15 menit mau kencing tapi cuma sedikit.', sentiment: 'confirmation', priority: 'essential' },
        { id: 'q_fever', text: 'Demam? Nyeri pinggang?', response: 'Nggak demam dok, nggak nyeri pinggang.', sentiment: 'denial' },
        { id: 'q_blood', text: 'Kencingnya ada darah?', response: 'Agak kemerahan dok.', sentiment: 'confirmation' }
      ],
      rpd: [{ id: 'q_prev', text: 'Pernah ISK sebelumnya?', response: 'Pernah dok, tahun lalu.', sentiment: 'confirmation' }],
      rpk: [], sosial: []
    },
    essentialQuestions: ['q_main', 'q_frequency']
  },

  // === REPRODUCTIVE (3) ===
  'sifilis_stadium_1': {
    symptoms: ['Ulkus genital tidak nyeri', 'Tepi teratur', 'Indurasi', 'Limfadenopati inguinal'],
    clue: "[EBM: CDC STI 2021] Sifilis primer — chancre: ulkus tunggal, tidak nyeri, indurasi, dasar bersih. VDRL/RPR screening. Benzathine penicillin G 2.4 MU IM single dose.",
    relevantLabs: ['VDRL'],
    anamnesisQuestions: {
      keluhan_utama: [
        { id: 'q_main', text: 'Ada keluhan apa?', response: 'Ada luka di kemaluan dok, nggak sakit.', sentiment: 'confirmation', priority: 'essential' }
      ],
      rps: [
        { id: 'q_onset', text: 'Mulai kapan?', response: 'Sekitar 2 minggu lalu dok.', sentiment: 'confirmation', priority: 'essential' },
        { id: 'q_pain', text: 'Sakit?', response: 'Nggak sakit sama sekali dok.', sentiment: 'denial', priority: 'essential' }
      ],
      rpd: [],rpk: [],
      sosial: [{ id: 'q_sexual', text: 'Riwayat hubungan seksual?', response: 'Baru ganti pasangan dok.', sentiment: 'confirmation' }]
    },
    essentialQuestions: ['q_main', 'q_onset', 'q_pain']
  },
  'gonore_uncomplicated': {
    symptoms: ['Duh tubuh purulen', 'Disuria', 'Uretritis', 'Onset akut'],
    clue: "[EBM: CDC STI 2021] Gonore — duh tubuh mukopurulen + disuria. Dual therapy: ceftriaxone 500mg IM + azithromycin 1g PO. Test of cure 2 minggu.",
    relevantLabs: ['Gram Stain'],
    anamnesisQuestions: {
      keluhan_utama: [
        { id: 'q_main', text: 'Keluhannya apa?', response: 'Keluar nanah dari kemaluan dok, perih kencing.', sentiment: 'confirmation', priority: 'essential' }
      ],
      rps: [
        { id: 'q_onset', text: 'Kapan mulainya?', response: '3 hari lalu dok, makin banyak nanahnya.', sentiment: 'confirmation', priority: 'essential' },
        { id: 'q_color', text: 'Warna cairan?', response: 'Kuning kental dok.', sentiment: 'confirmation' }
      ],
      rpd: [],rpk: [],
      sosial: [{ id: 'q_partner', text: 'Pasangan perlu diperiksa juga?', response: 'Iya dok.', sentiment: 'confirmation' }]
    },
    essentialQuestions: ['q_main', 'q_onset']
  },
  'normal_pregnancy': {
    symptoms: ['Telat haid', 'Mual pagi', 'Payudara tegang', 'Tes kehamilan positif'],
    clue: "[EBM: WHO ANC 2016] Kehamilan normal — ANC minimal 8x. Skrining: Hb, goldarah, HBsAg, HIV, urin, GDS. Suplementasi: asam folat + Fe.",
    relevantLabs: ['Darah Lengkap', 'Urinalisis'],
    anamnesisQuestions: {
      keluhan_utama: [
        { id: 'q_main', text: 'Ada keluhan apa bu?', response: 'Telat haid 2 bulan dok, testpack positif.', sentiment: 'confirmation', priority: 'essential' }
      ],
      rps: [
        { id: 'q_lmp', text: 'Haid terakhir kapan?', response: '2 bulan lalu dok.', sentiment: 'confirmation', priority: 'essential' },
        { id: 'q_nausea', text: 'Mual?', response: 'Mual tiap pagi dok, kadang muntah.', sentiment: 'confirmation' },
        { id: 'q_bleeding', text: 'Ada perdarahan?', response: 'Nggak ada dok.', sentiment: 'denial', priority: 'essential' }
      ],
      rpd: [{ id: 'q_gravida', text: 'Kehamilan ke berapa?', response: 'Kedua dok, yang pertama normal.', sentiment: 'confirmation' }],
      rpk: [], sosial: []
    },
    essentialQuestions: ['q_main', 'q_lmp', 'q_bleeding']
  },

  // === ORAL (1) ===
  'stomatitis_aftosa': {
    symptoms: ['Sariawan nyeri', 'Ulkus bulat putih', 'Sulit makan', 'Rekuren'],
    clue: "[EBM: UpToDate] SAR — ulkus aftosa rekuren, diameter <1cm, self-limited 7-14 hari. Topikal triamcinolone in orabase. Evaluasi defisiensi (B12, Fe, folat).",
    relevantLabs: [],
    anamnesisQuestions: {
      keluhan_utama: [
        { id: 'q_main', text: 'Sariawannya gimana?', response: 'Mulut saya sariawan dok, banyak, sakit banget buat makan.', sentiment: 'confirmation', priority: 'essential' }
      ],
      rps: [
        { id: 'q_count', text: 'Berapa banyak?', response: 'Ada 3 dok, di bibir dalam dan lidah.', sentiment: 'confirmation' },
        { id: 'q_recur', text: 'Sering sariawan?', response: 'Sering dok, tiap bulan hampir pasti.', sentiment: 'confirmation', priority: 'essential' }
      ],
      rpd: [], rpk: [],
      sosial: [{ id: 'q_stress', text: 'Lagi capek atau kurang tidur?', response: 'Iya dok, begadang terus.', sentiment: 'confirmation' }]
    },
    essentialQuestions: ['q_main', 'q_recur']
  },

  // === GENERAL (2) ===
  'diabetes_melitus_tipe_2': {
    symptoms: ['Poliuria', 'Polidipsia', 'Polifagia', 'BB turun'],
    clue: "[EBM: ADA 2024] DM tipe 2 — GDP ≥126, GD2PP ≥200, HbA1c ≥6.5%. Metformin first-line. Target HbA1c <7%. Skrining komplikasi: mata, ginjal, kaki.",
    relevantLabs: ['GDS', 'GDP', 'HbA1c'],
    anamnesisQuestions: {
      keluhan_utama: [
        { id: 'q_main', text: 'Ada keluhan apa?', response: 'Sering kencing dok, haus terus, badan lemas.', sentiment: 'confirmation', priority: 'essential' }
      ],
      rps: [
        { id: 'q_polyuria', text: 'Kencing berapa kali sehari?', response: 'Bisa 10 kali lebih dok, malam juga bolak-balik.', sentiment: 'confirmation', priority: 'essential' },
        { id: 'q_weight', text: 'Berat badan turun?', response: 'Iya dok, turun 5 kg 2 bulan ini.', sentiment: 'confirmation' },
        { id: 'q_wound', text: 'Ada luka sulit sembuh?', response: 'Nggak ada dok.', sentiment: 'denial' }
      ],
      rpd: [],
      rpk: [{ id: 'q_family', text: 'Keluarga ada diabetes?', response: 'Ibu dan kakak saya diabetes dok.', sentiment: 'confirmation' }],
      sosial: [{ id: 'q_diet', text: 'Makannya gimana?', response: 'Suka manis-manis dok, nasi banyak.', sentiment: 'confirmation' }]
    },
    essentialQuestions: ['q_main', 'q_polyuria']
  },
  'general_checkup': {
    symptoms: ['Tidak ada keluhan spesifik', 'Kunjungan rutin', 'Skrining kesehatan'],
    clue: "[EBM: USPSTF] General checkup — skrining sesuai usia dan risiko: TD, GDS, kolesterol, BMI. Preventif: vaksinasi, konseling gaya hidup.",
    relevantLabs: ['GDS', 'Darah Lengkap'],
    anamnesisQuestions: {
      keluhan_utama: [
        { id: 'q_main', text: 'Ada keluhan apa pak/bu?', response: 'Nggak ada keluhan dok, cuma mau cek kesehatan aja.', sentiment: 'denial', priority: 'essential' }
      ],
      rps: [
        { id: 'q_any', text: 'Benar nggak ada keluhan sama sekali?', response: 'Kadang pusing sedikit dok, tapi biasa aja.', sentiment: 'confirmation' }
      ],
      rpd: [{ id: 'q_history', text: 'Ada riwayat penyakit?', response: 'Nggak ada dok, belum pernah sakit berat.', sentiment: 'denial' }],
      rpk: [{ id: 'q_family', text: 'Keluarga ada sakit berat?', response: 'Bapak saya darah tinggi dan kencing manis.', sentiment: 'confirmation', priority: 'essential' }],
      sosial: [{ id: 'q_lifestyle', text: 'Olahraga? Merokok?', response: 'Jarang olahraga dok, nggak merokok.', sentiment: 'confirmation' }]
    },
    essentialQuestions: ['q_main', 'q_family']
  }
};

// Apply patches
let totalPatched = 0;

for (const [caseId, patch] of Object.entries(PATCHES)) {
  // Find which file contains this case
  let found = false;
  const dirs = [
    path.join(CASES_DIR, 'modules'),
    path.join(CASES_DIR, 'infectious'),
    CASES_DIR
  ];

  for (const dir of dirs) {
    if (!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.js'));
    for (const file of files) {
      const fp = path.join(dir, file);
      let content = fs.readFileSync(fp, 'utf8');
      const marker = `id: '${caseId}'`;
      if (!content.includes(marker)) continue;

      // Check if already has anamnesisQuestions
      const idx = content.indexOf(marker);
      const after = content.substring(idx, idx + 500);
      if (after.includes('anamnesisQuestions')) {
        console.log(`  SKIP ${caseId} — already has anamnesisQuestions`);
        found = true;
        break;
      }

      // Build the insertion text
      const insertLines = [];
      if (patch.symptoms) insertLines.push(`        symptoms: ${JSON.stringify(patch.symptoms)},`);
      if (patch.clue) insertLines.push(`        clue: ${JSON.stringify(patch.clue)},`);
      if (patch.relevantLabs) insertLines.push(`        relevantLabs: ${JSON.stringify(patch.relevantLabs)},`);

      // Format anamnesisQuestions
      insertLines.push(`        anamnesisQuestions: {`);
      for (const [cat, questions] of Object.entries(patch.anamnesisQuestions)) {
        if (questions.length === 0) {
          insertLines.push(`            ${cat}: [],`);
        } else {
          insertLines.push(`            ${cat}: [`);
          for (const q of questions) {
            const parts = [`id: '${q.id}'`, `text: '${q.text.replace(/'/g, "\\'")}'`, `response: '${q.response.replace(/'/g, "\\'")}'`, `sentiment: '${q.sentiment}'`];
            if (q.priority) parts.push(`priority: '${q.priority}'`);
            insertLines.push(`                { ${parts.join(', ')} },`);
          }
          insertLines.push(`            ],`);
        }
      }
      insertLines.push(`        },`);
      insertLines.push(`        essentialQuestions: ${JSON.stringify(patch.essentialQuestions)},`);

      // Find the 'anamnesis:' line that follows this case id and insert before it
      const caseStart = content.indexOf(marker);
      const anamnesisPos = content.indexOf('anamnesis:', caseStart);
      if (anamnesisPos === -1) {
        console.log(`  WARN: ${caseId} — no 'anamnesis:' line found after case id`);
        found = true;
        break;
      }

      // Find start of that line
      let lineStart = anamnesisPos;
      while (lineStart > 0 && content[lineStart - 1] !== '\n') lineStart--;

      const insertion = insertLines.join('\n') + '\n';
      content = content.substring(0, lineStart) + insertion + content.substring(lineStart);

      fs.writeFileSync(fp, content, 'utf8');
      console.log(`  ✅ ${caseId} → ${path.relative(CASES_DIR, fp)}`);
      totalPatched++;
      found = true;
      break;
    }
    if (found) break;
  }
  if (!found) console.log(`  ❌ ${caseId} — NOT FOUND in any file`);
}

// Handle chronic.js (uses "id": instead of id:)
const chronicPath = path.join(CASES_DIR, 'chronic.js');
if (fs.existsSync(chronicPath)) {
  let content = fs.readFileSync(chronicPath, 'utf8');

  const chronicCases = {
    'heart_failure_congestive': {
      patch: `        "symptoms": ["Sesak napas", "Edema tungkai", "Orthopnea", "PND"],
        "clue": "[EBM: ESC 2021] HF — sesak + edema + orthopnea. BNP/NT-proBNP. Ekokardiografi. ACEi+BB+diuretik. NYHA class.",
        "relevantLabs": ["Darah Lengkap", "BNP"],
        "anamnesisQuestions": {
            "keluhan_utama": [
                { "id": "q_main", "text": "Sesaknya gimana?", "response": "Sesak napas dok, apalagi kalau tidur terlentang.", "sentiment": "confirmation", "priority": "essential" }
            ],
            "rps": [
                { "id": "q_orthopnea", "text": "Tidur pakai bantal berapa?", "response": "Harus 3 bantal dok, kalau nggak tinggi sesak.", "sentiment": "confirmation", "priority": "essential" },
                { "id": "q_edema", "text": "Kaki bengkak?", "response": "Bengkak dua-duanya dok.", "sentiment": "confirmation" }
            ],
            "rpd": [{ "id": "q_heart", "text": "Ada penyakit jantung?", "response": "Baru ketahuan dok.", "sentiment": "denial" }],
            "rpk": [],
            "sosial": []
        },
        "essentialQuestions": ["q_main", "q_orthopnea"],`
    },
    'leukemia_suspicion': {
      patch: `        "symptoms": ["Pucat berat", "Perdarahan spontan", "Demam persisten", "Hepatosplenomegali"],
        "clue": "[EBM: WHO] Suspek leukemia — pansitopenia + organomegali + limfadenopati. APUSAN DARAH TEPI segera. Rujuk hematologi-onkologi untuk BMP.",
        "relevantLabs": ["Darah Lengkap", "Apusan Darah Tepi"],
        "anamnesisQuestions": {
            "keluhan_utama": [
                { "id": "q_main", "text": "Apa keluhannya?", "response": "Anak saya pucat terus dok, badan memar-memar, demam nggak turun.", "sentiment": "confirmation", "priority": "essential" }
            ],
            "rps": [
                { "id": "q_bleeding", "text": "Ada mimisan atau gusi berdarah?", "response": "Mimisan sering dok, memar di kaki juga banyak.", "sentiment": "confirmation", "priority": "essential" },
                { "id": "q_fever", "text": "Demamnya berapa lama?", "response": "Sudah 2 minggu dok, naik turun.", "sentiment": "confirmation" }
            ],
            "rpd": [],
            "rpk": [],
            "sosial": []
        },
        "essentialQuestions": ["q_main", "q_bleeding"],`
    }
  };

  for (const [caseId, data] of Object.entries(chronicCases)) {
    const marker = `"id": "${caseId}"`;
    if (!content.includes(marker)) {
      console.log(`  ❌ ${caseId} — NOT FOUND in chronic.js`);
      continue;
    }
    const idx = content.indexOf(marker);
    const after = content.substring(idx, idx + 500);
    if (after.includes('anamnesisQuestions')) {
      console.log(`  SKIP ${caseId} — already has anamnesisQuestions`);
      continue;
    }

    // Find "anamnesis" line after marker
    const anamnesisPos = content.indexOf('"anamnesis":', idx);
    if (anamnesisPos === -1) {
      console.log(`  WARN: ${caseId} — no anamnesis line`);
      continue;
    }
    let lineStart = anamnesisPos;
    while (lineStart > 0 && content[lineStart - 1] !== '\n') lineStart--;
    content = content.substring(0, lineStart) + data.patch + '\n' + content.substring(lineStart);
    console.log(`  ✅ ${caseId} → chronic.js`);
    totalPatched++;
  }

  fs.writeFileSync(chronicPath, content, 'utf8');
}

console.log(`\n✅ Total patched: ${totalPatched} cases`);
