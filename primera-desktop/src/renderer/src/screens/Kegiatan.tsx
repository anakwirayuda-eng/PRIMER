/**
 * KEGIATAN LAPANGAN (M2) — layar sesi generik untuk Posyandu / Prolanis / KLB.
 * Dek kartu keputusan: baca narasi, pilih, dapat umpan balik pedagogis, lanjut.
 * Semua aturan (skor, drift, bridge) di engine — layar hanya menyetir sesi.
 */

import { useEffect, useMemo, useRef, useState } from 'react'
import { useGame } from '../store'
import type { HasilKegiatan } from '@engine/kegiatan'
import { acakUrutan } from '../utils/acakUrutan'
import './Kegiatan.css'

const JUDUL: Record<string, { label: string; sub: string }> = {
  // Fix #15 (audit CODEX 2026-07-11): label lama "Sistem 5 Meja — balita &
  // imunisasi" tersisa dari sebelum migrasi Posyandu ke ILP "5 Langkah"
  // (seluruh siklus hidup, bukan cuma balita) — teks UI tak ikut update.
  posyandu: { label: 'POSYANDU', sub: 'ILP 5 Langkah — seluruh siklus hidup' },
  prolanis: { label: 'PROLANIS', sub: 'Pemantauan penyakit kronis bulanan' },
  klb: { label: 'RESPONS KLB', sub: 'Penyelidikan & pengendalian wabah' },
}

