# PRIMER: Primary Care Manager Simulator — Complete Technical Bible

> **Version:** 0.9.x (Clinical Hardening Phase)  
> **Creator:** Anak Agung Bagus Wirayuda, MD, PhD  
> **Organization:** ITS MEDICS, Institut Teknologi Sepuluh Nopember, Surabaya, Indonesia  
> **Stack:** React 19 + Vite 7 (Vanilla JS/JSX)  
> **Architecture:** Zustand Monolith + GameContext Domain Facade  
> **Purpose:** Educational simulation game for training primary healthcare (Puskesmas) doctors in clinical decision-making and public health management  
> **HAKI:** Surat Pencatatan Ciptaan No. EC002026019623 (31 Januari 2026) — Kemenkumham RI  
> **Protection:** UU No. 28/2014, 50 tahun, Nomor Pencatatan 001104039  
> **Monitoring:** PRIMERA v5.1 (Proactive Brain) — Unified Health & Clinical Watchdog  
> **Last Updated:** March 2026 (Phase 0.9.x "Clinical Hardening")


---

## 1. GAME IDENTITY & CONCEPT

**PRIMER** is a single-player management/simulation game where the player assumes the role of a **fresh medical graduate** posted to a rural **Puskesmas** (Indonesian primary healthcare center). The game simulates the full scope of a Puskesmas doctor's responsibilities:

- **Clinical care** — Seeing patients, taking history, performing exams, ordering labs, diagnosing (ICD-10), prescribing medications, performing procedures (ICD-9-CM), writing referrals
- **Public health programs** — Running Posyandu (community health posts), managing Prolanis (chronic disease management), conducting home visits, PIS-PK family health surveys
- **Outbreak response** — Detecting, investigating, and responding to disease outbreaks (DBD, Malaria, Diare, ISPA)
- **Resource management** — Managing medication inventory, ordering supplies, upgrading facilities, balancing budgets (kapitasi)
- **Personal wellness** — Managing energy, stress, spirit, hygiene; sleeping, resting, weekend activities

The game is **bilingual Indonesian/English** (i18n via `react-i18next`), targeting medical students, residents, and public health professionals in Indonesia.

---

## 2. DEVELOPMENT CONTINUITY & AI SYNERGY

PRIMER is designed for long-term sustainability. It uses the **PRIMERA System** to ensure:
- **Zero-Muter (No Circles)**: Automated gates prevent regressions, so updates always move forward.
- **Clinical Integrity**: The `Clinical Watchdog` validates medical logic (ICD-10, dosage, procedures) against the `MedicationDatabase`.
- **AI-Ready Context**: Reflection headers allow agents like Antigravity to act with 100% architectural awareness.
- **Scalable Integrity**: The codebase reports its own health via a Unified Health Engine.

---

## 3. ARCHITECTURE OVERVIEW

```
src/
├── App.jsx                    # Router: OpeningScreen → PlayerSetup → MainLayout
├── main.jsx                   # React entry point
├── index.css                  # Global styles (14KB, vanilla CSS)
├── i18n.js                    # Internationalization config
│
├── store/
│   └── useGameStore.js         # ★ CENTRAL STATE (Zustand + Persistence)
│
├── domains/                    # ★ NEW DOMAIN LOGIC (vNext)
│   ├── village/
│   │   └── VillageRegistry.js  # Village population & families (Moved from data/)
│   └── community/
│       └── OutbreakSystem.js   # Disease outbreak detection & response (Moved from game/)
│
├── content/                    # ★ NEW CONTENT LAYER (vNext)
│   ├── cases/
│   │   ├── CaseLibrary.js      # Unified entry point for case data
│   │   └── modules/            # Sub-modules: infectious, metabolic, etc.
│   ├── concepts/               # Future ideas (Markdown only)
│   └── ...
│
├── context/
│   ├── GameContext.jsx         # Domain Facade (Thinned, focus on clinical state)
│   └── ThemeContext.jsx        # Dark/light theme toggle
│
├── game/                      # ★ CORE GAME ENGINES (Logic Only)
│   ├── BillingEngine.js        # Medical billing & cost logic (2KB)
│   ├── ValidationEngine.js     # Clinical accuracy validation (8KB)
│   ├── EmergencyCases.js       # Emergency/IGD cases with triage (57KB)
│   ├── AnamnesisEngine.js      # History-taking logic (46KB)
│   ├── ClinicalReasoning.js    # ★ MAIA REASONING ENGINE (12KB)
│   ├── AnamnesisVariations.js  # Persona-based response variations (127KB)
│   ├── AnamnesisPrompts.js     # LLM prompt templates (1.2KB)
│   ├── PatientGenerator.js     # Patient creation with demographics (30KB)
│   ├── PosyanduEngine.js       # Community health post activities (10KB)
│   ├── ProlanisEngine.js       # Chronic disease management (11KB)
│   ├── QuestEngine.js          # Daily/weekly mission system (6KB)
│   ├── CPPTEngine.js           # SOAP medical records (6KB)
│   └── GuestEventSystem.js     # Special visitor events (1.3KB)
│
├── data/                       # ★ STATIC DATA LAYER
│   ├── WikiData.js             # Modular Medical Encyclopedia (Aggregator)
│   │   └── wiki/               # Sub-modules: manajemen, wilayah, klinis, penyakit, obat, lab_prosedur
│   ├── MedicationDatabase.js   # Drug database with prices (158KB)
│   ├── ProceduresDB.js         # Physical exam & clinical procedure data (11KB)
│   ├── EducationOptions.js     # Patient education constants (36KB)
│   ├── ICD9CM.js               # Procedure codes search engine (1KB)
│   ├── ICD10.js                # Diagnosis codes (24KB)
│   ├── FKTP144Diseases.js      # 144 mandatory primary care diseases (19KB)
│   ├── CalendarEventDB.js      # National health days & events (13KB)
│   ├── ProlanisDB.js           # Chronic disease parameter configs (13KB)
│   ├── ClinicalServices.js     # Poli/service routing (5KB)
│   ├── FurnitureData.js        # Rumah Dinas furniture upgrades (6KB)
│   ├── HospitalDB.js           # Referral hospital database (2KB)
│   ├── SupplierDatabase.js     # Medical supplier catalog (4KB)
│   ├── AppMetadata.js          # Version/HAKI metadata (2KB)
│   ├── master_icd_10.json      # Full ICD-10 master data (1.8MB)
│   └── master_icd_9.json       # Full ICD-9-CM master data (605KB)
│
├── components/                 # ★ UI COMPONENTS (52 files)
│   ├── MainLayout.jsx          # Top-level layout with sidebar navigation
│   ├── Dashboard.jsx           # Main dashboard with glassmorphism cards
│   ├── PatientEMR.jsx          # ★ ORCHESTRATOR — Decomposed into 10 modules
│   ├── emr/                    # ★ MODULAR EMR COMPONENTS
│   │   ├── AnamnesisTab.jsx    # Patient interview logic
│   │   ├── PhysicalExamTab.jsx # Body map & exam findings
│   │   ├── LabTab.jsx          # Lab ordering & results
│   │   ├── AssessmentTab.jsx   # ICD-10 diagnosis
│   │   ├── TreatmentTab.jsx    # Medication prescription
│   │   ├── ProceduresTab.jsx   # ICD-9-CM clinical procedures
│   │   ├── EducationTab.jsx    # Patient education
│   │   ├── BillingTab.jsx      # BPJS & General billing logic
│   │   ├── ClinicalSidebar.jsx # SOAP summary & MAIA validation
│   │   └── HistoryTab.jsx      # Medical history archive
│   ├── WilayahPage.jsx         # Procedural village map with canvas (153KB)
│   ├── EmergencyPanel.jsx      # IGD triage & stabilization (42KB)
│   ├── KPIDashboard.jsx        # Performance analytics (42KB)
│   ├── ArsipPage.jsx           # Patient archive/history (40KB)
│   ├── ReferralSISRUTEModal.jsx # Referral workflow simulation (31KB)
│   ├── ... (35 more components)
│
├── services/
│   └── LLMService.js           # OpenAI/Gemini API integration (2KB)
│
├── utils/
│   ├── TextureGenerator.js     # Procedural pixel art textures (69KB)
│   ├── SoundManager.js         # FM synthesis audio engine (12KB)
│   ├── SocialDeterminants.js   # WHO-SDoH patient profiling (9KB)
│   ├── LevelingSystem.js       # XP curve & level-up logic (2KB)
│   └── AvatarUtils.js          # Avatar style generator (1.9KB)
│
├── scripts/                    <-- ★ AUTOMATION & MONITORING (PRIMERA)
│   └── primera/                <-- [NEW] Core Logic
│       ├── megalog_v5.mjs      # Orchestrator
│       ├── health_engine.mjs   # Unified Calculator
│       ├── clinical_watchdog.mjs # Medical Logic Validator
│       └── ...
│
├── PRIMERA_megalog.md          # Automated health report
├── PRIMER_BIBLE.md             # Technical documentation (this file)
└── assets/                     # Images, sprites, building PNGs
```

