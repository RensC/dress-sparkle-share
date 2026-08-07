// Server-only: builds the customer confirmation email for a paid reservation.
import { escapeHtml } from "./email.server";

type ExtraLike = {
  name?: string;
  quantity?: number;
  variant?: string | null;
  total?: number;
};

export interface ConfirmationEmailInput {
  name: string;
  reservation_date: string;
  reservation_time: string;
  package_name: string;
  group_size: number;
  extras?: unknown;
  deposit_amount?: number | string | null;
}

function formatDate(date: string): string {
  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return parsed.toLocaleDateString("nl-NL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatExtras(extras: unknown): string {
  if (!Array.isArray(extras) || extras.length === 0) {
    return "Geen extra's";
  }

  return (extras as ExtraLike[])
    .map((extra) => {
      const parts = [extra?.name ?? "Extra"];

      if (extra?.quantity && extra.quantity > 1) {
        parts.push(`x${extra.quantity}`);
      }

      if (extra?.variant) {
        parts.push(`(${extra.variant})`);
      }

      return parts.join(" ");
    })
    .join(", ");
}

export const CONFIRMATION_SUBJECT =
  "Bevestiging: Jouw 'walk on the bride side' bij Dressperience! 🥂✨";

export function buildConfirmationEmailHtml(
  reservation: ConfirmationEmailInput,
): string {
  const name = escapeHtml(reservation.name);
  const date = escapeHtml(formatDate(reservation.reservation_date));
  const time = escapeHtml(reservation.reservation_time);
  const pkg = escapeHtml(reservation.package_name);
  const extras = escapeHtml(formatExtras(reservation.extras));
  const groupSize = Number(reservation.group_size) || 0;

  const deposit = Number(reservation.deposit_amount ?? 50)
    .toFixed(2)
    .replace(".", ",");

  const label = (text: string) =>
    `<td style="padding:6px 12px 6px 0;white-space:nowrap;"><strong>${escapeHtml(
      text,
    )}</strong></td>`;

  return `
    <p>Beste ${name},</p>

    <p>
      Het is officieel! Jullie gaan binnenkort genieten van een unieke ervaring
      bij Dressperience. We kijken ernaar uit om jullie te ontvangen in Posterholt.
    </p>

    <p>
      Hieronder vind je alle details en tips voor jullie bezoek.
    </p>

    <h3 style="color:#9b72cf;margin:28px 0 8px;font-size:18px;">
      📅 Jullie afspraak
    </h3>

    <table style="border-collapse:collapse;font-size:15px;">
      <tr>
        ${label("Datum:")}
        <td>${date}</td>
      </tr>
      <tr>
        ${label("Tijd:")}
        <td>${time}</td>
      </tr>
      <tr>
        ${label("Locatie:")}
        <td>Heerbaan 54, 6061 EE Posterholt</td>
      </tr>
      <tr>
        ${label("Arrangement:")}
        <td>${pkg}</td>
      </tr>
      <tr>
        ${label("Extra's:")}
        <td>${extras}</td>
      </tr>
      <tr>
        ${label("Groepsgrootte:")}
        <td>${groupSize} personen</td>
      </tr>
    </table>

    <h3 style="color:#9b72cf;margin:28px 0 8px;font-size:18px;">
      Betaalinformatie
    </h3>

    <div style="background:#f8e8ee;padding:14px 16px;border-radius:8px;">
      De aanbetaling van €${deposit} is ontvangen. Het restant kan op de dag
      zelf in de zaak worden voldaan (per pin of contant).
    </div>

    <h3 style="color:#9b72cf;margin:28px 0 8px;font-size:18px;">
      ✨ Checklist: Zo bereid je je voor op de ultieme Dressperience
    </h3>

    <p>
      Met een ruime collectie en een enorme keuze aan tiara's, sluiers, hoedjes
      en sieraden, is er voor ieder wat wils. Zo halen jullie alles uit de middag:
    </p>

    <p style="margin:16px 0 4px;">
      <strong>1. Wat trek je aan? 👙</strong>
    </p>

    <p style="margin:0;">
      Draag bij voorkeur huidkleurig, naadloos ondergoed. Wij hebben schoenen
      in diverse maten, maar je mag natuurlijk ook je eigen favoriete hakken
      meenemen voor de foto's.
    </p>

    <p style="margin:16px 0 4px;">
      <strong>2. Haar &amp; Make-up 💄</strong>
    </p>

    <p style="margin:0;">
      Kom zoals je bent! Wij hebben een 'styling corner' met een föhn, borstels,
      haarklemmen en doekjes klaarliggen om de puntjes op de i te zetten.
    </p>

    <p style="margin:8px 0 0;">
      <em>
        Let op: Gebruik geen zelfbruiner of vloeibare foundation op je
        hals/decolleté om onze droomjurken stralend schoon te houden.
      </em>
    </p>

    <p style="margin:16px 0 4px;">
      <strong>3. Bereikbaarheid &amp; Toegankelijkheid 🚗</strong>
    </p>

    <p style="margin:0;">
      Onze locatie aan de Heerbaan 54 is volledig rolstoeltoegankelijk. Je kunt
      gratis parkeren in de vakken direct voor de deur. Kom je met een
      elektrische auto? Er is een publieke laadpaal aanwezig naast het terrein.
    </p>

    <p style="margin:16px 0 4px;">
      <strong>4. Lokale traktatie &amp; Allergieën 🍰</strong>
    </p>

    <p style="margin:0;">
      Onze lokale bakker zorgt voor een heerlijke traktatie bij de bubbels.
      Zijn er specifieke allergieën? Laat het ons uiterlijk 48 uur van tevoren
      weten.
    </p>

    <p style="margin-top:28px;">
      Ook al zoveel zin erin? Wij wel!
    </p>

    <p style="margin:16px 0 0;font-style:italic;color:#9b72cf;">
      Take a walk on the bride side,
    </p>

    <p style="margin:16px 0 0;">
      Met sprankelende groet,
    </p>

    <p style="margin:16px 0 0;">
      <strong>Deborah Winkelmolen</strong><br />
      Dressperience Posterholt<br />
      📍 Heerbaan 54, Posterholt<br />
      📞 06-42515172<br />
      📧
      <a
        href="mailto:info@dressperience.com"
        style="color:#9b72cf;"
      >
        info@dressperience.com
      </a>
      <br />
      🌐
      <a
        href="https://www.dressperience.com"
        style="color:#9b72cf;"
      >
        www.dressperience.com
      </a>
    </p>
  `;
}