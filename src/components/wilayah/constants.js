/**
 * @reflection
 * [IDENTITY]: constants.js
 * [PURPOSE]: Unified constants for the village map system including tile types, building types, and asset mappings.
 * [STATE]: Stable
 * [ANCHOR]: TILE_TYPES, BUILDING_TYPES, AI_ASSETS
 * [DEPENDS_ON]: assets.js
 */

import { getAssetUrl, ASSET_KEY } from '../../assets/assets.js';

export const TILE_TYPES = {
    GRASS: 0,
    ROAD_H: 1,
    ROAD_V: 2,
    ROAD_CROSS: 3,
    SAWAH: 4,
    WATER: 5,
    TREE: 6,
    SAND: 7,
    MOUNTAIN: 8,
    BRIDGE: 9,
    FOREST_BASE: 12,
    FLOWER: 10,
    DIRT_PATH: 11,
    DIRT_ROAD_H: 13,
    DIRT_ROAD_V: 14,
    DIRT_ROAD_CROSS: 15,
};

export const BUILDING_TYPES = {
    HOUSE_RED: 'house_red',
    HOUSE_BLUE: 'house_blue',
    HOUSE_TRAD: 'house_trad',
    HOUSE_MODERN: 'house_modern',
    HOUSE_HUT: 'house_hut',
    PUSKESMAS: 'puskesmas',
    RUMAH_DINAS: 'rumah_dinas',
    SCHOOL: 'school',
    MOSQUE: 'mosque',
    MARKET: 'market',
    BALAI_DESA: 'balai_desa',
    ALUN_ALUN: 'alun_alun',
    KANTOR_DESA: 'kantor_desa',
    WATERFALL: 'waterfall',
    WARUNG: 'warung',
    LAPANGAN: 'lapangan',
    WELL: 'well',
    FARM: 'farm',
    PLAYGROUND: 'playground',
    TPU: 'tpu',
    OFFICE: 'office',
    POSYANDU: 'posyandu',
    APOTEK: 'apotek',
    TK: 'tk',
    MCK: 'mck',
    JEMBATAN: 'jembatan',
    SUNGAI: 'sungai',
    KB_POST: 'kb_post',
    POLINDES: 'polindes',
    TOKO_KELONTONG: 'toko_kelontong',
    PUSTU: 'pustu',
    PAMSIMAS: 'pamsimas',
    BANK_SAMPAH: 'bank_sampah',
    POS_GIZI: 'pos_gizi',
    RTK: 'rtk',
    TOGA: 'toga',
    IKS_SCOREBOARD: 'iks_scoreboard',
    DASHAT: 'dashat',
    POS_UKK: 'pos_ukk',
    HUTAN_LINDUNG: 'hutan_lindung',
    SUNGAI_CIKAPAS: 'sungai_cikapas',
    GAPURA_DESA: 'gapura_desa',
    SAWAH_BERUNDAK: 'sawah_berundak',
};

