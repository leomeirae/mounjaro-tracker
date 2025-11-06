# QA Documentation - Migration 010

This directory contains comprehensive QA documentation for deploying and verifying database migration 010 (Onboarding Enhancements).

## Files in This Directory

### 1. `migration-verification.md` (21KB, 789 lines)
**Purpose:** Complete deployment and verification guide

**Contents:**
- Migration overview and changes summary
- Deployment instructions (CLI and Dashboard methods)
- 6-step verification checklist with SQL queries
- Test data seeding examples
- Constraint testing procedures
- Performance validation
- Rollback instructions
- Troubleshooting guide
- Production deployment notes

**Use Case:** Primary reference document for database administrators and engineers deploying this migration. Contains all context, instructions, and verification steps in one place.

---

### 2. `migration-010-quick-reference.sql` (6.6KB, 194 lines)
**Purpose:** Copy-pasteable verification queries

**Contents:**
- All 7 verification queries in executable SQL format
- Expected output descriptions
- Checklist summary
- Constraint validation tests (commented)

**Use Case:** Quick verification after migration deployment. Copy and paste into SQL editor to run all checks at once.

**Workflow:**
```bash
# Option 1: Run via Supabase CLI
supabase db push
psql $DATABASE_URL -f docs/QA/migration-010-quick-reference.sql

# Option 2: Copy into SQL Editor
# Open file, copy all content, paste into Supabase Dashboard SQL Editor
```

---

### 3. `migration-010-seed-data.sql` (15KB, 476 lines)
**Purpose:** Comprehensive test data seeding

**Contents:**
- 4 test user profiles covering different scenarios:
  - User 1: Complete onboarding, weekly pen, metric units
  - User 2: Incomplete onboarding (testing defaults)
  - User 3: Biweekly syringe, imperial units
  - User 4: Monthly pen (edge case frequency)
- Weight tracking history for each user
- Injection/application records
- Settings with different unit preferences
- Verification queries for test data
- Optional cleanup script

**Use Case:** Creating realistic test data in staging/development environments to test the new onboarding flow and unit preferences.

**Important:** Replace placeholder UUIDs with actual auth user IDs before running!

---

## Quick Start Guide

### For Production Deployment

1. **Pre-deployment:**
   - Read `migration-verification.md` sections: Overview, Deployment Instructions
   - Create database backup
   - Review Migration Success Checklist

2. **Deploy:**
   ```bash
   # Recommended: Supabase CLI
   supabase db push

   # Alternative: Use Dashboard SQL Editor
   # Copy contents of supabase/migrations/010_onboarding_enhancements.sql
   ```

3. **Verify:**
   ```bash
   # Run all verification queries
   psql $DATABASE_URL -f docs/QA/migration-010-quick-reference.sql
   ```

4. **Post-deployment:**
   - Complete Migration Success Checklist in `migration-verification.md`
   - Monitor error logs for 30 minutes
   - Test onboarding flow in mobile app

---

### For Staging/Development

1. **Deploy migration:**
   ```bash
   supabase db reset  # Fresh start
   # or
   supabase db push   # Apply new migrations
   ```

2. **Seed test data:**
   - Edit `migration-010-seed-data.sql`
   - Replace placeholder UUIDs with real auth user IDs
   - Run the seed script:
   ```bash
   psql $DATABASE_URL -f docs/QA/migration-010-seed-data.sql
   ```

3. **Test the app:**
   - Test onboarding with User 2 (incomplete profile)
   - Test weight tracking with Users 1, 3, 4
   - Test unit conversion (kg ↔ lb, cm ↔ ft)
   - Test different injection frequencies

---

## Migration 010 Summary

### Database Changes

**profiles table** (5 new columns):
- `onboarding_completed` - BOOLEAN, default FALSE
- `treatment_start_date` - TIMESTAMPTZ
- `device_type` - TEXT with CHECK constraint ('pen', 'syringe')
- `frequency` - TEXT with CHECK constraint ('weekly', 'biweekly', 'monthly')
- `current_weight` - NUMERIC(5, 2)

**settings table** (2 new columns):
- `weight_unit` - TEXT, default 'kg', CHECK constraint ('kg', 'lb')
- `height_unit` - TEXT, default 'cm', CHECK constraint ('cm', 'ft')

**Performance:**
- New index: `idx_profiles_onboarding_completed`

**Safety:**
- All columns use `IF NOT EXISTS` (idempotent)
- Check constraints prevent invalid data
- RLS policies remain intact
- Backwards compatible (all new columns nullable or have defaults)

---

## Verification Checklist

Use this quick checklist after deployment:

- [ ] Migration applied successfully (no errors)
- [ ] All 7 columns created (5 profiles + 2 settings)
- [ ] All 4 check constraints created and working
- [ ] Index `idx_profiles_onboarding_completed` created
- [ ] 6 column comments added
- [ ] RLS still enabled on both tables
- [ ] Existing data integrity confirmed
- [ ] Index being used in query plans
- [ ] Application can read/write new fields
- [ ] No errors in logs

---

## Rollback Plan

If migration must be rolled back:

```sql
-- See migration-verification.md "Rollback Instructions" section
-- WARNING: Data loss will occur!

BEGIN;

DROP INDEX IF EXISTS public.idx_profiles_onboarding_completed;

ALTER TABLE public.profiles
DROP COLUMN IF EXISTS onboarding_completed,
DROP COLUMN IF EXISTS treatment_start_date,
DROP COLUMN IF EXISTS device_type,
DROP COLUMN IF EXISTS frequency,
DROP COLUMN IF EXISTS current_weight;

ALTER TABLE public.settings
DROP COLUMN IF EXISTS weight_unit,
DROP COLUMN IF EXISTS height_unit;

COMMIT;
```

**Always backup before rollback!**

---

## Related Documentation

- **Migration file:** `/supabase/migrations/010_onboarding_enhancements.sql`
- **Product requirements:** `/docs/PRODUCT-REQUIREMENTS-DOCUMENT.md`
- **Schema documentation:** `/supabase/migrations/001_initial_schema.sql`
- **Onboarding components:** `/src/components/onboarding/`

---

## Common Issues & Solutions

### Issue: "Column already exists"
**Solution:** Migration uses `IF NOT EXISTS`, safe to re-run. Check verification queries to see which columns exist.

### Issue: Check constraint violation
**Solution:** Use only valid values:
- device_type: 'pen' or 'syringe'
- frequency: 'weekly', 'biweekly', or 'monthly'
- weight_unit: 'kg' or 'lb'
- height_unit: 'cm' or 'ft'

### Issue: RLS blocking access
**Solution:** RLS policies unchanged. If blocked, check previous migrations (007_fix_settings_rls_for_clerk.sql).

### Issue: Index not used
**Solution:** Run `ANALYZE public.profiles;` to update statistics.

---

## Support

For issues with this migration:
1. Check troubleshooting section in `migration-verification.md`
2. Review verification queries to identify specific failure
3. Check Supabase logs: `supabase db logs`
4. Verify auth integration with Clerk is working

---

## Document Versions

- **migration-verification.md:** v1.0 (2025-11-05)
- **migration-010-quick-reference.sql:** v1.0 (2025-11-05)
- **migration-010-seed-data.sql:** v1.0 (2025-11-05)
- **README.md:** v1.0 (2025-11-05)

Last updated: 2025-11-05
