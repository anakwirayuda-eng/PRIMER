# Prompt: Transtheoretical Model (TTM) & Behavioral Science Models untuk Gameplay Kesehatan Masyarakat

> Gunakan prompt ini untuk bertanya ke AI agent lain (ChatGPT, Grok, Gemini, dsb.) tentang bagaimana TTM dan model behavioral science lainnya bisa diterapkan dalam game simulasi kesehatan masyarakat.

---

## CONTEXT

Saya sedang membangun sebuah **game simulasi Puskesmas** bernama **PRIMER** (Primary Care Medical Education RPG). Player berperan sebagai **dokter muda** yang ditempatkan di Puskesmas desa terpencil. Game ini memiliki dua sisi gameplay:

1. **UKP (Upaya Kesehatan Perorangan):** Menerima pasien di klinik — anamnesis, pemeriksaan fisik, diagnosis, tatalaksana, farmasi, rujukan.
2. **UKM (Upaya Kesehatan Masyarakat):** Kunjungan rumah, investigasi wabah, edukasi warga, intervensi perilaku di peta wilayah desa.

### Behavioral Models Yang Sudah Diimplementasi

#### 1. COM-B Model (Michie et al.)
Sudah digunakan untuk profiling 30 keluarga desa. Setiap keluarga punya skor 0.0-1.0 di 6 domain barrier:
- **Capability Psychological** (cap_psy) — Pengetahuan
- **Capability Physical** (cap_phy) — Keterampilan/akses ekonomi
- **Opportunity Physical** (opp_phy) — Infrastruktur (air, jamban, rumah)
- **Opportunity Social** (opp_soc) — Norma sosial, stigma, tekanan budaya
- **Motivation Reflective** (mot_ref) — Kepercayaan, niat sadar
- **Motivation Automatic** (mot_aut) — Kebiasaan, emosi, impuls

Skor dihitung dari data SDOH (Social Determinants of Health) keluarga: pendidikan, tipe rumah, sanitasi, sumber air, pola makan, ekonomi, dan indikator PHBS.

#### 2. Intervention Functions (9 fungsi dari Michie et al. 2011)
Sudah ada: Education, Persuasion, Incentivisation, Coercion, Training, Enablement, Modelling, Environmental Restructuring, Restriction. Setiap skenario penyakit dipetakan ke best intervention functions-nya.

#### 3. Transtheoretical Model (TTM) — Stages of Change
Sudah diimplementasi dengan 5 stage readiness:
- 😤 **Precontemplation** (Belum Sadar)
- 🤔 **Contemplation** (Mulai Mikir)
- 📝 **Preparation** (Siap Rencana)
- 💪 **Action** (Sedang Berubah)
- ⭐ **Maintenance** (Sudah Konsisten)

Fitur yang sudah jalan:
- Setiap keluarga punya `readiness stage` yang bisa naik/turun
- **Social Influence Graph**: 30 keluarga terhubung dalam graf sosial. Keluarga berpengaruh (Ketua RT, Tokoh Agama, Kader) bisa memicu *social contagion* — jika mereka naik stage, tetangganya ikut terangkat
- **Familiarity System**: Kunjungan berulang meningkatkan keakraban (0-100), membuka dialog mendalam
- **Neglect Decay**: Keluarga yang tidak dikunjungi >14 hari bisa mundur stage
- **Victory Metric (IKS)**: Target IKS ≥ 80% keluarga di stage Action/Maintenance

### 20 Disease/Behavior Scenarios
Sudah ada 20 skenario penyakit (scabies, cacingan, DBD, TB, campak, diare, filariasis, kusta, leptospirosis, tetanus, herpes zoster, difteri, flu burung, antraks, malaria, pertusis, hepatitis A, rabies, pestisida, banjir) — masing-masing dengan:
- COM-B barrier scores
- Best intervention functions
- Starting readiness stage
- Cultural beliefs/myths
- Investigation clues
- UKP bridge (fail outcomes jika tidak ditangani)

