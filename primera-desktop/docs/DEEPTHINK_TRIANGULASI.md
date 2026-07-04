# DEEPTHINK — Prompt Triangulasi Strategis PRIMER (M3b)

> **Untuk:** DeepThink (reviewer strategis, bukan auditor kode)
> **Peran:** Berbeda dari CODEX. CODEX memeriksa *apakah kode & konten benar*
> (read-only, forensik). DeepThink memeriksa *apakah keputusan desainnya benar* —
> arah produk, validitas pedagogis-asesmen, dan risiko strategis. Kamu boleh
> membaca kode/dokumen untuk konteks, tapi outputmu adalah PENILAIAN & REKOMENDASI,
> bukan daftar bug.
> **Tanggal:** 2026-07-03 · Basis: HEAD branch `claude/vigorous-bose-f66bc6`

---

## 0. KONTEKS 90 DETIK

PRIMER = game desktop Electron, *"Football Manager-nya kedokteran komunitas dengan
hati Harvest Moon"*. Pemain = dokter fresh-grad, stase 90 hari di Puskesmas desa.
Pemakai: ±50 mahasiswa FK Indonesia yang **DINILAI dari skor game** → integritas
asesmen = kepentingan produk, bukan hiasan. Dev = solo (Dr. Wirayuda) + AI.

**Status saat ini (M0–M3b selesai):** loop harian 3 blok turn-based, klinik Lembar
Periksa, UKM 3 lapis (kader-scout + kunjungan 4-babak gerbang kejujuran), M1 bridge
UKM↔UKP (surveilans, drift, KBK, follow-up, SDOH armor), M2 program terjadwal
(Posyandu/Prolanis/KLB + Lokakarya Mini + rival ghost), M3 rujukan berjenjang
(SISRUTE + PRB + confidence-tag), 67 kasus poli + 5 IGD, kalender musiman. Skor 4
dimensi (UKP 35 / UKM 35 / Manajemen 15 / Resiliensi 15) + Referral Guillotine.
~114 test, deterministik. Roadmap sisa: M4 ekonomi, M5 endgame 90-hari, M6 kelas &
dosen, M7 polish, M8 Arena.

Baca untuk konteks (tidak wajib semua): `docs/GDD.md`, `docs/ROADMAP.md`,
`docs/KONTEN_BALANCE.md` (audit kecukupan konten), `src/engine/scoring.ts`.

## 1. HIERARKI PRIORITAS (jangan dibalik saat menilai)

integritas pedagogis > integritas asesmen/anti-forgery > retensi > kompetisi > fun kasual.

## 2. ENAM PERTANYAAN STRATEGIS (inti tugasmu)

### Q1 — Durasi vs realitas kelas (KONTEN_BALANCE mencatat 22–45 jam total)
90 hari × 15–30 menit = 22–45 jam. Apakah ini aset (mendalam, dicicil sepanjang
rotasi 4–6 minggu) atau liabilitas (mahasiswa tak selesai → data asesmen bolong)?
Haruskah ada **mode "Ujian 30 Hari"** (seed deterministik, subset kasus, ~8 jam)
sebagai jalur asesmen utama, dengan mode 90-hari jadi "karier" opsional? Trade-off
pedagogis stase-penuh vs ujian-ringkas?

### Q2 — Validitas mekanik penilaian BARU (belum pernah divalidasi eksternal)
Sejak dossier lama, banyak mekanik skor baru: **confidence-tag** (rujukan tepat +bonus,
melawan guillotine), **stempel TEGAK/SUSPEK** (kalibrasi 0.9 suspek-benar vs 0.4
suspek-salah vs tegak), **IGD Kode Hitam −3 UKP**, **SDOH armor** (trust dipangkas bila
hipotesis salah pada keluarga miskin). Pertanyaan: apakah bobot-bobot ini
mengukur kompetensi yang benar, atau menciptakan strategi dominan yang bukan
"jadi dokter baik"? Mana yang berisiko mengajarkan *hidden curriculum* keliru
(mis. SUSPEK-selamanya sebagai lindung nilai, atau menghindari IGD)?

