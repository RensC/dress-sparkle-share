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
      { property: "og:description", content: "Antwoorden op alle vragen over een funfitting-sessie bij Dressperience." },
    ],
  }),
  component: FaqPage,
});

const faqs = [
  {
    q: "Wat is funfitting precies?",
    a: "Funfitting is een unieke ervaring waarbij kleine groepjes vrouwen prachtige trouwjurken passen, puur voor de plezier. Geen bruiloft nodig — gewoon glamour, gelach en mooie herinneringen met je vriendinnen.",
  },
  {
    q: "Moet ik trouwen om te komen?",
    a: "Absoluut niet! Funfitting is voor iedereen die zich een dag prinses wil voelen: vrijgezellenfeestjes, verjaardagen, moeder-dochter-uitjes of gewoon een leuke dag uit.",
  },
  {
    q: "Hoe groot mag mijn groep zijn?",
    a: "Onze sessies zijn er voor 1 tot 6 gasten. Voor het Sparkle-pakket maximaal 2 personen, Glamour tot 4 en Celebration tot 6.",
  },
  {
    q: "Hoe ver van tevoren moet ik boeken?",
    a: "We vragen minimaal 7 dagen vooraf te reserveren. Weekendplekken zijn populair en raken snel volgeboekt, dus eerder boeken is slim.",
  },
  {
    q: "Welke maten jurken hebben jullie?",
    a: "Onze collectie is bewust inclusief samengesteld, met jurken in maat 34 t/m 50. Bij twijfel kun je ons altijd vooraf even mailen.",
  },
  {
    q: "Krijg ik de foto's mee naar huis?",
    a: "Ja! Bij elk pakket horen bewerkte digitale foto's die binnen 5 werkdagen via een privé online galerij worden geleverd.",
  },
  {
    q: "Zijn drankjes echt inbegrepen?",
    a: "Zeker. Bij elke sessie krijg je complimentaire prosecco, champagne of verfrissende mocktails. Bij Glamour en Celebration zijn ook hapjes inbegrepen.",
  },
  {
    q: "Mogen we onze eigen drank meenemen?",
    a: "Dat is niet nodig — wij zorgen voor alles. Heb je een speciale wens? Laat het weten in je reservering, dan kijken we wat mogelijk is.",
  },
  {
    q: "Wat moet ik aantrekken?",
    a: "Draag comfortabel ondergoed in een neutrale kleur. Strapless bh's werken het best bij veel jurken. Hakken zijn welkom maar niet verplicht.",
  },
  {
    q: "Kan ik mijn reservering annuleren of verzetten?",
    a: "Tot 7 dagen voor je sessie kun je kosteloos verzetten of annuleren. Bij annulering binnen 7 dagen brengen we 50% van het bedrag in rekening.",
  },
  {
    q: "Is er parkeergelegenheid?",
    a: "Ja, voor de deur aan de Heerbaan in Posterholt is gratis parkeren beschikbaar.",
  },
  {
    q: "Kan ik een cadeaubon kopen?",
    a: "Jazeker! Een funfitting-ervaring is een prachtig cadeau. Neem contact met ons op voor een gepersonaliseerde cadeaubon.",
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
            Alles wat je wilt weten over een funfitting-sessie bij Dressperience. Staat jouw vraag er niet bij? We helpen je graag verder.
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
            Nog een vraag?
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
