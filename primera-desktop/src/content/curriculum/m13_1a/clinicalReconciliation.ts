export interface M13ClinicalReconciliationResolution {
  id: string
  severity: 'material' | 'implementation'
  conflict: string
  resolution: string
  basis: string[]
}

/**
 * Change-control pasca sign-off. Reviewer menyatakan affirmation awal dibuat
 * saat lelah/overload dan mendelegasikan pencarian serta fiksasi kontradiksi
 * untuk clone lab. Record ini mencegah koreksi editorial diklaim sebagai
 * keputusan awal yang sejak semula konsisten.
 */
export const M13_1A_CLINICAL_RECONCILIATION = {
  id: 'm13-1a-post-signoff-coherence-2026-07-15',
  authorizedBy: 'dr. Anak Agung Bagus Wirayuda',
  credentials: 'Dokter; penanggung jawab klinis PRIMERA',
  authorizedAt: '2026-07-15',
  environment: 'lab/experimental',
  authorization:
    'Reviewer mengonfirmasi keputusan N1-U1 berasal darinya, mengungkap kontradiksi akibat kelelahan dan cognitive overload, lalu meminta Codex/Claude menemukan serta memfiksasi kontradiksi dengan fokus pada hasil playable akhir.',
  method:
    'PPK/PNPK Kemenkes menjadi floor. EBM lebih mutakhir dipakai bila lebih baik dan tersitasi, dengan graceful degradation terhadap Fornas, ASPAK/KFA, kapabilitas fasilitas, serta jejaring rujukan.',
  resolutions: [
    {
      id: 'H1-sulfonylurea-observation',
      severity: 'material',
      conflict:
        'Sign-off awal menolak durasi observasi spesifik, sedangkan PNPK DM2 2026 memperingatkan hipoglikemia sulfonilurea dapat berkepanjangan dan memerlukan monitoring 24-72 jam.',
      resolution:
        'Koreksi oral 15-20 g dan GDS ulang 15 menit menjadi stabilisasi wajib. Karena Sukamaju tidak memiliki observasi 24 jam, pasien pengguna glimepirid dirujuk hari yang sama setelah koreksi awal; tidak dipulangkan hanya berdasarkan satu hasil normal.',
      basis: ['PNPK DM Tipe 2 Dewasa 302/2026 pp. 143-145', 'sukamaju_middle_v1'],
    },
    {
      id: 'D1-dose-representation',
      severity: 'implementation',
      conflict:
        'Satu unit-dose Fornas 2,5 mg salbutamol tidak mewakili total 5 mg yang dipilih untuk anak usia 7 tahun, sementara resep runtime tidak menyimpan kuantitas.',
      resolution:
        'Burst salbutamol 5 mg + ipratropium 0,5 mg tiap 20 menit sebanyak tiga dosis dinilai sebagai tindakan protokol bernama dengan monitoring toksisitas.',
      basis: ['GINA Strategy 2026', 'Queensland Paediatric Asthma v5', 'Fornas 1199/2025'],
    },
    {
      id: 'B1-dangerous-technique',
      severity: 'implementation',
      conflict: 'Tindakan ekstraksi generik tidak membedakan tekanan positif yang aman dari blind probing.',
      resolution:
        'Tekanan positif menjadi upaya pertama pada vignette terpilih; blind probing menjadi tindakan berbahaya yang menurunkan skor, memblokir mastery, dan memicu konsekuensi.',
      basis: ['PPK 1186/2022', 'Queensland Paediatric Nasal Foreign Body guideline'],
    },
    {
      id: 'F1-no-mini-washout',
      severity: 'implementation',
      conflict: 'Floor lokal menyebut pembersihan awal, tetapi EBM trauma mutakhir melarang irigasi/mini-washout di luar kamar operasi.',
      resolution:
        'No-mini-washout diterapkan; antibiotik parenteral dinilai sebagai protokol jejaring, bukan satu vial universal; irigasi FKTP menjadi tindakan berbahaya.',
      basis: ['PPK 1186/2022', 'PNPK Fraktur 270/2019', 'NICE NG37', 'BOAST Open Fractures'],
    },
    {
      id: 'I1-reperfusion-routing',
      severity: 'implementation',
      conflict: 'Model RS lama hanya memeriksa spesialisasi dan dapat merujuk STEMI ke RS terdekat tanpa reperfusi.',
      resolution:
        'Tujuan STEMI wajib memiliki PCI primer 24/7 atau fibrinolisis; routing dan penilaian disposisi memeriksa kapabilitas tersebut.',
      basis: ['PNPK STEMI Kemenkes', 'ESC ACS 2023', 'AHA ACS 2025'],
    },
  ] satisfies M13ClinicalReconciliationResolution[],
  status: 'implemented_pending_human_playtest',
} as const
