/**
 * SCORING — SATU-SATUNYA formula skor 4 dimensi (GDD §7) + ringkasan debrief malam.
 * Membaca tally mentah dari state; tidak pernah menghitung ulang dari UI.
 * UKP 35 (akurasi × Referral Guillotine × kalibrasi stempel) · UKM 35 (IKS + MI −
 * apathy/karma) · Manajemen 15 (stewardship + kapitasi) · Resiliensi 15 (burnout).
 */

import type { GameState, Skor4Dimensi } from './state'

function clamp(nilai: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, nilai))
}

function gradeDariTotal(total: number): { grade: Skor4Dimensi['grade']; gradeLabel: string } {
  if (total >= 85) return { grade: 'A', gradeLabel: 'PTT Teladan' }
  if (total >= 70) return { grade: 'B', gradeLabel: 'Kompeten' }
  if (total >= 55) return { grade: 'C', gradeLabel: 'Lulus' }
  return { grade: 'D', gradeLabel: 'Perlu Pembinaan' }
}

/**
 * Skor 4 dimensi live — dipanggil UI Rapor & rekap slice.
 * Semua komponen diturunkan HANYA dari tally + state agregat (aturan pilar #5).
 */
export function hitungSkor(state: GameState): Skor4Dimensi {
  const t = state.tally

  /* -- UKP (0-35): akurasi diagnosis × Referral Guillotine × kalibrasi -------- */
  // Anti cherry-picking: pasien yang dilewatkan lalu bermasalah ikut jadi
  // penyebut akurasi — melewatkan antrian bukan strategi gratis.
  const penyebutAkurasi = t.totalPasien + t.autoBermasalah
  const akurasi = penyebutAkurasi > 0 ? t.diagnosisBenar / penyebutAkurasi : 0
  const rrns = t.rujukanTotal > 0 ? (t.rujukanNonSpesialistik / t.rujukanTotal) * 100 : 0
  // Guillotine butuh sampel: satu rujukan keliru di hari pertama tidak boleh
  // memusnahkan seluruh UKP (denominator kecil meledakkan rasio).
  const guillotineAktif = t.rujukanTotal >= 3
  const guillotine = guillotineAktif ? Math.max(0, 1 - Math.max(0, rrns - 5) * 0.05) : 1
  const totalDiagnosis = t.tegakBenar + t.tegakSalah + t.suspekBenar + t.suspekSalah
  const kalibrasi =
    ((t.tegakBenar + 0.9 * t.suspekBenar + 0.4 * t.suspekSalah) / Math.max(1, totalDiagnosis)) * 100
  // Confidence-tagging (M3.13): merujuk kasus wajib-rujuk dengan TEPAT dihargai —
  // guillotine tidak boleh mengajarkan "jangan pernah merujuk".
  const bonusRujukanTepat = Math.min(3, t.rujukanTepat * 0.75)
  // IGD (M3.14): stabil + disposisi TEPAT = bonus kecil; disposisi keliru = tak
  // dihargai (bukan dihukum — pasien tetap selamat); Kode Hitam = luka besar.
  const efekIgd =
    Math.min(2, t.igdStabil * 0.5) - 0.5 * t.igdSalahDisposisi - 3 * t.igdMeninggal
  const ukp = clamp(
    ((0.75 * akurasi * 100 + 0.25 * kalibrasi) / 100) * 35 * guillotine -
      2 * t.cowboy +
      bonusRujukanTepat +
      efekIgd,
    0,
    35,
  )

  /* -- UKM (0-35): IKS desa + kunjungan berhasil + kualitas MI ---------------- */
  const rwBerdata = state.desa.rw.filter((r) => r.iks > 0)
  const iksDesa =
    rwBerdata.length > 0 ? rwBerdata.reduce((jml, r) => jml + r.iks, 0) / rwBerdata.length : 0
  const kualitasMi = t.miTotal > 0 ? (t.miTepat / t.miTotal) * 100 : 0
  const rasioKunjungan = t.kunjunganBerhasil / Math.max(1, t.kunjunganTotal)
  const ukm = clamp(
    (0.5 * iksDesa + 0.25 * rasioKunjungan + 0.25 * (kualitasMi / 100)) * 35 -
      2 * t.apathy -
      2 * t.karmaTerjadi +
      1 * t.karmaDicegah,
    0,
    35,
  )

  /* -- Manajemen (0-15): stewardship lab/antibiotik + kesehatan kapitasi ------ */
  // rujukanDitolak = churn administratif jejaring (salah RS / bed / kasus FKTP).
  const manajemen = clamp(
    15 -
      0.5 * t.labTakRelevan -
      1 * t.antibiotikTanpaIndikasi -
      0.5 * t.rujukanDitolak -
      (state.kapitasi < 10_000_000 ? 3 : 0),
    0,
    15,
  )

  /* -- Resiliensi (0-15): hari kelelahan + burnout ----------------------------- */
  const resiliensi = clamp(15 - 1.5 * t.hariKelelahan - state.burnout / 10, 0, 15)

  const total = ukp + ukm + manajemen + resiliensi
  const { grade, gradeLabel } = gradeDariTotal(total)

  return {
    ukp,
    ukm,
    manajemen,
    resiliensi,
    total,
    grade,
    gradeLabel,
    rincian: {
      akurasiDiagnosis: akurasi * 100,
      rrns,
      guillotine,
      iksDesa,
      kualitasMi,
      kalibrasi,
    },
  }
}

