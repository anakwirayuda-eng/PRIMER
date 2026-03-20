-- ═══════════════════════════════════════════════════════════════
-- PRIMER Security Patch #3
-- Fixes: Role escalation, Leaderboard DELETE abuse
-- Run in Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════

-- ── 1. Fix Role Escalation: hardcode student role ──
-- Previously accepted 'role' from client metadata (attackable via Postman)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, nim, nama, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'nim',
    COALESCE(NEW.raw_user_meta_data->>'nama', 'Mahasiswa'),
    'student'  -- HARDCODED: dosen/admin created via service_role only
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ── 2. Fix Leaderboard: remove DELETE permission ──
-- Students could delete bad scores and re-insert fake ones
DROP POLICY IF EXISTS "Users manage own leaderboard" ON leaderboard;

CREATE POLICY "Users insert own leaderboard"
  ON leaderboard FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own leaderboard"
  ON leaderboard FOR UPDATE
  USING (auth.uid() = user_id);

-- No DELETE policy = students cannot erase their scores

-- ── 3. Score Velocity Trigger: auto-flag cheaters ──
-- If score jumps >5000 in a single update, it's suspicious
CREATE OR REPLACE FUNCTION check_score_velocity()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.score IS NOT NULL AND (NEW.score - OLD.score) > 5000 THEN
    -- Auto-flag as cheater
    UPDATE profiles SET is_cheater = true WHERE id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS check_score_velocity_trigger ON leaderboard;
CREATE TRIGGER check_score_velocity_trigger
  BEFORE UPDATE ON leaderboard
  FOR EACH ROW EXECUTE FUNCTION check_score_velocity();

-- ── 4. Monotonic Save Version: prevent save-scumming ──
-- Rejects saves with version <= existing version (no rollback allowed)
CREATE OR REPLACE FUNCTION check_save_version()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.version IS NOT NULL AND NEW.version <= OLD.version THEN
    RAISE EXCEPTION 'Save version must increase (got % <= %)', NEW.version, OLD.version;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS check_save_version_trigger ON game_saves;
CREATE TRIGGER check_save_version_trigger
  BEFORE UPDATE ON game_saves
  FOR EACH ROW EXECUTE FUNCTION check_save_version();
