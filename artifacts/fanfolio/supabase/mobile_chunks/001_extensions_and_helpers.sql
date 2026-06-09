-- ============================================================
-- 001 — Extensions and Helper Functions
-- Depends on: nothing
-- Run this first.
-- ============================================================
-- set_updated_at() is used by the trigger on public.assets.
-- CREATE OR REPLACE makes this fully idempotent.

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
