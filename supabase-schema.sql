-- ====================================================================
-- FitForge Cloud Database Schema (Supabase PostgreSQL)
-- Safe & Idempotent (Can be run multiple times without errors)
-- ====================================================================

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  age INTEGER,
  height NUMERIC,
  weight NUMERIC,
  gender TEXT,
  goal TEXT DEFAULT 'maintain',
  activity_level TEXT DEFAULT 'sedentary',
  diet_preference TEXT DEFAULT 'any',
  tdee NUMERIC DEFAULT 2000,
  target_calories NUMERIC DEFAULT 2000,
  target_protein NUMERIC DEFAULT 150,
  target_carbs NUMERIC DEFAULT 200,
  target_fat NUMERIC DEFAULT 60,
  target_fiber NUMERIC DEFAULT 30,
  target_steps INTEGER DEFAULT 10000,
  start_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Weekly Workout Plans
CREATE TABLE IF NOT EXISTS public.workout_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  workout_name TEXT,
  is_rest_day BOOLEAN DEFAULT FALSE,
  exercises JSONB DEFAULT '[]'::JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, day_of_week)
);

-- 3. Weekly Diet Plans
CREATE TABLE IF NOT EXISTS public.diet_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  meals JSONB DEFAULT '[]'::JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, day_of_week)
);

-- 4. Daily History Logs
CREATE TABLE IF NOT EXISTS public.daily_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  log_date DATE NOT NULL,
  workouts JSONB DEFAULT '[]'::JSONB,
  meals JSONB DEFAULT '[]'::JSONB,
  logged_foods JSONB DEFAULT '[]'::JSONB,
  nutrition JSONB DEFAULT '{"calories":0,"protein":0,"carbs":0,"fat":0,"fiber":0}'::JSONB,
  steps INTEGER DEFAULT 0,
  water INTEGER DEFAULT 0,
  weight NUMERIC,
  notes TEXT,
  day_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  completion_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, log_date)
);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diet_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_logs ENABLE ROW LEVEL SECURITY;

-- Clean up any existing policies first so this script never errors on re-run
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can manage own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own workout plans" ON public.workout_plans;
DROP POLICY IF EXISTS "Users can manage own workout plans" ON public.workout_plans;
DROP POLICY IF EXISTS "Users can view own diet plans" ON public.diet_plans;
DROP POLICY IF EXISTS "Users can manage own diet plans" ON public.diet_plans;
DROP POLICY IF EXISTS "Users can view own daily logs" ON public.daily_logs;
DROP POLICY IF EXISTS "Users can manage own daily logs" ON public.daily_logs;

-- Recreate clean user-scoped policies
CREATE POLICY "Users can manage own profile" ON public.profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users can manage own workout plans" ON public.workout_plans FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own diet plans" ON public.diet_plans FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own daily logs" ON public.daily_logs FOR ALL USING (auth.uid() = user_id);

-- 5. Gym Partner Shared Diets Table (Public Exchange for 6-character partner PINs)
CREATE TABLE IF NOT EXISTS public.shared_diets (
  code TEXT PRIMARY KEY,
  owner_name TEXT,
  owner_gender TEXT,
  owner_calories NUMERIC,
  plan_data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.shared_diets ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view shared diets" ON public.shared_diets;
DROP POLICY IF EXISTS "Public can insert shared diets" ON public.shared_diets;
CREATE POLICY "Public can view shared diets" ON public.shared_diets FOR SELECT USING (true);
CREATE POLICY "Public can insert shared diets" ON public.shared_diets FOR ALL USING (true);

