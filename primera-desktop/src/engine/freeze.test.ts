/**
 * FREEZE (M10.5 Q-D, Golden Master, 2026-07-12; diperluas 2026-07-13 per
 * CODEX audit temuan #10, lagi 2026-07-13 per audit CODEX pasca-GM temuan
 * #19, lagi 2026-07-13 per fix pass M10.6 §2/§3/§9/§11, dan M13-0D pada
 * 2026-07-14, serta Bridge B2 PHC Lite pada 2026-07-18) — hash-lock 18
 * file yang menentukan replay/skor: reducer.ts, clinic.ts, scoring.ts,
 * director.ts, core/rng.ts, igd.ts, kader.ts, init.ts, kegiatan.ts,
 * kunjungan.ts, paketUjian.ts, verifikasi.ts, state.ts, save.ts, pispk.ts,
 * surveilans.ts, examBlueprint.ts, bridge.ts. Ini bukan pagar regresi biasa — ia SENGAJA GAGAL bila salah
 * satu file berubah walau cuma satu karakter, termasuk perubahan yang
 * "kelihatannya aman" (refactor, komentar, rename variabel lokal).
 *
 * M10.6 fix pass (2026-07-13, REVISI_ENGINE 28→29) — 4 unfreeze SEKALIGUS,
 * semua score/replay-affecting sesuai bar yang sama ("apakah mengedit file
 * INI SENDIRI mengubah output replay?"):
 *  - clinic.ts (§2 obatSalahUmum severity + §3 konfirmasiWajib→capGrade):
 *    obatSalahUmum kini punya tier kontraindikasi/nonPrimer dgn penalti
 *    berbeda (skorTerapi berubah utk kasus ber-nonPrimer); konfirmasiWajib
 *    tak terpenuhi kini meng-cap grade huruf (bukan cuma skorPemeriksaan).
 *  - reducer.ts (§3 Dex kuasai gate + §9 igdKodeBiruTerjadi tally +
 *    §11 bed-retry pasif): Dex "kuasai" kini butuh konfirmasiWajib terpenuhi;
 *    Kode Biru ditally saat terjadi; jadwal bed-penuh (`bedRetry`) resolve
 *    sendiri tanpa re-enter PANGGIL_PASIEN/DISPOSISI.
 *  - scoring.ts (§9): `efekIgd` kini -0.5/kejadian Kode Biru, terlepas hasil
 *    akhirnya — nyaris mati tak lagi skornya identik dgn manajemen mulus.
 *  - state.ts (§9/§11): field tally baru `igdKodeBiruTerjadi` + field jadwal
 *    baru `bedRetry`/`rumahSakitId`/`bedRetryKe` + `konfirmasiTakTerpenuhi`
 *    pada PenilaianEncounter.
 *  - init.ts (§9): backfill `igdKodeBiruTerjadi: 0` di tally awal.
 *  - save.ts (§9): migrasi-lite `igdKodeBiruTerjadi` utk save versi lama +
 *    ditambahkan ke KUNCI_TALLY exhaustive-check.
 *
 * CODEX audit pasca-GM (2026-07-13, temuan #19) — commit yang MEMPERLUAS
 * freeze ke 12 file itu SENDIRI mengedit state.ts/actions.ts/save.ts sambil
 * freeze tetap hijau (dibuktikan `git show --stat` atas commit itu). Diaudit
 * satu per satu terhadap bar yang sama dipakai utk 7 file sebelumnya ("apakah
 * mengedit file INI SENDIRI mengubah output replay?"):
 *  - state.ts: LOLOS bar — `musimDariHari()` (dipanggil director.ts yg sudah
 *    dibekukan) terbukti mengubah komposisi antrian kasus lintas batas hari
 *    hujan/kemarau, murni dari perubahan di state.ts saja.
 *  - save.ts: LOLOS bar — migrasi-lite tally menentukan `klaim.tally`
 *    baseline yg diklaim dossier; terbukti bisa membalik status verifikasi
 *    jujur "tidak_dapat_diverifikasi" jadi "tidak_sah" palsu (temuan #12).
 *  - pispk.ts: LOLOS bar — formula IKS (`hitungIksKeluarga`/`klasifikasiIks`)
 *    dipakai kader.ts yg sudah dibekukan; REVISI_ENGINE historis sudah
 *    menganggap perubahan formula IKS sbg score-affecting (rev 26/27).
 *  - surveilans.ts: LOLOS bar — `kasusMenular`/`hitungCluster` dipanggil
 *    reducer.ts di jalur replay aktual.
 *  - actions.ts: TIDAK lolos bar — murni tipe TypeScript (union `Action`),
 *    nol kode runtime, dihapus compiler; logika aksi baru SELALU tinggal di
 *    reducer.ts (yg sudah dibekukan). Sengaja TIDAK ditambahkan.
 *
 * KENAPA sekeras ini: begitu semester berjalan, mahasiswa menandatangani
 * Dossier HMAC yang direplay lawan build engine SAAT ITU (verifikasi.ts).
 * Bump `REVISI_ENGINE` tak terjadwal di tengah semester membuat build lama
 * & baru berselisih sidik jari — dossier jujur bisa jatuh ke
 * "tidak_dapat_diverifikasi" tanpa peringatan. Freeze ini memaksa setiap
 * niat mengubah salah satu file di atas SADAR bahwa itu "membuka" Golden
 * Master, bukan tambal-sulam santai.
 *
 * CODEX audit (2026-07-12, temuan #10) — DUA celah pada versi 5-file awal:
 *  (a) Cakupan kurang: igd.ts/kader.ts/init.ts/kegiatan.ts/kunjungan.ts/
 *      paketUjian.ts/verifikasi.ts semuanya score/replay-affecting (masing-
 *      masing dibuktikan via reproduksi langsung — mis. mengubah
 *      AMBANG_STABIL_RUJUK di igd.ts atau seed di paketUjian.ts tetap
 *      LOLOS freeze lama) tapi tak ikut dikunci.
 *  (b) CRLF vs LF: working tree Windows (`core.autocrlf=true`, tanpa
 *      `.gitattributes`) menyimpan file sbg CRLF, tapi git blob & CI
 *      ubuntu-latest menyimpan/membaca LF — hash CRLF-lokal != hash LF-CI,
 *      jadi freeze GAGAL PALSU begitu commit menyentuh CI Linux. Ditambal
 *      dua lapis: `.gitattributes` (`* text=auto eol=lf`, memaksa blob git
 *      selalu LF) DAN `hashFile()` di bawah menormalkan CRLF→LF sebelum
 *      hash (defense-in-depth — freeze tetap benar walau `.gitattributes`
 *      entah bagaimana tak aktif, mis. clone lama sebelum file ini ada).
 *
 * CARA UNFREEZE (sengaja manual, bukan `--update-snapshot`):
 *   1. Ubah file yang perlu diubah.
 *   2. Bump `REVISI_ENGINE` (verifikasi.ts) dan selesaikan migrasi/test terkait.
 *   3. Jalankan skrip di bawah komentar ini (cara cepat: jalankan file test
 *      ini, baca pesan error yang menyertakan hash BARU, salin ke
 *      `HASH_DIBEKUKAN`).
 *   4. Dokumentasikan alasan unfreeze di commit message + memori proyek.
 * Freeze TIDAK dimaksudkan mencegah perubahan selamanya — ia memaksa
 * perubahan lewat langkah sadar di atas, bukan lolos diam-diam.
 */