export const AI_ASSETS = {
    PUSKESMAS: getAssetUrl(ASSET_KEY.BUILDING_PUSKESMAS),
    SCHOOL: getAssetUrl(ASSET_KEY.BUILDING_SCHOOL),
    MOSQUE: getAssetUrl(ASSET_KEY.BUILDING_MOSQUE),
    MARKET: getAssetUrl(ASSET_KEY.BUILDING_MARKET),
    HOUSE_MODERN: getAssetUrl(ASSET_KEY.BUILDING_HOUSE),
    PAMSIMAS: getAssetUrl(ASSET_KEY.BUILDING_PAMSIMAS),
    BALAI_DESA: getAssetUrl(ASSET_KEY.BUILDING_BALAI_DESA),
    POSYANDU: getAssetUrl(ASSET_KEY.BUILDING_POSYANDU),
    POLINDES: getAssetUrl(ASSET_KEY.BUILDING_POLINDES),
    PUSTU: getAssetUrl(ASSET_KEY.BUILDING_PUSTU),
    ALUN_ALUN: getAssetUrl(ASSET_KEY.BUILDING_ALUN_ALUN),
    BANK_SAMPAH: getAssetUrl(ASSET_KEY.BUILDING_BANK_SAMPAH),
    MCK: getAssetUrl(ASSET_KEY.BUILDING_MCK),
    TK: getAssetUrl(ASSET_KEY.BUILDING_TK),
    RTK: getAssetUrl(ASSET_KEY.BUILDING_RTK),
    KANTOR_DESA: getAssetUrl(ASSET_KEY.BUILDING_KANTOR_DESA),
    RUMAH_DINAS: getAssetUrl(ASSET_KEY.BUILDING_RUMAH_DINAS),
    TPU: getAssetUrl(ASSET_KEY.BUILDING_TPU),
    WELL: getAssetUrl(ASSET_KEY.BUILDING_WELL),
    POS_GIZI: getAssetUrl(ASSET_KEY.BUILDING_POS_GIZI),
    POS_UKK: getAssetUrl(ASSET_KEY.BUILDING_POS_UKK),
    TOGA: getAssetUrl(ASSET_KEY.BUILDING_TOGA),
    IKS_SCOREBOARD: getAssetUrl(ASSET_KEY.BUILDING_IKS_SCOREBOARD),
    DASHAT: getAssetUrl(ASSET_KEY.BUILDING_DASHAT),
    // Recovered from C: backup (2026-02-18)
    HOUSE_BLUE: getAssetUrl(ASSET_KEY.BUILDING_HOUSE_BLUE),
    HOUSE_TRAD: getAssetUrl(ASSET_KEY.BUILDING_HOUSE_TRAD),
    HOUSE_CLASSIC: getAssetUrl(ASSET_KEY.BUILDING_HOUSE_CLASSIC),
    HOUSE_RED: getAssetUrl(ASSET_KEY.BUILDING_HOUSE_RED),
    HOUSE_HUT: getAssetUrl(ASSET_KEY.BUILDING_HOUSE_HUT),
    HUTAN_LINDUNG: getAssetUrl(ASSET_KEY.BUILDING_HUTAN_LINDUNG),
    SUNGAI_CIKAPAS: getAssetUrl(ASSET_KEY.BUILDING_SUNGAI_CIKAPAS),
    PLAYGROUND: getAssetUrl(ASSET_KEY.BUILDING_PLAYGROUND),
    LAPANGAN: getAssetUrl(ASSET_KEY.BUILDING_LAPANGAN),
    TOKO_KELONTONG: getAssetUrl(ASSET_KEY.BUILDING_TOKO_KELONTONG),
    WARUNG: getAssetUrl(ASSET_KEY.BUILDING_WARUNG),
    HOUSE_MODERN_ISO: getAssetUrl(ASSET_KEY.BUILDING_HOUSE_MODERN),
};

/**
 * Resolves a building type (lowercase, e.g. 'puskesmas', 'house_blue')
 * to its isometric PNG inset URL from AI_ASSETS.
 * Use this in building detail panels to display the correct building image.
 */
export function getBuildingInsetUrl(buildingType) {
    if (!buildingType) return AI_ASSETS.HOUSE_MODERN;
    // Convert: 'house_blue' → 'HOUSE_BLUE', 'puskesmas' → 'PUSKESMAS'
    const key = buildingType.toUpperCase();
    return AI_ASSETS[key] || AI_ASSETS.HOUSE_MODERN;
}

export const PISPK_INDICATORS = [
    { id: 'kb', label: 'Keluarga mengikuti KB' },
    { id: 'persalinan', label: 'Persalinan di faskes' },
    { id: 'imunisasi', label: 'Bayi mendapat imunisasi dasar lengkap' },
    { id: 'asi', label: 'Bayi mendapat ASI eksklusif' },
    { id: 'balita', label: 'Pertumbuhan balita dipantau' },
    { id: 'tb', label: 'Penderita TB paru berobat sesuai standar' },
    { id: 'hipertensi', label: 'Penderita hipertensi berobat teratur' },
    { id: 'jiwa', label: 'Penderita gangguan jiwa tidak ditelantarkan' },
    { id: 'rokok', label: 'Anggota keluarga tidak ada yang merokok' },
    { id: 'jkn', label: 'Keluarga sudah menjadi anggota JKN' },
    { id: 'air', label: 'Keluarga mempunyai akses sarana air bersih' },
    { id: 'jamban', label: 'Keluarga mempunyai akses atau menggunakan jamban sehat' },
    { id: 'jentik', label: 'Bebas jentik nyamuk (PSN)' },
];

