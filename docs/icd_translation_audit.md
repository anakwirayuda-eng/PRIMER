# ICD Translation Quality Audit — PRIMER Project

**Date:** 2026-02-24
**Context:** PRIMER is an Indonesian medical education simulation game set in a Puskesmas (primary care clinic). The ICD databases drive the EMR's diagnosis & procedure search UI, the MAIA Clinical Reasoning engine, and the score evaluation pipeline. This audit evaluates the quality of Indonesian translations across all ICD data sources.

---

## 1. Architecture Overview

The project has **four** ICD data sources, each serving different roles:

| # | File | Records | Language | Role |
|---|------|---------|----------|------|
| 1 | `ICD10_DB` in `src/data/ICD10.js` | ~600 | EN + curated ID | Core game logic, validation, MAIA suggestions, Clinical Reasoning |
| 2 | `master_icd_10.json` in `src/data/` | ~10,400 | EN + machine-translated ID | Fallback search DB, loaded into IndexedDB via `PersistenceService` |
| 3 | `master_icd_9.json` in `src/data/` | ~4,600 | EN only | Procedure code search |
| 4 | `ICD9_ALIASES` in `src/data/ICD9CM.js` | ~24 | ID (manual) | Search aliases for common Puskesmas procedures |

### Data Flow

```
master_icd_10.json (10,400 entries)
    │
    ▼  PersistenceService.syncData()
IndexedDB (PrimerMedicalDB.icd10)
    │
    ▼  PersistenceService.searchICD10()        ICD10_DB (~600 curated)
    │                                               │
    └──────────────┬────────────────────────────────┘
                   ▼
             findICD10()
                   │
       ┌───────────┴───────────┐
       ▼                       ▼
  EMR Diagnosis           MAIA Clinical Reasoning
  Search UI               & Evaluation Dashboard
                          (uses ICD10_DB directly)

master_icd_9.json (4,600 entries)
    │
    ▼  dynamic import
findICD9CM() ◄── ICD9_ALIASES (24 manual Indonesian terms)
    │
    ▼
EMR Procedure Search UI
```

**CRITICAL CODE — `PersistenceService.js` line 57:**

```js
const icd10Mapped = icd10Data.map(d => ({
    code: d.kode_icd,
    name: `${d.nama_icd} (${d.nama_icd_indo})`,  // ← appends broken translation
    category: d.kategori || 'general'
}));
```

This line is where the bad `nama_icd_indo` strings from `master_icd_10.json` get injected into the searchable `name` field that users see in the EMR search dropdown.

---

## 2. Findings: `ICD10_DB` (Curated — ✅ GOOD)

The ~600 entries in `ICD10.js` are **manually curated** and use correct Indonesian medical vernacular:

| Code | Name in `ICD10_DB` | Assessment |
|------|---------------------|------------|
| A09 | Gastroenteritis and colitis (Diare) | ✅ Correct |
| B36.0 | Pityriasis versicolor (Panu) | ✅ Correct |
| B77.9 | Ascariasis (Cacingan) | ✅ Correct |
| B86 | Scabies (Kudis) | ✅ Correct |
| I10 | Essential hypertension (Hipertensi) | ✅ Correct |
| K12.0 | Recurrent oral aphthae (Sariawan) | ✅ Correct |
| L50.9 | Urticaria (Biduran/Kaligata) | ✅ Correct |
| L60.0 | Ingrowing nail (Cantengan) | ✅ Correct |
| S93.4 | Sprain of ankle (Keseleo) | ✅ Correct |
| R55 | Syncope and collapse (Pingsan) | ✅ Correct |

**Verdict:** These are the terms that matter for gameplay. All use standard Indonesian Puskesmas clinical terminology and are clinically accurate.

---

## 3. Findings: `master_icd_10.json` (Machine-Translated — ❌ BROKEN)

The `nama_icd_indo` field contains what appears to be early-era Google Translate output (~2015 vintage). Evidence of **systematic** translation failures follows.

### 3.1 CRITICAL: Dangerously Wrong Translations

These could cause **clinical misunderstanding** if relied upon:

| Code | English | `nama_icd_indo` | Correct Indonesian | Error |
|------|---------|------------------|--------------------|-------|
| C38.0 | Malignant neoplasm of **heart** | "Neoplasma ganas **hati**" | "Neoplasma ganas **jantung**" | **"hati" = liver, "jantung" = heart. Completely wrong organ.** |
| R09.2 | **Respiratory arrest** | "**pernapasan lambat**" | "Henti napas" | **"slow breathing" ≠ respiratory arrest. Life-threatening difference.** |
| C38.8 | ...overlapping heart, mediastinum and pleura | "Neoplasma ganas **hati** tumpang tindih, mediastinum dan pleura situs" | Should say "jantung" | Same heart→liver error again |

### 3.2 Untranslated English Terms Left In

The translator left many English words untranslated:

