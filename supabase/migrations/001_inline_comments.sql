-- =====================================================
-- AERO Database Migration: Inline Page Comments
-- Run this in the Supabase SQL Editor
-- =====================================================

-- =====================================================
-- 1. ADD NEW COLUMNS TO COMMENTS TABLE
-- =====================================================

-- Add 'page' to entity_type check constraint
ALTER TABLE comments DROP CONSTRAINT IF EXISTS comments_entity_type_check;
ALTER TABLE comments ADD CONSTRAINT comments_entity_type_check 
    CHECK (entity_type IN ('work-item', 'epic', 'epic-update', 'project-update', 'page'));

-- Add parent_id for threaded replies
ALTER TABLE comments ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES comments(id) ON DELETE CASCADE;

-- Add quote field for storing selected text in inline comments
ALTER TABLE comments ADD COLUMN IF NOT EXISTS quote TEXT;

-- Add resolved_at timestamp for thread resolution
ALTER TABLE comments ADD COLUMN IF NOT EXISTS resolved_at TIMESTAMPTZ;

-- Add resolved_by user reference  
ALTER TABLE comments ADD COLUMN IF NOT EXISTS resolved_by UUID REFERENCES profiles(id);

-- Add attachments array for comment attachments
ALTER TABLE comments ADD COLUMN IF NOT EXISTS attachments TEXT[] DEFAULT '{}';

-- =====================================================
-- 2. ADD INDEXES FOR PERFORMANCE
-- =====================================================

-- Index for parent_id to speed up threaded comment queries
CREATE INDEX IF NOT EXISTS idx_comments_parent ON comments(parent_id);

-- Index for resolved comments filtering
CREATE INDEX IF NOT EXISTS idx_comments_resolved ON comments(resolved_at) WHERE resolved_at IS NOT NULL;

-- =====================================================
-- 3. UPDATE PAGES TABLE (if needed)
-- =====================================================

-- Add fields for page sharing and publishing (if not already present)
ALTER TABLE pages ADD COLUMN IF NOT EXISTS is_locked BOOLEAN DEFAULT FALSE;
ALTER TABLE pages ADD COLUMN IF NOT EXISTS full_width BOOLEAN DEFAULT FALSE;
ALTER TABLE pages ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;
ALTER TABLE pages ADD COLUMN IF NOT EXISTS last_edited_by_id UUID REFERENCES profiles(id);
ALTER TABLE pages ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ;
ALTER TABLE pages ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ;
ALTER TABLE pages ADD COLUMN IF NOT EXISTS public_url_slug TEXT;

-- Add workspace_id for wiki pages (pages not tied to a project)
ALTER TABLE pages ALTER COLUMN project_id DROP NOT NULL;
ALTER TABLE pages ADD COLUMN IF NOT EXISTS workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE;

-- Add sharing settings 
ALTER TABLE pages ADD COLUMN IF NOT EXISTS shared_with JSONB DEFAULT '[]';
-- Format: [{ "userId": "uuid", "permission": "view" | "edit" }]

-- Add version tracking
ALTER TABLE pages ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1;

-- =====================================================
-- 4. CREATE PAGE_VERSIONS TABLE FOR VERSION HISTORY
-- =====================================================

CREATE TABLE IF NOT EXISTS page_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_id UUID NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content JSONB,
    version_number INTEGER NOT NULL,
    created_by_id UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(page_id, version_number)
);

-- Index for version history queries
CREATE INDEX IF NOT EXISTS idx_page_versions_page ON page_versions(page_id);

-- Enable RLS
ALTER TABLE page_versions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for page_versions
CREATE POLICY "View page versions" ON page_versions FOR SELECT 
    USING (page_id IN (
        SELECT id FROM pages WHERE 
            project_id IN (SELECT project_id FROM project_members WHERE user_id = auth.uid())
            OR workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid())
            OR created_by_id = auth.uid()
    ));

CREATE POLICY "Create page versions" ON page_versions FOR INSERT 
    WITH CHECK (page_id IN (
        SELECT id FROM pages WHERE 
            project_id IN (SELECT project_id FROM project_members WHERE user_id = auth.uid())
            OR workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid())
            OR created_by_id = auth.uid()
    ));

-- =====================================================
-- 5. UPDATE PAGES RLS POLICIES FOR WORKSPACE PAGES
-- =====================================================

-- Drop existing policies and recreate with workspace support
DROP POLICY IF EXISTS "Project members can view pages" ON pages;
DROP POLICY IF EXISTS "Project members can manage pages" ON pages;

CREATE POLICY "Members can view pages" ON pages FOR SELECT 
    USING (
        -- Project pages
        (project_id IS NOT NULL AND project_id IN (SELECT project_id FROM project_members WHERE user_id = auth.uid()))
        OR
        -- Workspace pages (wiki)
        (workspace_id IS NOT NULL AND workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()))
        OR
        -- Own private pages
        created_by_id = auth.uid()
        OR
        -- Published/public pages
        is_published = true
        OR
        -- Shared with user
        shared_with @> ('[{"userId": "' || auth.uid()::text || '"}]')::jsonb
    );

CREATE POLICY "Members can create pages" ON pages FOR INSERT 
    WITH CHECK (
        (project_id IS NOT NULL AND project_id IN (SELECT project_id FROM project_members WHERE user_id = auth.uid()))
        OR
        (workspace_id IS NOT NULL AND workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()))
    );

CREATE POLICY "Members can update pages" ON pages FOR UPDATE 
    USING (
        (project_id IS NOT NULL AND project_id IN (SELECT project_id FROM project_members WHERE user_id = auth.uid()))
        OR
        (workspace_id IS NOT NULL AND workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()))
        OR
        created_by_id = auth.uid()
    );

CREATE POLICY "Members can delete pages" ON pages FOR DELETE 
    USING (
        (project_id IS NOT NULL AND project_id IN (SELECT project_id FROM project_members WHERE user_id = auth.uid() AND role = 'admin'))
        OR
        (workspace_id IS NOT NULL AND workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid() AND role = 'admin'))
        OR
        created_by_id = auth.uid()
    );

-- =====================================================
-- 6. ADD TRIGGER FOR PAGE VERSION AUTO-CREATION
-- =====================================================

CREATE OR REPLACE FUNCTION create_page_version()
RETURNS TRIGGER AS $$
BEGIN
    -- Only create version if content actually changed
    IF OLD.content IS DISTINCT FROM NEW.content THEN
        INSERT INTO page_versions (page_id, title, content, version_number, created_by_id)
        VALUES (NEW.id, OLD.title, OLD.content, OLD.version, NEW.last_edited_by_id);
        
        NEW.version = OLD.version + 1;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS pages_version_trigger ON pages;
CREATE TRIGGER pages_version_trigger 
    BEFORE UPDATE ON pages 
    FOR EACH ROW 
    WHEN (OLD.content IS DISTINCT FROM NEW.content)
    EXECUTE FUNCTION create_page_version();

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================
DO $$
BEGIN
    RAISE NOTICE '✅ AERO Inline Comments Migration completed successfully!';
    RAISE NOTICE 'Changes made:';
    RAISE NOTICE '  - Added parent_id, quote, resolved_at, resolved_by, attachments to comments table';
    RAISE NOTICE '  - Updated entity_type check to include "page" and "project-update"';
    RAISE NOTICE '  - Added workspace_id, sharing, and versioning fields to pages table';
    RAISE NOTICE '  - Created page_versions table for version history';
    RAISE NOTICE '  - Updated RLS policies for workspace pages support';
END $$;
