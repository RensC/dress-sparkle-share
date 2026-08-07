import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, Heart, Camera, Wine, MapPin } from "lucide-react";
import home2 from "@/assets/home-2.jpg";
import home3 from "@/assets/home-3.jpg";
import home4 from "@/assets/home-4.jpg";

export const Route = createFileRoute("/funfitting-limburg")({
  head: () => ({
    meta: [
      { title: "Funfitting Limburg — Dressperience" },
      { name: "description", content: "Funfitting in Limburg: bij Dressperience in Posterholt passen jij en je vriendinnen samen prachtige trouwjurken voor de lol. Inclusief drankjes, foto's en een onvergetelijke ervaring." },
      { property: "og:title", content: "Funfitting Limburg — Dressperience" },
      { property: "og:description", content: "Funfitting in Limburg: samen trouwjurken passen voor de lol, met drankjes, foto's en een dag vol glamour." },
      { property: "og:url", content: "https://dress-sparkle-share.lovable.app/funfitting-limburg" },
    ],
    links: [
      { rel: "canonical", href: "https://dress-sparkle-share.lovable.app/funfitting-limburg" },
    ],
  }),
  component: FunfittingLimburgPage,
});

function FunfittingLimburgPage() {
  return (
    <div className="min-h-screen">
      <section className="relative grid min-h-[70vh] grid-cols-1 md:grid-cols-2">
        <div className="order-2 flex flex-col justify-center px-6 py-16 md:order-1 md:px-12 lg:px-16">
          <div className="max-w-lg">
            <span className="inline-flex items-center gap-2 rounded-full bg-lavender-500/10 px-4 py-1.5 font-body text-xs font-medium uppercase tracking-widest text-lavender-600">
              <Sparkles size={14} />
              Funfitting in Limburg
            </span>
            <h1 className="mt-6 font-display text-5xl font-light leading-tight text-foreground md:text-6xl">
              <span className="font-semibold italic text-lavender-600">Funfitting</span> in Limburg
            </h1>
            <p className="mt-6 font-body text-lg leading-relaxed text-muted-foreground">
              Ben je op zoek naar funfitting in Limburg? Bij Dressperience in Posterholt beleef je dé trouwjurkenlol: samen met vriendinnen prachtige jurken passen, foto's maken en genieten van een dag vol glamour. Ook wel bekend als trouwjurkenlol, fun-fitten of een say-yes-to-the-dress experience.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/reservations"
                className="inline-flex items-center justify-center rounded-full bg-lavender-600 px-8 py-3.5 font-body text-sm font-semibold uppercase tracking-widest text-primary-foreground transition-all hover:bg-lavender-700 hover:shadow-lg hover:shadow-lavender-500/20"
              >
                Boek funfitting
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-full border border-border bg-background px-8 py-3.5 font-body text-sm font-semibold uppercase tracking-widest text-foreground transition-all hover:bg-blush-200/50"
              >
                Meer info
              </Link>
            </div>
          </div>
        </div>

        <div className="relative order-1 min-h-[50vh] md:order-2 md:min-h-full">
          <img
            src={home2}
            alt="Funfitting in Limburg bij Dressperience"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/30 via-transparent to-transparent md:from-background/60" />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-display text-4xl font-light text-foreground md:text-5xl">
            Wat is <span className="font-semibold italic text-lavender-600">funfitting</span> precies?
          </h2>
          <p className="mx-auto mt-4 max-w-3xl font-body text-lg text-muted-foreground">
            Funfitting is het passen van trouwjurken zonder dat er een bruiloft aan te pas komt. Je doet het gewoon voor de lol. Met vriendinnen, collega's, familie — iedereen die zin heeft in een dag vol glitter, tule en gelach. In Limburg is Dressperience hét adres voor deze unieke ervaring.
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
            <div className="relative order-2 overflow-hidden rounded-2xl lg:order-1">
              <img
                src={home3}
                alt="Funfitting ervaring in Limburg"
                className="h-[450px] w-full object-cover"
              />
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="font-display text-4xl font-light text-foreground md:text-5xl">
                Dressperience in <span className="font-semibold italic text-lavender-600">Posterholt</span>
              </h2>
              <p className="mt-6 font-body text-lg leading-relaxed text-muted-foreground">
                Onze locatie in Posterholt is centraal gelegen in Limburg en volledig rolstoeltoegankelijk. Er is gratis parkeergelegenheid voor de deur en laadpalen voor elektrische auto's. De studio is exclusief voor jullie gereserveerd, zodat jullie ongestoord kunnen passen, poseren en genieten.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <div className="flex items-center gap-2 font-body text-sm text-muted-foreground">
                  <MapPin size={16} className="text-lavender-600" />
                  Heerbaan 54, 6061 EE Posterholt
                </div>
              </div>
              <div className="mt-6">
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center rounded-full bg-lavender-600 px-8 py-3.5 font-body text-sm font-semibold uppercase tracking-widest text-primary-foreground transition-all hover:bg-lavender-700"
                >
                  Vind de route
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 rounded-3xl bg-gradient-to-br from-blush-100/60 to-lavender-500/10 p-8 md:p-16 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-4xl font-light text-foreground md:text-5xl">
              Voor wie is <span className="font-semibold italic text-lavender-600">funfitting</span>?
            </h2>
            <p className="mt-6 font-body text-lg leading-relaxed text-muted-foreground">
              Funfitting is voor iedereen die zin heeft in een bijzondere dag. Vrijgezellenfeesten, vriendinnenweekenden, vrouwen uitjes, moeder-dochter-momenten, verjaardagen of een teamuitje. Je hoeft niet te trouwen om je een bruid te voelen.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/reservations"
                className="inline-flex items-center justify-center rounded-full bg-lavender-600 px-8 py-3.5 font-body text-sm font-semibold uppercase tracking-widest text-primary-foreground transition-all hover:bg-lavender-700"
              >
                Reserveer funfitting
              </Link>
              <Link
                to="/vrijgezellenfeest-limburg"
                className="inline-flex items-center justify-center rounded-full border border-border bg-background px-8 py-3.5 font-body text-sm font-semibold uppercase tracking-widest text-foreground transition-all hover:bg-blush-200/50"
              >
                Vrijgezellenfeest
              </Link>
            </div>
          </div>
          <div className="relative flex justify-center">
            <img
              src={home4}
              alt="Funfitting activiteit in Limburg"
              className="h-[400px] w-full max-w-md rounded-2xl object-cover"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

const features = [
  {
    icon: Heart,
    title: "200+ trouwjurken",
    description: "Een enorme collectie jurken in maten 34 t/m 56. Van klassiek tot modern, er is voor elke stijl een perfecte jurk.",
  },
  {
    icon: Wine,
    title: "Welkomstdrankje",
    description: "Bij aankomst staat er een sprankelend drankje klaar. Zo start je de dag meteen feestelijk.",
  },
  {
    icon: Camera,
    title: "Professionele foto's",
    description: "Leg de mooiste momenten vast met een optionele mini-foto-shoot. Herinneringen voor het leven.",
  },
];
