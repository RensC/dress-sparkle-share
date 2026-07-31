ALTER TABLE public.reservations
  ADD COLUMN IF NOT EXISTS extras jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS extras_total numeric(10,2) NOT NULL DEFAULT 0;