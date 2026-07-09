import { Link } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { Heart, Camera, Wine, CalendarDays, Sparkles } from "lucide-react";

import heroImg from "@/assets/hero.jpg";
import home1 from "@/assets/home-1.jpg";
import home2 from "@/assets/home-2.jpg";
import home3 from "@/assets/home-3.jpg";
import home4 from "@/assets/home-4.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dressperience — Funfitting met vriendinnen" },
      { name: "description", content: "Pas samen met vriendinnen prachtige trouwjurken voor de lol. Een unieke ervaring met veel foto's en gelach. Boek vandaag jouw pas-sessie!" },
      { property: "og:title", content: "Dressperience — Funfitting met vriendinnen" },
      { property: "og:description", content: "Pas samen met vriendinnen prachtige trouwjurken voor de lol. Een unieke ervaring." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero — Split Screen */}
      <section className="relative grid min-h-[85vh] grid-cols-1 md:grid-cols-2">
        <div className="flex flex-col justify-center px-6 py-16 md:px-12 lg:px-16 order-2 md:order-1">
          <div className="max-w-lg">
            <span className="inline-flex items-center gap-2 rounded-full bg-lavender-500/10 px-4 py-1.5 font-body text-xs font-medium uppercase tracking-widest text-lavender-600">
              <Sparkles size={14} />
              Welkom bij Dressperience
            </span>
            <h1 className="mt-6 font-display text-5xl font-light leading-tight text-foreground md:text-6xl lg:text-7xl">
              Say yes to
              <span className="block font-semibold italic text-lavender-600">Dressperience</span>
            </h1>
            <p className="mt-6 font-body text-lg leading-relaxed text-muted-foreground">
              De mooiste trouwjurken passen, elkaar compleet op hypen, draaien voor de spiegel, gillen bij de perfecte look en ondertussen de allerleukste foto’s maken tijdens een mini foto shoot. Vanaf het moment dat jullie binnenstappen, voelt het alsof jullie samen in een romantische film zijn beland. Vol glitter, tule, gezelligheid en keihard lachen. Dit is geen standaard uitje, maar een ervaring waar je maanden later nog steeds over praat!  Of je nu iets te vieren hebt, opzoek bent naar een originele verassing of gewoon zin hebt om jurken te passen.
		     </p>
			  <p><br/><strong><i>Dressperience is zonder twijfel het leukste uitje dat je met je vriendinnen kunt doen! </i></strong>
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/reservations"
                className="inline-flex items-center justify-center rounded-full bg-lavender-600 px-8 py-3.5 font-body text-sm font-semibold uppercase tracking-widest text-primary-foreground transition-all hover:bg-lavender-700 hover:shadow-lg hover:shadow-lavender-500/20"
              >
                Boek je ervaring
              </Link>
              <Link
                to="/gallery"
                className="inline-flex items-center justify-center rounded-full border border-border bg-background px-8 py-3.5 font-body text-sm font-semibold uppercase tracking-widest text-foreground transition-all hover:bg-blush-200/50"
              >
                Bekijk galerij
              </Link>
            </div>
          </div>
        </div>

        <div className="relative order-1 md:order-2 min-h-[50vh] md:min-h-full">
          <img
            src={home1}
            alt="Vriendinnen passen samen prachtige trouwjurken"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/30 via-transparent to-transparent md:from-background/60" />
        </div>
      </section>

      {/* Wat is Funfitting */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-display text-4xl font-light text-foreground md:text-5xl">
            Wat is <span className="font-semibold italic text-lavender-600">Funfitting</span>?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl font-body text-lg text-muted-foreground">
            Funfitting is prachtige trouwjurken passen voor iedereen die zich een dag prinses wil voelen: vrijgezellenfeestjes, verjaardagen, moeder-dochter-uitjes of gewoon een leuke dag uit!
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div className="group rounded-2xl border border-border/60 bg-card p-8 transition-all hover:border-lavender-400/50 hover:shadow-lg hover:shadow-lavender-500/5">
              <img
                src={feature.src}
                alt="Vriendinnen passen samen prachtige trouwjurken"
                className="w-full aspect-square object-cover rounded-md"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Ervaring */}
      <section className="relative overflow-hidden bg-blush-100/50">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="font-body text-xs font-semibold uppercase tracking-widest text-lavender-600">
                De Ervaring
              </span>
              <h2 className="mt-4 font-display text-4xl font-light text-foreground md:text-5xl">
                Een dag vol
                <span className="block font-semibold italic text-lavender-600">Glamour & Gelach</span>
              </h2>
              <div className="mt-8 space-y-6">
                {experienceSteps.map((step, i) => (
                  <div key={step.title} className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-lavender-500/10 font-display text-lg font-semibold text-lavender-600">
                      {i + 1}
                    </div>
                    <div>
                      <h4 className="font-body text-base font-semibold text-foreground">
                        {step.title}
                      </h4>
                      <p className="mt-1 font-body text-sm text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-10">
                <Link
                  to="/reservations"
                  className="inline-flex items-center justify-center rounded-full bg-lavender-600 px-8 py-3.5 font-body text-sm font-semibold uppercase tracking-widest text-primary-foreground transition-all hover:bg-lavender-700"
                >
                  Reserveer je plek
                </Link>
              </div>
            </div>

            <div className="relative rounded-2xl bg-blush-200/40 p-8 lg:p-12">
              <div className="space-y-6">
                <div className="rounded-xl bg-card p-6 shadow-sm">
                  <div className="flex items-center gap-3">
                    <CalendarDays size={20} className="text-lavender-500" />
                    <span className="font-body text-sm font-medium text-foreground">Alleen op reservering</span>
                  </div>
                  <p className="mt-2 font-body text-sm text-muted-foreground">
                    Sessies zijn beschikbaar op afspraak om een exclusieve, persoonlijke ervaring te garanderen.
                  </p>
                </div>
                <div className="rounded-xl bg-card p-6 shadow-sm">
                  <div className="flex items-center gap-3">
                    <Wine size={20} className="text-rose-400" />
                    <span className="font-body text-sm font-medium text-foreground">Welkomsdrankje inbegrepen</span>
                  </div>
                  <p className="mt-2 font-body text-sm text-muted-foreground">
                    Geniet bij aankomst van een heerlijk sprankelend drankje.
                  </p>
                </div>
                <div className="rounded-xl bg-card p-6 shadow-sm">
                  <div className="flex items-center gap-3">
                    <Camera size={20} className="text-gold-400" />
                    <span className="font-body text-sm font-medium text-foreground">Foto's optioneel bij te boeken</span>
                  </div>
                  <p className="mt-2 font-body text-sm text-muted-foreground">
                    Professionele foto's worden gemaakt tijdens je ervaring, zodat je de magie steeds opnieuw kunt beleven.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

const features = [
  {
    icon: Heart,
    src: home2,
  },
  {
    icon: Wine,
    src: home3,
  },
  {
    icon: Camera,
    src: home4,
  },
];

const experienceSteps = [
  {
    title: "Aankomen & ontspannen",
    description: "Stap in een magische wereld, ontspan en geniet samen van een welkomstdrankje.",
  },
  {
    title: "Pas de jurken",
    description: "Neem een kijkje in onze zorgvuldig samengestelde collectie trouwjurken. Van klassieke baljurken tot strakke mermaids, ",
  },
  {
    title: "Poseer voor de camera",
    description: "Leg elk magisch moment vast.",
  },
  {
    title: "Vertrek met magische herinneringen",
    description: "Beleef samen met je vriendinnen een dag die je echt nooit meer vergeet.",
  },
];
