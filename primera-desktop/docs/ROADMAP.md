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

## M3 — Konten Skala Penuh & Rujukan Berjenjang (SELESAI ✅ 2026-07-03)

> **M3a+M3b:** 67 kasus poli + 5 kasus IGD, SISRUTE berjenjang + PRB + confidence-tag,
> 4 guardrail balance, audit medis 5-dokter (nol P0), IGD turn-based (Kode Biru/RJP/
> Kode Hitam) + kalender musim (butir 14 & 17).
> **M3c (butir 15-16) ✅:** keluarga binaan **6 → 16** (2 per RW, 4 file konten baru
> desaC-F, ~14 skenario kunjungan baru) + **KIA**: flagship keluarga_asih — bumil
> risiko SANGAT tinggi (38 th G4P3, riwayat HPP) dengan **arc 3-babak pertama**
> (dukun→buta tanda bahaya→jalan ke PONED; skor Poedji Rochjati dianyam ke dialog)
> — melengkapi 6 kasus KIA poli M3a. Karma kini **9 krisis tersebar D6→D50**
> (drumbeat mingguan, dites anti-menumpuk). Engine: arc tamat diikat "skenario
> terakhir sukses" (bukan TTM — dulu skenario ke-3 tak pernah termainkan & arc
> 1-babak tak bisa tamat), roster binaan 8→16 (`MAKS_BINAAN` satu sumber di
> reducer). 129 test hijau (8 baru: `m3keluarga.test.ts`).

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

## M4 — Ekonomi & Manajemen Bergigi ✅ (selesai 2026-07-03, 4/4 butir penuh)

> Keputusan triangulasi: M4 TIDAK dipotong (rekomendasi DeepThink ditolak user).
> 143 test hijau (+14 `m4ekonomi.test.ts`), verifikasi visual panel Gudang &
> Pemulihan di preview.

18. ✅ **Stok obat & pengadaan**: gudang melacak stok semua obat (awal 12/item —
    fast mover terkuras ~2 pekan); resep mengonsumsi stok saat disposisi; stok 0
    MEMBLOKIR resep (chip HABIS di formularium → pemain pilih alternatif terapi);
    `PESAN_OBAT` 5-50 unit, lead time 3 hari, panel Gudang Obat di Meja Kerja
    sore menampilkan yang menipis (≤5) + pesanan dalam pengiriman; surat farmasi
    saat kiriman tiba & saat stok pertama kali menipis. Save lama: stok kosong =
    tidak dilacak, backfill 12/obat saat load dgn pack.
19. ✅ **Laporan bulanan kapitasi**: tiap gajian KBK (D31/D61) operasional
    Rp 2,5 jt terpotong + surat Bendahara merinci pemasukan/belanja obat/
    pengadaan/saldo; saldo < Rp 8 jt → surat TEGURAN Dinkes + tally
    `teguranDinkes` (−1 manajemen per teguran); buku kas bulanan di-reset.
20. ✅ **Akreditasi D60**: tally `rmLengkap` menghitung encounter dgn SOAP utuh
    (4 fase ≥50); D50 surat pemberitahuan visitasi; D60 hasil dari rasio
    rmLengkap/totalPasien → PARIPURNA ≥75% (+1.5 manajemen) / UTAMA ≥55%
    (+0.5) / MADYA (−1.5) — mengaudit rekam medis yang benar-benar kamu tulis.
21. ✅ **Stamina/burnout lanjutan**: aksi `PEMULIHAN` tiap hari ke-7 (blok siang,
    memakai slot lapangan): istirahat total (burnout −12) / olahraga (−9 +
    stamina +1 besok) / silaturahmi desa (−6, trust +1 semua binaan ber-arc
    hidup); burnout kini menumpulkan insting auto-resolve (peluang pasien
    terlewat bermasalah 0.25 → 0.45 pada burnout 100).

## M4.5 — Mode Ujian 30-Hari ✅ (selesai 2026-07-03; desain: docs/M45_MODE_UJIAN.md)

21b. ✅ **Mode Ujian**: dua seed dua tanggung jawab — `seedKurikulum` (APA yang
     diujikan: Director + kedatangan/pemilihan IGD; sama per paket) vs `seed`
     flavor (WAJAH pasien: nama/usia/RW/persona/BPJS + semua roll dadu;
     per-mahasiswa). `susunAntrianHarian` menerima `rngFlavor` terpisah.
     Pool **8 paket** (`paketUjian.ts`, `paket_a`-`h`) dirotasi otomatis dari
     seed mahasiswa — walkthrough harus ditulis 8×, dan nama pasien tak bisa
     jadi penanda. Layar judul: pemilih Karier 90 hari / Ujian 30 hari; HUD
     `HARI x/30` + chip UJIAN; surat pembuka khusus ujian menyebut paket.
     **Kunci skor**: melewati hari terakhir (`HARI_STASE`) → `tamat` + surat
     rincian 4 dimensi + `LANJUTKAN` ditolak; kunci yang sama memberi D90
     untuk Karier (M5.23 separuh jalan). Save lama termigrasi (karier,
     seedKurikulum=seed); `mode`/`paketUjian` tercatat di state utk M6.
     Dites: kasus identik + wajah beda per paket, paket beda = kurikulum beda,
     pola IGD identik per paket, kunci D30/D90, roundtrip & migrasi save
     (10 test `m45ujian.test.ts`). **Ditunda ke M5.22 (sesuai desain):**
     kurasi pacing per-fase — Mode Ujian sementara memakai Director standar +
     Curriculum Director (pity-timer 4A).

## M5 — Stase Penuh & Endgame ✅ (selesai 2026-07-03)

22. ✅ **Kurva pacing per fase** (`faseStase`/`jumlahPasienHarian`/`peluangIgd` di
    director): pasien 2 (onboarding) → 3 → **4** di fase >2/3 durasi; peluang IGD
    0.12 → 0.15 → **0.20**; kurva PROPORSIONAL durasi mode → utang M4.5 (pacing
    Mode Ujian) lunas — ujian 30 hari memakai kurva sama dipadatkan 3×. Cakupan
    kurikulum: boost ×1.5 utk kategori SKDI yang belum pernah disentuh Dex
    (melengkapi pity-timer 4A M3.18); "≥30% belum-pernah" ditopang bobot
    Leitner ×3 yang sudah ada.