---

## 3. THE GAME LOOP

### 3.1 Daily Flow

```
┌─ Morning ──────────────────────────────────────┐
│  Wake up → Morning status effects (alarm)      │
│  Energy/Spirit restored based on sleep quality  │
│  Daily quests assigned                          │
│  Prolanis patients scheduled                    │
│  Calendar events triggered                      │
└────────────────────────────────────────────────┘
          │
┌─ Clinical Hours (08:00-16:00) ─────────────────┐
│  Patient queue generated (seasonal, profile)    │
│  Emergency patients may arrive (random)         │
│  For each patient:                              │
│    1. Greeting & complaint                      │
│    2. Anamnesis (persona-adapted dialogue)       │
│    3. Physical examination                      │
│    4. Lab orders (cost deducted)                │
│    5. Diagnosis (ICD-10 search)                 │
│    6. Treatment (medication from inventory)     │
│    7. Procedures (ICD-9-CM)                     │
│    8. Education topics                          │
│    9. Discharge OR Referral (SISRUTE workflow)  │
│   Each action costs TIME + ENERGY               │
│   CPPT record auto-generated on discharge       │
└────────────────────────────────────────────────┘
          │
┌─ Evening / Night ──────────────────────────────┐
│  End-of-day report (patients seen, accuracy)    │
│  Quest progress checked                         │
│  Population health indicators updated (IKS)     │
│  Outbreak checks triggered                      │
│  Sleep → set alarm → next day                   │
└────────────────────────────────────────────────┘
```

### 3.2 Day Advancement (`nextDay()` — useGameStore.js)

The `nextDay` function in the Zustand store (`useGameStore.js`) acts as the central orchestrator for day transitions:

- **Morning Briefing**: `generateMorningBriefing()` produces staff report, stock alerts, KPIs, priority suggestion
- **AI Director**: `TheDirector.evaluateDirectorState()` evaluates player stress → adjusts pacing (mercy→crisis)
- **UKM Cases**: `BehaviorCaseEngine.selectDailyCases()` picks daily behavior change scenarios
- **IKM Events**: `IKMEventEngine.evaluateIKMTriggers()` checks community health events
- **UKP Bridge**: `TheDirector.processUKPBridge()` converts failed UKM cases into clinical consequences
- **Clinical**: Queue generation with seasonal/pacing multipliers
- **Finance**: Archive + monthly reporting (kapitasi settlement)
- **Outbreak**: Cluster detection + auto-receive pending supply orders
- **Staff**: Morale/burnout decay
- **Quests**: `QuestEngine` generates new daily/weekly missions

This modular approach ensures each system manages its own reset logic.

### 3.3 Weekend System

Weekends (every 7th day) offer leisure activities that restore spirit/stress:
- Fishing, Jogging, Reading, Socializing (`performWeekendActivity`)
- Each activity has trade-offs (energy cost vs. spirit/stress recovery)

---

## 4. CORE ENGINES — DEEP DIVE

### 4.1 Patient Generator (`PatientGenerator.js`)

Generates patients with realistic demographics tied to village population data:

**Inputs:**
- Current time (affects arrival patterns)
- Village population registry (VillageRegistry.js)
- Current game day (for seasonal disease multipliers)
- Facility levels (determines available polis)
- Player skills (unlocks more complex cases)

