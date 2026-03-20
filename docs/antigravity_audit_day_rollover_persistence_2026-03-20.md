# Antigravity Audit: Day-Rollover & Persistence

Date: 2026-03-20  
Project: PRIMER  
Scope: day transition orchestration, local save/load, persisted state merge, cloud sync/load contracts, daily/monthly archive data used by UI

## Remediation Update

The first implementation pass after this audit has already addressed the top cloud-contract issues:

- `useCloudSync` now listens to store updates with a supported subscription pattern, so day changes trigger cloud sync again.
- Cloud snapshots now reuse the canonical save serializer used by local saves.
- Canonical save parsing now unwraps Supabase-style `game_state` rows, including `saved_at` and `version` metadata.
- Cloud save metadata now reads accreditation from `clinical.accreditation` and stores `saveVersion` consistently.

The still-open items after this remediation pass are:

- `dailyArchive` / `monthlyArchive` have UI consumers but still need producer logic.
- `loadGame()` still bypasses the store's persisted-merge safety rules for volatile clinical state.

## Executive Summary

This audit found two P1 issues and four P2/P3 contract risks in the persistence stack.

The most urgent problem is that cloud autosave is currently subscribed with a selector signature that the active Zustand store does not support, so the day-change sync path does not fire. The second P1 issue is that the cloud load payload shape is incompatible with the canonical save parser, which would silently drop most of the saved game state if cloud restore were activated.

Separately, the UI already exposes daily and monthly archive views, but the store does not append any records into `clinical.dailyArchive` or `clinical.monthlyArchive`. That makes the feature look present while remaining functionally unwired.

No failing automated tests surfaced these issues. Current tests mostly validate local save hardening and runtime traps, but they do not cover cloud contracts or archive production.

## Audit Method

1. Reviewed the day rollover flow in `src/store/useGameStore.js`, especially `nextDay()`, post-rollover autosave, and monthly processing.
2. Compared local save/load code paths against cloud save/load code paths.
3. Traced the UI consumers of `dailyArchive` and `monthlyArchive`.
4. Verified runtime assumptions with small local probes:
   - Zustand subscribe arity/behavior
   - `parseSavePayload()` behavior against a representative Supabase row
5. Re-ran the relevant persistence/runtime/store tests to confirm whether existing coverage catches these issues.

## Findings

### P1. Cloud autosave day-change subscription is silently broken

**Status:** active today when online auth is enabled  
**Impact:** cloud sync likely never runs on day transitions, despite `useCloudSync()` being mounted from `GameContext`

**Evidence**

- `src/context/GameContext.jsx:76-77` mounts the hook unconditionally for the active game session.
- `src/hooks/useCloudSync.js:108-117` uses:

```js
const unsub = useGameStore.subscribe(
    (state) => state.world.day,
    (day, prevDay) => {
        if (day !== prevDay && day > 1) {
            if (timeoutId) clearTimeout(timeoutId);
            timeoutId = setTimeout(syncToCloud, 2000);
        }
    }
);
```

- The active store is created with `create(devtools(persist(...)))` and does not use `subscribeWithSelector`.
- Runtime probe against the installed Zustand package:

```text
arity 1
events []
```

That means the selector-style two-argument subscription used by `useCloudSync` is not firing.

**Why this matters**

The code comments explicitly describe cloud sync as running "on day transitions", but the subscription contract does not match the store implementation. This is a silent failure: no crash, no warning, no sync.

**Recommended fix**

- Either wrap the store with `subscribeWithSelector`, or
- Change `useCloudSync` to a supported subscription pattern and perform manual comparison inside the listener.

Add a regression test that asserts `syncToCloud` is invoked after `world.day` changes.

### P1. Cloud load payload shape is incompatible with the canonical save parser

**Status:** latent until cloud restore/list-based resume is wired into UI  
**Impact:** a Supabase row can be accepted but most gameplay state is silently discarded

**Evidence**

- `src/services/CloudSaveService.js:105-121` returns the database row shape:

```js
select('game_state, day, score, saved_at, version')
...
return { data, error: null };
```

- `src/utils/savePayload.js:114-118` only unwraps `saveData` or `_raw`, otherwise it parses the object as-is:

```js
const payload = isPlainObject(rawSave.saveData)
    ? rawSave.saveData
    : isPlainObject(rawSave._raw)
        ? rawSave._raw
        : rawSave;
```

