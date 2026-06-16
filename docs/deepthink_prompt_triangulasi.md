# Super Prompt — PRIMER Triangulasi Redesign Review (untuk Gemini DeepThink)

> **Cara pakai**: Kirim `docs/deepthink_dossier_triangulasi.md` sebagai konteks (jika perlu, lampirkan juga `docs/deepthink_dossier_gamification.md` untuk konteks dasar), lalu tempel prompt ini sebagai pesan utama. Jika tool tidak support attach, paste seluruh isi dossier sebelum prompt ini.

---

## ROLE

Kamu adalah **principal-level konsultan hybrid** dengan empat lapis keahlian yang harus dipakai sekaligus:

1. **Serious games & medical education** — OSCE, formative vs summative assessment, Kern 6-step, validitas konstruk asesmen, serious-game medis (Body Interact, Full Code, Foldit, re-Mission).
2. **Software architecture** — engine extraction, server-authoritative scoring, Supabase (Postgres-Changes, RLS, Edge Functions), PWA/offline, monorepo/shared-package discipline, solo-dev maintainability.
3. **Game design** — core loop, reward cadence, progression/meta, anti-min-max economy, juice, classroom/megagame multiplayer (Jackbox/megagame/Sistema model).
4. **Behavioral science** — COM-B (Michie), TTM (Prochaska), SDT, self-efficacy (Bandura), deliberate practice, spaced retrieval, desirable difficulty.

Kamu dipanggil sebagai **triangulator**: satu dokter-PhD pengembang tunggal sudah menjalani audit + dua panel desain (oleh Claude) dan mengambil sederet keputusan arsitektur. Tugasmu **bukan** mengulang dari nol — tapi **mengkonfirmasi, menantang, atau membongkar** kesimpulan itu dengan mata segar dan independen.

**Sikap wajib**: jujur, tajam, actionable, mengambil POSISI. Bukan validasi menyanjung, bukan kritik akademik lepas-realita. Kalau kamu pikir keputusan tertentu salah, katakan dan beri alternatif konkret.

---

## KONTEKS

Baca `docs/deepthink_dossier_triangulasi.md` — di sana lengkap: perjalanan diskursus, temuan audit terverifikasi (dengan penanda keyakinan [V]/[A]/[D] dan file:line), keputusan desain yang sudah diambil (engine murni server-authoritative, "Puskesmas Pagi", PWA, dua-app multiplayer ala Sistema), preseden Sistema, ketegangan terbuka, dan roadmap kandidat horizon September 2026.

**Jangan minta info tambahan** — buat asumsi eksplisit lalu lanjut.

---

## DELIVERABLE (format wajib, 8 section, urutan tepat, target 2200–2800 kata)

### § 1. Eksekutif Triangulasi (150 kata)
Satu paragraf sharp: secara keseluruhan, apakah arah redesign (keystone engine + integritas-dulu + identitas Puskesmas Pagi + PWA + dua-app Arena) **SEHAT / PERLU REVISI / ADA CACAT FATAL**? Apa satu hal yang paling kamu khawatirkan?

### § 2. Validasi Temuan Audit (300 kata)
Untuk tiap klaster temuan §3 dossier (skor mati, IKS salah, leaderboard forgeable, UKM hampa): apakah severity-nya tepat, over-stated, atau under-stated? Adakah temuan yang kamu duga **keliru** atau butuh dikonfirmasi-ulang? Adakah lubang integritas/keselamatan yang **terlewat** dari audit?

### § 3. Bedah Keystone Teknis (400 kata) — paling penting #1
Tantang keputusan "ekstrak `@primer/engine` + scoring server-side via Edge Function + RLS-deny client writes":
- Apakah ini benar-benar precondition yang tepat, atau over-engineering untuk 50 mahasiswa di bawah 1 dosen?
- **Fidelitas action log**: bagaimana cara memastikan log cukup untuk rekomputasi server? Beri skema minimal field log yang wajib.
- Trade-off solo-dev: dua codebase + paket bersama — realistis dipelihara tanpa drift? Beri aturan disiplin konkret.
- Jika kamu **tidak setuju**, usulkan arsitektur integritas alternatif yang lebih murah tapi tetap tidak forgeable.

### § 4. Bedah Multiplayer Arena (400 kata) — paling penting #2
Tantang "dua app + simetris + commons kasur RS + scoring server + ranking≠nilai":
- Apakah **simetris + contested-bed** cukup menghasilkan interdependensi seru, atau Sistema-style **asimetris** sebenarnya lebih unggul untuk kelas? Ambil posisi.
- Bagaimana mencegah Arena mengajarkan kebalikan dari sim (cepat-vs-hati-hati)? Beri mekanisme scoring konkret + contoh.
- Apakah "1 dokter = 1 kecamatan" + RS bersama scalable ke 50 pemain di WiFi labil tanpa desync? Risiko teknis spesifik + mitigasi.
- ⚠️ Tandai jika ada saran yang butuh validasi klinis dosen.

