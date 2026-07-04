# BUILD SPECS — Vertical Slice "Puskesmas Pagi"

> Kontrak wajib untuk semua agen pembangun. Baca juga: `docs/GDD.md`,
> `src/engine/state.ts`, `src/engine/actions.ts`, `src/engine/events.ts`,
> `src/engine/reducer.ts`, `src/content/types.ts`, `src/content/pack.ts`,
> `src/renderer/src/store.ts`, `src/renderer/src/styles/base.css` + `tokens.css`.

## Aturan keras (semua agen)

1. TypeScript **strict + noUncheckedIndexedAccess** — `arr[i]` bertipe `T|undefined`, tangani.
2. Engine (`src/engine/**`): DILARANG `Math.random` (pakai `Rng` dari `core/rng.ts`),
   DILARANG import React/DOM/Electron. Fungsi murni, state immutable (salin, jangan mutasi).
3. Path alias: `@engine/*`, `@content/*` (vite + vitest sudah dikonfigurasi).
4. UI: SEMUA teks bahasa Indonesia. WAJIB memakai kelas CSS dari `base.css`
   (`kertas`, `kartu`, `tombol`, `chip`, `stempel`, `meter`, `judul-seksi`, dsb)
   dan token dari `tokens.css`. DILARANG hardcode warna baru. CSS tambahan per layar
   di file `.css` sebelah komponen, prefix kelas dengan nama layar.
5. UI tidak menghitung aturan game — baca `state`, dispatch `Action`, boleh panggil
   fungsi read-only engine (`hitungSkor`, `hitungIksKeluarga`, `musimDariHari`).
6. Kualitas tulisan konten = aset utama: bahasa Indonesia hangat, kolokial, akurat
   secara medis (SKDI/Permenkes). Boleh mengintip repo lama untuk gaya:
   `D:/Dev/PRIMER/.claude/worktrees/vigorous-bose-f66bc6/src/content/cases/` dan
   `src/game/`, tapi HASIL harus mengikuti skema BARU di `src/content/types.ts`.
7. Hanya tulis file yang jadi milikmu (tercantum di prompt). Jangan menyentuh file lain.

## Katalog ID kanonik (WAJIB — jangan mengarang id di luar daftar)

### Obat (`katalog.ts` → `export const OBAT: Record<string, Obat>`)
paracetamol_500, paracetamol_sirup, ibuprofen_400, amoxicillin_500, amoxicillin_sirup,
eritromisin_500, ciprofloxacin_500, kloramfenikol_250, cotrimoxazole_480, metformin_500,
glibenclamide_5, amlodipine_5, amlodipine_10, captopril_25, hct_25, omeprazole_20,
antasida_doen, ranitidin_150, oralit, zinc_20, salbutamol_2, salbutamol_inhaler,
cetirizine_10, ctm_4, dexamethasone_05, prednison_5, hidrokortison_krim, permetrin_krim,
ketokonazol_krim, kloramfenikol_tetes_mata, oat_kdt, tablet_fe, asam_folat,
vitamin_b_kompleks, ambroxol_30, domperidon_10
- `golonganAlergi`: amoxicillin_* & penisilin lain → 'penisilin'; ibuprofen_400 → 'nsaid';
  cotrimoxazole_480 → 'sulfa'; eritromisin_500 → 'makrolida'.
- `antibiotik: true` untuk: amoxicillin_*, eritromisin, ciprofloxacin, kloramfenikol_250,
  cotrimoxazole, kloramfenikol_tetes_mata, oat_kdt.
- Harga wajar Puskesmas (hargaBeli < hargaJual, ribuan rupiah).

### Lab (`katalog.ts` → `export const LAB: Record<string, ItemLab>`)
darah_rutin, widal, ns1_dengue, bta_sputum (hasilBesok: true), gds, gdp, urinalisis,
tes_kehamilan, hb, golongan_darah, asam_urat, kolesterol, malaria_rdt, feses_rutin

### Edukasi (`katalog.ts` → `export const EDUKASI: Record<string, TopikEdukasi>`)
kepatuhan_obat, diet_rendah_garam, diet_dm, cairan_oralit, tanda_bahaya, psn_3m,
kompres_demam, etika_batuk, cuci_tangan, asi_eksklusif, gizi_seimbang, berhenti_merokok,
aktivitas_fisik, kontrol_rutin, minum_oat_tuntas, kebersihan_kulit, hindari_alergen,
istirahat_cukup

