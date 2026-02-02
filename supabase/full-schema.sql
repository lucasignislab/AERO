-- =====================================================
-- AERO: Unified Supabase Database Schema
-- Version: 2.3 (Final Fix: Robust RLS & Complete Policy Coverage)
-- =====================================================

-- =====================================================
-- 0. EXTENSIONS & SETUP
-- =====================================================
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. PROFILES
-- =====================================================
CREATE TABLE IF NOT EXISTS profiles (
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

-- =====================================================
-- 2. WORKSPACES & MEMBERSHIP
-- =====================================================
CREATE TABLE IF NOT EXISTS workspaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    logo TEXT,
    owner_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'enterprise')),
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS workspace_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'member', 'guest')),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'pending')),
    invited_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(workspace_id, user_id)
);

-- =====================================================
-- 3. PROJECTS & LABELS
-- =====================================================
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    identifier TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    color TEXT,
    lead_id UUID REFERENCES profiles(id),
    priority TEXT DEFAULT 'none' CHECK (priority IN ('urgent', 'high', 'medium', 'low', 'none')),
    is_private BOOLEAN DEFAULT FALSE,
    is_favorite BOOLEAN DEFAULT FALSE,
    features JSONB DEFAULT '{"cycles": true, "modules": true, "epics": true, "views": true, "pages": true}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(workspace_id, identifier)
);

CREATE TABLE IF NOT EXISTS project_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'member', 'guest')),
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(project_id, user_id)
);

CREATE TABLE IF NOT EXISTS project_labels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    color TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 4. ISSUE STATES
-- =====================================================
CREATE TABLE IF NOT EXISTS issue_states (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    color TEXT NOT NULL,
    group_name TEXT NOT NULL CHECK (group_name IN ('backlog', 'unstarted', 'started', 'completed', 'cancelled')),
    sort_order INTEGER DEFAULT 0,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 5. PLANNING (Cycles, Modules, Epics)
-- =====================================================
CREATE TABLE IF NOT EXISTS cycles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'active', 'completed')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    lead_id UUID REFERENCES profiles(id),
    status TEXT DEFAULT 'backlog' CHECK (status IN ('backlog', 'planned', 'in-progress', 'paused', 'completed', 'cancelled')),
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS epics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    owner_id UUID REFERENCES profiles(id),
    status TEXT DEFAULT 'backlog' CHECK (status IN ('backlog', 'planned', 'in-progress', 'paused', 'completed', 'cancelled')),
    start_date TIMESTAMPTZ,
    target_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 6. WORK ITEMS
-- =====================================================
CREATE TABLE IF NOT EXISTS work_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    identifier TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    state_id UUID REFERENCES issue_states(id),
    priority TEXT DEFAULT 'none' CHECK (priority IN ('urgent', 'high', 'medium', 'low', 'none')),
    assignee_ids UUID[] DEFAULT '{}',
    created_by_id UUID REFERENCES profiles(id),
    label_ids UUID[] DEFAULT '{}',
    due_date TIMESTAMPTZ,
    start_date TIMESTAMPTZ,
    cycle_id UUID REFERENCES cycles(id) ON DELETE SET NULL,
    module_ids UUID[] DEFAULT '{}',
    epic_id UUID REFERENCES epics(id) ON DELETE SET NULL,
    parent_id UUID REFERENCES work_items(id) ON DELETE SET NULL,
    sort_order INTEGER DEFAULT 0,
    is_draft BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    UNIQUE(project_id, identifier)
);

CREATE TABLE IF NOT EXISTS work_item_relations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_id UUID NOT NULL REFERENCES work_items(id) ON DELETE CASCADE,
    target_id UUID NOT NULL REFERENCES work_items(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('blocking', 'blocked_by', 'relates_to', 'duplicate_of')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(source_id, target_id, type)
);

