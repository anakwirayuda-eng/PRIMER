/**
 * @reflection
 * [IDENTITY]: CaseIndicators
 * [PURPOSE]: Centralized mapping of ICD-10 codes/Case IDs to IKS (Indikator Keluarga Sehat) indicators.
 * [STATE]: Stable
 */

export const ICD_IKS_MAPPING = {
    // TB Indicators (A15-A16)
    'A15': 'tb',
    'A16': 'tb',

    // Hypertension Indicators (I10-I11)
    'I10': 'hipertensi',
    'I11': 'hipertensi',

    // Nutrition/Stunting Indicators
    'E40': 'gizi',
    'E41': 'gizi',
    'E44': 'gizi',
    'E45': 'gizi',

    // Sanitation/Diarrhea Indicators
    'A09': 'jamban',

    // Respiratory/Smoking Indicators (Selected acute cases)
    'J00': 'rokok',
    'J06': 'rokok'
};

/**
 * Resolves which IKS indicator should be updated based on a diagnosis code.
 * @param {string} dxCode - ICD-10 code
 * @returns {string|null} The IKS indicator key (e.g., 'tb', 'hipertensi')
 */
export function getIndicatorByDx(dxCode) {
    if (!dxCode) return null;

    // Exact prefix match (e.g., A15.1 matches A15)
    const prefix3 = dxCode.substring(0, 3);
    if (ICD_IKS_MAPPING[prefix3]) return ICD_IKS_MAPPING[prefix3];

    // Direct match
    if (ICD_IKS_MAPPING[dxCode]) return ICD_IKS_MAPPING[dxCode];

    return null;
}
