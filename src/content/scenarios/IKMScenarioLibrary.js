/**
 * @reflection
 * [IDENTITY]: IKMScenarioLibrary.js
 * [PURPOSE]: Comprehensive IKM scenario database for UKM community health events.
 *            Contains 18 scenarios across 4 categories: PHBS, Cultural/Superstition,
 *            Environmental/Occupational, and Gizi/Tumbuh Kembang.
 * [STATE]: Stable
 * [ANCHOR]: IKM_SCENARIOS
 * [DEPENDS_ON]: None
 */

// ═══════════════════════════════════════════════════════════════
// IKM SCENARIO CATEGORIES
// ═══════════════════════════════════════════════════════════════

export const IKM_CATEGORIES = {
    PHBS: { id: 'phbs', label: 'Perilaku Hidup Bersih & Sehat', icon: '🧼', color: '#3b82f6' },
    CULTURAL: { id: 'cultural', label: 'Sosio-Kultural & Kepercayaan', icon: '🏮', color: '#f59e0b' },
    ENVIRONMENTAL: { id: 'environmental', label: 'Kesehatan Lingkungan & Kerja', icon: '🌿', color: '#10b981' },
    NUTRITION: { id: 'nutrition', label: 'Gizi & Tumbuh Kembang', icon: '🥗', color: '#8b5cf6' },
    MENTAL_HEALTH: { id: 'mental_health', label: 'Kesehatan Jiwa', icon: '🧠', color: '#ec4899' },
    ADOLESCENT: { id: 'adolescent', label: 'Kesehatan Remaja (PKPR)', icon: '🎒', color: '#f97316' },
    FOOD_SAFETY: { id: 'food_safety', label: 'Keamanan Pangan', icon: '🍽️', color: '#ef4444' },
    TRADITIONAL_HEALTH: { id: 'traditional_health', label: 'Kesehatan Tradisional', icon: '🌿', color: '#14b8a6' }
};

// ═══════════════════════════════════════════════════════════════
// PHBS SCENARIOS (5)
// ═══════════════════════════════════════════════════════════════

const PHBS_SCENARIOS = [
    {
        id: 'bab_sembarangan',
        title: 'BAB Sembarangan di Sungai',
        category: 'phbs',
        icon: '🚽',
        description: 'Laporan dari kader: beberapa warga RT 05 masih BAB di sungai. Risiko diare meningkat di musim hujan.',
        triggerConditions: {
            sdoh: { sanitation: ['River/Open', 'Shared Latrine'] },
            minDay: 5,
            probability: 0.12
        },
        urgency: 'moderate',
        phases: [
            {
                id: 'discovery',
                type: 'dialog',
                speaker: 'Kader Desa',
                text: 'Dok, saya baru nemu ada 3 keluarga di RT 05 yang masih buang air besar di sungai. Anaknya juga sering diare. Gimana ya Dok?',
                choices: [
                    {
                        text: 'Ayo kita turun ke lapangan untuk observasi lapangan dan analisis COM-B dulu.',
                        nextPhase: 'investigate_comb'
                    }
                ]
            },
            {
                id: 'investigate_comb',
                type: 'comb_analysis',
                description: 'Lakukan analisis perilaku warga RT 05 terkait kebiasaan BAB di sungai.',
                activeBarriers: ['cap_phy', 'opp_phy', 'mot_refl'],
                nextPhase: 'diagnosis'
            },
            {
                id: 'diagnosis',
                type: 'diagnosisQnA',
                question: 'Berdasarkan hasil observasi dan analisis COM-B, apa diagnosis akar masalah (Root Cause) dari kebiasaan BAB sembarangan di RT 05?',
                choices: [
                    { text: 'A. Kurangnya penyuluhan tata cara BAB yang benar (Capability - Psychological)', isCorrect: false, feedback: 'Kurang tepat. Warga sebenarnya tahu caranya, tapi ada kendala lain.' },
                    { text: 'B. Ketiadaan akses fisik ke jamban yang layak dan kebiasaan turun-temurun (Opportunity & Motivation)', isCorrect: true, feedback: 'Tepat! Ketiadaan jamban fisik (Opportunity) membuat warga terbiasa (Reflective Motivation) ke sungai.' },
                    { text: 'C. Gangguan pencernaan kronis pada warga RT 05 (Capability - Physical)', isCorrect: false, feedback: 'Salah. Diare adalah akibat, bukan penyebab perilaku.' }
                ],
                nextPhase: 'intervention'
            },
            {
                id: 'intervention',
                type: 'interventionQnA',
                who: { question: 'Siapa sasaran utama (Target Audience)?', correct: 'Kepala Keluarga RT 05 & Aparat Desa', options: ['Kepala Keluarga RT 05 & Aparat Desa', 'Anak-anak RT 05', 'Petugas Kebersihan', 'Kader Posyandu'] },
                what: { question: 'Apa bentuk intervensi terbaik saat ini?', correct: 'Triggering STBM & Pembangunan Jamban Komunal', options: ['Triggering STBM & Pembangunan Jamban Komunal', 'Pembagian Obat Diare Gratis', 'Pemasangan Spanduk Dilarang BAB', 'Senam Pagi Bersama'] },
                where: { question: 'Di mana lokasi intervensi?', correct: 'Balai Desa (Musyawarah) & Lokasi RT 05', options: ['Balai Desa (Musyawarah) & Lokasi RT 05', 'Puskesmas', 'Sekolah Dasar', 'Pusat Kota'] },
                when: { question: 'Kapan pelaksanaannya?', correct: 'Segera, sebelum musim hujan puncak', options: ['Segera, sebelum musim hujan puncak', 'Tahun depan', 'Tunggu KLB terjadi', 'Bulan depan'] },
                why: { question: 'Mengapa intervensi ini penting?', correct: 'Memutus mata rantai penularan fekal-oral secara permanen', options: ['Memutus mata rantai penularan fekal-oral secara permanen', 'Menghabiskan anggaran desa', 'Meningkatkan estetika sungai', 'Menambah pekerjaan kader'] },
                how: { question: 'Bagaimana pendekatannya?', correct: 'Pemicuan rasa jijik/malu (Sanitasi Total Berbasis Masyarakat)', options: ['Pemicuan rasa jijik/malu (Sanitasi Total Berbasis Masyarakat)', 'Paksaan dengan denda', 'Memberi uang saku', 'Menunggu kesadaran sendiri'] }
            },
            {
                id: 'resolution_success',
                type: 'dialog',
                text: 'Intervensi berhasil! Setelah pemicuan STBM, desa sepakat membangun jamban komunal. Kasus diare menurun drastis.',
                isEnd: true,
                impact: { reputation: +20, xp: 200 }
            },
            {
                id: 'resolution_fail',
                type: 'dialog',
                text: 'Intervensi kurang tepat sasaran! Warga tetap BAB di sungai karena akar masalah tidak tersentuh. Diare mulai merebak.',
                isEnd: true,
                impact: { reputation: -10 },
                spawnPatients: { diseaseId: 'diare_akut', amount: 5, targetClinic: 'poli_umum' }
            }
        ],
        outcomes: {
            success: { iks_score: +5, reputation: +10, xp: 150, outbreak_risk_reduction: 'diare' },
            partial: { iks_score: +2, reputation: +5, xp: 75 },
            failure: { iks_score: -3, outbreak_risk: 'diare' }
        },
        relatedCases: ['diare_akut', 'tifoid'],
        educationTopics: ['hand_hygiene', 'food_hygiene', 'use_latrine', 'boil_water']
    },
    {
        id: 'cuci_tangan',
        title: 'Wabah ISPA di SD — Cuci Tangan',
        category: 'phbs',
        icon: '🤲',
        description: 'Banyak anak SD tidak cuci tangan setelah jajan. Cluster ISPA muncul di 2 kelas.',
        triggerConditions: {
            season: 'rainy',
            minDay: 10,
            probability: 0.10
        },
        urgency: 'moderate',
        phases: [
            {
                id: 'discovery',
                type: 'dialog',
                speaker: 'Guru SD',
                text: 'Dok, 12 anak di kelas 3 dan 5 batuk pilek semua dalam seminggu ini. Kami curiga karena mereka jajan di luar dan nggak cuci tangan. Bisa bantu?',
                choices: [
                    {
                        text: 'Mari kita investigasi lapangan ke sekolah (Analisis COM-B)',
                        nextPhase: 'investigate_comb'
                    }
                ]
            },
            {
                id: 'investigate_comb',
                type: 'comb_analysis',
                description: 'Analisis perilaku anak SD terkait cuci tangan pakai sabun (CTPS).',
                activeBarriers: ['cap_psy', 'opp_phy'],
                nextPhase: 'diagnosis'
            },
            {
                id: 'diagnosis',
                type: 'diagnosisQnA',
                question: 'Berdasarkan observasi kantin sekolah (COM-B), apa diagnosis IKM dari klaster ISPA ini?',
                choices: [
                    { text: 'A. Mutasi virus bawaan udara dari luar desa', isCorrect: false, feedback: 'Kurang tepat. Pola penyebaran sangat terlokalisir di jam istirahat.' },
                    { text: 'B. Transmisi droplet + Poor Hand Hygiene setelah jajan', isCorrect: true, feedback: 'Tepat! Pola interaksi anak SD (saling berbagi makanan tanpa cuci tangan) mempercepat penyebaran.' },
                    { text: 'C. Keracunan makanan (Foodborne) dari es sirup', isCorrect: false, feedback: 'Salah. Gejalanya respiratorik (batuk/pilek), bukan gastrointestinal.' }
                ],
                nextPhase: 'intervention'
            },
            {
                id: 'intervention',
                type: 'interventionQnA',
                who: { question: 'Siapa sasaran utama (Target Audience)?', correct: 'Siswa kelas 3-6 & Guru Penjaskes', options: ['Siswa kelas 3-6 & Guru Penjaskes', 'Hanya Kepala Sekolah', 'Kader Posyandu', 'Orang tua siswa di rumah'] },
                what: { question: 'Apa bentuk intervensi terbaik saat ini?', correct: 'Demonstrasi CTPS 6 Langkah + Pemasangan Wastafel', options: ['Demonstrasi CTPS 6 Langkah + Pemasangan Wastafel', 'Meliburkan sekolah 1 bulan', 'Memberi antibiotik profilaksis', 'Razia pedagang keliling'] },
                where: { question: 'Di mana lokasi intervensi?', correct: 'Lapangan sekolah sebelum jam istirahat', options: ['Lapangan sekolah sebelum jam istirahat', 'Di Balai Desa', 'Di Puskesmas', 'Di rumah masing-masing siswa'] },
                when: { question: 'Kapan waktu pelaksanaan yang kritis?', correct: 'Besok pagi, potong rantai penularan segera', options: ['Besok pagi, potong rantai penularan segera', 'Tunggu hari libur', 'Bulan depan saat apel', 'Tahun ajaran baru'] },
                why: { question: 'Mengapa intervensi ini penting?', correct: 'Memutus transmisi droplet dan kontak langsung', options: ['Memutus transmisi droplet dan kontak langsung', 'Syarat akreditasi sekolah', 'Menghabiskan stok sabun', 'Sekadar himbauan rutin'] },
                how: { question: 'Bagaimana metodenya?', correct: 'Praktek langsung bersama dengan sabun dan air mengalir', options: ['Praktek langsung bersama dengan sabun dan air mengalir', 'Membagikan brosur saja', 'Memarahi anak yang tidak cuci tangan', 'Menonton video 1 jam di kelas'] }
            },
            {
                id: 'resolution_success',
                type: 'dialog',
                text: 'Intervensi sukses! Anak-anak kini rutin CTPS. Penyebaran ISPA di sekolah terhenti.',
                isEnd: true,
                impact: { reputation: +15, xp: 150 }
            },
            {
                id: 'resolution_fail',
                type: 'dialog',
                text: 'Intervensi tidak memadai. Transmisi droplet terus berlanjut di sekolah, banyak anak bertambah sakit.',
                isEnd: true,
                impact: { reputation: -5 },
                spawnPatients: { diseaseId: 'ispa', amount: 6, targetClinic: 'poli_umum' }
            }
        ],
        outcomes: {
            success: { iks_score: +3, outbreak_risk_reduction: 'ispa' }
        },
        relatedCases: ['ispa', 'pneumonia_anak'],
        educationTopics: ['hand_hygiene', 'respiratory_hygiene']
    },
    {
        id: 'makan_sembarangan',
        title: 'Keracunan Jajanan Pasar',
        category: 'phbs',
        icon: '🍜',
        description: 'Beberapa warga mengalami mual dan diare setelah membeli jajanan di pasar desa.',
        triggerConditions: {
            minDay: 15,
            probability: 0.08
        },
        urgency: 'high',
        phases: [
            {
                id: 'discovery',
                type: 'dialog',
                speaker: 'Perawat',
                text: 'Dok, pagi ini sudah ada 5 pasien dengan gejala serupa — mual, muntah, diare setelah makan jajanan di pasar kemarin sore. Sepertinya keracunan makanan.',
                choices: [
                    {
                        text: 'Investigasi ke pasar, ambil sampel makanan',
                        nextPhase: 'investigate',
                        impact: { energy: -20, reputation: +5 }
                    },
                    {
                        text: 'Tangani pasien dulu, laporkan ke Dinkes',
                        nextPhase: 'treat_report',
                        impact: { energy: -10 }
                    },
                    {
                        text: 'Lakukan keduanya: bagi tugas dengan perawat',
                        nextPhase: 'both',
                        impact: { energy: -25, reputation: +10 }
                    }
                ]
            },
            {
                id: 'investigate',
                type: 'dialog',
                text: 'Anda menemukan pedagang bakso menggunakan boraks. Sampel disita, pedagang diberi teguran keras dan edukasi keamanan pangan.',
                isEnd: true,
                impact: { reputation: +20, xp: 200 }
            },
            {
                id: 'treat_report',
                type: 'dialog',
                text: 'Pasien ditangani dengan rehidrasi. Dinkes mengirim tim investigasi lanjutan 2 hari kemudian.',
                isEnd: true,
                impact: { reputation: +8, xp: 100 }
            },
            {
                id: 'both',
                type: 'dialog',
                text: 'Tim terkoordinasi: pasien ditangani, pedagang diidentifikasi, dan Dinkes menutup sementara warung bermasalah. Kasus berhenti total.',
                isEnd: true,
                impact: { reputation: +25, xp: 250 }
            }
        ],
        outcomes: {
            success: { iks_score: +4, reputation: +15, xp: 200 }
        },
        relatedCases: ['diare_akut', 'gastritis_akut'],
        educationTopics: ['food_hygiene', 'food_safety']
    },
    {
        id: 'air_minum_tercemar',
        title: 'Sumur Tercemar E. coli',
        category: 'phbs',
        icon: '💧',
        description: 'Sumur di RT 03 tercemar bakteri E. coli setelah banjir. Warga belum sadar bahaya.',
        triggerConditions: {
            season: 'rainy',
            sdoh: { water: ['Well', 'Unprotected Well'] },
            minDay: 20,
            probability: 0.10
        },
        urgency: 'high',
        phases: [
            {
                id: 'discovery',
                type: 'dialog',
                speaker: 'Sanitarian',
                text: 'Dok, hasil tes air sumur di RT 03 positif E. coli di atas ambang batas. Ini setelah banjir minggu lalu. 8 keluarga masih pakai sumur itu.',
                choices: [
                    {
                        text: 'Segera umumkan ke warga, larang pakai sumur',
                        nextPhase: 'immediate_ban',
                        impact: { energy: -10, reputation: +5 }
                    },
                    {
                        text: 'Distribusikan air bersih dan kaporit, edukasi memasak air',
                        nextPhase: 'distribute_treat',
                        impact: { energy: -20, balance: -300000 }
                    }
                ]
            },
            {
                id: 'immediate_ban',
                type: 'dialog',
                text: 'Warga kecewa karena tidak ada alternatif air segera. Beberapa tetap diam-diam pakai sumur. 2 kasus diare muncul.',
                isEnd: true,
                impact: { reputation: +5, xp: 80 }
            },
            {
                id: 'distribute_treat',
                type: 'dialog',
                text: 'Warga menerima air bersih dan belajar klorinasi. Sumur di-disinfeksi setelah air surut. Tidak ada kasus diare baru.',
                isEnd: true,
                impact: { reputation: +20, xp: 200 }
            }
        ],
        outcomes: {
            success: { iks_score: +5, outbreak_risk_reduction: 'diare' }
        },
        relatedCases: ['diare_akut'],
        educationTopics: ['boil_water', 'water_treatment', 'well_protection']
    },
    {
        id: 'sampah_menumpuk',
        title: 'Sampah Menumpuk — Sarang Nyamuk',
        category: 'phbs',
        icon: '🗑️',
        description: 'Sampah organik menumpuk di 2 RT, menjadi breeding ground nyamuk Aedes aegypti.',
        triggerConditions: {
            season: 'rainy',
            minDay: 8,
            probability: 0.10
        },
        urgency: 'moderate',
        phases: [
            {
                id: 'discovery',
                type: 'dialog',
                speaker: 'Kader Jumantik',
                text: 'Dok, hasil pemantauan jentik minggu ini angkanya naik. ABJ turun ke 70%. Saya lihat sampah menumpuk di RT 02 dan RT 04, banyak genangan air di ban dan kaleng bekas.',
                choices: [
                    {
                        text: 'Gerakkan kerja bakti PSN 3M Plus',
                        nextPhase: 'kerja_bakti',
                        impact: { energy: -20, reputation: +10 }
                    },
                    {
                        text: 'Koordinasi dengan RT untuk pengangkutan sampah',
                        nextPhase: 'waste_management',
                        impact: { energy: -10, balance: -150000 }
                    }
                ]
            },
            {
                id: 'kerja_bakti',
                type: 'action',
                description: 'Pimpin kerja bakti di 2 RT',
                metric: 'psn_done',
                target: 5,
                onComplete: 'resolution_psn'
            },
            {
                id: 'waste_management',
                type: 'dialog',
                text: 'Ketua RT setuju menjadwalkan pengangkutan sampah rutin 2x seminggu. Sampah mulai berkurang.',
                isEnd: true,
                impact: { reputation: +10, xp: 100 }
            },
            {
                id: 'resolution_psn',
                type: 'dialog',
                text: 'Kerja bakti PSN berhasil! ABJ naik ke 90%. Warga mulai rajin menguras dan mengubur barang bekas. Risiko DBD turun signifikan.',
                isEnd: true,
                impact: { reputation: +20, xp: 200 }
            }
        ],
        outcomes: {
            success: { iks_score: +4, outbreak_risk_reduction: 'dbd' }
        },
        relatedCases: ['dbd', 'dss'],
        educationTopics: ['psn_3m', 'waste_management', 'mosquito_breeding']
    }
];