const NILAI_GRADE: Record<'A' | 'B' | 'C' | 'D', number> = { A: 4, B: 3, C: 2, D: 1 }

/**
 * Ringkasan debrief malam (blok sore): grade huruf hari ini + catatan naratif.
 * Grade '—' bila belum ada encounter yang selesai hari ini.
 */
export function ringkasanHarian(state: GameState): { grade: string; catatan: string[] } {
  const hasil = state.klinik.selesaiHariIni
  const catatan: string[] = []

  let grade = '—'
  if (hasil.length > 0) {
    const rata = hasil.reduce((jml, p) => jml + NILAI_GRADE[p.grade], 0) / hasil.length
    grade = rata >= 3.5 ? 'A' : rata >= 2.5 ? 'B' : rata >= 1.5 ? 'C' : 'D'
  }

  // Kasus klinik yang bermasalah — beserta clue EBM (feedback datang di debrief,
  // bukan instan per pertanyaan; keputusan juri GDD §11).
  for (const p of hasil) {
    if (!p.diagnosisBenar) {
      catatan.push(`Diagnosis untuk ${p.pasienNama} meleset. Pelajari lagi: ${p.clue}`)
    }
    if (p.rujukanNonSpesialistik) {
      catatan.push(
        `Rujukan ${p.pasienNama} tergolong non-spesialistik — kasus kompetensi 4A seharusnya tuntas di FKTP. RRNS-mu naik.`,
      )
    }
    if (p.cowboy) {
      catatan.push(
        `${p.pasienNama} seharusnya dirujuk. Menahan kasus di luar kompetensi membahayakan pasien.`,
      )
    }
    if (p.antibiotikTanpaIndikasi) {
      catatan.push(
        `Antibiotik untuk ${p.pasienNama} tidak terindikasi — catatan stewardship ini sampai ke Dinkes.`,
      )
    }
    if (p.konsekuensiDijadwalkan) {
      catatan.push(
        `Tatalaksana ${p.pasienNama} belum tuntas. Jangan kaget bila ia kembali dalam beberapa hari.`,
      )
    }
  }

  // Kunjungan rumah hari ini.
  const kunjungan = state.hasilKunjunganHariIni
  if (kunjungan) {
    if (kunjungan.diusir) {
      catatan.push(`Kunjunganmu berakhir buruk — kamu diminta pulang. ${kunjungan.narasiPenutup}`)
    } else if (kunjungan.berhasil) {
      catatan.push(`Kunjungan rumah berjalan baik. ${kunjungan.narasiPenutup}`)
    } else {
      catatan.push(`Kunjungan belum membuahkan hasil. ${kunjungan.narasiPenutup}`)
    }
  }

  // Karma yang meletus hari ini (surat IGD subuh) + firasat jatuh tempo dekat.
  for (const surat of state.inbox) {
    if (surat.jenis === 'karma' && surat.hari === state.hari) {
      catatan.push(`${surat.judul} — baca suratnya di Kotak Masuk. Ini konsekuensi bernama.`)
    }
  }
  for (const j of state.jadwal) {
    if (j.jenis === 'karma_igd' && j.hari > state.hari && j.hari - state.hari <= 2) {
      catatan.push(
        `Firasat buruk: ada keluarga binaan yang butuh kunjunganmu segera (${j.hari - state.hari} hari lagi).`,
      )
    }
  }

  // Pasien auto-resolve yang bermasalah.
  const auto = state.klinik.autoHariIni
  if (auto.bermasalah > 0) {
    catatan.push(
      `${auto.bermasalah} dari ${auto.jumlah} pasien yang kamu lewatkan pagi tadi tampak bermasalah — instingmu tidak selalu benar.`,
    )
  }

  if (catatan.length === 0) {
    catatan.push('Hari berjalan mulus. Istirahatlah — besok pagi antrian sudah menunggu.')
  }

  return { grade, catatan }
}