- Local probe using a representative cloud row produced:

```json
{
  "world": { "day": 9, "time": 420, "speed": 1, "isPaused": false },
  "game_state": {
    "world": { "day": 9, "time": 720 },
    "player": { "profile": { "name": "Cloud Doc", "reputation": 88 } }
  },
  "player": null
}
```

`world.day` survives only because the parser falls back to the row's top-level `day`, but nested state inside `game_state` is not unwrapped. `world.time` falls back to default, and `player` becomes `null`.

**Why this matters**

This is a dangerous "partial success" failure mode: a cloud save may appear loadable while actually stripping player progression and nontrivial world state.

**Recommended fix**

- Normalize cloud rows before parsing by unwrapping `data.game_state`, or
- Extend `buildCanonicalSavePayload()` to recognize and unwrap the `game_state` contract.

Add a regression test that passes a Supabase-style row into the cloud restore path and asserts the player/world slices survive intact.

### P2. Daily archive and monthly archive UI are present, but the store never writes archive entries

**Status:** active today  
**Impact:** calendar report history and monthly KPI history are effectively nonfunctional

**Evidence**

- State defines the archive arrays in `src/store/useGameStore.js:165-166` and `src/store/useGameStore.js:198-199`.
- Persistence merge preserves them in `src/store/useGameStore.js:549-550`.
- UI reads them in:
  - `src/components/CalendarModal.jsx:67`
  - `src/components/DailyReportModal.jsx:19-44`
  - `src/components/KPIDashboard.jsx:480-486`
  - `src/components/MainLayout.jsx:879-905`
- `git grep` over `src/` shows reads and definitions, but no append/write path for `dailyArchive` or `monthlyArchive`.
- `src/store/useGameStore.js:992-1012` resets monthly finance counters and KPI state, but does not append a monthly report object.

**Why this matters**

The feature already exists in navigation and presentation, so players can reasonably expect it to work. Right now the archive arrays persist correctly if they exist, but gameplay never populates them.

**Recommended fix**

- At end-of-day, append a canonical daily report entry into `clinical.dailyArchive`.
- On monthly turnover, aggregate the prior 30 days into `clinical.monthlyArchive` before resetting KPI counters.
- Add one store test for daily archive append and one for monthly archive append.

### P2. Cloud leaderboard accreditation is read from the wrong slice

**Status:** active if leaderboard sync succeeds  
**Impact:** leaderboard metadata can report default accreditation even when the clinic progressed

**Evidence**

- `src/services/CloudSaveService.js:31` reads:

```js
accreditation: gameState?.publicHealth?.accreditation || 'Dasar'
```

- The actual source of truth is `clinical.accreditation`:
  - `src/store/useGameStore.js:167`
  - `src/store/useGameStore.js:1519`
  - monthly processing also reads `get().clinical.accreditation` at `src/store/useGameStore.js:2357`

**Why this matters**

Even after cloud sync is repaired, leaderboard data will under-report progression quality.

**Recommended fix**

- Read accreditation from `gameState?.clinical?.accreditation`.
- Add a service test that saves a non-default accreditation snapshot and asserts the leaderboard payload carries it through.

### P2. Cloud save versioning uses `_saveVersion`, but canonical saves use `saveVersion`

**Status:** active if cloud save succeeds  
**Impact:** cloud rows likely keep writing version `1` instead of meaningful revisions

**Evidence**

- `src/services/CloudSaveService.js:63` writes:

```js
version: (gameState._saveVersion || 0) + 1
```

- Canonical local saves use `saveVersion`:
  - `src/utils/savePayload.js:56`
  - `src/utils/savePayload.js:124`
  - `src/utils/savePayload.js:161`
  - `src/utils/savePayload.js:186`
- The cloud sync snapshot built in `src/hooks/useCloudSync.js:53-60` does not include `_saveVersion`.

**Why this matters**

Version metadata becomes low-signal and cannot reliably help with conflict resolution, debugging, or future migrations.

**Recommended fix**

- Standardize on one field name, ideally `saveVersion`.
- If cloud version is intended as a row revision counter rather than payload schema version, store it separately and increment from the previous row value instead of the client payload.

### P2. `loadGame()` bypasses the store's persisted-merge safety rules for volatile clinical state

