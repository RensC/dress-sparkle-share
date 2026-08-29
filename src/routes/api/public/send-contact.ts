import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  subject: z.string().trim().min(1).max(150),
  message: z.string().trim().min(1).max(2000),
  // Anti-spam velden
  website: z.string().max(500).optional(), // honeypot: niet valideren, server-side als spam behandelen
  formLoadedAt: z.number().optional(),
});

// Simpele heuristische spamcheck
const SPAM_KEYWORDS = [
  "seo service",
  "seo services",
  "backlink",
  "crypto",
  "bitcoin",
  "casino",
  "viagra",
  "cialis",
  "loan offer",
  "escort",
  "porn",
  "guest post",
  "rank your website",
  "increase traffic",
  "web design offer",
  "marketing agency",
  "buy followers",
  "телеграм",
  "投資",
];

function looksLikeSpam(input: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): boolean {
  const blob = `${input.name} ${input.subject} ${input.message}`.toLowerCase();

  if (SPAM_KEYWORDS.some((k) => blob.includes(k))) return true;

  // Veel links in een bericht is bijna altijd spam
  const linkCount = (blob.match(/https?:\/\/|www\.|\[url/g) ?? []).length;
  if (linkCount >= 2) return true;

  // BBCode / HTML tags
  if (/\[\/?(url|link)\]|<a\s|<\/a>/i.test(blob)) return true;

  // Cyrillisch of CJK in een Nederlandstalig formulier
  if (/[\u0400-\u04FF\u4E00-\u9FFF]/.test(blob)) return true;

  // Bericht zonder enige spatie of extreem lange woorden
  if (input.message.length > 40 && !input.message.includes(" ")) return true;

  return false;
}

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
          const { name, email, subject, message, website, formLoadedAt } = parsed.data;

          // 1. Honeypot gevuld => bot. Stil accepteren zonder te mailen.
          if (website && website.trim().length > 0) {
            console.warn("send-contact: honeypot triggered");
            return Response.json({ success: true }, { headers: cors });
          }

          // 2. Formulier binnen 3 seconden verstuurd => bot.
          if (formLoadedAt && Date.now() - formLoadedAt < 3000) {
            console.warn("send-contact: submitted too fast");
            return Response.json({ success: true }, { headers: cors });
          }

          // 3. Inhoudelijke spamcheck.
          if (looksLikeSpam({ name, email, subject, message })) {
            console.warn("send-contact: content flagged as spam");
            return Response.json({ success: true }, { headers: cors });
          }

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

          // Customer confirmation (niet kritiek: fout mag het formulier niet blokkeren)
          try {
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
