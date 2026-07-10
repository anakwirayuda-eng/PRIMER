# M10 — Brief Audit TOTAL untuk CODEX: seluruh 4 dimensi, status akhir + 13 open item

**Status dokumen:** brief konsolidasi, ditulis SETELAH M10.a+M10.b+M10.c diklaim tuntas DAN
setelah satu ronde CODEX independen (2 subagent) baru saja menemukan 13 temuan baru yang
membuktikan "tuntas" itu prematur. Brief ini menggantikan kebutuhan membaca `M10_AUDIT_BRIEF.md`
+ `M10_AUDIT_BRIEF_R2.md` + `M10B_AUDIT_BRIEF.md` satu-satu — semuanya dikonsolidasi di sini,
plus konteks TERBARU yang tiga dokumen itu tidak punya.

**Ditulis:** 2026-07-09. **Untuk:** ronde audit CODEX read-only berikutnya, laporkan kembali
untuk ditriase satu-satu (pola yang sama persis dipakai sepanjang sesi ini — verifikasi kode
aktual dulu, baru fix, baru dossier).

**Konteks lengkap:** `docs/CODEX_AUDIT_DOSSIER.md` §1-48 (§36-48 adalah seluruh riwayat M10).

---

## 0. Kenapa brief ini ada (baca ini dulu — penting utk kalibrasi ekspektasi)

M10 didefinisikan user (2026-07-05) sebagai audit sistematis menyeluruh atas 4 dimensi:
1. Konsistensi pipeline penyakit (pemeriksaan→diagnosis→tatalaksana→edukasi, 67 kasus).
2. Integritas jembatan UKP↔UKM.
3. Konsistensi status/keberadaan NPC (warga lokal).
4. Layering UI/UX (fokus/z-index/overflow).

Ketiganya (dimensi 1/2+3/4) DIKERJAKAN dan DIKLAIM tuntas — lihat §1 di bawah untuk rekap
lengkap. Tapi pola yang SUDAH terbukti berulang di proyek ini (M9 lahir justru krn pola ini):
**setiap kali "tuntas" diklaim, ronde audit independen BERIKUTNYA menemukan celah nyata di
domain yang sama** — bukan krn pekerjaan sebelumnya serampangan, tapi krn setiap sapuan
punya SUDUT PANDANG tertentu yang tak bisa melihat sudut lain sekaligus. Contoh konkret
dari M10 sendiri: sapuan M10.b (§43) menelusuri "9 situs yang menjadwalkan pasien bernama
kembali" (`jenis:'pasien_kembali'` + `karma_igd`) dan memperbaiki field-passing di SEMUA 9
situs itu — tapi ronde CODEX terbaru (§48) menemukan DUA jalur LAIN yang membuat/memakai
pasien bernama TANPA lewat jalur 9-situs itu (bridge positif Director, materialisasi
Prolanis) — jalur itu bukan "situs ke-10" yang terlewat dihitung, tapi kategori BERBEDA
yang sapuan awal tak dirancang untuk melihatnya sama sekali.

**Maka brief ini secara eksplisit MEMINTA CODEX mencari kelas bug yang sama dari 13 temuan
di §2, bukan cuma memvalidasi/menolak 13 itu sendiri** — karena preseden proyek ini
menunjukkan pola berulang lebih bernilai ditemukan daripada instance tunggal.

---

## 1. Rekap lengkap: apa yang SUDAH dikerjakan di M10 (semua diklaim tuntas per commit)

### Dimensi 1 — Pipeline 67 kasus (M10.c, dossier §47, commit `080b465`)
Sapuan hibrida: 3 agent baca 7 file kasus utk 5 sumbu klinis-tekstual (edukasi-vs-clue,
flag `relevan`, kandidat `edukasiKritis`, vital-vs-demografi, konsistensi lintas-persona) +
sapuan deterministik Claude (ICD tabrakan, integritas alergiTrap, rentang konsekuensi,
katalog near-duplicate). Hasil: 1 obat yatim dihapus (`garam_oralit_zinc`), 3 guard
`validasiPack` baru (integritas alergiTrap), 10 kasus dapat topik edukasi tepat (ganti
topik off-target/kontradiktif — pola CHF: `jaga_kelembapan_kulit`→`jaga_area_kering` di
tinea/kandidiasis, `psn_3m`→`cegah_malaria_kelambu` di malaria, dll — 6 topik katalog baru),
2 `edukasiKritis` baru (asma→teknik_inhaler, rinosinusitis→tanda_bahaya), 1 fix persona
(insomnia lansia). REVISI_ENGINE 14→15.

