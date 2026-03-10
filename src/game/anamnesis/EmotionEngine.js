/**
 * @reflection
 * [IDENTITY]: Emotion Engine
 * [PURPOSE]: Alpha Emotion Engine: Trust, patience, and persona adaptation (vague/concise/verbose/demeanor).
 * [STATE]: Experimental
 * [LAST_UPDATE]: 2026-02-17
 */

// Seeded RNG for reproducible tests (8.1-D)
let _seed = 123456789;
export function initPersonaRNG(seedStr) {
    if (!seedStr) return;
    let hash = 0;
    for (let i = 0; i < seedStr.length; i++) {
        hash = (hash << 5) - hash + seedStr.charCodeAt(i);
        hash |= 0;
    }
    _seed = Math.abs(hash);
}

function rand() {
    _seed = (_seed * 9301 + 49297) % 233280;
    return _seed / 233280;
}

/**
 * Detects if a response is too vague or clinical-lite.
 * Returns a score from 0 (clear) to 1 (very vague).
 */
export function calculateVaguenessScore(response) {
    if (!response) return 1;
    const lc = response.toLowerCase();
    const short = response.length < 25;

    // Vague keywords
    const vagueKeywords = [
        'gitu aja', 'pokoknya', 'kurang tahu', 'nggak tahu', 'saya bingung',
        'biasa aja', 'sudah lama', 'gitu deh', 'ya begitulah'
    ];

    let score = 0;
    if (short) score += 0.4;

    vagueKeywords.forEach(kw => {
        if (lc.indexOf(kw) !== -1) score += 0.3;
    });

    return Math.min(score, 1);
}

// ────────────────────────────────────────────────
// Template Pools — 10x EXPANDED for natural variety
// Mix of short, medium, and contextual phrases
// Indonesian Puskesmas register
// ────────────────────────────────────────────────

const VAGUE_TEMPLATES = [
    // Very short
    'Nggak tau, Dok.',
    'Gimana ya...',
    'Ya gitu deh.',
    'Pokoknya sakit.',
    'Susah jelasinnya.',
    'Bingung, Dok.',
    'Nggak enak aja.',
    'Pokoknya nggak nyaman.',
    'Kurang tau, Dok.',
    'Iya gitu lah.',
    // Short
    'Ya gitu deh dok, pokoknya nggak enak.',
    'Gimana ya, susah jelasinnya.',
    'Aduh saya bingung, Dok.',
    'Hmm... iya gitu lah dok.',
    'Pokoknya nggak nyaman, Dok.',
    'Ya... gimana ya. Susah ngomongnya.',
    'Wah, saya kurang bisa jelasin, Dok.',
    'Saya bingung harus bilang apa.',
    'Intinya terganggu aja.',
    'Susah diceritain, Dok.',
    // Medium
    'Yang pasti nggak enak, Dok. Tapi susah jelasinnya.',
    'Saya nggak bisa bilang sakitnya kayak apa.',
    'Pokoknya bikin nggak nyaman terus.',
    'Aduh, saya sendiri bingung ini apa.',
    'Susah jelasinnya... yang pasti nggak enak.',
    'Saya cuma tau rasanya nggak bener aja.',
    'Hmm, gimana ya. Bingung saya.',
    'Rasanya ada yang nggak beres tapi saya nggak ngerti.',
    'Ya begitulah Dok, susah dibilangnya.',
    'Dokter, saya nggak paham jelasin yang kayak gini.',
    // Colloquial
    'Yaa... begitulah pokoknya Dok.',
    'Emmm, nggak tau deh Dok.',
    'Anu, Dok... gimana ya.',
    'Haduh, gimana ya bilangnya.',
    'Kayak ada yang nggak beres gitu, Dok.',
    'Pusing Dok jelasinnya.',
    'Bingung saya Dok, pokoknya sakit.',
    'Nggak tau, Dok. Pokoknya terganggu.',
    'Hehe, susah ya Dok jelasinnya.',
    'Gitu lah Dok, gitu aja.',
    // Longer
    'Saya bisa rasain tapi nggak bisa jelasin ke orang lain.',
    'Suami/istri saya juga bingung saya sakit apa.',
    'Yang pasti bikin nggak nyaman, tapi saya sendiri bingung.',
    'Rasanya aneh, Dok. Tapi saya nggak bisa ceritain.',
    'Nggak tau harus ngomong apa, yang pasti nggak enak.',
    'Saya sendiri heran kenapa bisa gini.',
    'Dokter, ini pertama kali saya digituin.',
    'Wah, Dok. Saya dari dulu emang susah cerita.',
    'Ya gitu Dok. Intinya datang karena nggak enak.',
    'Entahlah, Dok. Pokoknya saya nggak nyaman.'
];

