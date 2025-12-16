-- Migration: create blog_views table
-- Run this once against your Neon Postgres database

CREATE TABLE IF NOT EXISTS public.blog_views (
  id bigserial PRIMARY KEY,
  post_id text NOT NULL UNIQUE,
  views bigint NOT NULL DEFAULT 0,
  last_viewed timestamptz NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Index for fast ordering by views
CREATE INDEX IF NOT EXISTS idx_blog_views_views ON public.blog_views(views DESC);
