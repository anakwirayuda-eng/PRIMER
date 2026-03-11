<!-- PRIMERA_PROVENANCE {"generatedAt":"2026-03-10T23:48:33.130Z","gitSha":"abf2836","dirty":true,"sourceCommand":"sentinel","inputArtifacts":["health.json","store-schema.md"]} -->
# PRIMERA Intelligence Hub

> Sentinel Status: Active
> Last Scan: 11/3/2026, 06.48.33

## Structural Risk Assessment

| Metric | Value |
| :--- | :--- |
| **Risk Level** | **STABLE** |
| **Reason** | Canonical health.json indicates trusted runtime and structural posture. |
| **Health Score** | **83/100** |
| **Cap Reason** | - |
| **Dirty Worktree** | true |
| **Health Git SHA** | abf2836 |

## Breakdown

```json
{
  "coverage": 93,
  "structure": 70,
  "lint": 77.73851590106007,
  "runtime": 90,
  "clinical": 40,
  "invariants": 100,
  "lifecycle": 100,
  "forensic": 90,
  "assets": 97,
  "build": 100
}
```

## Project Topology (src/)

```text
- [FILE] App.jsx
- [DIR] assets
  - [FILE] asset-manifest.json
  - [FILE] assets.js
  - [DIR] buildings
    - [FILE] alun_alun.png
    - [FILE] balai_desa.png
    - [FILE] bank_sampah.png
    - [FILE] dashat.png
    - [FILE] house.png
    - [FILE] iks_scoreboard.png
    - [FILE] kantor_desa.png
    - [FILE] market.png
    - [FILE] mck.png
    - [FILE] mosque.png
    - [FILE] pamsimas.png
    - [FILE] polindes.png
    - [FILE] posyandu.png
    - [FILE] pos_gizi.png
    - [FILE] pos_ukk.png
    - [FILE] puskesmas.png
    - [FILE] pustu.png
    - [FILE] rtk.png
    - [FILE] rumah_dinas.png
    - [FILE] school.png
    - [FILE] tk.png
    - [FILE] toga.png
    - [FILE] tpu.png
    - [FILE] well.png
- [DIR] components
  - [FILE] AboutModal.jsx
  - [DIR] apps
    - [FILE] BankApp.jsx
    - [FILE] ChatApp.jsx
    - [FILE] NewsApp.jsx
    - [FILE] ShopApp.jsx
  - [FILE] ArsipPage.jsx
  - [FILE] AvatarRenderer.jsx
  - [FILE] AvatarSelectionModal.jsx
  - [FILE] BodyMapWidget.jsx
  - [FILE] CalendarModal.jsx
  - [FILE] ClinicalPage.jsx
  - [FILE] CPPTCard.jsx
  - [FILE] DailyReportModal.jsx
  - [DIR] dashboard
    - [FILE] AccreditationView.jsx
    - [FILE] ClinicalView.jsx
    - [FILE] CommunityView.jsx
    - [FILE] LogisticsView.jsx
    - [FILE] PerformanceView.jsx
  - [FILE] DashboardPage.jsx
  - [FILE] DatabaseSync.jsx
  - [FILE] DiklatPage.jsx
  - [FILE] EducationalWikiModal.jsx
  - [FILE] EmergencyPanel.jsx
  - [DIR] emr
    - [DIR] anamnesis
    - [FILE] AnamnesisTab.jsx
    - [FILE] AssessmentTab.jsx
    - [FILE] BillingTab.jsx
    - [FILE] ClinicalSidebar.jsx
    - [FILE] EducationTab.jsx
    - [FILE] HistoryTab.jsx
    - [FILE] LabTab.jsx
    - [FILE] PhysicalExamTab.jsx
    - [FILE] ProceduresTab.jsx
    - [FILE] ReasoningDashboard.jsx
    - [DIR] sidebar
    - [DIR] treatment
    - [FILE] TreatmentTab.jsx
  - [FILE] EndOfDayModal.jsx
  - [FILE] ErrorBoundary.jsx
  - [FILE] FarmasiPanel.jsx
  - [FILE] GameOverModal.jsx
  - [DIR] gedung
    - [FILE] RoomCard.jsx
    - [FILE] UpgradeModal.jsx
  - [FILE] GedungPage.jsx
  - [FILE] InfoTooltip.jsx
  - [FILE] InventoryPage.jsx
  - [FILE] KPIDashboard.jsx
  - [FILE] MainLayout.jsx
  - [FILE] MetricCard.jsx
  - [FILE] MorningBriefingModal.jsx
  - [FILE] NarrativeOverlay.jsx
  - [FILE] OpeningScreen.jsx
  - [FILE] OrderModal.jsx
  - [FILE] OutbreakBanner.jsx
  - [FILE] OutbreakModal.jsx
  - [FILE] PatientEMR.jsx
  - [FILE] PatientHistoryModal.jsx
  - [FILE] PlayerSetup.jsx
  - [FILE] PosyanduModal.jsx
  - [FILE] ProlanisConsultation.jsx
  - [FILE] ProlanisPanel.jsx
  - [FILE] QuestBoard.jsx
  - [FILE] QueueList.jsx
  - [FILE] ReferralHUD.jsx
  - [FILE] ReferralSISRUTEModal.jsx
  - [FILE] SaranaPage.jsx
  - [FILE] SaveSlotSelector.jsx
  - [DIR] sensus
    - [FILE] SensusPage.jsx
  - [FILE] ServiceCardDeck.jsx
  - [FILE] SettingsModal.jsx
  - [DIR] shared
    - [FILE] ExpandableCard.jsx
    - [FILE] GuidelineBadge.jsx
    - [FILE] StatCard.jsx
    - [FILE] StepCarousel.jsx
  - [FILE] Smartphone.jsx
  - [DIR] staff
    - [FILE] StaffCard.jsx
    - [FILE] StaffDetail.jsx
  - [FILE] StaffPage.jsx
  - [FILE] StatusJunctionModal.jsx
  - [FILE] VillagerAvatar.jsx
  - [FILE] WeekendModal.jsx
  - [DIR] wilayah
    - [DIR] 3d
    - [FILE] AuxiliaryComponents.jsx
    - [FILE] BehaviorCasePanel.jsx
    - [FILE] BuildingGamePanel.jsx
    - [FILE] buildingScenes.js
    - [FILE] CommunityDiagnosisPanel.jsx
    - [FILE] constants.js
    - [FILE] EliteCOMBWheel.jsx
    - [FILE] map-utils.js
    - [FILE] MapCanvas.jsx
    - [FILE] MiniGamePanel.jsx
    - [FILE] PixelSceneRenderer.jsx
    - [FILE] PosyanduActivePanel.jsx
    - [FILE] PremiumMapDemo.jsx
    - [FILE] PustuActivePanel.jsx
    - [FILE] TerrainCanvas.jsx
  - [FILE] WilayahPage.jsx
- [DIR] content
  - [DIR] cases
    - [FILE] CaseLibrary.js
    - [DIR] modules
  - [DIR] concepts
    - [FILE] village_politics.md
  - [DIR] residents
    - [FILE] DialogVariations.js
    - [FILE] PersonalityTraits.js
    - [FILE] ResidentProfiles.js
  - [DIR] scenarios
    - [FILE] CulturalBeliefs.js
    - [FILE] DiseaseScenarios.js
    - [FILE] IKMScenarioLibrary.js
    - [FILE] PHBSIndicators.js
- [DIR] context
  - [DIR] contracts
    - [FILE] gameContext.contract.js
  - [FILE] GameContext.jsx
  - [FILE] ThemeContext.jsx
- [DIR] contracts
  - [FILE] store.contract.mjs
- [DIR] data
  - [FILE] AppMetadata.js
  - [FILE] CalendarEventDB.js
  - [FILE] ClinicalServices.js
  - [FILE] EducationOptions.js
  - [FILE] extract_icd9.cjs
  - [FILE] extract_icd9.py
  - [FILE] FacilityData.js
  - [FILE] FKTP144Diseases.js
  - [FILE] FurnitureData.js
  - [FILE] HospitalDB.js
  - [FILE] ICD10.js
  - [FILE] ICD10_ALIASES.js
  - [FILE] ICD9CM.js
  - [FILE] index.js
  - [FILE] master_icd_10.json
  - [FILE] master_icd_9.json
  - [DIR] medication
    - [DIR] registry
    - [FILE] utils.js
  - [FILE] MedicationDatabase.js
  - [FILE] ProceduresDB.js
  - [FILE] ProlanisDB.js
  - [FILE] StaffData.js
  - [FILE] SupplierDatabase.js
  - [DIR] wiki
    - [FILE] dashboard_manajemen.js
    - [FILE] emergency_wiki.js
    - [FILE] igd.js
    - [FILE] klinis.js
    - [FILE] kulit.js
    - [FILE] lab_prosedur.js
    - [FILE] manajemen.js
    - [FILE] obat.js
    - [FILE] penyakit.js
    - [FILE] wilayah.js
  - [FILE] WikiData.js
- [DIR] diagnostics
  - [FILE] invariants.js
- [DIR] domains
  - [DIR] clinical
  - [DIR] community
    - [FILE] OutbreakSystem.js
  - [DIR] village
    - [FILE] NPCReadiness.js
    - [FILE] VillagerBehavior.js
    - [FILE] VillageRegistry.js
    - [FILE] village_families.js
- [DIR] game
  - [DIR] anamnesis
    - [FILE] Constants.js
    - [FILE] DialogueEngine.js
    - [FILE] EmotionEngine.js
    - [FILE] InformantSystem.js
    - [FILE] SynthesisEngine.js
    - [FILE] TextAdapter.js
    - [DIR] variations
  - [FILE] AnamnesisEngine.js
  - [FILE] AnamnesisPrompts.js
  - [FILE] AnamnesisVariations.js
  - [FILE] BehaviorCaseEngine.js
  - [FILE] BillingEngine.js
  - [FILE] CaseIndicators.js
  - [FILE] ClinicalReasoning.js
  - [FILE] ConsequenceEngine.js
  - [FILE] CPPTEngine.js
  - [FILE] DebriefEngine.js
  - [DIR] dental
    - [FILE] DentalDiagnosisEngine.js
    - [FILE] DentalProcedureEngine.js
  - [FILE] DispensingEngine.js
  - [DIR] emergency
    - [DIR] cases
    - [FILE] EmergencyRegistry.js
  - [FILE] EmergencyCases.js
  - [FILE] EmergingEventTriggers.js
  - [FILE] GameCore.js
  - [FILE] GuestEventSystem.js
  - [FILE] IKMEventEngine.js
  - [FILE] index.js
  - [FILE] KaderNetwork.js
  - [DIR] kia
    - [FILE] GrowthChartEngine.js
    - [FILE] ImmunizationEngine.js
    - [FILE] PregnancyEngine.js
  - [FILE] LabEngine.js
  - [FILE] MiniGameLibrary.js
  - [FILE] MorningBriefing.js
  - [FILE] PatientGenerator.js
  - [FILE] PosyanduEngine.js
  - [FILE] ProlanisEngine.js
  - [FILE] QuestEngine.js
  - [FILE] StoryDatabase.js
  - [FILE] TheDirector.js
  - [FILE] ValidationEngine.js
- [DIR] gameplay
  - [FILE] featureRegistry.js
- [DIR] hooks
  - [FILE] useGameLoop.js
  - [FILE] useModalA11y.js
  - [FILE] useNavAndSettings.js
  - [FILE] usePatientEMR.js
  - [FILE] useStaffManagement.js
- [FILE] i18n.js
- [FILE] index.css
- [DIR] locales
  - [FILE] en.json
  - [FILE] id.json
- [FILE] main.jsx
- [DIR] pages
  - [FILE] RumahDinas.jsx
- [DIR] scripts
  - [FILE] validate_maia_suggestions.cjs
  - [FILE] validate_summary.cjs
  - [FILE] validation_output.txt
  - [FILE] validation_report.txt
- [DIR] services
  - [FILE] LLMService.js
  - [FILE] PersistenceService.js
- [DIR] store
  - [FILE] selectors.js
  - [FILE] useGameStore.js
- [DIR] tests
  - [FILE] dischargeEmergencyPatient.test.js
  - [FILE] dischargePatient.test.js
  - [FILE] feature.guard.test.jsx
  - [FILE] featureGuard.js
  - [FILE] riskFactors.test.js
  - [FILE] setup.js
  - [FILE] test-setup.js
- [DIR] utils
  - [FILE] AvatarUtils.js
  - [FILE] BuildingGenerator.js
  - [FILE] crashTrap.js
  - [FILE] dispatchGuard.js
  - [FILE] formatTime.js
  - [FILE] LevelingSystem.js
  - [FILE] prophylaxis.js
  - [FILE] SocialDeterminants.js
  - [FILE] SoundManager.js
  - [FILE] TerrainGenerator.js
  - [FILE] TextureGenerator.js
  - [FILE] ToastManager.js
  - [FILE] transactions.js
  - [FILE] types.js
  - [FILE] UIInsetGenerator.js
  - [FILE] validation.js

```

