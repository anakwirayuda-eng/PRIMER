# M13-0C - Integrity Release

Tanggal implementasi: 2026-07-14
Branch: `codex-gpt56-experiment`
Status: exit criteria terpenuhi; siap checkpoint commit dan verifikasi independen.

## 1. Kontrak rilis

- Rilis aktif awal: `m13-0c-2026-07-14`.
- Baseline eksplisit untuk save pra-0C: `legacy-baseline`.
- `CONTENT_RELEASE` terpisah dari `REVISI_ENGINE` dan `sidikJariPack`.
- Urutan rilis disimpan eksplisit; id rilis tidak dibandingkan secara leksikal.
- Policy dengan id rilis asing bersifat fail-closed.

`GameState` baru selalu menyimpan `contentRelease`. `deserialize()` memetakan
field yang hilang ke `legacy-baseline` melalui jalur khusus, bukan melalui
`tandaiMigrasi`, sehingga `tallyTermigrasi` tidak tercemar oleh metadata rilis.

## 2. Perilaku save

| Kondisi | Perilaku |
|---|---|
| Save dan build memakai rilis sama | Dapat dilanjutkan |
| Save pra-0C tanpa field rilis | Dibaca sebagai `legacy-baseline`, arsip saja |
| Save rilis berbeda | Tetap terlihat dan dapat diekspor, tetapi Continue/import/muat-slot ditolak |
| Save rusak/asing | Tetap mengikuti jalur `arsipKorup` lama |

Layar judul tidak menimpa arsip beda rilis secara diam-diam. Pemain dapat
mengekspor JSON lama sebelum secara eksplisit memulai stase baru. Build lama
tidak diemulasikan di runtime build baru.

## 3. Dossier dan verifier

- `lingkungan.contentRelease` masuk objek yang ditandatangani HMAC.
- Verifier memeriksa HMAC lebih dulu agar id rilis dapat dipercaya.
- Setelah HMAC, release mismatch diperiksa sebelum fingerprint dan replay.
- Mismatch menghasilkan `tidak_dapat_diverifikasi`, bukan `tidak_sah`.
- Dossier pra-0C tanpa field rilis diperlakukan sebagai `legacy-baseline`
  tanpa memodifikasi objek sebelum pemeriksaan HMAC.

## 4. Manifest runtime dan isolasi mode

Blueprint authoring tetap menyimpan evidence lengkap di luar engine. `PACK`
hanya membawa proyeksi runtime berisi archetype klinik/IGD, skenario UKM,
mode policy, release policy, dan credit edges.

Policy diterapkan pada seluruh pintu yang dapat mewujudkan encounter:

- clinic director;
- tutorial paksa hari pertama;
- karma terjadwal dan pasien kembali;
- pool IGD;
- kunjungan UKM, di reducer dan cermin guard UI.

Fixture engine mini tanpa manifest tetap didukung untuk unit test terisolasi.
Sebaliknya, `PACK` produksi bertipe `RuntimeContentPack`, dan `validasiPack()`
menolak manifest hilang, ref duplikat/yatim, release id asing, serta drift
`channel`, `prevalensi`, dan `targetFktp` dari konten sumber.

## 5. Determinisme dan fingerprint

- Pool IGD difilter lalu diurutkan `id` sebelum `rngIgd.pick()`.
- Calon karma memakai secondary key `id` bila `hari` sama.
- `sidikJariPack` kini mencakup `contentRef`, `channel`, `severityDegree`,
  `targetFktp`, `prevalensi`, `modePolicy`, `releasePolicy`, `credits`,
  excluded-credit metadata, UKM runtime policy, dan urutan rilis.
- Nilai `CONTENT_RELEASE` sendiri sengaja tidak masuk hash karena mekanismenya
  terpisah dan dibandingkan langsung.

## 6. CI dan arsip build kohort

Workflow `.github/workflows/primera-desktop.yml` menjalankan pada Windows:

```text
npm ci
npm test
npm run typecheck
npm run build
npm run check:bgm-license
```

Pemicu manual dengan `cohort_id`, `cohort_start`, dan `cohort_end` juga
membangun installer NSIS, menghasilkan manifest, lalu mengunggah installer dan
manifest sebagai satu artifact. Generator membaca langsung `PACK`,
`REVISI_ENGINE`, dan `sidikJariPack`; SHA-256 installer dihitung streaming.

```powershell
npm run cohort:manifest -- --installer "dist/<installer>.exe" `
  --cohort-id "fk-2026-a" --cohort-start "2026-09-01" `
  --cohort-end "2026-11-30"
```

Generator menolak slug berbahaya, tanggal kalender tidak valid, rentang
terbalik, hash palsu, atau metadata kosong. Artifact GitHub 90 hari adalah
jalur transport/audit CI, bukan satu-satunya arsip. Installer + manifest final
wajib disalin ke penyimpanan institusional tahan lama sebelum cohort dimulai.

## 7. Scope yang tidak berubah

- `MAKS_BINAAN` tetap 16 karena tidak ada keluarga baru di 0C; test kapasitas
  16/17 yang sudah ada tetap menjadi pagar.
- Tidak ada perubahan konten medis atau keputusan EBM pada milestone ini.
- Tidak ada pekerjaan M13-0D yang dimulai.
- Exact tanggal cohort mahasiswa belum ditetapkan oleh implementasi; workflow
  mewajibkan operator memasukkannya saat membuat build distribusi final.

## 8. Unfreeze

`REVISI_ENGINE` dibump 32 -> 33. Enam file beku yang memang berubah adalah
`reducer.ts`, `director.ts`, `init.ts`, `verifikasi.ts`, `state.ts`, dan
`save.ts`. Hash freeze dihitung ulang hanya setelah seluruh kode, test, CI,
dan dokumentasi milestone selesai.

## 9. Verifikasi exit

Verifikasi lokal final pada 2026-07-14:

- full suite: **74 file / 820 test lulus**;
- Golden Master freeze: **16/16 lulus** di dalam full suite;
- `npm run typecheck`: lulus;
- `npm run build`: lulus;
- `npm run check:bgm-license`: lulus;
- `npm run dist`: lulus dan menghasilkan installer NSIS Windows;
- `git diff --check`: lulus sebelum checkpoint.

Manifest yang memakai commit SHA checkpoint dibuat setelah commit, agar hash
installer dan identitas source tidak mengklaim commit pra-checkpoint. Manifest
lokal tersebut hanya artefak validasi teknis M13-0C; manifest distribusi kohort
tetap wajib memakai id serta tanggal cohort nyata.
