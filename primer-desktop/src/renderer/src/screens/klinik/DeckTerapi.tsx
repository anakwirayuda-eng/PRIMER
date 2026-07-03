/**
 * DECK TERAPI — formularium dengan pencarian + checklist edukasi.
 * Firewall alergi engine memblokir resep kontraindikatif; UI menjatuhkan
 * stempel merah KONTRAINDIKASI (animasi stempel--jatuh) sebagai poka-yoke.
 */

import { useMemo, useState } from 'react'
import { PACK } from '@content/index'
import { useGame } from '../../store'
import type { EncounterState } from '@engine/state'
import type { Action } from '@engine/actions'
import type { GameEvent } from '@engine/events'
import { cocokObat, formatRupiah } from './util'

interface Props {
  enc: EncounterState
  dispatch: (action: Action) => void
  lastEvents: GameEvent[]
  eventTick: number
}

export function DeckTerapi({ enc, dispatch, lastEvents, eventTick }: Props) {
  const [cari, setCari] = useState('')
  // M4.18 — stok gudang tampil di formularium; habis = tombol resep terkunci.
  const stok = useGame((s) => s.state?.gudang.stok)

  // Pencarian toleran-ejaan (playtest): "paracetamol/amoxicillin/cetirizine"
  // (ejaan Inggris) tetap menemukan Parasetamol/Amoksisilin/Setirizin —
  // normalisasi fonetik + cari juga di id & sinonim (lihat util.cocokObat).
  const daftarObat = useMemo(() => {
    const q = cari.trim()
    return Object.values(PACK.obat)
      .filter((o) => q === '' || cocokObat(o, q))
      .sort((a, b) => a.nama.localeCompare(b.nama, 'id'))
  }, [cari])

  const daftarEdukasi = useMemo(
    () => Object.values(PACK.edukasi).sort((a, b) => a.nama.localeCompare(b.nama, 'id')),
    [],
  )

  // Firewall dari dispatch terakhir — stempel jatuh ulang tiap terpicu (key eventTick).
  let firewall: { obatId: string; golongan: string } | null = null
  for (const e of lastEvents) {
    if (e.type === 'FIREWALL_ALERGI') firewall = { obatId: e.obatId, golongan: e.golongan }
  }

  return (
    <>
      <div className="klinik-deck__isi">
        {firewall !== null && (
          <div key={eventTick} className="klinik-firewall">
            <span className="stempel stempel--merah stempel--jatuh klinik-firewall__stempel">
              KONTRAINDIKASI
            </span>
            <span className="teks-kecil">
              Pasien alergi golongan <strong>{firewall.golongan}</strong> &mdash;{' '}
              {PACK.obat[firewall.obatId]?.nama ?? firewall.obatId} TIDAK masuk resep. Cari
              alternatif dari kelas lain.
            </span>
          </div>
        )}

        <div className="klinik-deck__grup">
          <div className="judul-seksi">Formularium Puskesmas</div>
          <input
            className="klinik-cari"
            type="text"
            value={cari}
            onChange={(e) => setCari(e.target.value)}
            placeholder="Cari obat atau kelas terapi&hellip;"
            aria-label="Cari obat"
          />
          <div className="klinik-obat">
            {daftarObat.length === 0 ? (
              <div className="klinik-lembar__kosong">Tidak ada obat yang cocok.</div>
            ) : (
              daftarObat.map((o) => {
                const diresepkan = enc.resep.includes(o.id)
                const sisa = stok?.[o.id]
                const habis = sisa !== undefined && sisa <= 0
                return (
                  <div key={o.id} className="klinik-obat__baris">
                    <div className="tumbuh">
                      <div className="baris klinik-obat__judul">
                        <span className="teks-kecil">{o.nama}</span>
                        {o.antibiotik === true && (
                          <span className="chip chip--kunyit">Antibiotik</span>
                        )}
                        {habis ? (
                          <span className="chip chip--merah">HABIS</span>
                        ) : sisa !== undefined && sisa <= 3 ? (
                          <span className="chip chip--kunyit">sisa {sisa}</span>
                        ) : null}
                      </div>
                      <div className="teks-xs teks-lembut">
                        {o.sediaan} &middot; {o.kelas}
                      </div>
                    </div>
                    <span className="mono teks-xs teks-lembut">{formatRupiah(o.hargaJual)}</span>
                    <button
                      className="tombol klinik-obat__tambah"
                      onClick={() => dispatch({ type: 'TAMBAH_OBAT', obatId: o.id })}
                      disabled={diresepkan || habis}
                      title={
                        diresepkan
                          ? 'Sudah ada di resep.'
                          : habis
                            ? 'Stok habis — pesan lewat Gudang Obat (Meja Kerja) atau pilih alternatif.'
                            : `Tambahkan ${o.nama} ke resep.`
                      }
                    >
                      {diresepkan ? '✓' : habis ? '✕' : '+ Resep'}
                    </button>
                  </div>
                )
              })
            )}
          </div>
          <span className="teks-xs teks-lembut">
            Antibiotik tanpa indikasi tercatat oleh Dinkes (stewardship) &mdash; resepkan bijak.
          </span>
        </div>

        <div className="klinik-deck__grup">
          <div className="judul-seksi">Edukasi Pasien</div>
          <div className="klinik-eduk">
            {daftarEdukasi.map((t) => {
              const dipilih = enc.edukasi.includes(t.id)
              return (
                <button
                  key={t.id}
                  className={`chip klinik-eduk__chip${dipilih ? ' klinik-eduk__chip--dipilih' : ''}`}
                  onClick={() =>
                    dispatch(
                      dipilih
                        ? { type: 'HAPUS_EDUKASI', edukasiId: t.id }
                        : { type: 'TAMBAH_EDUKASI', edukasiId: t.id },
                    )
                  }
                  title={dipilih ? 'Klik untuk membatalkan.' : `Sampaikan edukasi: ${t.nama}`}
                >
                  {dipilih ? '✓ ' : ''}
                  {t.nama}
                </button>
              )
            })}
          </div>
          <span className="teks-xs teks-lembut">
            Pilih topik yang relevan dengan kasus &mdash; edukasi termasuk komponen penilaian.
          </span>
        </div>
      </div>

      <footer className="klinik-deck__footer">
        <button
          className="tombol tombol--utama tombol--besar"
          onClick={() => dispatch({ type: 'LANJUT_FASE' })}
        >
          Selesai Terapi &mdash; ke Disposisi &rarr;
        </button>
        <span className="teks-xs teks-lembut">
          Resep masih bisa dicoret dari lembar (kolom P) sebelum pasien pulang.
        </span>
      </footer>
    </>
  )
}
