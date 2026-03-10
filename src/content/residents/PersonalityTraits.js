/**
 * @reflection
 * [IDENTITY]: PersonalityTraits
 * [PURPOSE]: Defines 5 villager personality archetypes and their gameplay modifiers for behavioral interventions.
 * [STATE]: Production
 * [ANCHOR]: PERSONALITY_ARCHETYPES
 * [DEPENDS_ON]: None
 */

// ═══════════════════════════════════════════════════════════════
// PERSONALITY ARCHETYPES
// ═══════════════════════════════════════════════════════════════

export const PERSONALITY_ARCHETYPES = {
    cooperative: {
        id: 'cooperative',
        label: 'Kooperatif',
        description: 'Percaya pada pengobatan modern, mengikuti saran dokter dengan baik.',
        dialogStyle: 'eager',
        icon: '🤝',
        modifiers: {
            educationEffectiveness: 1.5,   // Penyuluhan 50% lebih efektif
            treatmentCompliance: 0.9,       // 90% patuh minum obat
            resistanceToChange: 0.2,        // Mudah berubah
            communityInfluence: 0.4,        // Cukup berpengaruh
            clinicVisitWillingness: 0.9,     // Mau ke Puskesmas
            referralAcceptance: 0.95,        // Mau dirujuk
        },
        anamnesisTraits: {
            detailLevel: 'high',             // Jawab pertanyaan dengan detail
            honesty: 'high',                 // Jujur soal gejala
            suggestionSusceptibility: 'low', // Tidak mudah mengarang gejala
        },
        typicalResponses: {
            greeting: 'Selamat pagi Dok, terima kasih sudah menerima saya.',
            symptomReport: 'Jadi begini Dok, sudah 3 hari saya batuk, berdahak warna kuning...',
            resistance: null, // Tidak pernah menolak
        }
    },

    skeptical: {
        id: 'skeptical',
        label: 'Skeptis',
        description: 'Kritis dan minta bukti sebelum mau berubah. Banyak bertanya.',
        dialogStyle: 'challenging',
        icon: '🤨',
        modifiers: {
            educationEffectiveness: 0.7,    // Butuh pendekatan berulang
            treatmentCompliance: 0.6,        // Kadang berhenti obat sendiri
            resistanceToChange: 0.6,         // Cukup resistant
            communityInfluence: 0.7,         // Berpengaruh karena dihormati
            clinicVisitWillingness: 0.5,      // Datang kalau sudah parah
            referralAcceptance: 0.6,          // Mau kalau sudah dijelaskan
        },
        anamnesisTraits: {
            detailLevel: 'medium',
            honesty: 'high',
            suggestionSusceptibility: 'low',
        },
        typicalResponses: {
            greeting: 'Ya Dok, saya mau periksa. Tapi sebelumnya saya mau tanya dulu.',
            symptomReport: 'Yang saya rasakan cuma batuk biasa sih Dok, tidak parah.',
            resistance: 'Obat ini aman kan Dok? Saya dengar dari YouTube katanya ada efek samping...',
        }
    },

    superstitious: {
        id: 'superstitious',
        label: 'Percaya Mitos',
        description: 'Percaya pada penyebab spiritual/jamu tradisional. Atribusi penyakit ke hal-hal mistis.',
        dialogStyle: 'vague',
        icon: '🔮',
        modifiers: {
            educationEffectiveness: 0.4,    // Sangat sulit diedukasi langsung
            treatmentCompliance: 0.4,        // Sering campur obat + jamu
            resistanceToChange: 0.8,         // Sangat resistant
            communityInfluence: 0.6,         // Cukup berpengaruh di kalangan sesama
            clinicVisitWillingness: 0.3,      // Lebih pilih dukun
            referralAcceptance: 0.3,          // Takut RS = tempat meninggal
        },
        anamnesisTraits: {
            detailLevel: 'low',
            honesty: 'medium',               // Kadang sembunyikan pakai jamu
            suggestionSusceptibility: 'high', // Mudah setuju apa saja
        },
        typicalResponses: {
            greeting: 'Ini disuruh anak saya ke sini Dok, sebenarnya saya sudah minum jamu.',
            symptomReport: 'Masuk angin Dok, kena angin duduk waktu lewat kuburan.',
            resistance: 'Kalau obat dari Puskesmas nanti bentrok sama jamu saya gimana Dok?',
        }
    },

    fatalistic: {
        id: 'fatalistic',
        label: 'Pasrah',
        description: 'Mentalitas "sudah nasib". Motivasi rendah untuk berubah. Jawaban pendek.',
        dialogStyle: 'dismissive',
        icon: '😔',
        modifiers: {
            educationEffectiveness: 0.3,    // Hampir tidak efektif
            treatmentCompliance: 0.3,        // Jarang patuh
            resistanceToChange: 0.9,         // Sangat resistant
            communityInfluence: 0.1,         // Tidak berpengaruh
            clinicVisitWillingness: 0.2,      // Hampir tidak pernah ke Puskesmas
            referralAcceptance: 0.2,          // "Kalau sudah waktunya ya sudah"
        },
        anamnesisTraits: {
            detailLevel: 'minimal',
            honesty: 'low',                   // Meremehkan gejala
            suggestionSusceptibility: 'medium',
        },
        typicalResponses: {
            greeting: 'Iya Dok.',
            symptomReport: 'Sakit biasa aja Dok, paling juga sudah takdir.',
            resistance: 'Mau dikasih obat apa juga sama aja Dok, sudah tua.',
        }
    },

    anxious: {
        id: 'anxious',
        label: 'Cemas',
        description: 'Khawatir berlebihan, sering ke Puskesmas, memperbesar gejala.',
        dialogStyle: 'verbose',
        icon: '😰',
        modifiers: {
            educationEffectiveness: 1.0,    // Efektif kalau bisa menenangkan
            treatmentCompliance: 1.0,        // Sangat patuh, bahkan berlebihan
            resistanceToChange: 0.3,         // Mudah berubah
            communityInfluence: 0.2,         // Rendah, dianggap "lebay"
            clinicVisitWillingness: 1.0,      // Terlalu sering ke Puskesmas
            referralAcceptance: 0.8,          // Mau, tapi panik
        },
        anamnesisTraits: {
            detailLevel: 'excessive',
            honesty: 'medium',               // Jujur tapi melebih-lebihkan
            suggestionSusceptibility: 'high', // Mudah takut "jangan-jangan saya kena X"
        },
        typicalResponses: {
            greeting: 'Dok! Saya harus periksa sekarang, saya takut ini serius!',
            symptomReport: 'Batuk sudah 2 hari Dok, jangan-jangan saya kena TBC ya? Atau COVID? Saya googling katanya bisa kanker paru...',
            resistance: 'Dok yakin ini bukan sesuatu yang berbahaya? Saya mau tes laboratorium semuanya!',
        }
    }
};

