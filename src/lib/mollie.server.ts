// Server-only Mollie helper.
// Never import this file into client-side modules.

const MOLLIE_API = "https://api.mollie.com/v2";

function apiKey(): string {
  const key = process.env.MOLLIE_API_KEY?.trim();

  if (!key) {
    throw new Error("MOLLIE_API_KEY is not configured");
  }

  return key;
}

export type MolliePaymentStatus =
  | "open"
  | "pending"
  | "authorized"
  | "paid"
  | "failed"
  | "canceled"
  | "expired";

export type MolliePayment = {
  id: string;
  status: MolliePaymentStatus;
  amount: {
    value: string;
    currency: string;
  };
  metadata?: Record<string, unknown> | null;
  _links?: {
    checkout?: {
      href: string;
    };
  };
};

type MollieErrorResponse = {
  status?: number;
  title?: string;
  detail?: string;
};

function validateAmount(amount: number): void {
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Ongeldig betalingsbedrag.");
  }

  if (amount > 100_000) {
    throw new Error("Het betalingsbedrag is te hoog.");
  }
}

function parsePayment(value: unknown): MolliePayment {
  if (
    typeof value !== "object" ||
    value === null
  ) {
    throw new Error("Ongeldig antwoord van Mollie.");
  }

  const payment = value as Partial<MolliePayment>;

  if (
    typeof payment.id !== "string" ||
    typeof payment.status !== "string" ||
    typeof payment.amount !== "object" ||
    payment.amount === null ||
    typeof payment.amount.value !== "string" ||
    typeof payment.amount.currency !== "string"
  ) {
    throw new Error("Onvolledig antwoord van Mollie.");
  }

  return payment as MolliePayment;
}

async function readMollieError(
  response: Response,
): Promise<string> {
  try {
    const json = (await response.json()) as MollieErrorResponse;

    return [
      json.title,
      json.detail,
    ]
      .filter(Boolean)
      .join(": ")
      .slice(0, 500);
  } catch {
    const text = await response.text();
    return text.slice(0, 500);
  }
}

export async function createMolliePayment(input: {
  amount: number;
  description: string;
  redirectUrl: string;
  webhookUrl?: string;
  metadata?: Record<string, unknown>;
}): Promise<MolliePayment> {
  validateAmount(input.amount);

  if (!input.description.trim()) {
    throw new Error("Betalingsomschrijving ontbreekt.");
  }

  const response = await fetch(
    `${MOLLIE_API}/payments`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey()}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        amount: {
          currency: "EUR",
          value: input.amount.toFixed(2),
        },
        description: input.description.trim(),
        redirectUrl: input.redirectUrl,
        ...(input.webhookUrl
          ? { webhookUrl: input.webhookUrl }
          : {}),
        ...(input.metadata
          ? { metadata: input.metadata }
          : {}),
        locale: "nl_NL",
      }),
    },
  );

  if (!response.ok) {
    const errorDetails =
      await readMollieError(response);

    console.error(
      `Mollie create payment failed [${response.status}]`,
      errorDetails,
    );

    throw new Error(
      "De betaling kon niet worden gestart.",
    );
  }

  return parsePayment(await response.json());
}

export async function getMolliePayment(
  id: string,
): Promise<MolliePayment> {
  if (!/^tr_[A-Za-z0-9]+$/.test(id)) {
    throw new Error("Ongeldig Mollie-betalingsnummer.");
  }

  const response = await fetch(
    `${MOLLIE_API}/payments/${encodeURIComponent(id)}`,
    {
      headers: {
        Authorization: `Bearer ${apiKey()}`,
        Accept: "application/json",
      },
    },
  );

  if (!response.ok) {
    const errorDetails =
      await readMollieError(response);

    console.error(
      `Mollie fetch payment failed [${response.status}]`,
      errorDetails,
    );

    throw new Error(
      "Betaling kon niet worden opgehaald.",
    );
  }

  return parsePayment(await response.json());
}