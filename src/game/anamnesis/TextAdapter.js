/**
 * @reflection
 * [IDENTITY]: Text Adapter
 * [PURPOSE]: NLP and text adaptation logic (Gender/Age/Informant prefixes and transformations).
 * [STATE]: Stable
 */

import { getInformantMode } from './InformantSystem.js';
import { pickDeterministic, seedKey } from '../../utils/deterministicRandom.js';

/**
 * Get appropriate prefix for addressing the patient or informant.
 */
export function getPrefix(patient, informantMode, target = 'auto') {
    const age = patient ? patient.age || 30 : 30;
    const gender = patient ? patient.gender || 'L' : 'L';

    if (target === 'informant' || (target === 'auto' && informantMode && informantMode.isInformant)) {
        let rel = (informantMode && informantMode.informantLabel) ? informantMode.informantLabel : 'Bapak/Ibu';
        if (rel === 'Orang Tua') rel = 'Bapak/Ibu';
        return rel;
    }

    if (age < 8) return 'Adik';
    if (age < 15) return 'Adik';
    if (age < 25) return gender === 'L' ? 'Mas' : 'Mbak';
    if (age < 65) return gender === 'L' ? 'Bapak' : 'Ibu';
    return gender === 'L' ? 'Kakek' : 'Nenek';
}

/**
 * Adapt question and response text based on patient gender, age, and informant mode.
 */
export function adaptTextForGender(text, patient, informantMode) {
    if (!text || !patient) return text;

    const gender = patient.gender;
    const age = patient.age || 30;
    const info = informantMode || getInformantMode(patient);

    let adapted = text;

    if (info.isInformant) {
        const parentPrefix = info.informantLabel || (gender === 'L' ? 'Ayah' : 'Ibu');

        if (info.reason === 'pediatric') {
            adapted = adapted.split('Apakah Bapak/Ibu').join('Apakah anaknya');
            adapted = adapted.split('Apakah Bapak').join('Apakah anaknya');
            adapted = adapted.split('Apakah Ibu').join('Apakah anaknya');
        } else {
            adapted = adapted.split('Apakah Bapak/Ibu').join('Apakah beliau');
            adapted = adapted.split('Apakah Bapak').join('Apakah beliau');
            adapted = adapted.split('Apakah Ibu').join('Apakah beliau');
        }

        adapted = adapted.split('{prefix}').join(parentPrefix);
        adapted = adapted.split('Bapak/Ibu').join(parentPrefix);
        adapted = adapted.split('bapak/ibu').join(parentPrefix.toLowerCase());
    } else {
        let prefix;
        if (age < 15) {
            prefix = 'Adik';
        } else {
            prefix = gender === 'L' ? 'Bapak' : 'Ibu';
        }

        adapted = adapted.split('{prefix}').join(prefix);
        adapted = adapted.split('Bapak/Ibu').join(prefix);
        adapted = adapted.split('bapak/ibu').join(prefix.toLowerCase());

        if (gender === 'P') {
            if (adapted.startsWith('Bapak perokok')) adapted = adapted.replace('Bapak perokok', 'Ibu perokok');
            if (adapted.startsWith('Apakah Bapak')) adapted = adapted.replace('Apakah Bapak', 'Apakah Ibu');
        }
        if (age < 15) {
            if (adapted.startsWith('Bapak perokok')) adapted = adapted.replace('Bapak perokok', 'Adik perokok');
            if (adapted.startsWith('Apakah Bapak')) adapted = adapted.replace('Apakah Bapak', 'Apakah Adik');
            if (adapted.startsWith('Apakah Ibu')) adapted = adapted.replace('Apakah Ibu', 'Apakah Adik');
        }
    }

    return adapted;
}

/**
 * Generate a contextual doctor acknowledgment.
 * @returns {{ text: string, response: string|null }} Object with text (doctor speaks) and optional response.
 */
