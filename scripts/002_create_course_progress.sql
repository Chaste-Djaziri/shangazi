-- Migration: create course_progress and module_progress tables
-- Run this once against your Neon Postgres database

CREATE TABLE IF NOT EXISTS public.course_progress (
  id bigserial PRIMARY KEY,
  user_id text NOT NULL,
  course_slug text NOT NULL,
  started_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz NULL,
  last_module_slug text NULL,
  UNIQUE(user_id, course_slug)
);

CREATE TABLE IF NOT EXISTS public.module_progress (
  id bigserial PRIMARY KEY,
  user_id text NOT NULL,
  course_slug text NOT NULL,
  module_slug text NOT NULL,
  completed boolean NOT NULL DEFAULT false,
  completed_at timestamptz NULL,
  UNIQUE(user_id, course_slug, module_slug)
);

-- Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_course_progress_user ON public.course_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_module_progress_user_course ON public.module_progress(user_id, course_slug);
