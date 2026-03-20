-- ═══════════════════════════════════════════════════════════════
-- PRIMER Security Hardening Migration
-- Run this AFTER 001_initial_schema.sql
-- Addresses: Anti-cheat, Shadowban, Score validation
-- ═══════════════════════════════════════════════════════════════

-- ── 1. CHECK Constraints: The Iron Wall ──
-- Prevents impossible values even if client is hacked via DevTools/Postman

-- Leaderboard score sanity (max ~50K reasonable for 365 days play)
ALTER TABLE leaderboard
ADD CONSTRAINT sanity_check_score CHECK (score >= 0 AND score <= 100000);

ALTER TABLE leaderboard
ADD CONSTRAINT sanity_check_day CHECK (day_reached >= 1 AND day_reached <= 400);

ALTER TABLE leaderboard
ADD CONSTRAINT sanity_check_reputation CHECK (reputation >= 0 AND reputation <= 200);

-- ── 2. Shadowban System ──
-- Cheaters see themselves on leaderboard, but nobody else does
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS is_cheater boolean DEFAULT false;

-- ── 3. Update Leaderboard RLS to Filter Cheaters ──
-- Drop and recreate the read policy to exclude cheaters
DROP POLICY IF EXISTS "Authenticated users can read leaderboard" ON leaderboard;

CREATE POLICY "Authenticated users can read leaderboard (no cheaters)"
ON leaderboard FOR SELECT
USING (
    auth.role() = 'authenticated' AND (
        -- Users always see their OWN entry (so cheaters think they're visible)
        auth.uid() = user_id
        OR
        -- But others only see non-cheaters
        NOT EXISTS (
            SELECT 1 FROM profiles p 
            WHERE p.id = leaderboard.user_id AND p.is_cheater = true
        )
    )
);

-- ── 4. Rate-limit game_saves updates via function ──
-- Max 1 save per 10 seconds per user (prevents save-spam)
CREATE OR REPLACE FUNCTION check_save_rate_limit()
RETURNS TRIGGER AS $$
DECLARE
    last_save timestamptz;
BEGIN
    SELECT updated_at INTO last_save
    FROM game_saves
    WHERE user_id = NEW.user_id AND slot_id = NEW.slot_id;
    
    IF last_save IS NOT NULL AND (NOW() - last_save) < interval '10 seconds' THEN
        RAISE EXCEPTION 'Save rate limit: wait 10 seconds between saves';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Only apply rate limit on UPDATE (not INSERT for first save)
DROP TRIGGER IF EXISTS enforce_save_rate_limit ON game_saves;
CREATE TRIGGER enforce_save_rate_limit
    BEFORE UPDATE ON game_saves
    FOR EACH ROW EXECUTE FUNCTION check_save_rate_limit();

-- ── 5. Analytics insert limit (max 50 events per batch) ──
-- Prevents flooding the analytics table
CREATE OR REPLACE FUNCTION check_analytics_batch_size()
RETURNS TRIGGER AS $$
DECLARE
    recent_count integer;
BEGIN
    SELECT COUNT(*) INTO recent_count
    FROM analytics
    WHERE user_id = NEW.user_id AND created_at > NOW() - interval '1 minute';
    
    IF recent_count > 100 THEN
        RAISE EXCEPTION 'Analytics rate limit exceeded';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS enforce_analytics_rate ON analytics;
CREATE TRIGGER enforce_analytics_rate
    BEFORE INSERT ON analytics
    FOR EACH ROW EXECUTE FUNCTION check_analytics_batch_size();
