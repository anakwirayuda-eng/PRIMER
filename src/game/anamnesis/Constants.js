/**
 * @reflection
 * [IDENTITY]: Anamnesis Constants
 * [PURPOSE]: Centralized question lists, categories, and keyword mappings for the Anamnesis system.
 * [STATE]: Stable
 */

export const QUESTION_CATEGORIES = {
    keluhan_utama: "Keluhan Utama",
    rps: "Riwayat Penyakit Sekarang",
    rpd: "Riwayat Penyakit Dahulu",
    rpk: "Riwayat Penyakit Keluarga",
    sosial: "Riwayat Sosial & Kebiasaan"
};

export const ANAMNESIS_TIPS = {
    keluhan_utama: "Gali keluhan utama dengan open-ended question.",
    rps: "Tanyakan onset, durasi, lokasi, kualitas, dan faktor pemberat/peringan (OLD CART).",
    rpd: "Cari riwayat penyakit serupa, alergi, dan operasi.",
    rpk: "Fokus pada penyakit menular (TBC) atau keturunan (HT, DM).",
    sosial: "Tanyakan pekerjaan, pola makan, merokok, dan lingkungan rumah."
};

export const GENERIC_QUESTIONS = {
    keluhan_utama: [
        { id: 'gen_ku_severity', text: 'Seberapa berat keluhannya? Mengganggu aktivitas sehari-hari?', response: 'Cukup mengganggu, Dok. Susah tidur juga.' },
        { id: 'gen_ku_trigger', text: 'Apa yang membuat Bapak/Ibu datang periksa hari ini?', response: 'Soalnya makin parah dok, jadi khawatir.' },
        { id: 'gen_ku_other', text: 'Selain keluhan tadi, ada keluhan lain yang dirasakan?', response: 'Itu aja sih dok, yang lain masih baik-baik aja.' }
    ],
    rps: [
        { id: 'rps_onset', text: 'Sejak kapan keluhan ini dirasakan?', response: 'Sudah sekitar beberapa hari yang lalu, Dok.' },
        { id: 'rps_durasi', text: 'Berapa lama biasanya keluhan ini berlangsung?', response: 'Biasanya terasa terus-menerus, Dok.' },
        { id: 'rps_lokasi', text: 'Di bagian mana tepatnya yang dirasakan?', response: '(Pasien menunjukkan lokasi yang sakit)' },
        { id: 'rps_kualitas', text: 'Seperti apa rasa sakitnya? Berdenyut, ditusuk, atau panas?', response: 'Rasanya seperti nyeri biasa, Dok.' },
        { id: 'rps_pemberat', text: 'Apa yang membuat keluhan bertambah berat?', response: 'Kalau banyak aktivitas biasanya makin terasa, Dok.' },
        { id: 'rps_peringan', text: 'Apa yang membuat keluhan berkurang?', response: 'Kalau istirahat agak mendingan, Dok.' },
        { id: 'rps_menjalar', text: 'Apakah nyerinya menjalar ke tempat lain?', response: 'Tidak menjalar, Dok. Di situ saja.' },
        { id: 'rps_obat', text: 'Sudah minum obat apa sebelum ke sini?', response: 'Sudah minum obat warung tapi tidak ada perubahan, Dok.' }
    ],
    rpd: [
        { id: 'rpd_serupa', text: 'Pernah mengalami keluhan serupa sebelumnya?', response: 'Dulu pernah sekali, tapi tidak separah ini, Dok.' },
        { id: 'rpd_hipertensi', text: 'Apakah ada riwayat darah tinggi?', response: 'Setahu saya tidak ada, Dok.' },
        { id: 'rpd_diabetes', text: 'Apakah ada riwayat kencing manis?', response: 'Tidak ada, Dok.' },
        { id: 'rpd_jantung', text: 'Apakah ada riwayat penyakit jantung?', response: 'Tidak ada, Dok.' },
        { id: 'rpd_alergi', text: 'Apakah ada alergi obat atau makanan?', response: 'Tidak ada alergi yang saya tahu, Dok.' },
        { id: 'rpd_operasi', text: 'Apakah pernah menjalani operasi?', response: 'Belum pernah operasi, Dok.' },
        { id: 'rpd_rawat', text: 'Apakah pernah dirawat di rumah sakit?', response: 'Belum pernah, Dok.' },
        { id: 'rpd_obat_rutin', text: 'Apakah ada obat yang rutin diminum?', response: 'Tidak ada obat rutin, Dok.' }
    ],
    rpk: [
        { id: 'rpk_hipertensi', text: 'Apakah ada keluarga yang menderita darah tinggi?', response: 'Bapak saya dulu ada darah tinggi, Dok.' },
        { id: 'rpk_diabetes', text: 'Apakah ada keluarga dengan kencing manis?', response: 'Tidak ada, Dok.' },
        { id: 'rpk_jantung', text: 'Apakah ada riwayat penyakit jantung di keluarga?', response: 'Tidak ada, Dok.' },
        { id: 'rpk_stroke', text: 'Apakah ada keluarga yang pernah stroke?', response: 'Tidak ada, Dok.' },
        { id: 'rpk_tbc', text: 'Apakah ada keluarga atau tetangga yang batuk lama atau TBC?', response: 'Tidak ada yang saya tahu, Dok.' },
        { id: 'rpk_asma', text: 'Apakah ada keluarga dengan asma atau alergi?', response: 'Tidak ada, Dok.' },
        { id: 'rpk_kanker', text: 'Apakah ada riwayat kanker di keluarga?', response: 'Tidak ada, Dok.' }
    ],
    sosial: [
        { id: 'sos_pekerjaan', text: 'Apa pekerjaan sehari-hari?', response: '(Menyebutkan pekerjaannya)' },
        { id: 'sos_merokok', text: 'Apakah merokok?', response: 'Tidak merokok, Dok.' },
        { id: 'sos_alkohol', text: 'Apakah mengonsumsi minuman beralkohol?', response: 'Tidak, Dok.' },
        { id: 'sos_olahraga', text: 'Seberapa sering berolahraga?', response: 'Jarang olahraga, Dok.' },
        { id: 'sos_makan', text: 'Bagaimana pola makan sehari-hari?', response: 'Makan biasa, 3 kali sehari, Dok.' },
        { id: 'sos_tidur', text: 'Bagaimana pola tidur? Apakah cukup?', response: 'Tidur cukup, sekitar 6-7 jam, Dok.' },
        { id: 'sos_rumah', text: 'Bagaimana kondisi rumah dan lingkungan tempat tinggal?', response: '(Menjelaskan kondisi rumah)' },
        { id: 'sos_air', text: 'Sumber air minum dari mana?', response: 'Pakai air galon/PDAM, Dok.' }
    ]
};

