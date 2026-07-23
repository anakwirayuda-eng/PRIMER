# Pedoman Authoring UI — Konvensi Terkunci (2026-07-23)

Konvensi hasil pass UX premium 2026-07-23 + adjudikasi triangulasi DeepThink
(`DEEPTHINK_UIUX_PREMIUM_TRIANGULASI_2026-07-23.md`). Berlaku untuk semua layar
baru; perubahan konvensi lewat decision log, bukan diam-diam.

## 1. Tooltip

- **Default:** atribut `data-tip="..."` — dirender `TooltipInstan` global
  (hover + fokus keyboard, tanpa delay). JANGAN memakai `title` untuk elemen
  yang selalu aktif.
- **Kontrol yang bisa `disabled` native:** Chromium menekan mouse-event pada
  elemen disabled, jadi pakai **pola dual**:
  `title={nonaktif ? alasan : undefined}` + `data-tip={bantuanSaatAktif}`.
  `title` di sini adalah fallback sah dan DIPERTAHANKAN — jangan "dirapikan".
  (Q7: refactor massal ke `aria-disabled` DITOLAK — DOM bengkak, guard
  onClick/keyboard manual, dan memutus kontrak test `toBeDisabled()`.)
- `data-tip` murni visual. Informasi yang sama WAJIB tetap sampai ke screen
  reader lewat teks terlihat, `aria-label`, atau `aria-describedby`.
- Jangan pernah memasang `title` dan `data-tip` aktif bersamaan (dobel tooltip).

## 2. Konfirmasi (DialogGame)

- `window.confirm/alert` DILARANG — selalu `DialogGame` (fokus awal ke
  kontainer, Esc = batal, terdaftar di kontrak `lapisan.test.ts`).
- **Peta konfirmasi terkunci (Q8):** dialog HANYA untuk (a) semua jalur
  timpa-arsip/autosave, (b) tombol **Keluar** aplikasi. Aksi berfrekuensi
  tinggi (LANJUTKAN, Tutup Poli, Delegasi kader, pindah fase) sengaja TANPA
  dialog — memagarinya melatih *confirmation fatigue* dan menumpulkan dialog
  yang sungguh penting; konsekuensi keliru adalah bahan pembelajaran
  (debrief/rapor), bukan urusan antarmuka yang mengasuh.

## 3. Keyboard

- Hotkey global baru wajib lewat gate: mati saat mengetik
  (`sedangMengetik`), saat `[role="dialog"]` terbuka, dan menghormati
  `alasanTabNonaktif` (jangan pernah menduplikasi logika gate di dua tempat).
- Kolom pencarian: Esc dua-tahap (bersihkan → lepas fokus), tombol ✕, dan
  `spellCheck={false} autoComplete="off"` pada semua input/textarea ketik.
- Shortcut baru WAJIB didaftarkan di `PintasanModal`.

## 4. Preferensi UI

- Preferensi kosmetik (laci akordeon, dsb.) persist ke localStorage via
  `utils/laciPersist.ts` — BUKAN ke state save/skor.

## 5. Feedback operasi async

- Operasi simpan/ekspor tidak boleh sukses senyap — beri status sesaat
  ("menyimpan… / ✓ tersimpan"); kegagalan lewat DialogGame mode pemberitahuan.
