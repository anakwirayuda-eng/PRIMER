# Kebijakan Aset Audio PRIMERA

**Berlaku sejak 2026-08-02.** Dokumen ini mengikat: setiap penambahan bunyi ke
PRIMERA harus lolos aturan di sini.

## Mengapa dokumen ini ada

PRIMERA pernah memakai **7 track OST Square Enix** (Chrono Cross, Final
Fantasy VIII) sebagai musik latar. Tidak ada lisensi distribusinya. Berkasnya
harus dihapus, musik latar dimatikan total, dan sejak itu game berjalan **tanpa
musik sama sekali** selama berbulan-bulan. Sebuah gerbang build
(`scripts/check-bgm-license.js`) sampai sekarang menjaga agar berkas itu tak
pernah masuk installer lagi.

Kebijakan ini supaya kejadian itu tidak terulang.

---

## 1. Posisi saat ini: musik disintesis, bukan berkas

Musik latar PRIMERA **dibangkitkan kode** (`src/renderer/src/audio/ambient.ts`)
memakai Web Audio API. Tidak ada satu berkas musik pun di dalam installer.

Alasannya berlapis:

| | Berkas musik | Sintesis prosedural |
|---|---|---|
| Risiko lisensi | Ada selamanya — lisensi bisa berubah/dicabut | **Nol** — tak ada yang bisa dicabut |
| Ukuran installer | +5-30 MB | **0 byte** |
| Pengulangan | Loop 2-3 menit, terasa setelah stase 90 hari | Tak pernah berulang persis |
| Variasi konteks | Butuh 6 berkas berbeda | Parameter, bukan aset |
| Atribusi | Wajib dijaga & bisa keliru | Tidak perlu |

**Konsekuensi jujurnya:** musik sintesis tidak akan sekaya musik yang digubah
dan direkam manusia. Itu pertukaran yang diambil sadar.

---

## 2. Daftar putih lisensi — HANYA ini yang boleh masuk

Bila kelak berkas audio benar-benar ditambahkan, **hanya** lisensi berikut:

- **CC0 1.0** / Public Domain Mark
- **CC BY 4.0** atau **CC BY 3.0** (wajib atribusi lengkap di dalam aplikasi)
- **Artistic License 2.0**, **MIT**, atau lisensi bebas OSI setara
- **OGA-BY 3.0**

**DITOLAK MUTLAK** — jangan diperdebatkan per kasus:

- Semua varian **NC** (NonCommercial) — status "komersial" perangkat lunak
  kampus tidak pernah pasti, dan penolakan lebih murah daripada sengketa
- Semua varian **ND** (NoDerivatives) — memotong/fade/loop = karya turunan
- **CC Sampling Plus**
- **Pixabay Content License** — lihat §3
- **FMA-Limited (Download Only)**
- **YouTube Audio Library** (lisensinya terikat pemakaian di YouTube)
- "**Royalty-free**" tanpa teks lisensi yang bisa dilampirkan — istilah
  pemasaran, bukan lisensi

---

## 3. Jebakan yang sudah terverifikasi (jangan diulang)

**Pixabay bukan CC0.** Kesalahpahaman paling umum. Rezim CC0 Pixabay berakhir
**9 Januari 2019**, sedangkan Pixabay Music baru diluncurkan **Maret 2020** —
jadi tidak ada satu pun musik Pixabay yang pernah CC0. Terms-nya juga melarang
distribusi konten "as an audio file on a standalone basis", dan berkas di
folder `resources` yang dapat diekstrak persis aslinya berada tepat di klausul
itu. **Coret Pixabay dari daftar kandidat.**

**Platform tidak memverifikasi unggahan.** Freesound, OpenGameArt, Free Music
Archive, dan Musopen semuanya mengandalkan pernyataan pengunggah. Musopen
menyatakannya terbuka. Artinya: label "CC0" di halaman unduhan **bukan
jaminan** — periksa per berkas, bukan per situs.

**Komposisi domain publik ≠ rekaman domain publik.** Rekaman adalah karya
berhak cipta terpisah dengan masa lindung sendiri. Ini jebakan paling sering di
musik klasik.

**Ada di Internet Archive ≠ domain publik.** Banyak rip LP gamelan di sana
adalah unggahan pihak ketiga tanpa hak.