const VERBOSE_SUFFIXES = [
    // Very short additions
    ' Pokoknya ganggu.',
    ' Capek, Dok.',
    ' Nggak nyaman.',
    ' Bikin repot.',
    ' Udah lama ini.',
    ' Ribet, Dok.',
    ' Melelahkan.',
    ' Nggak kuat.',
    ' Sedih, Dok.',
    ' Bingung saya.',
    // Short additions
    ' Pokoknya ganggu banget, Dok.',
    ' Udah lama juga, Dok.',
    ' Keluarga ikut khawatir.',
    ' Susah tidur jadinya.',
    ' Udah coba istirahat, belum membaik.',
    ' Nggak nyaman terus.',
    ' Kerja terganggu.',
    ' Jadi sering kepikiran.',
    ' Makan nggak nafsu.',
    ' Udah coba obat warung, nggak mempan.',
    // Medium
    ' Kadang kambuh-kambuhan, Dok.',
    ' Aktivitas jadi terhambat.',
    ' Tetangga nyuruh ke Puskesmas.',
    ' Ini sudah berulang kali.',
    ' Awalnya saya abaikan, tapi makin parah.',
    ' Jadi malas ngapa-ngapain.',
    ' Anak-anak juga ikut khawatir.',
    ' Nggak bisa konsentrasi kerja.',
    ' Badan rasanya lemes terus.',
    ' Tiap hari begini, Dok.',
    // Contextual
    ' Suami/istri saya bilang harus ke dokter.',
    ' Ini sejak minggu lalu.',
    ' Dari kemarin makin parah.',
    ' Saya sudah konsumsi jamu tapi nggak membaik.',
    ' Kalau malam makin terasa.',
    ' Sampai nggak bisa masak.',
    ' Sempat mau ke dukun tapi akhirnya kesini.',
    ' Bikin mood jelek terus.',
    ' Nggak bisa nikmati makan.',
    ' Padahal biasanya saya kuat.',
    // Longer/rambling
    ' Tetangga saya juga pernah gini katanya.',
    ' Udah browsing di internet jadi makin takut.',
    ' Saya jadi sering emosi tanpa alasan.',
    ' Nggak bisa tidur, bangun terus malem-malem.',
    ' Anak saya sampai tanya kenapa saya lemes terus.',
    ' Saya pikir bisa hilang sendiri ternyata nggak.',
    ' Di kantor sampai diomelin bos karena nggak fokus.',
    ' Saya terpaksa izin kerja gara-gara ini.',
    ' Udah coba minum vitamin tapi nggak ada perubahan.',
    ' Ini bikin hidup saya susah, Dok.',
    // Very colloquial
    ' Pusing, Dok. Beneran.',
    ' Aduh, capek rasanya.',
    ' Kasian keluarga saya liatnya.',
    ' Ya gitu deh, Dok.',
    ' Saya pasrah aja, Dok.',
    ' Makanya saya kesini, Dok.',
    ' Berharap ada obatnya.',
    ' Tolong bantu ya, Dok.',
    ' Ini serius banget buat saya.',
    ' Saya nggak mau kelamaan.'
];