| Code | English | `nama_icd_indo` | Problem |
|------|---------|------------------|---------|
| A06.7 | Cutaneous amoebiasis | "Amoebiasis **Cutaneous**" | "Cutaneous" not translated |
| A26.0 | Cutaneous erysipeloid | "Erysipeloid **Cutaneous**" | Same |
| A31.1 | Cutaneous mycobacterial infection | "Infeksi mikobakteri **Cutaneous**" | Same |
| A32.0 | Cutaneous listeriosis | "listeriosis **Cutaneous**" | Same |
| A22.0 | Cutaneous anthrax | "**Cutaneous anthrax**" | Fully untranslated |

### 3.3 Grammatically Inverted/Broken Sentences

| Code | English | `nama_icd_indo` | Problem |
|------|---------|------------------|---------|
| K25.0 | Gastric ulcer, acute with haemorrhage | "Ulkus lambung, **perdarahan akut dengan**" | Word order inverted — dangling preposition |
| K25.2 | ...acute with both haemorrhage and perforation | "Ulkus lambung, **perdarahan akut dengan baik dan perforasi**" | "both" → "baik" (wrong meaning entirely) |
| K31.1 | Adult hypertrophic pyloric stenosis | "**Dewasa** stenosis pilorus hipertrofik" | "Dewasa" (adult) placed as an adjective modifying stenosis |
| R10.0 | Acute abdomen | "**perut akut**" | "Acute stomach" — nonsensical in clinical context |
| A28.2 | Extraintestinal yersiniosis | "**mikroorganisme ini adalah** Yersiniosis ekstraintestinal" | Hallucinated preamble: "this microorganism is..." |

### 3.4 Wrong Word Sense (Homonym Errors)

| Code | English | `nama_icd_indo` | Problem |
|------|---------|------------------|---------|
| K38.0 | Hyperplasia of **appendix** | "Hiperplasia **lampiran**" | "lampiran" = email attachment, not the organ |
| K38.8 | Other specified diseases of **appendix** | "Penyakit tertentu lainnya dari **lampiran**" | Same error |
| R26.0 | Ataxic **gait** | "**kiprah** ataksik" | "kiprah" = career trajectory/demeanor, not walking pattern |
| R40.0 | **Somnolence** | "**sifat tidur**" | "nature/character of sleep" — wrong concept |
| R45.4 | Irritability and anger | "**Lekas ??marah dan kemarahan**" | Encoding artifact `??` visible |
| R36 | Urethral **discharge** | "**uretra**" | Only the organ name, entire clinical concept missing |
| R29.4 | **Clicking** hip | "**mengklik** hip" | "mengklik" = mouse clicking. Literal machine translation |
| A24.0 | Glanders | "**Sakit beringus**" | Nonsensical — not a real Indonesian medical term |

### 3.5 "Overlapping" Systematic Error

The ICD-10 term "overlapping" describes anatomical overlap between adjacent body regions. The translator consistently renders it as **"tumpang tindih"** (administrative/scheduling overlap), producing absurd results across **dozens** of codes:

- C44.8: "**Situs kulit tumpang tindih** neoplasma ganas"
- C38.8: "Neoplasma ganas **hati tumpang tindih**, mediastinum dan pleura **situs**"
- C31.8: "Neoplasma ganas **situs sinus tumpang tindih aksesori**"
- C14.8: "Neoplasma ganas **bibir tumpang tindih**, rongga mulut dan faring **situs**"

The word "sites" is also consistently translated as "situs" (website), not "lokasi" or "area".

### 3.6 Other Awkward But Understandable Translations

| Code | English | `nama_icd_indo` | Issue |
|------|---------|------------------|-------|
| K30 | Dyspepsia | "Pencernaan yg terganggu" | Informal, should be "Dispepsia" |
| R06.0 | Dyspnoea | "nafas yg sulit" | Casual, should be "Sesak napas" |
| K22.4 | Dyskinesia of oesophagus | "**Tardive** esofagus" | Wrong medical term (tardive ≠ dyskinesia) |
| R42 | Dizziness and giddiness | "Pusing dan **pusing**" | Translated both words to the same word |
| K22.1 | Ulcer of oesophagus | "**Maag** esofagus" | "Maag" is colloquial, not clinical |

---

## 4. Findings: `master_icd_9.json` (English Only — ⚠️ NO INDONESIAN)

The entire file of ~4,600 procedure codes is **exclusively in English** with no Indonesian text at all. Examples:

```json
{ "code": "86.59", "name": "Closure of skin and subcutaneous tissue of other sites" }
{ "code": "89.52", "name": "Electrocardiogram" }
{ "code": "93.54", "name": "Application of splint" }
```

An Indonesian user searching for "jahit luka" (suturing), "bidai" (splinting), or "nebulizer" would get zero results. This was partially mitigated by a manually created `ICD9_ALIASES` map covering 24 common Puskesmas procedures, but coverage remains minimal.