// ═══════════════════════════════════════════════════════════════
// CULTURAL & SUPERSTITION SCENARIOS (5)
// ═══════════════════════════════════════════════════════════════

const CULTURAL_SCENARIOS = [
    {
        id: 'kesurupan_massal',
        title: 'Kesurupan Massal di Sekolah',
        category: 'cultural',
        icon: '👻',
        description: 'Belasan siswi SMP "kesurupan" bersamaan. Warga panik, minta didoakan ustaz.',
        triggerConditions: {
            minDay: 20,
            probability: 0.05
        },
        urgency: 'high',
        phases: [
            {
                id: 'discovery',
                type: 'dialog',
                speaker: 'Kepala Sekolah',
                text: 'Dok! 8 siswi kesurupan semua! Mereka menjerit-jerit, ada yang pingsan. Ustaz sudah kita panggil tapi belum datang. Tolong Dok!',
                choices: [
                    {
                        text: 'Datang langsung, periksa satu per satu secara medis',
                        nextPhase: 'medical_exam',
                        impact: { energy: -25, reputation: +10 }
                    },
                    {
                        text: 'Pisahkan siswi yang "sehat" dulu, isolasi yang terdampak',
                        nextPhase: 'isolation_first',
                        impact: { energy: -15, reputation: +5 }
                    }
                ]
            },
            {
                id: 'medical_exam',
                type: 'dialog',
                text: 'Pemeriksaan medis tidak menemukan kelainan organik. Anda menduga Mass Psychogenic Illness dipicu stres ujian. Setelah diisolasi, siswi mulai tenang dalam 30 menit.',
                choices: [
                    {
                        text: 'Jelaskan ke guru & orang tua secara ilmiah',
                        nextPhase: 'scientific_explanation',
                        impact: { reputation: +5 }
                    },
                    {
                        text: 'Hormati kepercayaan lokal, libatkan ustaz juga',
                        nextPhase: 'cultural_bridge',
                        impact: { reputation: +10 }
                    }
                ]
            },
            {
                id: 'isolation_first',
                type: 'dialog',
                text: 'Siswi yang belum terdampak diungsikan ke ruang lain. Yang terdampak diperiksa satu per satu. Penularan psikogenik berhenti.',
                isEnd: true,
                impact: { reputation: +15, xp: 150 }
            },
            {
                id: 'scientific_explanation',
                type: 'dialog',
                text: 'Beberapa orang tua menerima, beberapa tetap percaya "ada yang mengganggu." Reputasi Anda naik di kalangan guru tapi turun di sebagian warga.',
                isEnd: true,
                impact: { reputation: +10, xp: 150 }
            },
            {
                id: 'cultural_bridge',
                type: 'dialog',
                text: 'Dengan pendekatan bijak, Anda menjelaskan medis sambil menghormati aspek spiritual. Ustaz mendukung penjelasan Anda. Warga menghargai keseimbangan pendekatan ini.',
                isEnd: true,
                impact: { reputation: +25, xp: 250 }
            }
        ],
        outcomes: {
            success: { iks_score: +3, reputation: +15, xp: 200 }
        },
        relatedCases: [],
        educationTopics: ['mental_health', 'stress_management']
    },
    {
        id: 'tolak_vaksin',
        title: 'Penolakan Imunisasi Campak',
        category: 'cultural',
        icon: '💉',
        description: 'Sekelompok warga menolak imunisasi campak untuk anak mereka karena isu halal-haram.',
        triggerConditions: {
            minDay: 15,
            probability: 0.08
        },
        urgency: 'high',
        phases: [
            {
                id: 'discovery',
                type: 'dialog',
                speaker: 'Bidan',
                text: 'Dok, ada 6 keluarga yang menolak imunisasi campak-rubella. Mereka bilang ada ustaz yang ceramah bahwa vaksin itu haram dan mengandung babi.',
                choices: [
                    {
                        text: 'Ajak bicara ustaz tersebut, tunjukkan fatwa MUI',
                        nextPhase: 'engage_ustaz',
                        impact: { energy: -15, reputation: +5 }
                    },
                    {
                        text: 'Kunjungi keluarga satu per satu, edukasi langsung',
                        nextPhase: 'door_to_door',
                        impact: { energy: -25 }
                    },
                    {
                        text: 'Gelar pertemuan warga dengan narasumber Dinkes + MUI',
                        nextPhase: 'town_hall',
                        impact: { energy: -10, balance: -200000 }
                    }
                ]
            },
            {
                id: 'engage_ustaz',
                type: 'dialog',
                text: 'Setelah berdiskusi dan menunjukkan fatwa MUI No. 04/2016, sang ustaz bersedia membantu mengklarifikasi. 4 dari 6 keluarga akhirnya mau diimunisasi.',
                isEnd: true,
                impact: { reputation: +20, xp: 200 }
            },
            {
                id: 'door_to_door',
                type: 'action',
                description: 'Kunjungi keluarga yang menolak vaksin',
                metric: 'home_visits',
                target: 6,
                onComplete: 'resolution_door'
            },
            {
                id: 'resolution_door',
                type: 'dialog',
                text: 'Dengan sabar menjelaskan satu per satu, 3 keluarga mau diimunisasi. 3 lainnya masih menolak. Perlu pendekatan jangka panjang.',
                isEnd: true,
                impact: { reputation: +12, xp: 150 }
            },
            {
                id: 'town_hall',
                type: 'dialog',
                text: 'Pertemuan ramai dihadiri 50+ warga. Dokter dari Dinkes dan perwakilan MUI memberikan penjelasan komprehensif. 5 dari 6 keluarga akhirnya bersedia.',
                isEnd: true,
                impact: { reputation: +25, xp: 250 }
            }
        ],
        outcomes: {
            success: { iks_score: +5, outbreak_risk_reduction: 'campak' }
        },
        relatedCases: ['campak', 'rubella'],
        educationTopics: ['immunization_importance', 'vaccine_safety', 'herd_immunity']
    },
    {
        id: 'dukun_beranak',
        title: 'Ibu Hamil Pilih Dukun Beranak',
        category: 'cultural',
        icon: '🤰',
        description: 'Ibu hamil risiko tinggi memilih melahirkan di dukun beranak, menolak ke puskesmas.',
        triggerConditions: {
            minDay: 25,
            probability: 0.07
        },
        urgency: 'critical',
        phases: [
            {
                id: 'discovery',
                type: 'dialog',
                speaker: 'Bidan',
                text: 'Dok, Bu Siti (G4P3, 38 tahun, riwayat perdarahan persalinan sebelumnya) mau melahirkan di Mbah Parti, dukun beranak. Dia bilang "sudah 3 kali aman." Padahal ini risiko tinggi!',
                choices: [
                    {
                        text: 'Kunjungi Bu Siti langsung, jelaskan risiko dengan data',
                        nextPhase: 'visit_patient',
                        impact: { energy: -20 }
                    },
                    {
                        text: 'Ajak Mbah Parti bermitra, bidan dampingi saat persalinan',
                        nextPhase: 'partner_dukun',
                        impact: { energy: -15, reputation: +5 }
                    },
                    {
                        text: 'Libatkan suami dan keluarga dalam konseling',
                        nextPhase: 'family_counsel',
                        impact: { energy: -15 }
                    }
                ]
            },
            {
                id: 'visit_patient',
                type: 'dialog',
                text: 'Bu Siti awalnya defensif, tapi setelah Anda tunjukkan data kematian ibu dan risiko perdarahan berulang, dia mulai goyah. Suami masih ragu soal biaya.',
                choices: [
                    {
                        text: 'Jelaskan program JKN/BPJS gratis',
                        nextPhase: 'resolution_jkn',
                        impact: { reputation: +5 }
                    }
                ]
            },
            {
                id: 'partner_dukun',
                type: 'dialog',
                text: 'Mbah Parti ternyata kooperatif. Dia setuju mendampingi secara spiritual sementara bidan yang menangani persalinan. Bu Siti merasa dihargai.',
                isEnd: true,
                impact: { reputation: +30, xp: 300 }
            },
            {
                id: 'family_counsel',
                type: 'dialog',
                text: 'Suami dan ibu mertua akhirnya mendukung persalinan di puskesmas setelah mendengar risiko. Bu Siti setuju.',
                isEnd: true,
                impact: { reputation: +20, xp: 200 }
            },
            {
                id: 'resolution_jkn',
                type: 'dialog',
                text: 'Setelah tahu gratis dengan BPJS, suami langsung setuju. Bu Siti bersalin aman di puskesmas dengan pendampingan bidan.',
                isEnd: true,
                impact: { reputation: +25, xp: 250 }
            }
        ],
        outcomes: {
            success: { iks_score: +6, reputation: +20, xp: 250 }
        },
        relatedCases: ['perdarahan_postpartum', 'preeklampsia'],
        educationTopics: ['safe_delivery', 'bpjs_access', 'partner_dukun']
    },
    {
        id: 'jamu_berbahaya',
        title: 'Jamu Campur Steroid',
        category: 'cultural',
        icon: '🧪',
        description: 'Penjual jamu keliling mencampur deksametason ke jamu pegal linu. Beberapa warga kumat diabetes.',
        triggerConditions: {
            minDay: 30,
            probability: 0.06
        },
        urgency: 'high',
        phases: [
            {
                id: 'discovery',
                type: 'dialog',
                speaker: 'Perawat',
                text: 'Dok, 3 pasien DM yang sudah terkontrol tiba-tiba gula darahnya melonjak. Setelah ditanya, mereka semua minum jamu pegal linu dari Bu Warni, tukang jamu keliling.',
                choices: [
                    {
                        text: 'Ambil sampel jamu, kirim ke lab BPOM',
                        nextPhase: 'lab_test',
                        impact: { energy: -15, balance: -100000 }
                    },
                    {
                        text: 'Temui Bu Warni langsung, peringatkan',
                        nextPhase: 'confront_seller',
                        impact: { energy: -10 }
                    }
                ]
            },
            {
                id: 'lab_test',
                type: 'dialog',
                text: 'Hasil lab: positif deksametason dan piroksikam. Anda melaporkan ke Dinkes dan BPOM. Bu Warni diberi pembinaan dan jamu disita.',
                isEnd: true,
                impact: { reputation: +25, xp: 250 }
            },
            {
                id: 'confront_seller',
                type: 'dialog',
                text: 'Bu Warni mengaku mendapat resep dari "juragan jamu" di kota. Anda membuatnya berjanji berhenti, tapi tanpa bukti lab sulit ditindak tegas.',
                isEnd: true,
                impact: { reputation: +10, xp: 100 }
            }
        ],
        outcomes: {
            success: { iks_score: +3 }
        },
        relatedCases: ['dm_tipe2', 'gastritis_akut'],
        educationTopics: ['traditional_medicine_safety', 'drug_interaction']
    },
    {
        id: 'kerokan_anak',
        title: 'Anak Sakit Dikerokin',
        category: 'cultural',
        icon: '🪙',
        description: 'Bayi 8 bulan demam tinggi dikerokin nenek, muncul coin rub dermatitis. Orang tua bingung.',
        triggerConditions: {
            minDay: 10,
            probability: 0.08
        },
        urgency: 'moderate',
        phases: [
            {
                id: 'discovery',
                type: 'dialog',
                speaker: 'Ibu Pasien',
                text: 'Dok, anak saya demam 3 hari, nenek sudah kerokin tapi malah tambah rewel. Badannya merah-merah ini kenapa ya?',
                choices: [
                    {
                        text: 'Periksa anak, jelaskan bahaya kerokan pada bayi',
                        nextPhase: 'examine_educate',
                        impact: { energy: -10 }
                    },
                    {
                        text: 'Tangani demamnya dulu, edukasi pelan-pelan',
                        nextPhase: 'treat_first',
                        impact: { energy: -10 }
                    }
                ]
            },
            {
                id: 'examine_educate',
                type: 'dialog',
                text: 'Anda menjelaskan bahwa kulit bayi sangat tipis dan kerokan bisa menyebabkan lecet dan infeksi. Ibu memahami, tapi nenek keberatan: "Dari dulu ya begini." Anda harus bijak.',
                choices: [
                    {
                        text: 'Jelaskan dengan analogi yang dimengerti nenek',
                        nextPhase: 'resolution_gentle',
                        impact: { reputation: +5 }
                    }
                ]
            },
            {
                id: 'treat_first',
                type: 'dialog',
                text: 'Anda memberikan paracetamol dan mengobati lesi kulit. Setelah anak membaik, Anda menjelaskan pelan-pelan bahwa kerokan tidak cocok untuk bayi.',
                isEnd: true,
                impact: { reputation: +10, xp: 100 }
            },
            {
                id: 'resolution_gentle',
                type: 'dialog',
                text: '"Bu, kulitnya bayi itu kayak tahu, lembut sekali. Kalau dikerokan bisa luka." Nenek akhirnya paham. Keluarga dijadwalkan kontrol ulang.',
                isEnd: true,
                impact: { reputation: +15, xp: 120 }
            }
        ],
        outcomes: {
            success: { iks_score: +2, reputation: +10, xp: 100 }
        },
        relatedCases: [],
        educationTopics: ['child_skin_care', 'traditional_practice_safety']
    }
];

