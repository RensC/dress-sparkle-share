import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "Veelgestelde vragen — Dressperience" },
      { name: "description", content: "Antwoorden op de meest gestelde vragen over funfitting bij Dressperience: reserveren, pakketten, jurken, drankjes en foto's." },
      { property: "og:title", content: "Veelgestelde vragen — Dressperience" },
      { property: "og:description", content: "Antwoorden op de meest gestelde vragen." },
    ],
  }),
  component: FaqPage,
});

const faqs = [
  {
    q: "Is het terrein toegankelijk?",
    a: "Ja, het gehele terrein is toegankelijk voor rolstoelgebruikers. Twijfel je? Neem gerust even contact op, dan kijken we samen naar de mogelijkheden.",
  },
  {
    q: "Mag ik mee ook al wil ik geen jurken passen?",
    a: "Voor mensen die niet willen passen word €15,- in rekening gebracht.",
  },
  {
    q: "Zijn de jurken wel schoon?",
    a: "Alle jurken worden nagekeken, gereinigd en/of gerepareerd na bezoek.",
  },
  {
    q: "Welke maten jurken hebben jullie?",
    a: "We hebben ongeveer 200 unieke jurken, in de maten 34 t/m 56.",
  },
  {
    q: "Mag ik make-up dragen?",
    a: "Het gebruik van bruiningscremes is niet toegestaan. tijdens het passen kan eventueel gebruik worden gemaakt van een pasmasker/pasnetje die de jurken en de make-up beschermt.",
  },
  {
    q: "Mag ik zelf eten en drinken meenemen?",
    a: "Nee, dit is niet toegestaan.",
  },
  {
    q: "Mag ik kinderen meenemen?",
    a: "Wij richten ons enkel op (jong)volwassenen.",
  },
  {
    q: "Zijn huisdieren toegestaan?",
    a: "Nee, huisdieren zijn niet toegestaan. ADL-hulpdieren, signaal- of geleidehonden zijn wel toegestaan. ",
  },
  {
    q: "Hoe zit het met reserveren?",
    a: "Bezoek is alleen mogelijk is op afspraak. Reserveren kan via het reserveringsformulier. Om jullie reservering definitief te maken, werken wij met een aanbetaling van €50 per groep. Na ontvangst van de bevestiging staat jullie moment vast. Reservering kan tot 48 uur van te voren worden gewijzigd of geannuleerd. De aanbetaling wordt niet terugbetaald, maar kan worden gebruikt om een nieuwe datum te plannen. Bij annuleringen binnen 48 uur vervalt de aanbetaling. ",
  },
  {
    q: "Hoe kan ik betalen?",
    a: "Aanbetaling van €50,- dient vooraf te worden overgemaakt. Resterend bedrag en eventueel optionele pakketten kunnen ter plekke per QR-code of contant vorden voldaan. ",
  },
  {
    q: "Is er parkeergelegenheid?",
    a: "Ja, voor de deur kunnen jullie gratis parkeren. Tevens zijn er laadpalen beschikbaar.",
  },
  {
    q: "Hoe is het rookbeleid?",
    a: "In het gehele gebouw geldt een rookverbod. wel is er buiten een gelegenheid om te roken voor of na de passessie. Tijdens het dragen van een jurk is roken niet toegestaan. ",
  },
];

function FaqPage() {
  return (
    <div className="min-h-screen">
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="font-body text-xs font-semibold uppercase tracking-widest text-lavender-600">
            Hulp & info
          </span>
          <h1 className="mt-4 font-display text-5xl font-light text-foreground md:text-6xl">
            Veelgestelde <span className="font-semibold italic text-lavender-600">vragen</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl font-body text-lg text-muted-foreground">
            Staat jouw vraag er niet bij? We helpen je graag verder.
          </p>
        </div>

        <Accordion type="single" collapsible className="mt-12 space-y-3">
          {faqs.map((item, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="rounded-xl border border-border/60 bg-card px-6"
            >
              <AccordionTrigger className="font-body text-left text-base font-semibold text-foreground hover:no-underline">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="font-body text-sm leading-relaxed text-muted-foreground">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-16 rounded-2xl bg-blush-100/50 p-8 text-center">
          <h2 className="font-display text-2xl font-light text-foreground">
            Heb je een andere vraag?
          </h2>
          <p className="mt-2 font-body text-sm text-muted-foreground">
            We beantwoorden je vraag graag persoonlijk.
          </p>
          <Link
            to="/contact"
            className="mt-6 inline-flex items-center justify-center rounded-full bg-lavender-600 px-8 py-3 font-body text-sm font-semibold uppercase tracking-widest text-primary-foreground transition-all hover:bg-lavender-700"
          >
            Neem contact op
          </Link>
        </div>
      </section>
    </div>
  );
}
