// Server-only Mollie helper. Never import from client-safe module scope.

const MOLLIE_API = "https://api.mollie.com/v2";

function apiKey(): string {
  const key = process.env.MOLLIE_API_KEY;
  if (!key) throw new Error("MOLLIE_API_KEY is not configured");
  return key;
}

export type MolliePayment = {
  id: string;
  status: string;
  amount: { value: string; currency: string };
  metadata?: Record<string, unknown> | null;
  _links?: { checkout?: { href: string } };
};

export async function createMolliePayment(input: {
  amount: number;
  description: string;
  redirectUrl: string;
  webhookUrl?: string;
  metadata?: Record<string, unknown>;
}): Promise<MolliePayment> {
  const res = await fetch(`${MOLLIE_API}/payments`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: {
        currency: "EUR",
        value: input.amount.toFixed(2),
      },
      description: input.description,
      redirectUrl: input.redirectUrl,
      ...(input.webhookUrl ? { webhookUrl: input.webhookUrl } : {}),
      ...(input.metadata ? { metadata: input.metadata } : {}),
      locale: "nl_NL",
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error(`Mollie create payment failed [${res.status}]: ${body}`);
    throw new Error("De betaling kon niet worden gestart.");
  }

  return (await res.json()) as MolliePayment;
}

export async function getMolliePayment(id: string): Promise<MolliePayment> {
  const res = await fetch(`${MOLLIE_API}/payments/${encodeURIComponent(id)}`, {
    headers: { Authorization: `Bearer ${apiKey()}` },
  });

  if (!res.ok) {
    const body = await res.text();
    console.error(`Mollie fetch payment failed [${res.status}]: ${body}`);
    throw new Error("Betaling kon niet worden opgehaald.");
  }

  return (await res.json()) as MolliePayment;
}
