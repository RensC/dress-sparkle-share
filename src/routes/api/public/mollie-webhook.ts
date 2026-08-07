import { createFileRoute } from "@tanstack/react-router";

/**
 * Mollie calls this endpoint whenever a payment changes status.
 * Mollie only sends the payment ID; the authoritative status is fetched
 * from Mollie's API.
 */
export const Route = createFileRoute(
  "/api/public/mollie-webhook",
)({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const form = await request.formData();
          const paymentId = String(form.get("id") ?? "");

          if (!/^tr_[A-Za-z0-9]+$/.test(paymentId)) {
            return new Response("Invalid payment id", {
              status: 400,
            });
          }

          const { getMolliePayment } = await import(
            "@/lib/mollie.server"
            );

          const payment = await getMolliePayment(paymentId);

          const reservationId =
            typeof payment.metadata?.reservationId === "string"
              ? payment.metadata.reservationId
              : null;

          if (
            !reservationId ||
            !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
              reservationId,
            )
          ) {
            console.error(
              "mollie webhook: missing or invalid reservationId",
              paymentId,
            );

            /*
             * This is not retryable unless Mollie metadata changes.
             */
            return new Response("ok");
          }

          const { supabaseAdmin } = await import(
            "@/integrations/supabase/client.server"
            );

          /*
           * Fetch the reservation before updating it so we can:
           * - verify the Mollie payment belongs to it
           * - detect an already-processed paid webhook
           * - verify the payment amount
           */
          const {
            data: existingReservation,
            error: fetchError,
          } = await supabaseAdmin
            .from("reservations")
            .select("*")
            .eq("id", reservationId)
            .maybeSingle();

          if (fetchError) {
            console.error(
              "mollie webhook reservation fetch failed",
              fetchError,
            );

            return new Response("Database error", {
              status: 500,
            });
          }

          if (!existingReservation) {
            console.error(
              "mollie webhook: reservation not found",
              reservationId,
            );

            /*
             * A retry will not fix a genuinely missing reservation.
             */
            return new Response("ok");
          }

          if (
            existingReservation.mollie_payment_id &&
            existingReservation.mollie_payment_id !== payment.id
          ) {
            console.error(
              "mollie webhook: payment id does not match reservation",
              {
                reservationId,
                expected:
                existingReservation.mollie_payment_id,
                received: payment.id,
              },
            );

            return new Response("Payment mismatch", {
              status: 400,
            });
          }

          const expectedAmount = Number(
            existingReservation.deposit_amount ?? 0,
          );

          const receivedAmount = Number(
            payment.amount?.value ?? 0,
          );

          if (
            !Number.isFinite(receivedAmount) ||
            receivedAmount !== expectedAmount ||
            payment.amount?.currency !== "EUR"
          ) {
            console.error(
              "mollie webhook: amount mismatch",
              {
                reservationId,
                expectedAmount,
                receivedAmount,
                currency: payment.amount?.currency,
              },
            );

            return new Response("Amount mismatch", {
              status: 400,
            });
          }

          const wasAlreadyPaid =
            existingReservation.payment_status === "paid" &&
            existingReservation.status === "confirmed";

          const paid = payment.status === "paid";

          const unsuccessfulFinalStatuses = [
            "failed",
            "canceled",
            "expired",
          ];

          const nextReservationStatus = paid
            ? "confirmed"
            : unsuccessfulFinalStatuses.includes(payment.status)
              ? "cancelled"
              : existingReservation.status;

          const {
            data: updatedReservation,
            error: updateError,
          } = await supabaseAdmin
            .from("reservations")
            .update({
              payment_status: payment.status,
              status: nextReservationStatus,
              mollie_payment_id: payment.id,
            })
            .eq("id", reservationId)
            .select("*")
            .maybeSingle();

          if (updateError) {
            console.error(
              "mollie webhook update failed",
              updateError,
            );

            return new Response("Database update failed", {
              status: 500,
            });
          }

          if (!updatedReservation) {
            console.error(
              "mollie webhook: reservation disappeared during update",
              reservationId,
            );

            return new Response("Reservation not found", {
              status: 500,
            });
          }

          /*
           * Send confirmation emails only when transitioning to paid.
           * Repeated Mollie webhook calls will not resend them.
           */
          if (paid && !wasAlreadyPaid) {
            try {
              const {
                sendEmail,
                ADMIN_NOTIFICATION_ADDRESS,
                escapeHtml,
              } = await import("@/lib/email.server");

              const safeName = escapeHtml(
                updatedReservation.name,
              );

              const safeDate = escapeHtml(
                updatedReservation.reservation_date,
              );

              const safeTime = escapeHtml(
                updatedReservation.reservation_time,
              );

              const safeEmail = escapeHtml(
                updatedReservation.email,
              );

              const amount = Number(
                updatedReservation.deposit_amount ?? 0,
              )
                .toFixed(2)
                .replace(".", ",");

              const {
                buildConfirmationEmailHtml,
                CONFIRMATION_SUBJECT,
              } = await import(
                "@/lib/reservation-confirmation-email.server"
                );

              await sendEmail({
                to: updatedReservation.email,
                subject: CONFIRMATION_SUBJECT,
                html: buildConfirmationEmailHtml(updatedReservation),
              });


              await sendEmail({
                to: ADMIN_NOTIFICATION_ADDRESS,
                subject:
                  `Aanbetaling ontvangen: ` +
                  `${updatedReservation.name} — ` +
                  `${updatedReservation.reservation_date}`,
                replyTo: updatedReservation.email,
                html: `
                  <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;padding:24px;color:#1f1f1f;">
                    <h2 style="color:#9b72cf;margin:0 0 16px;">
                      Aanbetaling ontvangen
                    </h2>

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
                      <strong>Datum:</strong>
                      ${safeDate} om ${safeTime}
                    </p>

                    <p>
                      <strong>Bedrag:</strong>
                      €${amount}
                    </p>

                    <p>
                      De reservering staat nu op
                      <strong>bevestigd</strong>.
                    </p>
                  </div>
                `,
              });
            } catch (mailError) {
              /*
               * Payment processing succeeded. Do not make Mollie retry
               * the complete webhook solely because email failed.
               */
              console.error(
                "mollie webhook confirmation email failed",
                mailError,
              );
            }
          }

          return new Response("ok");
        } catch (error) {
          console.error(
            "mollie webhook failed",
            error,
          );

          /*
           * Return 500 so Mollie can retry temporary failures.
           */
          return new Response("Webhook processing failed", {
            status: 500,
          });
        }
      },
    },
  },
});