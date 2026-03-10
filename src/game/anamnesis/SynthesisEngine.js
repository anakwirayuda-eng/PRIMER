/**
 * @reflection
 * [IDENTITY]: Synthesis Engine
 * [PURPOSE]: Logic for synthesizing conversation history into structured findings and checklists.
 * [STATE]: Stable
 */

import { QUESTION_CATEGORIES, KEYWORD_BY_ID } from './Constants.js';

/**
 * Classify a patient response as confirmed, denied, or neutral.
 */
export function classifyResponse(response) {
    if (!response || response === '...' || response.length <= 3) return 'neutral';
    const resp = response.trim();

    // Pure denials — short + negative
    const isShortDenial = resp.length < 20 && /\b(tidak|belum|nggak|enggak|tdk|gak|bukan|nggak ada|tidak ada|belum ada|belum pernah|nggak pernah|tidak pernah|negatif)\b/i.test(resp);

    // Explicit denial phrases
    const isExplicitDenial = /\b(tidak ada|belum ada|nggak ada|tidak pernah|belum pernah|nggak pernah|negatif|normal|disangkal)\b/i.test(resp) && resp.length < 40;

    // Positive indicators
    const isPositive = /\b(ya|iya|sudah|sering|berat|parah|tinggi|lama|sejak|ada|pernah|betul|benar|baru|tadi|barusan|kemarin|semalam|banget|sekali|sedang|masih|iya dok|ya dok)\b/i.test(resp);

    // Complex / descriptive response
    const isComplex = resp.length > 25 || /\b(tapi|namun|kecuali|hanya|kadang|kalau|saat|waktu|sejak|setelah|sebelum)\b/i.test(resp);

    if (isShortDenial && !isPositive) return 'denied';
    if (isExplicitDenial && !isPositive && !isComplex) return 'denied';
    if (isPositive || isComplex) return 'confirmed';

    return resp.length > 15 ? 'confirmed' : 'neutral';
}

/**
 * Extract a short clinical keyword from a question text.
 */
export function extractKeyword(questionText, questionId) {
    if (questionId && KEYWORD_BY_ID[questionId]) {
        return KEYWORD_BY_ID[questionId];
    }

    if (!questionText) return '';
    let kw = questionText;

    kw = kw.replace(/^[A-Z][a-z]+(\s+[A-Z][a-z]+)*\s*,\s*/g, '');
    kw = kw.replace(/\b(bisa ceritakan|ceritakan|bisa jelaskan|jelaskan|yang dirasakan|yang dialami|sakitnya|keluhannya)\b/gi, '');
    kw = kw.replace(/\b(apa yang|bagaimana|gimana|apakah|ada)\s+(Bapak\/Ibu|Bapak|Ibu|Mas|Mbak|Dek|Nak|Pak|Bu)?\s*/gi, '');
    kw = kw.replace(/^(Bapak\/Ibu|Bapak|Ibu|Mas|Mbak|Dek|Nak|Pak|Bu)\s*,?\s*/gi, '');
    kw = kw.replace(/\b(anak(nya)?|adik(nya)?)\s+(sering|pernah|ada|sudah|bisa|kalau)?\s*/gi, '');
    kw = kw.replace(/^(kemarin|habis|sehari-hari|di rumah|seberapa sering|sumber)\s+/gi, '');
    kw = kw.replace(/\b(dari mana|tiap hari|setiap hari|sehari-hari)\b/gi, '');
    kw = kw.replace(/\b(pakai|menggunakan|konsumsi|mengonsumsi)\s+(apa|berapa)?\s*/gi, '');
    kw = kw.replace(/\b(pernah|sering|sudah|kalau|kalau boleh tahu|dok|ya|nggak|tidak|cukup|apa)\b\s*/gi, '');
    kw = kw.replace(/\b(terasa|merasa|mengalami|menderita|kena|terkena)\s*/gi, '');
    kw = kw.replace(/\s+(atau|apa)\s+\w+$/gi, '');
    kw = kw.replace(/[?？,]+$/g, '').replace(/\s+/g, ' ').trim();

    if (kw.length > 0) {
        kw = kw.charAt(0).toUpperCase() + kw.slice(1);
    }
    if (kw.length > 30) kw = kw.substring(0, 27) + '...';
    if (kw.length < 3) kw = questionText.replace(/[?]+$/, '').trim().substring(0, 27);

    return kw;
}

