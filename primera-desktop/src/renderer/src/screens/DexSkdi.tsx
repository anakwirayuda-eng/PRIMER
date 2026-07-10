/**
 * BUKU SAKU — Dex SKDI (GDD §4 layar 5).
 * Grid 144 penyakit wajib tuntas FKTP: siluet "???" sampai pemain menangani
 * kasusnya di klinik; entri terisi menampilkan bintang penguasaan Leitner yang
 * MELUNTUR — Director mengirim ulang kasus yang lemah. Rasa Pokedex, nada
 * sopan-klinis arsip Puskesmas.
 */

import { useMemo, useState } from 'react'
import { useGame } from '../store'
import { PACK } from '@content/index'
import { normalisasiNamaObat } from './klinik/util'
import './DexSkdi.css'

// CODEX audit 2026-07-04: dulu memakai SKDI144 mentah (bukan PACK.skdi144),
// jadi 23 entri yang kasusId-nya di-auto-tautkan lewat kecocokan ICD-10 di
// index.ts (lihat skdi144Tertaut) tak pernah terbaca "dikenali" — progres Dex
// mandek permanen di ??? walau kasusnya sudah ditangani.
const TOTAL_ENTRI = PACK.skdi144.length

// CODEX audit UI/UX 2026-07-10 (Polish#3a): nomor katalog harus tetap
// mengikuti posisi ASLI di PACK.skdi144, bukan posisi di hasil pencarian —
// dihitung sekali di sini, bukan dari index hasil .filter().
const NOMOR_ENTRI = new Map(
  PACK.skdi144.map((entri, i) => [entri.id, String(i + 1).padStart(3, '0')]),
)

/** Bintang penguasaan 0-3: ★ terisi kunyit, sisanya pudar. */
function Bintang({ jumlah, besar = false }: { jumlah: number; besar?: boolean }) {
  const n = Math.max(0, Math.min(3, jumlah))
  return (
    <span
      className={`dexskdi-bintang${besar ? ' dexskdi-bintang--besar' : ''}`}
      aria-label={`Penguasaan ${n} dari 3 bintang`}
    >
      {'★'.repeat(n)}
      <span className="dexskdi-bintang__kosong">{'★'.repeat(3 - n)}</span>
    </span>
  )
}