### Dimensi 2+3 — Bridge UKP↔UKM + identitas NPC (M10.b, dossier §43, lalu diaudit ulang
CODEX via `M10B_AUDIT_BRIEF.md`, tanpa temuan baru saat itu)
Menelusuri SEMUA `jenis:'pasien_kembali'` (8 situs) + `karma_igd` (1 situs) di reducer.ts.
5 temuan diperbaiki: (1) bpjs/persona pasien kembali dulu di-roll ulang, kini dibawa dari
jadwal; (2) `buatPasienDariKasus` (director.ts) kini hitung persona dari usia EFEKTIF
(override, bukan roll yg dibuang); (3) 4 situs SISRUTE dulu buang `keluargaId`, kini dibawa;
(4) bpjs pasien karma dari indikator JKN keluarga SAAT karma menyala (bukan roll 70%), bpjs
komplikasi Prolanis selalu `true`; (5) 17 nama pool `NAMA_WARGA` tumpang-tindih nama anggota
keluarga binaan, diganti + guard permanen. REVISI_ENGINE 13→14.

**PENTING**: §48 (di bawah) membuktikan sapuan ini TIDAK menjangkau 2 jalur pasien-bernama
LAIN yang tak lewat 9-situs itu (bridge positif Director; materialisasi Prolanis/karma
langsung) — lihat §2.3/§2.6 di bawah.

### Dimensi 4 — Layering UI/UX (M10.a, dossier §38-46, 4+ ronde termasuk 2 ronde CODEX)
Ronde paling banyak diaudit-ulang di M10: inventaris SEMUA `position:fixed/absolute`+z-index,
lalu ronde CODEX ke-4 menemukan celah KATEGORI BERBEDA (keyboard focus-trap, bukan
pointer/z-index) yang 2 ronde sebelumnya (murni empiris mouse) tak bisa melihat. Fixed:
kartu temuan menelan hotspot, mute/gigi didok ke HUD, `--z-toast`, keyboard focus-trap 7
modal (Onboarding/Pengaturan/Tentang/Rekap/Lokmin/PanelHasil/dst), Peta Desa dark-mode
contrast bug (ditemukan via screenshot live user, bukan audit), onboarding kartu
tanpa-batas-tinggi. Ronde CODEX ke-5 (paste ulang temuan ke-4 yg SUDAH fixed) correctly
diidentifikasi STALE (dossier §46) — snapshot audit mendahului commit fix.

**PENTING**: §48 (di bawah) membuktikan MASIH ada celah kategori BERBEDA LAGI di dimensi
ini — Peta Desa RW selection tak pernah `focusable` sama sekali (beda dari fokus-trap
MODAL yang sudah 7x diaudit), plus 3 celah ARIA/scroll kecil lain.

### Status test/build saat ini
456 test, 41 file, semua hijau. `npm run typecheck` bersih. REVISI_ENGINE = 15.

---

## 2. 13 temuan CODEX ronde-baru (dossier §48) — status: CONFIRMED, BELUM DIPERBAIKI

Semua sudah diverifikasi Claude satu-satu thd kode aktual (bukan cuma dipercaya). **JANGAN
laporkan ulang 13 ini sbg temuan baru** — laporkan instance BARU dari kelas bug yang sama
(lihat kolom "cari kelas serupa" di tiap bagian), atau bantu verifikasi #9 (satu-satunya yang
masih murni hipotesis, butuh browser live).

### P1 (4) — integritas data/skor
1. **Fingerprint keluarga** (verifikasi.ts:253-255) tak hash `anggota[]`/`rw` — ganti nama/
   usia/kondisi anggota atau RW keluarga tak mengubah sidik jari dossier, padahal keduanya
   dibaca langsung oleh `bentukRosterProlanis` & surveilans. → **Cari kelas serupa**: field
   content LAIN yang dibaca runtime tapi tak ikut hash sidik jari — periksa tiap `pack.*`
   yang dibaca reducer.ts/director.ts/kader.ts, bandingkan dgn daftar yg SUDAH di-hash
   (verifikasi.ts:180-274).
2. **Save tak simpan provenance REVISI_ENGINE** (save.ts:11) — save yang straddle dua
   revisi (mulai rev-N, lanjut app-update ke rev-N+1, lalu ekspor) diberi fingerprint rev
   TERBARU meski sebagian jejak terekam di rev LAMA. → **Cari kelas serupa**: apakah ada
   state LAIN yang provenance-nya juga hilang di titik straddle serupa (mis. `seedKurikulum`
   vs perubahan kurikulum antar-versi)?
