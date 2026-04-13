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
                iksStatus: 'IKS Status'
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
        buildingScenes: {
            posyandu: {
                title: 'Sukamaju Village Posyandu',
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
                            { text: 'Three children have missed Posyandu for the last two months.' },
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
                        role: 'Posyandu Cadre',
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
                    message: 'Today\'s Posyandu session is complete. Every toddler has been covered.'
                }
            },
            school: {
                title: 'Sukamaju State Elementary School 1',
                subtitle: 'School Health Unit | Screening and Education'
            },
            farm: {
                title: 'Community Farmland',
                subtitle: 'Occupational and Environmental Health | Field Inspection'
            },
            pustu: {
                title: 'Cilengkrang Hamlet Sub-Clinic',
                subtitle: 'Satellite Primary Care Post | Maternal and Basic Care Services'
            },
            kb_post: {
                title: 'Sukamaju Family Planning Post',
                subtitle: 'Family Planning and Reproductive Health Services'
            },
            balai_desa: {
                title: 'Sukamaju Village Hall',
                subtitle: 'Village Deliberation and Health Promotion'
            },
            mck: {
                title: 'Ciburial Hamlet Public Sanitation Block',
                subtitle: 'Environmental Sanitation | STBM Inspection and Coaching'
            },
            pos_gizi: {
                title: 'Sukamaju Nutrition Recovery Post',
                subtitle: 'Supplementary Feeding Program and Severe Malnutrition Follow-Up'
            },
            pos_ukk: {
                title: 'Sukamaju Occupational Health Post',
                subtitle: 'Worker Health Effort | Screening and Coaching for Informal Workers'
            },
            pamsimas: {
                title: 'Sukamaju PAMSIMAS Installation',
                subtitle: 'Community-Based Water Supply and Sanitation'
            },
            bank_sampah: {
                title: 'Berseri Waste Bank',
                subtitle: 'Community Waste Management | Reduce, Reuse, Recycle'
            },
            polindes: {
                title: 'Village Birthing Post',
                subtitle: 'Delivery and Postpartum Services at Village Level'
            },
            rtk: {
                title: 'Maternal Waiting House',
                subtitle: 'Maternal Referral Hub | Safe staging before obstetric referral'
            },
            market: {
                title: 'Sukamaju Village Market',
                subtitle: 'Food Safety and Environmental Health in the Marketplace'
            },
            warung: {
                title: 'Bu Minah\'s Food Stall',
                subtitle: 'Village Eatery | Nutrition and Food Safety Education'
            },
            toga: {
                title: 'Sukamaju Family Medicinal Garden',
                subtitle: 'Family Medicinal Plants | Evidence-Informed Traditional Health'
            },
            padepokan_dukun: {
                title: 'Mbah Surti\'s Traditional Healing House',
                subtitle: 'Negotiating tradition and evidence | safer community partnership'
            }
        }
    }
};