### Kasus (16 — id persis)
Batch A (`kasus/kasusInfeksi.ts` → `export const KASUS_INFEKSI: KasusKlinis[]`):
ispa_common_cold, faringitis_akut (alergiTrap penisilin: obatTerlarang [amoxicillin_500,
amoxicillin_sirup], alternatifBenar [eritromisin_500]), dengue_df, demam_tifoid,
diare_akut_anak, tb_paru (lab bta_sputum hasil besok; 4A, TIDAK dirujuk), skabies,
konjungtivitis_bakterial.
Batch B (`kasus/kasusKronis.ts` → `export const KASUS_KRONIS: KasusKlinis[]`):
hipertensi_esensial (konsekuensi: kembali 5-9 hari), dm_tipe2, gastritis, asma_ringan,
otitis_media_akut, anemia_defisiensi_bumil (konsekuensi 5-9 hari), pneumonia_balita
(harusDirujuk true, skdi 3B), stroke_iskemik (harusDirujuk true, skdi 3B — kasus karma
Bu Wulan; keluhanUtama dramatis: dibawa keluarga subuh, bicara pelo, lengan kanan lemah).

Ketentuan per kasus: 8–10 pertanyaan anamnesis (5 kategori KU/rps/rpd/rpk/sosial),
1–2 di antaranya `distraktor: true` (pertanyaan tidak relevan untuk kasus itu),
3–5 `esensial: true` dengan tag `oldcarts`; variasi persona minimal untuk 3 pertanyaan
kunci (polos + terpelajar + cemas ATAU lansia); 4–6 temuan fisik (2–4 `relevan: true`,
sisanya normal); 2–4 lab dengan `relevan` yang jujur; `diagnosisBanding` 3–4 kode ICD-10
masuk akal (SALAH SATUNYA icd10 kasus); tatalaksana memakai id katalog di atas SAJA;
`clue` ber-tag guideline nyata; demografi konsisten.

### Keluarga binaan (6)
`keluarga/desaA.ts` → `export const KELUARGA_DESA_A: KeluargaBinaan[]`:
- **keluarga_wulan** (RW 5, sedang, rentan): Bu Wulan 58 th hipertensi TIDAK berobat
  (indikator hipertensi_berobat 'tidak'), suami merokok. Arc 2 kunjungan
  ("Obat itu bikin ginjal rusak, Dok" → MI). `karma` di kunjungan pertama:
  kasusId 'stroke_iskemik', jatuhTempoHari 6, narasi dramatis subuh.
- **keluarga_santoso** (RW 2, dekat, cukup): Pak Santoso TB putus obat bulan ke-2
  (tb_berobat_standar 'tidak'), malu ketahuan tetangga. Anak batuk. Arc 2 kunjungan.
- **keluarga_ketut** (RW 7, terpencil, miskin): bayi 8 bln belum imunisasi lengkap,
  ASI berhenti dini, ibu muda ragu vaksin (motivasi+kapabilitas). Arc 2 kunjungan.
`keluarga/desaB.ts` → `export const KELUARGA_DESA_B: KeluargaBinaan[]` +
`export const KADER_PROFIL: KaderProfil[]` (8, 1/RW, ketelitian 50-85, bias 1-2
indikator + persona 1 kalimat) + `export const RW_PROFIL: RwProfil[]` (8 RW bernama
kampung khas Jawa/Bali, jarak: 3 dekat/3 sedang/2 terpencil, totalKk 22-30):
- **keluarga_raharjo** (RW 6, sedang, miskin): BAB di sungai, jamban belum ada
  (kesempatan — bukan malas: tanah sempit, biaya). Gerbang kejujuran: ngaku "punya
  jamban" bila trust rendah; hotspot: tidak ada jamban di belakang rumah.
- **keluarga_musa** (RW 3, dekat, cukup): Pak Musa 64 th DM tak terkontrol, tinggal
  sendiri, lupa minum obat (kapabilitas). Hotspot: obat menumpuk belum diminum.
