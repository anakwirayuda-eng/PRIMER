/**
 * @reflection
 * [IDENTITY]: GuestEventSystem
 * [PURPOSE]: Game engine module providing: GUEST_EVENTS, getRandomGuestEvent.
 * [STATE]: Experimental
 * [ANCHOR]: GUEST_EVENTS
 * [DEPENDS_ON]: None
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-12
 */


import { pickDeterministic, seedKey } from '../utils/deterministicRandom.js';

let guestEventCounter = 0;

export const GUEST_EVENTS = [
    {
        id: 'family_visit_1',
        title: 'Kunjungan Orang Tua',
        text: 'Ayah dan Ibu datang jauh-jauh dari kampung membawa oleh-oleh beras dan kerupuk.',
        effect: { stress: -20, energy: -10, reputation: 0 },
        options: [
            { label: 'Sambut dengan hangat', effect: { stress: -20 } },
            { label: 'Mengeluh sibuk', effect: { stress: 10, reputation: -2 } }
        ]
    },
    {
        id: 'friend_visit_1',
        title: 'Teman Lama',
        text: 'Teman kuliah mampir. Dia sekarang jadi sales alat kesehatan.',
        effect: { stress: -5 },
        options: [
            { label: 'Ngobrol nostalgia', effect: { stress: -10 } },
            { label: 'Lihat katalog produknya', effect: { knowledge: 2, money: -500000 } }
        ]
    },
    {
        id: 'neighbor_visit_1',
        title: 'Tetangga Reseh',
        text: 'Tetangga sebelah minta obat gratis buat anaknya yang batuk.',
        effect: { stress: 5 },
        options: [
            { label: 'Kasih paracetamol (Stok Pribadi)', effect: { reputation: 2, money: -5000 } },
            { label: 'Suruh daftar ke Puskesmas', effect: { reputation: -1, stress: 5 } }
        ]
    }
];

export const getRandomGuestEvent = (seedHint = guestEventCounter++) => {
    return pickDeterministic(GUEST_EVENTS, seedKey('guest-event', seedHint));
};
