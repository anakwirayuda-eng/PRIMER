-- Migration 004: Leaderboard 4-dimensi (DeepThink M6)
-- Adds Skor Kinerja Terpadu fields to existing leaderboard table sehingga
-- Dashboard Dosen dapat menampilkan breakdown per dimensi (UKP/UKM/MAN/RES)
-- dan filter berdasarkan grade (A/B/C/D).

ALTER TABLE leaderboard
    ADD COLUMN IF NOT EXISTS grade        TEXT     DEFAULT 'D',
    ADD COLUMN IF NOT EXISTS grade_label  TEXT     DEFAULT 'Belum Selesai',
    ADD COLUMN IF NOT EXISTS score_ukp        NUMERIC(5,2) DEFAULT 0,
    ADD COLUMN IF NOT EXISTS score_ukm        NUMERIC(5,2) DEFAULT 0,
    ADD COLUMN IF NOT EXISTS score_management NUMERIC(5,2) DEFAULT 0,
    ADD COLUMN IF NOT EXISTS score_resilience NUMERIC(5,2) DEFAULT 0;

-- Index untuk filter grade & sorting per dimensi (dashboard dosen ≤50 user
-- jadi index ringan, tapi tetap helpful untuk Realtime subscription).
CREATE INDEX IF NOT EXISTS idx_leaderboard_grade ON leaderboard (grade);
CREATE INDEX IF NOT EXISTS idx_leaderboard_score_desc ON leaderboard (score DESC);

-- Tidak ada RLS policy baru — existing policies di 002/003 sudah cover read
-- untuk own_user dan service_role. Dashboard Dosen akan diakses via
-- service_role JWT (di edge function, BUKAN client) untuk filter NIM cohort.
