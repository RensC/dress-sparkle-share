ALTER TABLE public.reservations
  ADD COLUMN IF NOT EXISTS deposit_amount numeric(10,2) NOT NULL DEFAULT 50,
  ADD COLUMN IF NOT EXISTS payment_status text NOT NULL DEFAULT 'open',
  ADD COLUMN IF NOT EXISTS mollie_payment_id text;

CREATE INDEX IF NOT EXISTS reservations_mollie_payment_id_idx
  ON public.reservations (mollie_payment_id);