export const KEYWORD_BY_ID = {
    // === Initial / Chief Complaint ===
    'initial_complaint': 'Keluhan utama',
    'q_main': 'Keluhan utama',
    'q_main_complaint': 'Keluhan utama',

    // === Generic KU ===
    'gen_ku_severity': 'Beratnya',
    'gen_ku_trigger': 'Alasan datang',
    'gen_ku_other': 'Keluhan lain',

    // === RPS: History of Present Illness ===
    'q_duration': 'Durasi',
    'q_onset': 'Onset',
    'q_quality': 'Kualitas',
    'q_severity': 'Keparahan',
    'q_location': 'Lokasi',
    'q_radiation': 'Penjalaran',
    'q_timing': 'Waktu',
    'q_trigger': 'Pencetus',
    'q_relieving': 'Faktor peringan',
    'q_aggravating': 'Faktor pemberat',
    'q_associated': 'Gejala penyerta',
    'q_fever': 'Demam',
    'q_cough': 'Batuk',
    'q_phlegm': 'Dahak/Sputum',
    'q_nasal': 'Hidung tersumbat',
    'q_throat': 'Nyeri tenggorokan',
    'q_sob': 'Sesak napas',
    'q_chest_pain': 'Nyeri dada',
    'q_palpitation': 'Berdebar',
    'q_nausea': 'Mual',
    'q_vomit': 'Muntah',
    'q_diarrhea': 'Diare',
    'q_constipation': 'Konstipasi',
    'q_abd_pain': 'Nyeri perut',
    'q_appetite': 'Nafsu makan',
    'q_urine': 'BAK',
    'q_stool': 'BAB',
    'q_headache': 'Sakit kepala',
    'q_dizzy': 'Pusing/Vertigo',
    'q_weak': 'Lemas',
    'q_seizure': 'Kejang',
    'q_vision': 'Pandangan kabur',
    'q_hearing': 'Gangguan pendengaran',
    'q_edema': 'Bengkak/Edema',
    'q_rash': 'Ruam',
    'q_itch': 'Gatal',
    'q_trauma': 'Riwayat trauma',

    // === Generic RPS ===
    'rps_onset': 'Onset',
    'rps_durasi': 'Durasi',
    'rps_lokasi': 'Lokasi',
    'rps_kualitas': 'Kualitas nyeri',
    'rps_pemberat': 'Faktor pemberat',
    'rps_peringan': 'Faktor peringan',
    'rps_menjalar': 'Penjalaran',
    'rps_obat': 'Obat sebelumnya',

    // === RPD: Past Medical History ===
    'q_history': 'Riwayat serupa',
    'q_ht': 'Hipertensi',
    'q_dm': 'Diabetes Melitus',
    'q_asthma': 'Asma',
    'q_allergy': 'Alergi',
    'q_surgery': 'Riwayat operasi',
    'q_meds': 'Riwayat obat',

    // === Generic RPD ===
    'rpd_serupa': 'Riwayat serupa',
    'rpd_hipertensi': 'Hipertensi',
    'rpd_diabetes': 'Diabetes',
    'rpd_jantung': 'Penyakit jantung',
    'rpd_alergi': 'Alergi',
    'rpd_operasi': 'Riwayat operasi',
    'rpd_rawat': 'Riwayat rawat',
    'rpd_obat_rutin': 'Obat rutin',

    // === RPK: Family Medical History ===
    'q_family_history': 'Riwayat keluarga',
    'q_family_ht': 'HT keluarga',
    'q_family_dm': 'DM keluarga',
    'q_family_heart': 'Jantung keluarga',
    'q_family_tbc': 'Kontak TBC',

    // === Generic RPK ===
    'rpk_hipertensi': 'HT keluarga',
    'rpk_diabetes': 'DM keluarga',
    'rpk_jantung': 'Jantung keluarga',
    'rpk_stroke': 'Stroke keluarga',
    'rpk_tbc': 'TBC/kontak',
    'rpk_asma': 'Asma keluarga',
    'rpk_kanker': 'Kanker keluarga',

    // === Sosial: Social History ===
    'sos_pekerjaan': 'Pekerjaan',
    'sos_merokok': 'Merokok',
    'sos_alkohol': 'Alkohol',
    'sos_olahraga': 'Olahraga',
    'sos_makan': 'Pola makan',
    'sos_tidur': 'Pola tidur',
    'sos_rumah': 'Kondisi rumah',
    'sos_air': 'Sumber air',

    // === Case-specific common IDs ===
    'q_event': 'Kejadian',
    'q_food': 'Makan terakhir',
    'q_symptoms': 'Gejala penyerta',
    'q_drink': 'Minum/cairan',
    'q_thirst': 'Haus',
    'q_insulin': 'Insulin',
    'q_habit': 'Kebiasaan',
    'q_infeksi': 'Tanda infeksi',
    'q_prev_dka': 'Riwayat KAD',
    'q_diet': 'Diet',
    'q_exercise': 'Aktivitas fisik',
    'q_fam': 'Keluarga',
    'q_stress': 'Stres',
    'q_sleep': 'Tidur',
    'q_weight': 'Berat badan',

    // === Child-Direct Questions (pediatric informant switch) ===
    'child_pain_where': '🧒 Lokasi sakit',
    'child_eat': '🧒 Sudah makan?',
    'child_cry': '🧒 Menangis?',
    'child_describe': '🧒 Ceritakan sakit',
    'child_since': '🧒 Mulai kapan?',
    'child_activity': '🧒 Aktivitas',
};

