/**
 * @reflection
 * [IDENTITY]: FurnitureData
 * [PURPOSE]: Static data module exporting: FURNITURE_ITEMS, ROOMS, INITIAL_INVENTORY.
 * [STATE]: Experimental
 * [ANCHOR]: FURNITURE_ITEMS
 * [DEPENDS_ON]: None
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-12
 */

export const FURNITURE_ITEMS = [
    // --- REST (Bedroom) ---
    {
        id: 'bed_basic',
        name: 'Kasur Busa Tipis',
        type: 'bed',
        price: 0,
        effect: { energy: 10 },
        desc: 'Bikin sakit punggung tapi lumayan untuk melepas lelah.',
        room: 'bedroom'
    },
    {
        id: 'bed_comfort',
        name: 'Springbed Empuk',
        type: 'bed',
        price: 2500000,
        effect: { energy: 20 },
        desc: 'Tidur nyenyak, mimpi indah, bangun lebih segar.',
        room: 'bedroom'
    },
    {
        id: 'bed_luxury',
        name: 'King Size Memory Foam',
        type: 'bed',
        price: 8000000,
        effect: { energy: 35 },
        desc: 'Serasa tidur di atas awan. Pemulihan energi maksimal.',
        room: 'bedroom'
    },

    // --- RELAX (Living Room) ---
    {
        id: 'ent_radio',
        name: 'Radio Jadul',
        type: 'entertainment',
        price: 0,
        effect: { stress: -5 },
        desc: 'Hanya menangkap siaran lokal, kadang kresek-kresek.',
        room: 'living_room'
    },
    {
        id: 'ent_tv_crt',
        name: 'TV Tabung 14"',
        type: 'entertainment',
        price: 500000,
        effect: { stress: -10 },
        desc: 'Gambarnya agak sember, tapi ada hiburan visual.',
        room: 'living_room'
    },
    {
        id: 'ent_smart_tv',
        name: 'Smart TV 42"',
        type: 'entertainment',
        price: 4500000,
        effect: { stress: -25 },
        desc: 'Bisa nonton series streaming favorit. Stress hilang sekejap.',
        room: 'living_room'
    },
    {
        id: 'sofa_basic',
        name: 'Kursi Kayu',
        type: 'sofa',
        price: 0,
        effect: { stress: -2 },
        desc: 'Keras, tapi lebih baik daripada berdiri.',
        room: 'living_room'
    },
    {
        id: 'sofa_comfort',
        name: 'Sofa Empuk 2 Seater',
        type: 'sofa',
        price: 1500000,
        effect: { stress: -8 },
        desc: 'Nyaman untuk diduduki berjam-jam.',
        room: 'living_room'
    },

    // --- STUDY/WORK (Bedroom/Office) ---
    {
        id: 'desk_basic',
        name: 'Meja Lipat',
        type: 'desk',
        price: 0,
        effect: { knowledge: 5 },
        desc: 'Goyang sedikit kalau kesenggol, tapi cukup untuk menulis.',
        room: 'workspace'
    },
    {
        id: 'desk_office',
        name: 'Meja Kerja Kayu Jati',
        type: 'desk',
        price: 2000000,
        effect: { knowledge: 10 },
        desc: 'Kokoh dan luas. Menambah fokus belajar.',
        room: 'workspace'
    },

    // --- KITCHEN ---
    {
        id: 'kitchen_basic',
        name: 'Kompor Portable',
        type: 'kitchen',
        price: 0,
        effect: { energy: 15 }, // Per cooking session
        desc: 'Cukup untuk masak air dan mie instan.',
        room: 'kitchen'
    },
    {
        id: 'kitchen_standard',
        name: 'Kompor Gas 2 Tungku',
        type: 'kitchen',
        price: 1200000,
        effect: { energy: 25 },
        desc: 'Bisa masak lauk dan sayur sekaligus.',
        room: 'kitchen'
    },
    {
        id: 'kitchen_chef',
        name: 'Kitchen Set Modern',
        type: 'kitchen',
        price: 5000000,
        effect: { energy: 40 },
        desc: 'Memasak jadi hobi yang menyenangkan. Makanan lebih bergizi.',
        room: 'kitchen'
    },

    // --- GYM (Backyard/Corner) ---
    {
        id: 'gym_mat',
        name: 'Matras Yoga',
        type: 'gym',
        price: 150000,
        effect: { maxEnergy: 5 }, // Adds to Max Energy cap
        desc: 'Untuk stretching dan olahraga ringan.',
        room: 'gym'
    },
    {
        id: 'gym_dumbbell',
        name: 'Sepasang Dumbbell',
        type: 'gym',
        price: 500000,
        effect: { maxEnergy: 10 },
        desc: 'Membentuk otot dan stamina dasar.',
        room: 'gym'
    },
    {
        id: 'gym_treadmill',
        name: 'Treadmill Bekas',
        type: 'gym',
        price: 3000000,
        effect: { maxEnergy: 20 },
        desc: 'Kardio intensif tanpa harus keluar rumah.',
        room: 'gym'
    },

    // --- PC / STREAMING SETUP (Workspace) ---
    {
        id: 'pc_basic',
        name: 'Laptop Kentang',
        type: 'pc',
        price: 0,
        effect: { fun: 5, income: 0 },
        desc: 'Bisa main game ringan, tapi sering lag.',
        room: 'workspace'
    },
    {
        id: 'pc_mid',
        name: 'PC Rakitan Mid-Range',
        type: 'pc',
        price: 5000000,
        effect: { fun: 15, income: 50000 },
        desc: 'Lancar main game populer. Bisa mulai streaming kecil-kecilan.',
        room: 'workspace'
    },
    {
        id: 'pc_high',
        name: 'Battle Station RGB',
        type: 'pc',
        price: 15000000,
        effect: { fun: 30, income: 150000 },
        desc: 'Spesifikasi rata kanan. Setup idaman streamer pro.',
        room: 'workspace'
    },
    {
        id: 'mic_basic',
        name: 'Headset Mic Bawaan',
        type: 'mic',
        price: 0,
        effect: { reputation: 0 },
        desc: 'Suara agak cempreng.',
        room: 'workspace'
    },
    {
        id: 'mic_pro',
        name: 'Mic Condenser + Arm',
        type: 'mic',
        price: 1500000,
        effect: { reputation: 2 }, // Bonus reputation when streaming
        desc: 'Suara jernih seperti penyiar radio profesional.',
        room: 'workspace'
    },

    // --- VEHICLES (Garage) ---
    {
        id: 'vehicle_motor',
        name: 'Motor Bebek Second',
        type: 'vehicle',
        price: 4000000,
        effect: { travel: true },
        desc: 'Bisa dipakai ke minimarket atau keliling desa.',
        room: 'garage'
    },
    {
        id: 'vehicle_car',
        name: 'City Car LCGC',
        type: 'vehicle',
        price: 120000000, // Expensive!
        effect: { travel: true, comfort: true },
        desc: 'Akhirnya bisa jalan-jalan ke kota tanpa kehujanan.',
        room: 'garage'
    }
];

export const ROOMS = [
    { id: 'living_room', name: 'Ruang Tengah', icon: '🛋️' },
    { id: 'bedroom', name: 'Kamar Tidur', icon: '🛏️' },
    { id: 'kitchen', name: 'Dapur', icon: '🍳' },
    { id: 'workspace', name: 'Ruang Kerja', icon: '💻' },
    { id: 'gym', name: 'Pojok Olahraga', icon: '💪' },
    { id: 'guest_room', name: 'Ruang Tamu', icon: '☕' },
    { id: 'garage', name: 'Garasi', icon: '🏍️' }
];

export const INITIAL_INVENTORY = [
    'bed_basic', 'sofa_basic', 'desk_basic', 'ent_radio', 'kitchen_basic', 'pc_basic', 'mic_basic'
];
