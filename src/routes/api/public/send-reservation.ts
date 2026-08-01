import { createFileRoute } from "@tanstack/react-router";
import { format, isValid, parseISO } from "date-fns";
import { nl } from "date-fns/locale";
import { z } from "zod";

import { extraOptions } from "@/lib/extras";

const packageOptions = ["Sparkle", "Glamour", "VIP"] as const;
const timeSlots = ["10:00", "14:00", "19:00"] as const;

const DEPOSIT_AMOUNT = 50;

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

  /*
   * Never accept prices or names from the browser.
   *
   * The current frontend may still send name, unitPrice and total.
   * Zod strips those unknown properties and keeps only these fields.
   */
  extras: z
    .array(
      z.object({
        id: z.string().trim().min(1).max(50),
        quantity: z.number().int().min(1).max(10),
        variant: z.string().trim().max(50).optional(),
      }),
    )
    .max(10)
    .optional()
    .default([]),
});

type SubmittedExtra = z.infer<typeof schema>["extras"][number];

type TrustedExtra = {
  id: string;
  name: string;
  quantity: number;
  variant?: string;
  unitPrice: number;
  total: number;
};

function getCorsHeaders(request: Request): Record<string, string> {
  const requestOrigin = request.headers.get("origin");
  const applicationOrigin = new URL(request.url).origin;

  if (requestOrigin === applicationOrigin) {
    return {
      "Access-Control-Allow-Origin": applicationOrigin,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      Vary: "Origin",
    };
  }

  return {
    Vary: "Origin",
  };
}

function formatEuroAmount(value: number): string {
  return `€${value.toFixed(2).replace(".", ",")}`;
}

function validateAndCalculateExtras(
  submittedExtras: SubmittedExtra[],
): TrustedExtra[] {
  const usedIds = new Set<string>();

  return submittedExtras.map((submittedExtra) => {
    if (usedIds.has(submittedExtra.id)) {
      throw new Error(
        `De extra "${submittedExtra.id}" is meerdere keren toegevoegd.`,
      );
    }

    usedIds.add(submittedExtra.id);

    const option = extraOptions.find(
      (candidate) => candidate.id === submittedExtra.id,
    );

    if (!option) {
      throw new Error("Er is een onbekende extra geselecteerd.");
    }

    let quantity = 1;

    if (option.quantity) {
      const minimum = option.quantity.min;
      const maximum = option.quantity.max;

      if (
        submittedExtra.quantity < minimum ||
        submittedExtra.quantity > maximum
      ) {
        throw new Error(
          `Het aantal voor "${option.name}" moet tussen ${minimum} en ${maximum} liggen.`,
        );
      }

      quantity = submittedExtra.quantity;
    } else if (submittedExtra.quantity !== 1) {
      throw new Error(
        `Voor "${option.name}" kan geen aantal worden gekozen.`,
      );
    }

    let variant: string | undefined;

    if (option.variants?.length) {
      if (
        !submittedExtra.variant ||
        !option.variants.includes(submittedExtra.variant)
      ) {
        throw new Error(
          `Er is een ongeldige variant gekozen voor "${option.name}".`,
        );
      }

      variant = submittedExtra.variant;
    } else if (submittedExtra.variant) {
      throw new Error(
        `Voor "${option.name}" kan geen variant worden gekozen.`,
      );
    }

    const unitPrice = Number(option.price);
    const total = Number((unitPrice * quantity).toFixed(2));

    return {
      id: option.id,
      name: option.name,
      quantity,
      variant,
      unitPrice,
      total,
    };
  });
}

