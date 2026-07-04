/**
 * TUTORIAL — konstanta kasus terpandu (DeepThink "onboarding railroaded",
 * keputusan user). Kasus dasar & sederhana (ISPA common cold, non-rujuk,
 * lab tak relevan) dipaksa jadi pasien PERTAMA tiap stase baru (init.ts) —
 * UI (screens/klinik/tutorialKlinik.ts) memakai konstanta yang SAMA untuk
 * menyorot langkah demi langkah. Hidup di engine (bukan renderer) krn
 * init.ts (yang memaksa antrian) juga membutuhkannya — engine tak boleh
 * bergantung ke renderer.
 */
export const KASUS_TUTORIAL = 'ispa_common_cold'
export const ANAMNESIS_PERTAMA_TUTORIAL = 'q_keluhan'
export const REGION_PERTAMA_TUTORIAL = 'umum'
export const OBAT_PERTAMA_TUTORIAL = 'paracetamol_500'
