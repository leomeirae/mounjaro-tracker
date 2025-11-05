-- ========================================
-- FIX: Disable RLS on daily_nutrition for Clerk auth
-- ========================================
-- Context: The app authenticates with Clerk, so Supabase's auth.uid()
-- is not populated. RLS policies that depend on auth.uid() were
-- blocking inserts/updates with error:
--   "new row violates row-level security policy for table daily_nutrition"
-- We disable RLS (same approach used for settings) and remove
-- the legacy policies so Clerk users can persist data.
-- ========================================

ALTER TABLE IF EXISTS public.daily_nutrition DISABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own nutrition data" ON public.daily_nutrition;
DROP POLICY IF EXISTS "Users can insert own nutrition data" ON public.daily_nutrition;
DROP POLICY IF EXISTS "Users can update own nutrition data" ON public.daily_nutrition;
DROP POLICY IF EXISTS "Users can delete own nutrition data" ON public.daily_nutrition;