import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { resolve } from 'node:path'

function hashFile(relPath: string): string {
  const isiMentah = readFileSync(resolve(__dirname, relPath), 'utf8')
  // CODEX audit (2026-07-12, temuan #10): normalisasi CRLF→LF sebelum hash —
  // defense-in-depth di samping `.gitattributes`, supaya hash tetap identik
  // lintas working-tree Windows (CRLF) dan git blob/CI Linux (LF) apa pun
  // penyebabnya (autocrlf, clone lama sebelum .gitattributes ada, dst).
  const isi = isiMentah.replace(/\r\n/g, '\n')
  return createHash('sha256').update(isi).digest('hex')
}

/** Sha-256 hex per file (isi dinormalisasi LF), dikunci saat tag Golden Master. */
const HASH_DIBEKUKAN: Record<string, string> = {
  // REVISI 35 (2026-07-15 - M13-1a): pilot Career-only menambah usia
  // bulan, bundel stabilisasi, tindakan berbahaya, dan routing RS berbasis
  // kapabilitas. Ujian tetap terisolasi oleh modePolicy.
  // Unfreeze 2026-07-16 KETIGA (audit CODEX UKM item desain, REVISI_ENGINE 38):
  // outcome-window PIS-PK (janji→verifikasi), ekonomi IKS reframe (posyandu
  // verifikasi KIA + program perisai drift), kader isi bertahap, ambang KLB
  // ground Permenkes 1/2026 — state/kader/kunjungan/reducer/surveilans.
  // Unfreeze 2026-07-16 KEDUA (audit CODEX UKM, REVISI_ENGINE 37): arc
  // kunjungan mode-aware, program per-RW, drift ex-kunjungan, GDP Prolanis,
  // catatanPedagogis debrief — reducer/kunjungan/state/kegiatan/scoring.
  // Unfreeze 2026-07-16 (audit CODEX #1/#2/#4): gerbang terapiKritis (terapi
  // penyelamat nyawa) + Dex "kuasai" kini menuntut keselamatan resep + terapi
  // kritis + konsekuensi hanya untuk obat kontraindikasi (bukan nonPrimer).
  // Lihat REVISI_ENGINE bump di verifikasi.ts.
  // Unfreeze 2026-07-16 KELIMA (audit CODEX pasca-Batch4, REVISI_ENGINE 39→40):
  // kontradiksi ambang Prolanis DM ditutup — kartuProlanis (kegiatan.ts) &
  // rasioProlanisTerkontrol (scoring.ts) masih memakai ambang GDS lama <200
  // setelah skala DM pindah ke GDP <130 di rev 37, sehingga kartu/skor bilang
  // "terkendali" untuk peserta yang justru diperlakukan memburuk oleh drift.
  // Ketiganya kini memanggil `prolanisTerkendali()` — satu konstanta bersama.
  // Unfreeze 2026-07-16 KEEMPAT (M13 Batch 4+6, REVISI_ENGINE 38→39): sumber
  // ambang kluster pindah dari AMBANG_CLUSTER hardcoded ke KasusKlinis.ambangKluster
  // (surveilans.ts kontrak fungsi berubah; reducer.ts/director.ts call-site).
  // 14 kasus infeksi lab kini bisa berkluster → komposisi KLB & bobot Director
  // bergeser pada jejak yang menyentuhnya. Kanal IGD baca activationStatus
  // (blueprint) — tak menyentuh file beku. Detail di verifikasi.ts REVISI 39.
  // Unfreeze 2026-07-17 (M11 E-2 SAJI Fase-2, REVISI_ENGINE 41 -> 42):
  // babak Ingatkan, kualitas SAJI 80/20, dua outcome kontak awal resmi,
  // jadwal ulang authored, migrasi hasil lama, dan fingerprint gaya dialog.
  // Mode Ujian tetap tidak mengaktifkan outcome kontak awal.
  // Unfreeze 2026-07-17 (bridge UKM↔UKP P0-A, REVISI_ENGINE 42 -> 43):
  // kluster KLB hanya tuntas bila skor agregat lolos DAN klb_aksi benar.
  // Unfreeze 2026-07-17 (Bridge B1.2, REVISI_ENGINE 45 -> 46): janji
  // PIS-PK ingkar membuka ulang beat terakhir dan follow-up keluarga.
  // Unfreeze 2026-07-17 (Bridge B1.3, REVISI_ENGINE 46 -> 47): pasien
  // karma membawa provenance eksplisit; penanganan klinis A membuka
  // pemulihan keluarga tanpa menghapus konsekuensi atau memajukan arc.
  // Unfreeze 2026-07-17 (Bridge B1.4, REVISI_ENGINE 47 -> 48): enrolmen
  // Prolanis kini per-masalah namun dikelompokkan per-orang; komplikasi
  // membawa provenance dan hasil klinis A menulis balik ke roster.
  // Unfreeze 2026-07-17 (audit bridge pasca-B1.4, REVISI_ENGINE 48 -> 49):
  // callback klinik tak memalsukan kontrol bila parameter masih di atas ambang.
  // Counter tetap mengikuti driftProlanis sebagai satu sumber kebenaran;
  // drift keluarga hanya boleh membuat masalah yang bisa dipulihkan gameplay.
  // Audit REVISI_ENGINE 50: surat SISRUTE menjaga tautan keluarga yang valid.
  // Unfreeze 2026-07-18 (Bridge B2 PHC Lite, REVISI_ENGINE 50 -> 51):
  // CareEpisode mengikat UKM, UKP, rujukan, feedback, dan aksi lanjutan dalam
  // satu receipt kausal yang persisten; bridge.ts ikut dibekukan karena hasil
  // reducer kini bergantung langsung pada helper transisi episode tersebut.
  // Unfreeze 2026-07-18 (EBM currency, REVISI_ENGINE 51 -> 52): clinic.ts
  // mengenal prosedur opsional yang tidak masuk denominator skor; verifikasi
  // dibump karena keputusan terapi gout/CHF dan konten ternilai berubah.
  // Unfreeze 2026-07-18 (provenance IGD, REVISI_ENGINE 52 -> 53): surat hasil
  // IGD membawa id kasus ke panel panduan/sumber; fingerprint mengunci
  // provenance klinis 20/20 kasus. Field surat baru bersifat opsional agar save
  // lama tetap dapat dibaca tanpa migrasi destruktif.
  // Unfreeze 2026-07-19 (closure longitudinal dan audit P0-P3,
  // REVISI_ENGINE 54 -> 55): follow-up keluarga/karma dan pemulihan episode
  // kini presisi; Prolanis HT tidak lagi memicu stroke deterministik;
  // tutorial keluar dari rerata; gap formatif encounter dan status pasca-RJP
  // dipersist. Detail lengkap ada pada komentar revisi di verifikasi.ts.
  // Unfreeze 2026-07-20 (koherensi dialog, REVISI_ENGINE 55 -> 56): director
  // memisahkan anak dari wali; clinic menandai jawaban pendamping; kunjungan
  // mengunci respons yang menyebut observasi; kegiatan membuang meta-kebijakan
  // dari vignette. Save lama dinormalkan saat runtime, tanpa migrasi destruktif.
  // Unfreeze 2026-07-22 (class readiness, REVISI_ENGINE 56 -> 57): adopsi
  // rencana balik rujukan menjadi aksi eksplisit; terapi N/A dan SBAR masuk
  // scoring; tanggal karma dinormalisasi agar satu slot lapangan tetap feasible.
  // Unfreeze 2026-07-28 (P1 observasi/governance, REVISI_ENGINE 58 -> 59):
  // observasi klinis menjadi aksi dan gate skor terstruktur; kasus prototipe
  // yang belum disahkan dokter tetap memberi debrief formatif tetapi tidak
  // menulis tally, Dex, ekonomi, konsekuensi, atau progres formal.
  // Unfreeze 2026-07-28 (integritas diagnosis/bridge, REVISI_ENGINE 59 -> 60):
  // stempel tegak-vs-suspek dinilai dan di-hash; callback keluarga menuntut
  // kecocokan kondisi; cap episode mempertahankan 120 kasus aktif paling
  // mendesak secara deterministik.
  // Unfreeze 2026-07-28 (provenance klinis lengkap, REVISI_ENGINE 60 -> 61):
  // sumber poli 210/210 kini ikut fingerprint sehingga perubahan sitasi,
  // cakupan, atau catatan batas tidak dapat menyamar sebagai build identik.
  // Unfreeze 2026-08-01 (batch kenyamanan gameplay S3-S7, REVISI_ENGINE
  // 61 -> 62 — satu bump utk seluruh batch): slot formatif diundi 0.5/hari
  // tanpa menimpa slot jaminan pity + auto-resolve bebas tax formatif
  // (director/reducer); ambang kapitasi 0.18/0.24 + drift DM 15..35 + kredit
  // parsial grade B Prolanis (reducer/kegiatan); silaturahmi plafon trust 4 +
  // delegasi kader 0.65 (reducer/kegiatan); surat pembukaan Posyandu/KLB,
  // surat janji-ditepati, surat ambang burnout 40/70 (reducer); hitungSkor
  // mengekspos rincian.rasioProlanisTerkontrol opsional (scoring/state);
  // verifikasi.ts ikut karena REVISI_ENGINE. Rincian di verifikasi.ts rev 62.
  // Unfreeze 2026-08-01 (bug hunt, REVISI_ENGINE 62 -> 63): belanjaObat kini
  // ikut tercatat utk pembelian darurat pasien umum; resepBerbahaya ikut
  // interaksiTrap; verifikasi_pispk pending ikut force-evaluate di akhir
  // stase. Rincian di verifikasi.ts rev 63.
  // Unfreeze 2026-08-21 (bug hunt, REVISI_ENGINE 67 -> 68): reducer.ts —
  // jadwal terlantar membawa usiaBulan, AKSI_IGD berpenjaga fase, dan rujukan
  // IGD wajib bertujuan RS yang cocok (dulu rujukan tanpa tujuan dinilai benar
  // dan menulis nama RS palsu ke careEpisode). clinic.ts — firewall alergi
  // membandingkan golongan tanpa peduli kapitalisasi, dan LANJUT_FASE menolak
  // meninggalkan fase diagnosis sebelum diagnosis ada. scoring.ts — total empat
  // dimensi dibulatkan ke 1 desimal sebelum grade divonis, jadi huruf dan angka
  // yang dibaca mahasiswa tak lagi bisa berselisih. Rincian di verifikasi.ts
  // rev 68.
  // Unfreeze 2026-08-21 (adjudikasi-delegasi, REVISI_ENGINE 69): reducer.ts +
  // igd.ts — kurva konsekuensi disposisi IGD dibalik (rujuk <50 tiba kritis
  // hidup; pulang <50 Kode Hitam); clinic.ts — floor observasi gugur pada
  // tindakan berbahaya & potongan nonPrimer dikurangkan pasca-floor;
  // kegiatan.ts — drift overtreatment HT terkendali turun (khusus HT);
  // verifikasi.ts — changelog rev 69. Rincian keputusan & dasarnya di
  // docs/ADJUDIKASI_DELEGASI_2026-08-21.md.
  // Unfreeze 2026-08-22 (audit UKM, REVISI_ENGINE 70): reducer/kegiatan —
  // komit jawaban kegiatan + autosave (anti-replay); reducer/surveilans/state —
  // kluster menghitung ORANG bukan encounter, flag kluster pulih saat padam;
  // reducer/kader — skor TAMAT menyegarkan iks RW lewat rumus yang sama;
  // kunjungan — penutup khusus DIUSIR; bridge — cap episode memangkas muatan,
  // bukan menggusur record. Rincian di verifikasi.ts rev 70.
  'reducer.ts': 'd4200eaed99cc98aead2dc9d9e9cc4dfbba685d1dfc80e356d80c9c885568e07',
  'clinic.ts': 'efd50c5395cdf9ca3a39064b65919b489d84195f4b24758db9e97205366e769c',
  // Unfreeze 2026-08-22 KEDUA (kalibrasi #10, REVISI_ENGINE 71): scoring —
  // suku IKS jadi kenaikan-atas-baseline ternormalisasi (plafon 27/35 dicabut);
  // state — field opsional skorIksDesa di rincian. Rincian di verifikasi.ts.
  // Unfreeze 2026-08-22 KETIGA (batch aman, REVISI_ENGINE 72): kegiatan —
  // inersia klinis DM tak terkendali jadi stagnan (bukan memburuk), cakupan
  // sempit, RNG tetap satu draw; scoring + director — perakitan kalimat debrief
  // malam PINDAH ke debriefNarator.ts yang TIDAK dibekukan, sementara ambang
  // grade tetap di sini sbg aturan. Sesudah ini perbaikan redaksi debrief tak
  // lagi menuntut bump. Rincian di verifikasi.ts rev 72.
  'scoring.ts': 'de2610e6ef7125dba407b4f84195dc3ad764bec862b8ea78d1e2074ba4b8c0e0',
  // Unfreeze 2026-07-17 (Bridge B1.1, REVISI_ENGINE 44 -> 45): family
  // continuity hanya menautkan pasangan pasien-anggota yang nyata dan cocok.
  // Unfreeze 2026-07-17 (audit B1.1, REVISI_ENGINE 49 -> 50): status BPJS
  // pasien anggota nyata mengikuti ground-truth JKN keluarga, bukan RNG.
  // Unfreeze 2026-08-01 (bug hunt, REVISI_ENGINE 62 -> 63): cap paparan
  // rujukan tak lagi bisa menimpa slot jaminan kurikulum 4A pity-timer.
  'director.ts': 'cc067c3aa0f3d23f96f4fdfc04580895bf8b4c6f04ff15a9078d82bb6fe49b02',
  'core/rng.ts': '3a60dde2ff1fd06262549623f0a1ed92447102dc7d55df988c100ba89afcb4e1',
  'igd.ts': '930be5071fa33dd7f83d735b34612575bfc4f33453a2b19fe836fdfec2030349',
  'kader.ts': '5336ce70cce859528de050d6220664f192c161958d8416cea8dd5593309470c4',
  'init.ts': '4b9bb8b402c98f264d196592e7132aa7d1c6cb15c9e96755b5f06991f3ff71c1',
  // Unfreeze 2026-07-17 (bridge UKM↔UKP P0-B, REVISI_ENGINE 43 -> 44):
  // 22 kasus kluster dipetakan eksplisit ke 15 pola pengendalian; fallback
  // droplet diganti respons aman belum-dipetakan dan dikunci invariant.
  // Unfreeze 2026-07-23 (M13-137-04, REVISI_ENGINE 57 -> 58): suspek
  // meningokokus mendapat pola notifikasi, kontak erat, dan profilaksis
  // terkoordinasi sendiri alih-alih jatuh ke droplet generik.
  // Unfreeze 2026-08-01 (bug hunt, REVISI_ENGINE 62 -> 63): jargon desain
  // "guillotine" yang bocor ke teks respons kartu Prolanis HT diganti bahasa
  // pemain (skor tak berubah, murni copy).
  // Unfreeze 2026-08-21 (bug hunt, REVISI_ENGINE 67 -> 68): respons opsi rujuk
  // kartu Prolanis HT berhenti menjanjikan kenaikan RRNS & kunci nilai
  // encounter yang tak pernah dijalankan sesi Prolanis (murni copy).
  'kegiatan.ts': '81bcf5bf22348ad9e8c026cfa6063f7ee2a862af2bc12db005fbbc97ec28f301',
  // Unfreeze 2026-07-19 (UKM assurance, REVISI_ENGINE 53 -> 54): hasil kartu
  // intervensi dan klasifikasi evidence pasca-penilaian masuk debrief; skor
  // tidak berubah tetapi output replay kunjungan berubah secara sengaja.
  // Unfreeze 2026-08-21 (bug hunt, REVISI_ENGINE 67 -> 68): bobot babak
  // Ingatkan hanya masuk kualitasSaji bila babak itu benar-benar dijalani —
  // pemain yang diusir sebelum ditawari tak lagi dinilai atas fase itu.
  'kunjungan.ts': '51b00f1e1690325f45e4b4048f364e35ae26ede873b3d0d665fd626b62fbae28',
  'paketUjian.ts': 'aaa854b409b12f52c0f588401de10a6a00e03f3c3e80582015968f3a64afcf38',
  // Unfreeze 2026-07-16 (audit CODEX #1/#2/#4): REVISI_ENGINE di-bump untuk
  // gerbang terapiKritis + Dex "kuasai" ketat + konsekuensi hanya-kontraindikasi.
  // Unfreeze 2026-08-01 (bug hunt, REVISI_ENGINE 62 -> 63): REVISI_ENGINE
  // sendiri berubah — lihat changelog rev 63 di verifikasi.ts.
  // Unfreeze 2026-08-21 (bug hunt, REVISI_ENGINE 67 -> 68): REVISI_ENGINE
  // sendiri berubah — lihat changelog rev 68 di verifikasi.ts.
  'verifikasi.ts': '544466d63b2c8ee1fc5b60be6a0c68efa314ee6403fd2c7cef8609ddcaf93877',
  // Unfreeze 2026-08-21 (bug hunt, REVISI_ENGINE 67 -> 68): dua komentar
  // dijujurkan (igdHariIni penanda turunan, bukan gerbang; cooldown Posyandu
  // per mode, bukan 30 hari mati). Murni komentar, nol kode runtime — hash
  // tetap berubah, jadi ikut diunfreeze bersama batch yang sama.
  'state.ts': '697d53fbaf9ac3837708822b0875b7ac5a51b8675b40a25a4e7a5b84c7b1e48d',
  // Unfreeze 2026-08-01 (bug hunt, REVISI_ENGINE 62 -> 63): enam validasi baru
  // menutup celah NaN/tipe-salah (dex.bintang, desa.rw.bonusIks & jarak,
  // posyanduRwTerakhir, program.rwFokus/periodeDitetapkan, antrian[].rw).
  // Unfreeze 2026-08-21 (bug hunt, REVISI_ENGINE 67 -> 68): sesi aktif
  // non-objek dikosongkan (layar ikut dikembalikan ke meja), kunjungan
  // divalidasi fase + isinya disanitasi, selesaiHariIni & roster Prolanis
  // difilter per-entri, penanda `tamat` divalidasi bentuknya, dan riwayat
  // alergi/faktor risiko yang rusak dipulihkan dari pack.
  'save.ts': 'b0449e4ff0ff4c650b1cff0311a8c54a5ba32aafca2812b9799f8a8cd503f4d0',
  'pispk.ts': '052b8a14590c8dd42eac2269e18ee02b0e38cb6ba6f6259b77f6a667b37b0784',
  'surveilans.ts': '993ab0498f6d48be5621b4b181ef3132b2b8f4ab46d146f792d404ee59b71df8',
  'examBlueprint.ts': 'b25f942d9f642244ee1b42d058b7c262de8a88f8c155661c254e0795834d2b9a',
  'bridge.ts': 'bc03d7813325b764cbce7fd3dcec11328147ec13e8c2c0f381138a6d3fb20c96',
}

describe('GOLDEN MASTER FREEZE (M10.5 Q-D) — 18 file penentu replay/skor terkunci', () => {
  for (const [file, hashDiharapkan] of Object.entries(HASH_DIBEKUKAN)) {
    it(`${file} tak berubah sejak freeze`, () => {
      const hashSekarang = hashFile(file)
      expect(
        hashSekarang,
        `${file} BERUBAH sejak Golden Master freeze (2026-07-12). Bila ini disengaja: ` +
          `bump REVISI_ENGINE (verifikasi.ts), perbarui HASH_DIBEKUKAN['${file}'] ke ` +
          `'${hashSekarang}', dan dokumentasikan alasan unfreeze-nya.`,
      ).toBe(hashDiharapkan)
    })
  }
})