export const Route = createFileRoute(
  "/api/public/send-reservation",
)({
  server: {
    handlers: {
      OPTIONS: async ({ request }) =>
        new Response(null, {
          status: 204,
          headers: getCorsHeaders(request),
        }),

      POST: async ({ request }) => {
        const corsHeaders = getCorsHeaders(request);

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
          } = parsed.data;

          let extras: TrustedExtra[];

          try {
            extras = validateAndCalculateExtras(
              parsed.data.extras,
            );
          } catch (error) {
            return Response.json(
              {
                success: false,
                message:
                  error instanceof Error
                    ? error.message
                    : "De gekozen extra's zijn ongeldig.",
              },
              {
                status: 400,
                headers: corsHeaders,
              },
            );
          }

          const extrasTotalAmount = Number(
            extras
              .reduce(
                (sum, item) => sum + item.total,
                0,
              )
              .toFixed(2),
          );

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

          /*
           * parseISO("yyyy-MM-dd") creates a date in the server's local
           * timezone. Since this server is likely UTC while the business is
           * in the Netherlands, compare date strings instead of timestamps.
           */
          const todayKey = format(new Date(), "yyyy-MM-dd");

          if (date < todayKey) {
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

          /*
           * Block every pending or confirmed reservation for this slot.
           *
           * This prevents several customers from simultaneously being sent
           * to Mollie for the same date and time.
           */
          const {
            data: existingReservations,
            error: existingError,
          } = await supabaseAdmin
            .from("reservations")
            .select("id, payment_status, status")
            .eq("reservation_date", date)
            .eq("reservation_time", time)
            .in("status", ["pending", "confirmed"])
            .limit(1);

          if (existingError) {
            console.error(
              "reservation slot check failed",
              existingError,
            );

            return Response.json(
              {
                success: false,
                message:
                  "De beschikbaarheid kon niet worden gecontroleerd. Probeer het opnieuw.",
              },
              {
                status: 500,
                headers: corsHeaders,
              },
            );
          }

          if ((existingReservations ?? []).length > 0) {
            return Response.json(
              {
                success: false,
                message:
                  "Dit tijdslot is helaas al gereserveerd. Kies een andere datum of tijd.",
              },
              {
                status: 409,
                headers: corsHeaders,
              },
            );
          }

          const {
            data: inserted,
            error: insertError,
          } = await supabaseAdmin
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

              /*
               * These values were reconstructed from trusted server-side
               * configuration. Browser-supplied prices are ignored.
               */
              extras,
              extras_total: extrasTotalAmount,

              deposit_amount: DEPOSIT_AMOUNT,
              payment_status: "open",
              status: "pending",
            })
            .select("id")
            .single();

          if (insertError || !inserted) {
            console.error(
              "reservation insert failed",
              insertError,
            );

            /*
             * A database uniqueness constraint may return an error here if
             * another customer claimed the slot after our availability
             * check.
             */
            if (insertError?.code === "23505") {
              return Response.json(
                {
                  success: false,
                  message:
                    "Dit tijdslot is zojuist door iemand anders gereserveerd. Kies een andere datum of tijd.",
                },
                {
                  status: 409,
                  headers: corsHeaders,
                },
              );
            }

            return Response.json(
              {
                success: false,
                message:
                  "De reservering kon niet worden opgeslagen. Probeer het opnieuw.",
              },
              {
                status: 500,
                headers: corsHeaders,
              },
            );
          }

          let checkoutUrl: string | null = null;

          try {
            const { createMolliePayment } = await import(
              "@/lib/mollie.server"
              );

            const origin = new URL(request.url).origin;

            const payment = await createMolliePayment({
              amount: DEPOSIT_AMOUNT,
              description:
                `Aanbetaling Dressperience — ` +
                `${packageName} ${date} ${time}`,
              redirectUrl:
                `${origin}/reservations?betaling=${inserted.id}`,
              webhookUrl:
                `${origin}/api/public/mollie-webhook`,
              metadata: {
                reservationId: inserted.id,
              },
            });

            checkoutUrl =
              payment._links?.checkout?.href ?? null;

            if (!checkoutUrl) {
              throw new Error(
                "Mollie heeft geen checkout-URL teruggegeven.",
              );
            }

            const { error: paymentUpdateError } =
              await supabaseAdmin
                .from("reservations")
                .update({
                  mollie_payment_id: payment.id,
                })
                .eq("id", inserted.id);

            if (paymentUpdateError) {
              console.error(
                "saving Mollie payment id failed",
                paymentUpdateError,
              );

              /*
               * Keep the reservation because a Mollie payment already
               * exists and contains the reservation ID in its metadata.
               */
              return Response.json(
                {
                  success: false,
                  message:
                    "De betaling is aangemaakt, maar kon niet volledig aan de reservering worden gekoppeld. Neem contact met ons op voordat je opnieuw probeert.",
                },
                {
                  status: 500,
                  headers: corsHeaders,
                },
              );
            }
          } catch (paymentError) {
            console.error(
              "Mollie payment creation failed",
              paymentError,
            );

            /*
             * Mollie creation failed, so remove the pending reservation.
             * Otherwise the unavailable slot would remain blocked.
             */
            const { error: cleanupError } =
              await supabaseAdmin
                .from("reservations")
                .delete()
                .eq("id", inserted.id);

            if (cleanupError) {
              console.error(
                "failed to clean up reservation after Mollie error",
                cleanupError,
              );
            }

            return Response.json(
              {
                success: false,
                message:
                  "De betaling kon niet worden gestart. Je reservering is niet definitief opgeslagen. Probeer het opnieuw.",
              },
              {
                status: 502,
                headers: corsHeaders,
              },
            );
          }

          /*
           * Email errors do not invalidate a saved reservation or payment.
           */
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

            const safePackageName =
              escapeHtml(packageName);
            const safeDateLabel =
              escapeHtml(dateLabel);
            const safeTime =
              escapeHtml(time);
            const safeGroupSize =
              escapeHtml(String(groupSize));
            const safeName =
              escapeHtml(name);
            const safeEmail =
              escapeHtml(email);
            const safePhone =
              escapeHtml(phone);
            const safeNotes =
              escapeHtml(notes).replace(/\n/g, "<br />");

            const extrasHtml = extras.length
              ? `
                <p style="margin:12px 0 6px;">
                  <strong>Extra's:</strong>
                </p>

                <ul style="margin:0;padding-left:18px;">
                  ${extras
                .map((item) => {
                  const description =
                    `${item.quantity > 1
                      ? `${item.quantity}× `
                      : ""}` +
                    `${item.name}` +
                    `${item.variant
                      ? ` (${item.variant})`
                      : ""}`;

                  return `
                        <li style="margin-bottom:4px;">
                          ${escapeHtml(description)}
                          —
                          ${escapeHtml(
                    formatEuroAmount(item.total),
                  )}
                        </li>
                      `;
                })
                .join("")}
                </ul>

                <p style="margin:8px 0 0;">
                  <strong>Totaal extra's:</strong>
                  ${escapeHtml(
                formatEuroAmount(extrasTotalAmount),
              )}
                </p>
              `
              : "";

            await sendEmail({
              to: ADMIN_NOTIFICATION_ADDRESS,
              subject:
                `Nieuwe reservering: ${name} — ${dateLabel}`,
              replyTo: email,
              html: `
                <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;padding:24px;color:#1f1f1f;">
                  <h2 style="color:#9b72cf;margin:0 0 16px;">
                    Nieuwe reservering
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

                    <p style="margin:12px 0 0;">
                      <strong>Aanbetaling:</strong>
                      ${escapeHtml(
                formatEuroAmount(DEPOSIT_AMOUNT),
              )}
                    </p>
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

            await sendEmail({
              to: email,
              subject:
                "Rond je aanbetaling af — Dressperience",
              html: `
                <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;padding:24px;color:#1f1f1f;">
                  <h2 style="color:#9b72cf;margin:0 0 16px;">
                    Bedankt voor je reservering, ${safeName}!
                  </h2>

                  <p>
                    Je reservering is aangemaakt.
                  </p>

                  <p>
                    Je wordt doorgestuurd naar Mollie om de
                    aanbetaling van
                    <strong>
                      ${escapeHtml(
                formatEuroAmount(DEPOSIT_AMOUNT),
              )}
                    </strong>
                    af te ronden.
                  </p>

                  <p>
                    Je reservering is definitief zodra de
                    aanbetaling is ontvangen.
                  </p>

                  <div style="background:#f8f5fc;padding:20px;border-radius:12px;margin-top:24px;">
                    <h3 style="color:#9b72cf;margin:0 0 16px;">
                      Jouw reservering
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
          } catch (emailError) {
            console.error(
              "send-reservation email delivery failed; reservation was saved",
              emailError,
            );
          }

          return Response.json(
            {
              success: true,
              reservationId: inserted.id,
              checkoutUrl,
            },
            {
              headers: corsHeaders,
            },
          );
        } catch (error) {
          console.error(
            "send-reservation failed",
            error,
          );

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