export const HOME_VISIT_INTERVENTIONS = [
    { id: 'kb', label: 'Edukasi KB', description: 'Konseling Keluarga Berencana', indicator: 'kb', time: 20, energy: 10, xp: 20, icon: '👶', color: 'blue' },
    { id: 'persalinan', label: 'Edukasi Persalinan', description: 'Konseling persalinan di faskes', indicator: 'persalinan', time: 25, energy: 12, xp: 20, icon: '🏥', color: 'pink' },
    { id: 'imunisasi', label: 'Cek Imunisasi', description: 'Verifikasi status imunisasi bayi', indicator: 'imunisasi', time: 20, energy: 10, xp: 20, icon: '💉', color: 'purple' },
    { id: 'asi', label: 'Edukasi ASI Eksklusif', description: 'Konseling ASI eksklusif 6 bulan', indicator: 'asi', time: 20, energy: 10, xp: 20, icon: '🍼', color: 'sky' },
    { id: 'balita', label: 'Pantau Tumbuh Kembang', description: 'Pengukuran BB/TB balita', indicator: 'balita', time: 30, energy: 15, xp: 25, icon: '📏', color: 'green' },
    { id: 'tb', label: 'Pemantauan TB', description: 'Cek kepatuhan minum obat TB', indicator: 'tb', time: 25, energy: 12, xp: 25, icon: '🫁', color: 'orange' },
    { id: 'hipertensi', label: 'Skrining Hipertensi', description: 'Pengukuran tekanan darah', indicator: 'hipertensi', time: 15, energy: 8, xp: 15, icon: '❤️', color: 'rose' },
    { id: 'jiwa', label: 'Skrining Kesehatan Jiwa', description: 'Deteksi dini gangguan jiwa', indicator: 'jiwa', time: 25, energy: 12, xp: 25, icon: '🧠', color: 'violet' },
    { id: 'rokok', label: 'Konseling Berhenti Rokok', description: 'Edukasi bahaya merokok', indicator: 'rokok', time: 20, energy: 10, xp: 15, icon: '🚬', color: 'red' },
    { id: 'jkn', label: 'Pendaftaran JKN/BPJS', description: 'Bantuan pendaftaran BPJS Kesehatan', indicator: 'jkn', time: 30, energy: 15, xp: 30, icon: '🪪', color: 'emerald' },
    { id: 'sanitasi', label: 'Survei Sanitasi', description: 'Cek jamban dan sumber air', indicators: ['air', 'jamban'], time: 25, energy: 12, xp: 20, icon: '🚰', color: 'cyan' },
    { id: 'psn', label: 'Pemeriksaan Jentik (PSN)', description: 'Periksa TPA untuk jentik nyamuk Aedes', indicator: 'jentik', time: 15, energy: 8, xp: 15, icon: '🦟', color: 'amber' },
];

export const INTERVENTION_EDUCATION = {
    kb: "💡 Keluarga Berencana membantu mengatur jarak kehamilan ideal 2-4 tahun, mengurangi risiko kematian ibu dan bayi.",
    persalinan: "💡 Persalinan di faskes mengurangi risiko komplikasi. 70% kematian ibu bisa dicegah dengan pertolongan tenaga kesehatan.",
    imunisasi: "💡 Imunisasi dasar lengkap melindungi anak dari 14 penyakit berbahaya. Vaksin aman dan efektif!",
    asi: "💡 ASI eksklusif 6 bulan pertama mengandung antibodi yang melindungi bayi dari infeksi dan alergi.",
    balita: "💡 Pemantauan tumbuh kembang rutin mendeteksi stunting dini. 1000 HPK adalah golden period!",
    tb: "💡 Pengobatan TB harus tuntas 6 bulan. Putus obat menyebabkan resistensi (MDR-TB) yang sulit diobati.",
    hipertensi: "💡 Hipertensi adalah 'silent killer'. Deteksi dini mencegah stroke & penyakit jantung.",
    jiwa: "💡 Kesehatan jiwa sama pentingnya dengan kesehatan fisik. Deteksi dini membantu recovery.",
    rokok: "💡 Merokok menyebabkan 8 juta kematian/tahun. Berhenti merokok BISA dilakukan dengan dukungan!",
    jkn: "💡 JKN melindungi keluarga dari katastropik finansial akibat biaya kesehatan.",
    sanitasi: "💡 Air bersih dan jamban sehat mencegah diare dan penyakit menular lainnya.",
    psn: "💡 3M Plus (Menguras, Menutup, Mengubur + PSN) mencegah DBD. Satu nyamuk bisa menginfeksi banyak orang!"
};
