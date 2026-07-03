# Audit EBM — Flow Anamnesis → Diagnosis → Tatalaksana per Kasus

> Telaah solo (mono, tanpa agent) atas permintaan user, 2026-07-03.
> Acuan: PPK Dokter di FKTP (Permenkes 5/2014 & revisi), Fornas, PNPK terkait,
> WHO, pedoman program Kemenkes (LINTAS DIARE, DOTS TB, DBD, PIS-PK).
> Verdikt tiap kasus: ✅ sesuai · ⚠️ defensible/catatan · ❌ perlu perbaikan.

Skala telaah: apakah **alur** logis-EBM — keluhan utama menuntun anamnesis
esensial yang tepat, pemeriksaan fisik relevan menemukan tanda kunci, lab sesuai
level FKTP, diagnosis banding masuk akal, **obat benar & obat-salah-umum akurat**,
edukasi tepat, disposisi (tuntas 4A vs rujuk) benar.

---

## kasusInfeksi.ts (8 kasus) — ✅ solid

| Kasus | Verdikt | Catatan |
|---|---|---|
| ISPA common cold (J00) | ✅ | Viral self-limiting, simtomatik (PCT/CTM/ambroxol), anti-AB benar. |
| Faringitis GABHS (J02.9) | ✅ | Centor tinggi → amoksisilin; alergi penisilin → eritromisin (makrolida). Anti-fluorokuinolon benar. |
| Demam Dengue (A90) | ✅ | PCT-only, NSAID dilarang, hidrasi + tanda bahaya. NS1 + trombositopenia. Tepat. |
| Demam Tifoid (A01.0) | ⚠️→✅ | **Kloramfenikol lini pertama**: benar per PPK FKTP Indonesia & Fornas (alternatif kotrimoksazol/amoksisilin). Global lebih pilih seftriakson/fluorokuinolon karena resistensi, tapi untuk konteks Puskesmas ini defensible. Widal 1/320 di area endemis = bermakna (dengan catatan keterbatasan Widal — sudah disebut). Tidak diubah. |
| Diare akut anak (A09) | ✅ | Oralit + Zinc 20mg 10-14 hari (LINTAS DIARE), tanpa AB rutin. Zinc 20mg tepat utk usia >6 bln. |
| TB Paru (A15.0) | ✅ | OAT KDT DOTS, 4A tuntas di FKTP, skrining kontak. Tepat. |
| Skabies (B86) | ✅ | Permetrin 5% + antihistamin, obati kontak serumah, ulang 1 minggu. Tepat. |
| Konjungtivitis bakterial (H10.0) | ✅ | AB topikal (kloramfenikol tetes), anti-steroid-sembarangan benar, red flag keratitis → rujuk. Tepat. |

**Kesimpulan file:** akurasi EBM tinggi, tidak ada perbaikan diperlukan. Satu
titik diskusi (kloramfenikol tifoid) sengaja dipertahankan karena sesuai
pedoman lokal FKTP + Fornas — justru itu "praktik lokal relevan" yang diminta.

---

## kasusKronis.ts (8 kasus) — ✅ + 1 perbaikan

| Kasus | Verdikt | Catatan |
|---|---|---|
| Hipertensi esensial (I10) | ✅ | Amlodipin lini pertama (JNC-8, PPK FKTP), anti-NSAID/PCT benar. |
| DM tipe 2 (E11.9) | ✅ | Metformin lini pertama, SU dihindari (risiko hipoglikemia), PERKENI 2021. |
| Gastritis/dispepsia (K29.7) | ✅ | PPI empiris tanpa tanda alarm (Konsensus Dispepsia PGI), anti-NSAID/AB. |
| **Asma ringan (J45.9)** | **❌→✅ DIPERBAIKI** | **Gap EBM nyata**: obatBenar hanya `salbutamol_inhaler` (SABA). Gejala 2×/mgg + terbangun malam = asma PERSISTEN ringan; GINA 2019+ menegaskan **SABA-tunggal tak lagi dianjurkan** — semua asma butuh terapi ber-ICS. **Fix**: tambah `budesonide_inhaler` (ICS, ada di Fornas FKTP) ke katalog + jadikan obatBenar kedua; clue diperbarui ke paradigma anti-inflamasi GINA. |
| Otitis media akut (H66.0) | ✅ | Amoksisilin dosis tinggi + analgesik (AAP), tetes hanya bila perforasi. |
| Anemia def besi bumil (D50.9) | ✅ (catatan minor) | Fe + asam folat + cari sumber (cacing tambang), Permenkes 88/2014. *Minor*: WHO menganjurkan albendazol pasca-trimester-1 di area endemis cacing — clue sudah menyebut "cari sumber"; tak dijadikan obat wajib agar tak keluar cakupan FKTP-sederhana. Diterima. |
| Pneumonia balita berat (J18.9, 3B, rujuk) | ✅ | Dosis pertama amoksisilin + O2 + rujuk (IMCI chest-indrawing = berat). |
| Stroke iskemik (I63.9, 3B, rujuk) | ✅ | obatBenar kosong (stabilisasi+rujuk); anti-penurunan-TD-agresif, cek GDS (mimic), FAST, Time is Brain (PERDOSSI). Sangat tepat. |