3. **Bridge positif fabrikasi "anggota keluarga"** (director.ts:270-284) — pasien acak
   ditempeli `{keluargaId, bonusTrust:true}` TANPA identitas (nama/usia/RW/bpjs) benar2
   dari `kel.anggota`; RW ACAK-nya masuk surveilans. → **Cari kelas serupa**: jalur LAIN yang
   menempelkan `keluargaId`/identitas parsial ke entitas yg dibuat independen (grep
   `keluargaId:` di seluruh `src/engine`, bandingkan tiap situs — mana yg identitas
   PENUH vs cuma DITEMPEL).
4. **Bu Marni auto-Prolanis walau JKN nonaktif** (`bentukRosterProlanis`, reducer.ts:1795)
   murni baca `kondisi` ht/dm dari `pack.keluarga` statis, nol pembacaan `indikatorAwal.jkn`
   atau status arc. → **Cari kelas serupa**: keluarga/anggota LAIN dgn kondisi kronis +
   `jkn:'tidak'` (grep `jkn: 'tidak'` di `desa*.ts` lalu silang dgn `kondisi:` anggota yg
   sama) — Bu Marni mungkin bukan satu-satunya kasus kontradiktif ini.

### P2 (5, satu masih hipotesis)
5. **No. RM berubah tiap pasien kembali** (director.ts:71, `JadwalItem.pasienId` ada tapi
   tak pernah diteruskan lewat `PasienJatuhTempo`, reducer.ts:1293-1344).
6. **Persona NPC tak stabil di karma/Prolanis** (reducer.ts:1085-1099, 1359-1368) — beda
   dari 8 situs `pasien_kembali` lain yg M10.b sudah perbaiki. → **Cari kelas serupa**:
   apakah ADA jalur push-pasien LAIN (di luar 8 situs `pasien_kembali` + karma + Prolanis
   yg sudah disebut) yang juga lupa menyertakan `persona`/`bpjs`/`keluargaId`?
7. **Pak Musa (DM+HT) direduksi jadi HT saja** (`bentukRosterProlanis`, reducer.ts:1800-1803,
   urutan cek `ht ? 'ht' : 'dm'`). → **Cari kelas serupa**: keluarga/anggota LAIN dgn 2+
   kondisi kronis sekaligus (grep `kondisi: \[.*,.*\]` di `desa*.ts`) yang mekanik Prolanis
   (single-jenis) juga mereduksi jadi satu kondisi saja.
8. **Peta Desa RW selection mouse-only** (PetaSvg.tsx:81-85, `<g onClick>` tanpa
   tabIndex/role/keydown). → **Cari kelas serupa**: kontrol UTAMA layar LAIN (bukan modal,
   yg fokus-trap-nya sudah 7x diaudit) yang mungkin py celah keyboard serupa — Kegiatan.tsx,
   DexSkdi.tsx, Rapor.tsx belum pernah diaudit dari lensa keyboard-only.
9. **[BELUM DIVERIFIKASI LIVE]** `.focus()` tanpa `preventScroll` (useFocusTrap.ts:36) —
   CODEX sendiri menandai perlu konfirmasi browser. **Bantu verifikasi ini**: apakah ada
   modal (Rekap/Lokmin/PanelHasil) di mana elemen focusable PERTAMA di DOM order benar2
   dirender secara visual di bagian BAWAH kontainer `overflow:auto` — kalau CODEX bisa
   menunjukkan file:baris konkret di mana urutan DOM ≠ urutan visual utk elemen pertama,
   itu mengonfirmasi hipotesis; kalau tidak ketemu, laporkan sbg "tak ditemukan kandidat
   konkret" (bukan diam-diam drop).

### P3 (4, satu setengah-rejected)
10. Restore-focus PanelHasil no-op (elemen pemicu sudah lenyap dari DOM sebelum efek
    membaca `document.activeElement`, useFocusTrap.ts:30 + Klinik.tsx:28-36).
11. Radiogroup Pengaturan pakai `aria-pressed` bukan `role="radio"` (Pengaturan.tsx:80-88).
    → **Cari kelas serupa**: `role="radiogroup"`/mode-toggle LAIN di codebase (grep
    `radiogroup` di seluruh renderer/src) dgn pola sama.
12. Onboarding fokus awal ke "Lewati", tanpa `aria-live`/`aria-current` (Onboarding.tsx:99).
13. Label peta SVG `13px` absolut tak ikut ukuran teks (PetaDesa.css:49). → **Cari kelas
    serupa**: teks SVG LAIN di codebase (grep `font-size:.*px` di file `.css` yg berisi
    `<svg>`/`<text>`) yang mungkin py celah sama.

---