23. ✅ **Laporan Akhir Stase sinematik** (`LaporanAkhir.tsx`, layar 'laporan'):
    3 babak (stempel grade jatuh → count-up 4 dimensi ease-out → statistik +
    badge + "Kabar dari Desa" epilog per keluarga ber-arcSelesai) + tombol
    **Ekspor Arsip JSON**. Kunci skor immutable sudah dari M4.5; layar laporan
    di-guard (hanya terbuka setelah tamat).
24. ✅ **Badge & lifetime meta**: 9 badge (`badge.ts`, pure `hitungBadge`) —
    PTT Teladan, Penjaga Nyawa, Gerbang Kokoh, Pencegah Takdir, Sahabat Desa,
    Paripurna, Bendahara Rapi, Kolektor Buku Saku, Hadir Sepenuhnya; saat TAMAT
    store menggabungkan badge + bintang Dex maks ke slot `meta` lintas
    playthrough; layar judul menampilkan jejaknya (x/9 badge · n dikuasai ·
    n stase tuntas).
25. ✅ **Save slot manual**: 3 slot (simpan di Meja Kerja sore, muat dari layar
    judul dgn label nama/hari/mode/tamat) + autosave lama + **ekspor** (Laporan
    Akhir) & **impor** arsip JSON (layar judul, tervalidasi deserialize).
    "Mode lanjut pasca-stase" (badge hunt bebas) TIDAK dibuat sebagai mode
    terpisah — pasca-tamat pemain tetap bisa membuka Rapor/Dex/surat; berburu
    badge terjadi lintas playthrough via meta.

## Audit EBM konten (2026-07-03) — docs/AUDIT_EBM_KASUS.md

Telaah solo satu-per-satu 72 kasus (67 poli + 5 IGD) atas permintaan user.
Akurasi EBM sangat tinggi. Dua perbaikan: (1) asma ringan → wajib ICS/budesonid
per GINA 2019+; (2) mekanisme engine `obatAlternatif` (grup "pilih-salah-satu")
memperbaiki 8 kasus yang sebelumnya menghukum monoterapi benar & memberi hadiah
polifarmasi sekelas. Commit `6e09b52`. Titik "praktik lokal FKTP" (kloramfenikol
tifoid, kotrimoksazol ISK, kombinasi analgesik) sengaja dipertahankan.

Ronde 2 (`8e33d79`): respons audit CODEX — 7 temuan valid diperbaiki (apendisitis
analgesia, PPOK GOLD, hipoglikemia disposisi rujuk, depresi ringan tanpa AD wajib,
anafilaksis bifasik dilunakkan, gout ACR 2020, edukasi migrain).

Ronde 3 (`79795df`, playtest user + triase CODEX anamnesis): kamus ICD-10
(`content/icd10.ts`) — semua kode banding bernama (guard test); pencarian obat
fonetik EN↔ID + `Obat.sinonim`; alergiTrap kini discoverable (pertanyaan alergi
di 4 kasus trap, guard test); sabar-habis tak lagi memberi kredit anamnesis;
q_alergi di 6 kasus obat-berisiko; safety screen insomnia. Ditunda ke M7:
anamnesis branching + axis penilaian konseling (KB).

## M6 — Kelas & Dosen (integritas asesmen) — inti SELESAI ✅ (2026-07-03)

> Desain: `docs/M6_KELAS_DOSEN.md` (ditulis sebelum kode). Temuan eksplorasi
> yang MENGOREKSI asumsi roadmap: `LogEntry` lama cuma jurnal telemetri
> (type+detail, tanpa payload) — TIDAK bisa direplay; "fondasi sudah ada"
> ternyata baru setengah. M6 menambah `GameState.jejak: Action[]` (jurnal
> aksi PENUH, aksi-ditolak ikut terekam) — bersama seed + engine murni,
> seluruh permainan tereproduksi byte-demi-byte.

26. ✅ **Rekomputasi skor dari action-log** — `engine/verifikasi.ts`:
    `verifikasiDossier()` headless me-replay jejak (buildInitialState → fold
    advance) lalu membandingkan tally/hari/tamat/skor vs klaim; skor TIDAK
    pernah dipercaya dari file. Status 3 arah: SAH / TIDAK SAH /
    TIDAK DAPAT DIVERIFIKASI (jejak kosong pra-M6, versi konten beda via
    `sidikJariPack` FNV-1a). Model ancaman jujur di dokumen desain: HMAC =
    deterrent; pertahanan sejati = replay; memalsukan jejak konsisten ≈
    memainkan game (TAS).
27. ✅ **Dossier Mahasiswa**: `susunDossier()` (identitas+NIM opsional, stase,
    klaim skor/tally/badge, jejak penuh, versiApp+sidik jari konten,
    HMAC-SHA256 WebCrypto atas JSON kanonik) — tombol ekspor di Laporan
    Akhir (kartu "Setor ke Dosen"); verifikasi dosen offline di layar judul
    (panel stempel SAH/TIDAK SAH + skor klaim vs replay + alasan).
    11 test baru `m6verifikasi.test.ts` (183 total): sah, tamper klaim
    ber-ttd-valid, jejak dipangkas, edit tanpa ttd, jejak kosong, beda
    konten, determinisme, anti tukar-identitas.
28. **Dosen Dashboard** (opsional online): Supabase 5 tabel pola lama, leaderboard
    4 dimensi read-only, TANPA live leaderboard mid-game (prinsip lama
    dipertahankan). DITUNDA menunggu keputusan infra kelas — dossier JSON
    terverifikasi (butir 27) adalah unit datanya (upload = 1 baris).
    Deteksi jejak-kembar antar-mahasiswa (anti-joki) ikut ke sini.
29. **Telemetri belajar** (opsional): event clinical_decision/case_completed untuk
    riset pendidikan — buffer lokal, kirim saat online. CATATAN M6: jejak aksi
    penuh di dossier SUDAH menjadi telemetri per-keputusan; analisis batch
    (mis. distribusi TEGAK/SUSPEK per kasus utk kalibrasi M7) bisa dibangun
    di atas kumpulan dossier tanpa pipeline event baru.

## M7 — Polish Komersial & Distribusi

30. ✅ **Onboarding interaktif Hari 1** (commit `0319923`): carousel diegetik
    dr. Harsono (6 kartu, satu konsep per kartu — 3-blok, gali-jangan-menebak +
    gauge sabar, TEGAK/SUSPEK, tuntas/rujuk + kuota edukasi, rapor 4 dimensi);
    sekali per-instalasi (localStorage), hanya Hari 1 pagi, bisa dilewati, tak
    menyentuh GameState.
