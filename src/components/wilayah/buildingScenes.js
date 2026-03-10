/**
 * @reflection
 * [IDENTITY]: buildingScenes.js
 * [PURPOSE]: Data-driven scene definitions for building interior gameplay.
 *            Each building has stations (clickable hotspots), NPCs with dialog,
 *            and linked UKM scenarios with COM-B barriers.
 * [STATE]: New
 * [ANCHOR]: BUILDING_SCENES, GAME_ENABLED_BUILDINGS
 * [DEPENDS_ON]: constants.js
 */

// ═══════════════════════════════════════════════════════════════
// BUILDING SCENE DEFINITIONS
// ═══════════════════════════════════════════════════════════════

export const GAME_ENABLED_BUILDINGS = [
    'posyandu', 'school', 'farm', 'pustu', 'polindes',
    'pos_gizi', 'pos_ukk', 'kb_post', 'mck', 'pamsimas',
    'bank_sampah', 'balai_desa', 'market', 'warung', 'toga'
];

export const BUILDING_SCENES = {
    // ─── P0: POSYANDU ────────────────────────────────────────
    posyandu: {
        title: 'Posyandu Desa Sukamaju',
        subtitle: 'Pos Pelayanan Terpadu — Sistem 5 Meja',
        theme: { bg: 'from-teal-950 via-emerald-950 to-slate-950', accent: 'emerald', icon: '🏥' },
        ambience: 'Ruang terbuka beratap sederhana, meja-meja tertata rapi, ibu-ibu dengan anak balita mengantri.',
        stations: [
            {
                id: 'meja1', label: 'Meja 1: Pendaftaran', icon: '📋',
                normalizedBounds: { x: 0.04, y: 0.58, w: 0.16, h: 0.14 }, color: '#3b82f6', kader: '👩', warga: '👩‍👧',
                description: 'Kader mencatat identitas ibu dan anak, mengecek jadwal kunjungan.',
                position: { col: 1, row: 1 },
                actions: [
                    { id: 'register', label: 'Cek Daftar Hadir', energy: 3, xp: 10, type: 'task' },
                    { id: 'review_kms', label: 'Review KMS Sebelumnya', energy: 2, xp: 8, type: 'investigate' }
                ],
                findings: [
                    { text: 'Ada 3 anak yang sudah 2 bulan tidak datang Posyandu', severity: 'warning' },
                    { text: 'Kartu KMS sebagian besar terisi lengkap', severity: 'good' }
                ]
            },
            {
                id: 'meja2', label: 'Meja 2: Penimbangan', icon: '⚖️',
                normalizedBounds: { x: 0.24, y: 0.52, w: 0.16, h: 0.14 }, color: '#f59e0b', kader: '👩‍⚕️', warga: '👶',
                description: 'Timbang berat badan anak. Perhatikan tren pertumbuhan.',
                position: { col: 2, row: 1 },
                actions: [
                    { id: 'weigh_child', label: 'Timbang Anak', energy: 5, xp: 15, type: 'minigame', gameId: 'cek_kms' },
                    { id: 'check_height', label: 'Ukur Tinggi Badan', energy: 3, xp: 10, type: 'task' }
                ],
                findings: [
                    { text: 'BB Anak Fadli (14 bulan) turun dari 8.2kg ke 7.8kg — 2T berturut-turut! 🔴', severity: 'critical' },
                    { text: 'Anak Siti (9 bulan): BB normal, tren naik stabil', severity: 'good' }
                ]
            },
            {
                id: 'meja3', label: 'Meja 3: Pencatatan KMS', icon: '📊',
                normalizedBounds: { x: 0.44, y: 0.52, w: 0.16, h: 0.14 }, color: '#8b5cf6', kader: '👩', warga: '👩‍👦',
                description: 'Plot hasil penimbangan ke Kartu Menuju Sehat.',
                position: { col: 3, row: 1 },
                actions: [
                    { id: 'plot_kms', label: 'Plot ke KMS', energy: 3, xp: 12, type: 'task' },
                    { id: 'detect_pattern', label: 'Analisis Tren', energy: 5, xp: 20, type: 'investigate' }
                ],
                findings: [
                    { text: 'Pola "2T" (Tidak Naik 2x) terdeteksi pada 2 anak — risiko stunting!', severity: 'critical' },
                    { text: 'Grafik pertumbuhan 85% anak di jalur hijau', severity: 'good' }
                ]
            },
            {
                id: 'meja4', label: 'Meja 4: Penyuluhan', icon: '📢',
                normalizedBounds: { x: 0.64, y: 0.46, w: 0.16, h: 0.14 }, color: '#10b981', kader: '👩‍🏫', warga: '👥',
                description: 'Edukasi kesehatan untuk ibu-ibu. Topik: gizi, ASI, MPASI.',
                position: { col: 1, row: 2 },
                actions: [
                    { id: 'counsel_asi', label: 'Penyuluhan ASI Eksklusif', energy: 8, xp: 25, type: 'dialog' },
                    { id: 'demo_mpasi', label: 'Demo Pembuatan MPASI', energy: 10, xp: 30, type: 'task' },
                    { id: 'quiz', label: 'Kuis Gizi Sehat', energy: 5, xp: 20, type: 'minigame', gameId: 'tebak_sehat' }
                ],
                findings: [
                    { text: 'Bu Maryam: "Anak saya sudah dikasih pisang dari umur 3 bulan, Dok"', severity: 'warning' },
                    { text: 'Ibu-ibu antusias saat demo bubur kacang hijau', severity: 'good' }
                ]
            },
            {
                id: 'meja5', label: 'Meja 5: Pelayanan Kesehatan', icon: '💉',
                normalizedBounds: { x: 0.80, y: 0.40, w: 0.16, h: 0.14 }, color: '#ef4444', kader: '👩‍⚕️', warga: '🧸',
                description: 'Imunisasi, pemberian vitamin A, obat cacing, suplemen.',
                position: { col: 2, row: 2 },
                actions: [
                    { id: 'immunize', label: 'Imunisasi Sesuai Jadwal', energy: 8, xp: 25, type: 'task' },
                    { id: 'vit_a', label: 'Pemberian Vitamin A', energy: 3, xp: 10, type: 'task' },
                    { id: 'obat_cacing', label: 'Obat Cacing Massal', energy: 5, xp: 15, type: 'task' }
                ],
                findings: [
                    { text: 'Anak Budi (18 bulan) belum vaksin MR-2 — ibunya menolak', severity: 'critical' },
                    { text: 'Stok Vitamin A cukup untuk bulan ini', severity: 'good' }
                ]
            }
        ],
        npcs: [
            {
                id: 'kader_ayu', name: 'Bu Kader Ayu', avatar: '👩‍⚕️', role: 'Kader Posyandu',
                greeting: 'Selamat pagi Dok! Hari ini ada 15 balita yang hadir. Ada beberapa yang perlu perhatian khusus.',
                dialogs: [
                    {
                        trigger: 'auto', text: 'Dok, Fadli sudah 2 bulan BB-nya turun terus. Ibunya bilang cuma dikasih nasi sama kecap.',
                        choices: [
                            { text: 'Kita periksa langsung', action: 'focus_station', target: 'meja2' },
                            { text: 'Catat, nanti kita kunjungan rumah', action: 'add_task', target: 'home_visit_fadli' }
                        ]
                    },
                    {
                        trigger: 'meja5_done', text: 'Dok, Bu Rina menolak vaksin MR untuk anaknya. Katanya takut autis karena baca di WA.',
                        choices: [
                            { text: 'Panggil Bu Rina, saya jelaskan', action: 'start_scenario', target: 'tolak_vaksin' },
                            { text: 'Kita siapkan penyuluhan kelompok', action: 'focus_station', target: 'meja4' }
                        ]
                    }
                ]
            },
            {
                id: 'ibu_maryam', name: 'Bu Maryam', avatar: '👩', role: 'Ibu Balita',
                greeting: 'Assalamualaikum Dok, saya mau timbang si Dede.',
                dialogs: [
                    {
                        trigger: 'meja4_done', text: 'Dok, jadi MPASI itu mulai 6 bulan ya? Saya dari umur 3 bulan sudah kasih pisang...',
                        choices: [
                            { text: 'Iya Bu, saluran cerna bayi belum siap sebelum 6 bulan', action: 'educate', xp: 15 },
                            { text: 'Sebentar ya Bu, kita bahas nanti', action: 'dismiss' }
                        ]
                    }
                ]
            }
        ],
        linkedScenarios: ['stunting_deteksi', 'mpasi_salah', 'gizi_buruk_balita', 'tolak_vaksin'],
        completionReward: { xp: 100, reputation: 10, message: 'Posyandu hari ini selesai! Semua balita tertangani.' }
    },

    // ─── P1: SEKOLAH ─────────────────────────────────────────
    school: {
        title: 'SD Negeri 1 Sukamaju',
        subtitle: 'Unit Kesehatan Sekolah — Screening & Penyuluhan',
        theme: { bg: 'from-blue-950 via-indigo-950 to-slate-950', accent: 'blue', icon: '🏫' },
        ambience: 'Halaman sekolah yang ramai. Suara anak-anak bermain. Papan pengumuman di dinding.',
        stations: [
            {
                id: 'uks', label: 'UKS (Ruang Kesehatan)', icon: '🏥',
                kader: '🧑‍⚕️', warga: '🤒',
                description: 'Unit Kesehatan Sekolah. P3K, timbangan, tensi, tempat tidur periksa.',
                position: { col: 1, row: 1 },
                actions: [
                    { id: 'screening', label: 'Screening Kesehatan Siswa', energy: 8, xp: 25, type: 'minigame', gameId: 'cek_suhu' },
                    { id: 'check_anemia', label: 'Skrining Anemia Remaja Putri', energy: 10, xp: 30, type: 'investigate' },
                    { id: 'deworm', label: 'Pemberian Obat Cacing', energy: 5, xp: 15, type: 'task' }
                ],
                findings: [
                    { text: '3 siswa kelas 3 demam + ruam merah sejak 2 hari lalu 🔴', severity: 'critical' },
                    { text: '40% siswi kelas 5–6 pucat, konjungtiva anemis', severity: 'warning' },
                    { text: 'Kotak P3K perlu diisi ulang (kapas habis)', severity: 'info' }
                ]
            },
            {
                id: 'kelas', label: 'Kelas & Toilet', icon: '🏫',
                kader: '👩‍🏫', warga: '🧒',
                description: 'Ruang kelas dan fasilitas sanitasi. Inspeksi kebersihan.',
                position: { col: 2, row: 1 },
                actions: [
                    { id: 'inspect_toilet', label: 'Inspeksi Toilet & Sabun', energy: 5, xp: 15, type: 'minigame', gameId: 'inspeksi_kilat' },
                    { id: 'cuci_tangan_demo', label: 'Demo Cuci Tangan 6 Langkah', energy: 8, xp: 25, type: 'minigame', gameId: 'cuci_tangan' },
                    { id: 'check_ventilation', label: 'Cek Ventilasi Ruangan', energy: 4, xp: 12, type: 'investigate' }
                ],
                findings: [
                    { text: 'Toilet tanpa sabun! 🔴 Hanya 1 dari 4 toilet ada sabun cuci tangan.', severity: 'critical' },
                    { text: 'Ventilasi kelas 2A tertutup gordyn tebal — pengap', severity: 'warning' },
                    { text: 'Poster 6 langkah cuci tangan sudah pudar, perlu diganti', severity: 'info' }
                ]
            },
            {
                id: 'kantin', label: 'Kantin Sekolah', icon: '🍜',
                kader: '👩‍🍳', warga: '🍱',
                description: 'Warung jajanan di area sekolah. Periksa keamanan pangan.',
                position: { col: 3, row: 1 },
                actions: [
                    { id: 'food_inspect', label: 'Inspeksi Keamanan Pangan', energy: 8, xp: 25, type: 'minigame', gameId: 'inspeksi_kilat' },
                    { id: 'check_water', label: 'Tes Air Minum Sekolah', energy: 5, xp: 15, type: 'investigate' },
                    { id: 'healthy_menu', label: 'Susun Menu Jajanan Sehat', energy: 6, xp: 20, type: 'task' }
                ],
                findings: [
                    { text: 'Es sirup pakai pewarna tekstil! Warna terlalu mencolok.', severity: 'critical' },
                    { text: 'Makanan tidak ditutup, lalat hinggap', severity: 'warning' },
                    { text: 'Bu Warung bersedia ikut pelatihan food safety', severity: 'good' }
                ]
            },
            {
                id: 'lapangan_sekolah', label: 'Lapangan & Halaman', icon: '⚽',
                kader: '👨‍🏫', warga: '⚽',
                description: 'Area bermain anak. Cek genangan air, sampah, dan sarang nyamuk.',
                position: { col: 2, row: 2 },
                actions: [
                    { id: 'jentik_check', label: 'Survei Jentik di Genangan', energy: 5, xp: 15, type: 'minigame', gameId: 'survei_jentik' },
                    { id: 'clean_trash', label: 'Koordinasi Kerja Bakti', energy: 6, xp: 18, type: 'task' }
                ],
                findings: [
                    { text: 'Ban bekas di belakang gudang penuh jentik Aedes!', severity: 'critical' },
                    { text: 'Halaman bersih, sudah disapu anak piket pagi ini', severity: 'good' }
                ]
            }
        ],
        npcs: [
            {
                id: 'guru_sri', name: 'Bu Guru Sri', avatar: '👩‍🏫', role: 'Guru & Pembina UKS',
                greeting: 'Dok! Syukurlah Anda datang. Ada 3 anak kelas 3 yang demam dan muncul ruam merah.',
                dialogs: [
                    {
                        trigger: 'auto', text: 'Dok, ini mirip campak bukan? Saya khawatir menular ke anak lain. Bulan lalu ada ortu yang tolak vaksin MR.',
                        choices: [
                            { text: 'Saya periksa dulu anak-anaknya', action: 'focus_station', target: 'uks' },
                            { text: 'Tolong kumpulkan data vaksinasi semua siswa', action: 'add_task', target: 'data_vaksin' }
                        ]
                    }
                ]
            },
            {
                id: 'penjaga_kantin', name: 'Bu Warung', avatar: '👩‍🍳', role: 'Penjaga Kantin',
                greeting: 'Mau beli apa Dok? Es sirupnya segar lho!',
                dialogs: [
                    {
                        trigger: 'kantin_inspected', text: 'Dok, saya memang pakai pewarna itu karena murah. Kalau harus ganti pewarna makanan, harganya naik...',
                        choices: [
                            { text: 'Pewarna tekstil berbahaya, saya bantu carikan alternatif', action: 'educate', xp: 20 },
                            { text: 'Harus diganti segera, ini membahayakan anak-anak', action: 'enforce', xp: 15 }
                        ]
                    }
                ]
            }
        ],
        linkedScenarios: ['cuci_tangan', 'anemia_remaja', 'bc_sth_cacingan'],
        completionReward: { xp: 120, reputation: 12, message: 'Inspeksi sekolah selesai! Laporan dikirim ke Dinas Kesehatan.' }
    },

    // ─── P1: FARM ────────────────────────────────────────────
    farm: {
        title: 'Lahan Pertanian Warga',
        subtitle: 'Kesehatan Kerja & Lingkungan — Inspeksi Lapangan',
        theme: { bg: 'from-amber-950 via-yellow-950 to-slate-950', accent: 'amber', icon: '🌾' },
        ambience: 'Sawah hijau membentang. Petani bekerja di antara padi. Bau tanah basah sehabis hujan.',
        stations: [
            {
                id: 'sawah', label: 'Area Persawahan', icon: '🌾',
                kader: '👨‍🌾', warga: '🌾',
                description: 'Sawah tergenang pasca-hujan. Petani bekerja tanpa APD.',
                position: { col: 1, row: 1 },
                actions: [
                    { id: 'inspect_apd', label: 'Cek Penggunaan APD Petani', energy: 5, xp: 15, type: 'minigame', gameId: 'inspeksi_kilat' },
                    { id: 'water_test', label: 'Tes Air Sawah', energy: 5, xp: 15, type: 'investigate' },
                    { id: 'counsel_boots', label: 'Edukasi Pakai Sepatu Boot', energy: 6, xp: 18, type: 'dialog' }
                ],
                findings: [
                    { text: '5 dari 8 petani bekerja tanpa alas kaki di lumpur 🔴', severity: 'critical' },
                    { text: 'Genangan air sawah positif leptospira setelah banjir minggu lalu', severity: 'critical' },
                    { text: 'Pak Tani sudah punya sepatu boot tapi "tidak nyaman"', severity: 'warning' }
                ]
            },
            {
                id: 'gudang', label: 'Gudang Pestisida & Padi', icon: '🏚️',
                kader: '👨‍🌾', warga: '🐀',
                description: 'Gudang penyimpanan. Pestisida bercampur bahan makanan. Kotoran tikus.',
                position: { col: 2, row: 1 },
                actions: [
                    { id: 'inspect_storage', label: 'Inspeksi Penyimpanan Pestisida', energy: 8, xp: 25, type: 'minigame', gameId: 'inspeksi_kilat' },
                    { id: 'rat_check', label: 'Cek Tanda-tanda Tikus', energy: 5, xp: 15, type: 'investigate' },
                    { id: 'organize', label: 'Bantu Pisahkan Penyimpanan', energy: 10, xp: 30, type: 'task' }
                ],
                findings: [
                    { text: 'Botol pestisida terbuka di sebelah karung beras! 🔴', severity: 'critical' },
                    { text: 'Kotoran tikus bertebaran di gudang padi — risiko leptospirosis', severity: 'critical' },
                    { text: 'Lubang tikus di 3 sudut gudang', severity: 'warning' }
                ]
            },
            {
                id: 'kandang', label: 'Kandang Ternak', icon: '🐄',
                kader: '👨‍🌾', warga: '🐄',
                description: 'Kandang ayam dan sapi warga. Kebersihan minimal.',
                position: { col: 3, row: 1 },
                actions: [
                    { id: 'animal_health', label: 'Cek Kesehatan Ternak', energy: 5, xp: 15, type: 'investigate' },
                    { id: 'inspect_hygiene', label: 'Inspeksi Kebersihan Kandang', energy: 5, xp: 15, type: 'minigame', gameId: 'inspeksi_kilat' },
                    { id: 'counsel_zoonosis', label: 'Edukasi Penyakit Zoonosis', energy: 8, xp: 25, type: 'dialog' }
                ],
                findings: [
                    { text: '2 ayam ditemukan mati mendadak pagi ini — curiga AI?', severity: 'critical' },
                    { text: 'Kandang terlalu dekat dengan sumur warga (< 5 meter)', severity: 'warning' },
                    { text: 'Sapi pak Joko sehat, sudah divaksinasi anthrax', severity: 'good' }
                ]
            },
            {
                id: 'tepi_sungai', label: 'Tepian Sungai', icon: '🏞️',
                description: 'Area MCK warga di sungai. Anak-anak bermain tanpa alas kaki.',
                position: { col: 2, row: 2 },
                actions: [
                    { id: 'water_quality', label: 'Tes Kualitas Air Sungai', energy: 5, xp: 15, type: 'investigate' },
                    { id: 'survey_mck', label: 'Survei Perilaku MCK', energy: 6, xp: 18, type: 'minigame', gameId: 'baca_ekspresi' },
                    { id: 'educate_leptospira', label: 'Edukasi Leptospirosis', energy: 8, xp: 25, type: 'dialog' }
                ],
                findings: [
                    { text: 'Anak-anak bermain di air coklat habis banjir — luka terbuka di kaki', severity: 'critical' },
                    { text: '3 warga masih BAB di sungai', severity: 'warning' },
                    { text: 'Sumber air minum warga hilir dari titik MCK!', severity: 'critical' }
                ]
            }
        ],
        npcs: [
            {
                id: 'pak_tani', name: 'Pak Slamet', avatar: '👨‍🌾', role: 'Ketua Kelompok Tani',
                greeting: 'Eh Dok, tumben ke sawah! Ada apa? Kemarin ada yang keracunan pestisida lagi nih.',
                dialogs: [
                    {
                        trigger: 'auto', text: 'Dok, si Jajang itu kemarin nyemprot pakai baju biasa aja. Malamnya muntah-muntah. "Dari jaman kakek juga begini Dok," katanya.',
                        choices: [
                            { text: 'Bawa saya ke Jajang, saya periksa', action: 'start_scenario', target: 'pestisida_pertanian' },
                            { text: 'Kumpulkan semua petani, kita buat aturan APD bersama', action: 'focus_station', target: 'sawah' }
                        ]
                    }
                ]
            },
            {
                id: 'bu_dewi', name: 'Bu Dewi', avatar: '👩', role: 'Warga Tepian Sungai',
                greeting: 'Dok, anak saya demam tinggi sudah 3 hari. Kakinya luka kena batu di sungai.',
                dialogs: [
                    {
                        trigger: 'tepi_sungai_visited', text: 'Anak saya memang sering main di sungai Dok, apalagi habis hujan airnya deras. Tapi saya tidak bisa larang, teman-temannya semua di sana.',
                        choices: [
                            { text: 'Demam + luka terbuka + kontak air banjir → curiga leptospirosis', action: 'start_scenario', target: 'leptospirosis_banjir' },
                            { text: 'Saya periksa di Pustu dulu, Bu', action: 'educate', xp: 15 }
                        ]
                    }
                ]
            }
        ],
        linkedScenarios: ['pestisida_pertanian', 'leptospirosis_banjir', 'bc_dbd_psn', 'banjir_diare'],
        completionReward: { xp: 130, reputation: 15, message: 'Inspeksi lapangan selesai! Rekomendasi APD dikirimkan ke kelompok tani.' }
    },

    // ─── P2: PUSTU (Puskesmas Pembantu) ─────────────────────────
    pustu: {
        title: 'Pustu Dusun Cilengkrang',
        subtitle: 'Puskesmas Pembantu — Pelayanan KIA & Pengobatan Dasar',
        theme: { bg: 'from-rose-950 via-pink-950 to-slate-950', accent: 'rose', icon: '🏩' },
        ambience: 'Bangunan sederhana satu ruang. Meja periksa, timbangan bayi, lemari obat kecil. Ibu-ibu mengantri dengan balitanya.',
        stations: [
            {
                id: 'meja_periksa', label: 'Meja Periksa ANC', icon: '🩺',
                description: 'Meja pemeriksaan ibu hamil. Tensimeter, doppler, pita LILA.',
                position: { col: 1, row: 1 },
                actions: [
                    { id: 'anc_checkup', label: 'Pemeriksaan ANC (K1-K4)', energy: 10, xp: 30, type: 'task' },
                    { id: 'lila_measure', label: 'Ukur LILA Ibu Hamil', energy: 3, xp: 10, type: 'investigate' },
                    { id: 'risk_scoring', label: 'Skoring Risiko Kehamilan', energy: 5, xp: 20, type: 'investigate' }
                ],
                findings: [
                    { text: 'Bu Yanti (G2P1, 34 minggu) — LILA 21 cm, KEK! Belum ada K3.', severity: 'critical' },
                    { text: 'Bu Ningsih (28 minggu) — TD normal, DJJ positif, tumbuh sesuai usia', severity: 'good' }
                ]
            },
            {
                id: 'pojok_kb', label: 'Pojok Konseling KB', icon: '💊',
                description: 'Area konseling KB. Alat peraga, leaflet, stok kontrasepsi.',
                position: { col: 2, row: 1 },
                actions: [
                    { id: 'kb_counsel', label: 'Konseling Metode KB', energy: 8, xp: 25, type: 'dialog' },
                    { id: 'kb_service', label: 'Pelayanan KB (Suntik/Pil)', energy: 5, xp: 15, type: 'task' },
                    { id: 'kb_stock', label: 'Cek Stok Alat Kontrasepsi', energy: 2, xp: 8, type: 'investigate' }
                ],
                findings: [
                    { text: 'Stok suntik KB 3-bulanan tinggal 5 ampul — perlu request ke gudang farmasi', severity: 'warning' },
                    { text: 'Akseptor KB aktif di dusun: 68% (target 75%)', severity: 'warning' }
                ]
            },
            {
                id: 'lemari_obat', label: 'Lemari Obat & P3K', icon: '💊',
                description: 'Persediaan obat dasar: paracetamol, amoxicillin, oralit, vitamin.',
                position: { col: 3, row: 1 },
                actions: [
                    { id: 'stock_check', label: 'Inventarisasi Obat', energy: 3, xp: 10, type: 'task' },
                    { id: 'expiry_check', label: 'Cek Obat Kedaluwarsa', energy: 5, xp: 15, type: 'investigate' }
                ],
                findings: [
                    { text: 'Amoxicillin sirup expired 2 bulan lalu! 🔴 Masih ada di rak.', severity: 'critical' },
                    { text: 'Stok oralit dan zinc cukup untuk 3 bulan', severity: 'good' }
                ]
            },
            {
                id: 'ruang_tunggu', label: 'Ruang Tunggu & Edukasi', icon: '📺',
                description: 'Area tunggu warga. Poster KIA terpampang. TV edukasi mati.',
                position: { col: 2, row: 2 },
                actions: [
                    { id: 'health_edu', label: 'Penyuluhan Tanda Bahaya Kehamilan', energy: 8, xp: 25, type: 'dialog' },
                    { id: 'update_poster', label: 'Update Poster KIA', energy: 3, xp: 10, type: 'task' }
                ],
                findings: [
                    { text: 'Poster P4K (Perencanaan Persalinan & Pencegahan Komplikasi) sudah pudar', severity: 'info' },
                    { text: 'Ibu-ibu antusias bertanya soal tanda bahaya kehamilan', severity: 'good' }
                ]
            }
        ],
        npcs: [
            {
                id: 'bidan_ema', name: 'Bidan Ema', avatar: '👩‍⚕️', role: 'Bidan Desa',
                greeting: 'Selamat pagi Dok! Hari ini ada 8 ibu hamil dan 5 akseptor KB. Bu Yanti perlu perhatian khusus.',
                dialogs: [
                    {
                        trigger: 'auto', text: 'Dok, Bu Yanti sudah 34 minggu tapi belum pernah periksa K3. LILA-nya cuma 21 cm. Saya khawatir KEK dan BBLR.',
                        choices: [
                            { text: 'Periksa langsung, kita skoring risikonya', action: 'focus_station', target: 'meja_periksa' },
                            { text: 'Catat untuk kunjungan rumah besok', action: 'add_task', target: 'home_visit_yanti' }
                        ]
                    },
                    {
                        trigger: 'lemari_obat_done', text: 'Dok, saya baru sadar ada amoxicillin sirup yang expired. Maaf, saya jarang cek tanggal kedaluwarsa.',
                        choices: [
                            { text: 'Tidak apa, mari kita buat SOP cek bulanan bersama', action: 'educate', xp: 15 },
                            { text: 'Segera pisahkan, jangan sampai terdispensing', action: 'add_task', target: 'dispose_expired' }
                        ]
                    }
                ]
            }
        ],
        linkedScenarios: ['dukun_beranak', 'anemia_remaja', 'kek_bumil'],
        completionReward: { xp: 100, reputation: 10, message: 'Supervisi Pustu selesai! Temuan dilaporkan ke Puskesmas induk.' }
    },

    // ─── P2: KB POST ─────────────────────────────────────────
    kb_post: {
        title: 'Pos KB Desa Sukamaju',
        subtitle: 'Pelayanan Keluarga Berencana & Kesehatan Reproduksi',
        theme: { bg: 'from-violet-950 via-purple-950 to-slate-950', accent: 'violet', icon: '👶' },
        ambience: 'Ruang kecil bersih di rumah kader. Poster KB dan alat peraga kontrasepsi tertata rapi.',
        stations: [
            {
                id: 'konseling', label: 'Meja Konseling', icon: '💬',
                description: 'Konseling privat tentang metode KB. Alat peraga semua metode tersedia.',
                position: { col: 1, row: 1 },
                actions: [
                    { id: 'counsel_method', label: 'Konseling Metode KB (Informed Choice)', energy: 10, xp: 30, type: 'dialog' },
                    { id: 'couple_counsel', label: 'Konseling Pasangan (Suami-Istri)', energy: 12, xp: 35, type: 'dialog' },
                    { id: 'side_effect', label: 'Konseling Efek Samping', energy: 5, xp: 15, type: 'dialog' }
                ],
                findings: [
                    { text: 'Bu Tuti (4 anak) ingin IUD tapi suami melarang — perlu couple counseling', severity: 'warning' },
                    { text: 'Remaja putri malu bertanya soal menstruasi — butuh sesi youth-friendly', severity: 'warning' }
                ]
            },
            {
                id: 'pelayanan', label: 'Area Pelayanan KB', icon: '💉',
                description: 'Tempat pemberian kontrasepsi: suntik, pil, kondom, implant.',
                position: { col: 2, row: 1 },
                actions: [
                    { id: 'inject_kb', label: 'Suntik KB (DMPA/Cyclofem)', energy: 5, xp: 15, type: 'task' },
                    { id: 'distribute_pill', label: 'Distribusi Pil KB', energy: 3, xp: 10, type: 'task' },
                    { id: 'implant_referral', label: 'Rujukan Pemasangan Implant/IUD', energy: 5, xp: 20, type: 'task' }
                ],
                findings: [
                    { text: 'Akseptor suntik 3-bulanan terbanyak (45%), tapi drop-out rate 20%', severity: 'warning' },
                    { text: 'Stok kondom cukup, distribusi rendah — stigma sosial?', severity: 'info' }
                ]
            },
            {
                id: 'data_kb', label: 'Register & Data', icon: '📊',
                description: 'Register kohort KB, data cakupan, rencana pelayanan.',
                position: { col: 3, row: 1 },
                actions: [
                    { id: 'update_register', label: 'Update Register Kohort KB', energy: 3, xp: 10, type: 'task' },
                    { id: 'analyze_dropout', label: 'Analisis Drop-out KB', energy: 8, xp: 25, type: 'investigate' },
                    { id: 'unmet_need', label: 'Identifikasi Unmet Need', energy: 8, xp: 25, type: 'investigate' }
                ],
                findings: [
                    { text: 'Unmet need KB di dusun ini: 22% (target nasional <14%)', severity: 'critical' },
                    { text: '7 PUS (Pasangan Usia Subur) belum pernah ber-KB', severity: 'warning' }
                ]
            }
        ],
        npcs: [
            {
                id: 'kader_wati', name: 'Bu Kader Wati', avatar: '👩', role: 'Kader KB/PPKBD',
                greeting: 'Dok, syukurlah ada kunjungan! Bulan ini akseptor baru cuma 2 orang. Target kita 10.',
                dialogs: [
                    {
                        trigger: 'auto', text: 'Dok, Bu Tuti mau IUD tapi suaminya keras menolak. Katanya "urusan perempuan aja." Padahal anaknya sudah 4.',
                        choices: [
                            { text: 'Undang suami untuk konseling bersama', action: 'focus_station', target: 'konseling' },
                            { text: 'Edukasi lewat pengajian/pertemuan RT', action: 'add_task', target: 'community_kb_edu' }
                        ]
                    }
                ]
            },
            {
                id: 'bu_tuti', name: 'Bu Tuti', avatar: '👩', role: 'Calon Akseptor',
                greeting: 'Dok, saya capek hamil terus. Anak saya sudah 4, yang terakhir umur 8 bulan.',
                dialogs: [
                    {
                        trigger: 'konseling_done', text: 'Jadi IUD itu aman ya Dok? Saya takut sakit dan suami takut "kerasa." Bisa jelasin ke suami saya?',
                        choices: [
                            { text: 'Tentu, saya jelaskan bahwa IUD tidak terasa oleh pasangan', action: 'educate', xp: 20 },
                            { text: 'Kita coba metode lain dulu yang suami bisa terima', action: 'focus_station', target: 'pelayanan' }
                        ]
                    }
                ]
            }
        ],
        linkedScenarios: ['dukun_beranak', 'teen_pregnancy'],
        completionReward: { xp: 100, reputation: 10, message: 'Layanan Pos KB selesai! Data unmet need dilaporkan ke PLKB.' }
    },

    // ─── P2: BALAI DESA ─────────────────────────────────────
    balai_desa: {
        title: 'Balai Desa Sukamaju',
        subtitle: 'Musyawarah Masyarakat Desa & Promosi Kesehatan',
        theme: { bg: 'from-sky-950 via-cyan-950 to-slate-950', accent: 'cyan', icon: '🏛️' },
        ambience: 'Balai pertemuan terbuka. Kursi plastik tertata, papan tulis, proyektor tua. Warga berkumpul.',
        stations: [
            {
                id: 'podium', label: 'Podium Penyuluhan', icon: '🎤',
                description: 'Podium untuk penyuluhan kesehatan massal. Alat bantu: flip chart, proyektor.',
                position: { col: 2, row: 1 },
                actions: [
                    { id: 'phbs_talk', label: 'Penyuluhan PHBS 10 Indikator', energy: 12, xp: 35, type: 'dialog' },
                    { id: 'stunting_talk', label: 'Sosialisasi Cegah Stunting', energy: 10, xp: 30, type: 'dialog' },
                    { id: 'hygiene_demo', label: 'Demo Cuci Tangan & CTPS', energy: 8, xp: 25, type: 'minigame', gameId: 'cuci_tangan' }
                ],
                findings: [
                    { text: '40 warga hadir, antusiasme tinggi saat materi stunting', severity: 'good' },
                    { text: 'Beberapa warga tidur saat presentasi — materi terlalu panjang?', severity: 'info' }
                ]
            },
            {
                id: 'meja_musrenbang', label: 'Meja Musyawarah', icon: '📋',
                description: 'Forum musyawarah perencanaan pembangunan desa bidang kesehatan.',
                position: { col: 1, row: 1 },
                actions: [
                    { id: 'propose_budget', label: 'Usulkan Anggaran Kesehatan Desa', energy: 8, xp: 30, type: 'dialog' },
                    { id: 'jamban_proposal', label: 'Proposal Pembangunan Jamban', energy: 5, xp: 20, type: 'task' },
                    { id: 'posyandu_support', label: 'Minta Dukungan Dana Posyandu', energy: 5, xp: 15, type: 'dialog' }
                ],
                findings: [
                    { text: 'Kepala Desa setuju alokasi 10% Dana Desa untuk kesehatan', severity: 'good' },
                    { text: 'RT 03 dan RT 05 belum punya jamban komunal — urgent!', severity: 'critical' }
                ]
            },
            {
                id: 'pojok_data', label: 'Pojok Data Desa', icon: '📊',
                description: 'Papan data profil kesehatan desa. Peta sebaran penyakit, grafik IKS.',
                position: { col: 3, row: 1 },
                actions: [
                    { id: 'update_profile', label: 'Update Profil Kesehatan Desa', energy: 5, xp: 15, type: 'task' },
                    { id: 'present_data', label: 'Presentasi Data ke Perangkat Desa', energy: 8, xp: 25, type: 'dialog' },
                    { id: 'map_disease', label: 'Mapping Sebaran Penyakit', energy: 5, xp: 20, type: 'investigate' }
                ],
                findings: [
                    { text: 'Data IKS belum diupdate 3 bulan — perangkat desa tidak tahu situasi terkini', severity: 'warning' },
                    { text: 'Peta menunjukkan cluster diare di RT 05 dekat sungai', severity: 'critical' }
                ]
            },
            {
                id: 'halaman', label: 'Halaman & Senam', icon: '🏃',
                description: 'Halaman luas untuk senam prolanis, kegiatan lansia, dan olahraga warga.',
                position: { col: 2, row: 2 },
                actions: [
                    { id: 'senam_prolanis', label: 'Senam Prolanis Bersama', energy: 8, xp: 20, type: 'task' },
                    { id: 'screening_lansia', label: 'Skrining Kesehatan Lansia', energy: 10, xp: 30, type: 'investigate' }
                ],
                findings: [
                    { text: 'Peserta senam lansia: 15 orang (dari 40 target) — partisipasi masih rendah', severity: 'warning' },
                    { text: 'Mbah Kartini (72 th) — TD 170/100, belum minum obat hari ini', severity: 'critical' }
                ]
            }
        ],
        npcs: [
            {
                id: 'pak_lurah', name: 'Pak Lurah Harto', avatar: '👨‍💼', role: 'Kepala Desa',
                greeting: 'Dok! Pas sekali, kita mau rapat musrenbang. Mohon masukan soal anggaran kesehatan desa.',
                dialogs: [
                    {
                        trigger: 'auto', text: 'Dok, dana desa tahun ini naik. Saya mau alokasikan untuk kesehatan tapi bingung prioritasnya apa. Jamban? Posyandu? Air bersih?',
                        choices: [
                            { text: 'Jamban dulu, Pak — 2 RT masih BAB sembarangan, ini prioritas!', action: 'focus_station', target: 'meja_musrenbang' },
                            { text: 'Saya presentasikan data dulu agar keputusan berbasis bukti', action: 'focus_station', target: 'pojok_data' }
                        ]
                    }
                ]
            },
            {
                id: 'kader_umi', name: 'Bu Kader Umi', avatar: '👩', role: 'Kader Kesehatan Desa',
                greeting: 'Dok, saya mau laporan kegiatan Posyandu dan kunjungan rumah bulan ini.',
                dialogs: [
                    {
                        trigger: 'podium_done', text: 'Dok, penyuluhannya bagus! Tapi ibu-ibu minta yang lebih praktis, kayak demo masak menu bergizi. Bisa dibantu?',
                        choices: [
                            { text: 'Ide bagus! Kita jadwalkan demo MPASI bulan depan', action: 'add_task', target: 'demo_mpasi' },
                            { text: 'Saya buatkan leaflet resep sederhana dulu', action: 'educate', xp: 15 }
                        ]
                    }
                ]
            }
        ],
        linkedScenarios: ['bab_sembarangan', 'sampah_menumpuk', 'stunting_deteksi'],
        completionReward: { xp: 120, reputation: 15, message: 'Musyawarah desa selesai! Anggaran kesehatan desa berhasil disepakati.' }
    },

    // ─── P2: MCK (Mandi Cuci Kakus) ────────────────────────
    mck: {
        title: 'Fasilitas MCK Dusun Ciburial',
        subtitle: 'Sanitasi Lingkungan — Inspeksi & Pembinaan STBM',
        theme: { bg: 'from-lime-950 via-green-950 to-slate-950', accent: 'lime', icon: '🚿' },
        ambience: 'Bangunan MCK umum di pinggir sungai. Bau kurang sedap, air menggenang, sabun tidak tersedia.',
        stations: [
            {
                id: 'jamban', label: 'Jamban / Kakus', icon: '🚽',
                description: 'Fasilitas kakus umum. Periksa kebersihan, saluran, dan tipe jamban.',
                position: { col: 1, row: 1 },
                actions: [
                    { id: 'inspect_latrine', label: 'Inspeksi Tipe Jamban (STBM Pilar 1)', energy: 5, xp: 15, type: 'minigame', gameId: 'inspeksi_kilat' },
                    { id: 'check_drainage', label: 'Cek Saluran Pembuangan', energy: 5, xp: 15, type: 'investigate' },
                    { id: 'educate_stbm', label: 'Edukasi Stop BABS', energy: 8, xp: 25, type: 'dialog' }
                ],
                findings: [
                    { text: 'Jamban tipe cemplung langsung ke sungai — tidak saniter! 🔴', severity: 'critical' },
                    { text: '2 dari 4 bilik jamban tidak ada pintunya', severity: 'warning' },
                    { text: 'Saluran grey water menggenang di halaman belakang', severity: 'warning' }
                ]
            },
            {
                id: 'tempat_cuci', label: 'Area Cuci & CTPS', icon: '🧼',
                description: 'Tempat cuci tangan dan cuci pakaian warga. Cek ketersediaan sabun.',
                position: { col: 2, row: 1 },
                actions: [
                    { id: 'ctps_check', label: 'Cek CTPS (Pilar 2 STBM)', energy: 3, xp: 10, type: 'investigate' },
                    { id: 'ctps_demo', label: 'Demo Cuci Tangan Pakai Sabun', energy: 8, xp: 25, type: 'minigame', gameId: 'cuci_tangan' },
                    { id: 'soap_supply', label: 'Sediakan Sabun & Poster', energy: 3, xp: 10, type: 'task' }
                ],
                findings: [
                    { text: 'Tidak ada sabun sama sekali di area cuci tangan! 🔴', severity: 'critical' },
                    { text: 'Ibu-ibu cuci baju langsung di sungai tanpa detergen ramah lingkungan', severity: 'warning' }
                ]
            },
            {
                id: 'sumber_air', label: 'Sumber Air Bersih', icon: '💧',
                description: 'Sumur, PAM/PAMSIMAS, atau sumber air warga. Tes kualitas.',
                position: { col: 3, row: 1 },
                actions: [
                    { id: 'water_test', label: 'Tes Kualitas Air (Pilar 3 STBM)', energy: 5, xp: 20, type: 'investigate' },
                    { id: 'chlorine_test', label: 'Tes Sisa Klor', energy: 3, xp: 10, type: 'investigate' },
                    { id: 'educate_pam', label: 'Edukasi Pengolahan Air Minum', energy: 8, xp: 25, type: 'dialog' }
                ],
                findings: [
                    { text: 'Sumur berjarak hanya 8 meter dari septik tank — risiko kontaminasi!', severity: 'critical' },
                    { text: 'Air PAMSIMAS jernih, sisa klor 0.3 mg/L (dalam batas aman)', severity: 'good' }
                ]
            },
            {
                id: 'tempat_sampah', label: 'Pengelolaan Sampah', icon: '🗑️',
                description: 'TPS (Tempat Pembuangan Sementara) dusun. Pilah organik/anorganik.',
                position: { col: 2, row: 2 },
                actions: [
                    { id: 'waste_inspect', label: 'Inspeksi Pengelolaan Sampah (Pilar 4)', energy: 5, xp: 15, type: 'minigame', gameId: 'inspeksi_kilat' },
                    { id: 'compost_educate', label: 'Edukasi Komposting Organik', energy: 8, xp: 25, type: 'dialog' },
                    { id: 'pilah_demo', label: 'Demo Pilah Sampah 3R', energy: 6, xp: 20, type: 'task' }
                ],
                findings: [
                    { text: 'Sampah organik dan anorganik tercampur, bau menyengat', severity: 'warning' },
                    { text: 'Beberapa warga sudah mulai komposting — bisa jadi champion!', severity: 'good' }
                ]
            }
        ],
        npcs: [
            {
                id: 'pak_rt', name: 'Pak RT Dadang', avatar: '👨', role: 'Ketua RT 05',
                greeting: 'Dok, syukurlah ada yang inspeksi. MCK ini memang sudah lama bermasalah.',
                dialogs: [
                    {
                        trigger: 'auto', text: 'Dok, jamban umum ini sebenarnya bantuan pemerintah 5 tahun lalu. Tapi tidak ada yang merawat. Warga bilang "yang penting ada." Gimana ya Dok?',
                        choices: [
                            { text: 'Kita bentuk kelompok perawat MCK, bagi jadwal kebersihan', action: 'add_task', target: 'form_mck_group' },
                            { text: 'Ajukan perbaikan ke Dana Desa, saya buatkan laporannya', action: 'focus_station', target: 'jamban' }
                        ]
                    }
                ]
            },
            {
                id: 'sanitarian', name: 'Pak Rifki', avatar: '👨‍🔬', role: 'Sanitarian Puskesmas',
                greeting: 'Dok, saya sudah survei awal. Ada beberapa temuan mengkhawatirkan soal jarak sumur dan septik.',
                dialogs: [
                    {
                        trigger: 'sumber_air_done', text: 'Dok, sumur ini terlalu dekat septik tank. Menurut standar minimal 10 meter, ini cuma 8. Risiko kontaminasi E. coli tinggi.',
                        choices: [
                            { text: 'Rekomendasikan pindah sumur atau upgrade ke PAMSIMAS', action: 'educate', xp: 20 },
                            { text: 'Laporkan ke Dinkes untuk tindak lanjut', action: 'add_task', target: 'report_dinkes' }
                        ]
                    }
                ]
            }
        ],
        linkedScenarios: ['bab_sembarangan', 'air_minum_tercemar', 'sampah_menumpuk'],
        completionReward: { xp: 110, reputation: 12, message: 'Inspeksi MCK selesai! Rekomendasi STBM dikirimkan ke Dinas Kesehatan.' }
    },

    // ─── P3: POS GIZI ───────────────────────────────────────
    pos_gizi: {
        title: 'Pos Pemulihan Gizi Dusun Sukamaju',
        subtitle: 'Program PMT & Tata Laksana Gizi Buruk Balita',
        theme: { bg: 'from-orange-950 via-amber-950 to-slate-950', accent: 'orange', icon: '🥣' },
        ambience: 'Ruang kecil bersih dekat Posyandu. Meja timbangan, bahan PMT, grafik pertumbuhan di dinding. Ibu-ibu dengan balita kurus mengantri.',
        stations: [
            {
                id: 'timbang_gizi', label: 'Stasiun Timbang & KMS', icon: '⚖️',
                description: 'Penimbangan khusus balita gizi kurang/buruk. Pantau BB/TB setiap minggu.',
                position: { col: 1, row: 1 },
                actions: [
                    { id: 'weigh_weekly', label: 'Timbang BB Mingguan', energy: 5, xp: 15, type: 'task' },
                    { id: 'plot_growth', label: 'Plot Grafik Pertumbuhan WHO', energy: 5, xp: 20, type: 'investigate' },
                    { id: 'lila_check', label: 'Ukur LILA Balita (Deteksi Wasting)', energy: 3, xp: 10, type: 'investigate' }
                ],
                findings: [
                    { text: 'Anak Dede (18 bulan) — BB/U: z-score -3.2 (gizi buruk!) LILA 11 cm', severity: 'critical' },
                    { text: 'Anak Santi (24 bulan) — BB naik 200g dari minggu lalu, tren positif', severity: 'good' }
                ]
            },
            {
                id: 'dapur_pmt', label: 'Dapur PMT', icon: '🍳',
                description: 'Area memasak Pemberian Makanan Tambahan. Bahan lokal: telur, tempe, sayur hijau.',
                position: { col: 2, row: 1 },
                actions: [
                    { id: 'cook_pmt', label: 'Demo Masak PMT Berbahan Lokal', energy: 10, xp: 30, type: 'task' },
                    { id: 'menu_plan', label: 'Susun Menu PMT 1 Bulan', energy: 8, xp: 25, type: 'task' },
                    { id: 'feeding_demo', label: 'Demo Responsive Feeding', energy: 8, xp: 25, type: 'dialog' }
                ],
                findings: [
                    { text: 'Bahan PMT bulan ini: 50 butir telur, 5 kg tempe, 3 kg bayam, 2 kg ubi', severity: 'good' },
                    { text: 'Bu Nani: "Anak saya nggak mau makan sayur, cuma mau mie" — perlu responsive feeding', severity: 'warning' }
                ]
            },
            {
                id: 'konseling_gizi', label: 'Konseling Gizi Ibu', icon: '📖',
                description: 'Edukasi gizi seimbang untuk ibu. Pilar gizi: ASI, MPASI, sanitasi, akses kesehatan.',
                position: { col: 3, row: 1 },
                actions: [
                    { id: 'counsel_1000hpk', label: 'Edukasi 1000 HPK (Hari Pertama Kehidupan)', energy: 8, xp: 25, type: 'dialog' },
                    { id: 'food_diary', label: 'Reviu Catatan Makan Anak', energy: 5, xp: 15, type: 'investigate' },
                    { id: 'taburia_demo', label: 'Demo Taburia (Sprinkle)', energy: 5, xp: 15, type: 'task' }
                ],
                findings: [
                    { text: 'Sebagian besar anak gizi kurang hanya makan nasi + kecap 2x sehari', severity: 'critical' },
                    { text: 'Ibu yang rutin datang PMT: anaknya naik BB rata-rata 300g/bulan', severity: 'good' }
                ]
            }
        ],
        npcs: [
            {
                id: 'ahli_gizi', name: 'Pak Gizi Andi', avatar: '👨‍⚕️', role: 'Tenaga Gizi Puskesmas',
                greeting: 'Dok, bulan ini ada 8 balita gizi kurang aktif di pos gizi. 2 di antaranya gizi buruk dan perlu penanganan intensif.',
                dialogs: [
                    {
                        trigger: 'auto', text: 'Dok, Dede (18 bulan) semakin kurus. LILA-nya tinggal 11 cm — ini sudah masuk kriteria severe wasting. Ibu bilang tidak punya uang beli lauk. Harus kita rujuk atau cukup PMT intensif?',
                        choices: [
                            { text: 'Rujuk ke TFC (Therapeutic Feeding Center) RS Kabupaten', action: 'add_task', target: 'rujuk_tfc' },
                            { text: 'PMT intensif dulu 2 minggu + pantau ketat, rujuk kalau tidak respon', action: 'focus_station', target: 'dapur_pmt' }
                        ]
                    }
                ]
            }
        ],
        linkedScenarios: ['stunting_deteksi', 'gizi_buruk_balita', 'mpasi_salah'],
        completionReward: { xp: 110, reputation: 12, message: 'Sesi Pos Gizi selesai! 8 balita gizi kurang terpantau.' }
    },

    // ─── P3: POS UKK (Upaya Kesehatan Kerja) ────────────────
    pos_ukk: {
        title: 'Pos UKK Desa Sukamaju',
        subtitle: 'Upaya Kesehatan Kerja — Skrining & Pembinaan Pekerja Informal',
        theme: { bg: 'from-yellow-950 via-orange-950 to-slate-950', accent: 'yellow', icon: '⛑️' },
        ambience: 'Pos sederhana di dekat area pertanian. Poster APD, kotak P3K, timbangan. Beberapa petani dan buruh istirahat.',
        stations: [
            {
                id: 'skrining_pekerja', label: 'Skrining Kesehatan Pekerja', icon: '🩺',
                description: 'Pemeriksaan fisik pekerja informal: tensi, spirometri sederhana, visus.',
                position: { col: 1, row: 1 },
                actions: [
                    { id: 'health_screening', label: 'Skrining Tensi & Gula Darah', energy: 8, xp: 25, type: 'task' },
                    { id: 'lung_check', label: 'Tes Fungsi Paru (Peak Flow)', energy: 5, xp: 20, type: 'investigate' },
                    { id: 'skin_check', label: 'Periksa Kulit (Dermatosis Kontak)', energy: 5, xp: 15, type: 'investigate' }
                ],
                findings: [
                    { text: '3 dari 10 petani hipertensi tidak terkontrol (tidak minum obat)', severity: 'critical' },
                    { text: 'Pak Ujang (penyemprot pestisida) — peak flow 60% prediksi, curiga PPOK', severity: 'critical' },
                    { text: '5 buruh tani punya dermatitis kontak akibat pupuk kimia', severity: 'warning' }
                ]
            },
            {
                id: 'pos_apd', label: 'Pos APD & Ergonomi', icon: '🧤',
                description: 'Distribusi dan edukasi Alat Pelindung Diri. Cek ergonomi kerja petani.',
                position: { col: 2, row: 1 },
                actions: [
                    { id: 'apd_distribute', label: 'Distribusi Masker & Sarung Tangan', energy: 5, xp: 15, type: 'task' },
                    { id: 'ergonomi_demo', label: 'Demo Posisi Kerja Ergonomis', energy: 8, xp: 25, type: 'dialog' },
                    { id: 'apd_audit', label: 'Audit Kepatuhan APD', energy: 5, xp: 20, type: 'investigate' }
                ],
                findings: [
                    { text: 'Hanya 2 dari 15 petani rutin pakai masker saat menyemprot', severity: 'critical' },
                    { text: 'Sepatu boot tersedia tapi "tidak nyaman" kata petani', severity: 'warning' },
                    { text: 'Ibu-ibu pengemas gabah: posisi membungkuk terus → nyeri pinggang kronis', severity: 'warning' }
                ]
            },
            {
                id: 'p3k_kerja', label: 'Kotak P3K & Kedaruratan', icon: '🧰',
                description: 'Pertolongan pertama kecelakaan kerja. Stok obat luka, antidotum pestisida.',
                position: { col: 3, row: 1 },
                actions: [
                    { id: 'p3k_check', label: 'Inventarisasi Kotak P3K', energy: 3, xp: 10, type: 'investigate' },
                    { id: 'first_aid_train', label: 'Pelatihan P3K untuk Kader UKK', energy: 10, xp: 30, type: 'dialog' },
                    { id: 'antidote_stock', label: 'Cek Stok Atropin & Arang Aktif', energy: 3, xp: 10, type: 'investigate' }
                ],
                findings: [
                    { text: 'Kotak P3K cuma ada betadine dan plester — tidak lengkap!', severity: 'warning' },
                    { text: 'Tidak ada antidotum pestisida di pos ini', severity: 'critical' },
                    { text: 'Kader UKK belum pernah dilatih P3K', severity: 'warning' }
                ]
            }
        ],
        npcs: [
            {
                id: 'kader_ukk', name: 'Pak Dede', avatar: '👷', role: 'Kader UKK',
                greeting: 'Dok, senang ada yang datang. Pos UKK ini sepi biasanya, petani jarang mau periksa.',
                dialogs: [
                    {
                        trigger: 'auto', text: 'Dok, Pak Ujang yang nyemprot pestisida itu sudah batuk-batuk 3 bulan. Dia bilang "biasa, batuk petani." Saya khawatir.',
                        choices: [
                            { text: 'Periksa langsung, kita tes fungsi parunya', action: 'focus_station', target: 'skrining_pekerja' },
                            { text: 'Catat, esok jadwalkan kunjungan ke sawahnya', action: 'add_task', target: 'visit_ujang' }
                        ]
                    }
                ]
            }
        ],
        linkedScenarios: ['pestisida_pertanian', 'asap_pembakaran'],
        completionReward: { xp: 100, reputation: 10, message: 'Pembinaan Pos UKK selesai! Data kesehatan pekerja dilaporkan.' }
    },

    // ─── P3: PAMSIMAS ───────────────────────────────────────
    pamsimas: {
        title: 'Instalasi PAMSIMAS Desa Sukamaju',
        subtitle: 'Penyediaan Air Minum & Sanitasi Berbasis Masyarakat',
        theme: { bg: 'from-blue-950 via-sky-950 to-slate-950', accent: 'sky', icon: '💧' },
        ambience: 'Bangunan bak penampung air dengan pompa dan pipa distribusi. Suara air mengalir. Papan pengumuman tarif air.',
        stations: [
            {
                id: 'bak_penampung', label: 'Bak Penampung & Pompa', icon: '🏗️',
                description: 'Bak penampung utama 5000L dengan pompa listrik. Periksa kondisi fisik dan kapasitas.',
                position: { col: 1, row: 1 },
                actions: [
                    { id: 'inspect_tank', label: 'Inspeksi Bak Penampung', energy: 5, xp: 15, type: 'investigate' },
                    { id: 'check_pump', label: 'Cek Kondisi Pompa', energy: 5, xp: 15, type: 'investigate' },
                    { id: 'capacity_calc', label: 'Hitung Kapasitas vs Kebutuhan', energy: 3, xp: 10, type: 'task' }
                ],
                findings: [
                    { text: 'Bak penampung retak di bawah — bocor sekitar 500L/hari', severity: 'critical' },
                    { text: 'Pompa masih berfungsi tapi sudah 8 tahun tanpa service', severity: 'warning' },
                    { text: 'Kapasitas cukup untuk 150 KK, saat ini 120 KK terdaftar', severity: 'good' }
                ]
            },
            {
                id: 'klorinasi', label: 'Unit Klorinasi & Filtrasi', icon: '🧪',
                description: 'Sistem pengolahan air: klorinasi, saringan pasir, bak sedimentasi.',
                position: { col: 2, row: 1 },
                actions: [
                    { id: 'chlorine_check', label: 'Tes Sisa Klor di Outlet', energy: 5, xp: 20, type: 'investigate' },
                    { id: 'filter_inspect', label: 'Inspeksi Saringan Pasir', energy: 5, xp: 15, type: 'investigate' },
                    { id: 'dosing_calibrate', label: 'Kalibrasi Dosis Klorin', energy: 8, xp: 25, type: 'task' }
                ],
                findings: [
                    { text: 'Sisa klor di titik terjauh: 0.1 mg/L (di bawah standar 0.2!)', severity: 'critical' },
                    { text: 'Saringan pasir terakhir diganti 2 tahun lalu — perlu pergantian', severity: 'warning' },
                    { text: 'Sistem klorinasi tetes berfungsi baik', severity: 'good' }
                ]
            },
            {
                id: 'distribusi', label: 'Jaringan Pipa Distribusi', icon: '🔧',
                description: 'Pipa PVC ke rumah warga. Periksa kebocoran, sambungan, dan meter air.',
                position: { col: 3, row: 1 },
                actions: [
                    { id: 'leak_check', label: 'Deteksi Kebocoran Pipa', energy: 8, xp: 25, type: 'investigate' },
                    { id: 'water_quality_tap', label: 'Tes Air di Kran Warga', energy: 5, xp: 20, type: 'investigate' },
                    { id: 'coverage_mapping', label: 'Mapping Cakupan Sambungan', energy: 5, xp: 15, type: 'task' }
                ],
                findings: [
                    { text: '15 KK di RT 06 belum tersambung — sumber air mereka sumur dangkal', severity: 'warning' },
                    { text: 'Air di kran Bu Ana keruh — pipa lama sudah berkarat', severity: 'warning' }
                ]
            },
            {
                id: 'pengelolaan', label: 'Kantor Pengelola BPSPAMS', icon: '📊',
                description: 'Badan Pengelola Sistem PAMSIMAS. Data keuangan, laporan kualitas air.',
                position: { col: 2, row: 2 },
                actions: [
                    { id: 'financial_review', label: 'Reviu Keuangan BPSPAMS', energy: 5, xp: 15, type: 'investigate' },
                    { id: 'quality_report', label: 'Reviu Laporan Kualitas Air Bulanan', energy: 5, xp: 15, type: 'investigate' },
                    { id: 'community_meeting', label: 'Rapat Pengelola PAMSIMAS', energy: 8, xp: 25, type: 'dialog' }
                ],
                findings: [
                    { text: 'Iuran warga tertagih 70% — tunggakan Rp 2.4 juta', severity: 'warning' },
                    { text: 'Laporan kualitas air tidak dibuat 6 bulan terakhir', severity: 'critical' }
                ]
            }
        ],
        npcs: [
            {
                id: 'ketua_bpspams', name: 'Pak Ahmad', avatar: '👨', role: 'Ketua BPSPAMS',
                greeting: 'Dok, bak penampungnya bocor sudah 3 bulan. Kami sudah mengajukan dana perbaikan ke desa tapi belum cair.',
                dialogs: [
                    {
                        trigger: 'auto', text: 'Dok, sebenarnya masalah utamanya bukan teknis — warga yang belum tersambung itu kebanyakan di daerah atas, pipa harus naik. Butuh pompa tambahan dan biaya besar.',
                        choices: [
                            { text: 'Kita carikan solusi: proposal ke Dinkes atau program DAK', action: 'focus_station', target: 'pengelolaan' },
                            { text: 'Prioritas: perbaiki bak yang bocor dulu, lalu sambung pipa bertahap', action: 'focus_station', target: 'bak_penampung' }
                        ]
                    }
                ]
            }
        ],
        linkedScenarios: ['air_minum_tercemar', 'bab_sembarangan'],
        completionReward: { xp: 100, reputation: 10, message: 'Inspeksi PAMSIMAS selesai! Rekomendasi perbaikan dikirim ke BPSPAMS dan Desa.' }
    },

    // ─── P3: BANK SAMPAH ────────────────────────────────────
    bank_sampah: {
        title: 'Bank Sampah "Berseri" Desa Sukamaju',
        subtitle: 'Pengelolaan Sampah Berbasis Masyarakat — 3R (Reduce, Reuse, Recycle)',
        theme: { bg: 'from-green-950 via-emerald-950 to-slate-950', accent: 'green', icon: '♻️' },
        ambience: 'Gudang terbuka dengan rak-rak sampah terpilah. Timbangan, karung-karung plastik bersih. Aroma daur ulang.',
        stations: [
            {
                id: 'pilah_sampah', label: 'Area Pemilahan', icon: '🗂️',
                description: 'Tempat warga menyetor dan memilah sampah: plastik, kertas, logam, kaca, organik.',
                position: { col: 1, row: 1 },
                actions: [
                    { id: 'sort_demo', label: 'Demo Pemilahan Sampah 5 Kategori', energy: 8, xp: 25, type: 'task' },
                    { id: 'weigh_record', label: 'Timbang & Catat Setoran Warga', energy: 5, xp: 15, type: 'task' },
                    { id: 'health_hazard', label: 'Identifikasi Sampah B3 (Bahan Berbahaya)', energy: 5, xp: 20, type: 'investigate' }
                ],
                findings: [
                    { text: 'Ditemukan bekas baterai dan lampu neon di tumpukan sampah umum — B3!', severity: 'critical' },
                    { text: 'Setoran plastik bulan ini naik 30% — warga mulai rajin memilah', severity: 'good' }
                ]
            },
            {
                id: 'komposting', label: 'Unit Komposting', icon: '🌱',
                description: 'Pengolahan sampah organik jadi kompos. Bak fermentasi, cacing tanah.',
                position: { col: 2, row: 1 },
                actions: [
                    { id: 'compost_check', label: 'Cek Kualitas Kompos', energy: 5, xp: 15, type: 'investigate' },
                    { id: 'vermicompost', label: 'Demo Vermikomposting (Cacing)', energy: 8, xp: 25, type: 'task' },
                    { id: 'distribute_compost', label: 'Distribusi Kompos ke Petani', energy: 5, xp: 15, type: 'task' }
                ],
                findings: [
                    { text: 'Kompos sudah matang 200 kg — siap distribusi ke petani organik', severity: 'good' },
                    { text: 'Bak fermentasi terlalu basah, ada lalat — tambahkan bahan coklat (daun kering)', severity: 'warning' }
                ]
            },
            {
                id: 'kerajinan', label: 'Workshop Kerajinan Daur Ulang', icon: '🎨',
                description: 'Ibu-ibu membuat kerajinan dari sampah plastik: tas, pot bunga, ecobrick.',
                position: { col: 3, row: 1 },
                actions: [
                    { id: 'ecobrick_demo', label: 'Demo Pembuatan Ecobrick', energy: 8, xp: 25, type: 'task' },
                    { id: 'craft_exhibit', label: 'Pameran Kerajinan Daur Ulang', energy: 5, xp: 20, type: 'task' },
                    { id: 'health_edu_3r', label: 'Edukasi: Dampak Kesehatan Sampah', energy: 8, xp: 25, type: 'dialog' }
                ],
                findings: [
                    { text: 'Tas dari bungkus kopi laku Rp 50.000/pcs di pasar online!', severity: 'good' },
                    { text: 'Ibu-ibu minta pelatihan tambahan — potensi usaha besar!', severity: 'good' }
                ]
            }
        ],
        npcs: [
            {
                id: 'bu_ketua_bs', name: 'Bu Lia', avatar: '👩', role: 'Ketua Bank Sampah',
                greeting: 'Dok! Akhirnya ada yang dari puskesmas datang. Kami mau tanya soal sampah medis — masker bekas itu masuknya ke mana?',
                dialogs: [
                    {
                        trigger: 'auto', text: 'Dok, warga mulai rajin menyetor sampah. Tapi ada yang bawa bekas baterai dan lampu neon — itu bahaya kan? Kami tidak tahu cara buangnya.',
                        choices: [
                            { text: 'Betul, itu B3! Saya buatkan SOP penanganan limbah B3 rumah tangga', action: 'educate', xp: 20 },
                            { text: 'Kita koordinasi dengan Dinkes/DLHK untuk pengangkutan B3', action: 'add_task', target: 'koordinasi_b3' }
                        ]
                    }
                ]
            }
        ],
        linkedScenarios: ['sampah_menumpuk'],
        completionReward: { xp: 100, reputation: 10, message: 'Kunjungan Bank Sampah selesai! Data setoran dan rekomendasi B3 dilaporkan.' }
    },

    // ─── P3: POLINDES ───────────────────────────────────────
    polindes: {
        title: 'Polindes (Pondok Bersalin Desa)',
        subtitle: 'Pelayanan Persalinan & Nifas di Tingkat Desa',
        theme: { bg: 'from-pink-950 via-rose-950 to-slate-950', accent: 'pink', icon: '🤱' },
        ambience: 'Rumah bidan desa yang dijadikan Polindes. Tempat tidur bersalin, partus set, lampu sorot. Bersih tapi sederhana.',
        stations: [
            {
                id: 'ruang_bersalin', label: 'Ruang Bersalin', icon: '🛏️',
                description: 'Tempat tidur persalinan normal. Partus set, heater bayi, oksitosin.',
                position: { col: 1, row: 1 },
                actions: [
                    { id: 'check_partus_set', label: 'Cek Kelengkapan Partus Set', energy: 5, xp: 15, type: 'investigate' },
                    { id: 'check_emergency', label: 'Cek Kit Darurat (Perdarahan)', energy: 5, xp: 20, type: 'investigate' },
                    { id: 'simulate_partus', label: 'Simulasi Penanganan Persalinan', energy: 10, xp: 30, type: 'minigame', gameId: 'cek_suhu' }
                ],
                findings: [
                    { text: 'Oksitosin expired! Perlu segera diganti dari gudang farmasi', severity: 'critical' },
                    { text: 'Heater bayi berfungsi baik, linen bersih', severity: 'good' },
                    { text: 'Tidak ada MgSO4 untuk kasus preeklampsia darurat', severity: 'critical' }
                ]
            },
            {
                id: 'ruang_nifas', label: 'Ruang Nifas & Laktasi', icon: '🤱',
                description: 'Area istirahat ibu pascapersalinan. Edukasi IMD dan perawatan bayi baru lahir.',
                position: { col: 2, row: 1 },
                actions: [
                    { id: 'imd_guide', label: 'Panduan Inisiasi Menyusu Dini (IMD)', energy: 8, xp: 25, type: 'dialog' },
                    { id: 'nifas_check', label: 'Pemeriksaan Ibu Nifas (KF1-KF4)', energy: 8, xp: 25, type: 'task' },
                    { id: 'newborn_check', label: 'Pemeriksaan Bayi Baru Lahir (KN1)', energy: 8, xp: 25, type: 'task' }
                ],
                findings: [
                    { text: 'Bu Rina (pascapersalinan 6 jam) — IMD berhasil! Bayi langsung menetek', severity: 'good' },
                    { text: 'Bu Dewi (nifas hari ke-3) — perdarahan sedikit tapi lochia normal', severity: 'info' }
                ]
            },
            {
                id: 'register_polindes', label: 'Register & Data Kohort', icon: '📋',
                description: 'Buku register persalinan, kartu ibu, register kohort.',
                position: { col: 3, row: 1 },
                actions: [
                    { id: 'review_kohort', label: 'Reviu Register Kohort Ibu', energy: 5, xp: 15, type: 'investigate' },
                    { id: 'plan_schedule', label: 'Jadwalkan ANC & Persalinan Bulan Depan', energy: 3, xp: 10, type: 'task' },
                    { id: 'risk_mapping', label: 'Mapping Ibu Hamil Risiko Tinggi', energy: 5, xp: 20, type: 'investigate' }
                ],
                findings: [
                    { text: '3 ibu hamil risiko tinggi (grande multi, usia >35th, riwayat SC)', severity: 'critical' },
                    { text: 'Cakupan K4 bulan ini: 85% (target 90%)', severity: 'warning' }
                ]
            }
        ],
        npcs: [
            {
                id: 'bidan_ani', name: 'Bidan Ani', avatar: '👩‍⚕️', role: 'Bidan Desa',
                greeting: 'Dok, syukurlah ada supervisi. Bulan ini saya tangani 4 persalinan, semua normal. Tapi stok obat darurat saya mulai tipis.',
                dialogs: [
                    {
                        trigger: 'auto', text: 'Dok, saya khawatir soal Bu Tini (G5P4, 40 tahun, riwayat SC). Harusnya di RS, tapi dia ngotot mau di sini. "Sudah 4 kali aman kok, Bu Bidan."',
                        choices: [
                            { text: 'Kita harus tegas: risiko ruptur uteri, harus di RS', action: 'focus_station', target: 'register_polindes' },
                            { text: 'Jelaskan risiko dengan data, ajak suami ikut konseling', action: 'add_task', target: 'counsel_tini' }
                        ]
                    }
                ]
            }
        ],
        linkedScenarios: ['dukun_beranak', 'teen_pregnancy'],
        completionReward: { xp: 110, reputation: 12, message: 'Supervisi Polindes selesai! Laporan stok dan risiko tinggi dikirim ke Puskesmas.' }
    },

    // ─── P3: MARKET (Pasar Desa) ────────────────────────────
    market: {
        title: 'Pasar Desa Sukamaju',
        subtitle: 'Keamanan Pangan & Kesehatan Lingkungan Pasar',
        theme: { bg: 'from-red-950 via-rose-950 to-slate-950', accent: 'red', icon: '🏪' },
        ambience: 'Pasar tradisional ramai. Lapak sayur-mayur, daging, ikan. Bau campuran rempah dan ikan segar. Lalat berkerumun.',
        stations: [
            {
                id: 'lapak_basah', label: 'Area Basah (Daging & Ikan)', icon: '🥩',
                description: 'Lapak daging dan ikan. Periksa suhu penyimpanan, kebersihan talenan, air pencucian.',
                position: { col: 1, row: 1 },
                actions: [
                    { id: 'meat_inspect', label: 'Inspeksi Daging (Warna, Bau, Texture)', energy: 8, xp: 25, type: 'minigame', gameId: 'inspeksi_kilat' },
                    { id: 'fish_freshness', label: 'Cek Kesegaran Ikan (Mata, Insang)', energy: 5, xp: 15, type: 'investigate' },
                    { id: 'cold_chain', label: 'Periksa Cold Chain (Suhu)', energy: 5, xp: 20, type: 'investigate' }
                ],
                findings: [
                    { text: 'Daging sapi tanpa lemari pendingin — suhu 30°C! Risiko Salmonella', severity: 'critical' },
                    { text: 'Talenan daging dan ayam sama → risiko kontaminasi silang', severity: 'critical' },
                    { text: 'Ikan dari nelayan pagi ini masih segar, mata jernih', severity: 'good' }
                ]
            },
            {
                id: 'lapak_kering', label: 'Area Kering & Jajanan', icon: '🍪',
                description: 'Lapak kue, snack, bumbu. Periksa kedaluwarsa, pewarna, pengawet.',
                position: { col: 2, row: 1 },
                actions: [
                    { id: 'additive_test', label: 'Tes Cepat BTP (Boraks, Formalin, Pewarna)', energy: 8, xp: 25, type: 'minigame', gameId: 'inspeksi_kilat' },
                    { id: 'expiry_check', label: 'Cek Tanggal Kedaluwarsa', energy: 5, xp: 15, type: 'investigate' },
                    { id: 'label_check', label: 'Periksa Label Pangan (BPOM, Halal)', energy: 5, xp: 15, type: 'investigate' }
                ],
                findings: [
                    { text: 'Tahu putih positif formalin! 🔴 Pedagang mengaku beli dari supplier kota', severity: 'critical' },
                    { text: 'Krupuk merah positif rhodamin B (pewarna tekstil)', severity: 'critical' },
                    { text: 'Bumbu kemasan sudah expired 4 bulan — masih dijual', severity: 'warning' }
                ]
            },
            {
                id: 'sanitasi_pasar', label: 'Sanitasi & MCK Pasar', icon: '🚿',
                description: 'Toilet pasar, tempat sampah, drainase, sumber air.',
                position: { col: 3, row: 1 },
                actions: [
                    { id: 'toilet_inspect', label: 'Inspeksi Toilet Pasar', energy: 5, xp: 15, type: 'minigame', gameId: 'inspeksi_kilat' },
                    { id: 'drain_check', label: 'Cek Drainase & Genangan', energy: 5, xp: 15, type: 'investigate' },
                    { id: 'waste_check', label: 'Periksa Pengelolaan Sampah Pasar', energy: 5, xp: 15, type: 'investigate' }
                ],
                findings: [
                    { text: 'Drainase mampet — genangan air bercampur darah ikan & sampah organik', severity: 'critical' },
                    { text: 'Tempat sampah hanya 2 untuk seluruh pasar (50 lapak)', severity: 'warning' },
                    { text: 'Toilet pasar ada sabun (langka untuk pasar tradisional!)', severity: 'good' }
                ]
            }
        ],
        npcs: [
            {
                id: 'ketua_pasar', name: 'Pak Tarjo', avatar: '👨', role: 'Ketua Pengelola Pasar',
                greeting: 'Wah, ada inspeksi dari puskesmas. Semoga masih bisa dagang ya Dok, hehe.',
                dialogs: [
                    {
                        trigger: 'auto', text: 'Dok, saya tahu pasar ini kurang bersih. Tapi pedagang susah diatur, mereka bilang "yang penting laku." Apalagi soal formalin — saya curiga tapi tidak bisa buktiin.',
                        choices: [
                            { text: 'Saya bawa test kit, kita tes langsung di depan pedagang', action: 'focus_station', target: 'lapak_kering' },
                            { text: 'Kita adakan pembinaan keamanan pangan bersama, jangan langsung razia', action: 'add_task', target: 'food_safety_training' }
                        ]
                    }
                ]
            }
        ],
        linkedScenarios: ['makan_sembarangan', 'jamu_berbahaya'],
        completionReward: { xp: 120, reputation: 15, message: 'Inspeksi pasar selesai! Temuan formalin dan rhodamin B dilaporkan ke BPOM.' }
    },

    // ─── P3: WARUNG ─────────────────────────────────────────
    warung: {
        title: 'Warung Bu Minah',
        subtitle: 'Warung Makan Desa — Edukasi Gizi & Keamanan Pangan',
        theme: { bg: 'from-amber-950 via-red-950 to-slate-950', accent: 'amber', icon: '🍛' },
        ambience: 'Warung sederhana di pinggir jalan desa. Aroma nasi hangat dan tempe goreng. Meja kayu, etalase kaca berisi lauk.',
        stations: [
            {
                id: 'dapur_warung', label: 'Dapur & Area Masak', icon: '🍳',
                description: 'Dapur warung. Periksa kebersihan, penyimpanan bahan, minyak goreng.',
                position: { col: 1, row: 1 },
                actions: [
                    { id: 'kitchen_inspect', label: 'Inspeksi Kebersihan Dapur', energy: 5, xp: 15, type: 'minigame', gameId: 'inspeksi_kilat' },
                    { id: 'oil_check', label: 'Tes Minyak Goreng (Peroksida)', energy: 5, xp: 20, type: 'investigate' },
                    { id: 'storage_check', label: 'Cek Penyimpanan Bahan Makanan', energy: 5, xp: 15, type: 'investigate' }
                ],
                findings: [
                    { text: 'Minyak goreng sudah hitam pekat — dipakai berulang 5+ kali!', severity: 'critical' },
                    { text: 'Daging ayam disimpan tanpa lemari es, sudah 8 jam di suhu ruang', severity: 'critical' },
                    { text: 'Bumbu segar (bawang, jahe, kunyit) — kualitas oke', severity: 'good' }
                ]
            },
            {
                id: 'menu_warung', label: 'Menu & Gizi Seimbang', icon: '🥗',
                description: 'Menu warung sehari-hari. Evaluasi komposisi gizi seimbang.',
                position: { col: 2, row: 1 },
                actions: [
                    { id: 'menu_analysis', label: 'Analisis Menu "Isi Piringku"', energy: 5, xp: 20, type: 'investigate' },
                    { id: 'portion_demo', label: 'Demo Porsi Gizi Seimbang', energy: 8, xp: 25, type: 'dialog' },
                    { id: 'healthy_menu', label: 'Bantu Susun Menu Sehat Harian', energy: 8, xp: 25, type: 'task' }
                ],
                findings: [
                    { text: 'Menu paling laku: nasi + gorengan + teh manis — sangat tidak seimbang!', severity: 'warning' },
                    { text: 'Lauk protein tersedia (tempe, tahu, telur, ikan) tapi porsi sayur minim', severity: 'warning' },
                    { text: 'Harga makanan terjangkau: Rp 8.000 – 12.000 per porsi', severity: 'good' }
                ]
            },
            {
                id: 'etalase', label: 'Etalase & Penyajian', icon: '🪟',
                description: 'Etalase makanan jadi. Periksa penutup, lalat, suhu penyimpanan.',
                position: { col: 3, row: 1 },
                actions: [
                    { id: 'display_inspect', label: 'Inspeksi Etalase Makanan', energy: 5, xp: 15, type: 'investigate' },
                    { id: 'fly_count', label: 'Hitung Lalat (Indikator Sanitasi)', energy: 3, xp: 10, type: 'investigate' },
                    { id: 'food_safety_tips', label: 'Tips Keamanan Pangan ke Penjual', energy: 8, xp: 25, type: 'dialog' }
                ],
                findings: [
                    { text: 'Etalase terbuka tanpa penutup — lalat hinggap bebas', severity: 'warning' },
                    { text: 'Nasi sisa kemarin dijual lagi hari ini (risiko Bacillus cereus)', severity: 'critical' },
                    { text: 'Sendok dan piring sudah dicuci bersih pakai sabun', severity: 'good' }
                ]
            }
        ],
        npcs: [
            {
                id: 'bu_minah', name: 'Bu Minah', avatar: '👩‍🍳', role: 'Pemilik Warung',
                greeting: 'Mau makan apa Dok? Hari ini ada pecel lele, nasi uduk, sama gado-gado.',
                dialogs: [
                    {
                        trigger: 'auto', text: 'Dok, saya tahu minyak goreng saya sudah hitam. Tapi minyak mahal, masa setiap hari ganti? Lagian rasanya enak kok, pelanggan suka.',
                        choices: [
                            { text: 'Bu, minyak jelantah mengandung karsinogen — penyebab kanker. Ganti setiap 3x pakai', action: 'educate', xp: 20 },
                            { text: 'Saya bantu cari solusi: kurangi gorengan, tambah menu kukus/rebus', action: 'focus_station', target: 'menu_warung' }
                        ]
                    }
                ]
            }
        ],
        linkedScenarios: ['makan_sembarangan'],
        completionReward: { xp: 100, reputation: 10, message: 'Pembinaan warung selesai! Bu Minah berjanji ganti minyak lebih sering.' }
    },

    // ─── P3: TOGA (Taman Obat Keluarga) ─────────────────────
    toga: {
        title: 'Taman TOGA Desa Sukamaju',
        subtitle: 'Taman Obat Keluarga — Kesehatan Tradisional Berbasis Bukti',
        theme: { bg: 'from-emerald-950 via-teal-950 to-slate-950', accent: 'teal', icon: '🌿' },
        ambience: 'Kebun kecil penuh tanaman obat: jahe, kunyit, temulawak, lidah buaya, kumis kucing. Bau rempah segar.',
        stations: [
            {
                id: 'kebun_toga', label: 'Kebun Tanaman Obat', icon: '🌱',
                description: 'Bedengan tanaman obat. Identifikasi, manfaat, dan cara penggunaan.',
                position: { col: 1, row: 1 },
                actions: [
                    { id: 'plant_id', label: 'Identifikasi 10 Tanaman TOGA Utama', energy: 5, xp: 20, type: 'investigate' },
                    { id: 'harvest_demo', label: 'Demo Panen & Pengolahan Dasar', energy: 8, xp: 25, type: 'task' },
                    { id: 'quality_check', label: 'Cek Kualitas Tanaman (Hama, Pupuk)', energy: 5, xp: 15, type: 'investigate' }
                ],
                findings: [
                    { text: 'Tanaman lengkap: jahe emprit, kunyit, temulawak, sereh, lidah buaya, kumis kucing, sambiloto', severity: 'good' },
                    { text: 'Beberapa tanaman kena hama kutu putih — perlu penanganan organik', severity: 'info' }
                ]
            },
            {
                id: 'olahan_toga', label: 'Workshop Olahan Herbal', icon: '🫖',
                description: 'Area pengolahan: pengeringan, perebusan, pengemasan jamu sederhana.',
                position: { col: 2, row: 1 },
                actions: [
                    { id: 'jamu_class', label: 'Kelas Pembuatan Jamu Sehat', energy: 10, xp: 30, type: 'task' },
                    { id: 'safety_check', label: 'Edukasi Jamu Aman vs Jamu Berbahaya', energy: 8, xp: 25, type: 'dialog' },
                    { id: 'interaction_warn', label: 'Peringatan Interaksi Obat-Herbal', energy: 8, xp: 25, type: 'dialog' }
                ],
                findings: [
                    { text: 'Beberapa warga mencampur jamu dengan obat diabetes — risiko hipoglikemia!', severity: 'critical' },
                    { text: 'Kunyit dan temulawak terbukti aman: anti-inflamasi, hepatoprotektor', severity: 'good' },
                    { text: 'Jamu biasanya kurang higienis: masak tanpa cuci tangan terlebih dulu', severity: 'warning' }
                ]
            },
            {
                id: 'edukasi_toga', label: 'Papan Edukasi & Pameran', icon: '📋',
                description: 'Papan informasi tanaman obat: nama ilmiah, khasiat, dosis, kontraindikasi.',
                position: { col: 3, row: 1 },
                actions: [
                    { id: 'update_board', label: 'Update Papan Informasi Tanaman', energy: 5, xp: 15, type: 'task' },
                    { id: 'evidence_review', label: 'Reviu Bukti Ilmiah Tanaman Obat', energy: 8, xp: 25, type: 'investigate' },
                    { id: 'herbal_vs_quack', label: 'Edukasi: Herbal Legal vs Jamu Oplosan', energy: 8, xp: 25, type: 'dialog' }
                ],
                findings: [
                    { text: 'Papan informasi sudah lengkap tapi nama ilmiah belum dicantumkan', severity: 'info' },
                    { text: 'Warga sudah bisa bedakan TOGA resmi vs jamu keliling yang berbahaya', severity: 'good' }
                ]
            }
        ],
        npcs: [
            {
                id: 'bu_herbal', name: 'Bu Nining', avatar: '👩‍🌾', role: 'Pengelola TOGA',
                greeting: 'Dok, selamat datang di kebun TOGA kami! Semua ditanam organik tanpa pestisida.',
                dialogs: [
                    {
                        trigger: 'auto', text: 'Dok, ada warga diabetes yang minum jamu pahit dari tukang jamu keliling. "Biar cepet sembuh," katanya. Padahal dia juga minum metformin. Itu bahaya kan?',
                        choices: [
                            { text: 'Sangat berbahaya! Kita perlu edukasi interaksi obat-herbal', action: 'focus_station', target: 'olahan_toga' },
                            { text: 'Ajak warga itu ke puskesmas, kita cek gula darahnya', action: 'add_task', target: 'check_dm_herbal' }
                        ]
                    }
                ]
            }
        ],
        linkedScenarios: ['jamu_berbahaya'],
        completionReward: { xp: 100, reputation: 10, message: 'Kunjungan TOGA selesai! Katalog tanaman obat berbasis bukti telah diperbarui.' }
    }
};

