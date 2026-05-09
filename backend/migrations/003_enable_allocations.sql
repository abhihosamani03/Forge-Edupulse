-- ==========================================
-- Migration 003: Enable Allocations
-- Run this in Supabase SQL Editor
-- ==========================================

-- 1. Auto-generate IDs for allocations
ALTER TABLE public.allocations
  ALTER COLUMN id SET DEFAULT gen_random_uuid()::TEXT;

-- 2. Ensure RLS is enabled
ALTER TABLE public.allocations ENABLE ROW LEVEL SECURITY;

-- 3. Drop and recreate policies (idempotent)
DROP POLICY IF EXISTS "Allow public read access to allocations" ON public.allocations;
DROP POLICY IF EXISTS "Allow public insert to allocations" ON public.allocations;
DROP POLICY IF EXISTS "Allow public update to allocations" ON public.allocations;
DROP POLICY IF EXISTS "Allow public delete from allocations" ON public.allocations;

CREATE POLICY "Allow public read access to allocations"
  ON public.allocations FOR SELECT USING (true);
CREATE POLICY "Allow public insert to allocations"
  ON public.allocations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update to allocations"
  ON public.allocations FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow public delete from allocations"
  ON public.allocations FOR DELETE USING (true);
