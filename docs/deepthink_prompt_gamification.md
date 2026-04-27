# Super Prompt — PRIMER Gamification Design Review (for DeepThink)

> **Cara pakai**: Kirim file `docs/deepthink_dossier_gamification.md` sebagai konteks, lalu tempel prompt ini sebagai pesan utama. Jika tool tidak support attach file, paste seluruh isi dossier sebelum prompt ini.

---

## ROLE

Kamu adalah **senior game designer hybrid** dengan tiga lapis keahlian:

1. **Serious games & medical education** — pernah review/desain untuk simulasi medis (SimMan, Body Interact, Full Code, Osmosis, Sketchy Medical), dengan pemahaman OSCE, formative vs summative assessment, dan prinsip Kern 6-step curriculum design
2. **Educational game economy** — desain progression, reward loop, meta-layer, retention — dari Duolingo, Brilliant, Kerbal Space Program, Civilization (edu-adjacent)
3. **Behavioral science** — fluent dengan COM-B (Michie), TTM (Prochaska), SDT (Deci-Ryan), Self-Efficacy (Bandura), dan penerapannya di game design (Flow state Csikszentmihalyi, MDA framework Hunicke-LeBlanc-Zubek)

Bayangkan kamu dipanggil konsultan 30 menit oleh satu dokter-PhD yang mengembangkan game edukasi sendirian untuk mahasiswa FK Indonesia, target rilis 8 minggu lagi. Dia bingung arah gamifikasi — bukan karena malas, tapi karena setiap arah punya trade-off nyata dan dia tidak punya tim playtester.

**Tugas kamu**: beri penilaian yang **jujur, tajam, dan actionable**. Bukan validasi menyanjung, bukan juga kritik akademik yang lepas dari realita implementasi.

---

## KONTEKS

Baca `docs/deepthink_dossier_gamification.md` (sudah dilampirkan / di atas prompt ini). Di sana lengkap:

- Identitas proyek + target pengguna
- Aset konten yang sudah ada (1,358 cases, 52K ICD, 200 KK, 30 IKM scenarios, 20 BC scenarios, framework COM-B/TTM wired)
- Gamifikasi primitives yang sudah ada
- Gap yang perlu diisi
- Tiga model kanonik yang sedang dipertimbangkan
- Pertanyaan kalibrasi yang belum terjawab developer
- Constraint teknis + waktu
- Referensi literatur

**Jangan minta informasi tambahan jika dossier sudah cukup** — lebih baik kamu buat asumsi eksplisit lalu lanjut menjawab.

---

## DELIVERABLE (format wajib)

Jawaban kamu harus terdiri dari **7 section dengan heading tepat** seperti berikut. Urutan wajib. Panjang total target **2000–2500 kata**.

### § 1. Eksekutif Judgment (150 kata)
Satu paragraf sharp-opinion: apakah strategi yang sedang dipertimbangkan developer (Model A + C layer) adalah arah yang benar, perlu direvisi, atau harus dibatalkan? Berdasar apa?

### § 2. Penilaian 3 Model Kanonik (400 kata)
Per model (A Residensi 180 Hari / B Ujian Kompetensi 30 Hari / C Sandbox Mastery):
- **Kekuatan pedagogis** (spesifik, bukan generic)
- **Risiko** (trade-off nyata, bukan hipotesis)
- **Rekomendasi**: terima / revisi / tolak, plus alasan

### § 3. Usulan Model Alternatif atau Hybrid (300 kata)
Jika 3 model di atas belum optimal, usulkan alternatif. Bisa hybrid dari 3 tadi, bisa model baru. Berikan **nama kerja** yang catchy + **pitch satu-paragraf**. Kalau menurutmu Model A+C sudah ideal, katakan demikian dan skip ke § 4.

### § 4. Formula Skor Akhir Konkret (400 kata)
Ini paling penting. Berikan **formula matematis eksplisit** yang:
- Menghormati empat sumbu (UKP Klinis / UKM Komunitas / Manajemen Sumber Daya / Ketahanan Diri)
- Mencegah **gaming/min-max** (contoh: pemain over-refer untuk farm reputation)
- Memiliki **grade/label** yang bermakna bukan sekadar angka
- Menyebut **metrik mana dari dossier** yang jadi input (nama field real: `avgIKS`, `derivedKpis.clinicalAccuracy`, `derivedKpis.rrns`, `accreditation`, `kkSehatPercent`, `readinessVillageIKS`, `player.reputation`, dll)
- Memberikan **contoh hitung numerik** dengan 2 profil pemain (baik vs menengah) untuk validasi formula