const ANXIOUS_SUFFIXES = [
    // Very short
    'Bahaya nggak, Dok?',
    'Bisa sembuh kan?',
    'Serius nggak, Dok?',
    'Saya takut, Dok.',
    'Parah ya, Dok?',
    'Normal nggak sih?',
    'Kenapa ya, Dok?',
    'Aman kan, Dok?',
    'Perlu rawat inap nggak?',
    'Perlu dirujuk nggak, Dok?',
    // Short
    'Ini nggak bahaya kan, Dok?',
    'Semoga bukan yang serius ya.',
    'Saya agak khawatir, Dok.',
    'Jangan-jangan ini parah?',
    'Mudah-mudahan nggak apa-apa.',
    'Saya deg-degan, Dok.',
    'Keluarga juga cemas.',
    'Saya takut mau periksa.',
    'Tolong diperiksa ya, Dok.',
    'Ini pertama kali begini.',
    // Medium
    'Saya harap bukan yang aneh-aneh.',
    'Jangan-jangan ini serius ya, Dok?',
    'Ini bisa ditangani disini kan, Dok?',
    'Nggak perlu operasi kan, Dok?',
    'Saya takut kalau ternyata parah.',
    'Dokter, jujur saya cemas.',
    'Semoga nggak sampai dirawat ya.',
    'Saya dengar tetangga ada yang gini juga.',
    'Nggak penularan kan, Dok?',
    'Ini obatnya mahal nggak, Dok?',
    // Colloquial
    'Waduh, gimana ya Dok?',
    'Saya keringat dingin, Dok.',
    'Semoga cepet sembuh ya.',
    'Mudah-mudahan cuma masuk angin biasa.',
    'Tolong jangan bikin saya tambah takut ya Dok.',
    'Suami/istri saya nyuruh periksa karena takut.',
    'Di internet katanya bisa bahaya.',
    'Tadi malam hampir mau ke UGD.',
    'Pak RT bilang harus cek dokter segera.',
    'Ini bisa kambuh lagi nggak, Dok?',
    // Longer
    'Saya sempat nggak bisa tidur mikirin ini.',
    'Anak saya yang nyuruh periksa karena khawatir.',
    'Saya takut kalau ini turunan.',
    'Temen kantor ada yang kena gini katanya bahaya.',
    'Semoga bisa sembuh cuma pakai obat aja.',
    'Saya nggak punya uang kalau harus operasi.',
    'Tolong jelasin ini apa ya Dok, biar saya tenang.',
    'Saya stress mikirin ini terus.',
    'Kalau parah tolong kasih tau langsung ya Dok.',
    'Saya berharap ini bukan kanker atau apa.'
];

const STOIC_SUFFIXES = [
    '(tampak datar)',
    '(menjawab singkat)',
    '(ekspresi tidak berubah)',
    '(mengangguk pelan)',
    '(menatap kosong)',
    '(bicara pelan)',
    '(tanpa ekspresi)',
    '(menghela napas)',
    '(diam sejenak)',
    '(memandang ke bawah)',
    '(menjawab tenang)',
    '(berbicara monoton)',
    '(tatapan datar)',
    '(mengedikkan bahu)',
    '(menjawab seadanya)',
    '(ekspresi pasrah)',
    '(menunduk)',
    '(bicara tanpa nada)',
    '(menatap ke depan)',
    '(tampak pasif)',
    '(menjawab pelan)',
    '(datar)',
    '(tanpa reaksi)',
    '(menjawab pendek)',
    '(geleng pelan)',
    '(mengedip pelan)',
    '(hanya mengangguk)',
    '(ekspresi kosong)',
    '(tampak tak acuh)',
    '(bicara datar)',
    '(menarik napas panjang)',
    '(melirik sekilas)',
    '(terdiam sesaat)',
    '(ekspresi tenang)',
    '(memalingkan wajah)',
    '(memejamkan mata sejenak)',
    '(berbicara lambat)',
    '(tampak lelah)',
    '(menopang dagu)',
    '(menatap lantai)'
];

