/**
 * @reflection
 * [IDENTITY]: PediatricCases
 * [PURPOSE]: Pediatric-specific emergency cases (Bronkiolitis, Intususepsi, KAD anak, Asfiksia neonatus).
 * [STATE]: Stable
 */

export const PEDIATRIC_CASES = [
    {
        id: 'bronchiolitis_severe',
        diagnosis: 'Bronkiolitis Berat',
        icd10: 'J21.0',
        icd9cm: ['93.94', '96.04'],
        skdi: '3B',
        category: 'Pediatrics',
        triageLevel: 2,
        esiLevel: 2,
        symptoms: ['Sesak napas berat pada bayi', 'Wheezing', 'Retraksi dinding dada', 'Napas cuping hidung', 'Sulit menyusu'],
        clue: "[URGENT] Bayi <2 tahun dengan sesak + wheezing setelah ISPA. Curiga Bronkiolitis RSV — oksigenasi utama, bukan bronkodilator!",
        relevantLabs: ['SpO2', 'Darah Lengkap'],
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
        essentialQuestions: ['q_onset', 'q_feed', 'q_blue'],
        anamnesis: [
            "Bayi saya sesak napas dok, awalnya pilek biasa tapi makin berat, nggak mau nyusu.",
            "Napasnya bunyi ngik-ngik, dadanya kelihatan cekung-cekung."
        ],
        physicalExamFindings: {
            general: "Bayi 8 bulan, tampak sesak berat, napas cuping hidung (+), retraksi subkostal dan interkostal.",
            vitals: "N 160x, RR 62x, S 37.8°C, SpO2 88%",
            thorax: "Wheezing ekspiratori bilateral, ronkhi basah halus, ekspirasi memanjang.",
            extremities: "Akral hangat, CRT <2 detik, sianosis perioral minimal."
        },
        correctTreatment: [
            ['oxygen', 'suction_airway', 'monitor_vitals_15'],
            ['iv_line', 'iv_fluid_rl', 'paracetamol_syr']
        ],
        differentialDiagnosis: ['Asma pada bayi', 'Pneumonia', 'Aspirasi benda asing', 'Pertusis'],
        risk: 'emergency',
        referralRequired: true,
        referralTarget: 'SpA',
        deteriorationRate: 4,
        sisruteData: {
            situation: 'Bayi 8 bulan sesak napas berat, SpO2 88%, retraksi (+), wheezing bilateral.',
            background: 'ISPA 3 hari, kakak baru flu. Lahir cukup bulan.',
            assessment: 'Bronkiolitis berat curiga RSV. Butuh monitoring ICU anak.',
            recommendation: 'Rawat PICU / HCU anak untuk monitoring oksigenasi dan hidrasi.'
        },
        billingItems: {
            tindakan: [{ code: '96.04', name: 'Terapi Oksigen', actionId: 'oxygen' }, { code: '96.6', name: 'IV Line', actionId: 'iv_line' }],
            obat: [{ medId: 'paracetamol_syr', qty: 1 }],
            alkes: [{ id: 'iv_cannula', qty: 1, unitCost: 15000 }, { id: 'kasa_steril', qty: 2, unitCost: 5000 }],
            estimatedCost: 250000
        },
        wikiKey: 'igd_bronchiolitis'
    },
    {
        id: 'intussusception',
        diagnosis: 'Intususepsi',
        icd10: 'K56.1',
        icd9cm: ['46.80'],
        skdi: '2',
        category: 'Pediatrics',
        triageLevel: 1,
        esiLevel: 2,
        symptoms: ['Nyeri perut kolik hilang-timbul', 'BAB darah lendir (currant jelly)', 'Muntah hijau', 'Benjolan perut', 'Bayi menekuk kaki ke perut'],
        clue: "[CRITICAL] Bayi/anak kolik hebat + BAB darah lendir (red currant jelly stool). Curiga Intususepsi — RUJUK SEGERA untuk USG + reduksi!",
        relevantLabs: ['Darah Lengkap'],
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
        essentialQuestions: ['q_pain', 'q_stool', 'q_vomit'],
        anamnesis: [
            "Anak saya nangis kesakitan terus-terusan, kakinya ditekuk ke perut, BAB darah lendir.",
            "Kolik hebat hilang-timbul, muntah hijau, BAB kayak selai merah gelap."
        ],
        physicalExamFindings: {
            general: "Anak 9 bulan, rewel, gelisah, tampak kesakitan tiba-tiba kemudian tenang berulang.",
            vitals: "N 150x, RR 36x, S 37.5°C",
            abdomen: "Teraba massa sosis (sausage-shaped) di kuadran kanan atas. Dance sign (+) — kuadran kanan bawah terasa kosong. Bising usus meningkat saat kolik.",
            extremities: "CRT 2 detik, turgor cukup."
        },
        correctTreatment: [
            ['iv_line', 'iv_fluid_rl', 'ngt_decompression'],
            ['monitor_vitals_15', 'ondansetron_iv']
        ],
        differentialDiagnosis: ['Volvulus', 'Apendisitis akut', 'Divertikel Meckel', 'GEA dengan dehidrasi'],
        risk: 'critical',
        referralRequired: true,
        referralTarget: 'SpBA',
        deteriorationRate: 6,
        sisruteData: {
            situation: 'Bayi 9 bulan kolik abdomen hilang-timbul + BAB berdarah lendir (currant jelly) + muntah bilious.',
            background: 'Onset 6 jam, massa sosis teraba di RUQ, Dance sign (+).',
            assessment: 'Suspek Intususepsi. Butuh USG konfirmasi + reduksi hidrostatik/operatif segera.',
            recommendation: 'Rujuk SpBA untuk reduksi barium/udara atau laparotomi jika gagal/perforasi.'
        },
        billingItems: {
            tindakan: [{ code: '96.6', name: 'IV Line', actionId: 'iv_line' }, { code: '96.07', name: 'NGT Dekompresi', actionId: 'ngt_decompression' }],
            obat: [{ medId: 'ondansetron_iv', qty: 1 }],
            alkes: [{ id: 'ngt_tube', qty: 1, unitCost: 25000 }, { id: 'iv_cannula', qty: 1, unitCost: 15000 }],
            estimatedCost: 350000
        },
        wikiKey: 'igd_intussusception'
    },
    {
        id: 'dka_pediatric',
        diagnosis: 'Ketoasidosis Diabetik pada Anak',
        icd10: 'E10.1',
        icd9cm: ['99.18', '96.6'],
        skdi: '3B',
        category: 'Pediatrics',
        triageLevel: 1,
        esiLevel: 1,
        symptoms: ['Napas Kussmaul', 'Penurunan kesadaran', 'Muntah', 'Nyeri perut', 'Napas bau aseton', 'Dehidrasi berat'],
        clue: "[CRITICAL] Anak dengan napas cepat-dalam (Kussmaul) + dehidrasi + bau aseton. Curiga KAD! Cek GDS segera, resusitasi cairan!",
        relevantLabs: ['GDS', 'Darah Lengkap', 'Elektrolit', 'AGD'],
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
        essentialQuestions: ['q_event', 'q_drink', 'q_weight'],
        anamnesis: [
            "Anak lemas dan muntah, napas cepat sekali, baunya kayak buah busuk dari mulut.",
            "Minum banyak sekali tapi makin kurus, sekarang nggak sadar."
        ],
        physicalExamFindings: {
            general: "Anak 10 tahun, somnolen, dehidrasi berat, napas Kussmaul, bau aseton (+).",
            vitals: "TD 90/60, N 130x, RR 36x dalam, S 37.0°C",
            abdomen: "Nyeri tekan difus, bising usus menurun.",
            neuro: "GCS E3V4M5 = 12, pupil isokor, refleks normal."
        },
        correctTreatment: [
            ['reagen_gds', 'iv_line', 'nacl_resus', 'catheter_urine'],
            ['insulin_drip', 'monitor_vitals_15', 'monitor_gds']
        ],
        differentialDiagnosis: ['Sepsis', 'Keracunan metanol', 'Gagal ginjal akut', 'Asidosis laktat'],
        risk: 'critical',
        referralRequired: true,
        referralTarget: 'SpA',
        deteriorationRate: 7,
        sisruteData: {
            situation: 'Anak 10 tahun GCS 12, napas Kussmaul, GDS >500, dehidrasi berat, bau aseton (+).',
            background: 'Polidipsi-poliuri 1 bulan, BB turun 3 kg. Belum ada diagnosis DM sebelumnya.',
            assessment: 'KAD berat pada DM tipe 1 onset baru. Butuh PICU untuk insulin drip + monitoring ketat.',
            recommendation: 'PICU anak untuk terapi insulin drip, koreksi elektrolit, monitoring AGD serial.'
        },
        billingItems: {
            tindakan: [{ code: '96.6', name: 'IV Line', actionId: 'iv_line' }, { code: '99.18', name: 'Insulin Drip', actionId: 'insulin_drip' }],
            obat: [{ medId: 'insulin_drip', qty: 1 }, { medId: 'nacl_resus', qty: 2 }],
            alkes: [{ id: 'iv_cannula', qty: 1, unitCost: 15000 }, { id: 'kateter_foley', qty: 1, unitCost: 25000 }],
            estimatedCost: 500000
        },
        wikiKey: 'igd_dka_child'
    },
    {
        id: 'neonatal_asphyxia',
        diagnosis: 'Asfiksia Neonatus',
        icd10: 'P21.0',
        icd9cm: ['93.96', '96.04'],
        skdi: '3B',
        category: 'Pediatrics',
        triageLevel: 1,
        esiLevel: 1,
        symptoms: ['Bayi tidak menangis', 'Sianosis', 'Tonus lemah', 'Napas megap-megap', 'Bradikardia'],
        clue: "[CRITICAL] Neonatus tidak menangis saat lahir — APGAR rendah. Lakukan resusitasi neonatus (golden minute)! Keringkan, rangsang, bersihkan jalan napas!",
        relevantLabs: [],
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
        essentialQuestions: ['q_birth', 'q_cry', 'q_meconium'],
        anamnesis: [
            "Bayinya nggak nangis dok setelah lahir, warnanya biru, lemas.",
            "Partus lama, ketuban pecah dini, air ketuban bercampur mekonium."
        ],
        physicalExamFindings: {
            general: "Neonatus aterm, tidak bernapas spontan adekuat, tonus hipotonik, sianosis sentral.",
            vitals: "N 80x (bradikardia), RR: gasping, S 35.5°C, APGAR 1' = 3",
            thorax: "Retraksi berat, air entry sangat berkurang.",
            extremities: "Fleksus, tonus menurun, refleks lemah."
        },
        correctTreatment: [
            ['protect_airway', 'warm_compress', 'suction_airway', 'rescue_breathing'],
            ['oxygen', 'monitor_vitals_15']
        ],
        differentialDiagnosis: ['Aspirasi mekonium', 'Sepsis neonatus', 'Kelainan jantung bawaan', 'Prematuritas'],
        risk: 'critical',
        referralRequired: true,
        referralTarget: 'SpA_Neonatologi',
        deteriorationRate: 10,
        sisruteData: {
            situation: 'Neonatus aterm tidak bernapas spontan, APGAR 3, sianosis sentral, bradikardia N 80x.',
            background: 'Partus lama, KPD >12 jam, mekonium (+). ANC tidak lengkap.',
            assessment: 'Asfiksia berat neonatus, curiga aspirasi mekonium. Butuh NICU segera.',
            recommendation: 'NICU untuk ventilasi mekanik, monitoring, curiga aspirasi mekonium.'
        },
        billingItems: {
            tindakan: [{ code: '93.96', name: 'Resusitasi Neonatus', actionId: 'rescue_breathing' }, { code: '96.04', name: 'Oksigen', actionId: 'oxygen' }],
            obat: [],
            alkes: [{ id: 'suction_catheter', qty: 1, unitCost: 15000 }, { id: 'ambu_bag_neonatal', qty: 1, unitCost: 50000 }],
            estimatedCost: 200000
        },
        wikiKey: 'igd_neonatal_asphyxia'
    }
];