### Q3 — Cakupan kurikulum vs pengalaman (guardrail prevalensi)
Kami memasang bobot prevalensi (kasus sering ×3, jarang ×0.6) + cap 1 rujukan/pagi
agar epidemiologi realistis. TAPI ini bisa berarti mahasiswa jarang bertemu kasus
langka-tapi-wajib-UKMPPD. Apakah Director harus punya **"jaminan paparan kurikulum"**
(tiap kasus 4A muncul ≥1× per stase, tiap kategori tersentuh per bulan) yang meng-
override prevalensi? Bagaimana menyeimbangkan realisme epidemiologi vs kelengkapan
paparan untuk persiapan ujian?

### Q4 — UKM: apakah "manajemen populasi" sudah cukup bergigi?
Juri panel dulu mengkritik "manajemen populasi tipis". Kami tambah kader-scout ber-bias
+ program agregat wilayah. Apakah ini cukup mensimulasikan peran dokter FKTP sebagai
*supervisor sistem data* (bukan pengumpul data)? Atau UKM masih terlalu "kedokteran
relasi 6 keluarga"? Apa satu penambahan berdampak-tertinggi untuk M4/M5 di ranah UKM?

### Q5 — M6 (kelas & dosen): arsitektur integritas asesmen
Rencana M6: rekomputasi skor dari action-log + ekspor "Dossier Mahasiswa" ber-checksum
(offline-first) + Dosen Dashboard opsional (Supabase). Pertanyaan strategis: untuk 50
mahasiswa yang dinilai, apakah **offline-first + checksum HMAC lokal** cukup melawan
forgery (mahasiswa mengedit save), atau WAJIB ada verifikasi server-side (seperti
keputusan keystone dossier lama)? Trade-off kompleksitas solo-dev vs integritas nilai?

### Q6 — Urutan roadmap: M4 (ekonomi) vs lompat ke M5/M6?
Ekonomi saat ini kosmetik (kapitasi >> biaya). M4 akan memberinya gigi (stok obat,
defisit, akreditasi audit rekam medis). TAPI: apakah ekonomi bergigi menambah beban
kognitif tanpa nilai pedagogis proporsional untuk mahasiswa FK (vs residen manajemen)?
Haruskah M4 dipangkas/ditunda demi M5 (endgame 90-hari yang membuat stase *terasa
selesai*) dan M6 (yang membuat game *bisa dipakai menilai*) lebih dulu?

## 3. FORMAT OUTPUT YANG DIMINTA

Untuk tiap Q1–Q6:
- **Penilaian** (2–4 kalimat): posisimu, dengan alasan berbasis literatur pendidikan
  kedokteran / desain game bila relevan.
- **Rekomendasi konkret** (1 kalimat actionable).
- **Tag keyakinan:** [Kuat] / [Sedang] / [Spekulatif].

Lalu:
- **Satu keputusan yang paling kamu khawatirkan** (blind spot yang tim mungkin lewatkan).
- **Satu hal yang tim lakukan BENAR** dan tidak boleh diubah karena tekanan fitur.

## 4. BIAS-CHECK MANDATORY (jawab singkat di akhir)

- Apakah rekomendasimu bias ke "tambah fitur" padahal solo-dev + deadline? Koreksi.
- Apakah kamu mengasumsikan pemain = gamer hardcore, padahal mereka mahasiswa FK
  yang mungkin tak suka game? Koreksi.
- Di mana kamu paling mungkin SALAH?

---

*Triangulasi PRIMER: Claude (builder) · CODEX (auditor kode & medis, read-only) ·
DeepThink (reviewer strategis). Ketiganya independen; sintesis oleh Dr. Wirayuda.*
