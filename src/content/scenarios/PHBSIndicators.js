/**
 * @reflection
 * [IDENTITY]: PHBSIndicators.js
 * [PURPOSE]: PHBS (Perilaku Hidup Bersih dan Sehat) scoring system and indicators.
 *            Used by IKMEventEngine to evaluate village hygiene status, trigger
 *            scenarios, and track improvement from interventions.
 * [STATE]: Stable
 * [ANCHOR]: PHBS_INDICATORS
 * [DEPENDS_ON]: None
 */

// ═══════════════════════════════════════════════════════════════
// PHBS INDICATORS (10 Indikator PHBS Rumah Tangga)
// Based on Kemenkes RI guidelines
// ═══════════════════════════════════════════════════════════════

export const PHBS_INDICATORS = [
    {
        id: 'persalinan_nakes',
        name: 'Persalinan ditolong tenaga kesehatan',
        category: 'kia',
        weight: 1.0,
        description: 'Ibu bersalin di fasilitas kesehatan ditolong bidan/dokter',
        defaultScore: 0.7,
        educationTopic: 'safe_delivery'
    },
    {
        id: 'asi_eksklusif',
        name: 'ASI Eksklusif 6 bulan',
        category: 'kia',
        weight: 1.0,
        description: 'Bayi mendapat ASI saja tanpa tambahan apapun sampai 6 bulan',
        defaultScore: 0.5,
        educationTopic: 'exclusive_breastfeeding'
    },
    {
        id: 'timbang_balita',
        name: 'Penimbangan balita tiap bulan',
        category: 'kia',
        weight: 0.8,
        description: 'Balita ditimbang di Posyandu setiap bulan',
        defaultScore: 0.6,
        educationTopic: 'kms_monitoring'
    },
    {
        id: 'air_bersih',
        name: 'Menggunakan air bersih',
        category: 'sanitasi',
        weight: 1.0,
        description: 'Rumah tangga menggunakan air bersih untuk minum dan memasak',
        defaultScore: 0.65,
        educationTopic: 'clean_water'
    },
    {
        id: 'cuci_tangan_sabun',
        name: 'Mencuci tangan dengan sabun',
        category: 'hygiene',
        weight: 1.0,
        description: 'Anggota keluarga mencuci tangan pakai sabun di 5 waktu penting',
        defaultScore: 0.45,
        educationTopic: 'hand_hygiene'
    },
    {
        id: 'jamban_sehat',
        name: 'Menggunakan jamban sehat',
        category: 'sanitasi',
        weight: 1.0,
        description: 'BAB di jamban, bukan di sungai/kebun/sawah',
        defaultScore: 0.70,
        educationTopic: 'use_latrine'
    },
    {
        id: 'berantas_jentik',
        name: 'Memberantas jentik nyamuk',
        category: 'lingkungan',
        weight: 0.8,
        description: 'Melakukan PSN 3M (menguras, menutup, mengubur) secara rutin',
        defaultScore: 0.55,
        educationTopic: 'psn_3m'
    },
    {
        id: 'makan_buah_sayur',
        name: 'Makan buah dan sayur setiap hari',
        category: 'gizi',
        weight: 0.8,
        description: 'Konsumsi buah dan sayur minimal 5 porsi/hari',
        defaultScore: 0.40,
        educationTopic: 'balanced_nutrition'
    },
    {
        id: 'aktivitas_fisik',
        name: 'Aktivitas fisik setiap hari',
        category: 'gizi',
        weight: 0.6,
        description: 'Minimal 30 menit aktivitas fisik setiap hari',
        defaultScore: 0.50,
        educationTopic: 'physical_activity'
    },
    {
        id: 'tidak_merokok',
        name: 'Tidak merokok di dalam rumah',
        category: 'lingkungan',
        weight: 0.8,
        description: 'Tidak ada anggota keluarga yang merokok di dalam rumah',
        defaultScore: 0.35,
        educationTopic: 'no_smoking'
    }
];

// ═══════════════════════════════════════════════════════════════
// PHBS HOUSEHOLD CLASSIFICATION
// ═══════════════════════════════════════════════════════════════

