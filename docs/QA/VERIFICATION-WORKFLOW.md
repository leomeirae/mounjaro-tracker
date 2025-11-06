# Migration 010: Verification Workflow

## Visual Workflow Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     PRE-DEPLOYMENT PHASE                                 │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    ▼               ▼               ▼
          ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
          │ Read Docs    │ │ Backup DB    │ │ Schedule     │
          │ (verification│ │ (Production  │ │ Maintenance  │
          │  .md)        │ │  only)       │ │ Window       │
          └──────────────┘ └──────────────┘ └──────────────┘
                    │               │               │
                    └───────────────┼───────────────┘
                                    ▼

┌─────────────────────────────────────────────────────────────────────────┐
│                      DEPLOYMENT PHASE                                    │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    ▼                               ▼
          ┌──────────────────┐            ┌──────────────────┐
          │ Option A:        │            │ Option B:        │
          │ Supabase CLI     │     OR     │ Dashboard        │
          │ supabase db push │            │ SQL Editor       │
          └──────────────────┘            └──────────────────┘
                    │                               │
                    └───────────────┬───────────────┘
                                    ▼
                          ┌──────────────────┐
                          │ Migration        │
                          │ Applied          │
                          │ Successfully?    │
                          └──────────────────┘
                                    │
                         ┌──────────┴──────────┐
                         ▼ YES                 ▼ NO
                   ┌──────────┐          ┌──────────────┐
                   │ Continue │          │ Check Errors │
                   │ to       │          │ See          │
                   │ Verify   │          │ Troubleshoot │
                   └──────────┘          │ Section      │
                         │               └──────────────┘
                         ▼

┌─────────────────────────────────────────────────────────────────────────┐
│                    VERIFICATION PHASE (6 Steps)                          │
└─────────────────────────────────────────────────────────────────────────┘
                         │
         ┌───────────────┴───────────────┐
         ▼                               ▼
┌──────────────────┐           ┌──────────────────┐
│ Step 1:          │           │ Step 2:          │
│ Column Existence │──PASS───▶ │ Check            │
│ 7 columns?       │           │ Constraints      │
└──────────────────┘           │ 4 constraints?   │
                               └──────────────────┘
                                        │
                                      PASS
                                        ▼
                               ┌──────────────────┐
                               │ Step 3:          │
                               │ Index Created    │
                               │ 1 index?         │
                               └──────────────────┘
                                        │
                                      PASS
                                        ▼
┌──────────────────┐           ┌──────────────────┐
│ Step 4:          │◀──PASS────│ Step 5:          │
│ Column Comments  │           │ RLS Enabled      │
│ 6 comments?      │           │ Still on?        │
└──────────────────┘           └──────────────────┘
         │
       PASS
         ▼
┌──────────────────┐
│ Step 6:          │
│ Data Integrity   │
│ No corruption?   │
└──────────────────┘
         │
       PASS
         ▼

┌─────────────────────────────────────────────────────────────────────────┐
│                     TESTING PHASE                                        │
└─────────────────────────────────────────────────────────────────────────┘
                         │
         ┌───────────────┼───────────────┐
         ▼               ▼               ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ Seed Test    │ │ Test App     │ │ Constraint   │
│ Data         │ │ Onboarding   │ │ Validation   │
│ (optional)   │ │ Flow         │ │ Tests        │
└──────────────┘ └──────────────┘ └──────────────┘
         │               │               │
         └───────────────┼───────────────┘
                         ▼
                ┌──────────────────┐
                │ All Tests Pass?  │
                └──────────────────┘
                         │
              ┌──────────┴──────────┐
              ▼ YES                 ▼ NO
        ┌──────────┐          ┌──────────────┐
        │ Continue │          │ Debug Issues │
        │ to       │          │ Check Logs   │
        │ Monitor  │          └──────────────┘
        └──────────┘
              │

┌─────────────────────────────────────────────────────────────────────────┐
│                    MONITORING PHASE                                      │
└─────────────────────────────────────────────────────────────────────────┘
              │
     ┌────────┴────────┐
     ▼                 ▼
┌──────────┐      ┌──────────┐
│ Monitor  │      │ Check    │
│ Logs for │      │ App for  │
│ 30 mins  │      │ Errors   │
└──────────┘      └──────────┘
     │                 │
     └────────┬────────┘
              ▼
     ┌──────────────────┐
     │ All Clear?       │
     └──────────────────┘
              │
   ┌──────────┴──────────┐
   ▼ YES                 ▼ NO
┌──────────┐       ┌──────────────┐
│ SUCCESS! │       │ Investigate  │
│ Mark     │       │ Consider     │
│ Complete │       │ Rollback?    │
└──────────┘       └──────────────┘
```

## Workflow Steps Detail

### Phase 1: Pre-Deployment (15-30 minutes)

**Step 1.1: Read Documentation**
- File: `docs/QA/migration-verification.md`
- Sections: Overview, Deployment Instructions, Verification Checklist
- Time: 10-15 minutes

**Step 1.2: Backup Database (Production Only)**
```bash
# Via Supabase Dashboard
# Settings > Database > Backups > Create New Backup

