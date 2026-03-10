# 🧠 PRIMERA Intelligence Hub

> **Sentinel Status**: Active
> **Last Scan**: 17/02/2026, 06.11.25

## 🛡️ Structural Risk Assessment

| Metric | Value |
| :--- | :--- |
| **Risk Level** | **STABLE** |
| **Reason** | Structural wiring is secure. No critical lint violations. |

## 🌳 Project Topology (src/)

```text
- 📄 App.jsx
- 📁 assets
  - 📄 asset-manifest.json
  - 📄 assets.js
  - 📁 buildings
    - 📄 alun_alun.png
    - 📄 balai_desa.png
    - 📄 bank_sampah.png
    - 📄 dashat.png
    - 📄 house.png
    - 📄 iks_scoreboard.png
    - 📄 kantor_desa.png
    - 📄 market.png
    - 📄 mck.png
    - 📄 mosque.png
    - 📄 pamsimas.png
    - 📄 polindes.png
    - 📄 posyandu.png
    - 📄 pos_gizi.png
    - 📄 pos_ukk.png
    - 📄 puskesmas.png
    - 📄 pustu.png
    - 📄 rtk.png
    - 📄 rumah_dinas.png
    - 📄 school.png
    - 📄 tk.png
    - 📄 toga.png
    - 📄 tpu.png
    - 📄 well.png
- 📁 components
  - 📁 apps
    - 📄 BankApp.jsx
    - 📄 ChatApp.jsx
    - 📄 NewsApp.jsx
    - 📄 ShopApp.jsx
  - 📄 ArsipPage.jsx
  - 📄 AvatarRenderer.jsx
  - 📄 AvatarSelectionModal.jsx
  - 📄 BodyMapWidget.jsx
  - 📄 CalendarModal.jsx
  - 📄 ClinicalPage.jsx
  - 📄 CPPTCard.jsx
  - 📄 DailyReportModal.jsx
  - 📁 dashboard
    - 📄 AccreditationView.jsx
    - 📄 ClinicalView.jsx
    - 📄 CommunityView.jsx
    - 📄 LogisticsView.jsx
    - 📄 PerformanceView.jsx
  - 📄 Dashboard.jsx
  - 📄 DashboardPage.jsx
  - 📄 DatabaseSync.jsx
  - 📄 DiklatPage.jsx
  - 📄 EducationalWikiModal.jsx
  - 📄 EmergencyPanel.jsx
  - 📁 emr
    - 📁 anamnesis
    - 📄 AnamnesisTab.jsx
    - 📄 AssessmentTab.jsx
    - 📄 BillingTab.jsx
    - 📄 ClinicalSidebar.jsx
    - 📄 EducationTab.jsx
    - 📄 HistoryTab.jsx
    - 📄 LabTab.jsx
    - 📄 PhysicalExamTab.jsx
    - 📄 ProceduresTab.jsx
    - 📄 ReasoningDashboard.jsx
    - 📁 sidebar
    - 📁 treatment
    - 📄 TreatmentTab.jsx
  - 📄 ErrorBoundary.jsx
  - 📄 GameOverModal.jsx
  - 📁 gedung
    - 📄 RoomCard.jsx
    - 📄 UpgradeModal.jsx
  - 📄 GedungPage.jsx
  - 📄 InfoTooltip.jsx
  - 📄 InventoryPage.jsx
  - 📄 KPIDashboard.jsx
  - 📄 MainLayout.jsx
  - 📄 MetricCard.jsx
  - 📄 NarrativeOverlay.jsx
  - 📄 OpeningScreen.jsx
  - 📄 OrderModal.jsx
  - 📄 OutbreakModal.jsx
  - 📄 PatientEMR.jsx
  - 📄 PatientHistoryModal.jsx
  - 📄 PlayerSetup.jsx
  - 📄 PosyanduModal.jsx
  - 📄 ProlanisConsultation.jsx
  - 📄 ProlanisPanel.jsx
  - 📄 QuestBoard.jsx
  - 📄 QueueList.jsx
  - 📄 ReferralSISRUTEModal.jsx
  - 📄 SaranaPage.jsx
  - 📄 SaveSlotSelector.jsx
  - 📄 ServiceCardDeck.jsx
  - 📄 SettingsModal.jsx
  - 📄 Smartphone.jsx
  - 📁 staff
    - 📄 StaffCard.jsx
    - 📄 StaffDetail.jsx
  - 📄 StaffPage.jsx
  - 📄 StatusJunctionModal.jsx
  - 📄 WeekendModal.jsx
  - 📁 wilayah
    - 📄 AuxiliaryComponents.jsx
    - 📄 constants.js
    - 📄 map-utils.js
    - 📄 MapCanvas.jsx
    - 📄 TerrainCanvas.jsx
  - 📄 WilayahPage.jsx
- 📁 content
  - 📁 cases
    - 📄 CaseLibrary.js
    - 📁 modules
  - 📁 concepts
    - 📄 village_politics.md
  - 📁 residents
  - 📁 scenarios
- 📁 context
  - 📁 contracts
    - 📄 gameContext.contract.js
  - 📄 GameContext.jsx
  - 📄 ThemeContext.jsx
- 📁 contracts
  - 📄 store.contract.mjs
- 📁 data
  - 📄 AppMetadata.js
  - 📄 CalendarEventDB.js
  - 📄 ClinicalServices.js
  - 📄 EducationOptions.js
  - 📄 extract_icd9.cjs
  - 📄 extract_icd9.py
  - 📄 FacilityData.js
  - 📄 FKTP144Diseases.js
  - 📄 FurnitureData.js
  - 📄 HospitalDB.js
  - 📄 ICD10.js
  - 📄 ICD9CM.js
  - 📄 index.js
  - 📄 master_icd_10.json
  - 📄 master_icd_9.json
  - 📁 medication
    - 📁 registry
    - 📄 utils.js
  - 📄 MedicationDatabase.js
  - 📄 ProceduresDB.js
  - 📄 ProlanisDB.js
  - 📄 StaffData.js
  - 📄 SupplierDatabase.js
  - 📁 wiki
    - 📄 klinis.js
    - 📄 kulit.js
    - 📄 lab_prosedur.js
    - 📄 manajemen.js
    - 📄 obat.js
    - 📄 penyakit.js
    - 📄 wilayah.js
  - 📄 WikiData.js
- 📁 diagnostics
  - 📄 invariants.js
- 📁 domains
  - 📁 clinical
  - 📁 community
    - 📄 OutbreakSystem.js
  - 📁 village
    - 📄 VillageRegistry.js
    - 📄 village_families.js
- 📁 game
  - 📁 anamnesis
    - 📄 Constants.js
    - 📄 DialogueEngine.js
    - 📄 EmotionEngine.js
    - 📄 InformantSystem.js
    - 📄 SynthesisEngine.js
    - 📄 TextAdapter.js
    - 📁 variations
  - 📄 AnamnesisEngine.js
  - 📄 AnamnesisPrompts.js
  - 📄 AnamnesisVariations.js
  - 📄 BillingEngine.js
  - 📄 CaseIndicators.js
  - 📄 ClinicalReasoning.js
  - 📄 CPPTEngine.js
  - 📁 emergency
    - 📁 cases
    - 📄 EmergencyRegistry.js
  - 📄 EmergencyCases.js
  - 📄 GameCore.js
  - 📄 GuestEventSystem.js
  - 📄 index.js
  - 📄 PatientGenerator.js
  - 📄 PosyanduEngine.js
  - 📄 ProlanisEngine.js
  - 📄 QuestEngine.js
  - 📄 StoryDatabase.js
  - 📄 ValidationEngine.js
- 📁 gameplay
  - 📄 featureRegistry.js
- 📁 hooks
  - 📄 useGameLoop.js
  - 📄 useNavAndSettings.js
  - 📄 usePatientEMR.js
  - 📄 useStaffManagement.js
- 📄 i18n.js
- 📄 index.css
- 📁 locales
  - 📄 en.json
  - 📄 id.json
- 📄 main.jsx
- 📁 pages
  - 📄 RumahDinas.jsx
- 📁 services
  - 📄 LLMService.js
  - 📄 PersistenceService.js
- 📁 store
  - 📄 selectors.js
  - 📄 useGameStore.js
- 📁 tests
  - 📄 dischargePatient.test.js
  - 📄 feature.guard.test.jsx
  - 📄 featureGuard.js
  - 📄 riskFactors.test.js
  - 📄 setup.js
  - 📄 test-setup.js
- 📁 utils
  - 📄 AvatarUtils.js
  - 📄 BuildingGenerator.js
  - 📄 crashTrap.js
  - 📄 dispatchGuard.js
  - 📄 LevelingSystem.js
  - 📄 prophylaxis.js
  - 📄 SocialDeterminants.js
  - 📄 SoundManager.js
  - 📄 TerrainGenerator.js
  - 📄 TextureGenerator.js
  - 📄 transactions.js
  - 📄 types.js
  - 📄 UIInsetGenerator.js
  - 📄 validation.js

```

## 🧊 State Contract (Zustand)


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
Generated by PRIMERA Sentinel v1.0
