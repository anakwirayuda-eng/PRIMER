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