export function Kegiatan() {
  const state = useGame((s) => s.state)!
  const dispatch = useGame((s) => s.dispatch)
  const lastEvents = useGame((s) => s.lastEvents)
  const eventTick = useGame((s) => s.eventTick)

  const [hasil, setHasil] = useState<HasilKegiatan | null>(null)
  const [pilihanTerpilih, setPilihanTerpilih] = useState<string | null>(null)
  const tickRef = useRef(-1)

  const kg = state.kegiatan
  // CODEX ronde-13: `kg.kartu` bisa korup (mis. null) meski `kg` sendiri ada —
  // indexing langsung di sini crash SEBELUM guard `!kg || !kartu` di bawah
  // sempat jalan. Array.isArray dulu, baru index.
  const kartu = kg && Array.isArray(kg.kartu) ? kg.kartu[kg.index] : undefined

  // Sesi selesai → reducer memindah layar ke peta; sambut dengan kartu hasil.
  useEffect(() => {
    if (tickRef.current === eventTick) return
    tickRef.current = eventTick
    for (const e of lastEvents) if (e.type === 'KEGIATAN_SELESAI') setHasil(e.hasil)
  }, [eventTick, lastEvents])

  // Reset umpan balik saat pindah kartu.
  useEffect(() => {
    setPilihanTerpilih(null)
  }, [kg?.index])

  // CODEX M14 #14c: pindah kartu meng-unmount tombol sebelumnya → fokus jatuh ke
  // <body>. Pindahkan ke panel (pola DeckAksi). Dipasang ref di bawah.
  const panelRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    panelRef.current?.focus({ preventScroll: true })
  }, [kg?.index])

  // DeepThink ronde-2 bonus (keputusan user): urutan pilihan diacak per-
  // mahasiswa (rngFlavor = state.seed) — walkthrough "klik posisi ke-2" tak
  // lagi seragam lintas-siswa. Hook TANPA SYARAT, sebelum guard di bawah.
  const pilihanAcak = useMemo(
    () => (kartu && Array.isArray(kartu.pilihan) ? acakUrutan(kartu.pilihan, state.seed, kartu.id) : []),
    [kartu, state.seed],
  )

  // CODEX M14 #11: tampilkan KartuHasil dari hasil live (event) ATAU hasil
  // terpersist (state.hasilKegiatanTerakhir, bertahan reload) — HANYA saat tak
  // ada sesi aktif (`!kg`), agar sesi BARU tak tertutup hasil sesi lama yg masih
  // tersimpan. state-based = sinkron saat render → tak flash fallback "tak ada sesi".
  const hasilTampil = hasil ?? state.hasilKegiatanTerakhir
  if (hasilTampil && !kg)
    return <KartuHasil hasil={hasilTampil} onTutup={() => dispatch({ type: 'PINDAH_LAYAR', layar: 'peta' })} />
  // CODEX ronde-11 #4: `layar==='kegiatan'` tanpa `state.kegiatan` (mis. save
  // korup) dulu me-return null diam-diam — blank screen TANPA throw, luput dari
  // ErrorBoundary. Beri jalan keluar eksplisit, bukan kosong.
  // CODEX ronde-13: `kartu.pilihan` korup (bukan array) crash di `.find`/`.map`
  // bawah bila lolos sampai sini — masukkan ke guard yang sama.
  if (!kg || !kartu || !Array.isArray(kartu.pilihan)) {
    return (
      <div className="layar-tak-dikenal">
        <p>Sesi kegiatan lapangan tidak ditemukan.</p>
        <button className="tombol" onClick={() => dispatch({ type: 'PINDAH_LAYAR', layar: 'peta' })}>
          Kembali ke Peta Desa
        </button>
      </div>
    )
  }

  const meta = JUDUL[kg.jenis] ?? { label: 'KEGIATAN', sub: '' }
  const pilihanObj = pilihanTerpilih ? kartu.pilihan.find((p) => p.id === pilihanTerpilih) : null

  return (
    <div className="kegiatan">
      <div className="kegiatan__panel kertas" ref={panelRef} tabIndex={-1}>
        <div className="kegiatan__kepala">
          <div>
            <div className="kegiatan__label mono">{meta.label}</div>
            <div className="teks-xs teks-lembut">{meta.sub}</div>
          </div>
          <div className="kegiatan__langkah mono">
            Kartu {kg.index + 1}/{kg.kartu.length}
          </div>
        </div>

        <div className="kegiatan__kartu">
          <div className="judul-seksi">{kartu.judul}</div>
          <p className="kegiatan__narasi">{kartu.narasi}</p>

          <div className="kegiatan__pilihan">
            {pilihanAcak.map((p) => {
              const dipilih = pilihanTerpilih === p.id
              const nadaKelas = dipilih ? (p.benar ? 'kegiatan__opsi--benar' : 'kegiatan__opsi--salah') : ''
              return (
                <button
                  key={p.id}
                  className={`kegiatan__opsi ${nadaKelas}`}
                  disabled={pilihanTerpilih !== null}
                  onClick={() => setPilihanTerpilih(p.id)}
                >
                  {p.label}
                </button>
              )
            })}
          </div>

          {pilihanObj && (
            /* M10 Batch-2 (CODEX A.1): live region — respons kartu diumumkan SR. */
            <div className={`kegiatan__respons ${pilihanObj.benar ? 'kegiatan__respons--benar' : 'kegiatan__respons--salah'}`} role="status" aria-live="polite">
              <span className="stempel stempel--kecil">{pilihanObj.benar ? 'TEPAT' : 'KELIRU'}</span>
              <p>{pilihanObj.respons}</p>
              <button
                className="tombol tombol--utama"
                onClick={() =>
                  dispatch({ type: 'JAWAB_KEGIATAN', kartuId: kartu.id, pilihanId: pilihanObj.id })
                }
              >
                {kg.index + 1 >= kg.kartu.length ? 'Tutup Sesi →' : 'Kartu Berikutnya →'}
              </button>
            </div>
          )}

          {kg.jenis === 'posyandu' && pilihanTerpilih === null && (
            <button
              className="tombol tombol--senyap kegiatan__delegasi"
              onClick={() => dispatch({ type: 'DELEGASI_KEGIATAN' })}
              title="Serahkan sisa meja ke kader. Cepat, tapi kader manusia — sekitar 20% keputusan bisa keliru."
            >
              Delegasikan sisa meja ke kader (risiko ~20% keliru)
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function KartuHasil({ hasil, onTutup }: { hasil: HasilKegiatan; onTutup: () => void }) {
  const meta = JUDUL[hasil.jenis] ?? { label: 'KEGIATAN', sub: '' }
  const persen = Math.round(hasil.skor * 100)
  const nada = hasil.skor >= 0.8 ? 'baik' : hasil.skor >= 0.5 ? 'cukup' : 'kurang'
  return (
    <div className="kegiatan">
      <div className="kegiatan__panel kertas kegiatan__hasil">
        <div className={`kegiatan__hasil-cap kegiatan__hasil-cap--${nada}`}>
          <span className="stempel stempel--jatuh">{meta.label} SELESAI</span>
        </div>
        <div className="kegiatan__skor mono">
          {hasil.benar}/{hasil.total} keputusan tepat · {persen}%
        </div>
        <p className="teks-kecil teks-lembut">
          {/* Fix #15 (audit CODEX 2026-07-11): narasi lama TANPA syarat skor —
              sesi yang keputusannya semua salah (skor 0) tetap mengklaim "IKS
              membaik", padahal engine tak menerangkut apa pun ke wilayah bila
              tak ada keputusan tepat. Pola sama cabang KLB di bawah. */}
          {hasil.jenis === 'posyandu' &&
            (hasil.skor > 0
              ? 'Kualitas posyandu terangkut ke IKS wilayah — gizi & imunisasi RW ini membaik sedikit demi sedikit.'
              : 'Sesi posyandu ini belum menyumbang perbaikan apa pun — tak ada keputusan tepat yang terangkut ke IKS wilayah.')}
          {hasil.jenis === 'prolanis' &&
            'Parameter tiap peserta bergerak menurut keputusanmu. Yang dua bulan berturut tak terkontrol akan berujung di poli — pantau bulan depan.'}
          {hasil.jenis === 'klb' &&
            (hasil.skor >= 0.66
              ? 'Kluster ditanggulangi: penularan di wilayah diputus, IKS RW terangkat.'
              : 'Respons belum tuntas — kluster masih menyala. Coba lagi dengan pendekatan yang benar.')}
        </p>
        <button className="tombol tombol--utama tombol--besar" onClick={onTutup}>
          Kembali ke Peta Desa
        </button>
      </div>
    </div>
  )
}
