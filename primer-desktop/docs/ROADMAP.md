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

## M1 — "Bridge Penuh UKM↔UKP" (port algoritma repo lama)

Slice sudah punya bridge *scripted* (karma keluarga → pasien bernama; binaan sukses →
bonusTrust). Yang BELUM diport dari engine lama (`src/game/` repo web) — urutan port:

1. **UKP-Bridge probabilistik** (`TheDirector.processUKPBridge` lama): kegagalan
   kunjungan `partial` → konsekuensi klinis ber-window 3–14 hari dengan probabilitas
   `failProbability × (0.5 + 0.5×progress)` — bukan hanya karma scripted per-arc.
   → generalisasi `JadwalItem karma_igd` menjadi konsekuensi bertingkat (critical/moderate).
2. **Surveilans balik UKP→UKM**: riwayat ICD klinik 14 hari (DBD/diare/pneumonia/TB)
   mewarnai peta RW sebagai sinyal cluster (port pola `WilayahPage` surveillance layer,
   versi ringan: chip cluster di petak RW + surat kader).
3. **Drift keluarga rawan** (versi DIBALIK dari bug lama): keluarga berisiko yang
   diabaikan >N hari memburuk (indikator target flip 'tidak' / TTM mundur), maks 2
   kejadian/minggu, SELALU diberitakan lewat inbox. (State & aturan sudah dirancang
   di GDD §6; belum diimplementasikan.)
4. **Follow-up berkalender**: `JadwalItem follow_up_kunjungan` + `KeluargaState.followUpHari`
   (sudah ada di kontrak state, masih yatim): indikator target flip HANYA setelah
   kunjungan follow-up terverifikasi; mangkir follow-up = TTM mundur.
5. **KBK riil**: IKS desa → multiplier kapitasi bulanan (formula lama:
   IKS>0.8 ×1.3 / ≥0.5 ×1.0 / <0.5 ×0.8) — menutup loop UKM→ekonomi.
6. **SDOH armor** (dari `BehaviorCaseEngine`): keluarga miskin/berpendidikan rendah
   lebih resisten kecuali diagnosis hambatan tepat — modifier di `selesaikanKunjungan`.

## M2 — Program UKM Terjadwal (kalender bulanan)

7. **Posyandu** (unlock D15): sesi bulanan per RW — mini-game 5 meja versi desktop:
   timbang→plot KMS (port `GrowthChartEngine` z-score WHO), imunisasi + cold chain
   (port `ImmunizationEngine` 14 vaksin), delegasi kader (error 20%).
8. **Prolanis** (unlock D30): roster DM/HT kronis, kunjungan bulanan, parameter drift
   (port `ProlanisEngine`: HbA1c/GDS/TD + event kepatuhan), mangkir dipengaruhi jarak RW.
9. **Respons KLB** (unlock D45): trigger cluster dari surveilans M1.2 (DBD 2+ kasus,
   diare 3+, ISPA 5+ — angka lama), investigasi 5W1H ringkas + aksi PSN/fogging/sanitasi
   ber-biaya slot & dana, memengaruhi spawn kasus klinik.
10. **Program agregat 184 KK**: instruksi mingguan (kampanye PSN, mobile screening,
    penyuluhan) resolve agregat → IKS statistik RW; laporan naratif Jumat.
    (Jawaban untuk kritik "manajemen populasi tipis".)
11. **Lokakarya Mini bulanan** (D30/D60): rapor formatif + *ghost* rival dr. Ratih
    (data statis, tanpa multiplayer).

## M3 — Konten Skala Penuh (90 hari tidak boleh kering)

12. **Kasus klinis 16 → 60+** (target akhir: 144 ter-cover Dex): port bertahap dari
    ±255 kasus repo lama ke skema `KasusKlinis` baru (prioritas: 144 FKTP wajib;
    minimal 40 kasus untuk 90 hari tanpa repetisi terasa).
13. **IGD penuh**: triase + deteriorasi per-langkah + aksi stabilisasi ber-vitalEffect
    (port ringan `EmergencyRegistry` ~70 aksi) — sebagai *interrupt event* dramatis,
    bukan layar permanen. Kode Biru→RJP→Kode Hitam.
14. **Keluarga binaan 6 → 16** + arc 3-babak untuk sebagian (format Bu Wulan),
    roster maks naik 8 → 16.
15. **KIA**: ANC K1–K4 + skoring risiko bumil (port `PregnancyEngine`) — masuk sebagai
    jalur kasus poli + skenario kunjungan bumil risiko tinggi.
16. **Kasus gigi dasar** (port `DentalDiagnosisEngine` FDI/DMFT) — opsional pasca-16.
17. **Musim penuh**: event kalender (17 Agustus, musim panen → HT bolos kontrol,
    pancaroba → ISPA) + hari kesehatan nasional sebagai surat/event.

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
- 2 temuan review belum terverifikasi: grinding trust kunjungan ulang; jalur
  rujuk-tanpa-diagnosis (lihat `CODEX_AUDIT_DOSSIER.md` §4.4–4.5).
- Jawaban anamnesis statis vs status pasien dinamis (alergi kini dipaksa 100% untuk
  kasus trap; solusi jangka panjang: varian jawaban ber-state di skema konten).
- Bundle renderer 1.1 MB (belum code-split; belum masalah untuk desktop).
- `arcSelesai` global per keluarga (bukan per-skenario) — cukup untuk arc 2 kunjungan;
  revisit saat arc 3+ babak (M3.14).