-- =====================================================
-- 7. KNOWLEDGE BASE
-- =====================================================
CREATE TABLE IF NOT EXISTS pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES pages(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    content JSONB,
    icon TEXT,
    is_published BOOLEAN DEFAULT FALSE,
    created_by_id UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 8. PRODUCTIVITY TOOLS
-- =====================================================
CREATE TABLE IF NOT EXISTS stickies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    color TEXT DEFAULT 'yellow' CHECK (color IN ('yellow', 'green', 'blue', 'pink', 'purple', 'orange')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS quick_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    icon TEXT,
    created_by_id UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 9. COLLABORATION & LOGS
-- =====================================================
CREATE TABLE IF NOT EXISTS comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    work_item_id UUID REFERENCES work_items(id) ON DELETE CASCADE,
    epic_id UUID REFERENCES epics(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_by_id UUID REFERENCES profiles(id),
    reactions JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CHECK (
        (work_item_id IS NOT NULL AND epic_id IS NULL) OR
        (work_item_id IS NULL AND epic_id IS NOT NULL)
    )
);

CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    entity_type TEXT NOT NULL,
    entity_id UUID NOT NULL,
    action TEXT NOT NULL,
    payload JSONB,
    user_id UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 10. AUTOMATION
-- =====================================================
CREATE OR REPLACE FUNCTION trigger_set_timestamp() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp_profiles BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
CREATE TRIGGER set_timestamp_workspaces BEFORE UPDATE ON workspaces FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
CREATE TRIGGER set_timestamp_projects BEFORE UPDATE ON projects FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
CREATE TRIGGER set_timestamp_issue_states BEFORE UPDATE ON issue_states FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
CREATE TRIGGER set_timestamp_cycles BEFORE UPDATE ON cycles FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
CREATE TRIGGER set_timestamp_modules BEFORE UPDATE ON modules FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
CREATE TRIGGER set_timestamp_epics BEFORE UPDATE ON epics FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
CREATE TRIGGER set_timestamp_work_items BEFORE UPDATE ON work_items FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
CREATE TRIGGER set_timestamp_pages BEFORE UPDATE ON pages FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
CREATE TRIGGER set_timestamp_stickies BEFORE UPDATE ON stickies FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
CREATE TRIGGER set_timestamp_comments BEFORE UPDATE ON comments FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

CREATE OR REPLACE FUNCTION generate_work_item_identifier() RETURNS TRIGGER AS $$
DECLARE project_ident TEXT; next_val INT;
BEGIN
  SELECT identifier INTO project_ident FROM projects WHERE id = NEW.project_id;
  SELECT COALESCE(MAX(CAST(split_part(identifier, '-', 2) AS INTEGER)), 0) + 1 INTO next_val 
  FROM work_items WHERE project_id = NEW.project_id;
  NEW.identifier := project_ident || '-' || next_val;
  RETURN NEW;
END; $$ LANGUAGE plpgsql;

CREATE TRIGGER tr_generate_work_item_identifier BEFORE INSERT ON work_items
FOR EACH ROW WHEN (NEW.identifier IS NULL OR NEW.identifier = '') EXECUTE PROCEDURE generate_work_item_identifier();

CREATE OR REPLACE FUNCTION handle_new_user() RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, avatar_url)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)), NEW.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END; $$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE PROCEDURE handle_new_user();

-- =====================================================
-- 11. SECURITY (RLS Policies)
-- =====================================================

-- helper: drop all policies
DO $$ 
DECLARE r RECORD;
BEGIN
    FOR r IN (SELECT policyname, tablename FROM pg_policies WHERE schemaname = 'public') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON ' || quote_ident(r.tablename);
    END LOOP;
END $$;

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE issue_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_labels ENABLE ROW LEVEL SECURITY;
ALTER TABLE cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE epics ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_item_relations ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE stickies ENABLE ROW LEVEL SECURITY;
ALTER TABLE quick_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- 11.1 Profiles
CREATE POLICY "profiles_read_all" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING (auth.uid() = id);

-- 11.2 Workspaces (EXPLICIT ALIAS wm TO AVOID user_id AMBIGUITY)
CREATE POLICY "workspaces_read_member" ON workspaces FOR SELECT 
  USING (EXISTS (SELECT 1 FROM workspace_members wm WHERE wm.workspace_id = id AND wm.user_id = auth.uid()));
CREATE POLICY "workspaces_all_admin" ON workspaces FOR ALL 
  USING (owner_id = auth.uid() OR EXISTS (SELECT 1 FROM workspace_members wm WHERE wm.workspace_id = id AND wm.user_id = auth.uid() AND wm.role = 'admin'));

-- 11.3 Workspace Members
CREATE POLICY "workspace_members_read_shared" ON workspace_members FOR SELECT 
  USING (workspace_id IN (SELECT wm.workspace_id FROM workspace_members wm WHERE wm.user_id = auth.uid()));

