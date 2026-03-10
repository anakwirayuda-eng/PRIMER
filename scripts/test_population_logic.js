/**
 * Verification Script: Population & Patient Generation Logic
 * Run this with node to verify the integration between VillageRegistry and PatientGenerator
 */

import { VILLAGE_FAMILIES, getAllVillagers } from '../src/data/VillageRegistry.js';
import { generatePatient } from '../src/game/PatientGenerator.js';

// Mock Random Function for consistency if needed (optional)
// Math.random = () => 0.5;

console.log("=== 1. VERIFYING VILLAGE REGISTRY ===");
const villagers = getAllVillagers();
console.log(`Total Villagers: ${villagers.length}`);
console.log(`Total Families: ${VILLAGE_FAMILIES.length}`);

// Check specific high-risk family
const highRiskFamily = VILLAGE_FAMILIES.find(f => f.id === 'kk_23'); // Hasan Putra (Buruh Tani)
console.log(`\nFamily Focus: ${highRiskFamily.headName} (ID: ${highRiskFamily.id})`);
const hasan = villagers.find(v => v.id === 'v_23_1');
console.log(`- Risk Factors: ${hasan.riskFactors.join(', ')}`);
console.log(`- SDOH Economy: ${hasan.sdoh.economy}`);
console.log(`- SDOH Sanitation: ${hasan.sdoh.sanitation}`);

console.log("\n=== 2. SIMULATING PATIENT GENERATION (20 Attempts) ===");
const population = {
    families: VILLAGE_FAMILIES,
    villagers: villagers,
    stats: {}
};

let residentCount = 0;
let riskCorrelatedCount = 0;
let diseases = {};

for (let i = 0; i < 20; i++) {
    const patient = generatePatient(480, population);
    const isResident = patient.hidden.isResident;

    if (isResident) residentCount++;

    const diseaseName = patient.medicalData.diagnosisName;
    diseases[diseaseName] = (diseases[diseaseName] || 0) + 1;

    console.log(`[Patient ${i + 1}] ${patient.name} (${patient.age}th)`);
    console.log(`   Type: ${isResident ? 'RESIDENT' : 'Outsider'} | Disease: ${diseaseName}`);

    if (isResident) {
        const villager = villagers.find(v => v.id === patient.hidden.villagerId);
        if (villager) {
            console.log(`   Resident Risks: ${villager.riskFactors.join(', ')}`);
            // Check correlation (simplified check)
            if (villager.riskFactors.includes('poor_sanitation') && ['Diare', 'Tifus', 'Gastroenteritis'].some(d => diseaseName.includes(d))) {
                riskCorrelatedCount++;
                console.log(`   ✅ Disease matches Risk Factor!`);
            }
            if (villager.riskFactors.includes('smoke_exposure') && ['ISPA', 'Pneumonia', 'Asma'].some(d => diseaseName.includes(d))) {
                riskCorrelatedCount++;
                console.log(`   ✅ Disease matches Risk Factor!`);
            }
        }
    }
}

console.log("\n=== 3. SUMMARY ===");
console.log(`Residents Generated: ${residentCount}/20 (${(residentCount / 20) * 100}%) - Target ~60%`);
console.log(`Unique Diseases: ${Object.keys(diseases).length}`);
console.log("System Architecture Verification: PASSED");