export function getDoctorAcknowledgment(complaint, patient, informantMode) {
    if (!complaint) return { text: "Baik...", response: null };
    const info = informantMode || getInformantMode(patient);
    const label = info.isInformant ? info.informantLabel : getPrefix(patient, info);

    const acknowledgments = [
        // Short
        `Baik, ${label}.`,
        'Saya mengerti.',
        'Oke, saya catat.',
        `Baik ${label}, terima kasih.`,
        'Oke, saya pahami.',
        // Medium
        `Baik ${label}, saya mengerti keluhannya.`,
        `Oke ${label}, terima kasih infonya.`,
        `Baik, jadi masalah utamanya ${complaint.toLowerCase()}.`,
        `Saya catat ya ${label}.`,
        `Oke, ${complaint.toLowerCase()} ya. Saya periksa lebih lanjut.`,
        // Empathetic
        `Baik ${label}, pasti tidak nyaman ya.`,
        `Saya mengerti ${label}, mari kita periksa bersama.`,
        `Terima kasih sudah cerita ${label}. Kita lihat ya.`,
        `Oke ${label}, tenang ya. Kita cari tau bareng.`,
        // Clinical
        `Baik, saya perlu tanya beberapa hal lagi ya.`,
        `Oke, saya akan periksa lebih detail.`,
        `Baik ${label}. Mari kita bahas lebih lanjut.`,
        `Saya mengerti. Silakan Bapak/Ibu sampaikan.`,
        `Oke ${label}. Mari kita telusuri lebih dalam.`,
        `Baik, ${label}. Saya perlu beberapa informasi tambahan.`
    ];
    return {
        text: pickDeterministic(acknowledgments, seedKey('doctor-ack', patient?.id || patient?.name, complaint, label)),
        response: null
    };
}

/**
 * Generate initial complaint response with informant awareness.
 * @returns {{ response: string, speaker: string }} Object with response text and speaker label.
 */
export function getInitialComplaintResponse(patient, complaint) {
    const info = getInformantMode(patient);
    const prefix = getPrefix(patient, info);

    const cleanComp = (complaint || '').trim();
    const isFullSentence = cleanComp.length > 25 || cleanComp.includes(',') || cleanComp.includes('.');
    const capitalize = (s) => typeof s === 'string' && s.length > 0 ? s.charAt(0).toUpperCase() + s.slice(1) : s;

    if (isFullSentence) {
        let finalResponse = capitalize(cleanComp);
        if (!finalResponse.toLowerCase().includes('dok') && !finalResponse.endsWith('.') && !finalResponse.endsWith('?')) {
            finalResponse += ', Dok.';
        } else if (!finalResponse.endsWith('.') && !finalResponse.endsWith('?')) {
            finalResponse += '.';
        }
        return {
            response: finalResponse,
            speaker: info.isInformant ? (info.informantLabel || prefix) : (patient?.name || prefix)
        };
    }

    const cLower = cleanComp.toLowerCase();

    if (info.isInformant) {
        const informantResponses = [
            `Iya Dok, ini ${info.reason === 'pediatric' ? 'anak saya' : 'keluarga saya'} mengeluh ${cLower}.`,
            `Betul Dok, ${cLower}.`,
            `Iya, ${info.reason === 'pediatric' ? 'anaknya' : 'keluarganya'} ${cLower}, Dok.`,
            `${capitalize(cLower)}, Dok. Sudah beberapa hari.`,
            `Iya Dok. ${capitalize(cLower)}.`,
            `Ini ${info.reason === 'pediatric' ? 'anak saya' : ''} ${cLower} dari kemarin, Dok.`,
            `Betul Dok, keluhannya ${cLower}.`,
            `Iya, Dokter. ${capitalize(cLower)}.`
        ];
        return {
            response: pickDeterministic(informantResponses, seedKey('initial-complaint', patient?.id || patient?.name, cLower, 'informant')),
            speaker: info.informantLabel || prefix
        };
    }
    const directResponses = [
        `Saya ${cLower}, Dok.`,
        `${capitalize(cLower)}, Dok.`,
        `Iya Dok, saya merasa ${cLower}.`,
        `Keluhannya ${cLower}, Dok.`,
        `Dok, saya ${cLower}.`,
        `Ini saya ${cLower}.`,
        `Saya datang karena ${cLower}, Dok.`,
        `${capitalize(cLower)}, Dok. Sudah beberapa hari.`,
        `Iya, ${cLower}.`,
        `${capitalize(cLower)}, Dokter.`
    ];
    return {
        response: pickDeterministic(directResponses, seedKey('initial-complaint', patient?.id || patient?.name, cLower, 'direct')),
        speaker: patient?.name || prefix
    };
}

/**
 * Get the speaker label for the response bubble.
 */
export function getSpeakerLabel(question, patient) {
    if (!patient) return 'Pasien';
    const info = getInformantMode(patient);
    if (info.isInformant) return info.informantLabel || 'Pendamping';
    return patient.name || 'Pasien';
}
