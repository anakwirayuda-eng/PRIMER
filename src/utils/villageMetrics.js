import { calculateFamilyIKSPisPk } from '../domains/village/pisPkIndicators.js';

/**
 * Average IKS across a family list. Uses the canonical PIS-PK engine so that
 * families without a pre-computed `iksScore` are still scored from their
 * 12-indikator Kemenkes breakdown (with demographic applicability).
 */
export function calculateAverageIksFromFamilies(families = []) {
    if (!Array.isArray(families) || families.length === 0) {
        return 0;
    }

    const total = families.reduce((sum, family) => {
        return sum + calculateFamilyIKSPisPk(family).iks;
    }, 0);

    return total / families.length;
}
