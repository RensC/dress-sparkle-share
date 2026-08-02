CREATE TABLE public.blocked_slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  blocked_date date NOT NULL,
  time_slot text,
  reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX blocked_slots_unique_day ON public.blocked_slots (blocked_date) WHERE time_slot IS NULL;
CREATE UNIQUE INDEX blocked_slots_unique_slot ON public.blocked_slots (blocked_date, time_slot) WHERE time_slot IS NOT NULL;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.blocked_slots TO authenticated;
GRANT ALL ON public.blocked_slots TO service_role;

ALTER TABLE public.blocked_slots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view blocked slots" ON public.blocked_slots FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can create blocked slots" ON public.blocked_slots FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update blocked slots" ON public.blocked_slots FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete blocked slots" ON public.blocked_slots FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_blocked_slots_updated_at BEFORE UPDATE ON public.blocked_slots FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();