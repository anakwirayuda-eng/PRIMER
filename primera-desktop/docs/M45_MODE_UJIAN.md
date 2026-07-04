# M4.5 — Mode Ujian 30 Hari: Desain Arsitektur Seed

> Status: DESAIN DISETUJUI → diimplementasikan pada milestone yang sama.
> Keputusan triangulasi DeepThink Q1 (2026-07-03): mode Ujian ~30 hari menjadi
> satu-satunya instrumen yang dinilai formal; 90 hari menjadi mode Karier bebas
> nilai. Blind spot yang WAJIB dijawab desain ini: **kunci jawaban bocor via
> walkthrough grup WhatsApp angkatan** bila seluruh angkatan memainkan urutan
> pasien yang identik.

---

## 1. Masalah

Satu `seed` tunggal di `GameState` saat ini menyetir SEMUANYA: kasus apa yang
muncul (Director), siapa nama pasiennya, berapa usianya, kapan IGD menyala,
sampai hasil lempar dadu RJP. Konsekuensinya dua tuntutan yang saling bertolak
belakang tidak bisa dipenuhi bersamaan:

- **Keadilan asesmen** menuntut mahasiswa diuji pada KURIKULUM yang sama —
  jenis kasus, komposisi rujukan, beban IGD yang sebanding.
- **Integritas asesmen** menuntut jawaban tidak bisa dihafal dari walkthrough —
  "pasien kedua hari 3 namanya Pak Slamet, itu dengue, jawab X-Y-Z".

Seed tunggal memaksa memilih salah satu. Solusinya: **dua seed dengan tanggung
jawab berbeda**.

## 2. Dua seed, dua tanggung jawab

| | `seedKurikulum` | `seed` (flavor) |
|---|---|---|
| Sumber | Paket ujian (tabel tetap) | `hashSeed(nama, Date.now())` per mahasiswa |
| Menyetir | **APA yang diujikan**: pemilihan & urutan kasus Director, kedatangan + pemilihan kasus IGD | **BAGAIMANA tampaknya & bagaimana dadu jatuh**: nama/usia/RW/persona/BPJS pasien, hasil roll RJP/bed RS/kader/drift, auto-resolve |
| Sama antar mahasiswa 1 paket? | **YA** | **TIDAK** |
| Di mode Karier | = `seed` (perilaku lama byte-identik) | seperti sekarang |

Pemetaan call-site `new Rng(...)` (audit lengkap per 2026-07-03):

- **seedKurikulum**: `'director'` (init D1 + hariBaru), `'igd'` (roll kedatangan
  + pemilihan kasus IGD).
- **seed/flavor**: semua sisanya — `'klinik'`, `'konsekuensi'`, `'sisrute'`,
  `'prb'`, `'delegasi'`, `'rjp'`, `'prolanis'`, `'prolanis-roster'`, `'auto'`,
  `'drift'`, `'kader'`, `'kembali'`, plus dua konteks BARU hasil pemisahan:
  `'director-flavor'` (instansiasi pasien di dalam antrian) dan `'igd-flavor'`
  (identitas pasien IGD).

**Pemisahan di dalam `susunAntrianHarian`**: fungsi kini menerima `rngFlavor`
opsional (default = `rng` → perilaku lama utuh untuk semua call-site lama).
Seleksi kasus (weighted pick, pity-timer, cap rujukan) memakai `rng`
(kurikulum); `buatPasienDariKasus` + roll keluarga-binaan-akrab memakai
`rngFlavor`. Dengan begitu dua mahasiswa satu paket mendapat **kasus yang sama
dengan wajah yang berbeda** — dengue-nya sama, "Bu Ratna 34 th RW 2 persona
cemas" vs "Pak Joko 19 th RW 7 persona polos" berbeda. Persona & BPJS ikut
flavor **dengan sengaja**: variasi kecil pada gaya jawaban anamnesis dan
ekonomi membuat walkthrough berbasis "klik urutan ini" makin rapuh, tanpa
menggeser substansi klinis yang dinilai.

## 3. Paket ujian & rotasi

