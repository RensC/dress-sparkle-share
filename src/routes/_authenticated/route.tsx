import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { ensureAdminBootstrap } from "@/lib/reservations.functions";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/auth" });

    // Idempotent: grants the admin role to the configured admin email.
    try {
      await ensureAdminBootstrap();
    } catch (e) {
      console.error("ensureAdminBootstrap failed", e);
    }

    return { user: data.user };
  },
  component: () => <Outlet />,
});