**Key Features:**
- **Profile-based generation**: Patients with pre-existing conditions (from VillageRegistry) arrive with correlated diseases. Example: a villager with `hypertension_stage2` will present with `hypertension_primary`, `hypertensive_crisis`, or `tension_headache`.
- **Seasonal multipliers**: Rainy season (Jan/Feb/Nov/Dec) → 3x dengue, 2x diarrhea, 1.5x ILI. Dry season → 2x URI, 2x skin infections.
- **Demographic realism**: Indonesian names, age-appropriate occupations (WHO SDoH framework), education levels, housing types, family structures, health beliefs.
- **Anthropometric generation**: Height/weight/BMI generated with percentile-based variation by age and gender.
- **Poli routing**: Patients auto-routed to `poli_umum`, `poli_gigi`, or `poli_kia` based on case category.

### 4.2 Case Library (`CaseLibrary.js`)

A unified entry point for all clinical cases. As of Version 0.6.5, the cases have been migrated from a single massive file into specialized modules within `/src/game/cases/` (Infectious, Metabolic, Others, Emergency).

**Key Features:**
- **Centralized Registry**: Re-exports all cases into a single `CASE_LIBRARY` array.
- **Search & Match**: Provides `getCaseByCondition(caseId)` for finding cases by ID, name, or ICD-10 code.
- **Unified logic**: Serves as a gateway for clinical logic re-exported from `ValidationEngine.js` and `BillingEngine.js`.

```javascript
{
  id: 'dengue_df',
  diagnosis: 'Dengue Fever',
  diagnosisName: 'Demam Dengue',
  icd10: 'A90',
  skdi: '4A',           // SKDI competency level
  category: 'Infectious',
  complaint: 'Demam tinggi mendadak sejak 3 hari...',
  
  // Demographic constraints
  ageRange: [5, 50],
  genderSpecific: null,
  
  // Clinical data
  physicalExamFindings: {
    head: 'Flushing...',
    abdomen: 'Hepatomegali 2 jari...',
    skin: 'Petekie positif pada tourniquet test...',
    // ... more systems
  },
  
  labs: {
    cbc: { result: 'Trombosit 85.000/µL', flag: 'low', cost: 50000 },
    ns1_antigen: { result: 'Positif', flag: 'abnormal', cost: 150000 },
  },
  
  // Correct answers (for scoring)
  trueDiagnosisCode: 'A90',
  correctTreatment: ['paracetamol_500', 'oralit'],
  correctProcedures: ['iv_fluid'],
  correctEducation: ['fluid_intake', 'warning_signs', 'mosquito_prevention'],
  
  // Anamnesis questions (4-8 per case, categorized)
  anamnesisQuestions: {
    keluhan_utama: [
      { id: 'q_main', text: 'Ceritakan keluhan utama Anda?', response: '...' }
    ],
    riwayat_penyakit: [...],
    riwayat_keluarga: [...],
    sosial_lingkungan: [...]
  },
  
  // Inline variations (some cases have these)
  anamnesisVariations: {
    q_main: {
      low_education: '...',
      anxious: '...'
    }
  }
}
```

**Case Categories:** Infectious, Respiratory, Dermatology, GI, Cardiovascular, Musculoskeletal, Neurology, Ophthalmology, ENT, Dental, OB/GYN, Maternal, Pediatric, Metabolic/Endocrine, Tropical, Emergency, Psychiatric, General.

### 4.3 Anamnesis Engine (`AnamnesisEngine.js` — 46KB)

The most complex clinical engine, responsible for patient interview simulation:

**Flow:**
1. Patient greeting exchange (gender/time-adapted)
2. Chief complaint presented via persona-adapted text
3. Player selects question category tab (Keluhan Utama, Riwayat Penyakit, Riwayat Keluarga, Sosial & Lingkungan)
4. Player clicks a question → `getAdaptiveResponse()` fires
5. Response selected from: inline variations → AnamnesisVariations.js → base response
6. Doctor acknowledgment auto-generated
7. For pediatric cases: child-direct questions available
8. All exchanges logged to `anamnesisHistory[]`

**Persona System (6 types):**
- `low_education` — Simple language, colloquialisms, may confuse medical terms
- `high_education` — Uses medical terminology, precise descriptions
- `skeptical` — Terse, distrustful, minimum information
- `anxious` — Catastrophizes, asks if they're dying, seeks reassurance
- `child_proxy` — Parent/guardian speaking on behalf of child
- `elderly` — Respectful address ("Nak Dokter"), polite, traditional

Persona is **auto-assigned** via `pickPersona()` based on patient demographics (age, education level, social factors).

**AnamnesisVariations.js (127KB):** Contains persona-adapted responses for **all 159 cases** (as of latest update). Structure: `VARIATIONS[caseId][questionId][persona] = responseText`.

**LLM Integration (optional):** If configured, `LLMService.js` can generate dynamic responses via OpenAI/Gemini API using prompts from `AnamnesisPrompts.js`. Falls back to static variations when offline.

**Anamnesis Synthesis:** `synthesizeAnamnesis()` converts raw question-answer history into a structured SOAP-compatible clinical summary, auto-detecting covered domains and key findings.

### 4.4 Emergency System (`EmergencyCases.js` + `EmergencyPanel.jsx`)

Separate clinical pathway for IGD (emergency unit) cases:

**Triage System (Dual):**
- **START Triage**: Color-coded (MERAH=Immediate, KUNING=Delayed, HIJAU=Minor, HITAM=Deceased)
- **ESI (Emergency Severity Index)**: 5 levels from Resuscitation to Non-Urgent

**Emergency Cases:** Feature `deteriorationRate` — patients physiologically worsen per-minute if untreated. Cases include:
- Severe Hypoglycemia (Level 1, 5 pts/min)
- Anaphylactic Shock (Level 1, 8 pts/min)  
- Status Epilepticus (Level 1)
- Febrile Seizure (Level 2)
- Asthma Exacerbation (Level 2)
- Burns (Level 2-3)
- Snake Bite (Level 2)
- Drowning (Level 1)
- And more...

**Emergency Actions:** 50+ standardized actions (IV line, intubation, nebulizer, medications) with costs, required items, and stock deduction.

**Dr. MAIA:** AI assistant NPC who can handle patients when the player delegates. Generates her own CPPT records with `buildMaiaCPPTRecord()`.

