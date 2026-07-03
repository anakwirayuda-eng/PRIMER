export default {
    emergency: {
        ui: {
            clickForWiki: 'Click for wiki',
            emptyQueueTitle: 'No ER patients',
            emptyQueueSubtitle: 'Emergency patients will appear here',
            headerTitle: 'ER - Emergency',
            patientsCount: '{{count}} patients',
            ageShort: 'yr',
            deteriorationPlateau: 'Condition holding (plateau)',
            deteriorationWorsening: 'Condition worsening ({{value}}%)',
            sampleTitle: 'S.A.M.P.L.E Rapid Anamnesis',
            choosePatient: 'Choose a patient from the triage board',
            chiefComplaint: 'Chief Complaint',
            esiAssignment: 'ESI Triage Assignment',
            esiGuide: 'ESI Guide',
            lockTriage: 'Lock Triage Assessment',
            expectedTriage: 'Expected:',
            workingDiagnosis: 'Working Diagnosis (Suspect)',
            diagnosisUnknown: 'Not Established Yet',
            actionGridTitle: 'Tactical Action Grid',
            wikiInfo: 'Wiki Info',
            interventionCode: 'INTV',
            evaluateActions: 'Evaluate & Complete Actions',
            recoveryScore: 'Recovery Score: {{score}}%',
            missedActions: 'Missed: {{actions}}',
            finalStatus: 'Final Status',
            differentialDiagnosis: 'Differential Diagnosis (DDx)',
            referralLetter: 'For Referral Letter:',
            workingDx: 'Working Dx',
            ddxLabel: 'DDx',
            actionsLabel: 'Actions',
            noActions: 'None yet',
            billingTitle: 'Administration & Billing Details',
            insuranceBpjs: 'BPJS',
            insuranceGeneral: 'General',
            registration: 'ER Registration',
            medicalService: 'Medical Service & Resuscitation',
            totalBill: 'TOTAL BILL',
            coverageLabel: 'Coverage: {{type}}',
            bpjsRejected: 'Non-emergency triage (Green) is not covered by BPJS in the ER.',
            coveredFull: 'All emergency actions are fully covered.',
            dischargeHome: 'Discharge Home',
            referSisrute: 'Refer (SISRUTE)',
            delegateMaia: 'Delegate remaining documents to MAIA',
            repPenalty: '-5 Rep',
            waitingAmbulanceTitle: 'Waiting for Ambulance',
            waitingAmbulanceAccepted: 'SISRUTE accepted at {{hospital}}',
            referralHospitalFallback: 'Referral Hospital',
            etaTitle: 'Estimated Arrival (ETA)',
            etaCompact: 'ETA {{time}}',
            etaMinutes: '{{minutes}} MIN',
            etaArrived: 'ARRIVED',
            deteriorationNotice: 'Deterioration: {{value}}% - monitor closely, Code Blue may occur!',
            codeBlack: 'CODE BLACK',
            resuscitationStopped: 'Resuscitation Stopped.',
            deathRecorded: 'Time of death recorded: {{time}}.',
            maxResuscitationReached: 'Maximum resuscitation attempts ({{attempts}}x) have been completed and the patient did not respond.',
            mortuaryDocumentation: 'Mortuary Documentation',
            codeBlue: 'CODE BLUE',
            arrestDetected: 'Cardiac / Respiratory Arrest Detected',
            cprPrompt: 'Start cardiopulmonary resuscitation (CPR) on {{name}} immediately!',
            resuscitationAttempt: 'Attempt {{current}} / Limit: {{max}}',
            startCpr: 'START CPR / DEFIBRILLATION',
            codeRed: 'CODE RED / CRITICAL',
            criticalDeterioration: 'Critical Deterioration Reached',
            referPrompt: '{{name}}\'s condition is highly unstable and requires immediate escalation or referral!',
            referImmediate: 'REFER / STABILIZE IMMEDIATELY',
            deteriorationStatus: 'Deterioration Status',
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
            triage: 'Triage',
            stabilization: 'Stabilization',
            disposition: 'Disposition'
        },
        sampleTabs: {
            S: 'Symptoms',
            A: 'Allergies',
            M: 'Medications',
            P: 'Past History',
            L: 'Last Meal',
            E: 'Events'
        },
        sampleDefaults: {
            symptomQuestion: 'Symptoms',
            allergyQuestion: 'Any drug or food allergies?',
            allergyNone: 'No known allergies.',
            routineMedication: 'Routine medication',
            routineMedicationQuestion: 'Taking any regular medications?',
            noRoutineMedication: 'No routine medications.',
            pastMedicalHistory: 'Past medical history',
            noSignificantHistory: 'No significant medical history.',
            lastMealQuestion: 'When was the last meal or drink?',
            lastMealAnswer: 'Earlier this morning before the incident.',
            priorEventQuestion: 'What happened beforehand?',
            suddenComplaint: 'The complaint started suddenly.'
        },
        triageLevels: {
            1: { name: 'RED', desc: 'Immediate - Life-threatening' },
            2: { name: 'YELLOW', desc: 'Urgent - Potentially life-threatening' },
            3: { name: 'GREEN', desc: 'Non-Urgent - Can be delayed' },
            4: { name: 'BLACK', desc: 'Deceased / Expectant' }
        },
        esiLevels: {
            1: { name: 'ESI 1: Resuscitation', desc: 'Needs immediate life support (intubation, shock, cardiac arrest).' },
            2: { name: 'ESI 2: Emergent', desc: 'High risk, severe pain, or altered consciousness. Must be seen quickly (10m).' },
            3: { name: 'ESI 3: Urgent', desc: 'Stable but needs many resources (labs, IV, imaging).' },
            4: { name: 'ESI 4: Less Urgent', desc: 'Stable and needs only one type of resource.' },
            5: { name: 'ESI 5: Non-Urgent', desc: 'Stable and needs no major resources.' }
        },
        validation: {
            triage: {
                correct: 'Triage is correct. The patient priority is appropriate.',
                near: 'Triage is close, but the priority is slightly off.',
                under: 'Under-triage. This patient is more critical than assessed.',
                over: 'Over-triage. The patient is less critical than assessed.'
            },
            stabilization: {
                excellent: 'Initial stabilization was appropriate.',
                partial: 'Some important actions are still missing.',
                poor: 'Stabilization is inadequate. The patient remains in danger.'
            }
        },
        maia: {
            clueTitle: 'MAIA Insight',
            validationTitle: 'MAIA Evaluation',
            close: 'Close',
            clueFallback: "Try focusing on {{target}} and the patient's history.",
            mainSymptom: 'the main symptom',
            stats: {
                anamnesis: 'Anamnesis',
                diagnosis: 'Diagnosis',
                treatment: 'Treatment',
                exams: 'Examinations',
                education: 'Education'
            },
            suggestionsTitle: 'MAIA Suggestions',
            physicalExam: 'Physical Examination',
            laboratory: 'Laboratory',
            showAnswer: 'Show Answer Key',
            hideAnswer: 'Hide Discussion',
            ebmClueTitle: 'EBM Clinical Clue',
            diagnosisSection: 'Diagnosis',
            correct: 'CORRECT',
            incorrect: 'INCORRECT',
            differentialDiagnosis: 'Differential Diagnosis',
            anamnesisSection: 'Anamnesis',
            essentialQuestions: 'Essential Questions',
            chiefComplaintFallback: 'Patient chief complaint',
            totalAsked: 'Total asked: {{count}} questions',
            treatmentSection: 'Treatment',
            correctTherapy: 'Correct Therapy',
            missingMeds: 'Not given yet',
            unnecessaryMeds: 'Not necessary',
            correctProcedures: 'Appropriate Procedures',
            missingProcs: 'Procedures not done yet',
            examsSection: 'Examinations',
            relevantLabs: 'Relevant Labs',
            missingExams: 'Physical exam not done',
            missingLabs: 'Labs not ordered yet',
            unnecessaryLabs: 'Unnecessary labs',
            educationSection: 'Education',
            requiredEducation: 'Required Education',
            unnecessaryEducation: 'Not necessary',
            skdi: 'SKDI',
            risk: 'Risk',
            nonReferrable: 'Non-Referrable (KMK 1186/2022)',
            reasoningTitle: 'Clinical Reasoning',
            reasoningSubtitle: 'By Dr. MAIA',
            overallInvestigation: 'Overall Clinical Investigation',
            coverageAnamnesis: 'Anamnesis (EBM)',
            coveragePhysical: 'Physical Examination',
            coverageLabs: 'Laboratory',
            diagnosticProbability: 'Diagnostic Probability (Bayesian)',
            lowConfidenceHint: 'MAIA suggestion: the current investigation base is still too limited to distinguish {{primary}} from {{secondary}}. Continue exploring.',
            expertInsight: 'MAIA Expert Insight',
            confidenceLevel: 'Confidence Level: {{level}}',
            confidenceHigh: 'HIGH (DEFINITIVE)',
            confidenceMedium: 'MEDIUM (PROBABLE)',
            confidenceLow: 'LOW (POSSIBLE)',
            orSeparator: ' OR '
        },
        patientStatus: {
            improved: { label: 'Improved', description: 'The patient improved after treatment.' },
            stable: { label: 'Stable', description: 'The patient is stable and can be monitored.' },
            unchanged: { label: 'No Major Change', description: 'The patient has not shown meaningful improvement yet.' },
            deteriorating: { label: 'Deteriorating', description: 'The patient is worsening and needs escalation.' },
            critical: { label: 'Critical', description: 'The patient is critical and needs immediate referral.' }
        },
        actions: {
            oxygen: 'Oxygen (Nasal Cannula / Mask)',
            protect_airway: 'Protect Airway',
            suction_airway: 'Airway Suction',
            heimlich_maneuver: 'Heimlich Maneuver / Back Blows',
            monitor_vitals_15: 'Monitor Vital Signs every 15-30 min',
            cpr: 'CPR (Cardiopulmonary Resuscitation)',
            iv_line: 'Establish IV Access',
            salbutamol_neb: 'Nebulized Salbutamol 2.5 mg',
            ipratropium_neb: 'Nebulized Ipratropium',
            methylprednisolone_iv: 'IV Steroid (Methylprednisolone)',
            observation_6h: 'Observe for 4-6 hours',
            evaluate_nebu: 'Reassess Nebulizer Response',
            find_focus: 'Search for Source of Infection',
            education_seizure: 'Seizure First-Aid Education',
            check_cause: 'Check the Cause (Glucose, Fever, Trauma)',
            head_tilt: 'Head Tilt / Chin Lift',
            recovery_position: 'Recovery Position',
            rescue_breathing: 'Rescue Breathing (Bag Valve Mask)',
            wound_cleaning: 'Clean the Wound (Saline / Clean Water)',
            hemostasis: 'Hemostasis (Direct Pressure)',
            suturing: 'Wound Suturing',
            warm_compress: 'Warm Compress',
            cold_compress: 'Cold Compress',
            burn_cooling: 'Cool Under Running Water (20 min)',
            silver_sulfadiazine: 'Silver Sulfadiazine Cream',
            burn_wrap: 'Sterile Burn Dressing',
            immobilize_limb: 'Immobilize the Limb (Splint)',
            splint_fracture: 'Fracture Splinting',
            iv_fluid_rl: 'Ringer Lactate Infusion',
            rehydration_bolus: '0.9% NaCl Fluid Bolus 20 mL/kg',
            epinephrine_inj: 'Epinephrine 0.3-0.5 mg IM',
            amoxicillin_500: 'Antibiotic Prophylaxis',
            aspilet_160: 'Aspirin 160 mg (Loading Dose)',
            isdn_5: 'ISDN 5 mg Sublingual',
            clopidogrel_300: 'Clopidogrel 300 mg (Loading Dose)',
            ecg: '12-Lead ECG',
            nicardipine_drip: 'Nicardipine Drip (Hypertensive Emergency)',
            furosemide_iv: 'Furosemide 40 mg IV',
            tranexamic_acid_iv: 'Tranexamic Acid 1 g IV',
            diazepam_10mg: 'Diazepam 10 mg Slow IV',
            diazepam_rectal_prn: 'Rectal Diazepam',
            phenytoin_iv: 'IV Phenytoin (Loading Dose)',
            magnesium_sulfate_iv: 'IV MgSO4 40% (Eclampsia Anti-Seizure)',
            dexamethasone_iv: 'IV Steroid (Dexamethasone)',
            diphenhydramine_iv: 'IV Antihistamine (Diphenhydramine)',
            ketorolac_iv: 'Ketorolac 30 mg IV',
            ondansetron_iv: 'Ondansetron 4 mg IV',
            catheter_urine: 'Urinary Catheter (Foley)',
            morphine_iv: 'Morphine IV',
            atropine_iv: 'Atropine Sulfate 0.5-1 mg IV',
            pralidoxime_iv: 'Pralidoxime (2-PAM) 1 g IV',
            gastric_lavage: 'Gastric Lavage (NG Tube)',
            activated_charcoal: 'Activated Charcoal 50 g',
            saep_antivenom: 'Polyvalent Snake Antivenom',
            ats_injection: 'Tetanus Prophylaxis (ATS/TT)',
            paracetamol_syr: 'Paracetamol Drops / Syrup',
            paracetamol_500: 'Paracetamol 500 mg Tablet',
            lidocaine_inj: 'Local Anesthetic (Lidocaine)',
            reagen_gds: 'Check Random Blood Glucose',
            ecg_electrode: 'ECG Electrodes',
            d40_iv: 'Dextrose 40% Bolus (2 ampoules)',
            d10_maintenance: 'Dextrose 10% Maintenance Infusion',
            monitor_gds: 'Monitor Blood Glucose every 15 minutes',
            nacl_resus: '0.9% NaCl Massive Resuscitation (1 L)',
            insulin_drip: 'Regular Insulin Drip',
            ngt_tube: 'Insert NG Tube',
            ngt_decompression: 'NG Tube Decompression',
            blood_crossmatch: 'Blood Crossmatch (PRC)'
        },
        caseData: {
            asthma_acute_severe: {
                diagnosis: 'Acute Severe Asthma',
                symptoms: ['Severe shortness of breath', 'Inspiratory/expiratory wheeze', 'Broken sentences', 'Accessory muscle use'],
                clue: '[URGENT] Severe asthma attack. A silent chest is an ominous sign. Nebulizer + IV steroid immediately.',
                relevantLabs: ['Pulmonary examination', 'SpO2'],
                anamnesis: [
                    'Severe shortness of breath, Doc, and my usual inhaler is not helping.',
                    'Last night I was exposed to dust and the attack became much worse.'
                ],
                anamnesisQuestions: {
                    keluhan_utama: [
                        { id: 'q_main', text: 'How long has the shortness of breath been this bad?', response: 'Since last night, Doc. It keeps getting worse.', priority: 'essential' },
                        { id: 'q_trigger', text: 'Any trigger?', response: 'Dust while cleaning the storage room.', priority: 'essential' },
                        { id: 'q_meds', text: 'Have you used your inhaler already?', response: 'Yes, three times, but it still did not help.', priority: 'essential' }
                    ],
                    medis: [
                        { id: 'q_freq', text: 'Do you often get attacks like this?', response: 'Often, but usually the inhaler works.' },
                        { id: 'q_smoke', text: 'Does anyone smoke at home?', response: 'My husband smokes.' }
                    ],
                    sosial: []
                },
                physicalExamFindings: {
                    general: 'Appears severely dyspneic, in tripod position, speaking word by word.',
                    vitals: 'BP 130/80, HR 110 bpm, RR 32 breaths/min, Temp 36.5°C, SpO2 92% on room air.',
                    thorax: 'Inspection: suprasternal and intercostal retractions present. Auscultation: diffuse wheezing throughout both lung fields.',
                    extremities: 'CRT <2 seconds, extremities warm.'
                },
                differentialDiagnosis: ['Acute COPD exacerbation', 'Congestive heart failure', 'Pneumothorax']
            },
            copd_exacerbation: {
                diagnosis: 'Acute COPD Exacerbation',
                symptoms: ['Worsening shortness of breath', 'Purulent productive cough', 'Wheezing', 'Barrel chest', 'Cyanosis'],
                clue: '[URGENT] COPD patient with worsening dyspnea and purulent sputum. Nebulizer + steroid + antibiotics. Watch for respiratory failure.',
                relevantLabs: ['SpO2', 'Complete blood count'],
                anamnesis: [
                    'My breathing has been worse for 2 days, the sputum is thick and green, and the inhaler is no longer helping.',
                    'My COPD is flaring up, Doc. I keep coughing up phlegm and my breathing sounds noisy.'
                ],
                anamnesisQuestions: {
                    keluhan_utama: [
                        { id: 'q_main', text: 'Since when has the breathing become worse?', response: 'For the past 2 days, Doc. It is usually not this bad.', priority: 'essential' },
                        { id: 'q_sputum', text: 'What is the sputum like?', response: 'A lot of it, Doc, thick yellow-green sputum.', priority: 'essential' },
                        { id: 'q_smoke', text: 'Do you still smoke?', response: 'Yes, one pack a day, Doc. For 30 years already.', priority: 'essential' }
                    ],
                    rpd: [
                        { id: 'q_copd', text: 'Have you been diagnosed with COPD?', response: 'Yes, Doc, for 5 years. I routinely follow up at the lung clinic.' },
                        { id: 'q_inhaler', text: 'Do you use your inhaler regularly?', response: 'Sometimes I forget, Doc. If I am not short of breath, I do not use it.' }
                    ],
                    sosial: []
                },
                physicalExamFindings: {
                    general: 'Appears dyspneic, sitting bent forward with pursed-lip breathing and a barrel chest.',
                    vitals: 'BP 140/90, HR 100 bpm, RR 30 breaths/min, Temp 37.8°C, SpO2 89%.',
                    thorax: 'Prolonged expiration, bilateral wheezing, basal wet crackles, with hyperresonant percussion.',
                    extremities: 'Clubbing present, peripheral cyanosis.'
                },
                sisruteData: {
                    situation: 'Patient with severe COPD exacerbation, SpO2 89%, marked dyspnea, and purulent sputum.',
                    background: 'Known COPD for 5 years, 30 pack-year smoking history, inhaler use is inconsistent.',
                    assessment: 'Severe acute COPD exacerbation with suspected secondary infection. High risk of respiratory failure.',
                    recommendation: 'Refer to pulmonology for intensive bronchodilator therapy, SpO2 monitoring, and evaluation for possible NIV.'
                },
                differentialDiagnosis: ['Pneumonia', 'Congestive heart failure', 'Pneumothorax', 'Pulmonary embolism']
            },
            foreign_body_aspiration: {
                diagnosis: 'Foreign Body Aspiration',
                symptoms: ['Sudden choking', 'Stridor', 'Paroxysmal cough', 'Cyanosis', 'Unable to speak or cry'],
                clue: '[CRITICAL] Child choking with stridor. If coughing effectively, encourage cough. If silent/cyanotic, perform Heimlich or back blows immediately.',
                anamnesis: [
                    'The child choked on peanuts and is now severely short of breath with noisy breathing.',
                    'They suddenly choked while eating, could not cry, and their face turned blue.'
                ],
                anamnesisQuestions: {
                    keluhan_utama: [
                        { id: 'q_event', text: 'What happened?', response: 'They were eating peanuts and suddenly choked and could not breathe!', priority: 'essential' },
                        { id: 'q_what', text: 'What do you think was swallowed?', response: 'A peanut, Doc. It was swallowed whole.', priority: 'essential' },
                        { id: 'q_breathe', text: 'Can they still breathe?', response: 'Barely, and there is a noisy sound.', priority: 'essential' }
                    ],
                    rps: [
                        { id: 'q_cough', text: 'Can they still cough?', response: 'They were coughing hard earlier, but now they can barely cough.' }
                    ],
                    rpd: [],
                    sosial: []
                },
                physicalExamFindings: {
                    general: '3-year-old child, agitated, with stridor, universal choking sign, and cyanosis.',
                    vitals: 'HR 150 bpm, RR 45 breaths/min, SpO2 78%.',
                    thorax: 'Inspiratory stridor, reduced right-sided air entry, localized wheeze, and suprasternal retractions.'
                },
                sisruteData: {
                    situation: '3-year-old with peanut aspiration, stridor, SpO2 78%, and cyanosis.',
                    background: 'Acute onset while eating. Heimlich maneuver only partially effective and stridor persists.',
                    assessment: 'Airway foreign body not fully relieved. Requires rigid bronchoscopy.',
                    recommendation: 'Urgent pediatric or ENT referral for rigid bronchoscopy and foreign body extraction.'
                },
                differentialDiagnosis: ['Croup', 'Epiglottitis', 'Angioedema', 'Acute asthma']
            },
            chest_pain_acs: {
                diagnosis: 'Acute Coronary Syndrome',
                symptoms: ['Left or central chest pain', 'Radiating to the arm or jaw', 'Cold sweat', 'Nausea', 'Shortness of breath'],
                clue: '[URGENT] Typical chest pain with cold sweats in an adult over 40. Suspect ACS. Obtain an ECG immediately, give loading-dose aspirin with additional antiplatelet if available, use oxygen only for hypoxemia, and reserve nitrates for patients with adequate blood pressure.',
                anamnesis: [
                    'My chest hurts badly, Doc, like a heavy weight pressing on it, and it goes through to my back.',
                    'I broke out in a cold sweat, felt nauseated, and became short of breath.'
                ],
                anamnesisQuestions: {
                    keluhan_utama: [
                        { id: 'q_pain', text: 'What does the chest pain feel like?', response: 'Like a huge stone is pressing on it, Doc. Very heavy.', priority: 'essential' },
                        { id: 'q_location', text: 'Where does it radiate?', response: 'Up to my jaw and left shoulder, Doc.', priority: 'essential' },
                        { id: 'q_sweat', text: 'Any cold sweats?', response: 'Yes, Doc, my shirt is soaked.', priority: 'essential' }
                    ],
                    rps: [
                        { id: 'q_duration', text: 'How long has the pain been there?', response: 'It has been 30 minutes and it is not going away, Doc.' },
                        { id: 'q_nitrat', text: 'Have you taken any sublingual medication?', response: 'Not yet, Doc.' }
                    ],
                    rpd: [
                        { id: 'q_ht', text: 'Do you have high blood pressure or diabetes?', response: 'Yes, I have high blood pressure and routinely take amlodipine.' }
                    ],
                    sosial: [
                        { id: 'q_smoker', text: 'Do you smoke?', response: 'Yes, one pack a day.' }
                    ]
                },
                differentialDiagnosis: ['GERD/Dyspepsia', 'Aortic dissection', 'Pulmonary embolism', 'Pericarditis']
            },
            hypertensive_crisis: {
                diagnosis: 'Hypertensive Crisis (HT Emergency)',
                symptoms: ['SBP >180 / DBP >120', 'Severe headache', 'Blurred vision', 'Nosebleed', 'Shortness of breath'],
                clue: '[URGENT] BP above 180/120 with end-organ injury. Lower the blood pressure gradually with titrated IV antihypertensive therapy, not too fast. Loop diuretics are not automatically required without pulmonary edema or clear volume overload.',
                anamnesis: [
                    'My head hurts terribly, like it is about to burst, my vision is blurry, and I had a nosebleed earlier.',
                    'I ran out of my blood pressure medicine 2 weeks ago, and now the pressure is extremely high.'
                ],
                anamnesisQuestions: {
                    keluhan_utama: [
                        { id: 'q_headache', text: 'Where does it hurt?', response: 'My head hurts terribly, Doc, like it is about to burst, especially at the back of the neck.', priority: 'essential' },
                        { id: 'q_vision', text: 'How is your vision?', response: 'A bit blurry, Doc, like I am seeing spots.', priority: 'essential' },
                        { id: 'q_nosebleed', text: 'Any nosebleed?', response: 'Yes, blood came out of my nose earlier.', priority: 'essential' }
                    ],
                    rpd: [
                        { id: 'q_ht', text: 'Do you routinely take your blood pressure medicine?', response: 'It ran out 2 weeks ago, Doc, and I have not bought more yet.' },
                        { id: 'q_meds', text: 'What medicine do you usually take?', response: 'Amlodipine 10 and captopril, Doc.' }
                    ],
                    sosial: [
                        { id: 'q_salt', text: 'Do you often eat salty food?', response: 'Yes, Doc, I like salted fish dishes.' }
                    ]
                },
                differentialDiagnosis: ['Hemorrhagic stroke', 'Pheochromocytoma', 'Pre-eclampsia (if pregnant)', 'Aortic dissection']
            },
            chf_acute_pulmonary_edema: {
                diagnosis: 'Acute Heart Failure (Pulmonary Edema)',
                symptoms: ['Sudden severe shortness of breath', 'Orthopnea', 'Pink frothy sputum', 'Bilateral crackles', 'Raised JVP'],
                clue: '[CRITICAL] Acute dyspnea with pink frothy sputum and bilateral crackles suggests pulmonary edema. Sit upright, give oxygen for hypoxemia, start IV diuretics, and use nitrates only when blood pressure is adequate; opioids are not routinely mandatory.',
                anamnesis: [
                    'Suddenly became very short of breath at midnight, coughed pink froth, and could not sleep lying flat.',
                    'My weak heart is acting up, my legs are swollen, and now I am so short of breath I can barely breathe.'
                ],
                anamnesisQuestions: {
                    keluhan_utama: [
                        { id: 'q_breathe', text: 'Since when has the shortness of breath started?', response: 'Since last night, Doc. It suddenly got very bad and I could not sleep.', priority: 'essential' },
                        { id: 'q_foam', text: 'Any cough?', response: 'Yes, Doc, I coughed up reddish foam.', priority: 'essential' },
                        { id: 'q_position', text: 'How many pillows do you need to sleep?', response: 'I have to sit up, Doc. If I lie down it gets worse.', priority: 'essential' }
                    ],
                    rpd: [
                        { id: 'q_heart', text: 'Any history of heart disease?', response: 'I was told my heart was weak 2 years ago.' },
                        { id: 'q_meds', text: 'What regular medicines do you take?', response: 'Furosemide and captopril, but I often forget.' }
                    ],
                    sosial: []
                },
                differentialDiagnosis: ['Bilateral pneumonia', 'ARDS', 'Massive pulmonary embolism', 'Cardiac tamponade']
            },
            hypoglycemia_severe: {
                diagnosis: 'Severe Hypoglycemia',
                symptoms: ['Decreased consciousness', 'Cold sweat', 'Tremor', 'Weakness', 'Pale'],
                clue: '[CRITICAL] Altered consciousness in a diabetic patient. Check bedside glucose immediately before other interventions.',
                anamnesis: [
                    'The family brought the patient in after taking diabetes medicine this morning without eating first.',
                    'It started with cold sweats and shaking, then the patient gradually became confused.'
                ],
                anamnesisQuestions: {
                    keluhan_utama: [
                        { id: 'q_event', text: 'What happened earlier?', response: 'This morning he took his diabetes medicine, but forgot breakfast. Then he suddenly became confused and fainted.', priority: 'essential' },
                        { id: 'q_food', text: 'When was the last meal?', response: 'Last night, Doc. He has not eaten anything today.', priority: 'essential' },
                        { id: 'q_symptoms', text: 'Any cold sweats?', response: 'Yes, Doc, his body was drenched.', priority: 'essential' }
                    ],
                    medis: [
                        { id: 'q_meds', text: 'What medicine did he take?', response: 'Glimiperide, Doc.' }
                    ],
                    sosial: [
                        { id: 'q_habit', text: 'Has this happened before?', response: 'Once before when he ate late.' }
                    ]
                },
                differentialDiagnosis: ['Stroke (CVA)', 'Alcohol intoxication', 'Diabetic ketoacidosis']
            },
            dka_adult: {
                diagnosis: 'Diabetic Ketoacidosis (DKA)',
                symptoms: ['Kussmaul breathing', 'Severe dehydration', 'Acetone breath', 'Abdominal pain', 'Decreased consciousness'],
                clue: '[CRITICAL] Type 1 or 2 diabetes with Kussmaul breathing, acetone odor, and glucose above 300. Start saline resuscitation and insulin drip. Monitor potassium closely.',
                anamnesis: [
                    'No insulin for 3 days, now weak, vomiting, breathing fast and deep, with an acetone smell.',
                    'A patient with type 1 diabetes stopped treatment and came in severely dehydrated with decreased consciousness.'
                ],
                anamnesisQuestions: {
                    keluhan_utama: [
                        { id: 'q_event', text: 'What happened?', response: 'Vomiting since yesterday, Doc, weak, and breathing fast.', priority: 'essential' },
                        { id: 'q_insulin', text: 'Have you been taking insulin regularly?', response: 'I have not injected it for 3 days, Doc. The insulin ran out.', priority: 'essential' },
                        { id: 'q_thirst', text: 'Are you drinking a lot?', response: 'Always thirsty and urinating all the time, Doc.', priority: 'essential' }
                    ],
                    rpd: [
                        { id: 'q_dm', text: 'How long have you had diabetes?', response: 'Since I was 22, Doc. Type 1 diabetes.' },
                        { id: 'q_prev_dka', text: 'Have you ever had DKA before?', response: 'Twice before. I also had to be hospitalized.' }
                    ],
                    sosial: []
                },
                differentialDiagnosis: ['HHS', 'Lactic acidosis', 'Methanol poisoning', 'Uremia']
            },
            hhs_hyperosmolar: {
                diagnosis: 'Hyperosmolar Hyperglycemic State (HHS)',
                symptoms: ['Severe decreased consciousness', 'Severe dehydration', 'GDS >600', 'No acetone odor', 'Seizure'],
                clue: '[CRITICAL] Older adult with type 2 diabetes, glucose above 600, and profound dehydration without acetone odor. Think HHS. Mortality is high, so rehydrate aggressively.',
                anamnesis: [
                    'A 70-year-old grandmother with diabetes became progressively weaker over a week, is now unconscious, and has a glucose level above 600.',
                    'An elderly patient with type 2 diabetes, severe dehydration, coma, and no Kussmaul breathing.'
                ],
                anamnesisQuestions: {
                    keluhan_utama: [
                        { id: 'q_event', text: 'When did the weakness start?', response: 'It has been getting worse for a week. This morning she could not get up.', priority: 'essential' },
                        { id: 'q_drink', text: 'Has she been drinking a lot?', response: 'Always thirsty but still weak, and urinating a lot.', priority: 'essential' }
                    ],
                    rpd: [
                        { id: 'q_dm', text: 'Does she have diabetes?', response: 'Yes, Doc, she takes metformin but often forgets.', priority: 'essential' },
                        { id: 'q_infeksi', text: 'Any fever or infection?', response: 'She has had cough and a cold for the last 2 weeks, Doc.' }
                    ],
                    sosial: []
                },
                differentialDiagnosis: ['DKA', 'Stroke', 'Sepsis', 'Poisoning']
            },
            anaphylaxis: {
                diagnosis: 'Anaphylactic Shock',
                symptoms: ['Shortness of breath (stridor/wheezing)', 'Generalized hives', 'Swollen lips/eyes (angioedema)', 'Low blood pressure (shock)', 'Pale and weak'],
                clue: '[CRITICAL] Anaphylactic shock is life-threatening. Give IM epinephrine immediately. Do not delay. Protect the airway.',
                anamnesis: [
                    'The patient was just given an antibiotic injection and suddenly became short of breath and itchy.',
                    'The lips are swollen, the whole skin is red, and the patient is weak.'
                ],
                anamnesisQuestions: {
                    keluhan_utama: [
                        { id: 'q_event', text: 'What triggered this just now?', response: 'Right after an antibiotic injection, Doc, the breathing became like this.', priority: 'essential' },
                        { id: 'q_skin', text: 'Any itching or swelling?', response: 'Yes, Doc, the whole body turned red and the lips got thick.', priority: 'essential' },
                        { id: 'q_allergy', text: 'Any allergy history?', response: 'There was swelling before after seafood, Doc.', priority: 'essential' }
                    ],
                    medis: [],
                    sosial: []
                },
                differentialDiagnosis: ['Hereditary angioedema', 'Acute asthma attack', 'Severe urticarial reaction']
            },
            angioedema_severe: {
                diagnosis: 'Severe Angioedema',
                symptoms: ['Massive swelling of the lips/eyes/tongue', 'Hoarse voice', 'Difficulty swallowing', 'Minimal itching', 'No urticaria'],
                clue: '[URGENT] Angioedema without urticaria may be ACE-inhibitor induced. Stop the drug, give steroids plus antihistamines, and watch the airway closely.',
                anamnesis: [
                    'The lips and eyes suddenly became very swollen, the voice is hoarse, and swallowing is difficult.',
                    'A new blood pressure medicine was taken, and 2 hours later the face became swollen.'
                ],
                anamnesisQuestions: {
                    keluhan_utama: [
                        { id: 'q_swell', text: 'When did the swelling start?', response: 'About 2 hours ago, Doc. It keeps getting bigger and the lips are very thick.', priority: 'essential' },
                        { id: 'q_breathe', text: 'Any breathing problem?', response: 'Swallowing is a bit difficult, Doc, and the voice is getting hoarse.', priority: 'essential' },
                        { id: 'q_meds', text: 'What medicine are you taking?', response: 'Captopril, Doc, for high blood pressure.', priority: 'essential' }
                    ],
                    rpd: [
                        { id: 'q_prev', text: 'Has this happened before?', response: 'Once before, Doc, but not this severe.' },
                        { id: 'q_allergy', text: 'Any allergies?', response: 'No food allergy, Doc.' }
                    ],
                    sosial: []
                },
                differentialDiagnosis: ['Anaphylaxis', 'Hereditary angioedema', 'Facial cellulitis', 'Nephrotic syndrome']
            },
            dengue_warning_signs: {
                diagnosis: 'Dengue with Warning Signs',
                symptoms: ['High fever', 'Severe abdominal pain', 'Persistent vomiting', 'Bleeding gums or nose', 'Severe weakness'],
                clue: '[URGENT] Dengue with warning signs: abdominal pain, vomiting, bleeding, lethargy. Monitor plasma leakage closely.',
                anamnesis: [
                    'The fever has been there for 4 days, Doc, but today the stomach hurts badly and the vomiting will not stop.',
                    'The gums started bleeding on their own, and the body feels extremely weak.'
                ],
                anamnesisQuestions: {
                    keluhan_utama: [
                        { id: 'q_fever', text: 'What day of fever is this?', response: 'Day 4, Doc, but today the temperature feels slightly lower.', priority: 'essential' },
                        { id: 'q_pain', text: 'Any abdominal pain?', response: 'Yes, Doc, the stomach hurts a lot, especially in the upper abdomen.', priority: 'essential' },
                        { id: 'q_bleed', text: 'Any gum bleeding or nosebleed?', response: 'This morning the gums kept bleeding while brushing my teeth, Doc.', priority: 'essential' }
                    ],
                    rps: [
                        { id: 'q_vomit', text: 'Any vomiting?', response: 'Keeps vomiting, Doc. Even drinking comes right back up.' },
                        { id: 'q_urine', text: 'Still urinating normally?', response: 'It seems reduced, Doc.' }
                    ],
                    rpd: [],
                    sosial: []
                },
                differentialDiagnosis: ['Typhoid fever', 'Leptospirosis', 'Chikungunya', 'Malaria']
            },
            severe_malaria: {
                diagnosis: 'Severe Malaria (P. falciparum)',
                symptoms: ['Periodic high fever', 'Decreased consciousness', 'Severe anemia (pallor)', 'Jaundice', 'Dark urine (black water)'],
                clue: '[CRITICAL] Severe malaria means fever plus decreased consciousness and severe anemia. Start IV artesunate immediately. Do not wait for lab confirmation.',
                anamnesis: [
                    'There has been periodic fever for 5 days, just returned from Papua, and now the patient is unconscious and very pale.',
                    'Alternating fever and chills, jaundice, dark urine, and profound weakness.'
                ],
                anamnesisQuestions: {
                    keluhan_utama: [
                        { id: 'q_fever', text: 'What is the fever pattern like?', response: 'Hot and cold alternating, Doc, for 5 days and getting worse.', priority: 'essential' },
                        { id: 'q_travel', text: 'Where did you recently travel from?', response: 'Just came back from Papua 2 weeks ago, Doc.', priority: 'essential' },
                        { id: 'q_urine', text: 'What does the urine look like?', response: 'Dark like strong tea, Doc, sometimes brown.', priority: 'essential' }
                    ],
                    rpd: [
                        { id: 'q_malaria', text: 'Have you ever had malaria before?', response: 'Twice while in Papua, Doc.' }
                    ],
                    sosial: []
                },
                differentialDiagnosis: ['Typhoid fever', 'Leptospirosis', 'Acute hepatitis', 'Sepsis']
            },
            sepsis: {
                diagnosis: 'Sepsis',
                symptoms: ['High fever or hypothermia', 'Tachycardia', 'Hypotension', 'Altered mental status', 'Cold mottled extremities'],
                clue: '[CRITICAL] qSOFA of 2 or more strongly suggests sepsis. Start fluid resuscitation immediately and give antibiotics within the first hour.',
                anamnesis: [
                    'The mother has had high fever for 3 days and is now unconscious, Doc.',
                    'Likely sepsis from a urinary source, with hypotension and mottled cold extremities.'
                ],
                anamnesisQuestions: {
                    keluhan_utama: [
                        { id: 'q_event', text: 'What is the main problem?', response: 'My mother has had high fever for 3 days, and now she is unconscious, Doc.', priority: 'essential' },
                        { id: 'q_source', text: 'Was there an infection beforehand?', response: 'It started from painful urination and fever that never got better.', priority: 'essential' },
                        { id: 'q_cold', text: 'Are the hands and feet cold?', response: 'Yes, Doc, very cold, and the skin looks mottled.', priority: 'essential' }
                    ],
                    rpd: [
                        { id: 'q_dm', text: 'Does the patient have diabetes?', response: 'Yes, Doc, but it is poorly controlled.' }
                    ],
                    sosial: []
                },
                differentialDiagnosis: ['Cardiogenic shock', 'Anaphylactic shock', 'Diabetic ketoacidosis', 'Severe malaria']
            },
            seizure_ongoing: {
                diagnosis: 'Status Epilepticus',
                symptoms: ['Seizure lasting more than 5 minutes', 'No regained consciousness between seizures', 'Whole-body rigidity', 'Cyanosis'],
                clue: '[CRITICAL] Status epilepticus means seizure lasting over 5 minutes or repeated seizures without recovery. Give IV or rectal diazepam immediately.',
                anamnesis: [
                    'The patient has been seizing for 10 minutes without stopping.',
                    'There is a history of epilepsy, and the medicine was missed earlier.'
                ],
                anamnesisQuestions: {
                    keluhan_utama: [
                        { id: 'q_event', text: 'How long has the seizure been going on?', response: 'It has been 10 minutes and still has not stopped, Doc.', priority: 'essential' },
                        { id: 'q_epilepsy', text: 'Any history of epilepsy?', response: 'Yes, Doc, he does have epilepsy.', priority: 'essential' }
                    ],
                    rps: [
                        { id: 'q_conscious', text: 'Did the patient regain consciousness between seizures?', response: 'No, Doc. The body stayed stiff and the eyes kept rolling up.' }
                    ],
                    rpd: [
                        { id: 'q_compliance', text: 'Has the medicine been taken regularly?', response: 'Often forgets, Doc.' }
                    ],
                    sosial: []
                },
                differentialDiagnosis: ['Symptomatic seizure from hypoglycemia', 'Meningitis or encephalitis', 'Head trauma']
            },
            cva_stroke: {
                diagnosis: 'Stroke / CVA (Cerebrovascular Accident)',
                symptoms: ['One-sided weakness', 'Slurred speech', 'Facial droop', 'Decreased consciousness', 'Severe headache'],
                clue: '[CRITICAL] FAST: Face drooping, Arm weakness, Speech difficulty, Time to call. The first 3 to 4.5 hours are the golden window for thrombolysis.',
                anamnesis: [
                    'The left arm suddenly cannot be raised, the mouth is crooked, and the speech is slurred.',
                    'Acute onset 1 hour ago with left hemiparesis, dysarthria, and facial asymmetry.'
                ],
                anamnesisQuestions: {
                    keluhan_utama: [
                        { id: 'q_onset', text: 'When did the symptoms start?', response: 'Only 1 hour ago, Doc. Suddenly the left arm could not be lifted.', priority: 'essential' },
                        { id: 'q_face', text: 'Did the face become crooked?', response: 'Yes, Doc, the left side drooped and saliva kept coming out.', priority: 'essential' },
                        { id: 'q_speech', text: 'Is the speech normal?', response: 'Slurred, Doc, very difficult to talk.', priority: 'essential' }
                    ],
                    rpd: [
                        { id: 'q_ht', text: 'Any high blood pressure?', response: 'Yes, Doc, but the medicine is not taken regularly.' },
                        { id: 'q_dm', text: 'Any diabetes?', response: 'Yes, Doc.' }
                    ],
                    sosial: [
                        { id: 'q_smoke', text: 'Does the patient smoke?', response: 'Has been smoking for 20 years, Doc.' }
                    ]
                },
                differentialDiagnosis: ['Hypoglycemia', "Bell's palsy", 'Encephalitis', 'Intracranial tumor']
            },
            near_drowning: {
                diagnosis: 'Near Drowning',
                symptoms: ['Severe shortness of breath', 'Frothy cough', 'Cyanosis', 'Decreased consciousness', 'Hypothermia'],
                clue: '[CRITICAL] Drowning victim: prioritize airway, breathing, and circulation. Prevent hypothermia and watch for secondary pulmonary edema.',
                anamnesis: [
                    'The child drowned in the river, Doc. Bystanders already pressed the chest, but the breathing is still difficult.',
                    'The victim was pulled from the water, coughed out water, but remains very weak and short of breath.'
                ],
                anamnesisQuestions: {
                    keluhan_utama: [
                        { id: 'q_event', text: 'Where did the drowning happen?', response: 'In the river, Doc, while bathing.', priority: 'essential' },
                        { id: 'q_duration', text: 'How long was the patient underwater?', response: 'Neighbors said around 3 to 5 minutes, Doc.', priority: 'essential' },
                        { id: 'q_cpr', text: 'Was first aid given at the scene?', response: 'Yes, Doc, people pressed the chest until water came out with coughing.', priority: 'essential' }
                    ],
                    rps: [
                        { id: 'q_conscious', text: 'Did the patient pass out?', response: 'Briefly, Doc, now more awake but still short of breath.' }
                    ],
                    rpd: [],
                    sosial: []
                },
                differentialDiagnosis: ['Acute pulmonary edema', 'Aspiration pneumonia', 'Severe hypothermia', 'Cervical injury']
            },
            eclampsia: {
                diagnosis: 'Eclampsia',
                symptoms: ['Seizure in pregnancy', 'Severely elevated blood pressure', 'Generalized edema', 'Massive proteinuria', 'Decreased consciousness'],
                clue: '[CRITICAL] Pregnant patient with seizures and blood pressure above 160/110 means eclampsia until proven otherwise. Give magnesium sulfate immediately and refer for definitive obstetric management.',
                anamnesis: [
                    'An 8-month pregnant woman had 2 seizures at home, with very high blood pressure and marked leg swelling.',
                    'Primigravida with eclampsia, 2 seizure episodes, BP above 160/110, and blurred vision.'
                ],
                anamnesisQuestions: {
                    keluhan_utama: [
                        { id: 'q_seizure', text: 'How many seizures occurred?', response: 'Already 2 times, Doc, earlier at home.', priority: 'essential' },
                        { id: 'q_gest', text: 'How many months pregnant?', response: '8 months, Doc.', priority: 'essential' },
                        { id: 'q_headache', text: 'Was there headache beforehand?', response: 'Since yesterday there has been severe headache and blurred vision.', priority: 'essential' }
                    ],
                    rpd: [
                        { id: 'q_anc', text: 'Were antenatal visits regular?', response: 'Only 2 visits, Doc, at the midwife.' },
                        { id: 'q_prev_pe', text: 'Any blood pressure issue in previous pregnancies?', response: 'This is the first baby, Doc.' }
                    ],
                    sosial: []
                },
                differentialDiagnosis: ['Epilepsy in pregnancy', 'Stroke', 'Meningitis', 'Hypoglycemia']
            },
            febrile_convulsion: {
                diagnosis: 'Simple Febrile Seizure',
                symptoms: ['Seizure during fever', 'Age 6 months to 5 years', 'Seizure under 15 minutes', 'Awake after the seizure'],
                clue: '[OBSERVATION] Simple febrile seizure in a toddler that has already stopped and the child is awake. Find the infection source and reduce the fever.',
                anamnesis: [
                    'My child had a seizure, Doc. The fever was very high.',
                    'The seizure lasted about 2 minutes, and now it has stopped and the child is waking up.'
                ],
                anamnesisQuestions: {
                    keluhan_utama: [
                        { id: 'q_event', text: 'How long did the seizure last?', response: 'Only briefly, Doc, maybe 1 to 2 minutes.', priority: 'essential' },
                        { id: 'q_fever', text: 'Was the fever high?', response: 'Very hot, Doc, when the seizure happened.' }
                    ],
                    rps: [
                        { id: 'q_conscious', text: 'Did the child cry right after the seizure?', response: 'Yes, Doc, cried right away and became alert.' },
                        { id: 'q_repeat', text: 'Did the seizure happen again?', response: 'Only once, Doc.' }
                    ],
                    rpd: [
                        { id: 'q_prev', text: 'Has this happened before?', response: 'Never before, Doc.', priority: 'essential' },
                        { id: 'q_family', text: 'Any family history of febrile seizures?', response: 'The father used to have them as a child.' }
                    ],
                    sosial: []
                },
                differentialDiagnosis: ['Meningitis', 'Epilepsy', 'Complex febrile seizure']
            },
            head_injury_moderate: {
                diagnosis: 'Moderate Head Injury',
                symptoms: ['Decreased consciousness (GCS 9-13)', 'Projectile vomiting', 'Amnesia', 'Anisocoria', 'Lucid interval'],
                clue: '[URGENT] Moderate head injury with GCS 9 to 13. Beware of a lucid interval because herniation can follow. Immobilize the C-spine, elevate the head 30 degrees, and monitor GCS every 15 minutes.',
                anamnesis: [
                    'Motorcycle crash, unconscious for 10 minutes, now confused and vomiting forcefully 3 times.',
                    'Head injury with amnesia, dropping GCS, and pupils starting to become unequal.'
                ],
                anamnesisQuestions: {
                    keluhan_utama: [
                        { id: 'q_event', text: 'How did it happen?', response: 'High-speed motorcycle crash, Doc. The head hit the curb.', priority: 'essential' },
                        { id: 'q_conscious', text: 'How long was the patient unconscious?', response: 'About 10 minutes, Doc. Now still confused.', priority: 'essential' },
                        { id: 'q_vomit', text: 'Any vomiting?', response: 'Vomited 3 times, Doc, projectile.', priority: 'essential' }
                    ],
                    rps: [
                        { id: 'q_amnesia', text: 'Does the patient remember the event?', response: 'No, Doc. Suddenly already woke up here.' },
                        { id: 'q_helmet', text: 'Was a helmet used?', response: 'Yes, but the helmet cracked.' }
                    ],
                    rpd: [
                        { id: 'q_blood_thin', text: 'Any blood thinner medication?', response: 'No, Doc.' }
                    ],
                    sosial: []
                },
                differentialDiagnosis: ['Epidural hematoma', 'Subdural hematoma', 'Cerebral contusion', 'Basilar skull fracture']
            },
            laceration_minor: {
                diagnosis: 'Minor Laceration',
                symptoms: ['Open wound', 'Controlled bleeding', 'Moderate pain'],
                clue: '[OBSERVATION] Simple laceration. Clean with saline, suture it, and check tetanus immunization status.',
                anamnesis: [
                    'My hand was cut by a knife while cooking, Doc. The wound is fairly long.',
                    'I pressed it with cloth already, and the bleeding has slowed down.'
                ],
                anamnesisQuestions: {
                    keluhan_utama: [
                        { id: 'q_incident', text: 'How did the wound happen?', response: 'Cut by a knife while chopping onions, Doc.', priority: 'essential' },
                        { id: 'q_move', text: 'Can you still move the finger?', response: 'Still can, Doc, it just hurts when bent.', priority: 'essential' },
                        { id: 'q_tetanus', text: 'When was the last tetanus shot?', response: 'Maybe in elementary school, Doc. It has been a very long time.', priority: 'essential' }
                    ],
                    medis: [
                        { id: 'q_keloid', text: 'Any tendency to form keloids?', response: 'No, Doc.' }
                    ],
                    sosial: []
                },
                differentialDiagnosis: ['Laceration with tendon injury', 'Open fracture', 'Puncture wound']
            },
            head_injury_mild: {
                diagnosis: 'Mild Head Injury',
                symptoms: ['Headache after impact', 'Dizziness', 'Nausea', 'Scalp abrasion or hematoma'],
                clue: '[OBSERVATION] Mild head injury with GCS 15. Observe mental status and look for danger signs such as vomiting, amnesia, or anisocoria.',
                anamnesis: [
                    'Just had a motorcycle accident, Doc. The head hit the asphalt. Dizzy but did not pass out.',
                    'Fell from the stairs and hit the wall. Feels nauseated but has not vomited.'
                ],
                anamnesisQuestions: {
                    keluhan_utama: [
                        { id: 'q_event', text: 'How did it happen?', response: 'Fell from a motorcycle, Doc, and the head hit the road.', priority: 'essential' },
                        { id: 'q_conscious', text: 'Did you lose consciousness?', response: 'No, Doc, only dizzy.' }
                    ],
                    rps: [
                        { id: 'q_vomit', text: 'Any vomiting?', response: 'Not yet, Doc, just nausea.', priority: 'essential' },
                        { id: 'q_amnesia', text: 'Do you remember the event?', response: 'Yes, Doc, remember everything.' },
                        { id: 'q_headache', text: 'Is the headache getting worse?', response: 'About the same, Doc, not getting worse.' }
                    ],
                    rpd: [
                        { id: 'q_blood_thin', text: 'Any blood thinner medication?', response: 'None, Doc.' }
                    ],
                    sosial: [
                        { id: 'q_helmet', text: 'Were you wearing a helmet?', response: 'No, Doc, it was close to home only.' }
                    ]
                },
                differentialDiagnosis: ['Moderate head injury', 'Epidural bleeding', 'Basilar skull fracture']
            },
            snake_bite: {
                diagnosis: 'Venomous Snake Bite',
                symptoms: ['Two puncture marks', 'Progressive swelling', 'Severe pain', 'Nausea', 'Bleeding from the wound'],
                clue: '[URGENT] Snake bite with signs of envenomation: progressive swelling and severe pain. Immobilize the limb and give antivenom if available.',
                anamnesis: [
                    'Bitten by a snake in the field, Doc. The leg is badly swollen and the pain is unbearable.',
                    'Bitten by a green snake half an hour ago, and the swelling is climbing fast.'
                ],
                anamnesisQuestions: {
                    keluhan_utama: [
                        { id: 'q_event', text: 'When were you bitten?', response: 'About half an hour ago, Doc, in the rice field.', priority: 'essential' },
                        { id: 'q_snake', text: 'What did the snake look like?', response: 'Green, Doc, small, from a tree.', priority: 'essential' }
                    ],
                    rps: [
                        { id: 'q_swell', text: 'Is the swelling spreading?', response: 'Yes, Doc, it started at the finger and now reaches the wrist.', priority: 'essential' },
                        { id: 'q_numb', text: 'Any numbness?', response: 'Tingling all the way up the arm, Doc.' },
                        { id: 'q_nausea', text: 'Any nausea or dizziness?', response: 'Yes, Doc, nauseated and dizzy too.' }
                    ],
                    rpd: [
                        { id: 'q_allergy', text: 'Any allergy history?', response: 'Never, Doc.' }
                    ],
                    sosial: [
                        { id: 'q_treatment', text: 'What has been done to the wound?', response: 'The neighbor wrapped it and gave a traditional remedy, Doc.' }
                    ]
                },
                differentialDiagnosis: ['Insect bite', 'Cellulitis', 'Local allergic reaction']
            },
            burn_second_degree: {
                diagnosis: 'Second-Degree Burn (<20% TBSA)',
                symptoms: ['Blistering burn', 'Severe pain', 'Wet red skin', 'Local edema'],
                clue: '[URGENT] Second-degree burn. Cool for 20 minutes, do not break blisters, and calculate %TBSA to guide fluid resuscitation decisions.',
                anamnesis: [
                    'Splashed by boiling water, Doc. The arm and chest are blistered and very painful.',
                    'Hot cooking oil spilled, and the skin turned red and blistered right away.'
                ],
                anamnesisQuestions: {
                    keluhan_utama: [
                        { id: 'q_event', text: 'How did it happen?', response: 'Hit by hot water, Doc, spilled from the stove.', priority: 'essential' },
                        { id: 'q_when', text: 'When did it happen?', response: 'Only 30 minutes ago, Doc.', priority: 'essential' }
                    ],
                    rps: [
                        { id: 'q_area', text: 'Which body parts were affected?', response: 'Right arm and chest, Doc.', priority: 'essential' },
                        { id: 'q_pain', text: 'What does the pain feel like?', response: 'Burning hot and very painful, Doc, cannot stand it.' },
                        { id: 'q_first_aid', text: 'What first aid was done?', response: 'The neighbor put toothpaste on it, Doc.' }
                    ],
                    rpd: [
                        { id: 'q_dm', text: 'Any diabetes?', response: 'No, Doc.' }
                    ],
                    sosial: []
                },
                differentialDiagnosis: ['Third-degree burn', 'Chemical burn', 'Severe sunburn']
            },
            open_fracture: {
                diagnosis: 'Open Fracture',
                symptoms: ['Bone protruding', 'Limb deformity', 'Active bleeding from the wound', 'Severe pain', 'Cannot be moved'],
                clue: '[URGENT] Open fracture with visible bone. Do not reduce it in the field. Irrigate with saline, cover with sterile wet gauze, splint it, and give tetanus prophylaxis plus antibiotics.',
                anamnesis: [
                    'Motorcycle crash, the right leg is bent, the bone is sticking out through the skin, and there is a lot of blood.',
                    'Pinned under the motorcycle with an open tibial fracture and active bleeding.'
                ],
                anamnesisQuestions: {
                    keluhan_utama: [
                        { id: 'q_event', text: 'What happened?', response: 'Motorcycle crash, Doc. The right leg was trapped under the bike and now the bone is sticking out.', priority: 'essential' },
                        { id: 'q_move', text: 'Can the leg be moved?', response: 'Not at all, Doc. The pain is extreme.', priority: 'essential' },
                        { id: 'q_bleed', text: 'Is there heavy bleeding?', response: 'A lot, Doc. Already wrapped but still soaking through.', priority: 'essential' }
                    ],
                    rps: [
                        { id: 'q_numbness', text: 'Any numbness below the injury?', response: 'The sole feels a bit numb, Doc.' }
                    ],
                    rpd: [
                        { id: 'q_tt', text: 'When was the last tetanus shot?', response: 'Do not remember, Doc.' }
                    ],
                    sosial: []
                },
                differentialDiagnosis: ['Closed fracture', 'Dislocation', 'Compartment syndrome', 'Crush injury']
            },
            organophosphate_poisoning: {
                diagnosis: 'Organophosphate Poisoning (Pesticide)',
                symptoms: ['Excessive salivation', 'Miosis (small pupils)', 'Bradycardia', 'Diarrhea or incontinence', 'Seizure', 'Pesticide odor'],
                clue: '[CRITICAL] SLUDGE: salivation, lacrimation, urination, defecation, GI distress, emesis. Antidotes are atropine and pralidoxime.',
                anamnesis: [
                    'Drank insecticide 30 minutes ago, now vomiting foam, sweating heavily, and urinating in the clothes.',
                    'Intentional organophosphate self-harm with SLUDGE syndrome and pinpoint pupils.'
                ],
                anamnesisQuestions: {
                    keluhan_utama: [
                        { id: 'q_event', text: 'What happened?', response: 'Drank insect poison, Doc, on purpose.', priority: 'essential' },
                        { id: 'q_what', text: 'What product was taken?', response: 'Liquid Baygon, Doc, around half a bottle.', priority: 'essential' },
                        { id: 'q_when', text: 'When was it taken?', response: 'Only 30 minutes ago, Doc.', priority: 'essential' }
                    ],
                    rps: [
                        { id: 'q_vomit', text: 'Has there been vomiting?', response: 'Keeps vomiting, Doc, and foam is coming from the mouth.' },
                        { id: 'q_breathe', text: 'Any breathing problem?', response: 'Yes, Doc, the breathing sounds noisy.' }
                    ],
                    rpd: [
                        { id: 'q_psych', text: 'Any emotional stress?', response: 'Very stressed, Doc, just broke up with my partner.', priority: 'essential' }
                    ],
                    sosial: []
                },
                differentialDiagnosis: ['Carbamate poisoning', 'Mushroom poisoning', 'Myasthenia gravis', 'Opioid overdose']
            },
            food_poisoning_acute: {
                diagnosis: 'Acute Food Poisoning',
                symptoms: ['Severe nausea and vomiting', 'Profuse diarrhea', 'Colicky abdominal pain', 'Weakness or pallor', 'Heavy sweating'],
                clue: '[URGENT] Suspicious food intake followed by massive vomiting and diarrhea. Prevent dehydration and identify the likely toxin.',
                anamnesis: [
                    'Keeps vomiting after eating boxed rice, Doc. My friend who ate the same food is also sick.',
                    'Ate 3 hours ago and then suddenly developed nausea, vomiting, watery diarrhea, and severe weakness.'
                ],
                anamnesisQuestions: {
                    keluhan_utama: [
                        { id: 'q_event', text: 'What was the last food eaten?', response: 'Boxed rice from a food stall, Doc, 3 hours ago.', priority: 'essential' },
                        { id: 'q_onset', text: 'When did the nausea start?', response: 'Only during the last 2 hours, Doc, then the vomiting kept coming.' }
                    ],
                    rps: [
                        { id: 'q_vomit_freq', text: 'How many times has the patient vomited?', response: 'Already 6 or 7 times, Doc, not stopping.', priority: 'essential' },
                        { id: 'q_diarrhea', text: 'Any diarrhea?', response: 'Yes, Doc, very watery, already 4 times.' },
                        { id: 'q_others', text: 'Did anyone else get sick?', response: 'My friend who ate with me is also vomiting, Doc.', priority: 'essential' }
                    ],
                    rpd: [],
                    sosial: []
                },
                differentialDiagnosis: ['Acute gastroenteritis', 'Pesticide poisoning', 'Acute appendicitis', 'Cholera']
            },
            severe_dehydration_shock: {
                diagnosis: 'Hypovolemic Shock (Severe Dehydration)',
                symptoms: ['Unconscious or restless', 'Sunken eyes', 'Very dry skin with markedly slow turgor', 'Weak rapid pulse', 'Unable to drink'],
                clue: '[CRITICAL] Severe diarrhea with shock signs: weak pulse, cold extremities, and very slow skin turgor. Start fluid resuscitation immediately.',
                anamnesis: [
                    'My child has had nonstop diarrhea for 2 days and is now weak and nearly unconscious, Doc.',
                    'Continuous watery diarrhea, cannot drink anymore, eyes are sunken, and has not urinated since morning.'
                ],
                anamnesisQuestions: {
                    keluhan_utama: [
                        { id: 'q_event', text: 'How many days has the diarrhea lasted?', response: 'Already 2 days, Doc, and getting worse.', priority: 'essential' },
                        { id: 'q_vomit', text: 'Any vomiting?', response: 'Yes, Doc, whatever is drunk comes right back up.', priority: 'essential' },
                        { id: 'q_urine', text: 'When was the last urination?', response: 'Has not urinated since this morning, Doc.', priority: 'essential' }
                    ],
                    rps: [
                        { id: 'q_frequency', text: 'How frequent are the watery stools?', response: 'Too many to count, Doc, more than 10 times a day.' },
                        { id: 'q_drink', text: 'Can the patient still drink?', response: 'No strength to drink, Doc, it all gets vomited out again.' }
                    ],
                    rpd: [],
                    sosial: []
                },
                differentialDiagnosis: ['Cholera', 'Poisoning', 'Intussusception in a child', 'Septic shock']
            },
            hematemesis_melena: {
                diagnosis: 'Hematemesis Melena (Upper GI Bleeding)',
                symptoms: ['Vomiting blood (black or bright red)', 'Black tarry stool', 'Pale and weak', 'Hypotension', 'Tachycardia'],
                clue: '[CRITICAL] Hematemesis means upper GI bleeding. Start fluid resuscitation, insert an NGT, and arrange crossmatch while looking for the source such as varices, erosions, or ulcer.',
                anamnesis: [
                    'Vomiting black material like coffee grounds, black stool, dizziness, and weakness.',
                    'Massive hematemesis with melena, profound pallor, suspected upper GI bleeding.'
                ],
                anamnesisQuestions: {
                    keluhan_utama: [
                        { id: 'q_vomit', text: 'What color is the vomited blood?', response: 'Black like coffee grounds, Doc, a lot of it.', priority: 'essential' },
                        { id: 'q_stool', text: 'What does the stool look like?', response: 'Black and sticky like asphalt, Doc.', priority: 'essential' },
                        { id: 'q_dizzy', text: 'Any dizziness?', response: 'Very dizzy, Doc, like about to faint when standing.', priority: 'essential' }
                    ],
                    rpd: [
                        { id: 'q_ulcer', text: 'Any gastritis or stomach ulcer history?', response: 'Often has gastritis, Doc, and often takes herbal medicine mixed with piroxicam.' },
                        { id: 'q_liver', text: 'Any liver disease?', response: 'Do not know, Doc, never checked.' }
                    ],
                    sosial: [
                        { id: 'q_alcohol', text: 'Does the patient drink alcohol?', response: 'Sometimes, Doc, at social gatherings.' }
                    ]
                },
                differentialDiagnosis: ['Ruptured esophageal varices', 'Perforated peptic ulcer', 'Erosive gastritis', 'Mallory-Weiss tear']
            },
            suicide_attempt: {
                diagnosis: 'Suicide Attempt (Deliberate Self-Harm)',
                symptoms: ['Wrist lacerations', 'Active bleeding', 'Abnormally calm or agitated state', 'History of suicidal ideation'],
                clue: '[URGENT] Deliberate self-harm: stabilize physical injuries first, then perform psychiatric assessment. Do not leave the patient alone.',
                anamnesis: [
                    'Cuts on both wrists, with the patient appearing abnormally calm.',
                    'Suicide attempt using a razor blade, with previous attempts also reported.'
                ],
                anamnesisQuestions: {
                    keluhan_utama: [
                        { id: 'q_event', text: 'What happened?', response: '(Silent)... I do not want to live anymore, Doc.', priority: 'essential' },
                        { id: 'q_method', text: 'What was used?', response: 'A razor blade, Doc, on the wrists.', priority: 'essential' },
                        { id: 'q_intent', text: 'How long have you been thinking about doing this?', response: 'For several months, Doc, thinking about it all the time.', priority: 'essential' }
                    ],
                    rpd: [
                        { id: 'q_psych', text: 'Have you ever seen a psychiatrist?', response: 'Never, Doc.' },
                        { id: 'q_prev', text: 'Any previous attempts?', response: 'Tried drinking mosquito poison before, but vomited it out.', priority: 'essential' }
                    ],
                    sosial: [
                        { id: 'q_trigger', text: 'Any major life stress right now?', response: 'Debt problems, Doc, and the household is falling apart.' }
                    ]
                },
                differentialDiagnosis: ['Non-suicidal self-harm', 'Borderline personality disorder', 'Major depression', 'Psychosis']
            },
            bronchiolitis_severe: {
                diagnosis: 'Severe Bronchiolitis',
                symptoms: ['Severe shortness of breath in an infant', 'Wheezing', 'Chest wall retractions', 'Nasal flaring', 'Difficulty feeding'],
                clue: '[URGENT] Infant under 2 years with shortness of breath and wheezing after a viral URI. Suspect RSV bronchiolitis: oxygenation is the priority, not bronchodilators.',
                relevantLabs: ['SpO2', 'Complete blood count'],
                anamnesis: [
                    'My baby is short of breath, Doc. It started as a simple runny nose but got worse and now will not feed.',
                    'The breathing sounds wheezy, and the chest is visibly sucking in.'
                ],
                anamnesisQuestions: {
                    keluhan_utama: [
                        { id: 'q_onset', text: 'Since when has the breathing trouble been present?', response: 'Since yesterday it has been getting worse, Doc. At first it was only a cold.', priority: 'essential' },
                        { id: 'q_feed', text: 'Can the baby still breastfeed?', response: 'Does not want to feed, Doc, too short of breath.', priority: 'essential' },
                        { id: 'q_fever', text: 'Any fever?', response: 'A little warm, Doc, around 37.8.' }
                    ],
                    rps: [
                        { id: 'q_cough', text: 'What is the cough like?', response: 'Small coughs, but the breathing trouble is what worries us.' },
                        { id: 'q_blue', text: 'Have the lips ever turned blue?', response: 'A little bluish earlier, Doc, during coughing.', priority: 'essential' }
                    ],
                    rpd: [
                        { id: 'q_premature', text: 'Was the baby born premature?', response: 'Full term, Doc.' },
                        { id: 'q_sibling', text: 'Any sibling recently had the flu?', response: 'The older sibling just recovered from a cold last week.' }
                    ],
                    sosial: []
                },
                physicalExamFindings: {
                    general: '8-month-old infant appears severely dyspneic with nasal flaring and subcostal/intercostal retractions.',
                    vitals: 'HR 160 bpm, RR 62 breaths/min, Temp 37.8°C, SpO2 88%.',
                    thorax: 'Bilateral expiratory wheeze, fine crackles, and prolonged expiration.',
                    extremities: 'Warm extremities, CRT <2 seconds, with mild perioral cyanosis.'
                },
                sisruteData: {
                    situation: '8-month-old infant with severe dyspnea, SpO2 88%, retractions, and bilateral wheeze.',
                    background: 'Upper respiratory symptoms for 3 days, older sibling recently had influenza, born full term.',
                    assessment: 'Severe bronchiolitis, likely RSV. Requires pediatric critical-care monitoring.',
                    recommendation: 'Admit or refer to PICU/HCU for oxygenation and hydration monitoring.'
                },
                differentialDiagnosis: ['Asthma in infancy', 'Pneumonia', 'Foreign body aspiration', 'Pertussis']
            },
            intussusception: {
                diagnosis: 'Intussusception',
                symptoms: ['Intermittent colicky abdominal pain', 'Bloody mucoid stool (currant jelly)', 'Green vomiting', 'Abdominal mass', 'Infant pulling legs toward the belly'],
                clue: '[CRITICAL] Infant or child with severe colic and currant jelly stool. Suspect intussusception and refer immediately for ultrasound and reduction.',
                relevantLabs: ['Complete blood count'],
                anamnesis: [
                    'My child keeps crying in pain, pulling the legs toward the stomach, and passing bloody mucus stool.',
                    'Severe intermittent colic, green vomiting, and stool like dark red jam.'
                ],
                anamnesisQuestions: {
                    keluhan_utama: [
                        { id: 'q_pain', text: 'What is the pain pattern like?', response: 'Suddenly cries in pain, Doc, pulls the legs up, then stops, then cries again.', priority: 'essential' },
                        { id: 'q_stool', text: 'What is the stool like?', response: 'There was blood mixed with mucus, Doc, dark red.', priority: 'essential' },
                        { id: 'q_vomit', text: 'Any vomiting?', response: 'Keeps vomiting, Doc, and now it is green.', priority: 'essential' }
                    ],
                    rps: [
                        { id: 'q_duration', text: 'How long has this been happening?', response: 'Since 6 hours ago, Doc, and becoming more frequent.' },
                        { id: 'q_feed', text: 'When was the last meal?', response: 'This morning, now does not want to eat.' }
                    ],
                    rpd: [
                        { id: 'q_prev', text: 'Has this ever happened before?', response: 'Never, Doc.' }
                    ],
                    sosial: []
                },
                physicalExamFindings: {
                    general: '9-month-old infant, irritable and restless, alternating abrupt pain episodes with short calm periods.',
                    vitals: 'HR 150 bpm, RR 36 breaths/min, Temp 37.5°C.',
                    abdomen: 'Sausage-shaped mass palpable in the right upper quadrant. Positive Dance sign with relative emptiness in the right lower quadrant. Hyperactive bowel sounds during colic.',
                    extremities: 'CRT 2 seconds, hydration fair.'
                },
                sisruteData: {
                    situation: '9-month-old infant with intermittent abdominal colic, currant jelly stool, and bilious vomiting.',
                    background: 'Onset 6 hours ago, sausage-shaped mass palpable in the RUQ, Dance sign positive.',
                    assessment: 'Suspected intussusception. Requires urgent ultrasound confirmation and hydrostatic or operative reduction.',
                    recommendation: 'Urgent pediatric surgery referral for air/barium reduction or laparotomy if reduction fails or perforation is suspected.'
                },
                differentialDiagnosis: ['Volvulus', 'Acute appendicitis', 'Meckel diverticulum', 'AGE with dehydration']
            },
            dka_pediatric: {
                diagnosis: 'Pediatric Diabetic Ketoacidosis',
                symptoms: ['Kussmaul breathing', 'Decreased consciousness', 'Vomiting', 'Abdominal pain', 'Acetone breath', 'Severe dehydration'],
                clue: '[CRITICAL] Child with rapid deep breathing, dehydration, and acetone breath. Suspect DKA. Check blood glucose immediately and start fluid resuscitation.',
                relevantLabs: ['Random blood glucose', 'Complete blood count', 'Electrolytes', 'Blood gas analysis'],
                anamnesis: [
                    'The child is weak and vomiting, with very rapid breathing and breath that smells like rotten fruit.',
                    'Drinking a lot and losing weight, and now becoming unconscious.'
                ],
                anamnesisQuestions: {
                    keluhan_utama: [
                        { id: 'q_event', text: 'What happened?', response: 'My child is weak, vomiting constantly, and breathing very fast, Doc.', priority: 'essential' },
                        { id: 'q_drink', text: 'Has the child been drinking a lot lately?', response: 'Yes, Doc, always drinking but still thirsty, and urinating a lot too.', priority: 'essential' },
                        { id: 'q_weight', text: 'Has there been weight loss?', response: 'Lost 3 kg in the last month, Doc.', priority: 'essential' }
                    ],
                    rpd: [
                        { id: 'q_dm', text: 'Any prior diabetes history?', response: 'Never checked before, Doc, this is the first time being this sick.' },
                        { id: 'q_family', text: 'Any family history of diabetes?', response: 'Maternal grandmother has diabetes, Doc.' }
                    ],
                    sosial: []
                },
                physicalExamFindings: {
                    general: '10-year-old child, somnolent, severely dehydrated, with Kussmaul breathing and acetone odor.',
                    vitals: 'BP 90/60, HR 130 bpm, RR 36 deep breaths/min, Temp 37.0°C.',
                    abdomen: 'Diffuse abdominal tenderness with decreased bowel sounds.',
                    neuro: 'GCS E3V4M5 = 12, pupils equal and reactive, reflexes normal.'
                },
                sisruteData: {
                    situation: '10-year-old child with GCS 12, Kussmaul breathing, glucose >500, severe dehydration, and acetone odor.',
                    background: 'Polydipsia and polyuria for 1 month, weight loss of 3 kg, no prior diabetes diagnosis.',
                    assessment: 'Severe DKA from new-onset type 1 diabetes. Requires PICU for insulin infusion and close monitoring.',
                    recommendation: 'Refer to PICU for insulin infusion, electrolyte correction, and serial blood gas monitoring.'
                },
                differentialDiagnosis: ['Sepsis', 'Methanol poisoning', 'Acute kidney failure', 'Lactic acidosis']
            },
            neonatal_asphyxia: {
                diagnosis: 'Neonatal Asphyxia',
                symptoms: ['Baby not crying', 'Cyanosis', 'Poor tone', 'Gasping', 'Bradycardia'],
                clue: '[CRITICAL] Neonate not crying at birth with low APGAR. Start neonatal resuscitation in the golden minute: dry, stimulate, and clear the airway.',
                anamnesis: [
                    'The baby did not cry after birth, Doc, looked blue, and was limp.',
                    'Prolonged labor, early membrane rupture, and amniotic fluid mixed with meconium.'
                ],
                anamnesisQuestions: {
                    keluhan_utama: [
                        { id: 'q_birth', text: 'How was the delivery process?', response: 'Long labor, Doc. The water broke in the morning but the baby was only delivered in the evening.', priority: 'essential' },
                        { id: 'q_cry', text: 'Did the baby cry right away?', response: 'Did not cry, Doc, only gasping.', priority: 'essential' },
                        { id: 'q_meconium', text: 'Was the amniotic fluid clear?', response: 'Greenish, Doc.', priority: 'essential' }
                    ],
                    rpd: [
                        { id: 'q_anc', text: 'Were antenatal visits regular?', response: 'Only 2 visits, Doc.' }
                    ],
                    sosial: []
                },
                physicalExamFindings: {
                    general: 'Term neonate without adequate spontaneous breathing, hypotonic, centrally cyanotic.',
                    vitals: 'HR 80 bpm (bradycardia), gasping respirations, Temp 35.5°C, APGAR at 1 minute = 3.',
                    thorax: 'Severe retractions with markedly reduced air entry.',
                    extremities: 'Poor flexor tone with weak reflexes.'
                },
                sisruteData: {
                    situation: 'Term neonate without spontaneous breathing, APGAR 3, central cyanosis, and heart rate 80 bpm.',
                    background: 'Prolonged labor, membrane rupture >12 hours, meconium-stained amniotic fluid, incomplete antenatal care.',
                    assessment: 'Severe neonatal asphyxia with concern for meconium aspiration. Requires NICU immediately.',
                    recommendation: 'Refer to NICU for ventilatory support, close monitoring, and management of suspected meconium aspiration.'
                },
                differentialDiagnosis: ['Meconium aspiration', 'Neonatal sepsis', 'Congenital heart disease', 'Prematurity']
            }
        }
    }
};