/**
 * Gets a short tag label for a question — used for the compact pill UI.
 * Looks up KEYWORD_BY_ID first, then falls back to extracting key words from text.
 */
export function getTagLabel(questionId, questionText) {
    if (KEYWORD_BY_ID[questionId]) return KEYWORD_BY_ID[questionId];
    if (!questionText) return questionId;
    // Fallback: strip filler words and take first 2-3 meaningful words
    const stripped = questionText
        .replace(/^(apakah|bagaimana|seberapa|kapan|apa|sudah|pernah)\s+/i, '')
        .replace(/\b(ada|yang|di|ke|dari|untuk|dengan|dan|atau|ini|itu|nya|dok|bapak\/ibu|bapak|ibu)\b/gi, '')
        .replace(/[?.!,]/g, '')
        .trim();
    const words = stripped.split(/\s+/).filter(w => w.length > 1).slice(0, 3);
    return words.join(' ') || questionId;
}

/**
 * Gets the response variation for a specific question based on patient attributes.
 */
export function pickPersona(patient) {
    if (!patient) return 'default';
    if (patient.age < 12) return 'child_proxy';
    if (patient.age >= 60) return 'elderly';
    const edu = patient.social?.education?.toLowerCase() || '';
    if (['sd', 'tidak sekolah', 'smp'].some(e => edu.includes(e))) return 'low_education';
    if (['s1', 's2', 's3', 'sarjana', 'dokter', 'universitas'].some(e => edu.includes(e))) return 'high_education';
    const demeanor = (patient.demeanor || '').toLowerCase();
    if (demeanor === 'anxious' || demeanor === 'cemas') return 'anxious';
    const trust = patient.social?.trustLevel || '';
    if (trust === 'skeptical') return 'skeptical';
    return 'default';
}

