import { createFileRoute } from "@tanstack/react-router";

/**
 * Mollie calls this endpoint whenever a payment changes status.
 * Mollie only sends the payment id — the real status is fetched from the API.
 */
export const Route = createFileRoute("/api/public/mollie-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const form = await request.formData();
          const paymentId = String(form.get("id") ?? "");

          if (!/^tr_[A-Za-z0-9]+$/.test(paymentId)) {
            return new Response("Invalid id", { status: 400 });
          }

          const { getMolliePayment } = await import("@/lib/mollie.server");
          const payment = await getMolliePayment(paymentId);

          const reservationId =
            typeof payment.metadata?.reservationId === "string"
              ? payment.metadata.reservationId
              : null;

          if (!reservationId) {
            console.error("mollie webhook: missing reservationId", paymentId);
            return new Response("ok");
          }

          const { supabaseAdmin } = await import(
            "@/integrations/supabase/client.server"
          );

          const paid = payment.status === "paid";

          const { data: reservation, error } = await supabaseAdmin
            .from("reservations")
            .update({
              payment_status: payment.status,
              ...(paid ? { status: "confirmed" as const } : {}),
            })
            .eq("id", reservationId)
            .select("*")
            .single();

          if (error) {
            console.error("mollie webhook update failed", error);
            return new Response("ok");
          }

          if (paid && reservation) {
            try {
              const { sendEmail, ADMIN_NOTIFICATION_ADDRESS, escapeHtml } =
                await import("@/lib/email.server");

              const safeName = escapeHtml(reservation.name);
              const amount = Number(reservation.deposit_amount ?? 0)
                .toFixed(2)
                .replace(".", ",");

              await sendEmail({
                to: reservation.email,
                subject: "Je aanbetaling is ontvangen — reservering bevestigd",
                html: `
                  <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;padding:24px;color:#1f1f1f;">
                    <h2 style="color:#9b72cf;margin:0 0 16px;">Bedankt, ${safeName}!</h2>
                    <p>We hebben je aanbetaling van €${amount} ontvangen. Je reservering op
                    ${escapeHtml(reservation.reservation_date)} om ${escapeHtml(reservation.reservation_time)}
                    is hiermee definitief bevestigd.</p>
                    <p>Locatie: Heerbaan 54, 6061 EE Posterholt</p>
                    <p style="margin-top:24px;">Met liefdevolle groet,<br />Team Dressperience</p>
                  </div>
                `,
              });

              await sendEmail({
                to: ADMIN_NOTIFICATION_ADDRESS,
                subject: `Aanbetaling ontvangen: ${reservation.name} — ${reservation.reservation_date}`,
                replyTo: reservation.email,
                html: `
                  <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;padding:24px;color:#1f1f1f;">
                    <h2 style="color:#9b72cf;margin:0 0 16px;">Aanbetaling ontvangen</h2>
                    <p><strong>Naam:</strong> ${safeName}</p>
                    <p><strong>Datum:</strong> ${escapeHtml(reservation.reservation_date)} om ${escapeHtml(reservation.reservation_time)}</p>
                    <p><strong>Bedrag:</strong> €${amount}</p>
                    <p>De reservering staat nu op <strong>bevestigd</strong>.</p>
                  </div>
                `,
              });
            } catch (mailErr) {
              console.error("mollie webhook email failed", mailErr);
            }
          }

          return new Response("ok");
        } catch (err) {
          console.error("mollie webhook failed", err);
          return new Response("ok");
        }
      },
    },
  },
});
