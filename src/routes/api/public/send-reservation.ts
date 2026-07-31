import { createFileRoute } from "@tanstack/react-router";
import { format, isValid, parseISO } from "date-fns";
import { nl } from "date-fns/locale";
import { z } from "zod";

const packageOptions = ["Sparkle", "Glamour", "VIP"] as const;
const timeSlots = ["10:00", "14:00", "19:00"] as const;

const schema = z.object({
  packageName: z.enum(packageOptions),

  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Ongeldige datum"),

  time: z.enum(timeSlots),

  groupSize: z
    .number()
    .int()
    .min(2, "De groep moet uit minimaal 2 personen bestaan")
    .max(6, "De groep mag uit maximaal 6 personen bestaan"),

  name: z
    .string()
    .trim()
    .min(1, "Naam is verplicht")
    .max(100, "Naam mag maximaal 100 tekens bevatten"),

  email: z
    .string()
    .trim()
    .email("Ongeldig e-mailadres")
    .max(255, "E-mailadres is te lang"),

  phone: z
    .string()
    .trim()
    .min(6, "Ongeldig telefoonnummer")
    .max(30, "Telefoonnummer is te lang"),

  notes: z
    .string()
    .trim()
    .max(500, "Opmerkingen mogen maximaal 500 tekens bevatten")
    .optional()
    .default(""),

  extras: z
    .array(
      z.object({
        id: z.string().max(50),
        name: z.string().max(100),
        quantity: z.number().int().min(1).max(10),
        variant: z.string().max(50).optional(),
        unitPrice: z.number().min(0).max(1000),
        total: z.number().min(0).max(10000),
      }),
    )
    .max(10)
    .optional()
    .default([]),
});

