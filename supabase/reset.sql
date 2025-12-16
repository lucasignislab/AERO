-- =====================================================
-- AERO Database - FULL RESET
-- WARNING: This will DELETE ALL DATA!
-- Run this first, then run schema.sql
-- =====================================================

-- Drop all policies first
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname, tablename FROM pg_policies WHERE schemaname = 'public') LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I', r.policyname, r.tablename);
    END LOOP;
END $$;

-- Drop all triggers (ignore if tables don't exist)
DO $$ 
BEGIN
    -- Try to drop each trigger, ignore errors
    BEGIN DROP TRIGGER IF EXISTS profiles_updated_at ON profiles; EXCEPTION WHEN undefined_table THEN NULL; END;
    BEGIN DROP TRIGGER IF EXISTS workspaces_updated_at ON workspaces; EXCEPTION WHEN undefined_table THEN NULL; END;
    BEGIN DROP TRIGGER IF EXISTS projects_updated_at ON projects; EXCEPTION WHEN undefined_table THEN NULL; END;
    BEGIN DROP TRIGGER IF EXISTS issue_states_updated_at ON issue_states; EXCEPTION WHEN undefined_table THEN NULL; END;
    BEGIN DROP TRIGGER IF EXISTS work_items_updated_at ON work_items; EXCEPTION WHEN undefined_table THEN NULL; END;
    BEGIN DROP TRIGGER IF EXISTS cycles_updated_at ON cycles; EXCEPTION WHEN undefined_table THEN NULL; END;
    BEGIN DROP TRIGGER IF EXISTS modules_updated_at ON modules; EXCEPTION WHEN undefined_table THEN NULL; END;
    BEGIN DROP TRIGGER IF EXISTS epics_updated_at ON epics; EXCEPTION WHEN undefined_table THEN NULL; END;
    BEGIN DROP TRIGGER IF EXISTS pages_updated_at ON pages; EXCEPTION WHEN undefined_table THEN NULL; END;
    BEGIN DROP TRIGGER IF EXISTS saved_views_updated_at ON saved_views; EXCEPTION WHEN undefined_table THEN NULL; END;
    BEGIN DROP TRIGGER IF EXISTS comments_updated_at ON comments; EXCEPTION WHEN undefined_table THEN NULL; END;
    BEGIN DROP TRIGGER IF EXISTS epic_updates_updated_at ON epic_updates; EXCEPTION WHEN undefined_table THEN NULL; END;
    BEGIN DROP TRIGGER IF EXISTS stickies_updated_at ON stickies; EXCEPTION WHEN undefined_table THEN NULL; END;
    BEGIN DROP TRIGGER IF EXISTS work_item_types_updated_at ON work_item_types; EXCEPTION WHEN undefined_table THEN NULL; END;
    BEGIN DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users; EXCEPTION WHEN undefined_table THEN NULL; END;
END $$;

-- Drop functions
DROP FUNCTION IF EXISTS update_updated_at() CASCADE;
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;

-- Drop all tables (in order due to foreign keys)
DROP TABLE IF EXISTS quick_links CASCADE;
DROP TABLE IF EXISTS stickies CASCADE;
DROP TABLE IF EXISTS activity_logs CASCADE;
DROP TABLE IF EXISTS epic_updates CASCADE;
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS saved_views CASCADE;
DROP TABLE IF EXISTS pages CASCADE;
DROP TABLE IF EXISTS attachments CASCADE;
DROP TABLE IF EXISTS work_item_relations CASCADE;
DROP TABLE IF EXISTS work_item_links CASCADE;
DROP TABLE IF EXISTS work_items CASCADE;
DROP TABLE IF EXISTS epics CASCADE;
DROP TABLE IF EXISTS modules CASCADE;
DROP TABLE IF EXISTS cycles CASCADE;
DROP TABLE IF EXISTS property_definitions CASCADE;
DROP TABLE IF EXISTS work_item_types CASCADE;
DROP TABLE IF EXISTS project_labels CASCADE;
DROP TABLE IF EXISTS issue_states CASCADE;
DROP TABLE IF EXISTS project_members CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS project_states CASCADE;
DROP TABLE IF EXISTS workspace_members CASCADE;
DROP TABLE IF EXISTS workspaces CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Database reset complete! Now run schema.sql';
END $$;