### 4.5 CPPT Engine (`CPPTEngine.js`)

Generates **SOAP-format** (Subjective, Objective, Assessment, Planning) medical records for every patient encounter:

```javascript
{
  subjective: {
    chiefComplaint: '...',
    anamnesisSynthesis: { /* structured checklist */ },
    anamnesisScore: 85
  },
  objective: {
    physicalFindings: { head: '...', abdomen: '...' },
    labResults: { cbc: { result: '...', flag: 'low' } }
  },
  assessment: {
    diagnoses: [{ code: 'A90', name: 'Dengue Fever' }],
    trueDiagnosis: 'A90',
    isCorrectDiagnosis: true
  },
  planning: {
    action: 'treat',
    medications: ['paracetamol_500'],
    procedures: ['iv_fluid'],
    education: ['fluid_intake'],
    referralTarget: null
  },
  outcome: {
    status: 'recovered',
    satisfaction: 90,
    isCorrectAction: true
  }
}
```

### 4.6 Posyandu Engine (`PosyanduEngine.js`)

Simulates monthly community health post events:

**Activities:**
- `penimbangan` — Child weighing (detects faltering growth)
- `kms` — Growth chart (KMS) documentation
- `imunisasi` — Vaccination (tracks schedule by age)
- `penyuluhan_gizi` — Nutrition education
- `pmba` — Complementary feeding (6mo-2yr)

**Mechanics:**
- Runs every 30 in-game days
- Attendance rate: base 60% + 15% if player sends reminder
- Eligible participants filtered from VillageRegistry by age
- Activities impact IKS indicators (immunization ↑, nutrition ↑)
- Vaccine schedule tracked per child (BCG, DPT, Polio, etc.)

### 4.7 Prolanis Engine (`ProlanisEngine.js`)

Chronic disease management simulation for DM Type 2 and Hypertension:

**Monthly Visit Loop:**
1. Patient arrives with current parameters (HbA1c, FBG for DM; SBP/DBP for HTN)
2. Random events may occur (diet cheating, exercise started, medication skipped)
3. Player makes intervention decisions (adjust medication, lifestyle counseling)
4. `simulateParameterChange()` calculates new values based on intervention + events + drift
5. Complication risk calculated (`calculateComplicationRisk()`)
6. Complications can trigger (stroke, MI, renal failure, diabetic foot)
7. Patient may be referred to hospital if uncontrolled

**Parameters fluctuate realistically** with random drift, treatment effects, and event impacts.

### 4.8 Outbreak System (`OutbreakSystem.js`)

**4 Outbreak Types:**

| Type | Trigger | Spike | Duration | Actions |
|------|---------|-------|----------|---------|
| DBD (Dengue) | 2+ cases | 1.5x | 14 days | Fogging, Larviciding, PSN, Education |
| Malaria | 2+ cases | 1.4x | 10 days | Bed nets, MDA, Breeding site elimination |
| Diare (Diarrhea) | 3+ cases | 1.3x | 7 days | Water testing, ORS distribution, Sanitation |
| ISPA (Respiratory) | 5+ cases | 1.3x | 7 days | Mask campaign, Ventilation, Education |

**Mechanics:**
- `checkForOutbreakTrigger()` monitors case clusters by ICD-10 code within time window
- During outbreak: patient generation rate multiplied by spike factor
- Player must perform response actions to reduce severity
- Each action has energy/time cost and effectiveness rating
- Failed/expired outbreaks penalize reputation and IKS

### 4.9 Quest Engine (`QuestEngine.js`)

**Daily Quests (3/day, random):**
- Kunjungi 3 keluarga (Home Visits)
- Kunjungi 2 keluarga berisiko (Risk Visits)  
- PSN di 5 rumah (Mosquito Breeding Site Inspection)
- 5 intervensi kesehatan (Health Interventions)

**Weekly Quests (2/week, random):**
- Tangani 20 pasien (Treat 20 Patients)
- Tingkatkan IKS 5 keluarga (Improve 5 Family Health Indices)
- Layani 10 pasien Prolanis (Serve 10 Chronic Patients)

Quests provide XP rewards (50-250) and drive gameplay direction.

### 4.10 Clinical Validation & Billing Engines

The game features specialized engines for validating clinical correctness and calculating costs:

- **Validation Engine (`ValidationEngine.js`)**:
    - **Diagnosis Validation (`validateDiagnosis`)**: Matches player-selected ICD-10 codes against the case's primary code and differentials.
    - **Treatment Validation (`validateTreatment`)**: Checks medications and procedures. Requires `correctTreatment` and `correctProcedures` in `medicalData`.
    - **Exams & Labs**: Ensures critical physical systems and relevant labs were performed.
    - **Anamnesis**: Scores interview completeness based on essential questions.
- **Billing Engine (`BillingEngine.js`)**:
    - **Automated Invoicing**: Calculates costs for consultation, medications, labs, and procedures.
    - **BPJS Support**: Handles zero-cost final bills for patients with national health insurance.

### 4.11 MAIA Clinical Reasoning Engine (`ClinicalReasoning.js`)

**MAIA (Medical AI Assistant)** provides real-time clinical reasoning support:

1. **Bayesian Diagnostic Tracker**: Calculates diagnostic confidence for each differential based on anamnesis, physical exam, and lab findings.
2. **Unified Coverage Scoring**:
    - **Macro Coverage**: Standard 7 domains of medical history.
    - **Micro Coverage**: Case-specific essential findings.
    - **Sacred 7 / Basic 7**: Adherence to formal history-taking structures.
3. **Context-Aware Alerts**: Dynamic interrupts (Amber/Yellow) when critical diagnostic items are missing or when clinical probability shifts significantly.
4. **Reasoning Dashboard**: Visualizes multi-source EBM weights (70% Anamnesis, 15% Physical, 15% Labs) to guide player decision-making.

### 4.12 TheDirector — AI Drama Director (`TheDirector.js`)

Inspired by **Left 4 Dead's AI Director**. Dynamically adjusts game pacing based on player stress.

