import { createFileRoute } from "@tanstack/react-router";

/**
 * Returns the payment/booking status of a single reservation.
 * Only non-sensitive fields are exposed.
 */
export const Route = createFileRoute("/api/public/reservation-status")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const id = url.searchParams.get("id") ?? "";

        if (
          !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
            id,
          )
        ) {
          return Response.json({ success: false }, { status: 400 });
        }

        try {
          const { supabaseAdmin } = await import(
            "@/integrations/supabase/client.server"
          );

          const { data, error } = await supabaseAdmin
            .from("reservations")
            .select(
              "reservation_date, reservation_time, package_name, group_size, payment_status, status, deposit_amount",
            )
            .eq("id", id)
            .maybeSingle();

          if (error || !data) {
            return Response.json({ success: false }, { status: 404 });
          }

          return Response.json({ success: true, reservation: data });
        } catch (err) {
          console.error("reservation-status failed", err);
          return Response.json({ success: false }, { status: 500 });
        }
      },
    },
  },
});
