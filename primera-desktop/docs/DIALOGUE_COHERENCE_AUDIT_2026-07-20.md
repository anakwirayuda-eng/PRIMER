# Audit Koherensi Dialog dan Anamnesis

**Tanggal:** 20 Juli 2026  
**Rilis:** `dialogue-coherence-2026-07-20`  
**Engine:** `REVISI_ENGINE=56`  
**Cakupan:** 210 kasus poli, 1.542 pasangan tanya-jawab, 20 kasus IGD, 16 keluarga, 27 kunjungan UKM, 85 node dialog, dan 255 pilihan dialog.

## Tujuan

Pass ini menilai apakah pertanyaan, jawaban, pembicara, urutan anamnesis, dan percakapan UKM terasa masuk akal sebagai interaksi manusia. Perubahan dibatasi pada koherensi komunikasi dan konsekuensi percakapan; diagnosis, kunci terapi, dan disposisi tidak diubah.

## Hasil Pra-Pasca

Skor memakai rubrik editorial 0-10 dan merupakan judgment audit terstruktur, bukan hasil validasi psikometrik. Skor pra berasal dari audit sebelum pass ini; skor pasca ditopang audit otomatis, invariant, pembacaan literal temuan, dan pengujian runtime.

| Dimensi | Pra | Pasca | Dasar perubahan |
|---|---:|---:|---|
| Relevansi pertanyaan-jawaban | 8,5 | **8,8** | Pemeriksaan Bell dipindahkan keluar anamnesis; pertanyaan majemuk dan jawaban parsial direkonsiliasi. |
| Keluwesan bahasa kasus aktif | 7,8 | **8,6** | Meta-komentar, bahasa rekam medis, dan pembalikan peran dokter-pasien dibersihkan. |
| Keluwesan bahasa prototipe | 7,1 | **8,3** | Suara pendamping eksplisit, fakta persona DM1 dipertahankan, dan jawaban lintas usia dinetralkan. |
| Konsistensi pembicara | 5,8 | **8,9** | Persona `anak` dipisah dari `wali_anak`; jawaban per-pertanyaan dapat ditandai berasal dari pendamping. |
| Alur anamnesis | 6,6 | **8,5** | Progressive disclosure menjadi KU -> RPS pertama -> RPS/riwayat latar, tetap menghormati `bukaSetelah`. |
| Dialog IGD | 8,6 | **8,6** | Tidak diubah; audit editorial dan suite regresi tetap hijau. |
| Karakter dan keluwesan UKM | 8,4 | **8,7** | Pilihan yang terlalu panjang dipadatkan tanpa menghilangkan karakter lokal atau teknik komunikasi. |
| Kontinuitas cabang UKM | 6,2 | **8,4** | Cabang kontradiktif mendapat narasi khusus; semua transisi lain mengingat nada trust secara ringan. |
| Identitas kartu kegiatan | 7,3 | **8,4** | Nama yang bertabrakan diperbaiki dan meta-kebijakan dipindahkan dari vignette ke landasan resmi. |
| Ketahanan terhadap tebakan bentuk | 6,4 | **8,6** | Panjang pilihan benar/keliru diseimbangkan dan edukasi tidak lagi identik dengan pilihan salah. |
| **Rerata** | **7,3** | **8,7** | Seluruh dimensi pasca berada di atas 8. |

## Metrik Reproduktif

- Audit editorial memeriksa **9.128 fragmen**: **0 temuan tinggi**; 80 temuan sedang seluruhnya penggunaan kapital untuk penekanan.
- Pilihan UKM: 91 tepat dan 164 keliru. Rerata panjang pilihan tepat **24,36 kata**, keliru **19,98 kata**; selisih **4,39 kata**. Sebelum pass, selisihnya sekitar 8 kata.
- Pilihan tepat >=35 kata: **0**. Sebelum pass terdapat 12 pilihan tepat >=40 kata.
- Pilihan edukasi yang tepat: **9**; sebelumnya 0. Label gaya tetap tersembunyi sampai debrief.
- Anak berusia di bawah 8 tahun tanpa pendamping eksplisit: **0**.
- Jawaban yang diawali gaya rekam medis (`resume`, `catatan`, `hasil pemeriksaan`, dan sejenisnya): **0**.
- Pertanyaan yang dijawab pendamping secara eksplisit: **10**, selain kasus yang seluruh encounter-nya memang dituturkan wali.
- Semua `butuhHotspot` menunjuk hotspot sah dan setiap node tetap memiliki sedikitnya satu pilihan tanpa prasyarat.

Perintah audit:

```powershell
npm run audit:dialogue
npm run audit:editorial -- --output dist/editorial-audit/dialogue-coherence.json
```

## Perubahan Perilaku

1. Anak yang dapat menjawab sendiri tidak lagi berbicara sebagai orang tua. Save lama dinormalisasi saat runtime tanpa memaksa mulai stase baru.
2. Balon jawaban dan lembar pemeriksaan menyatakan `Pendamping:` ketika sumber jawaban memang pendamping.
3. Panel anamnesis tidak langsung membuka seluruh checklist setelah keluhan utama; pemain harus menindaklanjuti RPS terlebih dahulu.
4. Pilihan UKM yang menyebut foto, kotak obat, catatan resep, atau benda lain tidak muncul sebelum benda tersebut diamati. Engine juga menolak dispatch langsung yang melewati gerbang ini.
5. Pilihan yang merusak kepercayaan tidak lagi diikuti narasi seolah hubungan langsung pulih. Transisi tanpa cabang khusus tetap membawa nada percakapan sesuai perubahan trust.

## Pagar Regresi

- 1.235/1.235 test pada 130 file lulus sebelum polish kontinuitas terakhir.
- Setelah polish terakhir: 52/52 test terfokus, typecheck, build produksi, dan budget bundle lulus.
- Golden Master: 18/18 hash beku cocok setelah unfreeze terdokumentasi.
- Soak Karier 90 hari dan Ujian 30 hari lulus untuk profil teliti, cepat, dan ceroboh.
- Artefak adjudikasi 137 prototipe diregenerasi agar fingerprint sesuai rilis baru.

## Residual dan Batas Klaim

- Delapan puluh temuan kapital sedang tetap ada, terutama penekanan pedagogis dan istilah program. Tidak ada yang melampaui ambang temuan tinggi, tetapi ini masih kandidat polish bertahap.
- Tiga puluh kasus memiliki rentang usia anak sampai dewasa. Tidak ditemukan konteks dewasa yang ketat pada jawabannya, tetapi variasi suara anak per-kasus belum authored untuk semuanya.
- Kontinuitas UKM kini **tone-aware**, bukan simulasi percakapan generatif atau pohon bebas penuh. Pilihan penting mendapat narasi khusus; pilihan lain memakai memori nada yang ringkas agar beban kognitif tetap terkendali.
- Skor di atas belum menggantikan playtest mahasiswa. Uji manusia tetap diperlukan untuk menilai keluwesan, kebingungan, dan durasi baca nyata.
