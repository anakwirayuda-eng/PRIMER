/**
 * @reflection
 * [IDENTITY]: LLMService
 * [PURPOSE]: LLM SERVICE — Proxies AI requests through Supabase Edge Function.
 *            Falls back to local mock when offline.
 * [STATE]: Production
 * [ANCHOR]: LLM_SERVICE
 * [DEPENDS_ON]: supabaseClient
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-03-20
 */

import { supabase, isSupabaseConfigured } from './supabaseClient';

export const LLM_STRIKTHROUGH = false; // Toggle for testing/mock mode

/**
 * Get an LLM-enhanced patient response.
 * Routes through Supabase Edge Function when online, falls back to local mock.
 */
export async function getLLMPatientResponse(question, baseResponse, patientData) {
    if (LLM_STRIKTHROUGH) return baseResponse;

    // Try cloud LLM first
    if (isSupabaseConfigured) {
        try {
            const { data, error } = await supabase.functions.invoke('llm-proxy', {
                body: {
                    question,
                    baseResponse,
                    patientData: {
                        firstName: patientData.firstName || 'Anonymous',
                        age: patientData.age,
                        gender: patientData.gender,
                        complaint: patientData.complaint,
                        mood: patientData.mood || 'Neutral',
                        education: patientData.social?.education,
                    },
                },
            });

            if (!error && data?.response) {
                return data.response;
            }

            console.warn('[LLM] Edge Function error, falling back to local:', error?.message);
        } catch (err) {
            console.warn('[LLM] Edge Function unreachable, falling back to local:', err.message);
        }
    }

    // Fallback: local mock enhancement
    return localMockEnhance(baseResponse, patientData);
}

/**
 * Local mock: adds conversational flavor based on patient demographics.
 * Used when Supabase is offline or Edge Function fails.
 */
function localMockEnhance(baseResponse, patientData) {
    if (patientData.age < 15) {
        return `(Tampak malu) ${baseResponse}, Dok...`;
    }
    if (patientData.mood === 'anxious') {
        return `Duh saya takut banget Dok, ${baseResponse.toLowerCase()}. Gimana ya?`;
    }
    if (patientData.social?.education === 'SD') {
        return `${baseResponse} gitu Dok, saya kurang paham kenapa bisa begini.`;
    }
    return baseResponse;
}

/**
 * Build a patient prompt for the LLM (used by Edge Function).
 * Exported for testing.
 */
export function buildPatientPrompt(question, baseResponse, patient) {
    return `
      ACT AS A PATIENT:
      Name: ${patient.firstName || 'Anonymous'}
      Age: ${patient.age}
      Gender: ${patient.gender}
      Main Complaint: ${patient.complaint}
      Mood: ${patient.mood || 'Neutral'}

      DOCTOR ASKED: "${question}"
      FACT TO CONVEY: "${baseResponse}"

      TASK: Rewrite the FACT as a natural spoken dialogue. 
      Stay consistent with the age and mood.
      Do not add new medical facts. Keep it concise.
    `;
}
