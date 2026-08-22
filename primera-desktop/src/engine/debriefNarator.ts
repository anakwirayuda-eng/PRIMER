/**
 * NARATOR DEBRIEF MALAM — perakitan KALIMAT yang dibaca mahasiswa di blok sore.
 *
 * Berkas ini SENGAJA TIDAK DIBEKUKAN. Ia dipisah dari `scoring.ts` pada
 * 2026-08-22 karena keduanya dulu bercampur: satu berkas memuat matematika
 * yang menentukan kelulusan DAN kalimat-kalimat naratif. Akibatnya memperbaiki
 * satu typo pada catatan malam mengubah hash berkas beku, memaksa bump
 * REVISI_ENGINE, dan menjatuhkan seluruh dosier mahasiswa yang sedang berjalan
 * ke "tidak_dapat_diverifikasi" — sehingga tak seorang pun berani merapikan
 * tata bahasa di tengah semester.
 *
 * Batas pemisahannya tegas: ANGKA tinggal di `scoring.ts` (ambang grade ada di
 * `gradeHarian`), KATA-KATA tinggal di sini. Fungsi di berkas ini murni
 * display — ia dipanggil renderer (MejaKerja) dan TIDAK PERNAH oleh reducer,
 * jadi isinya tak pernah memberi makan replay maupun state tersimpan.
 *
 * Kalau suatu hari ada ATURAN baru yang menyelinap ke sini (ambang, bobot,
 * gerbang), ia salah tempat — pindahkan ke scoring.ts dan bekukan.
 */
import type { GameState } from './state'
import { gradeHarian } from './scoring'
import { penutupanAwalSah } from './kunjungan'

export function ringkasanHarian(state: GameState): { grade: string; catatan: string[] } {
  const hasil = state.klinik.selesaiHariIni
  const hasilResmi = hasil.filter((item) => !item.formativePrototype)
  const hasilFormatif = hasil.filter((item) => item.formativePrototype)
  const catatan: string[] = []

  // Aturan grade sengaja tinggal di scoring.ts yang beku — lihat komentar di sana.
  const grade = gradeHarian(state)

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
    if (p.tindakanBerbahaya) {
      catatan.push(
        `Tindakan pada ${p.pasienNama} berbahaya dan seharusnya tidak dilakukan. Baca kembali batas aman prosedurnya.`,
      )
    }
    if (p.konsekuensiDijadwalkan) {
      catatan.push(
        `Tatalaksana ${p.pasienNama} belum tuntas. Jangan kaget bila ia kembali dalam beberapa hari.`,
      )
    }
  }

  if (hasilFormatif.length > 0) {
    catatan.push(
      `${hasilFormatif.length} latihan formatif selesai. Umpan baliknya tetap ditampilkan, tetapi tidak mengubah grade, Dex, kapitasi, atau progres formal.`,
    )
  }

  // Kunjungan rumah hari ini.
  const kunjungan = state.hasilKunjunganHariIni
  if (kunjungan) {
    const kontakAwalSah = penutupanAwalSah(kunjungan.hasilAkhir)
    if (kunjungan.hasilAkhir === 'ditolak_total') {
      catatan.push(`Keluarga belum menerima kunjungan. Kamu menghormati penolakan dan membuat janji ulang. ${kunjungan.narasiPenutup}`)
    } else if (kunjungan.hasilAkhir === 'diterima_terpaksa') {
      catatan.push(`Keluarga menerima dengan terpaksa. Kamu menutup kontak tanpa memaksakan pembahasan dan membuat janji ulang. ${kunjungan.narasiPenutup}`)
    } else if (kunjungan.diusir) {
      catatan.push(`Kunjunganmu berakhir buruk — kamu diminta pulang. ${kunjungan.narasiPenutup}`)
    } else if (kunjungan.berhasil) {
      catatan.push(`Kunjungan rumah berjalan baik. ${kunjungan.narasiPenutup}`)
    } else {
      catatan.push(`Kunjungan belum membuahkan hasil. ${kunjungan.narasiPenutup}`)
    }
    // Audit CODEX UKM 2026-07-16 #10: "rincian penilaian di debrief sore"
    // kini janji yang DITEPATI — kualitas MI, ketepatan hipotesis COM-B,
    // pergeseran trust, dan catatan penulis skenario utk pilihan yg meleset.
    if (!kontakAwalSah) {
      // Copy-audit 2026-08-01: dulu dump telemetri ber-· dengan istilah mentah
      // ("trust", "hipotesis hambatan") — kini kalimat utuh bahasa pemain.
      const rincianIngatkan = kunjungan.kualitasIngatkan === undefined
        ? ''
        : ` Fase Ingatkan ${kunjungan.kualitasIngatkan}/100, komunikasi SAJI ${kunjungan.kualitasSaji}/100.`
      catatan.push(
        `Rincian kunjungan — mutu wawancara motivasional (MI): ${kunjungan.kualitasMi}/100.${rincianIngatkan} ` +
          `Dugaan hambatanmu ${kunjungan.hipotesisBenar ? 'tepat' : 'meleset'}. ` +
          `Kepercayaan keluarga ${kunjungan.trustDelta >= 0 ? 'naik ' : 'turun '}${Math.abs(kunjungan.trustDelta)}. ` +
          `${kunjungan.indikatorTerverifikasi.length} indikator berhasil kamu verifikasi sendiri.`,
      )
    }
    for (const cat of kunjungan.catatanPedagogis ?? []) {
      catatan.push(`Catatan pembimbing: ${cat}`)
    }
  }

  // Karma yang meletus hari ini (surat IGD subuh) + firasat jatuh tempo dekat.
  for (const surat of state.inbox) {
    if (surat.jenis === 'karma' && surat.hari === state.hari) {
      catatan.push(`${surat.judul} — baca suratnya di Kotak Masuk. Ini buah dari keputusan yang pernah kamu ambil.`)
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

  if (catatan.length === 0 && hasilResmi.length > 0) {
    catatan.push('Hari berjalan mulus. Istirahatlah — besok pagi antrian sudah menunggu.')
  } else if (catatan.length === 0) {
    catatan.push('Belum ada pasien resmi yang bisa dinilai hari ini.')
  }

  return { grade, catatan }
}