- **keluarga_dewi** (RW 1, dekat, cukup): Bu Dewi hamil anak ke-4, tidak KB, anemia,
  suami menolak KB (motivasi suami). Gerbang kejujuran soal KB.

Ketentuan skenario kunjungan: pembuka 2-3 kalimat atmosferik; 4-6 hotspot (x,y persen,
minimal 2 ber-`indikator`, minimal 1 KONTRADIKSI dengan potensi bohong di dialog);
3-4 node dialog × 3 pilihan (campur gaya; konfrontasi selalu tersedia sebagai godaan;
`tepat` mengikuti teknik MI sungguhan; 1 pilihan ber-`ungkap` untuk indikator sensitif
dengan `ambangTrust` 4-6 dan `responsBohong` yang halus); 3-4 kartu intervensi (persis
SATU yang `cocokUntuk` mengandung `hambatanSebenarnya`; yang lain masuk akal tapi keliru
sasaran); penutup berhasil/gagal 2-3 kalimat; catatanPedagogis pada pilihan penting.

### Lain-lain
`skdi144.ts` → `export const SKDI144: {id,nama,icd10,kasusId?}[]` — PORT daftar 144
penyakit dari repo lama `src/data/FKTP144Diseases.js` (perbaiki 3 duplikat), isi
`kasusId` untuk 16 kasus slice yang cocok.
`nama.ts` → `export const NAMA_WARGA: { pria: string[]; wanita: string[]; keluarga: string[] }`
(±40 nama Indonesia beragam etnis per daftar).

## Kontrak modul engine (signature PERSIS — reducer sudah mengimpornya)

### `src/engine/clinic.ts`
```ts
export function buatEncounter(pasien: PasienAktif): EncounterState
export function aksiKlinik(enc: EncounterState, action: Action, kasus: KasusKlinis,
  pack: ContentPack, rng: Rng): { enc: EncounterState; events: GameEvent[] }
export function nilaiEncounter(enc: EncounterState, kasus: KasusKlinis,
  pack: ContentPack): PenilaianEncounter
```
Perilaku: TANYA → jawaban dari `variasi[persona] ?? jawab`, event PASIEN_MENJAWAB;
distraktor → sabar −10 (event SABAR_MENIPIS bila <30); pertanyaan ke-9+ → sabar −4;
sabar ≤0 → jawaban ketus pendek ("Sudah saya bilang tadi, Dok...").
UKUR_VITAL → vitalDiukur (event VITAL_TERUKUR). PERIKSA → temuan dari
`pemeriksaanFisik` (region tak terdaftar → "dalam batas normal"), event TEMUAN_FISIK.
PESAN_LAB → labDipesan+; `hasilBesok` TIDAK masuk labTersedia (reducer menjadwalkan);
event LAB_DIPESAN {besok}. Lab duplikat → tolak diam-diam. LANJUT_FASE → urutan
anamnesis→pemeriksaan→diagnosis→terapi→disposisi. KOMIT_DIAGNOSIS → set + fase terapi
+ event STEMPEL (tegak|suspek). TAMBAH_OBAT → firewall: `obat.golonganAlergi` ∈
`pasien.alergi` → JANGAN tambah, event FIREWALL_ALERGI + STEMPEL kontraindikasi,
firewallTerpicu+. TAMBAH/HAPUS_EDUKASI, HAPUS_OBAT biasa.
`nilaiEncounter`: diagnosisBenar = icd10 sama; skorAnamnesis = 70×(esensial ditanya/total
esensial) + 30×(cakupan dimensi oldcarts unik/9) − 5×distraktor ditanya, clamp 0-100;
skorPemeriksaan = 100×(region relevan diperiksa/total relevan) − 10×max(0, region tak
relevan −2), tanpa vital → cap 50; skorTerapi = 100×(obatBenar∩resep/obatBenar) −15×obat
di luar obatBenar (clamp); antibiotikTanpaIndikasi = resep ada antibiotik ∧ obatBenar
tidak ada antibiotik; skorEdukasi = cakupan edukasi wajib; disposisiTepat: harusDirujuk
→ 'rujuk', selain itu 'pulang'/'observasi'; rujukanNonSpesialistik = rujuk ∧ ¬harusDirujuk;
cowboy = harusDirujuk ∧ ¬rujuk; labTakRelevan = lab dipesan yang `relevan:false`/tak ada
di kasus; sbarSkor (bila rujuk & ada sbar): tiap field ≥20 karakter +20, menyebut nama/
icd10 diagnosis di assessment +20, clamp 0-100; grade: rata2 tertimbang (diagnosis 40%,
anamnesis 20%, terapi 20%, pemeriksaan 10%, edukasi 10%) → A≥85 B≥70 C≥55 D;
konsekuensiDijadwalkan SELALU false (reducer yang mengisi). Sertakan `clue` kasus.
Tulis test `clinic.test.ts` (fixture kasus mini inline): firewall alergi memblokir,
distraktor menggerus sabar, tegak-salah vs suspek-salah terekam beda, grade masuk akal.

