export default {
    emergency: {
        ui: {
            clickForWiki: 'Klik untuk wiki',
            emptyQueueTitle: 'Tidak ada pasien IGD',
            emptyQueueSubtitle: 'Pasien gawat darurat akan muncul di sini',
            headerTitle: 'IGD - Gawat Darurat',
            patientsCount: '{{count}} pasien',
            ageShort: 'th',
            deteriorationPlateau: 'Kondisi tertahan (plateau)',
            deteriorationWorsening: 'Kondisi memburuk ({{value}}%)',
            sampleTitle: 'S.A.M.P.L.E Anamnesis Cito',
            choosePatient: 'Pilih pasien dari papan triase',
            chiefComplaint: 'Keluhan Utama',
            esiAssignment: 'Penetapan Triase ESI',
            esiGuide: 'Panduan ESI',
            lockTriage: 'Kunci Penilaian Triase',
            expectedTriage: 'Seharusnya:',
            workingDiagnosis: 'Diagnosis Kerja (Suspect)',
            diagnosisUnknown: 'Belum Tegak',
            actionGridTitle: 'Tactical Action Grid',
            wikiInfo: 'Info Wiki',
            interventionCode: 'INTV',
            evaluateActions: 'Evaluasi & Selesai Tindakan',
            recoveryScore: 'Skor Pemulihan: {{score}}%',
            missedActions: 'Terlewat: {{actions}}',
            finalStatus: 'Status Akhir',
            differentialDiagnosis: 'Diagnosis Banding (DDx)',
            referralLetter: 'Untuk Surat Rujukan:',
            workingDx: 'Working Dx',
            ddxLabel: 'DDx',
            actionsLabel: 'Tindakan',
            noActions: 'Belum ada',
            billingTitle: 'Administrasi & Rincian Tagihan',
            insuranceBpjs: 'BPJS',
            insuranceGeneral: 'UMUM',
            registration: 'Pendaftaran IGD',
            medicalService: 'Jasa Medis & Resusitasi',
            totalBill: 'TOTAL TAGIHAN',
            coverageLabel: 'Penjamin: {{type}}',
            bpjsRejected: 'Triase non-emergency (Hijau) tidak dijamin BPJS di IGD.',
            coveredFull: 'Seluruh tindakan gawat darurat dikaver penuh.',
            dischargeHome: 'Boleh Pulang',
            referSisrute: 'Rujuk (SISRUTE)',
            delegateMaia: 'Delegasikan sisa dokumen ke MAIA',
            repPenalty: '-5 Rep',
            waitingAmbulanceTitle: 'Menunggu Ambulans',
            waitingAmbulanceAccepted: 'SISRUTE diterima di {{hospital}}',
            referralHospitalFallback: 'RS Rujukan',
            etaTitle: 'Estimasi Tiba (ETA)',
            etaCompact: 'ETA {{time}}',
            etaMinutes: '{{minutes}} MENIT',
            etaArrived: 'TIBA',
            deteriorationNotice: 'Deteriorasi: {{value}}% - pantau ketat, Code Blue bisa terjadi!',
            codeBlack: 'KODE HITAM',
            resuscitationStopped: 'Resusitasi dihentikan.',
            deathRecorded: 'Waktu kematian dicatat: {{time}}.',
            maxResuscitationReached: 'Upaya resusitasi maksimal ({{attempts}}x) telah dilakukan namun pasien tidak merespons.',
            mortuaryDocumentation: 'Dokumentasi Kamar Jenazah',
            codeBlue: 'CODE BLUE',
            arrestDetected: 'Henti Jantung / Napas Terdeteksi',
            cprPrompt: 'Segera lakukan Resusitasi Jantung Paru (RJP) pada {{name}}!',
            resuscitationAttempt: 'Percobaan {{current}} / Limit: {{max}}',
            startCpr: 'MULAI RJP / DEFIBRILASI',
            deteriorationStatus: 'Status Deteriorasi',
            telemetry: 'Telemetry'
        },
        phaseNames: {
            triage: 'Triase',
            stabilization: 'Stabilisasi',
            disposition: 'Disposisi'
        },
        sampleTabs: {
            S: 'Gejala',
            A: 'Alergi',
            M: 'Obat',
            P: 'Riwayat',
            L: 'Makan Terakhir',
            E: 'Kejadian'
        },
        sampleDefaults: {
            symptomQuestion: 'Gejala',
            allergyQuestion: 'Ada alergi obat atau makanan?',
            allergyNone: 'Tidak ada alergi yang diketahui.',
            routineMedication: 'Obat rutin',
            routineMedicationQuestion: 'Minum obat rutin?',
            noRoutineMedication: 'Tidak ada obat rutin.',
            pastMedicalHistory: 'Riwayat penyakit',
            noSignificantHistory: 'Tidak ada riwayat penyakit penting.',
            lastMealQuestion: 'Terakhir makan atau minum kapan?',
            lastMealAnswer: 'Tadi pagi sebelum kejadian.',
            priorEventQuestion: 'Apa yang terjadi sebelumnya?',
            suddenComplaint: 'Keluhan muncul tiba-tiba.'
        },
        triageLevels: {
            1: { name: 'MERAH', desc: 'Immediate - Mengancam Nyawa' },
            2: { name: 'KUNING', desc: 'Urgent - Potensial Mengancam' },
            3: { name: 'HIJAU', desc: 'Non-Urgent - Dapat Ditunda' },
            4: { name: 'HITAM', desc: 'Deceased / Expectant' }
        },
        esiLevels: {
            1: { name: 'ESI 1: Resuscitation', desc: 'Butuh bantuan hidup segera (intubasi, syok, henti jantung).' },
            2: { name: 'ESI 2: Emergent', desc: 'Risiko tinggi, nyeri hebat, atau gangguan kesadaran. Harus cepat (10m).' },
            3: { name: 'ESI 3: Urgent', desc: 'Kondisi stabil tetapi butuh banyak sumber daya (lab, IV, radiologi).' },
            4: { name: 'ESI 4: Less Urgent', desc: 'Stabil dan hanya butuh satu jenis sumber daya.' },
            5: { name: 'ESI 5: Non-Urgent', desc: 'Stabil dan tidak butuh sumber daya besar.' }
        },
        validation: {
            triage: {
                correct: 'Triase tepat. Prioritas pasien sudah benar.',
                near: 'Triase hampir tepat, tetapi prioritasnya sedikit meleset.',
                under: 'Under-triage. Pasien ini lebih gawat dari penilaian Anda.',
                over: 'Over-triage. Pasien tidak segawat penilaian Anda.'
            },
            stabilization: {
                excellent: 'Stabilisasi awal sudah tepat.',
                partial: 'Beberapa tindakan penting masih terlewat.',
                poor: 'Stabilisasi belum adekuat. Pasien masih dalam bahaya.'
            }
        },
        patientStatus: {
            improved: { label: 'Membaik', description: 'Kondisi pasien membaik setelah tindakan.' },
            stable: { label: 'Stabil', description: 'Kondisi pasien stabil dan dapat dipantau.' },
            unchanged: { label: 'Belum Ada Perubahan', description: 'Kondisi pasien belum menunjukkan perbaikan bermakna.' },
            deteriorating: { label: 'Memburuk', description: 'Kondisi pasien memburuk dan perlu eskalasi.' },
            critical: { label: 'Kritis', description: 'Kondisi pasien kritis dan perlu rujukan segera.' }
        },
        actions: {
            oxygen: 'Oksigen (Nasal Kanul / Masker)',
            protect_airway: 'Jaga Jalan Napas',
            suction_airway: 'Suction Jalan Napas',
            heimlich_maneuver: 'Heimlich Maneuver / Back Blow',
            monitor_vitals_15: 'Monitor Vital Sign tiap 15-30m',
            cpr: 'RJP (Resusitasi Jantung Paru)',
            iv_line: 'Pasang akses IV',
            salbutamol_neb: 'Nebulizer Salbutamol 2.5mg',
            ipratropium_neb: 'Nebulizer Ipratropium Br.',
            methylprednisolone_iv: 'Steroid IV (Methylprednisolone)',
            observation_6h: 'Observasi 4-6 jam',
            head_tilt: 'Head Tilt / Chin Lift',
            recovery_position: 'Posisi Recovery',
            rescue_breathing: 'Bantuan Napas (Bag Valve Mask)'
        },
        caseData: {
            foreign_body_aspiration: {
                diagnosis: 'Aspirasi Benda Asing',
                symptoms: ['Tersedak tiba-tiba', 'Stridor', 'Batuk paroksismal', 'Sianosis', 'Tidak bisa bicara atau menangis'],
                anamnesis: [
                    'Anak tersedak kacang, sekarang sesak napas berat, suara napasnya bunyi.',
                    'Tiba-tiba tersedak sambil makan, tidak bisa nangis, wajahnya biru.'
                ],
                anamnesisQuestions: {
                    keluhan_utama: [
                        { id: 'q_event', text: 'Apa yang terjadi?', response: 'Tadi lagi makan kacang, tiba-tiba tersedak dan tidak bisa napas!', priority: 'essential' },
                        { id: 'q_what', text: 'Kira-kira benda apa?', response: 'Kacang tanah dok, tidak digigit langsung ditelan.', priority: 'essential' },
                        { id: 'q_breathe', text: 'Masih bisa napas?', response: 'Susah sekali, suaranya bunyi.', priority: 'essential' }
                    ],
                    rps: [
                        { id: 'q_cough', text: 'Masih batuk?', response: 'Tadi batuk-batuk kuat, sekarang sudah tidak kuat batuk lagi.' }
                    ],
                    rpd: [],
                    sosial: []
                },
                differentialDiagnosis: ['Croup', 'Epiglotitis', 'Angioedema', 'Asma akut']
            }
        }
    }
};