const DRAMATIC_PREFIXES = [
    'Aduh Dok... ',
    'Ya ampun Dok... ',
    'Astaghfirullah... ',
    'Waduh, Dok... ',
    'Duh, Dok... ',
    'Haduh... ',
    'Ya Allah, Dok... ',
    'Ampun, Dok... ',
    'Kok bisa gini ya Dok... ',
    'Tolong Dok... ',
    'Aduh, gimana ini... ',
    'Ya Tuhan... ',
    'Dok, saya mohon... ',
    'Nggak kuat, Dok... ',
    'Parah, Dok... ',
    'Innalillahi, Dok... ',
    'Masyaallah, Dok... ',
    'Kok gini ya... ',
    'Saya bingung, Dok... ',
    'Kasian saya, Dok... ',
    'Dok, serius... ',
    'Susah banget, Dok... ',
    'Aduh aduh... ',
    'Gimana ya Dok... ',
    'Duuh, Dok... ',
    'Ya gimana, Dok... ',
    'Astaga, Dok... ',
    'Wah gawat, Dok... ',
    'Duh Gusti... ',
    'Tobat, Dok... ',
    'Alamak, Dok... ',
    'Hem, Dok... ',
    'Saya pasrah, Dok... ',
    'Udah putus asa, Dok... ',
    'Bingung, Dok... ',
    'Pening, Dok... ',
    'Mau pingsan rasanya... ',
    'Saya tersiksa, Dok... ',
    'Nggak tahan lagi... ',
    'Capek banget, Dok... '
];

const DRAMATIC_SUFFIXES = [
    ' Parah, Dok.',
    ' Nggak kuat.',
    ' Mau nangis.',
    ' Susah banget.',
    ' Saya pasrah.',
    ' Sakitnya luar biasa.',
    ' Tersiksa.',
    ' Bikin lemas.',
    ' Nggak tahan.',
    ' Tolong, Dok.',
    ' Kasian saya.',
    ' Berat banget.',
    ' Penderitaan, Dok.',
    ' Bikin menderita.',
    ' Mau mati rasanya.',
    ' Nggak bisa apa-apa.',
    ' Serius ini, Dok.',
    ' Deg-degan terus.',
    ' Saya kewalahan.',
    ' Udah nggak sanggup.',
    ' Ini berat banget.',
    ' Ngeri, Dok.',
    ' Nggak ketulungan.',
    ' Mau pingsan.',
    ' Bikin frustasi.',
    ' Saya capek.',
    ' Udah berhari-hari gini.',
    ' Sampai menangis.',
    ' Saya trauma.',
    ' Bingung harus gimana.',
    ' Nggak bisa tidur.',
    ' Rasanya putus asa.',
    ' Bikin stress.',
    ' Saya takut.',
    ' Badan remuk.',
    ' Pusing tujuh keliling.',
    ' Serasa mau ambruk.',
    ' Nggak ada yang nolong.',
    ' Ini siksaan, Dok.',
    ' Berasa nggak ada ujungnya.'
];

// ────────────────────────────────────────────────
// Anti-Repetition Memory (per session, module-level)
// Tracks last 6 used phrases to avoid repeats
// ────────────────────────────────────────────────

const _recentlyUsed = [];
const MAX_MEMORY = 6;

function pickNoRepeat(pool, questionId, salt) {
    if (!pool || pool.length === 0) return '';
    // Filter out recently used phrases
    const available = pool.filter(p => !_recentlyUsed.includes(p));
    const source = available.length > 0 ? available : pool; // fallback if all used

    // Simple hash pick
    const key = (questionId || '') + salt;
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
        hash = ((hash << 5) - hash + key.charCodeAt(i)) | 0;
    }
    const idx = Math.abs(hash + Math.floor(rand() * source.length)) % source.length;
    const picked = source[idx];

    // Record in memory
    _recentlyUsed.push(picked);
    if (_recentlyUsed.length > MAX_MEMORY) _recentlyUsed.shift();

    return picked;
}

/** Reset memory between patients */
export function resetPersonaMemory() {
    _recentlyUsed.length = 0;
}

/**
 * Legacy export — still used in DialogueEngine vague pool picking.
 */
export function pickFromPool(pool, questionId, salt = '') {
    return pickNoRepeat(pool, questionId, salt);
}