-- 11.4 Projects
CREATE POLICY "projects_read_ws_member" ON projects FOR SELECT 
  USING (EXISTS (SELECT 1 FROM workspace_members wm WHERE wm.workspace_id = workspace_id AND wm.user_id = auth.uid()));
CREATE POLICY "projects_all_admin" ON projects FOR ALL 
  USING (EXISTS (SELECT 1 FROM project_members pm WHERE pm.project_id = id AND pm.user_id = auth.uid() AND pm.role = 'admin'));

-- 11.5 Project Members
CREATE POLICY "project_members_read_member" ON project_members FOR SELECT 
  USING (project_id IN (SELECT pm.project_id FROM project_members pm WHERE pm.user_id = auth.uid()));

-- 11.6 Work Items
CREATE POLICY "work_items_read_member" ON work_items FOR SELECT 
  USING (EXISTS (SELECT 1 FROM project_members pm WHERE pm.project_id = project_id AND pm.user_id = auth.uid()));
CREATE POLICY "work_items_all_member" ON work_items FOR ALL 
  USING (EXISTS (SELECT 1 FROM project_members pm WHERE pm.project_id = project_id AND pm.user_id = auth.uid()));

-- 11.7 Stickies (Private)
CREATE POLICY "stickies_all_own" ON stickies FOR ALL USING (user_id = auth.uid());

-- 11.8 Planning (Epics, Cycles, Modules)
CREATE POLICY "cycles_read_member" ON cycles FOR SELECT USING (EXISTS (SELECT 1 FROM project_members pm WHERE pm.project_id = project_id AND pm.user_id = auth.uid()));
CREATE POLICY "modules_read_member" ON modules FOR SELECT USING (EXISTS (SELECT 1 FROM project_members pm WHERE pm.project_id = project_id AND pm.user_id = auth.uid()));
CREATE POLICY "epics_read_member" ON epics FOR SELECT USING (EXISTS (SELECT 1 FROM project_members pm WHERE pm.project_id = project_id AND pm.user_id = auth.uid()));

CREATE POLICY "cycles_all_member" ON cycles FOR ALL USING (EXISTS (SELECT 1 FROM project_members pm WHERE pm.project_id = project_id AND pm.user_id = auth.uid()));
CREATE POLICY "modules_all_member" ON modules FOR ALL USING (EXISTS (SELECT 1 FROM project_members pm WHERE pm.project_id = project_id AND pm.user_id = auth.uid()));
CREATE POLICY "epics_all_member" ON epics FOR ALL USING (EXISTS (SELECT 1 FROM project_members pm WHERE pm.project_id = project_id AND pm.user_id = auth.uid()));

-- 11.9 Knowledge Base (Pages)
CREATE POLICY "pages_read_member" ON pages FOR SELECT USING (EXISTS (SELECT 1 FROM project_members pm WHERE pm.project_id = project_id AND pm.user_id = auth.uid()));
CREATE POLICY "pages_all_member" ON pages FOR ALL USING (EXISTS (SELECT 1 FROM project_members pm WHERE pm.project_id = project_id AND pm.user_id = auth.uid()));

-- 11.10 Meta (States, Labels)
CREATE POLICY "states_read_member" ON issue_states FOR SELECT USING (EXISTS (SELECT 1 FROM project_members pm WHERE pm.project_id = project_id AND pm.user_id = auth.uid()));
CREATE POLICY "labels_read_member" ON project_labels FOR SELECT USING (EXISTS (SELECT 1 FROM project_members pm WHERE pm.project_id = project_id AND pm.user_id = auth.uid()));

-- 11.11 Collaboration (Comments)
CREATE POLICY "comments_read_all" ON comments FOR SELECT USING (true);
CREATE POLICY "comments_all_own" ON comments FOR ALL USING (created_by_id = auth.uid());

-- =====================================================
-- 12. PERFORMANCE (Indexes)
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_work_items_project_id ON work_items(project_id);
CREATE INDEX IF NOT EXISTS idx_work_items_title_trgm ON work_items USING gin (title gin_trgm_ops);

-- =====================================================
-- 13. REALTIME REPLICATION
-- =====================================================
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime FOR TABLE work_items, comments, issue_states, projects, pages, stickies, cycles, modules, epics;
COMMIT;
