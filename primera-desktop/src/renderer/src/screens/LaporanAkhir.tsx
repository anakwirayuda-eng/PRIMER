/**
 * LAPORAN AKHIR STASE (M5.23) — layar sinematik saat tamat: grade stempel,
 * count-up 4 dimensi, statistik perjalanan, badge (M5.24), epilog keluarga
 * binaan, dan ekspor arsip JSON (M5.25). Semua angka dari engine; layar ini
 * hanya merayakannya.
 */

import { useEffect, useMemo, useState } from 'react'
import { useGame } from '../store'
import { useMotionDikurangi } from '../useMotionDikurangi'
import { hitungSkor } from '@engine/director'
import { hitungBadge, SEMUA_BADGE } from '@engine/badge'
import { HARI_STASE } from '@engine/paketUjian'
import { serialize } from '@engine/save'
import { susunDossier } from '@engine/verifikasi'
import { PACK } from '@content/index'
import './LaporanAkhir.css'

/** Count-up sederhana: 0 → target dalam ~1,2 detik (ease-out). Lompat langsung bila gerak dikurangi. */
function useCountUp(target: number, mulai: boolean, kurangiGerak: boolean): number {
  const [nilai, setNilai] = useState(0)
  useEffect(() => {
    if (!mulai) return
    if (kurangiGerak) {
      setNilai(target)
      return
    }
    let raf = 0
    const t0 = performance.now()
    const durasi = 1200
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / durasi)
      setNilai(target * (1 - Math.pow(1 - p, 3)))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, mulai, kurangiGerak])
  return nilai
}

// CODEX audit 2026-07-04 (ronde-6): 'stempel--daun' tak pernah ada di base.css
// (cuma hijau/merah/kunyit/biru) — grade B jatuh ke warna tak terdefinisi.
// Samakan dgn WARNA_STEMPEL di Rapor.tsx (referensi yang sudah benar).
const STEMPEL_GRADE: Record<string, string> = {
  A: 'stempel--hijau',
  B: 'stempel--biru',
  C: 'stempel--kunyit',
  D: 'stempel--merah',
}