**Status:** active today for local slot loads  
**Impact:** local loads can restore transient queue/modal state that the store's own persistence layer explicitly strips

**Evidence**

- The canonical schema allows volatile clinical fields:
  - `src/utils/savePayload.js:29-36`
- `createSaveSnapshot()` serializes the raw `clinical` slice:
  - `src/utils/savePayload.js:184-194`
- `loadGame()` directly spreads `normalizedSave.clinical` into store state:

```js
if (normalizedSave.clinical) {
    s.clinical = { ...s.clinical, ...normalizedSave.clinical };
}
```

at `src/store/useGameStore.js:2160-2162`.

- By contrast, the store's persist merge path intentionally neutralizes volatile fields:
  - `src/store/useGameStore.js:544-547` force `queue`, `emergencyQueue`, `activePatientId`, `activeEmergencyId` back to safe defaults.
  - The persist layer uses `mergePersistedClinical()` in both `merge` and `partialize` at `src/store/useGameStore.js:2421-2435`.

**Why this matters**

There is a contract mismatch between "persisted state" and "manual save slot restore". If mid-day saves are intended, this may be acceptable, but then the persist merge rules should be revisited. If not intended, local loads can revive stale in-treatment state, open modals, or queue snapshots that were considered unsafe everywhere else.

**Recommended fix**

- Decide explicitly whether slot saves are allowed to restore in-flight clinical sessions.
- If no, route `loadGame()` through the same merge helpers used by persisted rehydration.
- If yes, document that contract and add tests around queue, active patient, emergency queue, and paused/modal state restore behavior.

### P3. Local save/load and cloud save/load use different serialization contracts

**Status:** architectural risk  
**Impact:** future fixes in one persistence path can drift from the other without immediate failures

**Evidence**

- Local save path:
  - `actions.saveGame()` in `src/store/useGameStore.js:2116-2123`
  - `createSaveSnapshot()` in `src/utils/savePayload.js:184-194`
  - canonicalized with `parseSavePayload()`
- Cloud save path:
  - `useCloudSync()` sends a raw slice bundle in `src/hooks/useCloudSync.js:53-60`
  - `CloudSaveService.saveToCloud()` writes it directly as `game_state` in `src/services/CloudSaveService.js:54-65`

These two paths do not share one serializer/deserializer contract.

**Why this matters**

This is the root reason the cloud load mismatch and version mismatch were able to appear. The codebase currently has two save formats for what is conceptually the same game snapshot.

**Recommended fix**

- Introduce a single canonical serializer for both local and cloud saves.
- Keep transport metadata outside the save payload, not mixed into the gameplay snapshot.

## Active vs Latent Risk Map

- Active now:
  - broken cloud autosave day subscription
  - archive arrays never populated
  - wrong leaderboard accreditation
  - cloud version field mismatch
  - local load bypassing persisted-merge safety rules
- Latent but high-risk:
  - cloud row shape incompatible with canonical parser
  - serializer drift between local and cloud paths

## Test Coverage Notes

The following regression run passed:

```bash
cmd /c node_modules\.bin\vitest.cmd run src\tests\runtimeHardening.test.js src\tests\persistenceService.test.js src\tests\saveSlotSelector.test.js src\tests\storeProphylaxis.test.js tests\scenarios\scenario_runner.test.js
```

Result: `36 passed`

This is important because it shows the current suite does not cover:

- `useCloudSync` subscription semantics
- `CloudSaveService.loadFromCloud()` to `parseSavePayload()` compatibility
- `dailyArchive` production
- `monthlyArchive` production
- explicit cloud leaderboard payload correctness

## Recommended Fix Order

1. Repair `useCloudSync` subscription semantics and add a test.
2. Unify cloud payload normalization with the canonical save parser.
3. Decide the intended contract for `loadGame()` restoring volatile clinical state.
4. Implement daily/monthly archive writers before touching archive UI.
5. Standardize leaderboard and version metadata fields.
6. Collapse local/cloud save serialization into one shared format.

## Bottom Line

The day-rollover autosave hardening added earlier is doing useful work for local saves, but persistence is currently split across two incompatible contracts. The biggest immediate reliability problem is silent cloud sync failure. The biggest product-facing gap is that report history UI exists without any producer pipeline behind it.