export const Route = createFileRoute(
  "/api/public/send-reservation",
)({
  server: {
    handlers: {
      OPTIONS: async () =>
        new Response(null, {
          status: 204,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
          },
        }),

      POST: async ({ request }) => {
        const corsHeaders = {
          "Access-Control-Allow-Origin": "*",
        };

        try {
          const json: unknown = await request.json();
          const parsed = schema.safeParse(json);

          if (!parsed.success) {
            return Response.json(
              {
                success: false,
                message:
                  parsed.error.issues[0]?.message ??
                  "Ongeldige invoer",
              },
              {
                status: 400,
                headers: corsHeaders,
              },
            );
          }

          const {
            packageName,
            date,
            time,
            groupSize,
            name,
            email,
            phone,
            notes,
            extras,
          } = parsed.data;

          const extrasTotalAmount = Number(
            extras.reduce((sum, item) => sum + item.total, 0).toFixed(2),
          );

          const formatEuroAmount = (value: number) =>
            `€${value.toFixed(2).replace(".", ",")}`;

          const reservationDate = parseISO(date);

          if (!isValid(reservationDate)) {
            return Response.json(
              {
                success: false,
                message: "Ongeldige datum",
              },
              {
                status: 400,
                headers: corsHeaders,
              },
            );
          }

          const today = new Date();
          today.setHours(0, 0, 0, 0);

          if (reservationDate < today) {
            return Response.json(
              {
                success: false,
                message:
                  "Je kunt geen reservering maken voor een datum in het verleden.",
              },
              {
                status: 400,
                headers: corsHeaders,
              },
            );
          }

          const { supabaseAdmin } = await import(
            "@/integrations/supabase/client.server"
          );

          // Slot must still be free (an already confirmed booking blocks it)
          const { data: existing, error: existingError } = await supabaseAdmin
            .from("reservations")
            .select("id")
            .eq("reservation_date", date)
            .eq("reservation_time", time)
            .in("status", ["pending", "confirmed"])
            .limit(1);

          if (existingError) {
            console.error("slot check failed", existingError);
          }

          if (existing && existing.length > 0) {
            return Response.json(
              {
                success: false,
                message:
                  "Dit tijdslot is helaas al gereserveerd. Kies een andere datum of tijd.",
              },
              { status: 409, headers: corsHeaders },
            );
          }

          const { error: insertError } = await supabaseAdmin
            .from("reservations")
            .insert({
              package_name: packageName,
              reservation_date: date,
              reservation_time: time,
              group_size: groupSize,
              name,
              email,
              phone,
              notes: notes || null,
              extras,
              extras_total: extrasTotalAmount,
              status: "pending",
            });

          if (insertError) {
            console.error("reservation insert failed", insertError);

            return Response.json(
              {
                success: false,
                message:
                  "De reservering kon niet worden opgeslagen. Probeer het opnieuw.",
              },
              { status: 500, headers: corsHeaders },
            );
          }

          // Emails must never block a saved reservation
          try {
          const {
            sendEmail,
            ADMIN_NOTIFICATION_ADDRESS,
            escapeHtml,
          } = await import("@/lib/email.server");



          const dateLabel = format(
            reservationDate,
            "EEEE d MMMM yyyy",
            {
              locale: nl,
            },
          );

          const safePackageName = escapeHtml(packageName);
          const safeDateLabel = escapeHtml(dateLabel);
          const safeTime = escapeHtml(time);
          const safeGroupSize = escapeHtml(String(groupSize));
          const safeName = escapeHtml(name);
          const safeEmail = escapeHtml(email);
          const safePhone = escapeHtml(phone);
          const safeNotes = escapeHtml(notes).replace(
            /\n/g,
            "<br />",
          );

          const extrasHtml = extras.length
            ? `
                  <p style="margin:12px 0 6px;">
                    <strong>Extra's:</strong>
                  </p>
                  <ul style="margin:0;padding-left:18px;">
                    ${extras
                      .map(
                        (item) =>
                          `<li style="margin-bottom:4px;">${escapeHtml(
                            `${item.quantity > 1 ? `${item.quantity}× ` : ""}${item.name}${
                              item.variant ? ` (${item.variant})` : ""
                            }`,
                          )} — ${escapeHtml(formatEuroAmount(item.total))}</li>`,
                      )
                      .join("")}
                  </ul>
                  <p style="margin:8px 0 0;">
                    <strong>Totaal extra's:</strong>
                    ${escapeHtml(formatEuroAmount(extrasTotalAmount))}
                  </p>
                `
            : "";

          /*
           * Notification for Dressperience
           */
          await sendEmail({
            to: ADMIN_NOTIFICATION_ADDRESS,
            subject: `Nieuwe reserveringsaanvraag: ${name} — ${dateLabel}`,
            replyTo: email,
            html: `
              <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;padding:24px;color:#1f1f1f;">
                <h2 style="color:#9b72cf;margin:0 0 16px;">
                  Nieuwe reserveringsaanvraag
                </h2>

                <div style="background:#f8f5fc;padding:20px;border-radius:12px;">
                  <p style="margin:0 0 12px;">
                    <strong>Pakket:</strong>
                    ${safePackageName}
                  </p>

                  <p style="margin:0 0 12px;">
                    <strong>Datum:</strong>
                    ${safeDateLabel}
                  </p>

                  <p style="margin:0 0 12px;">
                    <strong>Tijd:</strong>
                    ${safeTime}
                  </p>

                  <p style="margin:0;">
                    <strong>Aantal gasten:</strong>
                    ${safeGroupSize}
                  </p>
                  ${extrasHtml}
                </div>


                <h3 style="color:#9b72cf;margin:24px 0 12px;">
                  Contactgegevens
                </h3>

                <p>
                  <strong>Naam:</strong>
                  ${safeName}
                </p>

                <p>
                  <strong>E-mail:</strong>
                  <a href="mailto:${safeEmail}">
                    ${safeEmail}
                  </a>
                </p>

                <p>
                  <strong>Telefoon:</strong>
                  <a href="tel:${safePhone}">
                    ${safePhone}
                  </a>
                </p>

                ${
              safeNotes
                ? `
                      <hr style="border:none;border-top:1px solid #eee;margin:24px 0;" />

                      <p style="margin-bottom:8px;">
                        <strong>Opmerkingen:</strong>
                      </p>

                      <div style="background:#f8e8ee;padding:16px;border-radius:8px;">
                        <p style="margin:0;">
                          ${safeNotes}
                        </p>
                      </div>
                    `
                : ""
            }
              </div>
            `,
          });

          /*
           * Confirmation for the customer
           */
          await sendEmail({
            to: email,
            subject:
              "We hebben je reserveringsaanvraag ontvangen — Dressperience",
            html: `
              <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;padding:24px;color:#1f1f1f;">
                <h2 style="color:#9b72cf;margin:0 0 16px;">
                  Bedankt voor je aanvraag, ${safeName}!
                </h2>

                <p>
                  We hebben je reserveringsaanvraag in goede orde
                  ontvangen.
                </p>

                <p>
                  Je reservering is nog niet definitief. We controleren
                  de beschikbaarheid en nemen zo snel mogelijk contact
                  met je op.
                </p>

                <div style="background:#f8f5fc;padding:20px;border-radius:12px;margin-top:24px;">
                  <h3 style="color:#9b72cf;margin:0 0 16px;">
                    Jouw aanvraag
                  </h3>

                  <p style="margin:0 0 12px;">
                    <strong>Pakket:</strong>
                    ${safePackageName}
                  </p>

                  <p style="margin:0 0 12px;">
                    <strong>Datum:</strong>
                    ${safeDateLabel}
                  </p>

                  <p style="margin:0 0 12px;">
                    <strong>Tijd:</strong>
                    ${safeTime}
                  </p>

                  <p style="margin:0;">
                    <strong>Aantal gasten:</strong>
                    ${safeGroupSize}
                  </p>
                  ${extrasHtml}
                </div>


                ${
              safeNotes
                ? `
                      <div style="margin-top:24px;">
                        <p style="margin-bottom:8px;">
                          <strong>Jouw opmerkingen:</strong>
                        </p>

                        <div style="background:#f8e8ee;padding:16px;border-radius:8px;">
                          <p style="margin:0;">
                            ${safeNotes}
                          </p>
                        </div>
                      </div>
                    `
                : ""
            }

                <p style="margin-top:24px;">
                  Met liefdevolle groet,<br />
                  Team Dressperience
                </p>
              </div>
            `,
          });
          } catch (emailErr) {
            console.error("send-reservation email delivery failed (reservation was saved):", emailErr);
          }

          return Response.json(
            {
              success: true,
            },
            {
              headers: corsHeaders,
            },
          );

        } catch (error) {
          console.error("send-reservation failed", error);

          return Response.json(
            {
              success: false,
              message:
                "Er ging iets mis bij het versturen van de reservering.",
            },
            {
              status: 500,
              headers: corsHeaders,
            },
          );
        }
      },
    },
  },
});