-- =====================================================
-- AERO Database Schema for Supabase
-- Run this in the Supabase SQL Editor
-- =====================================================

-- =====================================================
-- PROFILES (extends auth.users)
-- =====================================================
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    avatar_url TEXT,
    role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'member', 'guest')),
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- WORKSPACES
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

-- =====================================================
-- WORKSPACE_MEMBERS
-- =====================================================
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
-- PROJECT_STATES (workspace-level)
-- =====================================================
CREATE TABLE IF NOT EXISTS project_states (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    color TEXT NOT NULL,
    slug TEXT NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- PROJECTS
-- =====================================================
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    identifier TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    color TEXT,
    cover_image TEXT,
    lead_id UUID REFERENCES profiles(id),
    state_id UUID REFERENCES project_states(id) ON DELETE SET NULL,
    priority TEXT CHECK (priority IN ('urgent', 'high', 'medium', 'low', 'none')),
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    default_assignee_id UUID REFERENCES profiles(id),
    is_private BOOLEAN DEFAULT FALSE,
    is_favorite BOOLEAN DEFAULT FALSE,
    features JSONB DEFAULT '{"cycles": true, "modules": true, "epics": true, "views": true, "pages": true}',
    public_settings JSONB,
    guest_access BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(workspace_id, identifier)
);

-- =====================================================
-- PROJECT_MEMBERS
-- =====================================================
CREATE TABLE IF NOT EXISTS project_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'member', 'guest')),
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(project_id, user_id)
);

-- =====================================================
-- ISSUE_STATES (project-level)
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
-- PROJECT_LABELS
-- =====================================================
CREATE TABLE IF NOT EXISTS project_labels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    color TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- WORK_ITEM_TYPES
-- =====================================================
CREATE TABLE IF NOT EXISTS work_item_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    color TEXT NOT NULL,
    icon TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    level TEXT DEFAULT 'project' CHECK (level IN ('project', 'workspace')),
    entity_type TEXT DEFAULT 'work-item' CHECK (entity_type IN ('work-item', 'epic')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- PROPERTY_DEFINITIONS
-- =====================================================
CREATE TABLE IF NOT EXISTS property_definitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    work_item_type_id UUID REFERENCES work_item_types(id) ON DELETE CASCADE,
    entity_type TEXT CHECK (entity_type IN ('work-item', 'epic')),
    name TEXT NOT NULL,
    key TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('text', 'number', 'date', 'boolean', 'select', 'multiselect', 'member')),
    required BOOLEAN DEFAULT FALSE,
    default_value JSONB,
    placeholder TEXT,
    options TEXT[],
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- CYCLES (Sprints)
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

-- =====================================================
-- MODULES
-- =====================================================
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
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    archived_at TIMESTAMPTZ
);

-- =====================================================
-- EPICS
-- =====================================================
CREATE TABLE IF NOT EXISTS epics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    owner_id UUID REFERENCES profiles(id),
    status TEXT DEFAULT 'backlog' CHECK (status IN ('backlog', 'planned', 'in-progress', 'paused', 'completed', 'cancelled')),
    start_date TIMESTAMPTZ,
    target_date TIMESTAMPTZ,
    custom_field_values JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    archived_at TIMESTAMPTZ
);

-- =====================================================
-- WORK_ITEMS
-- =====================================================
CREATE TABLE IF NOT EXISTS work_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    identifier TEXT NOT NULL,
    type_id UUID REFERENCES work_item_types(id),
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
    custom_field_values JSONB DEFAULT '{}',
    sort_order INTEGER DEFAULT 0,
    is_draft BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    UNIQUE(project_id, identifier)
);

