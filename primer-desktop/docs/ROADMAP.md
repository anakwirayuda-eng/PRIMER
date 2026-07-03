# ROADMAP — PRIMER: Puskesmas Pagi → Full-Fledged

> Status basis: **M0 selesai** (vertical slice Hari 1–7, commit `0f2d84d`).
> Target produk: stase 90 hari penuh, dipakai ±50 mahasiswa FK, redeploy ~September 2026.
> Prinsip urutan (warisan dossier redesign): **integritas pedagogis > integritas asesmen >
> retensi > kompetisi > kesenangan kasual.**

---

## M0 — Vertical Slice ✅ (selesai 2026-07-02)

Loop inti Hari 1–7: klinik Lembar Periksa (anamnesis persona + gauge sabar + PF + lab
"hasil besok" + stempel TEGAK/SUSPEK + firewall alergi + SBAR), UKM 3 lapis (kader-scout
ber-bias + provenance ✓/~/?, peta choropleth 8 RW, kunjungan 4 babak + gerbang kejujuran),
karma loop dua arah (Bu Wulan stroke D+6 / bonusTrust), Dex SKDI 144 Leitner, skor 4
dimensi + guillotine, inbox + LANJUTKAN, refleksi malam, autosave atomik, audio FM synth,
16 kasus + 6 keluarga + 8 kader. 82 test, tsc strict 0, review 32 temuan diperbaiki.

---

## M1 — "Bridge Penuh UKM↔UKP" ✅ (selesai 2026-07-02, 6/6 butir)

Slice sudah punya bridge *scripted* (karma keluarga → pasien bernama; binaan sukses →
bonusTrust). Enam butir port dari engine lama — SEMUA terimplementasi + 11 test
integrasi (`m1bridge.test.ts`); catatan implementasi per butir di bawah:

1. ✅ **Bridge bertingkat** (adaptasi `processUKPBridge` lama ke engine deterministik):
   hasil kunjungan kini bergradasi `berhasil/partial/gagal` (partial = tepat salah
   satu dari hipotesis/intervensi). Nasib karma mengikuti: berhasil membatalkan,
   partial MENUNDA jam pasir +3 hari, gagal/diusir MEMPERCEPAT −2 hari.
   (Diputuskan deterministik alih-alih probabilistik lama — lebih adil & teruji.)
2. ✅ **Surveilans balik UKP→UKM** (`surveilans.ts`): diagnosis menular di poli
   tercatat per RW (pasien kini ber-RW); kluster dalam jendela 14 hari (ambang
   lama: DBD 2+, diare 3+, ISPA 5+) → chip merah di panel RW + surat "SINYAL
   KLUSTER" (sekali per kluster) + Director menaikkan bobot kasus berkluster ×2.5
   (loop UKP→UKM→UKP menutup).
3. ✅ **Drift keluarga rawan** (versi DIBALIK dari bug lama): keluarga binaan/
   ber-karma yang punya data & tak disentuh ≥7 hari bisa memburuk (TTM mundur,
   atau indikator 'ya' jatuh ke 'tidak'), peluang 0.35/hari, cap 2 kejadian/pekan,
   SELALU diberitakan surat kader — tanpa pembusukan senyap.
4. ✅ **Follow-up berkalender**: kunjungan berhasil (arc belum tamat) membuat janji
   `followUpHari = +4 hari`; mangkir >1 hari dari janji → TTM mundur + surat.
   Saran follow-up di Tas Kunjungan MejaKerja kini hidup.
5. ✅ **KBK riil**: tiap awal bulan (hari 31/61) kapitasi masuk 6 jt × pengali KBK
   dari IKS desa (>0.8 ×1.3 / ≥0.5 ×1.0 / <0.5 ×0.8) + surat BPJS yang menjelaskan
   — kerja UKM terasa di dompet UKP.
6. ✅ **SDOH armor** (port `BehaviorCaseEngine`): keluarga miskin/rentan memangkas
   kenaikan trust 50% bila hipotesis hambatan meleset; diagnosis tepat menembus
   armor. Ditandai `armorAktif` di hasil kunjungan (bahan debrief).

## M2 — Program UKM Terjadwal ✅ (selesai 2026-07-02, 5/5 butir)

