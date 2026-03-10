/**
 * @reflection
 * [IDENTITY]: general_infectious
 * [PURPOSE]: General/Systemic infectious cases (Dengue, Malaria, Typhoid, HIV, etc.).
 * [STATE]: Stable
 * [ANCHOR]: general_infectious
 */
export const general_infectious = [
    {
        id: 'dengue_df',
        diagnosis: 'Dengue Fever (DF)',
        icd10: 'A90',
        skdi: '4A',
        category: 'Infection',
        symptoms: ['Demam tinggi mendadak', 'Sakit kepala', 'Nyeri belakang mata', 'Nyeri otot/sendi', 'Ruam kulit'],
        clue: "Demam tinggi mendadak 2-7 hari, wajah kemerahan (facial flush), nyeri retro-orbital. Rumple Leede (+). Trombositopenia.",
        relevantLabs: ['lab_hematology', 'lab_ns1'],
        anamnesisQuestions: {
            keluhan_utama: [
                { id: 'q_main', text: 'Keluhannya apa?', response: 'Demam tinggi mendadak dok, badan linu semua.', sentiment: 'confirmation', priority: 'essential' }
            ],
            rps: [
                { id: 'q_duration', text: 'Sudah berapa hari demamnya?', response: 'Baru 2 hari ini dok, tapi tinggi banget.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_pain', text: 'Ada nyeri di mana?', response: 'Kepala sakit, belakang mata sakit, sendi-sendi linu.', sentiment: 'confirmation' },
                { id: 'q_bleeding', text: 'Ada mimisan atau gusi berdarah?', response: 'Nggak ada dok.', sentiment: 'denial' }
            ],
            rpd: [
                { id: 'q_history', text: 'Pernah kena DB sebelumnya?', response: 'Belum pernah dok.', sentiment: 'denial' }
            ],
            rpk: [
                { id: 'q_neighbor', text: 'Tetangga ada yang kena DB?', response: 'Iya dok, ada yang baru masuk RS kemarin.', sentiment: 'confirmation' }
            ],
            sosial: [
                { id: 'q_mosquito', text: 'Banyak nyamuk di rumah?', response: 'Lumayan banyak dok.', sentiment: 'confirmation' }
            ]
        },
        essentialQuestions: ['q_main', 'q_duration', 'q_neighbor'],
        anamnesis: ["Demam tinggi mendadak 2 hari, badan linu, nyeri belakang mata.", "Tetangga ada yang kena DB."],
        physicalExamFindings: {
            general: "Tampak sakit sedang, wajah kemerahan (facial flushing).",
            vitals: "TD 110/70, N 98x, RR 20x, S 39.5°C",
            skin: "Petechiae di lengan (+), Uji Tourniquet (Rumple Leede) positif.",
            abdomen: "Nyeri tekan ulu hati ringan, hepatomegali (-)."
        },
        labs: {
            "Darah Lengkap": { result: "Hb 14, Leuko 3.500 (Leukopenia), Trombo 98.000 (Trombositopenia)", cost: 50000 },
            "NS1 Ag": { result: "Positif", cost: 150000 }
        },
        vitals: { temp: 39.5, bp: '110/70', hr: 98, rr: 20 },
        correctTreatment: ['paracetamol_500', 'oralit', 'vit_c_50'],
        correctProcedures: ['iv_fluid'],
        requiredEducation: ['fluid_intake_monitor', 'bed_rest', 'mosquito_control', 'warning_signs'],
        risk: 'medium',
        nonReferrable: true,
        referralExceptions: ['shock_signs', 'bleeding', 'pregnant', 'comorbidity'],
        differentialDiagnosis: ['A91', 'A01.0']
    },
    {
        id: 'malaria_vivax',
        diagnosis: 'Malaria Vivax',
        icd10: 'B51.9',
        skdi: '4A',
        category: 'Infection',
        symptoms: ['Demam menggigil', 'Berkeringat', 'Sakit kepala', 'Mual muntah', 'Riwayat ke daerah endemis'],
        clue: "Trias Malaria: Menggigil (dingin) -> Demam (panas) -> Berkeringat. Riwayat travel ke Papua/NTT. Anemia.",
        relevantLabs: ['Sediaan Darah Tebal/Tipis'],
        anamnesisQuestions: {
            keluhan_utama: [
                { id: 'q_main', text: 'Keluhannya apa?', response: 'Demam menggigil dok, selang-seling.', sentiment: 'confirmation', priority: 'essential' }
            ],
            rps: [
                { id: 'q_pattern', text: 'Polanya gimana?', response: 'Kemarin demam, hari ini nggak, besok demam lagi. Pas demam sampai menggigil.', sentiment: 'confirmation' },
                { id: 'q_symptoms', text: 'Ada keluhan lain?', response: 'Pusing, mual, badan lemas.', sentiment: 'confirmation' }
            ],
            rpd: [
                { id: 'q_history', text: 'Pernah malaria?', response: 'Dulu pernah waktu tugas di Papua.', sentiment: 'neutral' }
            ],
            rpk: [],
            sosial: [
                { id: 'q_travel', text: 'Baru pulang dari luar kota?', response: 'Iya dok, baru pulang dari tambang di Kalimantan 2 minggu lalu.', sentiment: 'confirmation', priority: 'essential' }
            ]
        },
        essentialQuestions: ['q_main', 'q_travel'],
        anamnesis: ["Demam menggigil selang-seling.", "Baru pulang dari Kalimantan 2 minggu lalu."],
        physicalExamFindings: {
            general: "Tampak sakit sedang, pucat, berkeringat.",
            vitals: "TD 110/70, N 90x, RR 20x, S 38.5°C (saat paroksisme)",
            heent: "Konjungtiva anemis (+), skiera ikterik ringan.",
            abdomen: "Splenomegali (Schuffner I-II)."
        },
        labs: {
            "Sediaan Darah Tebal/Tipis": { result: "Plasmodium vivax stadium trofozoit (+)", cost: 30000 },
            "Darah Lengkap": { result: "Hb 9.0 (Anemia), Leuko Normal, Trombo 130.000", cost: 50000 }
        },
        vitals: { temp: 38.5, bp: '110/70', hr: 90, rr: 20 },
        correctTreatment: ['dhp', 'primaquine'],
        correctProcedures: [],
        requiredEducation: ['med_compliance', 'mosquito_control', 'finish_course'],
        risk: 'medium',
        nonReferrable: true,
        referralExceptions: ['severe_malaria', 'pregnant', 'comorbidity'],
        differentialDiagnosis: ['B50.9', 'A90']
    },
    {
        id: 'varicella',
        diagnosis: 'Varicella (Cacar Air)',
        icd10: 'B01.9',
        skdi: '4A',
        category: 'Infection',
        symptoms: ['Demam', 'Lenting berair', 'Gatal', 'Menyebar dari badan ke wajah/ekstremitas'],
        clue: "Ruam makulopapular → vesikel → krusta dalam berbagai stadium (polimorfik). Sangat menular.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [
                { id: 'q_main', text: 'Keluhannya apa?', response: 'Bentol-bentol isi air gatal dok, mulai dari badan.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_spread', text: 'Mulai dari mana?', response: 'Dari badan terus menyebar ke muka dan tangan.', sentiment: 'confirmation' }
            ],
            rps: [
                { id: 'q_fever', text: 'Ada demam?', response: 'Demam 2 hari sebelum muncul bentol.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_itch', text: 'Gatal?', response: 'Gatal banget sampai nggak bisa tidur.', sentiment: 'confirmation' }
            ],
            rpd: [
                { id: 'q_history', text: 'Sudah pernah cacar air?', response: 'Belum pernah dok.', sentiment: 'denial' }
            ],
            rpk: [],
            sosial: [
                {
                    id: 'q_contact',
                    text: 'Ada teman atau tetangga yang sakit serupa?',
                    response: 'Teman sekantor ada yang kena cacar air minggu lalu.', sentiment: 'neutral',
                    priority: 'essential'
                }
            ]
        },
        essentialQuestions: ['q_main', 'q_fever', 'q_contact'],
        anamnesis: ["Bentol-bentol isi air gatal dok, mulai dari badan.", "Demam dulu baru muncul bentol."],
        physicalExamFindings: {
            general: "Tampak tidak nyaman.",
            vitals: "TD 110/70, N 88x, RR 18x, S 38.2°C",
            skin: "Lesi polimorfik: makula, papul, vesikel, krusta tersebar di badan, wajah, ekstremitas. Vesikel 'tear drop on rose petal'."
        },
        labs: {},
        vitals: { temp: 38.2, bp: '110/70', hr: 88, rr: 18 },
        correctTreatment: ['acyclovir_400', 'paracetamol_500', 'calamine_lotion'],
        correctProcedures: [],
        requiredEducation: ['avoid_scratching', 'hand_hygiene', 'isolation_home'],
        risk: 'low',
        nonReferrable: true,
        referralExceptions: ['emergency', 'comorbidity'],
        differentialDiagnosis: ['B02.9', 'B05.9']
    },
    {
        id: 'typhoid_fever',
        diagnosis: 'Demam Tifoid',
        icd10: 'A01.0',
        skdi: '4A',
        category: 'Infection',
        symptoms: ['Demam naik bertahap', 'Stepladder fever', 'Sakit kepala', 'Lidah kotor', 'Nyeri perut'],
        clue: "Demam stepladder (naik bertahap selama seminggu), lidah kotor tepi hiperemis (typhoid tongue). Widal/Tubex.",
        relevantLabs: ['Widal Test', 'Tubex TF'],
        anamnesisQuestions: {
            keluhan_utama: [
                { id: 'q_main', text: 'Keluhannya apa?', response: 'Demam sudah 7 hari dok, makin tinggi tiap hari.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_pattern', text: 'Demam sore atau sepanjang hari?', response: 'Sore-malam lebih tinggi dok.', sentiment: 'confirmation' }
            ],
            rps: [
                { id: 'q_headache', text: 'Sakit kepala?', response: 'Pusing banget dok.', sentiment: 'confirmation' },
                { id: 'q_stool', text: 'BABnya gimana?', response: 'Agak susah BAB dok, konstipasi.', sentiment: 'confirmation' },
                { id: 'q_appetite', text: 'Nafsu makan?', response: 'Nggak ada nafsu makan.', sentiment: 'denial' }
            ],
            rpd: [
                { id: 'q_history', text: 'Pernah tipes?', response: 'Dulu waktu SMA pernah sekali.', sentiment: 'neutral' }
            ],
            rpk: [
                { id: 'q_fam', text: 'Keluarga ada yang tipes?', response: 'Nggak ada dok.', sentiment: 'denial' }
            ],
            sosial: [
                { id: 'q_food', text: 'Sering jajan?', response: 'Sering beli makanan pinggir jalan dok.', sentiment: 'confirmation' }
            ]
        },
        essentialQuestions: ['q_main', 'q_pattern'],
        anamnesis: ["Demam sudah 7 hari dok, makin tinggi tiap hari.", "Pusing, nggak nafsu makan, susah BAB."],
        physicalExamFindings: {
            general: "Tampak sakit sedang, febris.",
            vitals: "TD 100/70, N 78x (bradikardia relatif), RR 18x, S 39.0°C",
            heent: "Lidah kotor dengan tepi hiperemis (typhoid tongue).",
            abdomen: "Meteorismus (+), nyeri tekan difus ringan, hepatomegali (-)."
        },
        labs: {
            "Widal Test": { result: "Titer O 1/320, H 1/160 (Positif)", cost: 50000 },
            "Tubex TF": { result: "Skor 6 (Positif kuat)", cost: 100000 }
        },
        vitals: { temp: 39.0, bp: '100/70', hr: 78, rr: 18 },
        correctTreatment: ['chloramphenicol_500', 'paracetamol_500'],
        correctProcedures: [],
        requiredEducation: ['fluid_intake', 'diet_soft', 'hand_hygiene', 'routine_control'],
        risk: 'medium',
        nonReferrable: true,
        referralExceptions: ['emergency', 'comorbidity'],
        differentialDiagnosis: ['A91', 'B54']
    },
    {
        id: 'parotitis_mumps',
        diagnosis: 'Parotitis (Gondongan)',
        icd10: 'B26',
        skdi: '4A',
        category: 'Infection',
        symptoms: ['Bengkak di depan telinga', 'Nyeri mengunyah', 'Demam', 'Mulut kering'],
        clue: "Pembengkakan kelenjar parotis unilateral/bilateral. Nyeri diperburuk saat makan asam.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [
                { id: 'q_main', text: 'Bengkaknya di mana dok?', response: 'Bengkak di depan telinga dua-duanya dok, sakit buat mangap.', sentiment: 'confirmation', priority: 'essential' }
            ],
            rps: [
                { id: 'q_pain', text: 'Sakit mengunyah?', response: 'Iya dok, apalagi kalau makan yang asam.', sentiment: 'neutral', priority: 'essential' },
                { id: 'q_fever', text: 'Demam?', response: 'Demam 2 hari ini.', sentiment: 'confirmation' }
            ],
            rpd: [{ id: 'q_vaccine', text: 'Sudah vaksin MMR?', response: 'Belum pernah dok.', sentiment: 'denial' }],
            rpk: [{ id: 'q_fam', text: 'Di sekolah ada yang sakit sama?', response: 'Iya, teman sekelas ada yang gondongan.', sentiment: 'neutral' }],
            sosial: []
        },
        essentialQuestions: ['q_main', 'q_pain'],
        anamnesis: ["Bengkak di depan telinga dua-duanya.", "Sakit mengunyah, demam."],
        physicalExamFindings: {
            general: "Tampak sakit ringan.",
            vitals: "TD 110/70, N 85x, RR 18x, S 38.0°C",
            heent: "Pembengkakan parotis bilateral, nyeri tekan (+), tidak fluktuatif."
        },
        labs: {},
        vitals: { temp: 38.0, bp: '110/70', hr: 85, rr: 18 },
        correctTreatment: ['paracetamol_500'],
        correctProcedures: [],
        requiredEducation: ['bed_rest', 'diet_soft', 'isolation_home'],
        risk: 'low',
        nonReferrable: true,
        referralExceptions: ['comorbidity'],
        differentialDiagnosis: ['K11.2', 'J06.9']
    },
    {
        id: 'tetanus',
        diagnosis: 'Tetanus',
        icd10: 'A35',
        skdi: '4A',
        category: 'Infection',
        symptoms: ['Kaku rahang', 'Kaku otot', 'Kejang', 'Sulit menelan'],
        clue: "Trismus (kaku rahang), risus sardonicus, opistotonus. Riwayat luka kotor. Belum vaksin atau status vaksin tidak jelas.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [
                {
                    id: 'q_main',
                    text: 'Keluhannya apa?',
                    response: 'Rahang kaku dok, susah buka mulut, badan tegang semua.', sentiment: 'confirmation',
                    variations: {
                        low_education: 'Cangkem ra iso buka dok, awak kaku kabeh.',
                        high_education: 'Ada trismus dan rigiditas generalisata, sulit menelan.',
                        skeptical: 'Rahang kaku.'
                    },
                    priority: 'essential'
                }
            ],
            rps: [
                { id: 'q_wound', text: 'Ada luka sebelumnya?', response: 'Iya dok, seminggu lalu kena paku berkarat.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_swallow', text: 'Menelan susah?', response: 'Iya dok, makan minum susah.', sentiment: 'confirmation' },
                { id: 'q_spasm', text: 'Ada kejang?', response: 'Badan sering kencang sendiri dok.', sentiment: 'confirmation' }
            ],
            rpd: [
                { id: 'q_vaccine', text: 'Vaksin tetanus terakhir kapan?', response: 'Nggak ingat dok, mungkin waktu kecil.', sentiment: 'denial', priority: 'essential' }
            ],
            rpk: [],
            sosial: [{ id: 'q_work', text: 'Kerja apa?', response: 'Tukang bangunan dok.', sentiment: 'confirmation' }]
        },
        essentialQuestions: ['q_main', 'q_wound', 'q_vaccine'],
        anamnesis: ["Rahang saya kaku nggak bisa buka mulut dok, badan juga tegang semua. Minggu lalu kena paku berkarat.", "Saya nggak bisa buka mulut dok, leher dan badan kaku. Suntik tetanus terakhir lupa kapan."],
        physicalExamFindings: {
            general: "Tampak sakit berat, posisi opistotonus +/-.",
            vitals: "TD 140/90, N 110x, RR 24x, S 38.0°C",
            neuro: "Trismus (+), risus sardonicus (+). Rigiditas leher dan punggung. Refleks fisiologis meningkat."
        },
        labs: {},
        vitals: { temp: 38.0, bp: '140/90', hr: 110, rr: 24 },
        correctTreatment: ['tetanus_immunoglobulin', 'metronidazole_500', 'diazepam_10mg'],
        correctProcedures: ['wound_debridement'],
        requiredEducation: ['wound_care', 'complete_vaccination', 'avoid_rusty_objects'],
        risk: 'high',
        nonReferrable: false,
        referralRequired: true,
        referralExceptions: [],
        differentialDiagnosis: ['G24.9', 'A34']
    },
    {
        id: 'leprosy',
        diagnosis: 'Lepra (Kusta)',
        icd10: 'A30.9',
        skdi: '4A',
        category: 'Infection',
        symptoms: ['Bercak putih mati rasa', 'Penebalan saraf', 'Kelemahan otot', 'Luka tidak terasa'],
        clue: "Makula hipopigmentasi dengan anestesi. Penebalan saraf tepi. Klasifikasi: PB (Pausibasiler) atau MB (Multibasiler). Program P2 Kusta.",
        relevantLabs: ['BTA Kulit'],
        anamnesisQuestions: {
            keluhan_utama: [
                {
                    id: 'q_main',
                    text: 'Bercaknya gimana?',
                    response: 'Sudah lama dok, putih-putih tapi nggak terasa kalau dicubit.', sentiment: 'denial',
                    variations: {
                        low_education: 'Belang-belang putih dok, dicepit ora kroso.',
                        high_education: 'Makula hipopigmentasi dengan gangguan sensorik berupa anestesi.',
                        skeptical: 'Bercak putih mati rasa.'
                    },
                    priority: 'essential'
                }
            ],
            rps: [
                { id: 'q_sensation', text: 'Tidak terasa kalau disentuh?', response: 'Iya dok, nggak kerasa.', sentiment: 'denial', priority: 'essential' },
                { id: 'q_weakness', text: 'Ada kelemahan tangan/kaki?', response: 'Jari-jari agak lemah dok.', sentiment: 'confirmation' },
                { id: 'q_duration', text: 'Sudah berapa lama?', response: 'Sudah tahunan dok.', sentiment: 'confirmation' }
            ],
            rpd: [],
            rpk: [{ id: 'q_contact', text: 'Keluarga ada yang kena?', response: 'Dulu tetangga pernah ada yang kena.', sentiment: 'neutral', priority: 'essential' }],
            sosial: [{ id: 'q_stigma', text: 'Takut dikucilkan?', response: 'Iya dok, makanya baru berani periksa.', sentiment: 'confirmation' }]
        },
        essentialQuestions: ['q_main', 'q_sensation', 'q_contact'],
        anamnesis: ["Ada bercak putih di kulit saya dok, sudah bertahun-tahun. Kalau dipegang nggak berasa.", "Kulit saya ada bercak mati rasa dok, nggak bisa ngerasain panas dingin."],
        physicalExamFindings: {
            general: "Tampak baik.",
            vitals: "TD 120/80, N 78x, RR 18x, S 36.7°C",
            skin: "Makula hipopigmentasi multipel di regio brachii dan cruris. Sensibilitas: raba (-), nyeri (-), suhu (-). N. ulnaris teraba menebal.",
            neuro: "Claw hand (-), foot drop (-)."
        },
        labs: {
            "BTA Kulit": { result: "Slit skin smear: BTA (-) - Tipe PB", cost: 50000 }
        },
        vitals: { temp: 36.7, bp: '120/80', hr: 78, rr: 18 },
        correctTreatment: ['mdt_pb'],
        correctProcedures: [],
        requiredEducation: ['mdt_compliance', 'early_detection', 'contact_screening', 'prevent_disability'],
        risk: 'medium',
        nonReferrable: true,
        referralExceptions: ['comorbidity', 'no_improvement'],
        differentialDiagnosis: ['B36.0', 'L30.0']
    },
    {
        id: 'hiv_uncomplicated',
        diagnosis: 'HIV tanpa Komplikasi',
        icd10: 'B20',
        skdi: '4A',
        category: 'Infection',
        symptoms: ['BB turun', 'Demam lama', 'Diare kronis', 'Sariawan berulang'],
        clue: "Stadium klinis WHO 1-2. Sudah inisiasi ARV dan stabil. Kontrol rutin di FKTP dengan dukungan RS rujukan.",
        relevantLabs: ['Rapid HIV', 'CD4'],
        anamnesisQuestions: {
            keluhan_utama: [
                {
                    id: 'q_main',
                    text: 'Kontrol rutin ya?',
                    response: 'Iya dok, mau ambil obat ARV.', sentiment: 'confirmation',
                    variations: {
                        low_education: 'Iya dok, mau ambil obat bulanan.',
                        high_education: 'Kontrol rutin untuk refill ARV dan monitoring.',
                        skeptical: 'Ambil obat.'
                    },
                    priority: 'essential'
                }
            ],
            rps: [
                { id: 'q_symptom', text: 'Ada keluhan?', response: 'Alhamdulillah nggak ada dok, kondisi stabil.', sentiment: 'denial' },
                { id: 'q_compliance', text: 'Minum obat teratur?', response: 'Teratur dok, nggak pernah lupa.', sentiment: 'denial', priority: 'essential' }
            ],
            rpd: [{ id: 'q_oi', text: 'Pernah infeksi oportunistik?', response: 'Dulu pernah TB, sudah sembuh.', sentiment: 'neutral' }],
            rpk: [],
            sosial: [
                { id: 'q_support', text: 'Dukungan keluarga?', response: 'Istri mendukung dok.', sentiment: 'neutral' },
                { id: 'q_stigma', text: 'Ada masalah stigma?', response: 'Sudah mulai terbuka dok.', sentiment: 'confirmation' }
            ]
        },
        essentialQuestions: ['q_main', 'q_compliance'],
        anamnesis: ["Kontrol rutin dok, saya minum ARV. Kondisi stabil.", "Mau ambil obat ARV bulanan dok, badan alhamdulillah baik-baik aja."],
        physicalExamFindings: {
            general: "Tampak baik, stabil.",
            vitals: "TD 120/80, N 78x, RR 18x, S 36.7°C",
            heent: "Kandidiasis oral (-), pembesaran KGB (-).",
            thorax: "Cor/Pulmo dalam batas normal."
        },
        labs: {
            "Rapid HIV": { result: "Reaktif (Positif)", cost: 100000 },
            "CD4": { result: "CD4 450 sel/uL (Stabil)", cost: 250000 }
        },
        vitals: { temp: 36.7, bp: '120/80', hr: 78, rr: 18 },
        correctTreatment: ['arv_fdc'],
        correctProcedures: [],
        requiredEducation: ['arv_compliance', 'safe_sex', 'nutrition_support', 'regular_checkup'],
        risk: 'medium',
        nonReferrable: true,
        referralExceptions: ['oi_detected', 'treatment_failure', 'comorbidity'],
        differentialDiagnosis: ['Z21']
    },
    {
        id: 'leptospirosis',
        diagnosis: 'Leptospirosis Tanpa Komplikasi',
        icd10: 'A27.9',
        skdi: '4A',
        category: 'Infection',
        symptoms: ['Demam akut', 'Nyeri betis', 'Mata merah', 'Riwayat banjir'],
        clue: "Demam + myalgia (terutama betis) + conjunctival suffusion setelah kontak air banjir/genangan. Leptospira. Doxycycline.",
        relevantLabs: ['Darah Lengkap'],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Keluhannya?', response: 'Demam tinggi dok, betis sakit banget, mata merah.', sentiment: 'confirmation', priority: 'essential' }],
            rps: [{ id: 'q_flood', text: 'Kontak banjir?', response: 'Iya dok, kemarin rumah kebanjiran, jalan di air.', sentiment: 'neutral', priority: 'essential' }],
            rpd: [], rpk: [], sosial: []
        },
        essentialQuestions: ['q_main', 'q_flood'],
        anamnesis: ["Demam tinggi dok, betis sakit banget, mata juga merah. Kemarin habis kena banjir.", "Badan panas dan betis nyeri dok, minggu lalu rumah kebanjiran."],
        physicalExamFindings: { general: "Tampak sakit akut, febris.", vitals: "TD 110/70, N 100x, RR 22x, S 39.0°C", heent: "Mata: Conjunctival suffusion (+).", extremities: "Nyeri tekan betis bilateral (calf tenderness)." },
        labs: { "Darah Lengkap": { result: "Leukositosis 13.000, Trombositopenia 120.000", cost: 50000 } },
        vitals: { temp: 39.0, bp: '110/70', hr: 100, rr: 22 },
        correctTreatment: ['doxycycline_100', 'paracetamol_500'],
        correctProcedures: [],
        requiredEducation: ['avoid_flood_water', 'wear_boots', 'rat_control'],
        risk: 'medium', nonReferrable: true, referralExceptions: ['comorbidity', 'no_improvement'],
        differentialDiagnosis: ['A90', 'B54']
    },
    {
        id: 'morbilli',
        diagnosis: 'Morbili (Campak)',
        icd10: 'B05.9',
        skdi: '4A',
        category: 'Infection',
        symptoms: ['Demam', 'Batuk pilek', 'Mata merah', 'Ruam merah'],
        clue: "3C: Cough, Coryza, Conjunctivitis + demam tinggi diikuti ruam makulopapular dari wajah ke badan. Koplik spot (+).",
        relevantLabs: ['Darah Lengkap'],
        anamnesisQuestions: {
            keluhan_utama: [
                {
                    id: 'q_main',
                    text: 'Keluhannya apa?',
                    response: 'Demam tinggi dok, batuk pilek, terus timbul bintik-bintik merah.', sentiment: 'confirmation',
                    variations: {
                        low_education: 'Panas tinggi dok, batuk pilek, terus muncul bintik-bintik abang.',
                        high_education: 'Febris tinggi dengan 3C, kemudian muncul rash makulopapular.',
                        skeptical: 'Demam, ruam merah.'
                    },
                    priority: 'essential'
                }
            ],
            rps: [
                { id: 'q_rash', text: 'Ruamnya mulai dari mana?', response: 'Mulai dari muka terus turun ke badan.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_eye', text: 'Mata merah?', response: 'Iya dok, merah berair.', sentiment: 'confirmation' },
                { id: 'q_duration', text: 'Demam berapa hari?', response: '4 hari ini dok.', sentiment: 'confirmation' }
            ],
            rpd: [
                { id: 'q_vaccine', text: 'Sudah imunisasi campak?', response: 'Belum dok.', sentiment: 'denial', priority: 'essential' }
            ],
            rpk: [{ id: 'q_contact', text: 'Ada yang sakit serupa?', response: 'Teman sekolahnya ada yang campak.', sentiment: 'neutral' }],
            sosial: []
        },
        essentialQuestions: ['q_main', 'q_rash', 'q_vaccine'],
        anamnesis: ["Anak saya demam tinggi dok, mata merah, batuk pilek, terus muncul ruam merah.", "Badan anak saya panas banget dok, terus keluar bintik-bintik merah. Belum vaksin campak."],
        physicalExamFindings: {
            general: "Anak tampak sakit sedang, rewel.",
            vitals: "TD -, N 110x, RR 26x, S 39.5°C",
            heent: "Konjungtiva hiperemis bilateral dengan discharge. Koplik spot (+) di mukosa bukal.",
            skin: "Ruam makulopapular eritematosa generalisata, mulai dari wajah menyebar ke badan dan ekstremitas."
        },
        labs: {
            "Darah Lengkap": { result: "Leukopenia (4000), limfositosis relatif", cost: 50000 }
        },
        vitals: { temp: 39.5, bp: '-', hr: 110, rr: 26 },
        correctTreatment: ['paracetamol_syr', 'vit_a_200000'],
        correctProcedures: [],
        requiredEducation: ['isolation', 'fluid_intake', 'complete_vaccination', 'contact_notification'],
        risk: 'medium',
        nonReferrable: true,
        referralExceptions: ['emergency', 'comorbidity', 'no_improvement'],
        differentialDiagnosis: ['B06.9', 'B09']
    },
    {
        id: 'filariasis',
        diagnosis: 'Filariasis',
        icd10: 'B74.9',
        skdi: '4A',
        category: 'Infection',
        symptoms: ['Bengkak kaki/tangan', 'Demam berulang', 'Limfedema', 'Elephantiasis'],
        clue: "Limfedema kronik (biasanya tungkai bawah). Mikrofilaria di darah perifer (pemeriksaan malam). Program POPM Filariasis.",
        relevantLabs: ['Mikrofilaria Darah'],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Keluhannya?', response: 'Kaki bengkak terus dok, sudah bertahun-tahun, makin besar.', sentiment: 'confirmation', priority: 'essential' }],
            rps: [{ id: 'q_fever', text: 'Pernah demam berulang?', response: 'Iya, dulu sering demam terus kaki bengkak.', sentiment: 'confirmation' }],
            rpd: [], rpk: [], sosial: [{ id: 'q_endemic', text: 'Tinggal di mana?', response: 'Di pesisir pantai dok.', sentiment: 'confirmation' }]
        },
        essentialQuestions: ['q_main'],
        anamnesis: ["Kaki saya bengkak besar dok, sudah lama nggak kempes.", "Kaki saya membengkak terus dok, makin lama makin besar."],
        physicalExamFindings: { general: "Tampak baik.", vitals: "TD 120/80, N 78x, RR 18x, S 36.7°C", skin: "Limfedema grade II cruris sinistra. Kulit menebal, peau d'orange (+)." },
        labs: { "Mikrofilaria Darah": { result: "Mikrofilaria (+) pada sediaan darah tebal malam hari", cost: 30000 } },
        vitals: { temp: 36.7, bp: '120/80', hr: 78, rr: 18 },
        correctTreatment: ['dec_tab', 'albendazole_400'],
        correctProcedures: [],
        requiredEducation: ['limb_care', 'mosquito_prevention', 'popm_compliance'],
        risk: 'medium', nonReferrable: true, referralExceptions: ['comorbidity'],
        differentialDiagnosis: ['I89.0', 'I97.2']
    },
    {
        id: 'anthrax',
        diagnosis: 'Antraks Kutaneus',
        icd10: 'A22.0',
        skdi: '3B',
        category: 'Infection',
        symptoms: ['Papul gatal', 'Vesikel kehitaman', 'Edema perilesional', 'Eschar hitam', 'Demam ringan'],
        clue: "Eschar hitam (painless black ulcer) dengan edema non-pitting di sekitarnya. Riwayat kontak hewan ternak mati mendadak atau pekerjaan pemotongan hewan (post-Idul Adha). Kasus zoonosis yang wajib dilaporkan (SKDR).",
        relevantLabs: ['Darah Lengkap', 'Gram Stain'],
        anamnesisQuestions: {
            keluhan_utama: [
                {
                    id: 'q_main',
                    text: 'Ada luka apa ini Pak?',
                    response: 'Ada bisul hitam di tangan dok, awalnya bentol gatal terus jadi kehitaman. Nggak sakit tapi bengkak.', sentiment: 'confirmation',
                    variations: {
                        low_education: 'Ada borok ireng di tangan dok, awalnya gatel terus dadi ireng.',
                        high_education: 'Papul berkembang menjadi vesikel lalu eschar hitam dengan edema sekitarnya.',
                        skeptical: 'Bisul hitam.'
                    },
                    priority: 'essential'
                }
            ],
            rps: [
                { id: 'q_onset', text: 'Kapan mulainya?', response: 'Sekitar 3 hari lalu dok, abis motong kambing.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_pain', text: 'Sakit?', response: 'Nggak sakit dok, tapi bengkak.', sentiment: 'confirmation' },
                { id: 'q_fever', text: 'Demam?', response: 'Agak sumer-sumer.', sentiment: 'confirmation' }
            ],
            rpd: [
                { id: 'q_history', text: 'Pernah seperti ini?', response: 'Belum pernah dok.', sentiment: 'denial' }
            ],
            rpk: [
                { id: 'q_contact', text: 'Tetangga ada yang kena?', response: 'Nggak ada, tapi kemarin ada kambing tetangga mati mendadak.', sentiment: 'denial', priority: 'essential' }
            ],
            sosial: [
                { id: 'q_job', text: 'Kerja apa?', response: 'Petani dan peternak kambing. Kemarin habis motong buat Idul Adha.', sentiment: 'neutral' }
            ]
        },
        essentialQuestions: ['q_main', 'q_onset', 'q_contact'],
        anamnesis: ["Ada bisul hitam di tangan dok, nggak sakit tapi bengkak. Baru muncul setelah motong kambing.", "Bisul hitam di lengan dok, 3 hari lalu habis pegang kambing yang mati mendadak."],
        physicalExamFindings: {
            general: "Tampak sakit ringan.",
            vitals: "TD 120/80, N 82x, RR 18x, S 37.8°C",
            skin: "Eschar hitam (painless) diameter 2cm di dorsum manus dextra dengan edema non-pitting perilesional yang luas. Limfadenopati aksila ipsilateral.",
            extremities: "Edema lengan kanan."
        },
        labs: {
            "Darah Lengkap": { result: "Leukositosis ringan 11.500", cost: 50000 },
            "Gram Stain Lesi": { result: "Basil gram positif berkapsul (Bacillus anthracis suspect)", cost: 30000 }
        },
        vitals: { temp: 37.8, bp: '120/80', hr: 82, rr: 18 },
        correctTreatment: ['ciprofloxacin_500', 'doxycycline_100'],
        correctProcedures: ['wound_care'],
        requiredEducation: ['avoid_dead_animal', 'report_authority', 'hand_hygiene', 'animal_vaccination'],
        risk: 'high',
        nonReferrable: false,
        referralRequired: true,
        referralExceptions: [],
        differentialDiagnosis: ['L02.9', 'A28.9'],
        notifiable: true
    },
    {
        id: 'diphtheria',
        diagnosis: 'Difteri',
        icd10: 'A36.0',
        skdi: '3B',
        category: 'Infection',
        symptoms: ['Nyeri tenggorokan', 'Pseudomembran keabuan', 'Demam ringan', 'Bull neck', 'Suara serak'],
        clue: "Pseudomembran keabuan di faring/tonsil yang BERDARAH saat dilepas. Bull neck (edema submandibular). KLB difteri = cakupan DPT rendah. Antitoksin difteri SEGERA + antibiotik. Wajib rujuk.",
        relevantLabs: ['Darah Lengkap', 'Swab Tenggorok'],
        anamnesisQuestions: {
            keluhan_utama: [
                {
                    id: 'q_main',
                    text: 'Keluhannya apa?',
                    response: 'Tenggorokan sakit dok, susah menelan, leher bengkak. Anak saya jadi serak suaranya.', sentiment: 'confirmation',
                    variations: {
                        low_education: 'Gorokan sakit e dok, gulu bengkak, cah ku angel nguntal.',
                        high_education: 'Odinofagia dengan edema submandibular dan suara serak progresif.',
                        skeptical: 'Leher bengkak, susah nelan.'
                    },
                    priority: 'essential'
                }
            ],
            rps: [
                { id: 'q_onset', text: 'Berapa hari?', response: '3 hari dok, makin berat.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_breathing', text: 'Sesak napas?', response: 'Agak sesak kalau tidur.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_fever', text: 'Demam?', response: 'Demam nggak terlalu tinggi.', sentiment: 'confirmation' }
            ],
            rpd: [
                { id: 'q_vaccine', text: 'Sudah imunisasi DPT?', response: 'Nggak tahu dok, kayaknya belum lengkap.', sentiment: 'denial', priority: 'essential' }
            ],
            rpk: [
                { id: 'q_contact', text: 'Ada yang sakit serupa?', response: 'Di sekolahnya ada 2 teman yang sakit mirip.', sentiment: 'confirmation' }
            ],
            sosial: []
        },
        essentialQuestions: ['q_main', 'q_onset', 'q_breathing', 'q_vaccine'],
        anamnesis: ["Tenggorokan anak saya sakit dok, leher bengkak, suara serak. Belum lengkap vaksin DPT.", "Susah nelan, leher bengkak, agak sesak napas. Teman sekolah ada yang sakit serupa."],
        physicalExamFindings: {
            general: "Anak tampak sakit sedang, toxic appearance.",
            vitals: "TD 100/60, N 100x, RR 24x, S 38.0°C",
            heent: "Bull neck: edema submandibular bilateral. Faring: pseudomembran keabuan di tonsil bilateral, berdarah saat disentuh. Suara serak.",
            neck: "Limfadenopati servikal bilateral."
        },
        labs: {
            "Darah Lengkap": { result: "Leukositosis 14.000", cost: 50000 },
            "Swab Tenggorok": { result: "Pengiriman ke lab rujukan (hasil 3-5 hari). Kultur Corynebacterium diphtheriae.", cost: 75000 }
        },
        vitals: { temp: 38.0, bp: '100/60', hr: 100, rr: 24 },
        correctTreatment: ['erythromycin_500', 'paracetamol_syr'],
        correctProcedures: [],
        requiredEducation: ['isolation', 'contact_screening', 'complete_vaccination', 'report_authority'],
        risk: 'critical',
        nonReferrable: false,
        referralRequired: true,
        referralExceptions: [],
        differentialDiagnosis: ['J03.9', 'J36', 'B27.9'],
        notifiable: true
    },
    {
        id: 'rabies',
        diagnosis: 'Suspek Rabies (Post-Exposure)',
        icd10: 'A82.9',
        skdi: '3B',
        category: 'Infection',
        symptoms: ['Luka gigitan anjing', 'Nyeri/kesemutan luka', 'Demam', 'Agitasi', 'Hidrofobia'],
        clue: "Luka gigitan hewan (anjing/kucing/kera) di daerah endemis rabies. JANGAN DIJAHIT! Cuci luka 15 menit dengan sabun + air mengalir. VAR (Vaksin Anti Rabies) + SAR (Serum Anti Rabies) jika luka kategori III. Fatal jika sudah simptomatik — pencegahan adalah segalanya.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [
                {
                    id: 'q_main',
                    text: 'Digigit apa?',
                    response: 'Digigit anjing tetangga dok, anjingnya liar nggak dirantai. Lukanya dalam.', sentiment: 'denial',
                    variations: {
                        low_education: 'Dikekep asu dok, wetenge jero.',
                        high_education: 'Gigitan anjing kategori III, luka tusuk dalam di betis.',
                        skeptical: 'Digigit anjing.'
                    },
                    priority: 'essential'
                }
            ],
            rps: [
                { id: 'q_when', text: 'Kapan digigitnya?', response: 'Tadi pagi dok, sekitar 4 jam lalu.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_wash', text: 'Sudah dicuci?', response: 'Belum dok, cuma dikasih betadine.', sentiment: 'denial', priority: 'essential' },
                { id: 'q_location', text: 'Di mana lukanya?', response: 'Di betis kiri dok, darahnya banyak.', sentiment: 'confirmation' }
            ],
            rpd: [
                { id: 'q_vaccine', text: 'Pernah vaksin rabies?', response: 'Belum pernah dok.', sentiment: 'denial' }
            ],
            rpk: [],
            sosial: [
                { id: 'q_dog', text: 'Anjingnya gimana?', response: 'Anjing liar dok, mulutnya berbusa. Sekarang sudah kabur.', sentiment: 'confirmation', priority: 'essential' }
            ]
        },
        essentialQuestions: ['q_main', 'q_when', 'q_wash', 'q_dog'],
        anamnesis: ["Digigit anjing liar tadi pagi dok, lukanya dalam di betis. Anjingnya berbusa mulutnya.", "Lukanya belum dicuci, cuma dikasih betadine. Anjingnya nggak dirantai."],
        physicalExamFindings: {
            general: "Tampak cemas, kesakitan.",
            vitals: "TD 130/85, N 95x, RR 20x, S 37.0°C",
            extremities: "Luka tusuk multipel di regio cruris sinistra, diameter 0.5-1cm, kedalaman ≈1cm, perdarahan aktif minimal. Tidak dijahit.",
            neuro: "GCS 15, tidak ada tanda ensefalitis."
        },
        labs: {},
        vitals: { temp: 37.0, bp: '130/85', hr: 95, rr: 20 },
        correctTreatment: ['tetanus_immunoglobulin', 'amoxicillin_500'],
        correctProcedures: ['wound_wash_rabies'],
        requiredEducation: ['wound_care', 'complete_var_schedule', 'animal_control', 'report_authority'],
        risk: 'critical',
        nonReferrable: false,
        referralRequired: true,
        referralExceptions: [],
        differentialDiagnosis: ['T14.1'],
        notifiable: true
    }
];
