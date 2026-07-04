# AUDIT KECUKUPAN KONTEN — pedagogis & fun (2026-07-02)

> Pertanyaan user: apakah jenis & jumlah kasus adekuat, kurang, atau overkill?
> Dihitung dari parameter engine terpasang, bukan perasaan.

## Matematika dasar satu playthrough (90 hari)

| Parameter | Nilai (engine) | Konsekuensi |
|---|---|---|
| Pasien playable | 2/hari (D1-2), 3/hari (D3+) → **±268 encounter** (+±15 pasien kembali/karma) | Kapasitas paparan kasus per stase |
| Slot kunjungan | 1/siang sejak D3 → maks 87; realistis **±40-55 kunjungan** | Kapasitas konten UKM |
| Mastery Dex | ★3 butuh 3× benar → 144 kasus × ~2.5 = **±360 encounter** | Full mastery 1 run MUSTAHIL — memang desainnya lintas playthrough (meta lifetime) |
| Luntur bintang | `LUNTUR_BINTANG_HARI = 5` | **Dikalibrasi utk 16 kasus.** Di 60+ kasus, jeda revisit rata-rata >20 hari → semua bintang luntur sebelum sempat diulang. WAJIB diskalakan saat M3 |

## Verdict

### 1. YANG BENAR-BENAR KURANG (bukan kasus klinis!): konten UKM
12 skenario kunjungan (6 keluarga × 2) vs ±45 slot kunjungan per stase →
**konten UKM kering di minggu ke-2–3**, jauh sebelum kasus klinis terasa kurang.
Prioritas konten #1 = keluarga binaan & skenario kunjungan (M3.15: 6→16 keluarga,
sebagian arc 3 babak → target ±40 skenario), bukan menambah kasus poli.

### 2. YANG PAS — target klinis 144+60+20, DENGAN 4 SYARAT
Checkpoint 60+ cukup untuk ±1 bulan tanpa repetisi terasa; target penuh ±225
BUKAN overkill karena: porting (bukan menulis ulang), daftar 144 = kewajiban
kurikulum (UKMPPD), mastery memang lintas playthrough. TAPI hanya sehat bila:

1. **Bobot prevalensi realistis** — top-20 diagnosis FKTP ≈ 80% kunjungan nyata.
   Spawn uniform = epidemiologi palsu (anthrax sesering hipertensi). Repo lama
   PUNYA `DISEASE_FREQUENCY_WEIGHTS` tapi TIDAK PERNAH diwire — kesalahan yang
   tidak boleh diulang. Wire saat M3: bobot dasar prevalensi × Leitner × musim × kluster.
2. **Pangsa spawn kasus rujukan ±8-12%** — RRNS sehat ≤5%; bila 60 kasus rujukan
   di-spawn uniform dari pool 204, ~29% pasien = kasus rujukan → melatih
   over-refer & mengacaukan guillotine. Library besar boleh, EXPOSURE dikendalikan.
3. **Luntur bintang diskalakan** — 5 hari → ±14-21 hari, atau ★3 dibekukan
   ("dikuasai" permanen per playthrough), saat library >40.
4. **Kedalaman bertingkat** — Tier A (±40 kasus sering: full depth, persona,
   konsekuensi), Tier B (±60: standar), Tier C (±44 langka-tapi-wajib: ringkas,
   fokus kenali-dan-tatalaksana-baku). Tidak semua 144 perlu sedalam dengue.

### 3. RISIKO OVERKILL yang nyata
- Menulis 225 kasus dari nol (JANGAN — port 253+34 aset lama).
- Fun bottleneck setelah ±100 kasus BUKAN jumlah, tapi **monotonnya struktur
  encounter** — investasi marginal lebih baik ke: presentasi atipikal (±20% kasus
  datang dengan keluhan tidak khas — penyakit sama, wajah beda), variasi persona,
  event M2, IGD interrupt. Kasus ke-150 menambah fun lebih sedikit daripada
  10 twist presentasi pada kasus yang ada.

## Ketegangan yang butuh keputusan user (bukan sekarang)
Durasi: 15-30 mnt/hari × 90 hari = **22-45 jam total** vs asumsi lama "5-6 jam".
Untuk deployment kelas justru masuk akal (dicicil sepanjang rotasi stase ±4-6
minggu, ±45-60 mnt/sesi). Bila tetap ingin mode ringkas: "Ujian 30 Hari"
(model B dossier gamifikasi lama) memakai konten yang sama — kandidat pasca-M5.