/**
 * Derive the inherent anamnesis category from a question's ID.
 * Used to fix macro score miscounting when a question is asked on the wrong tab.
 * Returns null if no confident match — caller should fallback to active tab.
 */
export function deriveCategory(id) {
    if (!id) return null;

    // RPD (Past Medical History)
    if (/^rpd_/.test(id)) return 'rpd';
    if (/^q_(allergy|alergi|history|surgery|operasi|meds|meds_routine|med_compliance|prev|hospital)/.test(id)) return 'rpd';

    // RPK (Family History)
    if (/^rpk_/.test(id)) return 'rpk';
    if (/^q_fam/.test(id)) return 'rpk';

    // Sosial (Social History)
    if (/^sos_/.test(id)) return 'sosial';
    if (/^q_(diet|exercise|sleep|habit|smoke|hygiene|work|screen|alcohol|stress|occupation)/.test(id)) return 'sosial';

    // Keluhan Utama
    if (/^gen_ku/.test(id)) return 'keluhan_utama';
    if (id === 'initial_complaint' || id === 'q_main' || id === 'q_main_complaint') return 'keluhan_utama';

    // RPS (History of Present Illness) — broadest catch
    if (/^rps_/.test(id)) return 'rps';
    if (/^q_(onset|duration|location|quality|severity|trigger|timing|radiation|aggravating|relieving|associated|freq)/.test(id)) return 'rps';

    // Case-specific IDs that are clearly RPS (symptoms, clinical signs)
    if (/^q_(fever|cough|phlegm|nasal|throat|sob|chest|palpitation|nausea|vomit|diarrhea|constipation|abd_pain|appetite|urine|stool|headache|dizzy|weak|seizure|vision|hearing|edema|rash|itch|trauma|pain|bleeding|fluid|amount)/.test(id)) return 'rps';

    // Child-direct questions are RPS
    if (/^child_/.test(id)) return 'rps';

    return null; // no confident match — fallback to active tab
}