export function DexSkdi() {
  const state = useGame((s) => s.state)!
  const [pilihanId, setPilihanId] = useState<string | null>(null)
  const [cari, setCari] = useState('')

  const jumlahDikenal = PACK.skdi144.filter(
    (e) => e.kasusId !== undefined && state.dex[e.kasusId] !== undefined,
  ).length

  // Reuse pola cariLab/daftarLab/cocokLab (DeckPemeriksaan.tsx) — normalisasi
  // toleran-ejaan yang sama, bukan pencocokan case-insensitive baru.
  const daftarSkdi = useMemo(() => {
    const q = normalisasiNamaObat(cari)
    if (q === '') return PACK.skdi144
    return PACK.skdi144.filter(
      (entri) =>
        normalisasiNamaObat(entri.nama).includes(q) || normalisasiNamaObat(entri.icd10).includes(q),
    )
  }, [cari])

  const terpilih = pilihanId !== null ? PACK.skdi144.find((e) => e.id === pilihanId) : undefined
  const dexTerpilih =
    terpilih?.kasusId !== undefined ? state.dex[terpilih.kasusId] : undefined
  const kasusTerpilih =
    terpilih?.kasusId !== undefined ? PACK.kasus[terpilih.kasusId] : undefined

  return (
    <div className="dexskdi">
      {/* ---- Header: progres + penjelasan Leitner --------------------------- */}
      <header className="dexskdi__header kertas">
        <div className="dexskdi__header-kiri">
          <h1 className="dexskdi__judul">Buku Saku — 144 Penyakit FKTP</h1>
          <p className="dexskdi__leitner teks-kecil teks-lembut">
            Bintang penguasaan meluntur bila lama tidak dilatih — kasus yang lemah akan
            dikirim ulang ke antrian klinikmu sampai benar-benar tuntas.
          </p>
        </div>
        <div className="dexskdi__progres">
          <span className="chip chip--daun mono">{jumlahDikenal}/{TOTAL_ENTRI} dikenali</span>
          <div className="meter dexskdi__meter">
            <div
              className="meter__isi"
              style={{ width: `${(jumlahDikenal / TOTAL_ENTRI) * 100}%` }}
            />
          </div>
          <div className="dexskdi__legenda teks-xs teks-lembut">
            <span className="dexskdi__legenda-item">
              <span className="dexskdi__legenda-pin">●</span> ada di desa ini
            </span>
            <span className="dexskdi__legenda-item mono">??? belum dikenali</span>
          </div>
        </div>
      </header>

      <div className="dexskdi__isi">
        {/* ---- Grid 144 kartu (panel yang scroll) --------------------------- */}
        <div className="dexskdi__grid-wrap">
          <input
            type="text"
            className="dexskdi__cari"
            value={cari}
            onChange={(e) => setCari(e.target.value)}
            placeholder="Cari penyakit atau kode ICD-10…"
            aria-label="Cari SKDI"
          />
          {daftarSkdi.length === 0 ? (
            <p className="teks-kecil teks-lembut">Tidak ada entri yang cocok.</p>
          ) : (
            <div className="dexskdi__grid">
              {daftarSkdi.map((entri) => {
                const dex = entri.kasusId !== undefined ? state.dex[entri.kasusId] : undefined
                const diDesa = entri.kasusId !== undefined && dex === undefined
                const nomor = NOMOR_ENTRI.get(entri.id)!

                if (dex === undefined) {
                  return (
                    <button
                      key={entri.id}
                      className={`dexskdi-kartu dexskdi-kartu--siluet${diDesa ? ' dexskdi-kartu--desa' : ''}`}
                      disabled
                      title={
                        diDesa
                          ? 'Penyakit ini ada di desamu — tangani pasiennya di klinik untuk mengenalinya'
                          : 'Belum dikenali — entri terbuka setelah kamu menangani kasusnya'
                      }
                    >
                      <span className="dexskdi-kartu__nomor mono">{nomor}</span>
                      <span className="dexskdi-kartu__siluet mono">???</span>
                      {diDesa && (
                        <span className="dexskdi-kartu__pin" aria-label="Ada di desa ini">
                          ●
                        </span>
                      )}
                    </button>
                  )
                }

                return (
                  <button
                    key={entri.id}
                    className={`dexskdi-kartu dexskdi-kartu--terisi${pilihanId === entri.id ? ' dexskdi-kartu--aktif' : ''}`}
                    onClick={() => setPilihanId(entri.id)}
                    // Review Batch-7 (koreksi #16f): kartu ini bukan toggle
                    // button — klik ulang pada kartu yang sudah "aktif" TAK
                    // meng-un-set-nya (tutup hanya lewat tombol "Tutup ✕"
                    // panel detail terpisah). aria-current lebih tepat drpd
                    // aria-pressed utk menandai "kartu mana yang sedang dilihat".
                    aria-current={pilihanId === entri.id ? 'true' : undefined}
                    title={`${entri.nama} — klik untuk membuka catatan`}
                  >
                    <span className="dexskdi-kartu__nomor mono">{nomor}</span>
                    <span className="dexskdi-kartu__nama">{entri.nama}</span>
                    <span className="dexskdi-kartu__meta">
                      <Bintang jumlah={dex.bintang} />
                      <span className="dexskdi-kartu__hari mono" title="Terakhir kali ditangani">
                        H{dex.terakhirHari}
                      </span>
                    </span>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* ---- Panel detail (kartu arsip) ------------------------------------ */}
        <aside className="dexskdi__detail kertas">
          {terpilih !== undefined && dexTerpilih !== undefined ? (
            <div className="dexskdi-detail">
              <div className="baris baris--antara">
                <span className="judul-seksi">Catatan Penyakit</span>
                <button
                  className="tombol tombol--senyap teks-xs"
                  onClick={() => setPilihanId(null)}
                  title="Tutup catatan"
                >
                  Tutup ✕
                </button>
              </div>

              <h2 className="dexskdi-detail__nama">{terpilih.nama}</h2>
              <div className="baris">
                <span className="chip chip--biru mono">ICD-10 {terpilih.icd10}</span>
                <Bintang jumlah={dexTerpilih.bintang} besar />
              </div>

              <dl className="dexskdi-detail__tabel">
                <div className="dexskdi-detail__baris">
                  <dt className="teks-lembut">Ditangani</dt>
                  <dd className="mono">{dexTerpilih.ditangani}×</dd>
                </div>
                <div className="dexskdi-detail__baris">
                  <dt className="teks-lembut">Diagnosis benar</dt>
                  <dd className="mono">{dexTerpilih.benar}×</dd>
                </div>
                <div className="dexskdi-detail__baris">
                  <dt className="teks-lembut">Terakhir ditangani</dt>
                  <dd className="mono">Hari {dexTerpilih.terakhirHari}</dd>
                </div>
              </dl>

              {kasusTerpilih !== undefined && (
                <div className="dexskdi-detail__clue">
                  <span className="judul-seksi">Mutiara Klinis</span>
                  <p className="dexskdi-detail__clue-teks tulis-tangan">{kasusTerpilih.clue}</p>
                </div>
              )}

              {dexTerpilih.bintang < 3 && (
                <p className="teks-xs teks-lembut dexskdi-detail__saran">
                  Penguasaan belum penuh — kasus ini kemungkinan besar akan kembali ke
                  antrian klinikmu.
                </p>
              )}
            </div>
          ) : (
            <div className="dexskdi-detail dexskdi-detail--kosong">
              <span className="judul-seksi">Catatan Penyakit</span>
              <p className="teks-kecil teks-lembut">
                Pilih entri yang sudah dikenali untuk membuka catatanmu: kode ICD-10,
                riwayat penanganan, dan mutiara klinisnya.
              </p>
              <p className="teks-xs teks-lembut dexskdi-detail__hint mono">
                {jumlahDikenal === 0
                  ? 'Belum ada entri terbuka — mulailah dari antrian pagi.'
                  : `${jumlahDikenal} entri sudah terbuka.`}
              </p>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}
