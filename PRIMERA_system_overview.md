# PRIMERA System Overview v4.5

PRIMERA (Primary Care Emergency & Reliability Architecture) adalah meta-kerangka kerja yang membungkus aplikasi PRIMER untuk menjamin tingkat reliabilitas medis dan teknis yang tinggi.

## 1. Pillars of Reliability
PRIMERA dibangun di atas tiga pilar utama:

### A. Prophylaxis & Circuit Breakers
Sistem pencegahan dini terhadap kerusakan runtime dan regresi.
- **Loop/Oscillation**: Monitoring frekuensi eksekusi berbasis kunci.
- **Event Bus Prophylaxis**: Penanganan event sekuensial untuk mencegah race conditions.
- **Atomic Transactions**: Wrapper untuk menjamin *cross-slice commit* (Clinical ↔ Finance).
- **Registry Linker**: Validasi integritas referensi data (Medication, Cases, ICD-10).

### B. Invariant Guard
Penjaga integritas state saat simulasi berjalan.
- **Runtime Check**: Validasi skema state setiap tick.
- **Freeze & Snapshot**: Menghentikan simulasi jika terdeteksi inkonsistensi data untuk mencegah korupsi save-game.

### C. Clinical Guardian (Integrity Guard)
Penjamin kepatuhan skema klinis dan logika medis.
- **Validation**: Schema schema, ICD-10 mapping, IKS (Indikator Keluarga Sehat) alignment, dan Bayesian reasoning readiness.

## 2. Integrated Documentation Loop
Aplikasi melakukan *Self-Reflection* menggunakan standar kontemporer:
- **@reflection**: Header metadata pada setiap modul.
- **Bible Sync**: Sinkronisasi otomatis dari kode ke `PRIMER_BIBLE.md`.
- **Sync Bot**: `reflect_and_sync.mjs` untuk menjamin dokumentasi tidak pernah basi (*truth-is-the-code*).

## 3. Technology Stack
- **Frontend**: React 19 + Vite (Vanilla JS).
- **State**: Zustand (Atomic State Slices).
- **Audit**: ESLint 9 + Vitest + Playwright.
- **Infrastructure**: Custom MJS Engines (Megalog Suite).
