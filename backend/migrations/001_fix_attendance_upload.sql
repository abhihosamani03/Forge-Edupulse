-- ==========================================
-- Migration 001: Fix Attendance Upload
-- Run this in your Supabase SQL Editor
-- ==========================================

-- 1. Add a default value for the 'id' column so inserts don't require a manual ID.
ALTER TABLE public.attendance_records
  ALTER COLUMN id SET DEFAULT gen_random_uuid()::TEXT;

-- 2. Add a UNIQUE constraint on (student_id, subject_name, date) so the
--    upsert's onConflict clause works correctly.
--    Using IF NOT EXISTS pattern to avoid errors if run multiple times.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'attendance_records_student_subject_date_unique'
  ) THEN
    ALTER TABLE public.attendance_records
      ADD CONSTRAINT attendance_records_student_subject_date_unique
      UNIQUE (student_id, subject_name, date);
  END IF;
END $$;

-- 3. Ensure RLS is enabled on attendance_records
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;

-- 4. Drop existing policies if they exist (so this script is re-runnable)
DROP POLICY IF EXISTS "Allow public read access to attendance_records" ON public.attendance_records;
DROP POLICY IF EXISTS "Allow public insert to attendance_records" ON public.attendance_records;
DROP POLICY IF EXISTS "Allow public update to attendance_records" ON public.attendance_records;

-- 5. Recreate all needed policies
CREATE POLICY "Allow public read access to attendance_records"
  ON public.attendance_records FOR SELECT USING (true);

CREATE POLICY "Allow public insert to attendance_records"
  ON public.attendance_records FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update to attendance_records"
  ON public.attendance_records FOR UPDATE USING (true) WITH CHECK (true);

-- 6. Also ensure profiles table allows inserts (for seed data via SQL editor)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access to profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow public insert to profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow public update to profiles" ON public.profiles;

CREATE POLICY "Allow public read access to profiles"
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Allow public insert to profiles"
  ON public.profiles FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update to profiles"
  ON public.profiles FOR UPDATE USING (true) WITH CHECK (true);
