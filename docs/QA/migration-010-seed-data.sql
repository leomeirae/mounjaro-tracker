-- ============================================================================
-- Migration 010: Test Data Seeding
-- ============================================================================
-- Purpose: Create comprehensive test data for onboarding enhancements
-- Usage: Replace UUIDs with actual auth user IDs from your system
-- ============================================================================

-- ============================================================================
-- CONFIGURATION
-- ============================================================================
-- Replace these UUIDs with actual values from your auth.users table
-- To get real user IDs: SELECT id FROM auth.users LIMIT 5;

-- Test User 1: Complete onboarding with weekly pen injections
DO $$
DECLARE
  test_user_1_id UUID := 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'; -- REPLACE THIS
  test_settings_1_id UUID := uuid_generate_v4();
BEGIN

  -- ============================================================================
  -- TEST USER 1: Complete Profile with Onboarding
  -- ============================================================================

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
    test_user_1_id,
    'Test User - Weekly Pen',
    'test.weekly.pen@example.com',
    175.00,                           -- 175 cm height
    95.50,                            -- Starting weight 95.5 kg
    80.00,                            -- Target weight 80 kg
    92.30,                            -- Current weight 92.3 kg (progress!)
    'Mounjaro',
    2.5,                              -- 2.5 mg dose
    'weekly',
    true,                             -- Onboarding completed
    '2024-10-01 00:00:00+00',        -- Started treatment Oct 1, 2024
    'pen',
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    onboarding_completed = EXCLUDED.onboarding_completed,
    treatment_start_date = EXCLUDED.treatment_start_date,
    device_type = EXCLUDED.device_type,
    current_weight = EXCLUDED.current_weight,
    frequency = EXCLUDED.frequency;

  -- Settings for Test User 1 (Metric units)
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
    sync_apple_health,
    auto_backup,
    created_at,
    updated_at
  ) VALUES (
    test_settings_1_id,
    test_user_1_id,
    'classic',
    '#0891B2',
    false,
    'kg',                             -- Metric weight
    'cm',                             -- Metric height
    true,
    '09:00:00',
    true,
    '08:00:00',
    true,
    false,
    true,
    NOW(),
    NOW()
  )
  ON CONFLICT (user_id) DO UPDATE SET
    weight_unit = EXCLUDED.weight_unit,
    height_unit = EXCLUDED.height_unit;

  -- Weight tracking history for Test User 1
  INSERT INTO public.weights (id, user_id, date, weight, notes, created_at)
  VALUES
    (uuid_generate_v4(), test_user_1_id, '2024-10-01', 95.50, 'Starting weight - feeling motivated!', NOW()),
    (uuid_generate_v4(), test_user_1_id, '2024-10-08', 94.80, 'Week 1 - slight decrease', NOW()),
    (uuid_generate_v4(), test_user_1_id, '2024-10-15', 94.20, 'Week 2 - steady progress', NOW()),
    (uuid_generate_v4(), test_user_1_id, '2024-10-22', 93.50, 'Week 3 - feeling great', NOW()),
    (uuid_generate_v4(), test_user_1_id, '2024-10-29', 92.80, 'Week 4 - 2.7kg down!', NOW()),
    (uuid_generate_v4(), test_user_1_id, '2024-11-05', 92.30, 'Current - 3.2kg total loss', NOW())
  ON CONFLICT DO NOTHING;

  -- Injection records for Test User 1
  INSERT INTO public.applications (id, user_id, date, dosage, injection_sites, side_effects, notes, created_at)
  VALUES
    (uuid_generate_v4(), test_user_1_id, '2024-10-01', 2.5, ARRAY['abdomen'], ARRAY['mild nausea'], 'First dose - a bit nervous', NOW()),
    (uuid_generate_v4(), test_user_1_id, '2024-10-08', 2.5, ARRAY['thigh'], ARRAY[], 'Week 2 - no side effects', NOW()),
    (uuid_generate_v4(), test_user_1_id, '2024-10-15', 2.5, ARRAY['abdomen'], ARRAY['mild fatigue'], 'Week 3 - feeling tired', NOW()),
    (uuid_generate_v4(), test_user_1_id, '2024-10-22', 2.5, ARRAY['arm'], ARRAY[], 'Week 4 - smooth injection', NOW()),
    (uuid_generate_v4(), test_user_1_id, '2024-10-29', 2.5, ARRAY['thigh'], ARRAY[], 'Week 5 - routine now', NOW())
  ON CONFLICT DO NOTHING;

  RAISE NOTICE 'Test User 1 created successfully (Weekly Pen)';

END $$;

-- ============================================================================
-- TEST USER 2: Incomplete onboarding
-- ============================================================================

DO $$
DECLARE
  test_user_2_id UUID := 'b1ffbc99-9c0b-4ef8-bb6d-6bb9bd380a22'; -- REPLACE THIS
  test_settings_2_id UUID := uuid_generate_v4();
