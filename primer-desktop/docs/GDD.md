# PRIMER: PUSKESMAS PAGI — Game Design Document

> **Versi:** 1.0 (hasil sintesis panel desain 4 konsep × 3 juri, Juli 2026)
> **Platform:** Desktop (Electron + React + TypeScript strict)
> **Pemain:** Mahasiswa FK Indonesia (stase IKM/kedokteran keluarga), sesi 30–60 menit
> **Positioning:** *Football Manager-nya kedokteran komunitas, dengan hati Harvest Moon.*

---

## 1. FANTASI & PITCH

Kamu dokter fresh-graduate, **dokter penanggung jawab daerah binaan** di Puskesmas
Desa Sukamaju (200 KK, 8 RW), selama satu musim stase **90 hari**. Kamu tidak
berjalan-jalan di peta — kamu membaca laporan kader seperti scout report, menyusun
rencana, lalu turun tangan sendiri di "pertandingan": encounter klinik dan kunjungan
rumah yang resolve lewat keputusan-keputusan kunci. Setiap angka di layar **diperoleh
dari tindakan** — tidak ada omniscience. Setiap kesalahan tatalaksana kembali
menghantuimu lewat kotak masuk, 7–30 hari kemudian, dengan **nama**. Di hari ke-90
Dinkes menjatuhkan Rapor Akhir Stase 4 dimensi: **PTT Teladan** atau **Recall Dinkes**.

## 2. PILAR DESAIN (tidak boleh dilanggar)

1. **Setiap angka diperoleh, atau ia tidak ada.** Vital sign tampil `—` sampai
   diperiksa. Peta desa mulai abu-abu. Data kader diberi chip keyakinan.
2. **Ajari kedokteran yang benar atau jangan ajari apa-apa.** Tidak ada XP untuk
   antibiotik/lab berlebih. Konfrontasi menggurui warga → diusir. Rujukan rasional.
3. **Konsekuensi bernama.** Bukan "-2 reputasi", tapi "Bu Wulan, yang kunjungannya
   kamu lewatkan tanggal 12, masuk IGD subuh tadi."
4. **Dokter = manajer sistem, bukan enumerator.** Sensus didelegasikan ke kader;
   pemain memverifikasi, memprioritaskan, dan turun pada kasus sulit.
5. **Satu formula, satu kebenaran.** SATU formula IKS (PIS-PK kanonik Permenkes
   39/2016 dengan N/A demografis), SATU keluarga formula skor (4 dimensi), SATU
   sumber state (engine).
6. **Tanpa teater.** Fitur yang tidak dinilai/berefek tidak boleh ada di layar.

## 3. MODEL WAKTU — TURN-BASED 3 BLOK

Menghapus total: tick real-time 250ms, drain energi per menit, groggy delay, jam
buka/tutup. **1 hari = 3 blok**; pemain menekan **LANJUTKAN** untuk mengalirkan waktu;
interupsi hanya saat butuh keputusan.

| Blok | Isi | Durasi riil |
|---|---|---|
| **PAGI — Klinik** | 3–4 pasien *playable* (dipilih Director) + sisanya auto-resolve | 8–15 mnt |
| **SIANG — Lapangan** | 1 slot kegiatan besar: kunjungan rumah / Posyandu / Prolanis / respons KLB. RW terpencil memakan slot Siang+Sore (trade-off nyata) | 5–10 mnt |
| **SORE — Meja Kerja** | Kotak masuk, jadwal besok, refleksi tertulis (+XP), tidur (autosave) | 2–4 mnt |

**Stamina = 6 pip/hari** (bukan meter 0–100 yang bocor per menit). Aksi besar makan
pip; pip habis = pilihan sore terbatas & risiko kualitas keputusan turun besoknya.
Hanya **2 meter pemain**: Stamina & Burnout (naik bila stamina habis berhari-hari;
menurunkan pip maksimal; komponen skor Resiliensi).

## 4. LAYAR (total 6 + modal — dari ±50 permukaan jadi 6)

1. **MEJA KERJA (hub)** — Kotak Masuk bercerita (surat kader, hasil lab "besok",
   teguran Kapus, gosip warung), kalender janji, tombol LANJUTKAN besar.
   80% waktu pemain mendarat di sini. *Compulsion loop FM.*