// ═══════════════════════════════════════════════════════════════
// ENVIRONMENTAL & OCCUPATIONAL SCENARIOS (4)
// ═══════════════════════════════════════════════════════════════

const ENVIRONMENTAL_SCENARIOS = [
    {
        id: 'pestisida_pertanian',
        title: 'Keracunan Pestisida Petani',
        category: 'environmental',
        icon: '🧴',
        description: 'Petani menyemprot tanpa APD, 2 orang kolaps di sawah.',
        triggerConditions: {
            season: 'dry',
            minDay: 15,
            probability: 0.07
        },
        urgency: 'critical',
        phases: [
            {
                id: 'discovery',
                type: 'dialog',
                speaker: 'Ketua Kelompok Tani',
                text: 'Dok! Pak Udin dan Pak Cecep pingsan di sawah setelah nyemprot pestisida. Mereka ngga pake masker. Mulutnya berbusa!',
                choices: [
                    {
                        text: 'Segera ke lokasi dengan kit kedaruratan',
                        nextPhase: 'emergency_response',
                        impact: { energy: -30 }
                    },
                    {
                        text: 'Instruksikan bawa ke puskesmas, siapkan atropin',
                        nextPhase: 'clinic_prep',
                        impact: { energy: -15 }
                    }
                ]
            },
            {
                id: 'emergency_response',
                type: 'dialog',
                text: 'Di lokasi, Anda melakukan dekontaminasi, memberikan atropin, dan menstabilkan kedua pasien. Keduanya dirujuk ke RS. Anda kemudian mengumpulkan data untuk investigasi.',
                choices: [
                    {
                        text: 'Adakan penyuluhan APD untuk kelompok tani',
                        nextPhase: 'resolution_apd',
                        impact: { energy: -10, reputation: +10 }
                    }
                ]
            },
            {
                id: 'clinic_prep',
                type: 'dialog',
                text: 'Pasien tiba dalam 15 menit. Anda siap dengan antidotum dan berhasil menstabilkan keduanya sebelum dirujuk.',
                isEnd: true,
                impact: { reputation: +15, xp: 180 }
            },
            {
                id: 'resolution_apd',
                type: 'dialog',
                text: 'Penyuluhan APD dihadiri 25 petani. Anda membagikan masker dan sarung tangan dari dana BOK. Kelompok tani berjanji mematuhi aturan keselamatan.',
                isEnd: true,
                impact: { reputation: +25, xp: 300 }
            }
        ],
        outcomes: {
            success: { iks_score: +5, reputation: +20, xp: 250 }
        },
        relatedCases: ['intoksikasi_organofosfat'],
        educationTopics: ['ppe_farming', 'pesticide_safety', 'first_aid_poisoning']
    },
    {
        id: 'asap_pembakaran',
        title: 'Asap Pembakaran Lahan',
        category: 'environmental',
        icon: '🔥',
        description: 'Pembakaran lahan ladang menyebabkan kabut asap tebal. Kunjungan ISPA naik 3x lipat.',
        triggerConditions: {
            season: 'dry',
            minDay: 20,
            probability: 0.08
        },
        urgency: 'high',
        phases: [
            {
                id: 'discovery',
                type: 'dialog',
                speaker: 'Perawat',
                text: 'Dok, 3 hari terakhir pasien ISPA naik 3x lipat. Semuanya sesak nafas dan batuk. Sepertinya dari asap pembakaran lahan di Kecamatan sebelah.',
                choices: [
                    {
                        text: 'Distribusikan masker N95 ke warga rentan',
                        nextPhase: 'mask_distribution',
                        impact: { energy: -15, balance: -500000 }
                    },
                    {
                        text: 'Laporkan ke pemerintah daerah untuk tindakan hukum',
                        nextPhase: 'report_gov',
                        impact: { energy: -10 }
                    },
                    {
                        text: 'Kedua langkah sekaligus',
                        nextPhase: 'both_action',
                        impact: { energy: -25, balance: -500000 }
                    }
                ]
            },
            {
                id: 'mask_distribution',
                type: 'dialog',
                text: 'Masker didistribusikan ke lansia, balita, dan ibu hamil. Puskesmas menyiapkan area khusus untuk pasien ISPA berat.',
                isEnd: true,
                impact: { reputation: +15, xp: 150 }
            },
            {
                id: 'report_gov',
                type: 'dialog',
                text: 'Laporan diterima Pemda. Tim lingkungan hidup turun ke lokasi. Pembakaran dihentikan 3 hari kemudian, tapi asap masih berlangsung seminggu.',
                isEnd: true,
                impact: { reputation: +10, xp: 100 }
            },
            {
                id: 'both_action',
                type: 'dialog',
                text: 'Respons cepat dan komprehensif! Warga terlindungi, pembakaran dihentikan. Kepala dinas memuji inisiatif puskesmas.',
                isEnd: true,
                impact: { reputation: +30, xp: 300 }
            }
        ],
        outcomes: {
            success: { iks_score: +4 }
        },
        relatedCases: ['ispa', 'asma_akut'],
        educationTopics: ['air_quality', 'respiratory_protection']
    },
    {
        id: 'gigitan_ular',
        title: 'Gigitan Ular di Sawah',
        category: 'environmental',
        icon: '🐍',
        description: 'Petani digigit ular berbisa (welang) saat panen padi.',
        triggerConditions: {
            season: 'dry',
            minDay: 10,
            probability: 0.06
        },
        urgency: 'critical',
        phases: [
            {
                id: 'discovery',
                type: 'dialog',
                speaker: 'Warga',
                text: 'Dokter! Pak Amin digigit ular di sawah! Kakinya bengkak, dia ngeluh pusing. Warga mau disedot racunnya, gimana Dok?!',
                choices: [
                    {
                        text: 'JANGAN disedot! Imobilisasi, segera bawa ke sini',
                        nextPhase: 'correct_first_aid',
                        impact: { energy: -10 }
                    },
                    {
                        text: 'Segera ke lokasi dengan antivenom dan kit darurat',
                        nextPhase: 'field_response',
                        impact: { energy: -30 }
                    }
                ]
            },
            {
                id: 'correct_first_aid',
                type: 'dialog',
                text: 'Warga membawa Pak Amin dengan kaki diimobilisasi. Di puskesmas, Anda beri loading cairan, antihistamin, dan menstabilkan sebelum rujuk ke RS untuk antivenom.',
                isEnd: true,
                impact: { reputation: +20, xp: 200 }
            },
            {
                id: 'field_response',
                type: 'dialog',
                text: 'Di sawah, Anda memastikan kaki diimobilisasi, memasang IV line, dan merujuk langsung dari lokasi. Respons cepat menyelamatkan nyawa Pak Amin.',
                isEnd: true,
                impact: { reputation: +30, xp: 300 }
            }
        ],
        outcomes: {
            success: { iks_score: +3 }
        },
        relatedCases: [],
        educationTopics: ['snakebite_first_aid', 'field_safety']
    },
    {
        id: 'leptospirosis_banjir',
        title: 'Leptospirosis Pasca Banjir',
        category: 'environmental',
        icon: '🐀',
        description: 'Setelah banjir besar, beberapa warga yang terendam air keruh mulai demam tinggi.',
        triggerConditions: {
            season: 'rainy',
            minDay: 30,
            probability: 0.06
        },
        urgency: 'high',
        phases: [
            {
                id: 'discovery',
                type: 'dialog',
                speaker: 'Perawat',
                text: 'Dok, setelah banjir minggu lalu, 4 pasien datang dengan demam tinggi, nyeri otot betis luar biasa, dan mata kuning. Mereka semua kena banjir 5-7 hari lalu.',
                choices: [
                    {
                        text: 'Curigai leptospirosis, tangani dan lapor Dinkes (W2)',
                        nextPhase: 'treat_report',
                        impact: { energy: -15 }
                    },
                    {
                        text: 'Investigasi epidemiologi: cek area genangan',
                        nextPhase: 'epi_investigation',
                        impact: { energy: -25, reputation: +5 }
                    }
                ]
            },
            {
                id: 'treat_report',
                type: 'dialog',
                text: 'Pasien diterapi doksisiklin. Laporan W2 dikirim ke Dinkes. Tim surveilans menindaklanjuti dalam 2 hari.',
                isEnd: true,
                impact: { reputation: +15, xp: 150 }
            },
            {
                id: 'epi_investigation',
                type: 'dialog',
                text: 'Anda menemukan area genangan dengan banyak tikus di dekat gudang beras. Koordinasi dengan tim kesling untuk disinfeksi area dan pemasangan perangkap tikus.',
                isEnd: true,
                impact: { reputation: +25, xp: 250 }
            }
        ],
        outcomes: {
            success: { iks_score: +5 }
        },
        relatedCases: ['leptospirosis'],
        educationTopics: ['flood_hygiene', 'rat_control', 'protective_footwear']
    }
];

