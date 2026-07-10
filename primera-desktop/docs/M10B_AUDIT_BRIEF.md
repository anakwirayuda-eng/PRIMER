# M10.b — Audit Brief untuk CODEX: verifikasi independen bridge UKP↔UKM & identitas NPC/warga

**Status:** brief kerja, ditulis SETELAH M10.b dikerjakan solo (pola BEDA dari M10_AUDIT_BRIEF.md/R2 yang ditulis SEBELUM audit — di sini CODEX diminta mengaudit ADVERSARIAL pekerjaan yang sudah diklaim selesai, bukan menjelajah area kosong). **Ditulis:** 2026-07-06. **Untuk:** ronde audit CODEX read-only, laporkan kembali ke Claude untuk ditriase.

**Preseden penting kenapa brief jenis ini ada**: ronde CODEX sebelumnya (M10.a ronde-4, dossier §44) mengaudit ULANG pekerjaan M10.a yang sudah "selesai" 2 ronde sebelumnya (§39/§41) — dan menemukan celah nyata (kebocoran fokus keyboard) yang lolos dari sapuan sendiri karena sapuan itu hanya menguji pointer/mouse. Pola itu terbukti bernilai. Brief ini meminta hal yang sama untuk M10.b: audit ADVERSARIAL atas klaim "5 temuan diperbaiki, sisanya bersih" — jangan percaya ringkasan di bawah, verifikasi thd kode aktual, dan CARI SUDUT yang belum diuji.

---

## 1. Ringkasan pekerjaan M10.b (detail penuh: `CODEX_AUDIT_DOSSIER.md` §43)

Dimensi 2+3 M10 (jembatan UKP↔UKM + konsistensi identitas NPC/warga). Metode yang dipakai: telusuri semua jalur "pasien yang sama muncul lagi" di `src/engine/reducer.ts` (8 situs `jenis:'pasien_kembali'` + 1 situs `jenis:'karma_igd'` = 9 total), plus kader/prolanis/PRB.

**5 temuan, semua diklaim diperbaiki:**
1. Pasien kembali (konsekuensi/PRB/karma/prolanis/terlantar) dulu di-roll ulang `bpjs`+`persona` — kini `JadwalItem` membawa keduanya di semua 9 situs, diteruskan ke `buatPasienDariKasus` via `override`.
2. `buatPasienDariKasus` (`src/engine/director.ts`) menghitung persona dari usia ROLL demografi yang lalu dibuang saat override usia diterapkan — kini `pilihPersona(override?.usia ?? usia, rng)`.
3. 4 situs SISRUTE (boomerang/tolak-spesialis/tolak-bed/PRB) dulu membuang `keluargaId` saat menjadwalkan pasien kembali — kini dibawa. Roster Prolanis (`PesertaProlanis`, `src/engine/state.ts`) dapat field baru opsional `keluargaId`.
4. bpjs pasien karma dulu diroll independen (70%) — kini dari `kel.indikator.jkn.statusSebenarnya` keluarga SAAT karma menyala. bpjs komplikasi Prolanis kini selalu `true` (Prolanis = program BPJS).
5. Pool `NAMA_WARGA.pria/wanita` (`src/content/nama.ts`) tumpang tindih 17 nama dengan anggota keluarga binaan (termasuk identitas karma "Lastri"/"Painem") — 17 nama diganti + guard permanen (`pack.test.ts`) yang menolak pool ∩ nama-anggota.

**Diklaim bersih (diaudit, tanpa perubahan)**: mekanik bias/ketelitian kader, agregasi IKS harian dari state terkini, pengali KBK live saat tutup-bulan (0.8/1.0/1.3), `AnggotaKeluarga.kondisi[]` dikonfirmasi HIDUP (dibaca `bentukRosterProlanis`), PRB hanya terjadwal pada rujukan DITERIMA, `rmLengkap` klinik-only by design, kredit Dex pada encounter kedua, karma tidak dobel-hitung (parameter `kecuali` di `susunAntrianHarian`), `karma_igd` adalah misnomer historis (pasiennya masuk antrian KLINIK, bukan IGD — nama jenis jadwal menyesatkan tapi perilakunya benar).

