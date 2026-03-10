/**
 * @reflection
 * [IDENTITY]: LLMService
 * [PURPOSE]: LLM SERVICE Handles interaction with AI Models for dynamic dialogue. In production, this would use a real API key.
 * [STATE]: Experimental
 * [ANCHOR]: LLM_STRIKTHROUGH
 * [DEPENDS_ON]: None
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-12
 */

/**
 * LLM SERVICE
 * 
 * Handles interaction with AI Models for dynamic dialogue.
 * In production, this would use a real API key.
 */

export const LLM_STRIKTHROUGH = false; // Toggle for testing/mock mode

export async function getLLMPatientResponse(question, baseResponse, patientData) {
    if (LLM_STRIKTHROUGH) return baseResponse;

    const prompt = buildPatientPrompt(question, baseResponse, patientData);

    // CONTEXT: Kita asumsikan ada API endpoint atau library SDK di sini
    // Untuk contoh ini, kita buat MOCK logic (atau bisa menggunakan fetch ke Gemini API)

    console.debug("SENDING TO LLM:", prompt);

    try {
        // MOCK API DELAY
        await new Promise(resolve => setTimeout(resolve, 800));

        // LOGIC MOCK: Menambahkan gaya bicara berdasarkan usia/mood
        let enhanced = baseResponse;

        if (patientData.age < 15) {
            enhanced = `(Tampak malu) ${baseResponse}, Dok...`;
        } else if (patientData.mood === 'anxious') {
            enhanced = `Duh saya takut banget Dok, ${baseResponse.toLowerCase()}. Gimana ya?`;
        } else if (patientData.social?.education === 'SD') {
            enhanced = `${baseResponse} gitu Dok, saya kurang paham kenapa bisa begini.`;
        }

        return enhanced;
    } catch (error) {
        console.error("LLM Error, falling back to template:", error);
        return baseResponse;
    }
}

function buildPatientPrompt(question, baseResponse, patient) {
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