**Kesimpulan file:** 1 perbaikan EBM penting (asma → wajib ICS per GINA terkini).

---

## TEMUAN LINTAS-FILE (sistemik) — `obatAlternatif` ❌→✅ DIPERBAIKI

**Masalah engine, bukan konten:** `clinic.ts` menilai `obatBenar` sebagai **AND
(semua wajib)**: `rasioTerapi = jumlahBenarDiresepkan / obatBenar.length`.
Akibatnya, kasus yang menaruh **dua obat setara "pilih salah satu"** sebagai
`obatBenar` menghukum monoterapi yang benar (skor 50%) dan diam-diam **memberi
nilai penuh untuk polifarmasi obat sekelas** (mis. 2 antihistamin sekaligus) —
mengajarkan peresepan berlebih. Beberapa clue-nya bahkan sudah menulis "A/B"
atau "A ATAU B" (mengonfirmasi maksudnya alternatif), tapi datanya AND.

**Fix engine** (types + clinic + pack + selfplay + test):
- Tambah `Tatalaksana.obatAlternatif?: string[][]` — tiap sub-array = kelompok
  setara "pilih salah satu". Slot terpenuhi bila ≥1 anggota diresepkan; anggota
  lain TIDAK dihukum sebagai obat di luar tatalaksana. Aman terhadap `alergiTrap`
  (anggota terlarang otomatis dikeluarkan dari grup) & stewardship antibiotik.
- `rasioTerapi = (obatBenarDiresepkan + slotAltTerpenuhi) / (obatBenar.length + jumlahGrupAlt)`.
- 2 test unit baru di `clinic.test.ts` mengunci: monoterapi benar = 100,
  polifarmasi sekelas tak berhadiah/berhukum, slot alternatif kosong = 50,
  obat di luar tetap −15, antibiotik-sebagai-alternatif bukan "tanpa indikasi".

**Kasus dikonversi ke `obatAlternatif` (6):** rinitis alergi (2 antihistamin),
GERD (2 PPI), askariasis (2 antelmintik), PPOK eksaserbasi (SABA inhalasi/oral),
urtikaria akut (2 antihistamin), kandidiasis kutis (2 azol topikal), TTH
(parasetamol/NSAID), mialgia (parasetamol/NSAID). *(8 konversi total — 2 sudah
di kasusRespGi, 4 di batch kulit/saraf/metabolik.)*

**Sengaja TIDAK diubah:** gout akut (diklofenak+kolkisin) — `alergiTrap` sudah
memaksa pasien selalu alergi NSAID sehingga firewall menuntun ke monoterapi
kolkisin; osteoartritis & LBP (parasetamol+NSAID) — kombinasi analgesik
multimodal yang defensible; hipertensi urgensi (amlodipin+kaptopril) & CHF
(furosemid+ISDN) — dua kelas berbeda yang komplementer.

---

## kasusKulit.ts (10 kasus) — ✅ + 2 konversi alternatif

Semua akurat EBM (PPK Perdoski). Highlight kualitas: **tinea korporis &
kandidiasis** menandai "jebakan steroid tunggal → tinea/kandidia inkognito"
sebagai `obatSalahUmum` — poin ajar dermatologi yang sering terlewat. Herpes
zoster menekankan asiklovir <72 jam; morbili memberi vitamin A (protokol campak
Kemenkes); skabies & pedikulosis menekankan **obati kontak serumah serentak**.
Konversi alternatif: urtikaria akut, kandidiasis kutis (lihat di atas).

## kasusSarafMataTht.ts (10 kasus) — ✅ tinggi + 1 konversi

