import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/booked-slots")({
  server: {
    handlers: {
      OPTIONS: async () =>
        new Response(null, {
          status: 204,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
          },
        }),

      GET: async ({ request }) => {
        const corsHeaders = {
          "Access-Control-Allow-Origin": "*",
        };

        const url = new URL(request.url);
        const date = url.searchParams.get("date");

        if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
          return Response.json(
            { success: false, bookedSlots: [] },
            { status: 400, headers: corsHeaders }
          );
        }

        try {
          const { supabaseAdmin } = await import(
            "@/integrations/supabase/client.server"
          );

          // Only paid or confirmed bookings block a slot; unpaid attempts don't
          const { data, error } = await supabaseAdmin
            .from("reservations")
            .select("reservation_time, status, payment_status")
            .eq("reservation_date", date)
            .in("status", ["pending", "confirmed"]);

          if (error) {
            console.error("fetch booked slots failed", error);
            return Response.json(
              { success: false, bookedSlots: [] },
              { status: 500, headers: corsHeaders }
            );
          }

          const bookedSlots = Array.from(
            new Set(
              (data ?? [])
                .filter(
                  (row) =>
                    row.payment_status === "paid" || row.status === "confirmed"
                )
                .map((row) => row.reservation_time)
            )
          );

          return Response.json(
            { success: true, bookedSlots },
            { headers: corsHeaders }
          );
        } catch (err) {
          console.error("booked-slots handler failed", err);
          return Response.json(
            { success: false, bookedSlots: [] },
            { status: 500, headers: corsHeaders }
          );
        }
      },
    },
  },
});