// ═══════════════════════════════════════════════════════════════
// GIZI & TUMBUH KEMBANG SCENARIOS (4)
// ═══════════════════════════════════════════════════════════════

const NUTRITION_SCENARIOS = [
    {
        id: 'stunting_deteksi',
        title: 'Deteksi Stunting di Posyandu',
        category: 'nutrition',
        icon: '📏',
        description: 'Posyandu bulan ini menemukan 3 balita yang masuk zona merah KMS.',
        triggerConditions: {
            minDay: 30,
            probability: 0.12
        },
        urgency: 'moderate',
        phases: [
            {
                id: 'discovery',
                type: 'dialog',
                speaker: 'Kader Posyandu',
                text: 'Dok, hasil penimbangan bulan ini: 3 balita di bawah garis merah KMS. 2 di antaranya baru masuk zona kuning 2 bulan lalu, sekarang sudah merah.',
                choices: [
                    {
                        text: 'Kunjungi rumah ketiga balita, asesmen gizi lengkap',
                        nextPhase: 'home_assessment',
                        impact: { energy: -25, reputation: +5 }
                    },
                    {
                        text: 'Mulai program PMT (Pemberian Makanan Tambahan)',
                        nextPhase: 'pmt_program',
                        impact: { energy: -10, balance: -300000 }
                    },
                    {
                        text: 'Keduanya: asesmen + PMT langsung',
                        nextPhase: 'comprehensive',
                        impact: { energy: -30, balance: -300000 }
                    }
                ]
            },
            {
                id: 'home_assessment',
                type: 'action',
                description: 'Kunjungi rumah 3 balita stunting',
                metric: 'home_visits',
                target: 3,
                onComplete: 'resolution_home'
            },
            {
                id: 'pmt_program',
                type: 'dialog',
                text: 'PMT berupa telur, susu, dan kacang hijau dibagikan selama sebulan. 2 dari 3 balita menunjukkan kenaikan BB pada penimbangan berikutnya.',
                isEnd: true,
                impact: { reputation: +15, xp: 150 }
            },
            {
                id: 'comprehensive',
                type: 'dialog',
                text: 'Asesmen menemukan pola makan tidak beragam dan higienitas rendah. PMT dimulai bersamaan dengan edukasi gizi ke ibu. Semua 3 balita membaik dalam 2 bulan.',
                isEnd: true,
                impact: { reputation: +30, xp: 300 }
            },
            {
                id: 'resolution_home',
                type: 'dialog',
                text: 'Ditemukan: 1 keluarga miskin (makan nasi dan kerupuk saja), 1 ibu muda tidak tahu MP-ASI yang benar, 1 balita cacingan. Intervensi spesifik dimulai.',
                isEnd: true,
                impact: { reputation: +20, xp: 200 }
            }
        ],
        outcomes: {
            success: { iks_score: +6, reputation: +20 }
        },
        relatedCases: ['gizi_buruk', 'cacingan'],
        educationTopics: ['balanced_nutrition', 'mpasi', 'kms_monitoring']
    },
    {
        id: 'gizi_buruk_balita',
        title: 'Gizi Buruk Balita di RT Pinggiran',
        category: 'nutrition',
        icon: '👶',
        description: 'Ditemukan balita dengan tanda-tanda kwashiorkor di keluarga miskin.',
        triggerConditions: {
            minDay: 40,
            probability: 0.06
        },
        urgency: 'critical',
        phases: [
            {
                id: 'discovery',
                type: 'dialog',
                speaker: 'Kader Desa',
                text: 'Dok, saya baru kunjungi keluarga Pak Tarno di ujung desa. Anaknya Dede (2 tahun) perutnya buncit, kakinya bengkak, rambut kemerahan. Ibunya bilang cuma makan nasi sama garam.',
                choices: [
                    {
                        text: 'Darurat! Bawa Dede ke puskesmas sekarang',
                        nextPhase: 'emergency_care',
                        impact: { energy: -20 }
                    },
                    {
                        text: 'Kunjungi ke rumah dulu, asesmen keluarga',
                        nextPhase: 'home_first',
                        impact: { energy: -25 }
                    }
                ]
            },
            {
                id: 'emergency_care',
                type: 'dialog',
                text: 'Dede dibawa ke puskesmas. BB/U: <-3 SD (gizi buruk). Anda memulai Protocol F-75, PMT terapeutik, dan menyiapkan rujukan ke TFC (Therapeutic Feeding Center) RS.',
                choices: [
                    {
                        text: 'Rujuk ke RS + koordinasi PKH untuk bantuan keluarga',
                        nextPhase: 'resolution_referral',
                        impact: { reputation: +10 }
                    }
                ]
            },
            {
                id: 'home_first',
                type: 'dialog',
                text: 'Di rumah, ditemukan kemiskinan ekstrem. Ayah sakit TB, ibu bekerja serabutan. Dede hanya makan nasi dan garam. Anda mendokumentasikan dan membawa Dede ke puskesmas.',
                isEnd: true,
                impact: { reputation: +20, xp: 200 }
            },
            {
                id: 'resolution_referral',
                type: 'dialog',
                text: 'Dede dirujuk dan mendapat terapi gizi intensif. Koordinasi dengan Dinas Sosial berhasil mengaktifkan PKH untuk keluarga Pak Tarno. Dede pulih dalam 3 bulan.',
                isEnd: true,
                impact: { reputation: +30, xp: 350 }
            }
        ],
        outcomes: {
            success: { iks_score: +8, reputation: +25 }
        },
        relatedCases: ['gizi_buruk'],
        educationTopics: ['severe_malnutrition', 'social_safety_net', 'pkh_program']
    },
    {
        id: 'anemia_remaja',
        title: 'Anemia Remaja Putri — Screening Sekolah',
        category: 'nutrition',
        icon: '💊',
        description: 'Screening Hb di SMP menemukan 40% remaja putri anemia. Program tablet Fe dimulai.',
        triggerConditions: {
            minDay: 35,
            probability: 0.10
        },
        urgency: 'moderate',
        phases: [
            {
                id: 'discovery',
                type: 'dialog',
                speaker: 'Nutrisionis',
                text: 'Dok, hasil screening Hb di SMPN 2: dari 80 siswi, 32 siswi Hb di bawah 12. Tertinggi 8.2 g/dL! Mereka sering pusing dan lemas tapi anggap biasa.',
                choices: [
                    {
                        text: 'Mulai program tablet Fe mingguan + edukasi gizi',
                        nextPhase: 'fe_program',
                        impact: { energy: -15, balance: -200000 }
                    },
                    {
                        text: 'Edukasi guru dan orang tua tentang bahaya anemia',
                        nextPhase: 'parent_teacher',
                        impact: { energy: -10 }
                    }
                ]
            },
            {
                id: 'fe_program',
                type: 'action',
                description: 'Distribusikan tablet Fe dan lakukan edukasi',
                metric: 'education_given',
                target: 2,
                onComplete: 'resolution_fe'
            },
            {
                id: 'parent_teacher',
                type: 'dialog',
                text: 'Pertemuan dihadiri 50 orang tua. Mereka terkejut mengetahui kondisi anak-anaknya. Banyak yang berjanji memperbaiki menu makanan.',
                isEnd: true,
                impact: { reputation: +15, xp: 150 }
            },
            {
                id: 'resolution_fe',
                type: 'dialog',
                text: 'Setelah 3 bulan tablet Fe + edukasi gizi, rata-rata Hb naik 1.5 g/dL. Siswi melaporkan lebih bertenaga dan konsentrasi meningkat.',
                isEnd: true,
                impact: { reputation: +25, xp: 250 }
            }
        ],
        outcomes: {
            success: { iks_score: +5, reputation: +20 }
        },
        relatedCases: ['anemia_defisiensi_besi'],
        educationTopics: ['iron_rich_food', 'menstruation_hygiene', 'anemia_awareness']
    },
    {
        id: 'mpasi_salah',
        title: 'MP-ASI Terlalu Dini',
        category: 'nutrition',
        icon: '🍼',
        description: 'Bayi 3 bulan sudah diberi pisang dan bubur. Ibu muda pengaruh mertua.',
        triggerConditions: {
            minDay: 15,
            probability: 0.10
        },
        urgency: 'moderate',
        phases: [
            {
                id: 'discovery',
                type: 'dialog',
                speaker: 'Bidan',
                text: 'Dok, Bu Dina (19 tahun, anak pertama) bawa bayinya (3 bulan) karena diare. Ternyata sudah dikasih pisang kerok sama neneknya sejak umur 2 bulan. "Biar kenyang," katanya.',
                choices: [
                    {
                        text: 'Edukasi Bu Dina dan neneknya tentang ASI eksklusif',
                        nextPhase: 'educate_both',
                        impact: { energy: -15 }
                    },
                    {
                        text: 'Tangani diare dulu, edukasi saat kontrol ulang',
                        nextPhase: 'treat_then_educate',
                        impact: { energy: -10 }
                    }
                ]
            },
            {
                id: 'educate_both',
                type: 'dialog',
                text: '"Bu, usus bayi 3 bulan belum siap cerna makanan padat. Seperti kasih nasi ke anak baru lahir gigi." Nenek akhirnya mengerti. Bayi kembali ASI eksklusif.',
                isEnd: true,
                impact: { reputation: +15, xp: 120 }
            },
            {
                id: 'treat_then_educate',
                type: 'dialog',
                text: 'Diare ditangani dengan oralit dan zinc. Saat kontrol ulang, Anda mendapati bayi masih diberi pisang. Perlu pendekatan lebih intensif.',
                choices: [
                    {
                        text: 'Libatkan kader untuk home visit rutin',
                        nextPhase: 'resolution_kader',
                        impact: { energy: -5 }
                    }
                ]
            },
            {
                id: 'resolution_kader',
                type: 'dialog',
                text: 'Kader rutin kunjungi Bu Dina seminggu sekali. Perlahan nenek mulai percaya. Setelah sebulan, bayi full ASI eksklusif.',
                isEnd: true,
                impact: { reputation: +20, xp: 150 }
            }
        ],
        outcomes: {
            success: { iks_score: +3 }
        },
        relatedCases: ['diare_akut'],
        educationTopics: ['exclusive_breastfeeding', 'complementary_feeding', 'infant_nutrition']
    }
];