## 3. Sudut BARU yang belum pernah diminta ronde mana pun (celah brief-brief sebelumnya)

### 3.1 — Kelas bug "identitas ditempel vs identitas genuine" (dari §2 temuan #3)
Sekarang terbukti ADA pola "entitas dibuat independen lalu ditempeli SEBAGIAN identitas
(`keluargaId` saja, tanpa nama/usia/RW/bpjs asli)" yang lolos dari sapuan M10.b krn bukan
`jenis:'pasien_kembali'`. **Audit baru**: grep SEMUA situs yang membuat `PasienAktif`
(`buatPasienDariKasus` dipanggil di mana saja — director.ts, reducer.ts, test fixtures) DAN
grep semua situs yang menempelkan `keluargaId`/`persona`/`bpjs` ke objek yang SUDAH dibuat
(bukan diteruskan sbg parameter awal) — buat tabel LENGKAP: [situs] × [identitas genuine
penuh | identitas ditempel parsial | identitas full random tanpa klaim apa pun]. Laporkan
SEMUA situs kategori tengah (ditempel parsial) sbg kandidat temuan, bukan cuma yg sudah
ditemukan.

### 3.2 — Materialisasi Prolanis/karma sbg kelas TERPISAH dari "9 situs pasien_kembali"
`bentukRosterProlanis` (reducer.ts:1795) dan jalur karma (`hariBaru`, reducer.ts:1345-1369)
membaca `pack.keluarga`/`pack.kasus` LANGSUNG, independen dari mekanisme `JadwalItem` yang
M10.b sudah perbaiki. **Audit**: apakah ada mekanisme MATERIALISASI lain (bukan jadwal biasa)
yang juga membaca konten statis langsung tanpa lewat jalur yg sudah diperbaiki — cek
`kegiatan.ts`, `kunjungan.ts`, `kader.ts` utk pola serupa (baca `pack.keluarga`/`kel.anggota`
LANGSUNG lalu bikin entitas baru, bukan teruskan yg sudah ada).

### 3.3 — Kontrol utama non-modal yang belum diaudit dari lensa keyboard
M10.a fokus PENUH pada modal (Onboarding/Pengaturan/Tentang/Rekap/Lokmin/PanelHasil) — 7 kali
diaudit. Peta Desa (§2 #8) baru terbukti PUNYA celah krn ia BUKAN modal (kontrol utama layar).
**Audit baru**: kontrol utama LAIN yang bukan modal dan bukan `<button>` standar — cek semua
`<g onClick>`/`<div onClick>`/`<span onClick>` (elemen non-semantik dgn handler klik) di
`src/renderer/src/screens/**/*.tsx`, bukan cuma PetaSvg.tsx.

### 3.4 — Konsistensi `PesertaProlanis` sbg NPC penuh, bukan cuma angka
§2 #6/#7 membuktikan `PesertaProlanis` kurang lengkap sbg representasi NPC (tanpa persona,
kondisi tunggal). **Audit lebih dalam**: bandingkan field `PesertaProlanis` (state.ts) vs
field `AnggotaKeluarga` (types.ts) — identitas APA SAJA yang hilang saat seorang anggota
keluarga "menjadi" peserta Prolanis? Apakah param `param` (SBP/GDS tunggal) cukup
merepresentasikan realita klinis 2 kondisi sekaligus, atau butuh restrukturisasi (mis.
`kondisi: ('ht'|'dm')[]` alih-alih `jenis` tunggal)?

---

## 4. DO-NOT-RE-REPORT — konsolidasi PENUH dari seluruh riwayat M10

Semua item di bawah SUDAH diverifikasi/fixed/rejected-dgn-alasan. Kalau ditemukan lagi
PERSIS seperti ini, itu snapshot lama — verifikasi ulang thd kode TERKINI dulu.

**Dari M10_AUDIT_BRIEF.md §6 (ronde-1):** tutorial kebal skor (by design); model dua-lapis
`clue`/`konsekuensi` (by design); 5 kasus self-report skdi tak cocok dokumen resmi
(keputusan kurikulum terbuka, BUKAN bug — hitung ulang thd sumber SAMA kalau diusulkan
lagi); `dispepsia_fungsional`/`mm_low_back_pain`/`mm_mialgia` (Daftar Masalah, benar
dikecualikan); `kia_kb_konseling` (Daftar Keterampilan, benar dikecualikan);
`mata_konjungtivitis_alergi` (SKDI generik 1-vs-2, benar dikecualikan); duplikat ICD
allowlist (`GENERIK_SENGAJA`/`ICD_DUPLIKAT_SENGAJA`); `obatAlternatif` pilih-salah-satu
(nol exploitable); `rasioTerapi=1` totalSlot=0 (by design utk 5 kasus non-farmakologis
spesifik); SUSPEK/TEGAK breakeven 80% (kalibrasi sengaja); cowboy/telemetry/rngFlavor
(sudah diputuskan); badge verifier/PanelHasil aria-hidden/tatalaksanaClue negasi/tindakan
billing/sidikJariPack tindakan/katalog asam_urat-mikroskopis_bta/tutorial scroll (semua
fixed, jangan re-flag kecuali REGRESI); `fktp144` field (dead metadata, dikonfirmasi).

