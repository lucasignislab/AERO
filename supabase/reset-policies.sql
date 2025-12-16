-- =====================================================
-- AERO Database - Drop existing policies first
-- Run this before the main schema.sql if you get policy errors
-- =====================================================

-- Drop all existing policies
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname, tablename FROM pg_policies WHERE schemaname = 'public') LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I', r.policyname, r.tablename);
    END LOOP;
END $$;

-- Now you can run schema.sql