`PAKET_UJIAN` — 8 paket dengan seed kurikulum tetap (`paket_a` … `paket_h`).
Saat mahasiswa memulai Mode Ujian, paket dipilih deterministik dari seed
flavor-nya (`seed % 8`) — acak dari sudut pandang mahasiswa, terdistribusi
merata dari sudut pandang angkatan, dan **tercatat di state** (`paketUjian`)
sehingga dosen (M6) melihat siapa mengerjakan paket apa.

Anti-walkthrough yang dihasilkan berlapis:
1. Walkthrough harus dibuat **8 kali** (satu per paket) — dan penulisnya tidak
   tahu paket mana yang akan didapat temannya.
2. Nama/usia/persona pasien **tidak bisa dijadikan penanda** ("kalau ketemu
   Pak Slamet…") karena itu flavor per-mahasiswa.
3. Director tetap **adaptif terhadap permainan** (Leitner/Dex, kluster
   surveilans dari diagnosismu sendiri, musim): dua mahasiswa satu paket yang
   bermain BERBEDA akan melihat antrian mulai menyimpang setelah beberapa hari
   — deterministik terhadap keputusannya sendiri, bukan keberuntungan.

**Jaminan keadilan yang tepat (dan jujur):** bukan "urutan byte-identik 30
hari", melainkan (a) hari-1 identik per paket, (b) pool kasus + bobot + pity
timer + cap rujukan identik per paket, (c) pola kedatangan IGD identik per
paket bila hari kedatangannya belum digeser interaksi, dan (d) seluruh
penyimpangan sesudahnya adalah fungsi deterministik dari keputusan mahasiswa
sendiri. Ini selaras dengan filosofi skor: *action-log adalah sumber kebenaran*.

Risiko residu yang diterima: 8 walkthrough tetap MUNGKIN dibuat oleh angkatan
yang sangat terorganisir. Mitigasi lanjutan milik M6 (dosen melihat distribusi
paket + rekomputasi skor dari action-log) dan pool paket bisa diperluas tanpa
perubahan arsitektur (tambah baris tabel).

## 4. Durasi & penguncian skor

- `HARI_STASE = { karier: 90, ujian: 30 }`.
- Saat `hariBaru` akan membangun hari `HARI_STASE + 1`, ia MENGUNCI: `tamat =
  { hari, grade }` dihitung dari `hitungSkor`, antrian dikosongkan, surat
  penutup dikirim, event `TAMAT`.
- Setelah `tamat`, `LANJUTKAN` ditolak engine ("stase berakhir — skor
  terkunci"); membaca surat/rapor/dex tetap boleh. Laporan akhir sinematik
  adalah milik M5 — M4.5 hanya menjamin kuncinya benar.
- Bonus arsitektural: mekanisme yang sama memberi kunci D90 untuk Karier
  (butir M5.23 separuh jalan).

## 5. Yang TIDAK berubah

- Mode Karier adalah default dengan `seedKurikulum = seed`: **urutan & jenis
  kasus identik** dengan pra-M4.5 (stream seleksi tak berubah). Identitas
  pasien kini digenerate dari stream flavor TERPISAH (`'director-flavor'`,
  `'igd-flavor'`) — tetap deterministik dari seed yang sama, tapi nama/usia
  yang keluar berbeda dari build lama. Ini disengaja: satu jalur kode untuk
  dua mode, tanpa cabang khusus ujian di Director.
- Save lama termigrasi: `mode: 'karier'`, `seedKurikulum = seed`.
- Kurasi pacing per-fase (breathing D1-14 dst.) TIDAK dikerjakan di sini —
  itu M5.22; Mode Ujian memakai Director standar + Curriculum Director
  (pity-timer 4A) yang sudah ada.

## 6. Kontrak untuk M6 (kelas & dosen)

`GameState` kini membawa `mode`, `paketUjian`, `seedKurikulum` — dashboard
dosen WAJIB menolak submission `mode !== 'ujian'` dan mencantumkan paket pada
laporan. Rekomputasi skor server-side (M6.26) dapat mereplay action-log
terhadap `seedKurikulum + seed` yang tercatat.
