/**
 * SCORING — SATU-SATUNYA formula skor 4 dimensi (GDD §7) + ringkasan debrief malam.
 * Membaca tally mentah dari state; tidak pernah menghitung ulang dari UI.
 * UKP 35 (outcome + mutu proses × Referral Guillotine) · UKM 35 (IKS + MI −
 * apathy/karma) · Manajemen 15 (stewardship + kapitasi) · Resiliensi 15 (burnout).
 */

import type { GameState, Skor4Dimensi } from './state'
import { prolanisTerkendali } from './kegiatan'
import { penutupanAwalSah } from './kunjungan'

function clamp(nilai: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, nilai))
}

/**
 * S3 burnout-rapor: ambang sampel guillotine diekspor supaya Rapor bisa
 * berkata jujur "belum divonis" tanpa menyalin angka 3 yang bisa drift
 * diam-diam dari aturan aslinya di hitungSkor.
 */
export const MIN_RUJUKAN_GUILLOTINE = 3

/**
 * DeepThink ronde-2 (Hukum Bilangan Kecil): `rasioKunjungan`/`kualitasMi` lama
 * pakai `Math.max(1, total)` sbg penyebut — mahasiswa yang kunjungan SEKALI lalu
 * berhasil mengunci rasio 100% SELAMANYA dgn usaha nyaris nol, setara dgn yang
 * kunjungan 20× dan gagal 2. Pola sama persis `guillotineAktif = rujukanTotal>=3`
 * di bawah (proteksi sampel-kecil sudah ada utk metrik LAIN di file yang sama) —
 * di sini didifusikan (bukan on/off) krn rasio, bukan ambang tunggal: penyebut
 * dinaikkan ke EKSPEKTASI beban kerja wajar, jadi kunjungan sedikit (walau
 * 100% berhasil) tetap dihitung proporsional thd yang "seharusnya" dikerjakan.
 * Angka estimasi dari konten nyata (16 keluarga × ~2-3 langkah arc / roster) —
 * bisa dikalibrasi ulang, ini konstanta keseimbangan spt yang lain di file ini.
 */
const EKSPEKTASI_KUNJUNGAN_KARIER = 24
const EKSPEKTASI_KUNJUNGAN_UJIAN = 8

/**
 * Setiap permukaan yang menampilkan skor total memakai satu desimal (Rapor,
 * Laporan Akhir, surat penutup stase). Total karena itu DIBULATKAN ke presisi
 * itu sebelum apa pun membacanya — ambang grade termasuk. Tanpa ini total
 * 84,96 tampil "85,0/100" berdampingan stempel B: angka yang dibaca mahasiswa
 * memenuhi ambang A, tapi vonisnya tidak.
 */
const DESIMAL_TAMPILAN_TOTAL = 1

function bulatkanTotal(total: number): number {
  const faktor = 10 ** DESIMAL_TAMPILAN_TOTAL
  return Math.round(total * faktor) / faktor
}