### `src/engine/kunjungan.ts` + `src/engine/pispk.ts` + `src/engine/kader.ts`
```ts
// pispk.ts — matematika PIS-PK kanonik (Permenkes 39/2016)
export function hitungIksKeluarga(kel: KeluargaState): number | null
  // ya/(ya+tidak) atas indikator ber-sumber ≠ 'belum' dan status ≠ 'na'; null bila tanpa data
export function klasifikasiIks(iks: number): 'sehat' | 'pra_sehat' | 'tidak_sehat'
  // >0.8 sehat; ≥0.5 pra; <0.5 tidak

// kunjungan.ts — state machine 4 babak
export function buatKunjungan(keluargaId: string, skenario: SkenarioKunjungan): KunjunganState
export function aksiKunjungan(kj: KunjunganState, action: Action,
  skenario: SkenarioKunjungan, kel: KeluargaState):
  { kj: KunjunganState; events: GameEvent[]; selesai: boolean }
export function selesaikanKunjungan(kj: KunjunganState, skenario: SkenarioKunjungan,
  kel: KeluargaState): HasilKunjungan
export function terapkanHasil(kel: KeluargaState, hasil: HasilKunjungan,
  skenario: SkenarioKunjungan, hari: number): KeluargaState

// kader.ts — scout harian
export function prosesHarianKader(state: GameState, pack: ContentPack, rng: Rng): {
  keluarga: Record<string, KeluargaState>
  rw: RwState[]
  kader: Record<string, KaderState>
  surat: Surat[]
}
```
Perilaku kunjungan: KLIK_HOTSPOT → tambah bila baru, event HOTSPOT_DITEMUKAN.
LANJUT_BABAK: observasi→wawancara (bebas); wawancara→diagnosis_perilaku hanya bila
dialogIndex ≥ jumlah node; diagnosis→resep butuh hipotesis (KOMIT_HAMBATAN otomatis
pindah); PILIH_INTERVENSI → fase 'selesai', selesai=true. PILIH_DIALOG: terapkan
efekTrust ke trustDelta; gaya 'konfrontasi' → konfrontasiBeruntun+ (lainnya reset);
2 beruntun → diusir=true, selesai=true, event DIUSIR. GERBANG KEJUJURAN pada pilihan
ber-`ungkap`: trustEfektif = kel.trust + kj.trustDelta; ≥ ambangTrust → respons jujur
(event WARGA_BICARA) & indikator tercatat BENAR; < ambang → event WARGA_BICARA
{bohong:true, teks: responsBohong} & indikator tercatat SALAH ('ya' padahal sebenarnya
'tidak'). Simpan daftar internal via pilihanDiambil (id) — selesaikanKunjungan
merekonstruksi dari skenario. selesaikanKunjungan: berhasil = ¬diusir ∧ hipotesis ===
hambatanSebenarnya ∧ intervensi dipilih `cocokUntuk` mengandung hambatanSebenarnya;
kualitasMi = 100×(pilihan `tepat`/total pilihan) (0 pilihan → 0); indikatorTerverifikasi
= indikator hotspot ditemukan + ungkap jujur. terapkanHasil: trust = clamp 0-10;
indikator terverifikasi → status=statusSebenarnya, sumber='dokter', hariData=hari;
indikator dibohongi → status='ya' (salah), sumber='dokter' (kontradiksi bisa ketahuan
lewat hotspot — pedagogi!); berhasil → ttm maju 1 tahap + arcIndex+1; ttm mencapai
'aksi'/'pemeliharaan' → indikator `target` skenario flip 'ya' (status & statusSebenarnya);
arc tamat semua + berhasil → arcSelesai='berhasil'; jumlahKunjungan+, kunjunganTerakhir.
Perilaku kader: tiap kader menyurvei 2-4 KK/hari di RW-nya (rw.kkTersurvei naik, cap
totalKk); keluarga binaan di RW itu yang masih 'belum' → SEMUA indikator non-na terisi
sumber='kader', hariData=hari, status=statusSebenarnya KECUALI: indikator ∈ kader.bias
ATAU rng.chance((100−ketelitian)/100) → status TERBALIK (bohong data!). rw.iks =
0.5×rata IKS keluarga tersurvei di RW (pakai hitungIksKeluarga) + 0.5×baseline
deterministik (dekat 0.62 / sedang 0.55 / terpencil 0.45, jitter ±0.05 dari rng) bila
kkTersurvei>0, selain itu 0. Maks 1 surat laporan kader/hari (gaya bahasa sesuai
persona kader, kadang menyelipkan keanehan yang mengisyaratkan bias — petunjuk halus).
Test `kunjungan.test.ts`: gerbang kejujuran dua sisi, diusir 2×konfrontasi, hipotesis
salah → gagal, N/A tidak masuk IKS, bias kader membalik data.