# Or via CLI
supabase db dump -f backup_pre_migration_010.sql
```
- Time: 2-5 minutes
- Verify backup created successfully

**Step 1.3: Schedule Maintenance Window**
- Choose low-traffic period
- Notify team/users if necessary
- Estimated downtime: < 5 minutes for migration
- Time: 5-10 minutes for coordination

---

### Phase 2: Deployment (2-5 minutes)

**Option A: Supabase CLI (Recommended)**
```bash
# Ensure you're in the project directory
cd /Users/user/Desktop/mounjaro-tracker

# Link to project (if not already)
supabase link --project-ref your-project-ref

# Push migration
supabase db push

# Check status
supabase db status
```
- Time: 2-3 minutes
- Automated migration tracking
- Clear error messages

**Option B: Dashboard SQL Editor**
```bash
# 1. Copy migration file contents
cat supabase/migrations/010_onboarding_enhancements.sql

# 2. Navigate to Supabase Dashboard > SQL Editor
# 3. Paste and run
# 4. Verify "Success. No rows returned"
```
- Time: 3-5 minutes
- Manual process
- Must record migration manually

**Error Handling:**
- If errors occur, check `Troubleshooting` section in verification.md
- Common issue: Column already exists (safe to ignore if using CLI)
- Do NOT proceed to verification if errors persist

---

### Phase 3: Verification (5-10 minutes)

**Quick Verification (Recommended)**
```bash
# Run all verification queries at once
psql $DATABASE_URL -f docs/QA/migration-010-quick-reference.sql

# Review output for expected results
```
- Time: 3-5 minutes
- Automated checks
- Clear pass/fail results

**Manual Verification (Alternative)**
- Open `migration-010-quick-reference.sql` in SQL Editor
- Run each query individually
- Compare results with expected output
- Time: 7-10 minutes

**Verification Checklist:**
```
Step 1: Column Existence
  ☐ 7 columns exist (5 profiles + 2 settings)
  ☐ All have correct data types
  ☐ Defaults applied correctly

Step 2: Check Constraints
  ☐ 4 constraints created
  ☐ device_type constraint works
  ☐ frequency constraint works
  ☐ weight_unit constraint works
  ☐ height_unit constraint works

Step 3: Index Creation
  ☐ idx_profiles_onboarding_completed exists
  ☐ Index is on correct column
  ☐ Index type is btree

Step 4: Column Comments
  ☐ 6 columns have comments
  ☐ Comments are descriptive

Step 5: RLS Policies
  ☐ RLS still enabled on profiles
  ☐ RLS still enabled on settings
  ☐ All policies intact

Step 6: Data Integrity
  ☐ Row count unchanged
  ☐ No NULL in required fields
  ☐ No data corruption
```

---

### Phase 4: Testing (10-20 minutes)

**Development/Staging Only:**

**Test 1: Seed Test Data**
```bash
# Edit seed file first (replace UUIDs)
nano docs/QA/migration-010-seed-data.sql

# Run seed script
psql $DATABASE_URL -f docs/QA/migration-010-seed-data.sql

# Verify test data created
psql $DATABASE_URL -c "SELECT COUNT(*) FROM profiles WHERE email LIKE 'test.%@example.com';"
```
- Expected: 4 test users
- Time: 5 minutes

**Test 2: Application Testing**
```bash
# Start development server
npm start

# Test scenarios:
# 1. New user onboarding (incomplete profile)
# 2. Complete onboarding flow
# 3. Change unit preferences in settings
# 4. View weight tracking with different units
# 5. Test all injection frequencies
```
- Time: 10-15 minutes

**Test 3: Constraint Validation**
```sql
-- Test invalid values (should fail)
UPDATE profiles SET device_type = 'invalid' WHERE id = 'test-id';
UPDATE profiles SET frequency = 'daily' WHERE id = 'test-id';
UPDATE settings SET weight_unit = 'pounds' WHERE user_id = 'test-id';
```
- Expected: All 3 should fail with constraint violation
- Time: 2 minutes

---

### Phase 5: Monitoring (30 minutes - 2 hours)

**Immediate Monitoring (0-30 minutes)**
```bash
# Check Supabase logs
supabase logs db

# Check application logs
# (depends on your logging setup)

