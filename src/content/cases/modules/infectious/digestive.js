/**
 * @reflection
 * [IDENTITY]: digestive_infectious
 * [PURPOSE]: Digestive infectious cases (Gastroenteritis, Hepatitis, etc.).
 * [STATE]: Stable
 * [ANCHOR]: digestive_infectious
 */
export const digestive_infectious = [
    {
        id: 'acute_gastroenteritis',
        diagnosis: 'Akut Gastroenteritis (Diare Akut)',
        icd10: 'A09',
        skdi: '4A',
        category: 'Digestive',
        symptoms: ['BAB cair >3x/hari', 'Mual muntah', 'Nyeri perut', 'Demam ringan'],
        clue: "BAB cair akut tanpa darah/lendir. Nilai derajat dehidrasi (Wong Baker/WHO). Rehidrasi oral adalah kunci.",
        relevantLabs: ['Feses Lengkap'],
        anamnesisQuestions: {
            keluhan_utama: [
                { id: 'q_main', text: 'Keluhannya apa Pak/Bu?', response: 'Saya mencret-mencret dok, sudah 5 kali sejak pagi.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_stool_desc', text: 'BAB-nya seperti apa?', response: 'Cair dok, warnanya kuning, nggak ada darah.', sentiment: 'confirmation' }
            ],
            rps: [
                { id: 'q_vomit', text: 'Ada muntah?', response: 'Iya muntah 2 kali.', sentiment: 'confirmation' },
                { id: 'q_fever', text: 'Demam?', response: 'Badan agak hangat dok.', sentiment: 'confirmation' },
                { id: 'q_thirsty', text: 'Haus terus atau malah malas minum?', response: 'Rasanya haus terus dok, pengen minum.', sentiment: 'neutral' }
            ],
            rpd: [
                { id: 'q_gastritis', text: 'Punya sakit maag?', response: 'Kadang-kadang sakit maag.', sentiment: 'confirmation' }
            ],
            rpk: [
                { id: 'q_fam_sick', text: 'Ada yang sakit sama di rumah?', response: 'Anak saya juga mencret dok.', sentiment: 'confirmation' }
            ],
            sosial: [
                { id: 'q_food', text: 'Kemarin makan apa?', response: 'Makan sambal yang agak pedas di warung.', sentiment: 'neutral' }
            ]
        },
        essentialQuestions: ['q_main', 'q_stool_desc', 'q_thirsty'],
        anamnesis: ["BAB cair lebih dari 5 kali, tidak ada darah.", "Badan lemas, haus terus, dan perut mules."],
        physicalExamFindings: {
            general: "Tampak lemas, mata agak cekung.",
            vitals: "TD 100/70, N 96x, RR 20x, S 37.5°C",
            abdomen: "Bising usus meningkat, turgor kembali lambat (<2 detik).",
            skin: "Akral hangat, CRT <2 detik."
        },
        labs: {
            "Feses Lengkap": { result: "Konsistensi cair, Lendir (-), Darah (-), Leukosit 1-2/lpb", cost: 35000 }
        },
        vitals: { temp: 37.5, bp: '100/70', hr: 96, rr: 20 },
        correctTreatment: ['oralit', 'zinc_20', 'attapulgite'],
        correctProcedures: [],
        requiredEducation: ['fluid_intake', 'hand_hygiene', 'diet_bratt', 'red_flag_monitor'],
        risk: 'medium',
        nonReferrable: true,
        referralExceptions: ['severe_dehydration', 'emergency', 'comorbidity'],
        differentialDiagnosis: ['K52.9', 'A05.9']
    },
    {
        id: 'hepatitis_a',
        diagnosis: 'Hepatitis A',
        icd10: 'B15',
        skdi: '4A',
        category: 'Digestive',
        symptoms: ['Mata kuning', 'Kulit kuning', 'Mual muntah', 'Urin gelap', 'Nyeri perut kanan'],
        clue: "Ikterus + urin gelap + mual + nyeri perut kanan atas. Hepatomegali. Transmisi fekal-oral.",
        relevantLabs: ['SGOT/SGPT', 'Bilirubin', 'IgM Anti-HAV'],
        anamnesisQuestions: {
            keluhan_utama: [
                { id: 'q_main', text: 'Matanya kenapa?', response: 'Badan saya kuning dok, mata juga kuning. Pipis warnanya pekat kayak teh.', sentiment: 'confirmation', priority: 'essential' }
            ],
            rps: [
                { id: 'q_nausea', text: 'Mual muntah?', response: 'Mual terus dok, nggak nafsu makan.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_pain', text: 'Nyeri perut?', response: 'Perut kanan atas agak nyeri.', sentiment: 'confirmation' }
            ],
            rpd: [{ id: 'q_history', text: 'Pernah hepatitis?', response: 'Belum pernah dok.', sentiment: 'denial' }],
            rpk: [{ id: 'q_fam', text: 'Keluarga ada?', response: 'Nggak ada dok.', sentiment: 'denial' }],
            sosial: [{ id: 'q_food', text: 'Makan di luar?', response: 'Sering jajan es buah di pinggir jalan.', sentiment: 'confirmation', priority: 'essential' }]
        },
        essentialQuestions: ['q_main', 'q_nausea', 'q_food'],
        anamnesis: ["Badan saya kuning dok, mata juga kuning. Pipis warnanya pekat kayak teh.", "Mual terus dok, nggak nafsu makan. Mata sama badan kuning."],
        physicalExamFindings: {
            general: "Tampak ikterik.",
            vitals: "TD 110/70, N 78x, RR 18x, S 37.5°C",
            abdomen: "Hepatomegali 2 jari BAC, nyeri tekan (+)."
        },
        labs: {
            "SGOT/SGPT": { result: "SGOT 450, SGPT 520 (Tinggi)", cost: 60000 },
            "Bilirubin": { result: "Total 8.5, Direct 6.2 (Tinggi)", cost: 50000 }
        },
        vitals: { temp: 37.5, bp: '110/70', hr: 78, rr: 18 },
        correctTreatment: ['hepatoprotector', 'vit_b_complex'],
        correctProcedures: [],
        requiredEducation: ['bed_rest', 'diet_soft', 'hand_hygiene', 'isolation_home'],
        risk: 'medium',
        nonReferrable: true,
        referralExceptions: ['emergency', 'comorbidity'],
        differentialDiagnosis: ['B16', 'K70.1']
    },
    {
        id: 'food_poisoning',
        diagnosis: 'Keracunan Makanan',
        icd10: 'T62',
        skdi: '4A',
        category: 'Digestive',
        symptoms: ['Mual muntah', 'Diare', 'Nyeri perut kolik', 'Setelah makan'],
        clue: "Onset akut mual, muntah, diare setelah makan. Curiga makanan tercemar bakteri/toksin.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [
                { id: 'q_main', text: 'Ada keluhan apa?', response: 'Muntah-muntah mencar setelah makan nasi uduk dok, perut mules.', sentiment: 'confirmation', priority: 'essential' }
            ],
            rps: [
                { id: 'q_onset', text: 'Kapan mulai?', response: '2 jam setelah makan nasi uduk pinggir jalan.', sentiment: 'neutral', priority: 'essential' },
                { id: 'q_others', text: 'Yang makan bareng juga sakit?', response: 'Iya dok, teman saya juga muntah.', sentiment: 'confirmation' }
            ],
            rpd: [{ id: 'q_history', text: 'Pernah seperti ini?', response: 'Belum pernah dok.', sentiment: 'denial' }],
            rpk: [{ id: 'q_fam', text: 'Keluarga ada?', response: 'Nggak, cuma saya sama teman.', sentiment: 'denial' }],
            sosial: []
        },
        essentialQuestions: ['q_main', 'q_onset'],
        anamnesis: ["Muntah-muntah mencar setelah makan nasi uduk.", "Teman yang makan bareng juga sakit."],
        physicalExamFindings: {
            general: "Tampak lemas, dehidrasi ringan.",
            vitals: "TD 100/70, N 100x, RR 20x, S 37.0°C",
            abdomen: "BU meningkat, nyeri tekan difus ringan."
        },
        labs: {},
        vitals: { temp: 37.0, bp: '100/70', hr: 100, rr: 20 },
        correctTreatment: ['oralit', 'ondansetron_4', 'antasida_doen'],
        correctProcedures: ['iv_fluid'],
        requiredEducation: ['fluid_intake', 'hand_hygiene', 'food_hygiene'],
        risk: 'medium',
        nonReferrable: true,
        referralExceptions: ['emergency', 'comorbidity'],
        differentialDiagnosis: ['A05.9', 'A01.0']
    },
    {
        id: 'oral_candidiasis',
        diagnosis: 'Kandidiasis Mulut',
        icd10: 'B37.0',
        skdi: '4A',
        category: 'Digestive',
        symptoms: ['Bercak putih di mulut', 'Nyeri mulut', 'Sulit menelan', 'Lidah terasa pahit'],
        clue: "Plak putih seperti susu di mukosa oral, dapat dikerok meninggalkan dasar eritema. Sering pada bayi atau immunocompromised.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [
                {
                    id: 'q_main',
                    text: 'Mulutnya kenapa bu?',
                    response: 'Ada bercak-bercak putih dok, nyeri kalau makan.', sentiment: 'confirmation',
                    variations: {
                        low_education: 'Anak saya mulutnya putih-putih dok, nangis terus kalau mau mimi.',
                        high_education: 'Ada plak putih di mukosa oral, seperti oral thrush.',
                        skeptical: 'Putih-putih di mulut.'
                    },
                    priority: 'essential'
                }
            ],
            rps: [
                { id: 'q_feeding', text: 'Menyusu/makan masih mau?', response: 'Susah dok, kayaknya sakit.', sentiment: 'confirmation' },
                { id: 'q_duration', text: 'Sudah berapa lama?', response: 'Seminggu ini dok.', sentiment: 'confirmation' }
            ],
            rpd: [
                { id: 'q_ab', text: 'Habis minum antibiotik?', response: 'Iya dok, minggu lalu habis batuk pilek dikasih antibiotik.', sentiment: 'confirmation' }
            ],
            rpk: [],
            sosial: [{ id: 'q_bottle', text: 'Pakai dot?', response: 'Iya dok, botol susu.', sentiment: 'confirmation' }]
        },
        essentialQuestions: ['q_main', 'q_ab'],
        anamnesis: ["Mulut saya ada bercak putih-putih dok, sudah seminggu.", "Lidah saya putih-putih dok, perih kalau makan. Habis minum antibiotik."],
        physicalExamFindings: {
            general: "Bayi tampak rewel.",
            vitals: "TD -, N 110x, RR 28x, S 37.0°C",
            heent: "Plak putih multipel di lidah, mukosa bukal, palatum. Dapat dikerok, meninggalkan dasar eritema."
        },
        labs: {},
        vitals: { temp: 37.0, bp: '-', hr: 110, rr: 28 },
        correctTreatment: ['nystatin_oral_drops'],
        correctProcedures: [],
        requiredEducation: ['bottle_sterilization', 'oral_hygiene', 'finish_medication'],
        risk: 'low',
        nonReferrable: true,
        referralExceptions: ['no_improvement', 'comorbidity'],
        differentialDiagnosis: ['K12.0', 'B00.2']
    },
    {
        id: 'dysentery',
        diagnosis: 'Disentri Basiler',
        icd10: 'A03.9',
        skdi: '4A',
        category: 'Digestive',
        symptoms: ['BAB berlendir darah', 'Nyeri perut melilit', 'Demam', 'Tenesmus'],
        clue: "BAB cair berlendir dengan darah. Tenesmus (+). Demam. Biasanya karena Shigella. Berbeda dengan amuba yang lebih kronis.",
        relevantLabs: ['Feses Lengkap'],
        anamnesisQuestions: {
            keluhan_utama: [
                {
                    id: 'q_main',
                    text: 'BAB-nya gimana?',
                    response: 'Berdarah dok, ada lendirnya, perut mules banget.', sentiment: 'confirmation',
                    variations: {
                        low_education: 'Mencret darah dok, lendir campur, perut melilit terus.',
                        high_education: 'Diare berdarah dengan mucus, disertai cramping abdominal dan tenesmus.',
                        skeptical: 'BAB darah.'
                    },
                    priority: 'essential'
                }
            ],
            rps: [
                { id: 'q_freq', text: 'Berapa kali sehari?', response: 'Lebih dari 10 kali dok.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_tenesmus', text: 'Serasa mau BAB terus?', response: 'Iya dok, tapi cuma keluar sedikit-sedikit.', sentiment: 'confirmation' },
                { id: 'q_fever', text: 'Demam?', response: 'Iya dok, panas tinggi.', sentiment: 'confirmation' }
            ],
            rpd: [{ id: 'q_food', text: 'Kemarin makan apa?', response: 'Makan di warung pinggir jalan dok.', sentiment: 'neutral' }],
            rpk: [],
            sosial: [{ id: 'q_water', text: 'Air minum dari mana?', response: 'Air sumur dok.', sentiment: 'confirmation' }]
        },
        essentialQuestions: ['q_main', 'q_freq', 'q_tenesmus'],
        anamnesis: ["BAB saya berlendir darah dok, sehari lebih dari 10 kali.", "Mencret terus dok, isinya lendir campur darah. Demam tinggi, mules pegel."],
        physicalExamFindings: {
            general: "Tampak sakit sedang, lemas, dehidrasi ringan.",
            vitals: "TD 100/70, N 100x, RR 20x, S 38.5°C",
            abdomen: "Datar, defense musculaire (-), nyeri tekan seluruh abdomen terutama hypogastrium. BU (+) meningkat."
        },
        labs: {
            "Feses Lengkap": { result: "Konsistensi cair, lendir (+), darah (+), leukosit >10/LPB, eritrosit (+)", cost: 35000 }
        },
        vitals: { temp: 38.5, bp: '100/70', hr: 100, rr: 20 },
        correctTreatment: ['ciprofloxacin_500', 'oralit', 'paracetamol_500', 'zinc_20'],
        correctProcedures: [],
        requiredEducation: ['hand_hygiene', 'food_hygiene', 'fluid_intake', 'boil_water'],
        risk: 'medium',
        nonReferrable: true,
        referralExceptions: ['emergency', 'no_improvement', 'comorbidity'],
        differentialDiagnosis: ['A06.0', 'A09']
    }
];