### `src/engine/director.ts` + `src/engine/scoring.ts` + `src/engine/save.ts`
```ts
export function buatPasienDariKasus(kasusId: string, pack: ContentPack, rng: Rng,
  override?: Partial<PasienAktif>): PasienAktif
export function susunAntrianHarian(state: GameState, pack: ContentPack, rng: Rng): PasienAktif[]
export function hitungSkor(state: GameState): Skor4Dimensi
export function ringkasanHarian(state: GameState): { grade: string; catatan: string[] }
export function serialize(state: GameState): string
export function deserialize(json: string): GameState | null
```
Director: hari 1-2 → 2 pasien, hari 3+ → 3 pasien. Kandidat = semua kasus pack.
Minggu 1 (hari ≤7): 92% pilihan dari kasus skdi '4A' ∧ ¬harusDirujuk. Bobot Leitner:
belum pernah (tak ada di dex) ×3; bintang 0-1 ×2; bintang 3 ×0.5. Musim: hujan →
kategori infeksi/pencernaan ×2; kemarau → respirasi/kulit ×1.5. Tanpa duplikat kasus
dalam satu hari. Jamin ≥1 kasus belum-pernah bila tersedia. buatPasienDariKasus:
nama dari NAMA_WARGA sesuai jenis kelamin (kasus.demografi.jenisKelamin atau acak),
usia dalam rentang, persona berbobot (lansia bila usia≥60, wali_anak bila usia<15,
sisanya polos 40/terpelajar 20/skeptis 20/cemas 20), bpjs 70%, alergiTrap → 60%
membawa alergi kelas tsb, id unik `p_{kasusId}_{rng.int(1000,9999)}`.
Scoring (SATU-SATUNYA formula — lihat GDD): akurasi = benar/total (0 bila belum ada);
rrns% = nonSpesialistik/rujukanTotal×100 (0 bila tanpa rujukan); guillotine =
max(0, 1 − max(0, rrns−5) × 0.05); kalibrasi = (tegakBenar + 0.9×suspekBenar +
0.4×suspekSalah) / max(1, total diagnosis) × 100; UKP = (0.75×akurasi×100 +
0.25×kalibrasi)/100 × 35 × guillotine − 2×cowboy, clamp 0-35; iksDesa = rata rw.iks
yang >0 (0 bila belum ada); UKM = (0.5×iksDesa + 0.25×(kunjunganBerhasil/max(1,
kunjunganTotal)) + 0.25×kualitasMi/100) × 35 − 2×apathy − 2×karmaTerjadi +
1×karmaDicegah, clamp 0-35; Manajemen = 15 − 0.5×labTakRelevan − 1×antibiotikTanpa
Indikasi − (kapitasi<10jt ? 3 : 0), clamp 0-15; Resiliensi = 15 − 1.5×hariKelelahan −
burnout/10, clamp 0-15; grade A≥85 'PTT Teladan' / B≥70 'Kompeten' / C≥55 'Lulus' /
D 'Perlu Pembinaan'. ringkasanHarian: grade huruf dari encounter hari ini + catatan
naratif (kasus salah + clue, kunjungan, karma, auto-resolve bermasalah).
Save: `serialize` = JSON.stringify({v:1, state}); `deserialize` = parse, cek v===1 &
state.versi===1 & tipe dasar (hari number, blok valid, klinik/desa ada) — gagal → null.
Test `director.test.ts`: bias 4A minggu 1, Leitner memprioritaskan yang lemah,
profil adversarial: over-refer (rrns 30%) → UKP≈0; apathy 10× → UKM rendah;
tegak-semua-salah < suspek-jujur; roundtrip serialize/deserialize.

