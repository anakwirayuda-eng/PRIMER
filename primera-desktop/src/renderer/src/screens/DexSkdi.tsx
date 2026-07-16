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

type FilterDex = 'semua' | 'belum' | 'dijumpai' | 'tersertifikasi' | 'dikuasai'

export function DexSkdi() {
  const state = useGame((s) => s.state)!
  const [pilihanId, setPilihanId] = useState<string | null>(null)
  const [cari, setCari] = useState('')
  // Dengan 144 entri, pertanyaan utama pemain adalah "mana yang belum saya
  // tuntaskan" — chip progres di header kini merangkap filter klik.
  const [filter, setFilter] = useState<FilterDex>('semua')
  const toggleFilter = (f: FilterDex) => setFilter((cur) => (cur === f ? 'semua' : f))

  // Fix CODEX-25 #2/Q7 (jalur kritis DeepThink 2026-07-12): dulu HANYA satu
  // metrik "dikenali" = entri dex ADA = pernah di-encounter — mahasiswa yg
  // salah diagnosis 67× tetap lihat "67/67 dikenali". Kegagalan rubrik.
  // Tiga tingkat kini (data sudah ADA di DexEntry, murni display — tak sentuh
  // reducer/skor/save, jangkau save lama live):
  //   DIJUMPAI      = pernah bertemu (dex ada, siluet terbuka)  — `ditangani≥1`
  //   TERSERTIFIKASI = diagnosis+disposisi benar minimal 1×      — `benar≥1`
  //   DIKUASAI      = ★3 (Leitner, bisa meluntur)               — `bintang≥3`
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
  }, [cari, filter, state.dex])

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
            Bintang penguasaan meluntur bila lama tidak dilatih — kasus yang lemah akan
            dikirim ulang ke antrian klinikmu sampai benar-benar tuntas.
          </p>
        </div>
        <div className="dexskdi__progres">
          <div className="dexskdi__tiga-tingkat">
            <button
              type="button"
              className={`chip mono dexskdi__filter${filter === 'belum' ? ' dexskdi__filter--aktif' : ''}`}
              aria-pressed={filter === 'belum'}
              onClick={() => toggleFilter('belum')}
              title="Belum kamu jumpai — klik untuk menyaring hanya yang belum"
            >
              {jumlahBelum} belum
            </button>
            <button
              type="button"
              className={`chip chip--kunyit mono dexskdi__filter${filter === 'dijumpai' ? ' dexskdi__filter--aktif' : ''}`}
              aria-pressed={filter === 'dijumpai'}
              onClick={() => toggleFilter('dijumpai')}
              title="Pernah kamu temui di klinik (benar atau salah) — klik untuk menyaring"
            >
              {jumlahDijumpai} dijumpai
            </button>
            <button
              type="button"
              className={`chip chip--daun mono dexskdi__filter${filter === 'tersertifikasi' ? ' dexskdi__filter--aktif' : ''}`}
              aria-pressed={filter === 'tersertifikasi'}
              onClick={() => toggleFilter('tersertifikasi')}
              title="Diagnosis DAN disposisi benar minimal sekali — klik untuk menyaring"
            >
              {jumlahTersertifikasi}/{TOTAL_ENTRI} tersertifikasi
            </button>
            <button
              type="button"
              className={`chip chip--biru mono dexskdi__filter${filter === 'dikuasai' ? ' dexskdi__filter--aktif' : ''}`}
              aria-pressed={filter === 'dikuasai'}
              onClick={() => toggleFilter('dikuasai')}
              title="Penguasaan penuh ★3 (bisa meluntur bila lama tak dilatih) — klik untuk menyaring"
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
            <input
              type="text"
              className="dexskdi__cari"
              value={cari}
              onChange={(e) => setCari(e.target.value)}
              placeholder="Cari penyakit atau kode ICD-10…"
              aria-label="Cari SKDI"
            />
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
                        <span className="dexskdi-kartu__dijumpai-tag mono" title="Dijumpai — belum tersertifikasi">
                          dijumpai
                        </span>
                      ) : (
                        <Bintang jumlah={dex.bintang} />
                      )}
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
                  <p className="dexskdi-detail__clue-teks tulis-tangan">{kasusTerpilih.clue}</p>
                </div>
              )}

              {/* CODEX M14 #23 (keputusan Dr. Wirayuda): lapisan debrief M11.5
                  (mutiaraEbm / catatanRealita / panduanResmi) dipersist ke Buku
                  Saku — dulu hanya bisa dibaca SEKALI di modal PanelHasil, kini
                  bisa dibuka ulang kapan saja per kasus. Murni display, dibaca
                  langsung dari PACK (sama kelas dgn clue) — TAK menyentuh skor/
                  sidik jari. Muncul hanya bila kasus menyediakannya. */}
              {kasusTerpilih?.mutiaraEbm && (
                <div className="dexskdi-detail__lapisan dexskdi-detail__lapisan--ebm">
                  <span className="judul-seksi">💡 Waspada — Temuan Bisa Menyesatkan</span>
                  <p className="teks-kecil">{kasusTerpilih.mutiaraEbm}</p>
                </div>
              )}
              {kasusTerpilih?.catatanRealita && (
                <div className="dexskdi-detail__lapisan dexskdi-detail__lapisan--realita">
                  <span className="judul-seksi">🏥 Realita FKTP</span>
                  <p className="teks-kecil">{kasusTerpilih.catatanRealita}</p>
                </div>
              )}
              {kasusTerpilih?.panduanResmi && (
                <div className="dexskdi-detail__lapisan dexskdi-detail__lapisan--panduan">
                  <span className="judul-seksi">📜 Panduan Resmi Kemenkes</span>
                  <p className="teks-kecil">{kasusTerpilih.panduanResmi}</p>
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
