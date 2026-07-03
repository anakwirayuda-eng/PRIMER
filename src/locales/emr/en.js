export default {
    emrWorkspace: {
        common: {
            itemsCount: '{{count}} items',
            serviceFee: 'Rp {{value}}',
            maia: 'MAIA'
        },
        sidebar: {
            cpptInfo: 'Info: What is CPPT?',
            medicalRecord: 'Medical Record'
        },
        cppt: {
            actions: {
                treat: 'OUTPATIENT',
                refer: 'REFERRED',
                stabilize: 'STABILIZATION'
            },
            dayLabel: 'Day {{day}}',
            yearsShort: 'yrs',
            noAnamnesis: 'Anamnesis unavailable',
            physicalExam: 'Physical Examination',
            emptyPhysicalExam: 'Physical exam not recorded',
            laboratory: 'Laboratory',
            noDiagnosis: 'No diagnosis yet',
            referTo: 'Refer to: {{target}}',
            referralHospitalFallback: 'Referral Hospital',
            noTherapy: 'No therapy recorded',
            outcome: 'Outcome:',
            by: 'by:',
            unavailable: 'N/A',
            statusRecovered: 'Recovered',
            statusImproved: 'Improved',
            educationLabels: {
                diet_nutrition: 'Diet & Nutrition',
                medication_adherence: 'Medication Adherence',
                wound_care: 'Wound Care',
                hygiene: 'Hygiene / PHBS',
                follow_up: 'Follow-up Visit',
                lifestyle: 'Healthy Lifestyle',
                danger_signs: 'Danger Signs',
                stop_smoking: 'Stop Smoking',
                breastfeeding: 'Exclusive Breastfeeding',
                family_planning: 'Family Planning',
                exercise: 'Physical Activity',
                ors_zinc: 'ORS + Zinc',
                vaccination: 'Immunization',
                mental_health: 'Mental Health'
            }
        },
        assessment: {
            title: 'Assessment & Diagnosis',
            description: 'Establish the working diagnosis from anamnesis (S) and physical examination (O). Use the appropriate ICD-10 code.',
            icdPlaceholder: 'Search ICD-10 code or disease name...',
            selectedTitle: 'Selected Diagnoses',
            emptySelected: 'No diagnosis selected',
            primaryBadge: '1st'
        },
        procedures: {
            suggestionTitle: 'Procedure Suggestions',
            noSpecificSuggestion: 'No specific procedure suggestion. Use search below if needed.',
            searchPlaceholder: 'Search procedure code or name (example: 99.21 or injection)...',
            selectedTitle: 'Selected Procedures',
            emptySelected: 'No procedures yet',
            commonTitle: 'Common Procedures'
        },
        labs: {
            qualityTitle: 'Quality & Cost Control',
            qualityDescription: 'Each laboratory order reduces the capitation ceiling. Use tests wisely according to clinical indication.',
            maiaTitle: 'MAIA Suggestions',
            maiaConsider: 'Consider ordering: {{items}}',
            maiaNoMore: 'No further laboratory tests are suggested.',
            unsupportedTitle: 'Advanced Tests',
            unsupportedDescription: 'Not available for direct ordering at primary care: {{items}}.',
            catalogTitle: 'Test Catalog',
            commonBadge: 'Common',
            noLabs: 'Limited Lab Facility',
            resultsTitle: 'Laboratory Results',
            recorded: '{{count}} recorded',
            emptySamples: 'No Samples Processed Yet',
            analyzing: 'Analyzing: {{name}}',
            defaultNormalResult: 'Within normal limits',
            resultLabel: 'Result',
            systemNote: 'System Note: No specific EBM indication for this case. JKN cost inefficiency occurred.'
        },
        billing: {
            title: 'Service Billing Details',
            payerBpjs: 'Payer: BPJS',
            payerGeneral: 'General / Self-pay',
            consultation: 'Consultation & Basic Examination',
            labPrefix: 'Lab: {{name}}',
            tableItem: 'Service Item',
            tableUnit: 'Unit Cost',
            tableQty: 'Qty',
            tableSubtotal: 'Subtotal',
            finalTotal: 'Final Bill Total',
            covered: 'Covered by Government / BPJS Health',
            cash: 'Patient Pays Cash'
        },
        treatment: {
            formularyTitle: 'Clinic Formulary',
            searchPlaceholder: 'Search medicine (generic/brand)...',
            maiaRecommendations: 'MAIA Recommendations',
            medicineCatalog: 'Medicine Catalog',
            activePrescription: 'Active Prescription',
            signedStamp: 'Electronically Signed',
            emptyMeds: 'No Medicine Selected',
            signedButton: 'Prescription has been signed',
            signButton: 'Sign Electronic Prescription',
            dosageRule: 'Dosage Instructions',
            timesDaily: '{{count}} x 1 per day',
            duration: 'Treatment Duration',
            days: '{{count}} days',
            totalDispense: 'Total Dispensed:',
            tablets: 'tabs'
        },
        education: {
            title: 'MAIA Smart Guidance',
            searchPlaceholder: 'Search education topic...',
            pillars: {
                lifestyle: {
                    label: 'Lifestyle & Nutrition',
                    desc: 'Diet, activity, habits'
                },
                care: {
                    label: 'Care & Hygiene',
                    desc: 'Wounds, hygiene, prevention'
                },
                medical: {
                    label: 'Medical & Adherence',
                    desc: 'Medication, danger signs, follow-up'
                }
            }
        },
        physical: {
            title: 'Medical Scan System',
            maiaPriority: 'MAIA Priority:',
            standby: 'Standby. Free pattern.',
            coverage: 'Coverage',
            anamnesis: 'Anamnesis',
            guideTitle: 'Guidebook',
            visualTarget: 'Visual Target',
            anatomyAlt: 'Anatomy visual',
            anterior: 'Anterior',
            posterior: 'Posterior',
            diagnosticModules: 'Diagnostic Modules',
            statusPending: 'Status: Pending',
            detected: 'Detected',
            normal: 'Normal',
            target: 'Target',
            telemetryLog: 'Telemetry Log',
            records: '{{count}} records',
            systemStandby: 'System Standby',
            awaitingScan: 'Awaiting scan inputs...'
        },
        history: {
            emptyArchive: 'CPPT Archive Empty',
            nonResident: 'General Patient / Non-resident',
            totalVisits: 'Total Visits: {{count}}',
            cpptTitle: 'What is CPPT?',
            legacyNotes: 'Legacy Notes (Pre-CPPT)',
            actions: {
                refer: 'REFER',
                delegate_to_maia: 'DELEGATE',
                stabilize: 'STABILIZE',
                default: 'TREAT'
            }
        },
        billingSummary: {
            title: 'Billing Summary (Estimate)',
            totalService: 'Total Service Cost',
            patientPay: 'Self-pay (Patient Pay)',
            bpjsCoverage: '{{class}} coverage (JKN)',
            generalCoverage: 'General Patient / No Coverage'
        },
        soap: {
            noAnamnesis: 'No anamnesis data yet...',
            completeness: 'Data Completeness:',
            chiefComplaint: 'CC:',
            unasked: 'Not asked yet: {{items}}',
            noExam: 'No examinations yet...',
            normalChecked: 'Checked (within normal limits)',
            noDiagnosis: 'No diagnosis yet...',
            therapyTitle: 'Prescription & Therapy',
            noMeds: 'No medicines yet...',
            proceduresTitle: 'Actions & Procedures',
            noProcedures: 'No procedures yet...',
            educationTitle: 'Education & Counseling',
            noEducation: 'No education yet...'
        }
    }
};
