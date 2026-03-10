/**
 * @reflection
 * [IDENTITY]: EducationOptions
 * [PURPOSE]: EducationOptions.js — Comprehensive EBM-based Education constants.
 * [STATE]: Experimental
 * [ANCHOR]: EDUCATION_OPTIONS
 * [DEPENDS_ON]: None
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-12
 */

/**
 * EducationOptions.js — Comprehensive EBM-based Education constants.
 */

export const EDUCATION_OPTIONS = [
    // --- DIET & NUTRISI ---
    { id: 'diet_low_salt', label: 'Diet Rendah Garam (< 1 sdt/hari)', category: 'diet', icon: 'salt' },
    { id: 'diet_low_sugar', label: 'Diet Rendah Gula/Karbohidrat', category: 'diet', icon: 'sugar' },
    { id: 'diet_low_fat', label: 'Diet Rendah Lemak/Gorengan', category: 'diet', icon: 'fat' },
    { id: 'diet_low_purine', label: 'Diet Rendah Purin (Jeroan/Kacang)', category: 'diet', icon: 'meat' },
    { id: 'diet_low_calorie', label: 'Diet Rendah Kalori', category: 'diet', icon: 'scale' },
    { id: 'diet_soft', label: 'Diet Lunak/Mudah Cerna', category: 'diet', icon: 'bowl' },
    { id: 'diet_reflux', label: 'Hindari Pedas/Asam/Kopi/Soda', category: 'diet', icon: 'no-chili' },
    { id: 'diet_meal_freq', label: 'Makan Porsi Kecil tapi Sering', category: 'diet', icon: 'clock' },
    { id: 'diet_high_fiber', label: 'Tingkatkan Serat (Sayur/Buah)', category: 'diet', icon: 'leaf' },
    { id: 'diet_iron_rich', label: 'Makan Tinggi Zat Besi (Daging, Sayur Hijau)', category: 'diet', icon: 'meat' },
    { id: 'diet_balanced', label: 'Pola Makan Seimbang (Gizi Seimbang)', category: 'diet', icon: 'plate' },
    { id: 'fluid_intake', label: 'Cukupi Cairan (8-10 gelas/hari)', category: 'diet', icon: 'water' },
    { id: 'food_hygiene', label: 'Jaga Kebersihan Makanan & Minuman', category: 'diet', icon: 'food' },

    // --- GAYA HIDUP & AKTIVITAS ---
    { id: 'activity_aerobic', label: 'Olahraga Aerobik 30/menit (Jalan/Jogging)', category: 'lifestyle', icon: 'run' },
    { id: 'weight_loss', label: 'Turunkan Berat Badan Ideal', category: 'lifestyle', icon: 'scale' },
    { id: 'stop_smoking', label: 'Berhenti Merokok', category: 'lifestyle', icon: 'no-smoke' },
    { id: 'stress_mgmt', label: 'Kelola Stres (Relaksasi/Hobi)', category: 'lifestyle', icon: 'brain' },
    { id: 'avoid_stress', label: 'Hindari Stres Berlebihan', category: 'lifestyle', icon: 'brain' },
    { id: 'avoid_caffeine', label: 'Kurangi Kafein (Kopi/Teh/Soda)', category: 'lifestyle', icon: 'coffee' },
    { id: 'sleep_hygiene', label: 'Istirahat Cukup & Teratur (7-8 jam)', category: 'lifestyle', icon: 'bed' },
    { id: 'bed_rest', label: 'Istirahat Total di Tempat Tidur', category: 'lifestyle', icon: 'bed' },
    { id: 'ergonomics', label: 'Perbaiki Posisi Duduk/Angkat Beban', category: 'lifestyle', icon: 'chair' },
    { id: 'screen_time', label: 'Batasi Screen Time/Istirahatkan Mata', category: 'lifestyle', icon: 'eye' },
    { id: 'voice_rest', label: 'Istirahatkan Suara (Jangan Banyak Bicara)', category: 'lifestyle', icon: 'quiet' },
    { id: 'dark_room_rest', label: 'Istirahat di Ruangan Gelap & Tenang', category: 'lifestyle', icon: 'moon' },
    { id: 'avoid_sudden_movement', label: 'Hindari Perubahan Posisi Kepala Mendadak', category: 'lifestyle', icon: 'head' },

    // --- PERAWATAN DI RUMAH (SELF-CARE) ---
    { id: 'warm_compress', label: 'Kompres Hangat', category: 'self_care', icon: 'thermometer' },
    { id: 'cold_compress', label: 'Kompres Dingin', category: 'self_care', icon: 'ice' },
    { id: 'gargle_salt', label: 'Kumur Air Garam Hangat', category: 'self_care', icon: 'gargle' },
    { id: 'steam_inhalation', label: 'Uap Air Panas (Inhalasi Sederhana)', category: 'self_care', icon: 'steam' },
    { id: 'wound_care', label: 'Jaga Luka Tetap Bersih & Kering', category: 'self_care', icon: 'plaster' },
    { id: 'elevate_head', label: 'Tidur Bantal Tinggi (Anti-Refluks)', category: 'self_care', icon: 'pillow' },
    { id: 'avoid_scratching', label: 'Jangan Menggaruk Area Gatal', category: 'self_care', icon: 'hand' },
    { id: 'fever_reduction', label: 'Kompres Hangat & Minum Obat Demam', category: 'self_care', icon: 'thermometer' },
    { id: 'seizure_first_aid', label: 'P3K Kejang (Miringkan, Jangan Masukkan Benda)', category: 'self_care', icon: 'first-aid' },
    { id: 'pinch_nose_technique', label: 'Cubit Pangkal Hidung 10 Menit (Mimisan)', category: 'self_care', icon: 'nose' },
    { id: 'facial_massage', label: 'Pijat Wajah Lembut (Latihan Otot)', category: 'self_care', icon: 'face' },
    { id: 'home_maneuver', label: 'Latihan Manuver Mandiri (Brandt-Daroff)', category: 'self_care', icon: 'head' },
    { id: 'breast_emptying', label: 'Kosongkan Payudara Secara Teratur', category: 'self_care', icon: 'baby' },
    { id: 'continue_breastfeeding', label: 'Lanjutkan Menyusui', category: 'self_care', icon: 'baby' },

    // --- PENCEGAHAN & LINGKUNGAN ---
    { id: 'hand_hygiene', label: 'Cuci Tangan Pakai Sabun', category: 'prevention', icon: 'soap' },
    { id: 'wear_mask', label: 'Pakai Masker saat Sakit/Keluar', category: 'prevention', icon: 'mask' },
    { id: 'cough_etiquette', label: 'Etika Batuk/Bersin', category: 'prevention', icon: 'sneeze' },
    { id: 'allergen_avoid', label: 'Hindari Pencetus Alergi/Debu', category: 'prevention', icon: 'dust' },
    { id: 'mosquito_control', label: '3M Plus (Cegah Nyamuk)', category: 'prevention', icon: 'mosquito' },
    { id: 'contact_lens_care', label: 'Lepas Lensa Kontak & Ganti Wadah', category: 'prevention', icon: 'lens' },
    { id: 'wiping_technique', label: 'Basuh dari Depan ke Belakang (Wanita)', category: 'prevention', icon: 'toilet' },
    { id: 'dont_hold_urine', label: 'Jangan Menahan Buang Air Kecil', category: 'prevention', icon: 'toilet-ban' },
    { id: 'isolation_home', label: 'Isolasi di Rumah (Hindari Kontak)', category: 'prevention', icon: 'home' },
    { id: 'dont_share_towels', label: 'Jangan Berbagi Handuk/Pakaian', category: 'prevention', icon: 'towel' },
    { id: 'dont_touch_wound', label: 'Jangan Sentuh Luka Tanpa Cuci Tangan', category: 'prevention', icon: 'hand' },
    { id: 'keep_skin_dry', label: 'Jaga Kulit Tetap Kering', category: 'prevention', icon: 'skin' },
    { id: 'wear_loose_clothes', label: 'Pakai Pakaian Longgar & Nyaman', category: 'prevention', icon: 'shirt' },
    { id: 'stay_cool', label: 'Hindari Kepanasan/Tetap Sejuk', category: 'prevention', icon: 'fan' },
    { id: 'eye_protection', label: 'Lindungi Mata dari Angin/Debu', category: 'prevention', icon: 'eye' },
    { id: 'dont_strain', label: 'Jangan Mengejan/Angkat Berat', category: 'prevention', icon: 'warning' },
    { id: 'dont_scratch_ear', label: 'Jangan Garuk/Korek Telinga', category: 'prevention', icon: 'ear' },
    { id: 'dont_use_cotton_buds', label: 'Jangan Pakai Cotton Bud ke Dalam Telinga', category: 'prevention', icon: 'ear' },
    { id: 'ear_hygiene', label: 'Jaga Kebersihan Telinga Luar', category: 'prevention', icon: 'ear' },
    { id: 'scalp_hygiene', label: 'Jaga Kebersihan Kulit Kepala', category: 'prevention', icon: 'hair' },

    // --- KEPATUHAN & WASPADA ---
    { id: 'med_compliance', label: 'Minum Obat Teratur Sesuai Anjuran', category: 'compliance', icon: 'pill' },
    { id: 'routine_control', label: 'Kontrol Rutin Sesuai Jadwal', category: 'compliance', icon: 'calendar' },
    { id: 'red_flag_monitor', label: 'Segera ke RS jika Sesak/Penurunan Kesadaran', category: 'compliance', icon: 'siren' },
    { id: 'family_screening', label: 'Skrining Kesehatan Keluarga Serumah', category: 'compliance', icon: 'family' },

    // ═══════════════════════════════════════════════════════════════
    // KEPATUHAN OBAT SPESIFIK
    // ═══════════════════════════════════════════════════════════════
    { id: 'mdt_compliance', label: 'Minum MDT Kusta Teratur (6-12 bulan)', category: 'compliance', icon: 'pill' },
    { id: 'oat_compliance', label: 'Minum OAT TBC Teratur (6-9 bulan)', category: 'compliance', icon: 'pill' },
    { id: 'arv_compliance', label: 'Minum ARV Seumur Hidup Tanpa Putus', category: 'compliance', icon: 'pill' },
    { id: 'popm_compliance', label: 'Minum Obat Massal Pencegahan Filariasis', category: 'compliance', icon: 'pill' },
    { id: 'complete_antibiotic', label: 'Habiskan Antibiotik Sesuai Resep', category: 'compliance', icon: 'pill' },
    { id: 'finish_antibiotic', label: 'Habiskan Antibiotik Jangan Dihentikan Sendiri', category: 'compliance', icon: 'pill' },
    { id: 'finish_medication', label: 'Habiskan Obat Sesuai Resep', category: 'compliance', icon: 'pill' },
    { id: 'finish_medication_long', label: 'Minum Obat Jangka Panjang Sesuai Anjuran', category: 'compliance', icon: 'pill' },
    { id: 'antifungal_maintenance', label: 'Lanjutkan Obat Jamur Walau Sudah Membaik', category: 'compliance', icon: 'pill' },
    { id: 'eat_before_medication', label: 'Minum Obat Sesudah Makan', category: 'compliance', icon: 'pill' },

    // ═══════════════════════════════════════════════════════════════
    // KONTROL & FOLLOW-UP
    // ═══════════════════════════════════════════════════════════════
    { id: 'follow_up_check', label: 'Kontrol Ulang Sesuai Jadwal', category: 'compliance', icon: 'calendar' },
    { id: 'followup', label: 'Kontrol Ulang ke Puskesmas', category: 'compliance', icon: 'calendar' },
    { id: 'followup_test', label: 'Periksa Lab Ulang Setelah Pengobatan', category: 'compliance', icon: 'lab' },
    { id: 'regular_followup', label: 'Kontrol Rutin Berkala', category: 'compliance', icon: 'calendar' },
    { id: 'regular_check_yearly', label: 'Periksa Kesehatan Tahunan', category: 'compliance', icon: 'calendar' },
    { id: 'regular_eye_check', label: 'Periksa Mata Berkala ke Dokter', category: 'compliance', icon: 'eye' },
    { id: 'routine_uric_acid_check', label: 'Periksa Asam Urat Berkala', category: 'compliance', icon: 'lab' },
    { id: 'observation_6hrs', label: 'Observasi Minimal 6 Jam di Faskes', category: 'compliance', icon: 'clock' },

    // ═══════════════════════════════════════════════════════════════
    // SKRINING & NOTIFIKASI KONTAK
    // ═══════════════════════════════════════════════════════════════
    { id: 'contact_screening', label: 'Skrining Semua Kontak Erat', category: 'compliance', icon: 'family' },
    { id: 'contact_notification', label: 'Beritahu Kontak Dekat untuk Pemeriksaan', category: 'compliance', icon: 'family' },
    { id: 'contact_prophylaxis', label: 'Profilaksis untuk Kontak Erat', category: 'compliance', icon: 'family' },
    { id: 'treat_contacts', label: 'Obati Seluruh Anggota Keluarga Bersamaan', category: 'compliance', icon: 'family' },
    { id: 'partner_notification', label: 'Beritahu Pasangan untuk Periksa dan Berobat', category: 'compliance', icon: 'heart' },
    { id: 'partner_treatment', label: 'Pasangan Juga Harus Diobati', category: 'compliance', icon: 'heart' },

    // ═══════════════════════════════════════════════════════════════
    // KEWASPADAAN TANDA BAHAYA
    // ═══════════════════════════════════════════════════════════════
    { id: 'early_detection', label: 'Deteksi Dini Gejala Kambuh/Perburukan', category: 'compliance', icon: 'siren' },
    { id: 'prevent_disability', label: 'Cegah Kecacatan dengan Perawatan Diri', category: 'compliance', icon: 'shield' },
    { id: 'red_flag_infection', label: 'Waspada Tanda Infeksi (Demam, Nanah, Merah)', category: 'compliance', icon: 'siren' },
    { id: 'red_flag_anaphylaxis', label: 'Waspada Anafilaksis: Sesak, Bengkak, Gatal Hebat', category: 'compliance', icon: 'siren' },
    { id: 'red_flag_newborn', label: 'Waspada Tanda Bahaya Bayi Baru Lahir', category: 'compliance', icon: 'siren' },
    { id: 'red_flag_head_injury', label: 'Waspada: Muntah/Kesadaran Turun → Segera ke RS', category: 'compliance', icon: 'siren' },
    { id: 'hypoglycemia_signs', label: 'Kenali Gejala Hipoglikemia: Gemetar, Keringat, Lemas', category: 'compliance', icon: 'siren' },
    { id: 'danger_signs_pregnancy', label: 'Kenali Tanda Bahaya Kehamilan', category: 'compliance', icon: 'siren' },

    // ═══════════════════════════════════════════════════════════════
    // DIET & NUTRISI — SPESIFIK
    // ═══════════════════════════════════════════════════════════════
    { id: 'nutrition', label: 'Perbaiki Gizi dan Asupan Makanan', category: 'diet', icon: 'food' },
    { id: 'nutrition_counseling', label: 'Konseling Gizi untuk Pola Makan Sehat', category: 'diet', icon: 'food' },
    { id: 'nutrition_pregnancy', label: 'Nutrisi Seimbang Selama Kehamilan', category: 'diet', icon: 'food' },
    { id: 'nutrition_vitamin_a', label: 'Konsumsi Makanan Kaya Vitamin A', category: 'diet', icon: 'food' },
    { id: 'balanced_diet', label: 'Makan Makanan Bergizi Seimbang', category: 'diet', icon: 'food' },
    { id: 'diet_dm', label: 'Diet DM: Kurangi Gula, Karbohidrat Kompleks', category: 'diet', icon: 'food' },
    { id: 'diet_vegetables', label: 'Perbanyak Sayur dan Buah', category: 'diet', icon: 'food' },
    { id: 'eat_fruits_vegetables', label: 'Konsumsi Buah dan Sayur Setiap Hari', category: 'diet', icon: 'food' },
    { id: 'iron_rich_diet', label: 'Konsumsi Makanan Kaya Zat Besi', category: 'diet', icon: 'food' },
    { id: 'low_purine_diet', label: 'Kurangi Makanan Tinggi Purin (Jeroan, Seafood)', category: 'diet', icon: 'food' },
    { id: 'mineral_rich_foods', label: 'Konsumsi Makanan Kaya Mineral', category: 'diet', icon: 'food' },
    { id: 'local_food_recipes', label: 'Resep Makanan Lokal Bergizi untuk Anak', category: 'diet', icon: 'food' },
    { id: 'take_iron_vit_c', label: 'Minum Tablet Fe dengan Vitamin C', category: 'diet', icon: 'pill' },
    { id: 'regular_meals', label: 'Makan Teratur 3x Sehari + Snack', category: 'diet', icon: 'food' },
    { id: 'read_food_labels', label: 'Baca Label Makanan Kemasan', category: 'diet', icon: 'food' },
    { id: 'avoid_lactose', label: 'Hindari Susu/Produk Laktosa (Intoleransi)', category: 'diet', icon: 'food' },
    { id: 'lactose_free_milk', label: 'Ganti dengan Susu Bebas Laktosa', category: 'diet', icon: 'food' },
    { id: 'gradual_introduction', label: 'Perkenalkan Makanan Baru Secara Bertahap', category: 'diet', icon: 'food' },
    { id: 'avoid_spicy', label: 'Hindari Makanan Pedas', category: 'diet', icon: 'food' },
    { id: 'avoid_spicy_food', label: 'Kurangi Makanan Pedas dan Asam', category: 'diet', icon: 'food' },
    { id: 'avoid_alcohol', label: 'Hindari Alkohol', category: 'diet', icon: 'warning' },
    { id: 'drink_water', label: 'Cukupi Kebutuhan Air Minum Harian', category: 'diet', icon: 'water' },
    { id: 'drink_plenty_water', label: 'Minum Air Putih Banyak', category: 'diet', icon: 'water' },
    { id: 'cook_meat_thoroughly', label: 'Masak Daging Sampai Matang Sempurna', category: 'diet', icon: 'food' },

    // ═══════════════════════════════════════════════════════════════
    // KEBERSIHAN — SPESIFIK
    // ═══════════════════════════════════════════════════════════════
    { id: 'hand_wash', label: 'Cuci Tangan Pakai Sabun Rutin', category: 'hygiene', icon: 'hand' },
    { id: 'handwash', label: 'Cuci Tangan Pakai Sabun', category: 'hygiene', icon: 'hand' },
    { id: 'body_hygiene', label: 'Jaga Kebersihan Badan/Mandi Teratur', category: 'hygiene', icon: 'shower' },
    { id: 'skin_hygiene', label: 'Jaga Kebersihan Kulit', category: 'hygiene', icon: 'skin' },
    { id: 'face_hygiene', label: 'Cuci Muka 2x Sehari dengan Pembersih Lembut', category: 'hygiene', icon: 'face' },
    { id: 'oral_hygiene', label: 'Jaga Kebersihan Mulut (Sikat Gigi 2x/hari)', category: 'hygiene', icon: 'tooth' },
    { id: 'lid_hygiene', label: 'Bersihkan Kelopak Mata dengan Kompres Hangat', category: 'hygiene', icon: 'eye' },
    { id: 'proper_hygiene', label: 'Jaga Kebersihan Diri', category: 'hygiene', icon: 'shower' },
    { id: 'proper_feminine_hygiene', label: 'Jaga Kebersihan Area Kewanitaan', category: 'hygiene', icon: 'heart' },
    { id: 'voiding_hygiene', label: 'Cebok dari Depan ke Belakang', category: 'hygiene', icon: 'heart' },
    { id: 'proper_sanitation', label: 'Gunakan Jamban Sehat / Sanitasi Baik', category: 'hygiene', icon: 'home' },
    { id: 'boil_water', label: 'Masak Air Minum hingga Mendidih', category: 'hygiene', icon: 'water' },
    { id: 'bottle_sterilization', label: 'Sterilkan Botol Susu Bayi', category: 'hygiene', icon: 'baby' },
    { id: 'proper_nail_care', label: 'Potong Kuku Teratur and Bersih', category: 'hygiene', icon: 'hand' },
    { id: 'wash_bedding', label: 'Cuci Sprei & Sarung Bantal Rutin', category: 'hygiene', icon: 'home' },
    { id: 'gentle_cleanser', label: 'Gunakan Pembersih Lembut Tanpa Pewangi', category: 'hygiene', icon: 'soap' },
    { id: 'avoid_water_ear', label: 'Hindari Kemasukan Air Ke Telinga', category: 'hygiene', icon: 'droplet-off' },
    { id: 'nutrition_support', label: 'Dukungan Nutrisi Tinggi Kalori Protein', category: 'nutrition', icon: 'utensils' },
    { id: 'regular_checkup', label: 'Kontrol Rutin Ke Fasilitas Kesehatan', category: 'general', icon: 'calendar-check' },
    { id: 'dont_wear_tight_shoes', label: 'Hindari Pemakaian Sepatu Sempit', category: 'hygiene', icon: 'shoe-prints' },
    { id: 'keep_foot_dry', label: 'Jaga Kaki Tetap Kering', category: 'hygiene', icon: 'wind' },
    { id: 'hygiene_genital', label: 'Jaga Kebersihan Genital (Depan ke Belakang)', category: 'hygiene', icon: 'heart' },

    // --- PENCEGAHAN & LINGKUNGAN ---
    { id: 'bed_net', label: 'Tidur Pakai Kelambu Berinsektisida', category: 'prevention', icon: 'bed' },
    { id: 'mosquito_prevention', label: 'Cegah Gigitan Nyamuk (Fogging, Abate)', category: 'prevention', icon: 'bug' },
    { id: 'insect_repellent', label: 'Gunakan Lotion Anti Nyamuk', category: 'prevention', icon: 'bug' },
    { id: 'rat_control', label: 'Pengendalian Tikus di Rumah', category: 'prevention', icon: 'home' },
    { id: 'complete_vaccination', label: 'Lengkapi Vaksinasi Sesuai Jadwal', category: 'prevention', icon: 'syringe' },
    { id: 'tetanus_booster_schedule', label: 'Jadwal Booster Tetanus (Tiap 10 Tahun)', category: 'prevention', icon: 'syringe' },
    { id: 'deworming_regular', label: 'Minum Obat Cacing Rutin (6 Bulan Sekali)', category: 'prevention', icon: 'pill' },
    { id: 'safe_sex', label: 'Gunakan Kondom pada Hubungan Seksual', category: 'prevention', icon: 'heart' },
    { id: 'abstinence_during_treatment', label: 'Hindari Hubungan Seksual Selama Pengobatan', category: 'prevention', icon: 'heart' },
    { id: 'avoid_autoinoculation', label: 'Jangan Garuk/Sentuh Lesi, Cegah Penyebaran', category: 'prevention', icon: 'warning' },
    { id: 'avoid_kissing', label: 'Hindari Ciuman saat Ada Lesi Aktif', category: 'prevention', icon: 'warning' },
    { id: 'dont_touch_lesion', label: 'Jangan Sentuh Lesi Kulit', category: 'prevention', icon: 'warning' },
    { id: 'dont_squeeze', label: 'Jangan Memencet Jerawat/Bisul', category: 'prevention', icon: 'warning' },
    { id: 'dont_scratch', label: 'Jangan Menggaruk Area yang Gatal', category: 'prevention', icon: 'warning' },
    { id: 'dont_rub_eyes', label: 'Jangan Mengucek Mata', category: 'prevention', icon: 'eye' },
    { id: 'dont_pick_nose', label: 'Jangan Mengorek Hidung', category: 'prevention', icon: 'warning' },
    { id: 'dont_retract_forcefully', label: 'Jangan Tarik Kulup dengan Paksa', category: 'prevention', icon: 'warning' },
    { id: 'dont_share_comb', label: 'Jangan Berbagi Sisir', category: 'prevention', icon: 'warning' },
    { id: 'dont_share_razor', label: 'Jangan Berbagi Alat Cukur', category: 'prevention', icon: 'warning' },
    { id: 'avoid_sharing_comb', label: 'Jangan Berbagi Sisir/Topi', category: 'prevention', icon: 'warning' },
    { id: 'avoid_sharing_towels', label: 'Jangan Berbagi Handuk', category: 'prevention', icon: 'warning' },

    // --- PAKAIAN & PERLENGKAPAN ---
    { id: 'loose_clothes', label: 'Pakai Pakaian Longgar dan Nyaman', category: 'prevention', icon: 'shirt' },
    { id: 'wear_cotton', label: 'Pakai Pakaian Katun yang Menyerap Keringat', category: 'prevention', icon: 'shirt' },
    { id: 'cotton_underwear', label: 'Pakai Celana Dalam Katun', category: 'prevention', icon: 'shirt' },
    { id: 'cotton_socks', label: 'Pakai Kaus Kaki Katun, Ganti Setiap Hari', category: 'prevention', icon: 'shirt' },
    { id: 'wear_shoes', label: 'Selalu Pakai Alas Kaki', category: 'prevention', icon: 'shoe' },
    { id: 'wear_sandals', label: 'Pakai Sandal di Area Lembab/Basah', category: 'prevention', icon: 'shoe' },
    { id: 'wear_boots', label: 'Pakai Sepatu Boots saat Terpapar Air Banjir', category: 'prevention', icon: 'shoe' },
    { id: 'wear_gloves', label: 'Pakai Sarung Tangan saat Kontak Tanah/Zat Kimia', category: 'prevention', icon: 'hand' },
    { id: 'clean_helm_regularly', label: 'Bersihkan Helm Secara Rutin', category: 'prevention', icon: 'hat' },

    // --- KULIT & PERAWATAN DIRI ---
    { id: 'moisturize_daily', label: 'Gunakan Pelembab Kulit Setiap Hari', category: 'selfcare', icon: 'skin' },
    { id: 'moisturizer_routine', label: 'Rutin Pakai Pelembab Setelah Mandi', category: 'selfcare', icon: 'skin' },
    { id: 'barrier_cream', label: 'Oleskan Krim Pelindung (Barrier Cream)', category: 'selfcare', icon: 'skin' },
    { id: 'air_exposure', label: 'Biarkan Area Kulit Terbuka/Berventilasi', category: 'selfcare', icon: 'skin' },
    { id: 'keep_feet_dry', label: 'Jaga Kaki Tetap Kering', category: 'selfcare', icon: 'shoe' },
    { id: 'keep_ear_dry', label: 'Jaga Telinga Tetap Kering saat Mandi', category: 'selfcare', icon: 'ear' },
    { id: 'foot_care', label: 'Perawatan Kaki Diabetik (Inspeksi Harian)', category: 'selfcare', icon: 'shoe' },
    { id: 'limb_care', label: 'Perawatan Tangan/Kaki untuk Cegah Kecacatan', category: 'selfcare', icon: 'hand' },
    { id: 'wound_care_home', label: 'Perawatan Luka di Rumah (Bersih & Kering)', category: 'selfcare', icon: 'bandaid' },
    { id: 'gentle_retraction', label: 'Latihan Retraksi Kulup Perlahan', category: 'selfcare', icon: 'info' },
    { id: 'preputial_care', label: 'Perawatan Kulup (Kebersihan Harian)', category: 'selfcare', icon: 'info' },
    { id: 'sitz_bath', label: 'Rendam Duduk Air Hangat (Sitz Bath)', category: 'selfcare', icon: 'bath' },
    { id: 'leg_elevation', label: 'Tinggikan Kaki saat Istirahat', category: 'selfcare', icon: 'bed' },

    // --- HINDARI IRITAN / ALERGEN ---
    { id: 'avoid_irritant', label: 'Hindari Bahan Iritan pada Kulit', category: 'prevention', icon: 'warning' },
    { id: 'avoid_irritants', label: 'Hindari Bahan Iritan (Deterjen, Sabun Keras)', category: 'prevention', icon: 'warning' },
    { id: 'avoid_irritant_soap', label: 'Hindari Sabun Iritan / Gunakan Sabun Lembut', category: 'prevention', icon: 'soap' },
    { id: 'avoid_trigger', label: 'Kenali and Hindari Faktor Pencetus', category: 'prevention', icon: 'warning' },
    { id: 'avoid_triggers', label: 'Kenali & Hindari Semua Faktor Pencetus', category: 'prevention', icon: 'warning' },
    { id: 'avoid_comedogenic', label: 'Hindari Kosmetik Komedogenik', category: 'prevention', icon: 'warning' },
    { id: 'remove_makeup_properly', label: 'Bersihkan Make-up Sebelum Tidur', category: 'prevention', icon: 'face' },
    { id: 'avoid_shaving', label: 'Hindari Mencukur Area yang Terinfeksi', category: 'prevention', icon: 'warning' },
    { id: 'stop_offending_drug', label: 'Hentikan Obat Penyebab Alergi', category: 'prevention', icon: 'pill' },
    { id: 'stop_steroid', label: 'Hentikan Krim Steroid Jangka Panjang', category: 'prevention', icon: 'pill' },
    { id: 'stop_douching', label: 'Jangan Douching (Bilas Vagina)', category: 'prevention', icon: 'warning' },
    { id: 'avoid_douching', label: 'Hindari Vaginal Douching', category: 'prevention', icon: 'warning' },
    { id: 'record_allergy', label: 'Catat and Ingat Obat/Makanan Penyebab Alergi', category: 'prevention', icon: 'note' },
    { id: 'allergy_card', label: 'Bawa Kartu Alergi', category: 'prevention', icon: 'card' },
    { id: 'carry_allergy_card', label: 'Selalu Bawa Kartu Identifikasi Alergi', category: 'prevention', icon: 'card' },
    { id: 'carry_epipen', label: 'Selalu Bawa EpiPen / Adrenalin untuk Darurat', category: 'prevention', icon: 'syringe' },
    { id: 'carry_candy', label: 'Selalu Bawa Permen/Gula untuk Hipoglikemia', category: 'prevention', icon: 'candy' },

    // --- AKTIVITAS & OLAHRAGA ---
    { id: 'exercise', label: 'Olahraga Teratur 30 Menit/Hari', category: 'activity', icon: 'run' },
    { id: 'rest', label: 'Istirahat Cukup', category: 'activity', icon: 'bed' },
    { id: 'kegel_exercise', label: 'Latihan Kegel untuk Penguatan Otot Dasar Panggul', category: 'activity', icon: 'run' },
    { id: 'blink_exercise', label: 'Latihan Kedipan Mata Teratur', category: 'activity', icon: 'eye' },
    { id: 'rice_method', label: 'Metode RICE: Rest, Ice, Compress, Elevate', category: 'activity', icon: 'info' },
    { id: 'patience_recovery', label: 'Sabar, Pemulihan Butuh Waktu', category: 'activity', icon: 'clock' },

    // --- LINGKUNGAN ---
    { id: 'avoid_flood_water', label: 'Hindari Kontak Air Banjir/Genangan', category: 'prevention', icon: 'water' },
    { id: 'avoid_freshwater', label: 'Hindari Berenang di Air Tawar Tercemar', category: 'prevention', icon: 'water' },
    { id: 'avoid_sandy_soil', label: 'Hindari Berjalan Tanpa Alas Kaki di Tanah', category: 'prevention', icon: 'shoe' },
    { id: 'avoid_rusty_objects', label: 'Hindari Kontak Benda Berkarat', category: 'prevention', icon: 'warning' },
    { id: 'avoid_swimming', label: 'Hindari Berenang Selama Infeksi Telinga', category: 'prevention', icon: 'water' },
    { id: 'avoid_hot_bath', label: 'Hindari Mandi Air Terlalu Panas', category: 'prevention', icon: 'shower' },

    // --- MATA ---
    { id: '20_20_20_rule', label: 'Aturan 20-20-20: Istirahatkan Mata Setiap 20 Menit', category: 'prevention', icon: 'eye' },
    { id: 'screen_breaks_20_20_20', label: 'Istirahat Layar: Setiap 20 Menit Lihat Jauh', category: 'prevention', icon: 'eye' },
    { id: 'limit_screen_time', label: 'Batasi Waktu Layar (Max 2 Jam/Hari Anak)', category: 'prevention', icon: 'eye' },
    { id: 'reduce_screen_time', label: 'Kurangi Waktu di Depan Layar', category: 'prevention', icon: 'eye' },
    { id: 'outdoor_activity_2hr', label: 'Aktivitas Luar Ruangan Min. 2 Jam/Hari', category: 'activity', icon: 'sun' },
    { id: 'reading_distance_30cm', label: 'Jarak Baca Minimal 30 cm', category: 'prevention', icon: 'eye' },
    { id: 'reading_breaks', label: 'Istirahatkan Mata Saat Membaca Lama', category: 'prevention', icon: 'eye' },
    { id: 'proper_lighting', label: 'Pastikan Pencahayaan Cukup saat Membaca', category: 'prevention', icon: 'lamp' },
    { id: 'sit_front', label: 'Duduk di Depan Kelas (untuk Anak)', category: 'prevention', icon: 'eye' },
    { id: 'wear_glasses_always', label: 'Selalu Pakai Kacamata yang Diresepkan', category: 'compliance', icon: 'glasses' },
    { id: 'wear_glasses_for_work', label: 'Pakai Kacamata saat Membaca/Bekerja', category: 'compliance', icon: 'glasses' },
    { id: 'need_reading_glasses', label: 'Butuh Kacamata Baca (Wajar Sesuai Usia)', category: 'compliance', icon: 'glasses' },
    { id: 'normal_aging', label: 'Ini Normal Sesuai Usia, Tidak Perlu Khawatir', category: 'reassurance', icon: 'info' },
    { id: 'look_horizon', label: 'Lihat ke Arah Horizon saat Mabuk Perjalanan', category: 'prevention', icon: 'eye' },

    // --- IBU & ANAK ---
    { id: 'proper_latch', label: 'Teknik Perlekatan Menyusui yang Benar', category: 'maternal', icon: 'baby' },
    { id: 'dont_stop_breastfeeding', label: 'Jangan Berhenti Menyusui', category: 'maternal', icon: 'baby' },
    { id: 'apply_breastmilk', label: 'Olesi ASI pada Puting yang Lecet', category: 'maternal', icon: 'baby' },
    { id: 'nipple_exercises', label: 'Latihan Puting untuk Puting Datar/Tenggelam', category: 'maternal', icon: 'baby' },
    { id: 'use_nipple_shield', label: 'Gunakan Nipple Shield saat Menyusui', category: 'maternal', icon: 'baby' },
    { id: 'breastpump_alternative', label: 'Pompa ASI sebagai Alternatif', category: 'maternal', icon: 'baby' },
    { id: 'anc_schedule', label: 'Periksa Kehamilan (ANC) Teratur', category: 'maternal', icon: 'calendar' },
    { id: 'birth_plan', label: 'Siapkan Rencana Persalinan', category: 'maternal', icon: 'note' },
    { id: 'family_planning', label: 'Konseling Keluarga Berencana (KB)', category: 'maternal', icon: 'heart' },
    { id: 'perineal_care', label: 'Perawatan Perineum Pasca Persalinan', category: 'maternal', icon: 'heart' },
    { id: 'dry_cord_care', label: 'Perawatan Tali Pusat Kering', category: 'maternal', icon: 'baby' },
    { id: 'growth_monitoring', label: 'Pantau Pertumbuhan Anak (KMS/Posyandu)', category: 'maternal', icon: 'chart' },
    { id: 'monitor_growth', label: 'Timbang and Ukur Anak Rutin di Posyandu', category: 'maternal', icon: 'chart' },
    { id: 'child_safety', label: 'Jauhkan Benda Kecil dari Jangkauan Anak', category: 'maternal', icon: 'warning' },
    { id: 'keep_small_objects_away', label: 'Simpan Benda Kecil dari Jangkauan Anak', category: 'maternal', icon: 'warning' },
    { id: 'frequent_diaper_change', label: 'Ganti Popok Sesering Mungkin', category: 'maternal', icon: 'baby' },

    // --- PSIKOLOGI ---
    { id: 'psychoeducation', label: 'Edukasi tentang Gangguan Psikosomatis', category: 'behavioral', icon: 'brain' },
    { id: 'single_doctor', label: 'Berobat ke Satu Dokter Saja (Jangan Doctor Shopping)', category: 'behavioral', icon: 'doctor' },
    { id: 'stress_management', label: 'Kelola Stres dengan Relaksasi/Hobi', category: 'behavioral', icon: 'brain' },
    { id: 'trigger_avoidance', label: 'Hindari Faktor Pencetus (Kelelahan/Bau Tajam)', category: 'behavioral', icon: 'warning' },
    { id: 'self_limiting', label: 'Penyakit Ini Akan Sembuh Sendiri', category: 'reassurance', icon: 'info' },
    { id: 'benign_tumor_reassurance', label: 'Tumor Jinak, Tidak Perlu Panik', category: 'reassurance', icon: 'info' },

    // --- PROSEDUR & DM ---
    { id: 'insulin_technique', label: 'Teknik Suntik Insulin yang Benar', category: 'compliance', icon: 'syringe' },
    { id: 'dm_control', label: 'Kontrol Gula Darah Rutin (GDS/GDP)', category: 'compliance', icon: 'lab' },
    { id: 'control_blood_pressure', label: 'Kontrol Tekanan Darah Rutin', category: 'compliance', icon: 'heart' },
    { id: 'treat_underlying_dm', label: 'Kontrol Gula Darah untuk Cegah Komplikasi', category: 'compliance', icon: 'lab' },
    { id: 'treat_source_infection', label: 'Obati Sumber Infeksi Utama', category: 'compliance', icon: 'pill' },
    { id: 'circumcision_counseling', label: 'Konseling tentang Sirkumsisi/Sunat', category: 'compliance', icon: 'info' },
    { id: 'circumcision_elective', label: 'Sirkumsisi Elektif bisa Dipertimbangkan', category: 'compliance', icon: 'info' },
    { id: 'take_med_before_trip', label: 'Minum Obat Sebelum Perjalanan', category: 'compliance', icon: 'pill' },

    // --- HIV ---
    { id: 'oi_prevention', label: 'Cegah Infeksi Oportunistik (IO)', category: 'compliance', icon: 'shield' },

    // --- LINGKUNGAN RUMAH ---
    { id: 'humidifier', label: 'Gunakan Pelembab Udara (Humidifier)', category: 'prevention', icon: 'home' },
    { id: 'increase_humidity', label: 'Tingkatkan Kelembaban Udara Ruangan', category: 'prevention', icon: 'home' },
    { id: 'isolation', label: 'Isolasi Pasien di Rumah selama Menular', category: 'prevention', icon: 'home' },

    // ═══════════════════════════════════════════════════════════════
    // CASE-REFERENCED EDUCATION (resolves requiredEducation IDs)
    // ═══════════════════════════════════════════════════════════════

    // --- SELF-LIMITING / REASSURANCE ---
    { id: 'self_limited', label: 'Penyakit Ini Akan Sembuh Sendiri', category: 'reassurance', icon: 'info' },
    { id: 'self_limiting_viral', label: 'Infeksi Virus — Sembuh Sendiri dalam 5-7 Hari', category: 'reassurance', icon: 'info' },
    { id: 'self_limited_3_6_weeks', label: 'Akan Membaik dalam 3-6 Minggu', category: 'reassurance', icon: 'info' },
    { id: 'self_limited_6_8_weeks', label: 'Akan Membaik dalam 6-8 Minggu', category: 'reassurance', icon: 'info' },
    { id: 'benign_tumor', label: 'Tumor Jinak, Tidak Berbahaya', category: 'reassurance', icon: 'info' },
    { id: 'chronic_relapsing', label: 'Bersifat Kronis dan Bisa Kambuh', category: 'reassurance', icon: 'info' },
    { id: 'chronic_disease', label: 'Penyakit Kronis — Perlu Pengelolaan Jangka Panjang', category: 'reassurance', icon: 'info' },
    { id: 'chronic_illness', label: 'Penyakit Kronis — Kontrol Rutin Penting', category: 'reassurance', icon: 'info' },
    { id: 'autoimmune_disease', label: 'Penyakit Autoimun — Perlu Pemantauan Teratur', category: 'reassurance', icon: 'info' },
    { id: 'mind_body_connection', label: 'Hubungan Pikiran dan Tubuh (Psikosomatis)', category: 'reassurance', icon: 'brain' },
    { id: 'recurrence_risk', label: 'Bisa Kambuh — Kenali Faktor Pencetus', category: 'reassurance', icon: 'warning' },
    { id: 'patience_recovery', label: 'Sabar, Pemulihan Butuh Waktu', category: 'reassurance', icon: 'clock' },

    // --- REST & FLUIDS ---
    { id: 'rest_and_fluids', label: 'Istirahat Cukup dan Perbanyak Minum', category: 'selfcare', icon: 'water' },
    { id: 'adequate_hydration', label: 'Pastikan Hidrasi Cukup', category: 'selfcare', icon: 'water' },
    { id: 'adequate_fluids', label: 'Cukupi Kebutuhan Cairan', category: 'selfcare', icon: 'water' },
    { id: 'increased_fluid_intake', label: 'Tingkatkan Asupan Cairan', category: 'selfcare', icon: 'water' },
    { id: 'rest_and_elevation', label: 'Istirahat dan Tinggikan Bagian yang Sakit', category: 'selfcare', icon: 'bed' },
    { id: 'keep_hydrated', label: 'Jaga Agar Tetap Terhidrasi', category: 'selfcare', icon: 'water' },

    // --- MEDICATION COMPLIANCE (extended) ---
    { id: 'complete_antibiotics', label: 'Habiskan Antibiotik Sesuai Resep', category: 'compliance', icon: 'pill' },
    { id: 'complete_antibiotic_course', label: 'Habiskan Seluruh Kur Antibiotik', category: 'compliance', icon: 'pill' },
    { id: 'long_term_antibiotics', label: 'Antibiotik Jangka Panjang Sesuai Anjuran', category: 'compliance', icon: 'pill' },
    { id: 'medication_compliance', label: 'Penting Minum Obat Teratur', category: 'compliance', icon: 'pill' },
    { id: 'med_compliance_full', label: 'Habiskan Obat Sampai Tuntas', category: 'compliance', icon: 'pill' },
    { id: 'med_compliance_full_course', label: 'Minum Obat Full Course Jangan Dihentikan', category: 'compliance', icon: 'pill' },
    { id: 'medication_takes_2_4_weeks', label: 'Obat Butuh 2-4 Minggu untuk Efek Penuh', category: 'compliance', icon: 'clock' },
    { id: 'anticoagulant_compliance', label: 'Minum Antikoagulan Teratur', category: 'compliance', icon: 'pill' },

    // --- FOLLOW-UP ---
    { id: 'follow_up', label: 'Kontrol Ulang Sesuai Jadwal', category: 'compliance', icon: 'calendar' },
    { id: 'follow_up_1_week', label: 'Kontrol Ulang 1 Minggu', category: 'compliance', icon: 'calendar' },
    { id: 'follow_up_xray', label: 'Kontrol ULang dengan Rontgen', category: 'compliance', icon: 'calendar' },
    { id: 'follow_up_suture_removal', label: 'Kontrol untuk Angkat Jahitan', category: 'compliance', icon: 'calendar' },
    { id: 'follow_up_if_worse', label: 'Kembali jika Gejala Memburuk', category: 'compliance', icon: 'warning' },
    { id: 'follow_up_if_recurrent', label: 'Kembali jika Kambuh', category: 'compliance', icon: 'warning' },
    { id: 'follow_up_recurrence', label: 'Kontrol Jika Terjadi Kekambuhan', category: 'compliance', icon: 'calendar' },
    { id: 'follow_up_burn', label: 'Kontrol Luka Bakar Sesuai Jadwal', category: 'compliance', icon: 'calendar' },

    // --- EMERGENCY & RED FLAGS ---
    { id: 'life_threatening', label: 'Kondisi Mengancam Nyawa — Perlu Tindakan Segera', category: 'compliance', icon: 'siren' },
    { id: 'icu_needed', label: 'Perlu Perawatan Intensif (ICU)', category: 'compliance', icon: 'siren' },
    { id: 'do_not_delay', label: 'Jangan Tunda Pengobatan!', category: 'compliance', icon: 'siren' },
    { id: 'when_to_emergency', label: 'Kapan Harus ke UGD', category: 'compliance', icon: 'siren' },
    { id: 'signs_of_infection', label: 'Kenali Tanda Infeksi (Merah, Bengkak, Nanah)', category: 'compliance', icon: 'siren' },
    { id: 'infection_risk', label: 'Waspadai Risiko Infeksi', category: 'compliance', icon: 'siren' },
    { id: 'red_flag_perforation', label: 'Waspada Tanda Perforasi (Nyeri Hebat Mendadak)', category: 'compliance', icon: 'siren' },
    { id: 'overdose_risk', label: 'Waspadai Risiko Overdosis', category: 'compliance', icon: 'siren' },
    { id: 'pe_risk', label: 'Waspadai Risiko Emboli Paru', category: 'compliance', icon: 'siren' },
    { id: 'stroke_risk', label: 'Waspadai Tanda Stroke', category: 'compliance', icon: 'siren' },
    { id: 'cardiovascular_risk', label: 'Waspadai Risiko Kardiovaskular', category: 'compliance', icon: 'siren' },
    { id: 'inhalation_injury_risk', label: 'Waspadai Cedera Inhalasi pada Luka Bakar', category: 'compliance', icon: 'siren' },
    { id: 'eclampsia_risk', label: 'Waspadai Tanda Eklampsia', category: 'compliance', icon: 'siren' },
    { id: 'cord_prolapse_risk', label: 'Waspadai Prolaps Tali Pusat', category: 'compliance', icon: 'siren' },
    { id: 'thyroid_storm_warning', label: 'Waspada Krisis Tiroid (Thyroid Storm)', category: 'compliance', icon: 'siren' },
    { id: 'airway_risk', label: 'Waspadai Risiko Sumbatan Jalan Napas', category: 'compliance', icon: 'siren' },
    { id: 'magnesium_toxicity_monitoring', label: 'Pantau Toksisitas MgSO4', category: 'compliance', icon: 'siren' },
    { id: 'naloxone_may_repeat', label: 'Nalokson Bisa Perlu Diulang', category: 'compliance', icon: 'siren' },
    { id: 'vision_threatening', label: 'Kondisi Mata Mengancam Penglihatan!', category: 'compliance', icon: 'siren' },

    // --- SURGERY & REFERRAL ---
    { id: 'surgery_needed', label: 'Mungkin Perlu Tindakan Operasi', category: 'compliance', icon: 'info' },
    { id: 'surgery_needed_urgently', label: 'Perlu Operasi SEGERA', category: 'compliance', icon: 'siren' },
    { id: 'surgery_likely', label: 'Kemungkinan Besar Perlu Operasi', category: 'compliance', icon: 'info' },
    { id: 'surgery_may_needed', label: 'Operasi Mungkin Diperlukan', category: 'compliance', icon: 'info' },
    { id: 'surgery_if_persistent', label: 'Operasi Jika Tidak Membaik', category: 'compliance', icon: 'info' },
    { id: 'surgery_if_progressive', label: 'Operasi Jika Progresif', category: 'compliance', icon: 'info' },
    { id: 'surgery_if_cosmetic', label: 'Operasi Bisa Dipertimbangkan (Kosmetik)', category: 'compliance', icon: 'info' },
    { id: 'surgery_if_cholesteatoma', label: 'Operasi Jika Ada Kolesteatoma', category: 'compliance', icon: 'info' },
    { id: 'surgery_only_treatment', label: 'Operasi Satu-satunya Pengobatan', category: 'compliance', icon: 'info' },
    { id: 'tonsillectomy_after_recovery', label: 'Tonsilektomi Setelah Pemulihan', category: 'compliance', icon: 'info' },
    { id: 'drainage_needed', label: 'Perlu Drainase Abses', category: 'compliance', icon: 'info' },
    { id: 'biopsy_needed', label: 'Perlu Biopsi untuk Diagnosis Pasti', category: 'compliance', icon: 'info' },
    { id: 'staging_ct_scan', label: 'Perlu CT Scan untuk Staging', category: 'compliance', icon: 'info' },
    { id: 'ct_scan_if_recurrent', label: 'CT Scan Jika Kambuh Berulang', category: 'compliance', icon: 'info' },

    // --- REFERRAL (specific) ---
    { id: 'ophthalmology_referral', label: 'Rujuk ke Dokter Mata', category: 'compliance', icon: 'eye' },
    { id: 'immediate_ophthalmology', label: 'Rujuk SEGERA ke Dokter Mata', category: 'compliance', icon: 'siren' },
    { id: 'phaco_referral', label: 'Rujuk untuk Operasi Katarak (Fakoemulsifikasi)', category: 'compliance', icon: 'eye' },
    { id: 'iridotomy_needed', label: 'Perlu Iridotomi Laser', category: 'compliance', icon: 'eye' },
    { id: 'dermatology_referral_urgent', label: 'Rujuk Segera ke Dermatologi', category: 'compliance', icon: 'siren' },
    { id: 'orthopedic_referral', label: 'Rujuk ke Dokter Ortopedi', category: 'compliance', icon: 'info' },
    { id: 'psychiatry_referral', label: 'Rujuk ke Psikiater', category: 'compliance', icon: 'brain' },
    { id: 'counseling_referral', label: 'Rujuk untuk Konseling', category: 'compliance', icon: 'brain' },
    { id: 'nephrology_referral', label: 'Rujuk ke Nefrologi', category: 'compliance', icon: 'info' },
    { id: 'endocrine_referral', label: 'Rujuk ke Endokrinologi', category: 'compliance', icon: 'info' },
    { id: 'echo_referral', label: 'Rujuk untuk Ekokardiografi', category: 'compliance', icon: 'heart' },
    { id: 'audiometry_referral', label: 'Rujuk untuk Audiometri', category: 'compliance', icon: 'ear' },
    { id: 'rehabilitation_referral', label: 'Rujuk untuk Rehabilitasi', category: 'compliance', icon: 'info' },
    { id: 'systemic_therapy_referral', label: 'Rujuk untuk Terapi Sistemik', category: 'compliance', icon: 'info' },
    { id: 'urology_referral', label: 'Rujuk ke Urologi', category: 'compliance', icon: 'info' },
    { id: 'usg_doppler_referral', label: 'Rujuk untuk USG Doppler', category: 'compliance', icon: 'info' },

    // --- DIET (case-specific) ---
    { id: 'balanced_nutrition', label: 'Nutrisi Seimbang dan Adekuat', category: 'diet', icon: 'food' },
    { id: 'adequate_nutrition', label: 'Pastikan Asupan Gizi Cukup', category: 'diet', icon: 'food' },
    { id: 'diet_diabetes', label: 'Diet Diabetes (Karbohidrat Kompleks)', category: 'diet', icon: 'food' },
    { id: 'low_salt_diet', label: 'Diet Rendah Garam', category: 'diet', icon: 'salt' },
    { id: 'low_fat_diet', label: 'Diet Rendah Lemak', category: 'diet', icon: 'food' },
    { id: 'iron_rich_food', label: 'Makan Tinggi Zat Besi', category: 'diet', icon: 'food' },
    { id: 'vitamin_a_rich_food', label: 'Makan Tinggi Vitamin A', category: 'diet', icon: 'food' },
    { id: 'small_frequent_meals', label: 'Makan Porsi Kecil tapi Sering', category: 'diet', icon: 'clock' },
    { id: 'take_with_vitamin_c', label: 'Minum dengan Vitamin C untuk Penyerapan', category: 'diet', icon: 'pill' },
    { id: 'avoid_tea_with_iron', label: 'Hindari Minum Teh Bersamaan Tablet Fe', category: 'diet', icon: 'warning' },
    { id: 'meal_timing', label: 'Atur Waktu Makan Teratur', category: 'diet', icon: 'clock' },
    { id: 'salt_restriction', label: 'Batasi Konsumsi Garam', category: 'diet', icon: 'salt' },
    { id: 'fluid_and_salt_restriction', label: 'Batasi Cairan dan Garam', category: 'diet', icon: 'water' },
    { id: 'limit_caffeine', label: 'Batasi Konsumsi Kafein', category: 'diet', icon: 'coffee' },

    // --- LIFESTYLE (case-specific) ---
    { id: 'lifestyle_modification', label: 'Modifikasi Gaya Hidup', category: 'lifestyle', icon: 'run' },
    { id: 'regular_exercise', label: 'Olahraga Teratur', category: 'lifestyle', icon: 'run' },
    { id: 'exercise_150min_week', label: 'Olahraga 150 Menit/Minggu', category: 'lifestyle', icon: 'run' },
    { id: 'low_impact_exercise', label: 'Olahraga Ringan (Jalan, Renang)', category: 'lifestyle', icon: 'run' },
    { id: 'weight_management', label: 'Kelola Berat Badan', category: 'lifestyle', icon: 'scale' },
    { id: 'weight_loss_target', label: 'Target Penurunan Berat Badan', category: 'lifestyle', icon: 'scale' },
    { id: 'risk_factor_modification', label: 'Modifikasi Faktor Risiko', category: 'lifestyle', icon: 'warning' },
    { id: 'harm_reduction', label: 'Harm Reduction (Pengurangan Risiko)', category: 'lifestyle', icon: 'warning' },
    { id: 'relaxation_techniques', label: 'Teknik Relaksasi (Napas Dalam, Meditasi)', category: 'lifestyle', icon: 'brain' },
    { id: 'sun_protection', label: 'Gunakan Tabir Surya / Lindungi dari Matahari', category: 'prevention', icon: 'sun' },
    { id: 'uv_protection', label: 'Lindungi Kulit dari Sinar UV', category: 'prevention', icon: 'sun' },
    { id: 'outdoor_activity', label: 'Aktivitas Luar Ruangan yang Cukup', category: 'lifestyle', icon: 'sun' },
    { id: 'sexual_abstinence', label: 'Hindari Hubungan Seksual Selama Pengobatan', category: 'prevention', icon: 'heart' },
    { id: 'barrier_protection', label: 'Gunakan Proteksi Barrier', category: 'prevention', icon: 'heart' },
    { id: 'sti_prevention', label: 'Pencegahan Infeksi Menular Seksual', category: 'prevention', icon: 'heart' },
    { id: 'avoid_prolonged_sitting', label: 'Hindari Duduk Terlalu Lama', category: 'lifestyle', icon: 'chair' },
    { id: 'avoid_stairs', label: 'Hindari Naik Tangga Berlebihan', category: 'lifestyle', icon: 'warning' },
    { id: 'posture_correction', label: 'Perbaiki Postur Tubuh', category: 'lifestyle', icon: 'chair' },
    { id: 'ergonomic_workspace', label: 'Atur Meja Kerja Ergonomis', category: 'lifestyle', icon: 'chair' },
    { id: 'proper_lifting_technique', label: 'Angkat Beban dengan Teknik Benar', category: 'lifestyle', icon: 'warning' },
    { id: 'proper_footwear', label: 'Gunakan Alas Kaki yang Tepat', category: 'lifestyle', icon: 'shoe' },
    { id: 'use_protective_gear', label: 'Gunakan Alat Pelindung Diri (APD)', category: 'prevention', icon: 'shield' },

    // --- EXERCISES & PHYSICAL THERAPY ---
    { id: 'stretching_exercises', label: 'Latihan Peregangan / Stretching', category: 'activity', icon: 'run' },
    { id: 'back_exercises', label: 'Latihan Penguatan Otot Punggung', category: 'activity', icon: 'run' },
    { id: 'pelvic_floor_exercise', label: 'Latihan Otot Dasar Panggul', category: 'activity', icon: 'run' },
    { id: 'joint_protection', label: 'Lindungi Sendi dari Beban Berlebih', category: 'activity', icon: 'warning' },
    { id: 'mobilization_restriction', label: 'Batasi Gerakan / Mobilisasi', category: 'activity', icon: 'warning' },

    // --- DIABETES-SPECIFIC ---
    { id: 'diabetes_control', label: 'Kontrol Gula Darah yang Baik', category: 'compliance', icon: 'lab' },
    { id: 'dm_management', label: 'Manajemen Diabetes Mellitus', category: 'compliance', icon: 'lab' },
    { id: 'dm_control_important', label: 'Kontrol Gula Darah Penting untuk Penyembuhan', category: 'compliance', icon: 'lab' },
    { id: 'glucometer_home', label: 'Pantau Gula Darah Mandiri di Rumah', category: 'compliance', icon: 'lab' },
    { id: 'insulin_education', label: 'Edukasi Penggunaan Insulin', category: 'compliance', icon: 'syringe' },
    { id: 'insulin_dose_education', label: 'Edukasi Dosis dan Penyuntikan Insulin', category: 'compliance', icon: 'syringe' },
    { id: 'hypo_signs_recognition', label: 'Kenali Tanda Hipoglikemia', category: 'compliance', icon: 'siren' },

    // --- CARDIAC-SPECIFIC ---
    { id: 'rate_control', label: 'Kontrol Detak Jantung (Rate Control)', category: 'compliance', icon: 'heart' },
    { id: 'nitrat_usage', label: 'Cara Penggunaan Nitrogliserin Sublingual', category: 'compliance', icon: 'pill' },
    { id: 'golden_period_pci', label: 'Golden Period untuk PCI (<12 Jam)', category: 'compliance', icon: 'siren' },
    { id: 'heart_failure_management', label: 'Manajemen Gagal Jantung', category: 'compliance', icon: 'heart' },
    { id: 'daily_weight_monitoring', label: 'Timbang Badan Harian (Pantau Retensi)', category: 'compliance', icon: 'scale' },
    { id: 'control_bp', label: 'Kontrol Tekanan Darah Secara Rutin', category: 'compliance', icon: 'heart' },

    // --- THYROID ---
    { id: 'regular_thyroid_monitoring', label: 'Kontrol Fungsi Tiroid Berkala', category: 'compliance', icon: 'lab' },

    // --- ASTHMA & RESPIRATORY ---
    { id: 'peak_flow_monitoring', label: 'Pantau Peak Flow (Arus Puncak)', category: 'compliance', icon: 'info' },
    { id: 'emergency_plan', label: 'Siapkan Rencana Darurat Asma', category: 'compliance', icon: 'info' },
    { id: 'step_up_therapy', label: 'Perlu Step-Up Terapi', category: 'compliance', icon: 'pill' },
    { id: 'nasal_spray_technique', label: 'Teknik Penggunaan Semprot Hidung yang Benar', category: 'compliance', icon: 'info' },
    { id: 'warm_saltwater_gargle', label: 'Kumur Air Garam Hangat', category: 'selfcare', icon: 'gargle' },

    // --- EYES ---
    { id: 'screen_break_20_20', label: 'Istirahat Layar 20-20-20', category: 'prevention', icon: 'eye' },
    { id: 'reading_distance', label: 'Jarak Baca yang Tepat', category: 'prevention', icon: 'eye' },
    { id: 'sit_in_front', label: 'Duduk di Depan Kelas', category: 'prevention', icon: 'eye' },
    { id: 'dont_rub_eye', label: 'Jangan Mengucek Mata', category: 'prevention', icon: 'eye' },
    { id: 'dont_swim', label: 'Hindari Berenang saat Infeksi Mata', category: 'prevention', icon: 'water' },
    { id: 'no_steroid_eye_drops', label: 'Jangan Pakai Obat Tetes Steroid Sendiri', category: 'prevention', icon: 'eye' },
    { id: 'sunglasses_outdoor', label: 'Pakai Kacamata Hitam di Luar Ruangan', category: 'prevention', icon: 'eye' },
    { id: 'contact_lens_hygiene', label: 'Jaga Kebersihan Lensa Kontak', category: 'prevention', icon: 'eye' },
    { id: 'wear_eye_protection', label: 'Pakai Pelindung Mata saat Bekerja', category: 'prevention', icon: 'eye' },
    { id: 'no_swimming', label: 'Hindari Berenang Selama Pengobatan', category: 'prevention', icon: 'water' },

    // --- ENT ---
    { id: 'no_cotton_buds', label: 'Jangan Pakai Cotton Bud di Telinga', category: 'prevention', icon: 'ear' },
    { id: 'ear_plugs_swimming', label: 'Pakai Ear Plug saat Berenang', category: 'prevention', icon: 'ear' },
    { id: 'normal_ear_wax', label: 'Serumen Telinga Itu Normal', category: 'reassurance', icon: 'ear' },
    { id: 'sit_forward', label: 'Duduk Condong ke Depan (Epistaksis)', category: 'selfcare', icon: 'info' },
    { id: 'look_at_horizon', label: 'Lihat ke Arah Horizon (Motion Sickness)', category: 'prevention', icon: 'eye' },
    { id: 'light_meal_before', label: 'Makan Ringan Sebelum Perjalanan', category: 'prevention', icon: 'food' },

    // --- SKIN-SPECIFIC ---
    { id: 'moisturizer', label: 'Gunakan Pelembab Kulit', category: 'selfcare', icon: 'skin' },
    { id: 'moisturizer_use', label: 'Rutin Gunakan Pelembab Setelah Mandi', category: 'selfcare', icon: 'skin' },
    { id: 'air_dry', label: 'Keringkan Area Kulit dengan Udara', category: 'selfcare', icon: 'skin' },

    { id: 'bulla_care', label: 'Perawatan Bula (Jangan Dipecahkan)', category: 'selfcare', icon: 'info' },
    { id: 'monitor_regrowth', label: 'Pantau Pertumbuhan Rambut Kembali', category: 'selfcare', icon: 'info' },
    { id: 'immediate_wash_after_contact', label: 'Cuci Segera Setelah Kontak Iritan', category: 'prevention', icon: 'soap' },
    { id: 'burn_unit_needed', label: 'Perlu Perawatan di Unit Luka Bakar', category: 'compliance', icon: 'siren' },
    { id: 'burn_unit_care', label: 'Perawatan Luka Bakar di RS', category: 'compliance', icon: 'info' },
    { id: 'skin_graft_likely', label: 'Kemungkinan Perlu Skin Graft', category: 'compliance', icon: 'info' },

    // --- MATERNAL & NEONATAL ---
    { id: 'exclusive_breastfeeding', label: 'ASI Eksklusif 6 Bulan', category: 'maternal', icon: 'baby' },
    { id: 'proper_latch_technique', label: 'Teknik Menyusui yang Benar', category: 'maternal', icon: 'baby' },
    { id: 'empty_breast', label: 'Kosongkan Payudara Secara Teratur', category: 'maternal', icon: 'baby' },
    { id: 'apply_breastmilk_on_nipple', label: 'Olesi ASI pada Puting yang Lecet', category: 'maternal', icon: 'baby' },
    { id: 'hoffman_exercise', label: 'Latihan Hoffman untuk Puting Datar', category: 'maternal', icon: 'baby' },
    { id: 'nipple_stimulation', label: 'Stimulasi Puting untuk Menyusui', category: 'maternal', icon: 'baby' },
    { id: 'alternative_feeding', label: 'Metode Menyusui Alternatif (Cup/Spoon)', category: 'maternal', icon: 'baby' },
    { id: 'postpartum_care', label: 'Perawatan Pasca Persalinan', category: 'maternal', icon: 'baby' },
    { id: 'immediate_delivery', label: 'Persalinan Segera Diperlukan', category: 'maternal', icon: 'siren' },
    { id: 'delivery_may_needed', label: 'Kemungkinan Perlu Persalinan Segera', category: 'maternal', icon: 'siren' },
    { id: 'complete_evacuation', label: 'Perlu Evakuasi Sisa Konsepsi', category: 'maternal', icon: 'info' },
    { id: 'curettage_needed', label: 'Perlu Tindakan Kuretase', category: 'maternal', icon: 'info' },
    { id: 'contraception_counseling', label: 'Konseling Kontrasepsi', category: 'maternal', icon: 'heart' },
    { id: 'maturity_assessment_needed', label: 'Perlu Asesmen Maturitas Janin', category: 'maternal', icon: 'info' },
    { id: 'genital_hygiene', label: 'Jaga Kebersihan Genital', category: 'hygiene', icon: 'heart' },
    { id: 'posyandu_routine', label: 'Kunjungi Posyandu Secara Rutin', category: 'maternal', icon: 'calendar' },
    { id: 'monitor_breathing', label: 'Pantau Pola Napas Bayi', category: 'maternal', icon: 'baby' },
    { id: 'apnea_risk_neonate', label: 'Waspadai Risiko Apnea pada Neonatus', category: 'maternal', icon: 'siren' },
    { id: 'always_retract_foreskin_back', label: 'Selalu Kembalikan Kulup ke Posisi Semula', category: 'selfcare', icon: 'info' },

    // --- PSYCHIATRIC ---
    { id: 'psychiatric_emergency', label: 'Ini Kedaruratan Psikiatri', category: 'compliance', icon: 'siren' },
    { id: 'suicidal_hotline', label: 'Hubungi Hotline Bunuh Diri jika Butuh Bantuan', category: 'compliance', icon: 'phone' },
    { id: 'psychotherapy_needed', label: 'Perlu Psikoterapi', category: 'compliance', icon: 'brain' },
    { id: 'family_psychoeducation', label: 'Edukasi Keluarga tentang Kondisi Pasien', category: 'compliance', icon: 'family' },
    { id: 'mood_stabilizer_needed', label: 'Perlu Obat Penstabil Mood', category: 'compliance', icon: 'pill' },
    { id: 'immunosuppressant_needed', label: 'Perlu Obat Imunosupresan', category: 'compliance', icon: 'pill' },
    { id: 'never_use_offending_drug', label: 'Jangan Pernah Pakai Lagi Obat Penyebab Alergi', category: 'prevention', icon: 'warning' },
    { id: 'drug_allergy_card', label: 'Bawa Kartu Alergi Obat', category: 'prevention', icon: 'card' },

    // --- MUSCULOSKELETAL ---
    { id: 'no_massage', label: 'Jangan Dipijat/Diurut', category: 'prevention', icon: 'warning' },
    { id: 'tetanus_status', label: 'Periksa Status Imunisasi Tetanus', category: 'compliance', icon: 'syringe' },
    { id: 'immunization_tt', label: 'Vaksinasi TT Sesuai Jadwal', category: 'compliance', icon: 'syringe' },
    { id: '6_hour_window', label: 'Golden Period Luka: 6 Jam Pertama', category: 'compliance', icon: 'clock' },

    // --- MONITORING & MISC ---
    { id: 'electrolyte_monitoring', label: 'Pantau Elektrolit Secara Berkala', category: 'compliance', icon: 'lab' },
    { id: 'pathology_check_basis', label: 'Periksa Patologi Anatomi', category: 'compliance', icon: 'lab' },
    { id: 'blood_transfusion_needed', label: 'Mungkin Perlu Transfusi Darah', category: 'compliance', icon: 'info' },
    { id: 'blood_transfusion_if_needed', label: 'Transfusi Darah Jika Diperlukan', category: 'compliance', icon: 'info' },
    { id: 'mosquito_protection', label: 'Lindungi dari Gigitan Nyamuk', category: 'prevention', icon: 'bug' },
    { id: 'fever_management', label: 'Manajemen Demam (Kompres + Parasetamol)', category: 'selfcare', icon: 'thermometer' },
    { id: 'hygiene', label: 'Jaga Kebersihan Diri', category: 'hygiene', icon: 'shower' },
    { id: 'hygiene_education', label: 'Edukasi Kebersihan dan Sanitasi', category: 'hygiene', icon: 'shower' },
    { id: 'treat_underlying_cause', label: 'Obati Penyebab yang Mendasari', category: 'compliance', icon: 'info' },
    { id: 'early_detection_important', label: 'Deteksi Dini Sangat Penting', category: 'compliance', icon: 'info' },
    { id: 'avoid_unnecessary_tests', label: 'Hindari Pemeriksaan yang Tidak Perlu', category: 'compliance', icon: 'info' },
    { id: 'lid_scrub_routine', label: 'Rutin Scrub Kelopak Mata', category: 'selfcare', icon: 'eye' },
    { id: 'acute_attack_care', label: 'Tatalaksana Serangan Akut', category: 'selfcare', icon: 'info' },
    { id: 'reduce_ac', label: 'Kurangi Penggunaan AC Berlebihan', category: 'prevention', icon: 'home' },
    { id: 'no_flying', label: 'Dilarang Terbang Selama Kondisi Ini', category: 'prevention', icon: 'warning' },
    { id: 'chest_tube_at_hospital', label: 'Perlu Pemasangan Chest Tube di RS', category: 'compliance', icon: 'info' },
    { id: 'tension_pneumothorax_risk', label: 'Waspadai Tension Pneumothorax', category: 'compliance', icon: 'siren' },
    { id: 'thoracocentesis_needed', label: 'Perlu Torakosintesis di RS', category: 'compliance', icon: 'info' },
    { id: 'tb_evaluation', label: 'Evaluasi Kemungkinan TB', category: 'compliance', icon: 'info' },
    { id: 'fluid_analysis', label: 'Perlu Analisis Cairan', category: 'compliance', icon: 'lab' },


    // ═══════════════════════════════════════════════════════════════
    // MAIA CROSS-VALIDATION — Missing Education Entries (v4)
    // ═══════════════════════════════════════════════════════════════

    // --- OBSERVASI & MONITORING ---
    { id: '24h_observation', label: 'Observasi 24 Jam Pasca Kejadian', category: 'compliance', icon: 'clock' },
    { id: 'daily_platelet_check', label: 'Cek Trombosit Harian', category: 'compliance', icon: 'lab' },
    { id: 'serial_liver_function', label: 'Cek Fungsi Hati Berkala', category: 'compliance', icon: 'lab' },
    { id: 'chronic_monitoring', label: 'Pemantauan Jangka Panjang Diperlukan', category: 'compliance', icon: 'calendar' },
    { id: 'icu_monitoring', label: 'Perlu Pemantauan ICU', category: 'compliance', icon: 'siren' },
    { id: 'fluid_intake_monitor', label: 'Pantau Asupan Cairan', category: 'compliance', icon: 'water' },

    // --- TANDA BAHAYA / WARNING SIGNS ---
    { id: 'warning_signs', label: 'Kenali Tanda Bahaya Umum', category: 'compliance', icon: 'siren' },
    { id: 'warning_signs_dhf', label: 'Waspadai Tanda Bahaya DBD', category: 'compliance', icon: 'siren' },
    { id: 'emergency_signs', label: 'Kenali Tanda Darurat — Segera ke RS', category: 'compliance', icon: 'siren' },
    { id: 'danger_signs_neonate', label: 'Tanda Bahaya Bayi Baru Lahir', category: 'compliance', icon: 'siren' },
    { id: 'perforation_risk', label: 'Risiko Perforasi — Segera Operasi', category: 'compliance', icon: 'siren' },
    { id: 'strangulation_risk', label: 'Risiko Strangulasi Usus', category: 'compliance', icon: 'siren' },
    { id: 'respiratory_failure_risk', label: 'Risiko Gagal Napas — Monitor Ketat', category: 'compliance', icon: 'siren' },
    { id: 'secondary_drowning_risk', label: 'Risiko Drowning Sekunder (Edema Paru Lambat)', category: 'compliance', icon: 'siren' },
    { id: 'red_flag_cauda_equina', label: 'Waspadai Sindrom Cauda Equina', category: 'compliance', icon: 'siren' },

    // --- GAYA HIDUP & PENCEGAHAN ---
    { id: 'adequate_sleep', label: 'Tidur Cukup & Teratur', category: 'lifestyle', icon: 'bed' },
    { id: 'adequate_water', label: 'Minum Air Putih Cukup', category: 'diet', icon: 'water' },
    { id: 'avoid_allergen', label: 'Hindari Alergen yang Diketahui', category: 'prevention', icon: 'warning' },
    { id: 'allergen_avoidance', label: 'Identifikasi & Hindari Pemicu Alergi', category: 'prevention', icon: 'warning' },
    { id: 'avoid_culprit_drug', label: 'Hentikan Obat yang Dicurigai', category: 'compliance', icon: 'pill' },
    { id: 'avoid_excessive_sweating', label: 'Hindari Keringat Berlebihan', category: 'prevention', icon: 'thermometer' },
    { id: 'avoid_freshwater_contact', label: 'Hindari Kontak Air Tawar Tercemar', category: 'prevention', icon: 'water' },
    { id: 'avoid_heavy_lifting', label: 'Hindari Mengangkat Berat', category: 'lifestyle', icon: 'warning' },
    { id: 'avoid_oxidant_drugs', label: 'Hindari Obat Oksidan (G6PD)', category: 'compliance', icon: 'pill' },
    { id: 'avoid_shaving_irritation', label: 'Hindari Mencukur Area yang Teriritasi', category: 'prevention', icon: 'skin' },
    { id: 'avoid_straining', label: 'Hindari Mengejan Berlebihan', category: 'lifestyle', icon: 'warning' },
    { id: 'avoid_trigger_food', label: 'Hindari Makanan Pemicu', category: 'diet', icon: 'food' },
    { id: 'avoid_dead_animal', label: 'Hindari Kontak Hewan Mati', category: 'prevention', icon: 'warning' },
    { id: 'cool_environment', label: 'Jaga Lingkungan Tetap Sejuk', category: 'prevention', icon: 'fan' },
    { id: 'cotton_clothes', label: 'Gunakan Pakaian Katun Menyerap Keringat', category: 'prevention', icon: 'shirt' },
    { id: 'clean_bedding', label: 'Jaga Kebersihan Sprei & Tempat Tidur', category: 'prevention', icon: 'bed' },
    { id: 'short_nails', label: 'Potong Kuku Pendek', category: 'prevention', icon: 'hand' },
    { id: 'air_dry_skin', label: 'Keringkan Kulit dengan Angin/Pat Dry', category: 'prevention', icon: 'skin' },

    // --- PERAWATAN KULIT & WAJAH ---
    { id: 'face_wash_routine', label: 'Cuci Muka 2x Sehari dengan Cleanser Lembut', category: 'selfcare', icon: 'skin' },
    { id: 'non_comedogenic_cosmetics', label: 'Gunakan Kosmetik Non-Komedogenik', category: 'prevention', icon: 'skin' },
    { id: 'regular_shampoo', label: 'Keramas Rutin dengan Shampo Antijamur', category: 'selfcare', icon: 'skin' },

    // --- KEBERSIHAN MATA ---
    { id: 'eye_care', label: 'Perawatan Mata (Tetes Air Mata Buatan)', category: 'selfcare', icon: 'eye' },
    { id: 'eye_hygiene', label: 'Jaga Kebersihan Mata', category: 'prevention', icon: 'eye' },
    { id: 'discard_tissue', label: 'Buang Tisu Bekas Langsung ke Tempat Sampah', category: 'prevention', icon: 'hand' },
    { id: 'dont_share_towel', label: 'Jangan Berbagi Handuk/Alat Pribadi', category: 'prevention', icon: 'warning' },

    // --- NEURO / STROKE / EPILEPSI ---
    { id: 'golden_period', label: 'Penting: Golden Period Stroke (< 4.5 Jam)', category: 'compliance', icon: 'siren' },
    { id: 'urgent_ct_scan', label: 'Perlu CT Scan Segera', category: 'compliance', icon: 'info' },
    { id: 'do_not_lower_bp_aggressively', label: 'Jangan Turunkan TD Terlalu Agresif', category: 'compliance', icon: 'warning' },
    { id: 'seizure_safety', label: 'Keamanan Saat Kejang — Jangan Masukkan Apapun ke Mulut', category: 'selfcare', icon: 'info' },
    { id: 'driving_restriction', label: 'Larangan Mengemudi Selama Terapi', category: 'compliance', icon: 'warning' },
    { id: 'facial_exercise', label: 'Latihan Otot Wajah', category: 'selfcare', icon: 'face' },
    { id: 'prognosis_good', label: 'Prognosis Baik — Mayoritas Sembuh Total', category: 'compliance', icon: 'heart' },
    { id: 'caregiver_support', label: 'Dukungan Caregiver/Keluarga', category: 'compliance', icon: 'family' },
    { id: 'safety_at_home', label: 'Keamanan Rumah untuk Pasien', category: 'prevention', icon: 'home' },
    { id: 'ivig_at_hospital', label: 'Perlu IVIG di Rumah Sakit', category: 'compliance', icon: 'info' },
    { id: 'contact_tracing', label: 'Pelacakan Kontak Diperlukan', category: 'compliance', icon: 'family' },
    { id: 'urgent_lp_at_hospital', label: 'Perlu Lumbal Pungsi Segera di RS', category: 'compliance', icon: 'info' },
    { id: 'lifestyle_mod', label: 'Modifikasi Gaya Hidup (Tidur, Stres, Kafein)', category: 'lifestyle', icon: 'heart' },

    // --- MUSKULOSKELETAL / CARPAL TUNNEL ---
    { id: 'ergonomic_work', label: 'Atur Posisi Kerja Ergonomis', category: 'lifestyle', icon: 'work' },
    { id: 'rest_breaks', label: 'Istirahat Berkala Saat Kerja Repetitif', category: 'lifestyle', icon: 'clock' },
    { id: 'wrist_splint_night', label: 'Gunakan Splint Pergelangan Malam Hari', category: 'selfcare', icon: 'hand' },
    { id: 'emg_referral', label: 'Perlu Rujukan EMG/NCV', category: 'compliance', icon: 'info' },
    { id: 'proper_posture', label: 'Jaga Postur Tubuh yang Benar', category: 'lifestyle', icon: 'body' },
    { id: 'mri_referral', label: 'Perlu Rujukan MRI', category: 'compliance', icon: 'info' },

    // --- HEMATOLOGI ---
    { id: 'blood_sugar_control', label: 'Kontrol Gula Darah Ketat', category: 'compliance', icon: 'lab' },
    { id: 'daily_foot_inspection', label: 'Periksa Kaki Setiap Hari', category: 'selfcare', icon: 'foot' },
    { id: 'foot_care_diabetic', label: 'Perawatan Kaki Diabetes', category: 'selfcare', icon: 'foot' },
    { id: 'g6pd_testing', label: 'Perlu Tes G6PD', category: 'compliance', icon: 'lab' },
    { id: 'hematology_referral', label: 'Rujuk ke Spesialis Hematologi', category: 'compliance', icon: 'info' },
    { id: 'transfusion_if_severe', label: 'Transfusi Jika Berat', category: 'compliance', icon: 'info' },
    { id: 'transfusion_may_needed', label: 'Mungkin Perlu Transfusi', category: 'compliance', icon: 'info' },
    { id: 'no_nsaids', label: 'Hindari NSAID (Ibuprofen, Aspirin)', category: 'compliance', icon: 'pill' },
    { id: 'long_term_therapy', label: 'Terapi Jangka Panjang Diperlukan', category: 'compliance', icon: 'pill' },
    { id: 'chronic_autoimmune', label: 'Penyakit Autoimun Kronis — Perlu Kontrol Rutin', category: 'compliance', icon: 'info' },
    { id: 'dmard_needed', label: 'Perlu DMARD (Obat Anti-Rematik)', category: 'compliance', icon: 'pill' },
    { id: 'rheumatology_referral', label: 'Rujuk ke Spesialis Reumatologi', category: 'compliance', icon: 'info' },
    { id: 'treat_primary_infection', label: 'Obati Infeksi Primer', category: 'compliance', icon: 'pill' },
    { id: 'source_control_surgery', label: 'Kontrol Sumber Infeksi (Bedah jika perlu)', category: 'compliance', icon: 'info' },

    // --- ALERGI & ANAFILAKSIS ---
    { id: 'carry_antihistamine', label: 'Selalu Bawa Antihistamin', category: 'compliance', icon: 'pill' },
    { id: 'epipen_education', label: 'Edukasi Penggunaan Epipen', category: 'selfcare', icon: 'syringe' },
    { id: 'medic_alert_bracelet', label: 'Pakai Gelang Medic Alert', category: 'compliance', icon: 'info' },
    { id: 'bring_allergy_card', label: 'Bawa Kartu Alergi Obat', category: 'compliance', icon: 'info' },
    { id: 'inform_all_doctors', label: 'Informasikan Semua Dokter tentang Alergi', category: 'compliance', icon: 'info' },
    { id: 'seek_er_if_severe', label: 'Segera ke IGD Jika Gejala Berat', category: 'compliance', icon: 'siren' },
    { id: 'seek_er_if_swelling', label: 'Segera ke IGD Jika Ada Bengkak/Sesak', category: 'compliance', icon: 'siren' },

    // --- DIET & NUTRISI SPESIFIK ---
    { id: 'high_fiber_diet', label: 'Diet Tinggi Serat', category: 'diet', icon: 'food' },
    { id: 'diet_bratt', label: 'Diet BRATT (Pisang, Nasi, Apel, Teh, Roti)', category: 'diet', icon: 'food' },
    { id: 'elimination_diet', label: 'Diet Eliminasi untuk Identifikasi Pemicu', category: 'diet', icon: 'food' },
    { id: 'food_diary', label: 'Buat Catatan Harian Makanan', category: 'diet', icon: 'food' },
    { id: 'lactose_free_alternatives', label: 'Gunakan Alternatif Bebas Laktosa', category: 'diet', icon: 'food' },
    { id: 'no_alcohol', label: 'Hindari Alkohol', category: 'diet', icon: 'warning' },
    { id: 'no_laxatives', label: 'Jangan Gunakan Laksatif', category: 'compliance', icon: 'warning' },
    { id: 'adhesion_cause', label: 'Penyebab: Perlengketan Usus', category: 'compliance', icon: 'info' },
    { id: 'rehydration', label: 'Rehidrasi Oral (Oralit/CRO)', category: 'selfcare', icon: 'water' },

    // --- NEONATAL & PERINEUM ---
    { id: 'keep_dry_clean', label: 'Jaga Tali Pusat Kering & Bersih', category: 'selfcare', icon: 'baby' },
    { id: 'umbilical_care', label: 'Perawatan Tali Pusat', category: 'selfcare', icon: 'baby' },
    { id: 'perineal_hygiene', label: 'Jaga Kebersihan Area Perineum', category: 'prevention', icon: 'heart' },

    // --- ENDOSKOPI & RUJUKAN ---
    { id: 'endoscopy_needed', label: 'Perlu Endoskopi — Rujuk ke RS', category: 'compliance', icon: 'info' },
    { id: 'usg_referral', label: 'Perlu Rujukan USG', category: 'compliance', icon: 'info' },
    { id: 'hospital_referral', label: 'Perlu Rujukan Rumah Sakit', category: 'compliance', icon: 'info' },

    // --- OBAT & KEPATUHAN ---
    { id: 'finish_course', label: 'Habiskan Semua Obat Sesuai Resep', category: 'compliance', icon: 'pill' },
    { id: 'complete_var_schedule', label: 'Lengkapi Jadwal VAR (Vaksin Anti Rabies)', category: 'compliance', icon: 'syringe' },

    // --- INFEKSI & PELAPORAN ---
    { id: 'animal_control', label: 'Pengendalian Hewan Penular', category: 'prevention', icon: 'warning' },
    { id: 'animal_vaccination', label: 'Vaksinasi Hewan Ternak', category: 'prevention', icon: 'syringe' },
    { id: 'report_authority', label: 'Laporkan ke Dinas Kesehatan', category: 'compliance', icon: 'info' },
    { id: 'report_to_health_office', label: 'Lapor ke Puskesmas/Dinkes', category: 'compliance', icon: 'info' },
    { id: 'public_health_reporting', label: 'Pelaporan Kesehatan Masyarakat', category: 'compliance', icon: 'info' },
    { id: 'food_safety', label: 'Keamanan Pangan — Cara Penyimpanan Benar', category: 'prevention', icon: 'food' },
    { id: 'transmission_prevention', label: 'Pencegahan Penularan', category: 'prevention', icon: 'warning' },

    // --- LEGAL & KEKERASAN ---
    { id: 'legal_rights', label: 'Hak Hukum Pasien/Korban', category: 'compliance', icon: 'info' },
    { id: 'domestic_violence_hotline', label: 'Hotline KDRT / Kekerasan', category: 'compliance', icon: 'phone' },
    { id: 'psychological_support', label: 'Dukungan Psikologis Tersedia', category: 'compliance', icon: 'heart' },
    { id: 'safety_planning', label: 'Rencana Keselamatan', category: 'compliance', icon: 'info' },
    { id: 'suture_removal_schedule', label: 'Jadwal Angkat Jahitan', category: 'compliance', icon: 'calendar' }
];