export const PHBS_LEVELS = {
    SEHAT_1: { id: 'sehat_1', label: 'Sehat I', minScore: 0, maxScore: 25, color: '#ef4444', description: 'Kurang' },
    SEHAT_2: { id: 'sehat_2', label: 'Sehat II', minScore: 26, maxScore: 50, color: '#f59e0b', description: 'Cukup' },
    SEHAT_3: { id: 'sehat_3', label: 'Sehat III', minScore: 51, maxScore: 75, color: '#3b82f6', description: 'Baik' },
    SEHAT_4: { id: 'sehat_4', label: 'Sehat IV', minScore: 76, maxScore: 100, color: '#10b981', description: 'Sangat Baik' }
};

// ═══════════════════════════════════════════════════════════════
// EDUCATION TOPICS — Maps scenario education to displayable info
// ═══════════════════════════════════════════════════════════════

export const EDUCATION_TOPICS = {
    hand_hygiene: {
        id: 'hand_hygiene',
        title: '6 Langkah Cuci Tangan',
        category: 'hygiene',
        description: 'Cara cuci tangan yang benar menggunakan sabun dan air mengalir selama 20 detik.',
        keyMessages: [
            'Cuci tangan di 5 waktu penting: sebelum makan, setelah BAB, sebelum menyiapkan makanan, setelah bersin, setelah menyentuh hewan',
            'Gunakan sabun dan air mengalir, gosok minimal 20 detik',
            '6 langkah: telapak, punggung tangan, sela jari, kunci jari, putar ibu jari, kuku'
        ],
        phbsIndicator: 'cuci_tangan_sabun'
    },
    food_hygiene: {
        id: 'food_hygiene',
        title: 'Keamanan Pangan',
        category: 'hygiene',
        description: 'Mengolah dan menyimpan makanan dengan benar untuk mencegah keracunan.',
        keyMessages: [
            'Cuci bahan makanan sebelum diolah',
            'Masak hingga matang sempurna',
            'Simpan makanan tertutup, jangan di suhu ruang >2 jam',
            'Hindari jajanan tanpa penutup dan tanpa label BPOM'
        ],
        phbsIndicator: null
    },
    food_safety: {
        id: 'food_safety',
        title: 'Keamanan Pangan (BTP Berbahaya)',
        category: 'hygiene',
        description: 'Mengenali bahan tambahan pangan berbahaya: boraks, formalin, rhodamin B.',
        keyMessages: [
            'Waspadai makanan yang kenyal tidak wajar (boraks)',
            'Waspadai makanan yang awet berhari-hari tanpa pengawet resmi (formalin)',
            'Waspadai warna mencolok tidak wajar (rhodamin B)'
        ],
        phbsIndicator: null
    },
    use_latrine: {
        id: 'use_latrine',
        title: 'Stop BABS — Gunakan Jamban',
        category: 'sanitasi',
        description: 'Edukasi penggunaan jamban sehat untuk memutus rantai penularan penyakit.',
        keyMessages: [
            'BAB sembarangan menyebarkan kuman penyakit diare, tifoid, kolera',
            'Jamban sehat: tangki septik, tidak mencemari sumber air',
            'Bantu tetangga yang belum punya jamban — program STBM'
        ],
        phbsIndicator: 'jamban_sehat'
    },
    boil_water: {
        id: 'boil_water',
        title: 'Masak Air Sebelum Minum',
        category: 'sanitasi',
        description: 'Air sumur/sungai harus dimasak Rolling Boil minimal 1 menit.',
        keyMessages: [
            'Air jernih belum tentu aman — bisa mengandung kuman',
            'Didihkan air minimal 1 menit (rolling boil)',
            'Simpan air matang di wadah tertutup dengan keran'
        ],
        phbsIndicator: 'air_bersih'
    },
    water_treatment: {
        id: 'water_treatment',
        title: 'Pengolahan Air Bersih',
        category: 'sanitasi',
        description: 'Cara klorinasi dan penjernihan air darurat pasca banjir.',
        keyMessages: [
            'Klorinasi: 2 tetes kaporit per liter air, diamkan 30 menit',
            'Filter darurat: pasir, kerikil, arang dalam tong bertingkat',
            'Setelah banjir, sumur harus didisinfeksi sebelum digunakan lagi'
        ],
        phbsIndicator: 'air_bersih'
    },
    well_protection: {
        id: 'well_protection',
        title: 'Perlindungan Sumur',
        category: 'sanitasi',
        description: 'Cara membangun dan merawat sumur yang aman dari kontaminasi.',
        keyMessages: [
            'Jarak sumur ke septik tank minimal 10 meter',
            'Bibir sumur harus ditinggikan dan diberi penutup',
            'Periksa kualitas air sumur rutin setiap 6 bulan'
        ],
        phbsIndicator: 'air_bersih'
    },
    psn_3m: {
        id: 'psn_3m',
        title: 'PSN 3M Plus (Pemberantasan Sarang Nyamuk)',
        category: 'lingkungan',
        description: 'Menguras, Menutup, Mengubur — plus larvasida dan abate.',
        keyMessages: [
            'Menguras: bak mandi, ember, vas bunga seminggu sekali',
            'Menutup: tempat penampungan air ditutup rapat',
            'Mengubur: kaleng, ban bekas, sampah yang bisa menampung air',
            'Plus: abatisasi, ikan pemakan jentik, fogging jika perlu'
        ],
        phbsIndicator: 'berantas_jentik'
    },
    waste_management: {
        id: 'waste_management',
        title: 'Pengelolaan Sampah',
        category: 'lingkungan',
        description: 'Pilah, kelola, dan buang sampah dengan benar.',
        keyMessages: [
            'Pisahkan sampah organik dan anorganik',
            'Kompos untuk sampah organik',
            'Jangan bakar sampah plastik — hasilkan dioksin'
        ],
        phbsIndicator: null
    },
    mosquito_breeding: {
        id: 'mosquito_breeding',
        title: 'Siklus Nyamuk DBD',
        category: 'lingkungan',
        description: 'Memahami di mana nyamuk Aedes berkembang biak dan cara memutus siklusnya.',
        keyMessages: [
            'Nyamuk Aedes bertelur di air jernih yang tergenang',
            'Tempat favorit: bak mandi, pot bunga, talang air, kaleng bekas',
            'Satu nyamuk betina bisa bertelur 100-200 butir sekaligus'
        ],
        phbsIndicator: 'berantas_jentik'
    },
    immunization_importance: {
        id: 'immunization_importance',
        title: 'Pentingnya Imunisasi Lengkap',
        category: 'kia',
        description: 'Mengapa imunisasi penting dan jadwalnya.',
        keyMessages: [
            'Imunisasi mencegah penyakit berbahaya: campak, difteri, polio, TBC',
            'Efek samping ringan (demam, nyeri) = tanda tubuh membentuk kekebalan',
            'Jadwal lengkap: BCG, DPT, Polio, Campak, Hepatitis B'
        ],
        phbsIndicator: null
    },
    vaccine_safety: {
        id: 'vaccine_safety',
        title: 'Keamanan Vaksin',
        category: 'kia',
        description: 'Fakta tentang keamanan vaksin melawan hoax dan misinformasi.',
        keyMessages: [
            'Vaksin melewati uji klinis ketat sebelum disetujui BPOM',
            'MUI telah mengeluarkan fatwa halal untuk vaksin wajib',
            'Tidak ada bukti ilmiah vaksin menyebabkan autisme'
        ],
        phbsIndicator: null
    },
    herd_immunity: {
        id: 'herd_immunity',
        title: 'Kekebalan Kelompok (Herd Immunity)',
        category: 'kia',
        description: 'Konsep perlindungan komunitas melalui cakupan vaksinasi tinggi.',
        keyMessages: [
            'Kalau 95% anak divaksin, yang 5% belum juga ikut terlindungi',
            'Jika banyak yang menolak, wabah bisa muncul kembali',
            'Contoh: wabah difteri 2017 di Jawa Timur karena cakupan rendah'
        ],
        phbsIndicator: null
    },
    safe_delivery: {
        id: 'safe_delivery',
        title: 'Persalinan Aman di Faskes',
        category: 'kia',
        description: 'Mengapa persalinan harus di fasilitas kesehatan.',
        keyMessages: [
            'Komplikasi bisa terjadi mendadak, bahkan pada kehamilan normal',
            'Perdarahan pasca salin = pembunuh ibu No. 1 di Indonesia',
            'Di faskes: ada obat, infus, dan rujukan jika darurat'
        ],
        phbsIndicator: 'persalinan_nakes'
    },
    bpjs_access: {
        id: 'bpjs_access',
        title: 'Akses Layanan BPJS/JKN',
        category: 'umum',
        description: 'Hak warga untuk mendapat layanan kesehatan gratis melalui JKN.',
        keyMessages: [
            'Persalinan di puskesmas/bidan GRATIS dengan BPJS',
            'Keluarga miskin otomatis terdaftar PBI (Penerima Bantuan Iuran)',
            'Rujukan ke RS juga ditanggung setelah melalui puskesmas'
        ],
        phbsIndicator: null
    },
    partner_dukun: {
        id: 'partner_dukun',
        title: 'Kemitraan Bidan-Dukun',
        category: 'kia',
        description: 'Program kemitraan dukun beranak dengan bidan untuk persalinan aman.',
        keyMessages: [
            'Dukun boleh mendampingi secara spiritual/psikologis',
            'Bidan yang tangani persalinan medis',
            'Dukun dilatih mengenali tanda bahaya dan segera merujuk'
        ],
        phbsIndicator: 'persalinan_nakes'
    },
    exclusive_breastfeeding: {
        id: 'exclusive_breastfeeding',
        title: 'ASI Eksklusif 6 Bulan',
        category: 'kia',
        description: 'ASI saja tanpa tambahan apapun selama 6 bulan pertama.',
        keyMessages: [
            'ASI mengandung semua nutrisi yang dibutuhkan bayi 0-6 bulan',
            'Kolostrum (ASI pertama) = "vaksin alami" untuk bayi',
            'Jangan beri air putih, madu, atau pisang sebelum 6 bulan'
        ],
        phbsIndicator: 'asi_eksklusif'
    },
    complementary_feeding: {
        id: 'complementary_feeding',
        title: 'MP-ASI yang Benar',
        category: 'kia',
        description: 'Pemberian makanan pendamping ASI yang tepat mulai 6 bulan.',
        keyMessages: [
            'Mulai MP-ASI usia 6 bulan, bukan lebih dini',
            'Tekstur bertahap: lumat → lembek → tim → potong kecil',
            'Variasi makanan: karbohidrat + protein hewani + protein nabati + sayur/buah'
        ],
        phbsIndicator: null
    },
    infant_nutrition: {
        id: 'infant_nutrition',
        title: 'Gizi Bayi dan Balita',
        category: 'gizi',
        description: 'Prinsip gizi seimbang untuk bayi dan balita.',
        keyMessages: [
            '1000 Hari Pertama Kehidupan (HPK) menentukan masa depan anak',
            'Protein hewani (telur, ikan) penting untuk pertumbuhan otak',
            'Timbang rutin di Posyandu untuk deteksi dini masalah gizi'
        ],
        phbsIndicator: 'timbang_balita'
    },
    balanced_nutrition: {
        id: 'balanced_nutrition',
        title: 'Gizi Seimbang',
        category: 'gizi',
        description: 'Pola makan seimbang sesuai Pedoman Gizi Seimbang 2014.',
        keyMessages: [
            'Isi piring: 1/3 karbohidrat, 1/3 sayur, 1/6 lauk, 1/6 buah',
            'Minum air putih 8 gelas sehari',
            'Batasi gula, garam, dan lemak'
        ],
        phbsIndicator: 'makan_buah_sayur'
    },
    kms_monitoring: {
        id: 'kms_monitoring',
        title: 'Monitoring KMS/KIA',
        category: 'kia',
        description: 'Pentingnya pemantauan pertumbuhan balita di Posyandu.',
        keyMessages: [
            'Bawa balita ke Posyandu setiap bulan untuk ditimbang dan diukur',
            'Garis hijau KMS = pertumbuhan normal, merah = waspada',
            'Deteksi dini stunting dan gizi buruk menyelamatkan masa depan anak'
        ],
        phbsIndicator: 'timbang_balita'
    },
    traditional_medicine_safety: {
        id: 'traditional_medicine_safety',
        title: 'Keamanan Obat Tradisional',
        category: 'umum',
        description: 'Cara memilih obat tradisional yang aman.',
        keyMessages: [
            'Pilih jamu dengan nomor BPOM/registrasi resmi',
            'Waspadai jamu yang "cespleng" — mungkin dicampur obat kimia',
            'Jangan ganti obat dokter dengan jamu untuk penyakit kronis (DM, HT)'
        ],
        phbsIndicator: null
    },
    drug_interaction: {
        id: 'drug_interaction',
        title: 'Interaksi Obat-Jamu',
        category: 'umum',
        description: 'Potensi interaksi berbahaya antara obat medis dan jamu/herbal.',
        keyMessages: [
            'Beritahu dokter semua jamu/suplemen yang diminum',
            'Beberapa jamu bisa mengubah efek obat medis',
            'Contoh: bawang putih + warfarin = risiko perdarahan meningkat'
        ],
        phbsIndicator: null
    },
    ppe_farming: {
        id: 'ppe_farming',
        title: 'Alat Pelindung Diri (APD) Petani',
        category: 'kesja',
        description: 'APD yang harus digunakan saat menyemprot pestisida.',
        keyMessages: [
            'Masker, sarung tangan, kacamata, baju lengan panjang saat semprot',
            'Semprot searah angin, bukan melawan angin',
            'Cuci tangan dan mandi setelah semprot'
        ],
        phbsIndicator: null
    },
    pesticide_safety: {
        id: 'pesticide_safety',
        title: 'Keamanan Penggunaan Pestisida',
        category: 'kesja',
        description: 'Cara aman menggunakan, menyimpan, dan membuang pestisida.',
        keyMessages: [
            'Baca label petunjuk pemakaian',
            'Simpan pestisida jauh dari jangkauan anak dan makanan',
            'Jangan gunakan wadah pestisida untuk menyimpan air/makanan'
        ],
        phbsIndicator: null
    },
    first_aid_poisoning: {
        id: 'first_aid_poisoning',
        title: 'Pertolongan Pertama Keracunan',
        category: 'gawat_darurat',
        description: 'Langkah P3K saat menemukan orang keracunan pestisida.',
        keyMessages: [
            'Jauhkan korban dari sumber paparan',
            'Lepas pakaian yang terkontaminasi',
            'JANGAN paksa muntah — langsung bawa ke faskes'
        ],
        phbsIndicator: null
    },
    snakebite_first_aid: {
        id: 'snakebite_first_aid',
        title: 'Pertolongan Pertama Gigitan Ular',
        category: 'gawat_darurat',
        description: 'P3K yang benar saat digigit ular berbisa.',
        keyMessages: [
            'JANGAN disedot, dibelah, atau diikat keras',
            'Imobilisasi anggota tubuh yang digigit, posisi lebih rendah dari jantung',
            'Segera bawa ke faskes — catat ciri-ciri ular jika bisa'
        ],
        phbsIndicator: null
    },
    field_safety: {
        id: 'field_safety',
        title: 'Keselamatan di Sawah/Ladang',
        category: 'kesja',
        description: 'Tips keselamatan untuk petani di sawah dan ladang.',
        keyMessages: [
            'Gunakan sepatu boot saat di sawah (cegah leptospirosis)',
            'Waspadai ular saat panen — gunakan tongkat untuk mengecek rumput',
            'Bawa air minum yang cukup, hindari heat stroke'
        ],
        phbsIndicator: null
    },
    air_quality: {
        id: 'air_quality',
        title: 'Kualitas Udara & Asap',
        category: 'lingkungan',
        description: 'Dampak kabut asap dan polusi udara terhadap kesehatan.',
        keyMessages: [
            'Kabut asap menyebabkan ISPA, asma, dan iritasi mata',
            'Gunakan masker N95 saat ISPU berbahaya',
            'Batasi aktivitas luar ruangan, terutama anak, lansia, dan ibu hamil'
        ],
        phbsIndicator: null
    },
    respiratory_protection: {
        id: 'respiratory_protection',
        title: 'Perlindungan Saluran Napas',
        category: 'lingkungan',
        description: 'Cara melindungi paru-paru dari polusi dan asap.',
        keyMessages: [
            'Masker kain biasa TIDAK efektif untuk asap — gunakan N95',
            'Tutup jendela saat kualitas udara buruk',
            'Gunakan air purifier jika memungkinkan'
        ],
        phbsIndicator: null
    },
    flood_hygiene: {
        id: 'flood_hygiene',
        title: 'Higienitas Pasca Banjir',
        category: 'sanitasi',
        description: 'Langkah menjaga kesehatan setelah banjir surut.',
        keyMessages: [
            'Bersihkan rumah dengan desinfektan',
            'Jangan gunakan air sumur yang terendam banjir tanpa klorinasi',
            'Gunakan sepatu boot saat cleanup — hindari kontak air kotor'
        ],
        phbsIndicator: null
    },
    rat_control: {
        id: 'rat_control',
        title: 'Pengendalian Tikus',
        category: 'lingkungan',
        description: 'Cara mengendalikan tikus untuk mencegah leptospirosis.',
        keyMessages: [
            'Simpan makanan dalam wadah tertutup rapat',
            'Tutup lubang dan celah di dinding rumah',
            'Bersihkan area gudang beras/padi secara rutin'
        ],
        phbsIndicator: null
    },
    protective_footwear: {
        id: 'protective_footwear',
        title: 'Alas Kaki Pelindung',
        category: 'kesja',
        description: 'Pentingnya memakai sepatu boot saat kontak dengan air kotor.',
        keyMessages: [
            'Leptospirosis masuk lewat luka kecil di kaki yang terendam air kotor',
            'Gunakan sepatu boot saat banjir, bersih-bersih, atau di sawah',
            'Segera cuci kaki setelah kontak dengan air genangan'
        ],
        phbsIndicator: null
    },
    child_skin_care: {
        id: 'child_skin_care',
        title: 'Perawatan Kulit Bayi',
        category: 'kia',
        description: 'Cara merawat kulit bayi yang sensitif.',
        keyMessages: [
            'Kulit bayi sangat tipis dan sensitif — jangan dikerokin',
            'Mandi 1-2x/hari dengan air hangat, sabun lembut',
            'Jika demam: kompres hangat, bukan dikerokin atau dilap alkohol'
        ],
        phbsIndicator: null
    },
    traditional_practice_safety: {
        id: 'traditional_practice_safety',
        title: 'Keamanan Praktik Tradisional',
        category: 'umum',
        description: 'Panduan: praktik tradisional mana yang aman dan mana yang berbahaya.',
        keyMessages: [
            'Aman: doa, ruqyah, pijat lembut (dewasa), ramuan herbal ringan',
            'Bahaya: kerokan pada bayi, minum minyak tanah, memotong uvula',
            'Prinsip: jika tidak membahayakan, hormati. Jika bahaya, edukasi pelan-pelan.'
        ],
        phbsIndicator: null
    },
    severe_malnutrition: {
        id: 'severe_malnutrition',
        title: 'Gizi Buruk — Tanda & Tatalaksana',
        category: 'gizi',
        description: 'Mengenali dan menangani gizi buruk pada balita.',
        keyMessages: [
            'Tanda: BB sangat rendah, rambut kemerahan/rontok, perut buncit, edema',
            'Darurat medis: rujuk ke RS untuk terapi gizi intensif (F-75, F-100)',
            'Pencegahan: pemantauan KMS rutin + PMT untuk balita risiko'
        ],
        phbsIndicator: null
    },
    social_safety_net: {
        id: 'social_safety_net',
        title: 'Jaring Pengaman Sosial',
        category: 'umum',
        description: 'Program bantuan pemerintah untuk keluarga miskin.',
        keyMessages: [
            'PKH: Rp3 juta/tahun untuk keluarga sangat miskin',
            'BPNT: bantuan pangan non-tunai untuk membeli beras, telur, dll',
            'PBI-JKN: jaminan kesehatan gratis untuk keluarga miskin'
        ],
        phbsIndicator: null
    },
    pkh_program: {
        id: 'pkh_program',
        title: 'Program Keluarga Harapan (PKH)',
        category: 'umum',
        description: 'Program PKH dan cara mengaksesnya.',
        keyMessages: [
            'Syarat: keluarga miskin dengan ibu hamil, balita, anak sekolah, lansia, atau disabilitas',
            'Bantuan: Rp3 juta/tahun + kewajiban periksa kehamilan dan imunisasi anak',
            'Pendaftaran melalui Dinas Sosial atau RT/RW setempat'
        ],
        phbsIndicator: null
    },
    iron_rich_food: {
        id: 'iron_rich_food',
        title: 'Makanan Kaya Zat Besi',
        category: 'gizi',
        description: 'Sumber zat besi untuk mencegah dan mengatasi anemia.',
        keyMessages: [
            'Sumber hewani (heme iron): hati ayam, daging merah, telur',
            'Sumber nabati: bayam, kacang-kacangan, tempe, tahu',
            'Makan bersamaan dengan vitamin C (jeruk) untuk penyerapan optimal'
        ],
        phbsIndicator: null
    },
    menstruation_hygiene: {
        id: 'menstruation_hygiene',
        title: 'Kesehatan Menstruasi',
        category: 'kia',
        description: 'Edukasi kesehatan menstruasi untuk remaja putri.',
        keyMessages: [
            'Ganti pembalut minimal 4-6 jam sekali',
            'Menstruasi banyak + pusing + pucat = mungkin anemia, periksa Hb',
            'Tablet Fe mingguan (1 tablet/minggu) mencegah anemia pada remaja putri'
        ],
        phbsIndicator: null
    },
    anemia_awareness: {
        id: 'anemia_awareness',
        title: 'Mengenali Anemia',
        category: 'gizi',
        description: 'Tanda-tanda anemia dan cara pencegahannya.',
        keyMessages: [
            'Tanda: pucat, lemas, pusing, mudah capek, konsentrasi turun',
            'Penyebab tersering di Indonesia: kurang zat besi',
            'Cegah: makan makanan kaya besi + tablet Fe + periksa Hb rutin'
        ],
        phbsIndicator: null
    },
    mental_health: {
        id: 'mental_health',
        title: 'Kesehatan Jiwa',
        category: 'umum',
        description: 'Mengenali masalah kesehatan jiwa dan mengurangi stigma.',
        keyMessages: [
            'Gangguan jiwa bukan kutukan atau kesurupan — ini penyakit yang bisa diobati',
            'Tanda: perubahan perilaku drastis, menarik diri, halusinasi',
            'Jangan pasung — bawa ke puskesmas/RS untuk pengobatan'
        ],
        phbsIndicator: null
    },
    stress_management: {
        id: 'stress_management',
        title: 'Manajemen Stres',
        category: 'umum',
        description: 'Cara mengelola stres sehari-hari.',
        keyMessages: [
            'Olahraga ringan 30 menit/hari membantu mengurangi stres',
            'Curhat ke orang terpercaya — jangan dipendam sendiri',
            'Tidur cukup 7-8 jam dan makan teratur'
        ],
        phbsIndicator: null
    },
    no_smoking: {
        id: 'no_smoking',
        title: 'Bahaya Merokok',
        category: 'lingkungan',
        description: 'Dampak rokok terhadap perokok dan keluarga.',
        keyMessages: [
            'Asap rokok mengandung 7000 bahan kimia, 69 di antaranya penyebab kanker',
            'Perokok pasif (anak, istri) sama bahayanya',
            'Berhenti merokok: paru-paru mulai membaik dalam 2 minggu'
        ],
        phbsIndicator: 'tidak_merokok'
    },
    physical_activity: {
        id: 'physical_activity',
        title: 'Pentingnya Aktivitas Fisik',
        category: 'gizi',
        description: 'Aktivitas fisik harian untuk kesehatan.',
        keyMessages: [
            'Minimal 30 menit aktivitas sedang setiap hari',
            'Jalan kaki, bersepeda, berkebun — semua dihitung',
            'Mengurangi risiko DM, hipertensi, dan penyakit jantung'
        ],
        phbsIndicator: 'aktivitas_fisik'
    },
    mpasi: {
        id: 'mpasi',
        title: 'MP-ASI (Makanan Pendamping ASI)',
        category: 'kia',
        description: 'Panduan pemberian MP-ASI yang benar mulai usia 6 bulan.',
        keyMessages: [
            'Mulai usia 6 bulan, bukan lebih dini',
            'Bertahap: 6 bulan lumat → 9 bulan cincang → 12 bulan makanan keluarga',
            'Wajib ada protein hewani (telur, ikan, daging) setiap kali makan'
        ],
        phbsIndicator: null
    },
    respiratory_hygiene: {
        id: 'respiratory_hygiene',
        title: 'Etika Batuk & Bersin',
        category: 'hygiene',
        description: 'Cara batuk dan bersin yang benar untuk mencegah penularan.',
        keyMessages: [
            'Tutup mulut dengan siku, bukan tangan',
            'Buang tisu bekas ke tempat sampah tertutup',
            'Cuci tangan setelah batuk/bersin'
        ],
        phbsIndicator: null
    }
};