## State Contract (Zustand)


## NAV Slice
| Key | Type |
| :--- | :--- |
| **`nav`** | **STATE ROOT** |
| `gameState` | State |
| `activePage` | State |
| `viewParams` | State |
| `sidebarCollapsed` | State |
| `currentSlotId` | State |
| `showKPIGlobal` | State |
| `isWikiOpen` | State |
| `wikiMetric` | State |
| `settings` | State |
| `theme` | State |
| `sidebarColor` | State |
| `fontSize` | State |
| `volume` | State |
| `autoSave` | State |
| **`navActions`** | **ACTION ROOT** |
| `setGameState` | Action |
| `setActivePage` | Action |
| `navigate` | Action |
| `toggleSidebar` | Action |
| `setSlotId` | Action |
| `toggleKPI` | Action |
| `setShowKPIGlobal` | Action |
| `updateSettings` | Action |
| `if` | Action |
| `if` | Action |
| `if` | Action |

## WORLD Slice
| Key | Type |
| :--- | :--- |
| **`world`** | **STATE ROOT** |
| **`worldActions`** | **ACTION ROOT** |
| `tick` | Action |
| `if` | Action |
| `setTime` | Action |
| `setDay` | Action |
| `setGameSpeed` | Action |
| `advanceTime` | Action |
| `resetTime` | Action |

