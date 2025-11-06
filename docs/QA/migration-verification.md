# Migration 010: Onboarding Enhancements - Verification Guide

**Migration File:** `supabase/migrations/010_onboarding_enhancements.sql`
**Date:** 2025-11-05
**Author:** System
**Status:** Ready for Deployment

---

## Overview

This migration adds essential fields to support the enhanced onboarding flow in the Mounjaro Tracker app. It introduces:

### Changes to `profiles` table:
- `onboarding_completed` (BOOLEAN) - Tracks onboarding completion status
- `treatment_start_date` (TIMESTAMPTZ) - When user started GLP-1 treatment
- `device_type` (TEXT) - Injection device type: 'pen' or 'syringe'
- `frequency` (TEXT) - Injection frequency: 'weekly', 'biweekly', or 'monthly'
- `current_weight` (NUMERIC) - Current weight tracking separate from start weight

### Changes to `settings` table:
- `weight_unit` (TEXT) - Preferred weight unit: 'kg' or 'lb' (default: 'kg')
- `height_unit` (TEXT) - Preferred height unit: 'cm' or 'ft' (default: 'cm')

### Performance Improvements:
- Index on `profiles.onboarding_completed` for faster queries

---

## Deployment Instructions

### Option A: Supabase CLI (Recommended)

**Prerequisites:**
- Supabase CLI installed (`npm install -g supabase`)
- Linked to your Supabase project (`supabase link`)
- Database connection configured

**Steps:**

1. **Review the migration:**
   ```bash
   cat supabase/migrations/010_onboarding_enhancements.sql
   ```

2. **Apply the migration:**
   ```bash
   supabase db push
   ```

3. **Verify the push:**
   ```bash
   supabase db status
   ```

**Expected Output:**
```
Local database is up to date.
Remote database is up to date.
```

---

### Option B: Supabase Dashboard (SQL Editor)

**Steps:**

1. Navigate to your Supabase project dashboard
2. Go to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste the entire contents of `010_onboarding_enhancements.sql`
5. Click **Run** or press `Cmd+Enter` (Mac) / `Ctrl+Enter` (Windows)
6. Verify "Success. No rows returned" message

**Important Notes:**
- This method does NOT track migration history automatically
- You must manually record this migration was applied
- Consider adding a manual entry to `supabase_migrations` table:

```sql
-- Optional: Record migration manually
INSERT INTO supabase_migrations (name, hash, executed_at)
VALUES ('010_onboarding_enhancements', '010', NOW());
```

---

## Verification Checklist

### Step 1: Verify Column Existence and Types

Run this comprehensive verification query:

```sql
-- Verify all new columns exist with correct types
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
```

**Expected Output:**

| table_name | column_name | data_type | is_nullable | column_default |
|------------|-------------|-----------|-------------|----------------|
| profiles | current_weight | numeric | YES | NULL |
| profiles | device_type | text | YES | NULL |
| profiles | frequency | text | YES | NULL |
| profiles | onboarding_completed | boolean | YES | false |
| profiles | treatment_start_date | timestamp with time zone | YES | NULL |
| settings | height_unit | text | YES | 'cm'::text |
| settings | weight_unit | text | YES | 'kg'::text |

**Validation Points:**
- [ ] All 7 columns exist
- [ ] `onboarding_completed` is BOOLEAN with default FALSE
- [ ] `treatment_start_date` is TIMESTAMPTZ
- [ ] `device_type` is TEXT
- [ ] `frequency` is TEXT
- [ ] `current_weight` is NUMERIC
- [ ] `weight_unit` is TEXT with default 'kg'
- [ ] `height_unit` is TEXT with default 'cm'

---

### Step 2: Verify Check Constraints

```sql
-- Verify check constraints exist
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
```

**Expected Output (Format may vary by Postgres version):**

