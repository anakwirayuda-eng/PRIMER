# M11 Lanjutan — Dokumen Keputusan Terpadu (2026-07-16)

> Status: **UNTUK ADJUDIKASI dr. Wirayuda.** Menjawab backlog yang Anda
> sebut: *"M11 #2 variasi storyline, #4 variasi presentasi, #5 variasi UKM;
> UKM Decision #2/#3 (slot sitasi, granularitas Prolanis); adopsi metode
> SAJI/Pinkesga; M13 sisanya = adjudikasi EBM 103 prototipe."*
> Semua opsi di bawah digrounding ke bentuk kode NYATA saat ini
> (types.ts / kunjungan.ts / kegiatan.ts / state.ts, dibaca 2026-07-16),
> bukan asumsi. Belum ada satu baris pun diimplementasikan dari dokumen ini.
>
> **Catatan status #4**: "butuh mekanik director baru" sudah BASI — mekanik
> engine Tingkat-A selesai & teruji hari ini (REVISI_ENGINE 41, commit
> `b3b7e58`), konten 41 kasus sedang digenerate+diverifikasi adversarial
> saat dokumen ini ditulis. Lihat `M11_VARIASI_PRESENTASI_DESAIN.md` §9.

---

## Bagian A — M11 #2: Variasi Storyline

**Apa yang "storyline" hari ini**: arc keluarga binaan = urutan
`SkenarioKunjungan` TETAP (pembuka/hotspot/dialog/intervensi/penutup, semua
teks tunggal); Debrief Malam ringkasan statis; kalender musim & event
tetap. Replay 90 hari = teks yang sama persis.

- **A1 — Variasi teks kosmetik kunjungan** (murah): pool teks alternatif
  utk `pembuka`/`penutupBerhasil`/`penutupGagal`/`hasilNarasi` per skenario,
  dipilih `rngFlavor` saat kunjungan dibuat. Ground truth
  (`hambatanSebenarnya`/indikator/karma/trust) TAK tersentuh — jaminan
  struktural yang sama dgn Tingkat-A UKP (tipe varian tanpa field kunci).
- **A2 — "Storylet" sisipan non-skor** (sedang): pool kejadian naratif
  kecil satu-tayang (kader curhat, surat balasan RS, warga titip salam,
  gosip posyandu) yang muncul di Debrief Malam / MejaKerja. Murni display,
  dihitung renderer dari `Rng(seed,'storylet',hari)` — deterministik TANPA
  menyentuh state/reducer → **non-REVISI**. Nilai atmosfer tinggi per
  rupiah usaha.
- **A3 — Arc bercabang** (mahal): hasil kunjungan mengubah skenario
  berikutnya. Ini setara Tingkat-B UKP: kunci jawaban/karma ikut bercabang,
  butuh adjudikasi per-cabang + REVISI + konten besar.

**Rekomendasi**: A1 + A2 sekarang; A3 ditolak/ditunda tanpa batas (rasio
biaya:nilai buruk, September dekat).

## Bagian B — M11 #5: Variasi UKM

- **B1 — Tingkat-A untuk kunjungan keluarga** (nilai tertinggi): varian
  kosmetik per `SkenarioKunjungan` — `narasi` hotspot, `respons` warga,
  urutan/teks `NodeDialog.narasi` — TANPA mengubah `gaya`/`efekTrust`/
  `tepat`/`gerbang kejujuran`/hotspot-indikator. 16 keluarga adalah konten
  paling sering di-replay kedua setelah kasus prevalensi tinggi. Mekanik
  penerapan bisa meniru persis pola `varianTingkatAData.ts` (lapisan
  terpisah + `rngFlavor` + guard validasi).
- **B2 — Pool kartu KLB** (kecil): respons KLB hari ini 3 kartu tetap →
  jadikan pool (mis. 6-8) yang dirotasi per kejadian. Posyandu sudah
  12-kartu-pool sejak migrasi 5-Langkah; Prolanis sudah bervariasi per
  peserta.