## PLAYER Slice
| Key | Type |
| :--- | :--- |
| **`player`** | **STATE ROOT** |
| `profile` | State |
| **`playerActions`** | **ACTION ROOT** |
| `setPlayerStats` | Action |
| `updateProfile` | Action |
| **`player`** | **STATE ROOT** |
| `gainXp` | Action |
| **`player`** | **STATE ROOT** |
| `profile` | State |
| `calculateSleepRecovery` | Action |
| `set` | Action |
| **`player`** | **STATE ROOT** |
| `profile` | State |
| `energy` | State |
| `stress` | Action |
| `morningStatus` | State |
| `takeLoungeRest` | Action |
| `if` | Action |
| `set` | Action |
| **`player`** | **STATE ROOT** |
| `profile` | State |
| `energy` | Action |
| `stress` | Action |
| `loungeRestCount` | State |
| `lastLoungeDay` | State |
| `get` | Action |
| `clearMorningStatus` | Action |
| `setReputation` | Action |
| `resetPlayer` | Action |

## FINANCE Slice
| Key | Type |
| :--- | :--- |
| **`finance`** | **STATE ROOT** |
| `stats` | State |
| `kpi` | State |
| `facilities` | State |
| `pharmacyInventory` | Action |
| `medicationId` | State |
| `stock` | Action |
| `lastRestockDay` | State |
| `pendingOrders` | State |
| **`financeActions`** | **ACTION ROOT** |
| `setStats` | Action |
| `setKpi` | Action |
| `setFacilities` | Action |
| `setPharmacyInventory` | Action |
| `setPendingOrders` | Action |
| `upgradeFacility` | Action |
| `if` | Action |
| `set` | Action |
| **`finance`** | **STATE ROOT** |
| `stats` | State |
| `facilities` | State |
| `consumeMedication` | Action |
| `if` | Action |
| `if` | Action |
| `set` | Action |
| **`finance`** | **STATE ROOT** |
| `pharmacyInventory` | Action |
| `set` | Action |
| **`finance`** | **STATE ROOT** |
| `stats` | Action |
| `checkInventoryAvailability` | Action |
| `if` | Action |
| `available` | State |
| `stock` | State |
| `isLowStock` | State |
| `percentageOfMin` | Action |
| `submitOrder` | Action |
| `if` | Action |
| `if` | Action |
| `if` | Action |
| `if` | Action |
| `set` | Action |
| **`finance`** | **STATE ROOT** |
| `stats` | State |
| `kapitasi` | State |
| `pengeluaranObat` | Action |
| `id` | Action |
| `items` | State |
| `orderDay` | State |
| `deliveryDay` | Action |
| `status` | State |
| `cost` | State |
| `paymentTerms` | State |
| `set` | Action |
| `receiveOrder` | Action |
| `if` | Action |
| `set` | Action |
| **`finance`** | **STATE ROOT** |
| `pharmacyInventory` | Action |
| `pendingOrders` | Action |
| `archiveDay` | Action |
| `set` | Action |
| **`finance`** | **STATE ROOT** |
| `stats` | Action |
| `processMonthlyReport` | Action |
| `set` | Action |
| **`finance`** | **STATE ROOT** |
| `stats` | State |
| `kapitasi` | State |
| `pengeluaranObat` | State |
| `pengeluaranLab` | State |
| `pengeluaranOperasional` | State |
| `pendapatanUmum` | State |
| `kpi` | State |
| `resetFinance` | Action |
| **`finance`** | **STATE ROOT** |
| `stats` | State |
| `kpi` | State |
| `facilities` | State |
| `pharmacyInventory` | Action |
| `medicationId` | State |
| `stock` | Action |
| `lastRestockDay` | State |
| `pendingOrders` | State |

