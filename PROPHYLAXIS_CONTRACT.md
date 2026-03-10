# PROPHYLAXIS CONTRACT v1.0 (PRIMERA)

Kontrak ini mendefinisikan "Choke Points" dan "Invariants" yang wajib dilindungi untuk menjamin PRIMER anti-crash dan anti-regresi.

## 1. Core Choke Points (Enforcement Points)

| Choke Point | Mechanism | Target Engine |
| :--- | :--- | :--- |
| **Tick Engine** | `useGameLoop` | `engine-oscillation` + `invariant-runtime` |
| **Navigation** | `navigate` wrapper | `engine-oscillation` (Callsite fingerprint) |
| **Store Actions** | `dispatchGuard` | `engine-transaction-guard` |
| **Persistence** | `saveGame` / `loadGame` | `engine-save-roundtrip` |
| **Init/Loading** | `App.onload` / `registry` | `engine-registry-linker` |

## 2. Mandatory Invariants (Runtime Schema)

Kegagalan pada salah satu poin di bawah harus memicu **Freeze + Snapshot**.

### A. Clinical Integrity
- `activePatientId` MUST exist in `clinical.queue` or `clinical.history`.
- `patient.anthropometrics` MUST satisfy Bayesian ranges (e.g. height > 0).
- `referral` MUST have a final destination or status before tick completion.

### B. Economical Balance
- `stats.pendapatan` MUST NOT be negative.
- `inventory.stock` MUST NOT be negative.
- `transaction` MUST be atomic (Start -> Apply -> Commit/Rollback).

### C. Temporal Monotonicity
- `time` MUST be monotonic (newTime >= prevTime) unless day shifts.
- `day` transition MUST trigger clinical purge and KPI snapshot.

## 3. Prophylaxis Tiers

1.  **Tier 1: Atomic (Immediate)**
    - Re-entrancy locks on `tick`.
    - Loop detection on `useEffect`.
2.  **Tier 2: Transactional (Commit-phase)**
    - Cross-slice commit validation.
    - Rollback logic for half-commits.
3.  **Tier 3: Structural (Consistency)**
    - Registry pointer validation (anti-broken link).
    - Save-roundtrip verification.

## 4. Enforcement Strategy
- **Trigger**: Deteksi kegagalan Invariant atau Oscillation.
- **Action**: 
    1. Hentikan `setInterval` (Freeze).
    2. Capture current `zustand` state to `snapshot.json`.
    ## 5. Clinical Guard Matrix (High-Fidelity)

| Action (Store) | Target Invariants | Prophylaxis Engine |
| :--- | :--- | :--- |
| `setActivePatientId` | `CLIN_LIFECYCLE`, `CLIN_ACTIVE_UNIQ` | `ClinicalLifecycleEngine` |
| `orderLab` / `orderProc` | `RESOURCE_PRECONDITION`, `ORDER_STATUS_FLOW` | `OrderLifecycleEngine` |
| `dischargePatient` | `CLIN_COMPLETENESS`, `TRIAGE_GATING`, `MED_SAFETY` | `SynthesisEngine` + `MedSafety` |
| `makeReferral` | `PAPERWORK_INTEGRITY`, `REFERRAL_SAFETY` | `ReferralSafetyEngine` |
| `saveGame` / `loadGame` | `SAVE_ROUNDTRIP`, `VERSION_MIGRATION` | `PersistenceSentry` |

Setiap aksi dalam matriks ini wajib melewati `dispatchGuard` yang menjalankan pengecekan sebelum *commit* ke state.