| table_name | constraint_name | check_clause |
|------------|-----------------|--------------|
| profiles | profiles_device_type_check | (device_type = ANY (ARRAY['pen'::text, 'syringe'::text])) |
| profiles | profiles_frequency_check | (frequency = ANY (ARRAY['weekly'::text, 'biweekly'::text, 'monthly'::text])) |
| settings | settings_weight_unit_check | (weight_unit = ANY (ARRAY['kg'::text, 'lb'::text])) |
| settings | settings_height_unit_check | (height_unit = ANY (ARRAY['cm'::text, 'ft'::text])) |

**Validation Points:**
- [ ] `device_type` constraint allows only 'pen' or 'syringe'
- [ ] `frequency` constraint allows only 'weekly', 'biweekly', or 'monthly'
- [ ] `weight_unit` constraint allows only 'kg' or 'lb'
- [ ] `height_unit` constraint allows only 'cm' or 'ft'

---

### Step 3: Verify Index Creation

```sql
-- Verify the new index exists
SELECT
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename = 'profiles'
  AND indexname = 'idx_profiles_onboarding_completed';
```

**Expected Output:**

| schemaname | tablename | indexname | indexdef |
|------------|-----------|-----------|----------|
| public | profiles | idx_profiles_onboarding_completed | CREATE INDEX idx_profiles_onboarding_completed ON public.profiles USING btree (onboarding_completed) |

**Validation Points:**
- [ ] Index `idx_profiles_onboarding_completed` exists
- [ ] Index is on `profiles` table
- [ ] Index uses `onboarding_completed` column

---

### Step 4: Verify Column Comments

```sql
-- Verify documentation comments
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
```

**Expected Output:**

| table_name | column_name | column_comment |
|------------|-------------|----------------|
| profiles | device_type | Type of injection device: pen or syringe |
| profiles | frequency | Injection frequency: weekly, biweekly, or monthly |
| profiles | onboarding_completed | Flag indicating whether user has completed the onboarding flow |
| profiles | treatment_start_date | Date when user started GLP-1 treatment |
| settings | height_unit | Preferred unit for height display: cm or ft |
| settings | weight_unit | Preferred unit for weight display: kg or lb |

**Validation Points:**
- [ ] All 6 columns have documentation comments
- [ ] Comments accurately describe the column purpose

---

### Step 5: Verify RLS Policies (No Changes Expected)

```sql
-- Verify RLS is still enabled
SELECT
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('profiles', 'settings');
```

**Expected Output:**

| schemaname | tablename | rowsecurity |
|------------|-----------|-------------|
| public | profiles | true |
| public | settings | true |

**Validation Points:**
- [ ] RLS is enabled on `profiles` table
- [ ] RLS is enabled on `settings` table

```sql
-- Verify existing RLS policies remain intact
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
```

**Expected Policies Count:**
- **profiles**: Should have INSERT, SELECT, UPDATE policies (3 total)
- **settings**: Should have existing policies intact

**Validation Points:**
- [ ] No policies were dropped or modified
- [ ] All existing policies still function correctly

---

### Step 6: Test Data Integrity

```sql
-- Test that existing data is unaffected
SELECT
  COUNT(*) as total_profiles,
  COUNT(name) as profiles_with_name,
  COUNT(email) as profiles_with_email,
  COUNT(onboarding_completed) as profiles_with_onboarding_flag
FROM public.profiles;
```

**Expected Behavior:**
- `total_profiles` = `profiles_with_onboarding_flag` (all profiles get default FALSE)
- Existing profile data remains intact
- No NULL values in required fields

**Validation Points:**
- [ ] Row count matches pre-migration count
- [ ] All existing NOT NULL constraints still satisfied
- [ ] New nullable columns default correctly

---

## Test Data Seeding

Use these SQL statements to create comprehensive test data:

### Create Test User Profile