## PUBLIC Slice
| Key | Type |
| :--- | :--- |
| **`publicHealth`** | **STATE ROOT** |
| `villageData` | State |
| `prolanisRoster` | State |
| `prolanisState` | State |
| `activeOutbreaks` | State |
| `outbreakNotification` | State |
| **`publicHealthActions`** | **ACTION ROOT** |
| `setVillageData` | Action |
| `setProlanisRoster` | Action |
| `setProlanisState` | Action |
| `setActiveOutbreaks` | Action |
| `setOutbreakNotification` | Action |
| `enrollProlanis` | Action |
| `if` | Action |
| `id` | State |
| `anthropometrics` | State |
| `bpjsNumber` | Action |
| `social` | State |
| `prolanisData` | State |
| `diseaseType` | State |
| `enrolledDay` | State |
| `parameters` | State |
| `set` | Action |
| **`publicHealth`** | **STATE ROOT** |
| **`player`** | **STATE ROOT** |
| `completeProlanisVisit` | Action |
| `set` | Action |
| `if` | Action |
| `prolanisData` | State |
| `consecutiveControlled` | State |
| `history` | State |
| `hasComplication` | State |
| `respondToOutbreak` | Action |
| `if` | Action |
| `if` | Action |
| `set` | Action |
| `if` | Action |
| `if` | Action |
| `if` | Action |
| `if` | Action |
| `if` | Action |
| `if` | Action |
| `if` | Action |
| `processDailyPublicHealth` | Action |
| `if` | Action |
| `if` | Action |
| `if` | Action |
| `set` | Action |
| `resetPublicHealth` | Action |
| **`publicHealth`** | **STATE ROOT** |