BEGIN

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
    test_user_2_id,
    'Test User - Incomplete',
    'test.incomplete@example.com',
    NULL,                             -- No height set
    NULL,                             -- No starting weight
    NULL,                             -- No target weight
    NULL,                             -- No current weight
    NULL,                             -- No medication
    NULL,                             -- No dose
    NULL,                             -- No frequency
    false,                            -- Onboarding NOT completed
    NULL,                             -- No treatment start date
    NULL,                             -- No device type
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    onboarding_completed = EXCLUDED.onboarding_completed;

  -- Settings with defaults
  INSERT INTO public.settings (
    id,
    user_id,
    weight_unit,
    height_unit,
    created_at,
    updated_at
  ) VALUES (
    test_settings_2_id,
    test_user_2_id,
    'kg',                             -- Default metric
    'cm',
    NOW(),
    NOW()
  )
  ON CONFLICT (user_id) DO UPDATE SET
    weight_unit = EXCLUDED.weight_unit;

  RAISE NOTICE 'Test User 2 created successfully (Incomplete Onboarding)';

END $$;

-- ============================================================================
-- TEST USER 3: Biweekly syringe user with imperial units
-- ============================================================================

DO $$
DECLARE
  test_user_3_id UUID := 'c2ffcd99-9c0b-4ef8-bb6d-6bb9bd380a33'; -- REPLACE THIS
  test_settings_3_id UUID := uuid_generate_v4();
BEGIN

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
    test_user_3_id,
    'Test User - Biweekly Syringe',
    'test.biweekly.syringe@example.com',
    68.00,                            -- 68 inches (5'8")
    210.00,                           -- 210 lbs starting
    180.00,                           -- 180 lbs target
    205.00,                           -- 205 lbs current
    'Mounjaro',
    5.0,                              -- 5.0 mg dose
    'biweekly',
    true,
    '2024-09-15 00:00:00+00',        -- Started mid-September
    'syringe',
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    onboarding_completed = EXCLUDED.onboarding_completed,
    treatment_start_date = EXCLUDED.treatment_start_date,
    device_type = EXCLUDED.device_type,
    current_weight = EXCLUDED.current_weight,
    frequency = EXCLUDED.frequency;

  -- Settings for Test User 3 (Imperial units)
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
    test_settings_3_id,
    test_user_3_id,
    'ocean',
    '#0284C7',
    true,                             -- Dark mode user
    'lb',                             -- Imperial weight
    'ft',                             -- Imperial height
    true,
    '07:00:00',                       -- Early riser
    true,
    '06:00:00',
    true,
    NOW(),
    NOW()
  )
  ON CONFLICT (user_id) DO UPDATE SET
    weight_unit = EXCLUDED.weight_unit,
    height_unit = EXCLUDED.height_unit;

  -- Biweekly weight entries
  INSERT INTO public.weights (id, user_id, date, weight, notes, created_at)
  VALUES
    (uuid_generate_v4(), test_user_3_id, '2024-09-15', 210.00, 'Starting weight', NOW()),
    (uuid_generate_v4(), test_user_3_id, '2024-09-29', 208.50, '2 weeks - 1.5 lbs down', NOW()),
    (uuid_generate_v4(), test_user_3_id, '2024-10-13', 207.00, '1 month - 3 lbs total', NOW()),
    (uuid_generate_v4(), test_user_3_id, '2024-10-27', 205.50, '6 weeks - 4.5 lbs total', NOW()),
    (uuid_generate_v4(), test_user_3_id, '2024-11-05', 205.00, 'Current - 5 lbs loss', NOW())
  ON CONFLICT DO NOTHING;

  -- Biweekly injections
  INSERT INTO public.applications (id, user_id, date, dosage, injection_sites, side_effects, notes, created_at)
  VALUES
    (uuid_generate_v4(), test_user_3_id, '2024-09-15', 5.0, ARRAY['abdomen'], ARRAY['nausea'], 'First syringe dose', NOW()),
    (uuid_generate_v4(), test_user_3_id, '2024-09-29', 5.0, ARRAY['thigh'], ARRAY[], 'Getting used to it', NOW()),
    (uuid_generate_v4(), test_user_3_id, '2024-10-13', 5.0, ARRAY['abdomen'], ARRAY[], 'No issues', NOW()),
    (uuid_generate_v4(), test_user_3_id, '2024-10-27', 5.0, ARRAY['arm'], ARRAY[], 'Easy routine', NOW())
  ON CONFLICT DO NOTHING;

  RAISE NOTICE 'Test User 3 created successfully (Biweekly Syringe)';

END $$;

-- ============================================================================
-- TEST USER 4: Monthly pen user (edge case for frequency)
-- ============================================================================