// ═══════════════════════════════════════════════════════════════
// MENTAL HEALTH SCENARIOS (3) — Kesehatan Jiwa
// ═══════════════════════════════════════════════════════════════

const MENTAL_HEALTH_SCENARIOS = [
    {
        id: 'depresi_pascabencana',
        title: 'Depresi Pasca-Bencana Longsor',
        category: 'mental_health',
        icon: '😔',
        description: 'Setelah longsor menghancurkan 5 rumah di dusun, beberapa warga menunjukkan gejala depresi dan PTSD.',
        triggerConditions: {
            season: 'rainy',
            minDay: 30,
            probability: 0.06
        },
        urgency: 'high',
        phases: [
            {
                id: 'discovery',
                type: 'dialog',
                speaker: 'Kader Desa',
                text: 'Dok, sejak longsor bulan lalu, Pak Asep jadi pendiam banget. Tidak mau keluar rumah, tidak mau kerja di sawah. Istrinya bilang sering menangis malam-malam. Ada 3 warga lain juga begitu.',
                choices: [
                    {
                        text: 'Kunjungi rumah Pak Asep, lakukan skrining kesehatan jiwa',
                        nextPhase: 'home_screening',
                        impact: { energy: -20, reputation: +5 }
                    },
                    {
                        text: 'Adakan sesi konseling kelompok untuk korban longsor',
                        nextPhase: 'group_counseling',
                        impact: { energy: -15, balance: -100000 }
                    },
                    {
                        text: 'Rujuk ke psikolog/psikiater di RS kabupaten',
                        nextPhase: 'referral',
                        impact: { energy: -5 }
                    }
                ]
            },
            {
                id: 'home_screening',
                type: 'dialog',
                text: 'Anda menggunakan SRQ-20 (Self-Reporting Questionnaire). Pak Asep skor 14/20 — indikasi gangguan jiwa. "Saya tidak bisa tidur Dok, setiap hujan saya ingat suara tanahnya..." Anda mengenali gejala PTSD.',
                choices: [
                    {
                        text: 'Berikan PFA (Psychological First Aid) dan jadwalkan follow-up',
                        nextPhase: 'resolution_pfa',
                        impact: { reputation: +10 }
                    },
                    {
                        text: 'Rujuk ke poli jiwa RS, sambil damping dengan konseling ringan',
                        nextPhase: 'resolution_rujuk',
                        impact: { reputation: +5 }
                    }
                ]
            },
            {
                id: 'group_counseling',
                type: 'dialog',
                text: 'Sesi kelompok dihadiri 8 warga korban longsor. Mereka saling bercerita, menangis bersama. Pak Asep: "Ternyata saya tidak sendiri." Proses healing dimulai.',
                isEnd: true,
                impact: { reputation: +25, xp: 250 }
            },
            {
                id: 'referral',
                type: 'dialog',
                text: 'Pak Asep menolak dirujuk. "Saya tidak gila, Dok! Cuma sedih saja." Stigma kesehatan jiwa membuat penanganan terhambat.',
                choices: [
                    {
                        text: 'Jelaskan bahwa depresi bukan "gila," ini penyakit yang bisa diobati',
                        nextPhase: 'resolution_destigma',
                        impact: { reputation: +5 }
                    }
                ]
            },
            {
                id: 'resolution_pfa',
                type: 'dialog',
                text: 'Dengan PFA dan kunjungan rutin tiap minggu, Pak Asep perlahan membaik. Setelah 2 bulan, dia mulai kembali ke sawah. "Terima kasih Dok, saya merasa didengarkan."',
                isEnd: true,
                impact: { reputation: +30, xp: 300 }
            },
            {
                id: 'resolution_rujuk',
                type: 'dialog',
                text: 'Psikiater meresepkan sertraline dosis rendah. Dengan kombinasi obat dan konseling di puskesmas, Pak Asep berangsur membaik dalam 6 minggu.',
                isEnd: true,
                impact: { reputation: +20, xp: 200 }
            },
            {
                id: 'resolution_destigma',
                type: 'dialog',
                text: '"Pak Asep, kalau kaki patah, Bapak ke dokter kan? Hati dan pikiran juga bisa sakit." Perlahan, Pak Asep mau dibawa ke RS. Treatment dimulai.',
                isEnd: true,
                impact: { reputation: +20, xp: 200 }
            }
        ],
        outcomes: {
            success: { iks_score: +5, reputation: +20, xp: 250 }
        },
        relatedCases: [],
        educationTopics: ['mental_health', 'ptsd_awareness', 'psychological_first_aid']
    },
    {
        id: 'psikotik_akut',
        title: 'Episode Psikotik Akut di Pasar',
        category: 'mental_health',
        icon: '🫨',
        description: 'Seorang pria muda berteriak-teriak di pasar, mengaku dikejar setan. Warga panik.',
        triggerConditions: {
            minDay: 25,
            probability: 0.04
        },
        urgency: 'critical',
        phases: [
            {
                id: 'discovery',
                type: 'dialog',
                speaker: 'Perawat',
                text: 'Dok! Di pasar ada pemuda namanya Roni, 22 tahun, tiba-tiba mengamuk. Dia teriak-teriak "ada yang mau bunuh saya!" dan melempar barang. Warga takut, ada yang mau ikat pakai tali. Gimana Dok?',
                choices: [
                    {
                        text: 'Segera ke lokasi, tenangkan dengan pendekatan empatis',
                        nextPhase: 'calm_approach',
                        impact: { energy: -25, reputation: +10 }
                    },
                    {
                        text: 'JANGAN diikat! Minta warga beri ruang, saya ke sana dengan haloperidol',
                        nextPhase: 'medical_approach',
                        impact: { energy: -20 }
                    },
                    {
                        text: 'Hubungi RSJ/RSUD untuk tim krisis',
                        nextPhase: 'crisis_team',
                        impact: { energy: -5 }
                    }
                ]
            },
            {
                id: 'calm_approach',
                type: 'dialog',
                text: 'Anda dekati Roni pelan-pelan. "Roni, saya dokter. Saya di sini untuk bantu kamu. Kamu aman." Perlahan Roni berhenti berteriak, tapi masih ketakutan. "Dok, mereka mau bunuh saya..."',
                choices: [
                    {
                        text: 'Validasi perasaannya, ajak ke puskesmas perlahan',
                        nextPhase: 'resolution_empathic',
                        impact: { reputation: +10 }
                    }
                ]
            },
            {
                id: 'medical_approach',
                type: 'dialog',
                text: 'Warga diberi ruangan. Anda berikan haloperidol 5mg IM setelah dapat persetujuan keluarga. Roni tenang dalam 30 menit dan dibawa ke puskesmas.',
                choices: [
                    {
                        text: 'Edukasi keluarga tentang skizofrenia dan pentingnya pengobatan',
                        nextPhase: 'resolution_family_edu',
                        impact: { reputation: +5 }
                    }
                ]
            },
            {
                id: 'crisis_team',
                type: 'dialog',
                text: 'Tim krisis RSJ datang dalam 2 jam. Selama menunggu, warga mengikat Roni di tiang. Anda minta dibuka: "Beliau sakit, bukan penjahat!"',
                isEnd: true,
                impact: { reputation: +10, xp: 100 }
            },
            {
                id: 'resolution_empathic',
                type: 'dialog',
                text: 'Roni mau ke puskesmas. Keluarga datang — ternyata sudah putus obat 3 bulan. "Obatnya bikin ngantuk Dok." Anda edukasi pentingnya kepatuhan dan sesuaikan dosis. Roni dirujuk dengan keluarga mendampingi.',
                isEnd: true,
                impact: { reputation: +30, xp: 300 }
            },
            {
                id: 'resolution_family_edu',
                type: 'dialog',
                text: 'Keluarga Roni terkejut: "Jadi ini bukan kesurupan, Dok?" Anda jelaskan bahwa skizofrenia adalah penyakit otak, bisa dikontrol dengan obat. Keluarga berjanji menemani Roni minum obat rutin.',
                isEnd: true,
                impact: { reputation: +25, xp: 250 }
            }
        ],
        outcomes: {
            success: { iks_score: +4, reputation: +20, xp: 250 }
        },
        relatedCases: [],
        educationTopics: ['mental_health', 'psychosis_management', 'destigmatization']
    },
    {
        id: 'bunuh_diri_remaja',
        title: 'Percobaan Bunuh Diri Remaja',
        category: 'mental_health',
        icon: '🆘',
        description: 'Remaja SMA ditemukan minum racun serangga setelah di-bully di media sosial.',
        triggerConditions: {
            minDay: 35,
            probability: 0.03
        },
        urgency: 'critical',
        phases: [
            {
                id: 'discovery',
                type: 'dialog',
                speaker: 'Ibu Pasien',
                text: 'Dok! Anak saya Dini (16 tahun) minum baygon! Dia muntah-muntah, perutnya sakit! Tolong Dok! Saya nemu pesan di HP-nya, dia dihina teman-temannya...',
                choices: [
                    {
                        text: 'Segera tangani keracunan: bilas lambung + atropin',
                        nextPhase: 'emergency_treatment',
                        impact: { energy: -30 }
                    },
                    {
                        text: 'Stabilisasi awal, langsung rujuk ke IGD RS',
                        nextPhase: 'immediate_referral',
                        impact: { energy: -15 }
                    }
                ]
            },
            {
                id: 'emergency_treatment',
                type: 'dialog',
                text: 'Anda melakukan dekontaminasi dan memberikan antidotum. Dini stabil. Setelah kondisi fisik aman, Anda duduk bersamanya: "Dini, Kakak mau dengar ceritamu."',
                choices: [
                    {
                        text: 'Lakukan asesmen risiko bunuh diri dan safety planning',
                        nextPhase: 'risk_assessment',
                        impact: { reputation: +10 }
                    }
                ]
            },
            {
                id: 'immediate_referral',
                type: 'dialog',
                text: 'Dini dirujuk ke IGD RS. Dokter RS menangani keracunan. Anda menemani keluarga dan menghubungi psikiater anak.',
                isEnd: true,
                impact: { reputation: +15, xp: 150 }
            },
            {
                id: 'risk_assessment',
                type: 'dialog',
                text: 'Dini menangis: "Mereka upload foto jelek saya, semua orang ketawa. Saya malu, nggak mau hidup lagi." Anda menggunakan C-SSRS (Columbia Suicide Severity Rating Scale): risiko tinggi, perlu rawat inap.',
                choices: [
                    {
                        text: 'Rujuk ke RS dengan pendampingan psikiatri + edukasi orang tua',
                        nextPhase: 'resolution_comprehensive',
                        impact: { reputation: +10 }
                    },
                    {
                        text: 'Buat safety plan + libatkan guru BK dan konselor sekolah',
                        nextPhase: 'resolution_school',
                        impact: { reputation: +5 }
                    }
                ]
            },
            {
                id: 'resolution_comprehensive',
                type: 'dialog',
                text: 'Dini dirawat 5 hari di RS. Psikiater mendiagnosis episode depresif berat. Setelah pulang, Anda koordinasi dengan sekolah untuk mencegah bullying. Keluarga menjadi lebih perhatian. "Terima kasih Dok, saya hampir kehilangan anak saya."',
                isEnd: true,
                impact: { reputation: +35, xp: 350 }
            },
            {
                id: 'resolution_school',
                type: 'dialog',
                text: 'Safety plan dibuat bersama Dini dan orang tua. Guru BK menangani pelaku bullying. Dini pelan-pelan kembali sekolah dengan pendampingan. Anda menjadwalkan follow-up mingguan.',
                isEnd: true,
                impact: { reputation: +25, xp: 250 }
            }
        ],
        outcomes: {
            success: { iks_score: +6, reputation: +25, xp: 300 }
        },
        relatedCases: [],
        educationTopics: ['suicide_prevention', 'cyberbullying', 'adolescent_mental_health']
    }
];

