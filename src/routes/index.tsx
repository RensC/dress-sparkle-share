import { Link } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { Heart, Camera, Wine, CalendarDays, Sparkles } from "lucide-react";

import heroImg from "@/assets/hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dressperience — Funfitting met vriendinnen" },
      { name: "description", content: "Pas samen met vriendinnen prachtige trouwjurken voor de lol. Een unieke ervaring met foto's en drankjes inbegrepen. Boek vandaag jouw funfitting-sessie!" },
      { property: "og:title", content: "Dressperience — Funfitting met vriendinnen" },
      { property: "og:description", content: "Pas samen met vriendinnen prachtige trouwjurken voor de lol. Een unieke ervaring met foto's en drankjes inbegrepen." },
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
              Zeg ja tegen
              <span className="block font-semibold italic text-lavender-600">Plezier</span>
            </h1>
            <p className="mt-6 font-body text-lg leading-relaxed text-muted-foreground">
              Verzamel je vriendinnen en stap in een wereld van glamour. Pas prachtige trouwjurken, geniet van complimentaire drankjes en leg onvergetelijke momenten vast — geen bruiloft vereist.
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
            src={heroImg}
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
            Funfitting is onze unieke ervaring waarbij kleine groepjes vrouwen prachtige trouwjurken passen, puur voor de lol. De perfecte manier om vriendschap, mijlpalen of gewoon een onvergetelijk uitje te vieren.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-2xl border border-border/60 bg-card p-8 transition-all hover:border-lavender-400/50 hover:shadow-lg hover:shadow-lavender-500/5"
            >
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-lavender-500/10 text-lavender-600 transition-colors group-hover:bg-lavender-500/20">
                <feature.icon size={24} />
              </div>
              <h3 className="mt-5 font-display text-xl font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="mt-2 font-body text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
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
                    Sessies zijn beschikbaar op afspraak om een intieme, persoonlijke ervaring te garanderen.
                  </p>
                </div>
                <div className="rounded-xl bg-card p-6 shadow-sm">
                  <div className="flex items-center gap-3">
                    <Wine size={20} className="text-rose-400" />
                    <span className="font-body text-sm font-medium text-foreground">Drankjes inbegrepen</span>
                  </div>
                  <p className="mt-2 font-body text-sm text-muted-foreground">
                    Geniet van complimentaire prosecco, champagne of verfrissende mocktails tijdens je sessie.
                  </p>
                </div>
                <div className="rounded-xl bg-card p-6 shadow-sm">
                  <div className="flex items-center gap-3">
                    <Camera size={20} className="text-gold-400" />
                    <span className="font-body text-sm font-medium text-foreground">Foto's inbegrepen</span>
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

      {/* CTA Sectie */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-lavender-600 px-6 py-16 text-center md:px-12 md:py-20">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-lavender-500/30 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-lavender-400/20 blur-3xl" />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="font-display text-3xl font-light text-white md:text-5xl">
              Klaar voor jouw
              <span className="block font-semibold italic">Dressperience?</span>
            </h2>
            <p className="mt-4 font-body text-lg text-lavender-100">
              Verzamel je vriendinnen en boek een sessie. Maak herinneringen die je voor altijd koestert.
            </p>
            <Link
              to="/reservations"
              className="mt-8 inline-flex items-center justify-center rounded-full bg-white px-10 py-4 font-body text-sm font-semibold uppercase tracking-widest text-lavender-700 transition-all hover:bg-blush-50 hover:shadow-xl"
            >
              Boek nu
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

const features = [
  {
    icon: Heart,
    title: "Pas prachtige jurken",
    description: "Stap binnen in onze zorgvuldig samengestelde collectie schitterende trouwjurken. Van klassieke baljurken tot strakke mermaids, vind jouw droomstijl.",
  },
  {
    icon: Wine,
    title: "Complimentaire drankjes",
    description: "Nip van prosecco, champagne of verfrissende mocktails terwijl je jurken past en met je vriendinnen viert.",
  },
  {
    icon: Camera,
    title: "Leg de momenten vast",
    description: "Professionele foto's worden tijdens je sessie gemaakt, zodat je elke lach, draai en glinstering opnieuw kunt beleven.",
  },
];

const experienceSteps = [
  {
    title: "Aankomen & ontspannen",
    description: "Stap binnen in onze prachtige studio, maak het jezelf gemakkelijk en geniet van een welkomstdrankje met je vriendinnen.",
  },
  {
    title: "Pas de jurken",
    description: "Blader door onze collectie en pas zoveel jurken als je wilt. Ons team helpt je graag bij het passen.",
  },
  {
    title: "Poseer voor de camera",
    description: "Wij leggen elk magisch moment vast — het verbaasde gehijg, het gelach, de draaien — in prachtige foto's.",
  },
  {
    title: "Maak herinneringen",
    description: "Sluit je sessie af met een toast en vertrek met foto's, verhalen en herinneringen om te koesteren.",
  },
];