- **Stress Calculation**: Weighted sum of queue pressure (30%), energy drain (25%), outbreak active (20%), reputation risk (15%), caseload today (10%)
- **5 Pacing Profiles**: Crisis (↑1.6× spawn) → Pressure → Normal → Breathing → Mercy (↓0.4× spawn)
- **Gift System**: Mercy/breathing modes may spawn free supplies, volunteers, or morale boosts
- **UKP Bridge Processor**: Converts failed/partial UKM behavior change cases into delayed clinical consequences (the "karma loop")

### 4.13 Behavior Change Engine (`BehaviorCaseEngine.js`)

Core UKM engine for community health behavior interventions using the **COM-B Framework**:

- **6-Phase Lifecycle**: Investigation → Diagnosis → Planning → Intervention → Follow-up → Evaluation
- **COM-B Diagnosis Scoring**: Player identifies barriers (Capability-Opportunity-Motivation), scored against ground truth
- **SDOH Armor**: Socio-economic disadvantage creates resistance to interventions; accurate diagnosis mitigates resistance
- **UKM→UKP Bridge**: Failed cases trigger clinical consequences (e.g., failed PSN → dengue patient in IGD)
- **Deterministic Karma**: `fail` outcome = guaranteed IGD consequence; `partial` = probabilistic
- **Daily Case Selection**: `selectDailyCases()` picks scenarios based on day, season, SDOH matching, and tier

### 4.14 IKM Event Engine (`IKMEventEngine.js`)

Community public health event lifecycle engine:

- **Trigger Evaluation**: Season-aware, SDOH-dependent probabilistic triggers
- **IKM↔BC Overlap Prevention**: When a BC deep case covers the same topic, the IKM quick event is suppressed
- **Phase Management**: Discovery → Dialog (player choice) → Action (metric-based) → Resolution
- **Impact System**: Reputation, XP, IKS score, outbreak risk reduction
- **Season Logic**: Indonesia Oct-Mar = rainy, Apr-Sep = dry

### 4.15 Story Database (`StoryDatabase.js`)

Branching narrative quests triggered by day/stat milestones:
- **Misteri Sungai Cikapas**: Mass hysteria vs. CO2 poisoning investigation
- **Ancaman MDR-TB**: Multi-drug resistant TB detection
- **Kembalinya Difteri**: Diphtheria outbreak response + ORI
- **Desa Merah Stunting**: Stunting prevalence intervention
- **Racun di Sawah**: Pesticide poisoning investigation
- **Dukun & Bidan Partnership**: Traditional birth attendant integration

### 4.16 Additional Engines

| Engine | Size | Purpose |
|--------|------|---------|
| `DispensingEngine.js` | 15KB | Pharmacy 5-rights verification, drug interactions, class-based allergy matching, FORNAS billing |
| `ConsequenceEngine.js` | 13KB | Post-discharge consequence spawning: follow-up patients, complication scheduling |
| `KaderNetwork.js` | 10KB | Community health volunteer (kader) management and effectiveness |
| `EmergingEventTriggers.js` | 12KB | 5 emerging disease triggers: diphtheria, avian influenza, anthrax, malaria, pertussis |
| `DebriefEngine.js` | 14KB | End-of-day report generation, daily summary, performance feedback |
| `MiniGameLibrary.js` | 26KB | Interactive mini-games for UKM interventions (inspeksi_kilat, baca_ekspresi, susun_strategi) |
| `LabEngine.js` | 24KB | Lab test ordering, result interpretation, cost tracking |
| `GrowthChartEngine.js` | — | WHO z-score (BB/U, TB/U, BB/TB), faltering detection |
| `ImmunizationEngine.js` | — | 14+ vaccines, national schedule, catch-up, coverage tracking |
| `GameCore.js` | 4KB | Core game loop primitives |

---

## 4B. THE UKM ↔ UKP BRIDGE ("The Karma Loop")

**The defining gameplay mechanic**: failure at UKM (preventive) spawns consequences at UKP (clinical).

```
UKM Failure (BehaviorCaseEngine)
    └→ processUKPBridge() (TheDirector.js)
         └→ Delayed Clinical Consequence (3-14 days)
              └→ Patient arrives at IGD/Poli with severe condition

Examples:
  Failed PSN campaign → child with Dengue Shock Syndrome
  Failed TB adherence → household contact develops active TB
  Failed dukun-bidan program → postpartum hemorrhage at 2 AM
```

---

## 4C. CRITICAL DATA CONTRACTS

> ⚠️ **THE #1 BUG SOURCE**: Data contract drift between generators and consumers.

### Patient Object Data Paths
```javascript
// BPJS status (authoritative path)
patient.social.hasBPJS                // PRIMARY — PatientGenerator
patient.hidden.bpjs                   // FALLBACK

// Allergy data
patient.hidden.allergies              // PRIMARY (hidden from player)

// Medication decision format (from usePatientEMR.js)
decision.medications = [{ id, medId, dose, frequency, duration }]  // OBJECTS!
// ⚠️ Many comparators still expect string IDs like 'amlodipine_5'
// Always normalize: const medId = typeof m === 'object' ? (m.id || m.medId) : m;
```

### Inventory Item Shape
```javascript
// state.finance.pharmacyInventory is an ARRAY:
{ medicationId: 'amoxicillin_500', stock: 100, lastRestockDay: 5 }
// ⚠️ NOT { name, quantity, minStock } — those are stale field references
// Lookup metadata: getMedicationById(medicationId) from MedicationDatabase.js
```

### Drug Class Allergy System
```javascript
// DispensingEngine.js exports matchDrugAllergy(med, allergies)
// Maps class names to specific medications:
//   'Penisilin' → [amoxicillin, ampicillin, penicillin, ...]
//   'NSAID' → [ibuprofen, asam_mefenamat, piroxicam, ...]
//   'Sefalosporin' → [cefadroxil, cefalexin, cefixime, ...]
// Used in both pharmacy verification AND EMR allergy firewall
```

---

## 5. DATA LAYER

### 5.1 Village Registry (`VillageRegistry.js` — 55KB)

Pre-generated village population with **families and individual villagers**. Each family has:
- Head of household, spouse, children, elderly members
- House location (mapped to village map buildings)
- PIS-PK indicators (12 health indicators per family)
- Pre-existing conditions (hypertension, DM, tuberculosis, etc.)
- IKS (Indeks Keluarga Sehat) score per family

### 5.2 Medication Database (`MedicationDatabase.js` — 158KB)

