/**
 * @reflection
 * [IDENTITY]: scenario_runner.test
 * [PURPOSE]: Deterministic scenario replay harness for PRIMERA using the real Zustand store under Vitest/jsdom.
 * [STATE]: Active
 * [ANCHOR]: executeScenario
 * [DEPENDS_ON]: useGameStore, seedrandom
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import seedrandom from 'seedrandom';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { stampArtifact } from '../../scripts/primera/artifact_manifest.mjs';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '../..');
const SCENARIO_DIR = path.join(ROOT, 'tests/scenarios');
const OUTPUT_DIR = path.join(ROOT, 'megalog/outputs/scenarios');

let useGameStore = null;
let exportedSave = null;

function ensureAudioMocks() {
  globalThis.Audio = class {
    constructor() {
      this.paused = true;
      this.loop = false;
      this.volume = 0;
      this.currentTime = 0;
    }
    play() {
      this.paused = false;
      return Promise.resolve();
    }
    pause() {
      this.paused = true;
    }
    addEventListener() {}
    removeEventListener() {}
  };

  class MockAudioContext {
    constructor() {
      this.destination = {};
      this.state = 'running';
      this.currentTime = 0;
    }
    createGain() {
      return {
        gain: {
          value: 0,
          setValueAtTime() {},
          linearRampToValueAtTime() {},
          exponentialRampToValueAtTime() {}
        },
        connect() {}
      };
    }
    createOscillator() {
      return {
        type: 'sine',
        frequency: {
          setValueAtTime() {},
          linearRampToValueAtTime() {},
          exponentialRampToValueAtTime() {}
        },
        connect() {},
        start() {},
        stop() {}
      };
    }
    resume() {
      return Promise.resolve();
    }
  }

  window.AudioContext = MockAudioContext;
  window.webkitAudioContext = MockAudioContext;
}

async function getStore() {
  if (!useGameStore) {
    ({ useGameStore } = await import('../../src/store/useGameStore.js'));
  }
  return useGameStore;
}

function writeResult(name, result) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.writeFileSync(
    path.join(OUTPUT_DIR, `${name}_result.json`),
    JSON.stringify(
      stampArtifact(result, 'scenario_runner.test', [`tests/scenarios/${name}.json`]),
      null,
      2
    )
  );
}

async function executeAction(store, step) {
  const { action, payload = {} } = step;
  const state = store.getState();

  switch (action) {
    case 'startNewGame':
      localStorage.clear();
      exportedSave = null;
      state.actions.resetGame();
      state.actions.startNewGame(payload.profile || { name: 'Scenario' }, payload.slotId ?? 0);
      break;
    case 'nextDay':
      state.actions.nextDay();
      vi.runAllTimers();
      break;
    case 'setActivePatient': {
      const patientId = payload === 'first_in_queue'
        ? store.getState().clinical.queue[0]?.id
        : payload;
      store.getState().clinicalActions.setActivePatientId(patientId);
      break;
    }
    case 'discharge': {
      const currentState = store.getState();
      const activeId = currentState.clinical.activePatientId;
      const patient = currentState.clinical.queue.find((item) => item.id === activeId) || currentState.clinical.queue[0];
      currentState.clinicalActions.dischargePatient(patient, {
        action: payload.action || 'treat',
        diagnoses: payload.diagnoses || [],
        medications: payload.medications || [],
        procedures: payload.procedures || [],
        examsPerformed: payload.examsPerformed || [],
        education: payload.education || []
      });
      break;
    }
    case 'saveGame':
      store.getState().actions.saveGame(payload.slotId ?? 0);
      break;
    case 'loadGame': {
      const slotId = payload.slotId ?? 0;
      const parsed = JSON.parse(localStorage.getItem(`primer_save_${slotId}`));
      store.getState().actions.loadGame(parsed, slotId);
      break;
    }
    case 'exportSave':
      exportedSave = localStorage.getItem(`primer_save_${payload.slotId ?? 0}`);
      break;
    case 'deleteSlot':
      localStorage.removeItem(`primer_save_${payload.slotId ?? 0}`);
      break;
    case 'importSave':
      localStorage.setItem(`primer_save_${payload.slotId ?? 0}`, exportedSave);
      break;
    default:
      throw new Error(`Unsupported scenario action: ${action}`);
  }
}

function evaluateAssertion(store, expression) {
  const state = store.getState();
  return Boolean(new Function('state', `return (${expression});`)(state));
}

async function executeScenario(scenario) {
  const store = await getStore();
  const originalRandom = Math.random;
  Math.random = seedrandom(String(scenario.seed || 1));
  localStorage.clear();
  exportedSave = null;
  store.getState().actions.resetGame();

  const assertions = [];
  try {
    for (const step of scenario.steps) {
      if (step.action) {
        await executeAction(store, step);
        continue;
      }

      if (step.assert) {
        const pass = evaluateAssertion(store, step.assert);
        assertions.push({ expression: step.assert, pass });
        expect(pass).toBe(true);
      }
    }

    const result = {
      name: scenario.name,
      pass: assertions.every((entry) => entry.pass),
      assertions
    };
    writeResult(scenario.name, result);
    return result;
  } finally {
    Math.random = originalRandom;
  }
}

beforeAll(async () => {
  ensureAudioMocks();
  await getStore();
});

describe('PRIMERA scenario replay', () => {
  const scenarios = fs.readdirSync(SCENARIO_DIR)
    .filter((file) => file.endsWith('.json'))
    .map((file) => JSON.parse(fs.readFileSync(path.join(SCENARIO_DIR, file), 'utf8')));

  for (const scenario of scenarios) {
    it(`replays ${scenario.name}`, async () => {
      vi.useFakeTimers();
      const result = await executeScenario(scenario);
      vi.runOnlyPendingTimers();
      vi.useRealTimers();
      expect(result.pass).toBe(true);
    });
  }
});