# Monitor error rates
# Via Supabase Dashboard > Logs
```

**Watch for:**
- Database errors
- RLS policy violations
- Application errors related to new fields
- Performance degradation

**Key Metrics:**
- Query response time (should be unchanged or faster)
- Error rate (should not increase)
- User complaints (should be none)

**Extended Monitoring (30 minutes - 2 hours)**
- Continue passive monitoring
- Review analytics for anomalies
- Check user feedback channels
- Verify backup systems working

---

### Phase 6: Completion

**Success Criteria:**
- All verification queries pass
- No errors in logs
- Application works normally
- Users can complete onboarding
- Unit preferences work correctly

**Final Steps:**
1. Mark migration as complete in your tracking system
2. Update changelog/release notes
3. Notify team of successful deployment
4. Archive pre-migration backup (keep for 30 days)
5. Document any issues encountered

**Time to Complete:**
- Failure: Consider rollback if issues within first 30 minutes
- Warning: Extended monitoring if minor issues detected
- Success: Mark complete after 30 minutes of clean operation

---

## Rollback Decision Tree

```
                    ┌──────────────────┐
                    │ Issue Detected?  │
                    └──────────────────┘
                             │
                  ┌──────────┴──────────┐
                  ▼                     ▼
          ┌──────────────┐      ┌──────────────┐
          │ Critical     │      │ Minor Issue  │
          │ Issue?       │      │ Workaround?  │
          └──────────────┘      └──────────────┘
                  │                     │
         ┌────────┴────────┐           │
         ▼                 ▼           ▼
  ┌──────────┐      ┌──────────┐ ┌──────────┐
  │ Data     │      │ RLS      │ │ Continue │
  │ Corrupt? │      │ Broken?  │ │ Monitor  │
  └──────────┘      └──────────┘ └──────────┘
         │                 │
       YES               YES
         │                 │
         └────────┬────────┘
                  ▼
         ┌──────────────────┐
         │ ROLLBACK         │
         │ See migration-   │
         │ verification.md  │
         └──────────────────┘
                  │
      ┌───────────┴───────────┐
      ▼                       ▼
┌──────────┐          ┌──────────────┐
│ Backup   │          │ Run Rollback │
│ Current  │──────▶   │ SQL          │
│ State    │          │ (from docs)  │
└──────────┘          └──────────────┘
                              │
                              ▼
                      ┌──────────────┐
                      │ Verify       │
                      │ Rollback     │
                      │ Successful   │
                      └──────────────┘
                              │
                              ▼
                      ┌──────────────┐
                      │ Investigate  │
                      │ Root Cause   │
                      │ Fix & Retry  │
                      └──────────────┘
```

---

## Time Estimates

### Production Deployment (Full Process)

| Phase | Time | Critical? |
|-------|------|-----------|
| Pre-Deployment | 15-30 min | Yes |
| Deployment | 2-5 min | Yes |
| Verification | 5-10 min | Yes |
| Testing (basic) | 5-10 min | Yes |
| Monitoring | 30 min | Yes |
| **Total** | **57-85 min** | |

### Staging/Development (Full Process)

| Phase | Time | Critical? |
|-------|------|-----------|
| Pre-Deployment | 5-10 min | No |
| Deployment | 2-3 min | Yes |
| Verification | 5-10 min | Yes |
| Testing (comprehensive) | 15-20 min | No |
| Monitoring | 10 min | No |
| **Total** | **37-53 min** | |

---

## Quick Reference Commands

### Deploy
```bash
supabase db push
```

### Verify
```bash
psql $DATABASE_URL -f docs/QA/migration-010-quick-reference.sql
```

### Seed Test Data
```bash
psql $DATABASE_URL -f docs/QA/migration-010-seed-data.sql
```

### Check Logs
```bash
supabase logs db
```

### Rollback (if needed)
```sql
-- See migration-verification.md "Rollback Instructions" section
```

---

## Success Indicators

**Green Flags (Proceed Confidently):**
- All verification queries pass
- Zero errors in logs
- Application loads normally
- Test users can complete onboarding
- Performance metrics unchanged

**Yellow Flags (Proceed with Caution):**
- Minor warnings in logs (investigate but don't block)
- Slightly slower queries (acceptable if < 10% slower)
- Non-critical features not working (can be fixed post-deploy)

**Red Flags (Consider Rollback):**
- Verification queries fail
- RLS policies broken (users can't access data)
- Data corruption detected
- Critical application errors
- Performance degradation > 20%

---

## Post-Deployment Checklist

**Immediately After (0-5 minutes):**
- [ ] All verification queries pass
- [ ] No errors in Supabase logs
- [ ] Application loads successfully

**Short Term (5-30 minutes):**
- [ ] Test onboarding flow works
- [ ] Unit preferences work
- [ ] No user complaints
- [ ] Error rates normal

**Long Term (30 minutes - 24 hours):**
- [ ] Monitor performance metrics
- [ ] Review user feedback
- [ ] Check analytics for anomalies
- [ ] Verify backup systems working

**Documentation:**
- [ ] Update changelog
- [ ] Mark migration complete
- [ ] Archive backup
- [ ] Document any issues

---

**Created:** 2025-11-05
**Version:** 1.0
**For Migration:** 010_onboarding_enhancements.sql