// ═══════════════════════════════════════════════════════════════
// HEALTH BELIEFS — Cultural/traditional beliefs that affect behavior
// ═══════════════════════════════════════════════════════════════

export const HEALTH_BELIEFS = {
    jamu_heals_all: {
        id: 'jamu_heals_all',
        label: 'Jamu bisa menyembuhkan segala penyakit',
        category: 'traditional_medicine',
        effect: { treatmentCompliance: -0.3, clinicVisitWillingness: -0.2 },
        counterEducation: 'diet_supplement_info'
    },
    avoid_hospital: {
        id: 'avoid_hospital',
        label: 'Rumah sakit tempat orang meninggal',
        category: 'fear',
        effect: { referralAcceptance: -0.4 },
        counterEducation: 'red_flag_monitor'
    },
    masuk_angin: {
        id: 'masuk_angin',
        label: 'Semua penyakit karena masuk angin',
        category: 'traditional_diagnosis',
        effect: { detailLevel: -1 },
        counterEducation: 'finish_antibiotics'
    },
    kerokan_cure: {
        id: 'kerokan_cure',
        label: 'Kerokan bisa menyembuhkan masuk angin',
        category: 'traditional_treatment',
        effect: { clinicVisitWillingness: -0.1 },
        counterEducation: 'warm_compress'
    },
    pantangan_makanan: {
        id: 'pantangan_makanan',
        label: 'Ibu hamil/menyusui banyak pantangan makanan',
        category: 'nutrition_myth',
        effect: { treatmentCompliance: -0.2 },
        counterEducation: 'pregnancy_nutrition'
    },
    dukun_beranak: {
        id: 'dukun_beranak',
        label: 'Dukun beranak lebih aman daripada bidan',
        category: 'traditional_birth',
        effect: { referralAcceptance: -0.5, clinicVisitWillingness: -0.3 },
        counterEducation: 'anc_routine'
    },
    panas_dalam: {
        id: 'panas_dalam',
        label: 'Panas dalam karena makan gorengan',
        category: 'traditional_diagnosis',
        effect: {},
        counterEducation: 'food_hygiene'
    },
    vaksin_bahaya: {
        id: 'vaksin_bahaya',
        label: 'Vaksin mengandung bahan berbahaya',
        category: 'anti_vaccine',
        effect: { treatmentCompliance: -0.4 },
        counterEducation: 'complete_vaccine'
    },
    santet: {
        id: 'santet',
        label: 'Penyakit berat karena santet/guna-guna',
        category: 'supernatural',
        effect: { clinicVisitWillingness: -0.5, referralAcceptance: -0.5 },
        counterEducation: 'red_flag_monitor'
    },
    obat_warung_cukup: {
        id: 'obat_warung_cukup',
        label: 'Obat warung cukup untuk semua keluhan',
        category: 'self_medication',
        effect: { clinicVisitWillingness: -0.3, treatmentCompliance: -0.2 },
        counterEducation: 'routine_checkup'
    },
    asi_tidak_cukup: {
        id: 'asi_tidak_cukup',
        label: 'ASI tidak cukup, harus tambah susu formula',
        category: 'nutrition_myth',
        effect: {},
        counterEducation: 'continue_breastfeeding'
    },
    mandi_malam_bahaya: {
        id: 'mandi_malam_bahaya',
        label: 'Mandi malam menyebabkan rematik',
        category: 'traditional_diagnosis',
        effect: {},
        counterEducation: 'proper_hygiene'
    }
};

