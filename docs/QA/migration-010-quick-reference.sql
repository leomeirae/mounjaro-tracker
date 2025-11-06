-- ============================================================================
-- Migration 010: Onboarding Enhancements - Quick Reference
-- ============================================================================
-- This file contains all verification queries in a single, copy-pasteable format
-- Run these queries in order after applying the migration
-- ============================================================================

-- ============================================================================
-- STEP 1: VERIFY COLUMN EXISTENCE AND TYPES
-- ============================================================================

SELECT
  table_name,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN ('profiles', 'settings')
  AND column_name IN (
    'onboarding_completed',
    'treatment_start_date',
    'device_type',
    'frequency',
    'current_weight',
    'weight_unit',
    'height_unit'
  )
ORDER BY table_name, column_name;

-- Expected: 7 rows (5 from profiles, 2 from settings)

-- ============================================================================
-- STEP 2: VERIFY CHECK CONSTRAINTS
-- ============================================================================

SELECT
  tc.table_name,
  tc.constraint_name,
  cc.check_clause
FROM information_schema.table_constraints tc
JOIN information_schema.check_constraints cc
  ON tc.constraint_name = cc.constraint_name
WHERE tc.table_schema = 'public'
  AND tc.table_name IN ('profiles', 'settings')
  AND tc.constraint_type = 'CHECK'
  AND (
    cc.check_clause LIKE '%device_type%'
    OR cc.check_clause LIKE '%frequency%'
    OR cc.check_clause LIKE '%weight_unit%'
    OR cc.check_clause LIKE '%height_unit%'
  );

-- Expected: 4 rows (2 from profiles, 2 from settings)

-- ============================================================================
-- STEP 3: VERIFY INDEX CREATION
-- ============================================================================

SELECT
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename = 'profiles'
  AND indexname = 'idx_profiles_onboarding_completed';

-- Expected: 1 row with index definition

-- ============================================================================
-- STEP 4: VERIFY COLUMN COMMENTS
-- ============================================================================

SELECT
  cols.table_name,
  cols.column_name,
  pg_catalog.col_description(c.oid, cols.ordinal_position::int) as column_comment
FROM information_schema.columns cols
JOIN pg_catalog.pg_class c ON c.relname = cols.table_name
JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
WHERE cols.table_schema = 'public'
  AND cols.table_name IN ('profiles', 'settings')
  AND cols.column_name IN (
    'onboarding_completed',
    'treatment_start_date',
    'device_type',
    'frequency',
    'weight_unit',
    'height_unit'
  )
ORDER BY cols.table_name, cols.column_name;

-- Expected: 6 rows with comments

-- ============================================================================
-- STEP 5: VERIFY RLS IS STILL ENABLED
-- ============================================================================

SELECT
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('profiles', 'settings');

-- Expected: Both tables should show rowsecurity = true

-- Verify policies are intact
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('profiles', 'settings')
ORDER BY tablename, policyname;

-- Expected: All existing policies should be present

-- ============================================================================
-- STEP 6: VERIFY DATA INTEGRITY
-- ============================================================================

SELECT
  COUNT(*) as total_profiles,
  COUNT(name) as profiles_with_name,
  COUNT(email) as profiles_with_email,
  COUNT(onboarding_completed) as profiles_with_onboarding_flag
FROM public.profiles;

-- Expected: total_profiles = profiles_with_onboarding_flag

-- ============================================================================
-- STEP 7: PERFORMANCE CHECK - INDEX USAGE
-- ============================================================================

EXPLAIN ANALYZE
SELECT * FROM public.profiles
WHERE onboarding_completed = false;

-- Expected: Should use "Index Scan using idx_profiles_onboarding_completed"

-- ============================================================================
-- CONSTRAINT VALIDATION TESTS
-- ============================================================================

-- Test 1: Valid device_type values (should succeed)
-- UPDATE public.profiles SET device_type = 'pen' WHERE id = '<your-test-id>';
-- UPDATE public.profiles SET device_type = 'syringe' WHERE id = '<your-test-id>';

-- Test 2: Invalid device_type (should fail)
-- UPDATE public.profiles SET device_type = 'needle' WHERE id = '<your-test-id>';

-- Test 3: Valid frequency values (should succeed)
-- UPDATE public.profiles SET frequency = 'weekly' WHERE id = '<your-test-id>';
-- UPDATE public.profiles SET frequency = 'biweekly' WHERE id = '<your-test-id>';
-- UPDATE public.profiles SET frequency = 'monthly' WHERE id = '<your-test-id>';

-- Test 4: Invalid frequency (should fail)
-- UPDATE public.profiles SET frequency = 'daily' WHERE id = '<your-test-id>';

-- Test 5: Valid weight_unit values (should succeed)
-- UPDATE public.settings SET weight_unit = 'kg' WHERE user_id = '<your-test-id>';
-- UPDATE public.settings SET weight_unit = 'lb' WHERE user_id = '<your-test-id>';

-- Test 6: Invalid weight_unit (should fail)
-- UPDATE public.settings SET weight_unit = 'lbs' WHERE user_id = '<your-test-id>';

-- Test 7: Valid height_unit values (should succeed)
-- UPDATE public.settings SET height_unit = 'cm' WHERE user_id = '<your-test-id>';
-- UPDATE public.settings SET height_unit = 'ft' WHERE user_id = '<your-test-id>';

-- Test 8: Invalid height_unit (should fail)
-- UPDATE public.settings SET height_unit = 'inches' WHERE user_id = '<your-test-id>';

-- ============================================================================
-- END OF VERIFICATION QUERIES
-- ============================================================================

-- Summary:
-- [ ] Step 1: Column existence - 7 columns
-- [ ] Step 2: Check constraints - 4 constraints
-- [ ] Step 3: Index created - 1 index
-- [ ] Step 4: Comments added - 6 comments
-- [ ] Step 5: RLS enabled - 2 tables
-- [ ] Step 6: Data integrity - No corruption
-- [ ] Step 7: Performance - Index used