**Dari M10_AUDIT_BRIEF_R2.md §4 (ronde-2):** karma demografi 3 mismatch (Nayla/Dimas =
keputusan konten terbuka, Mbah Lastri = fixed); `edukasiKritis` di 12 kasus (5 ronde-2 + 7
M10.c) sudah ditandai — hanya lapor kasus BARU yang layak tapi belum ditandai; celah
edukasi>3-topik sendiri (solved mekanik via `edukasiKritis`, opt-out by design);
`sidikJariPack` edukasi/tindakan (fixed); Toaster z-index (fixed, `--z-toast`=250); kartu
temuan menelan hotspot + mute/gigi menimpa Dex (fixed §39).

**Dari M10B_AUDIT_BRIEF.md §3 (M10.b):** 5 temuan F1-F5 M10.b sendiri (fixed — kalau
ditemukan bug SAMA PERSIS, laporkan situs SPESIFIK mana yg masih bocor, bukan klaim
generik); karma demografi (dijaga test); `keluargaId` pada `PasienAktif` klinik tak dibaca
UI/skor (dikonfirmasi: fondasi masa depan, BUKAN bug, kecuali ditemukan tempat yg
SEHARUSNYA membacanya).

**Dari dossier §48 (ronde ini, konsolidasi §2 di atas):** ke-13 temuan sudah CONFIRMED —
jangan re-report identik, cari kelas serupa (lihat §2/§3 di atas). SATU pengecualian
setengah-rejected: `useFocusTrap` sengaja TIDAK memakai `inert` pada leluhur modal nested
(didokumentasikan eksplisit di kode, useFocusTrap.ts:10-13) — ini tradeoff desain, bukan
kealpaan, JANGAN diusulkan ulang sbg "modal tak inert" kecuali menemukan skenario KONKRET
di mana tradeoff itu sendiri gagal (mis. dua modal nested TANPA trap-nonaktif-di-luar
seperti pola Pengaturan/Tentang).

**Umum:** REVISI_ENGINE saat ini **15** (bukan 11-14 — kalau laporan menyebut angka lebih
rendah, itu snapshot lama). Test count saat ini **456** (bukan 395/407/411/428/439/444 —
semua angka itu snapshot antara). Path proyek `primera-desktop`/`primera-arena` (bukan
`primer-desktop`/`primer-arena` pra-rebrand).

---

## 5. Yang CODEX TAK BISA verifikasi sendiri (read-only, tanpa browser)

Laporkan sbg HIPOTESIS/PERTANYAAN ber-file:baris, Claude akan verifikasi via harness
`puskesmas-pagi-preview` (browser preview, drive Zustand store asli):

- §2 #9 (scroll-ke-bawah modal) — satu-satunya dari 13 yang MURNI hipotesis kode, perlu
  render nyata utk konfirmasi.
- Apakah bridge positif Director (§2 #3) benar-benar SERING terjadi di gameplay nyata (butuh
  simulasi multi-hari — kemunculan diatur `rngFlavor.chance(0.35)` DAN butuh
  `binaanAkrab.length>0`, jadi frekuensi riil butuh playtest/simulasi, bukan cuma baca kode).
- Apakah Prolanis roster (§2 #4/#7) benar-benar tampil salah di UI Kegiatan.tsx (kartu
  prolanis) saat dimainkan — butuh replay runtime.

Untuk semua yang bisa dibaca murni dari sumber, laporkan normal ber-severity (P1
integritas skor/data, P2 konten/UX salah tak-eksploitatif, P3 kosmetik/dokumentasi).

---

## 6. Format laporan — sama persis brief-brief sebelumnya

File:baris + kutipan + klaim 1-kalimat + bukti/skenario konkret + severity + cek dulu thd
§4 di atas sebelum melapor. Read-only — jangan edit apa pun. Laporkan ke Claude untuk
ditriase (verifikasi thd kode aktual → test-first fix bila valid → verifikasi-bergigi →
dossier update) — pola yang sama persis dipakai sepanjang sesi ini.
