import { createFileRoute } from "@tanstack/react-router";
import { Award, Users, Heart, Sparkles } from "lucide-react";

import aboutImg from "@/assets/about.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Over ons — Dressperience" },
      { name: "description", content: "Leer Dressperience kennen en onze passie voor het creëren van onvergetelijke funfitting-momenten voor vrouwen en hun vriendinnen." },
      { property: "og:title", content: "Over ons — Dressperience" },
      { property: "og:description", content: "Leer Dressperience kennen en onze passie voor onvergetelijke funfitting-momenten." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden bg-blush-100/40 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="font-body text-xs font-semibold uppercase tracking-widest text-lavender-600">
                Ons verhaal
              </span>
              <h1 className="mt-4 font-display text-5xl font-light text-foreground md:text-6xl">
                Een droom geboren uit
                <span className="block font-semibold italic text-lavender-600">Vriendschap & Vreugde</span>
              </h1>
              <p className="mt-6 font-body text-lg leading-relaxed text-muted-foreground">
                Als klein meisje was ik al bezeten van trouwjurken. Ik had een grote stapel tijdschriften "trouwen" en bladerde er dagelijks doorheen. Op de vraag: "Wat wil je worden als je later groot bent?" antwoorde ik: “Ik ga later heel vaak trouwen, dan kan ik elke keer een andere jurk aan!”.
              </p>
              <p className="font-body text-lg leading-relaxed text-muted-foreground">
                Dressperience is ontstaan vanuit een simpele kinderwens, omgezet tot een prachtig idee: elke vrouw verdient het om zich een bruid te voelen, ook als ze niet gaat trouwen. Onze funfitting-sessies veranderen een gewone dag in een buitengewone viering van vriendschap, schoonheid en gelach.
              </p>
            </div>
            <div className="relative overflow-hidden rounded-2xl">
              <img
                src={aboutImg}
                alt="Elegante paskamer in de Dressperience studio"
                className="h-[450px] w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <p className="font-body text-lg leading-relaxed text-muted-foreground">
            Jaren later besloten mijn beste vriendin en ik trouwjurken te gaan passen, gewoon voor de lol. Het gelach, het stralen en de vreugde om elkaar in iets werkelijk moois te zien — het was magisch. Dit gevoel wilde ik met meer vrouwen delen.
          </p>
          <p className="font-body text-lg leading-relaxed text-muted-foreground">
            Bij Dressperience creëren we een warme, gastvrije ruimte waar je het alledaagse achter je laat en in iets bijzonders stapt. Onze zorgvuldig samengestelde collectie biedt jurken voor elke stijl en silhouet, van tijdloze klassiekers tot moderne blikvangers.
          </p>
          <p className="font-body text-lg leading-relaxed text-muted-foreground">
            Elke sessie is persoonlijk en de gehele locatie is exclusief voor jullie gereserveerd. Met sprankelende bubbeltjes, professionele fotografie en een ontspannen sfeer zorgen we ervoor dat jullie ervaring net zo onvergetelijk is als de jurken zelf.
          </p>
        </div>

        <blockquote className="mt-12 border-l-4 border-lavender-500 pl-6">
          <p className="font-display text-2xl font-light italic text-foreground md:text-3xl">
            "Elke vrouw verdient het om zich mooi, gevierd en helemaal zichzelf te voelen."
          </p>
          <footer className="mt-3 font-body text-sm text-muted-foreground">
            — Het Dressperience Team
          </footer>
        </blockquote>
      </section>

      <section className="bg-blush-100/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="font-display text-4xl font-light text-foreground md:text-5xl">
              Waar we in <span className="font-semibold italic text-lavender-600">geloven</span>
            </h2>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <div key={value.title} className="text-center">
                <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-lavender-500/10 text-lavender-600">
                  <value.icon size={28} />
                </div>
                <h3 className="mt-4 font-display text-xl font-semibold text-foreground">
                  {value.title}
                </h3>
                <p className="mt-2 font-body text-sm leading-relaxed text-muted-foreground">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

const values = [
  {
    icon: Heart,
    title: "Inclusiviteit",
    description: "Elk lichaam is mooi. Onze jurken zijn beschikbaar in een breed scala aan maten, zodat iedere gast straalt.",
  },
  {
    icon: Sparkles,
    title: "Kwaliteit",
    description: "We selecteren alleen de mooiste jurken, zodat elke pasbeurt voelt als een luxe ervaring.",
  },
  {
    icon: Users,
    title: "Verbondenheid",
    description: "Onze sessies brengen vriendinnen dichter bij elkaar en creëren blijvende gedeelde herinneringen.",
  },
  {
    icon: Award,
    title: "Excellentie",
    description: "Vanaf het moment dat je aankomt tot de laatste foto wordt elk detail met zorg verzorgd.",
  },
];
