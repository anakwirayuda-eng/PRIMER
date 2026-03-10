/**
 * @reflection
 * [IDENTITY]: Dialogue Engine
 * [PURPOSE]: Dialogue orchestration logic (Greetings, Adaptive Responses, Variations).
 * [STATE]: Stable
 */

import { QUESTION_CATEGORIES, KEYWORD_BY_ID, pickPersona } from './Constants.js';
import { getInformantMode } from './InformantSystem.js';
import { getPrefix, adaptTextForGender } from './TextAdapter.js';
import { calculateVaguenessScore, applyPersonaAdaptation, pickFromPool } from './EmotionEngine.js';
import { PersistenceService } from '../../services/PersistenceService.js';





export async function getAsyncVariation(caseId, questionId, baseResponse, patient) {
    const persona = pickPersona(patient);
    if (persona === 'default') return baseResponse;

    const caseVariations = await PersistenceService.getAnamnesisVariations(caseId);
    if (!caseVariations) return baseResponse;

    const questionVariations = caseVariations[questionId];
    if (!questionVariations) return baseResponse;

    const variation = questionVariations[persona];
    return variation || baseResponse;
}

/**
 * Generate appropriate greeting exchange based on time, patient, and informant mode.
 */
export function generateGreeting(patient, doctorName, time, context) {
    const info = getInformantMode(patient);
    const isFollowUp = context && context.introduced;

    let greeting;
    if (time < 600) greeting = 'Selamat pagi';
    else if (time < 900) greeting = 'Selamat siang';
    else if (time < 1020) greeting = 'Selamat sore';
    else greeting = 'Selamat malam';

    const drName = doctorName || '...';
    let doctorText;
    let patientResponse;
    let demeanor;

    if (info.isInformant && info.reason === 'pediatric') {
        const childName = patient.name || patient.firstName || 'Adik';
        const parentLabel = info.informantLabel || (patient.gender === 'P' ? 'Ibu' : 'Bapak');
        const parentName = info.informantName || '';
        const parentStr = parentName ? (parentLabel + ' ' + parentName) : parentLabel;

        const greetingVar = [
            isFollowUp ? `${greeting} lagi ${parentStr}. Ada yang terlewat untuk ${childName}?` : `${greeting}, saya dr. ${drName} yang bertugas. Ini ${childName} ya, ${parentStr}?`,
            isFollowUp ? `${parentStr}, ada keluhan lain tentang ${childName}?` : `${greeting}, ${parentStr}. Saya dr. ${drName}. Ada keluhan apa dengan ${childName} hari ini?`,
            isFollowUp ? `Halo ${childName}, ada lagi yang sakit?` : `Halo ${childName}, halo ${parentStr}. Saya dr. ${drName}. Apa yang bisa saya bantu untuk anaknya?`
        ][Math.floor(Math.random() * 3)];

        doctorText = greetingVar;
        patientResponse = `${greeting} Dokter. Iya dok, ini anak saya ${childName}.`;
        const parentRef = parentLabel.toLowerCase().includes('ayah') || parentLabel.toLowerCase().includes('bapak') ? 'ayahnya' : 'ibunya';
        demeanor = patient.age <= 3
            ? `(anak tampak rewel di pangkuan ${parentRef})`
            : `(anak tampak malu-malu di samping ${parentRef})`;
    } else if (info.isInformant && info.reason === 'caregiver') {
        const patName = patient.name || patient.firstName || 'pasien';
        const cgLabel = info.informantLabel || 'Pendamping';
        doctorText = `${greeting}, saya dr. ${drName} yang bertugas. Mendampingi ${patName} ya, ${cgLabel}?`;
        patientResponse = `${greeting} Dokter. Iya, saya ${cgLabel}-nya.`;
        demeanor = '(pasien tampak bingung, pendamping yang menjawab)';
    } else {
        const prefix = getPrefix(patient, info, 'auto');
        const greetingVar = [
            isFollowUp ? `${greeting} lagi, ${prefix}. Ada lagi yang bisa saya bantu?` : `${greeting}, saya dr. ${drName}. Apa kabar ${prefix} hari ini?`,
            isFollowUp ? `${prefix}, ada keluhan lain yang ingin disampaikan?` : `${greeting}, saya dr. ${drName} yang bertugas. Ada yang bisa saya bantu, ${prefix}?`,
            isFollowUp ? `${greeting} ${prefix}. Ada yang terlupa?` : `${greeting} ${prefix}. Saya dr. ${drName}. Ada keluhan apa saat ini?`
        ][Math.floor(Math.random() * 3)];

        doctorText = greetingVar;
        patientResponse = `${greeting}, Dokter.`;
        demeanor = getGenericDemeanor(patient);
    }

    return {
        doctorText,
        patientResponse: `${patientResponse} ${demeanor}`,
        demeanor,
        context: { introduced: true }
    };
}

/**
 * Generate generic patient demeanor based on condition
 */
