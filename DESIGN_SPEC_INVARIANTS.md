# HIGH-PRECISION INVARIANT SPEC (PRIMERA)

Berdasarkan telaah kritis terhadap arsitektur `useGameStore`, berikut adalah spesifikasi invariant yang harus ditegakkan secara runtime oleh `engine-invariants-runtime.mjs`.

## 1. Clinical Slice (In-Patient Integrity)

| ID | Description | Logic (Zustand State) |
| :--- | :--- | :--- |
| CLIN_LIFECYCLE | Transisi status pasien valid | QUEUED → ACTIVE → (DISCHARGED/REFERRED). Pasien tidak boleh loncat status. |
| CLIN_ACTIVE_UNIQ | Integritas Pointer Aktif | Pasien aktif tidak boleh ada di `history` (sudah pulang). |
| CLIN_TRIAGE_GATING | Gating Red Flag | Pasien dengan Triage ESI 1 atau `redFlag: true` dilarang `discharge` (harus `refer` atau `stabilize`). |
| CLIN_COMPLETENESS | Kelengkapan Data Anamnesis | Diagnosis final membutuhkan minimal 3 evidence (Symptoms/PE). |
| CLIN_MED_SAFETY | Keamanan Obat | MedicationId wajib ada di registri + tidak melanggar `patient.allergies`. |
| CLIN_CPPT_MONO | CPPT Monotonik | Timestamp CPPT harus selalu naik; tidak boleh ada overwrite pada entri lama. |

## 2. Finance & Inventory Slice (Asset Integrity)

| ID | Description | Logic (Zustand State) |
| :--- | :--- | :--- |
| **FIN_MONEY_NONNEG** | Dana tidak boleh negatif | `finance.stats.kapitasi` ≥ 0 DAN `finance.stats.pendapatanUmum` ≥ 0. |
| **FIN_INV_PTR** | Referensi obat valid | Semua `medicationId` di `finance.pharmacyInventory` harus terdaftar di `MEDICATION_DATABASE`. |
| **FIN_INV_STOCK** | Stok tidak boleh negatif | `finance.pharmacyInventory.every(item => item.stock >= 0)`. |
| FIN_RECONCILE | Rekonsiliasi Billing | Total `billingLine` pada discharge harus klop dengan `inventory delta` + `service fee`. |

## 3. World Slice (Temporal Monotonicity)

| ID | Description | Logic (Zustand State) |
| :--- | :--- | :--- |
| **WORLD_TIME_RANGE** | Waktu dalam batas 24 jam | 0 ≤ `world.time` < 1440. |
| **WORLD_DAY_PROGRESS** | Hari monoton naik | `world.day` tidak boleh berkurang (kecuali load save lama). |

## 4. Public Health Slice (Village Integrity)

| ID | Description | Logic (Zustand State) |
| :--- | :--- | :--- |
| **PH_VILL_PTR** | Relasi Keluarga Valid | Jika `villageData` aktif, semua `patient.familyId` harus ditemukan di `villageData.families`. |
| **PH_OUTBREAK_LIFETIME** | Outbreak terikat waktu | `activeOutbreaks.every(o => o.expiryDay > world.day || !o.resolved)`. |

## Enforcement Strategy (Freeze Protocol)

Jika salah satu Invariant di atas **FAIL**:
1.  **Immediate Freeze**: Hentikan interval game loop.
2.  **Diagnostic Snapshot**: Simpan `state` lengkap ke `megalog/outputs/snapshots/CRASH_[TIMESTAMP].json`.
3.  **Visual Alert**: Tampilkan overlay "System Integrity Compromised" dengan daftar eror spesifik.
