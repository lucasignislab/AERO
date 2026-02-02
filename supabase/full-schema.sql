-- =====================================================
-- AERO: Unified Supabase Database Schema
-- Version: 2.5 (Full Production Schema - Robust RLS)
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
    preferences JSONB DEFAULT '{"theme": "dark", "sidebar_collapsed": false}',
    last_seen_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Workspaces & Members
CREATE TABLE IF NOT EXISTS public.workspaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    logo TEXT,
    owner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'enterprise')),
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.workspace_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'member', 'guest')),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'pending')),
    invited_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(workspace_id, user_id)
);

-- Force column check for pre-existing tables
DO $$ BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='workspace_members' AND column_name='user_id') THEN
        ALTER TABLE public.workspace_members ADD COLUMN user_id UUID REFERENCES public.profiles(id);
    END IF;
END $$;

-- 3. Projects & Labels
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    identifier TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    color TEXT,
    lead_id UUID REFERENCES public.profiles(id),
    priority TEXT DEFAULT 'none' CHECK (priority IN ('urgent', 'high', 'medium', 'low', 'none')),
    is_private BOOLEAN DEFAULT FALSE,
    is_favorite BOOLEAN DEFAULT FALSE,
    features JSONB DEFAULT '{"cycles": true, "modules": true, "epics": true, "views": true, "pages": true}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(workspace_id, identifier)
);

CREATE TABLE IF NOT EXISTS public.project_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'member', 'guest')),
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(project_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.project_labels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    color TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Workflow (States)
CREATE TABLE IF NOT EXISTS public.issue_states (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    color TEXT NOT NULL,
    group_name TEXT NOT NULL CHECK (group_name IN ('backlog', 'unstarted', 'started', 'completed', 'cancelled')),
    sort_order INTEGER DEFAULT 0,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Planning (Cycles, Modules, Epics)
CREATE TABLE IF NOT EXISTS public.cycles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'active', 'completed')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    lead_id UUID REFERENCES public.profiles(id),
    status TEXT DEFAULT 'backlog' CHECK (status IN ('backlog', 'planned', 'in-progress', 'paused', 'completed', 'cancelled')),
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.epics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    owner_id UUID REFERENCES public.profiles(id),
    status TEXT DEFAULT 'backlog' CHECK (status IN ('backlog', 'planned', 'in-progress', 'paused', 'completed', 'cancelled')),
    start_date TIMESTAMPTZ,
    target_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Work Items
CREATE TABLE IF NOT EXISTS public.work_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    identifier TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    state_id UUID REFERENCES public.issue_states(id),
    priority TEXT DEFAULT 'none' CHECK (priority IN ('urgent', 'high', 'medium', 'low', 'none')),
    assignee_ids UUID[] DEFAULT '{}',
    created_by_id UUID REFERENCES public.profiles(id),
    label_ids UUID[] DEFAULT '{}',
    due_date TIMESTAMPTZ,
    start_date TIMESTAMPTZ,
    cycle_id UUID REFERENCES public.cycles(id) ON DELETE SET NULL,
    module_ids UUID[] DEFAULT '{}',
    epic_id UUID REFERENCES public.epics(id) ON DELETE SET NULL,
    parent_id UUID REFERENCES public.work_items(id) ON DELETE SET NULL,
    sort_order INTEGER DEFAULT 0,
    is_draft BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    UNIQUE(project_id, identifier)
);

CREATE TABLE IF NOT EXISTS public.work_item_relations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_id UUID NOT NULL REFERENCES public.work_items(id) ON DELETE CASCADE,
    target_id UUID NOT NULL REFERENCES public.work_items(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('blocking', 'blocked_by', 'relates_to', 'duplicate_of')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(source_id, target_id, type)
);

