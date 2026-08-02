# Kurasi Musik Latar PRIMERA — untuk dr. Wirayuda

**Status: menunggu pilihan telinga manusia.** Saya (Claude) tidak dapat
mendengar, jadi saya hanya menyiapkan jalurnya dan memverifikasi **lisensinya**.
Pemilihan lagunya milik Anda.

---

## 1. Kenapa musik generatif dihapus

Percobaan sebelumnya membangkitkan musik lewat kode (bebas lisensi, 0 byte).
Anda mendengarnya dan hasilnya: *"suara-suara bunyi-bunyian gak jelas"*.

Itu justru membuktikan batas yang sudah tertulis di
[KEBIJAKAN_ASET_AUDIO.md](./KEBIJAKAN_ASET_AUDIO.md) §6 — parameter bisa saya
verifikasi, **keindahan tidak**. Kodenya sudah dihapus, bukan sekadar
dimatikan. Sekarang jalurnya kembali ke berkas musik asli buatan manusia.

---

## 2. Soal freetouse.com — **tidak bisa dipakai**, dan ini penting

Saya memeriksa lisensinya langsung. Situs itu **tidak aman** untuk kasus kita:

| Klausul | Isi | Akibat untuk PRIMERA |
|---|---|---|
| Lisensi gratis | Penggunaan komersial *"strictly prohibited"* | Status "komersial" perangkat lunak kampus tidak pernah pasti |
| Semua tingkat | *"You may not… distribute, or otherwise make the Digital Assets available to any third party"* | **Membundel ke installer = mendistribusikan** — persis yang dilarang |
| Lisensi gratis | Wajib atribusi | Bisa dipenuhi, tapi tak menyelamatkan dua poin di atas |

Polanya sama persis dengan jebakan Pixabay yang sudah tercatat di kebijakan
kita. "Free to use" berarti **bebas dipakai di video**, bukan bebas
didistribusikan ulang di dalam aplikasi. Kalau dipakai, kita mengulang persis
kejadian OST dulu.

---

## 3. Yang aman: Kevin MacLeod / Incompetech (CC BY 4.0)

Saya verifikasi ke FAQ resminya:

- Lisensi **CC BY 4.0** — boleh dibundel, boleh didistribusikan ulang, boleh
  untuk konteks komersial maupun pendidikan.
- FAQ-nya **secara eksplisit menyebut game**: kredit boleh diletakkan di
  *"credits screen found in the settings menu"* — persis yang PRIMERA punya
  (Pengaturan → Tentang & Kredit).
- Format atribusi yang diminta, harus persis:

  > "Judul Lagu" Kevin MacLeod (incompetech.com)
  > Licensed under Creative Commons: By Attribution 4.0
  > https://creativecommons.org/licenses/by/4.0/

**Cara mencari yang cocok:** buka <https://incompetech.com/music/royalty-free/music.html>,
lalu saring dengan **Genre → Ambient** atau **Feel → Calm / Relaxed**, dan
**Tempo lambat**.

Kriteria yang saya sarankan, mengingat game ini menuntut fokus membaca:

1. **Tanpa lirik.** Riset yang saya lakukan sebelumnya menemukan bukti kuat:
   musik **berlirik** mengganggu tugas membaca (efek g ≈ −0,35), sedangkan
   musik instrumental praktis tidak mengganggu. Ini bukan selera — ini alasan
   pedagogis.
2. **Tanpa perubahan mendadak** — tanpa drum masuk tiba-tiba, tanpa klimaks.
3. **Loop terasa mulus**, karena akan berputar berjam-jam.
4. **Register menengah**, hindari nada tinggi menusuk yang melelahkan di sesi
   panjang.

---

## 4. Alternatif lain yang juga aman

| Sumber | Lisensi | Catatan |
|---|---|---|
| [Free Music Archive](https://freemusicarchive.org) | Campur — **periksa per lagu** | Hanya ambil yang CC0 atau CC BY. Tolak NC/ND dan "FMA-Limited" |
| [OpenGameArt](https://opengameart.org) | Campur — **periksa per berkas** | Banyak musik ambient game; ambil CC0/CC BY/OGA-BY saja |
| [ccMixter](http://ccmixter.org) | Kebanyakan NC | Umumnya **tidak** memenuhi syarat kita |

Aturan tetap: **lisensinya diperiksa per berkas**, bukan per situs. Semua
platform ini mengandalkan pernyataan pengunggah tanpa verifikasi.

---

## 5. Cara memasang lagu yang Anda pilih

Tiga langkah, dan sisanya otomatis:

1. Simpan berkasnya ke `src/renderer/public/bgm/` (mis. `tenang-pagi.mp3`).
2. Tambahkan entri di `src/renderer/src/audio/bgmKredit.ts`:

   ```ts
   export const KREDIT_MUSIK: readonly KreditMusik[] = [
     {
       berkas: 'tenang-pagi.mp3',
       judul: 'Judul Asli Lagu',
       pencipta: 'Kevin MacLeod',
       urlSumber: 'https://incompetech.com/music/royalty-free/...',
       lisensi: 'CC BY 4.0',
       urlLisensi: 'https://creativecommons.org/licenses/by/4.0/',
       suasana: 'title pagi siang sore laporan',
       dimodifikasi: false,
     },
   ]
   ```

3. Jalankan:

   ```bash
   npm run audit:audio
   ```

Gerbang itu **menggagalkan build** bila ada berkas tanpa entri kredit, lisensi
di luar daftar putih, atau sumber tanpa URL. Jadi kejadian OST tidak mungkin
terulang diam-diam.

**Kolom `suasana`** menentukan lagu dipakai di konteks mana — isi dengan kata
kunci yang dipisah spasi: `title`, `pagi`, `siang`, `sore`, `igd`, `laporan`.
Satu lagu boleh melayani semua konteks (tulis semuanya). Bila hanya ada satu
lagu, lagu itu otomatis dipakai di mana-mana.

---

## 6. Yang sudah siap tanpa Anda kerjakan apa-apa

- Pemutar musik: loop, crossfade halus antar-konteks, ikut tombol bisu dan
  slider volume.
- Volume dijaga rendah (plafon 35% dari slider) — pertimbangan lab bersama.
- Kode Hitam meredam musik sesaat ("musik menahan napas"), lalu memulihkannya.
- Setelan **Musik Latar** di Pengaturan, **default mati** dengan catatan
  headphone.
- Bila daftar musik kosong, semuanya jadi hening tanpa error — game tetap
  berjalan normal seperti sekarang.