REVISI_ENGINE dinaikkan 13→14 (bpjs mempengaruhi kapitasi→skor Manajemen; konsumsi RNG `pilihPersona` bergeser). 439 test total saat ini (naik lagi dari 428 sejak M10.b krn 2 fix UI/UX terpisah — lihat §44/§45, TIDAK terkait M10.b), typecheck bersih.

---

## 2. Yang secara EKSPLISIT diminta CODEX periksa (dugaan/celah yang BELUM diverifikasi tuntas)

Ini bukan daftar "sudah pasti bug" — ini sudut yang Claude SADAR belum diuji habis, ditulis jujur alih-alih disembunyikan:

### 2.1 — Kelengkapan sapuan 9-situs itu sendiri

Apakah benar HANYA 9 situs (`grep -n "jenis: 'pasien_kembali'" src/engine/reducer.ts` = 8 baris + 1 `karma_igd`) yang menjadwalkan pasien-bernama-kembali? Periksa ULANG dgn mata segar — apakah ada jalur lain (mis. lewat `kegiatan.ts`, `kunjungan.ts`, atau efek samping fungsi lain di reducer.ts) yang membuat `PasienAktif` dari identitas SUNGGUHAN (bukan random director) tapi TIDAK lewat `JadwalItem`? Kalau ada, field `bpjs`/`persona` yang baru ditambahkan takkan sampai ke sana.

### 2.2 — Apakah field baru `bpjs`/`persona` di `JadwalItem` benar2 SAMPAI ke encounter yang dimainkan pemain?

Verifikasi rantai penuh: `JadwalItem.bpjs/persona` → `PasienJatuhTempo` (interface lokal reducer.ts) → `antrianKembali.map(buatPasienDariKasus(..., override))` → `PasienAktif.bpjs/persona`. Ada BEBERAPA titik `...(p.bpjs !== undefined ? {bpjs:p.bpjs} : {})` spread kondisional — cek apakah salah satu situs (dari 9) TERLEWAT menuliskan field ini ke objek yang di-push (bukan cuma ke `JadwalItem`, tapi juga ke local `pasienKembali.push({...})` sebelum jadi `PasienJatuhTempo`).

### 2.3 — Konsistensi `keluargaId` lintas SEMUA 9 situs, bukan cuma 4 yang disebut diperbaiki

Dossier bilang "4 situs SISRUTE dulu membuang keluargaId, kini dibawa" — tapi apakah SEMUA 9 situs (termasuk yang sudah benar sejak awal: konsekuensi, observasi-lab, terlantar, karma) benar2 konsisten membawa `keluargaId` HANYA bila `encFinal.pasien.keluargaId`/sumber setara ada (tak pernah menyisipkan `keluargaId` palsu/kosong-string)? Periksa tiap situs satu-satu.

### 2.4 — `AnggotaKeluarga.kondisi[]` "hidup" — tapi apakah string-matching-nya rapuh?

`bentukRosterProlanis` (reducer.ts) mendeteksi hipertensi/DM via `kondisi.some(k => k.includes('hipertensi'))` dan `k.includes('dm') || k.includes('diabetes')` — string matching longgar. Periksa SEMUA nilai `kondisi` yang benar2 ditulis di `src/content/keluarga/desa*.ts` (grep `kondisi:`) — apakah ada anggota ber-kondisi kronis LAIN (mis. "jantung", "stroke", "asma") yang string-nya TAK cocok pola ini dan karenanya TAK PERNAH masuk roster Prolanis walau seharusnya (celah cakupan konten, bukan bug logika)? Sebaliknya, apakah ada string yang SALAH KETIK cocok pola (mis. "riwayat dm demam" — false positive)?

### 2.5 — `persona` override RNG-shift: apakah verifier M6 benar2 tak terpengaruh utk dossier LAMA?

Dossier bilang REVISI_ENGINE naik krn "konsumsi RNG pilihPersona bergeser utk pasien inject." Periksa: apakah ada test/skenario yang MEMBUKTIKAN dossier lama (REVISI 13) sungguh jatuh ke "tidak dapat diverifikasi" (bukan cuma diasumsikan)? Kalau belum ada test eksplisit utk transisi rev 13→14 spesifik (beda dari rev-bump lain yg py test serupa), itu celah verifikasi-bergigi yang longgar.

### 2.6 — Nama anggota keluarga vs SESAMA anggota keluarga (bukan cuma vs pool NAMA_WARGA)

