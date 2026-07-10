/**
 * DECK TERAPI — dua tab sejajar (M7 34b, verdikt DeepThink Q4: isolasi
 * SPASIAL, bukan fase baru):
 *   [Resep]   formularium + pencarian toleran-ejaan + firewall alergi.
 *   [Edukasi] baki prioritas 3 slot (kuota ditegakkan ENGINE) + pencarian +
 *             laci kategori akordion default tertutup (Hukum Hick; hasil cari
 *             meng-auto-buka laci; status laci diingat selama sesi).
 */

import { useEffect, useMemo, useState, type KeyboardEvent } from 'react'
import { PACK } from '@content/index'
import { useGame } from '../../store'
import { useMotionDikurangi } from '../../useMotionDikurangi'
import type { KategoriEdukasi, TopikEdukasi } from '@content/types'
import type { EncounterState } from '@engine/state'
import type { Action } from '@engine/actions'
import type { GameEvent } from '@engine/events'
import { KAPASITAS_EDUKASI } from '@engine/clinic'
import {
  cocokEdukasi,
  cocokObat,
  formatRupiah,
  LABEL_KATEGORI_EDUKASI,
  URUTAN_KATEGORI_EDUKASI,
} from './util'
import { OBAT_PERTAMA_TUTORIAL } from './tutorialKlinik'

interface Props {
  enc: EncounterState
  dispatch: (action: Action) => void
  lastEvents: GameEvent[]
  eventTick: number
  /** DeepThink "onboarding railroaded" (keputusan user). */
  tutorialAktif?: boolean
}

/** Status buka/tutup laci diingat selama SESI app (bukan state save). */
const laciSesi = new Set<KategoriEdukasi>()

