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
import { chanceFromSeed, pickDeterministic, seedKey } from '../../utils/deterministicRandom.js';

const pickDialogueVariant = (items, ...parts) => pickDeterministic(items, seedKey(...parts));
const INFORMANT_TITLE_EQUIVALENTS = {
    Ibu: [/^ibu\b/i, /^bu\b/i],
    Bapak: [/^bapak\b/i, /^pak\b/i],
    Ayah: [/^ayah\b/i],
    Pendamping: [/^pendamping\b/i]
};

function formatInformantDisplayName(label, name) {
    const cleanLabel = (label || '').trim();
    const cleanName = (name || '').trim();

    if (!cleanName) return cleanLabel;
    if (!cleanLabel) return cleanName;

    const equivalents = INFORMANT_TITLE_EQUIVALENTS[cleanLabel] || [new RegExp(`^${cleanLabel}\\b`, 'i')];
    if (equivalents.some(pattern => pattern.test(cleanName))) {
        return cleanName;
    }

    return `${cleanLabel} ${cleanName}`;
}

function isParentFocusedQuestion(question) {
    const text = question?.text || '';
    return /\b(bapak\/ibu|pak\/bu|bapak|ibu|ayah|orang tua|wali|pendamping)\b/i.test(text);
}

function normalizePediatricInformantResponse(response, question, info) {
    if (!response || !info?.isInformant || info.reason !== 'pediatric' || question?.isChildDirect) {
        return response;
    }

    if (isParentFocusedQuestion(question)) {
        return response;
    }

    const replacements = [
        [/^Saya nggak bisa bilang sakitnya kayak apa\b/i, 'Saya nggak bisa bilang sakitnya anak saya kayak apa'],
        [/^Saya bingung harus bilang apa\b/i, 'Saya bingung jelasinnya, Dok'],
        [/^Saya cuma tau rasanya nggak bener aja\b/i, 'Saya cuma tau anak saya kelihatannya nggak nyaman aja'],
        [/^Saya bisa rasain tapi nggak bisa jelasin ke orang lain\b/i, 'Saya lihat anak saya nggak nyaman, tapi susah saya jelaskan'],
        [/^Saya sendiri heran kenapa bisa gini\b/i, 'Saya sendiri bingung anak saya kenapa bisa begini'],
        [/^Yang pasti bikin nggak nyaman, tapi saya sendiri bingung\b/i, 'Yang pasti anak saya kelihatan nggak nyaman, tapi saya sendiri bingung'],
        [/^Rasanya ada yang nggak beres tapi saya nggak ngerti\b/i, 'Kelihatannya ada yang nggak beres, tapi saya nggak ngerti pastinya'],
        [/^Rasanya aneh, Dok\. Tapi saya nggak bisa ceritain\b/i, 'Kelihatannya aneh, Dok. Tapi saya nggak bisa ceritain persis'],
        [/^Saya pasrah, Dok\.\.\./i, 'Saya bingung, Dok...'],
        [/^Saya (sesak|batuk|demam|muntah|pilek|diare|mencret|gatal|nyeri|pusing|lemas|haus|sering sekali BAK|BAK|BAB)\b/i, 'Anak saya $1']
    ];

    let normalized = response;
    replacements.forEach(([pattern, replacement]) => {
        normalized = normalized.replace(pattern, replacement);
    });

    return normalized;
}

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
        const parentStr = formatInformantDisplayName(parentLabel, parentName);

        const greetingVar = pickDialogueVariant([
            isFollowUp ? `${greeting} lagi ${parentStr}. Ada yang terlewat untuk ${childName}?` : `${greeting}, saya dr. ${drName} yang bertugas. Ini ${childName} ya, ${parentStr}?`,
            isFollowUp ? `${parentStr}, ada keluhan lain tentang ${childName}?` : `${greeting}, ${parentStr}. Saya dr. ${drName}. Ada keluhan apa dengan ${childName} hari ini?`,
            isFollowUp ? `Halo ${childName}, ada lagi yang sakit?` : `Halo ${childName}, halo ${parentStr}. Saya dr. ${drName}. Apa yang bisa saya bantu untuk anaknya?`
        ], 'greeting', patient?.id || patient?.name, doctorName, time, parentStr, isFollowUp, 'pediatric');

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
        const greetingVar = pickDialogueVariant([
            isFollowUp ? `${greeting} lagi, ${prefix}. Ada lagi yang bisa saya bantu?` : `${greeting}, saya dr. ${drName}. Apa kabar ${prefix} hari ini?`,
            isFollowUp ? `${prefix}, ada keluhan lain yang ingin disampaikan?` : `${greeting}, saya dr. ${drName} yang bertugas. Ada yang bisa saya bantu, ${prefix}?`,
            isFollowUp ? `${greeting} ${prefix}. Ada yang terlupa?` : `${greeting} ${prefix}. Saya dr. ${drName}. Ada keluhan apa saat ini?`
        ], 'greeting', patient?.id || patient?.name, doctorName, time, prefix, isFollowUp, info.reason || 'default');

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
    const demeanorSeed = seedKey('demeanor', patient?.id || patient?.name, complaint, age, social.trustLevel, social.healthBelief);

    // Complaint-specific pools (2-3 options each for variety)
    const painPool = ['(tampak menahan rasa sakit)', '(meringis pelan)', '(memegang bagian yang sakit)', '(tampak kesakitan)'];
    const dizzyPool = ['(tampak lesu dan pucat)', '(berjalan sempoyongan)', '(tampak lemas)', '(pucat dan lelah)'];
    const breathPool = ['(tampak kesulitan bernafas)', '(nafas pendek-pendek)', '(sesekali batuk)', '(terengah-engah)'];
    const feverPool = ['(tampak tidak nyaman dan berkeringat)', '(wajah memerah)', '(tampak demam)', '(keringat di dahi)'];
    const anxPool = ['(tampak gelisah dan cemas)', '(tangan gemetar)', '(mata gelisah)', '(kaki bergoyang cemas)'];

    if (complaint.includes('nyeri') || complaint.includes('sakit')) return pickDialogueVariant(painPool, demeanorSeed, 'pain');
    if (complaint.includes('pusing') || complaint.includes('lemas')) return pickDialogueVariant(dizzyPool, demeanorSeed, 'dizzy');
    if (complaint.includes('sesak') || complaint.includes('nafas')) return pickDialogueVariant(breathPool, demeanorSeed, 'breath');
    if (complaint.includes('demam') || complaint.includes('panas')) return pickDialogueVariant(feverPool, demeanorSeed, 'fever');
    if (complaint.includes('cemas') || complaint.includes('gelisah')) return pickDialogueVariant(anxPool, demeanorSeed, 'anxious');

    if (social.trustLevel === 'skeptical') {
        const skeptPool = ['(ekspresi agak ragu)', '(melirik curiga)', '(tampak tidak yakin)', '(bersedekap tangan)'];
        return pickDialogueVariant(skeptPool, demeanorSeed, 'skeptical');
    }
    if (social.healthBelief === 'Tradisionalis') {
        const tradPool = ['(tampak sedikit canggung)', '(memandang sekitar ruangan)', '(agak gugup)', '(tampak tidak terbiasa)'];
        return pickDialogueVariant(tradPool, demeanorSeed, 'traditional');
    }

    if (age < 15) {
        const childPool = ['(tampak malu-malu)', '(bersembunyi di balik orangtua)', '(memegang tangan orangtua)', '(menunduk malu)'];
        return pickDialogueVariant(childPool, demeanorSeed, 'child');
    }
    if (age > 70) {
        const elderPool = ['(berjalan dengan hati-hati)', '(duduk pelan-pelan)', '(tampak kelelahan)', '(bicara pelan)'];
        return pickDialogueVariant(elderPool, demeanorSeed, 'elder');
    }

    const neutralPool = [
        '(mengangguk sopan)', '(duduk dengan tenang)', '(tersenyum tipis)',
        '(tampak sabar menunggu)', '(memandang dokter)', '(tersenyum sopan)',
        '(menyapa dengan ramah)', '(tampak kooperatif)', '(duduk tegak)'
    ];
    return pickDialogueVariant(neutralPool, demeanorSeed, 'neutral');
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
    response = normalizePediatricInformantResponse(response, question, info);

    // Capture the clinical response BEFORE persona adaptation (for accurate classification)
    const rawClinical = response;

    // Vagueness check — preserve original clinical info for follow-up re-ask
    const vagueness = calculateVaguenessScore(response);
    if (vagueness > 0.7 && chanceFromSeed(seedKey('vagueness', patient?.id || patient?.name, question.id, rawClinical), 0.05)) {
        const prefix = getPrefix(patient, info, 'auto');
        const opts = {
            vagueAlreadyApplied: true,
            questionId: question.id,
            sentiment: question.sentiment,
            metadata: {}
        };
        const clarifiedResponse = normalizePediatricInformantResponse(
            applyPersonaAdaptation(response, patient, context, opts),
            question,
            info
        );
        // Varied vague templates — realistic Puskesmas feel (large pool for variety)
        const vaguePool = info.isInformant && info.reason === 'pediatric' ? [
            'Saya bingung jelasinnya, Dok. Yang pasti anak saya kelihatan nggak nyaman.',
            'Saya kurang bisa jelasin, Dok. Pokoknya anak saya lagi nggak enak badan.',
            'Susah saya ceritain, Dok. Yang jelas anak saya kelihatan sakit.',
            'Saya nggak bisa bilang persis, Dok. Tapi anak saya kelihatan nggak nyaman.',
            'Pokoknya anak saya rewel dan kelihatan nggak enak badan, Dok.',
            'Yang saya lihat, anak saya lagi nggak seperti biasanya, Dok.',
            'Saya bingung, Dok. Anak saya pokoknya kelihatan nggak enak badan.',
            'Saya cuma tahu anak saya kelihatannya nggak nyaman, Dok.'
        ] : [
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
        const vagueText = normalizePediatricInformantResponse(
            pickFromPool(vaguePool, question.id, 'dialogueVague'),
            question,
            info
        );
        return { text: vagueText, rawClinical, isVague: true, clarifiedResponse, metadata: opts.metadata };
    }

    const opts = {
        questionId: question.id,
        sentiment: question.sentiment,
        metadata: {}
    };
    response = normalizePediatricInformantResponse(
        applyPersonaAdaptation(response, patient, context, opts),
        question,
        info
    );

    return { text: response, rawClinical, metadata: opts.metadata };
}