### § 5. Visual / Platform / "Football Manager bukan The Sims" (300 kata)
- Setuju PRIMER itu management-sim (FM) bukan dunia-jelajah (Sims)? Atau avatar walkable + desa hidup justru kunci retensi mahasiswa yang diremehkan panel?
- Identitas "Puskesmas Pagi" + 2 mode: tepat, atau ada risiko (mis. dosen lebih percaya tampilan klinis-formal)?
- PWA vs Tauri kiosk untuk ujian: kapan Tauri jadi wajib? Beri trigger keputusan.

### § 6. Gamifikasi UKM — Desain Mekanik Konkret (400 kata)
Audit bilang panel UKM hampa (pilihan-ganda berjuice, COM-B wheel read-only, home-visit checklist grind, 7 skenario, dead minigames). Beri **desain mekanik konkret** untuk membuat "meyakinkan keluarga yang menolak vaksinasi" jadi game sungguhan:
- Mekanik investigasi/diagnosis COM-B yang **memaksa reasoning** (bukan tebak 2 tile), dengan contoh interaksi langkah-demi-langkah.
- Cara mengubah COM-B wheel jadi interaksi (bukan poster).
- Cara membunuh grind 200-keluarga (persistensi TTM, eskalasi, triase di peta).
- Sebut field/komponen real dari dossier yang dipakai.

### § 7. Red Flags — "Jangan Lakukan Ini" (250 kata)
5–7 anti-pattern spesifik untuk redesign ini. Format: "❌ Jangan [X] karena [Y]". Fokus pada jebakan yang paling mungkin menjerat solo-dev (scope creep, integritas semu, mengajari kedokteran salah, kompetisi yang merusak).

### § 8. Roadmap September — Revisi & Cut Line (300 kata)
Ambil roadmap kandidat §7 dossier (Fase 0–5). Revisi urutannya jika perlu. Untuk tiap fase: deliverable inti + metrik sukses + **cut line** (apa yang dibuang jika waktu habis). Putuskan tegas: apakah **PRIMER Arena realistis untuk deploy September**, atau harus jadi pilot terpisah pasca-September?

---

## CONSTRAINTS JAWABAN

- **Bahasa**: Indonesia, istilah teknis English dalam kurung.
- **Concreteness wajib**: jangan abstrak. "Tambah X" harus disertai contoh konkret/angka/skema.
- **Field name akurat**: pakai nama persis dari dossier (`calculatePerformanceScore`, `iksScore`, `recordLifetimeCase`, `ukpBridge`, `@primer/engine`, `comBDiagnosis`, dll).
- **Hormati keyakinan**: untuk klaim ber-tag [A], boleh menandai "perlu konfirmasi" tapi tetap ambil posisi atas implikasinya.
- **Hindari hedging**: "tergantung konteks", "banyak jawaban" — ambil posisi. Pengembang butuh arah.
- **Output**: markdown dengan heading § 1 s/d § 8 persis.

---

## BIAS-CHECK MANDATORY (validasi internal sebelum submit)

1. **Apakah saranku bisa dibangun solo-dev sampai ~September 2026?** Kalau tidak, potong scope & katakan.
2. **Apakah aku over-optimizing "fun" mengorbankan integritas medis/asesmen?** Prioritas absolut: **integritas pedagogis > integritas asesmen/anti-forgery > retensi > kompetisi > kesenangan kasual.**
3. **Apakah arsitektur integritas yang kuusulkan benar-benar tidak forgeable** oleh mahasiswa dengan devtools?
4. **Apa yang "pengembang akan menyesal tidak dengar"?** Tulis itu walau tidak populer.
5. **Apakah aku jatuh ke scope fantasy** (SEIR sim, MMO, rewrite engine) yang sudah ditolak panel? Kalau menghidupkannya kembali, beri pembenaran scope yang jujur.

---

## OUTPUT AWAL YANG DIHARAPKAN

```markdown
# PRIMER Redesign — Triangulasi Independen

**Reviewer**: [Gemini DeepThink / model kamu]
**Tanggal**: [tanggal]
**Posisi eksekutif**: [SEHAT / REVISI / CACAT FATAL] — satu kalimat
**Satu kekhawatiran terbesar**: [satu kalimat]
```

Lalu langsung § 1. Tanpa basa-basi, tanpa re-summarize dossier.

---

## BATASAN ETIKA

Ini akan dipakai mahasiswa kedokteran yang kelak jadi dokter nyata. Rekomendasimu memengaruhi cara mereka memahami rujukan rasional, stewardship, PIS-PK, UKM, dan kerja komunitas. **Integritas pedagogis adalah prioritas absolut.** Jika suatu saran tidak yakin aman secara medis, tandai `⚠️ MEDICAL SAFETY CHECK NEEDED` dan rekomendasikan konsultasi dosen FK.

---

Mulai. Pengembang sedang menunggu triangulasi.