export function DeckTerapi({ enc, dispatch, lastEvents, eventTick, tutorialAktif = false }: Props) {
  const [tab, setTab] = useState<'resep' | 'edukasi' | 'tindakan'>('resep')
  // M10 §49 (CODEX A.5): lengkapi pola WAI-ARIA Tabs — dulu role=tab+aria-selected
  // ada tapi nol tabpanel/aria-controls/roving-tabindex/navigasi-panah. Panah
  // kiri/kanan memindah tab (aktivasi otomatis); tiap tab mengontrol panelnya.
  const TABS = ['resep', 'edukasi', 'tindakan'] as const
  const onTabKey = (e: KeyboardEvent): void => {
    const arah = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
    if (arah === 0 || tutorialAktif) return
    e.preventDefault()
    const i = TABS.indexOf(tab)
    const next = TABS[(i + arah + TABS.length) % TABS.length]!
    setTab(next)
    document.getElementById(`terapi-tab-${next}`)?.focus()
  }
  // Sorotan: obat pertama sampai masuk resep, lalu tombol lanjut. Edukasi/
  // Tindakan sengaja TAK disorot & terkunci (kasus tutorial cukup 1 obat).
  const sorotObat = tutorialAktif && !enc.resep.includes(OBAT_PERTAMA_TUTORIAL)
  const sorotLanjut = tutorialAktif && enc.resep.includes(OBAT_PERTAMA_TUTORIAL)
  // Bug live (2026-07-05): formularium terurut alfabetis & panjang (~69 item)
  // — target sorotan ("Paracetamol", huruf P) sering jauh di bawah viewport
  // awal tanpa indikasi apa pun utk scroll. jsdom tak menangkap ini (tak ada
  // scroll sungguhan), cuma kelihatan saat manusia main langsung.
  const kurangiGerak = useMotionDikurangi()
  useEffect(() => {
    if (tab !== 'resep' || !sorotObat) return
    document
      .querySelector('.klinik-obat .klinik-sorot-tutorial')
      ?.scrollIntoView({ block: 'center', behavior: kurangiGerak ? 'auto' : 'smooth' })
  }, [tab, sorotObat, kurangiGerak])
  const [cari, setCari] = useState('')
  const [cariEduk, setCariEduk] = useState('')
  const [, setLaciTick] = useState(0) // re-render saat laciSesi berubah
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

  // Prosedur/tindakan klinis (CODEX #4) — daftar datar (item sedikit), pemain
  // memilih yang terindikasi; tindakan tak relevan mengurangi skor terapi.
  const daftarTindakan = useMemo(
    () => Object.values(PACK.tindakan).sort((a, b) => a.nama.localeCompare(b.nama, 'id')),
    [],
  )

  // Topik edukasi per laci kategori (urutan tetap, nama front-loaded).
  const topikPerKategori = useMemo(() => {
    const peta = new Map<KategoriEdukasi, TopikEdukasi[]>()
    for (const kat of URUTAN_KATEGORI_EDUKASI) peta.set(kat, [])
    for (const t of Object.values(PACK.edukasi)) peta.get(t.kategori)?.push(t)
    for (const daftar of peta.values()) daftar.sort((a, b) => a.nama.localeCompare(b.nama, 'id'))
    return peta
  }, [])

  const kueriEduk = cariEduk.trim()
  const sedangCari = kueriEduk.length > 0
  const bakiPenuh = enc.edukasi.length >= KAPASITAS_EDUKASI

  const toggleLaci = (kat: KategoriEdukasi) => {
    if (laciSesi.has(kat)) laciSesi.delete(kat)
    else laciSesi.add(kat)
    setLaciTick((n) => n + 1)
  }

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

        {/* M7 34b — tab sejajar: edukasi tak lagi terkubur di dasar sumur scroll. */}
        <div className="klinik-deck__tab" role="tablist" aria-label="Terapi">
          <button
            role="tab"
            id="terapi-tab-resep"
            aria-selected={tab === 'resep'}
            aria-controls="terapi-panel-resep"
            tabIndex={tab === 'resep' ? 0 : -1}
            onKeyDown={onTabKey}
            className={`klinik-deck__tab-tombol${tab === 'resep' ? ' klinik-deck__tab-tombol--aktif' : ''}`}
            onClick={() => setTab('resep')}
            // M9.1: dulu tak dikunci sama sekali — tab ini memang sudah aktif
            // default & klik ulang tak berefek, tapi tetap terhitung "aktif
            // bisa diklik" & melanggar invarian kunci-penuh. Dikunci spt
            // kedua tab lain (satu-satunya tab tercapai selama tutorial).
            disabled={tutorialAktif}
          >
            Resep ({enc.resep.length})
          </button>
          <button
            role="tab"
            id="terapi-tab-edukasi"
            aria-selected={tab === 'edukasi'}
            aria-controls="terapi-panel-edukasi"
            tabIndex={tab === 'edukasi' ? 0 : -1}
            onKeyDown={onTabKey}
            className={`klinik-deck__tab-tombol${tab === 'edukasi' ? ' klinik-deck__tab-tombol--aktif' : ''}`}
            onClick={() => setTab('edukasi')}
            disabled={tutorialAktif}
            title={tutorialAktif ? 'Kasus latihan ini cukup diselesaikan lewat tab Resep.' : undefined}
          >
            {/* Titik kunyit = pengingat baki masih kosong (playtest: tab tak terlihat).
                Status milik pemain sendiri — bukan petunjuk isi kasus (anti-bocor). */}
            {enc.edukasi.length === 0 && tab !== 'edukasi' && (
              <span className="klinik-deck__tab-titik" aria-hidden="true" />
            )}
            Edukasi ({enc.edukasi.length}/{KAPASITAS_EDUKASI})
          </button>
          <button
            role="tab"
            id="terapi-tab-tindakan"
            aria-selected={tab === 'tindakan'}
            aria-controls="terapi-panel-tindakan"
            tabIndex={tab === 'tindakan' ? 0 : -1}
            onKeyDown={onTabKey}
            className={`klinik-deck__tab-tombol${tab === 'tindakan' ? ' klinik-deck__tab-tombol--aktif' : ''}`}
            onClick={() => setTab('tindakan')}
            disabled={tutorialAktif}
            title={tutorialAktif ? 'Kasus latihan ini tak butuh tindakan.' : undefined}
          >
            Tindakan ({enc.tindakan.length})
          </button>
        </div>

        {tab === 'resep' && (
          <div className="klinik-deck__grup" role="tabpanel" id="terapi-panel-resep" aria-labelledby="terapi-tab-resep">
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
                  const disorot = sorotObat && o.id === OBAT_PERTAMA_TUTORIAL
                  const dikunci = tutorialAktif && !disorot
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
                        className={`tombol klinik-obat__tambah${disorot ? ' klinik-sorot-tutorial' : ''}`}
                        onClick={() => dispatch({ type: 'TAMBAH_OBAT', obatId: o.id })}
                        disabled={diresepkan || habis || dikunci}
                        title={
                          diresepkan
                            ? 'Sudah ada di resep.'
                            : habis
                              ? 'Stok habis — pesan lewat Gudang Obat (Meja Kerja) atau pilih alternatif.'
                              : `Tambahkan ${o.nama} ke resep.`
                        }
                        // CODEX audit UI/UX 2026-07-10 (#15): sama seperti tombol
                        // Pesan lab — accessible name tombol ini sama di SETIAP
                        // baris obat ("+ Resep"/"✓"/"✕"), nama obat cuma di title.
                        aria-label={
                          diresepkan
                            ? `${o.nama} sudah di resep`
                            : habis
                              ? `${o.nama} stok habis`
                              : `Tambah ${o.nama} ke resep`
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
        )}

        {tab === 'edukasi' && (
          <div className="klinik-deck__grup" role="tabpanel" id="terapi-panel-edukasi" aria-labelledby="terapi-tab-edukasi">
            {/* Baki prioritas — secarik memo dengan 3 baris (O4). */}
            <div className="klinik-eduk__baki" aria-label="Resep edukasi terpilih">
              <div className="judul-seksi">Resep Edukasi &mdash; maksimal {KAPASITAS_EDUKASI}</div>
              <p className="teks-xs teks-lembut klinik-eduk__baki-hint">
                Waktu konseling terbatas &mdash; pilih topik paling penting untuk pasien INI.
                Kasus kompleks tetap dinilai penuh dari {KAPASITAS_EDUKASI} terbaikmu.
              </p>
              {Array.from({ length: KAPASITAS_EDUKASI }, (_, i) => {
                const id = enc.edukasi[i]
                const topik = id ? PACK.edukasi[id] : undefined
                return (
                  <div key={i} className={`klinik-eduk__slot${topik ? '' : ' klinik-eduk__slot--kosong'}`}>
                    <span className="mono teks-xs klinik-eduk__slot-no">{i + 1}.</span>
                    {topik ? (
                      <>
                        <span className="teks-kecil tumbuh">{topik.nama}</span>
                        <button
                          className="tombol tombol--senyap klinik-eduk__slot-hapus"
                          onClick={() => dispatch({ type: 'HAPUS_EDUKASI', edukasiId: topik.id })}
                          title="Coret dari resep edukasi."
                          aria-label={`Hapus ${topik.nama}`}
                        >
                          ✕
                        </button>
                      </>
                    ) : (
                      <span className="teks-xs teks-lembut klinik-eduk__slot-placeholder">
                        &mdash; belum diisi &mdash;
                      </span>
                    )}
                  </div>
                )
              })}
            </div>

            <input
              className="klinik-cari"
              type="text"
              value={cariEduk}
              onChange={(e) => setCariEduk(e.target.value)}
              placeholder="Cari edukasi&hellip; (cth: inhaler, oralit, garam)"
              aria-label="Cari topik edukasi"
            />

            {/* Laci kategori — default tertutup; mencari = laci relevan terbuka. */}
            {URUTAN_KATEGORI_EDUKASI.map((kat) => {
              const semua = topikPerKategori.get(kat) ?? []
              const daftar = sedangCari ? semua.filter((t) => cocokEdukasi(t, kueriEduk)) : semua
              if (sedangCari && daftar.length === 0) return null
              const terbuka = sedangCari || laciSesi.has(kat)
              const terpilihDiLaci = semua.filter((t) => enc.edukasi.includes(t.id)).length
              return (
                <div key={kat} className="klinik-eduk__laci">
                  <button
                    className="klinik-eduk__laci-kepala"
                    aria-expanded={terbuka}
                    onClick={() => toggleLaci(kat)}
                  >
                    <span className="klinik-eduk__laci-panah" aria-hidden="true">
                      {terbuka ? '▾' : '▸'}
                    </span>
                    <span className="teks-kecil tumbuh klinik-eduk__laci-judul">
                      {LABEL_KATEGORI_EDUKASI[kat]}
                    </span>
                    <span className="mono teks-xs teks-lembut">
                      {terpilihDiLaci > 0 ? `${terpilihDiLaci}✓ · ` : ''}
                      {semua.length}
                    </span>
                  </button>
                  {terbuka && (
                    <div className="klinik-eduk">
                      {daftar.map((t) => {
                        const dipilih = enc.edukasi.includes(t.id)
                        const terkunci = bakiPenuh && !dipilih
                        return (
                          <button
                            key={t.id}
                            className={`chip klinik-eduk__chip${dipilih ? ' klinik-eduk__chip--dipilih' : ''}`}
                            disabled={terkunci}
                            aria-pressed={dipilih}
                            onClick={() =>
                              dispatch(
                                dipilih
                                  ? { type: 'HAPUS_EDUKASI', edukasiId: t.id }
                                  : { type: 'TAMBAH_EDUKASI', edukasiId: t.id },
                              )
                            }
                            title={
                              dipilih
                                ? 'Klik untuk membatalkan.'
                                : terkunci
                                  ? `Baki penuh (${KAPASITAS_EDUKASI}) — coret salah satu dulu.`
                                  : `Sampaikan edukasi: ${t.nama}`
                            }
                          >
                            {dipilih ? '✓ ' : ''}
                            {t.nama}
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
            <span className="teks-xs teks-lembut">
              Edukasi yang tepat sasaran ikut dinilai; topik asal-centang mengurangi nilai.
            </span>
          </div>
        )}

        {tab === 'tindakan' && (
          <div className="klinik-deck__grup" role="tabpanel" id="terapi-panel-tindakan" aria-labelledby="terapi-tab-tindakan">
            <div className="judul-seksi">Prosedur / Tindakan Klinis</div>
            <p className="teks-xs teks-lembut">
              Sebagian kasus dituntaskan dengan TINDAKAN, bukan (hanya) obat &mdash; mis. nebulisasi
              serangan asma/PPOK, manuver reposisi vertigo, irigasi serumen, tampon epistaksis.
              Tindakan yang tak terindikasi ikut mengurangi nilai.
            </p>
            <div className="klinik-eduk">
              {daftarTindakan.map((t) => {
                const dipilih = enc.tindakan.includes(t.id)
                return (
                  <button
                    key={t.id}
                    className={`chip klinik-eduk__chip${dipilih ? ' klinik-eduk__chip--dipilih' : ''}`}
                    aria-pressed={dipilih}
                    onClick={() =>
                      dispatch(
                        dipilih
                          ? { type: 'HAPUS_TINDAKAN', tindakanId: t.id }
                          : { type: 'TAMBAH_TINDAKAN', tindakanId: t.id },
                      )
                    }
                    title={dipilih ? 'Klik untuk membatalkan tindakan.' : `Lakukan tindakan: ${t.nama}`}
                  >
                    {dipilih ? '✓ ' : ''}
                    {t.nama}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>

      <footer className="klinik-deck__footer">
        <button
          className={`tombol tombol--utama tombol--besar${sorotLanjut ? ' klinik-sorot-tutorial' : ''}`}
          onClick={() => dispatch({ type: 'LANJUT_FASE' })}
          disabled={tutorialAktif && !sorotLanjut}
        >
          Selesai Terapi &mdash; ke Disposisi &rarr;
        </button>
        {tutorialAktif ? null : enc.edukasi.length === 0 ? (
          <button className="teks-xs klinik-deck__footer-ingat" onClick={() => setTab('edukasi')}>
            💬 Pasien belum diedukasi &mdash; buka tab <strong>Edukasi (0/{KAPASITAS_EDUKASI})</strong>; konseling ikut dinilai.
          </button>
        ) : (
          <span className="teks-xs teks-lembut">
            Resep masih bisa dicoret dari lembar (kolom P) sebelum pasien pulang.
          </span>
        )}
      </footer>
    </>
  )
}
