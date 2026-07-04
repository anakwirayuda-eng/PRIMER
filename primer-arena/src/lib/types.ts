// Tipe baris tabel Supabase — cermin schema.sql. Snake_case sengaja dipertahankan
// (bukan di-camelCase) supaya 1:1 dengan kolom SQL, memudahkan audit query.

export type Phase = 'lobby' | 'intro' | 'round' | 'debrief' | 'closed'

export interface GameSession {
  id: string
  kode: string
  nama: string
  phase: Phase
  round: number
  round_started_at: string | null
  current_event: Record<string, unknown> | null
  facilitator_uid: string | null
  config: Record<string, unknown>
  created_at: string
}

export interface BedRS {
  nama: string
  kelas: 'D' | 'C' | 'B' | 'A'
  spesialisasi: string[]
  bedTotal: number
  bedTerpakai: number
}

export interface PodState {
  id: string
  session_id: string
  nomor: number
  nama: string
  rs_beds: Record<string, BedRS>
  tak_tertangani: number
  created_at: string
}

export interface Player {
  id: string
  session_id: string
  pod_id: string | null
  auth_uid: string | null
  nim: string
  nama: string
  seat: string | null
  role: 'puskesmas' | 'gm'
  online: boolean
  joined_at: string
}

export type ReferralStatus =
  | 'baru'
  | 'tuntas_selesai'
  | 'menunggu_bed'
  | 'diterima'
  | 'ditolak_penuh'
  | 'pulang'
  | 'kadaluarsa'

export interface KartuPasien {
  nama: string
  usia: number
  keluhan: string
  icd10: string
  kegawatan: 'rendah' | 'sedang' | 'tinggi'
  spesialisasiButuh: string
}

export interface Referral {
  id: string
  session_id: string
  pod_id: string
  round: number
  player_id: string | null
  pasien: KartuPasien
  keputusan: 'tuntas' | 'rujuk' | null
  chosen_rs_id: string | null
  eval: Record<string, unknown> | null
  status: ReferralStatus
  created_at: string
  updated_at: string
}

export interface AksiLog {
  id: string
  session_id: string
  pod_id: string | null
  player_id: string | null
  round: number
  type: string
  payload: Record<string, unknown>
  eval: Record<string, unknown> | null
  created_at: string
}

export interface KlaimBedResult {
  ok: boolean
  reason?: 'not_found' | 'already_processed' | 'rs_tidak_dikenal' | 'penuh'
  total?: number
  terpakai?: number
  sisaBed?: number
}