Satu mesin sesi generik (`kegiatan.ts` + layar `Kegiatan.tsx`): dek kartu keputusan
klinis, skor mengalir ke IKS/UKP (bukan angka telanjang). 7 test integrasi
(`m2program.test.ts`), verifikasi visual Posyandu end-to-end.

7. ✅ **Posyandu** (unlock D15, cooldown 30 hari/RW): 4 kartu — penimbangan/faltering,
   KMS, imunisasi (ISPA ringan bukan kontraindikasi + cold chain), penyuluhan. Sesi
   berkualitas → bonus IKS RW persisten. Delegasi kader (80% benar/kartu) =
   task-shifting yang mengajarkan supervisi.
8. ✅ **Prolanis** (unlock D30): roster HT/DM otomatis dari warga kronis, sesi
   bulanan, `driftProlanis` menaikkan/menurunkan param menurut ketepatan; 2 sesi
   tak-terkontrol berturut → komplikasi bernama muncul di poli (bridge UKM→UKP).
9. ✅ **Respons KLB** (unlock D45): dipicu kluster surveilans M1.2; 3 kartu 5W1H
   (verifikasi→penyelidikan Orang-Tempat-Waktu→aksi sesuai pola vektor/air-makanan/
   droplet); tuntas (≥66%) memutus kluster (hapus entri surveilans) + bonus IKS.
10. ✅ **Program wilayah agregat**: fokus mingguan (PSN/PHBS/skrining) ditetapkan di
    Meja Kerja, bekerja tiap hari menekan 1 entri surveilans yang cocok + bonus IKS
    RW fokus — instruksi tim tanpa memakai slot siang. (Jawaban "manajemen populasi".)
11. ✅ **Lokakarya Mini** (D31/D61): modal rapor formatif 4 dimensi + *ghost* rival
    dr. Ratih (skor statis 71/78) — tekanan sosial tanpa multiplayer.

## M3 — Konten Skala Penuh & Rujukan Berjenjang (checkpoint ✅ 2026-07-03)

> **Status M3a+M3b selesai:** 67 kasus poli + 5 kasus IGD, SISRUTE berjenjang + PRB +
> confidence-tag, 4 guardrail balance, audit medis 5-dokter (nol P0), IGD turn-based
> (Kode Biru/RJP/Kode Hitam) + kalender musim (butir 14 & 17). 114 test hijau.
> **SISA M3 → M3c:** keluarga binaan 6→16 (butir 15), ANC/KIA sebagai jalur kunjungan
> bumil (butir 16). Bisa digabung ke M5 atau dikerjakan terpisah.

> **Revisi 2026-07-02 (masukan user):** 60+ hanyalah *checkpoint* M3, BUKAN target
> akhir. Repo lama punya **253 kasus rawat jalan (186×4A + 35×3B + 29×3A + 3×SKDI-2)
> + ~34 kasus IGD** — kasus di atas kompetensi 4A itu disengaja: pemain belajar
> MENGENALI-lalu-MERUJUK sesuai sistem pelayanan kesehatan berjenjang, bukan hanya
> menatalaksana. Target full-fledged mengembalikan paritas itu.

12. **Kasus klinis bertahap**: checkpoint M3 = 16 → **60+** (semua kategori terisi,
    ≥12 di antaranya kasus wajib-rujuk 3A/3B agar latihan rujukan hadir sejak dini);
    target full-fledged = **144/144 penyakit FKTP punya kasus 4A playable + ±60 kasus
    wajib-rujuk (3A/3B/2) + ±20 IGD ≈ 225 kasus** — port dari aset repo lama
    (konversi skema sudah terbukti di 16 kasus pertama; sumber 186 kasus 4A lama
    lebih dari cukup menutup daftar 144).
