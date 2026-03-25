export function calculateAverageIksFromFamilies(families = []) {
    if (!Array.isArray(families) || families.length === 0) {
        return 0;
    }

    return families.reduce((sum, family) => sum + (family?.iksScore || 0), 0) / families.length;
}
