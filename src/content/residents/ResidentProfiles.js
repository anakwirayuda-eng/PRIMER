/**
 * @reflection
 * [IDENTITY]: ResidentProfiles
 * [PURPOSE]: Personality, habits, beliefs & backstory for all 116 Desa Sukamaju residents.
 * [STATE]: Production
 * [ANCHOR]: RESIDENT_PROFILES
 * [DEPENDS_ON]: ./PersonalityTraits.js, ../../domains/village/village_families.js
 */

// Compact profile builder — keeps file size manageable
function p(personality, healthLiteracy, beliefs, habits, backstory, dialogStyle, resistance, influence) {
    return { personality, healthLiteracy, beliefs, habits, backstory, dialogStyle, resistanceToChange: resistance, communityInfluence: influence };
}
function h(handwashing, foodHygiene, smoking, openDefecation, traditionalMedicine, junkFood, waterTreatment) {
    return { handwashing, foodHygiene, smokingStatus: smoking, openDefecation: openDefecation || false, traditionalMedicine: traditionalMedicine || false, junkFood: junkFood || false, waterTreatment: waterTreatment || 'none' };
}

// ═══════════════════════════════════════════════════════════════
// RESIDENT PROFILES — Indexed by villager ID (v_XX_Y)
// ═══════════════════════════════════════════════════════════════