// ═══════════════════════════════════════════════════════════════
// HEALTH HABITS — Measurable daily behaviors
// ═══════════════════════════════════════════════════════════════

export const HABIT_LEVELS = {
    handwashing: ['never', 'rarely', 'sometimes', 'always'],
    foodHygiene: ['poor', 'fair', 'good'],
    smokingStatus: ['non', 'light', 'heavy'],
    openDefecation: [false, true],  // BAB sembarangan
    traditionalMedicine: [false, true],
    junkFood: [false, true],
    waterTreatment: ['none', 'boil', 'filter'],
    mosquitoNet: [false, true],
    garbageDisposal: ['open_burn', 'dump_river', 'collected', 'compost'],
};

// ═══════════════════════════════════════════════════════════════
// HELPER — Get effective modifier after beliefs are applied
// ═══════════════════════════════════════════════════════════════

/**
 * Calculate the effective personality modifiers for a villager
 * after applying their cultural belief effects.
 * @param {object} archetype - From PERSONALITY_ARCHETYPES
 * @param {string[]} beliefIds - Array of belief IDs the villager holds
 * @returns {object} Adjusted modifier values (clamped 0-1)
 */
export function getEffectiveModifiers(archetype, beliefIds = []) {
    const base = { ...archetype.modifiers };

    for (const beliefId of beliefIds) {
        const belief = HEALTH_BELIEFS[beliefId];
        if (!belief?.effect) continue;
        for (const [key, delta] of Object.entries(belief.effect)) {
            if (key in base) {
                base[key] = Math.max(0, Math.min(1, base[key] + delta));
            }
        }
    }

    return base;
}

/**
 * Determine which intervention approach will work best given personality.
 * @param {string} personalityId 
 * @returns {string[]} Recommended BCW intervention functions
 */
export function getRecommendedInterventions(personalityId) {
    const strategies = {
        cooperative: ['education', 'training'],
        skeptical: ['persuasion', 'modelling', 'education'],
        superstitious: ['modelling', 'enablement', 'environmental_restructuring'],
        fatalistic: ['enablement', 'incentivisation', 'coercion'],
        anxious: ['education', 'persuasion', 'training'],
    };
    return strategies[personalityId] || ['education'];
}
