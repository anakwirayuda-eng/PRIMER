/**
 * BUKU SAKU — Dex SKDI (GDD §4 layar 5).
 * Grid 144 penyakit wajib tuntas FKTP: siluet "???" sampai pemain menangani
 * kasusnya di klinik; entri terisi menampilkan bintang penguasaan Leitner yang
 * MELUNTUR — Director mengirim ulang kasus yang lemah. Rasa Pokedex, nada
 * sopan-klinis arsip Puskesmas.
 */

import { useEffect, useMemo, useRef, useState } from 'react'
import { useGame } from '../store'
import { PACK } from '@content/index'
import type { KategoriKasus } from '@content/types'
import { normalisasiNamaObat } from './klinik/util'
import { DuelDiagnosis } from './klinik/RefleksiKlinis'
import { TeksTerbaca } from '../components/TeksTerbaca'
import { sedangMengetik } from '../utils/navigasiHud'
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

type FilterDex = 'semua' | 'belum' | 'dijumpai' | 'tersertifikasi' | 'dikuasai'

/** Nama kelompok organ untuk pemain — istilah katalog, bukan enum engine. */
const LABEL_KATEGORI: Record<KategoriKasus, string> = {
  infeksi: 'Infeksi',
  respirasi: 'Respirasi',
  pencernaan: 'Pencernaan',
  kulit: 'Kulit',
  kardiovaskular: 'Jantung & Pembuluh',
  metabolik: 'Metabolik & Endokrin',
  muskuloskeletal: 'Otot & Sendi',
  saraf: 'Saraf',
  mata: 'Mata',
  tht: 'THT',
  gigi: 'Gigi & Mulut',
  kia: 'KIA & Reproduksi',
  jiwa: 'Jiwa',
  gawat: 'Kegawatan',
}