## STAFF Slice
| Key | Type |
| :--- | :--- |
| **`staff`** | **STATE ROOT** |
| `hiredStaff` | State |
| **`staffActions`** | **ACTION ROOT** |
| `setHiredStaff` | Action |
| `coachStaff` | Action |
| `if` | Action |
| `if` | Action |
| `set` | Action |
| **`staff`** | **STATE ROOT** |
| **`player`** | **STATE ROOT** |
| `assignTask` | Action |
| `set` | Action |
| `processDailyDecay` | Action |
| `set` | Action |
| `resetStaff` | Action |

## CLINICAL Slice
| Key | Type |
| :--- | :--- |
| **`clinical`** | **STATE ROOT** |
| **`clinicalActions`** | **ACTION ROOT** |
| `setQueue` | Action |
| `setEmergencyQueue` | Action |
| `setActivePatientId` | Action |
| `setActiveEmergencyId` | Action |
| `setHistory` | Action |
| `setAccreditation` | Action |
| `setActiveReferral` | Action |
| `setActiveReferralLog` | Action |
| `setBusyAmbulanceIds` | Action |
| `setPrbQueue` | Action |
| `setWarningLevel` | Action |
| `setGameOver` | Action |
| `resetClinical` | Action |
| `updatePatient` | Action |
| `processDailyTick` | Action |
| `if` | Action |
| `if` | Action |
| `if` | Action |
| `if` | Action |
| `if` | Action |
| `if` | Action |
| `if` | Action |
| `if` | Action |
| `dischargePatient` | Action |
| `if` | Action |
| `if` | Action |
| `for` | Action |
| `if` | Action |
| `if` | Action |
| `if` | Action |
| `if` | Action |
| `if` | Action |
| `if` | Action |
| `if` | Action |
| `if` | Action |
| `if` | Action |
| `if` | Action |
| `if` | Action |
| `if` | Action |
| `if` | Action |
| `id` | Action |
| `familyId` | State |
| `diagnosisId` | State |
| `diagnosis` | State |
| `hospitalName` | State |
| `timeSent` | State |
| `if` | Action |
| `if` | Action |
| `if` | Action |
| `if` | Action |
| `if` | Action |
| `if` | Action |
| `if` | Action |
| `if` | Action |
| `if` | Action |
| `if` | Action |
| `if` | Action |
| `if` | Action |
| `dischargeEmergencyPatient` | Action |
| `if` | Action |
| `set` | Action |
| **`clinical`** | **STATE ROOT** |
| **`player`** | **STATE ROOT** |
| **`finance`** | **STATE ROOT** |
| `orderLab` | Action |
| `set` | Action |
| `checkAccreditation` | Action |
| `if` | Action |
| `if` | Action |
| `resetDailyState` | Action |