// ═══════════════════════════════════════════════════════════════
// ADOLESCENT HEALTH / PKPR SCENARIOS (3) — Kesehatan Remaja
// ═══════════════════════════════════════════════════════════════

const ADOLESCENT_SCENARIOS = [
    {
        id: 'anemia_remaja',
        title: 'Skrining Anemia Remaja Putri',
        category: 'adolescent',
        icon: '🩸',
        description: 'Program skrining Hb di SMP menemukan 40% siswi anemia. Penyebab: kurang zat besi + mitos diet.',
        triggerConditions: {
            minDay: 15,
            probability: 0.10
        },
        urgency: 'moderate',
        phases: [
            {
                id: 'discovery',
                type: 'dialog',
                speaker: 'Bidan',
                text: 'Dok, hasil skrining Hb di SMP Sukamaju mengejutkan: 40% siswi kelas 7-9 anemia (Hb <12 g/dL). Banyak yang pucat, lesu, sulit konsentrasi. Paling parah Ani, Hb cuma 7.2.',
                choices: [
                    {
                        text: 'Distribusikan tablet Fe + edukasi gizi kaya zat besi',
                        nextPhase: 'iron_supplement',
                        impact: { energy: -15, balance: -200000 }
                    },
                    {
                        text: 'Gelar sesi Youth-Friendly Health Services (YFHS)',
                        nextPhase: 'yfhs_session',
                        impact: { energy: -20, reputation: +5 }
                    },
                    {
                        text: 'Investigasi penyebab: wawancara kelompok soal pola makan',
                        nextPhase: 'investigate_diet',
                        impact: { energy: -15 }
                    }
                ]
            },
            {
                id: 'iron_supplement',
                type: 'dialog',
                text: 'Tablet Fe dibagikan seminggu sekali (sesuai program pemerintah). Tapi beberapa siswi menolak: "Bikin mual, Bu" dan "Nanti gemuk." Perlu edukasi tambahan.',
                choices: [
                    {
                        text: 'Jelaskan cara minum Fe yang benar + mitos diet',
                        nextPhase: 'resolution_edu',
                        impact: { reputation: +5 }
                    }
                ]
            },
            {
                id: 'yfhs_session',
                type: 'dialog',
                text: 'Sesi YFHS digelar di ruang UKS. Suasana dibuat santai, remaja bebas bertanya tanpa dihakimi. Topik: menstruasi, gizi, anemia, body image. Antusiasme tinggi!',
                choices: [
                    {
                        text: 'Bentuk Konselor Sebaya dari siswi pilihan',
                        nextPhase: 'resolution_peer',
                        impact: { reputation: +10 }
                    }
                ]
            },
            {
                id: 'investigate_diet',
                type: 'dialog',
                text: 'Terungkap: banyak siswi "diet" melewatkan sarapan dan hanya makan mie instan. Beberapa mengikuti tren diet dari TikTok yang menyesatkan. "Makan banyak nanti gemuk, Dok!"',
                choices: [
                    {
                        text: 'Buat konten edukasi yang menarik: "Diet sehat vs diet bahaya"',
                        nextPhase: 'resolution_content',
                        impact: { energy: -10, reputation: +10 }
                    }
                ]
            },
            {
                id: 'resolution_edu',
                type: 'dialog',
                text: '"Minum Fe setelah makan malam, pakai air jeruk biar tidak mual." Tips praktis berhasil! Kepatuhan minum Fe naik dari 30% ke 75%. Setelah 3 bulan, rata-rata Hb naik 1.8 g/dL.',
                isEnd: true,
                impact: { reputation: +20, xp: 200 }
            },
            {
                id: 'resolution_peer',
                type: 'dialog',
                text: '5 siswi terpilih menjadi Konselor Sebaya. Mereka dilatih tentang gizi remaja dan kesehatan reproduksi. Program berkelanjutan — anemia turun dari 40% ke 15% dalam 6 bulan!',
                isEnd: true,
                impact: { reputation: +30, xp: 300 }
            },
            {
                id: 'resolution_content',
                type: 'dialog',
                text: 'Infografis "Diet Sehat vs Diet Bahaya" jadi viral di grup WA siswi. Mereka mulai sarapan dan memilih makanan kaya zat besi. "Dok, ternyata makan sayur nggak bikin gemuk ya!"',
                isEnd: true,
                impact: { reputation: +25, xp: 250 }
            }
        ],
        outcomes: {
            success: { iks_score: +5, reputation: +20, xp: 250 }
        },
        relatedCases: ['anemia_defisiensi_besi'],
        educationTopics: ['iron_rich_food', 'menstruation_hygiene', 'adolescent_nutrition', 'body_image']
    },
    {
        id: 'teen_pregnancy',
        title: 'Kehamilan Remaja — Dilema Sosial',
        category: 'adolescent',
        icon: '🤰',
        description: 'Siswi SMP 15 tahun diam-diam hamil 5 bulan. Keluarga malu dan ingin menikahkan paksa.',
        triggerConditions: {
            minDay: 30,
            probability: 0.04
        },
        urgency: 'critical',
        phases: [
            {
                id: 'discovery',
                type: 'dialog',
                speaker: 'Bidan',
                text: 'Dok, saya terima rujukan dari Posyandu. Rina (15 tahun, siswi SMP) hamil 20 minggu. Dia menyembunyikan karena takut. Orang tua baru tahu dan marah besar. Ayahnya mau menikahkan paksa ke pacar Rina yang 17 tahun.',
                choices: [
                    {
                        text: 'Prioritas: ANC segera + konseling keluarga',
                        nextPhase: 'anc_counseling',
                        impact: { energy: -20, reputation: +5 }
                    },
                    {
                        text: 'Libatkan perlindungan anak — ini di bawah umur',
                        nextPhase: 'child_protection',
                        impact: { energy: -10, reputation: +5 }
                    },
                    {
                        text: 'Pendekatan berbasis keluarga, hormati budaya lokal',
                        nextPhase: 'cultural_approach',
                        impact: { energy: -15 }
                    }
                ]
            },
            {
                id: 'anc_counseling',
                type: 'dialog',
                text: 'Anda melakukan ANC pertama: BB rendah, Hb 9.5 (anemia). Risiko tinggi karena usia muda. Rina menangis: "Saya tidak mau nikah, saya mau sekolah." Konseling keluarga sulit — ayah bersikeras.',
                choices: [
                    {
                        text: 'Jelaskan risiko medis kehamilan remaja dan pernikahan anak',
                        nextPhase: 'resolution_medical',
                        impact: { reputation: +10 }
                    }
                ]
            },
            {
                id: 'child_protection',
                type: 'dialog',
                text: 'Anda menghubungi UPTD PPA (Perlindungan Perempuan dan Anak). Tim datang dan mediasi dengan keluarga. Pernikahan ditunda. Rina mendapat pendampingan psikologis.',
                isEnd: true,
                impact: { reputation: +25, xp: 250 }
            },
            {
                id: 'cultural_approach',
                type: 'dialog',
                text: 'Dengan pendekatan kultural, Anda ajak bicara tokoh agama. Beliau membantu mediasi: "Nikah itu harus siap lahir batin, bukan harus." Keluarga mulai terbuka untuk alternatif.',
                choices: [
                    {
                        text: 'Usulkan Rina melanjutkan sekolah sambil periksa kehamilan rutin',
                        nextPhase: 'resolution_school',
                        impact: { reputation: +10 }
                    }
                ]
            },
            {
                id: 'resolution_medical',
                type: 'dialog',
                text: 'Data yang Anda presentasikan menggugah: "Ibu di bawah 17 tahun, risiko kematiannya 2x lipat." Ayah Rina akhirnya setuju menunda nikah. Rina periksa rutin di Pustu dan mendapat suplementasi Fe.',
                isEnd: true,
                impact: { reputation: +30, xp: 300 }
            },
            {
                id: 'resolution_school',
                type: 'dialog',
                text: 'Dengan dukungan guru dan keluarga, Rina melanjutkan sekolah. ANC rutin di Pustu. Setelah melahirkan aman, program kejar paket menjadi opsi. "Saya mau jadi bidan, Dok."',
                isEnd: true,
                impact: { reputation: +30, xp: 300 }
            }
        ],
        outcomes: {
            success: { iks_score: +5, reputation: +25, xp: 300 }
        },
        relatedCases: ['anemia_defisiensi_besi', 'preeklampsia'],
        educationTopics: ['adolescent_reproductive_health', 'child_marriage_prevention', 'antenatal_care']
    },
    {
        id: 'napza_remaja',
        title: 'Penyalahgunaan NAPZA di Kalangan Remaja',
        category: 'adolescent',
        icon: '💊',
        description: 'Beberapa remaja SMA tertangkap menghirup lem di pos ronda. Warga gelisah.',
        triggerConditions: {
            minDay: 25,
            probability: 0.05
        },
        urgency: 'high',
        phases: [
            {
                id: 'discovery',
                type: 'dialog',
                speaker: 'Ketua RT',
                text: 'Dok, tadi malam warga tangkap 4 remaja SMA ngelem di pos ronda. Mata merah, bicara ngelantur. Orang tuanya malu bukan main. RT mau mengusir mereka, gimana Dok?',
                choices: [
                    {
                        text: 'Jangan dihukum, ini masalah kesehatan — ajak bicara baik-baik',
                        nextPhase: 'empathic_approach',
                        impact: { energy: -20, reputation: +10 }
                    },
                    {
                        text: 'Periksa kesehatan mereka, laporkan ke BNN/sekolah',
                        nextPhase: 'medical_report',
                        impact: { energy: -15 }
                    },
                    {
                        text: 'Adakan penyuluhan bahaya NAPZA untuk seluruh remaja desa',
                        nextPhase: 'community_education',
                        impact: { energy: -15, balance: -150000 }
                    }
                ]
            },
            {
                id: 'empathic_approach',
                type: 'dialog',
                text: 'Anda mengajak 4 remaja bicara satu per satu. Budi (17) menangis: "Bapak saya kerja di kota, nggak pernah pulang. Ibu sibuk di sawah. Saya bosan, teman-teman ngajak ngelem."',
                choices: [
                    {
                        text: 'Hubungkan dengan kegiatan positif: karang taruna, olahraga',
                        nextPhase: 'resolution_positive',
                        impact: { reputation: +10 }
                    },
                    {
                        text: 'Konseling motivasi + ajak jadi kader anti-NAPZA',
                        nextPhase: 'resolution_peer_kader',
                        impact: { reputation: +15 }
                    }
                ]
            },
            {
                id: 'medical_report',
                type: 'dialog',
                text: 'Pemeriksaan menunjukkan iritasi mukosa hidung dan gangguan kognitif ringan pada 2 remaja. BNN koordinasinya lambat. Sekolah merespon dengan skorsing — malah memperburuk situasi.',
                isEnd: true,
                impact: { reputation: +10, xp: 100 }
            },
            {
                id: 'community_education',
                type: 'dialog',
                text: 'Penyuluhan dihadiri 30 remaja dan orang tua. Anda menunjukkan foto otak yang rusak akibat inhalansia. Efek shock cukup kuat, tapi perlu follow-up agar berkelanjutan.',
                choices: [
                    {
                        text: 'Bentuk "Tim Remaja Bersih" sebagai program berkelanjutan',
                        nextPhase: 'resolution_program',
                        impact: { reputation: +10 }
                    }
                ]
            },
            {
                id: 'resolution_positive',
                type: 'dialog',
                text: 'Budi dan teman-temannya mulai rutin ikut karang taruna dan latihan sepak bola sore. "Lebih asik ini Dok daripada ngelem." 3 bulan kemudian, tidak ada laporan penyalahgunaan baru.',
                isEnd: true,
                impact: { reputation: +25, xp: 250 }
            },
            {
                id: 'resolution_peer_kader',
                type: 'dialog',
                text: 'Plot twist: Budi jadi kader anti-NAPZA paling vokal di sekolahnya! "Saya tahu rasanya, makanya saya bilang ke teman-teman: jangan coba." Pengalaman pribadi jadi bekal edukasi terbaik.',
                isEnd: true,
                impact: { reputation: +35, xp: 350 }
            },
            {
                id: 'resolution_program',
                type: 'dialog',
                text: '"Tim Remaja Bersih" aktif setiap minggu. Mereka membuat konten TikTok anti-NAPZA yang viral di desa tetangga. Program diadopsi oleh Kecamatan.',
                isEnd: true,
                impact: { reputation: +30, xp: 300 }
            }
        ],
        outcomes: {
            success: { iks_score: +5, reputation: +25, xp: 300 }
        },
        relatedCases: [],
        educationTopics: ['substance_abuse', 'adolescent_mental_health', 'positive_youth_development']
    }
];

