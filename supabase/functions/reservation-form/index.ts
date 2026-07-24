import { Resend } from "npm:resend@6.4.0";

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const allowedPackages = ["Sparkle", "Glamour", "VIP"] as const;
const allowedTimes = ["10:00", "14:00", "19:00"] as const;

const MIN_GROUP_SIZE = 2;
const MAX_GROUP_SIZE = 6;

type AllowedPackage = (typeof allowedPackages)[number];
type AllowedTime = (typeof allowedTimes)[number];

interface ReservationFormData {
  packageName?: unknown;
  date?: unknown;
  time?: unknown;
  groupSize?: unknown;
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  notes?: unknown;
}

interface ApiResponse {
  success: boolean;
  message: string;
}

function jsonResponse(
  status: number,
  success: boolean,
  message: string,
): Response {
  const body: ApiResponse = { success, message };

  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

function toStringValue(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function cleanSingleLineText(value: unknown): string {
  return toStringValue(value).replace(/[\r\n]+/g, " ").trim();
}

function cleanEmail(value: unknown): string {
  return toStringValue(value)
    .replace(/[\r\n]+/g, "")
    .trim()
    .toLowerCase();
}

function cleanMultilineText(value: unknown): string {
  return toStringValue(value).trim();
}

function toInteger(value: unknown): number | null {
  if (typeof value === "number") {
    return Number.isSafeInteger(value) ? value : null;
  }

  if (typeof value !== "string" || value.trim() === "") {
    return null;
  }

  const parsedValue = Number(value);
  return Number.isSafeInteger(parsedValue) ? parsedValue : null;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isAllowedPackage(value: string): value is AllowedPackage {
  return allowedPackages.some((item) => item === value);
}

function isAllowedTime(value: string): value is AllowedTime {
  return allowedTimes.some((item) => item === value);
}

/** Controleert zowel het formaat als het bestaan van YYYY-MM-DD. */
function isValidDateString(value: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (!match) {
    return false;
  }

  const [, yearString, monthString, dayString] = match;
  const year = Number(yearString);
  const month = Number(monthString);
  const day = Number(dayString);
  const parsedDate = new Date(Date.UTC(year, month - 1, day));

  return (
    parsedDate.getUTCFullYear() === year &&
    parsedDate.getUTCMonth() === month - 1 &&
    parsedDate.getUTCDate() === day
  );
}

function getDatePartsInNetherlands(date: Date): {
  year: string;
  month: string;
  day: string;
} {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Amsterdam",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const parts = formatter.formatToParts(date);
  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  if (!year || !month || !day) {
    throw new Error("De Nederlandse datum kon niet worden bepaald.");
  }

  return { year, month, day };
}

function getTodayInNetherlands(): string {
  const { year, month, day } = getDatePartsInNetherlands(new Date());
  return `${year}-${month}-${day}`;
}

function formatReservationDate(dateString: string): string {
  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day, 12));

  return new Intl.DateTimeFormat("nl-NL", {
    timeZone: "Europe/Amsterdam",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

Deno.serve(async (request: Request): Promise<Response> => {
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  if (request.method !== "POST") {
    return jsonResponse(405, false, "Alleen POST-verzoeken zijn toegestaan.");
  }

  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return jsonResponse(415, false, "Ongeldig type formuliergegevens.");
  }

  let rawData: unknown;

  try {
    rawData = await request.json();
  } catch {
    return jsonResponse(400, false, "Ongeldige formuliergegevens.");
  }

  if (!rawData || typeof rawData !== "object" || Array.isArray(rawData)) {
    return jsonResponse(400, false, "Ongeldige formuliergegevens.");
  }

  const data = rawData as ReservationFormData;
  const packageName = cleanSingleLineText(data.packageName);
  const date = cleanSingleLineText(data.date);
  const time = cleanSingleLineText(data.time);
  const groupSize = toInteger(data.groupSize);
  const name = cleanSingleLineText(data.name);
  const email = cleanEmail(data.email);
  const phone = cleanSingleLineText(data.phone);
  const notes = cleanMultilineText(data.notes);

  if (
    !isAllowedPackage(packageName) ||
    !isAllowedTime(time) ||
    groupSize === null ||
    groupSize < MIN_GROUP_SIZE ||
    groupSize > MAX_GROUP_SIZE ||
    name === "" ||
    phone === "" ||
    !isValidEmail(email)
  ) {
    return jsonResponse(422, false, "Controleer alle ingevulde velden.");
  }

  if (!isValidDateString(date)) {
    return jsonResponse(422, false, "De gekozen datum is ongeldig.");
  }

  if (
    name.length > 100 ||
    email.length > 255 ||
    phone.length > 30 ||
    notes.length > 500
  ) {
    return jsonResponse(422, false, "Een of meer velden zijn te lang.");
  }

  let today: string;

  try {
    today = getTodayInNetherlands();
  } catch (error) {
    console.error("Datumcontrole mislukt:", error);
    return jsonResponse(
      500,
      false,
      "De reservering kon niet worden gecontroleerd.",
    );
  }

  if (date < today) {
    return jsonResponse(422, false, "De gekozen datum ligt in het verleden.");
  }

  const resendApiKey = Deno.env.get("RESEND_API_KEY");
  const adminEmail = cleanEmail(Deno.env.get("ADMIN_EMAIL"));
  const fromEmail = cleanEmail(Deno.env.get("FROM_EMAIL"));

  if (!resendApiKey) {
    console.error("De Supabase-secret RESEND_API_KEY ontbreekt.");
    return jsonResponse(500, false, "De mailservice is niet correct ingesteld.");
  }

  if (!isValidEmail(adminEmail) || !isValidEmail(fromEmail)) {
    console.error("ADMIN_EMAIL of FROM_EMAIL ontbreekt of is ongeldig.");
    return jsonResponse(500, false, "De mailservice is niet correct ingesteld.");
  }

  const resend = new Resend(resendApiKey);
  const displayDate = formatReservationDate(date);
  const adminSubject =
    `Nieuwe reserveringsaanvraag: ${packageName} - ${displayDate} ${time}`;

  const adminBody = [
    "Nieuwe reserveringsaanvraag via dressperience.com",
    "",
    `Pakket: ${packageName}`,
    `Datum: ${displayDate}`,
    `Tijd: ${time}`,
    `Aantal gasten: ${groupSize}`,
    "",
    `Naam: ${name}`,
    `E-mail: ${email}`,
    `Telefoon: ${phone}`,
    "",
    "Opmerkingen:",
    notes || "Geen opmerkingen",
  ].join("\n");

  try {
    const { data: adminMailData, error: adminMailError } =
      await resend.emails.send({
        from: `Dressperience website <${fromEmail}>`,
        to: [adminEmail],
        replyTo: email,
        subject: adminSubject,
        text: adminBody,
      });

    if (adminMailError) {
      console.error("Resend admin-mailfout:", adminMailError);
      return jsonResponse(500, false, "De reservering kon niet worden verzonden.");
    }

    console.log(
      "Reserveringsmail verzonden:",
      adminMailData?.id ?? "geen id ontvangen",
    );
  } catch (error) {
    console.error("Onverwachte fout bij de reserveringsmail:", error);
    return jsonResponse(500, false, "De reservering kon niet worden verzonden.");
  }

  const customerSubject = "We hebben je reserveringsaanvraag ontvangen";
  const customerBody = [
    `Beste ${name},`,
    "",
    "Bedankt voor je reserveringsaanvraag bij Dressperience.",
    "We controleren de beschikbaarheid en nemen zo snel mogelijk contact met je op.",
    "",
    "Jouw aanvraag:",
    `Pakket: ${packageName}`,
    `Datum: ${displayDate}`,
    `Tijd: ${time}`,
    `Aantal gasten: ${groupSize}`,
    "",
    "Let op: dit is alleen een ontvangstbevestiging.",
    "De reservering is pas definitief nadat wij deze persoonlijk hebben bevestigd.",
    "",
    "Met vriendelijke groet,",
    "Dressperience",
    adminEmail,
  ].join("\n");

  try {
    const { data: customerMailData, error: customerMailError } =
      await resend.emails.send({
        from: `Dressperience <${fromEmail}>`,
        to: [email],
        replyTo: adminEmail,
        subject: customerSubject,
        text: customerBody,
      });

    if (customerMailError) {
      console.error("Resend bevestigingsmailfout:", customerMailError);
    } else {
      console.log(
        "Bevestigingsmail verzonden:",
        customerMailData?.id ?? "geen id ontvangen",
      );
    }
  } catch (error) {
    console.error("Onverwachte fout bij de bevestigingsmail:", error);
  }

  return jsonResponse(200, true, "De reserveringsaanvraag is verzonden.");
});