31. ✅ **Pengaturan** (commit `53e0389`): volume musik & SFX TERPISAH (live),
    ukuran teks (root scale), mode tampilan auto/terang/gelap (override CODEX
    P3), toggle kurangi-gerak. `settings.ts` non-React (persist localStorage +
    subscribe) dibaca synth/bgm/App; BGM ambient synth lama dimatikan (musik
    file jadi latar). Tombol gigi melayang di title & in-game.
32. ✅ **Juice pass** (commit `40bdbfb` transisi layar; `69f1ee4` BGM): wrapper
    `.app-transisi` di-key layar → fade+slide 0.22s tiap pindah (tunduk reduce-
    motion). Stempel/kertas juice lanjutan & ilustrasi rumah per keluarga =
    kandidat polish lanjutan (opsional).
    BGM adaptif per blok; ilustrasi rumah unik per keluarga.
    *BGM SELESAI duluan 2026-07-03 (permintaan user — regresi dari koleksi
    musik repo lama)*: 7 track `public/audio` lama → `renderer/public/bgm`,
    pemutar `audio/bgm.ts` (loop + crossfade + ikut tombol bisu + retry
    autoplay), peta konteks: title=arni_home, pagi-klinik=guldove_home
    (desa penyembuh!), siang=blue_fields, sore=fishermans_horizon,
    igd=guldove_another, laporan=balamb_garden.
    ⚠️ **LISENSI**: track = OST Chrono Cross/FF8 (Square Enix, koleksi
    pribadi user) — SAH untuk playtest internal, WAJIB DIGANTI musik
    berlisensi sebelum distribusi kelas (lihat
    `renderer/public/bgm/CATATAN_LISENSI.txt`; ganti = tukar file +
    sunting konstanta TRACK di bgm.ts).
33. **Packaging**: `electron-builder` → installer Windows (NSIS) + ikon + auto-update
    opsional; uji di lab FK (spek rendah).
34. **Aksesibilitas** ✅ (bertahap): commit `e80fd43` — kontras WCAG (tinta
    pagi di panel malam 1.24:1→14:1, token kunyit-700/daun-700/tinta-pudar
    ≥4.5:1, disclaimer title dibesarkan), gerbang global `prefers-reduced-
    motion`. Commit `53e0389` — mode malam manual (butir 31, jawab night-comfort
    P3) + ukuran teks global. Commit `40bdbfb` — font kecil dinaikkan (peta
    11px→13px & 9.5px→11px, stepper kunjungan 10px→12px; CODEX P3). **Sisa
    (opsional, uji lab FK)**: navigasi keyboard penuh, headroom 1200×760 +
    skala OS besar (P2 — diterima sbg batas desain fixed-desktop).