// ═══════════════════════════════════════════════════════════════
// FOOD SAFETY SCENARIOS (3) — Keamanan Pangan
// ═══════════════════════════════════════════════════════════════

const FOOD_SAFETY_SCENARIOS = [
    {
        id: 'makan_sembarangan',
        title: 'KLB Keracunan Makanan di Hajatan',
        category: 'food_safety',
        icon: '🤮',
        description: 'Setelah hajatan nikahan, 30 tamu mendadak muntah dan diare. Diduga makanan terkontaminasi.',
        triggerConditions: {
            minDay: 10,
            probability: 0.08
        },
        urgency: 'critical',
        phases: [
            {
                id: 'discovery',
                type: 'dialog',
                speaker: 'Perawat',
                text: 'Dok! Pagi ini sudah 12 orang datang dengan gejala sama: muntah, diare, kram perut. Semuanya habis makan di hajatan Bu Haji kemarin malam. Ada yang sampai dehidrasi berat.',
                choices: [
                    {
                        text: 'Ini KLB! Aktifkan W1-W2, tangani dehidrasi, investigasi makanan',
                        nextPhase: 'investigation',
                        impact: { energy: -25, reputation: +10 }
                    },
                    {
                        text: 'Tangani pasien dulu, laporkan setelah semua stabil',
                        nextPhase: 'treat_first',
                        impact: { energy: -20 }
                    }
                ]
            },
            {
                id: 'investigation',
                type: 'dialog',
                text: 'Investigasi menunjukkan: menu nasi box dengan ayam goreng, sambal, dan es teh. Ayam dimasak pagi, disimpan 12 jam tanpa pendingin di suhu 32°C. Sampel dikirim ke lab: positif Staphylococcus aureus.',
                choices: [
                    {
                        text: 'Edukasi catering soal food safety + lapor Dinkes',
                        nextPhase: 'resolution_edu',
                        impact: { reputation: +10 }
                    }
                ]
            },
            {
                id: 'treat_first',
                type: 'dialog',
                text: 'Semua pasien ditangani: rehidrasi oral/IV. 2 lansia perlu rawat inap. Satu bayi 8 bulan ikut terkena — kondisi kritis.',
                choices: [
                    {
                        text: 'Rujuk bayi segera + investigasi sumber',
                        nextPhase: 'resolution_rujuk_bayi',
                        impact: { energy: -10, reputation: +5 }
                    }
                ]
            },
            {
                id: 'resolution_edu',
                type: 'dialog',
                text: 'Laporan W1 dikirim dalam 24 jam. Catering ditegur dan dibina. Anda mengadakan pelatihan food safety untuk 10 katering desa. "Masak-sajikan maximal 4 jam, atau simpan di bawah 5°C."',
                isEnd: true,
                impact: { reputation: +30, xp: 300 }
            },
            {
                id: 'resolution_rujuk_bayi',
                type: 'dialog',
                text: 'Bayi berhasil dirujuk tepat waktu. Setelah 3 hari di RS, kondisinya membaik. KLB dilaporkan, total 30 korban, 0 meninggal. Dinkes turun untuk pembinaan food safety.',
                isEnd: true,
                impact: { reputation: +25, xp: 250 }
            }
        ],
        outcomes: {
            success: { iks_score: +5, reputation: +25, xp: 300 }
        },
        relatedCases: ['gastroenteritis_akut'],
        educationTopics: ['food_safety', 'klb_investigation', 'food_borne_disease']
    },
    {
        id: 'formalin_tahu',
        title: 'Tahu Berformalin di Pasar Desa',
        category: 'food_safety',
        icon: '⚗️',
        description: 'Tes cepat di pasar menemukan tahu berformalin. Pedagang tidak tahu barangnya berbahaya.',
        triggerConditions: {
            minDay: 20,
            probability: 0.06
        },
        urgency: 'high',
        phases: [
            {
                id: 'discovery',
                type: 'dialog',
                speaker: 'Sanitarian',
                text: 'Dok, hasil tes kit di pasar: tahu dari Pak Soleh positif formalin! Warnanya ungu pekat. Pedagang kaget: "Saya beli dari pabrik di kota, nggak tahu ada formalinnya."',
                choices: [
                    {
                        text: 'Tarik dari peredaran, edukasi pedagang, laporkan ke BPOM',
                        nextPhase: 'withdrawal',
                        impact: { energy: -15, reputation: +10 }
                    },
                    {
                        text: 'Telusuri rantai pasok: dari mana tahu ini diproduksi?',
                        nextPhase: 'trace_supply',
                        impact: { energy: -20 }
                    }
                ]
            },
            {
                id: 'withdrawal',
                type: 'dialog',
                text: 'Tahu ditarik, warga diedukasi: "Tahu berformalin keras, tidak mudah hancur, tahan berhari-hari." Pedagang diminta ganti supplier. Laporan dikirim ke BPOM.',
                isEnd: true,
                impact: { reputation: +25, xp: 250 }
            },
            {
                id: 'trace_supply',
                type: 'dialog',
                text: 'Investigasi menunjukkan tahu berasal dari pabrik rumahan di kota kecamatan. Mereka tambahkan formalin agar tahan 5 hari tanpa pendingin. BPOM dan polisi turun tangan — pabrik disegel.',
                isEnd: true,
                impact: { reputation: +35, xp: 350 }
            }
        ],
        outcomes: {
            success: { iks_score: +4, reputation: +25, xp: 300 }
        },
        relatedCases: [],
        educationTopics: ['food_additives', 'formalin_hazard', 'food_inspection']
    },
    {
        id: 'jajan_anak_sekolah',
        title: 'Jajanan Sekolah Tidak Sehat',
        category: 'food_safety',
        icon: '🍭',
        description: '80% jajanan di depan SD mengandung pewarna tekstil dan pemanis buatan berlebih.',
        triggerConditions: {
            minDay: 15,
            probability: 0.08
        },
        urgency: 'moderate',
        phases: [
            {
                id: 'discovery',
                type: 'dialog',
                speaker: 'Guru UKS',
                text: 'Dok, banyak anak sering sakit perut setelah jajan di depan sekolah. Saya curiga jajanannya tidak sehat. Es sirop warnanya merah menyala, krupuk warnanya mencolok sekali.',
                choices: [
                    {
                        text: 'Bawa test kit ke sekolah, tes jajanan di depan anak-anak',
                        nextPhase: 'live_testing',
                        impact: { energy: -15, reputation: +5 }
                    },
                    {
                        text: 'Gelar program "Kantin Sehat" di sekolah',
                        nextPhase: 'healthy_canteen',
                        impact: { energy: -20, balance: -200000 }
                    }
                ]
            },
            {
                id: 'live_testing',
                type: 'dialog',
                text: 'Di depan 200 murid, Anda tes jajanan: es sirop positif rhodamin B, krupuk positif metanil yellow! Anak-anak terkejut. "Wah, ternyata bahaya ya Dok!" Efek edukasi luar biasa.',
                choices: [
                    {
                        text: 'Bina pedagang + buat daftar jajanan aman',
                        nextPhase: 'resolution_vendor',
                        impact: { reputation: +10 }
                    }
                ]
            },
            {
                id: 'healthy_canteen',
                type: 'dialog',
                text: 'Kantin sehat digelar dengan menu bergizi: nasi kuning, telur rebus, buah potong. Harga terjangkau Rp 5.000. Anak-anak antusias!',
                isEnd: true,
                impact: { reputation: +25, xp: 250 }
            },
            {
                id: 'resolution_vendor',
                type: 'dialog',
                text: 'Pedagang dibina, yang kooperatif diberi stiker "Jajanan Aman Puskesmas Verified." Penjualan mereka naik 40%! Sistem reward berhasil.',
                isEnd: true,
                impact: { reputation: +30, xp: 300 }
            }
        ],
        outcomes: {
            success: { iks_score: +4, reputation: +20, xp: 250 }
        },
        relatedCases: [],
        educationTopics: ['food_safety', 'food_additives', 'school_health']
    }
];

