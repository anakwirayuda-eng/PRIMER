/**
 * RAPOR — 4 dimensi live (GDD §4 layar 6, §7).
 * SEMUA angka dari `hitungSkor` (@engine/director) + tally mentah — UI tidak
 * menghitung aturan apa pun. Grade ber-stempel, RRNS + status guillotine,
 * tabel tally ringkas, dan kalender musim 90 hari.
 */

import { useGame } from '../store'
import { hitungSkor } from '@engine/director'
import { MIN_RUJUKAN_GUILLOTINE } from '@engine/scoring'
import { HARI_STASE } from '@engine/paketUjian'
import { adaAktivitasTernilai, progresBadge } from '@engine/badge'
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
  /**
   * Penjelasan hover/fokus via TooltipInstan global (data-tip). Bantuan
   * visual — angka & status inti tetap di `nilai` (terbaca SR); preseden
   * data-tip polos sudah ada di file ini (badge "Belum ada aktivitas").
   */
  tip?: string
}

function KartuDimensi({
  judul,
  nilai,
  maks,
  rincian,
  belumDinilai = false,
}: {
  judul: string
  nilai: number
  maks: number
  rincian: BarisRincian[]
  /**
   * Audit CODEX 2026-07-16: header rapor sudah benar berkata "Belum ada data"
   * saat stase belum berjalan, TAPI keempat kartu dimensi tetap menampilkan
   * angkanya — Manajemen 15/15 & Resiliensi 15/15 (nilai penuh default, sebab
   * belum ada yang bisa memburuk) terbaca seolah SUDAH DIRAIH, dan UKP 0/35
   * terbaca seolah GAGAL padahal cuma belum mulai. Dua-duanya membohongi
   * pemain ke arah berlawanan. Saat belum ada aktivitas, dimensi ditampilkan
   * "belum dinilai" (—) agar konsisten dengan headernya.
   */
  belumDinilai?: boolean
}) {
  const persen = maks > 0 ? (nilai / maks) * 100 : 0
  const kelasIsi =
    persen >= 70 ? '' : persen >= 40 ? ' meter__isi--waspada' : ' meter__isi--bahaya'

  return (
    <section className="kartu rapor-dimensi">
      <div className="baris baris--antara">
        <span className="judul-seksi">{judul}</span>
        <span className="rapor-dimensi__nilai mono">
          {belumDinilai ? (
            <span className="teks-lembut" data-tip="Belum ada aktivitas yang bisa dinilai">
              —<span className="rapor-dimensi__maks">/{maks}</span>
            </span>
          ) : (
            <>
              {koma(nilai)}
              <span className="rapor-dimensi__maks">/{maks}</span>
            </>
          )}
        </span>
      </div>
      <div className="meter">
        <div className={`meter__isi${kelasIsi}`} style={{ width: belumDinilai ? '0%' : `${persen}%` }} />
      </div>
      <ul className="rapor-dimensi__rincian">
        {belumDinilai ? (
          <li className="rapor-dimensi__baris teks-kecil">
            <span className="teks-lembut">Belum dinilai — mulai menangani pasien atau turun ke desa</span>
          </li>
        ) : (
          rincian.map((r) => (
            <li key={r.label} className="rapor-dimensi__baris teks-kecil">
              <span className="teks-lembut" data-tip={r.tip}>{r.label}</span>
              <span className={`mono${r.waspada ? ' rapor-dimensi__waspada' : ''}`}>{r.nilai}</span>
            </li>
          ))
        )}
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
  // CODEX M14 #1: pasca-tamat pakai snapshot beku state.tamat.skor (bukan live)
  // supaya angka Rapor & LaporanAkhir konsisten & tak bisa berubah setelah
  // skor terkunci. Saat main (tamat undefined) tetap live.
  const skor = state.tamat?.skor ?? hitungSkor(state)
  const t = state.tally
  const r = skor.rincian

  const guillotineAman = r.guillotine >= 1
  const potonganGuillotine = Math.round((1 - r.guillotine) * 100)
  // S3 burnout-rapor (c): "guillotine" adalah jargon desain — pemain hanya
  // perlu tahu ADA ambang RRNS 5% yang memotong skor klinik, dan bahwa vonis
  // baru berjalan setelah sampel rujukan cukup (konstanta dari scoring.ts,
  // bukan salinan angka). Dulu "guillotine aman" juga MENYESATKAN di sampel
  // kecil: <3 rujukan selalu tampil "aman" walau RRNS 100%.
  const rrnsDivonis = t.rujukanTotal >= MIN_RUJUKAN_GUILLOTINE

  // S3 burnout-rapor (d): jurnal refleksi — tulisan pemain (TULIS_REFLEKSI,
  // blok sore) dulu ditelan state tanpa pernah bisa dibaca ulang. Terbaru dulu.
  const entriRefleksi = Object.entries(state.refleksi)
    .map(([hari, teks]) => ({ hari: Number(hari), teks: teks.trim() }))
    .filter((e) => e.teks !== '')
    .sort((a, b) => b.hari - a.hari)

  // Badge progress surface (deferred sejak beta.4, dituntaskan 2026-08-01):
  // urut yang sudah diraih dulu, lalu yang masih terkejar, lalu yang sudah
  // terkunci — pemain melihat "yang masih bisa dikejar" berkumpul di tengah.
  const badges = progresBadge(state)
  const badgeUrut = [...badges].sort((a, b) => {
    const peringkat = (x: (typeof badges)[number]): number => (x.raih ? 0 : x.gagal ? 2 : 1)
    return peringkat(a) - peringkat(b)
  })
  const badgeDiraih = badges.filter((b) => b.raih).length

  // CODEX audit UI/UX 2026-07-10 (#23): gradeDariTotal menstempel A-D tanpa
  // syarat "ada cukup data" — Hari 1 pagi (tally nol) tapi manajemen/resiliensi
  // mulai dari default tinggi (kapitasi awal, burnout=0) → total bisa jatuh ke
  // 'D — Perlu Pembinaan' walau belum ada aktivitas sama sekali.
  // 2026-08-01: definisinya dinaikkan ke engine (adaAktivitasTernilai) supaya
  // stempel di sini dan progres badge di bawah tak memakai dua salinan yang
  // bisa menyimpang — dulu sempat berbeda & badge berbunyi "Grade berjalan D".
  const punyaAktivitas = adaAktivitasTernilai(state)

  const barisTally: BarisRincian[] = [
    { label: 'Pasien ditangani', nilai: `${t.totalPasien}` },
    { label: 'Diagnosis benar', nilai: `${t.diagnosisBenar}` },
    {
      label: 'Diserahkan ke insting — bermasalah',
      tip: 'Pasien antrean yang tak sempat kamu periksa diselesaikan "instingmu" saat blok pagi ditutup. Yang bermasalah ikut menyeret akurasi diagnosis (masuk penyebut UKP) dan bisa kembali besok dengan kondisi memburuk — makin sering terjadi saat burnout tinggi.',
      nilai: `${t.autoBermasalah}`,
      waspada: t.autoBermasalah > 0,
    },
    { label: 'Stempel TEGAK (benar / salah)', nilai: `${t.tegakBenar} / ${t.tegakSalah}` },
    { label: 'Stempel SUSPEK (benar / salah)', nilai: `${t.suspekBenar} / ${t.suspekSalah}` },
    {
      label: 'Rujukan (non-spesialistik)',
      nilai: `${t.rujukanTotal} (${t.rujukanNonSpesialistik})`,
    },
    { label: 'Kasus rujukan ditahan (cowboy)', nilai: `${t.cowboy}`, waspada: t.cowboy > 0 },
    // CODEX audit (2026-07-12, temuan #1/#13B): dulu nol jejak di rapor —
    // konsisten dgn pola transparansi debrief pasca-skor-terkunci di sini.
    {
      label: 'Obat berbahaya diresepkan',
      nilai: `${t.obatBerbahaya}`,
      waspada: t.obatBerbahaya > 0,
    },
    { label: 'Percobaan resep dicegah sistem pengaman alergi', nilai: `${t.firewallTerpicu}` },
    {
      label: 'Antibiotik tanpa indikasi',
      nilai: `${t.antibiotikTanpaIndikasi}`,
      waspada: t.antibiotikTanpaIndikasi > 0,
    },
    { label: 'Lab tak relevan', nilai: `${t.labTakRelevan}` },
    {
      label: 'Kunjungan rumah (berhasil)',
      nilai: `${t.kunjunganTotal} (${t.kunjunganBerhasil})`,
    },
    { label: 'Diusir warga', nilai: `${t.kunjunganDiusir}` },
    {
      label: 'Peluang UKM diabaikan (apatis)',
      tip: 'Kunjungan rumah yang selesai tanpa satu pun teknik komunikasi tepat ATAU temuan terverifikasi — kesempatan pembinaan yang terbuang. Setiap kejadian memotong 2 poin UKM.',
      nilai: `${t.apathy}`,
      waspada: t.apathy > 0,
    },
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
            {punyaAktivitas ? (
              <span className={`stempel ${WARNA_STEMPEL[skor.grade]} rapor__grade-stempel`}>
                {skor.grade} — {skor.gradeLabel}
              </span>
            ) : (
              <span className="rapor__grade-stempel teks-lembut">
                Belum ada data — kembali setelah menangani pasien
              </span>
            )}
            {/* CODEX M14 #20: dulu total ~30/100 tetap tampil di samping "Belum
                ada data" (default Manajemen/Resiliensi 15+15) — membingungkan.
                Sembunyikan angka total selagi belum ada aktivitas. */}
            {punyaAktivitas && (
              <span className="rapor__total mono">
                {koma(skor.total)}
                <span className="rapor__total-maks">/100</span>
              </span>
            )}
          </div>
        </header>

        {/* ---- 4 kartu dimensi ------------------------------------------------ */}
        <div className="rapor__dimensi">
          <KartuDimensi
            judul="UKP · Klinik"
            belumDinilai={!punyaAktivitas}
            nilai={skor.ukp}
            maks={35}
            rincian={[
              { label: 'Akurasi diagnosis', nilai: `${koma(r.akurasiDiagnosis, 0)}%` },
              {
                label: 'Rujukan non-spesialistik (RRNS)',
                tip: 'RRNS = porsi rujukanmu untuk kasus kompetensi 4A yang semestinya tuntas di Puskesmas. Lewat 5%, skor klinik ikut terpotong — makin tinggi rasionya makin dalam potongannya, habis total di 25%. Vonis baru berjalan setelah minimal 3 rujukan.',
                nilai: !rrnsDivonis
                  ? `${koma(r.rrns)}% · belum divonis (rujukan < ${MIN_RUJUKAN_GUILLOTINE})`
                  : guillotineAman
                    ? `${koma(r.rrns)}% · dalam batas aman (≤5%)`
                    : `${koma(r.rrns)}% · skor klinik terpotong ${potonganGuillotine}%`,
                waspada: rrnsDivonis && !guillotineAman,
              },
              { label: 'Kalibrasi stempel (tegak/suspek)', nilai: `${koma(r.kalibrasi, 0)}%` },
              { label: 'Mutu proses SOAP', nilai: `${koma(r.prosesKlinis, 0)}%` },
            ]}
          />
          <KartuDimensi
            judul="UKM · Desa"
            belumDinilai={!punyaAktivitas}
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
              {
                label: 'Peserta Prolanis terkendali',
                tip: 'Fraksi roster Prolanis (hipertensi & DM) yang parameternya terkendali — menyumbang 20% skor UKM. Peserta yang tak pernah kamu sesi tetap dihitung tak terkendali, jadi mengabaikan Prolanis bukan strategi gratis.',
                nilai:
                  r.rasioProlanisTerkontrol === undefined
                    ? '—'
                    : state.prolanis.roster.length === 0
                      ? 'belum ada peserta'
                      : `${koma(r.rasioProlanisTerkontrol * 100, 0)}%`,
                waspada:
                  r.rasioProlanisTerkontrol !== undefined &&
                  state.prolanis.roster.length > 0 &&
                  r.rasioProlanisTerkontrol < 0.5,
              },
              { label: 'Kualitas komunikasi (MI + SAJI)', nilai: `${koma(r.kualitasMi, 0)}%` },
            ]}
          />
          <KartuDimensi
            judul="Manajemen"
            belumDinilai={!punyaAktivitas}
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
            belumDinilai={!punyaAktivitas}
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
            {/* Copy-audit 2026-08-01: "Tally" = nama field engine, bukan bahasa
                rapor yang dibaca dosen/mahasiswa. */}
            <span className="judul-seksi">Rekapitulasi Berjalan</span>
            <table className="rapor-tally__tabel">
              <tbody>
                {barisTally.map((b) => (
                  <tr key={b.label}>
                    <td className="teks-kecil teks-lembut" data-tip={b.tip}>{b.label}</td>
                    <td
                      className={`mono teks-kecil rapor-tally__angka${b.waspada ? ' rapor-dimensi__waspada' : ''}`}
                    >
                      {b.nilai}
                    </td>
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
                            role="img"
                            aria-label={
                              hariKe === state.hari
                                ? `Hari ${hariKe} — hari ini`
                                : hariKe < state.hari
                                  ? `Hari ${hariKe} — sudah lewat`
                                  : `Hari ${hariKe} — mendatang`
                            }
                            data-tip={hariKe === state.hari ? `Hari ${hariKe} — hari ini` : `Hari ${hariKe}`}
                          />
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
              {/* Audit CODEX UX 2026-07-16: legenda status — makna sel tak lagi
                  bergantung warna saja (WCAG 1.4.1); tiap sel juga ber-aria-label. */}
              <p className="teks-xs teks-lembut mono rapor-kal__legenda">
                Legenda: sel pekat = hari terlewat · sel berbingkai tebal = hari ini · sel pudar = mendatang.
              </p>
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

        {/* Pencapaian — permukaan progres badge (dituntaskan 2026-08-01).
            <details> tertutup default, sama alasan dgn Jurnal Refleksi di
            bawah: ini bahan kejar-mengejar opsional, bukan angka rapor yang
            wajib dibaca — dasbor utama tak boleh bertambah padat. */}
        <details className="kartu rapor-badge">
          <summary className="judul-seksi rapor-badge__summary">
            Pencapaian — {badgeDiraih}/{badges.length} diraih
          </summary>
          <p className="teks-xs teks-lembut rapor-badge__intro">
            Pencapaian tidak menambah nilai rapor. Semuanya dihitung ulang dari keadaan terkini,
            jadi angka di sini ikut bergerak selama stase masih berjalan.
          </p>
          <ul className="rapor-badge__daftar">
            {badgeUrut.map((b) => (
              <li
                key={b.id}
                className={`rapor-badge__entri${b.raih ? ' rapor-badge__entri--raih' : ''}${
                  b.gagal ? ' rapor-badge__entri--gagal' : ''
                }`}
              >
                <span className="rapor-badge__ikon" aria-hidden="true">
                  {b.ikon}
                </span>
                <div className="rapor-badge__isi">
                  <div className="baris baris--antara rapor-badge__kepala">
                    <span className="rapor-badge__nama">{b.nama}</span>
                    {b.raih ? (
                      <span className="chip chip--daun">DIRAIH</span>
                    ) : b.gagal ? (
                      <span className="chip chip--merah">TERKUNCI</span>
                    ) : (
                      <span className="mono teks-xs rapor-badge__angka">
                        {Math.min(b.kini, b.target)}/{b.target}
                      </span>
                    )}
                  </div>
                  <p className="teks-xs teks-lembut">{b.deskripsi}</p>
                  {/* Alasan terkunci/tertahan lebih berguna drpd bar kosong:
                      pemain perlu tahu APA yang menghalangi, bukan sekadar
                      bahwa ia belum sampai. */}
                  {!b.raih && b.gagal && (
                    <p className="teks-xs rapor-badge__gagal">{b.gagal}</p>
                  )}
                  {!b.raih && !b.gagal && b.tertahan && (
                    <p className="teks-xs teks-lembut rapor-badge__tertahan">{b.tertahan}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </details>

        {/* S3 burnout-rapor (d): jurnal refleksi — read-back tulisan pemain.
            <details> tertutup default: ini arsip pribadi, bukan dasbor angka. */}
        <details className="kartu rapor-refleksi">
          <summary className="judul-seksi rapor-refleksi__summary">
            Jurnal Refleksi{entriRefleksi.length > 0 ? ` — ${entriRefleksi.length} catatan` : ''}
          </summary>
          {entriRefleksi.length === 0 ? (
            <p className="teks-kecil teks-lembut rapor-refleksi__kosong">
              Belum ada catatan. Refleksi yang kamu tulis di Meja Kerja saat sore akan terkumpul di sini.
            </p>
          ) : (
            <ul className="rapor-refleksi__daftar">
              {entriRefleksi.map((e) => (
                <li key={e.hari} className="rapor-refleksi__entri">
                  <span className="mono teks-xs teks-lembut">Hari {e.hari}</span>
                  <p className="teks-kecil rapor-refleksi__teks">{e.teks}</p>
                </li>
              ))}
            </ul>
          )}
        </details>
      </div>
    </div>
  )
}
