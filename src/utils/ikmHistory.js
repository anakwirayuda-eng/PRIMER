function formatRupiah(value) {
    return `Rp ${Math.abs(Number(value) || 0).toLocaleString('id-ID')}`;
}

function formatRiskName(key) {
    const normalized = String(key || '').trim().toLowerCase();
    if (!normalized) return 'komunitas';
    if (normalized === 'ispa') return 'ISPA';
    if (normalized === 'dbd') return 'DBD';
    return normalized.replaceAll('_', ' ');
}

export function formatIkmImpactSummary(impact = {}) {
    const parts = [];
    const balance = Number(impact?.balance || 0);
    const iksScore = Number(impact?.iks_score || 0);
    const spawnedCases = Number(impact?.spawnPatients?.amount || 0);

    if (balance < 0) {
        parts.push(`Biaya ${formatRupiah(balance)}`);
    } else if (balance > 0) {
        parts.push(`Dana +${formatRupiah(balance)}`);
    }

    if (iksScore !== 0) {
        parts.push(`IKS ${iksScore > 0 ? '+' : ''}${iksScore}`);
    }

    if (impact?.outbreak_risk_reduction) {
        parts.push(`Risiko ${formatRiskName(impact.outbreak_risk_reduction)} turun`);
    }

    if (impact?.outbreak_risk) {
        parts.push(`Risiko ${formatRiskName(impact.outbreak_risk)} naik`);
    }

    if (spawnedCases > 0) {
        parts.push(`Kasus baru +${spawnedCases}`);
    }

    return parts.join(' • ') || 'Intervensi komunitas tercatat.';
}

export function getIkmOutcomeStatus(outcomeKey) {
    if (outcomeKey === 'failure') return 'ikm_failure';
    if (outcomeKey === 'partial') return 'ikm_partial';
    return 'ikm_success';
}