2. **KLINIK — Lembar Periksa** — SATU lembar rekam medis SOAP yang terisi dari atas
   ke bawah (kolom kiri), deck aksi kontekstual per fase (kolom kanan). Antrian di
   tepi. Menggantikan EMR 9-tab.
3. **PETA DESA** — SVG choropleth 8 petak RW (gradasi Daun→Kunyit→Merah bata sesuai
   IKS), klik RW → tabel KK sortable; roster **Keluarga Binaan** (maks 8 di slice,
   16 di full); chip provenance data (✓ dokter / ~ kader / ? belum).
4. **KUNJUNGAN RUMAH** — match engine 4 babak dalam SATU layar (state machine,
   tidak pernah navigate keluar — bug lama mati by architecture).
5. **BUKU SAKU (Dex SKDI)** — 144 siluet penyakit; tertangani benar = terisi;
   bintang penguasaan Leitner yang MELUNTUR → Director mengirim ulang kasus lemah.
6. **RAPOR** — 4 dimensi live, RRNS + guillotine, proyeksi KBK, kalender musim.

Modal ritual: **Briefing Pagi** (Tas Kunjungan: 3–4 saran ber-ALASAN + due date),
**Debrief Malam** (grade + kasus kritis + guideline yang seharusnya dibuka +
refleksi tulisan tangan), **Rencana Senin** (pekan depan), **Rapor Bulanan** D30/D60.

## 5. KLINIK — "LEMBAR PERIKSA" (UKP)

Alur satu pasien (5–8 menit): **Salam → Anamnesis → PF → (Lab) → Diagnosis →
Terapi → Edukasi → Disposisi.**

- **Anamnesis** = deck 6–10 kartu pertanyaan kontekstual (termasuk distraktor).
  Jawaban pasien ditulis ke lembar sebagai kutipan. Persona (polos/terpelajar/
  skeptis/cemas/lansia/wali anak) mengubah gaya bahasa. **Gauge SABAR** pasien
  turun per pertanyaan tak relevan → menghukum anamnesis shotgun (proxy OSCE).
- **PF** = figur tubuh SVG; klik regio → temuan tercetak di kolom O. Vital `—`
  sampai diukur.
- **Lab** = form dengan biaya BPJS nyata yang membakar kapitasi; sebagian hasil
  kembali **besok** (BTA, Widal) → keputusan interim.
- **Diagnosis** = komit ICD-10 dari diagnosis banding + **stempel dua tinta**:
  **TEGAK** (yakin) vs **SUSPEK** (kerja). Kalibrasi dinilai: SUSPEK-lalu-benar
  lebih baik daripada TEGAK-lalu-salah. Mengganti "confidence" teater lama.
- **Terapi** = formularium; **allergy firewall class-based** memblokir dengan
  stempel merah KONTRAINDIKASI (poka-yoke); antibiotik tanpa indikasi tercatat
  (stewardship, memengaruhi skor).
- **Disposisi** = PULANG / RUJUK (SISRUTE ringkas dengan SBAR 4 field yang DINILAI
  engine terhadap isi lembar) / OBSERVASI. Gatekeeper SKDI: merujuk kasus 4A =
  penalti RRNS (Referral Guillotine); menahan kasus >4A = Cowboy Doctor.
- **Selesai** = SOAP dirakit otomatis dari action-log, di-grade, clue EBM muncul
  sebagai stempel margin (klik = guideline).
- Pasien **auto-resolve** (sisanya) mengikuti insting; hasil buruk bisa bounce-back
  ke inbox. (Protokol Klinik yang bisa disetel = fitur pasca-slice.)

## 6. UKM — REDESIGN TOTAL (jawaban titik sakit)

**Dokter bukan enumerator.** Tiga lapis:

- **LAPIS 1 — Kader = scout.** 8 kader (1/RW), stat Ketelitian (45–90) + bias
  persona (Bu Ketut sungkan menanyakan KB; Pak Gede asal centang jentik). Mereka
  mengisi sensus 200 KK organik dalam 3–4 minggu. Klik pemain: penugasan mingguan
  (≤8 klik). Data kader ber-chip `~`; indikator sensitif sering salah → hanya
  kunjunganmu yang memverifikasi (`✓`). *2.400 klik → 8 klik + gameplay detektif.*
