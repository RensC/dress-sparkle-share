import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/api/public/booked-slots",
)({
  server: {
    handlers: {
      OPTIONS: async ({ request }) => {
        const origin = new URL(request.url).origin;

        return new Response(null, {
          status: 204,
          headers: {
            "Access-Control-Allow-Origin": origin,
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
            "Cache-Control": "no-store",
            Vary: "Origin",
          },
        });
      },

      GET: async ({ request }) => {
        const origin = new URL(request.url).origin;

        const headers = {
          "Access-Control-Allow-Origin": origin,
          "Cache-Control": "no-store",
          Vary: "Origin",
        };

        const url = new URL(request.url);
        const date = url.searchParams.get("date");

        if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
          return Response.json(
            {
              success: false,
              bookedSlots: [],
              message: "Ongeldige datum.",
            },
            {
              status: 400,
              headers,
            },
          );
        }

        try {
          const { supabaseAdmin } = await import(
            "@/integrations/supabase/client.server"
            );

          /*
           * Keep this rule identical to send-reservation:
           * pending and confirmed reservations both block the slot.
           */
          const { data, error } = await supabaseAdmin
            .from("reservations")
            .select("reservation_time")
            .eq("reservation_date", date)
            .in("status", ["pending", "confirmed"]);

          if (error) {
            console.error(
              "fetch booked slots failed",
              error,
            );

            return Response.json(
              {
                success: false,
                bookedSlots: [],
                message:
                  "De beschikbaarheid kon niet worden opgehaald.",
              },
              {
                status: 500,
                headers,
              },
            );
          }

          const bookedSlots = Array.from(
            new Set(
              (data ?? [])
                .map((row) => row.reservation_time)
                .filter(
                  (value): value is string =>
                    typeof value === "string",
                ),
            ),
          );

          return Response.json(
            {
              success: true,
              bookedSlots,
            },
            {
              headers,
            },
          );
        } catch (error) {
          console.error(
            "booked-slots handler failed",
            error,
          );

          return Response.json(
            {
              success: false,
              bookedSlots: [],
              message:
                "De beschikbaarheid kon niet worden opgehaald.",
            },
            {
              status: 500,
              headers,
            },
          );
        }
      },
    },
  },
});