## Kontrak layar UI (masing-masing: 1 file .tsx + 1 file .css, default-less named export)

Semua layar membaca store: `const state = useGame(s => s.state)!` dan
`const dispatch = useGame(s => s.dispatch)`. Gunakan `lastEvents`/`eventTick` untuk juice.
Estetika: lihat GDD §8 + base.css. Layar TIDAK punya scroll dokumen — panel internal
yang scroll. Semua tombol punya state disabled yang jelas + tooltip alasan.

- `screens/TitleScreen.tsx` (+.css): judul "PRIMER — Puskesmas Pagi" tipografi besar
  di atas kertas bertekstur, matahari pagi SVG lembut, form nama dokter (input +
  tombol "Mulai Stase"), tombol "Lanjutkan" bila `useGame(s=>s.state)` terisi dari
  autosave (cek via muatAutosave yang sudah dipanggil App). Kredit kecil.
  PENTING: layar ini juga dirender saat state null — jangan akses state!.
- `screens/MejaKerja.tsx`: hub 3 panel: (kiri) Kotak Masuk — daftar surat kertas,
  klik → buka isi (BACA_SURAT), badge belum dibaca; (tengah) kartu konteks blok:
  pagi → "Briefing" (antrian hari ini, Tas Kunjungan: saran keluarga prioritas +
  ALASAN bila peta terbuka), siang → pengingat slot lapangan, sore → DEBRIEF panel
  (ringkasanHarian dari @engine/director — grade + catatan + hasil kunjungan) +
  textarea refleksi (TULIS_REFLEKSI, font tulis-tangan) + tombol TIDUR; (bawah/kanan)
  tombol LANJUTKAN besar (dispatch LANJUTKAN) dengan label dinamis ("Buka Klinik →",
  "Ke Lapangan →", "Tidur"). Modal rekap slice bila flags.rekapSlice (hitungSkor +
  4 dimensi + ajakan lanjut).
- `screens/Klinik.tsx`: layar terbesar. Kiri: LEMBAR PERIKSA (kertas panjang ber-SOAP:
  identitas pasien + chip persona/BPJS; S kutipan anamnesis; O vital (— sebelum
  diukur!), temuan PF, hasil lab; A diagnosis ber-stempel; P resep+edukasi).
  Kanan: DECK AKSI per fase (fase dari state.klinik.aktif.fase): anamnesis → kartu
  pertanyaan per kategori + gauge SABAR (meter); pemeriksaan → tombol UKUR VITAL +
  figur tubuh SVG sederhana klik-regio (10 region dari RegionFisik) + form lab
  (biaya + chip "hasil besok"); diagnosis → daftar diagnosisBanding (kode+nama dari
  SKDI144/kasus — tampilkan nama ramah) + toggle stempel TEGAK/SUSPEK + komit;
  terapi → formularium (cari + klik tambah; firewall event → stempel merah
  KONTRAINDIKASI animasi stempel--jatuh) + edukasi checklist; disposisi → tombol
  PULANGKAN/RUJUK (rujuk → form SBAR 4 textarea) + ringkas billing. Tanpa pasien
  aktif: antrian (kartu pasien + keluhan) + tombol "Panggil Pasien Berikutnya"
  (PANGGIL_PASIEN) + hitung sisa stamina; antrian kosong → arahan LANJUTKAN.
  Event ENCOUNTER_SELESAI → panel hasil (grade stempel besar, rincian skor, clue EBM)
  + tombol "Pasien Berikutnya".
