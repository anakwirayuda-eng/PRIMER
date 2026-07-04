/**
 * IGD (M3.14) — layar gawat darurat turn-based. Interrupt: tampil saat state.igd
 * ada, memblokir aksi lain. Bar stabilitas + langkah keputusan + Kode Biru + disposisi.
 * Semua aturan di engine; layar hanya menyetir & memberi juice.
 */

import { useMemo } from 'react'
import { useGame } from '../store'
import { PACK } from '@content/index'
import { acakUrutan } from '../utils/acakUrutan'
import './Igd.css'

export function Igd() {
  const state = useGame((s) => s.state)!
  const dispatch = useGame((s) => s.dispatch)
  const igd = state.igd
  const kasusMaybe = igd ? PACK.kasusIgd[igd.kasusId] : undefined
  const langkahMaybe = igd && kasusMaybe ? kasusMaybe.langkah[igd.langkahIndex] : undefined
  // DeepThink ronde-2 bonus (keputusan user): urutan pilihan diacak per-
  // mahasiswa (rngFlavor = state.seed) supaya walkthrough "klik posisi ke-2"
  // tak lagi seragam lintas-siswa. Hook dipanggil TANPA SYARAT (aturan hook)
  // — di atas guard "sesi ditemukan?" di bawah, bukan sesudahnya.
  const pilihanAcak = useMemo(
    () =>
      langkahMaybe ? acakUrutan(langkahMaybe.pilihan, state.seed, igd?.kasusId ?? '', langkahMaybe.id) : [],
    [langkahMaybe, state.seed, igd?.kasusId],
  )
  // CODEX ronde-11 #4: pola sama Kegiatan.tsx — blank diam-diam tanpa throw
  // luput ErrorBoundary. save.ts sudah memulihkan IGD dgn kasusId tak dikenal
  // saat load, ini jaring terakhir bila tetap tercapai (mis. state in-memory).
  if (!igd || !kasusMaybe) {
    return (
      <div className="layar-tak-dikenal">
        <p>Sesi IGD tidak ditemukan.</p>
        <button className="tombol" onClick={() => dispatch({ type: 'PINDAH_LAYAR', layar: 'meja' })}>
          Kembali ke Meja Kerja
        </button>
      </div>
    )
  }
  const kasus = kasusMaybe

  const stab = igd.stabilitas
  const nadaBar = stab > 60 ? '' : stab > 30 ? 'igd-bar--waspada' : 'igd-bar--bahaya'
  const langkah = langkahMaybe

  return (
    <div className="igd">
      <div className="igd__panel kertas">
        {/* Header pasien + stabilitas */}
        <div className="igd__kepala">
          <div>
            <div className="igd__label mono">⛑ INSTALASI GAWAT DARURAT</div>
            <div className="igd__pasien">
              {igd.pasienNama} · {igd.usia} th · {igd.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
            </div>
            {/* Nama diagnosis & ICD-10 disembunyikan selama pemain masih bernalar
                (fase langkah/kode_biru) — baru terungkap di disposisi/debrief,
                supaya keputusan dibangun dari keluhan & vital, bukan kunci jawaban. */}
            {igd.fase === 'disposisi' ? (
              <div className="teks-xs teks-lembut">{kasus.nama} · ICD-10 {kasus.icd10}</div>
            ) : (
              <div className="teks-xs teks-lembut">Kasus gawat darurat — kenali dari keluhan &amp; tanda vital</div>
            )}
          </div>
          <div className="igd__stab">
            <div className="teks-xs teks-lembut mono">STABILITAS</div>
            <div className="igd-bar">
              <div className={`igd-bar__isi ${nadaBar}`} style={{ width: `${stab}%` }} />
            </div>
            <div className={`igd__stab-angka mono ${nadaBar}`}>{stab}</div>
          </div>
        </div>

        {/* Vital awal */}
        <div className="igd__vital mono teks-xs">
          {kasus.vitalAwal.td && <span>TD {kasus.vitalAwal.td}</span>}
          {kasus.vitalAwal.nadi && <span>N {kasus.vitalAwal.nadi}×</span>}
          {kasus.vitalAwal.rr && <span>RR {kasus.vitalAwal.rr}×</span>}
          {kasus.vitalAwal.spo2 && <span>SpO₂ {kasus.vitalAwal.spo2}%</span>}
          {kasus.vitalAwal.suhu && <span>S {kasus.vitalAwal.suhu}°</span>}
          {kasus.vitalAwal.gds && <span>GDS {kasus.vitalAwal.gds}</span>}
        </div>

        {/* Fase: langkah keputusan */}
        {igd.fase === 'langkah' && langkah && (
          <div className="igd__isi">
            {igd.langkahIndex === 0 && <p className="igd__narasi igd__narasi--pembuka">{kasus.pembuka}</p>}
            <div className="judul-seksi">
              Langkah {igd.langkahIndex + 1}/{kasus.langkah.length}
            </div>
            <p className="igd__narasi">{langkah.narasi}</p>
            <div className="igd__pilihan">
              {pilihanAcak.map((p) => (
                <button
                  key={p.id}
                  className="igd__opsi"
                  onClick={() => dispatch({ type: 'AKSI_IGD', langkahId: langkah.id, pilihanId: p.id })}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <ResponsTerakhir kasusId={igd.kasusId} langkahIndex={igd.langkahIndex} jawaban={igd.jawaban} />
          </div>
        )}

        {/* Fase: Kode Biru */}
        {igd.fase === 'kode_biru' && (
          <div className="igd__isi igd__kodebiru">
            <div className="igd__kodebiru-judul">KODE BIRU</div>
            <p className="igd__narasi">
              Stabilitas {igd.pasienNama} habis — henti napas/jantung! Mulai Resusitasi Jantung Paru sekarang.
              Kualitas kompresi menentukan peluang kembalinya sirkulasi.
            </p>
            <div className="igd__pilihan">
              <button className="igd__opsi igd__opsi--rjp" onClick={() => dispatch({ type: 'RJP_IGD', berkualitas: true })}>
                RJP berkualitas: kompresi 100–120×/menit, kedalaman 5 cm, minim interupsi
              </button>
              <button className="igd__opsi" onClick={() => dispatch({ type: 'RJP_IGD', berkualitas: false })}>
                Kompresi seadanya sambil menunggu bantuan
              </button>
            </div>
          </div>
        )}

        {/* Fase: disposisi */}
        {igd.fase === 'disposisi' && (
          <div className="igd__isi">
            <div className="judul-seksi">Pasien Stabil — Disposisi</div>
            <p className="igd__narasi">
              {igd.pasienNama} sudah tertangani dan stabil. Apa langkah berikutnya sesuai prinsip rujukan berjenjang?
            </p>
            <div className="igd__pilihan">
              <button
                className="igd__opsi"
                onClick={() =>
                  dispatch({
                    type: 'DISPOSISI_IGD',
                    jenis: 'rujuk',
                    ...(kasus.spesialisRujukan
                      ? { rumahSakitId: [...PACK.rumahSakit].filter((r) => r.spesialisasi.includes(kasus.spesialisRujukan!)).sort((a, b) => a.jarakMenit - b.jarakMenit)[0]?.id }
                      : {}),
                  })
                }
              >
                Rujuk ke RS (dengan surat + stabilisasi berjalan)
              </button>
              <button className="igd__opsi" onClick={() => dispatch({ type: 'DISPOSISI_IGD', jenis: 'pulang' })}>
                Observasi lalu pulangkan dari Puskesmas
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/** Umpan balik pilihan terakhir (dibaca dari jawaban tercatat + konten). */
function ResponsTerakhir({
  kasusId,
  langkahIndex,
  jawaban,
}: {
  kasusId: string
  langkahIndex: number
  jawaban: { langkahId: string; pilihanId: string; benar: boolean }[]
}) {
  // CODEX ronde-13: `igd.jawaban` bisa korup (bukan array) meski `igd` sendiri
  // lolos guard bail-out di komponen induk — cegah crash `.length`/indexing.
  if (langkahIndex === 0 || !Array.isArray(jawaban) || jawaban.length === 0) return null
  const terakhir = jawaban[jawaban.length - 1]
  if (!terakhir) return null
  const kasus = PACK.kasusIgd[kasusId]
  const langkah = kasus?.langkah.find((l) => l.id === terakhir.langkahId)
  const pilihan = langkah?.pilihan.find((p) => p.id === terakhir.pilihanId)
  if (!pilihan) return null
  return (
    <div className={`igd__respons ${pilihan.benar ? 'igd__respons--benar' : 'igd__respons--salah'}`}>
      <span className="stempel stempel--kecil">{pilihan.benar ? 'TEPAT' : 'KELIRU'}</span>
      <p>{pilihan.respons}</p>
    </div>
  )
}
