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
            deteriorationStatus: 'Deterioration Status',
            telemetry: 'Telemetry'
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
            head_tilt: 'Head Tilt / Chin Lift',
            recovery_position: 'Recovery Position',
            rescue_breathing: 'Rescue Breathing (Bag Valve Mask)'
        },
        caseData: {
            asthma_acute_severe: {
                diagnosis: 'Acute Severe Asthma',
                symptoms: ['Severe shortness of breath', 'Inspiratory/expiratory wheeze', 'Broken sentences', 'Accessory muscle use'],
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
                differentialDiagnosis: ['Acute COPD exacerbation', 'Congestive heart failure', 'Pneumothorax']
            },
            copd_exacerbation: {
                diagnosis: 'Acute COPD Exacerbation',
                symptoms: ['Worsening shortness of breath', 'Purulent productive cough', 'Wheezing', 'Barrel chest', 'Cyanosis'],
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
                differentialDiagnosis: ['Pneumonia', 'Congestive heart failure', 'Pneumothorax', 'Pulmonary embolism']
            },
            foreign_body_aspiration: {
                diagnosis: 'Foreign Body Aspiration',
                symptoms: ['Sudden choking', 'Stridor', 'Paroxysmal cough', 'Cyanosis', 'Unable to speak or cry'],
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
                differentialDiagnosis: ['Croup', 'Epiglottitis', 'Angioedema', 'Acute asthma']
            },
            chest_pain_acs: {
                diagnosis: 'Acute Coronary Syndrome',
                symptoms: ['Left or central chest pain', 'Radiating to the arm or jaw', 'Cold sweat', 'Nausea', 'Shortness of breath'],
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
            }
        }
    }
};
