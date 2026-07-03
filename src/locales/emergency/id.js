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
            codeRed: 'KODE MERAH / KRITIS',
            criticalDeterioration: 'Deteriorasi Kritis Tercapai',
            referPrompt: 'Kondisi {{name}} sangat tidak stabil dan memerlukan eskalasi atau rujukan segera!',
            referImmediate: 'RUJUK / STABILISASI SEGERA',
            deteriorationStatus: 'Status Deteriorasi',
            telemetry: 'Telemetry',
            vitals: {
                hr: 'HR (bpm)',
                bp: 'NIBP (mmHg)',
                spo2: 'SpO2 (%)',
                resp: 'RESP',
                temp: 'TEMP',
                gds: 'GDS (mg/dL)'
            }
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
        maia: {
            clueTitle: 'Insight MAIA',
            validationTitle: 'Evaluasi MAIA',
            close: 'Tutup',
            clueFallback: 'Coba perhatikan {{target}} dan riwayat pasien.',
            mainSymptom: 'gejala utama',
            stats: {
                anamnesis: 'Anamnesis',
                diagnosis: 'Diagnosis',
                treatment: 'Terapi',
                exams: 'Pemeriksaan',
                education: 'Edukasi'
            },
            suggestionsTitle: 'Saran MAIA',
            physicalExam: 'Pemeriksaan Fisik',
            laboratory: 'Laboratorium',
            showAnswer: 'Lihat Kunci Jawaban',
            hideAnswer: 'Sembunyikan Pembahasan',
            ebmClueTitle: 'Clue Klinis EBM',
            diagnosisSection: 'Diagnosis',
            correct: 'BENAR',
            incorrect: 'SALAH',
            differentialDiagnosis: 'Diagnosis Banding',
            anamnesisSection: 'Anamnesis',
            essentialQuestions: 'Pertanyaan Esensial',
            chiefComplaintFallback: 'Keluhan utama pasien',
            totalAsked: 'Total ditanyakan: {{count}} pertanyaan',
            treatmentSection: 'Terapi',
            correctTherapy: 'Terapi yang Benar',
            missingMeds: 'Belum diberikan',
            unnecessaryMeds: 'Tidak diperlukan',
            correctProcedures: 'Prosedur yang Tepat',
            missingProcs: 'Prosedur belum dilakukan',
            examsSection: 'Pemeriksaan',
            relevantLabs: 'Lab yang Relevan',
            missingExams: 'PF belum diperiksa',
            missingLabs: 'Lab belum dipesan',
            unnecessaryLabs: 'Lab tidak diperlukan',
            educationSection: 'Edukasi',
            requiredEducation: 'Edukasi yang Wajib',
            unnecessaryEducation: 'Tidak diperlukan',
            skdi: 'SKDI',
            risk: 'Risiko',
            nonReferrable: 'Non-Referrable (KMK 1186/2022)',
            reasoningTitle: 'Clinical Reasoning',
            reasoningSubtitle: 'By Dr. MAIA',
            overallInvestigation: 'Overall Clinical Investigation',
            coverageAnamnesis: 'Anamnesis (EBM)',
            coveragePhysical: 'Pemeriksaan Fisik',
            coverageLabs: 'Laboratorium',
            diagnosticProbability: 'Diagnostic Probability (Bayesian)',
            lowConfidenceHint: 'Saran MAIA: basis data investigasi masih terlalu rendah untuk membedakan {{primary}} dari {{secondary}}. Lanjutkan eksplorasi.',
            expertInsight: 'MAIA Expert Insight',
            confidenceLevel: 'Confidence Level: {{level}}',
            confidenceHigh: 'HIGH (DEFINITIVE)',
            confidenceMedium: 'MEDIUM (PROBABLE)',
            confidenceLow: 'LOW (POSSIBLE)',
            orSeparator: ' ATAU '
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
            evaluate_nebu: 'Evaluasi respons nebulizer',
            find_focus: 'Cari fokus infeksi',
            education_seizure: 'Edukasi penanganan kejang',
            check_cause: 'Cari penyebab (GDS, demam, trauma)',
            head_tilt: 'Head Tilt / Chin Lift',
            recovery_position: 'Posisi Recovery',
            rescue_breathing: 'Bantuan Napas (Bag Valve Mask)',
            wound_cleaning: 'Cuci luka (NaCl/air bersih)',
            hemostasis: 'Hemostasis (tekan)',
            suturing: 'Jahit luka (hecting)',
            warm_compress: 'Kompres hangat',
            cold_compress: 'Kompres dingin',
            burn_cooling: 'Irigasi air mengalir (20 menit)',
            silver_sulfadiazine: 'Krim silver sulfadiazine',
            burn_wrap: 'Balut luka bakar steril',
            immobilize_limb: 'Imobilisasi ekstremitas (bidai)',
            splint_fracture: 'Bidai/splint fraktur',
            iv_fluid_rl: 'Infus Ringer Laktat',
            rehydration_bolus: 'Bolus cairan NaCl 0.9% 20 mL/kg',
            epinephrine_inj: 'Epinefrin 0.3-0.5 mg IM',
            amoxicillin_500: 'Antibiotik Profilaksis',
            aspilet_160: 'Aspirin 160 mg (Dosis Awal)',
            isdn_5: 'ISDN 5 mg Sublingual',
            clopidogrel_300: 'Clopidogrel 300 mg (Dosis Awal)',
            ecg: 'EKG 12 Sadapan',
            nicardipine_drip: 'Nicardipine Drip (Hipertensi Emergensi)',
            furosemide_iv: 'Furosemide 40 mg IV',
            tranexamic_acid_iv: 'Asam traneksamat 1 g IV',
            diazepam_10mg: 'Diazepam 10 mg IV pelan',
            diazepam_rectal_prn: 'Diazepam rektal',
            phenytoin_iv: 'Phenytoin IV (dosis awal)',
            magnesium_sulfate_iv: 'MgSO4 40% IV (anti-kejang eklampsia)',
            dexamethasone_iv: 'Steroid IV (Dexamethasone)',
            diphenhydramine_iv: 'Antihistamin IV (Diphenhydramine)',
            ketorolac_iv: 'Ketorolac 30 mg IV',
            ondansetron_iv: 'Ondansetron 4 mg IV',
            catheter_urine: 'Kateter Urin (Foley)',
            morphine_iv: 'Morphine IV',
            atropine_iv: 'Atropin sulfat 0.5-1 mg IV',
            pralidoxime_iv: 'Pralidoxime (2-PAM) 1 g IV',
            gastric_lavage: 'Bilas lambung (NGT)',
            activated_charcoal: 'Arang aktif (Norit) 50 g',
            saep_antivenom: 'Serum anti bisa ular polivalen (SABU)',
            ats_injection: 'Profilaksis tetanus (ATS/TT)',
            paracetamol_syr: 'Paracetamol drop/sirup',
            paracetamol_500: 'Paracetamol 500 mg tablet',
            lidocaine_inj: 'Anestesi lokal (Lidocaine)',
            reagen_gds: 'Cek GDS',
            ecg_electrode: 'Elektroda EKG',
            d40_iv: 'Bolus Dextrose 40% (2 ampul)',
            d10_maintenance: 'Infus Dextrose 10% Maintenance',
            monitor_gds: 'Monitor GDS tiap 15 menit',
            nacl_resus: 'NaCl 0.9% Resusitasi Masif (1 L)',
            insulin_drip: 'Insulin Regular Drip',
            ngt_tube: 'Pasang NGT',
            ngt_decompression: 'Dekompresi NGT',
            blood_crossmatch: 'Crossmatch darah (PRC)'
        },
        caseData: {
            asthma_acute_severe: {
                diagnosis: 'Asma Berat Akut',
                symptoms: ['Sesak napas berat', 'Wheezing inspiratori/ekspiratori', 'Bicara terputus-putus', 'Penggunaan otot bantu napas'],
                clue: '[URGENT] Serangan asma berat. Silent chest adalah tanda gawat. Segera nebulizer + steroid IV.',
                relevantLabs: ['Pemeriksaan fisik paru', 'SpO2'],
                anamnesis: [
                    'Sesak napas berat, Dok, inhaler yang biasa dipakai tidak mempan.',
                    'Tadi malam kena debu, lalu kambuhnya jadi makin berat.'
                ],
                anamnesisQuestions: {
                    keluhan_utama: [
                        { id: 'q_main', text: 'Sesaknya sudah berapa lama?', response: 'Sejak tadi malam, Dok, makin lama makin berat.', priority: 'essential' },
                        { id: 'q_trigger', text: 'Ada pemicunya?', response: 'Kena debu waktu beresin gudang.', priority: 'essential' },
                        { id: 'q_meds', text: 'Sudah pakai inhaler?', response: 'Sudah 3 kali, tapi tetap tidak mempan.', priority: 'essential' }
                    ],
                    medis: [
                        { id: 'q_freq', text: 'Sering serangan seperti ini?', response: 'Sering, tapi biasanya sembuh pakai inhaler.' },
                        { id: 'q_smoke', text: 'Ada yang merokok di rumah?', response: 'Suami saya merokok.' }
                    ],
                    sosial: []
                },
                physicalExamFindings: {
                    general: 'Tampak sesak berat, posisi tripod, bicara kata demi kata.',
                    vitals: 'TD 130/80, N 110x, RR 32x, S 36.5°C, SpO2 92% udara ruangan.',
                    thorax: 'Inspeksi: retraksi suprasternal dan interkostal (+). Auskultasi: wheezing di seluruh lapangan paru.',
                    extremities: 'CRT <2 detik, akral hangat.'
                },
                differentialDiagnosis: ['PPOK eksaserbasi akut', 'Gagal jantung kongestif', 'Pneumotoraks']
            },
            copd_exacerbation: {
                diagnosis: 'PPOK Eksaserbasi Akut',
                symptoms: ['Sesak napas memburuk', 'Batuk produktif purulen', 'Wheezing', 'Barrel chest', 'Sianosis'],
                clue: '[URGENT] Pasien PPOK dengan sesak memberat dan sputum purulen. Nebulizer + steroid + antibiotik. Waspadai gagal napas.',
                relevantLabs: ['SpO2', 'Darah Lengkap'],
                anamnesis: [
                    'Sesak makin berat 2 hari ini, dahaknya kental hijau, inhaler juga sudah tidak mempan.',
                    'PPOK kambuh, Dok, batuk berdahak terus dan napasnya bunyi.'
                ],
                anamnesisQuestions: {
                    keluhan_utama: [
                        { id: 'q_main', text: 'Sesaknya makin berat sejak kapan?', response: 'Dari 2 hari ini, Dok. Biasanya tidak separah ini.', priority: 'essential' },
                        { id: 'q_sputum', text: 'Dahaknya seperti apa?', response: 'Banyak sekali, Dok, kuning-hijau dan kental.', priority: 'essential' },
                        { id: 'q_smoke', text: 'Masih merokok?', response: 'Masih 1 bungkus sehari, Dok, sudah 30 tahun.', priority: 'essential' }
                    ],
                    rpd: [
                        { id: 'q_copd', text: 'Sudah didiagnosis PPOK?', response: 'Iya, Dok, sudah 5 tahun dan rutin kontrol di poli paru.' },
                        { id: 'q_inhaler', text: 'Pakai inhaler rutin?', response: 'Kadang lupa, Dok. Kalau tidak sesak, tidak dipakai.' }
                    ],
                    sosial: []
                },
                physicalExamFindings: {
                    general: 'Tampak sesak, duduk membungkuk, pursed-lip breathing, barrel chest.',
                    vitals: 'TD 140/90, N 100x, RR 30x, S 37.8°C, SpO2 89%.',
                    thorax: 'Ekspirasi memanjang, wheezing bilateral, ronkhi basah basal, perkusi hipersonor.',
                    extremities: 'Clubbing finger (+), sianosis perifer.'
                },
                sisruteData: {
                    situation: 'Pasien PPOK berat eksaserbasi akut, SpO2 89%, sesak berat, sputum purulen.',
                    background: 'PPOK 5 tahun, perokok 30 tahun 1 bungkus per hari, inhaler tidak rutin.',
                    assessment: 'Eksaserbasi akut PPOK berat curiga infeksi sekunder. Risiko gagal napas.',
                    recommendation: 'Rujuk ke SpParu untuk bronkodilator intensif, monitoring SpO2, dan evaluasi kebutuhan NIV.'
                },
                differentialDiagnosis: ['Pneumonia', 'Gagal jantung kongestif', 'Pneumotoraks', 'Emboli paru']
            },
            foreign_body_aspiration: {
                diagnosis: 'Aspirasi Benda Asing',
                symptoms: ['Tersedak tiba-tiba', 'Stridor', 'Batuk paroksismal', 'Sianosis', 'Tidak bisa bicara atau menangis'],
                clue: '[CRITICAL] Anak tersedak dengan stridor. Jika masih batuk efektif, dorong untuk batuk. Jika silent atau sianosis, Heimlich/back blow segera.',
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
                physicalExamFindings: {
                    general: 'Anak 3 tahun, agitasi, stridor, universal choking sign, sianosis.',
                    vitals: 'N 150x, RR 45x, SpO2 78%.',
                    thorax: 'Stridor inspiratori, air entry kanan menurun, wheezing lokal, retraksi suprasternal (+).'
                },
                sisruteData: {
                    situation: 'Anak 3 tahun aspirasi kacang, stridor, SpO2 78%, sianosis.',
                    background: 'Onset akut saat makan. Heimlich berhasil parsial, tetapi stridor masih menetap.',
                    assessment: 'Benda asing jalan napas belum teratasi tuntas. Butuh bronkoskopi rigid.',
                    recommendation: 'Rujuk segera ke SpA atau SpTHT-KL untuk bronkoskopi rigid dan ekstraksi benda asing.'
                },
                differentialDiagnosis: ['Croup', 'Epiglotitis', 'Angioedema', 'Asma akut']
            },
            chest_pain_acs: {
                diagnosis: 'Sindrom Koroner Akut',
                symptoms: ['Nyeri dada kiri atau tengah', 'Menjalar ke lengan atau rahang', 'Keringat dingin', 'Mual', 'Sesak'],
                clue: '[URGENT] Nyeri dada tipikal disertai keringat dingin pada usia >40 tahun. Curiga ACS. EKG segera, aspirin loading, antiplatelet tambahan bila tersedia, oksigen hanya bila hipoksemia, dan nitrat hanya bila tekanan darah memadai.',
                anamnesis: [
                    'Dada terasa sangat sakit, Dok, seperti ditindih benda berat dan tembus ke punggung.',
                    'Keluar keringat dingin, mual, dan sesak napas.'
                ],
                anamnesisQuestions: {
                    keluhan_utama: [
                        { id: 'q_pain', text: 'Sakit dadanya seperti apa?', response: 'Seperti ditindih batu besar, Dok, berat sekali.', priority: 'essential' },
                        { id: 'q_location', text: 'Menjalar ke mana?', response: 'Sampai ke rahang dan pundak kiri, Dok.', priority: 'essential' },
                        { id: 'q_sweat', text: 'Ada keringat dingin?', response: 'Iya, Dok, sampai bajunya basah semua.', priority: 'essential' }
                    ],
                    rps: [
                        { id: 'q_duration', text: 'Sudah berapa lama sakitnya?', response: 'Sudah 30 menit tidak hilang-hilang, Dok.' },
                        { id: 'q_nitrat', text: 'Sudah minum obat bawah lidah?', response: 'Belum, Dok.' }
                    ],
                    rpd: [
                        { id: 'q_ht', text: 'Ada darah tinggi atau kencing manis?', response: 'Iya, saya darah tinggi dan rutin minum amlodipine.' }
                    ],
                    sosial: [
                        { id: 'q_smoker', text: 'Bapak merokok?', response: 'Iya, merokok 1 bungkus sehari.' }
                    ]
                },
                differentialDiagnosis: ['GERD/Dispepsia', 'Diseksi aorta', 'Emboli paru', 'Perikarditis']
            },
            hypertensive_crisis: {
                diagnosis: 'Krisis Hipertensi (HT Emergency)',
                symptoms: ['TD sistolik >180 / diastolik >120', 'Nyeri kepala hebat', 'Pandangan kabur', 'Mimisan', 'Sesak napas'],
                clue: '[URGENT] TD >180/120 dengan kerusakan organ target. Turunkan tekanan darah bertahap dengan anti-hipertensi IV titrasi, jangan terlalu cepat. Loop diuretik tidak otomatis wajib bila tidak ada edema paru atau overload.',
                anamnesis: [
                    'Kepala sakit sekali, seperti mau pecah, pandangan kabur, tadi sempat mimisan.',
                    'Obat darah tinggi habis 2 minggu lalu, sekarang tensinya sangat tinggi.'
                ],
                anamnesisQuestions: {
                    keluhan_utama: [
                        { id: 'q_headache', text: 'Sakitnya di mana?', response: 'Kepala saya sakit sekali, Dok, seperti mau pecah, terutama belakang tengkuk.', priority: 'essential' },
                        { id: 'q_vision', text: 'Pandangannya bagaimana?', response: 'Agak kabur, Dok, seperti berkunang-kunang.', priority: 'essential' },
                        { id: 'q_nosebleed', text: 'Ada mimisan?', response: 'Tadi sempat keluar darah dari hidung.', priority: 'essential' }
                    ],
                    rpd: [
                        { id: 'q_ht', text: 'Rutin minum obat tensi?', response: 'Sudah habis 2 minggu lalu, Dok, belum beli lagi.' },
                        { id: 'q_meds', text: 'Obat apa biasanya?', response: 'Amlodipine 10 dan Captopril, Dok.' }
                    ],
                    sosial: [
                        { id: 'q_salt', text: 'Suka makan asin?', response: 'Iya, Dok, suka lauk ikan asin.' }
                    ]
                },
                differentialDiagnosis: ['Stroke hemoragik', 'Feokromositoma', 'Pre-eklampsia (jika hamil)', 'Diseksi aorta']
            },
            chf_acute_pulmonary_edema: {
                diagnosis: 'Gagal Jantung Akut (Edema Paru)',
                symptoms: ['Sesak napas berat tiba-tiba', 'Ortopnea', 'Batuk berbusa merah muda', 'Ronkhi basah bilateral', 'JVP meningkat'],
                clue: '[CRITICAL] Sesak akut dengan batuk berbusa merah muda dan ronkhi bilateral mengarah ke edema paru. Posisi duduk, oksigen karena hipoksemia, diuretik IV, dan nitrat bila tekanan darah memadai; opioid tidak rutin diwajibkan.',
                anamnesis: [
                    'Tengah malam sesak mendadak, batuk berbusa merah muda, dan tidak bisa tidur terlentang.',
                    'Jantung lemah kambuh, kaki bengkak, sekarang sesaknya berat sekali sampai sulit bernapas.'
                ],
                anamnesisQuestions: {
                    keluhan_utama: [
                        { id: 'q_breathe', text: 'Sesaknya sejak kapan?', response: 'Sejak tadi malam, Dok. Tiba-tiba sangat sesak sampai tidak bisa tidur.', priority: 'essential' },
                        { id: 'q_foam', text: 'Ada batuk?', response: 'Iya, Dok, batuk keluar busa kemerahan.', priority: 'essential' },
                        { id: 'q_position', text: 'Tidur pakai bantal berapa?', response: 'Harus duduk, Dok. Kalau tiduran makin sesak.', priority: 'essential' }
                    ],
                    rpd: [
                        { id: 'q_heart', text: 'Ada riwayat penyakit jantung?', response: 'Pernah dibilang jantungnya lemah 2 tahun lalu.' },
                        { id: 'q_meds', text: 'Obat rutin apa?', response: 'Furosemide dan Captopril, tapi sering lupa minum.' }
                    ],
                    sosial: []
                },
                differentialDiagnosis: ['Pneumonia bilateral', 'ARDS', 'Emboli paru masif', 'Tamponade jantung']
            },
            hypoglycemia_severe: {
                diagnosis: 'Hipoglikemia Berat',
                symptoms: ['Penurunan kesadaran', 'Keringat dingin', 'Gemetar', 'Lemas', 'Pucat'],
                clue: '[CRITICAL] Penurunan kesadaran pada pasien diabetes. Cek gula darah sewaktu segera sebelum tindakan lain.',
                anamnesis: [
                    'Pasien dibawa keluarga setelah pagi tadi minum obat diabetes tetapi belum makan.',
                    'Awalnya keluar keringat dingin dan gemetar, lama-lama jadi linglung.'
                ],
                anamnesisQuestions: {
                    keluhan_utama: [
                        { id: 'q_event', text: 'Bagaimana kejadiannya tadi?', response: 'Tadi pagi bapak minum obat gula, tapi lupa tidak sarapan. Lalu tiba-tiba bingung dan pingsan.', priority: 'essential' },
                        { id: 'q_food', text: 'Kapan terakhir makan?', response: 'Tadi malam, Dok, belum makan apa-apa hari ini.', priority: 'essential' },
                        { id: 'q_symptoms', text: 'Ada keringat dingin?', response: 'Iya, Dok, badannya basah semua.', priority: 'essential' }
                    ],
                    medis: [
                        { id: 'q_meds', text: 'Obat apa yang diminum?', response: 'Glimiperide, Dok.' }
                    ],
                    sosial: [
                        { id: 'q_habit', text: 'Sering seperti ini?', response: 'Pernah sekali dulu waktu telat makan juga.' }
                    ]
                },
                differentialDiagnosis: ['Stroke (CVA)', 'Intoksikasi alkohol', 'Ketoasidosis diabetik']
            },
            dka_adult: {
                diagnosis: 'Ketoasidosis Diabetik (KAD)',
                symptoms: ['Napas Kussmaul', 'Dehidrasi berat', 'Bau aseton', 'Nyeri perut', 'Penurunan kesadaran'],
                clue: '[CRITICAL] DM tipe 1/2 dengan napas Kussmaul, bau aseton, dan glukosa >300. Mulai resusitasi cairan dan insulin drip. Pantau kalium ketat.',
                anamnesis: [
                    'Insulin habis 3 hari, sekarang lemas, muntah, napas cepat dan dalam, serta tercium bau aseton.',
                    'Pasien DM tipe 1 putus obat, datang dengan dehidrasi berat dan penurunan kesadaran.'
                ],
                anamnesisQuestions: {
                    keluhan_utama: [
                        { id: 'q_event', text: 'Apa yang terjadi?', response: 'Muntah-muntah sejak kemarin, Dok, lemas, napasnya cepat.', priority: 'essential' },
                        { id: 'q_insulin', text: 'Injeksi insulin rutin?', response: 'Sudah 3 hari tidak suntik, Dok, insulinnya habis.', priority: 'essential' },
                        { id: 'q_thirst', text: 'Banyak minum?', response: 'Haus terus dan kencing terus, Dok.', priority: 'essential' }
                    ],
                    rpd: [
                        { id: 'q_dm', text: 'DM sudah berapa lama?', response: 'Sejak umur 22, Dok, DM tipe 1.' },
                        { id: 'q_prev_dka', text: 'Pernah KAD sebelumnya?', response: 'Pernah 2 kali, harus dirawat juga.' }
                    ],
                    sosial: []
                },
                differentialDiagnosis: ['HHS', 'Asidosis laktat', 'Keracunan metanol', 'Uremia']
            },
            hhs_hyperosmolar: {
                diagnosis: 'Status Hiperglikemik Hiperosmolar (HHS)',
                symptoms: ['Penurunan kesadaran berat', 'Dehidrasi berat', 'GDS >600', 'Tidak ada bau aseton', 'Kejang'],
                clue: '[CRITICAL] Lansia DM tipe 2 dengan glukosa >600 dan dehidrasi berat tanpa bau aseton. Curiga HHS. Mortalitas tinggi, rehidrasi agresif.',
                anamnesis: [
                    'Nenek usia 70 tahun dengan diabetes, makin lemas selama seminggu, sekarang tidak sadar, GDS lebih dari 600.',
                    'Pasien DM tipe 2 lansia dengan dehidrasi berat, koma, tanpa napas Kussmaul.'
                ],
                anamnesisQuestions: {
                    keluhan_utama: [
                        { id: 'q_event', text: 'Kapan mulai lemas?', response: 'Sudah seminggu makin lemas, tadi pagi tidak bisa bangun.', priority: 'essential' },
                        { id: 'q_drink', text: 'Banyak minum?', response: 'Haus terus tapi tetap lemas, kencing sangat banyak.', priority: 'essential' }
                    ],
                    rpd: [
                        { id: 'q_dm', text: 'Ada kencing manis?', response: 'Ada, Dok, minum Metformin, tapi sering lupa.', priority: 'essential' },
                        { id: 'q_infeksi', text: 'Ada demam atau infeksi?', response: 'Batuk pilek dari 2 minggu lalu, Dok.' }
                    ],
                    sosial: []
                },
                differentialDiagnosis: ['KAD', 'Stroke', 'Sepsis', 'Keracunan']
            },
            anaphylaxis: {
                diagnosis: 'Syok Anafilaksis',
                symptoms: ['Sesak napas (stridor/wheezing)', 'Urtikaria (biduran) seluruh tubuh', 'Bibir/mata bengkak (angioedema)', 'TD turun (syok)', 'Pucat/lemas'],
                clue: '[CRITICAL] Syok anafilaksis mengancam nyawa. Segera berikan epinefrin IM, jangan tunda. Jaga jalan napas.',
                anamnesis: [
                    'Pasien baru disuntik antibiotik, tiba-tiba sesak dan gatal-gatal.',
                    'Bibirnya bengkak, kulitnya merah semua, lemas.'
                ],
                anamnesisQuestions: {
                    keluhan_utama: [
                        { id: 'q_event', text: 'Tadi habis kena apa?', response: 'Habis disuntik antibiotik dok, langsung sesak begini.', priority: 'essential' },
                        { id: 'q_skin', text: 'Ada gatal-gatal atau bengkak?', response: 'Iya dok, badan merah semua dan bibirnya tebal.', priority: 'essential' },
                        { id: 'q_allergy', text: 'Ada riwayat alergi?', response: 'Pernah alergi seafood bengkak-bengkak juga.', priority: 'essential' }
                    ],
                    medis: [],
                    sosial: []
                },
                differentialDiagnosis: ['Angioedema herediter', 'Serangan asma akut', 'Reaksi urtikaria berat']
            },
            angioedema_severe: {
                diagnosis: 'Angioedema Berat',
                symptoms: ['Bengkak bibir/mata/lidah masif', 'Suara serak', 'Kesulitan menelan', 'Gatal minimal', 'Tanpa urtikaria'],
                clue: '[URGENT] Angioedema tanpa urtikaria bisa dipicu ACE inhibitor. Hentikan obat, berikan steroid plus antihistamin, dan awasi jalan napas ketat.',
                anamnesis: [
                    'Bibir dan mata bengkak besar tiba-tiba, suara serak, susah menelan.',
                    'Minum obat tensi baru, 2 jam kemudian muka bengkak-bengkak.'
                ],
                anamnesisQuestions: {
                    keluhan_utama: [
                        { id: 'q_swell', text: 'Bengkaknya sejak kapan?', response: 'Dari 2 jam lalu dok, makin besar, bibir tebal banget.', priority: 'essential' },
                        { id: 'q_breathe', text: 'Ada sesak?', response: 'Agak susah menelan dok, suara juga agak serak.', priority: 'essential' },
                        { id: 'q_meds', text: 'Minum obat apa?', response: 'Captopril dok, buat darah tinggi.', priority: 'essential' }
                    ],
                    rpd: [
                        { id: 'q_prev', text: 'Pernah bengkak begini?', response: 'Pernah sekali dulu tapi nggak separah ini.' },
                        { id: 'q_allergy', text: 'Ada alergi?', response: 'Nggak ada alergi makanan dok.' }
                    ],
                    sosial: []
                },
                differentialDiagnosis: ['Anafilaksis', 'Angioedema herediter (HAE)', 'Selulitis fasialis', 'Sindrom nefrotik']
            },
            dengue_warning_signs: {
                diagnosis: 'DBD dengan Warning Signs',
                symptoms: ['Demam tinggi', 'Nyeri perut hebat', 'Muntah persisten', 'Perdarahan gusi/hidung', 'Lemas berat'],
                clue: '[URGENT] DBD dengan warning signs: nyeri perut, muntah, perdarahan, dan letargi. Monitor kebocoran plasma secara ketat.',
                anamnesis: [
                    'Sudah demam 4 hari dok, tapi hari ini perut sakit banget dan muntah terus.',
                    'Gusinya berdarah sendiri, badan lemas banget.'
                ],
                anamnesisQuestions: {
                    keluhan_utama: [
                        { id: 'q_fever', text: 'Demam hari ke berapa?', response: 'Hari ke-4 dok, tapi hari ini suhunya agak turun.', priority: 'essential' },
                        { id: 'q_pain', text: 'Ada nyeri perut?', response: 'Iya perut saya sakit sekali dok, ulu hati rasanya ditekan.', priority: 'essential' },
                        { id: 'q_bleed', text: 'Ada perdarahan gusi atau mimisan?', response: 'Tadi pagi sikat gigi berdarah terus dok.', priority: 'essential' }
                    ],
                    rps: [
                        { id: 'q_vomit', text: 'Ada muntah?', response: 'Muntah terus dok, minum aja dimuntahin.' },
                        { id: 'q_urine', text: 'BAK masih banyak?', response: 'Agak berkurang dok jumlahnya.' }
                    ],
                    rpd: [],
                    sosial: []
                },
                differentialDiagnosis: ['Demam tifoid', 'Leptospirosis', 'Chikungunya', 'Malaria']
            },
            severe_malaria: {
                diagnosis: 'Malaria Berat (P. falciparum)',
                symptoms: ['Demam tinggi periodik', 'Penurunan kesadaran', 'Anemia berat (pucat)', 'Ikterus', 'Urin gelap (black water)'],
                clue: '[CRITICAL] Malaria berat berarti demam, penurunan kesadaran, dan anemia berat. Mulai artesunat IV segera, jangan tunggu hasil lab.',
                anamnesis: [
                    'Demam 5 hari periodik, baru dari Papua, sekarang nggak sadar, pucat berat.',
                    'Demam panas-dingin, kuning, kencing gelap, lemas berat.'
                ],
                anamnesisQuestions: {
                    keluhan_utama: [
                        { id: 'q_fever', text: 'Demamnya pola gimana?', response: 'Panas-dingin bergantian dok, sudah 5 hari, makin parah.', priority: 'essential' },
                        { id: 'q_travel', text: 'Baru dari mana?', response: 'Baru pulang dari Papua 2 minggu lalu dok.', priority: 'essential' },
                        { id: 'q_urine', text: 'Warna kencing gimana?', response: 'Gelap kayak teh pekat dok, kadang coklat.', priority: 'essential' }
                    ],
                    rpd: [
                        { id: 'q_malaria', text: 'Pernah malaria?', response: 'Pernah 2 kali waktu di Papua dok.' }
                    ],
                    sosial: []
                },
                differentialDiagnosis: ['Demam tifoid', 'Leptospirosis', 'Hepatitis akut', 'Sepsis']
            },
            sepsis: {
                diagnosis: 'Sepsis',
                symptoms: ['Demam tinggi / hipotermia', 'Takikardia', 'Hipotensi', 'Perubahan kesadaran', 'Akral dingin mottled'],
                clue: '[CRITICAL] qSOFA 2 atau lebih sangat mengarah ke sepsis. Segera mulai resusitasi cairan dan berikan antibiotik dalam 1 jam pertama.',
                anamnesis: [
                    'Demam tinggi 3 hari dari ISK, sekarang nggak sadar, tangan kaki dingin belang-belang.',
                    'Sepsis curiga sumber urologis, hipotensi, akral mottled.'
                ],
                anamnesisQuestions: {
                    keluhan_utama: [
                        { id: 'q_event', text: 'Apa keluhannya?', response: 'Ibu saya demam tinggi 3 hari, sekarang nggak sadar dok.', priority: 'essential' },
                        { id: 'q_source', text: 'Ada infeksi sebelumnya?', response: 'Dari kencing sakit, demam-demam terus.', priority: 'essential' },
                        { id: 'q_cold', text: 'Tangan kakinya dingin?', response: 'Iya dok dingin banget, kulitnya belang-belang.', priority: 'essential' }
                    ],
                    rpd: [
                        { id: 'q_dm', text: 'Ada kencing manis?', response: 'Ada dok, DM tapi nggak kontrol.' }
                    ],
                    sosial: []
                },
                differentialDiagnosis: ['Syok kardiogenik', 'Syok anafilaktik', 'KAD', 'Malaria berat']
            },
            seizure_ongoing: {
                diagnosis: 'Status Epileptikus',
                symptoms: ['Kejang tidak berhenti (>5 menit)', 'Tidak sadar di antara kejang', 'Kekakuan seluruh tubuh', 'Sianosis'],
                clue: '[CRITICAL] Status epileptikus adalah kejang lebih dari 5 menit atau berulang tanpa sadar di antaranya. Segera berikan diazepam IV atau rektal.',
                anamnesis: [
                    'Pasien sudah kejang 10 menit tidak berhenti!',
                    'Ada riwayat epilepsi, tadi lupa minum obat.'
                ],
                anamnesisQuestions: {
                    keluhan_utama: [
                        { id: 'q_event', text: 'Kejangnya sudah berapa lama?', response: 'Sudah 10 menit nggak berhenti-berhenti dok!', priority: 'essential' },
                        { id: 'q_epilepsy', text: 'Ada riwayat epilepsi?', response: 'Ada dok, bapak memang punya sakit ayan.', priority: 'essential' }
                    ],
                    rps: [
                        { id: 'q_conscious', text: 'Tadi sempat sadar di antara kejang?', response: 'Enggak dok, dari tadi kaku terus matanya mendelik.' }
                    ],
                    rpd: [
                        { id: 'q_compliance', text: 'Rutin minum obat?', response: 'Sering lupa dok.' }
                    ],
                    sosial: []
                },
                differentialDiagnosis: ['Kejang simptomatik (hipoglikemia)', 'Meningitis/Ensefalitis', 'Trauma kepala']
            },
            cva_stroke: {
                diagnosis: 'Stroke / CVA (Cerebrovascular Accident)',
                symptoms: ['Kelemahan separuh badan', 'Bicara pelo', 'Wajah mencong', 'Penurunan kesadaran', 'Nyeri kepala hebat'],
                clue: '[CRITICAL] FAST: Face drooping, Arm weakness, Speech difficulty, Time to call. Golden period 3-4.5 jam untuk trombolisis.',
                anamnesis: [
                    'Tiba-tiba tangan kiri nggak bisa diangkat, mulut mencong, bicara pelo.',
                    'Onset akut 1 jam, hemiparesis kiri, disartria, wajah asimetris.'
                ],
                anamnesisQuestions: {
                    keluhan_utama: [
                        { id: 'q_onset', text: 'Kapan gejalanya mulai?', response: 'Baru 1 jam lalu dok, tiba-tiba tangan kiri nggak bisa diangkat.', priority: 'essential' },
                        { id: 'q_face', text: 'Wajahnya mencong?', response: 'Iya dok, yang kiri turun, air liur keluar terus.', priority: 'essential' },
                        { id: 'q_speech', text: 'Bicaranya normal?', response: 'Pelo dok, susah ngomong.', priority: 'essential' }
                    ],
                    rpd: [
                        { id: 'q_ht', text: 'Ada darah tinggi?', response: 'Iya dok, nggak rutin minum obat.' },
                        { id: 'q_dm', text: 'Ada kencing manis?', response: 'Ada juga dok.' }
                    ],
                    sosial: [
                        { id: 'q_smoke', text: 'Merokok?', response: 'Sudah 20 tahun merokok dok.' }
                    ]
                },
                differentialDiagnosis: ['Hipoglikemia', 'Bells palsy', 'Ensefalitis', 'Tumor intrakranial']
            },
            near_drowning: {
                diagnosis: 'Near Drowning (Hampir Tenggelam)',
                symptoms: ['Sesak napas berat', 'Batuk berbusa', 'Sianosis', 'Penurunan kesadaran', 'Hipotermia'],
                clue: '[CRITICAL] Korban tenggelam: utamakan airway, breathing, circulation. Cegah hipotermia dan awasi edema paru sekunder.',
                anamnesis: [
                    'Anak tenggelam di sungai dok, sudah dipijit-pijit warga tapi masih sesak napas.',
                    'Korban tenggelam di kolam, sudah batuk keluar air tapi masih lemas dan sesak berat.'
                ],
                anamnesisQuestions: {
                    keluhan_utama: [
                        { id: 'q_event', text: 'Tenggelamnya di mana?', response: 'Di sungai dok, lagi mandi.', priority: 'essential' },
                        { id: 'q_duration', text: 'Berapa lama di dalam air?', response: 'Katanya tetangga sekitar 3-5 menit dok.', priority: 'essential' },
                        { id: 'q_cpr', text: 'Sudah ditolong di tempat?', response: 'Iya dok, ditekan-tekan dadanya sama warga sampai batuk keluar air.', priority: 'essential' }
                    ],
                    rps: [
                        { id: 'q_conscious', text: 'Sempat pingsan?', response: 'Pingsan sebentar dok, sekarang sudah mulai sadar tapi sesak.' }
                    ],
                    rpd: [],
                    sosial: []
                },
                differentialDiagnosis: ['Edema paru akut', 'Aspirasi pneumonia', 'Hipotermia berat', 'Cedera servikal']
            },
            eclampsia: {
                diagnosis: 'Eklampsia',
                symptoms: ['Kejang pada ibu hamil', 'TD sangat tinggi', 'Edema anasarka', 'Proteinuria masif', 'Penurunan kesadaran'],
                clue: '[CRITICAL] Ibu hamil dengan kejang dan TD di atas 160/110 adalah eklampsia sampai terbukti sebaliknya. Berikan magnesium sulfat segera dan rujuk untuk tata laksana obstetri definitif.',
                anamnesis: [
                    'Ibu hamil 8 bulan kejang 2 kali di rumah, tensinya tinggi, kaki bengkak besar.',
                    'Primigravida eklampsia, onset seizure 2x, TD >160/110, pandangan kabur.'
                ],
                anamnesisQuestions: {
                    keluhan_utama: [
                        { id: 'q_seizure', text: 'Kejangnya berapa kali?', response: 'Sudah 2 kali dok, di rumah tadi.', priority: 'essential' },
                        { id: 'q_gest', text: 'Hamil berapa bulan?', response: '8 bulan dok.', priority: 'essential' },
                        { id: 'q_headache', text: 'Ada nyeri kepala sebelumnya?', response: 'Dari kemarin pusing berat dan pandangan kabur.', priority: 'essential' }
                    ],
                    rpd: [
                        { id: 'q_anc', text: 'Kontrol kehamilan rutin?', response: 'Cuma 2 kali dok, di bidan.' },
                        { id: 'q_prev_pe', text: 'Kehamilan sebelumnya ada tekanan tinggi?', response: 'Anak pertama ini dok.' }
                    ],
                    sosial: []
                },
                differentialDiagnosis: ['Epilepsi pada kehamilan', 'Stroke', 'Meningitis', 'Hipoglikemia']
            },
            febrile_convulsion: {
                diagnosis: 'Kejang Demam Sederhana',
                symptoms: ['Kejang saat demam', 'Usia 6 bulan - 5 tahun', 'Kejang <15 menit', 'Pasca kejang sadar'],
                clue: '[OBSERVATION] Kejang demam sederhana pada balita yang sudah berhenti dan anak sudah sadar. Cari fokus infeksi, lalu turunkan demam.',
                anamnesis: [
                    'Anak saya kejang dok, tadi demamnya tinggi banget.',
                    'Kejangnya sekitar 2 menit, sekarang sudah berhenti dan sudah mulai sadar.'
                ],
                anamnesisQuestions: {
                    keluhan_utama: [
                        { id: 'q_event', text: 'Kejangnya berapa lama?', response: 'Sebentar dok, paling cuma 1-2 menit.', priority: 'essential' },
                        { id: 'q_fever', text: 'Demamnya tinggi?', response: 'Panas banget dok badannya pas kejang tadi.' }
                    ],
                    rps: [
                        { id: 'q_conscious', text: 'Setelah kejang langsung nangis?', response: 'Iya dok, langsung nangis dan sadar.' },
                        { id: 'q_repeat', text: 'Kejang berulang?', response: 'Cuma sekali ini aja dok.' }
                    ],
                    rpd: [
                        { id: 'q_prev', text: 'Pernah kejang sebelumnya?', response: 'Belum pernah dok.', priority: 'essential' },
                        { id: 'q_family', text: 'Keluarga ada riwayat kejang demam?', response: 'Ayahnya dulu waktu kecil suka step.' }
                    ],
                    sosial: []
                },
                differentialDiagnosis: ['Meningitis', 'Epilepsi', 'Kejang demam kompleks']
            },
            head_injury_moderate: {
                diagnosis: 'Cedera Kepala Sedang (CKS)',
                symptoms: ['Penurunan kesadaran (GCS 9-13)', 'Muntah proyektil', 'Amnesia', 'Pupil anisokor', 'Lucid interval'],
                clue: '[URGENT] CKS dengan GCS 9-13. Waspadai lucid interval karena bisa berlanjut ke herniasi. Immobilisasi C-spine, head-up 30 derajat, dan monitor GCS tiap 15 menit.',
                anamnesis: [
                    'KLL motor, pingsan 10 menit, sekarang bingung, muntah proyektil 3x.',
                    'Cedera kepala dengan amnesia, GCS turun, dan pupil mulai anisokor.'
                ],
                anamnesisQuestions: {
                    keluhan_utama: [
                        { id: 'q_event', text: 'Bagaimana kejadiannya?', response: 'Kecelakaan motor kecepatan tinggi, kepala kena trotoar.', priority: 'essential' },
                        { id: 'q_conscious', text: 'Pingsan berapa lama?', response: 'Pingsan sekitar 10 menit dok, sekarang bingung-bingung.', priority: 'essential' },
                        { id: 'q_vomit', text: 'Ada muntah?', response: 'Muntah 3 kali dok, menyembur.', priority: 'essential' }
                    ],
                    rps: [
                        { id: 'q_amnesia', text: 'Ingat kejadiannya?', response: 'Nggak ingat dok, tahu-tahu sudah di sini.' },
                        { id: 'q_helmet', text: 'Pakai helm?', response: 'Pakai tapi helmnya pecah.' }
                    ],
                    rpd: [
                        { id: 'q_blood_thin', text: 'Minum obat pengencer darah?', response: 'Tidak dok.' }
                    ],
                    sosial: []
                },
                differentialDiagnosis: ['Epidural hematoma', 'Subdural hematoma', 'Contusio serebri', 'Fraktur basis cranii']
            },
            laceration_minor: {
                diagnosis: 'Luka Robek Ringan',
                symptoms: ['Luka terbuka', 'Perdarahan terkontrol', 'Nyeri moderat'],
                clue: '[OBSERVATION] Luka robek sederhana. Bersihkan dengan NaCl, jahit, dan cek status imunisasi tetanus.',
                anamnesis: [
                    'Tangan saya kena pisau dok waktu masak, lukanya lumayan panjang.',
                    'Sudah saya tekan pakai kain, darahnya sudah agak berhenti.'
                ],
                anamnesisQuestions: {
                    keluhan_utama: [
                        { id: 'q_incident', text: 'Kenapa lukanya?', response: 'Kena pisau waktu potong bawang tadi dok.', priority: 'essential' },
                        { id: 'q_move', text: 'Masih bisa digerakkan jarinya?', response: 'Masih bisa dok, cuma sakit aja kalau ditekuk.', priority: 'essential' },
                        { id: 'q_tetanus', text: 'Kapan terakhir suntik TT?', response: 'Waktu SD kayaknya dok, sudah lama banget.', priority: 'essential' }
                    ],
                    medis: [
                        { id: 'q_keloid', text: 'Punya bakat keloid?', response: 'Nggak ada dok.' }
                    ],
                    sosial: []
                },
                differentialDiagnosis: ['Laserasi dengan cedera tendon', 'Fraktur terbuka', 'Vulnus punctum']
            },
            head_injury_mild: {
                diagnosis: 'Cedera Kepala Ringan (CKR)',
                symptoms: ['Nyeri kepala pasca benturan', 'Pusing', 'Mual', 'Luka lecet atau hematoma kepala'],
                clue: '[OBSERVATION] Cedera kepala ringan dengan GCS 15. Observasi kesadaran dan cari tanda bahaya seperti muntah, amnesia, atau pupil anisokor.',
                anamnesis: [
                    'Baru kecelakaan motor dok, kepala kena aspal. Pusing tapi nggak pingsan.',
                    'Jatuh dari tangga, kepala kebentur tembok. Mual tapi belum muntah.'
                ],
                anamnesisQuestions: {
                    keluhan_utama: [
                        { id: 'q_event', text: 'Kejadiannya bagaimana?', response: 'Jatuh dari motor dok, kepala kena aspal.', priority: 'essential' },
                        { id: 'q_conscious', text: 'Sempat pingsan?', response: 'Nggak pingsan dok, cuma pusing aja.' }
                    ],
                    rps: [
                        { id: 'q_vomit', text: 'Ada muntah?', response: 'Belum muntah dok, cuma mual.', priority: 'essential' },
                        { id: 'q_amnesia', text: 'Ingat kejadiannya?', response: 'Ingat dok, semua ingat.' },
                        { id: 'q_headache', text: 'Sakitnya makin berat?', response: 'Masih sama aja dok, nggak tambah berat.' }
                    ],
                    rpd: [
                        { id: 'q_blood_thin', text: 'Minum obat pengencer darah?', response: 'Tidak ada dok.' }
                    ],
                    sosial: [
                        { id: 'q_helmet', text: 'Pakai helm?', response: 'Nggak pakai dok, cuma deket rumah.' }
                    ]
                },
                differentialDiagnosis: ['Cedera kepala sedang (CKS)', 'Perdarahan epidural', 'Fraktur basis cranii']
            },
            snake_bite: {
                diagnosis: 'Gigitan Ular Berbisa',
                symptoms: ['Luka gigitan 2 puncture marks', 'Bengkak progresif', 'Nyeri hebat', 'Mual', 'Perdarahan dari luka'],
                clue: '[URGENT] Gigitan ular dengan tanda envenomasi: bengkak progresif dan nyeri hebat. Lakukan imobilisasi dan berikan antivenom bila tersedia.',
                anamnesis: [
                    'Digigit ular di sawah dok, kakinya bengkak besar, sakitnya luar biasa.',
                    'Baru digigit ular hijau setengah jam lalu, bengkaknya cepat sekali naik.'
                ],
                anamnesisQuestions: {
                    keluhan_utama: [
                        { id: 'q_event', text: 'Kapan digigitnya?', response: 'Baru setengah jam lalu dok, di sawah.', priority: 'essential' },
                        { id: 'q_snake', text: 'Ularnya seperti apa?', response: 'Hijau dok, kecil, di pohon.', priority: 'essential' }
                    ],
                    rps: [
                        { id: 'q_swell', text: 'Bengkaknya bertambah?', response: 'Iya dok, tadi cuma di jari, sekarang sampai pergelangan.', priority: 'essential' },
                        { id: 'q_numb', text: 'Ada mati rasa?', response: 'Kesemutan sampai lengan dok.' },
                        { id: 'q_nausea', text: 'Mual atau pusing?', response: 'Iya mual dok, pusing juga.' }
                    ],
                    rpd: [
                        { id: 'q_allergy', text: 'Pernah alergi?', response: 'Nggak pernah dok.' }
                    ],
                    sosial: [
                        { id: 'q_treatment', text: 'Sudah diapakan lukanya?', response: 'Dibalut sama tetangga dok, dikasih obat tradisional.' }
                    ]
                },
                differentialDiagnosis: ['Gigitan serangga', 'Selulitis', 'Reaksi alergi lokal']
            },
            burn_second_degree: {
                diagnosis: 'Combustio Grade II (<20% TBSA)',
                symptoms: ['Luka melepuh (bula)', 'Nyeri hebat', 'Kulit merah basah', 'Edema lokal'],
                clue: '[URGENT] Luka bakar grade II. Cooling 20 menit, jangan pecahkan bula, dan hitung %TBSA untuk keputusan resusitasi cairan.',
                anamnesis: [
                    'Kena air mendidih dok, lengan sama dada melepuh-lepuh perih sekali.',
                    'Tumpah minyak goreng panas, kulitnya langsung merah melepuh.'
                ],
                anamnesisQuestions: {
                    keluhan_utama: [
                        { id: 'q_event', text: 'Kenapa bisa kena?', response: 'Kena air panas dok, tumpah dari kompor.', priority: 'essential' },
                        { id: 'q_when', text: 'Kejadiannya kapan?', response: 'Baru 30 menit lalu dok.', priority: 'essential' }
                    ],
                    rps: [
                        { id: 'q_area', text: 'Kena di mana saja?', response: 'Lengan kanan sama dada dok.', priority: 'essential' },
                        { id: 'q_pain', text: 'Sakitnya seperti apa?', response: 'Perih dan panas banget dok, nggak tahan.' },
                        { id: 'q_first_aid', text: 'Sudah diapakan?', response: 'Dikasih pasta gigi sama tetangga dok.' }
                    ],
                    rpd: [
                        { id: 'q_dm', text: 'Ada kencing manis?', response: 'Nggak ada dok.' }
                    ],
                    sosial: []
                },
                differentialDiagnosis: ['Combustio grade III', 'Chemical burn', 'Sunburn berat']
            },
            open_fracture: {
                diagnosis: 'Fraktur Terbuka',
                symptoms: ['Tulang terlihat menonjol', 'Deformitas ekstremitas', 'Perdarahan aktif dari luka', 'Nyeri hebat', 'Tidak bisa digerakkan'],
                clue: '[URGENT] Fraktur terbuka dengan tulang terlihat. Jangan reposisi di lapangan. Irigasi NaCl, tutup kasa basah steril, bidai, serta berikan ATS dan antibiotik.',
                anamnesis: [
                    'KLL motor, kaki kanan bengkok, tulang keluar dari kulit, darah banyak.',
                    'Tertindih motor, fraktur terbuka tibia, perdarahan aktif.'
                ],
                anamnesisQuestions: {
                    keluhan_utama: [
                        { id: 'q_event', text: 'Apa yang terjadi?', response: 'Kecelakaan motor dok, kaki kanan tertindih motor, sekarang tulangnya keluar.', priority: 'essential' },
                        { id: 'q_move', text: 'Bisa digerakkan?', response: 'Nggak bisa sama sekali dok, sakit luar biasa.', priority: 'essential' },
                        { id: 'q_bleed', text: 'Darahnya banyak?', response: 'Banyak dok, sudah dibalut tapi masih merembes.', priority: 'essential' }
                    ],
                    rps: [
                        { id: 'q_numbness', text: 'Ada mati rasa di bawahnya?', response: 'Agak kebas di telapak kaki dok.' }
                    ],
                    rpd: [
                        { id: 'q_tt', text: 'Kapan terakhir suntik tetanus?', response: 'Nggak ingat dok.' }
                    ],
                    sosial: []
                },
                differentialDiagnosis: ['Fraktur tertutup', 'Dislokasi', 'Sindrom kompartemen', 'Crush injury']
            },
            organophosphate_poisoning: {
                diagnosis: 'Keracunan Organofosfat (Pestisida)',
                symptoms: ['Hipersalivasi (mulut berbusa)', 'Miosis (pupil kecil)', 'Bradikardia', 'Diare atau inkontinensia', 'Kejang', 'Bau pestisida'],
                clue: '[CRITICAL] SLUDGE: salivation, lacrimation, urination, defecation, GI distress, emesis. Antidot utama adalah atropin dan pralidoxime.',
                anamnesis: [
                    'Minum racun serangga 30 menit lalu, muntah berbusa, keringat banyak, kencing di celana.',
                    'Intentional self-harm organofosfat, sindrom SLUDGE, pupil pinpoint.'
                ],
                anamnesisQuestions: {
                    keluhan_utama: [
                        { id: 'q_event', text: 'Apa yang terjadi?', response: 'Minum racun serangga dok, sengaja.', priority: 'essential' },
                        { id: 'q_what', text: 'Merk apa yang diminum?', response: 'Baygon cair dok, sekitar setengah botol.', priority: 'essential' },
                        { id: 'q_when', text: 'Kapan minumnya?', response: 'Baru 30 menit lalu dok.', priority: 'essential' }
                    ],
                    rps: [
                        { id: 'q_vomit', text: 'Sudah muntah?', response: 'Muntah-muntah terus dok, keluar busa dari mulut.' },
                        { id: 'q_breathe', text: 'Sesak?', response: 'Iya napasnya bunyi-bunyi dok.' }
                    ],
                    rpd: [
                        { id: 'q_psych', text: 'Ada masalah?', response: 'Stres dok, baru putus sama pacar.', priority: 'essential' }
                    ],
                    sosial: []
                },
                differentialDiagnosis: ['Keracunan karbamat', 'Keracunan jamur', 'Myasthenia gravis', 'Overdosis opioid']
            },
            food_poisoning_acute: {
                diagnosis: 'Keracunan Makanan Akut',
                symptoms: ['Mual muntah hebat', 'Diare profus', 'Nyeri perut kolik', 'Lemas atau pucat', 'Banyak berkeringat'],
                clue: '[URGENT] Riwayat makan makanan mencurigakan diikuti muntah dan diare masif. Cegah dehidrasi dan identifikasi zat penyebab.',
                anamnesis: [
                    'Muntah-muntah terus dok setelah makan nasi bungkus. Teman saya juga kena.',
                    'Baru makan 3 jam lalu, langsung mual, muntah, diare cair, lemas sekali.'
                ],
                anamnesisQuestions: {
                    keluhan_utama: [
                        { id: 'q_event', text: 'Makan apa terakhir?', response: 'Makan nasi bungkus dari warung dok, 3 jam lalu.', priority: 'essential' },
                        { id: 'q_onset', text: 'Mulai kapan mualnya?', response: 'Baru 2 jam ini dok, langsung muntah terus.' }
                    ],
                    rps: [
                        { id: 'q_vomit_freq', text: 'Sudah berapa kali muntah?', response: 'Sudah 6-7 kali dok, nggak berhenti.', priority: 'essential' },
                        { id: 'q_diarrhea', text: 'Ada diare?', response: 'Iya cair banget dok, sudah 4 kali.' },
                        { id: 'q_others', text: 'Yang lain juga sakit?', response: 'Teman saya yang makan bareng juga muntah-muntah dok.', priority: 'essential' }
                    ],
                    rpd: [],
                    sosial: []
                },
                differentialDiagnosis: ['Gastroenteritis akut', 'Keracunan pestisida', 'Apendisitis akut', 'Kolera']
            },
            severe_dehydration_shock: {
                diagnosis: 'Syok Hipovolemik (Dehidrasi Berat)',
                symptoms: ['Tidak sadar atau gelisah', 'Mata cekung', 'Kulit sangat kering dengan turgor sangat lambat', 'Nadi lemah cepat', 'Tidak bisa minum'],
                clue: '[CRITICAL] Diare berat dengan tanda syok: nadi lemah, akral dingin, dan turgor sangat lambat. Resusitasi cairan segera.',
                anamnesis: [
                    'Anak saya diare 2 hari nggak berhenti, sekarang lemas nggak sadar dok!',
                    'Diare cair terus, sudah nggak bisa minum, matanya cekung, nggak kencing dari pagi.'
                ],
                anamnesisQuestions: {
                    keluhan_utama: [
                        { id: 'q_event', text: 'Diare sudah berapa hari?', response: 'Sudah 2 hari dok, makin parah.', priority: 'essential' },
                        { id: 'q_vomit', text: 'Ada muntah?', response: 'Iya dok, minum apa aja keluar lagi.', priority: 'essential' },
                        { id: 'q_urine', text: 'Terakhir BAK kapan?', response: 'Sudah dari tadi pagi nggak kencing dok.', priority: 'essential' }
                    ],
                    rps: [
                        { id: 'q_frequency', text: 'Berapa kali BAB cair?', response: 'Sudah nggak bisa dihitung dok, >10 kali sehari.' },
                        { id: 'q_drink', text: 'Masih bisa minum?', response: 'Nggak kuat minum dok, dimuntahkan lagi.' }
                    ],
                    rpd: [],
                    sosial: []
                },
                differentialDiagnosis: ['Kolera', 'Keracunan', 'Intususepsi (pada anak)', 'Syok septik']
            },
            hematemesis_melena: {
                diagnosis: 'Hematemesis Melena (Perdarahan Saluran Cerna Atas)',
                symptoms: ['Muntah darah (hitam atau merah segar)', 'BAB hitam', 'Pucat lemas', 'Hipotensi', 'Takikardia'],
                clue: '[CRITICAL] Hematemesis berarti perdarahan GI atas. Resusitasi cairan, pasang NGT, dan siapkan crossmatch sambil mencari sumber seperti varises, erosi, atau ulkus.',
                anamnesis: [
                    'Muntah hitam seperti ampas kopi, BAB hitam, pusing, lemas.',
                    'Hematemesis masif + melena, pucat berat, curiga perdarahan GI atas.'
                ],
                anamnesisQuestions: {
                    keluhan_utama: [
                        { id: 'q_vomit', text: 'Muntah darah warnanya apa?', response: 'Hitam kayak ampas kopi dok, banyak banget.', priority: 'essential' },
                        { id: 'q_stool', text: 'BAB warnanya gimana?', response: 'Hitam-hitam lengket kayak aspal dok.', priority: 'essential' },
                        { id: 'q_dizzy', text: 'Pusing?', response: 'Pusing banget dok, kayak mau pingsan kalau berdiri.', priority: 'essential' }
                    ],
                    rpd: [
                        { id: 'q_ulcer', text: 'Ada maag atau sakit lambung?', response: 'Sering maag dok, sering minum jamu campur piroxicam.' },
                        { id: 'q_liver', text: 'Ada penyakit hati?', response: 'Nggak tahu dok, belum pernah periksa.' }
                    ],
                    sosial: [
                        { id: 'q_alcohol', text: 'Minum alkohol?', response: 'Kadang-kadang dok, pas kumpulan.' }
                    ]
                },
                differentialDiagnosis: ['Varises esofagus pecah', 'Ulkus peptikum perforasi', 'Gastritis erosif', 'Mallory-Weiss tear']
            },
            suicide_attempt: {
                diagnosis: 'Percobaan Bunuh Diri (Deliberate Self-Harm)',
                symptoms: ['Luka sayatan di pergelangan tangan', 'Perdarahan aktif', 'Tenang abnormal atau agitasi', 'Riwayat ideasi bunuh diri'],
                clue: '[URGENT] DSH: atasi luka fisik dulu, lalu asesmen psikiatri. Jangan tinggalkan pasien sendirian.',
                anamnesis: [
                    'Sayatan di pergelangan tangan bilateral, pasien tampak tenang abnormal.',
                    'Percobaan bunuh diri dengan silet, riwayat percobaan sebelumnya juga ada.'
                ],
                anamnesisQuestions: {
                    keluhan_utama: [
                        { id: 'q_event', text: 'Apa yang terjadi?', response: '(Diam)... Saya nggak mau hidup lagi dok.', priority: 'essential' },
                        { id: 'q_method', text: 'Pakai apa?', response: 'Silet dok, di pergelangan.', priority: 'essential' },
                        { id: 'q_intent', text: 'Sudah lama mau melakukan ini?', response: 'Sudah beberapa bulan mikir terus dok.', priority: 'essential' }
                    ],
                    rpd: [
                        { id: 'q_psych', text: 'Pernah ke psikiater?', response: 'Belum pernah dok.' },
                        { id: 'q_prev', text: 'Pernah coba sebelumnya?', response: 'Pernah minum obat nyamuk tapi dimuntahkan.', priority: 'essential' }
                    ],
                    sosial: [
                        { id: 'q_trigger', text: 'Ada masalah yang berat?', response: 'Masalah utang dok, rumah tangga juga berantakan.' }
                    ]
                },
                differentialDiagnosis: ['Self-harm non-suicidal', 'Gangguan kepribadian borderline', 'Depresi berat', 'Psikosis']
            },
            bronchiolitis_severe: {
                diagnosis: 'Bronkiolitis Berat',
                symptoms: ['Sesak napas berat pada bayi', 'Wheezing', 'Retraksi dinding dada', 'Napas cuping hidung', 'Sulit menyusu'],
                clue: '[URGENT] Bayi <2 tahun dengan sesak dan wheezing setelah ISPA. Curiga bronkiolitis RSV: oksigenasi adalah prioritas utama, bukan bronkodilator.',
                relevantLabs: ['SpO2', 'Darah Lengkap'],
                anamnesis: [
                    'Bayi saya sesak napas dok, awalnya pilek biasa tapi makin berat, nggak mau nyusu.',
                    'Napasnya bunyi ngik-ngik, dadanya kelihatan cekung-cekung.'
                ],
                anamnesisQuestions: {
                    keluhan_utama: [
                        { id: 'q_onset', text: 'Sesaknya sejak kapan?', response: 'Dari kemarin makin berat dok, awalnya cuma pilek.', priority: 'essential' },
                        { id: 'q_feed', text: 'Masih bisa menyusu?', response: 'Nggak mau menyusu dok, sesak terus.', priority: 'essential' },
                        { id: 'q_fever', text: 'Ada demam?', response: 'Panas sedikit dok, 37.8.' }
                    ],
                    rps: [
                        { id: 'q_cough', text: 'Batuknya seperti apa?', response: 'Batuk kecil-kecil, tapi yang bikin khawatir sesaknya.' },
                        { id: 'q_blue', text: 'Pernah biru bibirnya?', response: 'Tadi sempat agak biru dok pas batuk.', priority: 'essential' }
                    ],
                    rpd: [
                        { id: 'q_premature', text: 'Lahir prematur?', response: 'Lahir cukup bulan dok.' },
                        { id: 'q_sibling', text: 'Saudaranya ada yang flu?', response: 'Kakaknya baru sembuh pilek seminggu lalu.' }
                    ],
                    sosial: []
                },
                physicalExamFindings: {
                    general: 'Bayi 8 bulan tampak sesak berat, napas cuping hidung (+), retraksi subkostal dan interkostal.',
                    vitals: 'N 160x, RR 62x, S 37.8°C, SpO2 88%.',
                    thorax: 'Wheezing ekspiratori bilateral, ronkhi basah halus, ekspirasi memanjang.',
                    extremities: 'Akral hangat, CRT <2 detik, sianosis perioral minimal.'
                },
                sisruteData: {
                    situation: 'Bayi 8 bulan sesak napas berat, SpO2 88%, retraksi (+), wheezing bilateral.',
                    background: 'ISPA 3 hari, kakak baru flu, lahir cukup bulan.',
                    assessment: 'Bronkiolitis berat curiga RSV. Butuh monitoring ICU anak.',
                    recommendation: 'Rawat atau rujuk ke PICU/HCU anak untuk monitoring oksigenasi dan hidrasi.'
                },
                differentialDiagnosis: ['Asma pada bayi', 'Pneumonia', 'Aspirasi benda asing', 'Pertusis']
            },
            intussusception: {
                diagnosis: 'Intususepsi',
                symptoms: ['Nyeri perut kolik hilang-timbul', 'BAB darah lendir (currant jelly)', 'Muntah hijau', 'Benjolan perut', 'Bayi menekuk kaki ke perut'],
                clue: '[CRITICAL] Bayi atau anak dengan kolik hebat dan BAB darah lendir. Curiga intususepsi dan rujuk segera untuk USG serta reduksi.',
                relevantLabs: ['Darah Lengkap'],
                anamnesis: [
                    'Anak saya nangis kesakitan terus-terusan, kakinya ditekuk ke perut, BAB darah lendir.',
                    'Kolik hebat hilang-timbul, muntah hijau, BAB kayak selai merah gelap.'
                ],
                anamnesisQuestions: {
                    keluhan_utama: [
                        { id: 'q_pain', text: 'Nyerinya seperti apa?', response: 'Tiba-tiba nangis kesakitan dok, kaki ditekuk ke perut, terus berhenti, terus nangis lagi.', priority: 'essential' },
                        { id: 'q_stool', text: 'BAB-nya gimana?', response: 'Tadi keluar darah campur lendir dok, merah gelap.', priority: 'essential' },
                        { id: 'q_vomit', text: 'Ada muntah?', response: 'Muntah terus dok, sekarang muntahnya hijau.', priority: 'essential' }
                    ],
                    rps: [
                        { id: 'q_duration', text: 'Sudah berapa lama?', response: 'Dari 6 jam lalu dok, makin sering.' },
                        { id: 'q_feed', text: 'Terakhir makan kapan?', response: 'Tadi pagi, sekarang nggak mau makan.' }
                    ],
                    rpd: [
                        { id: 'q_prev', text: 'Pernah seperti ini?', response: 'Belum pernah dok.' }
                    ],
                    sosial: []
                },
                physicalExamFindings: {
                    general: 'Anak 9 bulan, rewel, gelisah, tampak kesakitan tiba-tiba lalu tenang berulang.',
                    vitals: 'N 150x, RR 36x, S 37.5°C.',
                    abdomen: 'Teraba massa sosis di kuadran kanan atas. Dance sign (+) dengan kuadran kanan bawah relatif kosong. Bising usus meningkat saat kolik.',
                    extremities: 'CRT 2 detik, hidrasi cukup.'
                },
                sisruteData: {
                    situation: 'Bayi 9 bulan kolik abdomen hilang-timbul, BAB darah lendir, dan muntah bilious.',
                    background: 'Onset 6 jam, massa sosis teraba di RUQ, Dance sign (+).',
                    assessment: 'Suspek intususepsi. Butuh USG konfirmasi dan reduksi hidrostatik atau operasi segera.',
                    recommendation: 'Rujuk segera ke SpBA untuk reduksi udara/barium atau laparotomi bila gagal atau curiga perforasi.'
                },
                differentialDiagnosis: ['Volvulus', 'Apendisitis akut', 'Divertikel Meckel', 'GEA dengan dehidrasi']
            },
            dka_pediatric: {
                diagnosis: 'Ketoasidosis Diabetik pada Anak',
                symptoms: ['Napas Kussmaul', 'Penurunan kesadaran', 'Muntah', 'Nyeri perut', 'Napas bau aseton', 'Dehidrasi berat'],
                clue: '[CRITICAL] Anak dengan napas cepat-dalam, dehidrasi, dan bau aseton. Curiga KAD. Cek GDS segera dan mulai resusitasi cairan.',
                relevantLabs: ['GDS', 'Darah Lengkap', 'Elektrolit', 'AGD'],
                anamnesis: [
                    'Anak lemas dan muntah, napas cepat sekali, baunya kayak buah busuk dari mulut.',
                    'Minum banyak sekali tapi makin kurus, sekarang nggak sadar.'
                ],
                anamnesisQuestions: {
                    keluhan_utama: [
                        { id: 'q_event', text: 'Apa yang terjadi?', response: 'Anak saya lemas, muntah terus, napasnya cepat banget dok.', priority: 'essential' },
                        { id: 'q_drink', text: 'Minum banyak akhir-akhir ini?', response: 'Iya dok, minum terus tapi tetap haus. Kencing juga banyak banget.', priority: 'essential' },
                        { id: 'q_weight', text: 'BB turun?', response: 'Turun 3 kg dalam sebulan terakhir dok.', priority: 'essential' }
                    ],
                    rpd: [
                        { id: 'q_dm', text: 'Ada riwayat diabetes?', response: 'Belum pernah cek dok, ini pertama kali sakit begini.' },
                        { id: 'q_family', text: 'Keluarga ada kencing manis?', response: 'Nenek dari ibu ada diabetes dok.' }
                    ],
                    sosial: []
                },
                physicalExamFindings: {
                    general: 'Anak 10 tahun, somnolen, dehidrasi berat, napas Kussmaul, bau aseton (+).',
                    vitals: 'TD 90/60, N 130x, RR 36x dalam, S 37.0°C.',
                    abdomen: 'Nyeri tekan difus, bising usus menurun.',
                    neuro: 'GCS E3V4M5 = 12, pupil isokor, refleks normal.'
                },
                sisruteData: {
                    situation: 'Anak 10 tahun GCS 12, napas Kussmaul, GDS >500, dehidrasi berat, bau aseton (+).',
                    background: 'Polidipsi-poliuri 1 bulan, BB turun 3 kg, belum ada diagnosis DM sebelumnya.',
                    assessment: 'KAD berat pada DM tipe 1 onset baru. Butuh PICU untuk insulin drip dan monitoring ketat.',
                    recommendation: 'Rujuk ke PICU anak untuk insulin drip, koreksi elektrolit, dan monitoring AGD serial.'
                },
                differentialDiagnosis: ['Sepsis', 'Keracunan metanol', 'Gagal ginjal akut', 'Asidosis laktat']
            },
            neonatal_asphyxia: {
                diagnosis: 'Asfiksia Neonatus',
                symptoms: ['Bayi tidak menangis', 'Sianosis', 'Tonus lemah', 'Napas megap-megap', 'Bradikardia'],
                clue: '[CRITICAL] Neonatus tidak menangis saat lahir dengan APGAR rendah. Lakukan resusitasi neonatus pada golden minute: keringkan, rangsang, dan bersihkan jalan napas.',
                anamnesis: [
                    'Bayinya nggak nangis dok setelah lahir, warnanya biru, lemas.',
                    'Partus lama, ketuban pecah dini, air ketuban bercampur mekonium.'
                ],
                anamnesisQuestions: {
                    keluhan_utama: [
                        { id: 'q_birth', text: 'Proses kelahirannya bagaimana?', response: 'Lama dok, sejak pagi ketuban pecah tapi bayinya baru lahir sore.', priority: 'essential' },
                        { id: 'q_cry', text: 'Langsung nangis?', response: 'Nggak nangis dok, cuma megap-megap.', priority: 'essential' },
                        { id: 'q_meconium', text: 'Air ketubannya bersih?', response: 'Hijau-hijau dok airnya.', priority: 'essential' }
                    ],
                    rpd: [
                        { id: 'q_anc', text: 'ANC rutin?', response: 'Cuma 2 kali kontrol dok.' }
                    ],
                    sosial: []
                },
                physicalExamFindings: {
                    general: 'Neonatus aterm, tidak bernapas spontan adekuat, tonus hipotonik, sianosis sentral.',
                    vitals: 'N 80x (bradikardia), RR gasping, S 35.5°C, APGAR menit pertama = 3.',
                    thorax: 'Retraksi berat, air entry sangat berkurang.',
                    extremities: 'Fleksi lemah, tonus menurun, refleks lemah.'
                },
                sisruteData: {
                    situation: 'Neonatus aterm tidak bernapas spontan, APGAR 3, sianosis sentral, bradikardia N 80x.',
                    background: 'Partus lama, KPD >12 jam, mekonium (+), ANC tidak lengkap.',
                    assessment: 'Asfiksia neonatus berat dengan kecurigaan aspirasi mekonium. Butuh NICU segera.',
                    recommendation: 'Rujuk ke NICU untuk ventilasi mekanik, monitoring ketat, dan tata laksana aspirasi mekonium bila terkonfirmasi.'
                },
                differentialDiagnosis: ['Aspirasi mekonium', 'Sepsis neonatus', 'Kelainan jantung bawaan', 'Prematuritas']
            }
        }
    }
};
