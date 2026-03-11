/**
 * @reflection
 * [IDENTITY]: engine-save-audit
 * [PURPOSE]: Run a real save/load round-trip against useGameStore and report save integrity with runtime evidence.
 * [STATE]: Active
 * [ANCHOR]: run
 * [DEPENDS_ON]: jsdom, useGameStore, artifact_manifest
 */

import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { JSDOM } from 'jsdom';
import { writeStampedJson } from './artifact_manifest.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '../../');
const OUTDIR = path.join(ROOT, 'megalog/outputs');
const STORE_PATH = path.join(ROOT, 'src/store/useGameStore.js');
const REQUIRED_FIELDS = ['saveVersion', 'player', 'world', 'finance', 'clinical', 'publicHealth', 'staff'];

function bootstrapDom() {
    const dom = new JSDOM('<!doctype html><html><body></body></html>', { url: 'http://localhost' });
    globalThis.window = dom.window;
    globalThis.document = dom.window.document;
    globalThis.localStorage = dom.window.localStorage;
    globalThis.DOMException = dom.window.DOMException;
    Object.defineProperty(globalThis, 'navigator', {
        value: dom.window.navigator,
        configurable: true
    });

    globalThis.requestAnimationFrame = (cb) => setTimeout(cb, 16);
    globalThis.cancelAnimationFrame = (id) => clearTimeout(id);
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

async function importFreshStore() {
    const storeUrl = `${pathToFileURL(STORE_PATH).href}?audit=${Date.now()}`;
    return import(storeUrl);
}

async function run() {
    console.log('PRIMERA Save Audit Engine starting...');
    bootstrapDom();
    localStorage.clear();

    const { useGameStore } = await importFreshStore();
    const store = useGameStore;
    const runtimeChecks = [];

    store.getState().actions.resetGame();
    store.getState().actions.startNewGame({ name: 'Audit Bot', avatar: 'doctor_default' }, 0);
    runtimeChecks.push({
        name: 'startNewGame',
        pass: store.getState().nav.currentSlotId === 0 && store.getState().player.profile.name === 'Audit Bot'
    });

    const saveOk = store.getState().actions.saveGame(0);
    const saveRaw = localStorage.getItem('primer_save_0');
    runtimeChecks.push({
        name: 'saveGame',
        pass: Boolean(saveOk && saveRaw)
    });

    let parsedSave = null;
    try {
        parsedSave = JSON.parse(saveRaw);
    } catch {
        parsedSave = null;
    }

    const missingFields = REQUIRED_FIELDS.filter((field) => !parsedSave || !(field in parsedSave));
    runtimeChecks.push({
        name: 'saveSchema',
        pass: missingFields.length === 0,
        missingFields
    });

    store.setState((state) => ({
        player: { ...state.player, profile: { ...state.player.profile, name: 'Mutated Name', reputation: 1 } },
        world: { ...state.world, day: 99 }
    }));
    const loadOk = store.getState().actions.loadGame(parsedSave, 0);

    const restoredState = store.getState();
    runtimeChecks.push({
        name: 'loadGame',
        pass: Boolean(loadOk)
    });
    runtimeChecks.push({
        name: 'playerRestored',
        pass: restoredState.player.profile.name === parsedSave?.player?.profile?.name
    });
    runtimeChecks.push({
        name: 'dayRestored',
        pass: restoredState.world.day === parsedSave?.world?.day
    });

    const results = {
        pass: runtimeChecks.every((check) => check.pass),
        impact: runtimeChecks.every((check) => check.pass) ? 'cosmetic' : 'save_corruption',
        version: parsedSave?.saveVersion ?? 'unknown',
        checks: runtimeChecks,
        savedKey: 'primer_save_0'
    };

    writeStampedJson(
        path.join(OUTDIR, 'save_audit.json'),
        results,
        'engine-save-audit',
        ['useGameStore.js']
    );

    console.log(`Save Audit report generated. pass=${results.pass}`);
}

run().catch((error) => {
    console.error('Save Audit Engine failed:', error);
    process.exit(1);
});