Guard baru (`pack.test.ts`) hanya cek pool `NAMA_WARGA.pria/wanita` vs nama anggota. TIDAK dicek: apakah ada 2 KELUARGA BINAAN BERBEDA yang kebetulan py anggota bernama SAMA PERSIS (mis. dua "Bu Painem" di keluarga berbeda) — ini bukan tabrakan dgn pasien-acak, tapi tabrakan antar-2-NPC-bernama-tetap yang keduanya bisa aktif di UKM bersamaan, berpotensi sama membingungkan. Periksa apakah ini genuinely terjadi di 16 keluarga × ~9-10 anggota, dan apakah itu masalah nyata atau dianggap wajar (nama umum di desa nyata memang berulang).

---

## 3. DO-NOT-RE-REPORT (baca dulu sebelum lapor apa pun)

Semua item DO-NOT-RE-REPORT di `M10_AUDIT_BRIEF.md` (§6) dan `M10_AUDIT_BRIEF_R2.md` (§4) MASIH berlaku — termasuk 3 mismatch demografi karma lama (Nayla/Dimas/Mbah Lastri), 12 kasus `edukasiKritis`, celah karma-posisi kunjungan[i>0], toast Toaster, hotspot/dok mute-gigi. **Tambahan spesifik M10.b (§43) — JANGAN dilaporkan ulang sbg temuan baru:**

- 5 temuan F1-F5 di atas (§1) — SUDAH diperbaiki. Kalau CODEX menemukan bug yang SAMA PERSIS (mis. "pasien kembali tak bawa bpjs"), itu berarti perbaikan tak lengkap di situs TERTENTU — laporkan situs SPESIFIK mana yang masih bocor (jawaban §2.2/§2.3 di atas), bukan klaim generik "celah ini masih ada."
- Karma demografi (usia/JK vs kasus target) — SUDAH dijaga test invarian (`pack.test.ts`, `kunjungan[0]?.karma`). Kalau menemukan mismatch BARU di luar 2 yang sudah diketahui (Nayla/Dimas), itu temuan baru yang sah — laporkan.
- `keluargaId` pada `PasienAktif` klinik TAK dibaca UI/skor mana pun saat ini — SUDAH diketahui & didokumentasikan sbg fondasi masa depan, BUKAN bug (konfirmasi: `grep -rn "\.keluargaId" src/renderer/src` menunjukkan HANYA Kunjungan/MejaKerja/PetaDesa membaca `keluargaId` MEREKA SENDIRI, bukan `PasienAktif.keluargaId` klinik). Jangan laporkan ini sbg "field mati" — itu keputusan desain terdokumentasi, kecuali CODEX menemukan bukti field ini SEHARUSNYA dipakai di suatu tempat yang terlewat.
- `--z-toast`/fokus modal/kartu Onboarding — semua sudah ditutup §38/39/42/44, di luar cakupan M10.b (dimensi 4, bukan 2/3).

---

## 4. Yang CODEX TAK BISA verifikasi sendiri (read-only, tak menjalankan game)

Untuk hal berikut, laporkan sbg HIPOTESIS/PERTANYAAN ber-file:baris, Claude akan verifikasi via harness browser (`puskesmas-pagi-preview`) yang mendorong store Zustand asli:

- Apakah `bpjs`/`persona` yang di-inject BENAR-BENAR tampil di UI (Lembar Periksa/RuangTunggu) saat pasien kembali sungguhan dimainkan — butuh replay runtime, bukan cuma baca kode.
- Distribusi nyata "berapa sering keluargaId yg sama muncul 2x aktif bersamaan" (§2.6) — butuh simulasi multi-hari.

Untuk semua yang bisa dibaca murni dari sumber (kelengkapan situs, konsistensi field-passing, string-matching kondisi[], REVISI_ENGINE test coverage), laporkan normal sbg temuan ber-severity (P1 integritas skor/data, P2 konten/UX salah tak-eksploitatif, P3 kosmetik/dok).

---

## 5. Format laporan — sama persis brief-brief sebelumnya

File:baris + kutipan + klaim 1-kalimat + bukti/skenario konkret + severity + cek-dulu thd §3 di atas. Read-only — jangan edit apa pun. Laporkan ke Claude untuk triase (verifikasi thd kode aktual → test-first fix bila valid → verifikasi-bergigi → dossier update).
