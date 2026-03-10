/**
 * @reflection
 * [IDENTITY]: general
 * [PURPOSE]: General medical cases for CaseLibrary.
 * [STATE]: Experimental
 * [LAST_UPDATE]: 2026-02-12
 */

export const GENERAL_CASES = [
    // NOTE: malaria_vivax is in infectious/general.js (detailed version with labs)
    {
        id: 'diabetes_melitus_tipe_2',
        diagnosis: 'Diabetes Melitus Tipe 2',
        icd10: 'E11.9',
        skdi: '4A',
        category: 'General',
        anamnesis: ["Sering haus dok, kencing terus dan berat badan turun.", "Cepat lapar tapi badan malah kurus. Kalo ada luka susah sembuhnya."],
        physicalExamFindings: { general: "Tampak baik, gizi cukup.", vitals: "TD 130/80, N 80x, RR 18x, S 36.6°C", skin: "Acanthosis nigricans (+) minimal di leher." },
        labs: { "Gula Darah Puasa": { result: "180 mg/dL", cost: 30000 }, "HbA1c": { result: "8.2%", cost: 150000 } },
        vitals: { temp: 36.6, bp: '130/80', hr: 80, rr: 18 },
        correctTreatment: ['metformin_500', 'glimepiride_2'],
        correctProcedures: [],
        requiredEducation: ['diet_diabetes', 'regular_exercise', 'foot_care'],
        risk: 'medium', nonReferrable: true, referralExceptions: ['emergency_hhs_kad', 'comorbidity_renal_heart'],
        differentialDiagnosis: ['E11.9', 'E10.9']
    },
    {
        id: 'general_checkup',
        diagnosis: 'General Checkup',
        icd10: 'Z00.0',
        skdi: '4A',
        category: 'General',
        anamnesis: ["Mau periksa aja dok, mumpung lagi libur kerja.", "Saya ingin melakukan general medical check-up rutin untuk screening kesehatan."],
        physicalExamFindings: { general: "Tampak sehat, gizi baik.", vitals: "TD 120/80, N 80x, RR 18x, S 36.5°C" },
        labs: { "Cek Darah Lengkap": { result: "Normal", cost: 50000 } },
        vitals: { temp: 36.5, bp: '120/80', hr: 80, rr: 18 },
        correctTreatment: ['vit_c_50'],
        correctProcedures: [],
        requiredEducation: ['diet_balanced', 'regular_exercise', 'sleep_hygiene'],
        risk: 'low', nonReferrable: true, referralExceptions: [],
        differentialDiagnosis: []
    },
    // === SKDI 1-3 REFERRAL CASES (Endocrine) ===
    {
        id: 'kad',
        diagnosis: 'Ketoasidosis Diabetikum (KAD)',
        icd10: 'E10.1',
        skdi: '3B',
        category: 'General',
        symptoms: ['Penurunan kesadaran', 'Napas Kussmaul', 'Bau aseton', 'Mual muntah', 'Nyeri perut'],
        clue: "EMERGENCY DM! GDS >250 + keton (+) + asidosis metabolik. Trias KAD: hiperglikemia + ketonemia + asidosis. Napas Kussmaul (dalam dan cepat) + bau aseton. Rehidrasi NaCl 0.9% AGRESIF + insulin drip (BUKAN bolus!) + koreksi kalium.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Apa yang terjadi?', response: 'Anak saya lemas banget dok, napasnya cepat dan dalam, keluar bau aneh dari mulut.', sentiment: 'confirmation', priority: 'essential' }],
            rps: [
                { id: 'q_polyuria', text: 'Sering kencing?', response: 'Iya dok, kencing terus, minum banyak, badan makin kurus.', sentiment: 'neutral', priority: 'essential' },
                { id: 'q_vomit', text: 'Ada mual muntah?', response: 'Muntah 5 kali, perut sakit.', sentiment: 'confirmation' }
            ],
            rpd: [{ id: 'q_dm', text: 'Punya kencing manis?', response: 'Baru ketahuan sebulan lalu, belum sempat kontrol.', sentiment: 'denial' }],
            rpk: [], sosial: []
        },
        essentialQuestions: ['q_main', 'q_polyuria'],
        anamnesis: ["Lemas, napas cepat dalam, bau aseton.", "Kencing terus, minum banyak, DM baru, belum kontrol."],
        physicalExamFindings: { general: "Somnolen, dehidrasi berat, napas Kussmaul.", vitals: "TD 90/60, N 120x, RR 32x (Kussmaul), S 37°C", skin: "Turgor menurun, mukosa kering. BAU ASETON dari pernapasan." },
        labs: { "GDS": { result: "480 mg/dL", cost: 15000 }, "Urinalisa": { result: "Glukosa +4, Keton +3", cost: 30000 } },
        vitals: { temp: 37, bp: '90/60', hr: 120, rr: 32 },
        correctTreatment: ['nacl_09_1000', 'insulin_drip'],
        correctProcedures: ['iv_access_2_lines', 'foley_catheter', 'monitor_vital', 'cek_gds_serial'],
        requiredEducation: ['life_threatening', 'icu_needed', 'insulin_education', 'dm_management'],
        risk: 'critical', nonReferrable: false, referralTarget: 'rs_kabupaten',
        differentialDiagnosis: ['E10.1', 'E11.6']
    },
    {
        id: 'hipoglikemia_berat',
        diagnosis: 'Hipoglikemia Berat',
        icd10: 'E16.2',
        skdi: '3B',
        category: 'General',
        symptoms: ['Penurunan kesadaran', 'Keringat dingin', 'Tremor', 'Kejang', 'GDS <54 mg/dL'],
        clue: "Whipple's triad: gejala hipoglikemia + GDS rendah (<70, berat <54) + membaik setelah koreksi glukosa. Cek GDS SEGERA! DEXTROSE 40% 25ml IV bolus (2 flakon) → cek GDS 15 menit → ulangi jika masih rendah. Cari penyebab!",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Apa yang terjadi?', response: 'Bapak saya tiba-tiba pingsan dok, tadi pagi belum makan tapi sudah suntik insulin.', sentiment: 'denial', priority: 'essential' }],
            rps: [
                { id: 'q_insulin', text: 'Insulinnya berapa?', response: 'Biasanya 10 unit, tadi nyuntik 20 unit karena salah lihat.', sentiment: 'confirmation', priority: 'essential' },
                { id: 'q_meal', text: 'Makannya gimana?', response: 'Belum makan dari semalam dok.', sentiment: 'denial' }
            ],
            rpd: [{ id: 'q_dm', text: 'Kencing manisnya minum apa?', response: 'Insulin sama metformin dok.', sentiment: 'confirmation' }],
            rpk: [], sosial: []
        },
        essentialQuestions: ['q_main', 'q_insulin'],
        anamnesis: ["Pingsan, belum makan tapi sudah suntik insulin berlebih.", "Biasa 10 unit, tadi 20 unit, nggak makan dari semalam."],
        physicalExamFindings: { general: "Tidak sadar, GCS E2V2M4=8, keringat dingin profuse.", vitals: "TD 100/60, N 110x, RR 20x, S 36°C", neuro: "Pupil reaktif bilateral. Tremor (+). Refleks fisiologis meningkat." },
        labs: { "GDS": { result: "28 mg/dL", cost: 15000 } },
        vitals: { temp: 36, bp: '100/60', hr: 110, rr: 20 },
        correctTreatment: ['dextrose_40_25ml_iv', 'dextrose_10_maintenance'],
        correctProcedures: ['iv_access', 'cek_gds_serial', 'monitor_vital'],
        requiredEducation: ['insulin_dose_education', 'meal_timing', 'hypo_signs_recognition', 'glucometer_home'],
        risk: 'critical', nonReferrable: false, referralTarget: 'rs_kabupaten',
        differentialDiagnosis: ['E16.2', 'E15']
    },
    {
        id: 'hipertiroid_graves',
        diagnosis: 'Hipertiroid (Penyakit Graves)',
        icd10: 'E05.0',
        skdi: '3A',
        category: 'General',
        symptoms: ['Berdebar-debar', 'Berat badan turun', 'Tremor halus', 'Exophthalmos', 'Keringat berlebih'],
        clue: "Hiperadrenergik: takikardia, tremor halus, BB turun padahal makan banyak, intoleransi panas, diare. Graves = TRIAD: hipertiroid + goiter difus + exophthalmos. Cek TSH (rendah), FT4 (tinggi). PTU/metimazol + propranolol + rujuk endokrin.",
        relevantLabs: [],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Apa keluhannya?', response: 'Jantung berdebar terus dok, badan makin kurus padahal makan banyak, tangan gemetar.', sentiment: 'neutral', priority: 'essential' }],
            rps: [
                { id: 'q_weight', text: 'BB turun berapa?', response: '8 kg dalam 2 bulan dok, padahal nafsu makan malah naik.', sentiment: 'neutral', priority: 'essential' },
                { id: 'q_heat', text: 'Sering gerah?', response: 'Iya dok, gerah terus, keringat banyak, AC ndak cukup.', sentiment: 'confirmation' }
            ],
            rpd: [], rpk: [{ id: 'q_fam', text: 'Keluarga ada penyakit tiroid?', response: 'Ibu saya gondok.', sentiment: 'confirmation' }],
            sosial: []
        },
        essentialQuestions: ['q_main', 'q_weight'],
        anamnesis: ["Berdebar terus, BB turun 8kg/2bln padahal makan banyak, gemetar.", "Gerah berlebihan, ibu gondok."],
        physicalExamFindings: { general: "Kurus, gelisah, tremor.", vitals: "TD 140/60 (pulse pressure lebar), N 110x reguler, RR 20x, S 37.2°C", neck: "Struma difus grade II, bruit (+). Exophthalmos bilateral. Lid lag (+), lid retraction (+).", extremity: "Tremor halus (+), palmar eritema (+), refleks hiperaktif." },
        labs: { "TSH": { result: "<0.01 mIU/L", cost: 100000 }, "FT4": { result: "5.6 ng/dL (tinggi)", cost: 100000 } },
        vitals: { temp: 37.2, bp: '140/60', hr: 110, rr: 20 },
        correctTreatment: ['propylthiouracil_100', 'propranolol_40'],
        correctProcedures: ['cek_tsh_ft4'],
        requiredEducation: ['medication_compliance', 'regular_thyroid_monitoring', 'thyroid_storm_warning', 'endocrine_referral'],
        risk: 'medium', nonReferrable: false, referralTarget: 'rs_kabupaten',
        differentialDiagnosis: ['E05.0', 'E05.9']
    },
    {
        id: 'sindrom_metabolik',
        diagnosis: 'Sindrom Metabolik',
        icd10: 'E88.8',
        skdi: '3A',
        category: 'General',
        symptoms: ['Obesitas sentral', 'Hipertensi', 'Hiperglikemia', 'Dislipidemia', 'Lingkar perut besar'],
        clue: "Kriteria IDF (≥3 dari 5): LP >90cm (pria)/80cm (wanita) + TG >150 + HDL <40(pria)/50(wanita) + TD >130/85 + GDP >100. Kasus screening komprehensif. Intervensi gaya hidup + obati masing-masing komponen.",
        relevantLabs: ['lab_lipid_profile', 'lab_glucose'],
        anamnesisQuestions: {
            keluhan_utama: [{ id: 'q_main', text: 'Ada keluhan apa pak?', response: 'Saya cuma mau medical check-up dok, perut makin gendut, saya khawatir.', sentiment: 'confirmation', priority: 'essential' }],
            rps: [
                { id: 'q_lifestyle', text: 'Pola makannya gimana?', response: 'Banyak makan gorengan, minum manis, jarang olahraga.', sentiment: 'neutral', priority: 'essential' },
                { id: 'q_symptoms', text: 'Ada keluhan lain?', response: 'Sering pusing, kadang tengkuk kaku, buang air kecil malam hari.', sentiment: 'confirmation' }
            ],
            rpd: [{ id: 'q_family', text: 'Keluarga ada DM atau jantung?', response: 'Ayah DM, ibu darah tinggi.', sentiment: 'confirmation' }],
            rpk: [], sosial: [{ id: 'q_smoke', text: 'Merokok?', response: 'Iya, sebungkus sehari.', sentiment: 'confirmation' }]
        },
        essentialQuestions: ['q_main', 'q_lifestyle'],
        anamnesis: ["Medical check-up, perut gendut, khawatir.", "Banyak gorengan, jarang olahraga, keluarga DM dan HT."],
        physicalExamFindings: { general: "Obesitas sentral, gizi lebih.", vitals: "TD 145/90, N 84x, RR 18x, S 36.7°C", anthropometry: "LP: 102 cm. BMI: 30.5. Acanthosis nigricans (+) leher dan aksila." },
        labs: { "GDP": { result: "118 mg/dL", cost: 20000 }, "Kolesterol Total": { result: "245 mg/dL", cost: 40000 }, "Trigliserida": { result: "210 mg/dL", cost: 40000 }, "HDL": { result: "35 mg/dL", cost: 40000 } },
        vitals: { temp: 36.7, bp: '145/90', hr: 84, rr: 18 },
        correctTreatment: ['metformin_500', 'simvastatin_20', 'amlodipine_5'],
        correctProcedures: ['lingkar_perut', 'bmi_calculation'],
        requiredEducation: ['lifestyle_modification', 'weight_loss_target', 'exercise_150min_week', 'stop_smoking', 'cardiovascular_risk'],
        risk: 'medium', nonReferrable: false, referralTarget: 'rs_kabupaten',
        differentialDiagnosis: ['E88.8', 'E11.9']
    }
];
