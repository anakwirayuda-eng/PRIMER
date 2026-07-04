# Telemetri Wall-Clock — Deteksi Save-Scumming (DeepThink ronde-2, keputusan user)

## Masalah

DeepThink menunjukkan: mahasiswa bisa mem-backup file save, mengambil keputusan
berisiko (mis. IGD), lalu bila hasilnya buruk — timpa kembali dengan backup dan
coba lagi. Engine PRIMER sengaja **deterministik murni** (nol `Date.now()`/
`Math.random()` di `src/engine/`) demi replay verifier M6 (`verifikasiDossier`)
— jadi save-scumming tak bisa dideteksi dari ISI save sendiri: memuat backup
lama justru MENGGANTI `jejak` (jurnal aksi) dengan versi yang lebih pendek,
jadi tidak ada "riwayat lebih panjang" yang tertinggal untuk dibandingkan.

## Prinsip desain

**Engine tetap murni.** Wall-clock TIDAK BOLEH masuk ke `GameState`, `Action`,
atau memengaruhi `hitungSkor`/replay. Deteksi save-scumming adalah lapisan
**forensik terpisah**, bukan bagian dari skor — dosen melihatnya sebagai
peringatan tambahan di samping (bukan menggantikan) vonis SAH/TIDAK SAH yang
sudah ada.

## Mekanisme

1. **Log telemetri terpisah** (`telemetri.jsonl`, folder `userData` — BUKAN di
   dalam slot save mana pun) — append-only, satu baris JSON per autosave:
   `{ t: Date.now(), hari, blok, jejakLen }`. Karena file ini terpisah dari
   save slot, memuat ulang backup save TIDAK memutar-balik log ini.
2. `Date.now()` HANYA dipanggil di titik ini (renderer `store.ts`, bukan
   `src/engine/`) — satu-satunya pengecualian terdokumentasi terhadap aturan
   "engine tanpa wall-clock", dan sengaja diisolasi di luar engine.
3. **Analisis murni** (`src/engine/telemetriAudit.ts`, testable tanpa
   `Date.now()` — cuma memproses baris yang SUDAH direkam): mendeteksi
   - **hari mundur** tanpa reset sesi baru (jejakLen tak jatuh ke ~0) → indikasi
     kuat save lama dimuat ulang.
   - **jejak menyusut** (jejakLen turun) padahal hari tidak reset → sama.
   - Progres wall-clock vs hari HANYA informatif (bukan bukti) — pemain cepat
     yang sah tetap mungkin.
4. **UI dosen**: input file opsional "Impor Log Telemetri" di samping
   "Verifikasi Dossier" (`TitleScreen.tsx`) — menjalankan `auditTelemetri()`
   dan menampilkan daftar peringatan (jika ada) berdampingan dengan stempel
   SAH/TIDAK SAH. Tidak mengubah `HasilVerifikasi.status`.

## Batasan yang disadari

- Log ini ada di mesin mahasiswa sendiri — bisa dihapus manual. Ini bukan
  anti-cheat tamper-proof, hanya menaikkan biaya usaha curang & memberi sinyal
  forensik tambahan bagi dosen yang curiga, konsisten dengan filosofi PRIMER
  sebagai alat edukasi (bukan kompetisi berperingkat ketat).
- Autosave tak selalu terjadi tiap aksi (lihat `AKSI_AUTOSAVE`/`EVENT_AUTOSAVE`
  di `store.ts`) — resolusi log sekasar titik-titik autosave, bukan tiap klik.