- `screens/PetaDesa.tsx`: kiri: SVG desa stilasi (jalan, sungai, sawah — flat kartu
  pos Puskesmas Pagi) dengan 8 petak RW clickable; warna petak = gradasi
  Daun→Kunyit→Merah dari rw.iks (abu-abu bila kkTersurvei 0); label "KK tersurvei
  x/y". Klik RW → panel kanan: daftar keluarga binaan-kandidat di RW itu (kartu
  keluarga: nama, sinopsis arc, IKS keluarga via hitungIksKeluarga, chip indikator
  dengan provenance ✓/~/? per sumber, trust ♥, tombol "Jadikan Binaan"
  (PILIH_BINAAN) / "Kunjungi (siang)" (MULAI_KUNJUNGAN — disabled dengan alasan bila
  bukan siang/stamina kurang/slot terpakai)). Bagian atas panel: roster binaan
  ringkas. Keluarga dgn karmaAktif → chip merah "PERLU PERHATIAN".
- `screens/Kunjungan.tsx`: full-screen scene 4 babak dari state.kunjungan: header
  keluarga + stepper babak; observasi → ilustrasi rumah SVG sederhana (dinding,
  jendela, perabot siluet) dengan hotspot (lingkaran denyut halus di x%,y%) —
  klik → KLIK_HOTSPOT, kartu temuan muncul; tombol "Mulai Berbincang" (LANJUT_BABAK);
  wawancara → dialog box bawah gaya novel visual (narasi + potret inisial warga),
  3 kartu pilihan ber-ikon gaya; respons muncul di box (event WARGA_BICARA; bila
  bohong JANGAN beri tanda eksplisit — pemain harus sadar dari kontradiksi hotspot);
  diagnosis_perilaku → 3 kartu besar Kapabilitas/Kesempatan/Motivasi (KOMIT_HAMBATAN)
  dengan petunjuk "apa yang kamu lihat & dengar" (rekap temuan+dialog); resep_sosial →
  kartu intervensi (PILIH_INTERVENSI); event KUNJUNGAN_SELESAI ditangani otomatis
  (reducer pindah layar peta) — toast hasil.
- `screens/DexSkdi.tsx`: grid 144 entri dari SKDI144: belum tersentuh = siluet
  "???" (nama tersembunyi, nomor saja); pernah = nama + ★0-3 (bintang luntur:
  tampilkan hari terakhir); punya kasusId tapi belum ada di dex → siluet dengan
  ikon "ada di desa ini"; klik entri terisi → kartu detail (icd10, ditangani, benar,
  clue kasus). Header: progress "X/144 dikenali" + penjelasan Leitner singkat.
- `screens/Rapor.tsx`: 4 kartu dimensi (hitungSkor dari @engine/director — nilai +
  bar meter + rincian: akurasi, RRNS + status guillotine, kalibrasi stempel,
  IKS desa, kualitas MI); grade besar tengah dgn stempel; tabel tally ringkas;
  kalender musim 90 hari (3 strip × 30 kotak, hari berjalan ditandai); disclaimer
  "skor dikunci permanen di Hari 91".
- `audio/useAudio.ts` + `audio/synth.ts`: WebAudio FM synth TANPA aset. `useAudio()`
  dipanggil App: init AudioContext saat gesture pertama (pointerdown global sekali);
  subscribe useGame lastEvents/eventTick → SFX: STEMPEL → thunk rendah + noise burst;
  PASIEN_MENJAWAB/WARGA_BICARA → blip lembut; SURAT_MASUK → bel kecil; FIREWALL/
  KARMA_TERJADI → buzzer minor; KARMA_DICEGAH/ENCOUNTER_SELESAI grade A → arpeggio
  pentatonik naik; HARI_BARU → kokok-ish sweep + 3 nada pagi. BGM ambient pentatonik
  slendro sangat pelan (gain 0.05, nada panjang acak Math.random BOLEH di sini) dengan
  toggle mute (localStorage) — expose `window.__primerAudioMute` sederhana atau
  tombol kecil fixed pojok kiri bawah yang dirender useAudio via portal? TIDAK —
  cukup fungsi `toggleMute()` diexport dan tombol mute kecil ditaruh di komponen
  `audio/MuteButton.tsx` (milikmu juga) yang dipasang App nanti oleh integrator.
  Semua node audio di-cleanup; volume master 0.4; jangan spam (throttle blip 60ms).
