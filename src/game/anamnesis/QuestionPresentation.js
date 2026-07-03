import { adaptTextForGender } from './TextAdapter.js';
import { ANAMNESIS_TIPS, QUESTION_CATEGORIES, getTagLabel } from './Constants.js';

const PEDIATRIC_ADULT_HISTORY_IDS = new Set(['rpd_hipertensi', 'rpd_diabetes', 'rpd_jantung']);
const ADULT_CHRONIC_SELF_HISTORY_RE = /\b(darah tinggi|kencing manis|penyakit jantung)\b/i;
const FAMILY_CONTEXT_RE = /\b(keluarga|ayah|ibu|bapak|tetangga|orang tua|wali|di rumah)\b/i;
const HOME_EXPOSURE_RE = /\b(asap|di rumah|sekitar|terpapar|orang tua|ayah|ibu|bapak|keluarga|wali)\b/i;
const DIRECT_SMOKING_RE = /\bmerokok\b/i;
const DIRECT_ALCOHOL_RE = /\b(beralkohol|alkohol|bir)\b/i;
const DIRECT_WORK_RE = /\b(pekerjaan|kerja)\b/i;
const FEMALE_SELF_CONTEXT_RE = /\b(haid(?:nya)?|mens(?:nya)?|menstruasi(?:nya)?|menstruation|hpht|pembalut(?:nya)?)\b/i;
const MALE_SELF_CONTEXT_RE = /\b(testis(?:nya)?|penis(?:nya)?|skrotum(?:nya)?|glans|buah zakar(?:nya)?)\b/i;
const SHORT_CATEGORY_LABELS = {
    keluhan_utama: 'Keluhan',
    rps: 'RPS',
    rpd: 'RPD',
    rpk: 'RPK',
    sosial: 'Sos'
};

function readTranslation(t, key, fallback, options = {}) {
    if (typeof t !== 'function') return fallback;
    const translated = t(key, { ...options, defaultValue: fallback });
    return translated === key ? fallback : translated;
}

function isFamilyContextQuestion(question) {
    const text = question?.text || '';
    const id = question?.id || '';
    return id.startsWith('rpk_') || FAMILY_CONTEXT_RE.test(text);
}

export function shouldHideQuestionForPatient(question, patient, infoMode, essentialQuestionIds = new Set()) {
    const age = patient?.age || 0;
    const gender = patient?.gender || 'L';
    const text = question?.text || '';
    const id = question?.id || '';
    const isFamilyContext = isFamilyContextQuestion(question);

    if (essentialQuestionIds.has(id)) {
        return false;
    }

    if (age < 15 && !isFamilyContext) {
        if (PEDIATRIC_ADULT_HISTORY_IDS.has(id) || ADULT_CHRONIC_SELF_HISTORY_RE.test(text)) {
            return true;
        }
    }

    if (age < 15 && DIRECT_ALCOHOL_RE.test(text) && !isFamilyContext) {
        return true;
    }

    if ((infoMode?.isInformant && infoMode.reason === 'pediatric') && /kopi|soda/i.test(text)) {
        return true;
    }

    if (!isFamilyContext && gender === 'L' && FEMALE_SELF_CONTEXT_RE.test(text)) {
        return true;
    }

    if (!isFamilyContext && gender === 'P' && MALE_SELF_CONTEXT_RE.test(text)) {
        return true;
    }

    return false;
}

export function getLocalizedQuestionCategory(categoryId, t) {
    const fallback = QUESTION_CATEGORIES[categoryId] || categoryId;
    return readTranslation(t, `anamnesis.categories.${categoryId}`, fallback);
}

export function getLocalizedQuestionShortLabel(categoryId, t) {
    const fallback = SHORT_CATEGORY_LABELS[categoryId] || QUESTION_CATEGORIES[categoryId] || categoryId;
    return readTranslation(t, `anamnesis.short_categories.${categoryId}`, fallback);
}

export function getLocalizedAnamnesisTip(categoryId, t) {
    const fallback = ANAMNESIS_TIPS[categoryId] || '';
    return readTranslation(t, `anamnesis.tips.${categoryId}`, fallback);
}

export function getLocalizedTagLabel(questionId, questionText, t) {
    const fallback = getTagLabel(questionId, questionText);
    return readTranslation(t, `anamnesis.tags.${questionId}`, fallback);
}

export function getLocalizedQuestionResponse(question, t) {
    const fallback = question?.response || '';
    return readTranslation(t, `anamnesis.responses.${question?.id}`, fallback);
}

export function getAudienceAdjustedQuestionText(question, patient, infoMode, t) {
    const age = patient?.age || 0;
    const adaptedBase = adaptTextForGender(question?.text, patient, infoMode);
    const localizedBase = readTranslation(t, `anamnesis.questions.${question?.id}`, adaptedBase);

    if (infoMode?.isInformant && infoMode.reason === 'pediatric') {
        if (DIRECT_WORK_RE.test(adaptedBase) && !FAMILY_CONTEXT_RE.test(adaptedBase)) {
            return readTranslation(t, 'anamnesis.question_rewrites.pediatric_activity', 'Aktivitas anak sehari-hari bagaimana? Lebih banyak di rumah, sekolah, atau bermain?');
        }
        if (DIRECT_SMOKING_RE.test(adaptedBase) && !HOME_EXPOSURE_RE.test(adaptedBase)) {
            return readTranslation(t, 'anamnesis.question_rewrites.pediatric_smoke', 'Ada yang merokok di rumah atau dekat anak?');
        }
        if (question?.id === 'sos_olahraga') {
            return readTranslation(t, 'anamnesis.question_rewrites.pediatric_exercise', 'Bagaimana aktivitas bermain anak sehari-hari?');
        }
        if (question?.id === 'sos_makan') {
            return readTranslation(t, 'anamnesis.question_rewrites.pediatric_diet', 'Bagaimana pola makan anak sehari-hari?');
        }
        if (question?.id === 'sos_tidur') {
            return readTranslation(t, 'anamnesis.question_rewrites.pediatric_sleep', 'Bagaimana pola tidur anak? Apakah cukup?');
        }
        if (question?.id === 'sos_rumah') {
            return readTranslation(t, 'anamnesis.question_rewrites.pediatric_home', 'Bagaimana kondisi rumah dan lingkungan tempat tinggal anak?');
        }
        if (question?.id === 'sos_air') {
            return readTranslation(t, 'anamnesis.question_rewrites.pediatric_water', 'Sumber air minum anak sehari-hari dari mana?');
        }
        return localizedBase;
    }

    if (age < 15) {
        if (DIRECT_WORK_RE.test(adaptedBase) && !FAMILY_CONTEXT_RE.test(adaptedBase)) {
            return readTranslation(t, 'anamnesis.question_rewrites.adolescent_activity', 'Sehari-hari aktivitasnya apa? Sekolah atau kegiatan lain?');
        }
        if ((question?.id === 'sos_merokok' || DIRECT_SMOKING_RE.test(adaptedBase)) && !HOME_EXPOSURE_RE.test(adaptedBase)) {
            return readTranslation(t, 'anamnesis.question_rewrites.adolescent_smoke', 'Pernah merokok atau sering kena asap rokok?');
        }
        if (question?.id === 'sos_olahraga') {
            return readTranslation(t, 'anamnesis.question_rewrites.adolescent_exercise', 'Seberapa sering olahraga atau aktivitas fisik?');
        }
    }

    return localizedBase;
}
