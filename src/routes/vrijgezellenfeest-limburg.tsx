import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, Gift, Heart, Camera } from "lucide-react";
import home2 from "@/assets/home-2.jpg";
import home3 from "@/assets/home-3.jpg";
import home4 from "@/assets/home-4.jpg";

export const Route = createFileRoute("/vrijgezellenfeest-limburg")({
  head: () => ({
    meta: [
      { title: "Vrijgezellenfeest Limburg — Dressperience" },
      { name: "description", content: "Op zoek naar een origineel vrijgezellenfeest in Limburg? Bij Dressperience beleven jullie een unieke funfitting met trouwjurken, foto's en drankjes." },
      { property: "og:title", content: "Vrijgezellenfeest Limburg — Dressperience" },
      { property: "og:description", content: "Een origineel vrijgezellenfeest in Limburg: trouwjurken passen, foto's maken en samen genieten bij Dressperience." },
      { property: "og:url", content: "https://dress-sparkle-share.lovable.app/vrijgezellenfeest-limburg" },
    ],
    links: [
      { rel: "canonical", href: "https://dress-sparkle-share.lovable.app/vrijgezellenfeest-limburg" },
    ],
  }),
  component: VrijgezellenfeestPage,
});

function VrijgezellenfeestPage() {
  return (
    <div className="min-h-screen">
      <section className="relative grid min-h-[70vh] grid-cols-1 md:grid-cols-2">
        <div className="order-2 flex flex-col justify-center px-6 py-16 md:order-1 md:px-12 lg:px-16">
          <div className="max-w-lg">
            <span className="inline-flex items-center gap-2 rounded-full bg-lavender-500/10 px-4 py-1.5 font-body text-xs font-medium uppercase tracking-widest text-lavender-600">
              <Sparkles size={14} />
              Vrijgezellenfeest in Limburg
            </span>
            <h1 className="mt-6 font-display text-5xl font-light leading-tight text-foreground md:text-6xl">
              Een vrijgezellenfeest om nooit te <span className="font-semibold italic text-lavender-600">vergeten</span>
            </h1>
            <p className="mt-6 font-body text-lg leading-relaxed text-muted-foreground">
              Stap met je vriendinnen in een romantische film. Bij Dressperience in Posterholt, Limburg, organiseren wij het perfecte vrijgezellenfeest: samen trouwjurken passen, foto's maken, lachen en proosten. De bruid-to-be verdient het om in de spotlight te staan.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/reservations"
                className="inline-flex items-center justify-center rounded-full bg-lavender-600 px-8 py-3.5 font-body text-sm font-semibold uppercase tracking-widest text-primary-foreground transition-all hover:bg-lavender-700 hover:shadow-lg hover:shadow-lavender-500/20"
              >
                Plan het feest
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-full border border-border bg-background px-8 py-3.5 font-body text-sm font-semibold uppercase tracking-widest text-foreground transition-all hover:bg-blush-200/50"
              >
                Stel een vraag
              </Link>
            </div>
          </div>
        </div>

        <div className="relative order-1 min-h-[50vh] md:order-2 md:min-h-full">
          <img
            src={home2}
            alt="Vrijgezellenfeest met vriendinnen bij Dressperience in Limburg"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/30 via-transparent to-transparent md:from-background/60" />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-display text-4xl font-light text-foreground md:text-5xl">
            Het <span className="font-semibold italic text-lavender-600">perfecte</span> vrijgezellenfeest
          </h2>
          <p className="mx-auto mt-4 max-w-3xl font-body text-lg text-muted-foreground">
            Geen standaard vrijgezellenfeest met verplichte opdrachten, maar een dag vol glamour, vriendschap en onvergetelijke momenten. Wij zorgen voor alles, jullie alleen voor de gezelligheid.
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
                alt="Vrijgezellenfeest activiteiten bij Dressperience in Limburg"
                className="h-[450px] w-full object-cover"
              />
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="font-display text-4xl font-light text-foreground md:text-5xl">
                Wat kan je <span className="font-semibold italic text-lavender-600">verwachten?</span>
              </h2>
              <div className="mt-8 space-y-6">
                {steps.map((step, i) => (
                  <div key={step.title} className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-lavender-500/10 font-display text-lg font-semibold text-lavender-600">
                      {i + 1}
                    </div>
                    <div>
                      <h3 className="font-body text-base font-semibold text-foreground">{step.title}</h3>
                      <p className="mt-1 font-body text-sm text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 rounded-3xl bg-gradient-to-br from-blush-100/60 to-lavender-500/10 p-8 md:p-16 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-lavender-500/15 px-4 py-1.5 font-body text-xs font-medium uppercase tracking-widest text-lavender-600">
              <Gift size={14} />
              Cadeaubon
            </span>
            <h2 className="mt-6 font-display text-4xl font-light text-foreground md:text-5xl">
              Geef een Dressperience <span className="font-semibold italic text-lavender-600">cadeau</span>
            </h2>
            <p className="mt-6 font-body text-lg leading-relaxed text-muted-foreground">
              Weet je nog geen exacte datum? Geef een Dressperience-cadeaubon cadeau voor een vrijgezellenfeest dat later ingepland kan worden. Neem contact met ons op voor de mogelijkheden.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-full bg-lavender-600 px-8 py-3.5 font-body text-sm font-semibold uppercase tracking-widest text-primary-foreground transition-all hover:bg-lavender-700"
              >
                Cadeaubon aanvragen
              </Link>
              <Link
                to="/reservations"
                className="inline-flex items-center justify-center rounded-full border border-border bg-background px-8 py-3.5 font-body text-sm font-semibold uppercase tracking-widest text-foreground transition-all hover:bg-blush-200/50"
              >
                Direct reserveren
              </Link>
            </div>
          </div>
          <div className="relative flex justify-center">
            <img
              src={home4}
              alt="Cadeaubon voor een vrijgezellenfeest bij Dressperience"
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
    title: "Persoonlijke aandacht",
    description: "De hele locatie is exclusief voor jullie gereserveerd, inclusief professionele begeleiding.",
  },
  {
    icon: Camera,
    title: "Unieke foto's",
    description: "Leg elk glimlachend moment vast met een optionele mini-foto-shoot.",
  },
  {
    icon: Sparkles,
    title: "Glamour en gezelligheid",
    description: "Een sprankelend drankje, styling corner en meer dan 200 jurken: alles voor een perfecte dag.",
  },
];

const steps = [
  {
    title: "Aankomst in stijl",
    description: "Ontvangst met een bubbeltje en een rondleiding door onze collectie trouwjurken.",
  },
  {
    title: "Jurken passen met vriendinnen",
    description: "De bruid-to-be en haar vriendinnen passen de mooiste jurken en stylen de looks compleet.",
  },
  {
    title: "Foto-shoot en feestmoment",
    description: "Poseer voor de camera, proost op de toekomst en vier de liefde in stijl.",
  },
  {
    title: "Herinneringen voor het leven",
    description: "Vertrek met professionele foto's, een lach op je gezicht en een dag die nooit verveelt.",
  },
];
