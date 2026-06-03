import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const ADMIN_EMAIL = "deborahwinkelmolen@outlook.com";

const reservationInput = z.object({
  packageName: z.enum(["Sparkle", "Glamour", "Celebration"]),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Ongeldige datum"),
  time: z.string().min(1).max(10),
  groupSize: z.number().int().min(1).max(12),
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(6).max(30),
  notes: z.string().trim().max(500).optional(),
});

export const createReservation = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => reservationInput.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: row, error } = await supabaseAdmin
      .from("reservations")
      .insert({
        package_name: data.packageName,
        reservation_date: data.date,
        reservation_time: data.time,
        group_size: data.groupSize,
        name: data.name,
        email: data.email,
        phone: data.phone,
        notes: data.notes ?? null,
        status: "pending",
      })
      .select()
      .single();

    if (error || !row) {
      console.error("createReservation insert failed", error);
      throw new Error("Reservering kon niet worden opgeslagen.");
    }

    // Email confirmation is sent from the /lovable/email/transactional/send route
    // (wired up after the email domain is verified).

    return { id: row.id };
  });

export const listReservations = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data: isAdmin } = await supabase.rpc("has_role", {
      _user_id: userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Forbidden");

    const { data, error } = await supabase
      .from("reservations")
      .select("*")
      .order("reservation_date", { ascending: false })
      .limit(500);

    if (error) throw new Error(error.message);
    return { reservations: data ?? [] };
  });

export const updateReservationStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({
      id: z.string().uuid(),
      status: z.enum(["pending", "confirmed", "cancelled", "completed"]),
    }).parse(input)
  )
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { error } = await supabase
      .from("reservations")
      .update({ status: data.status })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteReservation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { error } = await supabase.from("reservations").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/**
 * Grants the calling user the `admin` role if their email matches the
 * configured admin email. Idempotent — safe to call every time the admin
 * logs in.
 */
export const ensureAdminBootstrap = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId, claims } = context;
    const email = typeof claims.email === "string" ? claims.email.toLowerCase() : "";
    if (email !== ADMIN_EMAIL.toLowerCase()) {
      return { granted: false };
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("user_roles")
      .upsert({ user_id: userId, role: "admin" }, { onConflict: "user_id,role" });
    if (error) {
      console.error("ensureAdminBootstrap failed", error);
      return { granted: false };
    }

    // Force the next has_role check to see the fresh row
    void supabase;
    return { granted: true };
  });
