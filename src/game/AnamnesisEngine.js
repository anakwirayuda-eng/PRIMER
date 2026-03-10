/**
 * @reflection
 * [IDENTITY]: AnamnesisEngine
 * [PURPOSE]: ANAMNESIS ENGINE — Central Facade (Aggregator for modular sub-modules)
 * [STATE]: Production (Refactored v4.0)
 * [ANCHOR]: QUESTION_CATEGORIES
 * [DEPENDS_ON]: Constants, InformantSystem, TextAdapter, EmotionEngine, DialogueEngine, SynthesisEngine
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-13
 */

// Anchor for Megalog: const QUESTION_CATEGORIES

/**
 * ANAMNESIS ENGINE (Facade)
 *
 * Single entry point untuk seluruh sistem anamnesis.
 * Semua komponen (AnamnesisTab, DialogueLog, ClinicalSidebar, dll)
 * tetap import dari sini — tidak perlu ubah import di mana-mana.
 */

export * from './anamnesis/Constants.js';
export * from './anamnesis/InformantSystem.js';
export * from './anamnesis/TextAdapter.js';
export * from './anamnesis/EmotionEngine.js';
export * from './anamnesis/DialogueEngine.js';
export * from './anamnesis/SynthesisEngine.js';

// =============================================================================
// EXPLICIT RE-EXPORTS (supaya tidak ada broken anchor lagi)
// =============================================================================

// Constants & Multi-module hooks
export { pickPersona, deriveCategory } from './anamnesis/Constants.js';

// Informant & Identity logic
export { getInformantMode } from './anamnesis/InformantSystem.js';

// Text & NLP Adaptation
export {
    getPrefix,
    adaptTextForGender,
    getDoctorAcknowledgment,
    getInitialComplaintResponse,
    getSpeakerLabel
} from './anamnesis/TextAdapter.js';

// Dialogue & Persona orchestration
export {
    generateGreeting,
    getAsyncVariation,
    getChildDirectQuestions
} from './anamnesis/DialogueEngine.js';

// Synthesis & Clinical Reasoning
export { synthesizeAnamnesis } from './anamnesis/SynthesisEngine.js';

