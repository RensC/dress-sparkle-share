import { createFileRoute } from "@tanstack/react-router";

/**
 * Returns the payment/booking status of a single reservation.
 * Only non-sensitive fields are exposed.
 */
export const Route = createFileRoute(
  "/api/public/reservation-status",
)({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const id = url.searchParams.get("id") ?? "";

        const isValidUuid =
          /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
            id,
          );

        if (!isValidUuid) {
          return Response.json(
            {
              success: false,
              message: "Ongeldig reserveringsnummer.",
            },
            {
              status: 400,
              headers: {
                "Cache-Control": "no-store",
              },
            },
          );
        }

        try {
          const { supabaseAdmin } = await import(
            "@/integrations/supabase/client.server"
            );

          const { data, error } = await supabaseAdmin
            .from("reservations")
            .select(
              [
                "reservation_date",
                "reservation_time",
                "package_name",
                "group_size",
                "payment_status",
                "status",
                "deposit_amount",
              ].join(", "),
            )
            .eq("id", id)
            .maybeSingle();

          if (error) {
            console.error(
              "reservation-status query failed",
              error,
            );

            return Response.json(
              {
                success: false,
                message:
                  "De reserveringsstatus kon niet worden opgehaald.",
              },
              {
                status: 500,
                headers: {
                  "Cache-Control": "no-store",
                },
              },
            );
          }

          if (!data) {
            return Response.json(
              {
                success: false,
                message: "Reservering niet gevonden.",
              },
              {
                status: 404,
                headers: {
                  "Cache-Control": "no-store",
                },
              },
            );
          }

          return Response.json(
            {
              success: true,
              reservation: data,
            },
            {
              headers: {
                "Cache-Control": "no-store",
              },
            },
          );
        } catch (error) {
          console.error(
            "reservation-status failed",
            error,
          );

          return Response.json(
            {
              success: false,
              message:
                "De reserveringsstatus kon niet worden opgehaald.",
            },
            {
              status: 500,
              headers: {
                "Cache-Control": "no-store",
              },
            },
          );
        }
      },
    },
  },
});