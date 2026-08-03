# Prosedur Rilis PRIMERA

**Berlaku sejak 2026-08-03.** Ditulis setelah audit menemukan installer
beta.13 tidak dapat dibuktikan berasal dari sumber mana pun.

## Kenapa dokumen ini ada

Rilis beta.12 dan beta.13 dibuat dengan cara yang tampak benar tetapi
menghasilkan bukti asal-usul yang keliru:

| Yang terjadi | Akibatnya |
|---|---|
| `gh release create <tag-baru>` dijalankan tanpa `--target` | GitHub membuat tag itu di **branch default (`master`)**, bukan di commit yang namanya tertulis pada tag. Tag `test-beta-72a1342` justru menunjuk `76a2e8c`. |
| Kenaikan versi di `package.json` belum di-commit saat `npm run dist` | Biner menyebut dirinya beta.13, sedangkan tidak ada satu pun commit yang berisi angka itu. |
| `package-lock.json` tidak ikut dinaikkan | Lockfile tertinggal di beta.9 selama empat rilis. |

Tidak ada yang rusak secara fungsional — installernya jalan. Yang rusak
adalah **kemampuan membuktikan** biner itu berasal dari sumber yang mana.
Itu penting justru karena PANDUAN_DOSEN menyuruh dosen memverifikasi dossier
mahasiswa berdasarkan versi.

---

## Urutan yang benar

1. **Selesaikan seluruh perubahan kode**, termasuk test hijau dan typecheck
   bersih.

2. **Naikkan versi di DUA tempat** — `package.json` dan `package-lock.json`
   (field `version` di akar dan di `packages[""]`). Gerbang
   `npm run check:provenance` menolak bila keduanya beda.

3. **Commit semuanya.** Kenaikan versi harus ikut di commit yang sama dengan
   kode yang dibangun. Working tree wajib bersih sebelum build.

4. **Build:**

   ```bash
   npm run dist
   ```

   Langkah pertamanya adalah `check:provenance`, yang akan **menolak** bila
   working tree kotor, versi tak seragam, atau tag versi itu sudah menunjuk
   commit lain. Gerbang ini boleh dilewati **hanya** untuk uji lokal yang
   tidak dibagikan:

   ```bash
   IZINKAN_RILIS_KOTOR=1 npm run dist
   ```

5. **Buat tag TEPAT di commit sumber, dan push tag itu lebih dulu:**

   ```bash
   git tag -a test-beta-<hash7> <hash7> -m "PRIMERA <versi>"
   git push origin test-beta-<hash7>
   ```

6. **Baru buat rilis memakai tag yang sudah ada:**

   ```bash
   gh release create test-beta-<hash7> <berkas...> --prerelease --title "..." --notes "..."
   ```

   Karena tag sudah ada, GitHub tidak akan membuatnya sendiri dan
   `targetCommitish` tidak lagi relevan.

7. **Verifikasi sesudahnya** — jangan percaya bahwa langkah 5-6 berhasil:

   ```bash
   git fetch --tags --force
   git rev-parse test-beta-<hash7>^{commit}     # harus == commit sumber
   gh release view test-beta-<hash7> --json tagName,targetCommitish
   ```

---

## Memperbaiki tag yang sudah terlanjur salah

Tag boleh dipindahkan ke commit yang benar; berkas rilis tidak ikut hilang
karena aset menempel pada rilis, bukan pada tag.

```bash
git tag -f -a test-beta-<hash7> <hash7> -m "PRIMERA <versi>"
git push --force origin test-beta-<hash7>
```

Lakukan ini **hanya** untuk memperbaiki data yang memang salah, dan catat di
catatan rilis bahwa tag-nya pernah dikoreksi.

---

## Yang diperiksa otomatis

| Gerbang | Kapan jalan | Menolak apa |
|---|---|---|
| `npm run check:provenance` | awal `npm run dist` | working tree kotor, versi package/lock beda, tag versi menunjuk commit lain |
| `src/versiKonsisten.test.ts` | tiap `vitest` | versi package/lock beda, layar Tentang memakai versi yang dipaku |
| `npm run check:bgm-license` | `pack` & `dist` | berkas musik tanpa lisensi |
| `npm run audit:audio` | `pack` & `dist` | audio tanpa entri kredit / lisensi di luar daftar putih |

---

## Versi karya vs versi rilis — jangan tertukar

- `METADATA.versi` (`src/content/metadata.ts`) = **versi karya terdaftar**
  (HKI). Ini memang tidak berubah tiap build. Jangan dinaikkan mengikuti
  rilis.
- `package.json` → `app.getVersion()` = **versi rilis**. Inilah yang dipakai
  layar Tentang & Kredit, ekspor dossier, dan pemeriksa pembaruan. Ketiganya
  membaca sumber yang sama supaya tidak mungkin berselisih.