Kualitas klinis menonjol, dua kekhawatiran awal saya JUSTRU sudah ditulis benar:
- **BPPV**: manuver **Epley** ada di `prosedur` sebagai terapi utama, betahistin
  hanya simtomatik, clue tepat (AAO-HNS/PERDOSSI). ✅
- **Epilepsi** (SKDI 3A, rujuk): `obatBenar` diazepam REKTAL sebagai *rescue*
  FKTP yang benar; `obatSalahUmum` menjelaskan memulai OAE rumatan (karbamazepin)
  di FKTP tanpa klasifikasi/EEG itu keliru, dan diazepam TABLET tak bisa
  mengabortus bangkitan. Clue: FKTP rescue+rujuk ke saraf. Sangat tepat. ✅
- Bell's palsy (steroid <72 jam + proteksi kornea, bedakan sentral/perifer),
  glaukoma akut (3B rujuk mata, emergensi), migrain, konjungtivitis alergi,
  hordeolum, serumen, epistaksis, rinosinusitis — semua tepat. Konversi
  alternatif: TTH (parasetamol/NSAID).

## kasusMetabolikMsk.ts (10 kasus) — ✅ + 1 konversi

Gatekeeping rujukan benar: RA (3A→penyakit_dalam, DMARD di RS), CHF (3B→
penyakit_dalam), keduanya "kenali & rujuk". Gout: **aturan emas jangan mulai
allopurinol saat serangan akut** ditandai sebagai `obatSalahUmum` — poin ajar
reumatologi kunci (ACR 2020/PAPDI). Dislipidemia (statin + risiko KV), obesitas
(gaya hidup, obat kosong), ISK bawah, hipertensi urgensi — tepat. Konversi
alternatif: mialgia (parasetamol/NSAID).

## kasusKiaJiwa.ts (10 kasus) — ✅ solid

KIA: ANC normal (Fe+folat), ISK kehamilan (sefiksim aman-kehamilan +
parasetamol), **preeklampsia berat (3B rujuk: MgSO4 + nifedipin — benar!)**,
abortus iminens (istirahat, obat kosong), konseling KB (obat kosong).
Malaria falsiparum: **DHP + primakuin + parasetamol** = ACT program Kemenkes,
sangat tepat. Jiwa: GAD & depresi ringan (fluoksetin — catatan: depresi ringan
lini pertama sebenarnya psikoterapi/watchful-waiting, SSRI wajar di FKTP bila
psikoterapi tak tersedia; diterima), insomnia (**non-farmakologi dulu, obat
kosong — bagus!**), skizofrenia (3A rujuk jiwa, haloperidol). Tidak ada
perbaikan diperlukan.

## igd.ts (5 kasus gawat) — ✅ (sudah diaudit di triangulasi CODEX)

Syok anafilaksis (adrenalin IM lini pertama), kejang demam kompleks (diazepam
rektal; narasi "kompleks" sudah diperbaiki di triangulasi CODEX agar memenuhi
kriteria berulang <24 jam), asma berat (O2+nebul salbutamol+steroid sistemik),
hipoglikemia berat (D40 IV, insulin = jebakan fatal), DSS (kristaloid, NSAID
dilarang). Semua akurat PPGD/GINA/WHO. Tidak ada perbaikan baru.

---

## RINGKASAN AUDIT

- **Kasus ditelaah:** 67 poli + 5 IGD = 72, satu per satu (mono, tanpa agent).
- **Akurasi EBM konten:** sangat tinggi — hampir seluruh diagnosis, obat benar,
  obat-salah-umum, edukasi, dan disposisi (tuntas 4A vs rujuk 3A/3B) tepat &
  ber-guideline (PPK FKTP, Fornas, PNPK, GINA, PERKENI, ACR, WHO, Kemenkes).
- **Perbaikan substantif (2):**
  1. **Asma ringan** → wajib ICS (budesonid) per GINA 2019+ (bukan SABA-tunggal).
  2. **Mekanisme `obatAlternatif`** → memperbaiki 8 kasus "alternatif pilih-satu"
     yang sebelumnya menghukum monoterapi benar & memberi hadiah polifarmasi.
- **Titik "praktik lokal" yang sengaja dipertahankan:** kloramfenikol tifoid,
  kotrimoksazol ISK, kombinasi analgesik multimodal — sesuai realitas FKTP &
  Fornas Indonesia (persis yang diminta: "EBM ATAU praktis lokal relevan").
- **Verifikasi:** 163 test hijau, tsc strict 0, build OK.