- **LAPIS 2 — Peta = papan keputusan.** Choropleth 8 RW; jarak (Dekat/Sedang/
  Terpencil) hanya memengaruhi: biaya slot kunjungan, mangkir Prolanis, kecepatan
  memburuk keluarga rawan. Drift HANYA memburuk pada keluarga berisiko yang
  diabaikan, maks 2 kejadian/minggu, dan SELALU diberitakan lewat inbox. Tidak ada
  pembusukan senyap. (Buang: jembatan, FOB, warung intel, kendaraan, semantic zoom,
  interior, 2 renderer, drift acak 60% membaik.)
- **LAPIS 3 — Keluarga Binaan = skuad utama.** Kandidat disodorkan engine
  (IKS terendah × risiko klinis); pemain memilih roster. Hanya binaan punya
  kedalaman penuh: kartu keluarga ber-Garuda, arc naratif, trust ♥, TTM.
  Sisanya dikelola agregat lewat Program (pasca-slice).

**KUNJUNGAN RUMAH — match engine 4 babak (satu layar, 8–14 klik, 6–10 menit):**

1. **SALAM & OBSERVASI** — ilustrasi interior rumah (SVG statis) dengan 4–7
   **hotspot** klikabel: bak mandi berjentik, asbak penuh, KMS di dinding, jamban.
   Temuan = indikator TERVERIFIKASI. Sensus manual lama → hidden-object bermakna.
2. **WAWANCARA (MI/OARS)** — 3–5 node dialog; pilihan bergaya empati/refleksi/
   edukasi/konfrontasi. Konfrontasi 2× → diusir (righting reflex), slot hangus.
   **GERBANG KEJUJURAN:** indikator sensitif (rokok, TB, KB, jiwa) DIBOHONGKAN
   bila trust rendah — "Tidak ada yang merokok, Dok" *sementara asbak terlihat di
   babak 1*. Momen "aku tahu kamu bohong" = wow pedagogis. Trust naik dari
   KUALITAS pilihan MI, bukan frekuensi kunjungan.
3. **DIAGNOSIS PERILAKU** — komit hipotesis hambatan (Kapabilitas/Kesempatan/
   Motivasi — COM-B disederhanakan); salah hipotesis → intervensi babak 4 nihil.
4. **RESEP SOSIAL** — pilih 1 dari 3–4 kartu intervensi + jadwalkan follow-up di
   kalender. Perubahan nyata butuh 2–3 kunjungan ber-jeda (TTM); indikator baru
   flip SETELAH follow-up terverifikasi.

**KARMA LOOP dua arah, selalu terlihat:**
- Berhasil → anggota keluarga muncul di klinik lebih jujur + IKS naik → KBK naik.
- Diabaikan → eskalasi bernama via inbox → **event IGD scripted** (Golden Loop
  "Bu Wulan": tolak obat HT → MI → terkontrol ATAU stroke D+21).

## 7. PROGRESI 90 HARI & SKOR

- **Musim epidemiologis 3 babak:** Hujan (D1–30, DBD/diare naik) → Pancaroba
  (D31–60, ISPA) → Kemarau (D61–90, krisis air, HT bolos kontrol saat panen).
- **Unlock kurikuler:** D1–7 klinik+inbox saja (bias kasus 4A 92%); Peta+kader D5;
  Kunjungan D8; Posyandu D15; Prolanis D30; KLB D45.
- **Director** memilih pasien playable: bias Leitner ke kelemahan + **jaminan
  cakupan kurikulum** (≥30% kasus belum-pernah; semua kategori SKDI tersentuh
  per bulan).
- **Skor 4 dimensi** (satu-satunya formula; lock immutable D90): UKP 35
  (akurasi × Referral Guillotine RRNS) · UKM 35 (IKS kanonik + kualitas MI −
  apathy) · Manajemen 15 (kapitasi/KBK/stok) · Resiliensi 15 (burnout).
  Grade A "PTT Teladan" ≥85 / B "Kompeten" ≥70 / C "Lulus" ≥55 / D "Recall Dinkes".