13. **Sistem rujukan berjenjang penuh** (port `ReferralSISRUTEModal` + `HospitalDB`):
    disposisi RUJUK berkembang dari SBAR-saja menjadi alur SISRUTE — pilih RS tujuan
    (spesialisasi/jarak/ketersediaan bed), moda ambulans, lalu **penolakan berjenjang**
    seperti repo lama (RS menolak rujukan kasus 144-FKTP; bed penuh; spesialisasi tak
    cocok); **PRB (Program Rujuk Balik)**: pasien yang dirujuk KEMBALI dari RS dengan
    surat balasan → kontrol lanjutan di poli (loop rujukan dua arah). Plus
    **confidence-tagging guillotine** (catatan dossier lama): merujuk kasus non-4A
    dengan TEPAT diberi *reward* kalibrasi — guillotine tidak boleh mengajarkan
    "jangan pernah merujuk". Dex diperluas: entri non-4A dihitung dikuasai bila
    dikenali-dan-dirujuk-benar (kompetensinya memang "kenali & rujuk").
14. **IGD penuh**: triase + deteriorasi per-langkah + aksi stabilisasi ber-vitalEffect
    (port ringan `EmergencyRegistry` ~70 aksi) — sebagai *interrupt event* dramatis,
    bukan layar permanen. Kode Biru→RJP→Kode Hitam; stabilisasi-dulu-baru-rujuk dinilai.
15. **Keluarga binaan 6 → 16** + arc 3-babak untuk sebagian (format Bu Wulan),
    roster maks naik 8 → 16.
16. **KIA**: ANC K1–K4 + skoring risiko bumil (port `PregnancyEngine`) — masuk sebagai
    jalur kasus poli + skenario kunjungan bumil risiko tinggi.
17. **Musim penuh & pelengkap**: event kalender (17 Agustus, musim panen → HT bolos
    kontrol, pancaroba → ISPA) + hari kesehatan nasional sebagai surat/event; kasus
    gigi dasar (port `DentalDiagnosisEngine` FDI/DMFT) opsional di ekor M3.

## M4 — Ekonomi & Manajemen Bergigi

18. **Stok obat & pengadaan**: inventaris menipis, pemesanan supplier ber-lead-time,
    stok habis = terapi terbatas (port disederhanakan — tanpa ERP-feel lama).
19. **Laporan bulanan kapitasi**: pemasukan (kapitasi×KBK) − operasional; defisit
    berbuntut teguran Dinkes (Manajemen).
20. **Akreditasi D60**: visitasi yang mengaudit REKAM MEDISMU sendiri (kelengkapan
    SOAP dari action-log) — temuan desk-sim yang disepakati juri.
21. **Stamina/burnout lanjutan**: aktivitas pemulihan akhir pekan (sederhana, 1 pilihan
    per Minggu), burnout memengaruhi kualitas auto-resolve.

## M5 — Stase Penuh & Endgame

22. **Kurva 90 hari**: pacing Director per fase (D1–14 breathing → D61+ tekanan penuh),
    jaminan cakupan kurikulum (semua kategori SKDI tersentuh per bulan, ≥30% kasus
    belum-pernah).
23. **Lock skor D91 immutable** + Laporan Akhir Stase sinematik (count-up + delta
    baseline + epilog per keluarga binaan).
24. **Mode lanjut pasca-stase** (badge hunt) + lifetime meta lintas playthrough
    (Dex & badge bertahan; port 9 badge lama).
25. **Save slot manual** (3 slot + autosave) + ekspor/impor arsip JSON.

## M6 — Kelas & Dosen (integritas asesmen)

26. **Rekomputasi skor dari action-log** saat submit (bukan percaya tally klien) —
    fondasi sudah ada (log lengkap di state); tambah verifier headless.
27. **Ekspor "Dossier Mahasiswa"**: file hasil stase bertanda tangan (checksum HMAC)
    untuk disetor ke dosen — jalur offline-first tanpa server.
28. **Dosen Dashboard** (opsional online): Supabase 5 tabel pola lama, leaderboard
    4 dimensi read-only, TANPA live leaderboard mid-game (prinsip lama dipertahankan).
29. **Telemetri belajar** (opsional): event clinical_decision/case_completed untuk
    riset pendidikan — buffer lokal, kirim saat online.

## M7 — Polish Komersial & Distribusi

30. **Onboarding interaktif Hari 1** (tutorial diegetik dr. Harsono, bukan surat saja).
31. **Pengaturan**: volume musik/SFX terpisah, ukuran teks, mode malam manual,
    kecepatan animasi.
32. **Juice pass**: transisi layar, stempel fisik lebih berat, kertas bergeser,
    BGM adaptif per blok; ilustrasi rumah unik per keluarga.