// ═══════════════════════════════════════════════════════════════
// SCORING FUNCTIONS
// ═══════════════════════════════════════════════════════════════

/**
 * Calculate PHBS score for a household (0-100)
 * @param {Object} householdData - Object with indicator IDs as keys and boolean/number values
 * @returns {{ score: number, level: Object, details: Array }}
 */
export function calculatePHBSScore(householdData) {
    let totalWeight = 0;
    let weightedScore = 0;
    const details = [];

    for (const indicator of PHBS_INDICATORS) {
        const value = householdData[indicator.id];
        const score = typeof value === 'number' ? value : (value ? 1 : 0);
        totalWeight += indicator.weight;
        weightedScore += score * indicator.weight;
        details.push({
            indicator: indicator.id,
            name: indicator.name,
            score,
            weight: indicator.weight
        });
    }

    const finalScore = totalWeight > 0 ? Math.round((weightedScore / totalWeight) * 100) : 0;

    const level = Object.values(PHBS_LEVELS).find(
        l => finalScore >= l.minScore && finalScore <= l.maxScore
    ) || PHBS_LEVELS.SEHAT_1;

    return { score: finalScore, level, details };
}

/**
 * Calculate village-wide PHBS percentage
 * @param {Array} households - Array of household PHBS data objects
 * @returns {{ averageScore: number, level: Object, stataByIndicator: Object }}
 */