/**
 * Adapt response based on patient demeanor and communication style.
 *
 * KEY DESIGN DECISIONS (anti-repetition & content-awareness):
 * 1. Style and demeanor DO NOT STACK — only one is applied per response (alternating)
 * 2. Each type has a probability gate (not applied every time)
 * 3. Anti-repetition memory prevents same phrase within 6 turns
 * 4. All templates are SHORT (max 8-12 words) to avoid long stacking
 * 5. Verbose suffixes select from complaint-specific or neutral pool based on response content
 * 6. Dramatic only applies when response IS about a complaint/symptom, not lifestyle/neutral
 */

// Complaint/symptom keywords — response must contain these for dramatic to apply
const COMPLAINT_KEYWORDS = /\b(sakit|nyeri|sesak|demam|panas|pusing|lemas|batuk|muntah|mual|gatal|bengkak|berdarah|darah|linu|pecah|berat|parah|kambuh|nggak bisa|sulit|susah|terganggu|meler|serak|kesakitan|ngilu|perih|pegel|luka|infeksi|radang|diare|mencret|napas|kejang|tremor|lumpuh|biru|pucat|kuning|buruk|turun|hilang|nggak kuat)\b/i;

// Denial/neutral — standalone negation words AND denial phrases
// Catches: "nggak pilek", "tidak sesak", "belum pernah", "biasa aja", etc.
const DENIAL_OR_NEUTRAL_RE = /\b(tidak|nggak|belum|enggak|bukan|nggak ada|tidak ada|belum ada|tidak pernah|nggak pernah|belum pernah|biasa aja|normal|baik-baik|itu aja|itu saja|disangkal|negatif)\b/i;

// Broader neutral — lifestyle/social answers that shouldn't get complaint framing
const NEUTRAL_RESPONSE_RE = /\b(suka|kadang-kadang|jarang|pernah|biasa|dulu|minum|makan|merokok|olahraga|kerja|tidur|bangun|anak|suami|istri|guru|petani|teman|tetangga|kantor|rumah|sekolah|kampung)\b/i;

// Neutral verbose suffixes — for lifestyle/social/RPD/RPK responses
const VERBOSE_NEUTRAL_SUFFIXES = [
    ' Gitu, Dok.',
    ' Ya begitulah.',
    ' Makanya datang periksa, Dok.',
    ' Udah lama juga, Dok.',
    ' Gitu aja sih, Dok.',
    ' Ya gitu deh.',
    ' Itu aja, Dok.',
    ' Segitu aja.',
    ' Udah biasa sih.',
    ' Dari dulu gitu, Dok.',
    ' Nggak banyak sih, Dok.',
    ' Iya, gitu Dok.',
    ' Cuma gitu aja.',
    ' Ya, segitu lah.',
    ' Gitu lah, Dok.',
];