/**
 * Truncate a response to a readable summary.
 */
export function truncateResponse(response) {
    if (!response) return '';
    let clean = response.replace(/\(.*?\)/g, '').replace(/\.\.\./g, '').trim();
    if (clean.length <= 3) return clean;
    const firstSentence = clean.split(/[.!]/)[0].trim();
    return firstSentence.length > 55 ? firstSentence.substring(0, 52) + '...' : firstSentence;
}

/**
 * Synthesize anamnesis history into a structured checklist.
 */
export function synthesizeAnamnesis(anamnesisHistory, caseData, patient) {
    const result = {
        complaint: patient?.complaint || '',
        complaintResponse: '',
        categories: {},
        unaskedEssentials: [],
        totalAsked: 0,
        totalConfirmed: 0,
        totalDenied: 0
    };

    if (!anamnesisHistory || anamnesisHistory.length === 0) return result;

    const idToCategory = {};
    const anamnesisQs = caseData?.anamnesisQuestions || {};
    const categoryOrder = Object.keys(QUESTION_CATEGORIES);

    categoryOrder.forEach(cat => {
        const questions = anamnesisQs[cat] || [];
        questions.forEach(q => {
            if (q.id) idToCategory[q.id] = cat;
        });
    });

    anamnesisHistory.forEach(q => {
        if (q.isGreeting || q.id === 'doctor_acknowledgment' || !q.response) return;

        if (q.id === 'initial_complaint') {
            result.complaintResponse = q.response;
            return;
        }

        if (q.auto && !q.id?.startsWith('q_')) return;

        let category = idToCategory[q.id] || null;

        if (!category) {
            if (q.id?.startsWith('q_main')) category = 'keluhan_utama';
            else if (q.id?.includes('fam') || q.id?.includes('rpk')) category = 'rpk';
            else if (q.id?.includes('rpd') || q.id?.includes('history') || q.id?.includes('prev') || q.id?.includes('allergy')) category = 'rpd';
            else if (q.id?.includes('social') || q.id?.includes('diet') || q.id?.includes('exercise') || q.id?.includes('smoke') || q.id?.includes('hygiene') || q.id?.includes('work') || q.id?.includes('screen')) category = 'sosial';
            else category = 'rps';
        }

        // Use rawClinical (pre-persona) for accurate classification; fallback to response
        const classifyText = q.rawClinical || q.response;
        const status = classifyResponse(classifyText);
        const keyword = extractKeyword(q.text, q.id);
        const summary = truncateResponse(q.response);

        if (!result.categories[category]) {
            result.categories[category] = {
                label: QUESTION_CATEGORIES[category] || category,
                findings: []
            };
        }

        result.categories[category].findings.push({
            id: q.id,
            question: q.text,
            response: q.response,
            summary: summary,
            status: status,
            keyword: keyword,
            priority: q.priority || null,
            isChildDirect: q.isChildDirect || false
        });

        result.totalAsked++;
        if (status === 'confirmed') result.totalConfirmed++;
        if (status === 'denied') result.totalDenied++;
    });

    const essentials = caseData?.essentialQuestions || [];
    const askedIds = anamnesisHistory.map(q => q.id);

    essentials.forEach(eId => {
        if ((eId === 'q_main' || eId === 'q_main_complaint') && askedIds.includes('initial_complaint')) return;
        if (!askedIds.includes(eId)) {
            let qText = eId;
            categoryOrder.forEach(cat => {
                const qs = anamnesisQs[cat] || [];
                const found = qs.find(q => q.id === eId);
                if (found) qText = extractKeyword(found.text, found.id);
            });
            result.unaskedEssentials.push({ id: eId, label: qText });
        }
    });

    const orderedCategories = {};
    categoryOrder.forEach(cat => {
        if (result.categories[cat]) {
            orderedCategories[cat] = result.categories[cat];
        }
    });
    result.categories = orderedCategories;

    return result;
}