export function LaporanAkhir() {
  const state = useGame((s) => s.state)!
  const dispatch = useGame((s) => s.dispatch)
  const kurangiGerak = useMotionDikurangi()
  const [babak, setBabak] = useState(0) // 0 stempel → 1 dimensi → 2 sisanya

  useEffect(() => {
    if (kurangiGerak) {
      setBabak(2) // tampilkan semua babak langsung, tanpa jeda dramatis
      return
    }
    const t1 = setTimeout(() => setBabak(1), 900)
    const t2 = setTimeout(() => setBabak(2), 2300)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [kurangiGerak])

  const skor = useMemo(() => hitungSkor(state), [state])
  const badges = useMemo(() => hitungBadge(state), [state])
  const t = state.tally

  const ukp = useCountUp(skor.ukp, babak >= 1, kurangiGerak)
  const ukm = useCountUp(skor.ukm, babak >= 1, kurangiGerak)
  const mnj = useCountUp(skor.manajemen, babak >= 1, kurangiGerak)
  const res = useCountUp(skor.resiliensi, babak >= 1, kurangiGerak)
  const total = useCountUp(skor.total, babak >= 1, kurangiGerak)

  // CODEX audit 2026-07-04: dulu dihitung ulang di sini dari diagnosisBenar/
  // totalPasien saja — beda dari formula resmi (scoring.ts) yang penyebutnya
  // totalPasien+autoBermasalah (anti cherry-picking). Pakai skor.akurasiDiagnosis
  // supaya angka di layar ini SELALU sama dgn yang menentukan UKP.
  const akurasi = Math.round(skor.rincian.akurasiDiagnosis)

  // Epilog keluarga: binaan dulu (cerita penuh), lalu ringkasan sisanya.
  const keluargaCerita = Object.values(state.desa.keluarga)
    .filter((k) => k.arcSelesai !== undefined)
    .sort((a, b) => (a.arcSelesai === 'berhasil' ? -1 : 1) - (b.arcSelesai === 'berhasil' ? -1 : 1))

  const unduh = (isi: string, nama: string) => {
    const blob = new Blob([isi], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = nama
    a.click()
    URL.revokeObjectURL(url)
  }

  const eksporArsip = () => {
    unduh(serialize(state), `primer_${state.mode}_${state.namaDokter.replace(/\s+/g, '_')}_H${state.hari}.json`)
  }

  // M6.27 — Dossier Mahasiswa: bukti hasil stase yang bisa diverifikasi dosen
  // (replay + tanda tangan). Berbeda dari Arsip (save utk melanjutkan main).
  const [nim, setNim] = useState('')
  const eksporDossier = async () => {
    const versiApp = await window.primer.appVersion()
    const dossier = await susunDossier(state, PACK, { versiApp, ...(nim.trim() ? { nim: nim.trim() } : {}) })
    unduh(
      JSON.stringify(dossier),
      `dossier_${state.mode}_${state.paketUjian ?? 'karier'}_${state.namaDokter.replace(/\s+/g, '_')}.primer-dossier.json`,
    )
  }

  const dimensi = [
    { label: 'UKP — Klinik', nilai: ukp, maks: 35 },
    { label: 'UKM — Desa', nilai: ukm, maks: 35 },
    { label: 'Manajemen', nilai: mnj, maks: 15 },
    { label: 'Resiliensi', nilai: res, maks: 15 },
  ]

  return (
    <div className="laporan">
      <div className="laporan__panel kertas">
        <p className="laporan__kicker mono">
          {state.mode === 'ujian'
            ? `LAPORAN AKHIR STASE UJIAN · ${state.paketUjian?.toUpperCase() ?? ''} · ${HARI_STASE.ujian} HARI`
            : `LAPORAN AKHIR STASE · ${HARI_STASE.karier} HARI`}
        </p>
        <h1 className="laporan__judul">dr. {state.namaDokter}</h1>
        <p className="teks-lembut">Puskesmas Sukamaju · {t.totalPasien} pasien · {t.kunjunganTotal} kunjungan rumah</p>

        {/* Babak 0: stempel grade jatuh */}
        <div className="laporan__grade">
          <span className={`stempel stempel--jatuh laporan__stempel ${STEMPEL_GRADE[state.tamat?.grade ?? 'C']}`}>
            {state.tamat?.grade} · {skor.gradeLabel}
          </span>
          {babak >= 1 && (
            <span className="laporan__total mono">
              {total.toFixed(1)} <span className="teks-lembut">/ 100</span>
            </span>
          )}
        </div>

        {/* Babak 1: count-up 4 dimensi */}
        {babak >= 1 && (
          <div className="laporan__dimensi">
            {dimensi.map((d) => (
              <div key={d.label} className="kartu laporan__dim">
                <div className="baris baris--antara">
                  <span className="teks-kecil">{d.label}</span>
                  <span className="mono teks-kecil">
                    {d.nilai.toFixed(1)}/{d.maks}
                  </span>
                </div>
                <div className="meter">
                  <div className="meter__isi" style={{ width: `${(d.nilai / d.maks) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Babak 2: statistik + badge + epilog */}
        {babak >= 2 && (
          <div className="laporan__isi">
            <div className="laporan__statistik mono teks-xs">
              <span>Akurasi diagnosis {akurasi}%</span>
              <span>Rujukan tepat {t.rujukanTepat}</span>
              <span>Krisis dicegah {t.karmaDicegah}</span>
              <span>Krisis terjadi {t.karmaTerjadi}</span>
              <span>IGD stabil {t.igdStabil}</span>
              <span>Kode Hitam {t.igdMeninggal}</span>
              {state.akreditasi && <span>Akreditasi {state.akreditasi.toUpperCase()}</span>}
              <span>Teguran Dinkes {t.teguranDinkes}</span>
            </div>

            {/* Badge M5.24 */}
            <div className="laporan__badges">
              {SEMUA_BADGE.map((b) => {
                const raih = badges.includes(b.id)
                return (
                  <div
                    key={b.id}
                    className={`laporan__badge ${raih ? 'laporan__badge--raih' : ''}`}
                    title={`${b.nama} — ${b.deskripsi}${raih ? '' : ' (belum diraih)'}`}
                  >
                    <span className="laporan__badge-ikon">{b.ikon}</span>
                    <span className="teks-xs">{b.nama}</span>
                  </div>
                )
              })}
            </div>

            {/* Epilog keluarga binaan */}
            {keluargaCerita.length > 0 && (
              <div className="laporan__epilog">
                <h2 className="judul-seksi">Kabar dari Desa</h2>
                {keluargaCerita.map((k) => {
                  const konten = PACK.keluarga[k.id]
                  if (!konten) return null
                  const berhasil = k.arcSelesai === 'berhasil'
                  return (
                    <div key={k.id} className="kartu laporan__kel">
                      <div className="baris baris--antara">
                        <strong className="teks-kecil">{konten.namaKeluarga}</strong>
                        <span className={`chip ${berhasil ? 'chip--daun' : 'chip--merah'}`}>
                          {berhasil ? 'Berubah' : 'Krisis'}
                        </span>
                      </div>
                      <p className="teks-xs laporan__epilog-teks">
                        {berhasil ? konten.arc.epilogBerhasil : konten.arc.epilogGagal}
                      </p>
                    </div>
                  )
                })}
              </div>
            )}

            <div className="kartu laporan__dossier">
              <div className="judul-seksi">Setor ke Dosen — Dossier Mahasiswa</div>
              <div className="baris">
                {state.nim ? (
                  // Ujian: NIM sudah terikat identitas sejak awal — tak bisa diubah.
                  <span className="laporan__nim-terikat" aria-label="NIM mahasiswa">
                    NIM <strong>{state.nim}</strong>
                  </span>
                ) : (
                  <input
                    className="laporan__nim"
                    type="text"
                    value={nim}
                    onChange={(e) => setNim(e.target.value)}
                    placeholder="NIM (opsional)"
                    aria-label="NIM mahasiswa"
                  />
                )}
                <button className="tombol tombol--utama" onClick={() => void eksporDossier()}>
                  Ekspor Dossier Mahasiswa
                </button>
              </div>
              <p className="teks-xs teks-lembut">
                Dossier berisi identitas, skor, dan jejak seluruh keputusanmu — dosen memverifikasinya
                dengan mereplay jejak di game yang sama (menu &ldquo;Verifikasi Dossier&rdquo; di layar judul).
                Skor tidak bisa diubah lagi.
              </p>
            </div>

            <div className="baris laporan__aksi">
              <button className="tombol" onClick={eksporArsip}>
                Ekspor Arsip Save (JSON)
              </button>
              <button className="tombol" onClick={() => dispatch({ type: 'PINDAH_LAYAR', layar: 'rapor' })}>
                Lihat Rapor Rinci
              </button>
              <button className="tombol tombol--senyap" onClick={() => dispatch({ type: 'PINDAH_LAYAR', layar: 'meja' })}>
                Kembali ke Meja
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
