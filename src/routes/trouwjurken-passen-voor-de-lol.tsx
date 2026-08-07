import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, Sparkles, Camera, Wine } from "lucide-react";
import home2 from "@/assets/home-2.jpg";
import home3 from "@/assets/home-3.jpg";
import home4 from "@/assets/home-4.jpg";

export const Route = createFileRoute("/trouwjurken-passen-voor-de-lol")({
  head: () => ({
    meta: [
      { title: "Trouwjurken passen voor de lol — Dressperience" },
      { name: "description", content: "Trouwjurken passen voor de lol in Limburg bij Dressperience. Met vriendinnen jurken passen, foto's maken en genieten van een unieke funfitting-ervaring." },
      { property: "og:title", content: "Trouwjurken passen voor de lol — Dressperience" },
      { property: "og:description", content: "Trouwjurken passen voor de lol in Limburg. Met vriendinnen jurken passen, foto's maken en een onvergetelijke dag beleven." },
      { property: "og:url", content: "https://dress-sparkle-share.lovable.app/trouwjurken-passen-voor-de-lol" },
    ],
    links: [
      { rel: "canonical", href: "https://dress-sparkle-share.lovable.app/trouwjurken-passen-voor-de-lol" },
    ],
  }),
  component: TrouwjurkenPassenPage,
});

function TrouwjurkenPassenPage() {
  return (
    <div className="min-h-screen">
      <section className="relative grid min-h-[70vh] grid-cols-1 md:grid-cols-2">
        <div className="order-2 flex flex-col justify-center px-6 py-16 md:order-1 md:px-12 lg:px-16">
          <div className="max-w-lg">
            <span className="font-body text-xs font-semibold uppercase tracking-widest text-lavender-600">
              Het leukste uitje in Limburg
            </span>
            <h1 className="mt-4 font-display text-5xl font-light leading-tight text-foreground md:text-6xl">
              Trouwjurken passen voor de <span className="font-semibold italic text-lavender-600">lol</span>
            </h1>
            <p className="mt-6 font-body text-lg leading-relaxed text-muted-foreground">
              Zeg maar gedag tegen saaie uitjes. Bij Dressperience in Posterholt, Limburg, passen jij en je vriendinnen de mooiste trouwjurken — puur voor de lol. Wij noemen dat funfitting. Een dag vol glamour, gelach, foto's en sprankelende drankjes.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/reservations"
                className="inline-flex items-center justify-center rounded-full bg-lavender-600 px-8 py-3.5 font-body text-sm font-semibold uppercase tracking-widest text-primary-foreground transition-all hover:bg-lavender-700 hover:shadow-lg hover:shadow-lavender-500/20"
              >
                Boek je sessie
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
            alt="Trouwjurken passen voor de lol met vriendinnen bij Dressperience"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/30 via-transparent to-transparent md:from-background/60" />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-display text-4xl font-light text-foreground md:text-5xl">
            Wat houdt <span className="font-semibold italic text-lavender-600">funfitting</span> in?
          </h2>
          <p className="mx-auto mt-4 max-w-3xl font-body text-lg text-muted-foreground">
            Funfitting is het passen van prachtige trouwjurken zonder dat er een bruiloft aan vast zit. Het is dé manier om een gewone dag om te toveren tot een onvergetelijke ervaring. Perfect voor een vrijgezellenfeest, een verjaardag of een spontane vriendinnendag.
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
                Waarom <span className="font-semibold italic text-lavender-600">Dressperience?</span>
              </h2>
              <div className="mt-8 space-y-5">
                {reasons.map((reason) => (
                  <div key={reason} className="flex items-start gap-3">
                    <Sparkles className="mt-1 shrink-0 text-lavender-500" size={18} />
                    <p className="font-body text-base text-muted-foreground">{reason}</p>
                  </div>
                ))}
              </div>
              <div className="mt-10">
                <Link
                  to="/reservations"
                  className="inline-flex items-center justify-center rounded-full bg-lavender-600 px-8 py-3.5 font-body text-sm font-semibold uppercase tracking-widest text-primary-foreground transition-all hover:bg-lavender-700"
                >
                  Plan jouw funfitting
                </Link>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-2xl">
              <img
                src={home3}
                alt="Vriendinnen lachen tijdens het passen van trouwjurken bij Dressperience"
                className="h-[450px] w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 rounded-3xl bg-gradient-to-br from-blush-100/60 to-lavender-500/10 p-8 md:p-16 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-4xl font-light text-foreground md:text-5xl">
              Klaar voor jouw <span className="font-semibold italic text-lavender-600">walk on the bride side?</span>
            </h2>
            <p className="mt-6 font-body text-lg leading-relaxed text-muted-foreground">
              Trouwjurken passen voor de lol is dé activiteit voor wie wil lachen, stralen en genieten. Of je nu komt voor een vrijgezellenfeest, vrouwenuitje of gewoon een unieke dag met vriendinnen — bij Dressperience in Limburg beleef je het allemaal.
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
          <div className="relative flex justify-center">
            <img
              src={home4}
              alt="Glamoureuze funfitting-ervaring bij Dressperience"
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
    title: "Exclusieve jurkencollectie",
    description: "Meer dan 200 unieke trouwjurken in maten 34 t/m 56. Van klassieke baljurken tot moderne mermaids.",
  },
  {
    icon: Wine,
    title: "Sprankelend onthaal",
    description: "Geniet samen van een welkomstdrankje en de perfecte sfeer voor een dag vol gelach.",
  },
  {
    icon: Camera,
    title: "Foto's om nooit te vergeten",
    description: "Laat de mooiste momenten vastleggen met een professionele mini-foto-shoot.",
  },
];

const reasons = [
  "Ruime collectie trouwjurken voor elk figuur en elke stijl",
  "Exclusieve locatie in Posterholt, volledig privé voor jouw groep",
  "Ideaal voor vrijgezellenfeestjes, vriendinnen- en vrouwen uitjes",
  "Professionele begeleiding, styling corner en foto-opties",
  "Alleen op reservering, zodat je ongestoord kunt genieten",
];
