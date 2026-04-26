-- Migration: create testimonials table
-- Run this once against your Neon Postgres database

CREATE TABLE IF NOT EXISTS public.testimonials (
  id bigserial PRIMARY KEY,
  user_id text NULL, -- Optional, if user is logged in
  name text NOT NULL,
  content text NOT NULL,
  rating integer NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  is_approved boolean NOT NULL DEFAULT false, -- Admin must approve before showing
  created_at timestamptz NOT NULL DEFAULT now(),
  avatar_url text NULL
);

-- Index for fast retrieval of approved testimonials
CREATE INDEX IF NOT EXISTS idx_testimonials_approved ON public.testimonials(is_approved, created_at DESC);