33. **Packaging**: `electron-builder` → installer Windows (NSIS) + ikon + auto-update
    opsional; uji di lab FK (spek rendah).
34. **Aksesibilitas**: navigasi keyboard penuh, kontras AA, reduce-motion.
35. **Layar Kredit & Tentang**: identitas ITS MEDICS + HKI (sudah di layar judul;
    duplikasi di menu Tentang).
36. **QA akhir**: playtest 5–10 mahasiswa, profil adversarial diperluas (port 7 profil
    lama sebagai kontrak formula), soak test 90 hari headless.

## M8 — Arena (pasca-rilis, app terpisah)

37. **PRIMER Arena**: fork scaffold Sistema (keputusan dossier lama) — kompetisi kelas
    real-time dengan commons RS kabupaten ("STEMI-ku merebut kasurmu"). Codebase
    TERPISAH; jangan menyandera single-player.

---

## Utang teknis tercatat (dari review, sengaja ditunda)

- `follow_up_kunjungan` & `followUpHari` yatim di kontrak state → diisi M1.4.
- ~~Jalur rujuk-tanpa-diagnosis~~ — **DIPERBAIKI 2026-07-03** (audit CODEX, lihat
  §Triangulasi di bawah): diagnosis kini wajib untuk SEMUA disposisi termasuk rujuk.
- Grinding trust kunjungan ulang — masih belum terverifikasi (di luar cakupan audit
  CODEX 2026-07-03, yang fokus ke permukaan M1–M3b yang genuinely baru).
- Jawaban anamnesis statis vs status pasien dinamis (alergi kini dipaksa 100% untuk
  kasus trap; solusi jangka panjang: varian jawaban ber-state di skema konten).
- Bundle renderer 1.1 MB (belum code-split; belum masalah untuk desktop).
- `arcSelesai` global per keluarga (bukan per-skenario) — cukup untuk arc 2 kunjungan;
  revisit saat arc 3+ babak (M3.15).

---

## Triangulasi M3b — CODEX (audit kode read-only) + DeepThink (strategis) — 2026-07-03

Dua reviewer independen dijalankan atas HEAD M3b: **CODEX** mengaudit kode/konten
(read-only), **DeepThink** menilai arsitektur produk & validitas pedagogis. Metodologi
triangulasi: Claude (builder) tidak mengaudit karyanya sendiri secara final — dua
perspektif eksternal menyilang sebelum lanjut ke milestone berikutnya.

### CODEX — 8 temuan, SEMUA diperbaiki + diverifikasi (117 test, tsc bersih, build OK)

| # | Temuan | Perbaikan |
|---|---|---|
| P1 | Narasi "Kejang Demam Kompleks" tak penuhi kriteria kompleks (durasi/fokal/berulang) sendiri | Narasi diubah eksplisit berulang 2× dalam <24 jam |
| P1 | IGD: disposisi KELIRU tetap dihitung `igdStabil` + bonus skor sama seperti disposisi tepat | Tally dipecah `igdStabil` vs `igdSalahDisposisi` baru; skor hanya menghargai yang tepat |
| P1 | Prolanis "bulanan" bisa digelar harian setelah hari ke-30 (cooldown tak ditegakkan) | Guard `sesiBerikutHari` di reducer + UI (tombol terkunci + tanggal berikutnya) |
| P1 | Rujuk tanpa komit diagnosis diterima & dihitung `rujukanTepat` | Diagnosis wajib untuk semua disposisi; confidence-tag hanya utk diagnosis benar |
| P1 | Layar IGD membocorkan nama diagnosis + ICD-10 sejak langkah pertama | Disembunyikan sampai fase disposisi; narasi pembuka kasus (tak terpakai sebelumnya) kini ditampilkan sebagai gantinya |
| P2 | Program Wilayah "mingguan" bisa diganti kapan saja (`mingguDitetapkan` tak dipakai) | Guard reducer + UI kunci 🔒 sepanjang pekan berjalan |
| P2 | Save saat IGD aktif bisa macet permanen bila konten IGD berubah/hilang di build lebih baru | `deserialize(json, pack)` memulihkan IGD tak dikenal + surat kompensasi, bukan menolak seluruh save |
| P2 | `validasiPack` cuma `console.warn` (bukan fail-fast sungguhan) & tak mencakup `kasusIgd` | Diperluas ke kasus IGD (langkah/pilihan-benar/spesialisasi-RS); throw di DEV; gerbang wajib `pack.test.ts` di CI |

