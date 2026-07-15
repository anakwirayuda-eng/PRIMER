/** Format usia pasien tanpa menampilkan bayi sebagai "0 tahun". */
export function formatUsia(usiaTahun: number, usiaBulan?: number): string {
  if (usiaTahun === 0 && usiaBulan !== undefined) return `${usiaBulan} bulan`
  if (usiaTahun === 0) return '<1 tahun'
  return `${usiaTahun} tahun`
}
