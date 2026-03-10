/**
 * @reflection
 * [IDENTITY]: ClinicalServices
 * [PURPOSE]: Static data module exporting: CLINICAL_SERVICES, STAFF_TYPES, isServiceUnlocked (+1 more).
 * [STATE]: Stable
 * [ANCHOR]: CLINICAL_SERVICES
 * [DEPENDS_ON]: None
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-17
 */

// ═══════════════════════════════════════════════════════════════
// CLINICAL SERVICES — Consolidated Poli Structure
// Based on Permenkes No. 19/2024 Puskesmas Standards
// 5 Core Services: Umum, UGD, KIA-KB, Gigi, Farmasi & Lab
// ═══════════════════════════════════════════════════════════════

export const CLINICAL_SERVICES = [
    // ─────────────────────────────────────────────
    // LEVEL 1 — Available at Beta (v1.0.0)
    // ─────────────────────────────────────────────
    {
        id: 'poli_umum',
        name: 'Poli Umum',
        shortName: 'Umum',
        icon: '🩺',
        color: 'from-indigo-500 to-blue-600',
        bgColor: 'bg-indigo-50',
        textColor: 'text-indigo-700',
        description: 'Pelayanan kesehatan dasar untuk semua keluhan',
        unlockLevel: 1,
        requiredStaff: null,
        isDefault: true,
        betaLocked: false,
        queueType: 'queue',
        // Poli Umum has sub-tabs for different workflows
        subTabs: ['antrian', 'prolanis'],
        gameplayHint: 'Anamnesis → Pemeriksaan → Diagnosis → Terapi → Edukasi. Prolanis: kontrol bulanan DM & HT.',
    },
    {
        id: 'igd',
        name: 'UGD',
        shortName: 'UGD',
        icon: '🚨',
        color: 'from-red-500 to-rose-600',
        bgColor: 'bg-red-50',
        textColor: 'text-red-700',
        description: 'Unit Gawat Darurat untuk kasus emergency',
        unlockLevel: 1,
        requiredStaff: null,
        isDefault: true,
        betaLocked: false,
        queueType: 'emergency',
        gameplayHint: 'Triage → Stabilisasi → Rujuk/Rawat. Pasien bisa deteriorasi jika terlalu lama!',
    },

    // ─────────────────────────────────────────────
    // LEVEL 2+ — Locked at Beta (Coming Soon)
    // ─────────────────────────────────────────────
    {
        id: 'farmasi_lab',
        name: 'Farmasi & Lab',
        shortName: 'Farm/Lab',
        icon: '💊',
        color: 'from-amber-500 to-orange-500',
        bgColor: 'bg-amber-50',
        textColor: 'text-amber-700',
        description: 'Apotek, gudang obat, dan laboratorium klinik',
        unlockLevel: 1,
        requiredStaff: null,
        isDefault: true,
        betaLocked: false,
        queueType: 'farmasi_lab',
        gameplayHint: 'Kelola stok obat, dispensing resep, dan interpretasi hasil lab.',
        comingSoonFeatures: [
            '💊 Dispensing Dash — verifikasi resep dengan cepat & akurat (Bishi Bashi style!)',
            '🧪 Lab Quiz — interpretasi hasil lab, dari Hb sampai GDS',
            '📦 Supply Chain — order obat, kelola expired, hindari stockout',
            '⚡ Speed Bonus — dispensing cepat = XP bonus + patient satisfaction naik',
        ],
    },
    {
        id: 'poli_kia_kb',
        name: 'Poli KIA-KB',
        shortName: 'KIA',
        icon: '👶',
        color: 'from-purple-500 to-violet-600',
        bgColor: 'bg-purple-50',
        textColor: 'text-purple-700',
        description: 'Kesehatan Ibu-Anak, ANC, KB, Imunisasi Bayi, Tumbuh Kembang',
        unlockLevel: 1,
        requiredStaff: null,
        isDefault: true,
        betaLocked: false,
        queueType: 'queue',
        gameplayHint: 'Tracking kehamilan K1-K4, USG, deteksi risiko, imunisasi bayi, konseling KB.',
        comingSoonFeatures: [
            '🤰 9 Bulan Journey — pantau kehamilan dari K1 sampai persalinan',
            '📊 USG Minigame — ukur biometri janin, deteksi kelainan',
            '💉 Imunisasi Scheduler — jadwalkan & berikan imunisasi tepat waktu',
            '🎯 Risk Alert — random events (pre-eklampsia, anemia) → rujuk tepat waktu!',
            '👪 KB Counseling — pilihkan metode KB, hitung efektivitas',
            '📈 KMS Digital — plot tumbuh kembang anak di grafik WHO',
        ],
    },
    {
        id: 'poli_gigi',
        name: 'Poli Gigi',
        shortName: 'Gigi',
        icon: '🦷',
        color: 'from-sky-500 to-blue-500',
        bgColor: 'bg-sky-50',
        textColor: 'text-sky-700',
        description: 'Pelayanan kesehatan gigi dan mulut',
        unlockLevel: 1,
        requiredStaff: null,
        isDefault: true,
        betaLocked: false,
        queueType: 'queue',
        gameplayHint: 'Inspeksi gigi, diagnosis, tindakan (tambal, cabut, scaling), UKGS sekolah.',
        comingSoonFeatures: [
            '🦷 Dental Inspector — inspeksi visual gigi interaktif, tap untuk diagnosa',
            '🎮 Procedure Minigame — tambal ART, ekstraksi, scaling (timing-based!)',
            '🏫 UKGS Event — screening gigi anak sekolah, catat DMFT',
            '😁 Oral Health Score — populasi desa makin sehat giginya = bonus XP',
        ],
    },
];

// ═══════════════════════════════════════════════════════════════
// STAFF TYPES
// ═══════════════════════════════════════════════════════════════

export const STAFF_TYPES = {
    perawat: { name: 'Perawat', icon: '👩‍⚕️', baseSalary: 3500000 },
    bidan: { name: 'Bidan', icon: '🤱', baseSalary: 4000000 },
    apoteker: { name: 'Apoteker', icon: '💊', baseSalary: 5000000 },
    analis_lab: { name: 'Analis Lab', icon: '🔬', baseSalary: 4500000 },
    dokter_gigi: { name: 'Dokter Gigi', icon: '🦷', baseSalary: 8000000 },
};

// ═══════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════

/**
 * Check if a service is unlocked for the player.
 * betaLocked services are always locked regardless of level.
 */
export function isServiceUnlocked(service, playerLevel, hiredStaff = []) {
    if (service.betaLocked) return false;
    if (service.unlockLevel > playerLevel) return false;
    if (service.requiredStaff && !hiredStaff.includes(service.requiredStaff)) return false;
    return true;
}

/**
 * Get unlock requirement text for display.
 */
export function getUnlockRequirement(service, playerLevel, hiredStaff = []) {
    if (service.betaLocked) {
        return 'Coming Soon';
    }

    const requirements = [];

    if (service.unlockLevel > playerLevel) {
        requirements.push(`Level ${service.unlockLevel}`);
    }

    if (service.requiredStaff && !hiredStaff.includes(service.requiredStaff)) {
        const staffInfo = STAFF_TYPES[service.requiredStaff];
        requirements.push(`Hire ${staffInfo?.name || service.requiredStaff}`);
    }

    return requirements.join(' + ');
}
