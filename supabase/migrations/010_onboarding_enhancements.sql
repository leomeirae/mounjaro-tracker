-- Migration: 010_onboarding_enhancements.sql
-- Purpose: Add fields needed for enhanced onboarding flow
-- Author: System
-- Date: 2025-11-05

-- Add onboarding completion flag to profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;

-- Add treatment start date
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS treatment_start_date TIMESTAMPTZ;

-- Add device type (pen or syringe)
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS device_type TEXT CHECK (device_type IN ('pen', 'syringe'));

-- Add injection frequency
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS frequency TEXT CHECK (frequency IN ('weekly', 'biweekly', 'monthly'));

-- Add current weight (for tracking separately from start weight)
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS current_weight NUMERIC(5, 2);

-- Add unit preferences to settings table
ALTER TABLE public.settings
ADD COLUMN IF NOT EXISTS weight_unit TEXT DEFAULT 'kg' CHECK (weight_unit IN ('kg', 'lb'));

ALTER TABLE public.settings
ADD COLUMN IF NOT EXISTS height_unit TEXT DEFAULT 'cm' CHECK (height_unit IN ('cm', 'ft'));

-- Create index for faster queries on onboarding_completed
CREATE INDEX IF NOT EXISTS idx_profiles_onboarding_completed
ON public.profiles(onboarding_completed);

-- Add comment for documentation
COMMENT ON COLUMN public.profiles.onboarding_completed IS 'Flag indicating whether user has completed the onboarding flow';
COMMENT ON COLUMN public.profiles.treatment_start_date IS 'Date when user started GLP-1 treatment';
COMMENT ON COLUMN public.profiles.device_type IS 'Type of injection device: pen or syringe';
COMMENT ON COLUMN public.profiles.frequency IS 'Injection frequency: weekly, biweekly, or monthly';
COMMENT ON COLUMN public.settings.weight_unit IS 'Preferred unit for weight display: kg or lb';
COMMENT ON COLUMN public.settings.height_unit IS 'Preferred unit for height display: cm or ft';
