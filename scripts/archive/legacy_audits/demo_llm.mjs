import { getLLMPatientResponse } from './src/services/LLMService.js';

const mockPatient = {
    firstName: "Budi",
    age: 10,
    gender: "L",
    complaint: "Batuk pilek",
    mood: "anxious",
    social: { education: "SD" }
};

const testScenarios = [
    { q: "Sudah berapa lama batuknya?", fact: "Sudah 3 hari." },
    { q: "Ada keluarga yang sakit serupa?", fact: "Tidak ada." },
    { q: "Bisa ceritakan awal mulanya gimana?", fact: "Awalnya kedinginan sepulang sekolah." }
];

async function runDemo() {
    console.log("=== PRIMER LLM ANAMNESIS DEMO ===\n");
    console.log(`Pasien: ${mockPatient.firstName}, ${mockPatient.age} thn (Mood: ${mockPatient.mood})\n`);

    for (const scene of testScenarios) {
        console.log(`Dokter: "${scene.q}"`);
        console.log(`Template Asli: "${scene.fact}"`);

        const llmResp = await getLLMPatientResponse(scene.q, scene.fact, mockPatient);
        console.log(`Output LLM: "${llmResp}"`);
        console.log("-----------------------------------\n");
    }
}

runDemo();