---

## 5. Impact Analysis

### What Users See in the EMR Search

When a player searches for a diagnosis:
1. `findICD10()` first queries IndexedDB (populated from `master_icd_10.json`)
2. The stored `name` field = `"English term (broken Indonesian)"` — **the broken translation is visible in the search dropdown**
3. Only if IndexedDB returns nothing does it fall back to the curated `ICD10_DB`

**Result:** For any of the ~10,000 codes NOT in `ICD10_DB`, the player sees the bad translation appended in parentheses.

### What the MAIA System Shows

The MAIA Clinical Reasoning panel and Evaluation dashboard **only use `ICD10_DB` directly**, so:
- ✅ Primary diagnoses always show curated names
- ✅ Differentials also resolve to curated names
- ✅ No exposure to `master_icd_10.json` translations in MAIA

---

## 6. Implementation Options

### Option A: Strip `nama_icd_indo` from IndexedDB (Quick Fix)

Change `PersistenceService.js` line 57:
```js
// Before:
name: `${d.nama_icd} (${d.nama_icd_indo})`
// After:
name: d.nama_icd
```

| Pro | Con |
|-----|-----|
| Zero risk, 1-line change | Loses the ~30% of translations that ARE reasonable |
| English medical terms universally understood by doctors | Players lose Indonesian search for non-gameplay codes |
| No validation of 10,400 entries needed | — |

### Option B: AI Re-Translation of `master_icd_10.json`

Use a modern LLM to re-translate all 10,400 `nama_icd_indo` entries with medical domain knowledge. Requires expert review.

| Pro | Con |
|-----|-----|
| Full Indonesian searchability | Requires medical expert review of 10,400 entries |
| Better UX for Indonesian-only speakers | Risk of new translation errors (AI hallucination) |
| — | Adds ~1.8MB to bundle; most codes never searched |
| — | Ongoing maintenance burden for ICD updates |

### Option C: Hybrid — Curate High-Priority + Strip Rest

Expand `ICD10_DB` with the top ~200 most-searched codes that are not already there, then strip `nama_icd_indo` for the remaining ~10,000.

| Pro | Con |
|-----|-----|
| Best of both worlds | Requires identifying "top codes" (no analytics yet) |
| Minimal risk, curated quality | More manual work than Option A |

### Option D: Search Alias Layer (Like ICD-9 Fix)

Keep English names in IndexedDB, add a `ICD10_ALIASES` map (similar to the working `ICD9_ALIASES`) for the ~100-200 codes that Indonesian users actually search using local terms.

| Pro | Con |
|-----|-----|
| Surgical precision, zero noise | Requires curating alias list |
| Same pattern as the working ICD-9 fix | Does not help for obscure codes |
| Smallest bundle impact | — |

---

## 7. Recommendation Matrix

| Criterion | Option A (Strip) | Option B (AI Re-translate) | Option C (Hybrid) | Option D (Aliases) |
|-----------|-----------------|---------------------------|-------------------|-------------------|
| Risk | 🟢 None | 🔴 High | 🟡 Low | 🟢 None |
| Effort | 🟢 1 line | 🔴 Days | 🟡 Hours | 🟡 Hours |
| UX Quality | 🟡 OK | 🟢 Best | 🟢 Good | 🟢 Good |
| Maintenance | 🟢 None | 🔴 Ongoing | 🟡 Low | 🟡 Low |
| Bundle Size | 🟢 Reduced | 🔴 Same/Larger | 🟢 Same | 🟢 Same |

**Note:** For a game context where the primary audience is medical students/doctors who understand English medical terminology, **Option A or D** is pragmatic. Option B is only worthwhile if the game will be deployed to community health workers (kader) who may not read English.

---

## 8. Summary of Key Files

| File | Path | Status | Action Needed |
|------|------|--------|---------------|
| PersistenceService.js | `src/services/PersistenceService.js` | Line 57 appends bad translations | Modify `syncData()` mapping |
| master_icd_10.json | `src/data/master_icd_10.json` | ~10,400 entries, bad machine translations | Source of problem (read-only) |
| master_icd_9.json | `src/data/master_icd_9.json` | ~4,600 entries, English-only | No action needed (aliases handle search) |
| ICD10.js | `src/data/ICD10.js` | ~600 curated entries | ✅ Already good quality |
| ICD9CM.js | `src/data/ICD9CM.js` | Has 24 manual aliases | May need expansion |

---

## 9. Question for Triangulation

Given this audit, what is the best implementation strategy considering:
1. The target audience is Indonesian medical students and dokter PTT
2. The game currently has 255 case scenarios, all of which already resolve correctly via the curated `ICD10_DB`
3. The `master_icd_10.json` is a standard reference dataset — modifying it directly is not ideal for maintainability
4. Bundle size matters (this is a web app that may be used in areas with slow internet)
5. The broken translations are only visible when searching for codes NOT used in any game scenario