export function getGenericDemeanor(patient) {
    const complaint = (patient && patient.complaint ? patient.complaint : '').toLowerCase();
    const social = (patient && patient.social) ? patient.social : {};
    const age = patient ? patient.age || 0 : 0;

    // Complaint-specific pools (2-3 options each for variety)
    const painPool = ['(tampak menahan rasa sakit)', '(meringis pelan)', '(memegang bagian yang sakit)', '(tampak kesakitan)'];
    const dizzyPool = ['(tampak lesu dan pucat)', '(berjalan sempoyongan)', '(tampak lemas)', '(pucat dan lelah)'];
    const breathPool = ['(tampak kesulitan bernafas)', '(nafas pendek-pendek)', '(sesekali batuk)', '(terengah-engah)'];
    const feverPool = ['(tampak tidak nyaman dan berkeringat)', '(wajah memerah)', '(tampak demam)', '(keringat di dahi)'];
    const anxPool = ['(tampak gelisah dan cemas)', '(tangan gemetar)', '(mata gelisah)', '(kaki bergoyang cemas)'];

    if (complaint.includes('nyeri') || complaint.includes('sakit')) return painPool[Math.floor(Math.random() * painPool.length)];
    if (complaint.includes('pusing') || complaint.includes('lemas')) return dizzyPool[Math.floor(Math.random() * dizzyPool.length)];
    if (complaint.includes('sesak') || complaint.includes('nafas')) return breathPool[Math.floor(Math.random() * breathPool.length)];
    if (complaint.includes('demam') || complaint.includes('panas')) return feverPool[Math.floor(Math.random() * feverPool.length)];
    if (complaint.includes('cemas') || complaint.includes('gelisah')) return anxPool[Math.floor(Math.random() * anxPool.length)];

    if (social.trustLevel === 'skeptical') {
        const skeptPool = ['(ekspresi agak ragu)', '(melirik curiga)', '(tampak tidak yakin)', '(bersedekap tangan)'];
        return skeptPool[Math.floor(Math.random() * skeptPool.length)];
    }
    if (social.healthBelief === 'Tradisionalis') {
        const tradPool = ['(tampak sedikit canggung)', '(memandang sekitar ruangan)', '(agak gugup)', '(tampak tidak terbiasa)'];
        return tradPool[Math.floor(Math.random() * tradPool.length)];
    }

    if (age < 15) {
        const childPool = ['(tampak malu-malu)', '(bersembunyi di balik orangtua)', '(memegang tangan orangtua)', '(menunduk malu)'];
        return childPool[Math.floor(Math.random() * childPool.length)];
    }
    if (age > 70) {
        const elderPool = ['(berjalan dengan hati-hati)', '(duduk pelan-pelan)', '(tampak kelelahan)', '(bicara pelan)'];
        return elderPool[Math.floor(Math.random() * elderPool.length)];
    }

    const neutralPool = [
        '(mengangguk sopan)', '(duduk dengan tenang)', '(tersenyum tipis)',
        '(tampak sabar menunggu)', '(memandang dokter)', '(tersenyum sopan)',
        '(menyapa dengan ramah)', '(tampak kooperatif)', '(duduk tegak)'
    ];
    return neutralPool[Math.floor(Math.random() * neutralPool.length)];
}

/**
 * Generate optional questions that can be asked directly to the child.
 */
export function getChildDirectQuestions(patient, complaint) {
    const age = patient ? patient.age || 0 : 0;
    if (age < 4 || age > 14) return [];

    const lc = (complaint || '').toLowerCase();
    const questions = [];
    const childName = patient.name || patient.firstName || 'Adik';

    if (age >= 4 && age <= 7) {
        questions.push({
            id: 'child_pain_where',
            text: `${childName}, sakitnya di mana? Tunjukin ke Dokter ya.`,
            response: `(${childName} menunjuk ke bagian yang sakit)`,
            isChildDirect: true,
            speaker: childName
        });

        if (lc.includes('perut') || lc.includes('mual')) {
            questions.push({
                id: 'child_eat',
                text: `${childName} tadi sudah makan belum?`,
                response: '(menggeleng pelan)... Nggak mau makan, Dok.',
                isChildDirect: true,
                speaker: childName
            });
        }

        questions.push({
            id: 'child_cry',
            text: 'Adik nangis nggak tadi? Kapan sakitnya paling terasa?',
            response: '(mengangguk)... Tadi malam nangis dok.',
            isChildDirect: true,
            speaker: childName
        });
    }

    if (age >= 8) {
        questions.push({
            id: 'child_describe',
            text: `${childName}, bisa ceritakan sakitnya kayak apa rasanya?`,
            response: 'Rasanya sakit dok, kayak... (berusaha menjelaskan)',
            isChildDirect: true,
            speaker: childName
        });

        questions.push({
            id: 'child_since',
            text: `${childName}, sakitnya mulai kapan?`,
            response: 'Dari kemarin dok.',
            isChildDirect: true,
            speaker: childName
        });

        if (lc.includes('pusing') || lc.includes('lemas')) {
            questions.push({
                id: 'child_activity',
                text: 'Kemarin masih bisa ikut main sama teman-teman?',
                response: 'Nggak, dokter. Nggak kuat berdiri lama.',
                isChildDirect: true,
                speaker: childName
            });
        }
    }

    return questions;
}