---

## PERTANYAAN UTAMA

### A. Pendalaman TTM dalam Gameplay

1. **Stage-Specific Interventions**: Dalam game saya, intervensi player saat ini *tidak* berubah berdasarkan stage TTM keluarga target. Menurut teori TTM, intervensi yang efektif untuk orang di stage Precontemplation (consciousness raising, dramatic relief) **sangat berbeda** dari stage Action (reinforcement management, helping relationships). Bagaimana saya bisa mendesain **pilihan aksi player yang berbeda untuk setiap stage TTM**? Berikan contoh konkret untuk skenario "TB Paru" dan "Jentik DBD".

2. **Processes of Change**: TTM punya 10 Processes of Change (5 experiential + 5 behavioral). Bagaimana 10 proses ini bisa dijadikan **kategori aksi gameplay** yang bisa dipilih player saat kunjungan rumah? Berikan contoh mapping ke 20 skenario saya.

3. **Decisional Balance**: Bagaimana mekanisme "pros vs cons" (keuntungan vs kerugian berubah perilaku) bisa divisualisasikan sebagai mini-game atau UI element saat player berinteraksi dengan NPC warga?

4. **Self-Efficacy Building**: Bagaimana game bisa merepresentasikan dan meningkatkan self-efficacy warga secara visual/mekanik? Misalnya, progress bar kepercayaan diri warga?

### B. Model Behavioral Lain yang Cocok

5. **Fogg Behavior Model (B=MAP)**: Bagaimana saya bisa mengintegrasikan Fogg's Motivation-Ability-Prompt ke dalam **diagnostic wheel/UI** di samping COM-B wheel? Apakah redundan, atau bisa saling melengkapi?

6. **Self-Determination Theory (SDT)**: Bagaimana 3 pilar SDT (Autonomy, Competence, Relatedness) bisa diaplikasikan ke **desain player experience** game saya — bukan untuk mengubah perilaku warga, tapi untuk membuat *player sendiri* merasa engaged dan termotivasi bermain?

7. **Health Belief Model (HBM)**: Bagaimana perceived susceptibility, severity, benefits, barriers, cues to action, dan self-efficacy dari HBM bisa dipetakan ke **dialog tree options** saat player berdiskusi dengan warga?

8. **Nudge Theory (Thaler & Sunstein)**: Apa contoh **nudges** yang bisa saya masukkan ke environment desa game saya? Misalnya, placement visual di map yang mempengaruhi keputusan player.

9. **Octalysis Framework (Yu-kai Chou)**: Dari 8 Core Drives, mana yang paling relevan untuk game edukasi kesehatan masyarakat? Berikan saran konkret untuk masing-masing drive yang relevan.

### C. Integrasi dan Prioritas

10. **Integration Matrix**: Buatkan saya sebuah **matrix/tabel** yang memetakan:
    - Rows: 6 domain COM-B + 5 stage TTM
    - Columns: Model lain (Fogg MAP, SDT, HBM, Nudge, Octalysis)
    - Cells: Mekanisme gameplay spesifik yang cocok

11. **Prioritas Implementasi**: Jika saya hanya bisa menambahkan **2 model baru** ke game yang sudah punya COM-B + TTM + Intervention Functions, model mana yang paling cost-effective (impact tinggi, effort rendah) untuk ditambahkan? Berikan reasoning.

---

## FORMAT JAWABAN YANG DIINGINKAN

- Jawab dalam **Bahasa Indonesia** dicampur istilah teknis Inggris
- Gunakan **tabel** dan **bullet points** untuk kejelasan
- Berikan **contoh gameplay konkret** (bukan teori abstrak)
- Referensikan **skenario penyakit saya** yang sudah ada (TB, DBD, scabies, dll)
- Jika ada **jurnal/paper akademik** yang relevan, sebutkan nama paper dan penulisnya
