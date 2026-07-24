import { Resend } from "npm:resend";
import { corsHeaders } from "jsr:@supabase/supabase-js/cors";

interface ContactFormData {
  name?: unknown;
  email?: unknown;
  subject?: unknown;
  message?: unknown;
}

function jsonResponse(
  status: number,
  success: boolean,
  message: string,
): Response {
  return new Response(
    JSON.stringify({
      success,
      message,
    }),
    {
      status,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json; charset=utf-8",
        "X-Content-Type-Options": "nosniff",
      },
    },
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function removeLineBreaks(value: string): string {
  return value.replace(/[\r\n]+/g, " ");
}

Deno.serve(async (request: Request): Promise<Response> => {
  if (request.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }

  if (request.method !== "POST") {
    return jsonResponse(
      405,
      false,
      "Alleen POST-verzoeken zijn toegestaan.",
    );
  }

  const contentType = request.headers.get("content-type") ?? "";

  if (!contentType.toLowerCase().includes("application/json")) {
    return jsonResponse(
      415,
      false,
      "Ongeldig type formuliergegevens.",
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return jsonResponse(
      400,
      false,
      "Ongeldige formuliergegevens.",
    );
  }

  if (!isRecord(body)) {
    return jsonResponse(
      400,
      false,
      "Ongeldige formuliergegevens.",
    );
  }

  const data: ContactFormData = body;

  const name = typeof data.name === "string"
    ? data.name.trim()
    : "";

  const email = typeof data.email === "string"
    ? data.email.trim()
    : "";

  const subject = typeof data.subject === "string"
    ? data.subject.trim()
    : "";

  const message = typeof data.message === "string"
    ? data.message.trim()
    : "";

  if (
    name.length === 0 ||
    subject.length === 0 ||
    message.length === 0 ||
    !isValidEmail(email)
  ) {
    return jsonResponse(
      422,
      false,
      "Controleer alle ingevulde velden.",
    );
  }

  if (
    name.length > 100 ||
    email.length > 255 ||
    subject.length > 150 ||
    message.length > 1000
  ) {
    return jsonResponse(
      422,
      false,
      "Een of meer velden zijn te lang.",
    );
  }

  const resendApiKey = Deno.env.get("RESEND_API_KEY");

  if (!resendApiKey) {
    console.error("RESEND_API_KEY ontbreekt.");

    return jsonResponse(
      500,
      false,
      "De mailserver is niet correct geconfigureerd.",
    );
  }

  const resend = new Resend(resendApiKey);

  const safeName = removeLineBreaks(name);
  const safeEmail = removeLineBreaks(email).replace(/\s/g, "");
  const safeSubject = removeLineBreaks(subject);

  try {
    const { error } = await resend.emails.send({
      from: "Dressperience website <info@send.dressperience.com>",
      to: ["info@dressperience.com"],
      replyTo: safeEmail,
      subject: `Nieuw contactformulier: ${safeSubject}`,
      text: [
        "Nieuw bericht via dressperience.com",
        "",
        `Naam: ${safeName}`,
        `E-mail: ${safeEmail}`,
        `Onderwerp: ${safeSubject}`,
        "",
        "Bericht:",
        message,
      ].join("\n"),
    });

    if (error) {
      console.error("Resend error:", error);

      return jsonResponse(
        502,
        false,
        "De mailserver kon het bericht niet versturen.",
      );
    }

    return jsonResponse(
      200,
      true,
      "Bericht verzonden.",
    );
  } catch (error: unknown) {
    console.error("Contactformulier error:", error);

    return jsonResponse(
      500,
      false,
      "De mailserver kon het bericht niet versturen.",
    );
  }
});