DO $$
DECLARE
  test_user_4_id UUID := 'd3ffde99-9c0b-4ef8-bb6d-6bb9bd380a44'; -- REPLACE THIS
  test_settings_4_id UUID := uuid_generate_v4();
BEGIN

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
    test_user_4_id,
    'Test User - Monthly Pen',
    'test.monthly.pen@example.com',
    165.00,                           -- 165 cm
    72.00,                            -- 72 kg starting
    65.00,                            -- 65 kg target
    71.00,                            -- 71 kg current
    'Mounjaro',
    7.5,                              -- 7.5 mg dose
    'monthly',
    true,
    '2024-08-01 00:00:00+00',        -- Started August 1
    'pen',
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    onboarding_completed = EXCLUDED.onboarding_completed,
    treatment_start_date = EXCLUDED.treatment_start_date,
    device_type = EXCLUDED.device_type,
    current_weight = EXCLUDED.current_weight,
    frequency = EXCLUDED.frequency;

  -- Settings for Test User 4
  INSERT INTO public.settings (
    id,
    user_id,
    weight_unit,
    height_unit,
    created_at,
    updated_at
  ) VALUES (
    test_settings_4_id,
    test_user_4_id,
    'kg',
    'cm',
    NOW(),
    NOW()
  )
  ON CONFLICT (user_id) DO UPDATE SET
    weight_unit = EXCLUDED.weight_unit;

  -- Monthly tracking
  INSERT INTO public.weights (id, user_id, date, weight, notes, created_at)
  VALUES
    (uuid_generate_v4(), test_user_4_id, '2024-08-01', 72.00, 'Month 1 - starting', NOW()),
    (uuid_generate_v4(), test_user_4_id, '2024-09-01', 71.50, 'Month 2 - slow start', NOW()),
    (uuid_generate_v4(), test_user_4_id, '2024-10-01', 71.20, 'Month 3 - steady', NOW()),
    (uuid_generate_v4(), test_user_4_id, '2024-11-01', 71.00, 'Month 4 - current', NOW())
  ON CONFLICT DO NOTHING;

  INSERT INTO public.applications (id, user_id, date, dosage, injection_sites, side_effects, notes, created_at)
  VALUES
    (uuid_generate_v4(), test_user_4_id, '2024-08-01', 7.5, ARRAY['abdomen'], ARRAY[], 'First monthly dose', NOW()),
    (uuid_generate_v4(), test_user_4_id, '2024-09-01', 7.5, ARRAY['thigh'], ARRAY[], 'Month 2', NOW()),
    (uuid_generate_v4(), test_user_4_id, '2024-10-01', 7.5, ARRAY['arm'], ARRAY[], 'Month 3', NOW())
  ON CONFLICT DO NOTHING;

  RAISE NOTICE 'Test User 4 created successfully (Monthly Pen)';

END $$;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Count all test users
SELECT
  'Total test profiles' as metric,
  COUNT(*) as count
FROM public.profiles
WHERE email LIKE 'test.%@example.com';

-- Verify onboarding completion status
SELECT
  onboarding_completed,
  COUNT(*) as count
FROM public.profiles
WHERE email LIKE 'test.%@example.com'
GROUP BY onboarding_completed;

-- Verify device types
SELECT
  device_type,
  COUNT(*) as count
FROM public.profiles
WHERE email LIKE 'test.%@example.com'
GROUP BY device_type
ORDER BY device_type;

-- Verify frequencies
SELECT
  frequency,
  COUNT(*) as count
FROM public.profiles
WHERE email LIKE 'test.%@example.com'
GROUP BY frequency
ORDER BY frequency;

-- Verify unit preferences
SELECT
  s.weight_unit,
  s.height_unit,
  COUNT(*) as count
FROM public.settings s
JOIN public.profiles p ON s.user_id = p.id
WHERE p.email LIKE 'test.%@example.com'
GROUP BY s.weight_unit, s.height_unit;

-- ============================================================================
-- CLEANUP (Optional - run to remove all test data)
-- ============================================================================

/*
-- Uncomment to delete all test data:

DO $$
DECLARE
  test_emails TEXT[] := ARRAY[
    'test.weekly.pen@example.com',
    'test.incomplete@example.com',
    'test.biweekly.syringe@example.com',
    'test.monthly.pen@example.com'
  ];
BEGIN
  -- Delete will cascade to weights, applications, and settings
  DELETE FROM public.profiles
  WHERE email = ANY(test_emails);

  RAISE NOTICE 'All test data deleted';
END $$;
*/

-- ============================================================================
-- END OF SEED DATA
-- ============================================================================

-- Summary:
-- Test User 1: Complete onboarding, weekly pen, metric units, good progress
-- Test User 2: Incomplete onboarding, defaults only
-- Test User 3: Complete onboarding, biweekly syringe, imperial units
-- Test User 4: Complete onboarding, monthly pen (edge case frequency)
