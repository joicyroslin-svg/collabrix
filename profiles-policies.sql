-- Run in Supabase SQL Editor
-- Purpose: Allow team members to see each other's profiles for team functionality

-- First, let's check if profiles table exists and its structure
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'profiles';

-- Create profiles table if it doesn't exist (with all needed columns)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  full_name text,
  role text DEFAULT 'Member',
  job_role text,
  company text,
  team_code text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on profiles table if not already enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop any existing restrictive policies
DROP POLICY IF EXISTS "profiles_select_all_authenticated" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_anon" ON public.profiles;

-- Policy: Allow all authenticated users to read ALL profiles (needed for team features)
-- This is critical for leaders to see their team members
CREATE POLICY "profiles_select_all_authenticated"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy: Allow users to insert their own profile
CREATE POLICY "profiles_insert_own"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Policy: Allow users to update their own profile
CREATE POLICY "profiles_update_own"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Policy: Allow anonymous to read profiles (for public team view if needed)
CREATE POLICY "profiles_select_anon"
  ON public.profiles
  FOR SELECT
  TO anon
  USING (true);

-- Verify the policies were created
SELECT policyname, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'profiles';

-- Also ensure the company/team_code column exists in profiles
-- Add company column if it doesn't exist
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS company text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS team_code text;

-- Create index on company for faster team lookups (if not exists)
CREATE INDEX IF NOT EXISTS idx_profiles_company ON public.profiles(company);

-- IMPORTANT: Normalize all existing team codes to uppercase to ensure matching works
UPDATE public.profiles SET company = UPPER(TRIM(company)) WHERE company IS NOT NULL;
UPDATE public.profiles SET team_code = UPPER(TRIM(team_code)) WHERE team_code IS NOT NULL;

-- Check current profiles data to verify team codes are stored
-- SELECT id, email, company, job_role, role FROM public.profiles LIMIT 10;