// ═══════════════════════════════════════════════════════════════
// COM-B WHEEL DATA
// ═══════════════════════════════════════════════════════════════

export const COM_B_SEGMENTS = [
    { id: 'cap_phy', label: 'Kemampuan Fisik', shortLabel: 'K.Fisik', color: '#3b82f6', icon: '💪', category: 'Capability', description: 'Keterbatasan fisik, energi, atau kesehatan yang menghambat perilaku. Contoh: Lansia kesulitan berjalan ke Posbindu.' },
    { id: 'cap_psy', label: 'Kemampuan Psikologis', shortLabel: 'K.Psikis', color: '#6366f1', icon: '🧠', category: 'Capability', description: 'Kurangnya pengetahuan, pemahaman, atau skill. Contoh: Ibu tidak tahu cara membuat MPASI bergizi.' },
    { id: 'opp_phy', label: 'Kesempatan Fisik', shortLabel: 'Ks.Fisik', color: '#10b981', icon: '🏗️', category: 'Opportunity', description: 'Hambatan lingkungan fisik, infrastruktur, atau biaya. Contoh: Jarak faskes jauh, transport mahal, uang tidak ada.' },
    { id: 'opp_soc', label: 'Kesempatan Sosial', shortLabel: 'Ks.Sosial', color: '#14b8a6', icon: '👥', category: 'Opportunity', description: 'Hambatan dari norma sosial, budaya, atau keluarga. Contoh: Suami melarang KB, stigma masyarakat, mitos.' },
    { id: 'mot_ref', label: 'Motivasi Reflektif', shortLabel: 'M.Reflektif', color: '#f59e0b', icon: '🤔', category: 'Motivation', description: 'Hambatan dalam pola pikir, perencanaan, dan identitas. Contoh: Merasa KB tidak penting karena "banyak anak banyak rejeki".' },
    { id: 'mot_aut', label: 'Motivasi Otomatis', shortLabel: 'M.Otomatis', color: '#ef4444', icon: '❤️‍🔥', category: 'Motivation', description: 'Hambatan emosional, ketakutan, atau kebiasaan buruk bawaan. Contoh: Takut disuntik, trauma masa lalu, kebiasaan merokok.' }
];

// ═══════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════

export function isGameEnabledBuilding(buildingType) {
    if (!buildingType) return false;
    return GAME_ENABLED_BUILDINGS.includes(buildingType.toLowerCase());
}

export function getSceneForBuilding(buildingType) {
    if (!buildingType) return null;
    return BUILDING_SCENES[buildingType.toLowerCase()] || null;
}
