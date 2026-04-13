# Wilayah Preview Release Notes

Tanggal: 2026-04-14
Branch: `codex/wilayah-preview-shell`
PR: `#1`
Status: Draft preview candidate

## Ringkasan

Branch ini merapikan Wilayah agar kembali selaras dengan blueprint peta desa: peta 2D diposisikan sebagai gameplay canonical, sementara 3D direposisi menjadi exhibition shell dan pocket inspector yang lebih ringan. Paket ini juga membawa pondasi shell mobile serta selector bahasa awal untuk `id` dan `en`.

## Highlight Utama

### 1. 2D map dikunci sebagai source of truth operasional
- Wilayah runtime difokuskan ke denah 2D untuk layer `general`, `pispk`, `surveillance`, `psn`, `phbs`, dan `perilaku`.
- Pembacaan blank spot, layer legend, semantic zoom, dan cue naratif kembali dipusatkan ke alur 2D.
- Legacy path yang membuat 3D terasa seperti mode gameplay harian mulai diturunkan perannya.

### 2. 3D dipindah dari mode harian ke exhibition plus inspector
- `WilayahDiorama` dirapikan menjadi `ExhibitionVillageDiorama` agar fungsi komponen lebih eksplisit.
- Full-village 3D diposisikan sebagai showcase, bukan layar taktis utama.
- Pocket diorama untuk inspector memakai capability gate: desktop bisa hidup sebagai canvas 3D, mobile diarahkan ke snapshot statis yang lebih aman.

### 3. Inspector Wilayah lebih naratif dan lebih siap mobile
- Snapshot inspector mendapatkan struktur yang lebih rapi untuk bottom sheet mobile.
- Dossier bangunan/RW makin jelas, termasuk subset bangunan naratif yang dekat dengan runtime.
- RTK dan Padepokan Dukun sudah diperlakukan sebagai scene naratif unik, bukan sekadar marker pasif.

### 4. i18n mulai masuk ke shell Wilayah dan snapshot
- Selector bahasa awal `id` + `en` sudah dipasang di shell.
- Microcopy snapshot/exhibition tidak lagi hardcoded di komponen utama.
- Resource Wilayah dan emergency mendapat coverage locale yang lebih tertata.

## Dampak ke Pengalaman Main

- Pemain lebih jelas membaca Wilayah sebagai papan intelijen 2D, bukan toggle bingung antara 2D dan 3D.
- Mobile mendapat alur yang lebih masuk akal karena inspector tidak memaksa WebGL aktif setiap saat.
- Laptop menengah dan device yang sensitif terhadap WebGL diharapkan lebih stabil karena 3D tidak lagi dipanaskan terus-menerus dari jalur gameplay harian.

## Validasi yang Sudah Lewat

- `npm run build`
- targeted lint/tests untuk bundle Wilayah + pocket diorama
- preview deploy Vercel `READY` untuk commit `8790fd9`
- visual QA otomatis terhadap preview live pada desktop `1366x768` dan mobile `390x844`

Artefak QA lokal:
- `diagnostics/preview_visual_qa_2026-04-13/report.md`
- `diagnostics/preview_visual_qa_2026-04-13/desktop_1366x768/`
- `diagnostics/preview_visual_qa_2026-04-13/mobile_390x844/`

## Yang Sudah Cukup Final di Paket Ini

- 2D sebagai layar operasional utama
- exhibition shell 3D sebagai posisi arsitektural baru
- pocket diorama snapshot/mobile fallback
- mobile navigation hooks untuk menuju Wilayah
- selector bahasa dasar `id` + `en`
- i18n resource awal untuk shell Wilayah dan emergency

## Yang Masih Provisional

- polish visual akhir per-layer masih bisa ditune lagi setelah review screenshot
- full closure semua item `final vs provisional` blueprint desa belum selesai
- release readiness seluruh game belum bisa disimpulkan dari branch ini saja karena repo utama masih punya banyak perubahan lain di luar scope PR
- preview Vercel masih dilindungi authentication normal, jadi alur review eksternal perlu link share atau akses akun

## Saran Review

Fokus reviewer sebaiknya ke tiga hal:

1. Mental model: apakah Wilayah sekarang terasa tegas sebagai 2D tactical board?
2. Mobile readability: apakah bottom sheet inspector sudah cukup premium dan tidak sesak?
3. 3D scope discipline: apakah exhibition/pocket diorama sudah terasa sebagai lapisan empati, bukan kompetitor terhadap 2D?

## Next Step yang Disarankan

1. Review screenshot pack dan beri tanda pada area yang masih terlalu padat atau terlalu redup.
2. Putuskan apakah draft PR ini cukup matang untuk dipromosikan dari draft ke ready for review.
3. Lanjutkan backlog blueprint desa yang masih provisional, terutama pass visual akhir dan closure item phase mobile/multilingual berikutnya.