export const RESIDENT_PROFILES = {
    // ══ KK_01 — Santoso (RT 01, Petani, Middle) ══
    'v_01_1': p('cooperative', 'medium', [], h('sometimes', 'fair', 'non'), 'Pak Budi petani rajin yang percaya pentingnya kesehatan untuk produktivitas.', 'neutral', 0.3, 0.5),
    'v_01_2': p('cooperative', 'medium', ['pantangan_makanan'], h('always', 'good', 'non'), 'Bu Siti aktif di pengajian dan Posyandu, sering jadi penghubung informasi kesehatan.', 'eager', 0.2, 0.6),
    'v_01_3': p('skeptical', 'medium', [], h('sometimes', 'fair', 'non'), 'Andi remaja yang kritis, sering baca info kesehatan di internet.', 'challenging', 0.4, 0.2),
    'v_01_4': p('cooperative', 'medium', [], h('always', 'good', 'non'), 'Dewi pelajar SMP yang patuh dan rajin.', 'eager', 0.2, 0.1),

    // ══ KK_02 — Widodo (RT 01, Pedagang, Middle) ══
    'v_02_1': p('skeptical', 'medium', ['obat_warung_cukup'], h('sometimes', 'fair', 'non'), 'Pak Joko pedagang sibuk yang lebih suka obat warung daripada ke Puskesmas.', 'challenging', 0.5, 0.5),
    'v_02_2': p('cooperative', 'medium', [], h('always', 'good', 'non'), 'Bu Sri IRT yang sangat perhatian pada kesehatan keluarga.', 'eager', 0.2, 0.4),
    'v_02_3': p('fatalistic', 'low', [], h('rarely', 'fair', 'light'), 'Rizky buruh muda yang cuek soal kesehatan.', 'dismissive', 0.7, 0.1),
    'v_02_4': p('superstitious', 'low', ['jamu_heals_all', 'masuk_angin', 'kerokan_cure'], h('rarely', 'poor', 'non', false, true), 'Mbah Karjo tetua RT 01 yang sangat percaya pengobatan tradisional dan jamu.', 'vague', 0.9, 0.8),

    // ══ KK_03 — Kusuma (RT 01, Guru+Bidan, High) ══
    'v_03_1': p('cooperative', 'high', [], h('always', 'good', 'non'), 'Pak Agus guru yang paham pentingnya kesehatan preventif.', 'eager', 0.1, 0.6),
    'v_03_2': p('cooperative', 'high', [], h('always', 'good', 'non'), 'Bu Rina bidan desa sekaligus kader kesehatan, sangat teredukasi.', 'eager', 0.1, 0.9),
    'v_03_3': p('cooperative', 'medium', [], h('sometimes', 'good', 'non'), 'Fajar anak SD yang ceria dan sehat.', 'eager', 0.2, 0.1),
    'v_03_4': p('cooperative', 'low', [], h('sometimes', 'fair', 'non'), 'Bunga balita yang aktif dan sedang masa pertumbuhan.', 'neutral', 0.1, 0.0),

    // ══ KK_04 — Hidayat (RT 01, Sopir, Low-Middle) ══
    'v_04_1': p('fatalistic', 'low', ['obat_warung_cukup'], h('rarely', 'poor', 'heavy'), 'Pak Eko sopir yang jarang di rumah, merokok berat dan makan tidak teratur.', 'dismissive', 0.8, 0.2),
    'v_04_2': p('anxious', 'medium', ['pantangan_makanan'], h('sometimes', 'fair', 'non'), 'Bu Wulan sedang hamil dan sangat cemas soal kesehatannya dan bayinya.', 'verbose', 0.3, 0.2),
    'v_04_3': p('cooperative', 'low', [], h('sometimes', 'fair', 'non'), 'Naufal balita aktif yang sering bermain kotor.', 'neutral', 0.1, 0.0),

    // ══ KK_05 — Setiawan (RT 01, Kepala Dusun, High) ══
    'v_05_1': p('skeptical', 'high', [], h('always', 'good', 'heavy'), 'Pak Bambang Kepala Dusun yang disegani tapi perokok berat. Sulit berhenti merokok.', 'challenging', 0.6, 0.9),
    'v_05_2': p('anxious', 'medium', [], h('always', 'good', 'non'), 'Bu Yanti sering khawatir berlebihan soal kesehatan keluarga.', 'verbose', 0.3, 0.3),
    'v_05_3': p('cooperative', 'medium', [], h('sometimes', 'fair', 'non'), 'Gilang wiraswasta muda yang cukup peduli kesehatan.', 'neutral', 0.3, 0.3),
    'v_05_4': p('cooperative', 'high', [], h('always', 'good', 'non'), 'Putri mahasiswa kedokteran yang sangat paham kesehatan.', 'eager', 0.1, 0.4),

    // ══ KK_06 — Hartono (RT 02, Bengkel, Middle) ══
    'v_06_1': p('skeptical', 'low', ['masuk_angin', 'kerokan_cure'], h('rarely', 'fair', 'heavy'), 'Pak Hendra montir yang terpapar polusi dan asap setiap hari. Merokok sambil kerja.', 'challenging', 0.7, 0.3),
    'v_06_2': p('cooperative', 'medium', [], h('always', 'good', 'non'), 'Bu Ani pedagang yang rajin menjaga kebersihan dagangannya.', 'neutral', 0.3, 0.4),
    'v_06_3': p('skeptical', 'medium', [], h('sometimes', 'fair', 'non'), 'Dimas pelajar SMA yang kritis dan suka debat.', 'challenging', 0.5, 0.2),
    'v_06_4': p('cooperative', 'medium', [], h('always', 'good', 'non'), 'Laras pelajar SMP yang penurut.', 'eager', 0.2, 0.1),

    // ══ KK_07 — Wijaya (RT 02, Petani, Middle) ══
    'v_07_1': p('superstitious', 'low', ['jamu_heals_all', 'masuk_angin'], h('rarely', 'fair', 'non', false, true), 'Pak Iwan petani tradisional yang percaya jamu dan obat herbal.', 'vague', 0.7, 0.4),
    'v_07_2': p('cooperative', 'medium', [], h('sometimes', 'fair', 'non'), 'Bu Mega IRT yang cukup terbuka dengan pengobatan modern.', 'neutral', 0.4, 0.3),
    'v_07_3': p('fatalistic', 'low', [], h('rarely', 'poor', 'light'), 'Oscar buruh muda yang cuek dan jarang peduli kesehatan.', 'dismissive', 0.7, 0.1),
    'v_07_4': p('cooperative', 'medium', [], h('sometimes', 'good', 'non'), 'Citra pelajar SMA yang rajin.', 'eager', 0.2, 0.1),
    'v_07_5': p('superstitious', 'low', ['jamu_heals_all', 'santet', 'dukun_beranak'], h('rarely', 'poor', 'non', false, true), 'Mbah Siti nenek yang sangat percaya dukun dan takut RS.', 'vague', 0.95, 0.7),

    // ══ KK_08 — Saputra (RT 02, Tukang Bangunan, Low) ══
    'v_08_1': p('fatalistic', 'low', ['obat_warung_cukup', 'masuk_angin'], h('rarely', 'poor', 'heavy'), 'Pak Dedi pekerja bangunan yang merasa sakit itu biasa. Merokok dan makan seadanya.', 'dismissive', 0.85, 0.1),
    'v_08_2': p('anxious', 'low', ['pantangan_makanan', 'asi_tidak_cukup'], h('sometimes', 'fair', 'non'), 'Bu Fitri ibu muda yang cemas soal tumbuh kembang anak tapi minim pengetahuan.', 'verbose', 0.4, 0.2),
    'v_08_3': p('cooperative', 'low', [], h('sometimes', 'fair', 'non'), 'Pandu anak SD yang sering bermain di sungai.', 'neutral', 0.2, 0.1),
    'v_08_4': p('cooperative', 'low', [], h('rarely', 'poor', 'non'), 'Bella balita yang sering sakit karena lingkungan kurang bersih.', 'neutral', 0.1, 0.0),

    // ══ KK_09 — Rahardjo (RT 02, Kader, Middle) ══
    'v_09_1': p('cooperative', 'high', [], h('always', 'good', 'non', false, false, false, 'boil'), 'Pak Wahyu kader Posyandu yang sangat aktif dan teredukasi.', 'eager', 0.1, 0.8),
    'v_09_2': p('cooperative', 'high', [], h('always', 'good', 'non', false, false, false, 'boil'), 'Bu Ayu kader Jumantik yang teliti dan rajin melaporkan.', 'eager', 0.1, 0.7),
    'v_09_3': p('cooperative', 'low', [], h('sometimes', 'fair', 'non'), 'Zahra bayi yang mendapat perawatan terbaik dari orang tua kader.', 'neutral', 0.1, 0.0),

    // ══ KK_10 — Suryadi (RT 02, Pensiun PNS, Middle) ══
    'v_10_1': p('skeptical', 'medium', [], h('sometimes', 'fair', 'heavy'), 'Pak Sigit pensiunan PNS yang tidak mau berhenti merokok. Hipertensi tapi malas kontrol.', 'challenging', 0.7, 0.5),
    'v_10_2': p('cooperative', 'medium', [], h('always', 'good', 'non'), 'Bu Kartika IRT yang rajin mengingatkan suaminya minum obat.', 'eager', 0.2, 0.3),

    // ══ KK_11 — Permana (RT 03, Kepsek, High) ══
    'v_11_1': p('cooperative', 'high', [], h('always', 'good', 'non'), 'Pak Taufik Kepala Sekolah yang bisa jadi mitra penyuluhan kesehatan anak.', 'eager', 0.1, 0.8),
    'v_11_2': p('cooperative', 'high', [], h('always', 'good', 'non'), 'Bu Dian guru yang aktif mengajarkan PHBS ke murid-muridnya.', 'eager', 0.1, 0.6),
    'v_11_3': p('skeptical', 'medium', [], h('sometimes', 'fair', 'non'), 'Lutfi remaja yang suka bertanya dan menantang.', 'challenging', 0.4, 0.2),
    'v_11_4': p('cooperative', 'medium', [], h('always', 'good', 'non'), 'Nisa pelajar SMP yang rajin dan patuh.', 'eager', 0.2, 0.1),

    // ══ KK_12 — Gunawan (RT 03, Petani, Middle) ══
    'v_12_1': p('cooperative', 'medium', ['masuk_angin'], h('sometimes', 'fair', 'heavy'), 'Pak Arif petani yang cukup terbuka tapi masih percaya masuk angin.', 'neutral', 0.4, 0.3),
    'v_12_2': p('cooperative', 'medium', [], h('always', 'fair', 'non'), 'Bu Vera IRT yang peduli gizi keluarga.', 'neutral', 0.3, 0.3),
    'v_12_3': p('cooperative', 'medium', [], h('sometimes', 'fair', 'non'), 'Bayu anak SD yang aktif dan suka olahraga.', 'eager', 0.2, 0.1),
    'v_12_4': p('cooperative', 'low', [], h('sometimes', 'fair', 'non'), 'Elsa anak kelas 1 SD yang baru belajar cuci tangan.', 'eager', 0.2, 0.0),

    // ══ KK_13 — Halim (RT 03, Tokoh Agama, High) ══
    'v_13_1': p('superstitious', 'medium', ['vaksin_bahaya', 'dukun_beranak'], h('sometimes', 'fair', 'heavy', false, true), 'Pak Maman tokoh agama yang berpengaruh. Percaya beberapa penyakit ada unsur spiritual.', 'vague', 0.7, 0.9),
    'v_13_2': p('cooperative', 'medium', ['pantangan_makanan'], h('always', 'good', 'non'), 'Bu Hani IRT yang mengikuti apa kata suaminya.', 'neutral', 0.5, 0.3),
    'v_13_3': p('superstitious', 'low', ['vaksin_bahaya'], h('sometimes', 'fair', 'non', false, true), 'Qori santri yang mengikuti pandangan ayahnya.', 'vague', 0.6, 0.2),
    'v_13_4': p('cooperative', 'high', [], h('always', 'good', 'non'), 'Julia mahasiswa yang lebih terbuka dari keluarganya.', 'eager', 0.2, 0.2),
    'v_13_5': p('cooperative', 'medium', [], h('sometimes', 'fair', 'non'), 'Irfan anak SD yang polos dan penurut.', 'eager', 0.2, 0.1),

    // ══ KK_14 — Ismail (RT 03, Buruh Pabrik, Low) — SDOH: River/Open, Make-shift ══
    'v_14_1': p('fatalistic', 'low', ['obat_warung_cukup', 'masuk_angin'], h('rarely', 'poor', 'heavy', true), 'Pak Hakim buruh pabrik yang BAB di sungai dan merasa kesehatan bukan prioritas.', 'dismissive', 0.9, 0.1),
    'v_14_2': p('anxious', 'low', ['pantangan_makanan', 'dukun_beranak'], h('rarely', 'poor', 'non', true), 'Bu Indah hamil tua di kondisi sulit, cemas tapi minim akses kesehatan.', 'verbose', 0.5, 0.1),
    'v_14_3': p('cooperative', 'low', [], h('rarely', 'poor', 'non', true), 'Fira balita yang tinggal di lingkungan tidak sehat.', 'neutral', 0.1, 0.0),

    // ══ KK_15 — Jauhari (RT 03, Petani, Middle) ══
    'v_15_1': p('superstitious', 'low', ['jamu_heals_all', 'kerokan_cure', 'masuk_angin'], h('rarely', 'fair', 'heavy', false, true), 'Pak Rudi petani tua yang sangat tradisional. Percaya jamu lebih baik dari obat dokter.', 'vague', 0.8, 0.4),
    'v_15_2': p('superstitious', 'low', ['pantangan_makanan', 'jamu_heals_all'], h('sometimes', 'fair', 'non', false, true), 'Bu Ratna mengikuti tradisi suaminya soal pengobatan.', 'vague', 0.7, 0.3),
    'v_15_3': p('superstitious', 'low', ['santet', 'jamu_heals_all'], h('rarely', 'poor', 'non', false, true), 'Mbah Painem nenek tertua desa yang sangat percaya hal spiritual.', 'vague', 0.95, 0.6),

    // ══ KK_16 — Kurnia (RT 04, Pedagang Pasar, Middle) ══
    'v_16_1': p('skeptical', 'medium', ['obat_warung_cukup'], h('sometimes', 'fair', 'heavy'), 'Pak Guntur pedagang yang sibuk dan merokok. Merasa sehat-sehat saja.', 'challenging', 0.6, 0.4),
    'v_16_2': p('cooperative', 'medium', [], h('sometimes', 'fair', 'non'), 'Bu Sari pedagang yang cukup peduli kebersihan.', 'neutral', 0.3, 0.3),
    'v_16_3': p('fatalistic', 'low', [], h('rarely', 'poor', 'light'), 'Danang buruh muda yang acuh tak acuh.', 'dismissive', 0.7, 0.1),
    'v_16_4': p('cooperative', 'medium', [], h('sometimes', 'good', 'non'), 'Okta pelajar SMA yang cukup peduli kesehatan.', 'eager', 0.2, 0.1),

    // ══ KK_17 — Lubis (RT 04, Toko Kelontong, Middle) ══
    'v_17_1': p('cooperative', 'medium', [], h('sometimes', 'fair', 'heavy'), 'Pak Erwin pemilik toko yang ramah tapi perokok. Jual jajanan anak.', 'neutral', 0.4, 0.5),
    'v_17_2': p('anxious', 'medium', [], h('always', 'good', 'non'), 'Bu Lina ibu yang suka khawatir soal kesehatan anak.', 'verbose', 0.3, 0.2),
    'v_17_3': p('cooperative', 'medium', [], h('sometimes', 'fair', 'non'), 'Cahyo anak SD yang suka jajan sembarangan.', 'eager', 0.3, 0.1),
    'v_17_4': p('cooperative', 'low', [], h('sometimes', 'fair', 'non'), 'Della balita yang aktif bermain.', 'neutral', 0.1, 0.0),

    // ══ KK_18 — Mahendra (RT 04, Ojek Online, Low-Middle) ══
    'v_18_1': p('fatalistic', 'low', ['obat_warung_cukup'], h('rarely', 'poor', 'heavy', false, false, true), 'Pak Feri tukang ojek yang makan tidak teratur dan merokok. Sering makan mi instan.', 'dismissive', 0.8, 0.1),
    'v_18_2': p('anxious', 'low', ['asi_tidak_cukup', 'pantangan_makanan'], h('sometimes', 'fair', 'non'), 'Bu Tika ibu muda yang cemas soal bayi pertamanya tapi minim pengetahuan.', 'verbose', 0.4, 0.1),
    'v_18_3': p('cooperative', 'low', [], h('rarely', 'poor', 'non'), 'Mira bayi yang butuh perhatian nutrisi khusus.', 'neutral', 0.1, 0.0),

    // ══ KK_19 — Nasution (RT 04, Petani, Middle) ══
    'v_19_1': p('cooperative', 'low', ['masuk_angin'], h('sometimes', 'fair', 'non'), 'Pak Kukuh petani yang cukup terbuka walau pendidikan rendah.', 'neutral', 0.4, 0.4),
    'v_19_2': p('cooperative', 'medium', [], h('always', 'fair', 'non'), 'Bu Ulfa IRT yang rajin memasak menu sehat tradisional.', 'neutral', 0.3, 0.3),
    'v_19_3': p('fatalistic', 'low', [], h('rarely', 'fair', 'light'), 'Vino pemuda yang kurang motivasi soal kesehatan.', 'dismissive', 0.6, 0.1),
    'v_19_4': p('cooperative', 'high', [], h('always', 'good', 'non'), 'Cindy mahasiswa yang sering memberi edukasi ke keluarga.', 'eager', 0.1, 0.3),

    // ══ KK_20 — Nugroho (RT 04, Warung Makan, Middle) ══
    'v_20_1': p('skeptical', 'medium', [], h('sometimes', 'fair', 'heavy', false, false, false), 'Pak Wawan pemilik warung yang memasak banyak gorengan. Food hygiene perlu diperbaiki.', 'challenging', 0.5, 0.5),
    'v_20_2': p('cooperative', 'medium', [], h('always', 'fair', 'non'), 'Bu Gita membantu di warung dan cukup peduli kebersihan.', 'neutral', 0.3, 0.3),
    'v_20_3': p('cooperative', 'medium', [], h('sometimes', 'fair', 'non'), 'Yanto pelajar SMP yang suka membantu di warung.', 'neutral', 0.3, 0.1),
    'v_20_4': p('cooperative', 'medium', [], h('always', 'good', 'non'), 'Anita anak SD yang rajin cuci tangan.', 'eager', 0.2, 0.1),

    // ══ KK_21 — Pratama (RT 05, Ketua RT, Middle) ══
    'v_21_1': p('skeptical', 'medium', ['masuk_angin'], h('sometimes', 'fair', 'heavy'), 'Pak Zainal Ketua RT yang berpengaruh tapi skeptis soal program kesehatan baru.', 'challenging', 0.6, 0.9),
    'v_21_2': p('cooperative', 'medium', [], h('always', 'fair', 'non'), 'Bu Eka IRT yang mendukung suaminya dan aktif di kegiatan desa.', 'neutral', 0.3, 0.4),
    'v_21_3': p('cooperative', 'low', ['masuk_angin'], h('sometimes', 'fair', 'non'), 'Jaya petani muda yang bekerja keras.', 'neutral', 0.4, 0.2),
    'v_21_4': p('anxious', 'low', ['pantangan_makanan'], h('sometimes', 'fair', 'non'), 'Fani ibu muda yang cemas soal tumbuh kembang anaknya.', 'verbose', 0.3, 0.1),
    'v_21_5': p('cooperative', 'low', [], h('rarely', 'fair', 'non'), 'Hasan balita cucu Ketua RT.', 'neutral', 0.1, 0.0),

    // ══ KK_22 — Lestari (RT 05, Penjahit, Low, Female-Head) ══
    'v_22_1': p('cooperative', 'medium', [], h('sometimes', 'fair', 'non'), 'Bu Yuni janda pekerja keras yang membesarkan 2 anak sendiri. Ekonomi sulit tapi semangat.', 'neutral', 0.4, 0.3),
    'v_22_2': p('fatalistic', 'low', [], h('rarely', 'poor', 'non'), 'Wati buruh pabrik yang kelelahan dan tidak sempat memikirkan kesehatan.', 'dismissive', 0.7, 0.1),
    'v_22_3': p('skeptical', 'medium', [], h('sometimes', 'fair', 'non'), 'Udin remaja yang sedikit nakal tapi cerdas.', 'challenging', 0.5, 0.2),

    // ══ KK_23 — Putra (RT 05, Buruh Tani, Very Low) — SDOH: River, Make-shift ══
    'v_23_1': p('fatalistic', 'low', ['obat_warung_cukup', 'masuk_angin'], h('never', 'poor', 'heavy', true), 'Pak Hasan buruh tani termiskin di desa. BAB di sungai, minum air sungai, merokok berat.', 'dismissive', 0.95, 0.05),
    'v_23_2': p('superstitious', 'low', ['jamu_heals_all', 'dukun_beranak', 'santet'], h('never', 'poor', 'non', true, true), 'Bu Mira sangat percaya dukun. Rumah bambu tanpa jamban.', 'vague', 0.9, 0.2),
    'v_23_3': p('fatalistic', 'low', [], h('never', 'poor', 'non', true), 'Rudi anak SD yang jarang mandi dan sering sakit.', 'dismissive', 0.5, 0.1),
    'v_23_4': p('cooperative', 'low', [], h('never', 'poor', 'non', true), 'Laila anak kecil yang malnutrisi ringan.', 'neutral', 0.1, 0.0),

    // ══ KK_24 — Wibowo (RT 05, Pensiun, Low) ══
    'v_24_1': p('superstitious', 'low', ['jamu_heals_all', 'santet', 'avoid_hospital'], h('rarely', 'poor', 'heavy', false, true), 'Pak Ahmad lansia yang takut RS dan menolak dirujuk. Percaya penyakit berat adalah kiriman.', 'vague', 0.9, 0.5),
    'v_24_2': p('superstitious', 'low', ['jamu_heals_all', 'dukun_beranak', 'pantangan_makanan'], h('rarely', 'poor', 'non', false, true), 'Mbah Sarni selalu meracik jamu untuk suami dan tetangga.', 'vague', 0.85, 0.4),

    // ══ KK_25 — Wijaya/Kepala Desa (RT 05, Middle) ══
    'v_25_1': p('cooperative', 'high', [], h('always', 'good', 'non'), 'Bpk Wijaya Kepala Desa yang menjadi panutan kesehatan. Support program Puskesmas.', 'eager', 0.1, 1.0),
    'v_25_2': p('cooperative', 'high', [], h('always', 'good', 'non'), 'Bu Ratna Ketua PKK yang menggerakkan program gizi dan PHBS.', 'eager', 0.1, 0.9),
    'v_25_3': p('cooperative', 'high', [], h('always', 'good', 'non'), 'Putri pelajar SMA yang sering membantu kegiatan PKK ibunya.', 'eager', 0.1, 0.3),

    // ══ KK_26 — Suryo (RT 06, Pensiunan Guru, Middle) ══
    'v_26_1': p('cooperative', 'high', [], h('always', 'good', 'non'), 'Pak Bambang pensiunan guru yang rajin kontrol kesehatan.', 'eager', 0.2, 0.5),
    'v_26_2': p('cooperative', 'high', [], h('always', 'good', 'non'), 'Bu Endang pensiunan yang aktif dan sehat.', 'eager', 0.2, 0.4),

    // ══ KK_27 — Pratama (RT 06, Buruh, Middle) ══
    'v_27_1': p('skeptical', 'medium', ['vaksin_bahaya'], h('sometimes', 'fair', 'heavy'), 'Pak Arie ragu soal vaksinasi untuk bayinya. Terpengaruh hoax di medsos.', 'challenging', 0.6, 0.2),
    'v_27_2': p('anxious', 'medium', ['asi_tidak_cukup', 'vaksin_bahaya'], h('sometimes', 'fair', 'non'), 'Bu Siska ibu baru yang bingung antara info internet dan saran dokter.', 'verbose', 0.5, 0.2),
    'v_27_3': p('cooperative', 'low', [], h('sometimes', 'fair', 'non'), 'Deni bayi yang butuh imunisasi lengkap.', 'neutral', 0.1, 0.0),

    // ══ KK_28 — Kusumo (RT 06, Tukang, Low) ══
    'v_28_1': p('fatalistic', 'low', ['masuk_angin', 'obat_warung_cukup'], h('rarely', 'poor', 'heavy'), 'Pak Indra tukang yang bekerja keras tapi mengabaikan kesehatan.', 'dismissive', 0.8, 0.2),
    'v_28_2': p('cooperative', 'low', ['pantangan_makanan'], h('sometimes', 'fair', 'non'), 'Bu Maya IRT yang berusaha menjaga anaknya walau ekonomi sulit.', 'neutral', 0.4, 0.2),
    'v_28_3': p('cooperative', 'low', [], h('sometimes', 'fair', 'non'), 'Budi anak SD yang cukup sehat.', 'neutral', 0.3, 0.1),
    'v_28_4': p('cooperative', 'low', [], h('sometimes', 'fair', 'non'), 'Ani anak SD yang rajin.', 'eager', 0.2, 0.1),
    'v_28_5': p('cooperative', 'low', [], h('rarely', 'poor', 'non'), 'Eko balita yang perlu perhatian gizi.', 'neutral', 0.1, 0.0),
    'v_28_6': p('superstitious', 'low', ['santet', 'jamu_heals_all', 'avoid_hospital'], h('rarely', 'poor', 'heavy', false, true), 'Mbah Slamet kakek yang sangat tradisional dan menolak obat modern.', 'vague', 0.9, 0.5),

    // ══ KK_29 — Hadi (RT 02, Buruh Tani, Low-Middle, Duda) ══
    'v_29_1': p('fatalistic', 'low', ['obat_warung_cukup', 'masuk_angin'], h('never', 'poor', 'heavy'), 'Pak Slamet duda perokok berat yang hidup sendiri. Jarang makan teratur, tidak pernah kontrol.', 'dismissive', 0.95, 0.05),

    // ══ KK_30 — Wahyudi (RT 01, Tidak Bekerja/Stroke, Middle) ══
    'v_30_1': p('cooperative', 'medium', [], h('sometimes', 'fair', 'non'), 'Pak Dwi pasca-stroke yang sedang rehabilitasi. Kooperatif karena ingin pulih.', 'eager', 0.2, 0.3),
    'v_30_2': p('cooperative', 'medium', [], h('always', 'good', 'non'), 'Bu Marni pedagang yang sangat menjaga pola makan suaminya pasca stroke.', 'eager', 0.1, 0.4),
};