/**
 * Get adaptive response based on patient persona (education, trust, age, informant)
 * @returns {{ text: string, rawClinical: string, isVague?: boolean, clarifiedResponse?: string }}
 *   Always returns an object. `rawClinical` is the pre-persona text for clinical classification.
 */
export async function getAdaptiveResponse(question, patient, caseId, context) {
    let response = question.response;
    const info = getInformantMode(patient);

    if (question.variations) {
        const edu = (patient.social && patient.social.education) ? patient.social.education : 'SMA';
        const trust = (patient.social && patient.social.trustLevel) ? patient.social.trustLevel : 'neutral';
        const age = patient.age;
        const eduLower = edu.toLowerCase();

        // Priority: informant > pediatric > skeptical > elderly > education
        if (info.isInformant && question.variations.informant) {
            response = question.variations.informant;
        } else if (age < 12 && question.variations.pediatric) {
            response = question.variations.pediatric;
        } else if (trust === 'skeptical' && question.variations.skeptical) {
            response = question.variations.skeptical;
        } else if (age > 65 && question.variations.elderly) {
            response = question.variations.elderly;
        } else if (['tidak sekolah', 'sd', 'smp'].some(e => eduLower.includes(e)) && question.variations.low_education) {
            response = question.variations.low_education;
        } else if (['s1', 's2', 's3'].some(e => eduLower.includes(e)) && question.variations.high_education) {
            response = question.variations.high_education;
        }
    } else if (caseId && question.id) {
        const overlayResponse = await getAsyncVariation(caseId, question.id, response, patient);
        if (overlayResponse !== response) {
            response = overlayResponse;
        }
    }

    response = adaptTextForGender(response, patient, info);

    // Capture the clinical response BEFORE persona adaptation (for accurate classification)
    const rawClinical = response;

    // Vagueness check — preserve original clinical info for follow-up re-ask
    const vagueness = calculateVaguenessScore(response);
    if (vagueness > 0.7 && Math.random() < 0.05) {
        const prefix = getPrefix(patient, info, 'auto');
        const opts = {
            vagueAlreadyApplied: true,
            questionId: question.id,
            sentiment: question.sentiment,
            metadata: {}
        };
        const clarifiedResponse = applyPersonaAdaptation(response, patient, context, opts);
        // Varied vague templates — realistic Puskesmas feel (large pool for variety)
        const vaguePool = [
            // Very short
            `${prefix} bingung, Dok.`,
            'Gimana ya...',
            'Pokoknya nggak enak.',
            'Susah jelasinnya.',
            `Nggak tau, Dok.`,
            // Short
            `Aduh ${prefix}... gimana ya jelasinnya.`,
            `Hmm... ${prefix} bingung, Dok.`,
            `Ya gitu lah Dok... susah ngomongnya.`,
            `Susah jelasinnya Dok... pokoknya sakit.`,
            `Duh, gimana ya Dok. Kurang paham.`,
            `Pokoknya nggak nyaman Dok, bingung.`,
            // Medium
            `${prefix} nggak bisa jelasin, Dok. Pokoknya nggak enak.`,
            `Gimana ya Dok... ${prefix} cuma tau sakit aja.`,
            `Yang pasti terganggu, Dok. Tapi susah diceritain.`,
            `Bingung saya Dok, nggak paham jelasinnya.`,
            `${prefix} tau nggak enak tapi nggak bisa bilang kayak apa.`,
            // Longer
            `Aduh ${prefix}... pokoknya nggak enak banget rasanya.`,
            `${prefix} sendiri bingung ini kenapa, Dok.`,
            `Hmm... ${prefix} cuma bisa bilang nggak nyaman, sisanya bingung.`,
            `Ya begitulah Dok. ${prefix} emang dari dulu susah cerita.`,
            `Intinya datang kesini karena nggak enak, Dok.`,
            // Colloquial
            `Anu, Dok... gimana ya? ${prefix} bingung.`,
            `Hehe, susah ya Dok jelasinnya.`,
            `Yaa gitu lah Dok. Gitu aja.`,
            `Emmm... nggak tau deh Dok.`,
            `Haduh, Dok. Pusing saya jelasinnya.`,
            // With filler
            `Yang pasti sih... nggak enak aja gitu.`,
            `Pokoknya ada yang nggak beres, Dok.`,
            `${prefix} cuma tau rasanya nggak bener.`,
            `Saya bisa rasain tapi nggak bisa ceritain.`,
            `Ya... gimana ya. Bingung ${prefix}, Dok.`
        ];
        const vagueText = pickFromPool(vaguePool, question.id, 'dialogueVague');
        return { text: vagueText, rawClinical, isVague: true, clarifiedResponse, metadata: opts.metadata };
    }

    const opts = {
        questionId: question.id,
        sentiment: question.sentiment,
        metadata: {}
    };
    response = applyPersonaAdaptation(response, patient, context, opts);

    return { text: response, rawClinical, metadata: opts.metadata };
}
