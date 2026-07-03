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
                closeInspectorAria: 'Tutup inspector wilayah',
                closeDossierAria: 'Tutup dossier RW',
                closeBuildingDetailAria: 'Tutup detail bangunan',
                blankSpotBadge: 'Blank Spot PIS-PK',
                title: 'Dossier Zona Belum Terdata',
                description: 'Sektor ini sudah ada di topologi desa, tetapi data rumah tangga PIS-PK belum menjadi wilayah operasional aktif.',
                families: 'Keluarga',
                mappedHouseholds: 'KK terpetakan',
                residents: 'Penduduk',
                recordedResidents: 'jiwa tercatat',
                unlockStatus: 'Status Unlock RW {{rw}}',
                guidanceTitle: 'Arahan Operasional',
                activeResidence: 'Hunian Aktif',
                rtLabel: 'RT {{rt}}',
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
                iksStatus: 'Status IKS',
                accessBlockedEast: 'Akses ke sektor Timur terputus.',
                completed: 'Selesai',
                blocked: 'Terblokir',
                interventions: {
                    kb: { label: 'Edukasi KB', description: 'Konseling Keluarga Berencana' },
                    persalinan: { label: 'Edukasi Persalinan Aman', description: 'Konseling persalinan di fasilitas kesehatan' },
                    imunisasi: { label: 'Cek Imunisasi', description: 'Verifikasi status imunisasi bayi' },
                    asi: { label: 'Edukasi ASI Eksklusif', description: 'Konseling ASI eksklusif enam bulan' },
                    balita: { label: 'Pantau Tumbuh Kembang', description: 'Pengukuran BB/TB balita' },
                    tb: { label: 'Pemantauan TB', description: 'Cek kepatuhan minum obat TB' },
                    hipertensi: { label: 'Skrining Hipertensi', description: 'Pengukuran tekanan darah' },
                    jiwa: { label: 'Skrining Kesehatan Jiwa', description: 'Deteksi dini gangguan jiwa' },
                    rokok: { label: 'Konseling Berhenti Rokok', description: 'Edukasi bahaya merokok' },
                    jkn: { label: 'Pendaftaran JKN/BPJS', description: 'Bantuan pendaftaran BPJS Kesehatan' },
                    sanitasi: { label: 'Survei Sanitasi', description: 'Cek jamban dan sumber air' },
                    psn: { label: 'Pemeriksaan Jentik (PSN)', description: 'Periksa TPA untuk jentik nyamuk Aedes' }
                }
            },
            map2dMarker: {
                iksValue: 'IKS {{value}}%',
                localCadre: 'Kader Lokal',
                cadreProtected: 'Dilindungi Kader',
                priorityIntel: 'Intel Prioritas #{{rank}}',
                narrativeCues: {
                    rtkSurveillance: {
                        label: 'SIAGA',
                        eyebrow: 'Maternal Hub',
                        title: 'Pantau Ibu Risiko Tinggi',
                        detail: 'Anchor rujukan maternal'
                    },
                    rtkDefault: {
                        label: 'RUJUK',
                        eyebrow: 'Maternal Hub',
                        title: 'Rujukan Maternal',
                        detail: 'Persalinan aman dan transit ibu'
                    },
                    dukunBehavior: {
                        label: 'MEDIASI',
                        eyebrow: 'Budaya',
                        title: 'Dialog Tradisi',
                        detail: 'Jembatan adat dan evidence'
                    },
                    dukunDefault: {
                        label: 'ADAT',
                        eyebrow: 'Budaya',
                        title: 'Anchor Tradisi',
                        detail: 'Negosiasi kepercayaan warga'
                    }
                }
            },
            map2dBlueprint: {
                unmappedZone: 'Zona Belum Terdata',
                unmappedZoneShort: 'Zona Belum Terdata',
                openBlankSpotDossier: 'Buka dossier blank spot RW {{rw}}',
                rwLabel: 'RW {{rw}}',
                households: '{{count}} KK',
                blankSpotPispk: 'Blank Spot PIS-PK',
                ikmEvent: 'Event IKM',
                outbreakLabel: 'WABAH {{type}}',
                bridge: {
                    broken: 'Jembatan Putus',
                    floodRisk: 'Jembatan Rawan',
                    normal: 'Jembatan Normal',
                    repaired: 'DIPERBAIKI OK',
                    repairFailed: 'Perbaikan gagal'
                },
                legend: {
                    blank: 'Blank {{count}}',
                    coverage: 'Cakupan',
                    intel: 'Intel {{count}}',
                    cadre: 'Kader {{count}}',
                    ikm: 'IKM {{count}}'
                },
                eventRoles: {
                    sekolah: 'Sekolah',
                    sekolah_posyandu: 'Sekolah / Posyandu',
                    polindes_dukun: 'Polindes / Dukun',
                    warung_dukun: 'Warung / Dukun',
                    pasar_sekolah: 'Pasar / Sekolah',
                    sawah_pos_ukk: 'Sawah / Pos UKK',
                    posyandu_gizi: 'Posyandu / Gizi',
                    komunitas: 'Komunitas',
                    phbs: 'PHBS',
                    lingkungan: 'Lingkungan',
                    gizi: 'Gizi',
                    pangan: 'Pangan',
                    budaya: 'Budaya',
                    remaja: 'Remaja',
                    jiwa: 'Jiwa'
                }
            },
            miniGame: {
                audit: {
                    title: 'Triangulasi Transmisi',
                    subtitle: 'Forensik Sanitasi - Temukan & Klasifikasikan Jalur',
                    findings: 'Temuan',
                    battery: 'Baterai',
                    time: 'Waktu',
                    found: 'Ditemukan!',
                    classifiedRoute: 'OK {{route}}',
                    wrongBattery: 'Salah! -20% baterai',
                    pointLabel: 'Titik-{{index}}',
                    batteryDepletedTitle: 'Daya Habis',
                    batteryDepletedBody: 'Alat triangulasi mati. Investigasi dihentikan.',
                    finishedComplete: 'Forensik Selesai',
                    finishedBattery: 'Daya Habis',
                    finishedTime: 'Waktu Habis',
                    classified: 'Terklasifikasi',
                    timeBonus: 'Bonus Waktu',
                    classificationMistakes: 'Salah Klasifikasi',
                    openingReport: '-> Membuka laporan evaluasi...',
                    routes: {
                        vector: 'Vektor',
                        water: 'Air',
                        air: 'Udara'
                    }
                },
                anamnesis: {
                    title: 'Anamnesis Sosial',
                    subtitle: 'Health Belief Model (HBM) Profiling',
                    quote: 'Kutipan',
                    transcript: 'Transkrip Wawancara:',
                    identifyBarrier: 'Identifikasi dinding psikologis warga:',
                    accurate: 'Analisis HBM: Akurat',
                    misinterpretation: 'Misinterpretasi Klinis'
                },
                rtl: {
                    title: 'Rencana Tindak Lanjut',
                    subtitle: 'Alokasi Intervensi BCW Lintas Sektor',
                    allocation: 'Alokasi',
                    target: 'Target:',
                    deployHere: '< Deploy di Sini >',
                    emptySlot: '[ Slot Kosong ]',
                    clickTargetSlot: '>>> Klik slot target di atas <<<',
                    selectPolicy: 'Arsenal Intervensi - Pilih Kebijakan',
                    confirm: 'Sahkan RTL Lintas Sektor',
                    barriers: {
                        cap_phy: 'Kapabilitas Fisik',
                        cap_psy: 'Kapab. Psikologis',
                        opp_phy: 'Peluang Fisik',
                        opp_soc: 'Peluang Sosial',
                        mot_ref: 'Motivasi Reflektif',
                        mot_aut: 'Motivasi Otomatis'
                    }
                },
                fallback: {
                    module: 'Module [{{gameType}}]',
                    autoResolved: 'Auto-resolved',
                    bypass: 'Bypass'
                },
                feedback: {
                    gameNotFound: 'Game tidak ditemukan.',
                    excellent: 'Luar biasa. Keterampilan lapangan Anda sangat baik.',
                    good: 'Bagus. Pemahaman Anda sudah kuat.',
                    practice: 'Cukup, tapi masih perlu latihan.',
                    retry: 'Perlu perbaikan. Coba lagi.'
                }
            },
            auxiliary: {
                familyIksScore: 'Skor IKS Keluarga',
                iksAria: 'Skor IKS keluarga: {{score}}% - {{status}}. Klik untuk info.',
                iksStatus: {
                    healthy: 'Keluarga Sehat',
                    preHealthy: 'Pra-Sehat',
                    unhealthy: 'Tidak Sehat'
                },
                members: '{{count}} anggota',
                detail: 'Detail',
                gender: {
                    maleShort: 'L',
                    femaleShort: 'P'
                },
                memberMeta: '{{age}} th - {{gender}} - {{occupation}}',
                indicatorCount: '{{count}} Indikator PIS-PK',
                pispkCoverage: 'Cakupan PIS-PK',
                householdsShort: 'KK',
                surveillanceAlert: 'Alert Surveilans',
                cases: 'Kasus',
                villageIks: 'IKS Desa',
                villageIksAria: 'IKS Desa: {{score}}%',
                announcements: 'Pengumuman',
                indicators: {
                    kb: 'Keluarga mengikuti KB',
                    persalinan: 'Persalinan di faskes',
                    imunisasi: 'Bayi mendapat imunisasi dasar lengkap',
                    asi: 'Bayi mendapat ASI eksklusif',
                    balita: 'Pertumbuhan balita dipantau',
                    tb: 'Penderita TB paru berobat sesuai standar',
                    hipertensi: 'Penderita hipertensi berobat teratur',
                    jiwa: 'Penderita gangguan jiwa tidak ditelantarkan',
                    rokok: 'Anggota keluarga tidak ada yang merokok',
                    jkn: 'Keluarga sudah menjadi anggota JKN',
                    air: 'Keluarga mempunyai akses sarana air bersih',
                    jamban: 'Keluarga mempunyai akses atau menggunakan jamban sehat',
                    jentik: 'Bebas jentik nyamuk (PSN)'
                }
            },
            communityDiagnosis: {
                caseReport: 'Laporan Kasus',
                closeReport: 'Tutup Laporan',
                combAnalysis: 'Analisis COM-B',
                finishAnalysis: 'Selesai Analisis',
                communityDiagnosis: 'Diagnosis Komunitas',
                analyzing: 'Menganalisis...',
                setDiagnosis: 'Tetapkan Diagnosis',
                interventionPlanning: 'Perencanaan Intervensi (5W1H)',
                interventionHint: 'Lengkapi rencana tindakan puskesmas.',
                selectAnswer: 'Pilih jawaban...',
                processing: 'Memproses...',
                executeIntervention: 'Eksekusi Intervensi',
                close: 'Tutup',
                feedback: {
                    insufficientFunds: 'Dana aktif tidak cukup untuk intervensi ini.',
                    interventionGood: 'Intervensi disusun dengan baik. ({{correct}}/{{total}} tepat)',
                    interventionWeak: 'Perencanaan intervensi kurang tepat sasaran ({{correct}}/{{total}}). Evaluasi kembali.'
                }
            },
            behaviorCase: {
                barriers: {
                    cap_phy: { label: 'Kapabilitas Fisik', desc: 'Keterampilan fisik atau kondisi jasmani warga menghambat perilaku sehat.' },
                    cap_psy: { label: 'Kapabilitas Psikologis', desc: 'Pengetahuan, literasi kesehatan, atau kapasitas kognitif tentang penyakit masih terbatas.' },
                    opp_phy: { label: 'Peluang Fisik', desc: 'Hambatan infrastruktur, jarak layanan, waktu, atau biaya.' },
                    opp_soc: { label: 'Peluang Sosial', desc: 'Norma sosial, stigma, budaya lokal, atau penolakan tokoh masyarakat.' },
                    mot_ref: { label: 'Motivasi Reflektif', desc: 'Niat sadar dan penilaian logis bahwa perilaku sehat belum dianggap penting.' },
                    mot_aut: { label: 'Motivasi Otomatis', desc: 'Kebiasaan kuat, dorongan emosional, dan refleks sehari-hari.' }
                },
                investigation: {
                    title: 'Interogasi Klinis',
                    subtitle: 'O.A.R.S Motivational Interviewing',
                    resistance: 'Resistensi Warga',
                    evidence: 'Bukti',
                    subjectSays: 'Subjek mengatakan:',
                    fallbackNpcLine: 'Saya tidak mengerti kenapa harus berubah. {{label}} itu sudah biasa.',
                    topicThreshold: 'Topik {{current}}/{{total}} - Threshold: tension < {{threshold}}%',
                    walkoutTitle: 'Warga Mengamuk',
                    walkoutBody: 'Menceramahi warga defensif memicu righting reflex. Warga menutup pintu dan anamnesis gagal.',
                    continueLimitedData: 'Lanjut Dengan Data Terbatas ->',
                    responseStrategy: 'Strategi Respons:',
                    advanceSynthesis: 'Bukti Cukup. Lanjut Sintesis ->',
                    tactics: {
                        empathy: 'Empati',
                        empathyHint: 'Tension -30%',
                        probe: 'Klarifikasi',
                        probeHint: 'Syarat: < {{threshold}}%',
                        confrontation: 'Konfrontasi',
                        confrontationHint: 'Tension +45% warning'
                    },
                    logs: {
                        empathy: '[Empati] Anda memvalidasi beban warga. Tembok pertahanan turun drastis.',
                        probeSuccess: '[Klarifikasi Berhasil] Warga curhat terbuka. Bukti: "{{finding}}"',
                        probeRejected: '[Klarifikasi Ditolak] Warga masih terlalu defensif (tension {{tension}}% > threshold {{threshold}}%).',
                        confrontation: '[Konfrontasi Medis] Anda menggurui warga. Mereka merasa dihakimi dan marah.'
                    }
                },
                diagnosis: {
                    evidenceMap: 'Peta Bukti Empiris',
                    noEvidence: '[ Nihil bukti - anda menebak buta ]',
                    title: 'Analisis Determinan',
                    hintPrefix: 'Pilih',
                    maxSelect: 'Maks {{count}}',
                    hintSuffix: 'akar masalah (COM-B).',
                    hoverGuide: 'Sorot klasifikasi untuk panduan teori COM-B...',
                    confirmDiagnosis: 'Sahkan Diagnosis IKM',
                    choosePriority: 'Tentukan prioritas intervensi...'
                },
                intervention: {
                    title: 'Meja Strategi B.C.W',
                    subtitle: 'Alokasi Anggaran & Kebijakan Promkes',
                    budget: 'Dana (AP)',
                    trust: 'Trust',
                    trustShort: 'TRST',
                    combDiagnosis: 'Diagnosis COM-B:',
                    target: 'Target',
                    backfireTitle: 'Backfire',
                    backfireBody: 'Social trust terlalu rendah untuk peraturan atau sanksi. Warga menolak masif.',
                    efficacyProjection: 'Proyeksi Efikasi',
                    executing: 'Mengeksekusi...',
                    confirmPolicy: 'Sahkan Kebijakan',
                    approvedStamp: 'Disetujui',
                    policyCodes: { edu: 'EDU', env: 'ENV', coe: 'LAW', mod: 'MOD', inc: 'INC', trn: 'TRN' },
                    policies: {
                        edu: 'Edukasi Komunitas',
                        env: 'Bantuan Fisik / Subsidi',
                        coe: 'Perdes / Hukuman',
                        mod: 'Pendekatan Tokoh',
                        inc: 'Insentif Warga',
                        trn: 'Pelatihan Kader'
                    },
                    feedback: {
                        backfire: 'BACKFIRE - warga menolak.',
                        efficacy: 'Efikasi BCW: {{score}}%'
                    }
                },
                evaluation: {
                    ministry: 'Kementerian Kesehatan RI',
                    title: 'Laporan Evaluasi UKM',
                    surveillanceCoverage: 'I. Cakupan Surveilans',
                    rootCauseAccuracy: 'II. Akurasi Akar Masalah',
                    healthPromotionEfficacy: 'III. Efikasi Promkes',
                    totalIndex: 'Indeks Total',
                    leaderEvaluation: 'Evaluasi Pimpinan:',
                    stamps: {
                        excellent: 'Efektif',
                        good: 'Diterima',
                        partial: 'Perlu Revisi',
                        fail: 'Ditolak'
                    },
                    narrative: {
                        excellent: 'Intervensi komunitas kuat, berbasis bukti, dan berpeluang mempertahankan perubahan perilaku.',
                        good: 'Intervensi diterima dan berguna secara operasional, meski pemantauan lanjutan tetap diperlukan.',
                        partial: 'Sebagian intervensi berjalan, tetapi rencana perlu direvisi sebelum diperluas.',
                        fail: 'Intervensi gagal menyentuh hambatan inti dan berisiko menambah beban klinis hilir.'
                    },
                    macro: {
                        title: 'Limitasi K.I.E Mikro Terdeteksi',
                        body: 'Akar masalah struktural pada peluang lingkungan atau sosial tidak bisa diselesaikan hanya dengan edukasi keluarga.',
                        followup: 'Tindak lanjut: bawa temuan ini ke musyawarah Balai Desa untuk intervensi makro.'
                    },
                    ukp: {
                        title: 'UKM Gagal - Beban UKP Meningkat',
                        body: 'Upaya preventif komunitas gagal. Warga jatuh sakit dan menjadi beban IGD. Siapkan ranjang dalam',
                        days: '{{count}} hari'
                    },
                    staffXp: 'XP Petugas',
                    communityTrust: 'Kepercayaan Warga',
                    archiveFile: 'Arsipkan Berkas X'
                },
                shell: {
                    confirmExit: 'Investigasi sedang berjalan. Keluar sekarang akan menghapus progres kasus ini. Lanjutkan?',
                    category: 'PIS-PK: {{category}}',
                    sdohProfile: 'Profil SDOH',
                    sdohMeta: 'EKO: {{economy}} | DIDIK: {{education}}',
                    procedure: 'Prosedur',
                    phaseLabels: {
                        investigation: 'Investigasi',
                        diagnosis: 'Diagnosis',
                        intervention: 'Intervensi',
                        planning: 'Perencanaan',
                        evaluation: 'Evaluasi',
                        complete: 'Selesai',
                        followup: 'Tindak Lanjut'
                    }
                }
            },
            posyanduActive: {
                header: {
                    badge: 'Posyandu Aktif',
                    title: 'Layanan Meja 2 & 5'
                },
                doctorCapacity: 'Kapasitas Dokter (AP)',
                criticalLabel: 'Kritis',
                gender: {
                    maleShort: 'L',
                    femaleShort: 'P',
                    male: 'Laki-laki',
                    female: 'Perempuan'
                },
                ageMonths: '{{count}} bln',
                triage: {
                    title: 'Meja 1: Pendaftaran & Triase',
                    subtitle: 'AP terbatas. Prioritaskan pasien berisiko. Delegasi kader = 20% error rate.',
                    apEmpty: 'Tenaga dokter habis. Sisa pasien wajib didelegasikan ke kader.'
                },
                actions: {
                    delegateCadre: 'Kader (0 AP)',
                    examine: 'Periksa (-1 AP)',
                    confirmKms: 'Sahkan & Lanjut Meja 5 ->',
                    finishExam: 'Selesaikan Exam',
                    closeLogbook: 'Tutup Logbook X'
                },
                kms: {
                    title: 'Kartu Menuju Sehat',
                    subtitle: 'Grafik Pertumbuhan WHO - {{gender}}',
                    weight: 'BB: {{weight}} kg',
                    patientAge: '{{name}} - {{age}} bln',
                    note: 'Analisis tren grafik. Salah diagnosis = pasien kehilangan intervensi gizi.'
                },
                stampPanel: {
                    title: 'Diagnosis Gizi',
                    hint: 'Baca grafik lalu pilih stempel.',
                    noReveal: 'Tidak ada auto-reveal.'
                },
                stamps: {
                    gizi_baik: 'Gizi Baik',
                    weight_faltering: 'Tidak Naik (T)',
                    gizi_kurang: 'Gizi Kurang',
                    gizi_buruk: 'Gizi Buruk',
                    gizi_lebih: 'Gizi Lebih',
                    stunting: 'Stunting'
                },
                vials: {
                    delay: 'Tunda Vaksin'
                },
                immunization: {
                    title: 'Catatan Imunisasi K.I.A',
                    patient: 'Nama: {{name}} | Usia: {{age}} bln',
                    doneStamp: 'OK',
                    injectedStamp: 'Suntik'
                },
                coldChain: {
                    title: 'Rantai Dingin Vaksin',
                    temperature: 'Suhu: 2.0C - 8.0C',
                    warning: 'Salah vaksin = risiko KIPI.'
                },
                handlers: {
                    cadre: 'Kader',
                    doctor: 'Dokter'
                },
                feedback: {
                    cadreError: 'Kader salah interpretasi kurva KMS. Kasus berisiko lolos tanpa intervensi.',
                    cadreOk: 'Kader melayani dengan standar dasar. Pencatatan OK.',
                    delayVaccine: 'Vaksinasi ditunda oleh dokter.',
                    vaccineNotFound: '{{vaccine}} tidak ditemukan dalam jadwal vaksin.',
                    vaccineAlreadyGiven: '{{vaccine}} sudah pernah diberikan.',
                    vaccineTooEarly: '{{vaccine}} belum waktunya.',
                    vaccineOnTime: '{{vaccine}} diberikan tepat waktu.',
                    vaccineLateCatchUp: '{{vaccine}} terlambat, tetapi catch-up berhasil.',
                    vaccineVeryLate: '{{vaccine}} sangat terlambat. Catch-up tetap penting untuk proteksi.',
                    vaccineGiven: '{{vaccine}} diberikan.'
                },
                report: {
                    ministry: 'Kementerian Kesehatan RI',
                    title: 'Audit Mutu Posyandu',
                    logTitle: 'Log Rekam Medis:',
                    statusError: 'Malpraktik / Error',
                    statusOk: 'Sesuai SOP',
                    kmsDiagnosis: 'Diagnosis KMS:',
                    correctSuffix: ' (Tepat)',
                    shouldBe: ' Harusnya: {{stamp}}',
                    vaccination: 'Vaksinasi:',
                    vaccineRiskSuffix: ' (Risiko KIPI)',
                    vaccineSafeSuffix: ' (Aman)',
                    malpracticeTitle: 'Laporan Malpraktik',
                    malpracticeBody: '{{count}} kasus malpraktik tercatat. Kesalahan diagnosis KMS menyebabkan kasus gizi buruk/stunting lolos tanpa intervensi. Kesalahan vaksin memicu risiko KIPI. Reputasi Posyandu menurun.',
                    medicalXp: 'XP Medis',
                    independentAura: 'Aura Mandiri +{{xp}} XP',
                    villageReputation: 'Reputasi Desa'
                }
            },
            pustuActive: {
                header: {
                    badge: 'Pustu / Polindes',
                    title: 'Pelayanan KIA - Buku Pink'
                },
                doctorCapacity: 'Kapasitas Dokter (AP)',
                criticalLabel: 'Kritis',
                triage: {
                    title: 'Antrian Ibu Hamil',
                    subtitle: 'AP terbatas. Prioritaskan kehamilan risiko tinggi. Delegasi = 25% error.',
                    apEmpty: 'Tenaga dokter habis. Sisa pasien wajib didelegasikan ke bidan desa.'
                },
                patient: {
                    age: 'Usia {{age}} th',
                    ageYears: '{{age}} tahun',
                    gestationalWeekShort: 'UK {{week}} mg',
                    weekValue: '{{week}} minggu'
                },
                actions: {
                    delegateMidwife: 'Bidan (0 AP)',
                    examine: 'Periksa (-1 AP)',
                    confirmAnc: 'Sahkan Pemeriksaan ->',
                    confirmRisk: 'Konfirmasi Asesmen Risiko ->',
                    skipKb: 'Lewati KB',
                    counselKb: 'Konseling KB ->',
                    closeLogbook: 'Tutup Logbook X'
                },
                ancCard: {
                    title: 'Kartu Ibu - {{visit}}',
                    name: 'Nama',
                    age: 'Usia',
                    gestationalWeek: 'UK',
                    edd: 'HPL',
                    startWeight: 'BB Awal',
                    height: 'TB'
                },
                ancChecksTitle: 'Pilih Pemeriksaan',
                ancChecksHint: 'Centang pemeriksaan yang diperlukan untuk {{visit}}. Pemeriksaan wajib yang terlewat = skor turun.',
                requiredVisit: 'Wajib {{visit}}',
                submitPanel: {
                    required: 'Wajib: {{count}} pemeriksaan',
                    selected: 'Dipilih: {{count}}',
                    completeness: 'Kelengkapan',
                    requiredCount: '{{done}}/{{total}} wajib'
                },
                risk: {
                    title: 'Asesmen Risiko Kehamilan',
                    hint: 'Identifikasi faktor risiko dari data pemeriksaan. Salah tanda = risiko tidak terdeteksi.',
                    visitResult: 'Hasil Pemeriksaan {{visit}}',
                    weight: 'Bobot: {{weight}}'
                },
                warningPrefix: 'Peringatan:',
                kb: {
                    title: 'Konseling KB Pasca Salin',
                    hint: 'Rekomendasikan metode KB berdasarkan profil pasien. Perhatikan kontraindikasi.',
                    effectiveness: '{{value}}% efektif',
                    duration: 'Durasi: {{duration}}',
                    sideEffects: 'Efek samping: {{effects}}',
                    minimal: 'minimal',
                    contraindications: 'Kontraindikasi: {{items}}'
                },
                report: {
                    ministry: 'Kementerian Kesehatan RI',
                    title: 'Audit Mutu Pelayanan KIA',
                    score: 'Skor: {{score}}/100',
                    visitSummary: '{{visit}} - {{count}} pemeriksaan',
                    medicalXp: 'XP Medis',
                    reputation: 'Reputasi'
                },
                handlers: {
                    midwife: 'Bidan Desa',
                    doctor: 'Dokter'
                },
                visitLabels: {
                    K1: 'K1 (Kunjungan Pertama)',
                    K2: 'K2 (Trimester 2)',
                    K3: 'K3 (Trimester 3 Awal)',
                    K4: 'K4 (Trimester 3 Akhir)'
                },
                ancChecks: {
                    berat_badan: 'Timbang Berat Badan',
                    tekanan_darah: 'Ukur Tekanan Darah',
                    tinggi_fundus: 'Ukur Tinggi Fundus Uteri',
                    denyut_jantung_janin: 'Dengar DJJ (Doppler)',
                    hb: 'Cek Hemoglobin',
                    golongan_darah: 'Cek Golongan Darah',
                    protein_urin: 'Tes Protein Urin',
                    gds: 'Gula Darah Sewaktu',
                    hiv: 'Rapid Test HIV',
                    hbsag: 'Tes HBsAg',
                    sifilis: 'Tes Sifilis (RPR)',
                    letak_janin: 'Palpasi Leopold (Letak Janin)',
                    rencana_persalinan: 'Rencana Persalinan (P4K)'
                },
                riskFactors: {
                    age_too_young: 'Usia < 20 tahun',
                    age_too_old: 'Usia > 35 tahun',
                    grand_multipara: 'Grande multipara (>= 5 anak)',
                    short_stature: 'Tinggi badan < 145 cm',
                    anemia: 'Anemia (Hb < 11 g/dL)',
                    hypertension: 'Hipertensi (TD >= 140/90)',
                    proteinuria: 'Proteinuria positif',
                    prev_csection: 'Riwayat SC sebelumnya',
                    prev_complication: 'Riwayat komplikasi sebelumnya',
                    twins: 'Kehamilan kembar',
                    malpresentation: 'Letak sungsang/lintang',
                    obesity: 'Obesitas (BMI >= 30)'
                },
                events: {
                    preeclampsia_onset: { label: 'Tanda Pre-eklampsia', description: 'TD naik dengan proteinuria dan edema. Perlu monitoring ketat dan rujukan bila berat.' },
                    anemia_worsening: { label: 'Anemia Memberat', description: 'Hb turun di bawah 8 g/dL. Perlu tablet Fe dosis tinggi atau rujuk transfusi.' },
                    gdm_detected: { label: 'Diabetes Gestasional', description: 'GDS tinggi atau TTGO abnormal. Perlu diet control dan monitoring ketat.' },
                    placenta_previa: { label: 'Curiga Plasenta Previa', description: 'Perdarahan tanpa nyeri di trimester 3. Rujuk segera; jangan VT.' },
                    premature_labor: { label: 'Tanda Persalinan Prematur', description: 'Kontraksi teratur sebelum 37 minggu. Perlu tokolitik, kortikosteroid, dan rujukan.' },
                    iugr_suspected: { label: 'Curiga IUGR', description: 'TFU tidak sesuai usia kehamilan. Pantau pertumbuhan janin ketat.' },
                    normal_progress: { label: 'Kehamilan Normal', description: 'Tidak ditemukan kelainan. Berikan edukasi gizi, tanda bahaya, dan persiapan persalinan.' },
                    hyperemesis: { label: 'Hiperemesis Gravidarum', description: 'Mual muntah berlebihan dengan dehidrasi. Berikan cairan dan antiemetik.' },
                    ektopik_suspicion: { label: 'Curiga Kehamilan Ektopik', description: 'Nyeri perut hebat disertai perdarahan trimester 1. Rujuk segera.' }
                },
                kbMethods: {
                    pil_kb: { name: 'Pil KB Kombinasi', duration: 'harian' },
                    suntik_1bln: { name: 'Suntik 1 Bulan (Cyclofem)', duration: '1 bulan' },
                    suntik_3bln: { name: 'Suntik 3 Bulan (DMPA)', duration: '3 bulan' },
                    implant: { name: 'Implant (Implanon/Jadena)', duration: '3 tahun' },
                    iud_copprt: { name: 'IUD Copper (CuT-380A)', duration: '10 tahun' },
                    kondom: { name: 'Kondom', duration: 'per penggunaan' },
                    mow: { name: 'MOW (Tubektomi)', duration: 'permanen' },
                    mop: { name: 'MOP (Vasektomi)', duration: 'permanen' }
                },
                kbSideEffects: {
                    mual: 'mual',
                    nyeri_payudara: 'nyeri payudara',
                    spotting: 'spotting',
                    perubahan_siklus: 'perubahan siklus',
                    kenaikan_bb: 'kenaikan BB',
                    amenore: 'amenore',
                    osteoporosis_risk: 'risiko osteoporosis',
                    nyeri_haid: 'nyeri haid',
                    haid_banyak: 'haid banyak',
                    risiko_operasi: 'risiko operasi',
                    nyeri_lokal: 'nyeri lokal'
                },
                kbContraindications: {
                    hipertensi: 'hipertensi',
                    merokok_35plus: 'merokok usia 35+',
                    riwayat_dvt: 'riwayat DVT',
                    hipertensi_berat: 'hipertensi berat',
                    infeksi_pelvis: 'infeksi pelvis',
                    kehamilan: 'kehamilan'
                },
                feedback: {
                    midwifeError: 'Bidan desa melewatkan pemeriksaan penting. Risiko kehamilan tidak terdeteksi.',
                    midwifeOk: 'Bidan desa melakukan pemeriksaan standar. Catatan OK.',
                    doctorStrong: 'Pemeriksaan ANC lengkap dan sesuai standar.',
                    doctorPartial: 'Beberapa pemeriksaan penting terlewat.',
                    doctorPoor: 'Pemeriksaan sangat tidak lengkap. Risiko kehamilan tidak teridentifikasi.',
                    ancComplete: 'Pemeriksaan ANC lengkap dan sesuai standar.',
                    ancMissing: '{{count}} pemeriksaan esensial belum dilakukan: {{checks}}.',
                    ancManyMissing: 'Banyak pemeriksaan belum dilakukan. Standar minimal mencakup: {{checks}}.',
                    kbContraindicated: '{{method}} kontraindikasi untuk pasien ini. Pilih metode lain.',
                    kbEligible: '{{method}} sesuai untuk pasien. Efektivitas: {{effectiveness}}%.',
                    deliveryNormal: 'Persalinan normal pervaginam. Ibu dan bayi sehat.',
                    deliveryComplicated: 'Komplikasi: {{complication}}. {{mode}} perlu tata laksana segera.'
                }
            },
            errorBoundary: {
                closePosyandu: 'Tutup Posyandu',
                closePustu: 'Tutup Pustu',
                closeBuilding: 'Tutup Gedung',
                closeCase: 'Tutup Kasus',
                closePanel: 'Tutup Panel',
                scenarioUnavailable: 'Skenario "{{scenario}}" belum bisa dimulai saat ini. Cek status aktif, cooldown, atau kategori IKM.'
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
        ikmCategories: {
            phbs: 'Perilaku Hidup Bersih dan Sehat',
            cultural: 'Sosio-Kultural dan Kepercayaan',
            environmental: 'Kesehatan Lingkungan dan Kerja',
            nutrition: 'Gizi dan Tumbuh Kembang',
            mental_health: 'Kesehatan Jiwa',
            adolescent: 'Kesehatan Remaja (PKPR)',
            food_safety: 'Keamanan Pangan',
            traditional_health: 'Kesehatan Tradisional'
        },
        ikmScenarios: {
            phbs: {
                bab_sembarangan: {
                    title: 'BAB Sembarangan di Sungai',
                    description: 'Laporan dari kader: beberapa warga RT 05 masih BAB di sungai. Risiko diare meningkat di musim hujan.'
                },
                cuci_tangan: {
                    title: 'Wabah ISPA di SD - Cuci Tangan',
                    description: 'Banyak anak SD tidak cuci tangan setelah jajan. Klaster ISPA muncul di dua kelas.'
                },
                makan_sembarangan: {
                    title: 'Keracunan Jajanan Pasar',
                    description: 'Beberapa warga mengalami mual dan diare setelah membeli jajanan di pasar desa.'
                },
                air_minum_tercemar: {
                    title: 'Sumur Tercemar E. coli',
                    description: 'Sumur di RT 03 tercemar bakteri E. coli setelah banjir. Warga belum sadar bahayanya.'
                },
                sampah_menumpuk: {
                    title: 'Sampah Menumpuk - Sarang Nyamuk',
                    description: 'Sampah organik menumpuk di dua RT dan menjadi tempat berkembang biak nyamuk Aedes aegypti.'
                }
            },
            cultural: {
                kesurupan_massal: {
                    title: 'Kepanikan Kesurupan Massal di Sekolah',
                    description: 'Belasan siswi SMP pingsan atau berteriak bersamaan. Warga panik dan meminta ritual doa.'
                },
                tolak_vaksin: {
                    title: 'Penolakan Imunisasi Campak',
                    description: 'Sekelompok warga menolak imunisasi campak untuk anak mereka karena isu halal-haram.'
                },
                dukun_beranak: {
                    title: 'Ibu Risiko Tinggi Memilih Dukun Beranak',
                    description: 'Ibu hamil risiko tinggi memilih melahirkan di dukun beranak dan menolak layanan puskesmas.'
                },
                jamu_berbahaya: {
                    title: 'Jamu Campur Steroid',
                    description: 'Penjual jamu keliling mencampur deksametason ke jamu pegal linu. Beberapa warga mengalami kekambuhan diabetes.'
                },
                kerokan_anak: {
                    title: 'Anak Sakit Dikerokin',
                    description: 'Bayi delapan bulan demam tinggi dikerokin neneknya hingga muncul dermatitis akibat kerokan.'
                }
            },
            environmental: {
                pestisida_pertanian: {
                    title: 'Keracunan Pestisida Petani',
                    description: 'Petani menyemprot tanpa APD, lalu dua orang kolaps di sawah.'
                },
                asap_pembakaran: {
                    title: 'Asap Pembakaran Lahan',
                    description: 'Pembakaran lahan ladang menyebabkan kabut asap tebal. Kunjungan ISPA naik tiga kali lipat.'
                },
                gigitan_ular: {
                    title: 'Gigitan Ular di Sawah',
                    description: 'Petani digigit ular berbisa saat panen padi.'
                },
                leptospirosis_banjir: {
                    title: 'Leptospirosis Pasca-Banjir',
                    description: 'Setelah banjir besar, beberapa warga yang terendam air keruh mulai demam tinggi.'
                }
            },
            nutrition: {
                stunting_deteksi: {
                    title: 'Deteksi Stunting di Posyandu',
                    description: 'Posyandu bulan ini menemukan tiga balita yang masuk zona merah KMS.'
                },
                gizi_buruk_balita: {
                    title: 'Gizi Buruk Balita di RT Pinggiran',
                    description: 'Ditemukan balita dengan tanda kwashiorkor di keluarga miskin.'
                },
                anemia_remaja: {
                    title: 'Anemia Remaja Putri - Skrining Sekolah',
                    description: 'Skrining Hb di SMP menemukan 40% remaja putri anemia. Program tablet Fe dimulai.'
                },
                mpasi_salah: {
                    title: 'MP-ASI Terlalu Dini',
                    description: 'Bayi tiga bulan sudah diberi pisang dan bubur. Ibu muda terpengaruh mertua.'
                }
            },
            mental_health: {
                depresi_pascabencana: {
                    title: 'Depresi Pasca-Bencana Longsor',
                    description: 'Setelah longsor menghancurkan lima rumah, beberapa warga menunjukkan gejala depresi dan PTSD.'
                },
                psikotik_akut: {
                    title: 'Episode Psikotik Akut di Pasar',
                    description: 'Seorang pria muda berteriak-teriak di pasar dan mengaku dikejar setan. Warga panik.'
                },
                bunuh_diri_remaja: {
                    title: 'Percobaan Bunuh Diri Remaja',
                    description: 'Remaja SMA ditemukan minum racun serangga setelah mengalami perundungan di media sosial.'
                }
            },
            adolescent: {
                anemia_remaja: {
                    title: 'Skrining Anemia Remaja Putri',
                    description: 'Skrining Hb di SMP menemukan 40% siswi anemia. Penyebabnya kurang zat besi dan mitos diet.'
                },
                teen_pregnancy: {
                    title: 'Kehamilan Remaja - Dilema Sosial',
                    description: 'Siswi SMP usia 15 tahun diam-diam hamil lima bulan. Keluarga malu dan ingin menikahkan paksa.'
                },
                napza_remaja: {
                    title: 'Penyalahgunaan NAPZA di Kalangan Remaja',
                    description: 'Beberapa remaja SMA tertangkap menghirup lem di pos ronda. Warga gelisah.'
                }
            },
            food_safety: {
                makan_sembarangan: {
                    title: 'KLB Keracunan Makanan di Hajatan',
                    description: 'Setelah hajatan nikahan, 30 tamu mendadak muntah dan diare. Diduga makanan terkontaminasi.'
                },
                formalin_tahu: {
                    title: 'Tahu Berformalin di Pasar Desa',
                    description: 'Tes cepat di pasar menemukan tahu berformalin. Pedagang tidak tahu barangnya berbahaya.'
                },
                jajan_anak_sekolah: {
                    title: 'Jajanan Sekolah Tidak Sehat',
                    description: 'Sebagian besar jajanan di depan SD mengandung pewarna tekstil dan pemanis buatan berlebih.'
                }
            },
            traditional_health: {
                jamu_berbahaya: {
                    title: 'Jamu Keliling Berbahaya - Oplosan Steroid',
                    description: 'Warga lansia rutin membeli jamu keliling yang ternyata mengandung deksametason dan piroksikam.'
                },
                dukun_beranak: {
                    title: 'Persalinan oleh Dukun Beranak - Komplikasi',
                    description: 'Ibu hamil memilih melahirkan di dukun beranak dan mengalami perdarahan pascapersalinan.'
                },
                herbal_interaksi_obat: {
                    title: 'Interaksi Obat-Herbal pada Pasien Hipertensi',
                    description: 'Warga minum obat hipertensi bersama rebusan kumis kucing dan bawang putih mentah sehingga tekanan darah turun drastis.'
                }
            }
        },
        ikmScenarioPhases: {
            phbs: {
                bab_sembarangan: {
                    discovery: {
                        speaker: 'Kader Desa',
                        text: 'Dok, saya baru nemu ada 3 keluarga di RT 05 yang masih buang air besar di sungai. Anaknya juga sering diare. Gimana ya Dok?',
                        choices: [
                            { text: 'Ayo kita turun ke lapangan untuk observasi lapangan dan analisis COM-B dulu.' }
                        ]
                    },
                    investigate_comb: {
                        description: 'Lakukan analisis perilaku warga RT 05 terkait kebiasaan BAB di sungai.'
                    },
                    diagnosis: {
                        question: 'Berdasarkan hasil observasi dan analisis COM-B, apa akar masalah kebiasaan BAB sembarangan di RT 05?',
                        choices: [
                            { text: 'A. Kurangnya penyuluhan tata cara BAB yang benar.', feedback: 'Kurang tepat. Warga sebenarnya tahu perilaku dasarnya, tapi ada hambatan lain.' },
                            { text: 'B. Ketiadaan akses fisik ke jamban layak dan kebiasaan turun-temurun.', feedback: 'Tepat. Ketiadaan jamban menjadi hambatan fisik, sementara kebiasaan membuat warga tetap ke sungai.' },
                            { text: 'C. Gangguan pencernaan kronis pada warga RT 05.', feedback: 'Salah. Diare adalah akibat, bukan akar perilaku.' }
                        ]
                    },
                    intervention: {
                        who: {
                            question: 'Siapa sasaran utama?',
                            correct: 'Kepala keluarga RT 05 dan aparat desa',
                            options: ['Kepala keluarga RT 05 dan aparat desa', 'Anak-anak RT 05', 'Petugas kebersihan', 'Kader Posyandu']
                        },
                        what: {
                            question: 'Apa bentuk intervensi terbaik saat ini?',
                            correct: 'Pemicuan STBM dan pembangunan jamban komunal',
                            options: ['Pemicuan STBM dan pembangunan jamban komunal', 'Pembagian obat diare gratis', 'Pemasangan spanduk dilarang BAB', 'Senam pagi bersama']
                        },
                        where: {
                            question: 'Di mana lokasi intervensi?',
                            correct: 'Balai desa dan lokasi RT 05',
                            options: ['Balai desa dan lokasi RT 05', 'Puskesmas', 'Sekolah dasar', 'Pusat kota']
                        },
                        when: {
                            question: 'Kapan pelaksanaannya?',
                            correct: 'Segera, sebelum puncak musim hujan',
                            options: ['Segera, sebelum puncak musim hujan', 'Tahun depan', 'Tunggu KLB terjadi', 'Bulan depan']
                        },
                        why: {
                            question: 'Mengapa intervensi ini penting?',
                            correct: 'Memutus rantai penularan fekal-oral secara permanen',
                            options: ['Memutus rantai penularan fekal-oral secara permanen', 'Menghabiskan anggaran desa', 'Meningkatkan estetika sungai', 'Menambah pekerjaan kader']
                        },
                        how: {
                            question: 'Bagaimana pendekatannya?',
                            correct: 'Pemicuan STBM dengan rasa jijik dan malu',
                            options: ['Pemicuan STBM dengan rasa jijik dan malu', 'Paksaan dengan denda', 'Memberi uang saku', 'Menunggu kesadaran sendiri']
                        }
                    },
                    resolution_success: {
                        text: 'Intervensi berhasil. Setelah pemicuan STBM, desa sepakat membangun jamban komunal. Kasus diare menurun drastis.'
                    },
                    resolution_fail: {
                        text: 'Intervensi kurang tepat sasaran. Warga tetap BAB di sungai karena akar masalah tidak tersentuh. Diare mulai merebak.'
                    }
                },
                cuci_tangan: {
                    discovery: {
                        speaker: 'Guru SD',
                        text: 'Dok, 12 anak di kelas 3 dan 5 batuk pilek semua dalam seminggu ini. Kami curiga karena mereka jajan di luar dan nggak cuci tangan. Bisa bantu?',
                        choices: [
                            { text: 'Mari kita investigasi lapangan ke sekolah (Analisis COM-B).' }
                        ]
                    },
                    investigate_comb: {
                        description: 'Analisis perilaku anak SD terkait cuci tangan pakai sabun.'
                    },
                    diagnosis: {
                        question: 'Berdasarkan observasi kantin sekolah dan analisis COM-B, apa diagnosis IKM dari klaster ISPA ini?',
                        choices: [
                            { text: 'A. Mutasi virus bawaan udara dari luar desa.', feedback: 'Kurang tepat. Pola penyebaran sangat terlokalisir di jam istirahat.' },
                            { text: 'B. Transmisi droplet dan kebersihan tangan buruk setelah jajan.', feedback: 'Tepat. Pola interaksi anak SD dan berbagi makanan tanpa cuci tangan mempercepat penyebaran.' },
                            { text: 'C. Keracunan makanan dari es sirup.', feedback: 'Salah. Gejalanya respiratorik, bukan gastrointestinal.' }
                        ]
                    },
                    intervention: {
                        who: {
                            question: 'Siapa sasaran utama?',
                            correct: 'Siswa kelas 3-6 dan guru penjaskes',
                            options: ['Siswa kelas 3-6 dan guru penjaskes', 'Hanya kepala sekolah', 'Kader Posyandu', 'Orang tua siswa di rumah']
                        },
                        what: {
                            question: 'Apa bentuk intervensi terbaik saat ini?',
                            correct: 'Demonstrasi CTPS 6 langkah dan pemasangan wastafel',
                            options: ['Demonstrasi CTPS 6 langkah dan pemasangan wastafel', 'Meliburkan sekolah 1 bulan', 'Memberi antibiotik profilaksis', 'Razia pedagang keliling']
                        },
                        where: {
                            question: 'Di mana lokasi intervensi?',
                            correct: 'Lapangan sekolah sebelum jam istirahat',
                            options: ['Lapangan sekolah sebelum jam istirahat', 'Balai desa', 'Puskesmas', 'Rumah masing-masing siswa']
                        },
                        when: {
                            question: 'Kapan waktu pelaksanaan yang kritis?',
                            correct: 'Besok pagi, potong rantai penularan segera',
                            options: ['Besok pagi, potong rantai penularan segera', 'Tunggu hari libur', 'Bulan depan saat apel', 'Tahun ajaran baru']
                        },
                        why: {
                            question: 'Mengapa intervensi ini penting?',
                            correct: 'Memutus transmisi droplet dan kontak langsung',
                            options: ['Memutus transmisi droplet dan kontak langsung', 'Syarat akreditasi sekolah', 'Menghabiskan stok sabun', 'Sekadar himbauan rutin']
                        },
                        how: {
                            question: 'Bagaimana metodenya?',
                            correct: 'Praktik langsung bersama dengan sabun dan air mengalir',
                            options: ['Praktik langsung bersama dengan sabun dan air mengalir', 'Membagikan brosur saja', 'Memarahi anak yang tidak cuci tangan', 'Menonton video 1 jam di kelas']
                        }
                    },
                    resolution_success: {
                        text: 'Intervensi sukses. Anak-anak kini rutin CTPS. Penyebaran ISPA di sekolah terhenti.'
                    },
                    resolution_fail: {
                        text: 'Intervensi tidak memadai. Transmisi droplet terus berlanjut di sekolah, banyak anak bertambah sakit.'
                    }
                },
                makan_sembarangan: {
                    discovery: {
                        speaker: 'Perawat',
                        text: 'Dok, pagi ini sudah ada 5 pasien dengan gejala serupa: mual, muntah, diare setelah makan jajanan di pasar kemarin sore. Sepertinya keracunan makanan.',
                        choices: [
                            { text: 'Investigasi ke pasar, ambil sampel makanan.' },
                            { text: 'Tangani pasien dulu, laporkan ke Dinkes.' },
                            { text: 'Lakukan keduanya: bagi tugas dengan perawat.' }
                        ]
                    },
                    investigate: {
                        text: 'Anda menemukan pedagang bakso menggunakan boraks. Sampel disita, dan pedagang diberi teguran keras serta edukasi keamanan pangan.'
                    },
                    treat_report: {
                        text: 'Pasien ditangani dengan rehidrasi. Dinkes mengirim tim investigasi lanjutan dua hari kemudian.'
                    },
                    both: {
                        text: 'Tim terkoordinasi: pasien ditangani, pedagang diidentifikasi, dan Dinkes menutup sementara warung bermasalah. Kasus berhenti total.'
                    }
                },
                air_minum_tercemar: {
                    discovery: {
                        speaker: 'Sanitarian',
                        text: 'Dok, hasil tes air sumur di RT 03 positif E. coli di atas ambang batas. Ini setelah banjir minggu lalu. 8 keluarga masih pakai sumur itu.',
                        choices: [
                            { text: 'Segera umumkan ke warga, larang pakai sumur.' },
                            { text: 'Distribusikan air bersih dan kaporit, edukasi memasak air.' }
                        ]
                    },
                    immediate_ban: {
                        text: 'Warga kecewa karena tidak ada alternatif air segera. Beberapa tetap diam-diam memakai sumur. Dua kasus diare muncul.'
                    },
                    distribute_treat: {
                        text: 'Warga menerima air bersih dan belajar klorinasi. Sumur didisinfeksi setelah air surut. Tidak ada kasus diare baru.'
                    }
                },
                sampah_menumpuk: {
                    discovery: {
                        speaker: 'Kader Jumantik',
                        text: 'Dok, hasil pemantauan jentik minggu ini angkanya naik. ABJ turun ke 70%. Saya lihat sampah menumpuk di RT 02 dan RT 04, banyak genangan air di ban dan kaleng bekas.',
                        choices: [
                            { text: 'Gerakkan kerja bakti PSN 3M Plus.' },
                            { text: 'Koordinasi dengan RT untuk pengangkutan sampah.' }
                        ]
                    },
                    kerja_bakti: {
                        description: 'Pimpin kerja bakti di dua RT.'
                    },
                    waste_management: {
                        text: 'Ketua RT setuju menjadwalkan pengangkutan sampah rutin dua kali seminggu. Sampah mulai berkurang.'
                    },
                    resolution_psn: {
                        text: 'Kerja bakti PSN berhasil. ABJ naik ke 90%. Warga mulai rajin menguras dan mengubur barang bekas. Risiko DBD turun signifikan.'
                    }
                }
            },
            cultural: {
                kesurupan_massal: {
                    discovery: {
                        speaker: 'Kepala Sekolah',
                        text: 'Dok! 8 siswi kesurupan semua. Mereka menjerit-jerit, ada yang pingsan. Ustaz sudah kita panggil tapi belum datang. Tolong Dok!',
                        choices: [
                            { text: 'Datang langsung, periksa satu per satu secara medis.' },
                            { text: 'Pisahkan siswi yang sehat dulu, isolasi yang terdampak.' }
                        ]
                    },
                    medical_exam: {
                        text: 'Pemeriksaan medis tidak menemukan kelainan organik. Anda menduga mass psychogenic illness yang dipicu stres ujian. Setelah diisolasi, para siswi mulai tenang dalam 30 menit.',
                        choices: [
                            { text: 'Jelaskan situasinya secara ilmiah kepada guru dan orang tua.' },
                            { text: 'Hormati kepercayaan lokal dan libatkan ustaz juga.' }
                        ]
                    },
                    isolation_first: {
                        text: 'Siswi yang belum terdampak dipindahkan ke ruang lain. Yang terdampak diperiksa satu per satu. Penularan psikogenik berhenti.'
                    },
                    scientific_explanation: {
                        text: 'Sebagian orang tua menerima penjelasan, sementara sebagian masih percaya ada gangguan gaib di sekolah. Reputasi Anda naik di kalangan guru, tetapi turun di sebagian warga.'
                    },
                    cultural_bridge: {
                        text: 'Dengan pendekatan bijak, Anda menjelaskan sisi medis sambil menghormati kekhawatiran spiritual. Ustaz mendukung penjelasan Anda. Warga menghargai pendekatan yang seimbang ini.'
                    }
                },
                tolak_vaksin: {
                    discovery: {
                        speaker: 'Bidan',
                        text: 'Dok, ada 6 keluarga yang menolak imunisasi campak-rubella. Mereka bilang ada ustaz yang ceramah bahwa vaksin itu haram dan mengandung babi.',
                        choices: [
                            { text: 'Ajak bicara ustaz tersebut, tunjukkan fatwa MUI.' },
                            { text: 'Kunjungi keluarga satu per satu, edukasi langsung.' },
                            { text: 'Gelar pertemuan warga dengan narasumber Dinkes dan MUI.' }
                        ]
                    },
                    engage_ustaz: {
                        text: 'Setelah berdiskusi dan meninjau Fatwa MUI No. 04/2016, ustaz tersebut bersedia membantu klarifikasi. Empat dari enam keluarga akhirnya mau diimunisasi.'
                    },
                    door_to_door: {
                        description: 'Kunjungi keluarga yang menolak vaksin.'
                    },
                    resolution_door: {
                        text: 'Dengan penjelasan sabar satu per satu, tiga keluarga mau diimunisasi. Tiga lainnya masih menolak. Perlu pendekatan membangun kepercayaan dalam jangka panjang.'
                    },
                    town_hall: {
                        text: 'Pertemuan ramai dihadiri lebih dari 50 warga. Dokter dari Dinkes dan perwakilan MUI memberikan penjelasan komprehensif. Lima dari enam keluarga akhirnya bersedia.'
                    }
                },
                dukun_beranak: {
                    discovery: {
                        speaker: 'Bidan',
                        text: 'Dok, Bu Siti (G4P3, 38 tahun, riwayat perdarahan persalinan sebelumnya) mau melahirkan di Mbah Parti, dukun beranak. Dia bilang sudah 3 kali aman. Padahal ini risiko tinggi.',
                        choices: [
                            { text: 'Kunjungi Bu Siti langsung, jelaskan risiko dengan data.' },
                            { text: 'Ajak Mbah Parti bermitra, bidan dampingi saat persalinan.' },
                            { text: 'Libatkan suami dan keluarga dalam konseling.' }
                        ]
                    },
                    visit_patient: {
                        text: 'Bu Siti awalnya defensif, tetapi setelah Anda menunjukkan data kematian ibu dan risiko perdarahan berulang, ia mulai mempertimbangkan ulang. Suaminya masih ragu soal biaya.',
                        choices: [
                            { text: 'Jelaskan bahwa JKN/BPJS bisa menanggung persalinan.' }
                        ]
                    },
                    partner_dukun: {
                        text: 'Mbah Parti ternyata kooperatif. Ia setuju mendampingi secara spiritual sementara bidan menangani persalinan. Bu Siti merasa dihargai.'
                    },
                    family_counsel: {
                        text: 'Suami dan ibu mertua akhirnya mendukung persalinan di puskesmas setelah mendengar risikonya. Bu Siti setuju.'
                    },
                    resolution_jkn: {
                        text: 'Setelah tahu persalinan ditanggung BPJS, suami langsung setuju. Bu Siti bersalin aman di puskesmas dengan pendampingan bidan.'
                    }
                },
                jamu_berbahaya: {
                    discovery: {
                        speaker: 'Perawat',
                        text: 'Dok, 3 pasien DM yang sudah terkontrol tiba-tiba gula darahnya melonjak. Setelah ditanya, mereka semua minum jamu pegal linu dari Bu Warni, tukang jamu keliling.',
                        choices: [
                            { text: 'Ambil sampel jamu, kirim ke lab BPOM.' },
                            { text: 'Temui Bu Warni langsung, peringatkan.' }
                        ]
                    },
                    lab_test: {
                        text: 'Hasil lab positif deksametason dan piroksikam. Anda melapor ke Dinkes dan BPOM. Bu Warni dibina dan stok jamu disita.'
                    },
                    confront_seller: {
                        text: 'Bu Warni mengaku mendapat resep dari juragan jamu di kota. Anda membuatnya berjanji berhenti, tetapi tanpa bukti lab sulit menindak tegas.'
                    }
                },
                kerokan_anak: {
                    discovery: {
                        speaker: 'Ibu Pasien',
                        text: 'Dok, anak saya demam 3 hari, nenek sudah kerokin tapi malah tambah rewel. Badannya merah-merah ini kenapa ya?',
                        choices: [
                            { text: 'Periksa anak, jelaskan bahaya kerokan pada bayi.' },
                            { text: 'Tangani demamnya dulu, edukasi pelan-pelan.' }
                        ]
                    },
                    examine_educate: {
                        text: 'Anda menjelaskan bahwa kulit bayi sangat tipis, dan kerokan bisa menyebabkan lecet serta infeksi. Ibu memahami, tetapi nenek keberatan karena kebiasaan ini sudah lama dilakukan.',
                        choices: [
                            { text: 'Jelaskan dengan analogi yang dimengerti nenek.' }
                        ]
                    },
                    treat_first: {
                        text: 'Anda memberikan paracetamol dan mengobati lesi kulit. Setelah anak membaik, Anda menjelaskan pelan-pelan bahwa kerokan tidak cocok untuk bayi.'
                    },
                    resolution_gentle: {
                        text: 'Anda membandingkan kulit bayi dengan tahu yang lembut dan mudah luka jika dikerok. Nenek akhirnya paham. Keluarga dijadwalkan kontrol ulang.'
                    }
                }
            },
            environmental: {
                pestisida_pertanian: {
                    discovery: {
                        speaker: 'Ketua Kelompok Tani',
                        text: 'Dok! Pak Udin dan Pak Cecep pingsan di sawah setelah menyemprot pestisida. Mereka tidak pakai masker. Mulutnya berbusa.',
                        choices: [
                            { text: 'Segera ke lokasi dengan kit kedaruratan.' },
                            { text: 'Instruksikan bawa ke puskesmas, siapkan atropin.' }
                        ]
                    },
                    emergency_response: {
                        text: 'Di lokasi, Anda melakukan dekontaminasi, memberikan atropin, dan menstabilkan kedua pasien. Keduanya dirujuk ke RS. Setelah itu Anda mengumpulkan data untuk investigasi.',
                        choices: [
                            { text: 'Adakan penyuluhan APD untuk kelompok tani.' }
                        ]
                    },
                    clinic_prep: {
                        text: 'Pasien tiba dalam 15 menit. Anda sudah siap dengan antidotum dan berhasil menstabilkan keduanya sebelum dirujuk.'
                    },
                    resolution_apd: {
                        text: 'Penyuluhan APD dihadiri 25 petani. Anda membagikan masker dan sarung tangan dari dana BOK. Kelompok tani berjanji mematuhi aturan keselamatan.'
                    }
                },
                asap_pembakaran: {
                    discovery: {
                        speaker: 'Perawat',
                        text: 'Dok, 3 hari terakhir pasien ISPA naik 3 kali lipat. Semuanya sesak napas dan batuk. Sepertinya dari asap pembakaran lahan di kecamatan sebelah.',
                        choices: [
                            { text: 'Distribusikan masker N95 ke warga rentan.' },
                            { text: 'Laporkan ke pemerintah daerah untuk tindakan hukum.' },
                            { text: 'Kedua langkah sekaligus.' }
                        ]
                    },
                    mask_distribution: {
                        text: 'Masker didistribusikan ke lansia, balita, dan ibu hamil. Puskesmas menyiapkan area khusus untuk pasien ISPA berat.'
                    },
                    report_gov: {
                        text: 'Laporan diterima Pemda. Tim lingkungan hidup turun ke lokasi. Pembakaran dihentikan tiga hari kemudian, tetapi asap masih berlangsung seminggu.'
                    },
                    both_action: {
                        text: 'Respons cepat dan komprehensif. Warga terlindungi dan pembakaran dihentikan. Kepala dinas memuji inisiatif puskesmas.'
                    }
                },
                gigitan_ular: {
                    discovery: {
                        speaker: 'Warga',
                        text: 'Dokter! Pak Amin digigit ular di sawah. Kakinya bengkak, dia mengeluh pusing. Warga mau menyedot racunnya, gimana Dok?',
                        choices: [
                            { text: 'Jangan disedot. Imobilisasi, segera bawa ke sini.' },
                            { text: 'Segera ke lokasi dengan antivenom dan kit darurat.' }
                        ]
                    },
                    correct_first_aid: {
                        text: 'Warga membawa Pak Amin dengan kaki yang sudah diimobilisasi. Di puskesmas, Anda memberi cairan, antihistamin, dan menstabilkan pasien sebelum rujuk ke RS untuk antivenom.'
                    },
                    field_response: {
                        text: 'Di sawah, Anda memastikan kaki diimobilisasi, memasang IV line, dan merujuk langsung dari lokasi. Respons cepat menyelamatkan nyawa Pak Amin.'
                    }
                },
                leptospirosis_banjir: {
                    discovery: {
                        speaker: 'Perawat',
                        text: 'Dok, setelah banjir minggu lalu, 4 pasien datang dengan demam tinggi, nyeri otot betis luar biasa, dan mata kuning. Mereka semua kena banjir 5-7 hari lalu.',
                        choices: [
                            { text: 'Curigai leptospirosis, tangani dan lapor Dinkes (W2).' },
                            { text: 'Investigasi epidemiologi: cek area genangan.' }
                        ]
                    },
                    treat_report: {
                        text: 'Pasien diterapi doksisiklin. Laporan W2 dikirim ke Dinkes. Tim surveilans menindaklanjuti dalam dua hari.'
                    },
                    epi_investigation: {
                        text: 'Anda menemukan area genangan dengan banyak tikus di dekat gudang beras. Anda berkoordinasi dengan tim kesling untuk disinfeksi area dan pemasangan perangkap tikus.'
                    }
                }
            },
            nutrition: {
                stunting_deteksi: {
                    discovery: {
                        speaker: 'Kader Posyandu',
                        text: 'Dok, hasil penimbangan bulan ini: 3 balita di bawah garis merah KMS. 2 di antaranya baru masuk zona kuning 2 bulan lalu, sekarang sudah merah.',
                        choices: [
                            { text: 'Kunjungi rumah ketiga balita, asesmen gizi lengkap.' },
                            { text: 'Mulai program PMT (Pemberian Makanan Tambahan).' },
                            { text: 'Keduanya: asesmen dan PMT langsung.' }
                        ]
                    },
                    home_assessment: {
                        description: 'Kunjungi rumah tiga balita yang berisiko stunting.'
                    },
                    pmt_program: {
                        text: 'PMT berupa telur, susu, dan kacang hijau dibagikan selama sebulan. Dua dari tiga balita menunjukkan kenaikan berat badan pada penimbangan berikutnya.'
                    },
                    comprehensive: {
                        text: 'Asesmen menemukan pola makan tidak beragam dan higienitas rendah. PMT dimulai bersamaan dengan edukasi gizi untuk ibu. Ketiga balita membaik dalam dua bulan.'
                    },
                    resolution_home: {
                        text: 'Temuan: satu keluarga miskin hanya makan nasi dan kerupuk, satu ibu muda belum tahu MP-ASI yang benar, dan satu balita cacingan. Intervensi spesifik dimulai.'
                    }
                },
                gizi_buruk_balita: {
                    discovery: {
                        speaker: 'Kader Desa',
                        text: 'Dok, saya baru kunjungi keluarga Pak Tarno di ujung desa. Anaknya Dede (2 tahun) perutnya buncit, kakinya bengkak, rambut kemerahan. Ibunya bilang cuma makan nasi sama garam.',
                        choices: [
                            { text: 'Darurat! Bawa Dede ke puskesmas sekarang.' },
                            { text: 'Kunjungi ke rumah dulu, asesmen keluarga.' }
                        ]
                    },
                    emergency_care: {
                        text: 'Dede dibawa ke puskesmas. BB/U di bawah -3 SD, sesuai gizi buruk. Anda memulai protokol F-75, PMT terapeutik, dan menyiapkan rujukan ke Therapeutic Feeding Center di RS.',
                        choices: [
                            { text: 'Rujuk ke RS dan koordinasikan bantuan PKH untuk keluarga.' }
                        ]
                    },
                    home_first: {
                        text: 'Di rumah, ditemukan kemiskinan ekstrem. Ayah sakit TB, ibu bekerja serabutan, dan Dede hanya makan nasi serta garam. Anda mendokumentasikan situasi dan membawa Dede ke puskesmas.'
                    },
                    resolution_referral: {
                        text: 'Dede dirujuk dan mendapat terapi gizi intensif. Koordinasi dengan Dinas Sosial berhasil mengaktifkan PKH untuk keluarga Pak Tarno. Dede pulih dalam tiga bulan.'
                    }
                },
                anemia_remaja: {
                    discovery: {
                        speaker: 'Nutrisionis',
                        text: 'Dok, hasil screening Hb di SMPN 2: dari 80 siswi, 32 siswi Hb di bawah 12. Tertinggi 8.2 g/dL. Mereka sering pusing dan lemas tapi anggap biasa.',
                        choices: [
                            { text: 'Mulai program tablet Fe mingguan dan edukasi gizi.' },
                            { text: 'Edukasi guru dan orang tua tentang bahaya anemia.' }
                        ]
                    },
                    fe_program: {
                        description: 'Distribusikan tablet Fe dan lakukan edukasi.'
                    },
                    parent_teacher: {
                        text: 'Pertemuan dihadiri 50 orang tua. Mereka terkejut mengetahui kondisi anak-anaknya. Banyak yang berjanji memperbaiki menu makanan di rumah.'
                    },
                    resolution_fe: {
                        text: 'Setelah tiga bulan tablet Fe dan edukasi gizi, rata-rata Hb naik 1.5 g/dL. Siswi melaporkan lebih bertenaga dan konsentrasi meningkat.'
                    }
                },
                mpasi_salah: {
                    discovery: {
                        speaker: 'Bidan',
                        text: 'Dok, Bu Dina (19 tahun, anak pertama) bawa bayinya (3 bulan) karena diare. Ternyata sudah dikasih pisang kerok sama neneknya sejak umur 2 bulan. Katanya biar kenyang.',
                        choices: [
                            { text: 'Edukasi Bu Dina dan neneknya tentang ASI eksklusif.' },
                            { text: 'Tangani diare dulu, edukasi saat kontrol ulang.' }
                        ]
                    },
                    educate_both: {
                        text: 'Anda menjelaskan bahwa usus bayi tiga bulan belum siap mencerna makanan padat. Analogi sederhana membuat nenek memahami. Bayi kembali ASI eksklusif.'
                    },
                    treat_then_educate: {
                        text: 'Diare ditangani dengan oralit dan zinc. Saat kontrol ulang, Anda mendapati bayi masih diberi pisang kerok. Perlu pendekatan lebih intensif.',
                        choices: [
                            { text: 'Libatkan kader untuk home visit rutin.' }
                        ]
                    },
                    resolution_kader: {
                        text: 'Kader rutin mengunjungi Bu Dina seminggu sekali. Perlahan nenek mulai percaya. Setelah sebulan, bayi sepenuhnya kembali ASI eksklusif.'
                    }
                }
            },
            mental_health: {
                depresi_pascabencana: {
                    discovery: {
                        speaker: 'Kader Desa',
                        text: 'Dok, sejak longsor bulan lalu, Pak Asep jadi pendiam banget. Tidak mau keluar rumah, tidak mau kerja di sawah. Istrinya bilang sering menangis malam-malam. Ada 3 warga lain juga begitu.',
                        choices: [
                            { text: 'Kunjungi rumah Pak Asep, lakukan skrining kesehatan jiwa.' },
                            { text: 'Adakan sesi konseling kelompok untuk korban longsor.' },
                            { text: 'Rujuk ke psikolog atau psikiater di RS kabupaten.' }
                        ]
                    },
                    home_screening: {
                        text: 'Anda menggunakan SRQ-20. Pak Asep mendapat skor 14 dari 20, mengarah ke masalah kesehatan jiwa. Ia tidak bisa tidur dan hujan mengingatkannya pada suara longsor. Anda mengenali gejala PTSD.',
                        choices: [
                            { text: 'Berikan Psychological First Aid dan jadwalkan follow-up.' },
                            { text: 'Rujuk ke poli jiwa RS sambil dampingi dengan konseling ringan.' }
                        ]
                    },
                    group_counseling: {
                        text: 'Sesi kelompok dihadiri delapan warga korban longsor. Mereka saling bercerita dan menangis bersama. Pak Asep merasa tidak sendirian. Proses pemulihan dimulai.'
                    },
                    referral: {
                        text: 'Pak Asep menolak dirujuk karena mengira itu berarti ia gila. Stigma kesehatan jiwa menghambat penanganan.',
                        choices: [
                            { text: 'Jelaskan bahwa depresi bukan gila, melainkan penyakit yang bisa diobati.' }
                        ]
                    },
                    resolution_pfa: {
                        text: 'Dengan Psychological First Aid dan kunjungan rutin tiap minggu, Pak Asep perlahan membaik. Setelah dua bulan, ia mulai kembali ke sawah dan merasa didengarkan.'
                    },
                    resolution_rujuk: {
                        text: 'Psikiater meresepkan sertraline dosis rendah. Dengan kombinasi obat dan konseling di puskesmas, Pak Asep berangsur membaik dalam enam minggu.'
                    },
                    resolution_destigma: {
                        text: 'Anda membandingkan sakit jiwa dengan kaki patah: keduanya pantas mendapat pertolongan medis. Perlahan, Pak Asep bersedia dibawa ke RS. Pengobatan dimulai.'
                    }
                },
                psikotik_akut: {
                    discovery: {
                        speaker: 'Perawat',
                        text: 'Dok! Di pasar ada pemuda namanya Roni, 22 tahun, tiba-tiba mengamuk. Dia teriak ada yang mau membunuhnya dan melempar barang. Warga takut, ada yang mau ikat pakai tali.',
                        choices: [
                            { text: 'Segera ke lokasi, tenangkan dengan pendekatan empatis.' },
                            { text: 'Jangan diikat. Minta warga beri ruang, saya ke sana dengan haloperidol.' },
                            { text: 'Hubungi RSJ atau RSUD untuk tim krisis.' }
                        ]
                    },
                    calm_approach: {
                        text: 'Anda mendekati Roni pelan-pelan dan memperkenalkan diri sebagai dokter yang ingin membantu. Perlahan Roni berhenti berteriak, tetapi masih ketakutan dan merasa ada yang ingin membunuhnya.',
                        choices: [
                            { text: 'Validasi perasaannya dan ajak ke puskesmas perlahan.' }
                        ]
                    },
                    medical_approach: {
                        text: 'Warga memberi ruang. Setelah mendapat persetujuan keluarga, Anda memberikan haloperidol 5 mg IM. Roni tenang dalam 30 menit dan dibawa ke puskesmas.',
                        choices: [
                            { text: 'Edukasi keluarga tentang skizofrenia dan pentingnya kepatuhan obat.' }
                        ]
                    },
                    crisis_team: {
                        text: 'Tim krisis RSJ datang dalam dua jam. Selama menunggu, warga mengikat Roni di tiang. Anda meminta mereka membuka ikatan karena ia sakit, bukan penjahat.'
                    },
                    resolution_empathic: {
                        text: 'Roni mau ke puskesmas. Keluarga datang dan menjelaskan bahwa ia sudah putus obat tiga bulan karena mengantuk. Anda edukasi soal kepatuhan, menyesuaikan dosis, dan merujuk dengan pendampingan keluarga.'
                    },
                    resolution_family_edu: {
                        text: 'Keluarga Roni terkejut bahwa ini bukan kesurupan. Anda menjelaskan bahwa skizofrenia adalah penyakit otak yang bisa dikontrol dengan obat. Keluarga berjanji mendampingi pengobatan rutin.'
                    }
                },
                bunuh_diri_remaja: {
                    discovery: {
                        speaker: 'Ibu Pasien',
                        text: 'Dok! Anak saya Dini (16 tahun) minum racun serangga. Dia muntah-muntah, perutnya sakit. Saya menemukan pesan di HP-nya, dia dihina teman-temannya.',
                        choices: [
                            { text: 'Segera tangani keracunan: bilas lambung dan atropin sesuai indikasi.' },
                            { text: 'Stabilisasi awal, langsung rujuk ke IGD RS.' }
                        ]
                    },
                    emergency_treatment: {
                        text: 'Anda melakukan dekontaminasi dan memberikan antidotum sesuai indikasi. Dini stabil. Setelah kondisi fisiknya aman, Anda duduk bersamanya dan mengajak ia bercerita.',
                        choices: [
                            { text: 'Lakukan asesmen risiko bunuh diri dan safety planning.' }
                        ]
                    },
                    immediate_referral: {
                        text: 'Dini dirujuk ke IGD RS. Dokter RS menangani keracunan. Anda menemani keluarga dan menghubungi psikiater anak.'
                    },
                    risk_assessment: {
                        text: 'Dini menangis karena teman-temannya mengunggah foto memalukan dan semua orang menertawakan. Anda menggunakan C-SSRS dan menilai risiko bunuh diri tinggi, sehingga perlu rawat inap.',
                        choices: [
                            { text: 'Rujuk ke RS dengan pendampingan psikiatri dan edukasi orang tua.' },
                            { text: 'Buat safety plan dan libatkan guru BK serta konselor sekolah.' }
                        ]
                    },
                    resolution_comprehensive: {
                        text: 'Dini dirawat lima hari di RS. Psikiater mendiagnosis episode depresif berat. Setelah pulang, Anda berkoordinasi dengan sekolah untuk mencegah bullying. Keluarga menjadi lebih perhatian.'
                    },
                    resolution_school: {
                        text: 'Safety plan dibuat bersama Dini dan orang tua. Guru BK menangani pelaku bullying. Dini pelan-pelan kembali sekolah dengan pendampingan, dan Anda menjadwalkan follow-up mingguan.'
                    }
                }
            },
            adolescent: {
                anemia_remaja: {
                    discovery: {
                        speaker: 'Bidan',
                        text: 'Dok, hasil skrining Hb di SMP Sukamaju mengejutkan: 40% siswi kelas 7-9 anemia (Hb <12 g/dL). Banyak yang pucat, lesu, sulit konsentrasi. Paling parah Ani, Hb cuma 7.2.',
                        choices: [
                            { text: 'Distribusikan tablet Fe dan edukasi gizi kaya zat besi.' },
                            { text: 'Gelar sesi Youth-Friendly Health Services (YFHS).' },
                            { text: 'Investigasi penyebab: wawancara kelompok soal pola makan.' }
                        ]
                    },
                    iron_supplement: {
                        text: 'Tablet Fe dibagikan seminggu sekali sesuai program pemerintah. Beberapa siswi menolak karena takut mual atau gemuk. Edukasi tambahan diperlukan.',
                        choices: [
                            { text: 'Jelaskan cara minum Fe yang benar dan luruskan mitos diet.' }
                        ]
                    },
                    yfhs_session: {
                        text: 'Sesi YFHS digelar di ruang UKS. Suasana dibuat santai, dan remaja bebas bertanya tanpa dihakimi. Topik mencakup menstruasi, gizi, anemia, dan body image. Antusiasme tinggi.',
                        choices: [
                            { text: 'Bentuk Konselor Sebaya dari siswi pilihan.' }
                        ]
                    },
                    investigate_diet: {
                        text: 'Wawancara kelompok mengungkap banyak siswi melewatkan sarapan dan hanya makan mie instan karena tren diet menyesatkan dari media sosial.',
                        choices: [
                            { text: 'Buat konten edukasi menarik: diet sehat versus diet berbahaya.' }
                        ]
                    },
                    resolution_edu: {
                        text: 'Tips praktis berhasil: minum Fe setelah makan malam dengan air jeruk agar tidak mual. Kepatuhan naik dari 30 persen menjadi 75 persen. Setelah tiga bulan, rata-rata Hb naik 1.8 g/dL.'
                    },
                    resolution_peer: {
                        text: 'Lima siswi menjadi Konselor Sebaya dan dilatih tentang gizi remaja serta kesehatan reproduksi. Program berkelanjutan, dan anemia turun dari 40 persen menjadi 15 persen dalam enam bulan.'
                    },
                    resolution_content: {
                        text: 'Infografis "Diet Sehat vs Diet Berbahaya" menyebar di grup chat siswi. Mereka mulai sarapan dan memilih makanan kaya zat besi.'
                    }
                },
                teen_pregnancy: {
                    discovery: {
                        speaker: 'Bidan',
                        text: 'Dok, saya terima rujukan dari Posyandu. Rina (15 tahun, siswi SMP) hamil 20 minggu. Dia menyembunyikan karena takut. Orang tua baru tahu dan marah besar. Ayahnya mau menikahkan paksa.',
                        choices: [
                            { text: 'Prioritas: ANC segera dan konseling keluarga.' },
                            { text: 'Libatkan perlindungan anak - ini di bawah umur.' },
                            { text: 'Pendekatan berbasis keluarga, hormati budaya lokal.' }
                        ]
                    },
                    anc_counseling: {
                        text: 'Anda melakukan ANC pertama. Berat badan Rina rendah dan Hb 9.5, dengan risiko tinggi karena usia muda. Rina menangis ingin tetap sekolah, sementara ayahnya bersikeras menikahkan.',
                        choices: [
                            { text: 'Jelaskan risiko medis kehamilan remaja dan pernikahan anak.' }
                        ]
                    },
                    child_protection: {
                        text: 'Anda menghubungi unit perlindungan perempuan dan anak. Tim datang dan memediasi keluarga. Pernikahan ditunda, dan Rina mendapat pendampingan psikologis.'
                    },
                    cultural_approach: {
                        text: 'Dengan pendekatan kultural, Anda mengajak tokoh agama bicara bersama keluarga. Ia membantu mediasi dan menjelaskan bahwa menikah perlu kesiapan, bukan paksaan. Keluarga mulai terbuka pada alternatif.',
                        choices: [
                            { text: 'Usulkan Rina melanjutkan sekolah sambil rutin memeriksakan kehamilan.' }
                        ]
                    },
                    resolution_medical: {
                        text: 'Data yang Anda paparkan menggugah keluarga: ibu di bawah 17 tahun memiliki risiko kematian sekitar dua kali lipat. Ayah Rina setuju menunda nikah. Rina kontrol rutin di Pustu dan mendapat suplementasi Fe.'
                    },
                    resolution_school: {
                        text: 'Dengan dukungan guru dan keluarga, Rina melanjutkan sekolah. ANC rutin di Pustu. Setelah persalinan aman, program kejar paket menjadi opsi.'
                    }
                },
                napza_remaja: {
                    discovery: {
                        speaker: 'Ketua RT',
                        text: 'Dok, tadi malam warga menangkap 4 remaja SMA menghirup lem di pos ronda. Mata merah, bicara ngelantur. Orang tuanya malu. RT mau mengusir mereka.',
                        choices: [
                            { text: 'Jangan dihukum, ini masalah kesehatan - ajak bicara baik-baik.' },
                            { text: 'Periksa kesehatan mereka, laporkan ke BNN atau sekolah.' },
                            { text: 'Adakan penyuluhan bahaya NAPZA untuk seluruh remaja desa.' }
                        ]
                    },
                    empathic_approach: {
                        text: 'Anda mengajak empat remaja bicara satu per satu. Budi, 17 tahun, menangis karena ayahnya bekerja di kota, ibunya sibuk di sawah, dan teman-teman mengajaknya ngelem karena bosan.',
                        choices: [
                            { text: 'Hubungkan dengan kegiatan positif seperti karang taruna dan olahraga.' },
                            { text: 'Berikan konseling motivasi dan ajak menjadi kader anti-NAPZA.' }
                        ]
                    },
                    medical_report: {
                        text: 'Pemeriksaan menunjukkan iritasi mukosa hidung dan gangguan kognitif ringan pada dua remaja. Koordinasi BNN lambat. Sekolah merespons dengan skorsing, yang justru memperburuk situasi.'
                    },
                    community_education: {
                        text: 'Penyuluhan dihadiri 30 remaja dan orang tua. Anda menunjukkan gambar kerusakan otak akibat inhalansia. Efek kejut cukup kuat, tetapi perlu follow-up agar berkelanjutan.',
                        choices: [
                            { text: 'Bentuk Tim Remaja Bersih sebagai program berkelanjutan.' }
                        ]
                    },
                    resolution_positive: {
                        text: 'Budi dan teman-temannya mulai rutin ikut karang taruna dan latihan sepak bola sore. Tiga bulan kemudian, tidak ada laporan penyalahgunaan baru.'
                    },
                    resolution_peer_kader: {
                        text: 'Budi menjadi kader anti-NAPZA paling vokal di sekolahnya. Pengalaman pribadi menjadi bekal edukasi paling kuat.'
                    },
                    resolution_program: {
                        text: 'Tim Remaja Bersih aktif setiap minggu. Mereka membuat konten media sosial anti-NAPZA yang populer sampai desa tetangga. Program diadopsi oleh kecamatan.'
                    }
                }
            },
            food_safety: {
                makan_sembarangan: {
                    discovery: {
                        speaker: 'Perawat',
                        text: 'Dok! Pagi ini sudah 12 orang datang dengan gejala sama: muntah, diare, kram perut. Semuanya habis makan di hajatan Bu Haji kemarin malam. Ada yang sampai dehidrasi berat.',
                        choices: [
                            { text: 'Ini KLB! Aktifkan W1-W2, tangani dehidrasi, investigasi makanan.' },
                            { text: 'Tangani pasien dulu, laporkan setelah semua stabil.' }
                        ]
                    },
                    investigation: {
                        text: 'Investigasi menunjukkan menu nasi box dengan ayam goreng, sambal, dan es teh. Ayam dimasak pagi, lalu disimpan 12 jam tanpa pendingin pada suhu 32 C. Sampel lab positif Staphylococcus aureus.',
                        choices: [
                            { text: 'Edukasi katering soal keamanan pangan dan laporkan ke Dinkes.' }
                        ]
                    },
                    treat_first: {
                        text: 'Semua pasien ditangani dengan rehidrasi oral atau IV. Dua lansia perlu rawat inap. Satu bayi delapan bulan ikut terkena dan kondisinya kritis.',
                        choices: [
                            { text: 'Rujuk bayi segera dan investigasi sumbernya.' }
                        ]
                    },
                    resolution_edu: {
                        text: 'Laporan W1 dikirim dalam 24 jam. Tim katering ditegur dan dibina. Anda mengadakan pelatihan keamanan pangan untuk sepuluh katering desa: masak-sajikan maksimal empat jam, atau simpan makanan di bawah 5 C.'
                    },
                    resolution_rujuk_bayi: {
                        text: 'Bayi berhasil dirujuk tepat waktu. Setelah tiga hari di RS, kondisinya membaik. KLB dilaporkan: total 30 korban, nol meninggal. Dinkes turun untuk pembinaan keamanan pangan.'
                    }
                },
                formalin_tahu: {
                    discovery: {
                        speaker: 'Sanitarian',
                        text: 'Dok, hasil tes kit di pasar: tahu dari Pak Soleh positif formalin. Warnanya ungu pekat. Pedagang kaget karena membeli dari pabrik di kota dan tidak tahu ada formalinnya.',
                        choices: [
                            { text: 'Tarik dari peredaran, edukasi pedagang, laporkan ke BPOM.' },
                            { text: 'Telusuri rantai pasok: dari mana tahu ini diproduksi?' }
                        ]
                    },
                    withdrawal: {
                        text: 'Tahu ditarik dari peredaran, dan warga diedukasi tentang tanda bahaya: tahu berformalin keras, tidak mudah hancur, dan tahan berhari-hari. Pedagang diminta mengganti pemasok. Laporan dikirim ke BPOM.'
                    },
                    trace_supply: {
                        text: 'Investigasi menunjukkan tahu berasal dari pabrik rumahan di kota kecamatan. Mereka menambahkan formalin agar tahu tahan lima hari tanpa pendingin. BPOM dan polisi turun tangan, lalu pabrik disegel.'
                    }
                },
                jajan_anak_sekolah: {
                    discovery: {
                        speaker: 'Guru UKS',
                        text: 'Dok, banyak anak sering sakit perut setelah jajan di depan sekolah. Saya curiga jajanannya tidak sehat. Es sirop warnanya merah menyala, kerupuknya mencolok sekali.',
                        choices: [
                            { text: 'Bawa test kit ke sekolah, tes jajanan di depan anak-anak.' },
                            { text: 'Gelar program Kantin Sehat di sekolah.' }
                        ]
                    },
                    live_testing: {
                        text: 'Di depan 200 murid, Anda mengetes jajanan: es sirop positif rhodamin B, dan kerupuk positif metanil yellow. Anak-anak terkejut. Efek edukasinya sangat kuat.',
                        choices: [
                            { text: 'Bina pedagang dan buat daftar jajanan aman.' }
                        ]
                    },
                    healthy_canteen: {
                        text: 'Kantin sehat digelar dengan menu bergizi: nasi kuning, telur rebus, dan buah potong. Harga tetap terjangkau Rp 5.000. Anak-anak antusias.'
                    },
                    resolution_vendor: {
                        text: 'Pedagang dibina, dan pedagang kooperatif mendapat stiker "Jajanan Aman Puskesmas Verified." Penjualan mereka naik 40 persen. Sistem reward berhasil.'
                    }
                }
            },
            traditional_health: {
                jamu_berbahaya: {
                    discovery: {
                        speaker: 'Kader',
                        text: 'Dok, Mbah Siti (70 tahun) masuk puskesmas dengan muka bengkak, gula darah 450, dan tekanan darah 190/110. Dia sudah minum jamu pegal linu dari tukang keliling selama 6 bulan karena badannya terasa enteng.',
                        choices: [
                            { text: 'Curiga steroid. Periksa tanda cushingoid dan stabilkan.' },
                            { text: 'Sita sampel jamu, kirim ke BPOM untuk analisis.' }
                        ]
                    },
                    examine: {
                        text: 'Tanda cushingoid jelas: moon face, buffalo hump, dan striae. Gula darah tidak terkontrol karena efek steroid. Mbah Siti perlu tapering dexamethasone perlahan untuk mencegah withdrawal syndrome.',
                        choices: [
                            { text: 'Rawat, taper steroid, dan edukasi bahaya jamu oplosan.' }
                        ]
                    },
                    lab_test: {
                        text: 'Hasil lab BPOM menunjukkan jamu mengandung dexamethasone 0.5 mg, piroksikam 10 mg, dan CTM. Tukang jamu keliling membeli langsung dari "supplier serbuk putih" tanpa label.',
                        choices: [
                            { text: 'Laporkan ke polisi dan BPOM, lalu edukasi warga.' }
                        ]
                    },
                    resolution_medical: {
                        text: 'Mbah Siti dirawat satu minggu. Steroid di-taper pelan-pelan. Setelah dua bulan, gula darahnya membaik. Ia kapok membeli jamu sembarangan lagi.'
                    },
                    resolution_enforcement: {
                        text: 'Polisi menangkap supplier serbuk steroid. Tiga tukang jamu keliling yang menjual jamu oplosan dibina. Anda mengadakan penyuluhan: jamu aman punya izin BPOM dan tidak memakai klaim berlebihan.'
                    }
                },
                dukun_beranak: {
                    discovery: {
                        speaker: 'Bidan',
                        text: 'Dok! Bu Sari (G3P2) melahirkan di dukun tadi malam. Sekarang perdarahan hebat, sudah ganti 5 kain. Dukun bilang cuma darah kotor. Plasenta belum keluar.',
                        choices: [
                            { text: 'Darurat! Pasang infus RL, pergi ke lokasi, siapkan tata laksana plasenta manual.' },
                            { text: 'Minta bawa ke puskesmas atau RS segera, siapkan uterotonika.' }
                        ]
                    },
                    emergency_response: {
                        text: 'Anda tiba di rumah Bu Sari. Plasenta retensio. Dengan teknik manual plasenta, plasenta berhasil dikeluarkan dan perdarahan berkurang. Ia mendapat oksitosin 10 IU IM dan misoprostol.',
                        choices: [
                            { text: 'Stabilkan, rujuk untuk observasi, dan edukasi keluarga soal persalinan aman.' }
                        ]
                    },
                    refer_immediate: {
                        text: 'Keluarga terlambat membawa Bu Sari setelah satu jam di jalan. Sampai di RS, Hb sudah 5 g/dL. Ia perlu transfusi darurat dan nyaris tidak tertolong.'
                    },
                    resolution_save: {
                        text: 'Bu Sari selamat. Anda mediasi dengan dukun beranak: dukun boleh mendampingi doa dan pijat, tetapi persalinan harus ditangani bidan. Kemitraan bidan-dukun dimulai.'
                    }
                },
                herbal_interaksi_obat: {
                    discovery: {
                        speaker: 'Perawat',
                        text: 'Dok, Pak Hasan (65 tahun, hipertensi) pingsan di sawah. TD 80/50. Dia minum amlodipine 10 mg pagi ini, lalu rebusan kumis kucing dan bawang putih mentah 5 siung agar cepat turun.',
                        choices: [
                            { text: 'Pasang infus, tinggikan kaki, pantau TD - ini hipotensi iatrogenik.' },
                            { text: 'Stabilkan pasien dan investigasi apakah ada warga lain yang menggandakan herbal dan obat.' }
                        ]
                    },
                    treat_hypotension: {
                        text: 'Pak Hasan membaik setelah 500 ml RL. TD naik ke 110/70. Anda menjelaskan bahwa kumis kucing dan bawang putih sudah menurunkan tekanan darah, lalu amlodipine membuat turunnya berlebihan.',
                        choices: [
                            { text: 'Buat panduan interaksi obat-herbal untuk Prolanis.' }
                        ]
                    },
                    community_screen: {
                        text: 'Skrining di Prolanis menemukan 12 dari 25 peserta DM atau HT juga minum herbal tanpa konsultasi. Tiga orang menggabungkan pare dengan metformin, sehingga risiko hipoglikemia meningkat.',
                        choices: [
                            { text: 'Adakan sesi edukasi interaksi obat-herbal untuk seluruh peserta.' }
                        ]
                    },
                    resolution_guide: {
                        text: 'Anda membuat poster "Boleh Herbal, Tapi Tanya Dulu!" berisi daftar tanaman yang berinteraksi dengan obat. Poster ditempel di TOGA, Prolanis, dan warung. Warga mulai konsultasi sebelum mencampur herbal dan obat.'
                    },
                    resolution_session: {
                        text: 'Sesi interaktif sukses besar. Peserta Prolanis kaget bahwa bawang putih plus obat darah tinggi bisa berbahaya. Mereka sepakat konsultasi dulu sebelum minum herbal.'
                    }
                }
            }
        },
        inspectorDossiers: {
            rtk: {
                eyebrow: 'Maternal Hub',
                title: 'RTK menjadi buffer terakhir sebelum rujukan obstetri berjalan.',
                summary: 'Node ini dipakai untuk mengunci triage, tas siaga, donor darah, dan negosiasi keluarga sebelum ibu risiko tinggi bergerak ke RS.',
                focusPoints: [
                    'Jangan biarkan ibu risiko tinggi pulang lagi ke rumah ketika tanda bahaya sudah muncul.',
                    'Dokumen, JKN, donor darah, dan jalur malam harus beres sebelum kontraksi aktif.',
                    'Gunakan RTK sebagai ruang briefing keluarga agar rujukan tidak telat oleh negosiasi yang berulang.'
                ],
                metrics: [
                    { label: 'Loop', value: 'Triage -> Tas Siaga -> Transport' },
                    { label: 'Tekanan', value: 'SC ulang / preeklampsia / keluarga ragu' },
                    { label: 'Bridge', value: 'Rumah -> RTK -> RS' }
                ],
                caseHint: 'Kasus terkait di bawah cocok untuk menguji delay rujukan maternal dan dilema keputusan keluarga.'
            },
            padepokan_dukun: {
                eyebrow: 'Budaya + Evidence',
                title: 'Padepokan adalah titik mediasi, bukan sekadar sumber masalah.',
                summary: 'Node ini penting ketika keyakinan, pantangan, dan otoritas budaya menentukan apakah warga mau menerima bidan, obat, atau rujukan.',
                focusPoints: [
                    'Baca mitos dan pantangan yang membuat tanda bahaya terlihat normal atau dianggap urusan gaib.',
                    'Pisahkan herbal pendamping yang aman dari racikan yang menunda terapi inti dan rujukan.',
                    'Bangun kemitraan bidan-dukun agar warga tidak mendapat dua pesan yang saling bertolak belakang.'
                ],
                metrics: [
                    { label: 'Loop', value: 'Ritual -> Herbal -> Mediasi' },
                    { label: 'Tekanan', value: 'Mitos / pantangan / delay rujukan' },
                    { label: 'Bridge', value: 'Tradisi -> Bidan / RS' }
                ],
                caseHint: 'Kasus terkait di bawah cocok untuk konflik tradisi vs evidence, terutama saat warga datang lebih dulu ke otoritas budaya.'
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
                subtitle: 'UKS | Skrining dan Edukasi',
                ambience: 'Halaman sekolah ramai dengan suara anak bermain, kelas yang aktif, dan papan pengumuman di dinding.',
                stations: {
                    uks: {
                        label: 'UKS',
                        description: 'Ruang kesehatan sekolah dengan perlengkapan P3K, timbangan, tensimeter, dan tempat tidur periksa.',
                        actions: {
                            screening: { label: 'Skrining Kesehatan Siswa' },
                            check_anemia: { label: 'Skrining Anemia Remaja Putri' },
                            deworm: { label: 'Pemberian Obat Cacing' }
                        },
                        findings: [
                            { text: 'Tiga siswa kelas 3 demam disertai ruam merah sejak dua hari lalu.' },
                            { text: 'Empat puluh persen siswi kelas 5-6 tampak pucat dengan konjungtiva anemis.' },
                            { text: 'Kotak P3K perlu diisi ulang karena kapas sudah habis.' }
                        ]
                    },
                    kelas: {
                        label: 'Kelas dan Toilet',
                        description: 'Ruang belajar dan fasilitas sanitasi yang perlu diperiksa kebersihan dasarnya.',
                        actions: {
                            inspect_toilet: { label: 'Inspeksi Toilet dan Ketersediaan Sabun' },
                            cuci_tangan_demo: { label: 'Demo Enam Langkah Cuci Tangan' },
                            check_ventilation: { label: 'Periksa Ventilasi Kelas' }
                        },
                        findings: [
                            { text: 'Toilet tidak memiliki sabun. Hanya satu dari empat toilet yang menyediakan sabun cuci tangan.' },
                            { text: 'Ventilasi kelas 2A tertutup gorden tebal sehingga ruangan terasa pengap.' },
                            { text: 'Poster enam langkah cuci tangan sudah pudar dan perlu diganti.' }
                        ]
                    },
                    kantin: {
                        label: 'Kantin Sekolah',
                        description: 'Lapak jajanan di area sekolah yang perlu diperiksa keamanan pangannya.',
                        actions: {
                            food_inspect: { label: 'Inspeksi Keamanan Pangan' },
                            check_water: { label: 'Uji Air Minum Sekolah' },
                            healthy_menu: { label: 'Susun Menu Jajanan Sehat' }
                        },
                        findings: [
                            { text: 'Es sirup memakai pewarna tekstil dengan warna yang terlalu mencolok.' },
                            { text: 'Makanan dibiarkan terbuka dan lalat sering hinggap.' },
                            { text: 'Penjaga kantin bersedia ikut pelatihan keamanan pangan.' }
                        ]
                    },
                    lapangan_sekolah: {
                        label: 'Lapangan dan Halaman',
                        description: 'Area bermain anak yang perlu dicek dari genangan, sampah, dan sarang nyamuk.',
                        actions: {
                            jentik_check: { label: 'Survei Jentik pada Genangan' },
                            clean_trash: { label: 'Koordinasi Kerja Bakti' }
                        },
                        findings: [
                            { text: 'Ban bekas di belakang gudang penuh jentik Aedes.' },
                            { text: 'Halaman sekolah bersih karena sudah disapu siswa piket pagi.' }
                        ]
                    }
                },
                npcs: {
                    guru_sri: {
                        name: 'Bu Sri',
                        role: 'Guru dan Pembina UKS',
                        greeting: 'Dokter, syukurlah Anda datang. Ada tiga anak kelas 3 demam dan muncul ruam merah.',
                        dialogs: {
                            auto: {
                                text: 'Dokter, ini mirip campak ya? Saya khawatir menular ke anak lain. Bulan lalu masih ada orang tua yang menolak vaksin MR.',
                                choices: [
                                    { text: 'Saya periksa anak-anaknya dulu.' },
                                    { text: 'Tolong kumpulkan data vaksinasi seluruh siswa.' }
                                ]
                            }
                        }
                    },
                    penjaga_kantin: {
                        name: 'Bu Warung',
                        role: 'Penjaga Kantin',
                        greeting: 'Mau beli apa, Dokter? Es sirupnya segar sekali.',
                        dialogs: {
                            kantin_inspected: {
                                text: 'Dokter, saya pakai pewarna itu karena murah. Kalau harus ganti ke pewarna makanan, biaya saya naik.',
                                choices: [
                                    { text: 'Pewarna tekstil berbahaya. Saya bantu carikan alternatif yang aman.' },
                                    { text: 'Ini harus segera diganti karena membahayakan anak-anak.' }
                                ]
                            }
                        }
                    }
                },
                completionReward: {
                    message: 'Inspeksi sekolah selesai dan laporannya sudah dikirim ke dinas kesehatan.'
                }
            },
            farm: {
                title: 'Lahan Pertanian Warga',
                subtitle: 'Kesehatan Kerja dan Lingkungan | Inspeksi Lapangan',
                ambience: 'Sawah hijau membentang dengan petani bekerja di antara padi dan aroma tanah basah setelah hujan.',
                stations: {
                    sawah: {
                        label: 'Area Persawahan',
                        description: 'Sawah yang tergenang setelah hujan dengan petani yang masih bekerja tanpa APD memadai.',
                        actions: {
                            inspect_apd: { label: 'Cek Penggunaan APD Petani' },
                            water_test: { label: 'Tes Air Sawah' },
                            counsel_boots: { label: 'Edukasi Penggunaan Sepatu Boot' }
                        },
                        findings: [
                            { text: 'Lima dari delapan petani masih bekerja tanpa alas kaki di lumpur.' },
                            { text: 'Air sawah positif leptospira setelah banjir minggu lalu.' },
                            { text: 'Pak Slamet sebenarnya sudah punya sepatu boot, tetapi merasa tidak nyaman memakainya.' }
                        ]
                    },
                    gudang: {
                        label: 'Gudang Pestisida dan Padi',
                        description: 'Gudang campuran tempat pestisida, karung padi, dan kotoran tikus berada di ruang yang sama.',
                        actions: {
                            inspect_storage: { label: 'Inspeksi Penyimpanan Pestisida' },
                            rat_check: { label: 'Cek Tanda Aktivitas Tikus' },
                            organize: { label: 'Bantu Pisahkan Area Penyimpanan' }
                        },
                        findings: [
                            { text: 'Botol pestisida yang terbuka diletakkan tepat di sebelah karung beras.' },
                            { text: 'Kotoran tikus tersebar di seluruh gudang padi dan meningkatkan risiko leptospirosis.' },
                            { text: 'Lubang tikus terlihat di tiga sudut gudang.' }
                        ]
                    },
                    kandang: {
                        label: 'Kandang Ternak',
                        description: 'Kandang ayam dan sapi yang perlu ditinjau dari sisi kebersihan dan risiko zoonosis.',
                        actions: {
                            animal_health: { label: 'Cek Kesehatan Ternak' },
                            inspect_hygiene: { label: 'Inspeksi Kebersihan Kandang' },
                            counsel_zoonosis: { label: 'Edukasi Risiko Penyakit Zoonosis' }
                        },
                        findings: [
                            { text: 'Dua ekor ayam ditemukan mati mendadak pagi ini sehingga menimbulkan kecurigaan flu burung.' },
                            { text: 'Kandang ternak berjarak kurang dari lima meter dari sumur warga.' },
                            { text: 'Sapi milik Pak Joko tampak sehat dan sudah mendapat vaksin antraks.' }
                        ]
                    },
                    tepi_sungai: {
                        label: 'Tepian Sungai',
                        description: 'Warga masih memakai sungai untuk sanitasi, sementara anak-anak bermain di sana tanpa alas kaki setelah banjir.',
                        actions: {
                            water_quality: { label: 'Tes Kualitas Air Sungai' },
                            survey_mck: { label: 'Survei Perilaku Sanitasi di Sungai' },
                            educate_leptospira: { label: 'Edukasi Leptospirosis' }
                        },
                        findings: [
                            { text: 'Anak-anak bermain di air keruh pascabanjir dengan luka terbuka di kaki.' },
                            { text: 'Tiga warga masih buang air besar langsung ke sungai.' },
                            { text: 'Sumber air minum warga di hilir berada pada aliran yang sama dengan area sanitasi sungai.' }
                        ]
                    }
                },
                npcs: {
                    pak_tani: {
                        name: 'Pak Slamet',
                        role: 'Ketua Kelompok Tani',
                        greeting: 'Dokter, tumben ke sawah. Kemarin ada petani yang keracunan pestisida lagi.',
                        dialogs: {
                            auto: {
                                text: 'Dokter, Jajang kemarin menyemprot pestisida hanya dengan baju biasa. Malamnya dia muntah-muntah. Dia bilang dari zaman kakeknya juga begitu.',
                                choices: [
                                    { text: 'Antar saya ke Jajang supaya bisa saya periksa.' },
                                    { text: 'Kumpulkan semua petani. Kita perlu aturan bersama soal APD.' }
                                ]
                            }
                        }
                    },
                    bu_dewi: {
                        name: 'Bu Dewi',
                        role: 'Warga Tepian Sungai',
                        greeting: 'Dokter, anak saya demam tinggi sudah tiga hari dan kakinya luka kena batu sungai.',
                        dialogs: {
                            tepi_sungai_visited: {
                                text: 'Anak saya memang sering main di sungai, apalagi kalau habis hujan arusnya deras. Saya sulit melarang karena semua temannya main di sana juga.',
                                choices: [
                                    { text: 'Demam, luka terbuka, dan paparan air banjir membuat leptospirosis sangat mungkin.' },
                                    { text: 'Mari saya periksa dulu di Pustu.' }
                                ]
                            }
                        }
                    }
                },
                completionReward: {
                    message: 'Inspeksi lapangan selesai dan rekomendasi APD sudah dikirim ke kelompok tani.'
                }
            },
            pustu: {
                title: 'Pustu Dusun Cilengkrang',
                subtitle: 'Pos Layanan Primer Satelit | Layanan Ibu dan Dasar',
                ambience: 'Bangunan satu ruang yang sederhana dengan meja periksa, timbangan bayi, lemari obat kecil, dan ibu-ibu menunggu bersama balitanya.',
                stations: {
                    meja_periksa: {
                        label: 'Meja Periksa ANC',
                        description: 'Pos pemeriksaan antenatal dengan tensimeter, doppler, dan pita LILA.',
                        actions: {
                            anc_checkup: { label: 'Pemeriksaan ANC (K1-K4)' },
                            lila_measure: { label: 'Ukur LILA Ibu Hamil' },
                            risk_scoring: { label: 'Skoring Risiko Kehamilan' }
                        },
                        findings: [
                            { text: 'Bu Yanti (G2P1, 34 minggu) memiliki LILA 21 cm, mengalami KEK, dan belum menjalani kunjungan K3.' },
                            { text: 'Bu Ningsih (28 minggu) memiliki tekanan darah normal, DJJ positif, dan pertumbuhan sesuai usia kehamilan.' }
                        ]
                    },
                    pojok_kb: {
                        label: 'Pojok Konseling KB',
                        description: 'Area konseling dengan alat bantu, leaflet, dan stok alat kontrasepsi.',
                        actions: {
                            kb_counsel: { label: 'Konseling Metode KB' },
                            kb_service: { label: 'Pelayanan KB (Suntik atau Pil)' },
                            kb_stock: { label: 'Periksa Stok Kontrasepsi' }
                        },
                        findings: [
                            { text: 'Sisa stok suntik KB tiga bulanan tinggal lima ampul dan perlu permintaan baru ke farmasi.' },
                            { text: 'Cakupan akseptor KB aktif di dusun baru mencapai 68 persen dari target 75 persen.' }
                        ]
                    },
                    lemari_obat: {
                        label: 'Lemari Obat dan P3K',
                        description: 'Penyimpanan obat dasar seperti parasetamol, amoksisilin, oralit, dan vitamin.',
                        actions: {
                            stock_check: { label: 'Inventarisasi Obat' },
                            expiry_check: { label: 'Cek Obat Kedaluwarsa' }
                        },
                        findings: [
                            { text: 'Sirup amoksisilin sudah kedaluwarsa dua bulan tetapi masih ada di rak.' },
                            { text: 'Stok oralit dan zinc cukup untuk tiga bulan ke depan.' }
                        ]
                    },
                    ruang_tunggu: {
                        label: 'Ruang Tunggu dan Edukasi',
                        description: 'Area tunggu pasien dengan poster kesehatan ibu, tetapi televisi edukasi sudah tidak berfungsi.',
                        actions: {
                            health_edu: { label: 'Penyuluhan Tanda Bahaya Kehamilan' },
                            update_poster: { label: 'Perbarui Poster KIA' }
                        },
                        findings: [
                            { text: 'Poster perencanaan persalinan dan pencegahan komplikasi sudah pudar.' },
                            { text: 'Para ibu antusias bertanya tentang tanda bahaya kehamilan.' }
                        ]
                    }
                },
                npcs: {
                    bidan_ema: {
                        name: 'Bidan Ema',
                        role: 'Bidan Desa',
                        greeting: 'Selamat pagi, Dokter. Hari ini ada delapan ibu hamil dan lima akseptor KB. Bu Yanti perlu perhatian khusus.',
                        dialogs: {
                            auto: {
                                text: 'Dokter, Bu Yanti sudah 34 minggu tetapi belum pernah menjalani K3. LILA-nya hanya 21 cm. Saya khawatir KEK dan risiko BBLR.',
                                choices: [
                                    { text: 'Mari kita periksa sekarang dan hitung skor risikonya.' },
                                    { text: 'Catat untuk kunjungan rumah besok.' }
                                ]
                            },
                            lemari_obat_done: {
                                text: 'Dokter, saya baru sadar ada sirup amoksisilin yang sudah kedaluwarsa. Maaf, saya kurang rutin mengecek tanggal kedaluwarsa.',
                                choices: [
                                    { text: 'Tidak apa. Mari kita buat SOP cek bulanan bersama.' },
                                    { text: 'Pisahkan sekarang juga agar tidak sampai terdistribusi.' }
                                ]
                            }
                        }
                    }
                },
                completionReward: {
                    message: 'Supervisi Pustu selesai dan temuan sudah dilaporkan ke puskesmas induk.'
                }
            },
            kb_post: {
                title: 'Pos KB Sukamaju',
                subtitle: 'Layanan Keluarga Berencana dan Kesehatan Reproduksi',
                ambience: 'Ruang kecil yang rapi di rumah kader dengan poster KB dan alat peraga kontrasepsi tersusun baik.',
                stations: {
                    konseling: {
                        label: 'Meja Konseling',
                        description: 'Area konseling privat untuk membahas seluruh pilihan metode KB dengan alat bantu visual.',
                        actions: {
                            counsel_method: { label: 'Konseling Metode KB' },
                            couple_counsel: { label: 'Konseling Pasangan' },
                            side_effect: { label: 'Konseling Efek Samping' }
                        },
                        findings: [
                            { text: 'Bu Tuti ingin IUD tetapi suaminya melarang sehingga perlu konseling pasangan.' },
                            { text: 'Remaja putri masih malu bertanya tentang menstruasi dan kesehatan reproduksi.' }
                        ]
                    },
                    pelayanan: {
                        label: 'Area Pelayanan KB',
                        description: 'Layanan suntik, pil, kondom, dan rujukan implant atau IUD dilakukan di area ini.',
                        actions: {
                            inject_kb: { label: 'Pelayanan KB Suntik' },
                            distribute_pill: { label: 'Distribusi Pil KB' },
                            implant_referral: { label: 'Rujukan Pemasangan Implant atau IUD' }
                        },
                        findings: [
                            { text: 'Metode suntik tiga bulanan paling banyak dipakai, tetapi angka putus pakainya masih 20 persen.' },
                            { text: 'Stok kondom cukup, tetapi distribusinya masih rendah karena stigma sosial.' }
                        ]
                    },
                    data_kb: {
                        label: 'Register dan Data',
                        description: 'Register kohort, data cakupan, dan rencana pelayanan KB ditinjau di sini.',
                        actions: {
                            update_register: { label: 'Perbarui Register Kohort KB' },
                            analyze_dropout: { label: 'Analisis Putus Pakai KB' },
                            unmet_need: { label: 'Identifikasi Unmet Need' }
                        },
                        findings: [
                            { text: 'Angka unmet need KB di dusun ini mencapai 22 persen, jauh di atas target nasional.' },
                            { text: 'Tujuh pasangan usia subur belum pernah menggunakan metode KB apa pun.' }
                        ]
                    }
                },
                npcs: {
                    kader_wati: {
                        name: 'Kader Wati',
                        role: 'Kader KB',
                        greeting: 'Dokter, syukurlah Anda datang. Akseptor baru bulan ini hanya dua orang padahal target kami sepuluh.',
                        dialogs: {
                            auto: {
                                text: 'Dokter, Bu Tuti sebenarnya ingin IUD, tetapi suaminya menolak keras. Katanya urusan KB itu urusan perempuan saja, padahal anak mereka sudah empat.',
                                choices: [
                                    { text: 'Undang suaminya untuk konseling bersama.' },
                                    { text: 'Kita juga bisa dekati lewat edukasi komunitas.' }
                                ]
                            }
                        }
                    },
                    bu_tuti: {
                        name: 'Bu Tuti',
                        role: 'Calon Akseptor',
                        greeting: 'Dokter, saya lelah hamil terus. Anak saya sudah empat dan yang paling kecil baru delapan bulan.',
                        dialogs: {
                            konseling_done: {
                                text: 'Jadi IUD itu benar-benar aman ya, Dokter? Saya takut sakit dan suami saya khawatir dia akan merasakannya. Bisa dijelaskan juga ke suami saya?',
                                choices: [
                                    { text: 'Tentu, saya jelaskan bahwa pasangan seharusnya tidak merasakan IUD.' },
                                    { text: 'Kalau perlu, kita bahas dulu metode lain yang lebih mudah diterima keluarga.' }
                                ]
                            }
                        }
                    }
                },
                completionReward: {
                    message: 'Layanan Pos KB selesai dan data unmet need sudah dilaporkan ke koordinator lapangan.'
                }
            },
            balai_desa: {
                title: 'Balai Desa Sukamaju',
                subtitle: 'Musyawarah Desa dan Promosi Kesehatan',
                ambience: 'Balai pertemuan terbuka dengan kursi plastik, papan tulis, proyektor tua, dan warga yang mulai berkumpul untuk diskusi.',
                stations: {
                    podium: {
                        label: 'Podium Penyuluhan',
                        description: 'Area presentasi publik untuk penyuluhan kesehatan dengan flip chart dan proyektor.',
                        actions: {
                            phbs_talk: { label: 'Penyuluhan Sepuluh Indikator PHBS' },
                            stunting_talk: { label: 'Sosialisasi Pencegahan Stunting' },
                            hygiene_demo: { label: 'Demo Cuci Tangan dan Sabun' }
                        },
                        findings: [
                            { text: 'Empat puluh warga hadir dan sangat antusias saat materi stunting.' },
                            { text: 'Sebagian peserta mulai mengantuk sehingga materi mungkin terlalu panjang.' }
                        ]
                    },
                    meja_musrenbang: {
                        label: 'Meja Musyawarah',
                        description: 'Forum perencanaan desa tempat prioritas pembangunan kesehatan dibahas bersama.',
                        actions: {
                            propose_budget: { label: 'Usulkan Anggaran Kesehatan Desa' },
                            jamban_proposal: { label: 'Susun Proposal Jamban Komunal' },
                            posyandu_support: { label: 'Minta Dukungan Dana Posyandu' }
                        },
                        findings: [
                            { text: 'Kepala desa setuju mengalokasikan 10 persen dana desa untuk sektor kesehatan.' },
                            { text: 'RT 03 dan RT 05 masih belum memiliki jamban komunal dan perlu intervensi segera.' }
                        ]
                    },
                    pojok_data: {
                        label: 'Pojok Data Desa',
                        description: 'Papan profil kesehatan desa yang menampilkan peta penyakit, tren IKS, dan indikator penting lainnya.',
                        actions: {
                            update_profile: { label: 'Perbarui Profil Kesehatan Desa' },
                            present_data: { label: 'Presentasikan Data ke Perangkat Desa' },
                            map_disease: { label: 'Pemetaan Sebaran Penyakit' }
                        },
                        findings: [
                            { text: 'Data IKS belum diperbarui selama tiga bulan sehingga perangkat desa tidak punya gambaran situasi terkini.' },
                            { text: 'Peta menunjukkan klaster diare di RT 05 dekat sungai.' }
                        ]
                    },
                    halaman: {
                        label: 'Halaman dan Area Senam',
                        description: 'Area luar ruangan yang dipakai untuk senam Prolanis, kegiatan lansia, dan skrining komunitas.',
                        actions: {
                            senam_prolanis: { label: 'Pimpin Senam Prolanis' },
                            screening_lansia: { label: 'Skrining Kesehatan Lansia' }
                        },
                        findings: [
                            { text: 'Peserta senam lansia hanya 15 orang dari target 40 orang.' },
                            { text: 'Bu Kartini, usia 72 tahun, memiliki tekanan darah 170 per 100 dan belum minum obat hari ini.' }
                        ]
                    }
                },
                npcs: {
                    pak_lurah: {
                        name: 'Pak Lurah Harto',
                        role: 'Kepala Desa',
                        greeting: 'Dokter, pas sekali. Kami akan memulai musrenbang dan perlu masukan soal prioritas kesehatan desa.',
                        dialogs: {
                            auto: {
                                text: 'Dokter, dana desa tahun ini naik. Saya ingin menambah alokasi kesehatan, tetapi belum yakin mana yang harus diprioritaskan lebih dulu: jamban komunal, dukungan Posyandu, atau air bersih.',
                                choices: [
                                    { text: 'Jamban komunal dulu karena dua RT masih BABS.' },
                                    { text: 'Biar saya presentasikan datanya dulu supaya keputusan berbasis bukti.' }
                                ]
                            }
                        }
                    },
                    kader_umi: {
                        name: 'Kader Umi',
                        role: 'Kader Kesehatan Desa',
                        greeting: 'Dokter, saya ingin melaporkan kegiatan Posyandu dan kunjungan rumah bulan ini.',
                        dialogs: {
                            podium_done: {
                                text: 'Dokter, penyuluhannya bagus, tetapi para ibu meminta sesi yang lebih praktis seperti demo masak bergizi. Bisa dibantu?',
                                choices: [
                                    { text: 'Ide bagus. Kita jadwalkan demo MPASI bulan depan.' },
                                    { text: 'Saya siapkan dulu leaflet resep sederhana.' }
                                ]
                            }
                        }
                    }
                },
                completionReward: {
                    message: 'Musyawarah desa selesai dan prioritas anggaran kesehatan berhasil disepakati.'
                }
            },
            mck: {
                title: 'Blok Sanitasi Umum Dusun Ciburial',
                subtitle: 'Sanitasi Lingkungan | Inspeksi dan Pembinaan STBM',
                ambience: 'Bangunan MCK umum di tepi sungai dengan air yang menggenang, bau kurang sedap, dan tidak ada sabun tersedia.',
                stations: {
                    jamban: {
                        label: 'Jamban',
                        description: 'Area kakus umum yang perlu diperiksa dari sisi struktur, saluran pembuangan, dan sanitasi.',
                        actions: {
                            inspect_latrine: { label: 'Inspeksi Tipe Jamban' },
                            check_drainage: { label: 'Cek Saluran Pembuangan' },
                            educate_stbm: { label: 'Edukasi Stop Buang Air Besar Sembarangan' }
                        },
                        findings: [
                            { text: 'Salah satu jamban masih membuang limbah langsung ke sungai dan tidak memenuhi syarat sanitasi.' },
                            { text: 'Dua dari empat bilik jamban sudah tidak memiliki pintu.' },
                            { text: 'Air limbah rumah tangga menggenang di belakang bangunan MCK.' }
                        ]
                    },
                    tempat_cuci: {
                        label: 'Area Cuci Tangan dan Cuci Baju',
                        description: 'Area ini dipakai untuk CTPS dan mencuci pakaian sehingga ketersediaan sabun dan perilaku aman perlu dinilai.',
                        actions: {
                            ctps_check: { label: 'Cek Fasilitas Cuci Tangan Pakai Sabun' },
                            ctps_demo: { label: 'Demo Cuci Tangan Pakai Sabun' },
                            soap_supply: { label: 'Sediakan Sabun dan Poster' }
                        },
                        findings: [
                            { text: 'Tidak ada sabun sama sekali di area cuci tangan.' },
                            { text: 'Sebagian warga masih mencuci pakaian langsung di sungai tanpa deterjen yang ramah lingkungan.' }
                        ]
                    },
                    sumber_air: {
                        label: 'Sumber Air Bersih',
                        description: 'Sumur atau jaringan air perlu diperiksa dari sisi jarak aman, risiko kontaminasi, dan kualitas pengolahan.',
                        actions: {
                            water_test: { label: 'Tes Kualitas Air' },
                            chlorine_test: { label: 'Tes Sisa Klor' },
                            educate_pam: { label: 'Edukasi Pengolahan Air Minum yang Aman' }
                        },
                        findings: [
                            { text: 'Sumur hanya berjarak delapan meter dari septik tank sehingga berisiko terkontaminasi.' },
                            { text: 'Air PAMSIMAS terlihat jernih dan sisa klornya 0.3 mg per liter, masih dalam batas aman.' }
                        ]
                    },
                    tempat_sampah: {
                        label: 'Area Pengelolaan Sampah',
                        description: 'Titik pembuangan sementara ini perlu penataan pemilahan, pengendalian bau, dan edukasi kompos.',
                        actions: {
                            waste_inspect: { label: 'Inspeksi Pengelolaan Sampah' },
                            compost_educate: { label: 'Edukasi Komposting Organik' },
                            pilah_demo: { label: 'Demo Pemilahan Sampah 3R' }
                        },
                        findings: [
                            { text: 'Sampah organik dan anorganik masih tercampur dan menimbulkan bau menyengat.' },
                            { text: 'Beberapa warga sudah mulai membuat kompos dan bisa dijadikan champion lingkungan.' }
                        ]
                    }
                },
                npcs: {
                    pak_rt: {
                        name: 'Pak Dadang',
                        role: 'Ketua RT 05',
                        greeting: 'Dokter, syukurlah ada yang memeriksa. MCK ini memang bermasalah sejak lama.',
                        dialogs: {
                            auto: {
                                text: 'Dokter, MCK umum ini dibangun dengan bantuan pemerintah lima tahun lalu, tetapi setelah itu nyaris tidak pernah dirawat. Warga cuma bilang yang penting masih ada.',
                                choices: [
                                    { text: 'Mari bentuk kelompok perawat dan buat jadwal kebersihan.' },
                                    { text: 'Kita dorong perbaikan lewat dana desa dan saya bantu dokumentasinya.' }
                                ]
                            }
                        }
                    },
                    sanitarian: {
                        name: 'Pak Rifki',
                        role: 'Sanitarian Puskesmas',
                        greeting: 'Dokter, saya sudah survei awal dan ada masalah serius pada jarak sumur dengan septik tank.',
                        dialogs: {
                            sumber_air_done: {
                                text: 'Dokter, sumur ini terlalu dekat dengan septik tank. Standar minimalnya sepuluh meter, sedangkan ini hanya delapan meter sehingga risiko kontaminasi E. coli tinggi.',
                                choices: [
                                    { text: 'Rekomendasikan pindah sumur atau upgrade ke sistem perpipaan.' },
                                    { text: 'Kita laporkan ke dinas kesehatan untuk tindak lanjut.' }
                                ]
                            }
                        }
                    }
                },
                completionReward: {
                    message: 'Inspeksi MCK selesai dan rekomendasi STBM sudah dikirim ke dinas kesehatan.'
                }
            },
            pos_gizi: {
                title: 'Pos Pemulihan Gizi Sukamaju',
                subtitle: 'Program Pemberian Makanan Tambahan dan Tindak Lanjut Gizi Buruk',
                ambience: 'Ruang kecil yang bersih di dekat Posyandu dengan timbangan, bahan PMT, grafik pertumbuhan, dan ibu-ibu menunggu bersama balita kurus.',
                stations: {
                    timbang_gizi: {
                        label: 'Stasiun Timbang dan KMS',
                        description: 'Pemantauan mingguan untuk balita gizi kurang dan gizi buruk.',
                        actions: {
                            weigh_weekly: { label: 'Timbang Mingguan' },
                            plot_growth: { label: 'Plot Grafik Pertumbuhan WHO' },
                            lila_check: { label: 'Ukur LILA Balita untuk Wasting' }
                        },
                        findings: [
                            { text: 'Dede (18 bulan) memiliki z-score BB/U -3.2 dan LILA 11 cm sehingga sudah memenuhi kriteria gizi buruk.' },
                            { text: 'Santi (24 bulan) naik 200 gram dibanding minggu lalu dan menunjukkan tren yang baik.' }
                        ]
                    },
                    dapur_pmt: {
                        label: 'Dapur PMT',
                        description: 'Area demo memasak PMT berbahan lokal seperti telur, tempe, dan sayuran hijau.',
                        actions: {
                            cook_pmt: { label: 'Demo Masak PMT Bahan Lokal' },
                            menu_plan: { label: 'Susun Menu PMT Satu Bulan' },
                            feeding_demo: { label: 'Demo Responsive Feeding' }
                        },
                        findings: [
                            { text: 'Bahan PMT bulan ini tersedia 50 butir telur, 5 kilogram tempe, 3 kilogram bayam, dan 2 kilogram ubi.' },
                            { text: 'Bu Nani mengatakan anaknya tidak mau makan sayur dan hanya mau mi instan sehingga perlu pendekatan responsive feeding.' }
                        ]
                    },
                    konseling_gizi: {
                        label: 'Konseling Gizi Ibu',
                        description: 'Edukasi untuk ibu tentang ASI, MP-ASI, sanitasi, dan akses layanan kesehatan.',
                        actions: {
                            counsel_1000hpk: { label: 'Edukasi 1000 HPK' },
                            food_diary: { label: 'Tinjau Catatan Makan Anak' },
                            taburia_demo: { label: 'Demo Penggunaan Taburia' }
                        },
                        findings: [
                            { text: 'Sebagian besar anak gizi kurang hanya makan nasi dengan kecap dua kali sehari.' },
                            { text: 'Anak dari ibu yang rutin hadir di sesi PMT naik rata-rata 300 gram per bulan.' }
                        ]
                    }
                },
                npcs: {
                    ahli_gizi: {
                        name: 'Pak Gizi Andi',
                        role: 'Tenaga Gizi Puskesmas',
                        greeting: 'Dokter, bulan ini ada delapan balita gizi kurang aktif di pos gizi. Dua di antaranya sudah memenuhi kriteria gizi buruk dan perlu penanganan intensif.',
                        dialogs: {
                            auto: {
                                text: 'Dokter, Dede makin kurus. LILA-nya tinggal 11 cm sehingga sudah masuk wasting berat. Ibunya bilang tidak mampu membeli lauk berprotein. Sebaiknya langsung dirujuk atau PMT intensif dulu di sini?',
                                choices: [
                                    { text: 'Rujuk ke TFC rumah sakit kabupaten.' },
                                    { text: 'Mulai PMT intensif dua minggu dengan pemantauan ketat, lalu rujuk jika tidak ada respons.' }
                                ]
                            }
                        }
                    }
                },
                completionReward: {
                    message: 'Sesi pos gizi selesai dan seluruh delapan balita gizi kurang sudah ditinjau.'
                }
            },
            pos_ukk: {
                title: 'Pos UKK Sukamaju',
                subtitle: 'Upaya Kesehatan Kerja | Skrining dan Pembinaan Pekerja Informal',
                ambience: 'Pos sederhana dekat area pertanian dengan poster APD, kotak P3K, timbangan, dan pekerja informal yang beristirahat sejenak.',
                stations: {
                    skrining_pekerja: {
                        label: 'Skrining Kesehatan Pekerja',
                        description: 'Pekerja informal bisa diperiksa tensi, fungsi paru sederhana, dan masalah kulit kerja di sini.',
                        actions: {
                            health_screening: { label: 'Skrining Tensi dan Gula Darah' },
                            lung_check: { label: 'Tes Fungsi Paru' },
                            skin_check: { label: 'Periksa Dermatitis Kontak' }
                        },
                        findings: [
                            { text: 'Tiga dari sepuluh petani memiliki hipertensi tidak terkontrol karena tidak rutin minum obat.' },
                            { text: 'Pak Ujang, penyemprot pestisida, memiliki peak flow hanya 60 persen dari prediksi dan dicurigai gangguan paru kronik.' },
                            { text: 'Lima buruh tani mengalami dermatitis kontak akibat pupuk kimia.' }
                        ]
                    },
                    pos_apd: {
                        label: 'Pos APD dan Ergonomi',
                        description: 'Distribusi APD dan edukasi ergonomi kerja dilakukan di area ini.',
                        actions: {
                            apd_distribute: { label: 'Distribusi Masker dan Sarung Tangan' },
                            ergonomi_demo: { label: 'Demo Posisi Kerja Ergonomis' },
                            apd_audit: { label: 'Audit Kepatuhan APD' }
                        },
                        findings: [
                            { text: 'Hanya dua dari lima belas petani yang rutin memakai masker saat menyemprot pestisida.' },
                            { text: 'Sepatu boot tersedia, tetapi petani masih mengeluh tidak nyaman.' },
                            { text: 'Ibu-ibu pengemas gabah bekerja terus-menerus dengan posisi membungkuk dan mulai mengeluhkan nyeri pinggang kronis.' }
                        ]
                    },
                    p3k_kerja: {
                        label: 'Kotak P3K dan Kedaruratan',
                        description: 'Pos ini seharusnya menyiapkan pertolongan pertama, cedera kerja, dan respons paparan pestisida.',
                        actions: {
                            p3k_check: { label: 'Inventarisasi Kotak P3K' },
                            first_aid_train: { label: 'Pelatihan P3K untuk Kader UKK' },
                            antidote_stock: { label: 'Cek Stok Atropin dan Arang Aktif' }
                        },
                        findings: [
                            { text: 'Kotak P3K hanya berisi antiseptik dan plester sehingga masih jauh dari lengkap.' },
                            { text: 'Tidak ada stok antidotum pestisida di pos ini.' },
                            { text: 'Kader UKK belum pernah mendapatkan pelatihan P3K.' }
                        ]
                    }
                },
                npcs: {
                    kader_ukk: {
                        name: 'Pak Dede',
                        role: 'Kader UKK',
                        greeting: 'Dokter, senang ada yang datang. Pos ini biasanya sepi karena petani jarang mau diperiksa.',
                        dialogs: {
                            auto: {
                                text: 'Dokter, Pak Ujang sudah batuk-batuk selama tiga bulan. Dia bilang itu batuk petani biasa, padahal dia tiap hari menyemprot pestisida.',
                                choices: [
                                    { text: 'Mari kita skrining langsung dan tes fungsi parunya.' },
                                    { text: 'Catat dulu, besok kita kunjungi dia di sawah.' }
                                ]
                            }
                        }
                    }
                },
                completionReward: {
                    message: 'Pembinaan Pos UKK selesai dan data kesehatan pekerja sudah dilaporkan.'
                }
            },
            pamsimas: {
                title: 'Instalasi PAMSIMAS Sukamaju',
                subtitle: 'Penyediaan Air Minum dan Sanitasi Berbasis Masyarakat',
                ambience: 'Instalasi air dengan bak penampung, pompa, jaringan pipa, suara air mengalir, dan papan tarif warga.',
                stations: {
                    bak_penampung: {
                        label: 'Bak Penampung dan Pompa',
                        description: 'Bak utama 5000 liter dan pompa listrik perlu dicek kondisi fisik dan kapasitas layanannya.',
                        actions: {
                            inspect_tank: { label: 'Inspeksi Bak Penampung' },
                            check_pump: { label: 'Cek Kondisi Pompa' },
                            capacity_calc: { label: 'Bandingkan Kapasitas dengan Kebutuhan' }
                        },
                        findings: [
                            { text: 'Bak penampung retak di bagian bawah dan bocor sekitar 500 liter per hari.' },
                            { text: 'Pompa masih berfungsi, tetapi sudah delapan tahun tidak pernah diservis.' },
                            { text: 'Kapasitas cukup untuk 150 KK dan saat ini baru melayani 120 KK.' }
                        ]
                    },
                    klorinasi: {
                        label: 'Unit Klorinasi dan Filtrasi',
                        description: 'Rangkaian pengolahan air mencakup klorinasi, filter pasir, dan sedimentasi.',
                        actions: {
                            chlorine_check: { label: 'Tes Sisa Klor di Outlet' },
                            filter_inspect: { label: 'Inspeksi Filter Pasir' },
                            dosing_calibrate: { label: 'Kalibrasi Dosis Klorin' }
                        },
                        findings: [
                            { text: 'Sisa klor di titik terjauh hanya 0.1 mg per liter, masih di bawah standar.' },
                            { text: 'Filter pasir belum diganti selama dua tahun dan perlu pembaruan.' },
                            { text: 'Sistem klorinasi tetes masih berfungsi baik.' }
                        ]
                    },
                    distribusi: {
                        label: 'Jaringan Pipa Distribusi',
                        description: 'Pipa PVC menuju rumah warga perlu diperiksa dari sisi kebocoran, korosi, dan cakupan layanan.',
                        actions: {
                            leak_check: { label: 'Deteksi Kebocoran Pipa' },
                            water_quality_tap: { label: 'Tes Air di Kran Warga' },
                            coverage_mapping: { label: 'Pemetaan Cakupan Layanan' }
                        },
                        findings: [
                            { text: 'Lima belas KK di RT 06 belum tersambung dan masih mengandalkan sumur dangkal.' },
                            { text: 'Air di kran Bu Ana tampak keruh karena pipa lama mulai berkarat.' }
                        ]
                    },
                    pengelolaan: {
                        label: 'Kantor Pengelola',
                        description: 'Pengelola sistem menyimpan catatan keuangan, log layanan, dan laporan mutu air di sini.',
                        actions: {
                            financial_review: { label: 'Tinjau Keuangan Pengelola' },
                            quality_report: { label: 'Tinjau Laporan Kualitas Air Bulanan' },
                            community_meeting: { label: 'Pimpin Rapat Pengelola' }
                        },
                        findings: [
                            { text: 'Iuran warga baru tertagih 70 persen dan tunggakan mencapai 2.4 juta rupiah.' },
                            { text: 'Tidak ada laporan mutu air bulanan yang dibuat selama enam bulan terakhir.' }
                        ]
                    }
                },
                npcs: {
                    ketua_bpspams: {
                        name: 'Pak Ahmad',
                        role: 'Ketua Pengelola Sistem',
                        greeting: 'Dokter, bak penampung ini sudah bocor tiga bulan. Kami sudah mengajukan dana perbaikan ke desa, tetapi belum cair.',
                        dialogs: {
                            auto: {
                                text: 'Dokter, masalah terbesarnya bukan hanya teknis. Rumah warga yang belum tersambung banyak berada di daerah lebih tinggi sehingga butuh pompa tambahan dan biaya besar.',
                                choices: [
                                    { text: 'Mari kita siapkan proposal dukungan ke tingkat kabupaten atau sumber pendanaan lain.' },
                                    { text: 'Prioritaskan dulu perbaikan bak bocor, lalu perluas pipa secara bertahap.' }
                                ]
                            }
                        }
                    }
                },
                completionReward: {
                    message: 'Inspeksi PAMSIMAS selesai dan rekomendasi perbaikan sudah dikirim ke pengelola serta pemerintah desa.'
                }
            },
            bank_sampah: {
                title: 'Bank Sampah Berseri',
                subtitle: 'Pengelolaan Sampah Warga | Kurangi, Gunakan Ulang, Daur Ulang',
                ambience: 'Gudang terbuka dengan rak-rak sampah terpilah, timbangan, karung plastik bersih, dan aroma khas bahan daur ulang.',
                stations: {
                    pilah_sampah: {
                        label: 'Area Pemilahan',
                        description: 'Warga menyetor sampah dan memilahnya menjadi plastik, kertas, logam, kaca, dan organik di area ini.',
                        actions: {
                            sort_demo: { label: 'Demo Pemilahan Sampah Lima Kategori' },
                            weigh_record: { label: 'Timbang dan Catat Setoran Warga' },
                            health_hazard: { label: 'Identifikasi Limbah Rumah Tangga Berbahaya' }
                        },
                        findings: [
                            { text: 'Baterai bekas dan lampu neon ditemukan tercampur dalam tumpukan sampah umum.' },
                            { text: 'Setoran plastik naik 30 persen bulan ini, menandakan warga semakin rajin memilah sampah.' }
                        ]
                    },
                    komposting: {
                        label: 'Unit Komposting',
                        description: 'Sampah organik diolah menjadi kompos melalui fermentasi dan metode cacing di area ini.',
                        actions: {
                            compost_check: { label: 'Cek Kualitas Kompos' },
                            vermicompost: { label: 'Demo Vermikomposting' },
                            distribute_compost: { label: 'Distribusi Kompos ke Petani' }
                        },
                        findings: [
                            { text: 'Sebanyak 200 kilogram kompos sudah matang dan siap dibagikan ke petani organik.' },
                            { text: 'Bak fermentasi terlalu basah dan mulai menarik lalat sehingga perlu tambahan bahan kering.' }
                        ]
                    },
                    kerajinan: {
                        label: 'Workshop Kerajinan Daur Ulang',
                        description: 'Kelompok ibu-ibu membuat tas, pot bunga, dan ecobrick dari sampah plastik di workshop ini.',
                        actions: {
                            ecobrick_demo: { label: 'Demo Pembuatan Ecobrick' },
                            craft_exhibit: { label: 'Pameran Kerajinan Daur Ulang' },
                            health_edu_3r: { label: 'Edukasi Dampak Kesehatan dari Sampah' }
                        },
                        findings: [
                            { text: 'Tas dari bungkus kopi bisa terjual 50.000 rupiah per buah di pasar daring.' },
                            { text: 'Kelompok ibu-ibu meminta pelatihan tambahan karena peluang usahanya cukup besar.' }
                        ]
                    }
                },
                npcs: {
                    bu_ketua_bs: {
                        name: 'Bu Lia',
                        role: 'Ketua Bank Sampah',
                        greeting: 'Dokter, akhirnya ada juga yang datang dari puskesmas. Kami butuh arahan soal masker bekas dan limbah medis rumah tangga.',
                        dialogs: {
                            auto: {
                                text: 'Dokter, warga mulai rajin menyetor sampah, tetapi ada juga yang membawa baterai bekas dan lampu neon. Kami tahu itu berbahaya, tetapi tidak paham cara menanganinya dengan aman.',
                                choices: [
                                    { text: 'Itu termasuk limbah B3 dan saya bisa bantu buat SOP penanganannya.' },
                                    { text: 'Mari kita koordinasikan pengangkutannya dengan dinas lingkungan dan kesehatan.' }
                                ]
                            }
                        }
                    }
                },
                completionReward: {
                    message: 'Kunjungan bank sampah selesai dan rekomendasi pengelolaan limbah berbahaya sudah dicatat.'
                }
            },
            polindes: {
                title: 'Polindes Desa',
                subtitle: 'Layanan Persalinan dan Nifas Tingkat Desa',
                ambience: 'Rumah bidan desa yang diadaptasi menjadi Polindes dengan tempat tidur persalinan, partus set, lampu sorot, dan kondisi yang bersih namun sederhana.',
                stations: {
                    ruang_bersalin: {
                        label: 'Ruang Bersalin',
                        description: 'Tempat tidur persalinan normal dengan partus set, heater bayi, dan stok oksitosin.',
                        actions: {
                            check_partus_set: { label: 'Cek Kelengkapan Partus Set' },
                            check_emergency: { label: 'Cek Kit Darurat Perdarahan' },
                            simulate_partus: { label: 'Simulasi Penanganan Persalinan' }
                        },
                        findings: [
                            { text: 'Stok oksitosin sudah kedaluwarsa dan harus segera diganti dari gudang farmasi.' },
                            { text: 'Heater bayi berfungsi baik dan linen dalam kondisi bersih.' },
                            { text: 'Tidak tersedia MgSO4 untuk penanganan gawat darurat preeklampsia.' }
                        ]
                    },
                    ruang_nifas: {
                        label: 'Ruang Nifas dan Laktasi',
                        description: 'Area istirahat ibu pascapersalinan dengan edukasi IMD dan perawatan bayi baru lahir.',
                        actions: {
                            imd_guide: { label: 'Panduan Inisiasi Menyusu Dini' },
                            nifas_check: { label: 'Pemeriksaan Ibu Nifas (KF1-KF4)' },
                            newborn_check: { label: 'Pemeriksaan Bayi Baru Lahir (KN1)' }
                        },
                        findings: [
                            { text: 'Bu Rina pascapersalinan enam jam dan IMD berjalan berhasil.' },
                            { text: 'Bu Dewi berada pada hari ketiga nifas dengan perdarahan sedikit tetapi lochia masih normal.' }
                        ]
                    },
                    register_polindes: {
                        label: 'Register dan Data Kohort',
                        description: 'Pengelolaan buku register persalinan, kartu ibu, dan register kohort.',
                        actions: {
                            review_kohort: { label: 'Tinjau Register Kohort Ibu' },
                            plan_schedule: { label: 'Jadwalkan ANC dan Persalinan Bulan Depan' },
                            risk_mapping: { label: 'Pemetaan Ibu Hamil Risiko Tinggi' }
                        },
                        findings: [
                            { text: 'Terdapat tiga ibu hamil risiko tinggi karena grande multipara, usia di atas 35 tahun, atau riwayat seksio sesarea.' },
                            { text: 'Cakupan K4 bulan ini mencapai 85 persen dari target 90 persen.' }
                        ]
                    }
                },
                npcs: {
                    bidan_ani: {
                        name: 'Bidan Ani',
                        role: 'Bidan Desa',
                        greeting: 'Dokter, syukurlah ada supervisi hari ini. Saya menangani empat persalinan bulan ini dan semuanya normal, tetapi stok obat darurat saya mulai menipis.',
                        dialogs: {
                            auto: {
                                text: 'Dokter, saya khawatir dengan Bu Tini. Beliau G5P4, usia 40 tahun, dengan riwayat seksio sesarea. Seharusnya melahirkan di rumah sakit, tetapi tetap ingin di sini karena empat persalinan sebelumnya aman.',
                                choices: [
                                    { text: 'Kita harus tegas. Dengan risiko ruptur uteri, persalinan harus di rumah sakit.' },
                                    { text: 'Jelaskan risikonya dengan data yang jelas dan ajak suami ikut konseling.' }
                                ]
                            }
                        }
                    }
                },
                completionReward: {
                    message: 'Supervisi Polindes selesai dan temuan stok serta risiko tinggi sudah dilaporkan ke puskesmas.'
                }
            },
            rtk: {
                title: 'Rumah Tunggu Kelahiran',
                subtitle: 'Simpul Rujukan Ibu Hamil | Tempat singgah aman sebelum rujukan obstetri',
                ambience: 'Rumah singgah sederhana dekat jalan utama dengan kasur lipat, tas siaga, poster rencana persalinan, dan radio komunikasi rujukan.',
                stations: {
                    triage_rtk: {
                        label: 'Sudut Triage Ibu Risiko Tinggi',
                        description: 'Ibu hamil yang menunggu rujukan diperiksa cepat di sini untuk tekanan darah, kontraksi, perdarahan, dan kesiapan transport.',
                        actions: {
                            rapid_triage: { label: 'Triage Cepat Saat Datang' },
                            danger_signs: { label: 'Verifikasi Tanda Bahaya Maternal' },
                            stabilize_waiting: { label: 'Stabilisasi Sambil Menunggu Ambulans' }
                        },
                        findings: [
                            { text: 'Bu Tini, G5P4 dengan riwayat seksio sesarea, datang dengan kontraksi teratur dan tidak boleh menunggu di rumah lagi.' },
                            { text: 'Satu ibu hamil berusia 17 tahun tampak cemas, tekanan darahnya 150 per 100, dan kedua kakinya bengkak.' },
                            { text: 'Dua tas siaga keluarga masih belum lengkap karena belum berisi kain bayi dan dokumen JKN.' }
                        ]
                    },
                    logistik_rujukan: {
                        label: 'Logistik Rujukan dan Tas Siaga',
                        description: 'Tas siaga, surat rujukan, donor darah siaga, serta perlengkapan ibu dan bayi disiapkan di area ini.',
                        actions: {
                            check_referral_pack: { label: 'Cek Tas Siaga dan Dokumen Rujukan' },
                            blood_donor_map: { label: 'Peta Donor Darah Siaga' },
                            jkn_verify: { label: 'Verifikasi JKN atau Jaminan Persalinan' }
                        },
                        findings: [
                            { text: 'Donor darah golongan O tersedia, tetapi keluarga belum tahu cara menghubunginya saat malam hari.' },
                            { text: 'Satu surat rujukan belum ditandatangani sehingga bisa menunda masuk rumah sakit.' },
                            { text: 'Tas siaga Bu Rina sudah lengkap berisi buku KIA, kain bayi, pembalut nifas, dan kartu JKN.' }
                        ]
                    },
                    transport_desk: {
                        label: 'Meja Transport dan Komunikasi',
                        description: 'Meja ini mengatur sopir desa, ambulans, kontak rumah sakit rujukan, dan rute evakuasi alternatif saat cuaca buruk.',
                        actions: {
                            call_hospital: { label: 'Konfirmasi Ketersediaan Tempat Tidur RS Rujukan' },
                            transport_plan: { label: 'Susun Rencana Evakuasi Malam Hari' },
                            brief_family: { label: 'Briefing Keluarga Sebelum Berangkat' }
                        },
                        findings: [
                            { text: 'Sopir ambulans siaga, tetapi jembatan timur berisiko putus jika hujan deras malam ini.' },
                            { text: 'IGD rumah sakit meminta laporan preeklampsia dikirim lebih dulu agar magnesium sulfate siap.' },
                            { text: 'Suami Bu Tini masih ragu karena takut biaya rujukan membesar.' }
                        ]
                    }
                },
                npcs: {
                    bidan_referal: {
                        name: 'Bidan Rere',
                        role: 'Koordinator RTK',
                        greeting: 'Dokter, RTK ini menjadi penyangga terakhir sebelum ibu risiko tinggi dirujuk. Telat sedikit saja bisa berakibat fatal.',
                        dialogs: {
                            auto: {
                                text: 'Bu Tini memang sudah mau tinggal di sini, tetapi keluarganya terus bilang akan menunggu sampai kondisinya benar-benar sakit. Dengan riwayat seksio sesarea dan jarak ke rumah sakit 90 menit saat hujan, itu terlalu berbahaya.',
                                choices: [
                                    { text: 'Mari kita pakai RTK ini untuk menjelaskan seluruh faktor risiko dan hambatan perjalanan secara terbuka.' },
                                    { text: 'Saya bantu negosiasi dengan keluarga dan tekankan bahwa RTK justru mencegah rujukan terlambat.' }
                                ]
                            }
                        }
                    },
                    suami_tini: {
                        name: 'Pak Yono',
                        role: 'Suami Ibu Hamil Risiko Tinggi',
                        greeting: 'Dokter, saya takut kalau dirujuk ke rumah sakit nanti biayanya besar dan keluarga bingung mengurus semuanya.',
                        dialogs: {
                            transport_desk_done: {
                                text: 'Kalau RTK ini memang membuat semuanya siap sebelum kondisi darurat, saya ingin dengar lagi. Saya hanya tidak ingin istri saya dipingpong.',
                                choices: [
                                    { text: 'Itu tujuan RTK: dokumen, donor, dan jalur rujukan disiapkan sebelum krisis terjadi.' },
                                    { text: 'Mari kita cek bersama tas siaga dan nomor rumah sakit supaya Bapak lebih yakin.' }
                                ]
                            }
                        }
                    }
                },
                completionReward: {
                    message: 'Operasi RTK selesai dan jalur rujukan maternal desa kini lebih siap untuk persalinan aman.'
                }
            },
            market: {
                title: 'Pasar Desa Sukamaju',
                subtitle: 'Keamanan Pangan dan Kesehatan Lingkungan di Area Pasar',
                ambience: 'Pasar tradisional yang ramai dengan lapak sayur, daging, dan ikan, bercampur aroma rempah, ikan segar, serta lalat yang berkerumun.',
                stations: {
                    lapak_basah: {
                        label: 'Area Basah (Daging dan Ikan)',
                        description: 'Lapak daging dan ikan yang perlu diperiksa dari sisi suhu penyimpanan, talenan, dan air pencucian.',
                        actions: {
                            meat_inspect: { label: 'Inspeksi Daging: Warna, Bau, dan Tekstur' },
                            fish_freshness: { label: 'Cek Kesegaran Ikan: Mata dan Insang' },
                            cold_chain: { label: 'Periksa Suhu Cold Chain' }
                        },
                        findings: [
                            { text: 'Daging sapi dijual tanpa pendingin pada suhu 30 C sehingga berisiko Salmonella.' },
                            { text: 'Talenan yang sama dipakai untuk daging sapi dan ayam sehingga berisiko kontaminasi silang.' },
                            { text: 'Ikan dari nelayan pagi ini masih segar dengan mata yang jernih.' }
                        ]
                    },
                    lapak_kering: {
                        label: 'Area Kering dan Jajanan',
                        description: 'Lapak kue, camilan, dan bumbu yang perlu dicek dari sisi kedaluwarsa dan bahan tambahan berbahaya.',
                        actions: {
                            additive_test: { label: 'Tes Cepat Boraks, Formalin, dan Pewarna' },
                            expiry_check: { label: 'Cek Tanggal Kedaluwarsa' },
                            label_check: { label: 'Periksa Label dan Registrasi Pangan' }
                        },
                        findings: [
                            { text: 'Tahu putih positif formalin dan pedagang mengaku mendapatkannya dari pemasok kota.' },
                            { text: 'Krupuk merah positif rhodamin B.' },
                            { text: 'Bumbu kemasan yang sudah kedaluwarsa empat bulan masih dijual.' }
                        ]
                    },
                    sanitasi_pasar: {
                        label: 'Sanitasi dan MCK Pasar',
                        description: 'Toilet pasar, tempat sampah, drainase, dan sumber air perlu diperiksa sebagai satu paket sanitasi lingkungan.',
                        actions: {
                            toilet_inspect: { label: 'Inspeksi Toilet Pasar' },
                            drain_check: { label: 'Cek Drainase dan Genangan' },
                            waste_check: { label: 'Periksa Pengelolaan Sampah Pasar' }
                        },
                        findings: [
                            { text: 'Drainase mampet dan genangannya bercampur darah ikan serta sampah organik.' },
                            { text: 'Seluruh pasar hanya memiliki dua tempat sampah untuk sekitar 50 lapak.' },
                            { text: 'Toilet pasar masih menyediakan sabun, sesuatu yang cukup jarang untuk pasar tradisional.' }
                        ]
                    }
                },
                npcs: {
                    ketua_pasar: {
                        name: 'Pak Tarjo',
                        role: 'Ketua Pengelola Pasar',
                        greeting: 'Wah, hari ini ada inspeksi dari puskesmas. Semoga pedagang masih bisa tetap berjualan ya, Dokter.',
                        dialogs: {
                            auto: {
                                text: 'Dokter, saya tahu pasar ini belum cukup bersih. Pedagang sulit diatur karena mereka merasa yang penting dagangannya laku. Saya juga curiga soal formalin, tetapi belum bisa membuktikannya sendiri.',
                                choices: [
                                    { text: 'Saya bawa test kit. Mari kita uji langsung di depan para pedagang.' },
                                    { text: 'Mari mulai dengan pembinaan keamanan pangan, jangan langsung razia.' }
                                ]
                            }
                        }
                    }
                },
                completionReward: {
                    message: 'Inspeksi pasar selesai dan temuan formalin serta rhodamin B sudah diteruskan ke otoritas terkait.'
                }
            },
            warung: {
                title: 'Warung Makan Bu Minah',
                subtitle: 'Kedai Desa | Edukasi Gizi dan Keamanan Pangan',
                ambience: 'Warung sederhana di pinggir jalan desa dengan aroma nasi hangat, tempe goreng, meja kayu, dan etalase lauk.',
                stations: {
                    dapur_warung: {
                        label: 'Dapur dan Area Masak',
                        description: 'Area memasak untuk menilai kebersihan dapur, penyimpanan bahan, dan kualitas minyak goreng.',
                        actions: {
                            kitchen_inspect: { label: 'Inspeksi Kebersihan Dapur' },
                            oil_check: { label: 'Tes Kualitas Minyak Goreng' },
                            storage_check: { label: 'Cek Penyimpanan Bahan Makanan' }
                        },
                        findings: [
                            { text: 'Minyak goreng sudah sangat hitam dan telah dipakai lebih dari lima kali.' },
                            { text: 'Daging ayam disimpan tanpa pendingin selama delapan jam pada suhu ruang.' },
                            { text: 'Bumbu segar seperti bawang, jahe, dan kunyit masih dalam kondisi baik.' }
                        ]
                    },
                    menu_warung: {
                        label: 'Menu dan Gizi Seimbang',
                        description: 'Menu harian warung perlu ditinjau dengan prinsip gizi seimbang.',
                        actions: {
                            menu_analysis: { label: 'Analisis Komposisi Isi Piring' },
                            portion_demo: { label: 'Demo Porsi Gizi Seimbang' },
                            healthy_menu: { label: 'Bantu Susun Menu Harian yang Lebih Sehat' }
                        },
                        findings: [
                            { text: 'Menu paling laku adalah nasi, gorengan, dan teh manis sehingga sangat tidak seimbang.' },
                            { text: 'Sumber protein seperti tempe, tahu, telur, dan ikan tersedia, tetapi porsi sayur masih minim.' },
                            { text: 'Harga makanan tetap terjangkau, sekitar Rp 8.000 sampai Rp 12.000 per porsi.' }
                        ]
                    },
                    etalase: {
                        label: 'Etalase dan Area Penyajian',
                        description: 'Makanan siap saji ditampilkan di sini sehingga penutup, lalat, dan suhu pajanan perlu dievaluasi.',
                        actions: {
                            display_inspect: { label: 'Inspeksi Etalase Makanan' },
                            fly_count: { label: 'Hitung Lalat sebagai Indikator Sanitasi' },
                            food_safety_tips: { label: 'Berikan Tips Keamanan Pangan ke Penjual' }
                        },
                        findings: [
                            { text: 'Etalase dibiarkan terbuka sehingga lalat bebas hinggap pada makanan.' },
                            { text: 'Nasi sisa kemarin dijual kembali hari ini sehingga berisiko Bacillus cereus.' },
                            { text: 'Piring dan sendok sudah dicuci bersih menggunakan sabun.' }
                        ]
                    }
                },
                npcs: {
                    bu_minah: {
                        name: 'Bu Minah',
                        role: 'Pemilik Warung',
                        greeting: 'Mau makan apa, Dokter? Hari ini ada pecel lele, nasi uduk, dan gado-gado.',
                        dialogs: {
                            auto: {
                                text: 'Dokter, saya tahu minyak goreng saya sudah hitam. Tetapi minyak mahal, jadi bagaimana saya bisa menggantinya setiap hari? Pelanggan juga masih suka rasanya.',
                                choices: [
                                    { text: 'Minyak jelantah mengandung zat berbahaya sehingga sebaiknya diganti setelah sekitar tiga kali pemakaian.' },
                                    { text: 'Saya bantu atur menu supaya gorengan berkurang dan pilihan kukus atau rebus bertambah.' }
                                ]
                            }
                        }
                    }
                },
                completionReward: {
                    message: 'Pembinaan warung selesai dan Bu Minah bersedia mengganti minyak lebih sering.'
                }
            },
            toga: {
                title: 'Kebun TOGA Keluarga Sukamaju',
                subtitle: 'Tanaman Obat Keluarga | Kesehatan Tradisional Berbasis Bukti',
                ambience: 'Kebun kecil berisi jahe, kunyit, temulawak, lidah buaya, kumis kucing, dan tanaman obat lain dengan aroma rempah yang segar.',
                stations: {
                    kebun_toga: {
                        label: 'Kebun Tanaman Obat',
                        description: 'Bedeng tanaman untuk mengenali jenis, manfaat, dan cara penggunaan yang benar.',
                        actions: {
                            plant_id: { label: 'Identifikasi Sepuluh Tanaman TOGA Utama' },
                            harvest_demo: { label: 'Demo Panen dan Pengolahan Dasar' },
                            quality_check: { label: 'Cek Kualitas Tanaman dan Hama' }
                        },
                        findings: [
                            { text: 'Kebun berisi jahe, kunyit, temulawak, sereh, lidah buaya, kumis kucing, dan sambiloto.' },
                            { text: 'Beberapa tanaman terkena kutu putih sehingga perlu penanganan organik.' }
                        ]
                    },
                    olahan_toga: {
                        label: 'Workshop Olahan Herbal',
                        description: 'Area pengeringan, perebusan, dan pengemasan sederhana untuk olahan herbal.',
                        actions: {
                            jamu_class: { label: 'Kelas Pembuatan Jamu Sehat' },
                            safety_check: { label: 'Edukasi Jamu Aman versus Jamu Berbahaya' },
                            interaction_warn: { label: 'Peringatan Interaksi Obat dan Herbal' }
                        },
                        findings: [
                            { text: 'Sebagian warga mencampur jamu dengan obat diabetes sehingga berisiko hipoglikemia.' },
                            { text: 'Kunyit dan temulawak relatif aman serta memiliki potensi anti-inflamasi.' },
                            { text: 'Sebagian olahan herbal masih dibuat tanpa cuci tangan yang memadai sehingga higienitas rendah.' }
                        ]
                    },
                    edukasi_toga: {
                        label: 'Papan Edukasi dan Pameran',
                        description: 'Papan informasi perlu memuat nama ilmiah, khasiat, dosis, dan kontraindikasi tanaman.',
                        actions: {
                            update_board: { label: 'Perbarui Papan Informasi Tanaman' },
                            evidence_review: { label: 'Tinjau Bukti Ilmiah Tanaman Obat' },
                            herbal_vs_quack: { label: 'Edukasi Herbal Legal versus Jamu Oplosan' }
                        },
                        findings: [
                            { text: 'Papan informasi cukup lengkap, tetapi nama ilmiah tanaman belum dicantumkan.' },
                            { text: 'Warga mulai bisa membedakan TOGA resmi dengan jamu keliling yang berbahaya.' }
                        ]
                    }
                },
                npcs: {
                    bu_herbal: {
                        name: 'Bu Nining',
                        role: 'Pengelola TOGA',
                        greeting: 'Dokter, selamat datang di kebun TOGA kami. Semua ditanam organik tanpa pestisida.',
                        dialogs: {
                            auto: {
                                text: 'Dokter, ada warga diabetes yang minum jamu pahit dari penjual keliling karena ingin cepat sembuh. Padahal dia juga minum metformin. Itu berbahaya, kan?',
                                choices: [
                                    { text: 'Ya, itu berbahaya. Kita perlu edukasi jelas soal interaksi obat dan herbal.' },
                                    { text: 'Ajak warga itu ke puskesmas supaya gula darahnya bisa diperiksa.' }
                                ]
                            }
                        }
                    }
                },
                completionReward: {
                    message: 'Kunjungan TOGA selesai dan katalog tanaman obat berbasis bukti telah diperbarui.'
                }
            },
            padepokan_dukun: {
                title: 'Rumah Pengobatan Tradisional Mbah Surti',
                subtitle: 'Menjembatani tradisi dan bukti | kemitraan warga yang lebih aman',
                ambience: 'Pendopo kayu remang dengan asap dupa, rak botol jamu, tikar konseling, dan sudut ritual yang sering didatangi keluarga cemas.',
                stations: {
                    ruang_ritual: {
                        label: 'Ruang Ritual dan Konsultasi',
                        description: 'Tempat keluarga mencari penjelasan spiritual untuk kehamilan, demam anak, atau penyakit yang dianggap kiriman.',
                        actions: {
                            belief_mapping: { label: 'Peta Keyakinan Keluarga' },
                            danger_sign_bridge: { label: 'Jembatani Tanda Bahaya dengan Bahasa Budaya' },
                            respectful_confront: { label: 'Konfrontasi Mitos Secara Hormat' }
                        },
                        findings: [
                            { text: 'Keluarga Bu Sari percaya perdarahan pascapersalinan hanyalah darah kotor yang keluar, bukan tanda bahaya.' },
                            { text: 'Dua keluarga bersedia mendengar jika Mbah Surti sendiri yang menjelaskan kapan harus ke bidan atau rumah sakit.' },
                            { text: 'Mitos bahwa dirujuk berarti ibu lemah masih kuat di sekitar padepokan.' }
                        ]
                    },
                    meja_racikan: {
                        label: 'Meja Racikan Jamu dan Pantangan',
                        description: 'Tempat racikan herbal, minyak gosok, dan daftar pantangan makanan untuk ibu hamil, nifas, dan anak demam.',
                        actions: {
                            review_herbs: { label: 'Telaah Racikan Herbal yang Dipakai Warga' },
                            interaction_screen: { label: 'Screening Interaksi Jamu dan Obat' },
                            safe_substitution: { label: 'Negosiasikan Herbal Aman sebagai Pendamping, Bukan Pengganti' }
                        },
                        findings: [
                            { text: 'Ada ramuan pahit untuk ibu hamil dengan edema yang justru menunda pemeriksaan preeklampsia.' },
                            { text: 'Sebagian herbal seperti jahe hangat masih aman jika tidak menggantikan terapi utama.' },
                            { text: 'Pantangan protein hewani pada nifas masih diajarkan sehingga bisa memperlambat pemulihan ibu.' }
                        ]
                    },
                    balai_mediasi: {
                        label: 'Balai Mediasi Bidan dan Dukun',
                        description: 'Ruang musyawarah untuk menegaskan batas peran: dukun memberi dukungan budaya, bidan menangani medis dan rujukan.',
                        actions: {
                            partnership_charter: { label: 'Susun Kesepakatan Kemitraan Bidan dan Dukun' },
                            referral_trigger: { label: 'Latih Trigger Rujukan Cepat' },
                            public_message: { label: 'Rancang Pesan Publik untuk Tradisi Aman dan Evidence' }
                        },
                        findings: [
                            { text: 'Mbah Surti bersedia tetap memimpin doa dan pijat ringan selama bidan tidak merendahkan perannya di depan warga.' },
                            { text: 'Belum ada daftar yang jelas kapan dukun wajib berhenti dan langsung menyerahkan pasien ke bidan.' },
                            { text: 'Tokoh agama setempat siap mendukung pesan bahwa tradisi boleh, tetapi tanda bahaya tidak boleh ditunda.' }
                        ]
                    }
                },
                npcs: {
                    mbah_surti: {
                        name: 'Mbah Surti',
                        role: 'Dukun Beranak dan Pengobat Tradisional',
                        greeting: 'Dokter, saya tidak ingin disebut penyebab warga celaka. Orang datang ke sini karena merasa didengar.',
                        dialogs: {
                            auto: {
                                text: 'Kalau bidan datang hanya untuk melarang, warga akan makin sembunyi-sembunyi. Tetapi kalau saya diajak bekerja sama, saya bisa bantu bilang kapan harus dirujuk.',
                                choices: [
                                    { text: 'Mari bangun kemitraan: Mbah pegang dukungan budaya, bidan pegang keputusan medis.' },
                                    { text: 'Baik, tetapi saya perlu memastikan racikan dan pantangan yang berbahaya dihentikan.' }
                                ]
                            }
                        }
                    },
                    bu_sari_family: {
                        name: 'Keluarga Bu Sari',
                        role: 'Keluarga Pasien yang Bingung',
                        greeting: 'Kami hanya ingin Bu Sari selamat, tetapi jika semua dipaksa ke rumah sakit kami takut dianggap tidak menghormati adat.',
                        dialogs: {
                            balai_mediasi_done: {
                                text: 'Kalau Mbah Surti dan bidan sejalan, kami jauh lebih tenang. Selama ini kami menerima pesan yang saling bertolak belakang.',
                                choices: [
                                    { text: 'Itulah tujuannya: adat tetap dihormati, tetapi tanda bahaya ditangani cepat.' },
                                    { text: 'Mari sepakati tanda bahaya yang membuat keluarga harus langsung berangkat malam itu juga.' }
                                ]
                            }
                        }
                    }
                },
                completionReward: {
                    message: 'Mediasi padepokan selesai dan konflik antara tradisi dan evidence mulai bergeser menjadi kemitraan yang lebih aman bagi warga.'
                }
            }
        }
    }
};

