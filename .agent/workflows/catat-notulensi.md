---
description: Catat notulensi — log keputusan ke docs/ dengan timestamp
---

# Catat Notulensi

Ketika user bilang "catat notulensi", log keputusan ke file yang sesuai di `docs/`:

1. Tentukan kategori:
   - **Arsitektur/teknis** → `docs/ARCHITECTURE_LOG.md`
   - **Game design/gameplay** → `docs/GAME_DESIGN_LOG.md`
   - **Bug/regresi** → `docs/BUG_TRIAGE_LOG.md`
   - **Konten klinis** → `docs/CLINICAL_LOG.md`
   - **Topik baru** → buat file baru `docs/[TOPIK]_LOG.md`

2. Format entry:
   ```markdown
   ### YYYY-MM-DD HH:mm — [Judul Singkat]
   
   **Konteks**: Mengapa keputusan ini diambil
   **Keputusan**: Apa yang diputuskan
   **Sumber**: Dari mana info ini (Codex, Deepthink, user, dll)
   
   ---
   ```

3. Append entry di AKHIR file (sebelum baris `---` terakhir)
4. Gunakan waktu lokal user (WIB, UTC+7)
