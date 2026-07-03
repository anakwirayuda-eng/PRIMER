/**
 * RAPOR — 4 dimensi live (GDD §4 layar 6, §7).
 * SEMUA angka dari `hitungSkor` (@engine/director) + tally mentah — UI tidak
 * menghitung aturan apa pun. Grade ber-stempel, RRNS + status guillotine,
 * tabel tally ringkas, dan kalender musim 90 hari.
 */

import { useGame } from '../store'
import { hitungSkor } from '@engine/director'
import { HARI_STASE } from '@engine/paketUjian'
import type { Musim } from '@engine/state'
import './Rapor.css'

/** Format angka Indonesia: koma sebagai desimal. */
function koma(nilai: number, desimal = 1): string {
  return nilai.toFixed(desimal).replace('.', ',')
}

interface BarisRincian {
  label: string
  nilai: string
  waspada?: boolean
}

function KartuDimensi({
  judul,
  nilai,
  maks,
  rincian,
}: {
  judul: string
  nilai: number
  maks: number
  rincian: BarisRincian[]
}) {
  const persen = maks > 0 ? (nilai / maks) * 100 : 0
  const kelasIsi =
    persen >= 70 ? '' : persen >= 40 ? ' meter__isi--waspada' : ' meter__isi--bahaya'

  return (
    <section className="kartu rapor-dimensi">
      <div className="baris baris--antara">
        <span className="judul-seksi">{judul}</span>
        <span className="rapor-dimensi__nilai mono">
          {koma(nilai)}
          <span className="rapor-dimensi__maks">/{maks}</span>
        </span>
      </div>
      <div className="meter">
        <div className={`meter__isi${kelasIsi}`} style={{ width: `${persen}%` }} />
      </div>
      <ul className="rapor-dimensi__rincian">
        {rincian.map((r) => (
          <li key={r.label} className="rapor-dimensi__baris teks-kecil">
            <span className="teks-lembut">{r.label}</span>
            <span className={`mono${r.waspada ? ' rapor-dimensi__waspada' : ''}`}>{r.nilai}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

const STRIP_MUSIM: { musim: Musim; label: string; mulai: number }[] = [
  { musim: 'hujan', label: 'Musim Hujan · Hari 1–30', mulai: 1 },
  { musim: 'pancaroba', label: 'Pancaroba · Hari 31–60', mulai: 31 },
  { musim: 'kemarau', label: 'Kemarau · Hari 61–90', mulai: 61 },
]

const WARNA_STEMPEL: Record<'A' | 'B' | 'C' | 'D', string> = {
  A: 'stempel--hijau',
  B: 'stempel--biru',
  C: 'stempel--kunyit',
  D: 'stempel--merah',
}

export function Rapor() {
  const state = useGame((s) => s.state)!
  const skor = hitungSkor(state)
  const t = state.tally
  const r = skor.rincian

  const guillotineAman = r.guillotine >= 1
  const potonganGuillotine = Math.round((1 - r.guillotine) * 100)

  const barisTally: { label: string; nilai: string }[] = [
    { label: 'Pasien ditangani', nilai: `${t.totalPasien}` },
    { label: 'Diagnosis benar', nilai: `${t.diagnosisBenar}` },
    { label: 'Stempel TEGAK (benar / salah)', nilai: `${t.tegakBenar} / ${t.tegakSalah}` },
    { label: 'Stempel SUSPEK (benar / salah)', nilai: `${t.suspekBenar} / ${t.suspekSalah}` },
    {
      label: 'Rujukan (non-spesialistik)',
      nilai: `${t.rujukanTotal} (${t.rujukanNonSpesialistik})`,
    },
    { label: 'Kasus rujukan ditahan (cowboy)', nilai: `${t.cowboy}` },
    { label: 'Antibiotik tanpa indikasi', nilai: `${t.antibiotikTanpaIndikasi}` },
    { label: 'Lab tak relevan', nilai: `${t.labTakRelevan}` },
    {
      label: 'Kunjungan rumah (berhasil)',
      nilai: `${t.kunjunganTotal} (${t.kunjunganBerhasil})`,
    },
    { label: 'Diusir warga', nilai: `${t.kunjunganDiusir}` },
    { label: 'Karma terjadi / dicegah', nilai: `${t.karmaTerjadi} / ${t.karmaDicegah}` },
    { label: 'Hari kelelahan', nilai: `${t.hariKelelahan}` },
  ]

  return (
    <div className="rapor">
      <div className="rapor__gulir">
        {/* ---- Kepala: identitas + grade ber-stempel ------------------------- */}
        <header className="rapor__kepala kertas">
          <div className="rapor__identitas">
            <span className="judul-seksi">Rapor Stase — Dinas Kesehatan</span>
            <h1 className="rapor__judul">dr. {state.namaDokter}</h1>
            <p className="teks-kecil teks-lembut">
              Puskesmas Desa Sukamaju · Hari ke-{state.hari} dari {HARI_STASE[state.mode]}
            </p>
          </div>
          <div className="rapor__grade">
            <span className={`stempel ${WARNA_STEMPEL[skor.grade]} rapor__grade-stempel`}>
              {skor.grade} — {skor.gradeLabel}
            </span>
            <span className="rapor__total mono">
              {koma(skor.total)}
              <span className="rapor__total-maks">/100</span>
            </span>
          </div>
        </header>

        {/* ---- 4 kartu dimensi ------------------------------------------------ */}
        <div className="rapor__dimensi">
          <KartuDimensi
            judul="UKP · Klinik"
            nilai={skor.ukp}
            maks={35}
            rincian={[
              { label: 'Akurasi diagnosis', nilai: `${koma(r.akurasiDiagnosis, 0)}%` },
              {
                label: 'RRNS (rujukan non-spesialistik)',
                nilai: guillotineAman
                  ? `${koma(r.rrns)}% · guillotine aman`
                  : `${koma(r.rrns)}% · terpangkas ${potonganGuillotine}%`,
                waspada: !guillotineAman,
              },
              { label: 'Kalibrasi stempel (tegak/suspek)', nilai: `${koma(r.kalibrasi, 0)}%` },
            ]}
          />
          <KartuDimensi
            judul="UKM · Desa"
            nilai={skor.ukm}
            maks={35}
            rincian={[
              {
                label: 'IKS desa (rata-rata RW)',
                nilai: r.iksDesa > 0 ? koma(r.iksDesa, 2) : 'belum ada data',
                waspada: r.iksDesa > 0 && r.iksDesa < 0.5,
              },
              {
                label: 'Kunjungan berhasil',
                nilai: `${t.kunjunganBerhasil}/${t.kunjunganTotal}`,
              },
              { label: 'Kualitas MI (wawancara)', nilai: `${koma(r.kualitasMi, 0)}%` },
            ]}
          />
          <KartuDimensi
            judul="Manajemen"
            nilai={skor.manajemen}
            maks={15}
            rincian={[
              {
                label: 'Lab tak relevan',
                nilai: `${t.labTakRelevan}`,
                waspada: t.labTakRelevan > 0,
              },
              {
                label: 'Antibiotik tanpa indikasi',
                nilai: `${t.antibiotikTanpaIndikasi}`,
                waspada: t.antibiotikTanpaIndikasi > 0,
              },
              {
                label: 'Kapitasi BPJS',
                nilai: `Rp ${Math.round(state.kapitasi / 1000).toLocaleString('id-ID')}k`,
                waspada: state.kapitasi < 10_000_000,
              },
            ]}
          />
          <KartuDimensi
            judul="Resiliensi"
            nilai={skor.resiliensi}
            maks={15}
            rincian={[
              {
                label: 'Hari kelelahan (stamina habis)',
                nilai: `${t.hariKelelahan}`,
                waspada: t.hariKelelahan > 0,
              },
              {
                label: 'Burnout',
                nilai: `${Math.round(state.burnout)}/100`,
                waspada: state.burnout >= 40,
              },
            ]}
          />
        </div>

        {/* ---- Tally + kalender musim ----------------------------------------- */}
        <div className="rapor__bawah">
          <section className="kartu rapor-tally">
            <span className="judul-seksi">Tally Berjalan</span>
            <table className="rapor-tally__tabel">
              <tbody>
                {barisTally.map((b) => (
                  <tr key={b.label}>
                    <td className="teks-kecil teks-lembut">{b.label}</td>
                    <td className="mono teks-kecil rapor-tally__angka">{b.nilai}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {state.mode === 'karier' ? (
            <section className="kartu rapor-kal">
              <span className="judul-seksi">Kalender Musim — 90 Hari</span>
              <div className="rapor-kal__strip-wrap">
                {STRIP_MUSIM.map((strip) => (
                  <div key={strip.musim} className={`rapor-kal__strip rapor-kal__strip--${strip.musim}`}>
                    <span className="rapor-kal__label teks-xs teks-lembut mono">{strip.label}</span>
                    <div className="rapor-kal__hari-grid">
                      {Array.from({ length: 30 }, (_, i) => {
                        const hariKe = strip.mulai + i
                        const kelas =
                          hariKe === state.hari
                            ? ' rapor-kal__hari--kini'
                            : hariKe < state.hari
                              ? ' rapor-kal__hari--lewat'
                              : ''
                        return (
                          <span
                            key={hariKe}
                            className={`rapor-kal__hari${kelas}`}
                            title={hariKe === state.hari ? `Hari ${hariKe} — hari ini` : `Hari ${hariKe}`}
                          />
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
              <p className="teks-xs teks-lembut rapor-kal__disclaimer">
                Skor dikunci permanen di Hari {HARI_STASE.karier + 1} — sampai saat itu, setiap
                keputusanmu masih bisa mengubah rapor ini.
              </p>
            </section>
          ) : (
            // CODEX audit 2026-07-04: kalender musim 3×30 hari khusus mode karier
            // (90 hari) — tak berlaku utk stase ujian 30 hari, dulu tetap tampil
            // "90 Hari"/"Hari 91" yang keliru & membingungkan peserta ujian.
            <section className="kartu rapor-kal">
              <span className="judul-seksi">Stase Ujian — {HARI_STASE.ujian} Hari</span>
              <p className="teks-kecil teks-lembut">
                Mode ujian tak memakai kalender musim karier. Skor dikunci permanen di Hari{' '}
                {HARI_STASE.ujian + 1} — sampai saat itu, setiap keputusanmu masih bisa mengubah
                rapor ini.
              </p>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