// ═══════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════

/**
 * Get profile for a specific villager
 * @param {string} villagerId - e.g. 'v_01_1'
 * @returns {object|null}
 */
export function getResidentProfile(villagerId) {
    return RESIDENT_PROFILES[villagerId] || null;
}

/**
 * Get all residents with a specific personality
 * @param {string} personalityType - e.g. 'superstitious'
 * @returns {string[]} Array of villager IDs
 */
export function getResidentsByPersonality(personalityType) {
    return Object.entries(RESIDENT_PROFILES)
        .filter(([, p]) => p.personality === personalityType)
        .map(([id]) => id);
}

/**
 * Get all residents who hold a specific belief
 * @param {string} beliefId - e.g. 'jamu_heals_all'
 * @returns {string[]} Array of villager IDs
 */
export function getResidentsByBelief(beliefId) {
    return Object.entries(RESIDENT_PROFILES)
        .filter(([, p]) => p.beliefs.includes(beliefId))
        .map(([id]) => id);
}

/**
 * Get all residents who practice open defecation
 * @returns {string[]} Array of villager IDs
 */
export function getOpenDefecationResidents() {
    return Object.entries(RESIDENT_PROFILES)
        .filter(([, p]) => p.habits.openDefecation)
        .map(([id]) => id);
}

/**
 * Get personality distribution summary for reporting
 * @returns {object} Counts per personality type
 */
export function getPersonalityDistribution() {
    const dist = {};
    for (const profile of Object.values(RESIDENT_PROFILES)) {
        dist[profile.personality] = (dist[profile.personality] || 0) + 1;
    }
    return dist;
}