- **B3 — Variasi suara surat kader** — **SUDAH TERPENUHI kode eksisting**
  (diverifikasi 2026-07-17, bukan diasumsikan): `buatSuratKader` (kader.ts)
  sudah punya `SALAM_PEMBUKA` (4 varian) + `KALIMAT_PENUTUP` (4 varian),
  keduanya `rng.pick()`, plus 2 sisipan probabilistik ber-persona (bias-
  confession 40% & quirk-callback 30%, `rng.chance()`) — kombinasi ini
  sudah menghasilkan variasi suara per kader per hari yang genuinely kaya,
  diuji `kunjungan.test.ts` (`prosesHarianKader`). Tak ada pekerjaan baru
  yang diperlukan; ditutup di sini agar tak dobel-bangun sesuatu yang
  sudah ada.

**Rekomendasi**: B1 sebagai batch utama (pakai pipeline draf→verifikasi
adversarial yang sama dgn #4), B2+B3 menumpang batch konten yang sama.

## Bagian C — UKM Decision #2: Slot sitasi UKM

Fakta kode: `KeluargaBinaan`/`SkenarioKunjungan`/`KartuKegiatan`/
`KartuIntervensi` belum punya SATU pun field sitasi; UKP sudah 4 lapis
(clue/mutiaraEbm/catatanRealita/panduanResmi). Kelas field: display-only,
non-hash, non-REVISI (sama spt panduanResmi UKP — aman post-freeze).

- **C1 — Minimal**: `panduanResmi?: string` di `SkenarioKunjungan` saja
  (muncul di debrief kunjungan).
- **C2 — Penuh (rekomendasi)**: C1 + `sumber?: string` di `KartuKegiatan`
  (satu baris sitasi di debrief kegiatan; mis. kartu Posyandu → "Panduan
  Posyandu Kemenkes 2023, Langkah 2") + `sumber?: string` di
  `KartuIntervensi` (tautan ke Pinkesga/pedoman — sinergi Bagian E).
  Nama field sengaja SEJAJAR dgn UKP (`panduanResmi`) supaya mahasiswa
  mengenali register yang sama di dua sisi game.

Konten pengisinya sudah tersedia dari 8 sumber terdistilasi
(`docs/references/ukm/*/distillation.json`) — pengisian jadi batch konten
terpisah setelah skema disetujui.

**Catatan eksekusi 2026-07-17**: asumsi awal "non-hash" hanya benar untuk
registry di luar `PACK`. Implementasi aktual `sidikJariPack()` meng-hash
`k.arc` secara wholesale, sehingga injeksi inline ke ketiga field keluarga
akan menggeser fingerprint. C2 diselesaikan lewat registry konten ber-ID yang
dibaca renderer (27/27 skenario, 89/89 intervensi, dan 3 keluarga kegiatan),
tanpa menyentuh engine beku. Rincian dan batas klaim:
`docs/M11_SITASI_UKM_HASIL.md`.

## Bagian D — UKM Decision #3: Granularitas Prolanis

Fakta kode: `kartuProlanis()` (kegiatan.ts — file BEKU) = 1 kartu generik
per peserta; skor terhubung `prolanisTerkendali()` (rev 40). Fakta
regulasi (riset 2026-07-10): Panduan BPJS memerinci 4 kanal
(Konsultasi/Edukasi Klub/Reminder/Home Visit) + target 75% terkontrol;
TETAPI kata "Prolanis" tak muncul sama sekali di KMK ILP 2023 —
strukturnya sedang diserap ke Klaster Dewasa-Lansia.

- **D1 — Status quo**: biarkan 1 kartu generik. Nol biaya.
- **D2 — 4 kanal penuh sbg mekanik**: kartu terpisah per kanal + kriteria
  home-visit spesifik. Fidelitas BPJS tinggi, TAPI: sentuh file beku
  (REVISI + soak + re-kalibrasi), dan menggandakan investasi pada struktur
  yang justru sedang di-sunset ILP — fidelitas ke pedoman yang sedang
  diganti.
- **D3-lite — Granularitas naratif (rekomendasi)**: pilihan & efek kartu
  TETAP (replay tak berubah), tapi NARASI kartu dirotasi deterministik
  melalui 4 rasa kanal ("bulan ini sesi edukasi klub...", "jadwal home
  visit utk Bu X yang 2x mangkir...") + 1 kalimat `catatanRealita`-style
  yang MENGAJARKAN tensi regulasinya secara eksplisit: "BPJS masih
  mengoperasikan 4 kanal Prolanis; kerangka ILP 2023 meleburnya ke Klaster
  Dewasa-Lansia — di lapangan keduanya hidup berdampingan." Itu justru
  pelajaran realita-FKTP yang lebih jujur daripada memihak salah satu.
  Biaya: teks di kegiatan.ts (beku → ikut gelombang unfreeze berikutnya
  bila mengubah string di file itu; bisa juga lewat pool teks di konten
  bila kita tambahkan lookup — detail saat implementasi).

**Rekomendasi**: D3-lite. D2 hanya bila Anda menilai 4-kanal BPJS bernilai
uji/OSCE eksplisit utk kohort September.

## Bagian E — Adopsi SAJI/Pinkesga (Anda sudah putuskan: ADOPSI — ini rencana eksekusinya)

Sumber: Permenkes 39/2016 (distilasi lengkap di references/ukm). Pemetaan
ke kode nyata — babak kunjungan hari ini `observasi → wawancara →
diagnosis_perilaku → resep_sosial` (state.ts:302), `PilihanDialog.gaya`
sudah punya 'konfrontasi' + mekanik righting-reflex 2-beruntun
(kunjungan.ts:191-201).

**Fase E-1 — non-REVISI, bisa segera** (display/konten saja):
1. **Label SAJI di UI kunjungan**: babak diberi label resmi — observasi ≈
   "S: Salam", wawancara ≈ "A: Ajak bicara", diagnosis+resep ≈ "J:
   Jelaskan & Bantu", penutup ≈ "I: Ingatkan" — murni renderer, mengajar
   nomenklatur resmi tanpa menyentuh engine.
2. **Field `pinkesga?: string` di `KartuIntervensi`**: nama paket
   Pinkesga resmi yang melandasi kartu (padanan literal yang ditemukan
   riset) — display di debrief + sinergi slot sitasi C2.
3. **Konten `panduanResmi` kunjungan** (bila C disetujui): kutipan metode
   SAJI sbg sitasi debrief.

**Fase E-2 — gelombang REVISI berikutnya** (menyentuh state/kunjungan/
scoring yang beku; dibundel jadi SATU unfreeze):
4. **Babak "Ingatkan" eksplisit**: fase penutup interaktif ringan — pilih
   1 dari 3 pesan pengingat (yang tepat = spesifik-indikator + jadwal
   follow-up; yang salah = generik/menggurui). Skor kecil masuk
   `kualitasMi`.
5. **2 hasil kunjungan SAH baru**: "ditolak total" & "diterima terpaksa"
   (prosedur resmi Permenkes — BUKAN kegagalan pemain). Mengubah model
   hasil biner berhasil/gagal → 4 hasil; konten `penutup*` per skenario
   perlu 2 varian tambahan; karma/skor perlu aturan eksplisit (usul:
   ditolak-total = tanpa penalti MI, jadwal ulang otomatis; diterima-
   terpaksa = indikator tercatat tapi flag rapuh → drift lebih cepat).
6. **Taksonomi gaya-terlarang lebih tajam**: pecah 'konfrontasi' jadi
   subtipe resmi (menghakimi/menggurui/menakut-nakuti/memaksa) — engine
   righting-reflex tetap, debrief jadi lebih presisi pedagogisnya.

**Rekomendasi eksekusi**: E-1 segera (bareng batch C2); E-2 dijadwalkan
sbg gelombang unfreeze UKM tersendiri setelah konten #4/#5 mendarat —
jangan dicampur gelombang rev 41 yang sedang berjalan.

## Bagian F — M13 sisanya (catatan status, bukan keputusan)

Sesuai pernyataan Anda: sisa M13 = **adjudikasi EBM 103 kasus prototipe
lab** (`activationStatus: 'lab_prototype_unadjudicated'`) — pekerjaan
klinis Anda, terikat fase porting ke repo produksi, bukan pekerjaan lab
clone lagi. Yang bisa saya siapkan KAPAN PUN Anda mau memulainya:
artifact keputusan gaya M11.5 (103 kartu: ringkasan kasus + grounding
PPK 1186/Fornas 1199/ASPAK/KFA per kasus + radio
Setuju/Perlu-Edit/Tolak/Nanti + ekspor JSON) supaya adjudikasi Anda
sekali-duduk per batch. Tinggal bilang.

---

## Ringkasan pertanyaan untuk Anda

| # | Keputusan | Rekomendasi saya |
|---|---|---|
| A | Variasi storyline | A1 + A2; tolak A3 |
| B | Variasi UKM | B1 utama + B2/B3 menumpang |
| C | Slot sitasi UKM | C2 (3 field display-only) |
| D | Granularitas Prolanis | D3-lite + catatan tensi ILP |
| E | SAJI/Pinkesga | E-1 segera; E-2 gelombang unfreeze UKM tersendiri |
| F | M13 adjudikasi 103 | siapkan artifact saat Anda minta |

## STATUS EKSEKUSI (diperbarui 2026-07-17, sesi lanjutan)

Semua diadjudikasi user via AskUserQuestion: **A1+A2, B1+B2+B3, C2, D3-lite.**

| # | Status |
|---|---|
| A1 | SELESAI — mekanik B1 (varianKunjungan) mencakup variasi pembuka/penutup teks kunjungan |
| A2 | SELESAI — storylet Debrief Malam, non-REVISI |
| B1 | SELESAI — konten final **11/16 skenario dapat varian (21 total)** setelah run pertama (9/16) + retry (2 lolos baru, 5 tambah varian). **5/16 TETAP tanpa varian** (dewi_k1/prapto_k1/marni_k1/lastri_k1/karsa_k1) setelah 2 percobaan independen — alasan struktural genuine, bukan kurang usaha; rincian di `docs/M11_VARIAN_KUNJUNGAN_TINGKAT_A_HASIL.md`. Insiden run-duplikat (limit kuota + bug silent-pass di `kumpulkanBantahan`) dibuang seluruhnya & didokumentasikan sbg pelajaran di file yang sama. **Ditutup di angka ini** — retry berikutnya butuh pendekatan berbeda, bukan sekadar ulang. |
| B2 | SELESAI — pool 3 narasi klb_verif/klb_5w1h |
| B3 | SUDAH TERPENUHI kode eksisting (lihat Bagian B di atas) — tak ada pekerjaan baru |
| C2 | **SELESAI** — registry player-facing mencakup 27/27 skenario, 89/89 intervensi, serta Posyandu/Prolanis/KLB; tampil pasca-keputusan. Tidak diinjeksi inline karena `k.arc` di-hash wholesale; lihat `docs/M11_SITASI_UKM_HASIL.md` |
| D3-lite | SELESAI — rotasi 4 kanal Prolanis + catatan tensi ILP |
| E-1 | SELESAI — label SAJI di stepper Kunjungan.tsx |
| E-2 | BELUM — gelombang unfreeze UKM tersendiri, jangan campur rev 41 (sudah di-tag Golden Master, lihat di bawah) |
| F | belum diminta |

**Gelombang ini DITUTUP 2026-07-17** — tag `golden-master-m11` (REVISI_ENGINE 41),
88/88 file test, 976/976 test, typecheck bersih, freeze 17/17, soak-adversarial
13/13 identik baseline pra-wave. Semua commit di lab clone
`D:/Dev/PRIMER-CODEX-lab/primera-desktop`, branch `codex-gpt56-experiment`,
belum di-push. Pekerjaan berikutnya (E-2, M11 #3/#6/#7-riset, atau lainnya)
adalah gelombang REVISI_ENGINE baru — butuh scoping/greenlight eksplisit dulu.
