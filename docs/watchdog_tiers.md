# PRIMERA Watchdog Tiers

This document defines the CI gate tiers that map to the scripts already present in the repository.

## quick

Command:

```bash
npm run watchdog:quick
```

Steps:

1. `npm run watchdog:lint`
2. `npm run test -- --run`
3. `npm run build`

Purpose:

- Fast merge gate for lint-budget regression, unit/integration regression, and production build validity.

## deep

Command:

```bash
npm run watchdog:deep
```

Includes everything in `quick`, then runs:

1. `npm run assets:check`
2. `npm run clinical:check`
3. `node scripts/primera/engine-content-audit.mjs`
4. `node scripts/primera/engine-scenario-replay.mjs`
5. `npm run diag:export`
6. `node scripts/primera/pldb_analyzer.mjs`
7. `node scripts/primera/watchdog-pathfinder.mjs`
8. `node scripts/primera/engine-topology.mjs`
9. `node scripts/primera/engine-wiring.mjs`
10. `node scripts/primera/engine-store-audit.mjs`
11. `node scripts/primera/engine-save-audit.mjs`
12. `node scripts/primera/engine-collision.mjs`
13. `node scripts/primera/engine-oscillation.mjs`
14. `node scripts/primera/engine-invariants-runtime.mjs`
15. `node scripts/primera/engine-clinical-lifecycle.mjs`
16. `node scripts/primera/engine-triage-gate.mjs`
17. `node scripts/primera/engine-clinical-guardian.mjs`
18. `node scripts/primera/engine-igd-sisrute-gate.mjs`

Purpose:

- Structural and runtime-forensic gate for save/load, clinical flow, scenario replay, topology, and store integrity.

## full

Command:

```bash
npm run watchdog:full
```

Includes everything in `deep`, then runs:

1. `npm run test:e2e`
2. `node scripts/primera/gameplay_test.mjs`
3. `node scripts/primera/ukm_test.mjs`
4. `node scripts/primera/simulation_runner.mjs`
5. `node scripts/primera/test_invariants.mjs`

Purpose:

- Nightly/manual confidence sweep for browser smoke, gameplay simulation, UKM systems, headless simulation, and soak-style invariant checking.

## Reporting

`megalog_v5` and `sentinel` stay separate from the gate tiers.

- `npm run megalog -- --force`
- `node scripts/primera/sentinel.mjs`

Reason:

- gate mode should fail on real regressions
- report mode may keep scanning to produce artifacts even after some checks fail

## Recommended Branch Protection Checks

Mark these job-level checks as required after the first successful GitHub Actions run publishes them in the branch protection UI.

### `main`

- `PRIMERA quick gate`

### `release/*`

- `PRIMERA quick gate`
- `PRIMERA deep gate`

### `hotfix/*`

- `PRIMERA quick gate`

### Not required

- `PRIMERA full sweep`

Reason:

- `quick` is the merge-speed gate
- `deep` is the release hardening gate
- `full` is a nightly/manual sweep and should not block normal PR flow