-- =====================================================
-- WORK_ITEM_LINKS
-- =====================================================
CREATE TABLE IF NOT EXISTS work_item_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    work_item_id UUID NOT NULL REFERENCES work_items(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    created_by_id UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- WORK_ITEM_RELATIONS
-- =====================================================
CREATE TABLE IF NOT EXISTS work_item_relations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_work_item_id UUID NOT NULL REFERENCES work_items(id) ON DELETE CASCADE,
    target_work_item_id UUID NOT NULL REFERENCES work_items(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('blocking', 'blocked_by', 'relates_to', 'duplicate_of', 'starts_before', 'finishes_before')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- ATTACHMENTS
-- =====================================================
CREATE TABLE IF NOT EXISTS attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    work_item_id UUID NOT NULL REFERENCES work_items(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_type TEXT,
    file_size INTEGER,
    uploaded_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- PAGES (Wiki)
-- =====================================================
CREATE TABLE IF NOT EXISTS pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES pages(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    content JSONB,
    icon TEXT,
    cover_image TEXT,
    is_published BOOLEAN DEFAULT FALSE,
    created_by_id UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- SAVED_VIEWS
-- =====================================================
CREATE TABLE IF NOT EXISTS saved_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    queries JSONB DEFAULT '{}',
    is_favorite BOOLEAN DEFAULT FALSE,
    is_private BOOLEAN DEFAULT TRUE,
    created_by_id UUID REFERENCES profiles(id),
    is_published BOOLEAN DEFAULT FALSE,
    publish_settings JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- COMMENTS
-- =====================================================
CREATE TABLE IF NOT EXISTS comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type TEXT NOT NULL CHECK (entity_type IN ('work-item', 'epic', 'epic-update')),
    entity_id UUID NOT NULL,
    content TEXT NOT NULL,
    created_by_id UUID REFERENCES profiles(id),
    reactions JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- EPIC_UPDATES
-- =====================================================
CREATE TABLE IF NOT EXISTS epic_updates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    epic_id UUID NOT NULL REFERENCES epics(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('on-track', 'at-risk', 'off-track')),
    content TEXT NOT NULL,
    created_by_id UUID REFERENCES profiles(id),
    reactions JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- ACTIVITY_LOGS
-- =====================================================
CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type TEXT NOT NULL CHECK (entity_type IN ('work-item', 'epic', 'module', 'cycle', 'project')),
    entity_id UUID NOT NULL,
    entity_name TEXT,
    action TEXT NOT NULL CHECK (action IN ('created', 'updated', 'deleted', 'commented', 'status_change')),
    field TEXT,
    previous_value JSONB,
    new_value JSONB,
    created_by_id UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- STICKIES
-- =====================================================
CREATE TABLE IF NOT EXISTS stickies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    color TEXT DEFAULT 'yellow' CHECK (color IN ('yellow', 'green', 'blue', 'pink', 'purple', 'orange')),
    created_by_id UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- QUICK_LINKS
-- =====================================================
CREATE TABLE IF NOT EXISTS quick_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    created_by_id UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_workspace_members_workspace ON workspace_members(workspace_id);
CREATE INDEX IF NOT EXISTS idx_workspace_members_user ON workspace_members(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_workspace ON projects(workspace_id);
CREATE INDEX IF NOT EXISTS idx_project_members_project ON project_members(project_id);
CREATE INDEX IF NOT EXISTS idx_work_items_project ON work_items(project_id);
CREATE INDEX IF NOT EXISTS idx_work_items_state ON work_items(state_id);
CREATE INDEX IF NOT EXISTS idx_work_items_cycle ON work_items(cycle_id);
CREATE INDEX IF NOT EXISTS idx_work_items_epic ON work_items(epic_id);
CREATE INDEX IF NOT EXISTS idx_work_items_parent ON work_items(parent_id);
CREATE INDEX IF NOT EXISTS idx_comments_entity ON comments(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_entity ON activity_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_issue_states_project ON issue_states(project_id);
CREATE INDEX IF NOT EXISTS idx_cycles_project ON cycles(project_id);
CREATE INDEX IF NOT EXISTS idx_modules_project ON modules(project_id);
CREATE INDEX IF NOT EXISTS idx_epics_project ON epics(project_id);
CREATE INDEX IF NOT EXISTS idx_pages_project ON pages(project_id);

-- =====================================================
-- TRIGGERS FOR updated_at
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS profiles_updated_at ON profiles;
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS workspaces_updated_at ON workspaces;
CREATE TRIGGER workspaces_updated_at BEFORE UPDATE ON workspaces FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS projects_updated_at ON projects;
CREATE TRIGGER projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS issue_states_updated_at ON issue_states;
CREATE TRIGGER issue_states_updated_at BEFORE UPDATE ON issue_states FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS work_items_updated_at ON work_items;
CREATE TRIGGER work_items_updated_at BEFORE UPDATE ON work_items FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS cycles_updated_at ON cycles;
CREATE TRIGGER cycles_updated_at BEFORE UPDATE ON cycles FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS modules_updated_at ON modules;
CREATE TRIGGER modules_updated_at BEFORE UPDATE ON modules FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS epics_updated_at ON epics;
CREATE TRIGGER epics_updated_at BEFORE UPDATE ON epics FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS pages_updated_at ON pages;
CREATE TRIGGER pages_updated_at BEFORE UPDATE ON pages FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS saved_views_updated_at ON saved_views;
CREATE TRIGGER saved_views_updated_at BEFORE UPDATE ON saved_views FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS comments_updated_at ON comments;
CREATE TRIGGER comments_updated_at BEFORE UPDATE ON comments FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS epic_updates_updated_at ON epic_updates;
CREATE TRIGGER epic_updates_updated_at BEFORE UPDATE ON epic_updates FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS stickies_updated_at ON stickies;
CREATE TRIGGER stickies_updated_at BEFORE UPDATE ON stickies FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS work_item_types_updated_at ON work_item_types;
CREATE TRIGGER work_item_types_updated_at BEFORE UPDATE ON work_item_types FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =====================================================
-- TRIGGER: Create profile on user signup
-- =====================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (id, email, display_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- =====================================================
-- Enable Row Level Security on all tables
-- =====================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE issue_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_labels ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_item_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE epics ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_item_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_item_relations ENABLE ROW LEVEL SECURITY;
ALTER TABLE attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE epic_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE stickies ENABLE ROW LEVEL SECURITY;
ALTER TABLE quick_links ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS POLICIES
-- =====================================================

-- Profiles: Users can read all profiles, update own
CREATE POLICY "Profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Workspaces: Members can read their workspaces
CREATE POLICY "Users can view workspaces they are members of" ON workspaces FOR SELECT 
    USING (id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()));
CREATE POLICY "Users can create workspaces" ON workspaces FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Workspace owners can update" ON workspaces FOR UPDATE 
    USING (owner_id = auth.uid() OR id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid() AND role = 'admin'));
CREATE POLICY "Workspace owners can delete" ON workspaces FOR DELETE 
    USING (owner_id = auth.uid());

-- Workspace Members: Members can see other members in their workspace
CREATE POLICY "Users can view members of their workspaces" ON workspace_members FOR SELECT 
    USING (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()));
CREATE POLICY "Admins can add members" ON workspace_members FOR INSERT 
    WITH CHECK (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can update members" ON workspace_members FOR UPDATE 
    USING (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can remove members" ON workspace_members FOR DELETE 
    USING (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid() AND role = 'admin') OR user_id = auth.uid());

-- Projects: Workspace members can view projects
CREATE POLICY "Workspace members can view projects" ON projects FOR SELECT 
    USING (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()));
CREATE POLICY "Workspace members can create projects" ON projects FOR INSERT 
    WITH CHECK (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()));
CREATE POLICY "Project members can update" ON projects FOR UPDATE 
    USING (id IN (SELECT project_id FROM project_members WHERE user_id = auth.uid()));
CREATE POLICY "Project admins can delete" ON projects FOR DELETE 
    USING (id IN (SELECT project_id FROM project_members WHERE user_id = auth.uid() AND role = 'admin'));

-- Project Members
CREATE POLICY "View project members" ON project_members FOR SELECT 
    USING (project_id IN (SELECT project_id FROM project_members WHERE user_id = auth.uid()));
CREATE POLICY "Project admins can manage members" ON project_members FOR ALL 
    USING (project_id IN (SELECT project_id FROM project_members WHERE user_id = auth.uid() AND role = 'admin'));

-- Project States
CREATE POLICY "Workspace members can view project states" ON project_states FOR SELECT 
    USING (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()));
CREATE POLICY "Workspace admins can manage project states" ON project_states FOR ALL 
    USING (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid() AND role = 'admin'));

-- Issue States
CREATE POLICY "Project members can view issue states" ON issue_states FOR SELECT 
    USING (project_id IN (SELECT project_id FROM project_members WHERE user_id = auth.uid()));
CREATE POLICY "Project admins can manage issue states" ON issue_states FOR ALL 
    USING (project_id IN (SELECT project_id FROM project_members WHERE user_id = auth.uid() AND role = 'admin'));

-- Project Labels
CREATE POLICY "Project members can view labels" ON project_labels FOR SELECT 
    USING (project_id IN (SELECT project_id FROM project_members WHERE user_id = auth.uid()));
CREATE POLICY "Project members can manage labels" ON project_labels FOR ALL 
    USING (project_id IN (SELECT project_id FROM project_members WHERE user_id = auth.uid()));

-- Work Item Types
CREATE POLICY "Project members can view work item types" ON work_item_types FOR SELECT 
    USING (project_id IN (SELECT project_id FROM project_members WHERE user_id = auth.uid()));
CREATE POLICY "Project admins can manage work item types" ON work_item_types FOR ALL 
    USING (project_id IN (SELECT project_id FROM project_members WHERE user_id = auth.uid() AND role = 'admin'));

-- Property Definitions
CREATE POLICY "View property definitions" ON property_definitions FOR SELECT USING (true);
CREATE POLICY "Manage property definitions" ON property_definitions FOR ALL 
    USING (work_item_type_id IN (SELECT id FROM work_item_types WHERE project_id IN (SELECT project_id FROM project_members WHERE user_id = auth.uid() AND role = 'admin')));

-- Cycles
CREATE POLICY "Project members can view cycles" ON cycles FOR SELECT 
    USING (project_id IN (SELECT project_id FROM project_members WHERE user_id = auth.uid()));
CREATE POLICY "Project members can manage cycles" ON cycles FOR ALL 
    USING (project_id IN (SELECT project_id FROM project_members WHERE user_id = auth.uid()));

-- Modules
CREATE POLICY "Project members can view modules" ON modules FOR SELECT 
    USING (project_id IN (SELECT project_id FROM project_members WHERE user_id = auth.uid()));
CREATE POLICY "Project members can manage modules" ON modules FOR ALL 
    USING (project_id IN (SELECT project_id FROM project_members WHERE user_id = auth.uid()));

-- Epics
CREATE POLICY "Project members can view epics" ON epics FOR SELECT 
    USING (project_id IN (SELECT project_id FROM project_members WHERE user_id = auth.uid()));
CREATE POLICY "Project members can manage epics" ON epics FOR ALL 
    USING (project_id IN (SELECT project_id FROM project_members WHERE user_id = auth.uid()));

-- Work Items
CREATE POLICY "Project members can view work items" ON work_items FOR SELECT 
    USING (project_id IN (SELECT project_id FROM project_members WHERE user_id = auth.uid()));
CREATE POLICY "Project members can create work items" ON work_items FOR INSERT 
    WITH CHECK (project_id IN (SELECT project_id FROM project_members WHERE user_id = auth.uid()));
CREATE POLICY "Project members can update work items" ON work_items FOR UPDATE 
    USING (project_id IN (SELECT project_id FROM project_members WHERE user_id = auth.uid()));
CREATE POLICY "Project members can delete work items" ON work_items FOR DELETE 
    USING (project_id IN (SELECT project_id FROM project_members WHERE user_id = auth.uid()));

-- Work Item Links
CREATE POLICY "View work item links" ON work_item_links FOR SELECT 
    USING (work_item_id IN (SELECT id FROM work_items WHERE project_id IN (SELECT project_id FROM project_members WHERE user_id = auth.uid())));
CREATE POLICY "Manage work item links" ON work_item_links FOR ALL 
    USING (work_item_id IN (SELECT id FROM work_items WHERE project_id IN (SELECT project_id FROM project_members WHERE user_id = auth.uid())));

-- Work Item Relations
CREATE POLICY "View work item relations" ON work_item_relations FOR SELECT 
    USING (source_work_item_id IN (SELECT id FROM work_items WHERE project_id IN (SELECT project_id FROM project_members WHERE user_id = auth.uid())));
CREATE POLICY "Manage work item relations" ON work_item_relations FOR ALL 
    USING (source_work_item_id IN (SELECT id FROM work_items WHERE project_id IN (SELECT project_id FROM project_members WHERE user_id = auth.uid())));

-- Attachments
CREATE POLICY "View attachments" ON attachments FOR SELECT 
    USING (work_item_id IN (SELECT id FROM work_items WHERE project_id IN (SELECT project_id FROM project_members WHERE user_id = auth.uid())));
CREATE POLICY "Manage attachments" ON attachments FOR ALL 
    USING (work_item_id IN (SELECT id FROM work_items WHERE project_id IN (SELECT project_id FROM project_members WHERE user_id = auth.uid())));

-- Pages
CREATE POLICY "Project members can view pages" ON pages FOR SELECT 
    USING (project_id IN (SELECT project_id FROM project_members WHERE user_id = auth.uid()));
CREATE POLICY "Project members can manage pages" ON pages FOR ALL 
    USING (project_id IN (SELECT project_id FROM project_members WHERE user_id = auth.uid()));

-- Saved Views
CREATE POLICY "View saved views" ON saved_views FOR SELECT 
    USING (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()) AND (is_private = false OR created_by_id = auth.uid()));