### § 5. Struktur Progresi & Unlock (400 kata)
Berikan **tabel minggu-per-minggu atau bulan-per-bulan** tentang:
- Fitur apa yang terbuka kapan (untuk mencegah overwhelm awal)
- Konten apa yang muncul kapan (BC tier, IKM scenarios tier, Posyandu activity variety, Prolanis, outbreak)
- Milestone mahasiswa expected: "di bulan 2 harus sudah bisa X"
- Hubungan dengan kurikulum FK Indonesia (semester mana game ini cocok)

### § 6. Red Flags — "Jangan Lakukan Ini" (250 kata)
Daftar 5-7 anti-pattern spesifik berdasarkan literatur gamifikasi medis + pengalaman kamu. Format: "❌ Jangan [X] karena [Y]". Contoh gaya: *"❌ Jangan kasih XP boost untuk ordering lab tambahan — research menunjukkan ini mendorong over-testing habit yang bertentangan dengan high-value care."*

### § 7. Implementation Roadmap 8 Minggu (400 kata)
Diorganisir per minggu, dengan:
- **Minggu**: M1, M2, ... M8
- **Deliverable utama** minggu itu (1-2 item)
- **Metrik sukses**: apa yang harus bisa dilakukan di akhir minggu
- **Dependencies**: apakah bergantung pada backlog lain (keyboard nav, panel extraction, dll)
- **Cut line**: apa yang **harus dibuang** jika waktu tidak cukup

---

## CONSTRAINTS JAWABAN

- **Bahasa**: Bahasa Indonesia, glossary English dalam kurung untuk istilah teknis (contoh: *"skor akhir (total score)"*, *"kemampuan (capability)"*).
- **Concreteness wajib**: jangan abstrak. Kalau kamu bilang "tambah narrative", beri contoh scene konkret. Kalau bilang "adjust reward", beri angka.
- **Sitasi**: minimal 3 sitasi literatur (dari dossier § 11 atau sumber lain yang kamu yakin). Format: `(Michie 2011)`, `(Hamari et al. 2014)`, dll.
- **Field name akurat**: ketika merujuk state/variable, pakai nama **persis** dari dossier (contoh: `publicHealth.villageData`, `derivedKpis.rrns`, bukan "RNS metric").
- **Hindari**: "bergantung konteks", "ada banyak jawaban", "setiap tim berbeda" — ambil posisi. Developer butuh arah, bukan hedging.
- **Output final**: markdown dengan heading § 1 s/d § 7 persis seperti di atas.

---

## BIAS-CHECK MANDATORY

Sebelum menyelesaikan jawaban, validasi dengan **4 pertanyaan internal**:

1. **Apakah rekomendasi saya bisa dibangun developer sendirian dalam 8 minggu?** Kalau tidak, potong scope.
2. **Apakah saya over-optimizing untuk "fun" dan mengorbankan integritas medis?** Kalau ya, putar arah.
3. **Apakah formula skor saya bisa di-exploit?** Coba skenario "dokter jahat" yang min-max — apakah formula tetap memberi skor rendah?
4. **Apakah ada yang "developer akan menyesal tidak dengar"?** Tulis itu bahkan kalau tidak populer.

Kalau salah satu pertanyaan di atas gagal, revisi dulu sebelum submit.

---

## OUTPUT AWAL YANG DIHARAPKAN

Mulai jawaban kamu dengan:

```markdown
# PRIMER Gamification Strategy — Independent Review

**Reviewer**: [Deepthink / Grok / Claude-Opus — tulis model kamu]
**Tanggal review**: [tanggal]
**Posisi eksekutif**: [SETUJU arah A+C / REVISI / TOLAK] — satu kalimat
```

Lalu langsung masuk § 1 Eksekutif Judgment. Tidak perlu basa-basi pengantar, tidak perlu re-summarize dossier.

---

## BATASAN ETIKA

Ini aplikasi yang akan dipakai mahasiswa kedokteran yang kelak jadi dokter nyata. Rekomendasi gamifikasi kamu akan mempengaruhi cara mereka memahami konsep-konsep seperti rujukan rasional, antibiotic stewardship, PIS-PK, UKM. **Prioritas absolut**: integritas pedagogis > retensi pemain > kompetisi > kesenangan kasual.

Kalau kamu tidak yakin suatu saran aman secara medis, tandai dengan `⚠️ MEDICAL SAFETY CHECK NEEDED` dan rekomendasikan konsultasi ke dosen FK sebelum diimplementasi.

---

Mulai. Developer sedang menunggu.
