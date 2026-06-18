/**
 * Audio license credits — populated when adding CC-BY / CC-BY-SA / CC-BY-NC tracks.
 * CC0 (public domain) tracks need NO entry — they impose no attribution requirement.
 *
 * SettingsModal hides the Credits section when this array is empty.
 *
 * Format:
 *   {
 *     id: string,           // unique slug
 *     title: string,        // human-readable track name
 *     creator: string,      // author / username
 *     url: string,          // canonical source URL
 *     license: string,      // e.g. "CC-BY 4.0", "CC-BY-NC 3.0"
 *     type: 'bgm' | 'sfx' | 'voice'
 *   }
 *
 * Example (uncomment when adopting RTB45's Suling Bali for V2):
 *   { id: 'suling_bali', title: 'Suling Flute - Bali', creator: 'RTB45',
 *     url: 'https://freesound.org/people/RTB45/sounds/203363/',
 *     license: 'CC-BY 4.0', type: 'bgm' }
 *
 * See docs/AUDIO_SOURCING.md for sourcing guidelines.
 */
export const AUDIO_CREDITS = [
    {
        id: 'cinc2016_heart',
        title: 'Heart Sound Database (training-a)',
        creator: 'PhysioNet/CinC Challenge 2016 — Liu et al. (2016); Goldberger et al. (2000)',
        url: 'https://physionet.org/content/challenge-2016/1.0.0/',
        license: 'ODC-By 1.0',
        type: 'clip',
    },
];
