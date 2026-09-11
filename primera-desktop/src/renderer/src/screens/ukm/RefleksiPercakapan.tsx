import { useGame } from '../../store'

export function RefleksiPercakapan() {
  const rekap = useGame((s) => s.rekapUkm)
  const state = useGame((s) => s.state)
  if (!state || rekap?.jenis !== 'kunjungan' || rekap.hari !== state.hari || rekap.keluargaId !== state.hasilKunjunganHariIni?.keluargaId || !rekap.gaya.length) return null
  return <details className="lab-details"><summary>Refleksi cara berbicara</summary>
    <p>Gaya percakapan yang kamu gunakan: {[...new Set(rekap.gaya)].join(', ')}.</p>
    <p>Label merangkum bentuk percakapan dalam simulasi. Perhatikan waktu, kebutuhan keluarga, dan respons mereka; label saja tidak menentukan mutu komunikasi klinis.</p>
  </details>
}
