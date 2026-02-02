-- =====================================================
-- AERO: Unified Supabase Database Schema
-- Version: 2.4 (Ultra-Robust RLS - No Aliases)
-- =====================================================

-- 0. Setup
SET search_path TO public, auth;
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    avatar_url TEXT,
    role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'member', 'guest')),
    preferences JSONB DEFAULT '{"theme": "dark"}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Workspaces
CREATE TABLE IF NOT EXISTS public.workspaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    owner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    plan TEXT DEFAULT 'free',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Workspace Members
CREATE TABLE IF NOT EXISTS public.workspace_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'member',
    status TEXT DEFAULT 'active',
    UNIQUE(workspace_id, user_id)
);

-- Force column existence check in case the table existed with different layout
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='workspace_members' AND column_name='user_id') THEN
        ALTER TABLE public.workspace_members ADD COLUMN user_id UUID REFERENCES public.profiles(id);
    END IF;
END $$;

-- 4. Projects
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    identifier TEXT NOT NULL,
    lead_id UUID REFERENCES public.profiles(id),
    is_private BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(workspace_id, identifier)
);

-- 5. Project Members
CREATE TABLE IF NOT EXISTS public.project_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'member',
    UNIQUE(project_id, user_id)
);

-- 6. Work Items & States
CREATE TABLE IF NOT EXISTS public.issue_states (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    group_name TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.work_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    identifier TEXT NOT NULL,
    title TEXT NOT NULL,
    state_id UUID REFERENCES public.issue_states(id),
    created_by_id UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(project_id, identifier)
);

-- 7. Cleaning Policies
DO $$ 
DECLARE r RECORD;
BEGIN
    FOR r IN (SELECT policyname, tablename FROM pg_policies WHERE schemaname = 'public') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON public.' || quote_ident(r.tablename);
    END LOOP;
END $$;

-- 8. Enabling RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_items ENABLE ROW LEVEL SECURITY;

-- 9. Robust Policies (No Aliases, Qualified table names)

-- Profiles
CREATE POLICY "profiles_read" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_update" ON public.profiles FOR UPDATE USING (id = auth.uid());

-- Workspaces
CREATE POLICY "workspaces_select" ON public.workspaces FOR SELECT 
USING ( id IN (SELECT workspace_id FROM public.workspace_members WHERE public.workspace_members.user_id = auth.uid()) );

CREATE POLICY "workspaces_all_admin" ON public.workspaces FOR ALL 
USING ( owner_id = auth.uid() OR id IN (SELECT workspace_id FROM public.workspace_members WHERE public.workspace_members.user_id = auth.uid() AND public.workspace_members.role = 'admin') );

-- Workspace Members
CREATE POLICY "wm_select" ON public.workspace_members FOR SELECT 
USING ( workspace_id IN (SELECT current_ws.workspace_id FROM public.workspace_members current_ws WHERE current_ws.user_id = auth.uid()) );

-- Projects
CREATE POLICY "projects_select" ON public.projects FOR SELECT 
USING ( workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE public.workspace_members.user_id = auth.uid()) );

-- Work Items
CREATE POLICY "wi_select" ON public.work_items FOR SELECT 
USING ( project_id IN (SELECT project_id FROM public.project_members WHERE public.project_members.user_id = auth.uid()) );

CREATE POLICY "wi_manage" ON public.work_items FOR ALL 
USING ( project_id IN (SELECT project_id FROM public.project_members WHERE public.project_members.user_id = auth.uid()) );

-- 10. Automation Triggers
CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END; $$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 11. Realtime
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime FOR TABLE public.work_items, public.projects, public.workspaces;
COMMIT;
