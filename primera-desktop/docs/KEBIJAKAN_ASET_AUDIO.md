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

## 1. Posisi saat ini: berkas musik asli, dikurasi manusia

Musik latar PRIMERA memakai **berkas musik buatan manusia** yang berlisensi
bebas, diputar oleh `src/renderer/src/audio/bgm.ts`.

**Percobaan musik generatif (disintesis kode) sudah dicoba dan DIBATALKAN**
pada 2026-08-02. Secara lisensi ia sempurna — nol risiko, nol byte — tetapi
dr. Wirayuda mendengarnya dan hasilnya "suara-suara bunyi-bunyian gak jelas".

Pelajarannya bukan "generatif itu buruk", melainkan: **mutu musik tidak dapat
diverifikasi oleh pengembang yang tidak bisa mendengar.** Lisensi bisa
diperiksa mesin; keindahan tidak. Karena itu jalur yang dipakai sekarang
menuntut kurasi telinga manusia — lihat [KURASI_MUSIK_LATAR.md](./KURASI_MUSIK_LATAR.md).

Konsekuensinya: risiko lisensi kembali ada, jadi §2-§5 di bawah menjadi
mengikat, dan ditegakkan otomatis oleh `npm run audit:audio` yang
**menggagalkan build** bila dilanggar.

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

## 4. Kepekaan budaya — bila kelak memakai nuansa gamelan

Aturan ini berlaku bila suatu saat musik bernuansa karawitan dipakai (baik
rekaman maupun sintesis). SFX permainan saat ini masih memakai laras slendro.

1. **Tangga nada tidak berhak cipta; komposisi berhak cipta.** Boleh memakai
   laras slendro/pelog, tetapi melodinya harus digubah sendiri — **jangan
   pernah** mengutip gendhing tradisional.
2. **JANGAN pernah menulis "public domain" untuk melodi gamelan tradisional.**
   Menurut **UU 28/2014 Pasal 38**, hak cipta Ekspresi Budaya Tradisional
   dipegang **Negara tanpa batas waktu**, dan penjelasannya menyebut musik
   instrumental secara eksplisit.
3. **Jangan mengutip repertoar pusaka/sakral** atau menautkan musik ke konteks
   upacara. Pemakaian PRIMERA sekuler dan edukatif.
4. **Laras tidak terstandar.** Tiap perangkat gamelan ditala sendiri (*embat*),
   jadi nilai sen apa pun di kode adalah pilihan estetika, bukan transkripsi
   perangkat tertentu — dan harus ditulis begitu di komentarnya.

> **Catatan untuk dr. Wirayuda:** bila kelak nuansa karawitan dipakai untuk
> musik latar, akan sangat baik meminta pendapat satu pengajar karawitan.

---

## 5. Bila kelak menambah berkas audio — prosedur wajib

1. Catat entri di `src/renderer/src/audio/bgmKredit.ts`: berkas, judul,
   pencipta, URL sumber, lisensi, URL lisensi, suasana, dan apakah
   dimodifikasi. Ini sumber kebenaran tunggal — layar kredit membacanya, jadi
   atribusi tak mungkin lupa ditampilkan.
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

Pengembang AI di proyek ini **tidak dapat mendengar**. Yang dapat diverifikasi
otomatis hanyalah hal yang terperiksa mesin: lisensi, kelengkapan atribusi,
keberadaan berkas, dan tingkat volume. **Mutu musiknya tidak.**

Ini bukan kehati-hatian teoretis — sudah terbukti sekali. Musik generatif yang
lolos seluruh uji parameter ternyata terdengar sebagai "bunyi-bunyian tak
jelas" begitu didengar manusia, dan harus dibatalkan.

**Yang wajib dilakukan manusia sebelum musik dianggap layak rilis:**

- Dengarkan **45-60 menit menerus** di build Electron sungguhan (bukan dev
  server, bukan unit test). Yang dicari: apakah loop-nya mulai terasa
  menjemukan, apakah ada bagian yang mengganggu konsentrasi membaca.
- Uji di **speaker laptop murah**, bukan hanya headphone bagus.
- Uji di **ruangan berisi beberapa mesin** bila akan dipakai di lab.

Musik latar **default MATI** justru karena alasan terakhir: 30 mesin memutar
musik bersamaan menaikkan derau ruangan sekitar 15 dB. Setelan ini ditujukan
untuk pemakaian dengan headphone atau belajar mandiri.

Prosedur pemilihan lagunya ada di [KURASI_MUSIK_LATAR.md](./KURASI_MUSIK_LATAR.md).

---

## 7. Catatan hukum

Ini riset teknis untuk mempersempit pilihan, **bukan nasihat hukum**. Untuk
distribusi ke banyak institusi, mintalah tinjauan singkat ke bagian hukum atau
LPPM kampus sebelum rilis publik.