// ═══════════════════════════════════════════════════════════════
// TRADITIONAL HEALTH SCENARIOS (3) — Kesehatan Tradisional
// ═══════════════════════════════════════════════════════════════

const TRADITIONAL_HEALTH_SCENARIOS = [
    {
        id: 'jamu_berbahaya',
        title: 'Jamu Keliling Berbahaya — Oplosan Steroid',
        category: 'traditional_health',
        icon: '⚠️',
        description: 'Warga lansia rutin beli jamu keliling yang ternyata mengandung dexamethasone dan piroksikam.',
        triggerConditions: {
            minDay: 20,
            probability: 0.06
        },
        urgency: 'high',
        phases: [
            {
                id: 'discovery',
                type: 'dialog',
                speaker: 'Kader',
                text: 'Dok, Mbah Siti (70 tahun) masuk puskesmas dengan muka bengkak, gula darah 450, dan tekanan darah 190/110. Dia bilang sudah minum jamu "pegal linu" dari tukang keliling selama 6 bulan. "Enak Dok, badannya langsung enteng."',
                choices: [
                    {
                        text: 'Curiga steroid! Periksa tanda-tanda cushingoid + stabilkan',
                        nextPhase: 'examine',
                        impact: { energy: -20, reputation: +10 }
                    },
                    {
                        text: 'Sita sampel jamu, kirim ke BPOM untuk analisis',
                        nextPhase: 'lab_test',
                        impact: { energy: -10 }
                    }
                ]
            },
            {
                id: 'examine',
                type: 'dialog',
                text: 'Tanda cushingoid jelas: moon face, buffalo hump, striae. Gula darah tidak terkontrol karena efek steroid. Mbah Siti perlu tapering dexamethasone perlahan (withdrawal syndrome!).',
                choices: [
                    {
                        text: 'Rawat + tapering steroid + edukasi bahaya jamu oplosan',
                        nextPhase: 'resolution_medical',
                        impact: { reputation: +10 }
                    }
                ]
            },
            {
                id: 'lab_test',
                type: 'dialog',
                text: 'Hasil lab BPOM menunjukkan jamu mengandung dexamethasone 0.5mg, piroksikam 10mg, dan CTM. Tukang jamu keliling dibeli langsung dari "supplier serbuk putih" tanpa label.',
                choices: [
                    {
                        text: 'Laporkan ke polisi + BPOM + edukasi warga',
                        nextPhase: 'resolution_enforcement',
                        impact: { reputation: +15 }
                    }
                ]
            },
            {
                id: 'resolution_medical',
                type: 'dialog',
                text: 'Mbah Siti dirawat 1 minggu. Steroid di-taper pelan-pelan. Setelah 2 bulan, gula darahnya membaik. "Saya kapok Dok, nggak mau beli jamu sembarangan lagi."',
                isEnd: true,
                impact: { reputation: +30, xp: 300 }
            },
            {
                id: 'resolution_enforcement',
                type: 'dialog',
                text: 'Polisi menangkap supplier serbuk steroid. 3 tukang jamu keliling yang jual jamu oplosan dibina. Anda adakan penyuluhan: "Jamu aman = ada izin BPOM, tanpa klaim berlebihan."',
                isEnd: true,
                impact: { reputation: +35, xp: 350 }
            }
        ],
        outcomes: {
            success: { iks_score: +5, reputation: +25, xp: 300 }
        },
        relatedCases: ['diabetes_mellitus_tipe_2'],
        educationTopics: ['traditional_medicine_safety', 'steroid_abuse', 'bpom_regulation']
    },
    {
        id: 'dukun_beranak',
        title: 'Persalinan oleh Dukun Beranak — Komplikasi',
        category: 'traditional_health',
        icon: '🤱',
        description: 'Ibu hamil memilih melahirkan di dukun beranak. Terjadi perdarahan pascapersalinan.',
        triggerConditions: {
            minDay: 30,
            probability: 0.05
        },
        urgency: 'critical',
        phases: [
            {
                id: 'discovery',
                type: 'dialog',
                speaker: 'Bidan',
                text: 'Dok! Bu Sari (G3P2) melahirkan di dukun tadi malam. Sekarang perdarahan hebat, sudah ganti 5 kain. Dukun bilang cuma "darah kotor." Plasenta belum keluar!',
                choices: [
                    {
                        text: 'DARURAT! Pasang infus RL, pergi ke lokasi, manual plasenta',
                        nextPhase: 'emergency_response',
                        impact: { energy: -30, reputation: +10 }
                    },
                    {
                        text: 'Minta bawa ke puskesmas/RS segera, siapkan uterotonika',
                        nextPhase: 'refer_immediate',
                        impact: { energy: -15 }
                    }
                ]
            },
            {
                id: 'emergency_response',
                type: 'dialog',
                text: 'Anda tiba di rumah Bu Sari. Plasenta retensio. Dengan teknik manual plasenta, plasenta berhasil dikeluarkan. Perdarahan berkurang. Diberi oksitosin 10 IU IM dan misoprostol.',
                choices: [
                    {
                        text: 'Stabilkan, rujuk untuk observasi + edukasi soal persalinan aman',
                        nextPhase: 'resolution_save',
                        impact: { reputation: +15 }
                    }
                ]
            },
            {
                id: 'refer_immediate',
                type: 'dialog',
                text: 'Keluarga terlambat membawa Bu Sari — 1 jam di jalan. Sampai di RS, Hb sudah 5 g/dL. Perlu transfusi darurat. Nyaris tidak tertolong.',
                isEnd: true,
                impact: { reputation: +15, xp: 150 }
            },
            {
                id: 'resolution_save',
                type: 'dialog',
                text: 'Bu Sari selamat. Anda mediasi dengan dukun beranak: "Bu, kita bisa kerja sama — Ibu dampingi doa dan pijat, tapi persalinan di bidan." Kemitraan bidan-dukun dimulai.',
                isEnd: true,
                impact: { reputation: +35, xp: 350 }
            }
        ],
        outcomes: {
            success: { iks_score: +6, reputation: +30, xp: 350 }
        },
        relatedCases: ['perdarahan_post_partum'],
        educationTopics: ['safe_delivery', 'skilled_birth_attendant', 'bidan_dukun_partnership']
    },
    {
        id: 'herbal_interaksi_obat',
        title: 'Interaksi Obat-Herbal pada Pasien Hipertensi',
        category: 'traditional_health',
        icon: '🌿',
        description: 'Warga minum obat hipertensi bersamaan dengan rebusan kumis kucing dan bawang putih mentah — TD drop drastis.',
        triggerConditions: {
            minDay: 15,
            probability: 0.07
        },
        urgency: 'moderate',
        phases: [
            {
                id: 'discovery',
                type: 'dialog',
                speaker: 'Perawat',
                text: 'Dok, Pak Hasan (65 tahun, HT) pingsan di sawah. TD 80/50! Dia minum amlodipine 10mg pagi ini, lalu minum rebusan kumis kucing + bawang putih mentah 5 siung. "Biar cepat turun, Dok."',
                choices: [
                    {
                        text: 'Pasang infus, tinggikan kaki, pantau TD — ini hipotensi iatrogenik',
                        nextPhase: 'treat_hypotension',
                        impact: { energy: -15, reputation: +5 }
                    },
                    {
                        text: 'Stabilkan pasien + investigasi apakah ada warga lain yang double-dosis herbal+obat',
                        nextPhase: 'community_screen',
                        impact: { energy: -20, reputation: +10 }
                    }
                ]
            },
            {
                id: 'treat_hypotension',
                type: 'dialog',
                text: 'Pak Hasan membaik setelah 500ml RL. TD naik ke 110/70. Anda edukasi: "Pak, kumis kucing dan bawang putih sudah menurunkan tekanan. Ditambah amlodipine, turunnya terlalu banyak."',
                choices: [
                    {
                        text: 'Buat panduan interaksi obat-herbal untuk Prolanis',
                        nextPhase: 'resolution_guide',
                        impact: { reputation: +10 }
                    }
                ]
            },
            {
                id: 'community_screen',
                type: 'dialog',
                text: 'Skrining di Prolanis: ternyata 12 dari 25 peserta DM/HT juga minum herbal tanpa konsultasi! 3 orang minum pare + metformin (risiko hipoglikemia).',
                choices: [
                    {
                        text: 'Adakan sesi edukasi interaksi obat-herbal untuk seluruh peserta',
                        nextPhase: 'resolution_session',
                        impact: { reputation: +15 }
                    }
                ]
            },
            {
                id: 'resolution_guide',
                type: 'dialog',
                text: 'Anda buat poster "Boleh Herbal, Tapi Tanya Dulu!" — daftar tanaman yang berinteraksi dengan obat. Ditempel di TOGA, Prolanis, dan warung. Warga jadi konsultasi dulu sebelum campur obat-herbal.',
                isEnd: true,
                impact: { reputation: +25, xp: 250 }
            },
            {
                id: 'resolution_session',
                type: 'dialog',
                text: 'Sesi interaktif sukses besar. Peserta Prolanis kaget: "Ternyata bawang putih + obat darah tinggi bahaya!" Mereka sepakat konsultasi dulu sebelum minum herbal.',
                isEnd: true,
                impact: { reputation: +30, xp: 300 }
            }
        ],
        outcomes: {
            success: { iks_score: +4, reputation: +20, xp: 250 }
        },
        relatedCases: ['hipertensi_esensial'],
        educationTopics: ['herb_drug_interaction', 'prolanis', 'patient_education']
    }
];

// ═══════════════════════════════════════════════════════════════
// COMBINED LIBRARY
// ═══════════════════════════════════════════════════════════════

export const IKM_SCENARIOS = [
    ...PHBS_SCENARIOS,
    ...CULTURAL_SCENARIOS,
    ...ENVIRONMENTAL_SCENARIOS,
    ...NUTRITION_SCENARIOS,
    ...MENTAL_HEALTH_SCENARIOS,
    ...ADOLESCENT_SCENARIOS,
    ...FOOD_SAFETY_SCENARIOS,
    ...TRADITIONAL_HEALTH_SCENARIOS
];

/**
 * Get scenarios by category
 * @param {string} categoryId - Category ID (phbs, cultural, environmental, nutrition)
 * @returns {Array} Filtered scenarios
 */
export function getScenariosByCategory(categoryId) {
    return IKM_SCENARIOS.filter(s => s.category === categoryId);
}

/**
 * Get scenario by ID
 * @param {string} scenarioId - Scenario ID
 * @returns {Object|undefined}
 */
export function getScenarioById(scenarioId) {
    return IKM_SCENARIOS.find(s => s.id === scenarioId);
}
