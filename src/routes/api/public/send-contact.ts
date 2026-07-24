import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  subject: z.string().trim().min(1).max(150),
  message: z.string().trim().min(1).max(2000),
});

export const Route = createFileRoute("/api/public/send-contact")({
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
        const cors = { "Access-Control-Allow-Origin": "*" };
        try {
          const json = await request.json();
          const parsed = schema.safeParse(json);
          if (!parsed.success) {
            return Response.json(
              { success: false, message: parsed.error.issues[0]?.message ?? "Ongeldige invoer" },
              { status: 400, headers: cors },
            );
          }
          const { name, email, subject, message } = parsed.data;

          const { sendEmail, ADMIN_NOTIFICATION_ADDRESS, escapeHtml } = await import(
            "@/lib/email.server"
          );

          const safeName = escapeHtml(name);
          const safeEmail = escapeHtml(email);
          const safeSubject = escapeHtml(subject);
          const safeMessage = escapeHtml(message).replace(/\n/g, "<br />");

          // Admin notification
          await sendEmail({
            to: ADMIN_NOTIFICATION_ADDRESS,
            subject: `Nieuw contactbericht: ${subject}`,
            replyTo: email,
            html: `
              <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#1f1f1f;">
                <h2 style="color:#9b72cf;margin:0 0 16px;">Nieuw bericht via Dressperience</h2>
                <p><strong>Naam:</strong> ${safeName}</p>
                <p><strong>E-mail:</strong> ${safeEmail}</p>
                <p><strong>Onderwerp:</strong> ${safeSubject}</p>
                <hr style="border:none;border-top:1px solid #eee;margin:16px 0;" />
                <p style="white-space:pre-wrap;">${safeMessage}</p>
              </div>
            `,
          });

          // Customer confirmation
          await sendEmail({
            to: email,
            subject: "We hebben je bericht ontvangen — Dressperience",
            html: `
              <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#1f1f1f;">
                <h2 style="color:#9b72cf;margin:0 0 16px;">Bedankt voor je bericht, ${safeName}!</h2>
                <p>We hebben je bericht in goede orde ontvangen en reageren binnen 24 uur.</p>
                <p style="margin-top:24px;"><strong>Jouw bericht:</strong></p>
                <div style="background:#f8e8ee;padding:16px;border-radius:8px;">
                  <p style="margin:0 0 8px;"><strong>Onderwerp:</strong> ${safeSubject}</p>
                  <p style="margin:0;white-space:pre-wrap;">${safeMessage}</p>
                </div>
                <p style="margin-top:24px;">Met liefdevolle groet,<br/>Team Dressperience</p>
              </div>
            `,
          });

          return Response.json({ success: true }, { headers: cors });
        } catch (err) {
          console.error("send-contact failed", err);
          return Response.json(
            { success: false, message: "Er ging iets mis bij het verzenden." },
            { status: 500, headers: cors },
          );
        }
      },
    },
  },
});
