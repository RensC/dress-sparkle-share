export type ExtraId =
  | "star-treatment"
  | "picture-perfect"
  | "sweet-dream"
  | "savoury-board";

export type ExtraOption = {
  id: ExtraId;
  name: string;
  price: number;
  priceLabel: string;
  tagline: string;
  description: string;
  includes?: string[];
  /** Allows choosing how many units (etagères / planken) */
  quantity?: { min: number; max: number; unit: string };
  /** Optional variant choice (e.g. vegetarisch) */
  variants?: string[];
};

export const extraOptions: ExtraOption[] = [
  {
    id: "star-treatment",
    name: "The Star Treatment",
    price: 20,
    priceLabel: "€20 per groep",
    tagline: "Laat één persoon stralen als dé ster van de dag.",
    description:
      "Is er iemand jarig, wordt er een vrijgezellenfeest gevierd of wil je gewoon iemand extra verrassen? Met The Star Treatment zetten we haar letterlijk én figuurlijk in de spotlight.",
    includes: [
      "Een stijlvolle sjerp om tijdens de Dressperience te dragen",
      "Een feestelijk drankje",
      "Een luxe lekkernij",
      "Een feestelijke setting met passende decoratie (zoals een Happy Birthday-backdrop of glamourdecoratie)",
      "Een extra mini-fotosessie met speciale aandacht voor de ster van de dag",
      "1 professioneel bewerkte digitale portretfoto cadeau als blijvende herinnering",
    ],
  },
  {
    id: "picture-perfect",
    name: "Picture Perfect",
    price: 15,
    priceLabel: "€15 per groep",
    tagline: "Neem de mooiste momenten van jullie Dressperience mee naar huis.",
    description:
      "Via een persoonlijke downloadlink ontvangen jullie alle foto's, die 3 maanden beschikbaar blijft om te downloaden en samen na te genieten. Dit kan ook na afloop van jullie bezoek nog worden toegevoegd.",
  },
  {
    id: "sweet-dream",
    name: "Sweet & Chocolate Dream",
    price: 29.5,
    priceLabel: "€29,50 per etagère (2-3 personen)",
    tagline: "Even samen genieten?",
    description:
      "Laat je verwennen met een feestelijke etagère vol heerlijke zoete lekkernijen, speciaal samengesteld voor Dressperience. Geserveerd met onbeperkt luxe thee voor een compleet verwenmoment.",
    quantity: { min: 1, max: 3, unit: "etagère" },
  },
  {
    id: "savoury-board",
    name: "The Savoury Board",
    price: 19.5,
    priceLabel: "€19,50 per plank (2-3 personen)",
    tagline:
      "Kleine hartige lekkernijen, met zorg samengesteld voor een extra genietmoment.",
    description:
      "Ook verkrijgbaar in een vegetarische of vegan variant. Geef jullie voorkeur eenvoudig door bij de reservering.",
    quantity: { min: 1, max: 3, unit: "plank" },
    variants: ["Standaard", "Vegetarisch", "Vegan"],
  },
];

export type SelectedExtra = {
  id: ExtraId;
  name: string;
  quantity: number;
  variant?: string;
  unitPrice: number;
  total: number;
};

export function formatEuro(value: number): string {
  return `€${value.toFixed(2).replace(".", ",")}`;
}

export function extrasTotal(extras: SelectedExtra[]): number {
  return Number(
    extras.reduce((sum, extra) => sum + extra.total, 0).toFixed(2),
  );
}