function gradeDariTotal(total: number): { grade: Skor4Dimensi['grade']; gradeLabel: string } {
  // Copy-audit 2026-08-01: "PTT" (Pegawai Tidak Tetap) = program yang sudah
  // dihapus 2017 dan tak pernah dieja di mana pun — cukup "Teladan".
  if (total >= 85) return { grade: 'A', gradeLabel: 'Teladan' }
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

  /* -- UKP (0-35): outcome + proses × Referral Guillotine ---------------------- */
  // Anti cherry-picking: pasien yang dilewatkan lalu bermasalah ikut jadi
  // penyebut akurasi — melewatkan antrian bukan strategi gratis.
  const penyebutAkurasi = t.totalPasien + t.autoBermasalah
  const akurasi = penyebutAkurasi > 0 ? t.diagnosisBenar / penyebutAkurasi : 0
  const rrns = t.rujukanTotal > 0 ? (t.rujukanNonSpesialistik / t.rujukanTotal) * 100 : 0
  // Guillotine butuh sampel: satu rujukan keliru di hari pertama tidak boleh
  // memusnahkan seluruh UKP (denominator kecil meledakkan rasio).
  const guillotineAktif = t.rujukanTotal >= MIN_RUJUKAN_GUILLOTINE
  const guillotine = guillotineAktif ? Math.max(0, 1 - Math.max(0, rrns - 5) * 0.05) : 1
  const totalDiagnosis = t.tegakBenar + t.tegakSalah + t.suspekBenar + t.suspekSalah
  const kalibrasi =
    ((t.tegakBenar + t.suspekBenar + 0.4 * t.suspekSalah) / Math.max(1, totalDiagnosis)) * 100
  const prosesKlinis = t.totalPasien > 0 ? t.sumSkorProses / t.totalPasien : 0
  const kualitasOutcome = 0.75 * akurasi * 100 + 0.25 * kalibrasi
  // Outcome tetap dominan, tetapi proses SOAP yang sudah dinilai per pasien
  // tidak lagi sekadar kosmetik di debrief. Bobot ini dikalibrasi via soak.
  const kualitasGabungan = 0.7 * kualitasOutcome + 0.3 * prosesKlinis
  // Confidence-tagging (M3.13): merujuk kasus wajib-rujuk dengan TEPAT dihargai —
  // guillotine tidak boleh mengajarkan "jangan pernah merujuk".
  const bonusRujukanTepat = Math.min(3, t.rujukanTepat * 0.75)
  // IGD (M3.14): stabil + disposisi TEPAT = bonus kecil; disposisi keliru
  // (pasien selamat tapi diarahkan salah) = penalti ringan (-0.5, formula di
  // bawah) — tak seberat Kode Hitam (-3) krn pasien tetap selamat, tapi tak
  // nol juga: near-miss tetap dicatat, bukan cuma "tak dihargai".
  //
  // CODEX audit pasca-GM (2026-07-13, temuan #9 Part B, keputusan dr.
  // Wirayuda): komentar di atas SEBELUMNYA keliru menyebut ini "tak dihukum"
  // padahal `-0.5 * t.igdSalahDisposisi` di bawah sudah menghukumnya sejak
  // sebelum sesi ini (persis sejajar bobot `igdKodeBiruTerjadi` yg baru
  // ditambahkan §9 Part A) — jadi asimetri yg diaudit CODEX sebenarnya sudah
  // tak ada di kode, hanya komentarnya yg menyesatkan. Diperbaiki di sini,
  // tanpa perubahan formula (formula sudah benar).
  //
  // CODEX audit pasca-GM (2026-07-13, temuan #9 Part A): `igdKodeBiruTerjadi`
  // menghukum RINGAN tiap kejadian henti napas/jantung, terlepas hasil akhir
  // (ROSC+stabil ATAU Kode Hitam yg sudah kena -3 igdMeninggal terpisah) —
  // dulu pasien yg nyaris mati lalu diselamatkan skornya IDENTIK dgn pasien
  // yg manajemennya mulus tanpa Kode Biru sama sekali. -0.5/kejadian: cukup
  // membedakan "selamat dari maut" dari "tak pernah krisis" tanpa menyaingi
  // beratnya igdSalahDisposisi/igdMeninggal.
  const efekIgd =
    Math.min(2, t.igdStabil * 0.5) -
    0.5 * t.igdSalahDisposisi -
    3 * t.igdMeninggal -
    0.5 * t.igdKodeBiruTerjadi
  // DeepThink ronde-2 ("Boikot Rujukan"): guillotine adalah gerbang kali-nol
  // (all-or-nothing) begitu rujukanTotal≥3 — RRNS 100% di sampel kecil (2)
  // LOLOS penuh (guillotine=1), sedangkan cowboy dulu cuma potongan flat -2.
  // Itu bikin "berhenti merujuk total setelah 2 kesalahan lalu cowboy-kan
  // semua kasus wajib-rujuk berikutnya" jauh lebih murah drpd tetap merujuk
  // dgn risiko guillotine — insentif terbalik dari yang dimaksud. Dinaikkan
  // ke -5/kejadian (dari -2) supaya boikot tak lagi strategi dominan, tanpa
  // mengubah ambang proteksi-sampel-kecil rujukanTotal≥3 itu sendiri.
  // CODEX audit (2026-07-12, temuan #1/#13B): `obatBerbahaya` dulu variabel
  // lokal `clinic.ts` — mengunci grade PER-ENCOUNTER (capGrade 54) tapi tak
  // punya field tally sama sekali, jadi skor.total FORMAL (dibaca dari
  // state.tally di sini) tak pernah bergerak walau resep NSAID-pada-dengue
  // atau nitrat-pada-PDE5 setiap encounter — dibuktikan reproduksi: skor
  // "aman" vs "bahaya" identik 65.0/65.0. Bobot -3/kejadian menyamai
  // `igdMeninggal` (sama-sama risiko cedera langsung nyata pada pasien).
  // `firewallTerpicu` (percobaan diblokir, obat TAK sampai pasien) dibobot
  // lebih ringan (-1) — kelalaian cek alergi nyata, tapi bukan cedera nyata.
  const ukp = clamp(
    (kualitasGabungan / 100) * 35 * guillotine -
      5 * t.cowboy -
      3 * t.obatBerbahaya -
      3 * t.tindakanBerbahaya -
      1 * t.firewallTerpicu -
      1 * t.stabilisasiTerlewat +
      bonusRujukanTepat +
      efekIgd,
    0,
    35,
  )

  /* -- UKM (0-35): IKS desa + kunjungan berhasil + kualitas MI ---------------- */
  const rwBerdata = state.desa.rw.filter((r) => r.iks > 0)
  const iksDesa =
    rwBerdata.length > 0 ? rwBerdata.reduce((jml, r) => jml + r.iks, 0) / rwBerdata.length : 0
  // Audit UKM 2026-08-22 (kalibrasi, keputusan delegasi #10): suku IKS dinilai
  // dari KENAIKAN di atas baseline survei — dinormalisasi ke target yang
  // benar-benar terjangkau — bukan dari angka absolut desa.
  //
  // Dulu formula memakai `iksDesa` mentah, padahal tiga suku UKM lainnya
  // semuanya rasio ternormalisasi ke ekspektasi (kunjungan/ekspektasi, MI %,
  // fraksi Prolanis terkontrol). Kalibrasi rev 62 (komentar panjang di
  // reducer.ts, blok laporan bulanan kapitasi) sudah MENGUKUR dari konten
  // aktual: tanpa usaha iksDesa ≈ 0,125; SEMUA 16 binaan 'sehat' tanpa bonus
  // ≈ 0,205; plafon praktis + bonus lapangan rutin ≈ 0,24-0,26. Artinya suku
  // berbobot 40% ini mentok di ~0,3 — pemain sempurna terkunci UKM ~27/35
  // yang ditampilkan /35, dan paritas UKM=UKP=35 tak pernah tercapai di
  // langit-langitnya. (Ini kelas bug ambang-mustahil yang sama dengan yang
  // sudah diperbaiki rev 62 untuk pengali kapitasi — skor UKM-nya saja yang
  // saat itu luput.)
  //
  // Baseline dihitung dari roll TERPERSIST tiap RW (proporsiBaselineRoll,
  // stabil sejak rev 62), bukan konstanta rata: jitter ±0,02 milik seed desa
  // tidak boleh menghukum/menghadiahi mahasiswa. RW tanpa roll (save sangat
  // lama, pra-migrasi) dinilai kenaikan 0 — konservatif, tak pernah memberi
  // kredit gratis. Penyebut 0,115 = jarak baseline terukur (0,125) ke awal
  // tingkat tertinggi kalibrasi kapitasi (0,24, "binaan nyaris tuntas + UKM
  // lapangan konsisten") — pemain yang mencapai tingkat itu memperoleh suku
  // ini penuh; yang tak berbuat apa-apa memperoleh nol (dulu justru dapat
  // ~0,125 gratis dari baseline survei kader).
  const KENAIKAN_IKS_TARGET = 0.115
  const kenaikanIksDesa =
    rwBerdata.length > 0
      ? rwBerdata.reduce(
          (jml, r) => jml + Math.max(0, r.iks - (r.proporsiBaselineRoll ?? r.iks)),
          0,
        ) / rwBerdata.length
      : 0
  const skorIksDesa = clamp(kenaikanIksDesa / KENAIKAN_IKS_TARGET, 0, 1)
  const ekspektasiKunjungan =
    state.mode === 'ujian' ? EKSPEKTASI_KUNJUNGAN_UJIAN : EKSPEKTASI_KUNJUNGAN_KARIER
  const kualitasKomunikasi = (t.miTepat / Math.max(ekspektasiKunjungan, t.miTotal)) * 100
  const rasioKunjungan = t.kunjunganBerhasil / Math.max(ekspektasiKunjungan, t.kunjunganTotal)
  // CODEX audit pasca-GM (2026-07-13, temuan #7): `prolanisSesi` (tally) tak
  // pernah dibaca skor manapun — repro langsung: skor UKM byte-identik sebelum/
  // sesudah sesi Prolanis dimainkan. Strategi optimal literal "jangan pernah
  // buka Prolanis" (nol biaya stamina/slot, nol risiko drift/komplikasi, nol
  // skor hilang) — anti-pola pedagogis utk program UKM andalan JKN. Suku baru
  // ini membaca fraksi roster yang TERKONTROL (ambang param sama persis
  // `driftProlanis`, kegiatan.ts) sbg state agregat (bukan tally mentah) —
  // pola sejajar `iksDesa` di atas. Peserta yg tak pernah disesi tetap
  // "tak terkontrol" (roster dibentuk dgn param awal di atas ambang), jadi
  // mengabaikan Prolanis kini punya ongkos oportunitas nyata, bukan gratis.
  const rosterProlanis = state.prolanis.roster
  // Audit CODEX 2026-07-16: ambang di sini dulu SALINAN angka (<140/<200) yang
  // mengambang dari `driftProlanis` setelah skala DM pindah GDS→GDP di rev 37 —
  // skor menghitung GDP 150 sbg "terkendali" sementara progres penyakit tidak.
  // Kini memanggil predikat kanonik yang sama dengan kartu & drift.
  const rasioProlanisTerkontrol =
    rosterProlanis.length > 0
      ? rosterProlanis.filter((p) => prolanisTerkendali(p.jenis, p.param)).length /
        rosterProlanis.length
      : 0
  // M10.5 Fase 3 (2026-07-12, soak-final kalibrasi): dulu `-2*karmaTerjadi +
  // 1*karmaDicegah` adalah HITUNGAN MENTAH tak terbatas — satu-satunya suku
  // UKM yang tak dinormalisasi rasio (beda dari rasioKunjungan/kualitasMi di
  // atas, yang sudah dilindungi Hukum Bilangan Kecil via ekspektasiKunjungan).
  // Kolam keluarga ber-karma TETAP (9) sementara mode Ujian (30 hari) hanya
  // 1/3 kalender karier tanpa slot kunjungan/hari ikut dipadatkan — pemain
  // teladan yg mustahil kejar throughput yg sama bisa terjun dari +7 ke -16
  // murni krn mode, bukan kualitas keputusan (diverifikasi soak 15-seed:
  // UKM turun ~22→~4 lintas mode HANYA dari suku ini). Kini rasio (dgn lantai
  // sampel-kecil, spt pola EKSPEKTASI_KUNJUNGAN) + asimetris (hukum > hadiah,
  // pola sama cowboy/guillotine) — tak lagi berayun ekstrem antar-mode, tapi
  // negligensi total (0 dicegah dari N kasus) tetap dihukum berat (~-9), bukan
  // digantikan angka simetris kecil yang melunakkan konsekuensi bernama ini.
  const totalKarmaKasus = t.karmaDicegah + t.karmaTerjadi
  const denomKarma = Math.max(3, totalKarmaKasus)
  const efekKarma = (3 * t.karmaDicegah - 9 * t.karmaTerjadi) / denomKarma
  const ukm = clamp(
    (0.4 * skorIksDesa +
      0.2 * rasioKunjungan +
      0.2 * (kualitasKomunikasi / 100) +
      0.2 * rasioProlanisTerkontrol) *
      35 -
      2 * t.apathy +
      efekKarma,
    0,
    35,
  )

  /* -- Manajemen (0-15): stewardship lab/antibiotik + kesehatan kapitasi ------ */
  // rujukanDitolak = churn administratif jejaring (salah RS / bed / kasus FKTP).
  // M4: teguran Dinkes (laporan bulanan defisit) & hasil akreditasi D60 ikut.
  const efekAkreditasi =
    state.akreditasi === 'paripurna' ? 1.5 : state.akreditasi === 'utama' ? 0.5 : state.akreditasi === 'madya' ? -1.5 : 0
  const manajemen = clamp(
    15 -
      0.5 * t.labTakRelevan -
      1 * t.antibiotikTanpaIndikasi -
      0.5 * t.rujukanDitolak -
      1 * t.teguranDinkes -
      (state.kapitasi < 10_000_000 ? 3 : 0) +
      efekAkreditasi,
    0,
    15,
  )

  /* -- Resiliensi (0-15): hari kelelahan + burnout ----------------------------- */
  const resiliensi = clamp(15 - 1.5 * t.hariKelelahan - state.burnout / 10, 0, 15)

  const total = bulatkanTotal(ukp + ukm + manajemen + resiliensi)
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
      // Kontribusi ternormalisasi suku IKS (0-1) — dipakai Rapor utk bendera
      // waspada yang jujur; opsional krn snapshot beku save lama tak punya.
      skorIksDesa,
      // Nama field dipertahankan untuk kompatibilitas dossier.
      kualitasMi: kualitasKomunikasi,
      kalibrasi,
      prosesKlinis,
      // S3 burnout-rapor: suku 20% UKM ini dulu tak kasat mata di Rapor.
      // Opsional di tipe — snapshot beku tamat.skor dari save lama tak
      // memilikinya (UI wajib fallback, jangan anggap 0).
      rasioProlanisTerkontrol,
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
  const hasilResmi = hasil.filter((item) => !item.formativePrototype)
  const hasilFormatif = hasil.filter((item) => item.formativePrototype)
  const catatan: string[] = []

  let grade = '—'
  if (hasilResmi.length > 0) {
    const rata =
      hasilResmi.reduce((jml, p) => jml + NILAI_GRADE[p.grade], 0) / hasilResmi.length
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