-- 7. Knowledge Base (Pages)
CREATE TABLE IF NOT EXISTS public.pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES public.pages(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    content JSONB,
    icon TEXT,
    is_published BOOLEAN DEFAULT FALSE,
    created_by_id UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Productivity Tools
CREATE TABLE IF NOT EXISTS public.stickies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    color TEXT DEFAULT 'yellow' CHECK (color IN ('yellow', 'green', 'blue', 'pink', 'purple', 'orange')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.quick_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    icon TEXT,
    created_by_id UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Collaboration & Logs
CREATE TABLE IF NOT EXISTS public.comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    work_item_id UUID REFERENCES public.work_items(id) ON DELETE CASCADE,
    epic_id UUID REFERENCES public.epics(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_by_id UUID REFERENCES public.profiles(id),
    reactions JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CHECK ( (work_item_id IS NOT NULL AND epic_id IS NULL) OR (work_item_id IS NULL AND epic_id IS NOT NULL) )
);

CREATE TABLE IF NOT EXISTS public.activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    entity_type TEXT NOT NULL,
    entity_id UUID NOT NULL,
    action TEXT NOT NULL,
    payload JSONB,
    user_id UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Automation & Triggers
CREATE OR REPLACE FUNCTION public.trigger_set_timestamp() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp_profiles BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE PROCEDURE public.trigger_set_timestamp();
CREATE TRIGGER set_timestamp_workspaces BEFORE UPDATE ON public.workspaces FOR EACH ROW EXECUTE PROCEDURE public.trigger_set_timestamp();
CREATE TRIGGER set_timestamp_projects BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE PROCEDURE public.trigger_set_timestamp();
CREATE TRIGGER set_timestamp_issue_states BEFORE UPDATE ON public.issue_states FOR EACH ROW EXECUTE PROCEDURE public.trigger_set_timestamp();
CREATE TRIGGER set_timestamp_cycles BEFORE UPDATE ON public.cycles FOR EACH ROW EXECUTE PROCEDURE public.trigger_set_timestamp();
CREATE TRIGGER set_timestamp_modules BEFORE UPDATE ON public.modules FOR EACH ROW EXECUTE PROCEDURE public.trigger_set_timestamp();
CREATE TRIGGER set_timestamp_epics BEFORE UPDATE ON public.epics FOR EACH ROW EXECUTE PROCEDURE public.trigger_set_timestamp();
CREATE TRIGGER set_timestamp_work_items BEFORE UPDATE ON public.work_items FOR EACH ROW EXECUTE PROCEDURE public.trigger_set_timestamp();
CREATE TRIGGER set_timestamp_pages BEFORE UPDATE ON public.pages FOR EACH ROW EXECUTE PROCEDURE public.trigger_set_timestamp();
CREATE TRIGGER set_timestamp_stickies BEFORE UPDATE ON public.stickies FOR EACH ROW EXECUTE PROCEDURE public.trigger_set_timestamp();
CREATE TRIGGER set_timestamp_comments BEFORE UPDATE ON public.comments FOR EACH ROW EXECUTE PROCEDURE public.trigger_set_timestamp();

CREATE OR REPLACE FUNCTION public.generate_work_item_identifier() RETURNS TRIGGER AS $$
DECLARE project_ident TEXT; next_val INT;
BEGIN
  SELECT identifier INTO project_ident FROM public.projects WHERE id = NEW.project_id;
  SELECT COALESCE(MAX(CAST(split_part(identifier, '-', 2) AS INTEGER)), 0) + 1 INTO next_val 
  FROM public.work_items WHERE project_id = NEW.project_id;
  NEW.identifier := project_ident || '-' || next_val;
  RETURN NEW;
END; $$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_generate_work_item_identifier ON public.work_items;
CREATE TRIGGER tr_generate_work_item_identifier BEFORE INSERT ON public.work_items
FOR EACH ROW WHEN (NEW.identifier IS NULL OR NEW.identifier = '') EXECUTE PROCEDURE public.generate_work_item_identifier();

CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, avatar_url)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)), NEW.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END; $$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 11. Security (RLS)
DO $$ 
DECLARE r RECORD;
BEGIN
    FOR r IN (SELECT policyname, tablename FROM pg_policies WHERE schemaname = 'public') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON public.' || quote_ident(r.tablename);
    END LOOP;
END $$;

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.issue_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_labels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.epics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_item_relations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stickies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quick_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Policies (Robust Pattern: No Aliases, Qualified names)

-- Profiles
CREATE POLICY "profiles_select" ON public.profiles FOR SELECT USING (true);
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
CREATE POLICY "projects_all_admin" ON public.projects FOR ALL 
  USING ( id IN (SELECT project_id FROM public.project_members WHERE public.project_members.user_id = auth.uid() AND public.project_members.role = 'admin') );

-- Work Items, Planning, Pages, Meta
CREATE POLICY "work_items_read" ON public.work_items FOR SELECT USING ( project_id IN (SELECT project_id FROM public.project_members WHERE public.project_members.user_id = auth.uid()) );
CREATE POLICY "work_items_all" ON public.work_items FOR ALL USING ( project_id IN (SELECT project_id FROM public.project_members WHERE public.project_members.user_id = auth.uid()) );

CREATE POLICY "cycles_read" ON public.cycles FOR SELECT USING ( project_id IN (SELECT project_id FROM public.project_members WHERE public.project_members.user_id = auth.uid()) );
CREATE POLICY "modules_read" ON public.modules FOR SELECT USING ( project_id IN (SELECT project_id FROM public.project_members WHERE public.project_members.user_id = auth.uid()) );
CREATE POLICY "epics_read" ON public.epics FOR SELECT USING ( project_id IN (SELECT project_id FROM public.project_members WHERE public.project_members.user_id = auth.uid()) );

CREATE POLICY "pages_read" ON public.pages FOR SELECT USING ( project_id IN (SELECT project_id FROM public.project_members WHERE public.project_members.user_id = auth.uid()) );
CREATE POLICY "states_read" ON public.issue_states FOR SELECT USING ( project_id IN (SELECT project_id FROM public.project_members WHERE public.project_members.user_id = auth.uid()) );

-- Stickies & Collaboration
CREATE POLICY "stickies_all" ON public.stickies FOR ALL USING (user_id = auth.uid());
CREATE POLICY "comments_read" ON public.comments FOR SELECT USING (true);
CREATE POLICY "comments_own" ON public.comments FOR ALL USING (created_by_id = auth.uid());

-- 12. Realtime
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime FOR TABLE 
    public.work_items, public.projects, public.workspaces, public.comments, public.issue_states, public.pages, public.stickies, public.cycles, public.modules, public.epics;
COMMIT;