- **Meta:** Dex SKDI lintas-playthrough, badge, Album Keluarga (screenshot-able),
  rival dr. Ratih sebagai *ghost* di Lokakarya Mini bulanan (pasca-slice).

## 8. ART & AUDIO — "PUSKESMAS PAGI"

- Palet: Daun `#0E8A6B` / Kertas `#FAF6EF` / Kunyit `#D9822B` / Malam `#14201C`.
  Font: Plus Jakarta Sans + IBM Plex Mono + Caveat (tulisan tangan).
- Bahasa visual: **kertas, tinta, stempel, folder manila, kartu keluarga
  ber-Garuda** — arsip pemerintah Indonesia yang dirawat dengan sayang. Nol jargon
  militer/sci-fi. Semua istilah medis/BPJS ASLI (RRNS, KBK, kapitasi).
- Potret warga: vektor prosedural sederhana (bukan pixel-art — pixel buruk terlihat
  lebih amatir daripada vektor sederhana yang rapi).
- Audio: WebAudio FM synth prosedural (nol aset) — sonic identity gamelan-ish
  pentatonik lembut; stempel "thunk", kertas, bel antrian, sirine IGD.
- Gerak: stempel jatuh, kertas slide, count-up angka — SEMUA skippable/cepat.

## 9. ARSITEKTUR TEKNIS

- **Engine murni** `src/engine/` (nol import React): `advance(state, action,
  content, rng) → {state, events}`. Deterministik penuh (seed di save).
  Action-log = sumber kebenaran skor. Testable headless (vitest + profil
  adversarial ala repo lama).
- **Konten bertipe** `src/content/` (TS strict): kasus klinis, keluarga binaan,
  kader, formularium, katalog lab/edukasi, surat inbox.
- **UI** `src/renderer/`: React + zustand tipis di atas engine; CSS token
  Puskesmas Pagi (tanpa framework CSS).
- **Electron main tipis**: window + save/load atomik ke `userData/saves`.
- Save: JSON versi-berskema, 3 slot + autosave tiap malam.

## 10. VERTICAL SLICE (build sekarang)

Hari 1–7 playable penuh, loop lengkap:
- 14+ kasus poli lintas kategori (port dari 255 kasus lama) + persona + distraktor.
- 6 Keluarga Binaan bernama ber-arc (termasuk **Bu Wulan** 3-babak dengan ending
  bercabang stroke/terkontrol) + 8 kader ber-bias.
- Kunjungan rumah 4 babak dengan gerbang kejujuran + hotspot.
- Inbox bercerita + LANJUTKAN + Tas Kunjungan + Debrief malam + refleksi.
- Peta choropleth 8 RW + tabel KK + provenance chip.
- Dex SKDI (144 siluet, sebagian terisi) + Rapor 4 dimensi live.
- Stempel TEGAK/SUSPEK, allergy firewall, lab besok, gauge Sabar, karma event
  pertama (Bu Wulan D+5 bila diabaikan → IGD scripted ringkas).
- Audio synth dasar + polish stempel/kertas.

**Dipangkas dari slice** (dirancang, belum dibangun): Posyandu/Prolanis/KLB penuh,
Protokol Klinik, Program agregat 184 KK, akreditasi D60, Arena, dosen dashboard.

## 11. KEPUTUSAN PENOLAKAN (dari juri — sama pentingnya)

- ❌ Framing battle pasien (risiko etik; "melawan kabut" pun tetap ditolak dosen).
- ❌ Feedback kebenaran instan per pertanyaan ("Sangat efektif!") — melatih
  brute-force, bukan reasoning. Feedback datang di debrief.
- ❌ Simulasi meja taktil penuh (PaperStack) — 60% risiko teknis; ambil rasa
  kertasnya via CSS, bukan physics.
- ❌ Judul "Kepala Puskesmas" untuk fresh-grad — salah regulasi.
- ❌ Trust naik dari frekuensi kunjungan (grinding hati) — harus dari kualitas MI.
- ❌ Peta jelajah / karakter jalan-jalan — keputusan keystone FM tetap.