export function calculateVillagePHBS(households) {
    if (!households || households.length === 0) {
        return { averageScore: 0, level: PHBS_LEVELS.SEHAT_1, statsByIndicator: {} };
    }

    const scores = households.map(h => calculatePHBSScore(h));
    const averageScore = Math.round(
        scores.reduce((sum, s) => sum + s.score, 0) / scores.length
    );

    const statsByIndicator = {};
    for (const indicator of PHBS_INDICATORS) {
        const indicatorScores = households.map(h => {
            const v = h[indicator.id];
            return typeof v === 'number' ? v : (v ? 1 : 0);
        });
        statsByIndicator[indicator.id] = {
            name: indicator.name,
            average: Math.round((indicatorScores.reduce((a, b) => a + b, 0) / indicatorScores.length) * 100),
            compliant: indicatorScores.filter(s => s >= 0.8).length,
            total: indicatorScores.length
        };
    }

    const level = Object.values(PHBS_LEVELS).find(
        l => averageScore >= l.minScore && averageScore <= l.maxScore
    ) || PHBS_LEVELS.SEHAT_1;

    return { averageScore, level, statsByIndicator };
}

/**
 * Get education topic details by ID
 * @param {string} topicId
 * @returns {Object|undefined}
 */
export function getEducationTopic(topicId) {
    return EDUCATION_TOPICS[topicId];
}
