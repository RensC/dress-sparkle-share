import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const ADMIN_EMAILS = ["deborahwinkelmolen@outlook.com", "renscaris@gmail.com"];

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

    // Send confirmation emails (customer + admin). Failures do not block the booking.
    try {
      const { sendEmail, ADMIN_NOTIFICATION_ADDRESS, escapeHtml } = await import(
        "@/lib/email.server"
      );

      const formattedDate = new Date(data.date).toLocaleDateString("nl-NL", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      const detailsHtml = `
        <table style="width:100%;border-collapse:collapse;font-family:Arial,sans-serif;">
          <tr><td style="padding:6px 0;"><strong>Pakket:</strong></td><td>${escapeHtml(data.packageName)}</td></tr>
          <tr><td style="padding:6px 0;"><strong>Datum:</strong></td><td>${escapeHtml(formattedDate)}</td></tr>
          <tr><td style="padding:6px 0;"><strong>Tijd:</strong></td><td>${escapeHtml(data.time)}</td></tr>
          <tr><td style="padding:6px 0;"><strong>Groepsgrootte:</strong></td><td>${data.groupSize} personen</td></tr>
          <tr><td style="padding:6px 0;"><strong>Naam:</strong></td><td>${escapeHtml(data.name)}</td></tr>
          <tr><td style="padding:6px 0;"><strong>E-mail:</strong></td><td>${escapeHtml(data.email)}</td></tr>
          <tr><td style="padding:6px 0;"><strong>Telefoon:</strong></td><td>${escapeHtml(data.phone)}</td></tr>
          ${data.notes ? `<tr><td style="padding:6px 0;vertical-align:top;"><strong>Opmerkingen:</strong></td><td>${escapeHtml(data.notes)}</td></tr>` : ""}
        </table>
      `;

      await sendEmail({
        to: data.email,
        subject: "Je funfitting-aanvraag is ontvangen — Dressperience",
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#1f1f1f;">
            <h2 style="color:#9b72cf;margin:0 0 16px;">Bedankt voor je reservering, ${escapeHtml(data.name)}!</h2>
            <p>We hebben je aanvraag ontvangen en bevestigen deze binnen 24 uur per e-mail.</p>
            <div style="background:#f8e8ee;padding:16px;border-radius:8px;margin:16px 0;">${detailsHtml}</div>
            <p>Locatie: Heerbaan 54, 6061 EE Posterholt</p>
            <p style="margin-top:24px;">Met liefdevolle groet,<br/>Team Dressperience</p>
          </div>
        `,
      });

      await sendEmail({
        to: ADMIN_NOTIFICATION_ADDRESS,
        subject: `Nieuwe reservering: ${data.packageName} — ${data.name}`,
        replyTo: data.email,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#1f1f1f;">
            <h2 style="color:#9b72cf;margin:0 0 16px;">Nieuwe reservering</h2>
            ${detailsHtml}
            <p style="margin-top:24px;"><a href="https://dressperience.com/admin">Beheer reserveringen →</a></p>
          </div>
        `,
      });
    } catch (mailErr) {
      console.error("reservation email send failed", mailErr);
    }

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
    if (!ADMIN_EMAILS.map((e) => e.toLowerCase()).includes(email)) {
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
