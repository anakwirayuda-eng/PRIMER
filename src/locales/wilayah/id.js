export default {
    wilayahContent: {
        ui: {
            layerBadges: {
                pispk: 'IKS Desa {{value}}%',
                surveillance: '{{count}} kasus aktif',
                psn: 'Prioritas PSN',
                phbs: 'Skor 0-10 indikator',
                perilaku: 'Mode perubahan perilaku'
            },
            buildingGamePanel: {
                exit: 'Keluar',
                sceneReference: 'Mode {{title}} | {{subtitle}}',
                barrierCount: '{{count}} hambatan',
                stationCount: '{{count}} stasiun',
                statusDone: 'Selesai',
                statusActive: 'Aktif',
                stationStep: 'Meja {{index}}',
                actionsAvailable: 'Aksi Tersedia',
                findings: 'Temuan',
                revealHint: 'Lakukan aksi untuk mengungkap...',
                enterDoor: 'Pintu Masuk',
                exitDoor: 'Pintu Keluar',
                linkedCases: 'Kasus Terkait',
                close: 'Tutup',
                scenarioLeavePrompt: 'Membuka skenario ini akan meninggalkan denah gedung.',
                cancel: 'Batal',
                start: 'Mulai',
                completionReputation: 'Reputasi',
                completionButton: 'Selesai'
            },
            combWheel: {
                title: 'Roda Perubahan Perilaku',
                subtitle: 'Michie et al. (2011) | Mesin diagnostik perilaku',
                detectedBarrier: 'Hambatan terdeteksi',
                recommendedInterventions: 'Intervensi yang disarankan',
                interventionHelp: 'Pilih strategi intervensi untuk menargetkan hambatan perilaku yang terkait.',
                legendCapability: 'Kemampuan',
                legendOpportunity: 'Kesempatan',
                legendMotivation: 'Motivasi',
                engineLabel: 'Mesin Sains Perilaku PRIMER',
                centerTitle: 'PERILAKU',
                centerSubtitle: 'MODEL COM-B',
                domains: {
                    cap_psy: { label: 'Kemampuan Psikologis', shortLabel: 'K.Psikis' },
                    cap_phy: { label: 'Kemampuan Fisik', shortLabel: 'K.Fisik' },
                    opp_phy: { label: 'Kesempatan Fisik', shortLabel: 'Ks.Fisik' },
                    opp_soc: { label: 'Kesempatan Sosial', shortLabel: 'Ks.Sosial' },
                    mot_ref: { label: 'Motivasi Reflektif', shortLabel: 'M.Reflektif' },
                    mot_aut: { label: 'Motivasi Otomatis', shortLabel: 'M.Otomatis' }
                },
                interventions: {
                    education: 'Edukasi',
                    persuasion: 'Persuasi',
                    incentivisation: 'Incentivisasi',
                    coercion: 'Paksaan',
                    training: 'Pelatihan',
                    restriction: 'Pembatasan',
                    environmental_restructuring: 'Restrukturisasi Lingkungan',
                    modelling: 'Pemodelan',
                    enablement: 'Pemberdayaan'
                }
            },
            dioramaExhibition: {
                badgeFullVillage: 'Desa Penuh',
                badgeNonOperational: 'Presentasi Saja',
                description: 'Mode ini khusus untuk maket desa penuh dan presentasi. Pocket diorama RW tetap muncul lewat inspektor 2D, bukan dari layar visualisasi ini.',
                captionNoScope: 'Panorama desa penuh | khusus visualisasi | 2D tetap menjadi sumber operasional utama.',
                caption: '{{label}} | {{buildingCount}} titik | {{houseCount}} rumah | khusus visualisasi | inspeksi RW tetap dijalankan dari 2D.'
            },
            dioramaInspector: {
                modeLabels: {
                    mobile: 'Snapshot Mobile',
                    gpuSafe: 'Snapshot GPU Safe',
                    standard: 'Snapshot Inspector'
                },
                modeDescriptors: {
                    mobile: 'Aman untuk bottom sheet',
                    gpuSafe: 'Tanpa WebGL',
                    standard: 'Inspector statis'
                },
                snapshotAriaLabel: 'Snapshot {{label}}',
                snapshotSummary: 'Snapshot ini menjaga konteks RW/bangunan tetap terbaca tanpa mengaktifkan render WebGL di inspector.',
                focusLabel: 'Fokus Inspector',
                metricMode: 'Mode',
                metricModeSnapshot: 'Snapshot',
                metricRender: 'Render',
                metricRenderSafe: 'GPU Aman',
                metricNodes: '{{count}} titik',
                metricHouses: '{{count}} rumah',
                liveTitle: 'Inspector 3D',
                liveLoadingBody: 'Memuat pocket diorama untuk scope ini...',
                liveChip: 'Turntable',
                liveFooterMode: 'Hanya inspector',
                liveFooterHint: 'Klik bangunan untuk pindah fokus',
                fallbackTitle: 'Pocket Diorama',
                fallbackBody: 'Inspector 3D belum siap karena data scope belum lengkap.',
                recoveryTitle: 'Pemulihan GPU',
                recoveryBody: 'Inspector 3D dijeda sebentar. Canvas akan dibangun ulang otomatis.',
                recoveryAction: 'Bangun ulang',
                scopeTitleCompact: 'Scope Inspector',
                scopeTitleExpanded: 'Scope Pocket Diorama',
                capabilityLabels: {
                    live: '3D live',
                    snapshot: 'Snapshot',
                    off: 'Metadata'
                },
                scopeKinds: {
                    rw: 'Fokus RW',
                    sector: 'Irisan Sektor',
                    building: 'Fokus Bangunan',
                    scope: 'Scope'
                },
                scopeDescriptions: {
                    compactSnapshot: 'Di mobile, inspector memakai snapshot statis agar tetap ringan, jelas, dan tidak memaksa render WebGL.',
                    gpuSafeSnapshot: 'Device ini memakai snapshot GPU-safe. Inspector tetap menampilkan konteks RW/bangunan tanpa mengaktifkan kanvas 3D.',
                    metadataOnly: 'Inspector 3D aktif di desktop saat mode utama tetap 2D. Pada layar sempit atau mode 3D penuh, scope ini tetap diringkas sebagai metadata.'
                }
            },
            bridgeStatus: {
                broken: 'Jembatan Putus',
                atRisk: 'Jembatan Rawan',
                normal: 'Jembatan Normal'
            },
            iksStatus: {
                healthy: 'SEHAT',
                preHealthy: 'PRA SEHAT',
                unhealthy: 'TIDAK SEHAT'
            },
            inspectorCaseLinks: {
                title: 'Kasus Terkait',
                hint: 'Pilih kasus komunitas untuk membuka panel diagnosis yang paling dekat dengan node ini.',
                runtimeBadge: 'Link Runtime',
                actionOpen: 'Buka',
                actionCall: 'Panggil',
                noticeAlreadyActive: 'Kasus {{caseName}} sudah aktif. Panel komunitas sekarang difokuskan.',
                noticeUnavailable: 'Kasus {{caseName}} belum bisa dimulai sekarang.',
                noticeOpened: 'Kasus {{caseName}} dibuka di panel diagnosis komunitas.',
                noticeCalled: 'Kasus {{caseName}} dipanggil. Cek anchor di peta jika panel belum terbuka.'
            },
            rwInspector: {
                unlockGuidance: 'Buka arsip Sensus untuk membaca komposisi keluarga di RW ini, lalu pakai progres hari dan reputasi sebagai acuan kapan sektor tersebut resmi aktif di map operasional.',
                openArchive: 'Buka Arsip RW {{rw}}',
                openRelatedArchive: 'Buka Arsip RW Terkait',
                closeDossier: 'Tutup Dossier'
            },
            rwProgress: {
                operationalDay: 'Hari Operasional',
                dayValue: 'Hari {{day}}',
                ready: 'Siap',
                remainingDays: 'Kurang {{count}} hari',
                currentDay: 'Saat ini: Hari {{day}}',
                villageReputation: 'Reputasi Desa',
                reputationValue: '{{value}} REP',
                remainingReputation: 'Kurang {{value}} REP',
                currentReputation: 'Saat ini: {{value}} REP',
                dayShort: 'Hari',
                reputationShort: 'Reputasi',
                dayRequirementMet: 'Syarat hari terpenuhi',
                reputationRequirementMet: 'Syarat reputasi terpenuhi'
            },
            inspectorActions: {
                censusData: 'Data Sensus Desa',
                iksReport: 'Laporan IKS',
                operationalMockup3d: 'Maket Operasional 3D',
                enterBuilding: 'Masuk Gedung',
                enterBuildingSub: 'Mulai Investigasi',
                wikiProcedure: 'Wiki & Prosedur',
                homeVisitBehaviorChange: 'Kunjungan Rumah (Perubahan Perilaku)',
                quickVisitLegacy: 'Kunjungan Cepat (Mode Lama)'
            },
            inspectorInfo: {
                title: 'Informasi',
                defaultDescription: '{{name}} merupakan sarana umum penting di Desa Sukamaju.'
            },
            lockedRw: {
                badge: 'Titik Buta RW {{rw}}',
                title: 'Wilayah Belum Terbuka',
                description: 'Bangunan ini sudah ada di topologi, tetapi akses gameplay-nya masih dikunci sampai RW terkait memenuhi syarat progres hari dan reputasi.'
            },
            homeVisitModal: {
                title: 'Kunjungan Rumah (PIS-PK)',
                closeAria: 'Tutup kunjungan rumah',
                energy: 'Energi',
                iksStatus: 'Status IKS'
            }
        },
        layerMeta: {
            general: {
                label: 'Infrastruktur',
                subtitle: 'Topologi desa, titik buta RW, simpul layanan, dan status jembatan.',
                tooltip: 'Mode kanonik 2D: topologi desa, titik buta RW, pemantau lapangan, kader lokal, simpul layanan, dan status jembatan.',
                legendItems: [
                    { label: 'RW & Titik Buta' },
                    { label: 'Simpul Layanan' },
                    { label: 'Pemantau / Kader' }
                ]
            },
            pispk: {
                label: 'PIS-PK',
                subtitle: 'IKS keluarga, rumah prioritas, dan ring cakupan layanan primer.',
                tooltip: 'Lacak IKS keluarga, rumah prioritas, dan jangkauan layanan primer dari simpul utama.',
                legendItems: [
                    { label: 'Sehat' },
                    { label: 'Waspada' },
                    { label: 'Risiko' },
                    { label: 'Cakupan Layanan' }
                ]
            },
            surveillance: {
                label: 'Surveilans',
                subtitle: 'Kasus aktif, klaster outbreak, dan rumah prioritas tracing.',
                tooltip: 'Sorot kasus aktif, klaster outbreak, dan rumah prioritas tracing 14 hari terakhir.',
                legendItems: [
                    { label: 'Kasus Aktif' },
                    { label: 'Klaster / Outbreak' },
                    { label: 'Prioritas Tracing' }
                ]
            },
            psn: {
                label: 'Jentik',
                subtitle: 'Titik perkembangbiakan, rumah berisiko, dan prioritas PSN.',
                tooltip: 'Cari indikasi perkembangbiakan, rumah dengan jentik, dan titik yang perlu PSN atau kerja bakti.',
                legendItems: [
                    { label: 'Aman' },
                    { label: 'Risiko Perkembangbiakan' },
                    { label: 'Jentik Aktif' }
                ]
            },
            phbs: {
                label: 'PHBS',
                subtitle: 'Mutu PHBS rumah tangga dan wilayah yang butuh edukasi dasar.',
                tooltip: 'Baca mutu PHBS rumah tangga dan sebaran wilayah yang butuh edukasi dasar.',
                legendItems: [
                    { label: '7-10 Baik' },
                    { label: '4-6 Sedang' },
                    { label: '0-3 Buruk' },
                    { label: 'Cakupan Edukasi' }
                ]
            },
            perilaku: {
                label: 'Perilaku',
                subtitle: 'Hambatan perilaku, kesiapan intervensi, dan fokus BCC lapangan.',
                tooltip: 'Sorot rumah dengan hambatan perilaku tinggi dan kesiapan intervensi perubahan perilaku.',
                legendItems: [
                    { label: 'Risiko Tinggi' },
                    { label: 'Risiko Sedang' },
                    { label: 'Rendah / Siap' },
                    { label: 'Cakupan Intervensi' }
                ]
            }
        },
        buildingScenes: {
            posyandu: {
                title: 'Posyandu Desa Sukamaju',
                subtitle: 'Pos Pelayanan Terpadu | Alur Lima Meja',
                ambience: 'Ruang terbuka beratap dengan meja-meja tersusun rapi, ibu dan balita mengantre untuk layanan.',
                stations: {
                    meja1: {
                        label: 'Meja 1: Pendaftaran',
                        description: 'Kader mencatat identitas ibu dan anak serta memeriksa jadwal kunjungan.',
                        actions: {
                            register: { label: 'Periksa Daftar Hadir' },
                            review_kms: { label: 'Tinjau KMS Sebelumnya' }
                        },
                        findings: [
                            { text: 'Tiga anak tidak hadir ke Posyandu selama dua bulan terakhir.' },
                            { text: 'Sebagian besar kartu menuju sehat terisi lengkap.' }
                        ]
                    },
                    meja2: {
                        label: 'Meja 2: Penimbangan',
                        description: 'Timbang anak dan pantau tren pertumbuhannya.',
                        actions: {
                            weigh_child: { label: 'Timbang Anak' },
                            check_height: { label: 'Ukur Tinggi Badan' }
                        },
                        findings: [
                            { text: 'Fadli (14 bulan) turun dari 8.2 kg menjadi 7.8 kg | dua kunjungan berturut-turut tidak naik.' },
                            { text: 'Siti (9 bulan) masih dalam rentang normal dan naik stabil.' }
                        ]
                    },
                    meja3: {
                        label: 'Meja 3: Pencatatan KMS',
                        description: 'Plot hasil penimbangan ke kartu menuju sehat anak.',
                        actions: {
                            plot_kms: { label: 'Plot ke KMS' },
                            detect_pattern: { label: 'Analisis Tren Pertumbuhan' }
                        },
                        findings: [
                            { text: 'Pola dua kali berturut-turut tidak naik terdeteksi pada dua anak | risiko stunting.' },
                            { text: 'Delapan puluh lima persen anak tetap berada pada jalur pertumbuhan hijau.' }
                        ]
                    },
                    meja4: {
                        label: 'Meja 4: Penyuluhan',
                        description: 'Edukasi kesehatan untuk ibu tentang gizi, ASI, dan MP-ASI.',
                        actions: {
                            counsel_asi: { label: 'Konseling ASI Eksklusif' },
                            demo_mpasi: { label: 'Demo MP-ASI' },
                            quiz: { label: 'Kuis Gizi Sehat' }
                        },
                        findings: [
                            { text: 'Bu Maryam mengaku anaknya sudah diberi pisang sejak usia tiga bulan.' },
                            { text: 'Para ibu antusias saat demo bubur kacang hijau.' }
                        ]
                    },
                    meja5: {
                        label: 'Meja 5: Pelayanan Kesehatan',
                        description: 'Imunisasi, vitamin A, obat cacing, dan suplemen.',
                        actions: {
                            immunize: { label: 'Berikan Imunisasi Terjadwal' },
                            vit_a: { label: 'Berikan Vitamin A' },
                            obat_cacing: { label: 'Pemberian Obat Cacing Massal' }
                        },
                        findings: [
                            { text: 'Budi (18 bulan) masih belum mendapat vaksin MR kedua karena ibunya menolak.' },
                            { text: 'Stok vitamin A cukup untuk bulan ini.' }
                        ]
                    }
                },
                npcs: {
                    kader_ayu: {
                        name: 'Kader Ayu',
                        role: 'Kader Posyandu',
                        greeting: 'Selamat pagi, Dok. Ada lima belas balita hari ini dan beberapa perlu perhatian khusus.',
                        dialogs: {
                            auto: {
                                text: 'Dok, Fadli dua bulan ini berat badannya turun. Ibunya bilang dia cuma makan nasi dengan kecap manis.',
                                choices: [
                                    { text: 'Mari kita periksa sekarang.' },
                                    { text: 'Catat dulu lalu jadwalkan kunjungan rumah.' }
                                ]
                            },
                            meja5_done: {
                                text: 'Dok, Bu Rina menolak vaksin MR. Katanya ada pesan WhatsApp yang bilang itu menyebabkan autisme.',
                                choices: [
                                    { text: 'Panggil beliau, saya jelaskan langsung.' },
                                    { text: 'Mari kita siapkan edukasi kelompok.' }
                                ]
                            }
                        }
                    },
                    ibu_maryam: {
                        name: 'Bu Maryam',
                        role: 'Ibu Balita',
                        greeting: "Assalamu'alaikum, Dok. Saya datang untuk timbang Dede.",
                        dialogs: {
                            meja4_done: {
                                text: 'Jadi MP-ASI memang baru dimulai usia enam bulan ya, Dok? Saya dulu kasih pisang sejak umur tiga bulan.',
                                choices: [
                                    { text: 'Betul, sebelum enam bulan pencernaan bayi belum siap.' },
                                    { text: 'Nanti kita bahas sebentar lagi ya, Bu.' }
                                ]
                            }
                        }
                    }
                },
                completionReward: {
                    message: 'Sesi Posyandu hari ini selesai. Semua balita sudah terlayani.'
                }
            },
            school: {
                title: 'SD Negeri Sukamaju 1',
                subtitle: 'UKS | Skrining dan Edukasi'
            },
            farm: {
                title: 'Lahan Pertanian Warga',
                subtitle: 'Kesehatan Kerja dan Lingkungan | Inspeksi Lapangan'
            },
            pustu: {
                title: 'Pustu Dusun Cilengkrang',
                subtitle: 'Pos Layanan Primer Satelit | Layanan Ibu dan Dasar'
            },
            kb_post: {
                title: 'Pos KB Sukamaju',
                subtitle: 'Layanan Keluarga Berencana dan Kesehatan Reproduksi'
            },
            balai_desa: {
                title: 'Balai Desa Sukamaju',
                subtitle: 'Musyawarah Desa dan Promosi Kesehatan'
            },
            mck: {
                title: 'Blok Sanitasi Umum Dusun Ciburial',
                subtitle: 'Sanitasi Lingkungan | Inspeksi dan Pembinaan STBM'
            },
            pos_gizi: {
                title: 'Pos Pemulihan Gizi Sukamaju',
                subtitle: 'Program Pemberian Makanan Tambahan dan Tindak Lanjut Gizi Buruk'
            },
            pos_ukk: {
                title: 'Pos UKK Sukamaju',
                subtitle: 'Upaya Kesehatan Kerja | Skrining dan Pembinaan Pekerja Informal'
            },
            pamsimas: {
                title: 'Instalasi PAMSIMAS Sukamaju',
                subtitle: 'Penyediaan Air Minum dan Sanitasi Berbasis Masyarakat'
            },
            bank_sampah: {
                title: 'Bank Sampah Berseri',
                subtitle: 'Pengelolaan Sampah Warga | Kurangi, Gunakan Ulang, Daur Ulang'
            },
            polindes: {
                title: 'Polindes Desa',
                subtitle: 'Layanan Persalinan dan Nifas Tingkat Desa'
            },
            rtk: {
                title: 'Rumah Tunggu Kelahiran',
                subtitle: 'Simpul Rujukan Ibu Hamil | Tempat singgah aman sebelum rujukan obstetri'
            },
            market: {
                title: 'Pasar Desa Sukamaju',
                subtitle: 'Keamanan Pangan dan Kesehatan Lingkungan di Area Pasar'
            },
            warung: {
                title: 'Warung Makan Bu Minah',
                subtitle: 'Kedai Desa | Edukasi Gizi dan Keamanan Pangan'
            },
            toga: {
                title: 'Kebun TOGA Keluarga Sukamaju',
                subtitle: 'Tanaman Obat Keluarga | Kesehatan Tradisional Berbasis Bukti'
            },
            padepokan_dukun: {
                title: 'Rumah Pengobatan Tradisional Mbah Surti',
                subtitle: 'Menjembatani tradisi dan bukti | kemitraan warga yang lebih aman'
            }
        }
    }
};

