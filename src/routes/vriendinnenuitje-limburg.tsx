import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, Heart, Camera, Wine } from "lucide-react";
import home2 from "@/assets/home-2.jpg";
import home3 from "@/assets/home-3.jpg";
import home4 from "@/assets/home-4.jpg";

export const Route = createFileRoute("/vriendinnenuitje-limburg")({
  head: () => ({
    meta: [
      { title: "Vriendinnenuitje Limburg — Dressperience" },
      { name: "description", content: "Op zoek naar een uniek vriendinnenuitje of vrouwenuitje in Limburg? Bij Dressperience passen jullie samen trouwjurken, maken jullie foto's en genieten jullie van een dag vol glamour." },
      { property: "og:title", content: "Vriendinnenuitje Limburg — Dressperience" },
      { property: "og:description", content: "Een uniek vriendinnenuitje of vrouwenuitje in Limburg: trouwjurken passen, foto's maken en samen genieten." },
      { property: "og:url", content: "https://dress-sparkle-share.lovable.app/vriendinnenuitje-limburg" },
    ],
    links: [
      { rel: "canonical", href: "https://dress-sparkle-share.lovable.app/vriendinnenuitje-limburg" },
    ],
  }),
  component: VriendinnenuitjePage,
});

function VriendinnenuitjePage() {
  return (
    <div className="min-h-screen">
      <section className="relative grid min-h-[70vh] grid-cols-1 md:grid-cols-2">
        <div className="order-2 flex flex-col justify-center px-6 py-16 md:order-1 md:px-12 lg:px-16">
          <div className="max-w-lg">
            <span className="inline-flex items-center gap-2 rounded-full bg-lavender-500/10 px-4 py-1.5 font-body text-xs font-medium uppercase tracking-widest text-lavender-600">
              <Sparkles size={14} />
              Uniek vriendinnenuitje in Limburg
            </span>
            <h1 className="mt-6 font-display text-5xl font-light leading-tight text-foreground md:text-6xl">
              Een vriendinnenuitje met een <span className="font-semibold italic text-lavender-600">toucherijke</span> twist
            </h1>
            <p className="mt-6 font-body text-lg leading-relaxed text-muted-foreground">
              Verras je vriendinnen met een dag vol trouwjurken, glitter en gelach. Bij Dressperience in Posterholt, Limburg, beleef je een vriendinnenuitje dat niemand snel vergeet. Funfitting is dé activiteit voor een onvergetelijke vriendinnendag.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/reservations"
                className="inline-flex items-center justify-center rounded-full bg-lavender-600 px-8 py-3.5 font-body text-sm font-semibold uppercase tracking-widest text-primary-foreground transition-all hover:bg-lavender-700 hover:shadow-lg hover:shadow-lavender-500/20"
              >
                Boek jullie dag
              </Link>
              <Link
                to="/gallery"
                className="inline-flex items-center justify-center rounded-full border border-border bg-background px-8 py-3.5 font-body text-sm font-semibold uppercase tracking-widest text-foreground transition-all hover:bg-blush-200/50"
              >
                Bekijk foto's
              </Link>
            </div>
          </div>
        </div>

        <div className="relative order-1 min-h-[50vh] md:order-2 md:min-h-full">
          <img
            src={home2}
            alt="Vriendinnenuitje Limburg bij Dressperience"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/30 via-transparent to-transparent md:from-background/60" />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-display text-4xl font-light text-foreground md:text-5xl">
            Waarom funfitting het ideale <span className="font-semibold italic text-lavender-600">vrouwenuitje</span> is
          </h2>
          <p className="mx-auto mt-4 max-w-3xl font-body text-lg text-muted-foreground">
            Geen doorsnee dagje shoppen of high tea, maar een beleving waar jullie het maanden later nog over hebben. Samen stralen, samen lachen en samen herinneringen maken.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="rounded-2xl border border-border/60 bg-card p-8 text-center transition-all hover:border-lavender-400/50 hover:shadow-lg hover:shadow-lavender-500/5">
              <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-lavender-500/10 text-lavender-600">
                <feature.icon size={28} />
              </div>
              <h3 className="mt-4 font-display text-xl font-semibold text-foreground">{feature.title}</h3>
              <p className="mt-2 font-body text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-blush-100/50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-4xl font-light text-foreground md:text-5xl">
                Een dag vol <span className="font-semibold italic text-lavender-600">verwennen</span>
              </h2>
              <div className="mt-8 space-y-5">
                {reasons.map((reason) => (
                  <div key={reason} className="flex items-start gap-3">
                    <Heart className="mt-1 shrink-0 text-lavender-500" size={18} />
                    <p className="font-body text-base text-muted-foreground">{reason}</p>
                  </div>
                ))}
              </div>
              <div className="mt-10">
                <Link
                  to="/reservations"
                  className="inline-flex items-center justify-center rounded-full bg-lavender-600 px-8 py-3.5 font-body text-sm font-semibold uppercase tracking-widest text-primary-foreground transition-all hover:bg-lavender-700"
                >
                  Plan jullie vriendinnendag
                </Link>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-2xl">
              <img
                src={home3}
                alt="Vrouwenuitje Limburg met funfitting bij Dressperience"
                className="h-[450px] w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 rounded-3xl bg-gradient-to-br from-blush-100/60 to-lavender-500/10 p-8 md:p-16 lg:grid-cols-2">
          <div className="relative flex justify-center">
            <img
              src={home4}
              alt="Unieke vriendinnendag bij Dressperience in Limburg"
              className="h-[400px] w-full max-w-md rounded-2xl object-cover"
            />
          </div>
          <div>
            <h2 className="font-display text-4xl font-light text-foreground md:text-5xl">
              Klaar voor een unieke <span className="font-semibold italic text-lavender-600">vriendinnendag</span>?
            </h2>
            <p className="mt-6 font-body text-lg leading-relaxed text-muted-foreground">
              Of je nu een verjaardag, afscheid of gewoon een goed excuus zoekt om er samen op uit te gaan: een vriendinnenuitje bij Dressperience is altijd een goed idee. Reserveer nu je plek in Posterholt, Limburg.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/reservations"
                className="inline-flex items-center justify-center rounded-full bg-lavender-600 px-8 py-3.5 font-body text-sm font-semibold uppercase tracking-widest text-primary-foreground transition-all hover:bg-lavender-700"
              >
                Reserveren
              </Link>
              <Link
                to="/faq"
                className="inline-flex items-center justify-center rounded-full border border-border bg-background px-8 py-3.5 font-body text-sm font-semibold uppercase tracking-widest text-foreground transition-all hover:bg-blush-200/50"
              >
                Veelgestelde vragen
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

const features = [
  {
    icon: Wine,
    title: "Bubbels & ontspanning",
    description: "Een warm onthaal met een sprankelend drankje en een ontspannen sfeer voor jullie groep.",
  },
  {
    icon: Camera,
    title: "Foto's van jullie dag",
    description: "Laat de mooiste momenten vastleggen met een optionele professionele foto-shoot.",
  },
  {
    icon: Sparkles,
    title: "200+ trouwjurken",
    description: "Van klassiek tot modern, in maten 34 t/m 56. Er is voor ieder wat wils.",
  },
];

const reasons = [
  "Een privé-locatie in Posterholt, exclusief voor jullie groep",
  "Professionele begeleiding en styling corner",
  "Ideaal voor verjaardagen, afscheid of gewoon een leuke dag",
  "Optionele extras zoals foto's, chocolade en hartige hapjes",
  "Alleen op reservering, zodat je rustig kunt genieten",
];