```sql
-- Insert test user (replace UUID with actual auth user ID)
INSERT INTO public.profiles (
  id,
  name,
  email,
  height,
  start_weight,
  target_weight,
  current_weight,
  medication,
  current_dose,
  frequency,
  onboarding_completed,
  treatment_start_date,
  device_type,
  created_at,
  updated_at
) VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', -- Replace with real UUID
  'Test User',
  'test@example.com',
  175.00,
  95.50,
  80.00,
  92.30,
  'Mounjaro',
  2.5,
  'weekly',
  true,
  '2024-10-01 00:00:00+00',
  'pen',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  onboarding_completed = EXCLUDED.onboarding_completed,
  treatment_start_date = EXCLUDED.treatment_start_date,
  device_type = EXCLUDED.device_type,
  current_weight = EXCLUDED.current_weight;
```

### Create Test Settings

```sql
-- Insert test settings
INSERT INTO public.settings (
  id,
  user_id,
  theme,
  accent_color,
  dark_mode,
  weight_unit,
  height_unit,
  shot_reminder,
  shot_reminder_time,
  weight_reminder,
  weight_reminder_time,
  achievements_notifications,
  created_at,
  updated_at
) VALUES (
  'b1ffcd99-9c0b-4ef8-bb6d-6bb9bd380a22', -- Replace with real UUID
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', -- Must match profile id
  'classic',
  '#0891B2',
  false,
  'kg',
  'cm',
  true,
  '09:00:00',
  true,
  '08:00:00',
  true,
  NOW(),
  NOW()
)
ON CONFLICT (user_id) DO UPDATE SET
  weight_unit = EXCLUDED.weight_unit,
  height_unit = EXCLUDED.height_unit;
```

### Create Test Weight Entries

```sql
-- Insert sample weight entries
INSERT INTO public.weights (id, user_id, date, weight, notes, created_at)
VALUES
  (uuid_generate_v4(), 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '2024-10-01', 95.50, 'Starting weight', NOW()),
  (uuid_generate_v4(), 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '2024-10-08', 94.80, 'Week 1', NOW()),
  (uuid_generate_v4(), 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '2024-10-15', 94.20, 'Week 2', NOW()),
  (uuid_generate_v4(), 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '2024-10-22', 93.50, 'Week 3', NOW()),
  (uuid_generate_v4(), 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '2024-10-29', 92.80, 'Week 4', NOW()),
  (uuid_generate_v4(), 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '2024-11-05', 92.30, 'Current', NOW());
```

### Create Test Application/Injection Entries

```sql
-- Insert sample injection records
INSERT INTO public.applications (id, user_id, date, dosage, injection_sites, side_effects, notes, created_at)
VALUES
  (uuid_generate_v4(), 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '2024-10-01', 2.5, ARRAY['abdomen'], ARRAY['mild nausea'], 'First dose', NOW()),
  (uuid_generate_v4(), 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '2024-10-08', 2.5, ARRAY['thigh'], ARRAY[], 'Week 2 dose', NOW()),
  (uuid_generate_v4(), 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '2024-10-15', 2.5, ARRAY['abdomen'], ARRAY['mild fatigue'], 'Week 3 dose', NOW()),
  (uuid_generate_v4(), 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '2024-10-22', 2.5, ARRAY['arm'], ARRAY[], 'Week 4 dose', NOW()),
  (uuid_generate_v4(), 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '2024-10-29', 2.5, ARRAY['thigh'], ARRAY[], 'Week 5 dose', NOW());
```

---

## Constraint Testing

Test that the check constraints work correctly:

### Test Valid Values

```sql
-- These should succeed
UPDATE public.profiles
SET device_type = 'pen'
WHERE id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';

UPDATE public.profiles
SET frequency = 'weekly'
WHERE id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';

UPDATE public.settings
SET weight_unit = 'lb', height_unit = 'ft'
WHERE user_id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
```

**Expected:** All 3 updates succeed with "UPDATE 1" message.

### Test Invalid Values (Should Fail)

```sql
-- These should fail with constraint violations

-- Invalid device type
UPDATE public.profiles
SET device_type = 'needle'
WHERE id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
-- Expected error: new row violates check constraint "profiles_device_type_check"

-- Invalid frequency
UPDATE public.profiles
SET frequency = 'daily'
WHERE id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
-- Expected error: new row violates check constraint "profiles_frequency_check"

-- Invalid weight unit
UPDATE public.settings
SET weight_unit = 'lbs'
WHERE user_id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
-- Expected error: new row violates check constraint "settings_weight_unit_check"

-- Invalid height unit
UPDATE public.settings
SET height_unit = 'inches'
WHERE user_id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
-- Expected error: new row violates check constraint "settings_height_unit_check"
```