## META Slice
| Key | Type |
| :--- | :--- |
| **`meta`** | **STATE ROOT** |
| **`metaActions`** | **ACTION ROOT** |
| `setMeta` | Action |
| `updateProgress` | Action |
| `set` | Action |
| `claimQuest` | Action |
| `if` | Action |
| `set` | Action |
| `advanceStory` | Action |
| `if` | Action |
| `if` | Action |
| `if` | Action |
| `if` | Action |
| `if` | Action |
| `if` | Action |
| `set` | Action |
| `evaluateTriggers` | Action |
| `day` | State |
| `reputation` | State |
| `balance` | State |
| `patients_treated` | State |
| `if` | Action |
| `set` | Action |
| `openWiki` | Action |
| `closeWiki` | Action |
| `resetMeta` | Action |
| `actions` | State |
| `saveGame` | Action |
| `if` | Action |
| `saveVersion` | State |
| **`player`** | **STATE ROOT** |
| **`world`** | **STATE ROOT** |
| **`finance`** | **STATE ROOT** |
| **`clinical`** | **STATE ROOT** |
| **`publicHealth`** | **STATE ROOT** |
| **`staff`** | **STATE ROOT** |
| `savedAt` | Action |
| `loadGame` | Action |
| `if` | Action |
| `set` | Action |
| `startNewGame` | Action |
| `set` | Action |
| `families` | Action |
| `members` | Action |
| `indicators` | State |
| `iksScore` | Action |
| `villagers` | Action |
| `stats` | State |
| `generatePatient` | Action |
| `generatePatient` | Action |
| `generatePatient` | Action |
| `nextDay` | Action |
| `set` | Action |
| `if` | Action |
| `if` | Action |
| `if` | Action |
| `if` | Action |
| `get` | Action |
| `setTimeout` | Action |
| `resetGame` | Action |
| **`world`** | **STATE ROOT** |
| **`player`** | **STATE ROOT** |
| **`finance`** | **STATE ROOT** |
| **`publicHealth`** | **STATE ROOT** |
| **`staff`** | **STATE ROOT** |
| **`clinical`** | **STATE ROOT** |
| **`meta`** | **STATE ROOT** |
| `name` | State |
| `partialize` | Action |
| **`world`** | **STATE ROOT** |
| **`player`** | **STATE ROOT** |
| **`finance`** | **STATE ROOT** |
| **`publicHealth`** | **STATE ROOT** |
| **`staff`** | **STATE ROOT** |
| **`clinical`** | **STATE ROOT** |



---
Generated by PRIMERA Sentinel vNext
