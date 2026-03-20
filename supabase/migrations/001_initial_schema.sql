-- ============================================================
-- PRIMER Game: Supabase Database Schema
-- Target: 50 mahasiswa concurrent, Juni 2026
-- ============================================================

-- 1. User profiles (extends Supabase Auth)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  nim TEXT UNIQUE NOT NULL,
  nama TEXT NOT NULL,
  angkatan INTEGER,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'dosen', 'admin')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Cloud saves (sync game state across devices)
CREATE TABLE game_saves (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  slot_id TEXT NOT NULL DEFAULT 'default',
  game_state JSONB NOT NULL,
  day INTEGER DEFAULT 1,
  score INTEGER DEFAULT 0,
  version INTEGER DEFAULT 1,
  saved_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, slot_id)
);

-- 3. Leaderboard (real-time ranking)
CREATE TABLE leaderboard (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  nama TEXT NOT NULL,
  nim TEXT NOT NULL,
  score INTEGER DEFAULT 0,
  day_reached INTEGER DEFAULT 1,
  reputation INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  accreditation TEXT DEFAULT 'Dasar',
  patients_treated INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Analytics events (triangulasi dossier)
CREATE TABLE analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  session_id TEXT,
  event_type TEXT NOT NULL,
  event_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Dynamic content (update cases without redeploying)
CREATE TABLE content (
  id TEXT PRIMARY KEY,
  content_type TEXT NOT NULL,
  data JSONB NOT NULL,
  version INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Indexes for performance
-- ============================================================
CREATE INDEX idx_game_saves_user ON game_saves(user_id);
CREATE INDEX idx_leaderboard_score ON leaderboard(score DESC);
CREATE INDEX idx_analytics_user ON analytics(user_id);
CREATE INDEX idx_analytics_type ON analytics(event_type);
CREATE INDEX idx_analytics_session ON analytics(session_id);
CREATE INDEX idx_content_type ON content(content_type);

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_saves ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE content ENABLE ROW LEVEL SECURITY;

-- Profiles: users read/update own, dosen reads all
CREATE POLICY "Users read own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Dosen reads all profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'dosen'
    )
  );

-- Game Saves: users manage own saves
CREATE POLICY "Users manage own saves"
  ON game_saves FOR ALL
  USING (auth.uid() = user_id);

-- Dosen can read all saves (for monitoring)
CREATE POLICY "Dosen reads all saves"
  ON game_saves FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'dosen'
    )
  );

-- Leaderboard: everyone reads, users update own
CREATE POLICY "Everyone reads leaderboard"
  ON leaderboard FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users manage own leaderboard"
  ON leaderboard FOR ALL
  USING (auth.uid() = user_id);

-- Analytics: users insert own, dosen reads all
CREATE POLICY "Users insert own analytics"
  ON analytics FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Dosen reads all analytics"
  ON analytics FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'dosen'
    )
  );

-- Content: authenticated users can read
CREATE POLICY "Authenticated reads content"
  ON content FOR SELECT
  TO authenticated
  USING (is_active = true);

-- ============================================================
-- Auto-create profile on signup (trigger)
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, nim, nama, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'nim',
    NEW.raw_user_meta_data->>'nama',
    COALESCE(NEW.raw_user_meta_data->>'role', 'student')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- Auto-update leaderboard timestamp
-- ============================================================
CREATE OR REPLACE FUNCTION public.update_leaderboard_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_leaderboard_updated_at
  BEFORE UPDATE ON leaderboard
  FOR EACH ROW EXECUTE FUNCTION public.update_leaderboard_timestamp();