700+ items including:
- Drugs: name, category, price, indications, dosage, contraindications
- Medical equipment: surgical instruments, consumables
- Organized by category (Analgesics, Antibiotics, Antihypertensives, etc.)

### 5.3 Wiki System (`WikiData.js` — 249KB)

In-game medical encyclopedia with entries for:
- Diseases (pathophysiology, diagnosis, treatment)
- Procedures (techniques, indications, complications)
- Lab tests (interpretation, normal values)
- Public health programs (Posyandu, Prolanis, PIS-PK)
- Triggered contextually via info icons in the EMR

### 5.4 ICD Systems

- **ICD-10** (`ICD10.js` + `master_icd_10.json`): Full diagnosis code search for patient discharge
- **ICD-9-CM** (`ICD9CM.js` — 606KB): Procedure codes for clinical procedures
- **FKTP-144** (`FKTP144Diseases.js`): 144 diseases mandatory for primary care (SKDI 4A)

### 5.5 Supplementary Data

- `HospitalDB.js` — Referral hospitals (RSUD, RS Swasta) with specialties and ambulance availability
- `SupplierDatabase.js` — Medical suppliers with delivery times and pricing
- `CalendarEventDB.js` — Indonesian national health days (Hari Kesehatan Nasional, Hari AIDS, etc.)
- `ProlanisDB.js` — Disease-specific parameter ranges, events, and educational materials for chronic disease management
- `ClinicalServices.js` — Service/poli routing configuration
- `FurnitureData.js` — Upgradeable furniture for Rumah Dinas (doctor's house)

---

## 6. UI/UX ARCHITECTURE

### 6.1 Design Language

- **Theme:** Futuristic glassmorphism, dark mode primary with emerald green accents
- **Icons:** Lucide React icon library
- **Sound:** FM synthesis audio engine (SoundManager.js) inspired by FF8 Junction system — all sounds generated with Web Audio API, no audio files
- **Typography:** System fonts, with emoji-heavy UI for quick visual parsing
- **Animations:** CSS transitions and micro-animations for hover/click feedback

### 6.2 Core Pages

| Page | Component | Description |
|------|-----------|-------------|
| Opening | `OpeningScreen.jsx` | Title screen with game logo |
| Setup | `PlayerSetup.jsx` | Character creation, name, avatar selection |
| Dashboard | `Dashboard.jsx` | Main hub: stats, quick actions, patient queue |
| Clinical | `ClinicalPage.jsx` | Patient queue + EMR side-by-side view |
| EMR | `PatientEMR.jsx` (180KB) | Full electronic medical record with 8+ tabs |
| Emergency | `EmergencyPanel.jsx` | IGD triage, stabilization, real-time timers |
| Village Map | `WilayahPage.jsx` (153KB) | Procedural pixel art village, home visits, PIS-PK |
| KPI | `KPIDashboard.jsx` | Analytics, accuracy stats, charts |
| Archive | `ArsipPage.jsx` | CPPT history, patient records |
| Inventory | `InventoryPage.jsx` | Medication stock management |
| Facilities | `GedungPage.jsx` | Building upgrades (poli, lab, pharmacy) |
| Staff | `StaffPage.jsx` | Staff management |
| Training | `DiklatPage.jsx` | Skill tree, continuing education |
| Rumah Dinas | `RumahDinas.jsx` | Doctor's home (rest, sleep, furniture) |
| Sarana | `SaranaPage.jsx` | Medical equipment management |

- **Refactored Architecture**: As of Version 0.6.5, `PatientEMR.jsx` has been decomposed into 10 specialized sub-components in `src/components/emr/`. This improves state management performance and clinical logic isolation.
1. **Anamnesis Tab** — Chat-style dialogue with selectable questions, category tabs, persona-adaptive responses
2. **Physical Exam Tab** — Body system examination with BodyMapWidget integration
3. **Lab Tab** — Lab test ordering with cost tracking and Wiki interpretation
4. **Assessment Tab** — ICD-10 searchable diagnostic module
5. **Treatment Tab** — Smart formulary with MAIA recommendations
6. **Procedures Tab** — Expanded ICD-9-CM routine procedures (25+ routine FKTP actions). Supports mapping of internal game IDs to real-world ICD-9-CM codes via `PROCEDURE_CODE_MAP` in `CaseLibrary.js` for flexible validation.
7. **Education Tab** — EBM-based patient education suggestions
8. **History Tab** — Contextual patient visit history
9. **Billing Tab** — Automated BPJS/General billing breakdown
10. **Clinical Sidebar** — Real-time SOAP synthesis, MAIA validation, and referral triggers

### 6.4 Village Map (`WilayahPage.jsx`)

The village map features a **Dual-Mode Architecture** to balance strategic oversight and visual immersion for a scalable 200 KK (family) demographic:
1. **2D Blueprint (Helicopter View)**: Dom/CSS-based map overlaying procedural SVG terrain (`Map2DBlueprint.jsx`) for high-performance viewing and interactions across 250+ markers. Features semantic zoom, "Fog of War" for locked RWs, and click telemetry.
2. **3D Pocket Diorama (Dollhouse View)**: Interactive WebGL isometric view (Three.js) focused on rendering 1 active RW at a time to prevent performance bottlenecks over scalable terrain.

**Integrated Gameplay Mechanics**:
- **Demographics & SDOH**: `VillageRegistry.js` defines socioeconomic stats, 13 PIS-PK indicators, and housing types for 200 interconnected families across 8 progressive RWs.
- **Home Visits & PIS-PK**: 12 specific interventions (e.g., KB counseling, TB tracking) that cost energy but alter family PIS-PK indicators over time.
- **Building Scenes**: 15 interactive facilities (Posyandu, SDN, MCK, Farm, Pustu, etc.) containing NPCs, minigames, and actionable `stations` linking the community to clinical outcomes.
- **IKM & Behavior Change (BC) Cases**: Triggered community events with COM-B analysis forensically examining Capability, Opportunity, and Motivation to permanently alter health behaviors.
- **Outbreak System & UKP Bridge**: The "Karma Loop." Neglected UKM tasks (e.g., failed PSN) spawn UKP emergencies in the clinic (e.g., DSS patients in IGD 3-14 days later). Includes seasonal disease multipliers.
- **The Director (AI Pacing)**: Dynamic game difficulty manager inspired by *Left 4 Dead*. Adjusts spawn rates, events, and "Mercy Gifts" based on the player's real-time stress score (Queue length, Energy, Reputation, Outbreaks).

---

## 7. STATE MANAGEMENT

### 7.1 Architecture: Zustand Monolith + GameContext Facade

All game state lives in `useGameStore.js` (~3000 lines) — a **Zustand store** with `persist` middleware (auto-save to localStorage). `GameContext.jsx` is a thin **domain facade** that selects and re-exports Zustand slices for convenience. Components should call `useGame()` hook; internal code can access the store directly.

```javascript
// ── Time ──
world: { day, time, currentWeek, isWeekend, speed }

// ── Player ──
player: { name, gender, avatar, level, xp, energy, maxEnergy, spirit, stress, confidence }

// ── Clinical (UKP) ──
clinical: {
  queue: [],              // Today's patient queue
  emergencyQueue: [],     // IGD patients
  activePatientId,        // Currently viewed
  history: [],            // All treated patients
}

// ── Finance ──
finance: {
  stats: { kapitasi, pendapatanUmum, pengeluaranObat, ... },
  kpi: { totalPatients, correctDiagnoses, ... },
  pharmacyInventory: [],  // Array of { medicationId, stock, lastRestockDay }
  pendingOrders: [],      // Supplier orders in transit
}

// ── Public Health (UKM) ──
publicHealth: {
  villageData: {},        // Full village registry
  outbreaks: [],          // Active outbreaks
  prolanisRoster: [],     // Chronic disease patients
  activeBCCases: [],      // Behavior change cases
  activeIKMEvents: [],    // Community health events
}

// ── Progression ──
quests: { daily: [], weekly: [] }
cpptHistory: []           // All SOAP records
facilities: {}            // Building upgrade levels
skills: {}                // Unlocked skill tree nodes
```

### 7.2 Key Context Functions

| Function | Purpose |
|----------|---------|
| `admitPatient(id)` | Move patient from queue to active |
| `updatePatient(id, updates)` | Update patient data mid-encounter |
| `dischargePatient(patient, decision)` | Complete encounter, validate treatment, generate CPPT, award XP |
| `orderLab(patientId, labName, cost)` | Deduct funds, reveal lab results |
| `nextDay(targetDay)` | Advance game day with all recalculations |
| `sleepWithAlarm(targetHour)` | Sleep system with alarm clock |
| `gainXp(amount)` | Award XP with auto-level-up check |
| `enrollProlanis(patient, type)` | Add patient to chronic disease roster |
| `completeProlanisVisit(data)` | Process monthly Prolanis checkup |
| `delegateToMaia(patientId)` | Let AI assistant handle patient |
| `completePRBControl(prbId)` | Process referral-back followup |
| `performWeekendActivity(activity)` | Execute weekend leisure |

### 7.3 Discharge Scoring System

`dischargePatient()` (lines 1479-1843) is the second most complex function. It validates:

1. **Diagnosis accuracy** — Is the player's ICD-10 code correct?
2. **Treatment validation** — Are the prescribed medications appropriate?
3. **Procedure completeness** — Were necessary procedures performed?
4. **Education coverage** — Were required patient education topics covered?
5. **FKTP-144 compliance** — If disease is on mandatory 144 list, was it handled at Puskesmas or properly referred?
6. **SKDI level enforcement** — Cases beyond SKDI 4A must be referred
7. **PRB (Program Rujuk Balik)** triggers — Chronic/complex cases flagged for hospital referral follow-up

Scoring awards XP, reputation, patient satisfaction, and updates KPI metrics.

---

## 8. AUDIO SYSTEM

`SoundManager.js` implements a **FF8 (Final Fantasy VIII) Junction-style** audio engine using **Web Audio API FM synthesis**:

- **No audio files** — all sounds are generated procedurally
- Carrier + Modulator oscillator architecture
- **UI sounds:** Cursor blip, Confirm chime, Cancel woosh, Notification scan, Success fanfare, Error buzzer, Emergency siren
- **BGM:** Procedurally generated ambient tracks with day-aware mood

---

## 9. VISUAL SYSTEM

### Procedural Texture Generation (`TextureGenerator.js` — 69KB)

Generates all terrain textures, building sprites, and decorations as **pixel art data URLs** at runtime. No external sprite sheets needed. Includes:
- Terrain: grass, water, sawah (rice paddy), mountain, forest, sand, roads
- Buildings: 30+ types with unique color palettes
- Decorations: trees, flowers, bushes, rocks

### Avatar System (`AvatarRenderer.jsx` + `AvatarUtils.js`)

Character avatars with:
- Age/gender-based appearance generation
- Style variations (hair, skin tone, clothing)
- Used for both player and patient avatars

---

## 10. REFERRAL SYSTEM

`ReferralSISRUTEModal.jsx` simulates Indonesia's **SISRUTE** (Sistem Rujukan Terpadu) referral workflow:

1. **Pre-referral checklist** — Verify case exceeds FKTP competency
2. **Hospital selection** — Choose from RSUD/RS Swasta based on specialty
3. **Ambulance** — Select transport type
4. **Documentation** — Referral letter auto-generated
5. **Outcome** — Hospital accepts/rejects, PRB scheduling

Integrates with `HospitalDB.js` (hospital specialties, distances) and `FKTP144Diseases.js` (mandatory disease list).

---

## 11. PROGRESSION SYSTEM

### Leveling (`LevelingSystem.js`)
- XP curve: `Level × 500` per level
- Rewards per level: +1 Skill Point, +5 Max Energy, full energy restore
- XP sources: patient treatment (10-50), correct diagnosis bonus (+20), quests (50-250), Posyandu/Prolanis (25-40), outbreak response (60-120)

### KPI Tracking
- Total patients treated
- Diagnosis accuracy (%)
- Treatment accuracy (%)
- Referral appropriateness (%)
- Average patient satisfaction
- Correct education coverage

### Facilities & Skills
- Building upgrades unlock new capabilities (Lab Level 2 → more tests available)
- Skill tree unlocks advanced procedures and diagnostic tools

---

## 12. FILE SIZE BREAKDOWN (Top 15)

| File | Size | Purpose |
|------|------|---------|
| `master_icd_10.json` | 1.8 MB | Full ICD-10 database |
| `master_icd_9.json` | 605 KB | Full ICD-9-CM database |
| `WikiData.js` | 249 KB | Medical encyclopedia |
| `PatientEMR.jsx` | 180 KB | Full EMR UI (Legacy unified) |
| `MedicationDatabase.js` | 158 KB | Drug database |
| `WilayahPage.jsx` | 153 KB | Village map |
| `AnamnesisVariations.js` | 127 KB | Persona responses |
| `GameContext.jsx` | 115 KB | Central state |
| `TextureGenerator.js` | 69 KB | Procedural art |
| `EmergencyCases.js` | 57 KB | Emergency cases |
| `VillageRegistry.js` | 55 KB | Village population |
| `AnamnesisEngine.js` | 46 KB | Interview logic |
| `MainLayout.jsx` | 45 KB | Layout shell |
| `EmergencyPanel.jsx` | 42 KB | IGD interface |
| `EducationOptions.js` | 36 KB | Education constants |

---

## 13. KEY DESIGN DECISIONS

1. **Offline-first** — Entire game runs client-side in the browser. Supabase is optional cloud mirror. Save/load via localStorage + Zustand persist.
2. **Vanilla CSS** — No Tailwind, no CSS-in-JS. All styles in `index.css` (~24KB).
3. **Zustand is truth** — All state in `useGameStore.js` (Zustand monolith). `GameContext.jsx` is a thin domain facade that selects and re-exports store slices.
4. **Procedural generation** — Map terrain, textures, audio, and avatars are all generated at runtime. Zero sprite sheets, zero audio files.
5. **Modular engines** — Each game system (28 engines in `src/game/`) is a standalone JS module with pure functions. Easy to reuse.
6. **Data-driven clinical content** — Adding new diseases requires only adding entries to `CaseLibrary.js` and `AnamnesisVariations.js`. No code changes needed.
7. **Dual language** — All UI text uses `react-i18next`. Content in Indonesian with medical terms in Latin/English.
8. **UKM↔UKP Karma Loop** — Failed preventive (UKM) activities spawn clinical (UKP) consequences. This is the core gameplay hook.
9. **No TypeScript** — All data contracts are implicit. This makes medication object vs. string ID mismatches the #1 bug source.

---

## 14. CURRENT STATE & KNOWN LIMITATIONS

### What Works Well
- Complete end-to-end clinical workflow (anamnesis → diagnosis → treatment → discharge → CPPT)
- 159+ clinical cases with persona-based dialogue variations
- Emergency system with real-time triage and deterioration
- Village map with procedural generation and interactive home visits
- Prolanis chronic disease management with parameter simulation
- Outbreak detection and response
- UKM behavior change cases with COM-B framework
- UKM→UKP karma bridge (failed prevention → clinical consequences)
- AI Director pacing system (Left 4 Dead inspired)
- Branching story quests (6 narrative arcs)
- Pharmacy dispensing with 5-rights verification and class-based allergy matching
- Comprehensive medical data layer (ICD-10, ICD-9-CM, medication database, wiki)
- Route-level code splitting: Heavy components lazy-loaded in `MainLayout.jsx`
- Zustand state management with auto-save persistence

### Known Limitations & Audit Patterns
- **Data contract drift**: medication objects vs. string IDs cause false negatives in treatment validation
- **Inventory model gap**: 122/123 procedures require consumables not in MEDICATION_DATABASE
- **Dead state**: `state.clinical.pharmacyQueue` has mutators but zero callers
- **Dead interaction rules**: Some drug interaction IDs reference medications not in formulary
- **No procurement audit trail**: supply orders/restocks not visible in daily archive
- **14 unit tests passing** but no full integration/E2E suite
- **SaranaPage dormant**: Missing `updateInventory` action, no procurement onClick

---

## 15. GLOSSARY OF INDONESIAN TERMS

| Term | Meaning |
|------|---------|
| Puskesmas | Primary healthcare center (Pusat Kesehatan Masyarakat) |
| FKTP | Primary care facility (Fasilitas Kesehatan Tingkat Pertama) |
| SKDI | Indonesian clinical competency standard |
| Posyandu | Community health post (Pos Pelayanan Terpadu) |
| Prolanis | Chronic disease management program (Program Pengelolaan Penyakit Kronis) |
| PIS-PK | Family health approach (Program Indonesia Sehat - Pendekatan Keluarga) |
| IKS | Healthy family index (Indeks Keluarga Sehat) |
| IGD | Emergency unit (Instalasi Gawat Darurat) |
| SISRUTE | Integrated referral system (Sistem Rujukan Terpadu) |
| PRB | Back-referral program (Program Rujuk Balik) |
| CPPT | Integrated patient progress record (Catatan Perkembangan Pasien Terintegrasi) |
| Kapitasi | Capitation payment from BPJS (national health insurance) |
| PSN | Mosquito breeding site elimination (Pemberantasan Sarang Nyamuk) |
| Dinas Rumah | Doctor's official residence |
| BPJS | National health insurance (Badan Penyelenggara Jaminan Sosial) |
| Kader | Community health volunteer |
| Balita | Under-five child (Bawah Lima Tahun) |
| KMS | Growth chart card (Kartu Menuju Sehat) |
| DBD | Dengue hemorrhagic fever (Demam Berdarah Dengue) |
| ISPA | Acute respiratory infection (Infeksi Saluran Pernapasan Akut) |
| Poli | Outpatient clinic (Poliklinik) |
| COM-B | Capability-Opportunity-Motivation behavioral model |
| UKP | Individual health services (curative, Upaya Kesehatan Perorangan) |
| UKM | Community health services (preventive, Upaya Kesehatan Masyarakat) |
| FORNAS | National essential medicines list (Formularium Nasional) |
| STBM | Community-based total sanitation (Sanitasi Total Berbasis Masyarakat) |
| IKM | Community health intervention (Intervensi Kesehatan Masyarakat) |
| PHBS | Clean and healthy lifestyle (Perilaku Hidup Bersih dan Sehat) |

---

*This document is intended as a comprehensive briefing for AI agents, engineers, or collaborators who need to understand and work with the PRIMER codebase. For specific implementation details, refer to the source files listed in Section 2.*
