-- ==========================================
-- Cleanup: Remove bad attendance records
-- Run this in Supabase SQL Editor BEFORE re-uploading
-- ==========================================

-- Option 1: Delete ALL attendance records (recommended if everything is gibberish)
DELETE FROM public.attendance_records;

-- Option 2: If you only want to delete records for a specific subject, use this instead:
-- DELETE FROM public.attendance_records WHERE subject_name = 'Data Engineering and AI';

-- Verify the cleanup
SELECT COUNT(*) as remaining_records FROM public.attendance_records;
