export default {
    emrWorkspace: {
        common: {
            itemsCount: '{{count}} item',
            serviceFee: 'Rp {{value}}',
            maia: 'MAIA'
        },
        sidebar: {
            cpptInfo: 'Info: Apa itu CPPT?',
            medicalRecord: 'Rekam Medis'
        },
        cppt: {
            actions: {
                treat: 'RAWAT JALAN',
                refer: 'DIRUJUK',
                stabilize: 'STABILISASI'
            },
            dayLabel: 'Hari ke-{{day}}',
            yearsShort: 'th',
            noAnamnesis: 'Anamnesis tidak tersedia',
            physicalExam: 'Pemeriksaan Fisik',
            emptyPhysicalExam: 'Pemeriksaan fisik tidak dicatat',
            laboratory: 'Laboratorium',
            noDiagnosis: 'Belum ada diagnosis',
            referTo: 'Rujuk ke: {{target}}',
            referralHospitalFallback: 'RS Rujukan',
            noTherapy: 'Tidak ada terapi dicatat',
            outcome: 'Outcome:',
            by: 'oleh:',
            unavailable: 'N/A',
            statusRecovered: 'Pulih',
            statusImproved: 'Membaik',
            educationLabels: {
                diet_nutrition: 'Diet & Nutrisi',
                medication_adherence: 'Kepatuhan Obat',
                wound_care: 'Perawatan Luka',
                hygiene: 'Kebersihan / PHBS',
                follow_up: 'Kontrol Ulang',
                lifestyle: 'Gaya Hidup Sehat',
                danger_signs: 'Tanda Bahaya',
                stop_smoking: 'Berhenti Merokok',
                breastfeeding: 'ASI Eksklusif',
                family_planning: 'KB / Keluarga Berencana',
                exercise: 'Aktivitas Fisik',
                ors_zinc: 'Oralit + Zinc',
                vaccination: 'Imunisasi',
                mental_health: 'Kesehatan Jiwa'
            }
        },
        assessment: {
            title: 'Assessment & Diagnosis',
            description: 'Tegakkan diagnosis kerja berdasarkan Anamnesis (S) dan Pemeriksaan Fisik (O). Gunakan kode ICD-10 yang sesuai.',
            icdPlaceholder: 'Cari kode ICD-10 atau nama penyakit...',
            selectedTitle: 'Diagnosis Terpilih',
            emptySelected: 'Belum ada diagnosis dipilih',
            primaryBadge: 'UT'
        },
        procedures: {
            suggestionTitle: 'Saran Tindakan',
            noSpecificSuggestion: 'Tidak ada saran tindakan khusus. Gunakan pencarian di bawah jika diperlukan.',
            searchPlaceholder: 'Cari kode atau nama tindakan (misal: 99.21 atau Injeksi)...',
            selectedTitle: 'Tindakan Terpilih',
            emptySelected: 'Belum ada tindakan',
            commonTitle: 'Tindakan Umum'
        },
        labs: {
            qualityTitle: 'Kendali Mutu & Biaya',
            qualityDescription: 'Setiap pemeriksaan laboratorium memotong plafon Kapitasi. Gunakan secara bijak sesuai indikasi klinis.',
            maiaTitle: 'Saran MAIA',
            maiaConsider: 'Pertimbangkan untuk memeriksa: {{items}}',
            maiaNoMore: 'Tidak ada usulan pemeriksaan laboratorium lebih lanjut.',
            unsupportedTitle: 'Pemeriksaan Lanjutan',
            unsupportedDescription: 'Belum tersedia di FKTP untuk order langsung: {{items}}.',
            catalogTitle: 'Katalog Pemeriksaan',
            commonBadge: 'Umum',
            noLabs: 'Fasilitas Lab Terbatas',
            resultsTitle: 'Hasil Laboratorium',
            recorded: '{{count}} terekam',
            emptySamples: 'Belum Ada Sampel Diproses',
            analyzing: 'Menganalisis: {{name}}',
            defaultNormalResult: 'Dalam batas normal',
            resultLabel: 'Hasil',
            systemNote: 'Catatan Sistem: Tidak terdapat indikasi EBM spesifik untuk kasus ini. Terjadi inefisiensi biaya JKN.'
        },
        billing: {
            title: 'Rincian Biaya Layan',
            payerBpjs: 'Penjamin: BPJS',
            payerGeneral: 'Umum / Mandiri',
            consultation: 'Konsultasi & Pemeriksaan Dasar',
            labPrefix: 'Lab: {{name}}',
            tableItem: 'Item Layan',
            tableUnit: 'Biaya Satuan',
            tableQty: 'Qty',
            tableSubtotal: 'Subtotal',
            finalTotal: 'Total Tagihan Akhir',
            covered: 'Dijamin Pemerintah / BPJS Health',
            cash: 'Pasien Membayar Tunai'
        },
        treatment: {
            formularyTitle: 'Formularium Puskesmas',
            searchPlaceholder: 'Cari obat (generik/merek)...',
            maiaRecommendations: 'Rekomendasi MAIA',
            medicineCatalog: 'Katalog Obat',
            activePrescription: 'Resep Aktif',
            signedStamp: 'Tertanda Elektronik',
            emptyMeds: 'Belum Ada Obat Dipilih',
            signedButton: 'Resep telah ditanda-tangani',
            signButton: 'Tanda-tangani Resep Elektronik',
            dosageRule: 'Aturan Pakai',
            timesDaily: '{{count}} x 1 satu hari',
            duration: 'Durasi Pemberian',
            days: '{{count}} hari',
            totalDispense: 'Total Sediaan:',
            tablets: 'tabs'
        },
        education: {
            title: 'MAIA Smart Guidance',
            searchPlaceholder: 'Cari topik edukasi...',
            pillars: {
                lifestyle: {
                    label: 'Gaya Hidup & Nutrisi',
                    desc: 'Diet, Aktivitas, Kebiasaan'
                },
                care: {
                    label: 'Perawatan & Kebersihan',
                    desc: 'Luka, Higienitas, Pencegahan'
                },
                medical: {
                    label: 'Medis & Kepatuhan',
                    desc: 'Minum Obat, Tanda Bahaya, Kontrol'
                }
            }
        },
        physical: {
            title: 'Sistem Pindai Medis',
            maiaPriority: 'Prioritas MAIA:',
            standby: 'Standby. Pola bebas.',
            coverage: 'Cakupan',
            anamnesis: 'Anamnesis',
            guideTitle: 'Buku Panduan',
            visualTarget: 'Target Visual',
            anatomyAlt: 'Visual anatomi',
            anterior: 'Anterior',
            posterior: 'Posterior',
            diagnosticModules: 'Modul Diagnostik',
            statusPending: 'Status: Menunggu',
            detected: 'Deteksi',
            normal: 'Normal',
            target: 'Target',
            telemetryLog: 'Log Telemetri',
            records: '{{count}} catatan',
            systemStandby: 'Sistem Standby',
            awaitingScan: 'Menunggu input pindai...'
        },
        history: {
            emptyArchive: 'Arsip CPPT Kosong',
            nonResident: 'Pasien Umum / Non-Warga',
            totalVisits: 'Total Kunjungan: {{count}}',
            cpptTitle: 'Apa itu CPPT?',
            legacyNotes: 'Catatan Lama (Pra-CPPT)',
            actions: {
                refer: 'RUJUK',
                delegate_to_maia: 'DELEGASI',
                stabilize: 'STABILISASI',
                default: 'RAWAT'
            }
        },
        billingSummary: {
            title: 'Rekap Billing (Estimasi)',
            totalService: 'Total Biaya Layan',
            patientPay: 'Mandiri (Patient Pay)',
            bpjsCoverage: 'Tanggungan {{class}} (JKN)',
            generalCoverage: 'Pasien Umum / Tanpa Jaminan'
        },
        soap: {
            noAnamnesis: 'Belum ada data anamnesis...',
            completeness: 'Kelengkapan Data:',
            chiefComplaint: 'KU:',
            unasked: 'Belum ditanyakan: {{items}}',
            noExam: 'Belum ada pemeriksaan...',
            normalChecked: 'Diperiksa (dalam batas normal)',
            noDiagnosis: 'Belum ada diagnosis...',
            therapyTitle: 'Resep & Terapi',
            noMeds: 'Belum ada obat...',
            proceduresTitle: 'Tindakan & Prosedur',
            noProcedures: 'Belum ada tindakan...',
            educationTitle: 'Edukasi & Konseling',
            noEducation: 'Belum ada edukasi...'
        }
    }
};
