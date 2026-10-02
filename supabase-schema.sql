-- ====================================================================
-- FitForge Cloud Database Schema (Supabase PostgreSQL)
-- Run this script in your Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql
-- ====================================================================

-- 1. Profiles Table (Stores user stats, TDEE, and macro targets)
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

-- 2. Weekly Workout Routines (Stores scheduled exercises for each day 0-6)
CREATE TABLE IF NOT EXISTS public.workout_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  workout_name TEXT,
  is_rest_day BOOLEAN DEFAULT FALSE,
  exercises JSONB DEFAULT '[]'::JSONB, -- Array of { id, name, sets, reps, weight }
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, day_of_week)
);

-- 3. Weekly Diet Plans (Stores meal slots and planned foods for each day 0-6)
CREATE TABLE IF NOT EXISTS public.diet_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  meals JSONB DEFAULT '[]'::JSONB, -- Array of { id, type, name, time, foods: [...] }
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, day_of_week)
);

-- 4. Daily Activity Logs (Stores historical logs for each date)
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

-- Enable Row Level Security (RLS) on all tables for privacy
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diet_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_logs ENABLE ROW LEVEL SECURITY;

-- Security Policies (Users can only read and write their own data)
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own workout plans" ON public.workout_plans FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own diet plans" ON public.diet_plans FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own daily logs" ON public.daily_logs FOR ALL USING (auth.uid() = user_id);
