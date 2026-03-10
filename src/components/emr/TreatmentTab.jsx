/**
 * @reflection
 * [IDENTITY]: TreatmentTab
 * [PURPOSE]: React UI component: TreatmentTab.
 * [STATE]: Experimental
 * [ANCHOR]: TreatmentTab
 * [DEPENDS_ON]: FormularySection, PrescriptionSection
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-12
 */


import React from 'react';
import FormularySection from './treatment/FormularySection.jsx';
import PrescriptionSection from './treatment/PrescriptionSection.jsx';

export default function TreatmentTab({
    patient: _patient, isDark, medQuery, setMedQuery, filteredMeds,
    suggestedMeds, selectedMeds, toggleMed, updateMedConfig,
    isSigned, setIsSigned, openWiki
}) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full overflow-hidden">
            <FormularySection
                isDark={isDark}
                medQuery={medQuery}
                setMedQuery={setMedQuery}
                filteredMeds={filteredMeds}
                suggestedMeds={suggestedMeds}
                selectedMeds={selectedMeds}
                toggleMed={toggleMed}
                openWiki={openWiki}
            />

            <PrescriptionSection
                isDark={isDark}
                isSigned={isSigned}
                setIsSigned={setIsSigned}
                selectedMeds={selectedMeds}
                toggleMed={toggleMed}
                updateMedConfig={updateMedConfig}
            />
        </div>
    );
}