**Validation Points:**
- [ ] Valid values are accepted
- [ ] Invalid values are rejected with clear error messages
- [ ] Constraint names are descriptive

---

## Performance Validation

### Test Index Usage

```sql
-- Query that should use the new index
EXPLAIN ANALYZE
SELECT * FROM public.profiles
WHERE onboarding_completed = false;
```

**Expected Output:**
Look for `Index Scan using idx_profiles_onboarding_completed` in the query plan.

**Example:**
```
Index Scan using idx_profiles_onboarding_completed on profiles (cost=0.15..8.17 rows=1 width=...)
  Index Cond: (onboarding_completed = false)
  Planning Time: 0.123 ms
  Execution Time: 0.045 ms
```

**Validation Points:**
- [ ] Query uses the new index
- [ ] Execution time is < 10ms for typical datasets
- [ ] No sequential scan on profiles table

---

## Rollback Instructions

If you need to rollback this migration, execute the following SQL:

```sql
-- WARNING: This will permanently delete data in these columns
-- Backup your data before running this!

BEGIN;

-- Drop the index
DROP INDEX IF EXISTS public.idx_profiles_onboarding_completed;

-- Drop columns from profiles table
ALTER TABLE public.profiles
DROP COLUMN IF EXISTS onboarding_completed,
DROP COLUMN IF EXISTS treatment_start_date,
DROP COLUMN IF EXISTS device_type,
DROP COLUMN IF EXISTS frequency,
DROP COLUMN IF EXISTS current_weight;

-- Drop columns from settings table
ALTER TABLE public.settings
DROP COLUMN IF EXISTS weight_unit,
DROP COLUMN IF EXISTS height_unit;

-- If everything looks good, commit
COMMIT;

-- If something went wrong, rollback
-- ROLLBACK;
```

**Important Rollback Notes:**
- This is a **destructive operation** - data in these columns will be lost
- Always backup before rolling back
- Test rollback in a staging environment first
- Consider exporting data before rollback if you might need it later:

```sql
-- Backup new column data before rollback
CREATE TABLE profiles_backup_20251105 AS
SELECT
  id,
  onboarding_completed,
  treatment_start_date,
  device_type,
  frequency,
  current_weight
FROM public.profiles;

CREATE TABLE settings_backup_20251105 AS
SELECT
  id,
  user_id,
  weight_unit,
  height_unit
FROM public.settings;
```

---

## Migration Success Checklist

Use this checklist to confirm successful deployment:

### Pre-Deployment
- [ ] Reviewed migration SQL for syntax errors
- [ ] Confirmed migration file is version controlled
- [ ] Notified team of deployment window
- [ ] Backed up production database (if applicable)

### Deployment
- [ ] Migration applied successfully (no errors)
- [ ] All 7 columns created
- [ ] All 4 check constraints created
- [ ] Index created successfully
- [ ] Column comments added
- [ ] No existing data corrupted

### Verification (Run all queries above)
- [ ] Column existence verified (Step 1)
- [ ] Check constraints verified (Step 2)
- [ ] Index verified (Step 3)
- [ ] Column comments verified (Step 4)
- [ ] RLS policies intact (Step 5)
- [ ] Data integrity confirmed (Step 6)
- [ ] Constraint testing passed
- [ ] Performance validation passed

### Post-Deployment
- [ ] Test data seeded (if needed)
- [ ] Application tested against new schema
- [ ] Mobile app can read/write new fields
- [ ] Onboarding flow works end-to-end
- [ ] No errors in application logs
- [ ] Monitoring shows normal operation

### Documentation
- [ ] Migration recorded in changelog
- [ ] Team notified of completion
- [ ] This verification document completed
- [ ] Any issues documented and resolved