export function DexSkdi() {
  const state = useGame((s) => s.state)!
  const [pilihanId, setPilihanId] = useState<string | null>(null)
  const [cari, setCari] = useState('')
  // Dengan 144 entri, pertanyaan utama pemain adalah "mana yang belum saya
  // tuntaskan" — chip progres di header kini merangkap filter klik.
  const [filter, setFilter] = useState<FilterDex>('semua')
  const toggleFilter = (f: FilterDex) => setFilter((cur) => (cur === f ? 'semua' : f))
  const [kategori, setKategori] = useState<KategoriKasus | 'semua'>('semua')

  // Kategori diturunkan dari kasus tertaut (entri skdi144 sendiri tak
  // membawanya) — seluruh 144 baris kini tertaut 1:1, jadi tak ada yang jatuh
  // ke luar daftar. Hanya kelompok yang BENAR-BENAR terwakili yang muncul di
  // dropdown, lengkap dgn hitungannya: menu tanpa opsi kosong.
  const kategoriTersedia = useMemo(() => {
    const hitung = new Map<KategoriKasus, number>()
    for (const entri of PACK.skdi144) {
      const kat = entri.kasusId !== undefined ? PACK.kasus[entri.kasusId]?.kategori : undefined
      if (kat) hitung.set(kat, (hitung.get(kat) ?? 0) + 1)
    }
    return [...hitung.entries()].sort((a, b) =>
      LABEL_KATEGORI[a[0]].localeCompare(LABEL_KATEGORI[b[0]], 'id'),
    )
  }, [])

  // Audit premium 2026-07-23: "/" atau Ctrl+F memfokuskan pencarian dari mana
  // pun di layar ini (standar aplikasi katalog — 144 entri, pencarian adalah
  // alat navigasi utama). Tak membajak ketikan: diabaikan bila fokus sedang
  // di kontrol ketik lain.
  const cariRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const keF = e.key.toLowerCase() === 'f' && e.ctrlKey && !e.altKey && !e.metaKey
      const keGaris = e.key === '/' && !e.ctrlKey && !e.altKey && !e.metaKey
      if (!keF && !keGaris) return
      if (document.activeElement === cariRef.current) return
      if (keGaris && sedangMengetik(document.activeElement)) return
      e.preventDefault()
      cariRef.current?.focus()
      cariRef.current?.select()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  // Fix CODEX-25 #2/Q7 (jalur kritis DeepThink 2026-07-12): dulu HANYA satu
  // metrik "dikenali" = entri dex ADA = pernah di-encounter — mahasiswa yg
  // salah diagnosis 67× tetap lihat "67/67 dikenali". Kegagalan rubrik.
  // Tiga tingkat kini (data sudah ADA di DexEntry, murni display — tak sentuh
  // reducer/skor/save, jangkau save lama live):
  //   DIJUMPAI      = pernah bertemu (dex ada, siluet terbuka)  — `ditangani≥1`
  //   TERSERTIFIKASI = diagnosis+disposisi benar minimal 1×      — `benar≥1`
  //   DIKUASAI      = ★3 (Leitner; ★3 beku permanen, ★1-2 luntur) — `bintang≥3`
  const entriDex = PACK.skdi144
    .map((e) => (e.kasusId !== undefined ? state.dex[e.kasusId] : undefined))
    .filter((d): d is NonNullable<typeof d> => d !== undefined)
  const jumlahDijumpai = entriDex.length
  const jumlahTersertifikasi = entriDex.filter((d) => d.benar >= 1).length
  const jumlahDikuasai = entriDex.filter((d) => d.bintang >= 3).length
  const jumlahBelum = TOTAL_ENTRI - jumlahDijumpai
  // Metrik "utama" = tersertifikasi (jujur: benar-benar pernah tepat), bukan
  // sekadar berjumpa. Meter progres ikut ini.
  const jumlahDikenal = jumlahTersertifikasi

  // Reuse pola cariLab/daftarLab/cocokLab (DeckPemeriksaan.tsx) — normalisasi
  // toleran-ejaan yang sama, bukan pencocokan case-insensitive baru.
  const daftarSkdi = useMemo(() => {
    const q = normalisasiNamaObat(cari)
    let list = PACK.skdi144
    if (q !== '') {
      list = list.filter(
        (entri) =>
          normalisasiNamaObat(entri.nama).includes(q) || normalisasiNamaObat(entri.icd10).includes(q),
      )
    }
    if (kategori !== 'semua') {
      list = list.filter(
        (entri) =>
          (entri.kasusId !== undefined ? PACK.kasus[entri.kasusId]?.kategori : undefined) === kategori,
      )
    }
    if (filter !== 'semua') {
      list = list.filter((entri) => {
        const dex = entri.kasusId !== undefined ? state.dex[entri.kasusId] : undefined
        switch (filter) {
          case 'belum':
            return dex === undefined
          case 'dijumpai':
            return dex !== undefined
          case 'tersertifikasi':
            return dex !== undefined && dex.benar >= 1
          case 'dikuasai':
            return dex !== undefined && dex.bintang >= 3
        }
      })
    }
    return list
  }, [cari, filter, kategori, state.dex])

  // CODEX M14 #20: cari dari daftar TERFILTER, bukan PACK penuh — dulu memilih
  // entri lalu mengetik pencarian yang menyaringnya keluar tetap menampilkan
  // detail entri lama di panel kanan. Kini detail ikut hasil pencarian (muncul
  // lagi bila pencarian dikosongkan — pilihan tak hilang, hanya tersembunyi).
  const terpilih = pilihanId !== null ? daftarSkdi.find((e) => e.id === pilihanId) : undefined
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
            Bintang ★1-★2 meluntur bila lama tidak dilatih — kasus yang lemah akan
            dikirim ulang ke antrian klinikmu sampai benar-benar tuntas. Penguasaan
            penuh ★3 tidak luntur.
          </p>
        </div>
        <div className="dexskdi__progres">
          <div className="dexskdi__tiga-tingkat">
            <button
              type="button"
              className={`chip mono dexskdi__filter${filter === 'belum' ? ' dexskdi__filter--aktif' : ''}`}
              aria-pressed={filter === 'belum'}
              onClick={() => toggleFilter('belum')}
              data-tip="Belum kamu jumpai — klik untuk menyaring hanya yang belum"
            >
              {jumlahBelum} belum
            </button>
            <button
              type="button"
              className={`chip chip--kunyit mono dexskdi__filter${filter === 'dijumpai' ? ' dexskdi__filter--aktif' : ''}`}
              aria-pressed={filter === 'dijumpai'}
              onClick={() => toggleFilter('dijumpai')}
              data-tip="Pernah kamu temui di klinik (benar atau salah) — klik untuk menyaring"
            >
              {jumlahDijumpai} dijumpai
            </button>
            <button
              type="button"
              className={`chip chip--daun mono dexskdi__filter${filter === 'tersertifikasi' ? ' dexskdi__filter--aktif' : ''}`}
              aria-pressed={filter === 'tersertifikasi'}
              onClick={() => toggleFilter('tersertifikasi')}
              data-tip="Diagnosis DAN disposisi benar minimal sekali — klik untuk menyaring"
            >
              {jumlahTersertifikasi}/{TOTAL_ENTRI} tersertifikasi
            </button>
            <button
              type="button"
              className={`chip chip--biru mono dexskdi__filter${filter === 'dikuasai' ? ' dexskdi__filter--aktif' : ''}`}
              aria-pressed={filter === 'dikuasai'}
              onClick={() => toggleFilter('dikuasai')}
              // Audit logika 2026-07-23: teks lama mengklaim ★3 "bisa meluntur"
              // — KELIRU; engine membekukan ★3 permanen (reducer, blok Dex
              // luntur: hanya bintang<3 yang meluntur). Ancaman palsu dihapus.
              data-tip="Penguasaan penuh ★3 — sekali benar-benar dikuasai, tidak luntur; klik untuk menyaring"
            >
              {jumlahDikuasai} dikuasai ★
            </button>
          </div>
          {/* Meter melacak TERSERTIFIKASI — capaian jujur, bukan sekadar berjumpa. */}
          <div className="meter dexskdi__meter">
            <div
              className="meter__isi"
              style={{ width: `${(jumlahTersertifikasi / TOTAL_ENTRI) * 100}%` }}
            />
          </div>
          <div className="dexskdi__legenda teks-xs teks-lembut">
            <span className="dexskdi__legenda-item mono">??? belum dijumpai</span>
            <span className="dexskdi__legenda-item">Klik chip di atas untuk menyaring</span>
          </div>
        </div>
      </header>

      <div className="dexskdi__isi">
        {/* ---- Grid 144 kartu (panel yang scroll) --------------------------- */}
        <div className="dexskdi__grid-wrap">
          <div className="dexskdi__cari-wrap">
            <div className="dexskdi__cari-box">
              <input
                ref={cariRef}
                type="text"
                className="dexskdi__cari"
                value={cari}
                onChange={(e) => setCari(e.target.value)}
                onKeyDown={(e) => {
                  // Esc: bersihkan dulu; Esc kedua melepas fokus — ergonomi
                  // standar kolom pencarian (audit premium 2026-07-23).
                  if (e.key !== 'Escape') return
                  if (cari !== '') setCari('')
                  else e.currentTarget.blur()
                }}
                placeholder="Cari penyakit atau kode ICD-10…"
                aria-label="Cari SKDI"
                aria-keyshortcuts="/"
                spellCheck={false}
                autoComplete="off"
              />
              {cari === '' ? (
                <kbd className="dexskdi__cari-kbd" aria-hidden="true">/</kbd>
              ) : (
                <button
                  type="button"
                  className="dexskdi__cari-hapus"
                  aria-label="Bersihkan pencarian"
                  onClick={() => {
                    setCari('')
                    cariRef.current?.focus()
                  }}
                >
                  ✕
                </button>
              )}
            </div>
            {/* Audit visual 2026-08-01: layar terpadat di game (terukur ~76
                elemen interaktif terlihat sekaligus). Chip status di header
                menjawab "mana yang belum tuntas", tapi tak ada jalan memindai
                per-organ — padahal itulah cara mahasiswa belajar (blok THT,
                blok kulit). Sengaja SATU dropdown, bukan 14 chip kategori:
                menambah 14 kontrol justru memperparah sesak yang mau dikurangi. */}
            <label className="dexskdi__kategori-label">
              <span className="teks-xs teks-lembut mono">ORGAN</span>
              <select
                className="dexskdi__kategori"
                value={kategori}
                onChange={(e) => setKategori(e.target.value as KategoriKasus | 'semua')}
                aria-label="Saring menurut kelompok organ"
              >
                <option value="semua">Semua kelompok</option>
                {kategoriTersedia.map(([kat, jumlah]) => (
                  <option key={kat} value={kat}>
                    {LABEL_KATEGORI[kat]} ({jumlah})
                  </option>
                ))}
              </select>
            </label>
            <p className="teks-xs teks-lembut mono dexskdi__hasil-hitung" aria-live="polite">
              {daftarSkdi.length} dari {TOTAL_ENTRI} entri
            </p>
          </div>
          {daftarSkdi.length === 0 ? (
            <p className="teks-kecil teks-lembut dexskdi__kosong">Tidak ada entri yang cocok.</p>
          ) : (
            <div className="dexskdi__grid">
              {daftarSkdi.map((entri) => {
                const dex = entri.kasusId !== undefined ? state.dex[entri.kasusId] : undefined
                const nomor = NOMOR_ENTRI.get(entri.id)!

                if (dex === undefined) {
                  // Seluruh 144 entri kini punya kasus di desa (144/144 tertaut),
                  // jadi penanda "ada di desa ini" tak lagi membedakan apa pun —
                  // siluet cukup berarti "belum kamu jumpai".
                  return (
                    <button
                      key={entri.id}
                      className="dexskdi-kartu dexskdi-kartu--siluet"
                      disabled
                      aria-label={`Entri ${nomor} — belum dijumpai`}
                      title="Belum dikenali — entri terbuka setelah kamu menangani kasusnya di klinik"
                    >
                      <span className="dexskdi-kartu__nomor mono">{nomor}</span>
                      <span className="dexskdi-kartu__siluet mono">???</span>
                    </button>
                  )
                }

                // Fix CODEX-25 #2/Q7: kartu yg pernah dijumpai TAPI belum pernah
                // benar (`benar===0`) ditandai beda — bukan "dikuasai palsu".
                const belumTersertifikasi = dex.benar === 0
                return (
                  <button
                    key={entri.id}
                    className={`dexskdi-kartu dexskdi-kartu--terisi${belumTersertifikasi ? ' dexskdi-kartu--dijumpai' : ''}${pilihanId === entri.id ? ' dexskdi-kartu--aktif' : ''}`}
                    onClick={() => setPilihanId(entri.id)}
                    // Review Batch-7 (koreksi #16f): kartu ini bukan toggle
                    // button — klik ulang pada kartu yang sudah "aktif" TAK
                    // meng-un-set-nya (tutup hanya lewat tombol "Tutup ✕"
                    // panel detail terpisah). aria-current lebih tepat drpd
                    // aria-pressed utk menandai "kartu mana yang sedang dilihat".
                    aria-current={pilihanId === entri.id ? 'true' : undefined}
                    title={
                      belumTersertifikasi
                        ? `${entri.nama} — sudah dijumpai tapi belum pernah kamu tegakkan dengan benar`
                        : `${entri.nama} — klik untuk membuka catatan`
                    }
                  >
                    <span className="dexskdi-kartu__nomor mono">{nomor}</span>
                    <span className="dexskdi-kartu__nama">{entri.nama}</span>
                    <span className="dexskdi-kartu__meta">
                      {belumTersertifikasi ? (
                        <span className="dexskdi-kartu__dijumpai-tag mono" data-tip="Dijumpai — belum tersertifikasi">
                          dijumpai
                        </span>
                      ) : (
                        <Bintang jumlah={dex.bintang} />
                      )}
                      <span className="dexskdi-kartu__hari mono" data-tip="Terakhir kali ditangani">
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
                  data-tip="Tutup catatan"
                >
                  Tutup ✕
                </button>
              </div>

              <h2 className="dexskdi-detail__nama">{terpilih.nama}</h2>
              <div className="baris">
                <span className="chip chip--biru mono">ICD-10 {terpilih.icd10}</span>
                <Bintang jumlah={dexTerpilih.bintang} besar />
              </div>

              {/* Fix CODEX-25 #2/Q7: status tingkat eksplisit — dijumpai vs
                  tersertifikasi vs dikuasai, bukan cuma "sudah dikenali". */}
              <div className="baris dexskdi-detail__status">
                {dexTerpilih.bintang >= 3 ? (
                  <span className="chip chip--biru teks-xs">Dikuasai ★★★</span>
                ) : dexTerpilih.benar >= 1 ? (
                  <span className="chip chip--daun teks-xs">Tersertifikasi</span>
                ) : (
                  <span className="chip chip--kunyit teks-xs">Baru dijumpai — belum tepat</span>
                )}
              </div>

              <dl className="dexskdi-detail__tabel">
                <div className="dexskdi-detail__baris">
                  <dt className="teks-lembut">Ditangani</dt>
                  <dd className="mono">{dexTerpilih.ditangani}×</dd>
                </div>
                <div className="dexskdi-detail__baris">
                  <dt className="teks-lembut">Diagnosis + disposisi benar</dt>
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
                  <TeksTerbaca teks={kasusTerpilih.clue} className="dexskdi-detail__clue-teks tulis-tangan" />
                </div>
              )}

              {/* CODEX M14 #23 (keputusan Dr. Wirayuda): lapisan debrief M11.5
                  (mutiaraEbm / catatanRealita / panduanResmi) dipersist ke Buku
                  Saku — dulu hanya bisa dibaca SEKALI di modal PanelHasil, kini
                  bisa dibuka ulang kapan saja per kasus. Murni display, dibaca
                  langsung dari PACK (sama kelas dgn clue) — TAK menyentuh skor/
                  sidik jari. Muncul hanya bila kasus menyediakannya. */}
              {/* Anti-sumpek 2026-08-01: tiga lapisan ini dulu selalu terbuka —
                  di kolom detail 320px menjadi tembok teks. Kini <details>
                  terlipat (kontrak sama dgn folder PanelHasil); Mutiara Klinis
                  di atas tetap selalu tampil sebagai jangkar pedagogis. */}
              {kasusTerpilih?.mutiaraEbm && (
                <details className="dexskdi-detail__lapisan dexskdi-detail__lapisan--ebm">
                  <summary className="dexskdi-detail__lapisan-kepala">
                    <span className="judul-seksi">💡 Waspada — Temuan Bisa Menyesatkan</span>
                  </summary>
                  <TeksTerbaca teks={kasusTerpilih.mutiaraEbm} className="teks-kecil" />
                </details>
              )}
              {kasusTerpilih?.catatanRealita && (
                <details className="dexskdi-detail__lapisan dexskdi-detail__lapisan--realita">
                  <summary className="dexskdi-detail__lapisan-kepala">
                    <span className="judul-seksi">🏥 Realita FKTP</span>
                  </summary>
                  <TeksTerbaca teks={kasusTerpilih.catatanRealita} className="teks-kecil" />
                </details>
              )}
              {kasusTerpilih?.panduanResmi && (
                <details className="dexskdi-detail__lapisan dexskdi-detail__lapisan--panduan">
                  <summary className="dexskdi-detail__lapisan-kepala">
                    <span className="judul-seksi">📜 Panduan Resmi Kemenkes</span>
                  </summary>
                  <TeksTerbaca teks={kasusTerpilih.panduanResmi} className="teks-kecil" />
                </details>
              )}

              {kasusTerpilih !== undefined && (
                <DuelDiagnosis
                  key={`duel-${kasusTerpilih.id}`}
                  kasusId={kasusTerpilih.id}
                  dex={state.dex}
                />
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