Semua diverifikasi ganda: unit test baru (3 test ditambah, 117 total) + interaksi
langsung di browser preview (state IGD dipaksa via store, tally & UI dicek nyata).
Regresi nol.

### DeepThink — 6 penilaian strategis + 1 blind spot + 1 "jangan diubah"

Ringkasan penilaian (assessment lengkap tersimpan di histori sesi ini; poin utama):

- **Q1 Durasi 22–45 jam**: risiko validitas asesmen tinggi (kelelahan bermain ≠
  inkompetensi medis). Rekomendasi: Mode "Ujian 30 Hari" (~8 jam, seed terkurasi)
  sebagai satu-satunya instrumen bernilai; 90-hari jadi "Karier" bebas nilai.
  **Blind spot yang disertakan**: seed tunggal deterministik = kunci jawaban bisa
  bocor via grup WhatsApp angkatan dalam 48 jam — WAJIB rotasi 5–10 seed + acak
  nama/visual pasien bila mode ini dibangun.
- **Q2 Kalibrasi skor baru**: SUSPEK bisa jadi "lindung nilai" defensif (skor 0.4
  untuk suspek-salah terlalu dekat ke tegak-benar); IGD murni hukuman tanpa
  reward keberanian klinis. Rekomendasi: turunkan cap SUSPEK, beri IGD tuntas
  bonus eksplisit +5 (bukan cuma "tak dihukum").
- **Q3 Cakupan kurikulum vs prevalensi**: guardrail prevalensi M3a bisa membuat
  kasus 4A langka tak pernah muncul dalam satu sesi. Rekomendasi: "Curriculum
  Director" pity-timer yang menjamin kemunculan minimal 1× per sesi ujian.
- **Q4 UKM "bergigi"**: kader-scout bagus tapi belum ada *opportunity cost* agregat.
  Rekomendasi: Lokakarya Mini jadi "Triase Anggaran" — hanya boleh danai 1-2
  program/bulan, memaksa mengorbankan area lain.
- **Q5 M6 integritas asesmen**: HMAC offline murni rentan ekstraksi-secret oleh
  mahasiswa tech-savvy; server penuh = scope-creep mematikan utk solo-dev.
  Rekomendasi: **Hybrid Recomputation** — klien ekspor action-log kriptografis,
  dosen-dashboard menghitung ulang skor server-side sebagai validasi absolut.
  (DeepThink sendiri menandai ini kemungkinan besar OVER-ENGINEERING bila
  asesmen berlangsung *proctored* di lab kampus — lihat bias-check.)
- **Q6 M4 vs M5/M6**: ekonomi faskes detail (stok obat, defisit BPJS, akreditasi)
  = kompetensi manajerial residen, bukan core S1/Profesi. Rekomendasi: potong
  M4 jadi abstraksi kosmetik, alihkan bandwidth ke M5 (endgame) + M6 (ekspor
  dosen) yang eksistensial untuk bisa dipakai menilai semester depan.
- **🟢 Jangan diubah**: M1 Bridge (karma UKM↔UKP) + SDOH Armor — dinilai
  "masterstroke pedagogis", satu-satunya mekanik yang menangkap realitas
  sosiologis Puskesmas yang mustahil diajarkan lewat soal pilihan ganda.

### Keputusan (builder + user, 2026-07-03)

CODEX → **diterima & dieksekusi penuh** (bug/integritas objektif, bukan pilihan desain).

DeepThink → **butuh keputusan pemilik kurikulum** (Anda), bukan keputusan sepihak
Claude — semua poin di atas mengubah bentuk M3–M6, bukan sekadar bug. Lihat
percakapan untuk pertanyaan konfirmasi; hasilnya akan dicatat di sini setelah
dijawab. Sampai dijawab, roadmap M4–M6 di bawah **belum direvisi** dan tetap
mengikuti rencana pra-triangulasi.
