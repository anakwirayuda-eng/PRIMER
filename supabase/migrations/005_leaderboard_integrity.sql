-- ═══════════════════════════════════════════════════════════════
-- PRIMER Security Patch #5 — Leaderboard integrity for the 4-dimension score
-- Run in Supabase SQL Editor AFTER 004_leaderboard_4dim.sql.
--
-- WHY: migration 004 switched the leaderboard to the 4-dimension Skor Kinerja
-- Terpadu (range 0..100), but the anti-cheat from 002/003 was calibrated for
-- the OLD huge formula. As a result:
--   • sanity_check_score CHECK (<= 100000)  → a client can write score = 99999
--   • velocity flag (jump > 5000)           → never fires on a 0..100 score
-- Both are toothless now. This patch recalibrates them AND validates internal
-- consistency so a tampered client can't write a headline score that its four
-- dimensions don't support, or a grade that doesn't match the score band.
--
-- SCOPE (be honest): this is a deployable INTERIM hardening. It makes
-- INCONSISTENT forgeries impossible (score > dimensions, grade ≠ band, a
-- dimension over its cap). It does NOT make the score server-authoritative —
-- the score is still computed on the client, so a *self-consistent* inflated
-- submission is not caught here. Full server-authority (recompute the score
-- from the action log in a Supabase Edge Function) remains a later milestone.
--
-- PRE-FLIGHT: if the leaderboard already holds old-scale rows (score > 100),
-- the new CHECK constraints will fail to add. Before deploy, clear stale test
-- rows:  DELETE FROM leaderboard WHERE score > 100;
-- ═══════════════════════════════════════════════════════════════

-- ── 1. Recalibrate the score sanity constraint to the 0..100 scale ──
ALTER TABLE leaderboard DROP CONSTRAINT IF EXISTS sanity_check_score;
ALTER TABLE leaderboard
  ADD CONSTRAINT sanity_check_score CHECK (score >= 0 AND score <= 100);

-- ── 2. Per-dimension caps (UKP 35 / UKM 35 / Management 15 / Resilience 15) ──
ALTER TABLE leaderboard DROP CONSTRAINT IF EXISTS sanity_check_dims;
ALTER TABLE leaderboard
  ADD CONSTRAINT sanity_check_dims CHECK (
    score_ukp        >= 0 AND score_ukp        <= 35 AND
    score_ukm        >= 0 AND score_ukm        <= 35 AND
    score_management >= 0 AND score_management <= 15 AND
    score_resilience >= 0 AND score_resilience <= 15
  );

-- ── 3. Internal-consistency trigger ──
-- Reject writes where the headline score exceeds what the four dimensions
-- support, or where the grade does not match the score band. These are
-- impossible from the genuine client, so a violation = tampering.
CREATE OR REPLACE FUNCTION public.validate_leaderboard_consistency()
RETURNS TRIGGER AS $$
DECLARE
  dim_sum numeric;
  expected_grade text;
BEGIN
  dim_sum := COALESCE(NEW.score_ukp, 0) + COALESCE(NEW.score_ukm, 0)
           + COALESCE(NEW.score_management, 0) + COALESCE(NEW.score_resilience, 0);

  -- Headline score may not exceed the sum of its dimensions (±2 rounding slack).
  IF NEW.score > dim_sum + 2 THEN
    RAISE EXCEPTION 'Leaderboard tamper: score % exceeds dimension sum %', NEW.score, dim_sum;
  END IF;

  -- Grade must match the band of the stored score (A>=85 / B 70-84 / C 55-69 / D<55).
  expected_grade := CASE
    WHEN NEW.score >= 85 THEN 'A'
    WHEN NEW.score >= 70 THEN 'B'
    WHEN NEW.score >= 55 THEN 'C'
    ELSE 'D'
  END;
  IF NEW.grade IS NOT NULL AND NEW.grade <> expected_grade THEN
    RAISE EXCEPTION 'Leaderboard tamper: grade % does not match score % (expected %)', NEW.grade, NEW.score, expected_grade;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS validate_leaderboard_consistency_trigger ON leaderboard;
CREATE TRIGGER validate_leaderboard_consistency_trigger
  BEFORE INSERT OR UPDATE ON leaderboard
  FOR EACH ROW EXECUTE FUNCTION public.validate_leaderboard_consistency();

-- ── 4. Recalibrate the velocity auto-flag to the 0..100 scale ──
-- The old >5000 jump never triggers on a 0..100 score. Flag an implausible
-- single-update jump instead (a genuine grade improves gradually). Auto-flag
-- (shadowban via 002's is_cheater) rather than hard-reject, so a rare false
-- positive doesn't lock a student out. The trigger binding from 003 is reused.
CREATE OR REPLACE FUNCTION public.check_score_velocity()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.score IS NOT NULL AND (NEW.score - OLD.score) > 60 THEN
    UPDATE profiles SET is_cheater = true WHERE id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