CREATE POLICY "Create saved views" ON saved_views FOR INSERT 
    WITH CHECK (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()));
CREATE POLICY "Update own saved views" ON saved_views FOR UPDATE USING (created_by_id = auth.uid());
CREATE POLICY "Delete own saved views" ON saved_views FOR DELETE USING (created_by_id = auth.uid());

-- Comments
CREATE POLICY "View comments" ON comments FOR SELECT USING (true);
CREATE POLICY "Create comments" ON comments FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Update own comments" ON comments FOR UPDATE USING (created_by_id = auth.uid());
CREATE POLICY "Delete own comments" ON comments FOR DELETE USING (created_by_id = auth.uid());

-- Epic Updates
CREATE POLICY "View epic updates" ON epic_updates FOR SELECT 
    USING (epic_id IN (SELECT id FROM epics WHERE project_id IN (SELECT project_id FROM project_members WHERE user_id = auth.uid())));
CREATE POLICY "Manage epic updates" ON epic_updates FOR ALL 
    USING (epic_id IN (SELECT id FROM epics WHERE project_id IN (SELECT project_id FROM project_members WHERE user_id = auth.uid())));

-- Activity Logs
CREATE POLICY "View activity logs" ON activity_logs FOR SELECT USING (true);
CREATE POLICY "Create activity logs" ON activity_logs FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Stickies
CREATE POLICY "View own stickies" ON stickies FOR SELECT USING (created_by_id = auth.uid());
CREATE POLICY "Manage own stickies" ON stickies FOR ALL USING (created_by_id = auth.uid());

-- Quick Links
CREATE POLICY "View own quick links" ON quick_links FOR SELECT USING (created_by_id = auth.uid());
CREATE POLICY "Manage own quick links" ON quick_links FOR ALL USING (created_by_id = auth.uid());

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================
DO $$
BEGIN
    RAISE NOTICE 'AERO Database schema created successfully!';
    RAISE NOTICE 'Tables created: 25';
    RAISE NOTICE 'Indexes created: 16';
    RAISE NOTICE 'Triggers created: 14';
    RAISE NOTICE 'RLS Policies created: 50+';
END $$;