export function applyPersonaAdaptation(response, patient, context, opts = {}) {
    if (!response || !patient) return response;

    const style = patient.communicationStyle || 'concise';
    const demeanor = (patient.demeanor || '').toLowerCase();
    const qId = opts.questionId || '';
    const questionCount = context?.count || 0;

    let adapted = response;
    let wasStyleApplied = false;
    opts.metadata = opts.metadata || {};

    // Detect if response is about a complaint/symptom using semantic tags (or fallback to regex)
    const isComplaintResponse = opts.sentiment === 'confirmation' || (!opts.sentiment && COMPLAINT_KEYWORDS.test(response));
    const isDenialOrNeutral = opts.sentiment === 'denial' || opts.sentiment === 'neutral' || (!opts.sentiment && DENIAL_OR_NEUTRAL_RE.test(response));
    const isNeutralLifestyle = opts.sentiment === 'neutral' || (!opts.sentiment && !isComplaintResponse && NEUTRAL_RESPONSE_RE.test(response));

    opts.metadata.sentiment = opts.sentiment || 'regex-fallback';
    opts.metadata.denialDetected = isDenialOrNeutral;

    // ── Communication Style (applied with probability) ──
    if (style === 'verbose' && response.length < 100 && rand() < 0.4) {
        // Choose suffix pool based on response content
        const pool = isComplaintResponse ? VERBOSE_SUFFIXES : VERBOSE_NEUTRAL_SUFFIXES;
        adapted += pickNoRepeat(pool, qId, 'verbose');
        wasStyleApplied = true;
        opts.metadata.isVerboseApplied = true;
    } else if (style === 'vague' && !opts.vagueAlreadyApplied) {
        if (rand() < 0.1) {
            adapted = pickNoRepeat(VAGUE_TEMPLATES, qId, 'vague');
            wasStyleApplied = true;
            opts.metadata.isVagueApplied = true;
        }
    }

    // ── Demeanor (SKIPPED if style was already applied — no stacking) ──
    // Exception: stoic parenthetical is always OK to add (it's short metadata, not text)
    if (demeanor.indexOf('anxious') !== -1 || demeanor.indexOf('cemas') !== -1) {
        // Anxious: SKIP on pure denial/neutral WITHOUT complaint content
        // "Nggak ada dok." → no anxious suffix (illogical to ask "is it dangerous?")
        // "Demam tinggi dok" → OK to add anxious suffix
        const pureNonComplaint = isDenialOrNeutral && !isComplaintResponse;
        if (!wasStyleApplied && !pureNonComplaint && (style !== 'vague' || adapted === response) && rand() < 0.5) {
            const suffix = pickNoRepeat(ANXIOUS_SUFFIXES, qId, 'anxious');
            adapted = adapted.replace(/[.!?…]+\s*$/, '') + '. ' + suffix;
            opts.metadata.isAnxiousApplied = true;
        }
    } else if (demeanor.indexOf('stoic') !== -1) {
        // Stoic: parenthetical expression — always OK, short, never repetitive-feeling
        if (rand() < 0.6) {
            const suffix = pickNoRepeat(STOIC_SUFFIXES, qId, 'stoic');
            adapted = adapted.replace(/[.!?…\s]+$/, '') + '. ' + suffix;
            opts.metadata.isStoicApplied = true;
        }
    } else if (demeanor.indexOf('dramatic') !== -1) {
        // Dramatic: ONLY on complaint-related responses, skip denials AND neutral/lifestyle

        if (!wasStyleApplied && !isDenialOrNeutral && !isNeutralLifestyle &&
            isComplaintResponse && adapted.length < 100 && rand() < 0.4) {
            const prefix = pickNoRepeat(DRAMATIC_PREFIXES, qId, 'dramaPre');
            const suffix = pickNoRepeat(DRAMATIC_SUFFIXES, qId, 'dramaSuf');
            // Clean junction: strip trailing punct from response, add single period before suffix
            const cleanBase = adapted.replace(/[.!?…\s]+$/, '').trim();
            adapted = prefix + cleanBase + '.' + suffix;
            opts.metadata.isDramaticApplied = true;
        }
    }

    return adapted;
}

/**
 * Update the emotion state after a patient interaction event.
 * Called after each question to track trust, patience, and question count.
 * 
 * @param {object} context - Current anamnesis context { trust, patience, count, introduced }
 * @param {string} eventType - Type of event: 'question', 'exam', 'greeting'
 * @returns {object} Updated context
 */
export function updateEmotionState(context, eventType) {
    if (!context) return { introduced: true, trust: 0.5, patience: 1.0, count: 0 };

    const updated = { ...context };

    if (eventType === 'question') {
        updated.count = (updated.count || 0) + 1;

        // Trust slowly increases with each question (doctor is thorough)
        updated.trust = Math.min(1.0, (updated.trust || 0.5) + 0.02);

        // Patience decreases — faster after 10 questions
        const baseDrain = updated.count > 20 ? 0.02 : updated.count > 12 ? 0.01 : 0.005;
        updated.patience = Math.max(0, (updated.patience ?? 1.0) - baseDrain);

    } else if (eventType === 'exam') {
        // Physical exams cost more patience but build trust
        updated.trust = Math.min(1.0, (updated.trust || 0.5) + 0.05);
        updated.patience = Math.max(0, (updated.patience ?? 1.0) - 0.03);

    } else if (eventType === 'greeting') {
        updated.introduced = true;
    }

    return updated;
}
