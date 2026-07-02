/**
 * BUKU SAKU — Dex SKDI (GDD §4 layar 5).
 * Grid 144 penyakit wajib tuntas FKTP: siluet "???" sampai pemain menangani
 * kasusnya di klinik; entri terisi menampilkan bintang penguasaan Leitner yang
 * MELUNTUR — Director mengirim ulang kasus yang lemah. Rasa Pokedex, nada
 * sopan-klinis arsip Puskesmas.
 */

import { useState } from 'react'
import { useGame } from '../store'
import { SKDI144 } from '@content/skdi144'
import { PACK } from '@content/index'
import './DexSkdi.css'

const TOTAL_ENTRI = SKDI144.length

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

  const jumlahDikenal = SKDI144.filter(
    (e) => e.kasusId !== undefined && state.dex[e.kasusId] !== undefined,
  ).length

  const terpilih = pilihanId !== null ? SKDI144.find((e) => e.id === pilihanId) : undefined
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
          <div className="dexskdi__grid">
            {SKDI144.map((entri, i) => {
              const dex = entri.kasusId !== undefined ? state.dex[entri.kasusId] : undefined
              const diDesa = entri.kasusId !== undefined && dex === undefined
              const nomor = String(i + 1).padStart(3, '0')

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