**Content ID.** Meski aplikasi ini luring, dosen/mahasiswa yang merekam sesi
permainan bisa terkena klaim otomatis YouTube. Uji dulu tiap track lewat unggahan
privat sebelum dipakai.

---

## 4. Kepekaan budaya — laras gamelan

Musik PRIMERA terinspirasi laras **slendro** dan **pelog** karawitan Jawa.
Aturan yang berlaku:

1. **Tangga nada tidak berhak cipta; komposisi berhak cipta.** Kami membangkitkan
   melodi sendiri di atas laras tersebut — **tidak pernah** mengutip gendhing
   tradisional.
2. **JANGAN pernah menulis "public domain" untuk melodi gamelan tradisional.**
   Menurut **UU 28/2014 Pasal 38**, hak cipta Ekspresi Budaya Tradisional
   dipegang **Negara tanpa batas waktu**, dan penjelasannya menyebut musik
   instrumental secara eksplisit.
3. **Jangan mengutip repertoar pusaka/sakral** atau menautkan musik ke konteks
   upacara. Pemakaian PRIMERA sekuler dan edukatif.
4. **Laras tidak terstandar.** Tiap perangkat gamelan ditala sendiri (*embat*),
   jadi nilai sen di kode kami adalah pilihan estetika, bukan transkripsi
   perangkat tertentu — dan ditulis begitu di komentar kodenya.
5. Kalimat yang benar untuk kredit:
   > *"Musik latar disintesis prosedural, terinspirasi laras slendro dan pelog
   > karawitan Jawa; bukan rekaman gamelan dan tidak mengutip gendhing pusaka."*

> **Catatan untuk dr. Wirayuda:** bila musik ini akan dipakai luas dalam
> pendidikan kedokteran Indonesia, akan sangat baik meminta pendapat satu
> pengajar karawitan. Nilai laras di kode adalah pilihan estetika pengembang,
> dan pandangan ahli akan lebih berbobot daripada aproksimasi kami.

---

## 5. Bila kelak menambah berkas audio — prosedur wajib

1. Catat entri di `src/renderer/src/audio/credits/audio-credits.json`:
   berkas, judul, pencipta, URL sumber, lisensi, URL legalcode, tanggal unduh,
   dan apakah dimodifikasi.
2. **Arsipkan bukti**: simpan salinan HTML/tangkapan layar halaman lisensi ke
   `docs/lisensi-bukti/`. Inilah satu-satunya yang menyelamatkan bila sumber
   mengubah atau menghapus lisensinya kelak.
3. Sertakan **teks penuh lisensi** di `resources/licenses/` lewat
   `extraResources` — aplikasi ini luring, menautkan ke creativecommons.org
   tidak memenuhi syarat atribusi "reasonable manner based on the medium".
4. Tampilkan kredit di layar **Tentang & Kredit**, dapat dibuka tanpa harus
   menyelesaikan permainan.
5. Tetap cantumkan kredit untuk aset **CC0** meski tak diwajibkan hukum: di
   Indonesia hak moral tidak dapat dialihkan (UU 28/2014), dan biayanya nol.

---

## 6. Batas verifikasi yang jujur

Pengembang AI yang menulis musik ini **tidak dapat mendengar**. Yang dapat
diverifikasi secara otomatis hanyalah **parameter**: laras, register, tempo,
plafon gain, dan pagar keselamatan pendengaran — semuanya diuji di
`src/renderer/src/audio/ambient.test.ts`.

**Yang wajib dilakukan manusia sebelum musik dianggap layak rilis:**

- Dengarkan **45-60 menit menerus** di build Electron sungguhan (bukan dev
  server, bukan unit test). Yang dicari: pola yang mulai terasa berulang, nada
  yang mulai mengganggu, atau kombinasi yang denyutnya kasar.
- Uji di **speaker laptop murah**, bukan hanya headphone bagus.
- Uji di **ruangan berisi beberapa mesin** bila akan dipakai di lab.

Musik latar **default MATI** justru karena alasan terakhir: riset audio
menunjukkan 30 mesin memutar ambient beda-fase menaikkan derau ruangan
sekitar 15 dB. Setelan ini ditujukan untuk pemakaian dengan headphone.

---

## 7. Catatan hukum

Ini riset teknis untuk mempersempit pilihan, **bukan nasihat hukum**. Untuk
distribusi ke banyak institusi, mintalah tinjauan singkat ke bagian hukum atau
LPPM kampus sebelum rilis publik.
