export default {
    wilayahContent: {
        ui: {
            layerBadges: {
                pispk: 'Village IKS {{value}}%',
                surveillance: '{{count}} active cases',
                psn: 'PSN priority',
                phbs: '0-10 indicator score',
                perilaku: 'Behavior change mode'
            },
            buildingGamePanel: {
                exit: 'Exit',
                sceneReference: '{{title}} mode | {{subtitle}}',
                barrierCount: '{{count}} barriers',
                stationCount: '{{count}} stations',
                statusDone: 'Done',
                statusActive: 'Active',
                stationStep: 'Desk {{index}}',
                actionsAvailable: 'Available Actions',
                findings: 'Findings',
                revealHint: 'Complete an action to reveal this...',
                enterDoor: 'Entry',
                exitDoor: 'Exit',
                linkedCases: 'Linked Cases',
                close: 'Close',
                scenarioLeavePrompt: 'Opening this scenario will leave the building layout.',
                cancel: 'Cancel',
                start: 'Start',
                completionReputation: 'Reputation',
                completionButton: 'Finish'
            },
            combWheel: {
                title: 'The Behaviour Change Wheel',
                subtitle: 'Michie et al. (2011) | Behavioral diagnostic engine',
                detectedBarrier: 'Detected barrier',
                recommendedInterventions: 'Recommended interventions',
                interventionHelp: 'Select an intervention strategy to address the associated behavioral barriers.',
                legendCapability: 'Capability',
                legendOpportunity: 'Opportunity',
                legendMotivation: 'Motivation',
                engineLabel: 'PRIMER Behavioral Science Engine',
                centerTitle: 'BEHAVIOUR',
                centerSubtitle: 'COM-B MODEL',
                domains: {
                    cap_psy: { label: 'Psychological Capability', shortLabel: 'CAP-PSY' },
                    cap_phy: { label: 'Physical Capability', shortLabel: 'CAP-PHY' },
                    opp_phy: { label: 'Physical Opportunity', shortLabel: 'OPP-PHY' },
                    opp_soc: { label: 'Social Opportunity', shortLabel: 'OPP-SOC' },
                    mot_ref: { label: 'Reflective Motivation', shortLabel: 'MOT-REF' },
                    mot_aut: { label: 'Automatic Motivation', shortLabel: 'MOT-AUT' }
                },
                interventions: {
                    education: 'Education',
                    persuasion: 'Persuasion',
                    incentivisation: 'Incentivisation',
                    coercion: 'Coercion',
                    training: 'Training',
                    restriction: 'Restriction',
                    environmental_restructuring: 'Environmental Restructuring',
                    modelling: 'Modelling',
                    enablement: 'Enablement'
                }
            },
            dioramaExhibition: {
                badgeFullVillage: 'Full Village Only',
                badgeNonOperational: 'Non-Operational',
                description: 'This mode is reserved for the full-village mockup and presentation beats. RW pocket dioramas still live inside the 2D inspector, not in this exhibition screen.',
                captionNoScope: 'Full-village panorama | exhibition only | 2D remains the operational source of truth.',
                caption: '{{label}} | {{buildingCount}} nodes | {{houseCount}} homes | exhibition only | RW inspection continues from 2D.'
            },
            dioramaInspector: {
                modeLabels: {
                    mobile: 'Mobile Snapshot',
                    gpuSafe: 'GPU Safe Snapshot',
                    standard: 'Inspector Snapshot'
                },
                modeDescriptors: {
                    mobile: 'Bottom-sheet safe',
                    gpuSafe: 'No WebGL',
                    standard: 'Static inspector'
                },
                snapshotAriaLabel: '{{label}} snapshot',
                snapshotSummary: 'This snapshot keeps RW and building context readable without turning on WebGL inside the inspector.',
                focusLabel: 'Inspector Focus',
                metricMode: 'Mode',
                metricModeSnapshot: 'Snapshot',
                metricRender: 'Render',
                metricRenderSafe: 'GPU Safe',
                metricNodes: '{{count}} nodes',
                metricHouses: '{{count}} homes',
                liveTitle: '3D Inspector',
                liveLoadingBody: 'Loading a pocket diorama for this scope...',
                liveChip: 'Turntable',
                liveFooterMode: 'Inspector only',
                liveFooterHint: 'Click a building to refocus',
                fallbackTitle: 'Pocket Diorama',
                fallbackBody: 'The 3D inspector is not ready yet because the scope data is incomplete.',
                recoveryTitle: 'GPU Recovery',
                recoveryBody: 'The 3D inspector is paused briefly. The canvas will rebuild automatically.',
                recoveryAction: 'Rebuild now',
                scopeTitleCompact: 'Inspector Scope',
                scopeTitleExpanded: 'Pocket Diorama Scope',
                capabilityLabels: {
                    live: 'Live 3D',
                    snapshot: 'Snapshot',
                    off: 'Metadata'
                },
                scopeKinds: {
                    rw: 'RW Focus',
                    sector: 'Sector Slice',
                    building: 'Building Focus',
                    scope: 'Scope'
                },
                scopeDescriptions: {
                    compactSnapshot: 'On mobile, the inspector uses a static snapshot so the view stays light, clear, and free from forced WebGL rendering.',
                    gpuSafeSnapshot: 'This device is using a GPU-safe snapshot. The inspector still keeps RW and building context visible without turning on the 3D canvas.',
                    metadataOnly: 'The 3D inspector stays available on desktop while 2D remains the main mode. On compact screens or during full 3D exhibition, this scope collapses into metadata.'
                }
            },
            bridgeStatus: {
                broken: 'Bridge Down',
                atRisk: 'Bridge At Risk',
                normal: 'Bridge Normal'
            },
            iksStatus: {
                healthy: 'HEALTHY',
                preHealthy: 'PRE-HEALTHY',
                unhealthy: 'UNHEALTHY'
            },
            inspectorCaseLinks: {
                title: 'Linked Cases',
                hint: 'Choose a community case to open the diagnosis panel that best matches this node.',
                runtimeBadge: 'Runtime Link',
                actionOpen: 'Open',
                actionCall: 'Call',
                noticeAlreadyActive: '{{caseName}} is already active. The community panel is now focused.',
                noticeUnavailable: '{{caseName}} cannot be started right now.',
                noticeOpened: '{{caseName}} opened in the community diagnosis panel.',
                noticeCalled: '{{caseName}} was called. Check the map anchor if the panel is still closed.'
            },
            rwInspector: {
                closeInspectorAria: 'Close region inspector',
                closeDossierAria: 'Close RW dossier',
                closeBuildingDetailAria: 'Close building detail',
                blankSpotBadge: 'PIS-PK Blank Spot',
                title: 'Unmapped Zone Dossier',
                description: 'This sector exists in the village topology, but its PIS-PK household data is not yet an active operational area.',
                families: 'Families',
                mappedHouseholds: 'mapped households',
                residents: 'Residents',
                recordedResidents: 'recorded residents',
                unlockStatus: 'RW {{rw}} Unlock Status',
                guidanceTitle: 'Operational Guidance',
                activeResidence: 'Active Residence',
                rtLabel: 'RT {{rt}}',
                unlockGuidance: 'Open the Census archive to review household composition in this RW, then use day progress and reputation to track when the sector becomes active on the main map.',
                openArchive: 'Open RW {{rw}} Archive',
                openRelatedArchive: 'Open Related RW Archive',
                closeDossier: 'Close Dossier'
            },
            rwProgress: {
                operationalDay: 'Operational Day',
                dayValue: 'Day {{day}}',
                ready: 'Ready',
                remainingDays: '{{count}} days remaining',
                currentDay: 'Current: Day {{day}}',
                villageReputation: 'Village Reputation',
                reputationValue: '{{value}} REP',
                remainingReputation: '{{value}} REP remaining',
                currentReputation: 'Current: {{value}} REP',
                dayShort: 'Day',
                reputationShort: 'Reputation',
                dayRequirementMet: 'Day requirement met',
                reputationRequirementMet: 'Reputation requirement met'
            },
            inspectorActions: {
                censusData: 'Village Census Data',
                iksReport: 'IKS Report',
                operationalMockup3d: '3D Operational Mockup',
                enterBuilding: 'Enter Building',
                enterBuildingSub: 'Start Investigation',
                wikiProcedure: 'Wiki & Procedures',
                homeVisitBehaviorChange: 'Home Visit (Behavior Change)',
                quickVisitLegacy: 'Quick Visit (Legacy)'
            },
            inspectorInfo: {
                title: 'Information',
                defaultDescription: '{{name}} is an important public facility in Sukamaju Village.'
            },
            lockedRw: {
                badge: 'RW Blind Spot {{rw}}',
                title: 'Area Not Yet Unlocked',
                description: 'This building already exists in the topology, but gameplay access stays locked until the related RW meets the day and reputation thresholds.'
            },
            homeVisitModal: {
                title: 'Home Visit (PIS-PK)',
                closeAria: 'Close home visit',
                energy: 'Energy',
                iksStatus: 'IKS Status',
                accessBlockedEast: 'Access to the eastern sector is cut off.',
                completed: 'Done',
                blocked: 'Blocked',
                interventions: {
                    kb: { label: 'Family Planning Education', description: 'Family planning counseling' },
                    persalinan: { label: 'Safe Delivery Education', description: 'Counseling for delivery at a health facility' },
                    imunisasi: { label: 'Check Immunization', description: 'Verify infant immunization status' },
                    asi: { label: 'Exclusive Breastfeeding Education', description: 'Counseling for six months of exclusive breastfeeding' },
                    balita: { label: 'Monitor Growth and Development', description: 'Measure toddler weight and height' },
                    tb: { label: 'TB Monitoring', description: 'Check TB medication adherence' },
                    hipertensi: { label: 'Hypertension Screening', description: 'Blood pressure measurement' },
                    jiwa: { label: 'Mental Health Screening', description: 'Early detection of mental health problems' },
                    rokok: { label: 'Smoking Cessation Counseling', description: 'Education on smoking hazards' },
                    jkn: { label: 'JKN/BPJS Registration', description: 'Help with BPJS Health enrollment' },
                    sanitasi: { label: 'Sanitation Survey', description: 'Check latrines and water sources' },
                    psn: { label: 'Larva Check (PSN)', description: 'Inspect water containers for Aedes mosquito larvae' }
                }
            },
            map2dMarker: {
                iksValue: 'IKS {{value}}%',
                localCadre: 'Local Cadre',
                cadreProtected: 'Protected by Cadre',
                priorityIntel: 'Priority Intel #{{rank}}',
                narrativeCues: {
                    rtkSurveillance: {
                        label: 'ALERT',
                        eyebrow: 'Maternal Hub',
                        title: 'Monitor High-Risk Mothers',
                        detail: 'Maternal referral anchor'
                    },
                    rtkDefault: {
                        label: 'REFER',
                        eyebrow: 'Maternal Hub',
                        title: 'Maternal Referral',
                        detail: 'Safe delivery and maternal transit'
                    },
                    dukunBehavior: {
                        label: 'MEDIATION',
                        eyebrow: 'Culture',
                        title: 'Tradition Dialogue',
                        detail: 'Bridge between custom and evidence'
                    },
                    dukunDefault: {
                        label: 'CUSTOM',
                        eyebrow: 'Culture',
                        title: 'Tradition Anchor',
                        detail: 'Negotiating community beliefs'
                    }
                }
            },
            map2dBlueprint: {
                unmappedZone: 'Zone Not Yet Mapped',
                unmappedZoneShort: 'Zone Not Yet Mapped',
                openBlankSpotDossier: 'Open RW {{rw}} blank-spot dossier',
                rwLabel: 'RW {{rw}}',
                households: '{{count}} households',
                blankSpotPispk: 'PIS-PK Blind Spot',
                ikmEvent: 'IKM Event',
                outbreakLabel: 'OUTBREAK {{type}}',
                bridge: {
                    broken: 'Bridge Broken',
                    floodRisk: 'Bridge At Risk',
                    normal: 'Bridge Normal',
                    repaired: 'REPAIRED OK',
                    repairFailed: 'Repair failed'
                },
                legend: {
                    blank: 'Blank {{count}}',
                    coverage: 'Coverage',
                    intel: 'Intel {{count}}',
                    cadre: 'Cadre {{count}}',
                    ikm: 'IKM {{count}}'
                },
                eventRoles: {
                    sekolah: 'School',
                    sekolah_posyandu: 'School / Integrated Health Post',
                    polindes_dukun: 'Polindes / Healer',
                    warung_dukun: 'Shop / Healer',
                    pasar_sekolah: 'Market / School',
                    sawah_pos_ukk: 'Fields / Occupational Post',
                    posyandu_gizi: 'Integrated Health Post / Nutrition',
                    komunitas: 'Community',
                    phbs: 'PHBS',
                    lingkungan: 'Environment',
                    gizi: 'Nutrition',
                    pangan: 'Food Safety',
                    budaya: 'Culture',
                    remaja: 'Adolescent Health',
                    jiwa: 'Mental Health'
                }
            },
            miniGame: {
                audit: {
                    title: 'Transmission Triangulation',
                    subtitle: 'Sanitation Forensics - Find & Classify Routes',
                    findings: 'Findings',
                    battery: 'Battery',
                    time: 'Time',
                    found: 'Found!',
                    classifiedRoute: 'OK {{route}}',
                    wrongBattery: 'Wrong! -20% battery',
                    pointLabel: 'Point-{{index}}',
                    batteryDepletedTitle: 'Battery Depleted',
                    batteryDepletedBody: 'The triangulation tool is offline. Investigation stopped.',
                    finishedComplete: 'Forensics Complete',
                    finishedBattery: 'Battery Depleted',
                    finishedTime: 'Time Up',
                    classified: 'Classified',
                    timeBonus: 'Time Bonus',
                    classificationMistakes: 'Classification Mistakes',
                    openingReport: '-> Opening evaluation report...',
                    routes: {
                        vector: 'Vector',
                        water: 'Water',
                        air: 'Air'
                    }
                },
                anamnesis: {
                    title: 'Social Anamnesis',
                    subtitle: 'Health Belief Model (HBM) Profiling',
                    quote: 'Quote',
                    transcript: 'Interview Transcript:',
                    identifyBarrier: 'Identify the resident psychological barrier:',
                    accurate: 'HBM Analysis: Accurate',
                    misinterpretation: 'Clinical Misinterpretation'
                },
                rtl: {
                    title: 'Follow-Up Action Plan',
                    subtitle: 'Cross-Sector BCW Intervention Allocation',
                    allocation: 'Allocation',
                    target: 'Target:',
                    deployHere: '< Deploy Here >',
                    emptySlot: '[ Empty Slot ]',
                    clickTargetSlot: '>>> Click a target slot above <<<',
                    selectPolicy: 'Intervention Arsenal - Select Policy',
                    confirm: 'Confirm Cross-Sector Action Plan',
                    barriers: {
                        cap_phy: 'Physical Capability',
                        cap_psy: 'Psychological Capability',
                        opp_phy: 'Physical Opportunity',
                        opp_soc: 'Social Opportunity',
                        mot_ref: 'Reflective Motivation',
                        mot_aut: 'Automatic Motivation'
                    }
                },
                fallback: {
                    module: 'Module [{{gameType}}]',
                    autoResolved: 'Auto-resolved',
                    bypass: 'Bypass'
                },
                feedback: {
                    gameNotFound: 'Game not found.',
                    excellent: 'Outstanding. Your field skills are excellent.',
                    good: 'Good. Your understanding is solid.',
                    practice: 'Adequate, but keep practicing.',
                    retry: 'Needs improvement. Try again.'
                }
            },
            auxiliary: {
                familyIksScore: 'Family IKS Score',
                iksAria: 'Family IKS score: {{score}}% - {{status}}. Click for info.',
                iksStatus: {
                    healthy: 'Healthy Family',
                    preHealthy: 'Pre-Healthy',
                    unhealthy: 'Unhealthy'
                },
                members: '{{count}} members',
                detail: 'Detail',
                gender: {
                    maleShort: 'M',
                    femaleShort: 'F'
                },
                memberMeta: '{{age}} yrs - {{gender}} - {{occupation}}',
                indicatorCount: '{{count}} PIS-PK Indicators',
                pispkCoverage: 'PIS-PK Coverage',
                householdsShort: 'HH',
                surveillanceAlert: 'Surveillance Alert',
                cases: 'Cases',
                villageIks: 'Village IKS',
                villageIksAria: 'Village IKS: {{score}}%',
                announcements: 'Announcements',
                indicators: {
                    kb: 'Family uses contraception',
                    persalinan: 'Delivery in health facility',
                    imunisasi: 'Infant received complete basic immunization',
                    asi: 'Infant received exclusive breastfeeding',
                    balita: 'Toddler growth is monitored',
                    tb: 'Pulmonary TB patient treated to standard',
                    hipertensi: 'Hypertension patient treated regularly',
                    jiwa: 'Person with mental disorder is not neglected',
                    rokok: 'No family member smokes',
                    jkn: 'Family is enrolled in JKN',
                    air: 'Family has access to clean water',
                    jamban: 'Family has access to or uses a healthy latrine',
                    jentik: 'Mosquito larvae-free (PSN)'
                }
            },
            communityDiagnosis: {
                caseReport: 'Case Report',
                closeReport: 'Close Report',
                combAnalysis: 'COM-B Analysis',
                finishAnalysis: 'Finish Analysis',
                communityDiagnosis: 'Community Diagnosis',
                analyzing: 'Analyzing...',
                setDiagnosis: 'Set Diagnosis',
                interventionPlanning: 'Intervention Planning (5W1H)',
                interventionHint: 'Complete the primary health center action plan.',
                selectAnswer: 'Choose an answer...',
                processing: 'Processing...',
                executeIntervention: 'Execute Intervention',
                close: 'Close',
                feedback: {
                    insufficientFunds: 'Active funds are not enough for this intervention.',
                    interventionGood: 'The intervention plan is well structured. ({{correct}}/{{total}} correct)',
                    interventionWeak: 'The intervention plan is not targeted enough ({{correct}}/{{total}}). Review it again.'
                }
            },
            behaviorCase: {
                barriers: {
                    cap_phy: { label: 'Physical Capability', desc: 'Limited physical skill or health condition prevents the resident from adopting healthy behavior.' },
                    cap_psy: { label: 'Psychological Capability', desc: 'Limited knowledge, health literacy, or cognitive capacity about the disease.' },
                    opp_phy: { label: 'Physical Opportunity', desc: 'Infrastructure, service distance, time availability, or financial barriers.' },
                    opp_soc: { label: 'Social Opportunity', desc: 'Social norms, stigma, local culture, or rejection by community figures.' },
                    mot_ref: { label: 'Reflective Motivation', desc: 'Conscious intention and beliefs that the healthy behavior is not important.' },
                    mot_aut: { label: 'Automatic Motivation', desc: 'Deep habits, emotional impulses, and everyday reflexes.' }
                },
                investigation: {
                    title: 'Clinical Interview',
                    subtitle: 'O.A.R.S Motivational Interviewing',
                    resistance: 'Resident Resistance',
                    evidence: 'Evidence',
                    subjectSays: 'Subject says:',
                    fallbackNpcLine: 'I do not understand why I should change. {{label}} has always been normal here.',
                    topicThreshold: 'Topic {{current}}/{{total}} - Threshold: tension < {{threshold}}%',
                    walkoutTitle: 'Resident Escalated',
                    walkoutBody: 'Lecturing a defensive resident triggers the righting reflex. The resident closes the door and the interview fails.',
                    continueLimitedData: 'Continue With Limited Data ->',
                    responseStrategy: 'Response Strategy:',
                    advanceSynthesis: 'Enough Evidence. Continue Synthesis ->',
                    tactics: {
                        empathy: 'Empathy',
                        empathyHint: 'Tension -30%',
                        probe: 'Clarify',
                        probeHint: 'Requires: < {{threshold}}%',
                        confrontation: 'Confront',
                        confrontationHint: 'Tension +45% warning'
                    },
                    logs: {
                        empathy: '[Empathy] You validate the resident burden. Defensive walls drop sharply.',
                        probeSuccess: '[Clarification Success] The resident opens up. Evidence: "{{finding}}"',
                        probeRejected: '[Clarification Rejected] The resident remains too defensive (tension {{tension}}% > threshold {{threshold}}%).',
                        confrontation: '[Medical Confrontation] You lecture the resident. They feel judged and become angry.'
                    }
                },
                diagnosis: {
                    evidenceMap: 'Empirical Evidence Map',
                    noEvidence: '[ No evidence - you are guessing blind ]',
                    title: 'Determinant Analysis',
                    hintPrefix: 'Choose',
                    maxSelect: 'Max {{count}}',
                    hintSuffix: 'root causes (COM-B).',
                    hoverGuide: 'Hover over a classification for COM-B theory guidance...',
                    confirmDiagnosis: 'Confirm IKM Diagnosis',
                    choosePriority: 'Choose intervention priorities...'
                },
                intervention: {
                    title: 'B.C.W Strategy Desk',
                    subtitle: 'Budget Allocation & Health Promotion Policy',
                    budget: 'Funds (AP)',
                    trust: 'Trust',
                    trustShort: 'TRST',
                    combDiagnosis: 'COM-B Diagnosis:',
                    target: 'Target',
                    backfireTitle: 'Backfire',
                    backfireBody: 'Social trust is too low for regulations or sanctions. Residents reject the program massively.',
                    efficacyProjection: 'Projected Efficacy',
                    executing: 'Executing...',
                    confirmPolicy: 'Confirm Policy',
                    approvedStamp: 'Approved',
                    policyCodes: { edu: 'EDU', env: 'ENV', coe: 'LAW', mod: 'MOD', inc: 'INC', trn: 'TRN' },
                    policies: {
                        edu: 'Community Education',
                        env: 'Physical Support / Subsidy',
                        coe: 'Village Regulation / Sanction',
                        mod: 'Community Leader Approach',
                        inc: 'Resident Incentive',
                        trn: 'Cadre Training'
                    },
                    feedback: {
                        backfire: 'BACKFIRE - residents reject it.',
                        efficacy: 'BCW efficacy: {{score}}%'
                    }
                },
                evaluation: {
                    ministry: 'Ministry of Health RI',
                    title: 'UKM Evaluation Report',
                    surveillanceCoverage: 'I. Surveillance Coverage',
                    rootCauseAccuracy: 'II. Root Cause Accuracy',
                    healthPromotionEfficacy: 'III. Health Promotion Efficacy',
                    totalIndex: 'Total Index',
                    leaderEvaluation: 'Leadership Evaluation:',
                    stamps: {
                        excellent: 'Effective',
                        good: 'Accepted',
                        partial: 'Needs Revision',
                        fail: 'Rejected'
                    },
                    narrative: {
                        excellent: 'The community intervention is strong, evidence-based, and likely to sustain behavior change.',
                        good: 'The intervention is accepted and operationally useful, though follow-up monitoring is still needed.',
                        partial: 'Some parts of the intervention work, but the plan needs revision before scale-up.',
                        fail: 'The intervention failed to address the core barrier and may increase downstream clinical burden.'
                    },
                    macro: {
                        title: 'Micro K.I.E Limitation Detected',
                        body: 'Structural root causes around environmental or social opportunity cannot be solved by family education alone.',
                        followup: 'Follow-up: bring these findings to the Village Hall forum for macro intervention.'
                    },
                    ukp: {
                        title: 'UKM Failed - UKP Burden Increased',
                        body: 'Community prevention failed. Residents become ill and add burden to the emergency unit. Prepare beds within',
                        days: '{{count}} days'
                    },
                    staffXp: 'Staff XP',
                    communityTrust: 'Community Trust',
                    archiveFile: 'Archive File X'
                },
                shell: {
                    confirmExit: 'Investigation is in progress. Leaving now will discard this case progress. Continue?',
                    category: 'PIS-PK: {{category}}',
                    sdohProfile: 'SDOH Profile',
                    sdohMeta: 'ECO: {{economy}} | EDU: {{education}}',
                    procedure: 'Procedure',
                    phaseLabels: {
                        investigation: 'Investigation',
                        diagnosis: 'Diagnosis',
                        intervention: 'Intervention',
                        planning: 'Planning',
                        evaluation: 'Evaluation',
                        complete: 'Complete',
                        followup: 'Follow-up'
                    }
                }
            },
            posyanduActive: {
                header: {
                    badge: 'Active Integrated Health Post',
                    title: 'Desk 2 & 5 Service'
                },
                doctorCapacity: 'Doctor Capacity (AP)',
                criticalLabel: 'Critical',
                gender: {
                    maleShort: 'M',
                    femaleShort: 'F',
                    male: 'Male',
                    female: 'Female'
                },
                ageMonths: '{{count}} mo',
                triage: {
                    title: 'Desk 1: Registration & Triage',
                    subtitle: 'Limited AP. Prioritize at-risk patients. Cadre delegation = 20% error rate.',
                    apEmpty: 'Doctor capacity is exhausted. Remaining patients must be delegated to cadres.'
                },
                actions: {
                    delegateCadre: 'Cadre (0 AP)',
                    examine: 'Examine (-1 AP)',
                    confirmKms: 'Confirm & Continue to Desk 5 ->',
                    finishExam: 'Finish Exam',
                    closeLogbook: 'Close Logbook X'
                },
                kms: {
                    title: 'Road to Health Card',
                    subtitle: 'WHO Growth Chart - {{gender}}',
                    weight: 'W: {{weight}} kg',
                    patientAge: '{{name}} - {{age}} mo',
                    note: 'Analyze the growth trend. A wrong diagnosis means the child misses nutrition intervention.'
                },
                stampPanel: {
                    title: 'Nutrition Diagnosis',
                    hint: 'Read the chart, then choose a stamp.',
                    noReveal: 'No auto-reveal.'
                },
                stamps: {
                    gizi_baik: 'Good Nutrition',
                    weight_faltering: 'No Weight Gain (T)',
                    gizi_kurang: 'Undernutrition',
                    gizi_buruk: 'Severe Undernutrition',
                    gizi_lebih: 'Overnutrition',
                    stunting: 'Stunting'
                },
                vials: {
                    delay: 'Delay Vaccination'
                },
                immunization: {
                    title: 'K.I.A Immunization Record',
                    patient: 'Name: {{name}} | Age: {{age}} mo',
                    doneStamp: 'OK',
                    injectedStamp: 'Injected'
                },
                coldChain: {
                    title: 'Vaccine Cold Chain',
                    temperature: 'Temp: 2.0C - 8.0C',
                    warning: 'Wrong vaccine = AEFI risk.'
                },
                handlers: {
                    cadre: 'Cadre',
                    doctor: 'Doctor'
                },
                feedback: {
                    cadreError: 'The cadre misread the KMS curve. A risk case slipped through without intervention.',
                    cadreOk: 'The cadre delivered basic-standard service. Recording is OK.',
                    delayVaccine: 'Vaccination was delayed by the doctor.',
                    vaccineNotFound: '{{vaccine}} was not found in the vaccine schedule.',
                    vaccineAlreadyGiven: '{{vaccine}} has already been given.',
                    vaccineTooEarly: '{{vaccine}} is not due yet.',
                    vaccineOnTime: '{{vaccine}} was given on schedule.',
                    vaccineLateCatchUp: '{{vaccine}} was late, but catch-up was completed.',
                    vaccineVeryLate: '{{vaccine}} is very late. Catch-up still matters for protection.',
                    vaccineGiven: '{{vaccine}} was administered.'
                },
                report: {
                    ministry: 'Ministry of Health RI',
                    title: 'Integrated Health Post Quality Audit',
                    logTitle: 'Medical Record Log:',
                    statusError: 'Malpractice / Error',
                    statusOk: 'SOP Aligned',
                    kmsDiagnosis: 'KMS Diagnosis:',
                    correctSuffix: ' (Correct)',
                    shouldBe: ' Should be: {{stamp}}',
                    vaccination: 'Vaccination:',
                    vaccineRiskSuffix: ' (AEFI Risk)',
                    vaccineSafeSuffix: ' (Safe)',
                    malpracticeTitle: 'Malpractice Report',
                    malpracticeBody: '{{count}} malpractice cases were recorded. KMS diagnostic errors let severe undernutrition or stunting pass without intervention. Vaccine errors increase AEFI risk. Integrated health post reputation decreased.',
                    medicalXp: 'Medical XP',
                    independentAura: 'Independent Aura +{{xp}} XP',
                    villageReputation: 'Village Reputation'
                }
            },
            pustuActive: {
                header: {
                    badge: 'Pustu / Polindes',
                    title: 'KIA Service - Pink Book'
                },
                doctorCapacity: 'Doctor Capacity (AP)',
                criticalLabel: 'Critical',
                triage: {
                    title: 'Pregnancy Queue',
                    subtitle: 'Limited AP. Prioritize high-risk pregnancies. Delegation = 25% error.',
                    apEmpty: 'Doctor capacity is exhausted. Remaining patients must be delegated to the village midwife.'
                },
                patient: {
                    age: 'Age {{age}} yrs',
                    ageYears: '{{age}} years',
                    gestationalWeekShort: 'GA {{week}} wk',
                    weekValue: '{{week}} weeks'
                },
                actions: {
                    delegateMidwife: 'Midwife (0 AP)',
                    examine: 'Examine (-1 AP)',
                    confirmAnc: 'Confirm Examination ->',
                    confirmRisk: 'Confirm Risk Assessment ->',
                    skipKb: 'Skip FP',
                    counselKb: 'FP Counseling ->',
                    closeLogbook: 'Close Logbook X'
                },
                ancCard: {
                    title: 'Maternal Card - {{visit}}',
                    name: 'Name',
                    age: 'Age',
                    gestationalWeek: 'GA',
                    edd: 'EDD',
                    startWeight: 'Initial W',
                    height: 'Height'
                },
                ancChecksTitle: 'Choose Examinations',
                ancChecksHint: 'Check the required examinations for {{visit}}. Missed essential checks reduce the score.',
                requiredVisit: 'Required {{visit}}',
                submitPanel: {
                    required: 'Required: {{count}} checks',
                    selected: 'Selected: {{count}}',
                    completeness: 'Completeness',
                    requiredCount: '{{done}}/{{total}} required'
                },
                risk: {
                    title: 'Pregnancy Risk Assessment',
                    hint: 'Identify risk factors from examination data. Missed signs mean risk goes undetected.',
                    visitResult: '{{visit}} Examination Result',
                    weight: 'Weight: {{weight}}'
                },
                warningPrefix: 'WARN:',
                kb: {
                    title: 'Postpartum Family Planning Counseling',
                    hint: 'Recommend a contraceptive method based on the patient profile. Watch for contraindications.',
                    effectiveness: '{{value}}% effective',
                    duration: 'Duration: {{duration}}',
                    sideEffects: 'Side effects: {{effects}}',
                    minimal: 'minimal',
                    contraindications: 'Contraindications: {{items}}'
                },
                report: {
                    ministry: 'Ministry of Health RI',
                    title: 'KIA Service Quality Audit',
                    score: 'Score: {{score}}/100',
                    visitSummary: '{{visit}} - {{count}} checks',
                    medicalXp: 'Medical XP',
                    reputation: 'Reputation'
                },
                handlers: {
                    midwife: 'Village Midwife',
                    doctor: 'Doctor'
                },
                visitLabels: {
                    K1: 'K1 (First Visit)',
                    K2: 'K2 (Second Trimester)',
                    K3: 'K3 (Early Third Trimester)',
                    K4: 'K4 (Late Third Trimester)'
                },
                ancChecks: {
                    berat_badan: 'Measure Body Weight',
                    tekanan_darah: 'Measure Blood Pressure',
                    tinggi_fundus: 'Measure Fundal Height',
                    denyut_jantung_janin: 'Check Fetal Heart Rate (Doppler)',
                    hb: 'Check Hemoglobin',
                    golongan_darah: 'Check Blood Type',
                    protein_urin: 'Urine Protein Test',
                    gds: 'Random Blood Glucose',
                    hiv: 'HIV Rapid Test',
                    hbsag: 'HBsAg Test',
                    sifilis: 'Syphilis Test (RPR)',
                    letak_janin: 'Leopold Palpation (Fetal Lie)',
                    rencana_persalinan: 'Birth Plan (P4K)'
                },
                riskFactors: {
                    age_too_young: 'Age < 20 years',
                    age_too_old: 'Age > 35 years',
                    grand_multipara: 'Grand multipara (>= 5 children)',
                    short_stature: 'Height < 145 cm',
                    anemia: 'Anemia (Hb < 11 g/dL)',
                    hypertension: 'Hypertension (BP >= 140/90)',
                    proteinuria: 'Positive proteinuria',
                    prev_csection: 'Previous C-section',
                    prev_complication: 'Previous complication history',
                    twins: 'Twin pregnancy',
                    malpresentation: 'Breech/transverse lie',
                    obesity: 'Obesity (BMI >= 30)'
                },
                events: {
                    preeclampsia_onset: { label: 'Preeclampsia Signs', description: 'BP rises with proteinuria and edema. Requires close monitoring and referral if severe.' },
                    anemia_worsening: { label: 'Worsening Anemia', description: 'Hb drops below 8 g/dL. Needs high-dose iron or transfusion referral.' },
                    gdm_detected: { label: 'Gestational Diabetes', description: 'High random glucose or abnormal OGTT. Diet control and tight monitoring needed.' },
                    placenta_previa: { label: 'Suspected Placenta Previa', description: 'Painless third-trimester bleeding. Refer immediately; avoid vaginal exam.' },
                    premature_labor: { label: 'Preterm Labor Signs', description: 'Regular contractions before 37 weeks. Tocolytic, corticosteroid, and referral needed.' },
                    iugr_suspected: { label: 'Suspected IUGR', description: 'Fundal height does not match gestational age. Monitor fetal growth closely.' },
                    normal_progress: { label: 'Normal Pregnancy', description: 'No abnormality found. Provide nutrition education, danger signs, and birth planning.' },
                    hyperemesis: { label: 'Hyperemesis Gravidarum', description: 'Excessive nausea and vomiting with dehydration. Give fluids and antiemetic.' },
                    ektopik_suspicion: { label: 'Suspected Ectopic Pregnancy', description: 'Severe abdominal pain plus first-trimester bleeding. Refer immediately.' }
                },
                kbMethods: {
                    pil_kb: { name: 'Combined Oral Contraceptive Pill', duration: 'daily' },
                    suntik_1bln: { name: 'Monthly Injection (Cyclofem)', duration: '1 month' },
                    suntik_3bln: { name: '3-Month Injection (DMPA)', duration: '3 months' },
                    implant: { name: 'Implant (Implanon/Jadena)', duration: '3 years' },
                    iud_copprt: { name: 'Copper IUD (CuT-380A)', duration: '10 years' },
                    kondom: { name: 'Condom', duration: 'per use' },
                    mow: { name: 'Female Sterilization (Tubectomy)', duration: 'permanent' },
                    mop: { name: 'Male Sterilization (Vasectomy)', duration: 'permanent' }
                },
                kbSideEffects: {
                    mual: 'nausea',
                    nyeri_payudara: 'breast tenderness',
                    spotting: 'spotting',
                    perubahan_siklus: 'cycle changes',
                    kenaikan_bb: 'weight gain',
                    amenore: 'amenorrhea',
                    osteoporosis_risk: 'osteoporosis risk',
                    nyeri_haid: 'menstrual pain',
                    haid_banyak: 'heavy bleeding',
                    risiko_operasi: 'surgical risk',
                    nyeri_lokal: 'local pain'
                },
                kbContraindications: {
                    hipertensi: 'hypertension',
                    merokok_35plus: 'smoking age 35+',
                    riwayat_dvt: 'DVT history',
                    hipertensi_berat: 'severe hypertension',
                    infeksi_pelvis: 'pelvic infection',
                    kehamilan: 'pregnancy'
                },
                feedback: {
                    midwifeError: 'The village midwife missed an important examination. Pregnancy risk was not detected.',
                    midwifeOk: 'The village midwife completed a standard examination. Notes are OK.',
                    doctorStrong: 'ANC examination is complete and aligned with standards.',
                    doctorPartial: 'Some important examinations were missed.',
                    doctorPoor: 'The examination is very incomplete. Pregnancy risk was not identified.',
                    ancComplete: 'ANC examination is complete and aligned with standards.',
                    ancMissing: '{{count}} essential checks are missing: {{checks}}.',
                    ancManyMissing: 'Many examinations are missing. Minimum standard includes: {{checks}}.',
                    kbContraindicated: '{{method}} is contraindicated for this patient. Choose another method.',
                    kbEligible: '{{method}} is appropriate for this patient. Effectiveness: {{effectiveness}}%.',
                    deliveryNormal: 'Normal vaginal delivery. Mother and baby are healthy.',
                    deliveryComplicated: 'Complication: {{complication}}. {{mode}} requires immediate management.'
                }
            },
            errorBoundary: {
                closePosyandu: 'Close Integrated Health Post',
                closePustu: 'Close Pustu',
                closeBuilding: 'Close Building',
                closeCase: 'Close Case',
                closePanel: 'Close Panel',
                scenarioUnavailable: 'Scenario "{{scenario}}" cannot be started right now. Check active status, cooldown, or the IKM category.'
            }
        },
        layerMeta: {
            general: {
                label: 'Infrastructure',
                subtitle: 'Village topology, RW blind spots, service anchors, and bridge status.',
                tooltip: 'Canonical 2D mode for village topology, blind spots, intel, cadres, service anchors, and bridge status.',
                legendItems: [
                    { label: 'RW & Blind Spots' },
                    { label: 'Service Anchors' },
                    { label: 'Intel / Cadres' }
                ]
            },
            pispk: {
                label: 'PIS-PK',
                subtitle: 'Family IKS, priority homes, and primary care coverage rings.',
                tooltip: 'Track family IKS, priority households, and primary care reach from key anchors.',
                legendItems: [
                    { label: 'Healthy' },
                    { label: 'Watch' },
                    { label: 'Risk' },
                    { label: 'Service Ring' }
                ]
            },
            surveillance: {
                label: 'Surveillance',
                subtitle: 'Active cases, outbreak clusters, and priority tracing homes.',
                tooltip: 'Highlight active cases, outbreak clusters, and tracing priorities over the last 14 days.',
                legendItems: [
                    { label: 'Active Cases' },
                    { label: 'Cluster / Outbreak' },
                    { label: 'Tracing Priority' }
                ]
            },
            psn: {
                label: 'Larvae',
                subtitle: 'Breeding points, at-risk homes, and PSN priorities.',
                tooltip: 'Find breeding cues, larva-positive homes, and spots that need PSN or community cleanups.',
                legendItems: [
                    { label: 'Safe' },
                    { label: 'Breeding Risk' },
                    { label: 'Active Larvae' }
                ]
            },
            phbs: {
                label: 'PHBS',
                subtitle: 'Household PHBS quality and areas that need foundational education.',
                tooltip: 'Read household PHBS quality and the spread of areas needing basic health behavior education.',
                legendItems: [
                    { label: '7-10 Good' },
                    { label: '4-6 Moderate' },
                    { label: '0-3 Poor' },
                    { label: 'Education Ring' }
                ]
            },
            perilaku: {
                label: 'Behavior',
                subtitle: 'Behavior barriers, intervention readiness, and field BCC priorities.',
                tooltip: 'Highlight homes with high behavior barriers and readiness for behavior change intervention.',
                legendItems: [
                    { label: 'High Risk' },
                    { label: 'Medium Risk' },
                    { label: 'Low / Ready' },
                    { label: 'Intervention Ring' }
                ]
            }
        },
        ikmCategories: {
            phbs: 'Clean and Healthy Living Behavior',
            cultural: 'Socio-Cultural and Beliefs',
            environmental: 'Environmental and Occupational Health',
            nutrition: 'Nutrition and Child Development',
            mental_health: 'Mental Health',
            adolescent: 'Adolescent Health (PKPR)',
            food_safety: 'Food Safety',
            traditional_health: 'Traditional Health'
        },
        ikmScenarios: {
            phbs: {
                bab_sembarangan: {
                    title: 'Open Defecation in the River',
                    description: 'A cadre reports that several RT 05 families still defecate in the river. Diarrhea risk rises during the rainy season.'
                },
                cuci_tangan: {
                    title: 'School ARI Outbreak - Handwashing',
                    description: 'Many elementary students do not wash their hands after buying snacks. An ARI cluster has appeared in two classes.'
                },
                makan_sembarangan: {
                    title: 'Market Snack Food Poisoning',
                    description: 'Several residents developed nausea and diarrhea after buying snacks at the village market.'
                },
                air_minum_tercemar: {
                    title: 'E. coli-Contaminated Well',
                    description: 'A well in RT 03 was contaminated with E. coli after flooding. Residents do not yet understand the danger.'
                },
                sampah_menumpuk: {
                    title: 'Garbage Pile - Mosquito Breeding Site',
                    description: 'Organic waste is piling up in two RTs and has become an Aedes aegypti breeding site.'
                }
            },
            cultural: {
                kesurupan_massal: {
                    title: 'Mass Possession Panic at School',
                    description: 'More than a dozen junior-high students fainted or screamed together. Residents panic and ask for a religious ritual.'
                },
                tolak_vaksin: {
                    title: 'Measles Immunization Refusal',
                    description: 'A group of residents refuses measles immunization for their children because of halal-haram rumors.'
                },
                dukun_beranak: {
                    title: 'High-Risk Mother Chooses Traditional Birth Attendant',
                    description: 'A high-risk pregnant mother chooses delivery with a traditional birth attendant and refuses primary health center care.'
                },
                jamu_berbahaya: {
                    title: 'Herbal Drink Mixed With Steroids',
                    description: 'A mobile herbal seller mixes dexamethasone into pain-relief herbal drinks. Several residents have diabetes flare-ups.'
                },
                kerokan_anak: {
                    title: 'Sick Child Treated With Coin Scraping',
                    description: 'An eight-month-old baby with high fever was treated with coin scraping by a grandmother, causing coin-rub dermatitis.'
                }
            },
            environmental: {
                pestisida_pertanian: {
                    title: 'Pesticide Poisoning Among Farmers',
                    description: 'Farmers spray crops without PPE, and two people collapse in the field.'
                },
                asap_pembakaran: {
                    title: 'Smoke From Land Burning',
                    description: 'Field burning creates thick haze. ARI visits increase threefold.'
                },
                gigitan_ular: {
                    title: 'Snakebite in the Rice Field',
                    description: 'A farmer is bitten by a venomous snake while harvesting rice.'
                },
                leptospirosis_banjir: {
                    title: 'Post-Flood Leptospirosis',
                    description: 'After major flooding, several residents exposed to muddy water develop high fever.'
                }
            },
            nutrition: {
                stunting_deteksi: {
                    title: 'Stunting Detected at Integrated Health Post',
                    description: 'This month, the integrated health post finds three toddlers in the red zone on the growth card.'
                },
                gizi_buruk_balita: {
                    title: 'Severe Toddler Malnutrition in Peripheral RT',
                    description: 'A toddler with signs of kwashiorkor is found in a low-income family.'
                },
                anemia_remaja: {
                    title: 'Teen Girl Anemia - School Screening',
                    description: 'School Hb screening finds that 40% of teen girls are anemic. Iron tablet programming begins.'
                },
                mpasi_salah: {
                    title: 'Complementary Feeding Too Early',
                    description: 'A three-month-old baby is already given banana and porridge. A young mother is influenced by her mother-in-law.'
                }
            },
            mental_health: {
                depresi_pascabencana: {
                    title: 'Post-Disaster Depression After Landslide',
                    description: 'After a landslide destroys five homes, several residents show symptoms of depression and PTSD.'
                },
                psikotik_akut: {
                    title: 'Acute Psychotic Episode at the Market',
                    description: 'A young man screams in the market and says demons are chasing him. Residents panic.'
                },
                bunuh_diri_remaja: {
                    title: 'Teen Suicide Attempt',
                    description: 'A high-school student is found after drinking insecticide following social-media bullying.'
                }
            },
            adolescent: {
                anemia_remaja: {
                    title: 'Teen Girl Anemia Screening',
                    description: 'School Hb screening finds that 40% of girls are anemic. Causes include low iron intake and diet myths.'
                },
                teen_pregnancy: {
                    title: 'Teen Pregnancy - Social Dilemma',
                    description: 'A 15-year-old junior-high student is secretly five months pregnant. Her family feels ashamed and wants forced marriage.'
                },
                napza_remaja: {
                    title: 'Substance Misuse Among Adolescents',
                    description: 'Several high-school students are caught inhaling glue at the night-watch post. Residents are worried.'
                }
            },
            food_safety: {
                makan_sembarangan: {
                    title: 'Food Poisoning Outbreak at a Wedding Feast',
                    description: 'After a wedding feast, 30 guests suddenly vomit and develop diarrhea. Contaminated food is suspected.'
                },
                formalin_tahu: {
                    title: 'Formalin-Tainted Tofu at the Village Market',
                    description: 'Rapid testing at the market finds formalin in tofu. Vendors do not know the product is dangerous.'
                },
                jajan_anak_sekolah: {
                    title: 'Unsafe School Snacks',
                    description: 'Most snacks sold outside the elementary school contain textile dye and excessive artificial sweetener.'
                }
            },
            traditional_health: {
                jamu_berbahaya: {
                    title: 'Dangerous Mobile Herbal Mix - Steroid Adulteration',
                    description: 'Older residents routinely buy mobile herbal drinks that contain dexamethasone and piroxicam.'
                },
                dukun_beranak: {
                    title: 'Traditional Birth Attendant Delivery - Complication',
                    description: 'A pregnant mother chooses delivery with a traditional birth attendant and develops postpartum bleeding.'
                },
                herbal_interaksi_obat: {
                    title: 'Herb-Drug Interaction in a Hypertension Patient',
                    description: 'A resident takes hypertension medicine together with cat-whiskers tea and raw garlic, causing a drastic blood-pressure drop.'
                }
            }
        },
        ikmScenarioPhases: {
            phbs: {
                bab_sembarangan: {
                    discovery: {
                        speaker: 'Village Cadre',
                        text: 'Doctor, I just found three families in RT 05 still defecating in the river. Their children also often have diarrhea. What should we do?',
                        choices: [
                            { text: 'Let us go to the field for observation and a COM-B analysis first.' }
                        ]
                    },
                    investigate_comb: {
                        description: 'Analyze RT 05 residents behavior related to open defecation in the river.'
                    },
                    diagnosis: {
                        question: 'Based on field observation and COM-B analysis, what is the root cause of open defecation in RT 05?',
                        choices: [
                            { text: 'A. Residents lack education on the correct way to defecate.', feedback: 'Not quite. Residents know the basic behavior, but other barriers are blocking change.' },
                            { text: 'B. Lack of physical access to proper latrines plus inherited habits.', feedback: 'Correct. Physical lack of latrines creates opportunity barriers, while habit keeps residents using the river.' },
                            { text: 'C. Chronic digestive disease among RT 05 residents.', feedback: 'Incorrect. Diarrhea is a consequence, not the root behavioral cause.' }
                        ]
                    },
                    intervention: {
                        who: {
                            question: 'Who is the main target audience?',
                            correct: 'RT 05 household heads and village officials',
                            options: ['RT 05 household heads and village officials', 'RT 05 children', 'Cleaning staff', 'Integrated health post cadres']
                        },
                        what: {
                            question: 'What is the best intervention now?',
                            correct: 'STBM triggering and communal latrine construction',
                            options: ['STBM triggering and communal latrine construction', 'Free diarrhea medicine distribution', 'No-open-defecation banners', 'Group morning exercise']
                        },
                        where: {
                            question: 'Where should the intervention happen?',
                            correct: 'Village hall meeting and RT 05 field location',
                            options: ['Village hall meeting and RT 05 field location', 'Primary health center', 'Elementary school', 'Town center']
                        },
                        when: {
                            question: 'When should it be implemented?',
                            correct: 'Immediately, before peak rainy season',
                            options: ['Immediately, before peak rainy season', 'Next year', 'Wait until an outbreak occurs', 'Next month']
                        },
                        why: {
                            question: 'Why is this intervention important?',
                            correct: 'To permanently break fecal-oral transmission',
                            options: ['To permanently break fecal-oral transmission', 'To spend the village budget', 'To make the river look nicer', 'To add cadre workload']
                        },
                        how: {
                            question: 'How should the approach work?',
                            correct: 'Community-Led Total Sanitation triggering with disgust and shame cues',
                            options: ['Community-Led Total Sanitation triggering with disgust and shame cues', 'Forced fines', 'Cash incentives', 'Wait for awareness to appear']
                        }
                    },
                    resolution_success: {
                        text: 'The intervention worked. After STBM triggering, the village agrees to build a communal latrine. Diarrhea cases drop sharply.'
                    },
                    resolution_fail: {
                        text: 'The intervention missed the root cause. Residents keep defecating in the river, and diarrhea begins to spread.'
                    }
                },
                cuci_tangan: {
                    discovery: {
                        speaker: 'Elementary School Teacher',
                        text: 'Doctor, twelve children in grades 3 and 5 have coughs and runny noses this week. We suspect they buy snacks outside and do not wash their hands. Can you help?',
                        choices: [
                            { text: 'Let us investigate the school setting with a COM-B analysis.' }
                        ]
                    },
                    investigate_comb: {
                        description: 'Analyze elementary students handwashing behavior with soap.'
                    },
                    diagnosis: {
                        question: 'Based on school canteen observation and COM-B analysis, what is the community health diagnosis for this ARI cluster?',
                        choices: [
                            { text: 'A. Airborne viral mutation from outside the village.', feedback: 'Not quite. The spread pattern is very localized around break time.' },
                            { text: 'B. Droplet transmission plus poor hand hygiene after buying snacks.', feedback: 'Correct. Student interaction and shared snacks without handwashing accelerate transmission.' },
                            { text: 'C. Foodborne poisoning from syrup drinks.', feedback: 'Incorrect. The symptoms are respiratory, not gastrointestinal.' }
                        ]
                    },
                    intervention: {
                        who: {
                            question: 'Who is the main target audience?',
                            correct: 'Grades 3-6 students and physical education teachers',
                            options: ['Grades 3-6 students and physical education teachers', 'Only the principal', 'Integrated health post cadres', 'Parents at home']
                        },
                        what: {
                            question: 'What is the best intervention now?',
                            correct: 'Six-step handwashing demonstration plus handwashing station installation',
                            options: ['Six-step handwashing demonstration plus handwashing station installation', 'Close school for one month', 'Give prophylactic antibiotics', 'Raid mobile vendors']
                        },
                        where: {
                            question: 'Where should it happen?',
                            correct: 'School yard before break time',
                            options: ['School yard before break time', 'Village hall', 'Primary health center', 'Each student home']
                        },
                        when: {
                            question: 'When is the critical timing?',
                            correct: 'Tomorrow morning, break transmission immediately',
                            options: ['Tomorrow morning, break transmission immediately', 'Wait for a holiday', 'Next month during assembly', 'Next school year']
                        },
                        why: {
                            question: 'Why is this intervention important?',
                            correct: 'To break droplet and direct-contact transmission',
                            options: ['To break droplet and direct-contact transmission', 'For school accreditation', 'To spend the soap stock', 'Just a routine reminder']
                        },
                        how: {
                            question: 'How should it be delivered?',
                            correct: 'Hands-on practice with soap and running water',
                            options: ['Hands-on practice with soap and running water', 'Only distribute brochures', 'Scold children who do not wash hands', 'Watch a one-hour class video']
                        }
                    },
                    resolution_success: {
                        text: 'The intervention succeeds. Children now routinely wash hands with soap, and school ARI transmission stops.'
                    },
                    resolution_fail: {
                        text: 'The intervention is insufficient. Droplet transmission continues at school, and more children become ill.'
                    }
                },
                makan_sembarangan: {
                    discovery: {
                        speaker: 'Nurse',
                        text: 'Doctor, this morning five patients came with similar symptoms: nausea, vomiting, and diarrhea after eating market snacks yesterday afternoon. It looks like food poisoning.',
                        choices: [
                            { text: 'Investigate the market and collect food samples.' },
                            { text: 'Treat the patients first, then report to the district health office.' },
                            { text: 'Do both: split the tasks with the nurse.' }
                        ]
                    },
                    investigate: {
                        text: 'You find a meatball vendor using borax. Samples are confiscated, and the vendor receives a firm warning plus food safety education.'
                    },
                    treat_report: {
                        text: 'Patients are managed with rehydration. The district health office sends a follow-up investigation team two days later.'
                    },
                    both: {
                        text: 'The team is coordinated: patients are treated, the vendor is identified, and the district health office temporarily closes the problematic stall. The case stops completely.'
                    }
                },
                air_minum_tercemar: {
                    discovery: {
                        speaker: 'Sanitarian',
                        text: 'Doctor, the RT 03 well water test is positive for E. coli above the safety threshold after last week flood. Eight families still use that well.',
                        choices: [
                            { text: 'Immediately announce the risk and ban use of the well.' },
                            { text: 'Distribute clean water and chlorine, then teach boiling water.' }
                        ]
                    },
                    immediate_ban: {
                        text: 'Residents are upset because there is no immediate water alternative. Some secretly keep using the well. Two diarrhea cases appear.'
                    },
                    distribute_treat: {
                        text: 'Residents receive clean water and learn chlorination. The well is disinfected after floodwater recedes. No new diarrhea cases appear.'
                    }
                },
                sampah_menumpuk: {
                    discovery: {
                        speaker: 'Larva-Monitoring Cadre',
                        text: 'Doctor, this week larva monitoring worsened. The larva-free index fell to 70%. Waste is piling up in RT 02 and RT 04, with standing water in tires and cans.',
                        choices: [
                            { text: 'Mobilize a PSN 3M Plus community cleanup.' },
                            { text: 'Coordinate with RT leaders for waste transport.' }
                        ]
                    },
                    kerja_bakti: {
                        description: 'Lead a community cleanup in two RT areas.'
                    },
                    waste_management: {
                        text: 'RT leaders agree to schedule routine waste transport twice a week. Waste begins to decrease.'
                    },
                    resolution_psn: {
                        text: 'The PSN community cleanup works. The larva-free index rises to 90%. Residents start draining water containers and burying unused items. Dengue risk drops significantly.'
                    }
                }
            },
            cultural: {
                kesurupan_massal: {
                    discovery: {
                        speaker: 'School Principal',
                        text: 'Doctor! Eight girls are all screaming or fainting and people say they are possessed. A religious leader has been called but has not arrived. Please help.',
                        choices: [
                            { text: 'Come directly and examine each student medically.' },
                            { text: 'Separate unaffected students first and isolate those who are affected.' }
                        ]
                    },
                    medical_exam: {
                        text: 'Medical examination finds no organic abnormality. You suspect mass psychogenic illness triggered by exam stress. After isolation, the students begin to calm down within 30 minutes.',
                        choices: [
                            { text: 'Explain the situation scientifically to teachers and parents.' },
                            { text: 'Respect local beliefs and involve the religious leader too.' }
                        ]
                    },
                    isolation_first: {
                        text: 'Students who are not affected are moved to another room. The affected students are examined one by one. Psychogenic spread stops.'
                    },
                    scientific_explanation: {
                        text: 'Some parents accept the explanation, while others still believe something supernatural is disturbing the school. Your reputation rises among teachers but drops among some residents.'
                    },
                    cultural_bridge: {
                        text: 'With a careful approach, you explain the medical side while respecting spiritual concerns. The religious leader supports your explanation. Residents appreciate the balanced approach.'
                    }
                },
                tolak_vaksin: {
                    discovery: {
                        speaker: 'Midwife',
                        text: 'Doctor, six families are refusing measles-rubella immunization. They say a preacher claimed the vaccine is forbidden and contains pork.',
                        choices: [
                            { text: 'Talk with the preacher and show the MUI fatwa.' },
                            { text: 'Visit each family and provide direct education.' },
                            { text: 'Hold a town hall with district health office and MUI speakers.' }
                        ]
                    },
                    engage_ustaz: {
                        text: 'After discussion and reviewing MUI Fatwa No. 04/2016, the preacher agrees to help clarify the issue. Four of six families finally accept immunization.'
                    },
                    door_to_door: {
                        description: 'Visit families who are refusing vaccination.'
                    },
                    resolution_door: {
                        text: 'With patient one-by-one explanations, three families accept immunization. Three still refuse. A longer-term trust-building approach is needed.'
                    },
                    town_hall: {
                        text: 'More than 50 residents attend the busy meeting. A district health doctor and MUI representative provide a comprehensive explanation. Five of six families finally agree.'
                    }
                },
                dukun_beranak: {
                    discovery: {
                        speaker: 'Midwife',
                        text: 'Doctor, Mrs. Siti is G4P3, 38 years old, with a previous delivery bleed. She wants to deliver with Mbah Parti, a traditional birth attendant, and says it was safe three times before. This pregnancy is high risk.',
                        choices: [
                            { text: 'Visit Mrs. Siti directly and explain the risk with data.' },
                            { text: 'Partner with Mbah Parti so the midwife can assist the delivery.' },
                            { text: 'Involve the husband and family in counseling.' }
                        ]
                    },
                    visit_patient: {
                        text: 'Mrs. Siti is defensive at first, but after you show maternal death data and the risk of recurrent bleeding, she starts to reconsider. Her husband is still worried about cost.',
                        choices: [
                            { text: 'Explain that JKN/BPJS can cover the delivery.' }
                        ]
                    },
                    partner_dukun: {
                        text: 'Mbah Parti turns out to be cooperative. She agrees to provide spiritual support while the midwife handles the delivery. Mrs. Siti feels respected.'
                    },
                    family_counsel: {
                        text: 'The husband and mother-in-law finally support delivery at the primary health center after hearing the risks. Mrs. Siti agrees.'
                    },
                    resolution_jkn: {
                        text: 'After learning the delivery is covered by BPJS, the husband agrees immediately. Mrs. Siti delivers safely at the primary health center with midwife support.'
                    }
                },
                jamu_berbahaya: {
                    discovery: {
                        speaker: 'Nurse',
                        text: 'Doctor, three controlled diabetes patients suddenly have high blood sugar. All of them drink pain-relief herbal tonic from Mrs. Warni, the mobile herbal seller.',
                        choices: [
                            { text: 'Take herbal samples and send them to the BPOM lab.' },
                            { text: 'Meet Mrs. Warni directly and warn her.' }
                        ]
                    },
                    lab_test: {
                        text: 'Lab results are positive for dexamethasone and piroxicam. You report to the district health office and BPOM. Mrs. Warni is coached and the herbal stock is confiscated.'
                    },
                    confront_seller: {
                        text: 'Mrs. Warni admits she got the formula from a herbal boss in the city. You make her promise to stop, but without lab proof it is hard to enforce firmly.'
                    }
                },
                kerokan_anak: {
                    discovery: {
                        speaker: 'Patient Mother',
                        text: 'Doctor, my child has had fever for three days. Grandma did coin scraping, but now the child is more fussy and the skin is red. What is happening?',
                        choices: [
                            { text: 'Examine the child and explain why coin scraping is dangerous for babies.' },
                            { text: 'Treat the fever first and educate the family gently.' }
                        ]
                    },
                    examine_educate: {
                        text: 'You explain that baby skin is very thin, and coin scraping can cause abrasions and infection. The mother understands, but the grandmother objects because it has always been done that way.',
                        choices: [
                            { text: 'Explain with an analogy the grandmother can understand.' }
                        ]
                    },
                    treat_first: {
                        text: 'You give paracetamol and treat the skin lesions. After the child improves, you gently explain that coin scraping is not suitable for babies.'
                    },
                    resolution_gentle: {
                        text: 'You compare baby skin to soft tofu that can be injured by scraping. The grandmother finally understands. The family is scheduled for follow-up.'
                    }
                }
            },
            environmental: {
                pestisida_pertanian: {
                    discovery: {
                        speaker: 'Farmer Group Leader',
                        text: 'Doctor! Mr. Udin and Mr. Cecep collapsed in the field after spraying pesticide without masks. There is foam around their mouths.',
                        choices: [
                            { text: 'Go to the site immediately with the emergency kit.' },
                            { text: 'Tell residents to bring them to the primary health center and prepare atropine.' }
                        ]
                    },
                    emergency_response: {
                        text: 'At the site, you decontaminate, give atropine, and stabilize both patients. They are referred to the hospital. You then collect data for investigation.',
                        choices: [
                            { text: 'Hold PPE education for the farmer group.' }
                        ]
                    },
                    clinic_prep: {
                        text: 'The patients arrive in 15 minutes. You are ready with antidote and stabilize both before referral.'
                    },
                    resolution_apd: {
                        text: 'Twenty-five farmers attend the PPE education session. You distribute masks and gloves from BOK funds. The farmer group promises to follow safety rules.'
                    }
                },
                asap_pembakaran: {
                    discovery: {
                        speaker: 'Nurse',
                        text: 'Doctor, ARI visits tripled over the last three days. Patients are short of breath and coughing. It seems linked to land-burning smoke from the neighboring subdistrict.',
                        choices: [
                            { text: 'Distribute N95 masks to vulnerable residents.' },
                            { text: 'Report to local government for enforcement action.' },
                            { text: 'Do both steps at once.' }
                        ]
                    },
                    mask_distribution: {
                        text: 'Masks are distributed to older adults, toddlers, and pregnant women. The primary health center prepares a dedicated area for severe ARI patients.'
                    },
                    report_gov: {
                        text: 'The local government receives the report. The environmental team goes to the site. The burning stops three days later, but the smoke continues for a week.'
                    },
                    both_action: {
                        text: 'The response is fast and comprehensive. Residents are protected and the burning is stopped. The health office head praises the primary health center initiative.'
                    }
                },
                gigitan_ular: {
                    discovery: {
                        speaker: 'Resident',
                        text: 'Doctor! Mr. Amin was bitten by a snake in the field. His leg is swelling and he feels dizzy. People want to suck out the venom. What should we do?',
                        choices: [
                            { text: 'Do not suck the wound. Immobilize the limb and bring him here immediately.' },
                            { text: 'Go to the site with antivenom and an emergency kit.' }
                        ]
                    },
                    correct_first_aid: {
                        text: 'Residents bring Mr. Amin with the leg immobilized. At the primary health center, you start fluids, give antihistamine, and stabilize him before hospital referral for antivenom.'
                    },
                    field_response: {
                        text: 'In the field, you ensure the leg is immobilized, place an IV line, and refer directly from the site. The fast response saves Mr. Amin life.'
                    }
                },
                leptospirosis_banjir: {
                    discovery: {
                        speaker: 'Nurse',
                        text: 'Doctor, after last week flood, four patients came with high fever, severe calf pain, and yellow eyes. All had floodwater exposure five to seven days ago.',
                        choices: [
                            { text: 'Suspect leptospirosis, treat, and report to the district health office.' },
                            { text: 'Run an epidemiologic investigation of flooded areas.' }
                        ]
                    },
                    treat_report: {
                        text: 'The patients receive doxycycline. A W2 report is sent to the district health office. The surveillance team follows up within two days.'
                    },
                    epi_investigation: {
                        text: 'You find a flooded area with many rats near the rice warehouse. You coordinate with environmental health for disinfection and rat-trap placement.'
                    }
                }
            },
            nutrition: {
                stunting_deteksi: {
                    discovery: {
                        speaker: 'Integrated Health Post Cadre',
                        text: 'Doctor, this month weighing found three toddlers below the red line on the growth card. Two were only in the yellow zone two months ago, and now they are red.',
                        choices: [
                            { text: 'Visit all three homes and complete a nutrition assessment.' },
                            { text: 'Start supplementary feeding.' },
                            { text: 'Do both: assessment and immediate supplementary feeding.' }
                        ]
                    },
                    home_assessment: {
                        description: 'Visit the homes of the three toddlers with stunting risk.'
                    },
                    pmt_program: {
                        text: 'Supplementary food with eggs, milk, and mung beans is distributed for one month. Two of three toddlers show weight gain at the next weighing.'
                    },
                    comprehensive: {
                        text: 'Assessment finds low diet diversity and poor hygiene. Supplementary feeding starts together with nutrition education for mothers. All three toddlers improve within two months.'
                    },
                    resolution_home: {
                        text: 'Findings: one poor family eats only rice and crackers, one young mother does not know proper complementary feeding, and one toddler has worms. Specific interventions begin.'
                    }
                },
                gizi_buruk_balita: {
                    discovery: {
                        speaker: 'Village Cadre',
                        text: 'Doctor, I visited Mr. Tarno family at the village edge. His two-year-old child has a swollen belly, swollen feet, reddish hair, and only eats rice with salt.',
                        choices: [
                            { text: 'Emergency. Bring the child to the primary health center now.' },
                            { text: 'Visit the home first and assess the family.' }
                        ]
                    },
                    emergency_care: {
                        text: 'Dede is brought to the primary health center. Weight-for-age is below -3 SD, consistent with severe malnutrition. You start F-75 protocol, therapeutic feeding, and prepare referral to the hospital Therapeutic Feeding Center.',
                        choices: [
                            { text: 'Refer to the hospital and coordinate PKH family assistance.' }
                        ]
                    },
                    home_first: {
                        text: 'At home, you find extreme poverty. The father has TB, the mother works irregular jobs, and Dede eats only rice and salt. You document the situation and bring Dede to the primary health center.'
                    },
                    resolution_referral: {
                        text: 'Dede is referred and receives intensive nutrition therapy. Coordination with the social affairs office activates PKH for Mr. Tarno family. Dede recovers within three months.'
                    }
                },
                anemia_remaja: {
                    discovery: {
                        speaker: 'Nutritionist',
                        text: 'Doctor, Hb screening at SMPN 2 found 32 of 80 girls below 12 g/dL. The lowest is 8.2 g/dL. They often feel dizzy and weak but think it is normal.',
                        choices: [
                            { text: 'Start weekly iron tablets and nutrition education.' },
                            { text: 'Educate teachers and parents about anemia risk.' }
                        ]
                    },
                    fe_program: {
                        description: 'Distribute iron tablets and provide education.'
                    },
                    parent_teacher: {
                        text: 'Fifty parents attend the meeting. They are shocked to learn about their children condition. Many promise to improve meals at home.'
                    },
                    resolution_fe: {
                        text: 'After three months of iron tablets and nutrition education, average Hb rises by 1.5 g/dL. Students report more energy and better concentration.'
                    }
                },
                mpasi_salah: {
                    discovery: {
                        speaker: 'Midwife',
                        text: 'Doctor, Mrs. Dina is 19 with her first child. She brought a three-month-old baby with diarrhea. The grandmother has given mashed banana since age two months, saying it keeps the baby full.',
                        choices: [
                            { text: 'Educate Mrs. Dina and the grandmother about exclusive breastfeeding.' },
                            { text: 'Treat diarrhea first, then educate at follow-up.' }
                        ]
                    },
                    educate_both: {
                        text: 'You explain that a three-month-old gut is not ready for solid food. The analogy lands with the grandmother. The baby returns to exclusive breastfeeding.'
                    },
                    treat_then_educate: {
                        text: 'Diarrhea is treated with ORS and zinc. At follow-up, you find the baby is still being given mashed banana. A more intensive approach is needed.',
                        choices: [
                            { text: 'Involve cadres for routine home visits.' }
                        ]
                    },
                    resolution_kader: {
                        text: 'Cadres visit Mrs. Dina once a week. Slowly, the grandmother begins to trust the advice. After one month, the baby is fully on exclusive breastfeeding.'
                    }
                }
            },
            mental_health: {
                depresi_pascabencana: {
                    discovery: {
                        speaker: 'Village Cadre',
                        text: 'Doctor, since last month landslide, Mr. Asep has become very quiet. He will not leave home or work in the field. His wife says he cries at night. Three other residents are similar.',
                        choices: [
                            { text: 'Visit Mr. Asep and screen for mental health problems.' },
                            { text: 'Hold a group counseling session for landslide survivors.' },
                            { text: 'Refer to a psychologist or psychiatrist at the district hospital.' }
                        ]
                    },
                    home_screening: {
                        text: 'You use SRQ-20. Mr. Asep scores 14 of 20, indicating a mental health problem. He cannot sleep and says rain brings back the sound of the landslide. You recognize PTSD symptoms.',
                        choices: [
                            { text: 'Provide Psychological First Aid and schedule follow-up.' },
                            { text: 'Refer to the hospital mental health clinic while providing light counseling support.' }
                        ]
                    },
                    group_counseling: {
                        text: 'Eight landslide survivors attend the group session. They share stories and cry together. Mr. Asep says he realizes he is not alone. Healing begins.'
                    },
                    referral: {
                        text: 'Mr. Asep refuses referral because he thinks it means he is crazy. Mental health stigma blocks care.',
                        choices: [
                            { text: 'Explain that depression is not madness; it is an illness that can be treated.' }
                        ]
                    },
                    resolution_pfa: {
                        text: 'With Psychological First Aid and weekly visits, Mr. Asep slowly improves. After two months, he returns to the fields and says he feels heard.'
                    },
                    resolution_rujuk: {
                        text: 'The psychiatrist prescribes low-dose sertraline. With medication plus counseling at the primary health center, Mr. Asep gradually improves over six weeks.'
                    },
                    resolution_destigma: {
                        text: 'You compare mental illness to a broken leg: both deserve medical care. Slowly, Mr. Asep agrees to go to the hospital. Treatment begins.'
                    }
                },
                psikotik_akut: {
                    discovery: {
                        speaker: 'Nurse',
                        text: 'Doctor, a 22-year-old man named Roni suddenly became violent at the market. He shouts that someone wants to kill him and throws things. Residents are afraid and want to tie him up.',
                        choices: [
                            { text: 'Go to the site and calm him with an empathic approach.' },
                            { text: 'Do not tie him. Ask residents to give space while I come with haloperidol.' },
                            { text: 'Contact the psychiatric or district hospital crisis team.' }
                        ]
                    },
                    calm_approach: {
                        text: 'You approach Roni slowly and introduce yourself as the doctor who is there to help. Slowly he stops shouting, but he remains frightened and says people want to kill him.',
                        choices: [
                            { text: 'Validate his feelings and gently invite him to the primary health center.' }
                        ]
                    },
                    medical_approach: {
                        text: 'Residents give him space. After family consent, you give haloperidol 5 mg IM. Roni calms within 30 minutes and is brought to the primary health center.',
                        choices: [
                            { text: 'Educate the family about schizophrenia and treatment adherence.' }
                        ]
                    },
                    crisis_team: {
                        text: 'The psychiatric crisis team arrives in two hours. While waiting, residents tie Roni to a pole. You ask them to release him because he is sick, not a criminal.'
                    },
                    resolution_empathic: {
                        text: 'Roni agrees to go to the primary health center. His family arrives and reveals he stopped medication three months ago because it made him sleepy. You educate about adherence, adjust the dose, and refer him with family support.'
                    },
                    resolution_family_edu: {
                        text: 'Roni family is surprised that this is not possession. You explain that schizophrenia is a brain illness that can be controlled with medication. The family promises to support regular treatment.'
                    }
                },
                bunuh_diri_remaja: {
                    discovery: {
                        speaker: 'Patient Mother',
                        text: 'Doctor, my daughter Dini, 16 years old, drank insecticide. She is vomiting and has abdominal pain. I found messages on her phone showing her friends insulted her.',
                        choices: [
                            { text: 'Immediately manage poisoning: gastric decontamination and atropine as indicated.' },
                            { text: 'Stabilize first, then refer directly to the hospital emergency unit.' }
                        ]
                    },
                    emergency_treatment: {
                        text: 'You perform decontamination and give the indicated antidote. Dini stabilizes. After her physical condition is safe, you sit with her and invite her to tell her story.',
                        choices: [
                            { text: 'Perform suicide risk assessment and safety planning.' }
                        ]
                    },
                    immediate_referral: {
                        text: 'Dini is referred to the hospital emergency unit. The hospital doctor manages the poisoning. You accompany the family and contact a child psychiatrist.'
                    },
                    risk_assessment: {
                        text: 'Dini cries because classmates uploaded an embarrassing photo and everyone laughed. You use C-SSRS and assess high suicide risk, requiring admission.',
                        choices: [
                            { text: 'Refer to the hospital with psychiatric support and parent education.' },
                            { text: 'Create a safety plan and involve the school counselor.' }
                        ]
                    },
                    resolution_comprehensive: {
                        text: 'Dini is admitted for five days. The psychiatrist diagnoses a severe depressive episode. After discharge, you coordinate with the school to prevent bullying. The family becomes more attentive.'
                    },
                    resolution_school: {
                        text: 'A safety plan is built with Dini and her parents. The school counselor handles the bullying perpetrators. Dini slowly returns to school with support, and you schedule weekly follow-up.'
                    }
                }
            },
            adolescent: {
                anemia_remaja: {
                    discovery: {
                        speaker: 'Midwife',
                        text: 'Doctor, Hb screening at SMP Sukamaju is alarming: 40% of girls in grades 7-9 are anemic. Many are pale, tired, and have trouble concentrating. Ani is worst with Hb 7.2.',
                        choices: [
                            { text: 'Distribute iron tablets and teach iron-rich nutrition.' },
                            { text: 'Hold a youth-friendly health services session.' },
                            { text: 'Investigate causes through group interviews about eating patterns.' }
                        ]
                    },
                    iron_supplement: {
                        text: 'Weekly iron tablets are distributed according to the government program. Some students refuse because they fear nausea or weight gain. Additional education is needed.',
                        choices: [
                            { text: 'Explain the correct way to take iron tablets and address diet myths.' }
                        ]
                    },
                    yfhs_session: {
                        text: 'A YFHS session is held in the school health room. The atmosphere is relaxed, and adolescents can ask questions without judgment. Topics include menstruation, nutrition, anemia, and body image. Enthusiasm is high.',
                        choices: [
                            { text: 'Form peer counselors from selected students.' }
                        ]
                    },
                    investigate_diet: {
                        text: 'Group interviews reveal that many students skip breakfast and eat only instant noodles because of misleading diet trends from social media.',
                        choices: [
                            { text: 'Create engaging education content: healthy diet versus dangerous diet.' }
                        ]
                    },
                    resolution_edu: {
                        text: 'Practical tips work: take iron tablets after dinner with citrus water to reduce nausea. Adherence rises from 30 percent to 75 percent. After three months, average Hb rises by 1.8 g/dL.'
                    },
                    resolution_peer: {
                        text: 'Five students become peer counselors and are trained in adolescent nutrition and reproductive health. The program continues, and anemia falls from 40 percent to 15 percent in six months.'
                    },
                    resolution_content: {
                        text: 'The "Healthy Diet vs Dangerous Diet" infographic spreads through the student chat group. Students start eating breakfast and choosing iron-rich foods.'
                    }
                },
                teen_pregnancy: {
                    discovery: {
                        speaker: 'Midwife',
                        text: 'Doctor, I received a referral from the integrated health post. Rina is 15, a junior-high student, and 20 weeks pregnant. She hid it out of fear. Her parents are angry and her father wants to force marriage.',
                        choices: [
                            { text: 'Prioritize immediate ANC and family counseling.' },
                            { text: 'Involve child protection; she is underage.' },
                            { text: 'Use a family-based approach while respecting local culture.' }
                        ]
                    },
                    anc_counseling: {
                        text: 'You perform the first ANC visit. Rina has low body weight and Hb 9.5, with high risk because of young age. She cries and says she wants to stay in school, while her father insists on marriage.',
                        choices: [
                            { text: 'Explain the medical risks of adolescent pregnancy and child marriage.' }
                        ]
                    },
                    child_protection: {
                        text: 'You contact the women and child protection unit. The team comes and mediates with the family. The marriage is delayed, and Rina receives psychological support.'
                    },
                    cultural_approach: {
                        text: 'With a cultural approach, you invite a religious leader to talk with the family. He helps mediate and says marriage requires readiness, not pressure. The family begins to open up to alternatives.',
                        choices: [
                            { text: 'Suggest that Rina continue school while attending routine pregnancy checks.' }
                        ]
                    },
                    resolution_medical: {
                        text: 'The data moves the family: mothers under 17 face roughly double the mortality risk. Rina father agrees to delay marriage. Rina attends routine checks at the Pustu and receives iron supplementation.'
                    },
                    resolution_school: {
                        text: 'With teacher and family support, Rina continues school. ANC continues at the Pustu. After safe delivery, an equivalency education program becomes an option.'
                    }
                },
                napza_remaja: {
                    discovery: {
                        speaker: 'RT Leader',
                        text: 'Doctor, last night residents caught four high-school teens inhaling glue at the night-watch post. Their eyes were red and their speech was confused. The RT wants to expel them.',
                        choices: [
                            { text: 'Do not punish them; this is a health problem. Talk to them calmly.' },
                            { text: 'Check their health and report to BNN or the school.' },
                            { text: 'Hold substance-misuse education for all village adolescents.' }
                        ]
                    },
                    empathic_approach: {
                        text: 'You speak with the four adolescents one by one. Budi, 17, cries because his father works away, his mother is busy in the field, and friends invited him to inhale glue out of boredom.',
                        choices: [
                            { text: 'Connect them with positive activities such as youth group and sports.' },
                            { text: 'Provide motivational counseling and invite them to become anti-drug cadres.' }
                        ]
                    },
                    medical_report: {
                        text: 'Examination shows nasal mucosa irritation and mild cognitive impairment in two adolescents. BNN coordination is slow. The school responds with suspension, which worsens the situation.'
                    },
                    community_education: {
                        text: 'Thirty adolescents and parents attend education. You show images of brain damage from inhalants. The shock effect is strong, but follow-up is needed for sustainability.',
                        choices: [
                            { text: 'Form a Clean Youth Team as an ongoing program.' }
                        ]
                    },
                    resolution_positive: {
                        text: 'Budi and his friends start joining youth group and afternoon football regularly. Three months later, there are no new substance-misuse reports.'
                    },
                    resolution_peer_kader: {
                        text: 'Budi becomes the most vocal anti-drug cadre at school. His personal experience becomes the strongest education tool.'
                    },
                    resolution_program: {
                        text: 'The Clean Youth Team is active every week. They create anti-drug social media content that becomes popular in neighboring villages. The subdistrict adopts the program.'
                    }
                }
            },
            food_safety: {
                makan_sembarangan: {
                    discovery: {
                        speaker: 'Nurse',
                        text: 'Doctor, this morning twelve people arrived with the same symptoms: vomiting, diarrhea, and abdominal cramps. All ate at Mrs. Haji wedding feast last night. Some are severely dehydrated.',
                        choices: [
                            { text: 'This is an outbreak. Activate W1-W2, manage dehydration, and investigate the food.' },
                            { text: 'Treat patients first and report after everyone is stable.' }
                        ]
                    },
                    investigation: {
                        text: 'The investigation found boxed rice with fried chicken, chili sauce, and iced tea. The chicken was cooked in the morning, then kept for 12 hours without cooling at 32 C. The lab sample was positive for Staphylococcus aureus.',
                        choices: [
                            { text: 'Educate the caterer on food safety and report to the district health office.' }
                        ]
                    },
                    treat_first: {
                        text: 'All patients receive oral or IV rehydration. Two older adults need admission. An eight-month-old baby is also affected and is now critical.',
                        choices: [
                            { text: 'Refer the baby immediately and investigate the source.' }
                        ]
                    },
                    resolution_edu: {
                        text: 'The W1 report is sent within 24 hours. The catering team is reprimanded and coached. You hold food safety training for ten village caterers: cook-to-serve within four hours, or keep food below 5 C.'
                    },
                    resolution_rujuk_bayi: {
                        text: 'The baby is referred in time. After three days in the hospital, the condition improves. The outbreak is reported: 30 total cases, zero deaths. The district health office comes down for food safety coaching.'
                    }
                },
                formalin_tahu: {
                    discovery: {
                        speaker: 'Sanitarian',
                        text: 'Doctor, the market rapid test found tofu from Mr. Soleh positive for formalin. The test turned deep purple. The vendor says he bought it from a city factory and did not know.',
                        choices: [
                            { text: 'Withdraw the product, educate vendors, and report to BPOM.' },
                            { text: 'Trace the supply chain to find where the tofu is produced.' }
                        ]
                    },
                    withdrawal: {
                        text: 'The tofu is withdrawn, and residents are taught the warning signs: formalin tofu is firm, does not crumble easily, and lasts for days. The vendor is asked to change supplier. A report is sent to BPOM.'
                    },
                    trace_supply: {
                        text: 'The investigation shows the tofu came from a home factory in the district town. They added formalin so it would last five days without refrigeration. BPOM and police intervene, and the factory is sealed.'
                    }
                },
                jajan_anak_sekolah: {
                    discovery: {
                        speaker: 'School Health Teacher',
                        text: 'Doctor, many children often have stomach pain after buying snacks outside school. The red syrup is very bright and the crackers have intense colors.',
                        choices: [
                            { text: 'Bring test kits to school and test snacks in front of the children.' },
                            { text: 'Launch a healthy canteen program at the school.' }
                        ]
                    },
                    live_testing: {
                        text: 'In front of 200 students, you test the snacks: the syrup is positive for Rhodamine B, and the crackers are positive for metanil yellow. The children are shocked. The education effect is powerful.',
                        choices: [
                            { text: 'Coach vendors and create a safe-snack list.' }
                        ]
                    },
                    healthy_canteen: {
                        text: 'The healthy canteen launches with nutritious menus: yellow rice, boiled eggs, and sliced fruit. The price stays affordable at Rp 5,000. The children are excited.'
                    },
                    resolution_vendor: {
                        text: 'Vendors are coached, and cooperative vendors receive a "Primary Health Center Verified Safe Snack" sticker. Their sales rise 40 percent. The reward system works.'
                    }
                }
            },
            traditional_health: {
                jamu_berbahaya: {
                    discovery: {
                        speaker: 'Cadre',
                        text: 'Doctor, Mbah Siti, age 70, came in with a swollen face, blood sugar 450, and blood pressure 190/110. She has been drinking a mobile herbal pain tonic for six months because it makes her body feel light.',
                        choices: [
                            { text: 'Suspect steroid adulteration. Check for cushingoid signs and stabilize her.' },
                            { text: 'Seize herbal samples and send them to BPOM for analysis.' }
                        ]
                    },
                    examine: {
                        text: 'The cushingoid signs are clear: moon face, buffalo hump, and striae. Her blood sugar is uncontrolled because of steroid effects. Mbah Siti needs slow dexamethasone tapering to avoid withdrawal syndrome.',
                        choices: [
                            { text: 'Admit her, taper the steroid, and educate her about adulterated herbal tonics.' }
                        ]
                    },
                    lab_test: {
                        text: 'The BPOM lab result shows the herbal tonic contains dexamethasone 0.5 mg, piroxicam 10 mg, and CTM. The mobile herbal seller bought it from an unlabeled "white powder supplier."',
                        choices: [
                            { text: 'Report to police and BPOM, then educate residents.' }
                        ]
                    },
                    resolution_medical: {
                        text: 'Mbah Siti is admitted for one week. The steroid is tapered slowly. After two months, her blood sugar improves. She says she is done buying random herbal tonics.'
                    },
                    resolution_enforcement: {
                        text: 'Police arrest the steroid powder supplier. Three mobile herbal sellers who sold adulterated tonics are coached. You hold education: safe herbal products have BPOM permits and avoid exaggerated claims.'
                    }
                },
                dukun_beranak: {
                    discovery: {
                        speaker: 'Midwife',
                        text: 'Doctor, Mrs. Sari delivered with a traditional birth attendant last night. Now she has severe bleeding and has changed five cloths. The placenta has not come out.',
                        choices: [
                            { text: 'Emergency. Start RL infusion, go to the site, and prepare manual placenta management.' },
                            { text: 'Ask the family to bring her to the primary health center or hospital immediately and prepare uterotonics.' }
                        ]
                    },
                    emergency_response: {
                        text: 'You arrive at Mrs. Sari house. The placenta is retained. With manual placenta management, the placenta is removed successfully and bleeding decreases. She receives oxytocin 10 IU IM and misoprostol.',
                        choices: [
                            { text: 'Stabilize her, refer for observation, and educate the family about safe delivery.' }
                        ]
                    },
                    refer_immediate: {
                        text: 'The family is late bringing Mrs. Sari in after one hour on the road. At the hospital, her Hb is already 5 g/dL. She needs emergency transfusion and nearly does not survive.'
                    },
                    resolution_save: {
                        text: 'Mrs. Sari survives. You mediate with the traditional birth attendant: she can provide prayer and massage support, while delivery must be handled by the midwife. A midwife-traditional attendant partnership begins.'
                    }
                },
                herbal_interaksi_obat: {
                    discovery: {
                        speaker: 'Nurse',
                        text: 'Doctor, Mr. Hasan, 65, with hypertension, fainted in the field. Blood pressure is 80/50. He took amlodipine 10 mg, then cat-whiskers tea and five raw garlic cloves to lower it faster.',
                        choices: [
                            { text: 'Start IV fluids, elevate the legs, and monitor blood pressure. This is iatrogenic hypotension.' },
                            { text: 'Stabilize the patient and investigate whether other residents combine herbs with medicine.' }
                        ]
                    },
                    treat_hypotension: {
                        text: 'Mr. Hasan improves after 500 ml RL. Blood pressure rises to 110/70. You explain that cat-whiskers tea and garlic already lower blood pressure, and adding amlodipine made the drop excessive.',
                        choices: [
                            { text: 'Create an herb-drug interaction guide for Prolanis.' }
                        ]
                    },
                    community_screen: {
                        text: 'Prolanis screening finds that 12 of 25 diabetes or hypertension participants also take herbs without consultation. Three people combine bitter melon with metformin, raising hypoglycemia risk.',
                        choices: [
                            { text: 'Hold an herb-drug interaction education session for all participants.' }
                        ]
                    },
                    resolution_guide: {
                        text: 'You make a poster: "Herbs Are Okay, But Ask First!" It lists plants that interact with medicines and is posted in TOGA, Prolanis, and local shops. Residents start consulting before mixing herbs and drugs.'
                    },
                    resolution_session: {
                        text: 'The interactive session is a big success. Prolanis participants are surprised that garlic plus hypertension medicine can be dangerous. They agree to consult first before taking herbs.'
                    }
                }
            }
        },
        inspectorDossiers: {
            rtk: {
                eyebrow: 'Maternal Hub',
                title: 'RTK is the final buffer before obstetric referral moves.',
                summary: 'This node is used to lock triage, the emergency bag, blood donors, and family negotiation before a high-risk mother moves to the hospital.',
                focusPoints: [
                    'Do not let a high-risk mother return home once danger signs are present.',
                    'Documents, JKN, blood donors, and the night route must be ready before active contractions.',
                    'Use the RTK as a family briefing room so referral is not delayed by repeated negotiation.'
                ],
                metrics: [
                    { label: 'Loop', value: 'Triage -> Emergency Bag -> Transport' },
                    { label: 'Pressure', value: 'Repeat C-section / preeclampsia / hesitant family' },
                    { label: 'Bridge', value: 'Home -> RTK -> Hospital' }
                ],
                caseHint: 'The linked cases below are useful for testing maternal referral delay and family decision dilemmas.'
            },
            padepokan_dukun: {
                eyebrow: 'Culture + Evidence',
                title: 'The healing house is a mediation point, not just a source of problems.',
                summary: 'This node matters when beliefs, taboos, and cultural authority decide whether residents accept a midwife, medicine, or referral.',
                focusPoints: [
                    'Read the myths and taboos that make danger signs look normal or supernatural.',
                    'Separate safe supportive herbs from mixtures that delay core treatment and referral.',
                    'Build a midwife-healer partnership so residents do not receive two conflicting messages.'
                ],
                metrics: [
                    { label: 'Loop', value: 'Ritual -> Herbs -> Mediation' },
                    { label: 'Pressure', value: 'Myths / taboos / referral delay' },
                    { label: 'Bridge', value: 'Tradition -> Midwife / Hospital' }
                ],
                caseHint: 'The linked cases below fit tradition-versus-evidence conflict, especially when residents go to cultural authority first.'
            }
        },
        buildingScenes: {
            posyandu: {
                title: 'Sukamaju Village Integrated Health Post (Posyandu)',
                subtitle: 'Integrated Service Post | Five-Table Workflow',
                ambience: 'A covered open-air space with neatly arranged desks, mothers and toddlers queuing for services.',
                stations: {
                    meja1: {
                        label: 'Desk 1: Registration',
                        description: 'Cadres record mother and child identities and check visit schedules.',
                        actions: {
                            register: { label: 'Check Attendance List' },
                            review_kms: { label: 'Review Previous Growth Card' }
                        },
                        findings: [
                            { text: 'Three children have missed the integrated health post for the last two months.' },
                            { text: 'Most growth cards are filled in completely.' }
                        ]
                    },
                    meja2: {
                        label: 'Desk 2: Weighing',
                        description: 'Weigh the child and watch for growth trends.',
                        actions: {
                            weigh_child: { label: 'Weigh the Child' },
                            check_height: { label: 'Measure Height' }
                        },
                        findings: [
                            { text: 'Fadli (14 months) dropped from 8.2 kg to 7.8 kg | two consecutive no-gain visits.' },
                            { text: 'Siti (9 months) is within the normal range and rising steadily.' }
                        ]
                    },
                    meja3: {
                        label: 'Desk 3: Growth Card Recording',
                        description: 'Plot weighing results onto the child growth card.',
                        actions: {
                            plot_kms: { label: 'Plot on Growth Card' },
                            detect_pattern: { label: 'Analyze Growth Trend' }
                        },
                        findings: [
                            { text: 'A two-time no-gain pattern was detected in two children | stunting risk.' },
                            { text: 'Eighty-five percent of children remain on the green growth track.' }
                        ]
                    },
                    meja4: {
                        label: 'Desk 4: Education',
                        description: 'Health education for mothers on nutrition, breastfeeding, and complementary feeding.',
                        actions: {
                            counsel_asi: { label: 'Exclusive Breastfeeding Counseling' },
                            demo_mpasi: { label: 'Complementary Feeding Demo' },
                            quiz: { label: 'Healthy Nutrition Quiz' }
                        },
                        findings: [
                            { text: 'Mrs. Maryam says her child has been given bananas since three months old.' },
                            { text: 'Mothers are enthusiastic during the mung bean porridge demo.' }
                        ]
                    },
                    meja5: {
                        label: 'Desk 5: Health Services',
                        description: 'Immunization, vitamin A, deworming, and supplements.',
                        actions: {
                            immunize: { label: 'Provide Scheduled Immunization' },
                            vit_a: { label: 'Give Vitamin A' },
                            obat_cacing: { label: 'Mass Deworming' }
                        },
                        findings: [
                            { text: 'Budi (18 months) still has not received the second MR vaccine because his mother refuses it.' },
                            { text: 'Vitamin A stock is sufficient for this month.' }
                        ]
                    }
                },
                npcs: {
                    kader_ayu: {
                        name: 'Cadre Ayu',
                        role: 'Integrated Health Post Cadre',
                        greeting: 'Good morning, Doc. Fifteen toddlers are here today and a few need special attention.',
                        dialogs: {
                            auto: {
                                text: 'Doc, Fadli has been losing weight for two months. His mother says he only gets rice with sweet soy sauce.',
                                choices: [
                                    { text: 'Let us examine him now.' },
                                    { text: 'Log it and schedule a home visit.' }
                                ]
                            },
                            meja5_done: {
                                text: 'Doc, Mrs. Rina refused the MR vaccine. She says a WhatsApp message told her it causes autism.',
                                choices: [
                                    { text: 'Call her over and I will explain it directly.' },
                                    { text: 'Let us prepare a group education session.' }
                                ]
                            }
                        }
                    },
                    ibu_maryam: {
                        name: 'Mrs. Maryam',
                        role: 'Toddler\'s Mother',
                        greeting: 'Peace be upon you, Doc. I came to weigh little Dede.',
                        dialogs: {
                            meja4_done: {
                                text: 'So complementary feeding really starts at six months, Doc? I started giving bananas at three months.',
                                choices: [
                                    { text: 'Yes, before six months a baby\'s digestive system is not ready.' },
                                    { text: 'Hold that thought, ma\'am. We will discuss it in a moment.' }
                                ]
                            }
                        }
                    }
                },
                completionReward: {
                    message: 'Today\'s integrated health post session is complete. Every toddler has been covered.'
                }
            },
            school: {
                title: 'Sukamaju State Elementary School 1',
                subtitle: 'School Health Unit | Screening and Education',
                ambience: 'A busy schoolyard with children playing, classroom chatter, and notice boards lining the walls.',
                stations: {
                    uks: {
                        label: 'School Clinic',
                        description: 'The school health room with first aid supplies, a scale, blood pressure cuff, and an exam bed.',
                        actions: {
                            screening: { label: 'Student Health Screening' },
                            check_anemia: { label: 'Screen Adolescent Girls for Anemia' },
                            deworm: { label: 'Provide Deworming Medicine' }
                        },
                        findings: [
                            { text: 'Three third-grade students have had fever and a red rash for the past two days.' },
                            { text: 'Forty percent of fifth- and sixth-grade girls look pale with anemic conjunctivae.' },
                            { text: 'The first aid box needs refilling because the cotton is gone.' }
                        ]
                    },
                    kelas: {
                        label: 'Classrooms and Toilets',
                        description: 'Teaching rooms and sanitation facilities that need a quick hygiene inspection.',
                        actions: {
                            inspect_toilet: { label: 'Inspect Toilets and Soap Supply' },
                            cuci_tangan_demo: { label: 'Demonstrate the Six Handwashing Steps' },
                            check_ventilation: { label: 'Check Classroom Ventilation' }
                        },
                        findings: [
                            { text: 'The toilets have no soap. Only one out of four has hand soap available.' },
                            { text: 'Class 2A has heavy curtains blocking ventilation, leaving the room stuffy.' },
                            { text: 'The six-step handwashing poster is faded and needs to be replaced.' }
                        ]
                    },
                    kantin: {
                        label: 'School Canteen',
                        description: 'Snack stalls inside the school grounds where food safety needs to be checked.',
                        actions: {
                            food_inspect: { label: 'Inspect Food Safety' },
                            check_water: { label: 'Test the School Drinking Water' },
                            healthy_menu: { label: 'Design a Healthy Snack Menu' }
                        },
                        findings: [
                            { text: 'The syrup ice uses textile dye and the color is unnaturally bright.' },
                            { text: 'Food is left uncovered and flies keep landing on it.' },
                            { text: 'The canteen keeper is willing to join food safety training.' }
                        ]
                    },
                    lapangan_sekolah: {
                        label: 'Field and Courtyard',
                        description: 'Children play here, so puddles, trash, and mosquito breeding sites need attention.',
                        actions: {
                            jentik_check: { label: 'Survey Larvae in Standing Water' },
                            clean_trash: { label: 'Coordinate a Community Cleanup' }
                        },
                        findings: [
                            { text: 'Used tires behind the storage shed are full of Aedes larvae.' },
                            { text: 'The yard is clean because the morning duty students already swept it.' }
                        ]
                    }
                },
                npcs: {
                    guru_sri: {
                        name: 'Mrs. Sri',
                        role: 'Teacher and School Health Coordinator',
                        greeting: 'Doctor, thank goodness you came. Three third-grade children have fever and a red rash.',
                        dialogs: {
                            auto: {
                                text: 'Doctor, could this be measles? I am worried it will spread to the other children. Last month some parents still refused the MR vaccine.',
                                choices: [
                                    { text: 'I will examine the children first.' },
                                    { text: 'Please gather the vaccination data for every student.' }
                                ]
                            }
                        }
                    },
                    penjaga_kantin: {
                        name: 'Mrs. Warung',
                        role: 'Canteen Keeper',
                        greeting: 'What would you like to buy, Doctor? The syrup ice is nice and cold.',
                        dialogs: {
                            kantin_inspected: {
                                text: 'Doctor, I use that dye because it is cheap. If I switch to proper food coloring, my costs will go up.',
                                choices: [
                                    { text: 'Textile dye is dangerous. I will help you find a safe alternative.' },
                                    { text: 'It has to be replaced immediately because it puts the children at risk.' }
                                ]
                            }
                        }
                    }
                },
                completionReward: {
                    message: 'The school inspection is complete and the report has been sent to the district health office.'
                }
            },
            farm: {
                title: 'Community Farmland',
                subtitle: 'Occupational and Environmental Health | Field Inspection',
                ambience: 'Green rice fields stretch into the distance while farmers work among the paddies and the smell of wet soil rises after the rain.',
                stations: {
                    sawah: {
                        label: 'Rice Field Area',
                        description: 'Flooded rice fields after the rain where farmers are still working without proper protective equipment.',
                        actions: {
                            inspect_apd: { label: 'Inspect Farmer PPE Use' },
                            water_test: { label: 'Test Field Water' },
                            counsel_boots: { label: 'Counsel on Wearing Rubber Boots' }
                        },
                        findings: [
                            { text: 'Five of eight farmers are working barefoot in the mud.' },
                            { text: 'The field water tested positive for leptospira after last week\'s flood.' },
                            { text: 'Mr. Slamet already owns rubber boots but says they are uncomfortable.' }
                        ]
                    },
                    gudang: {
                        label: 'Pesticide and Grain Storage',
                        description: 'A mixed-use storage shed where pesticides, rice sacks, and rat droppings are found together.',
                        actions: {
                            inspect_storage: { label: 'Inspect Pesticide Storage' },
                            rat_check: { label: 'Check for Rat Activity' },
                            organize: { label: 'Help Separate Storage Areas' }
                        },
                        findings: [
                            { text: 'Open pesticide bottles are sitting right beside sacks of rice.' },
                            { text: 'Rat droppings are scattered throughout the grain shed, creating leptospirosis risk.' },
                            { text: 'Rat holes are visible in three corners of the shed.' }
                        ]
                    },
                    kandang: {
                        label: 'Livestock Pen',
                        description: 'The chicken and cattle sheds need basic hygiene and zoonosis review.',
                        actions: {
                            animal_health: { label: 'Check Animal Health' },
                            inspect_hygiene: { label: 'Inspect Pen Hygiene' },
                            counsel_zoonosis: { label: 'Teach Zoonotic Disease Risks' }
                        },
                        findings: [
                            { text: 'Two chickens were found dead suddenly this morning, raising concern for avian influenza.' },
                            { text: 'The livestock pen is less than five meters from a household well.' },
                            { text: 'Mr. Joko\'s cow looks healthy and has already been vaccinated against anthrax.' }
                        ]
                    },
                    tepi_sungai: {
                        label: 'Riverbank',
                        description: 'Residents still use the river for sanitation while children play there barefoot after floods.',
                        actions: {
                            water_quality: { label: 'Test River Water Quality' },
                            survey_mck: { label: 'Survey River Sanitation Behavior' },
                            educate_leptospira: { label: 'Educate About Leptospirosis' }
                        },
                        findings: [
                            { text: 'Children are playing in muddy post-flood water with open wounds on their feet.' },
                            { text: 'Three residents still defecate directly into the river.' },
                            { text: 'The downstream drinking water source lies below the same stretch of river used for sanitation.' }
                        ]
                    }
                },
                npcs: {
                    pak_tani: {
                        name: 'Mr. Slamet',
                        role: 'Farming Group Leader',
                        greeting: 'Doctor, it is unusual to see you in the fields. Yesterday another farmer was poisoned by pesticides.',
                        dialogs: {
                            auto: {
                                text: 'Doctor, Jajang sprayed pesticides wearing only ordinary clothes. That night he started vomiting. He says his grandfather always worked that way too.',
                                choices: [
                                    { text: 'Take me to Jajang so I can assess him.' },
                                    { text: 'Gather all the farmers. We are setting shared PPE rules.' }
                                ]
                            }
                        }
                    },
                    bu_dewi: {
                        name: 'Mrs. Dewi',
                        role: 'Riverbank Resident',
                        greeting: 'Doctor, my child has had a high fever for three days and cut a foot on a river stone.',
                        dialogs: {
                            tepi_sungai_visited: {
                                text: 'My child plays in the river all the time, especially after rain when the current is stronger. I cannot really stop it because all the other children are there too.',
                                choices: [
                                    { text: 'Fever, open wounds, and floodwater exposure make leptospirosis a real concern.' },
                                    { text: 'Let me examine your child at the sub-clinic first.' }
                                ]
                            }
                        }
                    }
                },
                completionReward: {
                    message: 'The field inspection is complete and PPE recommendations have been sent to the farming group.'
                }
            },
            pustu: {
                title: 'Cilengkrang Hamlet Sub-Clinic',
                subtitle: 'Satellite Primary Care Post | Maternal and Basic Care Services',
                ambience: 'A simple one-room outpost with an exam desk, infant scale, small medicine cabinet, and mothers waiting with their toddlers.',
                stations: {
                    meja_periksa: {
                        label: 'ANC Exam Desk',
                        description: 'The main antenatal care station with a blood pressure cuff, Doppler, and MUAC tape.',
                        actions: {
                            anc_checkup: { label: 'Perform ANC Checkup (K1-K4)' },
                            lila_measure: { label: 'Measure Maternal MUAC' },
                            risk_scoring: { label: 'Score Pregnancy Risk' }
                        },
                        findings: [
                            { text: 'Mrs. Yanti (G2P1, 34 weeks) has a MUAC of 21 cm and chronic energy deficiency with no K3 visit yet.' },
                            { text: 'Mrs. Ningsih (28 weeks) has normal blood pressure, a positive fetal heart rate, and growth appropriate for gestational age.' }
                        ]
                    },
                    pojok_kb: {
                        label: 'Family Planning Counseling Corner',
                        description: 'A counseling area with contraceptive teaching aids, leaflets, and stock for family planning methods.',
                        actions: {
                            kb_counsel: { label: 'Counsel on Family Planning Methods' },
                            kb_service: { label: 'Provide Family Planning Service (Injection or Pills)' },
                            kb_stock: { label: 'Check Contraceptive Stock' }
                        },
                        findings: [
                            { text: 'Only five vials of the three-month injectable contraceptive remain and a pharmacy request is needed.' },
                            { text: 'Active contraceptive uptake in the hamlet is 68 percent against a target of 75 percent.' }
                        ]
                    },
                    lemari_obat: {
                        label: 'Medicine Cabinet and First Aid',
                        description: 'Basic medicines such as paracetamol, amoxicillin, oral rehydration salts, and vitamins are stored here.',
                        actions: {
                            stock_check: { label: 'Inventory the Medicines' },
                            expiry_check: { label: 'Check for Expired Medicines' }
                        },
                        findings: [
                            { text: 'Amoxicillin syrup expired two months ago and is still sitting on the shelf.' },
                            { text: 'Oral rehydration salts and zinc stock are sufficient for the next three months.' }
                        ]
                    },
                    ruang_tunggu: {
                        label: 'Waiting and Education Area',
                        description: 'The patient waiting area with maternal health posters, although the education television is broken.',
                        actions: {
                            health_edu: { label: 'Educate About Pregnancy Danger Signs' },
                            update_poster: { label: 'Refresh Maternal Health Posters' }
                        },
                        findings: [
                            { text: 'The birth planning and complication prevention poster has faded.' },
                            { text: 'The mothers are eager to ask about danger signs in pregnancy.' }
                        ]
                    }
                },
                npcs: {
                    bidan_ema: {
                        name: 'Midwife Ema',
                        role: 'Village Midwife',
                        greeting: 'Good morning, Doctor. Today we have eight pregnant women and five family planning clients. Mrs. Yanti needs special attention.',
                        dialogs: {
                            auto: {
                                text: 'Doctor, Mrs. Yanti is already 34 weeks pregnant but she has never completed her K3 visit. Her MUAC is only 21 cm. I am worried about maternal undernutrition and low birth weight.',
                                choices: [
                                    { text: 'Let us examine her now and calculate her risk score.' },
                                    { text: 'Log her for a home visit tomorrow.' }
                                ]
                            },
                            lemari_obat_done: {
                                text: 'Doctor, I just realized there is expired amoxicillin syrup here. I am sorry, I do not check expiry dates often enough.',
                                choices: [
                                    { text: 'It is okay. Let us create a monthly checking SOP together.' },
                                    { text: 'Separate it immediately so it cannot be dispensed by mistake.' }
                                ]
                            }
                        }
                    }
                },
                completionReward: {
                    message: 'The sub-clinic supervision is complete and the findings have been reported to the main clinic.'
                }
            },
            kb_post: {
                title: 'Sukamaju Family Planning Post',
                subtitle: 'Family Planning and Reproductive Health Services',
                ambience: 'A clean small room inside a cadre house with family planning posters and contraceptive teaching tools arranged neatly.',
                stations: {
                    konseling: {
                        label: 'Counseling Desk',
                        description: 'A private counseling area where all family planning methods can be discussed with visual aids.',
                        actions: {
                            counsel_method: { label: 'Counsel on Family Planning Methods' },
                            couple_counsel: { label: 'Counsel the Couple Together' },
                            side_effect: { label: 'Counsel on Side Effects' }
                        },
                        findings: [
                            { text: 'Mrs. Tuti wants an IUD but her husband forbids it, so couple counseling is needed.' },
                            { text: 'Adolescent girls still feel too embarrassed to ask about menstruation and reproductive health.' }
                        ]
                    },
                    pelayanan: {
                        label: 'Family Planning Service Area',
                        description: 'This service station distributes injections, pills, condoms, and implant referrals.',
                        actions: {
                            inject_kb: { label: 'Provide Injectable Contraception' },
                            distribute_pill: { label: 'Dispense Contraceptive Pills' },
                            implant_referral: { label: 'Refer for Implant or IUD Placement' }
                        },
                        findings: [
                            { text: 'Three-month injectable contraception is the most common method, but the dropout rate is still 20 percent.' },
                            { text: 'Condom stock is adequate, yet distribution remains low, likely because of social stigma.' }
                        ]
                    },
                    data_kb: {
                        label: 'Registers and Data',
                        description: 'The cohort register, coverage numbers, and service planning records are reviewed here.',
                        actions: {
                            update_register: { label: 'Update the Family Planning Cohort Register' },
                            analyze_dropout: { label: 'Analyze Family Planning Dropout' },
                            unmet_need: { label: 'Identify Unmet Need' }
                        },
                        findings: [
                            { text: 'Unmet need for family planning in this hamlet is 22 percent, far above the national target.' },
                            { text: 'Seven couples of reproductive age have never used any family planning method.' }
                        ]
                    }
                },
                npcs: {
                    kader_wati: {
                        name: 'Cadre Wati',
                        role: 'Family Planning Cadre',
                        greeting: 'Doctor, I am glad you are here. We only had two new family planning acceptors this month even though our target was ten.',
                        dialogs: {
                            auto: {
                                text: 'Doctor, Mrs. Tuti wants an IUD but her husband strongly refuses. He says family planning is only a woman\'s business even though they already have four children.',
                                choices: [
                                    { text: 'Invite the husband for joint counseling.' },
                                    { text: 'We can also approach this through community education sessions.' }
                                ]
                            }
                        }
                    },
                    bu_tuti: {
                        name: 'Mrs. Tuti',
                        role: 'Prospective Acceptor',
                        greeting: 'Doctor, I am exhausted from repeated pregnancies. I already have four children and the youngest is only eight months old.',
                        dialogs: {
                            konseling_done: {
                                text: 'So the IUD is really safe, Doctor? I am afraid it will hurt, and my husband worries he will feel it. Could you explain it to him too?',
                                choices: [
                                    { text: 'Of course. I can explain that a partner should not feel the IUD.' },
                                    { text: 'We can discuss another method first if that helps the family accept contraception.' }
                                ]
                            }
                        }
                    }
                },
                completionReward: {
                    message: 'The family planning post session is complete and the unmet-need data has been reported to the district coordinator.'
                }
            },
            balai_desa: {
                title: 'Sukamaju Village Hall',
                subtitle: 'Village Deliberation and Health Promotion',
                ambience: 'An open meeting hall with rows of plastic chairs, a whiteboard, an aging projector, and residents gathering for discussion.',
                stations: {
                    podium: {
                        label: 'Education Podium',
                        description: 'The public speaking area used for health education with a flip chart and projector.',
                        actions: {
                            phbs_talk: { label: 'Teach the Ten PHBS Indicators' },
                            stunting_talk: { label: 'Run a Stunting Prevention Session' },
                            hygiene_demo: { label: 'Demonstrate Handwashing and Soap Use' }
                        },
                        findings: [
                            { text: 'Forty residents attended and showed strong interest during the stunting session.' },
                            { text: 'Some participants started falling asleep, suggesting the presentation may be too long.' }
                        ]
                    },
                    meja_musrenbang: {
                        label: 'Planning Table',
                        description: 'This is the village planning forum where health-sector development priorities are negotiated.',
                        actions: {
                            propose_budget: { label: 'Propose Village Health Budget' },
                            jamban_proposal: { label: 'Draft a Shared Latrine Proposal' },
                            posyandu_support: { label: 'Request Integrated Health Post Funding Support' }
                        },
                        findings: [
                            { text: 'The village head agrees to allocate 10 percent of village funds to health.' },
                            { text: 'Neighborhoods 03 and 05 still lack communal latrines and need urgent intervention.' }
                        ]
                    },
                    pojok_data: {
                        label: 'Village Data Corner',
                        description: 'A health profile board showing disease maps, IKS trends, and other village indicators.',
                        actions: {
                            update_profile: { label: 'Update the Village Health Profile' },
                            present_data: { label: 'Present Data to Village Officials' },
                            map_disease: { label: 'Map Disease Distribution' }
                        },
                        findings: [
                            { text: 'IKS data has not been updated for three months, so village officials lack a current situational picture.' },
                            { text: 'The map shows a diarrhea cluster in neighborhood 05 near the river.' }
                        ]
                    },
                    halaman: {
                        label: 'Courtyard and Group Exercise Area',
                        description: 'A wide outdoor area used for Prolanis exercise, older-adult activities, and community screening.',
                        actions: {
                            senam_prolanis: { label: 'Lead a Prolanis Exercise Session' },
                            screening_lansia: { label: 'Screen Older Adults for Health Risks' }
                        },
                        findings: [
                            { text: 'Only 15 older adults joined the exercise session out of a target of 40.' },
                            { text: 'Mrs. Kartini, age 72, has a blood pressure of 170 over 100 and has not taken her medicine today.' }
                        ]
                    }
                },
                npcs: {
                    pak_lurah: {
                        name: 'Village Head Harto',
                        role: 'Village Head',
                        greeting: 'Doctor, perfect timing. We are about to start the village planning meeting and need your advice on health priorities.',
                        dialogs: {
                            auto: {
                                text: 'Doctor, village funding is higher this year. I want to allocate more to health, but I am unsure what should come first. Shared latrines, integrated health post support, or clean water?',
                                choices: [
                                    { text: 'Shared latrines first. Two neighborhoods are still practicing open defecation.' },
                                    { text: 'Let me present the data first so the decision stays evidence-based.' }
                                ]
                            }
                        }
                    },
                    kader_umi: {
                        name: 'Cadre Umi',
                        role: 'Village Health Cadre',
                        greeting: 'Doctor, I want to report this month\'s integrated health post work and our home visits.',
                        dialogs: {
                            podium_done: {
                                text: 'Doctor, the education session was good, but the mothers asked for something more practical, like a nutritious cooking demo. Could you help with that?',
                                choices: [
                                    { text: 'That is a good idea. Let us schedule a complementary-feeding demo next month.' },
                                    { text: 'I can at least prepare a simple recipe leaflet right away.' }
                                ]
                            }
                        }
                    }
                },
                completionReward: {
                    message: 'The village deliberation is complete and the village health budget priorities have been agreed.'
                }
            },
            mck: {
                title: 'Ciburial Hamlet Public Sanitation Block',
                subtitle: 'Environmental Sanitation | STBM Inspection and Coaching',
                ambience: 'A public sanitation block near the river with stagnant water, unpleasant smells, and no soap available.',
                stations: {
                    jamban: {
                        label: 'Latrines',
                        description: 'The shared toilet area needs structural, drainage, and sanitation inspection.',
                        actions: {
                            inspect_latrine: { label: 'Inspect the Latrine Type' },
                            check_drainage: { label: 'Check Wastewater Drainage' },
                            educate_stbm: { label: 'Educate on Ending Open Defecation' }
                        },
                        findings: [
                            { text: 'One of the latrines still empties directly into the river and is not sanitary.' },
                            { text: 'Two of the four stalls no longer have doors.' },
                            { text: 'Grey water is pooling behind the sanitation block.' }
                        ]
                    },
                    tempat_cuci: {
                        label: 'Handwashing and Laundry Area',
                        description: 'Residents wash their hands and clothes here, so soap access and safe practices matter.',
                        actions: {
                            ctps_check: { label: 'Check Handwashing with Soap Facilities' },
                            ctps_demo: { label: 'Demonstrate Handwashing with Soap' },
                            soap_supply: { label: 'Provide Soap and Posters' }
                        },
                        findings: [
                            { text: 'There is no soap at all in the handwashing area.' },
                            { text: 'Some residents still wash clothes directly in the river without environmentally safe detergent.' }
                        ]
                    },
                    sumber_air: {
                        label: 'Clean Water Source',
                        description: 'The local well or water system must be checked for distance, contamination, and treatment quality.',
                        actions: {
                            water_test: { label: 'Test Water Quality' },
                            chlorine_test: { label: 'Test Residual Chlorine' },
                            educate_pam: { label: 'Educate on Safe Drinking Water Treatment' }
                        },
                        findings: [
                            { text: 'The well is only eight meters from the septic tank, which creates contamination risk.' },
                            { text: 'The PAMSIMAS water is clear and the residual chlorine is 0.3 mg per liter, which is within the safe range.' }
                        ]
                    },
                    tempat_sampah: {
                        label: 'Waste Management Area',
                        description: 'The temporary waste point needs separation, odor control, and composting guidance.',
                        actions: {
                            waste_inspect: { label: 'Inspect Waste Management' },
                            compost_educate: { label: 'Teach Organic Composting' },
                            pilah_demo: { label: 'Demonstrate Three-R Waste Sorting' }
                        },
                        findings: [
                            { text: 'Organic and inorganic waste are mixed together and produce a strong odor.' },
                            { text: 'A few residents have already started composting and could become local champions.' }
                        ]
                    }
                },
                npcs: {
                    pak_rt: {
                        name: 'Mr. Dadang',
                        role: 'Neighborhood 05 Head',
                        greeting: 'Doctor, thank goodness someone is finally inspecting this place. The sanitation block has had problems for a long time.',
                        dialogs: {
                            auto: {
                                text: 'Doctor, this public toilet block was built with government assistance five years ago, but nobody has really maintained it. Residents just say that at least it exists.',
                                choices: [
                                    { text: 'Let us form a maintenance group and assign a cleaning rotation.' },
                                    { text: 'We should push for village-fund repairs and I can help document the need.' }
                                ]
                            }
                        }
                    },
                    sanitarian: {
                        name: 'Mr. Rifki',
                        role: 'Clinic Sanitarian',
                        greeting: 'Doctor, I already ran a preliminary survey and there are serious concerns about the distance between the well and the septic tank.',
                        dialogs: {
                            sumber_air_done: {
                                text: 'Doctor, this well is too close to the septic tank. The minimum standard is ten meters, but this one is only eight, so the E. coli contamination risk is high.',
                                choices: [
                                    { text: 'Recommend moving the well or upgrading the households to the piped system.' },
                                    { text: 'We should escalate this to the district health office for follow-up.' }
                                ]
                            }
                        }
                    }
                },
                completionReward: {
                    message: 'The sanitation-block inspection is complete and the STBM recommendations have been sent to the health office.'
                }
            },
            pos_gizi: {
                title: 'Sukamaju Nutrition Recovery Post',
                subtitle: 'Supplementary Feeding Program and Severe Malnutrition Follow-Up',
                ambience: 'A small clean room near the integrated health post with scales, supplementary food ingredients, growth charts, and mothers waiting with undernourished toddlers.',
                stations: {
                    timbang_gizi: {
                        label: 'Weighing and Growth Card Station',
                        description: 'Weekly growth monitoring for toddlers with undernutrition or severe malnutrition.',
                        actions: {
                            weigh_weekly: { label: 'Weigh the Child This Week' },
                            plot_growth: { label: 'Plot the WHO Growth Chart' },
                            lila_check: { label: 'Measure Child MUAC for Wasting' }
                        },
                        findings: [
                            { text: 'Dede (18 months) has a weight-for-age z-score of -3.2 and a MUAC of 11 cm, meeting severe malnutrition criteria.' },
                            { text: 'Santi (24 months) gained 200 grams compared with last week and is showing a positive trend.' }
                        ]
                    },
                    dapur_pmt: {
                        label: 'Supplementary Feeding Kitchen',
                        description: 'A cooking station for supplementary meals using local foods such as eggs, tempeh, and leafy vegetables.',
                        actions: {
                            cook_pmt: { label: 'Demonstrate Local Supplementary Feeding Recipes' },
                            menu_plan: { label: 'Plan a One-Month Supplementary Menu' },
                            feeding_demo: { label: 'Demonstrate Responsive Feeding' }
                        },
                        findings: [
                            { text: 'This month the kitchen has 50 eggs, 5 kilograms of tempeh, 3 kilograms of spinach, and 2 kilograms of sweet potato.' },
                            { text: 'Mrs. Nani says her child refuses vegetables and only wants instant noodles, so responsive feeding is needed.' }
                        ]
                    },
                    konseling_gizi: {
                        label: 'Maternal Nutrition Counseling',
                        description: 'Nutrition education for mothers covering breastfeeding, complementary feeding, sanitation, and health access.',
                        actions: {
                            counsel_1000hpk: { label: 'Teach the First 1000 Days of Life' },
                            food_diary: { label: 'Review the Child Food Diary' },
                            taburia_demo: { label: 'Demonstrate Micronutrient Sprinkle Use' }
                        },
                        findings: [
                            { text: 'Most undernourished children are eating only rice with sweet soy sauce twice a day.' },
                            { text: 'Children whose mothers attend the supplementary feeding sessions regularly gain an average of 300 grams per month.' }
                        ]
                    }
                },
                npcs: {
                    ahli_gizi: {
                        name: 'Andi the Nutritionist',
                        role: 'Clinic Nutrition Officer',
                        greeting: 'Doctor, eight children with undernutrition are active in the nutrition post this month. Two already meet severe malnutrition criteria and need intensive management.',
                        dialogs: {
                            auto: {
                                text: 'Doctor, Dede is getting thinner. His MUAC is only 11 cm, which already meets the severe wasting threshold. His mother says she cannot afford protein-rich side dishes. Should we refer him or start intensive feeding here first?',
                                choices: [
                                    { text: 'Refer him to the district hospital therapeutic feeding center.' },
                                    { text: 'Start two weeks of intensive supplementary feeding with close follow-up, then refer if there is no response.' }
                                ]
                            }
                        }
                    }
                },
                completionReward: {
                    message: 'The nutrition post session is complete and all eight children with undernutrition have been reviewed.'
                }
            },
            pos_ukk: {
                title: 'Sukamaju Occupational Health Post',
                subtitle: 'Worker Health Effort | Screening and Coaching for Informal Workers',
                ambience: 'A modest post near the farming area with PPE posters, a first-aid box, a scale, and informal workers resting between tasks.',
                stations: {
                    skrining_pekerja: {
                        label: 'Worker Health Screening',
                        description: 'Informal workers can be screened here for blood pressure, simple lung function, and occupational skin issues.',
                        actions: {
                            health_screening: { label: 'Screen Blood Pressure and Blood Sugar' },
                            lung_check: { label: 'Check Lung Function' },
                            skin_check: { label: 'Inspect for Contact Dermatitis' }
                        },
                        findings: [
                            { text: 'Three of ten farmers have uncontrolled hypertension because they are not taking their medicines.' },
                            { text: 'Mr. Ujang, a pesticide sprayer, has a peak flow of only 60 percent of predicted and may have chronic lung disease.' },
                            { text: 'Five field workers have contact dermatitis from chemical fertilizers.' }
                        ]
                    },
                    pos_apd: {
                        label: 'PPE and Ergonomics Post',
                        description: 'Protective equipment distribution and ergonomic coaching are handled here.',
                        actions: {
                            apd_distribute: { label: 'Distribute Masks and Gloves' },
                            ergonomi_demo: { label: 'Demonstrate Ergonomic Working Posture' },
                            apd_audit: { label: 'Audit PPE Compliance' }
                        },
                        findings: [
                            { text: 'Only two of fifteen farmers routinely wear masks while spraying pesticides.' },
                            { text: 'Rubber boots are available but farmers still say they are uncomfortable.' },
                            { text: 'Women who package grain keep working in a bent posture and already complain of chronic back pain.' }
                        ]
                    },
                    p3k_kerja: {
                        label: 'First Aid and Emergency Box',
                        description: 'The emergency supply point should cover injuries, first aid, and pesticide-exposure response.',
                        actions: {
                            p3k_check: { label: 'Inventory the First Aid Box' },
                            first_aid_train: { label: 'Train UKK Cadres in First Aid' },
                            antidote_stock: { label: 'Check Atropine and Activated Charcoal Stock' }
                        },
                        findings: [
                            { text: 'The first aid box contains only antiseptic and bandages and is otherwise incomplete.' },
                            { text: 'There is no pesticide antidote stock at this post.' },
                            { text: 'The occupational-health cadres have never received first-aid training.' }
                        ]
                    }
                },
                npcs: {
                    kader_ukk: {
                        name: 'Mr. Dede',
                        role: 'Occupational Health Cadre',
                        greeting: 'Doctor, I am glad someone came. This post is usually quiet because farmers rarely want to be screened.',
                        dialogs: {
                            auto: {
                                text: 'Doctor, Mr. Ujang has been coughing for three months. He keeps calling it a normal farmer\'s cough, but I am worried because he sprays pesticides all the time.',
                                choices: [
                                    { text: 'Let us screen him directly and test his lung function.' },
                                    { text: 'Make a note and we will visit him in the fields tomorrow.' }
                                ]
                            }
                        }
                    }
                },
                completionReward: {
                    message: 'The occupational health coaching session is complete and worker health data has been reported.'
                }
            },
            pamsimas: {
                title: 'Sukamaju PAMSIMAS Installation',
                subtitle: 'Community-Based Water Supply and Sanitation',
                ambience: 'A water storage facility with pumps, distribution pipes, flowing water sounds, and a tariff board posted nearby.',
                stations: {
                    bak_penampung: {
                        label: 'Storage Tank and Pump',
                        description: 'The main 5,000-liter reservoir and electric pump need basic structural and capacity inspection.',
                        actions: {
                            inspect_tank: { label: 'Inspect the Storage Tank' },
                            check_pump: { label: 'Check Pump Condition' },
                            capacity_calc: { label: 'Compare Capacity with Demand' }
                        },
                        findings: [
                            { text: 'The storage tank is cracked at the base and leaks around 500 liters per day.' },
                            { text: 'The pump still works, but it has not been serviced in eight years.' },
                            { text: 'Capacity is sufficient for 150 households and the system currently serves 120.' }
                        ]
                    },
                    klorinasi: {
                        label: 'Chlorination and Filtration Unit',
                        description: 'The treatment line includes chlorination, sand filtration, and sedimentation elements.',
                        actions: {
                            chlorine_check: { label: 'Test Residual Chlorine at the Outlet' },
                            filter_inspect: { label: 'Inspect the Sand Filter' },
                            dosing_calibrate: { label: 'Calibrate Chlorine Dosing' }
                        },
                        findings: [
                            { text: 'Residual chlorine at the farthest tap is only 0.1 mg per liter, below the standard.' },
                            { text: 'The sand filter has not been replaced for two years and needs renewal.' },
                            { text: 'The drip chlorination system itself is still functioning well.' }
                        ]
                    },
                    distribusi: {
                        label: 'Distribution Pipe Network',
                        description: 'PVC pipes to resident homes need checks for leakage, corrosion, and service coverage.',
                        actions: {
                            leak_check: { label: 'Detect Pipe Leaks' },
                            water_quality_tap: { label: 'Test Water at Household Taps' },
                            coverage_mapping: { label: 'Map Service Coverage' }
                        },
                        findings: [
                            { text: 'Fifteen households in neighborhood 06 are still unconnected and rely on shallow wells.' },
                            { text: 'Water at Mrs. Ana\'s tap looks cloudy because the old pipe has started to corrode.' }
                        ]
                    },
                    pengelolaan: {
                        label: 'System Management Office',
                        description: 'The management body keeps finance records, service logs, and water-quality reporting here.',
                        actions: {
                            financial_review: { label: 'Review Management Finances' },
                            quality_report: { label: 'Review Monthly Water Quality Reports' },
                            community_meeting: { label: 'Lead a Management Meeting' }
                        },
                        findings: [
                            { text: 'Only 70 percent of household fees have been collected and arrears total 2.4 million rupiah.' },
                            { text: 'No monthly water-quality report has been produced in the past six months.' }
                        ]
                    }
                },
                npcs: {
                    ketua_bpspams: {
                        name: 'Mr. Ahmad',
                        role: 'System Management Head',
                        greeting: 'Doctor, the storage tank has been leaking for three months. We already requested repair funds from the village, but nothing has been released yet.',
                        dialogs: {
                            auto: {
                                text: 'Doctor, the hardest problem is not just technical. The households still not connected mostly live uphill, so we would need an additional pump and a much bigger budget.',
                                choices: [
                                    { text: 'Let us work on a proposal for district support or capital funding first.' },
                                    { text: 'We should prioritize repairing the leaking tank, then expand pipes in phases.' }
                                ]
                            }
                        }
                    }
                },
                completionReward: {
                    message: 'The water-system inspection is complete and repair recommendations have been sent to the managers and village leadership.'
                }
            },
            bank_sampah: {
                title: 'Berseri Waste Bank',
                subtitle: 'Community Waste Management | Reduce, Reuse, Recycle',
                ambience: 'An open warehouse with sorted waste racks, weighing scales, clean plastic sacks, and the smell of recycled materials.',
                stations: {
                    pilah_sampah: {
                        label: 'Sorting Area',
                        description: 'Residents bring waste here for sorting into plastic, paper, metal, glass, and organic groups.',
                        actions: {
                            sort_demo: { label: 'Demonstrate Five-Category Waste Sorting' },
                            weigh_record: { label: 'Weigh and Record Resident Deposits' },
                            health_hazard: { label: 'Identify Hazardous Household Waste' }
                        },
                        findings: [
                            { text: 'Used batteries and fluorescent lamps were found mixed into the ordinary waste pile.' },
                            { text: 'Plastic deposits are up 30 percent this month, showing that residents are sorting more consistently.' }
                        ]
                    },
                    komposting: {
                        label: 'Composting Unit',
                        description: 'Organic waste is processed into compost here through fermentation and worm-based methods.',
                        actions: {
                            compost_check: { label: 'Check Compost Quality' },
                            vermicompost: { label: 'Demonstrate Vermicomposting' },
                            distribute_compost: { label: 'Distribute Compost to Farmers' }
                        },
                        findings: [
                            { text: 'Two hundred kilograms of compost are already mature and ready for distribution to organic farmers.' },
                            { text: 'The fermentation bed is too wet and attracting flies, so more dry brown material is needed.' }
                        ]
                    },
                    kerajinan: {
                        label: 'Upcycling Workshop',
                        description: 'Women produce bags, flower pots, and ecobricks from plastic waste in this workshop.',
                        actions: {
                            ecobrick_demo: { label: 'Demonstrate Ecobrick Making' },
                            craft_exhibit: { label: 'Run a Recycled Craft Exhibit' },
                            health_edu_3r: { label: 'Teach the Health Impact of Poor Waste Management' }
                        },
                        findings: [
                            { text: 'Bags made from coffee sachets are selling online for 50,000 rupiah each.' },
                            { text: 'The women\'s group is asking for more training because the small-enterprise potential is strong.' }
                        ]
                    }
                },
                npcs: {
                    bu_ketua_bs: {
                        name: 'Mrs. Lia',
                        role: 'Waste Bank Coordinator',
                        greeting: 'Doctor, someone from the clinic finally came. We need guidance on used masks and other household medical waste.',
                        dialogs: {
                            auto: {
                                text: 'Doctor, residents are getting more diligent about bringing waste here, but some are also bringing used batteries and fluorescent lamps. We know those are dangerous, but we do not know how to dispose of them safely.',
                                choices: [
                                    { text: 'That is hazardous waste, and I can help draft a household B3 handling SOP.' },
                                    { text: 'Let us coordinate with environmental and health authorities for proper collection.' }
                                ]
                            }
                        }
                    }
                },
                completionReward: {
                    message: 'The waste bank visit is complete and the hazardous-waste recommendations have been documented.'
                }
            },
            polindes: {
                title: 'Village Birthing Post',
                subtitle: 'Delivery and Postpartum Services at Village Level',
                ambience: 'A village midwife house adapted into a birthing post with a delivery bed, partus set, exam lamp, and a clean but simple setup.',
                stations: {
                    ruang_bersalin: {
                        label: 'Delivery Room',
                        description: 'The normal delivery bed with the partus set, newborn heater, and oxytocin supply.',
                        actions: {
                            check_partus_set: { label: 'Check Partus Set Completeness' },
                            check_emergency: { label: 'Check Emergency Kit for Hemorrhage' },
                            simulate_partus: { label: 'Simulate Delivery Management' }
                        },
                        findings: [
                            { text: 'The oxytocin stock is expired and needs to be replaced from the pharmacy store.' },
                            { text: 'The newborn heater works well and the linen is clean.' },
                            { text: 'There is no magnesium sulfate available for emergency preeclampsia care.' }
                        ]
                    },
                    ruang_nifas: {
                        label: 'Postpartum and Lactation Room',
                        description: 'A rest area for postpartum mothers with education on early breastfeeding initiation and newborn care.',
                        actions: {
                            imd_guide: { label: 'Guide Early Breastfeeding Initiation' },
                            nifas_check: { label: 'Perform Postpartum Checkup (KF1-KF4)' },
                            newborn_check: { label: 'Perform Newborn Checkup (KN1)' }
                        },
                        findings: [
                            { text: 'Mrs. Rina is six hours postpartum and early breastfeeding initiation was successful.' },
                            { text: 'Mrs. Dewi is on postpartum day three with slight bleeding but normal lochia.' }
                        ]
                    },
                    register_polindes: {
                        label: 'Registers and Cohort Data',
                        description: 'The delivery register, maternal cards, and cohort books are managed here.',
                        actions: {
                            review_kohort: { label: 'Review the Maternal Cohort Register' },
                            plan_schedule: { label: 'Schedule Next Month ANC and Deliveries' },
                            risk_mapping: { label: 'Map High-Risk Pregnancies' }
                        },
                        findings: [
                            { text: 'Three pregnant women are high risk because of grand multiparity, age over 35 years, or previous cesarean history.' },
                            { text: 'This month K4 coverage is 85 percent against a target of 90 percent.' }
                        ]
                    }
                },
                npcs: {
                    bidan_ani: {
                        name: 'Midwife Ani',
                        role: 'Village Midwife',
                        greeting: 'Doctor, I am glad you are supervising today. I handled four deliveries this month and they were all normal, but my emergency medicines are running low.',
                        dialogs: {
                            auto: {
                                text: 'Doctor, I am worried about Mrs. Tini. She is G5P4, 40 years old, and has a previous cesarean history. She should deliver at the hospital, but she insists on staying here because her past four births were fine.',
                                choices: [
                                    { text: 'We need to be firm. With the risk of uterine rupture, she must deliver in the hospital.' },
                                    { text: 'Explain the risk using clear data and invite her husband into the counseling.' }
                                ]
                            }
                        }
                    }
                },
                completionReward: {
                    message: 'The birthing post supervision is complete and the stock plus high-risk findings have been reported to the main clinic.'
                }
            },
            rtk: {
                title: 'Maternal Waiting House',
                subtitle: 'Maternal Referral Hub | Safe staging before obstetric referral',
                ambience: 'A simple lodging house near the main road with folding mattresses, emergency bags, birth-planning posters, and referral radios.',
                stations: {
                    triage_rtk: {
                        label: 'High-Risk Maternal Triage Corner',
                        description: 'Incoming mothers awaiting referral are checked here for blood pressure, contractions, bleeding, and transport readiness.',
                        actions: {
                            rapid_triage: { label: 'Perform Rapid Triage on Arrival' },
                            danger_signs: { label: 'Verify Maternal Danger Signs' },
                            stabilize_waiting: { label: 'Stabilize While Waiting for Ambulance' }
                        },
                        findings: [
                            { text: 'Mrs. Tini, G5P4 with a previous cesarean history, has arrived with regular contractions and should no longer remain at home.' },
                            { text: 'One pregnant 17-year-old looks anxious, has a blood pressure of 150 over 100, and bilateral leg swelling.' },
                            { text: 'Two family emergency bags are incomplete and still missing baby cloths and JKN documents.' }
                        ]
                    },
                    logistik_rujukan: {
                        label: 'Referral Logistics and Emergency Bags',
                        description: 'Emergency bags, referral letters, standby blood donors, and maternal-neonatal supplies are organized here.',
                        actions: {
                            check_referral_pack: { label: 'Check Emergency Bags and Referral Documents' },
                            blood_donor_map: { label: 'Map Standby Blood Donors' },
                            jkn_verify: { label: 'Verify JKN or Maternal Coverage' }
                        },
                        findings: [
                            { text: 'An active type-O blood donor is available, but the family still does not know how to contact him at night.' },
                            { text: 'One referral letter is still unsigned and could delay hospital admission.' },
                            { text: 'Mrs. Rina\'s emergency bag is complete with her maternal book, baby cloths, postpartum pads, and JKN card.' }
                        ]
                    },
                    transport_desk: {
                        label: 'Transport and Communication Desk',
                        description: 'This desk coordinates the village driver, ambulance, referral hospital contacts, and alternative evacuation routes during bad weather.',
                        actions: {
                            call_hospital: { label: 'Confirm Bed Availability at the Referral Hospital' },
                            transport_plan: { label: 'Prepare the Night Evacuation Plan' },
                            brief_family: { label: 'Brief the Family Before Departure' }
                        },
                        findings: [
                            { text: 'The ambulance driver is on standby, but the eastern bridge may fail if heavy rain arrives tonight.' },
                            { text: 'The hospital emergency department asked for the preeclampsia report in advance so magnesium sulfate can be prepared.' },
                            { text: 'Mrs. Tini\'s husband is still hesitant because he fears referral costs will escalate.' }
                        ]
                    }
                },
                npcs: {
                    bidan_referal: {
                        name: 'Midwife Rere',
                        role: 'Maternal Waiting House Coordinator',
                        greeting: 'Doctor, this waiting house is the final buffer before a high-risk mother is referred. Even a short delay can become fatal.',
                        dialogs: {
                            auto: {
                                text: 'Mrs. Tini has agreed to stay here, but her family keeps saying they will wait until she is really in pain. With a previous cesarean history and a 90-minute road to the hospital during rain, that is too dangerous.',
                                choices: [
                                    { text: 'Let us use the waiting house itself to explain every risk factor and travel delay clearly.' },
                                    { text: 'I will help negotiate with the family and emphasize that this house prevents dangerous late referral.' }
                                ]
                            }
                        }
                    },
                    suami_tini: {
                        name: 'Mr. Yono',
                        role: 'Husband of a High-Risk Pregnant Woman',
                        greeting: 'Doctor, I am afraid the hospital referral will become too expensive and that the family will be confused during the process.',
                        dialogs: {
                            transport_desk_done: {
                                text: 'If this waiting house really means everything is prepared before an emergency happens, I want to hear it again. I just do not want my wife to be bounced around between places.',
                                choices: [
                                    { text: 'That is exactly the point. The waiting house prepares the documents, donors, and route before the crisis begins.' },
                                    { text: 'Let us review the emergency bag and hospital numbers together so you can feel more certain.' }
                                ]
                            }
                        }
                    }
                },
                completionReward: {
                    message: 'The maternal waiting-house operation is complete and the village referral pathway is now more prepared for safe delivery.'
                }
            },
            market: {
                title: 'Sukamaju Village Market',
                subtitle: 'Food Safety and Environmental Health in the Marketplace',
                ambience: 'A crowded traditional market with vegetable, meat, and fish stalls, a mix of spice and fresh fish smells, and flies swarming around vendors.',
                stations: {
                    lapak_basah: {
                        label: 'Wet Market Area (Meat and Fish)',
                        description: 'Meat and fish stalls where storage temperature, cutting boards, and washing water need inspection.',
                        actions: {
                            meat_inspect: { label: 'Inspect Meat Color, Smell, and Texture' },
                            fish_freshness: { label: 'Check Fish Freshness (Eyes and Gills)' },
                            cold_chain: { label: 'Inspect the Cold Chain Temperature' }
                        },
                        findings: [
                            { text: 'Beef is being sold without refrigeration at 30 C, creating a Salmonella risk.' },
                            { text: 'The same cutting board is used for beef and poultry, creating cross-contamination risk.' },
                            { text: 'The fish delivered by local fishers this morning still looks fresh with clear eyes.' }
                        ]
                    },
                    lapak_kering: {
                        label: 'Dry Goods and Snacks Area',
                        description: 'Stalls selling cakes, snacks, and seasonings where expiry dates and unsafe additives need to be checked.',
                        actions: {
                            additive_test: { label: 'Rapid Test for Borax, Formalin, and Dyes' },
                            expiry_check: { label: 'Check Expiry Dates' },
                            label_check: { label: 'Inspect Food Labels and Registrations' }
                        },
                        findings: [
                            { text: 'White tofu tested positive for formalin, and the vendor says it came from a city supplier.' },
                            { text: 'Red crackers tested positive for rhodamine B textile dye.' },
                            { text: 'Packaged seasonings expired four months ago are still being sold.' }
                        ]
                    },
                    sanitasi_pasar: {
                        label: 'Market Sanitation and Public Toilets',
                        description: 'The market toilets, trash area, drainage, and water sources all need environmental inspection.',
                        actions: {
                            toilet_inspect: { label: 'Inspect the Market Toilets' },
                            drain_check: { label: 'Check Drainage and Standing Water' },
                            waste_check: { label: 'Inspect Market Waste Management' }
                        },
                        findings: [
                            { text: 'The drains are clogged and the standing water is mixed with fish blood and organic waste.' },
                            { text: 'The entire market has only two trash bins for around 50 stalls.' },
                            { text: 'The market toilets still have soap, which is unusually good for a traditional market.' }
                        ]
                    }
                },
                npcs: {
                    ketua_pasar: {
                        name: 'Mr. Tarjo',
                        role: 'Market Management Head',
                        greeting: 'So the clinic is inspecting us today. Hopefully the traders can still keep selling, Doctor.',
                        dialogs: {
                            auto: {
                                text: 'Doctor, I know this market is not clean enough. The traders are hard to manage because they only care about what sells. I also suspect formalin use, but I cannot prove it on my own.',
                                choices: [
                                    { text: 'I brought a rapid test kit, so let us test the products in front of the traders.' },
                                    { text: 'Let us run food safety coaching first instead of launching a raid immediately.' }
                                ]
                            }
                        }
                    }
                },
                completionReward: {
                    message: 'The market inspection is complete and the formalin plus rhodamine B findings have been escalated to the regulator.'
                }
            },
            warung: {
                title: 'Bu Minah\'s Food Stall',
                subtitle: 'Village Eatery | Nutrition and Food Safety Education',
                ambience: 'A modest roadside food stall with the smell of warm rice and fried tempeh, wooden tables, and a glass display of side dishes.',
                stations: {
                    dapur_warung: {
                        label: 'Kitchen and Cooking Area',
                        description: 'The cooking area where kitchen hygiene, ingredient storage, and frying oil quality can be checked.',
                        actions: {
                            kitchen_inspect: { label: 'Inspect Kitchen Hygiene' },
                            oil_check: { label: 'Test Frying Oil Quality' },
                            storage_check: { label: 'Check Food Ingredient Storage' }
                        },
                        findings: [
                            { text: 'The frying oil is already blackened and has been reused more than five times.' },
                            { text: 'Chicken meat has been stored without refrigeration for eight hours at room temperature.' },
                            { text: 'Fresh spices such as shallots, ginger, and turmeric are still in good condition.' }
                        ]
                    },
                    menu_warung: {
                        label: 'Menu and Balanced Nutrition',
                        description: 'The daily menu needs to be reviewed using balanced nutrition principles.',
                        actions: {
                            menu_analysis: { label: 'Analyze the Plate Composition' },
                            portion_demo: { label: 'Demonstrate a Balanced Portion' },
                            healthy_menu: { label: 'Help Design a Healthier Daily Menu' }
                        },
                        findings: [
                            { text: 'The best-selling meal is rice, fried snacks, and sweet tea, which is highly imbalanced.' },
                            { text: 'Protein options such as tempeh, tofu, eggs, and fish are available, but vegetables are minimal.' },
                            { text: 'Meals remain affordable at roughly 8,000 to 12,000 rupiah per portion.' }
                        ]
                    },
                    etalase: {
                        label: 'Display Case and Serving Area',
                        description: 'Prepared food is displayed here, so covers, flies, and temperature exposure need review.',
                        actions: {
                            display_inspect: { label: 'Inspect the Food Display Case' },
                            fly_count: { label: 'Count Flies as a Sanitation Indicator' },
                            food_safety_tips: { label: 'Give Food Safety Tips to the Seller' }
                        },
                        findings: [
                            { text: 'The display case is left open, allowing flies to land freely on the food.' },
                            { text: 'Leftover rice from yesterday is being sold again today, creating Bacillus cereus risk.' },
                            { text: 'Plates and spoons have been washed properly with soap.' }
                        ]
                    }
                },
                npcs: {
                    bu_minah: {
                        name: 'Mrs. Minah',
                        role: 'Food Stall Owner',
                        greeting: 'What would you like to eat, Doctor? Today we have fried catfish, nasi uduk, and gado-gado.',
                        dialogs: {
                            auto: {
                                text: 'Doctor, I know my frying oil is already dark. But oil is expensive, so how can I replace it every day? Customers still like the taste.',
                                choices: [
                                    { text: 'Used cooking oil contains carcinogens, so it should be replaced after around three uses.' },
                                    { text: 'I can help you adjust the menu by reducing fried foods and adding steamed or boiled options.' }
                                ]
                            }
                        }
                    }
                },
                completionReward: {
                    message: 'The food stall coaching session is complete and Mrs. Minah has agreed to replace her oil more often.'
                }
            },
            toga: {
                title: 'Sukamaju Family Medicinal Garden',
                subtitle: 'Family Medicinal Plants | Evidence-Informed Traditional Health',
                ambience: 'A small herbal garden full of ginger, turmeric, curcuma, aloe vera, orthosiphon, and other medicinal plants with a fresh spice aroma.',
                stations: {
                    kebun_toga: {
                        label: 'Medicinal Plant Garden',
                        description: 'Garden beds used to identify plants, explain their benefits, and teach correct use.',
                        actions: {
                            plant_id: { label: 'Identify Ten Core Medicinal Plants' },
                            harvest_demo: { label: 'Demonstrate Harvesting and Basic Processing' },
                            quality_check: { label: 'Check Plant Quality and Pests' }
                        },
                        findings: [
                            { text: 'The garden contains ginger, turmeric, curcuma, lemongrass, aloe vera, orthosiphon, and sambiloto.' },
                            { text: 'Several plants have whitefly infestations and need organic control measures.' }
                        ]
                    },
                    olahan_toga: {
                        label: 'Herbal Preparation Workshop',
                        description: 'This workshop area covers drying, boiling, and packaging simple herbal preparations.',
                        actions: {
                            jamu_class: { label: 'Run a Safe Herbal Tonic Class' },
                            safety_check: { label: 'Teach Safe Herbal Tonic Versus Dangerous Mixtures' },
                            interaction_warn: { label: 'Warn About Herb-Drug Interactions' }
                        },
                        findings: [
                            { text: 'Some residents mix herbal tonics with diabetes medicines, creating hypoglycemia risk.' },
                            { text: 'Turmeric and curcuma are considered relatively safe and have anti-inflammatory potential.' },
                            { text: 'Some herbal preparations are still made without proper handwashing, so hygiene is weak.' }
                        ]
                    },
                    edukasi_toga: {
                        label: 'Education Board and Exhibit',
                        description: 'The information board should cover scientific names, benefits, doses, and contraindications.',
                        actions: {
                            update_board: { label: 'Refresh the Plant Information Board' },
                            evidence_review: { label: 'Review the Scientific Evidence for Medicinal Plants' },
                            herbal_vs_quack: { label: 'Teach Legal Herbal Products Versus Adulterated Tonics' }
                        },
                        findings: [
                            { text: 'The board is informative, but the scientific names are still missing.' },
                            { text: 'Residents can already distinguish official family medicinal plants from dangerous roaming tonic sellers.' }
                        ]
                    }
                },
                npcs: {
                    bu_herbal: {
                        name: 'Mrs. Nining',
                        role: 'Medicinal Garden Coordinator',
                        greeting: 'Doctor, welcome to our medicinal garden. Everything here is grown organically without pesticides.',
                        dialogs: {
                            auto: {
                                text: 'Doctor, one resident with diabetes drinks a bitter tonic sold by a roaming herbal vendor because he wants to recover faster. He is also taking metformin. That is dangerous, right?',
                                choices: [
                                    { text: 'Yes, it can be dangerous. We need to teach herb-drug interaction risks clearly.' },
                                    { text: 'Bring that resident to the clinic so we can check the blood glucose level.' }
                                ]
                            }
                        }
                    }
                },
                completionReward: {
                    message: 'The medicinal garden visit is complete and the evidence-based herb catalog has been refreshed.'
                }
            },
            padepokan_dukun: {
                title: 'Mbah Surti\'s Traditional Healing House',
                subtitle: 'Negotiating tradition and evidence | safer community partnership',
                ambience: 'A dim wooden pavilion with incense smoke, shelves of herbal bottles, counseling mats, and a ritual corner often visited by worried families.',
                stations: {
                    ruang_ritual: {
                        label: 'Ritual and Consultation Room',
                        description: 'Families seek spiritual explanations here for pregnancy concerns, fever in children, or illnesses they believe were sent to them.',
                        actions: {
                            belief_mapping: { label: 'Map the Family Belief System' },
                            danger_sign_bridge: { label: 'Bridge Danger Signs Through Cultural Language' },
                            respectful_confront: { label: 'Challenge Harmful Myths Respectfully' }
                        },
                        findings: [
                            { text: 'Mrs. Sari\'s family believes postpartum bleeding is just dirty blood leaving the body rather than a danger sign.' },
                            { text: 'Two families are willing to listen if Mbah Surti herself explains when a midwife or hospital is needed.' },
                            { text: 'The myth that referral means a mother is weak is still common around the healing house.' }
                        ]
                    },
                    meja_racikan: {
                        label: 'Herbal Mixture and Food Restriction Table',
                        description: 'Herbal mixtures, massage oils, and food restriction lists for pregnant women, postpartum mothers, and febrile children are handled here.',
                        actions: {
                            review_herbs: { label: 'Review the Herbal Mixtures Used by Residents' },
                            interaction_screen: { label: 'Screen Herbal Tonic and Medicine Interactions' },
                            safe_substitution: { label: 'Negotiate Safe Herbs as a Companion Rather Than a Replacement' }
                        },
                        findings: [
                            { text: 'A bitter herbal mix for pregnant women with edema is delaying proper evaluation for preeclampsia.' },
                            { text: 'Some herbs such as warm ginger can be safe if they do not replace core therapy.' },
                            { text: 'Postpartum protein restriction is still being taught and may slow maternal recovery.' }
                        ]
                    },
                    balai_mediasi: {
                        label: 'Midwife-Traditional Healer Mediation Hall',
                        description: 'A small meeting space used to define role boundaries: the healer offers cultural support while the midwife handles medical care and referrals.',
                        actions: {
                            partnership_charter: { label: 'Draft a Midwife-Healer Partnership Charter' },
                            referral_trigger: { label: 'Train Fast Referral Triggers' },
                            public_message: { label: 'Design a Public Message for Safe Tradition and Evidence' }
                        },
                        findings: [
                            { text: 'Mbah Surti is willing to keep leading prayers and gentle massage as long as the midwife does not belittle her role in public.' },
                            { text: 'There is still no clear list of when the healer must stop and immediately hand the patient over to the midwife.' },
                            { text: 'A local religious leader is ready to support the message that tradition is fine but danger signs must not be delayed.' }
                        ]
                    }
                },
                npcs: {
                    mbah_surti: {
                        name: 'Mbah Surti',
                        role: 'Traditional Birth Attendant and Healer',
                        greeting: 'Doctor, I do not want to be blamed when residents are harmed. People come here because they feel heard.',
                        dialogs: {
                            auto: {
                                text: 'If the midwife only comes here to forbid things, residents will hide even more. But if I am invited to work together, I can help tell them when referral is necessary.',
                                choices: [
                                    { text: 'Let us build a partnership: you hold the cultural support and the midwife handles the medical decisions.' },
                                    { text: 'That is fair, but I need to make sure harmful mixtures and restrictions are stopped.' }
                                ]
                            }
                        }
                    },
                    bu_sari_family: {
                        name: 'Mrs. Sari\'s Family',
                        role: 'A Confused Patient Family',
                        greeting: 'We only want Mrs. Sari to survive, but if everyone pushes us to the hospital we are afraid people will say we do not respect tradition.',
                        dialogs: {
                            balai_mediasi_done: {
                                text: 'If Mbah Surti and the midwife are aligned, we feel much calmer. So far we have only received conflicting messages.',
                                choices: [
                                    { text: 'That is exactly the goal: tradition is respected while danger signs are treated quickly.' },
                                    { text: 'Let us agree on the danger signs that mean the family must leave that same night.' }
                                ]
                            }
                        }
                    }
                },
                completionReward: {
                    message: 'The mediation is complete and the conflict between tradition and evidence is starting to shift into a safer partnership for residents.'
                }
            }
        }
    }
};