34b. **UX Edukasi Pasien** ✅ **DIEKSEKUSI 2026-07-03 (commit `7ac5015`)** —
    O6: kategori WAJIB (6 laci, kontrak tsc) + sinonim + front-loading semua
    label (38→37; merger tunggal kepatuhan_kontrol_ptm→kontrol_rutin — target
    ±30 DT ditinjau: sisanya kembar-label, cukup rename). O4: KAPASITAS_EDUKASI
    =3 di ENGINE + skor min(3,|wajib|) −15/salah + REVISI_ENGINE=2 di sidik
    jari dossier. O1: tab [Resep|Edukasi], baki memo 3 slot, cari fonetik+
    sinonim auto-buka laci, akordion default tutup per-sesi, chip disabled
    saat penuh. 187 test (+4). SISA pasca-playtest: O5 (edukasi→drift
    keluarga) + kalibrasi penalti.
    Dossier: `docs/DEEPTHINK_EDUKASI_UX.md`. **VERDIKT DEEPTHINK
    DITERIMA 2026-07-03 dengan triase** (jawaban Q1–Q6 diarsip user di chat):
    - **Diterima**: Q1 konstruk prioritisasi top-3 slot (O4) + Q3 kuota
      menghancurkan strategi "4 sakti" via opportunity cost; Q2 kriteria
      operasional anti-bocor "scaffolding statis-universal sah, reduksi
      dinamis dari hidden-state = bocor" (O3 DITOLAK PERMANEN, O2-murni
      ditolak); Q4 isolasi spasial tab `[Formularium | Edukasi (0/3)]`,
      BUKAN fase baru; Q6 heuristik ambang ±15 item (≤15 flat deck sah,
      >15 wajib hibrida kategori-akordion + cari + baki terpilih); formula
      pengganti `clamp(100×tercakup/min(3,|wajib|) − 15×takRelevan, 0, 100)`
      (kasus komorbid wajib>3 tetap bisa 100% — meredam protes "malpraktik");
      framing UI "Waktu terbatas — pilih 3 edukasi paling kritis saat ini".
    - **Q5 (timing) diterima substansinya, urutan disesuaikan**: konstruk
      diubah SEBELUM instrumen dipakai menilai 50 mahasiswa (argumen
      garbage-in-garbage-out benar; sikap lama kami "pasca-playtest" keliru
      utk perubahan konstruk, tetap benar utk kalibrasi bobot penalti).
      Eksekusi: M7-AWAL setelah M6 (arahan user), sebelum QA butir 36.
    - **Dikoreksi dari verdikt** (catatan implementasi): (a) kuota 3 WAJIB
      ditegakkan di ENGINE (`TAMBAH_EDUKASI` menolak slot ke-4), bukan cuma
      UI — konsistensi action-log/replay M6; (b) usulan "interceptor
      truncate aksi edukasi ke-4+ saat replay log lama" DITOLAK — memalsukan
      sejarah; ganti dengan versioning save/skor (belum ada data mahasiswa
      nyata, reset baseline pra-rilis lebih jujur & sederhana).
    - **Pasca-playtest**: O5 (edukasi → drift/kepatuhan keluarga binaan,
      "investasi dunia" Harvest Moon) + kalibrasi penalti.
    - Urutan paket M7-awal: O6 taksonomi (lebur kembar-konfusabel, ±30 topik
      ortogonal, metadata kategori + sinonim) → O1 tab + kategori kolapsibel
      → O4 baki prioritas-3.
    - **Triase masukan DT ronde-2 (2026-07-03, "Tembok Ratapan Kognitif")** —
      sebagian besar elaborasi verdikt yang sudah diterima (baki 3 slot,
      cari, akordion); yang BARU & diadopsi ke spesifikasi O6/O1:
      (a) **Diagnosis "Blok K" DITERIMA** — 9 label berawalan kata kerja K
      (Kenali×4/Kompres×2/Kontrol×2/Kepatuhan) memaksa *reading* bukan
      *scanning*; pembeda ada di EKOR kalimat → sumber slip-error.
      (b) **Keyword front-loading DITERIMA dengan pagar**: verifikasi kode —
      label lama SUDAH memuat nama diagnosis ("pencetus migrain", "Manuver
      Epley", "diet purin") → pemindahan ke depan = informasi-netral, lolos
      kriteria Q2 (scaffolding statis-universal, bukan reduksi dinamis).
      PAGAR: tag kurung pakai TARGET/ORGAN/KONTEKS dulu ([Mata], [Demam],
      [Kehamilan], [Tidur]); nama diagnosis hanya utk topik yang inheren
      diagnosis-spesifik & sudah telanjang di label lama (migrain, Epley,
      inhaler-asma). Jangan menambah tag diagnosis ke topik generik.
      (c) **Akordion default-TERTUTUP DITERIMA dengan 2 syarat**: hasil cari
      meng-auto-buka laci yang memuat kecocokan (cari tak boleh terhalang
      laci), dan status buka/tutup diingat selama sesi (bukan state save).
      Trade-off yang diterima sadar: paparan-luas topik utk pemula berkurang
      — dikompensasi Buku Saku/edukasi pasca-encounter, bukan dgn membuka
      semua laci.
      (d) **Taksonomi DT DIKOREKSI**: "Higiene-Sanitasi digabung KIA" ditolak
      (pasangan tak koheren klinis) — target 5-6 kategori ±5-8 topik: Gaya
      Hidup & Aktivitas · Diet & Nutrisi · Kepatuhan & Kontrol · Higiene &
      Pencegahan Infeksi · KIA · Tindakan Fisik & Khusus (jiwa/tidur melebur
      ke Gaya Hidup atau Khusus saat implementasi, lihat jumlah akhirnya).
      (e) Baki penuh → chip lain disabled + tombol X per slot (afordans
      jelas); animasi "terbang" = juice opsional, wajib hormati
      prefers-reduced-motion. (f) Retorika "nilai mahasiswa cacat" =
      hiperbola (bobot edukasi 10%) tapi arahnya benar — validitas sumbu
      edukasi memang rusak oleh strategi 4-sakti + slip-error UI.
34c. **Audit total "bahasa pasien"** ✅ **SELESAI 2026-07-03**: sapu solo
    (mono, per-file) SEMUA ucapan pasien — `jawab` + `variasi` 6 persona di 72
    kasus + dialog kunjungan. Skrip audit menemukan **79 pelanggaran, SEMUANYA
    di persona `terpelajar`** (varian ini ditulis seperti sejawat: wheal
    eritematosa evanescent, dispnea, epigastrium, onset, McBurney, NYHA,
    monoartikular, dermatom, anhedonia…). Ke-79 ditulis ulang ke suara awam-
    berpendidikan (tetap artikulatif/presisi, boleh "darah tinggi"/"biduran"/
    "asam urat", tanpa Latin klinis). `jawab` dasar & persona lain sudah bersih;
    dialog kunjungan bersih. Penutup: catatan gaya di `types.ts` (doc Persona)
    + **guard test `bahasaPasien.test.ts`** (188 total) yang menggagalkan CI
    bila konten baru menaruh jargon di ucapan pasien.
35. ✅ **Layar Kredit & Tentang** (commit `53e0389`): `TentangModal` dari
    Pengaturan — identitas ITS MEDICS + HKI EC002026019623 lengkap + disclaimer
    medis + kredit aset + peringatan lisensi musik.
36. **QA akhir** (parsial ✅ commit `6378831`): **soak test 90 hari headless**
    (`soak.test.ts` — Karier 90h + Ujian 30h×2 seed: nol crash/NaN, tamat tepat
    waktu, jejak M6 utuh) + **profil adversarial** (`adversarial.test.ts` —
    kontrak: main jujur mengungguli koboi-tangani-semua/SUSPEK-selamanya/rujuk-
    semua/shotgun-edukasi). **SISA (butuh manusia/hardware)**: playtest 5–10
    mahasiswa; uji di lab FK spek rendah.
    **CHECKLIST WAJIB pra-distribusi**: ganti BGM Square Enix dengan musik
    berlisensi (butir 32 — installer TIDAK BOLEH memuat track OST komersial).

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
- ~~`arcSelesai` global per keluarga~~ — arc 3-babak jalan sejak M3c (tamat diikat
  panjang arc, `terapkanHasil` menerima `totalSkenario`); `arcSelesai` global tetap
  cukup karena tamat memang peristiwa tingkat-arc.
- Label pembicara di layar Kunjungan selalu nama KEPALA keluarga (konvensi M0),
  padahal banyak dialog diucapkan istri/anak (mis. respons Bu Asih berlabel
  "Pak Jumadi"). Perbaikan butuh field `pembicara` per node dialog di skema
  konten + migrasi 26 skenario — kandidat M7 polish.

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

DeepThink → **empat keputusan diambil pemilik kurikulum**, dieksekusi sebagian
di sesi ini, sebagian dijadwalkan:

1. **Q6 (M4)**: ❌ TIDAK dipotong. M4 tetap 4 butir penuh (18-21) sesuai rencana
   semula — ditolak rekomendasi DeepThink untuk menyusutkannya jadi kosmetik.
2. **Q1 (Mode Ujian 30-Hari)**: ✅ DIBANGUN — lihat spek di bawah. Ditambahkan
   sebagai milestone baru **M4.5** (setelah M4, sebelum M5) karena butuh
   fondasi ekonomi/manajemen M4 selesai dulu (Laporan bulanan kapitasi dipakai
   sbg bahan pacing kurasi 30-hari) dan harus rampung sebelum M5 mengunci
   arsitektur endgame. **Belum diimplementasikan** — baru desain di bawah.
3. **Q2 (rebalance skor SUSPEK/IGD)**: ⏸️ DITUNDA — butuh data playtest
   sungguhan, bukan tebakan di atas tebakan. Dicatat sbg item M7 QA (butir 36)
   ketika playtest 5-10 mahasiswa berjalan: ukur distribusi TEGAK/SUSPEK &
   IGD-tuntas aktual, baru kalibrasi ulang bila datanya menunjukkan masalah.
4. **Q3+Q4 (Curriculum Director + Lokakarya Triase Anggaran)**: ✅ DIBANGUN &
   DIVERIFIKASI di sesi ini (lihat commit) — bukan ditunda ke M3c/M7 seperti
   opsi awal, karena keduanya ternyata berukuran kecil & bounded:
   - **Curriculum Director**: slot "jaminan kurikulum" di `director.ts`
     (sebelumnya cuma "≥1 kasus belum-pernah, tertimbang prevalensi") kini
     memprioritaskan kasus 4A wajib yang belum pernah tertangani secara
     UNIFORM (melawan bobot prevalensi, bukan tunduk padanya) — kasus 4A
     langka tak lagi bisa terkubur selamanya oleh guardrail prevalensi M3a.
   - **Lokakarya Triase Anggaran**: Program Wilayah berubah dari kunci
     MINGGUAN → **BULANAN** (field `program.periodeDitetapkan`, divisor 30)
     — satu fokus per bulan sungguhan, bukan bisa dirotasi tiap pekan
     mengikuti surveilans (itu meniadakan makna "memilih & mengorbankan").
     Modal Lokakarya Mini kini menampilkan panel **"⚖️ Ongkos oportunitas
     bulan ini"**: kluster aktif yang TAK tersentuh fokus berjalan, per RW +
     jumlah kasus — ongkos oportunitas eksplisit, bukan implisit.
   121 test hijau (+4 dari batch CODEX), tsc bersih, build OK, diverifikasi
   visual di browser preview (panel ongkos oportunitas & kunci bulanan
   dikonfirmasi render benar dengan data surveilans buatan).

#### Spek Mode Ujian 30-Hari (M4.5, DESAIN — belum dibangun)

Blind spot DeepThink WAJIB dipenuhi sejak desain awal, bukan ditambal belakangan:

- **Dua mode di layar judul**: "Karier" (90 hari, seperti sekarang, bebas nilai,
  progres lintas playthrough) vs "Ujian" (~30 hari, ~8 jam, SATU-SATUNYA yang
  menghasilkan skor formal untuk disetor dosen via M6).
- **Rotasi 5-10 seed kurikulum**, bukan satu seed tunggal per angkatan — Director
  memilih dari pool paket ujian (mis. `ujian_paket_1`..`ujian_paket_5`), bukan
  dari nama+timestamp mahasiswa. Wajib supaya kunci jawaban tak bisa disusun &
  dibagi via grup WhatsApp angkatan dalam 48 jam pertama.
- **Seed konten vs seed flavor HARUS terpisah** (perubahan arsitektur RNG,
  bukan sekadar penambahan mode): seed paket menentukan URUTAN & JENIS kasus
  yang tampil (identik untuk semua mahasiswa 1 paket, demi keadilan asesmen);
  seed per-mahasiswa (dari nama+timestamp, seperti sekarang) tetap menentukan
  nama/usia/RW pasien & detail kosmetik lain (mencegah "pasien bernama sama
  persis di baris sama persis" jadi kunci jawaban yang lebih mudah dibaca).
  Ini titik kerja paling berisiko di M4.5 — `Rng` & `susunAntrianHarian` saat
  ini pakai SATU seed untuk semuanya; perlu pemisahan hati-hati agar
  determinisme & test yang ada tidak rusak.
- **Kurasi konten Mode Ujian**: bukan library 225 kasus penuh diputar acak
  dalam 30 hari (terlalu padat/acak untuk sesi terkurasi) — pilih subset yang
  menjamin cakupan SKDI 4A inti + sampel rujukan 3A/3B/IGD, dipacing eksplisit
  per fase (mis. minggu 1-2 breathing, minggu 3-4 tekanan penuh), bukan
  Director umum apa adanya.
- **M6 (§26-27)** mengekspor skor dari Mode Ujian, bukan Mode Karier — perlu
  ditandai jelas di `GameState` (field mode) supaya dashboard dosen tak
  keliru menerima submission dari save Karier.

---

## Parkir diskusi (jangan dikerjakan/dibahas sebelum user membuka kembali)

- **Variasi naratif per kasus** (user, 2026-07-03, "simpan dulu diskusi ini"):
  history-taking tiap kasus saat ini satu skrip statis — DBD selalu bercerita
  sama, diare selalu sama. Pertanyaan yang diparkir: perlukah tiap kasus punya
  ≥2-3 varian presentasi (keluhan pembuka, kronologi, red-herring ringan,
  persona×narasi) supaya pengulangan kasus di stase 90 hari tidak hafalan?
  Kandidat "M khusus pengayaan storyline" — sentuh KONTEN & seed flavor,
  bukan engine. Interaksi dgn Mode Ujian: varian harus dari seed flavor
  (per-mahasiswa) agar paket tetap adil. Bahas ulang setelah M6/M7-awal.
  **→ Diformalkan 2026-07-05 jadi M11 butir 4, lihat notulensi M9-M12 di bawah.**

---

## Notulensi M9–M12 (dicatat 2026-07-06)

Ringkasan status milestone lanjutan pasca-M8. Narasi & bukti kerja penuh
tiap ronde ada di `CODEX_AUDIT_DOSSIER.md` (§1-38 dan seterusnya) — bagian
ini cuma peta status + pointer, bukan pengganti dossier itu.

### M9 — Audit & Hardening: pola bug berulang ✅ (selesai 2026-07-04)

User mengamati 3 ronde CODEX beruntun menemukan bug di klaster yang SAMA
(kunci tutorial, SKDI/ICD-10, tatalaksana-vs-clue) dan minta audit
sekali-jalan alih-alih tambal reaktif per-ronde. 4 sub-bagian, semua
selesai: **M9.1** kunci tutorial (investigasi manual + test invarian
menyeluruh menemukan 5 celah, bukan cuma 2 yang diduga awal — pola
"manual + otomatis saling melengkapi, bukan salah satu saja"); **M9.2**
audit SKDI thd Kepmenkes 1186/2022 (dokumen otoritatif ASLI utk "144
FKTP", beda dari SKDI 2012 umum yg dipakai sblmnya); **M9.3** sapuan
heuristik tatalaksana-vs-clue, dipermanenkan jadi `tatalaksanaClue.test.ts`;
**M9.4** dokumentasi tensi tutorial-di-mode-ujian. Detail: dossier §28-30.

### M10 — Audit konsistensi menyeluruh (didefinisikan 2026-07-05, BELUM SELESAI)

Beda kelas dari M9 (M9 = satu klaster bug spesifik yg berulang; M10 =
audit SISTEMATIS atas segala kemungkinan inkonsistensi/bug/hal terlupa,
krn ronde CODEX terus-menerus menemukan KATEGORI baru di area yg belum
pernah diperiksa dgn lensa ini). 4 dimensi:
1. Konsistensi pipeline penyakit penuh (pemeriksaan→diagnosis→
   tatalaksana→edukasi) utk SEMUA 67 kasus sekaligus, bukan per-stage.
2. Integritas jembatan UKP↔UKM (klinik ↔ kunjungan rumah/kader/RW/
   posyandu/prolanis).
3. Konsistensi state NPC/warga lintas subsistem (identitas yg sama
   jangan terlihat berbeda tergantung subsistem mana yg terakhir sentuh).
4. **(ditambahkan 2026-07-06)** Konsistensi layering UI/UX — elemen
   melayang/fixed (toast, modal, tombol scene) yg saling bertumpuk/
   bertindihan & mengganggu navigasi (contoh sudah ditemukan+ditambal:
   toast Toaster menimpa tombol PanelHasil/dialog Kunjungan — dossier §38).

Brief `M10_AUDIT_BRIEF.md` sudah ditulis & dipakai 1 ronde CODEX (dossier
§36: karma-demografi + sidikJariPack edukasi). Item yg lahir dari ronde
itu sudah dikerjakan (`edukasiKritis` §37, fix Toaster §38), tapi audit
M10 SISTEMATIS penuh (semua 4 dimensi, sekaligus, bukan reaktif per-ronde)
masih **BELUM dimulai**.

### M11 — Enrichment & polish (inti terukur SELESAI 2026-07-13)

Beda dari M10 (M10 = audit yg RUSAK; M11 = menambah yg BAGUS — bukan
memperbaiki, tapi memperkaya). Menyerap item lama "Variasi naratif per
kasus" di atas (jadi butir 4 di bawah). Cakupan:
1. Catatan nuansa EBM (temuan klasik yg bisa normal/atipikal saat akut —
   spt asam urat bisa normal saat serangan gout akut, kasus asli ide ini).
2. Variasi storyline (belum spesifik).
3. Polish visual (belum spesifik saat didefinisikan — kini bercabang
   jadi M12 di bawah, krn user mau sesuatu jauh lebih konkret & besar).
4. Variasi presentasi kasus yg SAMA antar-replay (anamnesis/pemeriksaan
   bervariasi, biar kasus yg sering muncul di stase 90 hari tak hafalan)
   — ini persis "Variasi naratif per kasus" 2026-07-03 di atas.
5. Variasi kasus sisi UKM (kunjungan/kader/posyandu), bukan cuma klinik.
6. Eksplisit terbuka utk variasi lain yg belum terpikirkan.

**Status aktual:** butir 1 selesai (Fase 1/2 + `panduanResmi`), mekanik
process-scoring/stabilisasi serta gating anamnesis ringan-plus selesai,
dan lapisan "idealis vs realita FKTP" sudah diaudit 67/67
(`M11_REALITA_FKTP_AUDIT_2026.md`). Butir 2–6 adalah pengayaan kreatif
yang belum punya acceptance criterion; sengaja ditunda ke scope M13/M12
dan bukan blocker. Butir 4 kemungkinan butuh generator/director baru,
jadi wajib di-scope sebagai proyek tersendiri sebelum diimplementasikan.

### M12 — Full aesthetic pass (didefinisikan 2026-07-06, SELESAI 2026-07-20)

Dijadwalkan SETELAH M10 & M11 selesai. Mengganti visual generik "ruang
tamu itu-itu saja" (satu ilustrasi dipakai ulang utk SEMUA 16 keluarga
binaan tanpa variasi) dgn aset digenerate (warga/NPC, scene per-keluarga
/RW), gaya visual novel ala Telltale/RPG-Maker (kotak dialog + potret
karakter + ilustrasi scene). `Kunjungan.tsx` (4-babak: observasi hotspot
→ wawancara dialog box → diagnosis COM-B → resep sosial) SUDAH berbentuk
persis begini strukturnya — jadi M12 pada dasarnya asset-swap + polish
framing, BUKAN rewrite engine.

**Keputusan dan hasil:** memakai aset orisinal AI-generated tanpa meniru
seniman/studio/game tertentu dan tanpa asset pack pihak ketiga. Implementasi
akhir melampaui target per-keluarga: 27 adegan spesifik per skenario (termasuk
11 kunjungan lanjutan yang berubah), 16 keluarga, dan 24 potret pembicara.
Seluruh provenance, pemetaan, batas runtime, dan pagar regresi dicatat di
`docs/M12_VISUAL_PASS.md`.

### M13 — Kembalikan skala penuh 144/225 kasus (diformalkan 2026-07-11, BELUM DIJADWALKAN)

Aspirasi "target full-fledged" yang ditulis di revisi 2026-07-02 dokumen ini +
`KONTEN_BALANCE.md` (144 penyakit 4A + ~60 rujukan + ~20 IGD ≈ 225 kasus,
port dari repo lama) sempat backlog tanpa milestone resmi selama M4-M12 —
tak pernah dijadwalkan ulang di satu pun milestone lanjutan. Diformalkan di
sini pasca-audit 2026-07-11 (dipicu kekhawatiran user soal kemungkinan
regresi konten) yang mengonfirmasi: **tidak ada regresi** — 67 kasus
checkpoint M3 tetap utuh tak berkurang sepanjang seluruh histori git, angka
144 selalu berarti dua hal berbeda (katalog referensi Dex "144 siluet,
sebagian terisi" SEJAK desain awal, vs aspirasi kasus-playable-penuh yang
ditulis user sendiri) — murni target jangka panjang yang belum diaktifkan,
bukan sesuatu yang pernah dibangun lalu hilang. Detail investigasi penuh:
dossier CODEX_AUDIT_DOSSIER.md (workflow audit 144-vs-67, 2026-07-11).

**Scope:** dari 67 kasus saat ini (50×4A + 7×3A + 9×3B + 1×level-2 —
pasca-koreksi M9.2 follow-up 2026-07-11, lihat `pack.test.ts`) menuju target
penuh **144 penyakit 4A playable + ~60 kasus wajib-rujuk (3A/3B/2) + ~20 IGD
≈ 225 kasus total** — perlu **~152 kasus baru**. Aset porting dari repo lama
(`D:\Dev\PRIMER\src\`, 253 kasus rawat jalan + ~34 IGD) tersedia utk
mempercepat, TAPI repo lama itu persis yang punya insiden P0 ICD-translation-
poisoning (lihat memory `project_primer_clinical_risks.md`) — porting WAJIB
diverifikasi ulang per kasus terhadap ICD-10/dosis/kompetensi resmi, bukan
blind-copy dari dataset yang sudah pernah terbukti tak bisa dipercaya mentah.

**Sengaja disequenc-kan SETELAH Golden Master** (akhir Agustus 2026,
`M10_5_FIDELITAS.md`) — menulis ~152 kasus ber-akurasi-medis dalam window
menuju Golden Master akan membebani tenggat redeploy September. Pola sama
dengan M11a (live-ops konten pasca-freeze skor).

**Sub-scope B — Variasi epidemiologi regional (dicatat 2026-07-11, dari 3
dokumen riset yang diserahkan user: "Profil Kesehatan Nusantara 2023",
"Indonesia Precision Health Atlas", "Lanskap Epidemiologi Regional
Indonesia 2024-2026").** Catatan kualitas sumber: dokumen ketiga (docx)
punya 42 sitasi tertelusur (Kemenkes/jurnal/PubMed) — sumber paling
dipercaya. Dua dokumen pertama (PDF gaya-infografis) TIDAK punya daftar
pustaka sama sekali setelah dibaca penuh 15 halaman masing-masing — cukup
utk arah/prioritas brainstorming, TAPI angka spesifik dari situ wajib
diverifikasi ulang ke sumber resmi sebelum masuk literal ke `clue`/dosis
kasus manapun (disiplin grounding yang sama dgn PPK 1186/M11.5).

Ide konkret, dari yang paling murah/pas mekanik existing sampai yang perlu
keputusan sadar:
- **Rotasi Regional Mode Ujian** — 8 paket rotasi (`paketUjian.ts`) diberi
  bobot kasus & flavor teks per 3-zona epidemiologi (Zona 1 urban/industri:
  PTM-DM-dengue dominan; Zona 2 transisi/pertanian: hipertensi+zoonosis/
  malaria-hutan; Zona 3 timur/kepulauan: stunting/AKI-AKB/malaria/kusta) —
  penambahan data ke Director yang sudah ada, bukan mesin baru.
- **KLB via surat masuk** — pola inbox/kalender-musim yang sudah ada bisa
  memicu Program Wilayah baru bertema KLB nyata (PIN Polio pasca-cVDPV2,
  PSN 3M Plus pasca-lonjakan DBD 3x lipat).
- **Funnel ANC bocor sbg konten kunjungan bumil risti** — arc 3-babak bumil
  risti yang sudah ada dapat cabang baru: bumil "gugur" antar K1(86,7%)→
  K4(68,1%)→K6 USG(17,6%), mengajarkan continuity-of-care.
- **MPASI/stunting sbg pengayaan Posyandu/kader** — mekanik kader/posyandu
  yang sudah ada ditambah konten "kualitas MPASI lokal" jendela kritis
  6-23 bulan (stunting NTT 37,9% vs Bali 7,2%).
- **Kandidat kasus baru M13** (butuh riset PPK/SKDI spt kasus lain):
  filariasis (kaki gajah), rabies (kasus IGD gawat — protokol VAR/SAR),
  HFMD/Flu Singapura (kategori KIA/anak).
- **Mpox — FLAGGED, bukan diputuskan sepihak**: data nyata & dramatis
  (96,6% laki-laki, 67,2% terkait aktivitas seksual 21 hari pra-lesi) tapi
  konten kesehatan-seksual sensitif dgn populasi berisiko spesifik — perlu
  keputusan sadar dr. Wirayuda soal nada/kehati-hatian penulisan SEBELUM
  dikerjakan, bukan diasumsikan aman untuk diproses seperti kasus biasa.

Dossier lengkap utk DeepThink: `docs/DEEPTHINK_M13_SKALA_PENUH.md`.

### M14 — Integritas Backend & Aksesibilitas (diformalkan 2026-07-11, BELUM DIJADWALKAN)

Lahir dari pengamatan user: audit CODEX bug-hunt terbaru (read-only, HEAD
`baee64a`) menyorot klaster masalah yang SAMA persis berulang — save/
autosave, penilaian pasca-tamat, telemetri, verifier — dan user minta
milestone tersendiri agar tak terus "kesandung" pola yang sama. 25 temuan
CODEX (10 P1, 15 P2) diverifikasi PENUH via workflow 8-agen (baca kode
sungguhan + jalankan test/probe, bukan percaya laporan mentah) — hasil:
**22/25 confirmed, 2/25 detail meleset (gap nyata tapi angka/framing laporan
tak akurat), 1/25 butuh keputusan manusia (bukan bug).** Tingkat konfirmasi
ini jauh lebih tinggi dari ronde CODEX sebelumnya di proyek ini — bukan
alasan utk lengah, justru sinyal bahwa klaster ini genuinely rapuh.

**P1 — integritas skor/save/verifier (SEMUA 10 CONFIRMED, prioritas
tertinggi, tumpang tindih mandat M10.5):**
1. Skor pasca-tamat belum benar-benar terkunci — hanya aksi LANJUTKAN yang
   dicegah; `PESAN_OBAT` (memengaruhi kapitasi→skor Manajemen) dan aksi
   lain tetap bisa dijalankan setelah tamat. Verifier ikut memvonis SAH
   krn replay deterministik mereproduksi manipulasi itu apa adanya.
2. Tak ada `requestSingleInstanceLock()` — dua instance app (mis. di lab
   komputer kelas) bisa rebutan menulis file save yang sama.
3. `save:read` tak menunggu tulisan yang sedang berjalan utk slot yang
   sama — race baca-saat-tulis bisa memulihkan snapshot basi.
4. **Regresi**: "Muat Slot" menimpa autosave TANPA `window.confirm()` —
   jalur ke-4 yang terlewat dari 3 jalur yang sudah dibentengi CODEX §57.
5. Load/impor tak punya request-ownership — klik dua slot berurutan,
   promise yang selesai belakangan menang (bukan niat klik terakhir).
6. Autosave korup/tak-kompatibel terlihat seperti "tidak ada save" —
   `deserialize()` yang return null tak pernah menandai status gagal.
7. Validasi recovery save masih meloloskan 5 kondisi hard-lock/corrupt
   konkret (dibuktikan via skrip probe, bukan dugaan) — IGD fase asing,
   IGD-vs-layar kontradiktif, Kegiatan pilihan/jawaban kosong, entri
   inbox/antrian `null` (yang terakhir menjatuhkan SELURUH UI, bukan cuma
   satu layar, krn di luar ErrorBoundary per-layar).
8. Meta korup tertentu (`dexKuasai: null`) memicu boot-loop tanpa jalan
   pulih — crash berulang di boot/reset/reload krn `ErrorBoundary` tak
   pernah menyentuh field `meta`.
9. **Verifier bisa dibekukan** — tiap `advance()` menyalin ulang SELURUH
   log/jejak (O(n²)); pembatas dossier cuma byte-size (8MB), tak ada batas
   jumlah entri — dossier kecil ber-ratusan-ribu aksi trivial (kunci HMAC
   tertanam client-side, jadi bisa ditandatangani sendiri secara "sah")
   bisa membekukan proses verifikasi dosen.
10. Verifikasi dua dossier berurutan bisa menampilkan vonis file yang
    SALAH — tak ada token request/busy-state/nama-file di hasil.

**P2 — save reliability, a11y, UX (15 item, confirmed kecuali dicatat):**
11. Hasil Kegiatan tak persisten (autosave simpan `layar:'kegiatan'` tapi
    `kegiatan` sudah undefined) — kehilangan kartu hasil, BUKAN kehilangan
    skor (skor sudah terterapkan duluan).
12. Recovery proses belum tahan crash beruntun; `before-quit` tanpa
    timeout bisa membuat app tak pernah keluar bila file-write hang.
13. "Tampilkan panduan lagi" tak benar-benar berfungsi lintas-sesi (cuma
    hapus localStorage, tak reset state React) — test yang ada berbagi
    blind spot yang sama (tak menguji render App/restart).
14. Fokus modal masih bermasalah di 3 titik (Onboarding ditimpa `<main>`,
    tombol Tutup PanelHasil jadi focus-pertama+`preventScroll` shg tak
    kelihatan, transisi fase Kunjungan/Kegiatan/IGD tak refocus).
15. Radiogroup Kunjungan & Program cuma pakai "kulit" ARIA dari
    `useRadioGroup` (buang tabIndex/data-radio/onKeyDown) — panah
    keyboard tak berfungsi.
16. 8 tombol RW peta hilang dari accessibility tree krn berada di dalam
    `svg role="img"` (aturan WAI-ARIA presentational-children) — celah
    struktural yang tak terdeteksi test jsdom (butuh browser/axe-core
    sungguhan utk verifikasi lanjutan).
17. Reflow 200% memotong HUD (dua sisi `min-width:300px` tanpa jaring
    scroll horizontal).
18. 3 pasangan warna gagal kontras 3:1 (tombol retry ErrorBoundary mode
    malam ~2.03:1, focus border klinik ~2.83:1, badge/chip animasi ~2:1).
19. *(detail meleset)* `aria-disabled` KartuKeluarga SUDAH diperbaiki
    CODEX §57 (fokus/screen-reader sudah benar) — gap yang TERSISA murni
    visual: tak ada CSS `[aria-disabled]`, jadi tombol nonaktif tetap
    tampak 100% aktif.
20. 3 feedback salah konteks (Rapor "belum ada data" tapi tetap tampilkan
    ~30/100; Dex search bisa pertahankan detail entri yang sudah tersaring
    keluar; IGD pasca-RJP-sukses masih tampilkan TEPAT/KELIRU milik
    langkah sebelum Kode Biru).
21. *(detail meleset, BUKAN temuan baru)* Kunjungan `respons`/
    `responsBohong` tanpa kutip — ini re-deskripsi gap yang SUDAH
    diketahui & sengaja dideferred di CODEX §57. Angka yang dikutip
    laporan (105/48/13) diam-diam mengecualikan `responsBohong` dari basis
    270 — angka gabungan yang benar 129/50/15 (matching audit §57
    sebelumnya), bukan 105/48/13.
22. Toaster: semua toast `aria-live="assertive"` tanpa diferensiasi
    urgensi; batch Kode Hitam memancarkan 2 live-region sekaligus yang
    berpotensi saling menyela; tak ada pause/dismiss/riwayat.
23. ✅ *(RESOLVED 2026-07-11)* `panduanResmi`/`mutiaraEbm`/`catatanRealita`
    M11.5 dulu cuma bisa dibaca sekali per-encounter — Dr. Wirayuda
    memutuskan **persist ke Buku Saku per-kasus**; kini ketiganya render
    permanen di panel detail `DexSkdi.tsx` (dibaca langsung dari PACK,
    display-only, tak sentuh skor/sidik-jari).
24. Impor file tanpa batas ukuran; properti asing pada save ikut
    tersimpan tanpa disaring; satu input (Impor Arsip JSON, bukan
    seluruhnya) tak mereset value saat impor gagal.
25. Telemetri bisa false-positive save-scumming — tak ada sessionId/NIM/
    seed pembeda, satu file global lintas semua slot/sesi/pemain di satu
    instalasi OS.

**Sequencing — ✅ DIPUTUSKAN & DIEKSEKUSI 2026-07-11** ("yes P1 dilebur
masuk M10.5... selesaikan sekarang", lalu "P1 dan P2 juga selesaikan aja
sekarang"): semua 10 item P1 + 14/15 item P2 di atas sudah diimplementasikan
langsung (tak menunggu M14 terpisah) — `REVISI_ENGINE` 18→19, 647 test
hijau, tsc bersih, build OK. Hanya 2 item P2 TETAP deferred (bukan lagi
"belum diputuskan", tapi sengaja ditunda): #20c (banner IGD pasca-ROSC,
butuh REVISI-touching `nilaiIgd`, dinilai tak sepadan) & #21 (kutip dialog
Kunjungan, defer lama dari §57).

**Status kelimanya (M10 lanjutan, M11, M12, M13, M14): murni pencatatan
scope — tunggu greenlight eksplisit user per-milestone sebelum mulai kerja.**
