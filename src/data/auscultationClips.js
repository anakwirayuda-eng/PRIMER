/**
 * @reflection
 * [IDENTITY]: auscultationClips
 * [PURPOSE]: Data manifest for the auscultation trainer mini-game (heart sounds).
 * [STATE]: MVP (binary normal/abnormal)
 * [DEPENDS_ON]: public/audio/auscultation/*.wav
 * [LAST_UPDATE]: 2026-06-18
 *
 * Audio source — legally cleared (see docs/AUDIO_DOSSIER.md §15):
 *   PhysioNet/CinC Challenge 2016 Heart Sound DB, subset training-a.
 *   License: Open Data Commons Attribution v1.0 (ODC-By) — open access,
 *   redistribution permitted with attribution.
 *
 * MVP scope = binary classification (Normal vs Abnormal), which is exactly the
 * label granularity CinC 2016 provides (REFERENCE.csv: -1 normal, 1 abnormal).
 * Finer murmur typing (systolic/diastolic + grade) needs the CirCor DigiScope
 * dataset (also ODC-By) — planned as a follow-up module, not faked here.
 */

export const AUSCULTATION_SOURCE = Object.freeze({
    name: 'PhysioNet/CinC Challenge 2016 — Heart Sound Database (training-a)',
    license: 'ODC-By v1.0',
    url: 'https://physionet.org/content/challenge-2016/1.0.0/',
    attribution: 'Liu et al. (2016); Goldberger et al. (2000). PhysioNet, ODC-By v1.0.',
});

// The two answers the learner picks between.
export const AUSCULTATION_CHOICES = Object.freeze([
    { id: 'normal', label: 'Normal (S1–S2)' },
    { id: 'abnormal', label: 'Abnormal (murmur / bunyi tambahan)' },
]);

// Teaching feedback per truth value.
export const AUSCULTATION_EXPLAIN = Object.freeze({
    normal: 'Bunyi jantung S1 dan S2 reguler, tanpa murmur atau bunyi tambahan. Irama terdengar "lub-dub" yang bersih.',
    abnormal: 'Terdengar murmur / bunyi tambahan di luar S1–S2 — temuan patologis. Tindak lanjut: auskultasi 4 katup, lalu pertimbangkan ekokardiografi.',
});

// Curated clips from CinC 2016 training-a, labelled by its REFERENCE.csv.
export const AUSCULTATION_CLIPS = Object.freeze([
    { id: 'a0007', src: '/audio/auscultation/a0007.wav', answer: 'normal' },
    { id: 'a0009', src: '/audio/auscultation/a0009.wav', answer: 'normal' },
    { id: 'a0011', src: '/audio/auscultation/a0011.wav', answer: 'normal' },
    { id: 'a0012', src: '/audio/auscultation/a0012.wav', answer: 'normal' },
    { id: 'a0016', src: '/audio/auscultation/a0016.wav', answer: 'normal' },
    { id: 'a0019', src: '/audio/auscultation/a0019.wav', answer: 'normal' },
    { id: 'a0020', src: '/audio/auscultation/a0020.wav', answer: 'normal' },
    { id: 'a0022', src: '/audio/auscultation/a0022.wav', answer: 'normal' },
    { id: 'a0001', src: '/audio/auscultation/a0001.wav', answer: 'abnormal' },
    { id: 'a0002', src: '/audio/auscultation/a0002.wav', answer: 'abnormal' },
    { id: 'a0003', src: '/audio/auscultation/a0003.wav', answer: 'abnormal' },
    { id: 'a0005', src: '/audio/auscultation/a0005.wav', answer: 'abnormal' },
    { id: 'a0013', src: '/audio/auscultation/a0013.wav', answer: 'abnormal' },
    { id: 'a0031', src: '/audio/auscultation/a0031.wav', answer: 'abnormal' },
    { id: 'a0035', src: '/audio/auscultation/a0035.wav', answer: 'abnormal' },
    { id: 'a0042', src: '/audio/auscultation/a0042.wav', answer: 'abnormal' },
]);

// Build a balanced, shuffled round of `count` clips (defaults to all).
// Caller supplies the RNG (Math.random) so this stays pure/testable.
export function buildAuscultationRound(count = 8, rng = Math.random) {
    const normals = AUSCULTATION_CLIPS.filter(c => c.answer === 'normal');
    const abnormals = AUSCULTATION_CLIPS.filter(c => c.answer === 'abnormal');
    const shuffle = (arr) => {
        const a = [...arr];
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(rng() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    };
    const half = Math.max(1, Math.floor(count / 2));
    const picked = [...shuffle(normals).slice(0, half), ...shuffle(abnormals).slice(0, count - half)];
    return shuffle(picked);
}
