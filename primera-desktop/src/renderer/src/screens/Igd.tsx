/**
 * IGD (M3.14) — layar gawat darurat turn-based. Interrupt: tampil saat state.igd
 * ada, memblokir aksi lain. Bar stabilitas + langkah keputusan + Kode Biru + disposisi.
 * Semua aturan di engine; layar hanya menyetir & memberi juice.
 */

import { useEffect, useMemo, useRef, useState } from 'react'
import { useGame } from '../store'
import { PACK } from '@content/index'
import { acakUrutan } from '../utils/acakUrutan'
import { AMBANG_STABIL_RUJUK } from '@engine/igd'
import { formatUsia } from '@engine/usia'
import './Igd.css'

export function Igd() {
  const state = useGame((s) => s.state)!
  const dispatch = useGame((s) => s.dispatch)
  const igd = state.igd
  // CODEX M14 #14c: tiap pergantian fase (langkah→kode_biru→disposisi) set tombol
  // berganti total — fokus jatuh ke <body>. Pindahkan ke panel ini (pola DeckAksi).
  const panelRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    panelRef.current?.focus({ preventScroll: true })
  }, [igd?.fase])
  const [rumahSakitId, setRumahSakitId] = useState('')
  useEffect(() => setRumahSakitId(''), [igd?.kasusId])
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
  const jejaringRujukan = [...PACK.rumahSakit].sort((a, b) => a.jarakMenit - b.jarakMenit)
  const rsRujukan = jejaringRujukan.find((rumahSakit) => rumahSakit.id === rumahSakitId)

  const stab = igd.stabilitas
  const nadaBar = stab > 60 ? '' : stab > 30 ? 'igd-bar--waspada' : 'igd-bar--bahaya'
  const langkah = langkahMaybe

  return (
    <div className="igd">
      <div className="igd__panel kertas" ref={panelRef} tabIndex={-1}>
        {/* Header pasien + stabilitas */}
        <div className="igd__kepala">
          <div>
            <div className="igd__label mono">⛑ INSTALASI GAWAT DARURAT</div>
            <div className="igd__pasien">
              {igd.pasienNama} · {formatUsia(igd.usia, igd.usiaBulan)} · {igd.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
            </div>
            {/* Nama diagnosis & ICD-10 disembunyikan selama pemain masih bernalar
                (fase langkah/kode_biru) — baru terungkap di disposisi/debrief,
                supaya keputusan dibangun dari keluhan & vital, bukan kunci jawaban.
                CODEX fix #2: pasca_rosc ikut mengungkap — tebak-tebakan sudah
                usai begitu Kode Biru selesai, stabilisasi lanjutan bukan lagi
                soal diagnosis-tersembunyi. */}
            {igd.fase === 'disposisi' || igd.fase === 'pasca_rosc' ? (
              <div className="teks-xs teks-lembut">{kasus.nama} · ICD-10 {kasus.icd10}</div>
            ) : (
              <div className="teks-xs teks-lembut">Kasus gawat darurat — kenali dari keluhan &amp; tanda vital</div>
            )}
            {kasus.activationStatus === 'lab_prototype_unadjudicated' && (
              <span
                className="chip chip--kunyit"
                title="Kasus ini aktif hanya di lab pengembangan dan belum melewati adjudikasi klinis final."
              >
                Prototipe lab
              </span>
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
        <div className="igd__vital mono">
          {kasus.vitalAwal.td && <span>TD {kasus.vitalAwal.td}</span>}
          {kasus.vitalAwal.nadi && <span>N {kasus.vitalAwal.nadi}×</span>}
          {kasus.vitalAwal.rr && <span>RR {kasus.vitalAwal.rr}×</span>}
          {kasus.vitalAwal.spo2 && <span>SpO₂ {kasus.vitalAwal.spo2}%</span>}
          {kasus.vitalAwal.suhu && <span>S {kasus.vitalAwal.suhu}°</span>}
          {kasus.vitalAwal.gds && <span>GDS {kasus.vitalAwal.gds}</span>}
        </div>

        {/* CODEX audit UI/UX 2026-07-10 (#7c): dulu hanya dirender di dalam
            blok fase==='langkah' — begitu jawaban TERAKHIR memicu transisi ke
            kode_biru/disposisi, feedback benar/keliru pilihan itu lenyap
            seketika (fase berubah pada render yang sama). Dipindah ke luar
            ketiga blok fase supaya tetap terlihat sesaat setelah transisi.
            Batch-6 estetika: posisinya dinaikkan ke atas blok fase — kronologi
            vital → hasil langkah lalu → pertanyaan baru.
            CODEX M14 #20c (dituntaskan 2026-07-19): pada jalur RJP
            (kode_biru→disposisi), banner ini masih milik langkah SEBELUM
            Kode Biru dan terbaca seolah respons atas RJP. Flag persisten
            `melewatiKodeBiru` kini menyembunyikannya hanya pada jalur itu;
            jalur normal langkah→disposisi tetap menampilkan feedback. */}
        {!(igd.melewatiKodeBiru === true && igd.fase === 'disposisi') && (
          <ResponsTerakhir kasusId={igd.kasusId} jawaban={igd.jawaban} />
        )}

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

        {/* Fase: pasca-ROSC — stabilisasi lanjutan (CODEX fix #2, 2026-07-13).
            Titik keputusan yang dulu dijanjikan komentar engine tapi tak
            pernah dibangun — tanpa ini rujukan yang BENAR selalu mati dalam
            perjalanan krn stabilitas terkunci 25 (di bawah AMBANG_STABIL_RUJUK). */}
        {igd.fase === 'pasca_rosc' && (
          <div className="igd__isi">
            <div className="judul-seksi">ROSC — Stabilisasi Lanjutan</div>
            <p className="igd__narasi">
              Sirkulasi {igd.pasienNama} kembali — tapi "kembali" bukan "sembuh". Stabilitasnya masih
              rendah ({igd.stabilitas}/100). Apa langkah berikutnya sebelum memutuskan disposisi?
            </p>
            <div className="igd__pilihan">
              <button
                className="igd__opsi igd__opsi--rjp"
                onClick={() => dispatch({ type: 'STABILISASI_LANJUTAN_IGD', pilihanId: 'ulang_abcde' })}
              >
                Evaluasi ulang ABCDE + monitor + oksigen sebelum transportasi
              </button>
              <button
                className="igd__opsi"
                onClick={() => dispatch({ type: 'STABILISASI_LANJUTAN_IGD', pilihanId: 'langsung_rujuk' })}
              >
                Langsung siapkan rujukan — waktu mendesak, stabilisasi lanjutan bisa menunggu
              </button>
            </div>
          </div>
        )}

        {/* Fase: disposisi */}
        {igd.fase === 'disposisi' && (
          <div className="igd__isi">
            {/* CODEX fix #2: header/narasi dulu SELALU menyebut "Stabil" walau
                stabilitas bisa serendah 25 (skip stabilisasi lanjutan) —
                kini jujur soal status stabilitas sesungguhnya. */}
            <div className="judul-seksi">
              {igd.stabilitas >= AMBANG_STABIL_RUJUK ? 'Pasien Stabil — Disposisi' : 'Stabilitas Masih Rendah — Disposisi'}
            </div>
            <p className="igd__narasi">
              {igd.stabilitas >= AMBANG_STABIL_RUJUK
                ? `${igd.pasienNama} sudah tertangani dan stabil. Apa langkah berikutnya sesuai prinsip rujukan berjenjang?`
                : `${igd.pasienNama} belum sepenuhnya stabil (${igd.stabilitas}/100) — transportasi jarak jauh berisiko nyata sebelum stabilisasi lanjutan tuntas.`}
            </p>
            <fieldset className="igd__tujuan">
              <legend className="judul-seksi">Pilih Tujuan Jejaring</legend>
              {jejaringRujukan.map((rumahSakit) => (
                <label key={rumahSakit.id} className="igd__rs">
                  <input
                    type="radio"
                    name="tujuan-rumah-sakit"
                    value={rumahSakit.id}
                    checked={rumahSakitId === rumahSakit.id}
                    onChange={() => setRumahSakitId(rumahSakit.id)}
                  />
                  <span>
                    <strong>{rumahSakit.nama}</strong>
                    <small>
                      Kelas {rumahSakit.kelas} · {rumahSakit.jarakMenit} menit ·{' '}
                      {rumahSakit.spesialisasi.join(', ')}
                      {rumahSakit.kapabilitas?.length
                        ? ` · ${rumahSakit.kapabilitas.join(', ').replaceAll('_', ' ')}`
                        : ''}
                    </small>
                  </span>
                </label>
              ))}
            </fieldset>
            <div className="igd__pilihan">
              <button
                className="igd__opsi"
                disabled={!rsRujukan}
                onClick={() =>
                  dispatch({
                    type: 'DISPOSISI_IGD',
                    jenis: 'rujuk',
                    ...(rsRujukan ? { rumahSakitId: rsRujukan.id } : {}),
                  })
                }
              >
                {rsRujukan
                  ? `Rujuk ke ${rsRujukan.nama} (${rsRujukan.jarakMenit} menit)`
                  : 'Pilih rumah sakit tujuan sebelum merujuk'}
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
  jawaban,
}: {
  kasusId: string
  jawaban: { langkahId: string; pilihanId: string; benar: boolean }[]
}) {
  // CODEX ronde-13: `igd.jawaban` bisa korup (bukan array) meski `igd` sendiri
  // lolos guard bail-out di komponen induk — cegah crash `.length`/indexing.
  // CODEX audit UI/UX 2026-07-10 (#7c): guard `langkahIndex === 0` yang dulu
  // di sini SELALU berbarengan dgn `jawaban.length === 0` selama komponen ini
  // cuma dirender di fase 'langkah' (langkahIndex naik SEBELUM fase berganti,
  // igd.ts:45) — jadi redundan, bukan pengaman genuin. Begitu komponen ini
  // ikut dirender di fase kode_biru (igd.ts:50 SENGAJA tak menaikkan
  // langkahIndex saat itu), guard itu jadi AKTIF KELIRU: kode biru yang
  // dipicu tepat di langkah pertama (langkahIndex tetap 0) akan menyembunyikan
  // feedback yang justru paling penting (pilihan yang menghabiskan stabilitas).
  // Cukup andalkan jawaban.length, yang sudah cukup & selalu akurat.
  if (!Array.isArray(jawaban) || jawaban.length === 0) return null
  const terakhir = jawaban[jawaban.length - 1]
  if (!terakhir) return null
  const kasus = PACK.kasusIgd[kasusId]
  const langkah = kasus?.langkah.find((l) => l.id === terakhir.langkahId)
  const pilihan = langkah?.pilihan.find((p) => p.id === terakhir.pilihanId)
  if (!pilihan) return null
  return (
    // M10 Batch-2 (CODEX A.1): live region — respons langkah IGD diumumkan SR.
    <div className={`igd__respons ${pilihan.benar ? 'igd__respons--benar' : 'igd__respons--salah'}`} role="status" aria-live="polite">
      <span className="stempel stempel--kecil">{pilihan.benar ? 'TEPAT' : 'KELIRU'}</span>
      <p>{pilihan.respons}</p>
    </div>
  )
}
