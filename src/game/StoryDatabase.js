/**
 * @reflection
 * [IDENTITY]: StoryDatabase
 * [PURPOSE]: Central database for branching story quests and public health scenarios.
 * [STATE]: Experimental
 * [ANCHOR]: STORY_TEMPLATES
 */

export const STORY_TEMPLATES = [
    {
        id: 'cikapas_hysteria',
        title: 'Misteri Sungai Cikapas',
        category: 'Public Health',
        trigger: { type: 'day', value: 7, condition: 'reputation > 60' },
        nodes: {
            start: {
                id: 'start',
                type: 'dialog',
                text: 'Laporan masuk dari Desa Cikapas: Sekelompok wisatawan dilaporkan mengalami kesurupan massal setelah mengunjungi bantaran sungai. Warga mulai panik dan mengaitkannya dengan hal mistis.',
                choices: [
                    {
                        text: 'Kirim tim investigasi kesehatan (Epidemiologi)',
                        nextNode: 'team_sent',
                        impact: { balance: -500000, spirit: -5 }
                    },
                    {
                        text: 'Lakukan kunjungan lapangan pribadi',
                        nextNode: 'personal_visit',
                        impact: { energy: -20, spirit: +10 }
                    }
                ]
            },
            team_sent: {
                id: 'team_sent',
                type: 'action',
                description: 'Tim sedang menganalisis sampel air dan udara di lokasi.',
                metric: 'home_visits', // Placeholder: logic to wait or do something
                target: 3,
                onComplete: 'scientific_outcome'
            },
            personal_visit: {
                id: 'personal_visit',
                type: 'dialog',
                text: 'Setelah berbicara dengan warga, Anda menyadari adanya bau gas yang tidak biasa di sekitar bebatuan sungai. Ini kemungkinan keracunan gas alam, bukan mistis.',
                choices: [
                    {
                        text: 'Gelar penyuluhan tentang keamanan lingkungan',
                        nextNode: 'education_outcome',
                        impact: { reputation: +15 }
                    }
                ]
            },
            scientific_outcome: {
                id: 'scientific_outcome',
                type: 'dialog',
                text: 'Tim menemukan kadar CO2 tinggi di area cerukan sungai. Warga ditenangkan dengan penjelasan ilmiah. Krisis teratasi.',
                isEnd: true,
                impact: { reputation: +10, xp: 100 }
            },
            education_outcome: {
                id: 'education_outcome',
                type: 'dialog',
                text: 'Warga sangat menghargai kehadiran Anda secara langsung. IKS lingkungan meningkat karena kesadaran baru.',
                isEnd: true,
                impact: { reputation: +20, xp: 150 }
            }
        }
    },
    {
        id: 'mdr_tb_detection',
        title: 'Ancaman Tersembunyi: MDR-TB',
        category: 'Clinical',
        trigger: { type: 'stat', metric: 'patients_treated', value: 30 },
        nodes: {
            start: {
                id: 'start',
                type: 'dialog',
                text: 'Pasien Bapak Agus (TB Paru) tidak menunjukkan perbaikan setelah 2 bulan pengobatan OAT kategori 1. Hasil dahak masih positif.',
                choices: [
                    {
                        text: 'Segera rujuk untuk Tes Cepat Molekuler (TCM)',
                        nextNode: 'tcm_referral',
                        impact: { reputation: +5 }
                    }
                ]
            },
            tcm_referral: {
                id: 'tcm_referral',
                type: 'action',
                description: 'Pantau hasil rujukan Bapak Agus.',
                metric: 'days_passed',
                target: 2,
                onComplete: 'mdr_confirmed'
            },
            mdr_confirmed: {
                id: 'mdr_confirmed',
                type: 'dialog',
                text: 'Hasil TCM mengonfirmasi Resistansi Rifampisin. Bapak Agus terdiagnosis MDR-TB. Anda harus memulai pelacakan kontak erat.',
                isEnd: true,
                impact: { reputation: +10, xp: 200 }
            }
        }
    },
    // ── IKM Story Arcs ───────────────────────────────────
    {
        id: 'wabah_difteri',
        title: 'Kembalinya Difteri',
        category: 'Public Health',
        trigger: { type: 'day', value: 45, condition: 'reputation > 40' },
        nodes: {
            start: {
                id: 'start',
                type: 'dialog',
                text: 'Seorang anak (5 tahun) datang dengan demam, nyeri tenggorokan, dan membran keabuan di faring. Ia BELUM diimunisasi DPT. Di RT-nya ada 3 anak lain yang juga belum vaksin.',
                choices: [
                    {
                        text: 'Isolasi pasien, ambil swab, rujuk ke RS',
                        nextNode: 'isolate_refer',
                        impact: { reputation: +5 }
                    },
                    {
                        text: 'Laporkan ke Dinkes, minta ADS dan backlog vaksinasi',
                        nextNode: 'report_dinkes',
                        impact: { reputation: +10 }
                    }
                ]
            },
            isolate_refer: {
                id: 'isolate_refer',
                type: 'dialog',
                text: 'Pasien dirujuk dengan ADS. Sekarang Anda harus melacak kontak erat di RT.',
                choices: [
                    {
                        text: 'Lakukan pelacakan kontak door-to-door',
                        nextNode: 'contact_trace',
                        impact: { energy: -20 }
                    }
                ]
            },
            report_dinkes: {
                id: 'report_dinkes',
                type: 'dialog',
                text: 'Dinkes merespons dalam 24 jam. Tim Gerak Cepat (TGC) tiba. Bersama mereka, Anda memulai ORI (Outbreak Response Immunization).',
                choices: [
                    {
                        text: 'Pimpin ORI di 3 RT terdekat',
                        nextNode: 'ori_action',
                        impact: { energy: -25, reputation: +10 }
                    }
                ]
            },
            contact_trace: {
                id: 'contact_trace',
                type: 'action',
                description: 'Lacak dan periksa kontak erat pasien difteri',
                metric: 'home_visits',
                target: 5,
                onComplete: 'trace_result'
            },
            ori_action: {
                id: 'ori_action',
                type: 'action',
                description: 'Imunisasi massal di 3 RT',
                metric: 'education_given',
                target: 3,
                onComplete: 'ori_result'
            },
            trace_result: {
                id: 'trace_result',
                type: 'dialog',
                text: 'Ditemukan 2 carrier difteri tanpa gejala. Mereka diberi eritromisin profilaksis. Wabah berhasil ditekan sebelum menyebar lebih luas.',
                isEnd: true,
                impact: { reputation: +20, xp: 300 }
            },
            ori_result: {
                id: 'ori_result',
                type: 'dialog',
                text: 'ORI berhasil! 95% anak di 3 RT divaksinasi. Dinkes memberikan penghargaan atas respons cepat puskesmas Anda.',
                isEnd: true,
                impact: { reputation: +30, xp: 400 }
            }
        }
    },
    {
        id: 'stunting_village',
        title: 'Desa Merah: Prevalensi Stunting Tinggi',
        category: 'Public Health',
        trigger: { type: 'day', value: 30 },
        nodes: {
            start: {
                id: 'start',
                type: 'dialog',
                text: 'Hasil screening Posyandu menunjukkan 5 dari 20 balita di desa masuk kategori stunting (TB/U < -2 SD). Angka ini jauh di atas rata-rata nasional.',
                choices: [
                    {
                        text: 'Susun rencana intervensi gizi spesifik',
                        nextNode: 'plan_intervention',
                        impact: { energy: -10, reputation: +5 }
                    },
                    {
                        text: 'Lakukan kunjungan rumah ke 5 keluarga',
                        nextNode: 'home_visit_stunting',
                        impact: { energy: -25, reputation: +5 }
                    }
                ]
            },
            plan_intervention: {
                id: 'plan_intervention',
                type: 'dialog',
                text: 'Anda merancang program: PMT telur 1 butir/hari, edukasi gizi ibu, dan koordinasi PKH. Kepala desa mendukung penuh.',
                choices: [
                    {
                        text: 'Mulai program PMT minggu depan',
                        nextNode: 'pmt_action',
                        impact: { balance: -500000 }
                    }
                ]
            },
            home_visit_stunting: {
                id: 'home_visit_stunting',
                type: 'action',
                description: 'Kunjungi 5 keluarga balita stunting',
                metric: 'home_visits',
                target: 5,
                onComplete: 'visit_findings'
            },
            pmt_action: {
                id: 'pmt_action',
                type: 'action',
                description: 'Jalankan program PMT selama sebulan',
                metric: 'nutrition_education',
                target: 4,
                onComplete: 'pmt_result'
            },
            visit_findings: {
                id: 'visit_findings',
                type: 'dialog',
                text: 'Temuan: 3 keluarga miskin (nasi-garam saja), 1 ibu muda tidak tahu MP-ASI, 1 balita cacingan. Akar masalah = kemiskinan + ketidaktahuan.',
                isEnd: true,
                impact: { reputation: +15, xp: 200 }
            },
            pmt_result: {
                id: 'pmt_result',
                type: 'dialog',
                text: 'Setelah 3 bulan PMT + edukasi, 3 dari 5 balita menunjukkan catch-up growth. 2 lainnya dirujuk ke RS untuk pemeriksaan lebih lanjut.',
                isEnd: true,
                impact: { reputation: +25, xp: 350 }
            }
        }
    },
    {
        id: 'pesticide_crisis',
        title: 'Racun di Sawah',
        category: 'Public Health',
        trigger: { type: 'day', value: 60 },
        nodes: {
            start: {
                id: 'start',
                type: 'dialog',
                text: 'Dalam 2 minggu terakhir, 4 petani datang dengan gejala keracunan organofosfat ringan: mual, hipersalivasi, miosis. Semua bekerja di area persawahan yang sama.',
                choices: [
                    {
                        text: 'Investigasi lapangan ke sawah',
                        nextNode: 'field_investigation',
                        impact: { energy: -20, reputation: +5 }
                    },
                    {
                        text: 'Periksa kadar kolinesterase 4 petani',
                        nextNode: 'lab_check',
                        impact: { energy: -10 }
                    }
                ]
            },
            field_investigation: {
                id: 'field_investigation',
                type: 'dialog',
                text: 'Di sawah, Anda menemukan petani menyimpan pestisida di rumah, mencampur sendiri tanpa takaran, dan tidak memakai APD sama sekali.',
                choices: [
                    {
                        text: 'Adakan pelatihan keselamatan pestisida',
                        nextNode: 'safety_training',
                        impact: { energy: -15, balance: -200000 }
                    }
                ]
            },
            lab_check: {
                id: 'lab_check',
                type: 'dialog',
                text: 'Hasil: 3 dari 4 petani kadar kolinesterasenya rendah. Ini paparan kronik. Anda harus intervensi sebelum ada kasus berat.',
                choices: [
                    {
                        text: 'Koordinasi dengan Dinas Pertanian untuk APD',
                        nextNode: 'apd_coordination',
                        impact: { energy: -10, reputation: +5 }
                    }
                ]
            },
            safety_training: {
                id: 'safety_training',
                type: 'action',
                description: 'Pelatihan keselamatan pestisida untuk petani',
                metric: 'education_given',
                target: 2,
                onComplete: 'training_result'
            },
            apd_coordination: {
                id: 'apd_coordination',
                type: 'dialog',
                text: 'Dinas Pertanian menyediakan 50 set APD (masker, sarung tangan, kacamata). Anda membagikan sambil edukasi cara pakai.',
                isEnd: true,
                impact: { reputation: +20, xp: 250 }
            },
            training_result: {
                id: 'training_result',
                type: 'dialog',
                text: 'Pelatihan berhasil! 25 petani belajar takaran aman, penyimpanan benar, dan penggunaan APD. Kasus keracunan turun 80% bulan berikutnya.',
                isEnd: true,
                impact: { reputation: +30, xp: 350 }
            }
        }
    },
    {
        id: 'dukun_bidan_partnership',
        title: 'Jembatan Dua Dunia: Dukun & Bidan',
        category: 'Public Health',
        trigger: { type: 'day', value: 40, condition: 'reputation > 50' },
        nodes: {
            start: {
                id: 'start',
                type: 'dialog',
                text: 'Bidan melaporkan: 3 ibu hamil risiko tinggi di RT 07 menolak antenatal care dan berencana melahirkan di dukun beranak Mbah Surti. Riwayat: 1 kematian neonatal tahun lalu di dukun yang sama.',
                choices: [
                    {
                        text: 'Temui Mbah Surti, ajak bermitra',
                        nextNode: 'meet_dukun',
                        impact: { energy: -15, reputation: +5 }
                    },
                    {
                        text: 'Kunjungi 3 ibu hamil langsung',
                        nextNode: 'visit_mothers',
                        impact: { energy: -20 }
                    }
                ]
            },
            meet_dukun: {
                id: 'meet_dukun',
                type: 'dialog',
                text: 'Mbah Surti awalnya curiga, tapi setelah Anda menjelaskan kemitraan (dia tetap mendampingi, bidan yang tangani medis), dia mulai terbuka.',
                choices: [
                    {
                        text: 'Latih Mbah Surti mengenali tanda bahaya',
                        nextNode: 'train_dukun',
                        impact: { energy: -10, reputation: +10 }
                    }
                ]
            },
            visit_mothers: {
                id: 'visit_mothers',
                type: 'action',
                description: 'Kunjungi 3 ibu hamil risiko tinggi',
                metric: 'home_visits',
                target: 3,
                onComplete: 'mothers_result'
            },
            train_dukun: {
                id: 'train_dukun',
                type: 'action',
                description: 'Latih Mbah Surti mengenali tanda bahaya kehamilan',
                metric: 'education_given',
                target: 2,
                onComplete: 'partnership_result'
            },
            mothers_result: {
                id: 'mothers_result',
                type: 'dialog',
                text: '2 dari 3 ibu setuju ANC di puskesmas setelah melihat USG bayinya. 1 ibu masih menolak. Anda menjadwalkan follow-up melalui kader.',
                isEnd: true,
                impact: { reputation: +15, xp: 200 }
            },
            partnership_result: {
                id: 'partnership_result',
                type: 'dialog',
                text: 'Mbah Surti sekarang bermitra resmi dengan bidan! Dia merujuk 2 ibu hamil risiko tinggi ke puskesmas. Program kemitraan dukun-bidan jadi model untuk kecamatan.',
                isEnd: true,
                impact: { reputation: +35, xp: 500 }
            }
        }
    },
    {
        id: 'tb_contact_tracing',
        title: 'Pelacakan Kontak TB: Satu Keluarga, Satu Misi',
        category: 'Clinical',
        trigger: { type: 'stat', metric: 'patients_treated', value: 50 },
        nodes: {
            start: {
                id: 'start',
                type: 'dialog',
                text: 'Pasien TB BTA(+) Pak Darto sudah 2 bulan berobat. Anda belum pernah memeriksa kontak serumahnya: istri, 3 anak, dan ibu lansia. Ini tugas penting surveilans TB.',
                choices: [
                    {
                        text: 'Jadwalkan kunjungan rumah untuk screening kontak',
                        nextNode: 'schedule_visit',
                        impact: { energy: -10, reputation: +5 }
                    }
                ]
            },
            schedule_visit: {
                id: 'schedule_visit',
                type: 'action',
                description: 'Kunjungi rumah Pak Darto untuk screening kontak',
                metric: 'home_visits',
                target: 1,
                onComplete: 'screening_result'
            },
            screening_result: {
                id: 'screening_result',
                type: 'dialog',
                text: 'Hasil screening: anak bungsu (4 tahun) batuk 3 minggu. Tes Mantoux positif kuat. Ibu lansia juga menunjukkan gejala mencurigakan.',
                choices: [
                    {
                        text: 'Mulai INH profilaksis untuk anak, rujuk ibu untuk rontgen',
                        nextNode: 'treatment_plan',
                        impact: { reputation: +10 }
                    }
                ]
            },
            treatment_plan: {
                id: 'treatment_plan',
                type: 'dialog',
                text: 'Anak bungsu mendapat INH profilaksis 6 bulan. Ibu lansia terdiagnosis TB paru dan memulai OAT. Anda berhasil memutus rantai penularan dalam satu keluarga.',
                isEnd: true,
                impact: { reputation: +25, xp: 350 }
            }
        }
    }
];