---

## Troubleshooting

### Issue: Migration Fails with "Column already exists"

**Cause:** Migration was partially applied or run multiple times.

**Solution:**
```sql
-- Check which columns exist
SELECT column_name
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'profiles'
  AND column_name IN ('onboarding_completed', 'treatment_start_date', 'device_type', 'frequency', 'current_weight');
```

The migration uses `ADD COLUMN IF NOT EXISTS` so it should be safe to re-run. If issues persist, manually add missing columns.

---

### Issue: Check Constraint Violation on Existing Data

**Cause:** Existing data in `frequency` column doesn't match new constraint values.

**Solution:**
```sql
-- Find problematic rows
SELECT id, frequency
FROM public.profiles
WHERE frequency IS NOT NULL
  AND frequency NOT IN ('weekly', 'biweekly', 'monthly');

-- Fix or nullify invalid values
UPDATE public.profiles
SET frequency = NULL
WHERE frequency IS NOT NULL
  AND frequency NOT IN ('weekly', 'biweekly', 'monthly');
```

---

### Issue: RLS Policy Prevents Access

**Cause:** RLS policies are too restrictive after migration.

**Solution:**
```sql
-- Test if RLS is blocking access
SET ROLE authenticated;
SELECT * FROM public.profiles WHERE id = auth.uid();
RESET ROLE;

-- If blocked, verify policies
SELECT * FROM pg_policies WHERE tablename = 'profiles';
```

RLS policies should be unchanged by this migration. Check previous migrations if policies are missing.

---

### Issue: Index Not Being Used

**Cause:** Statistics not updated or too few rows.

**Solution:**
```sql
-- Analyze the table to update statistics
ANALYZE public.profiles;

-- Rebuild the index if needed
REINDEX INDEX idx_profiles_onboarding_completed;

-- Force index usage for testing
SET enable_seqscan = off;
EXPLAIN SELECT * FROM public.profiles WHERE onboarding_completed = false;
SET enable_seqscan = on;
```

---

### Issue: Default Values Not Applied to Existing Rows

**Cause:** `DEFAULT` only applies to new rows, not existing ones.

**Solution:**
```sql
-- Apply default to existing rows
UPDATE public.profiles
SET onboarding_completed = false
WHERE onboarding_completed IS NULL;

UPDATE public.settings
SET weight_unit = 'kg'
WHERE weight_unit IS NULL;

UPDATE public.settings
SET height_unit = 'cm'
WHERE height_unit IS NULL;
```

---

## Related Migrations

This migration builds upon:
- `001_initial_schema.sql` - Created base `profiles` and `settings` tables
- `007_fix_settings_rls_for_clerk.sql` - Updated RLS policies for Clerk auth

Future migrations may:
- Add additional onboarding steps
- Introduce more unit preferences
- Add validation for treatment_start_date (not in future)

---

## Production Deployment Notes

### Recommended Deployment Time
- **Low traffic period** (typically early morning or late evening)
- **Maintenance window** if available
- **Not during peak usage** (avoid weekday mornings/evenings)

### Deployment Checklist
1. Announce maintenance window to users (if needed)
2. Create full database backup
3. Apply migration in staging environment first
4. Run full verification suite in staging
5. Deploy mobile app update simultaneously
6. Apply migration in production
7. Run verification queries immediately
8. Monitor error logs for 30 minutes
9. Test critical user flows (signup, onboarding)
10. Confirm all systems operational

### Monitoring Post-Deployment
Monitor these metrics for 24-48 hours:
- Query performance on `profiles` table
- Error rates in application logs
- User complaints about onboarding
- Database CPU/memory usage
- RLS policy evaluation time

---

## Contact

For issues or questions about this migration:
- Review the PRD: `docs/PRODUCT-REQUIREMENTS-DOCUMENT.md`
- Check related code: `src/components/onboarding/`
- Database schema: `supabase/migrations/`

---

**Document Version:** 1.0
**Last Updated:** 2025-11-05
**Next Review:** After production deployment
