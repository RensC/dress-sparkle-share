import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, Heart, Camera, Gift, Check } from "lucide-react";
import home2 from "@/assets/home-2.jpg";
import home3 from "@/assets/home-3.jpg";
import home4 from "@/assets/home-4.jpg";

export const Route = createFileRoute("/blog/vrijgezellenfeest-activiteiten")({
  head: () => ({
    meta: [
      { title: "Vrijgezellenfeest activiteiten voor vrouwen in Limburg — Dressperience" },
      { name: "description", content: "Op zoek naar originele vrijgezellenfeest activiteiten voor vrouwen in Limburg? Ontdek funfitting bij Dressperience: trouwjurken passen, foto's maken en samen genieten." },
      { property: "og:title", content: "Vrijgezellenfeest activiteiten voor vrouwen in Limburg — Dressperience" },
      { property: "og:description", content: "Originele vrijgezellenfeest activiteiten voor vrouwen in Limburg. Ontdek funfitting: trouwjurken passen, foto's maken en samen genieten." },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "https://dress-sparkle-share.lovable.app/blog/vrijgezellenfeest-activiteiten" },
    ],
    links: [
      { rel: "canonical", href: "https://dress-sparkle-share.lovable.app/blog/vrijgezellenfeest-activiteiten" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "Vrijgezellenfeest activiteiten voor vrouwen in Limburg",
          description: "Originele vrijgezellenfeest activiteiten voor vrouwen in Limburg: ontdek funfitting bij Dressperience.",
          image: "https://dress-sparkle-share.lovable.app/favicon.png",
          author: {
            "@type": "Organization",
            name: "Dressperience",
          },
          publisher: {
            "@type": "Organization",
            name: "Dressperience",
            logo: {
              "@type": "ImageObject",
              url: "https://dress-sparkle-share.lovable.app/favicon.png",
            },
          },
          datePublished: "2026-01-15",
          dateModified: "2026-01-15",
        }),
      },
    ],
  }),
  component: BlogPage,
});

function BlogPage() {
  return (
    <article className="min-h-screen">
      <header className="relative grid min-h-[60vh] grid-cols-1 md:grid-cols-2">
        <div className="order-2 flex flex-col justify-center px-6 py-16 md:order-1 md:px-12 lg:px-16">
          <div className="max-w-lg">
            <span className="font-body text-xs font-semibold uppercase tracking-widest text-lavender-600">
              Inspiratie
            </span>
            <h1 className="mt-4 font-display text-4xl font-light leading-tight text-foreground md:text-5xl lg:text-6xl">
              Vrijgezellenfeest activiteiten voor <span className="font-semibold italic text-lavender-600">vrouwen in Limburg</span>
            </h1>
            <p className="mt-6 font-body text-lg leading-relaxed text-muted-foreground">
              Een vrijgezellenfeest voor vrouwen organiseren in Limburg? Zeg maar dag tegen de standaard activiteiten. In dit artikel lees je waarom funfitting bij Dressperience dé originele keuze is voor een onvergetelijk feest.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/reservations"
                className="inline-flex items-center justify-center rounded-full bg-lavender-600 px-8 py-3.5 font-body text-sm font-semibold uppercase tracking-widest text-primary-foreground transition-all hover:bg-lavender-700 hover:shadow-lg hover:shadow-lavender-500/20"
              >
                Plan direct
              </Link>
            </div>
          </div>
        </div>

        <div className="relative order-1 min-h-[50vh] md:order-2 md:min-h-full">
          <img
            src={home2}
            alt="Vrijgezellenfeest activiteiten voor vrouwen in Limburg"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/30 via-transparent to-transparent md:from-background/60" />
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="prose prose-lg max-w-none font-body text-muted-foreground">
          <p>
            Een vrijgezellenfeest is het moment om de bruid-to-be te verwennen. Maar na al die jaren met dezelfde activiteiten — workshops, high tea's en stadswandelingen — wil je misschien eens iets anders. Iets waar de bruid écht van gaat stralen. Dan is funfitting in Limburg precies wat je zoekt.
          </p>

          <h2 className="mt-12 font-display text-3xl font-light text-foreground">Wat is funfitting?</h2>
          <p>
            Funfitting is het passen van prachtige trouwjurken zonder dat er een bruiloft aan vast zit. Je doet het gewoon voor de lol. Bij Dressperience in Posterholt, midden in Limburg, kun je met je vriendinnen de mooiste jurken passen, foto's maken en genieten van een dag vol glamour. Het is een originele activiteit die perfect werkt voor vrijgezellenfeesten, vriendinnenuitjes en vrouwenuitjes.
          </p>

          <h2 className="mt-12 font-display text-3xl font-light text-foreground">Waarom funfitting het perfecte vrijgezellenfeest is</h2>
          <ul className="mt-4 space-y-3">
            {reasons.map((reason) => (
              <li key={reason} className="flex items-start gap-3">
                <Check className="mt-1 shrink-0 text-lavender-600" size={18} />
                <span>{reason}</span>
              </li>
            ))}
          </ul>

          <h2 className="mt-12 font-display text-3xl font-light text-foreground">Wat kun je verwachten?</h2>
          <p>
            Bij aankomst krijg je een warm onthaal met een sprankelend drankje. Daarna neem je samen met je vriendinnen de tijd om uit meer dan 200 trouwjurken te kiezen. Van klassieke baljurken tot moderne mermaids en alles daartussenin. De hele locatie is exclusief voor jullie gereserveerd, dus je kunt ongestoord lachen, poseren en genieten.
          </p>
          <p>
            Wil je de dag extra bijzonder maken? Kies dan voor een van onze extras. Laat professionele foto's maken, trakteer de groep op een chocolade-droom of maak het compleet met de Star Treatment. Ook de Savoury Board is populair bij groepen.
          </p>

          <h2 className="mt-12 font-display text-3xl font-light text-foreground">Voor wie is het geschikt?</h2>
          <p>
            Funfitting is geschikt voor vrijgezellenfeesten, maar ook voor verjaardagen, moeder-dochter-uitjes, vrouwenuitjes en zelfs teamuitjes. Kortom: voor elke groep vrouwen die zin heeft in een unieke dag vol gelach en glamour.
          </p>

          <h2 className="mt-12 font-display text-3xl font-light text-foreground">Waar in Limburg?</h2>
          <p>
            Dressperience zit in Posterholt, aan de Heerbaan 54. De locatie is makkelijk bereikbaar, er is gratis parkeergelegenheid voor de deur en de studio is volledig rolstoeltoegankelijk. Alleen op reservering, zodat je ongestoord kunt genieten.
          </p>
        </div>

        <div className="mt-16 rounded-2xl bg-blush-100/50 p-8 text-center">
          <h2 className="font-display text-2xl font-light text-foreground">
            Klaar voor een onvergetelijk vrijgezellenfeest?
          </h2>
          <p className="mt-2 font-body text-sm text-muted-foreground">
            Reserveer nu je funfitting-sessie in Limburg.
          </p>
          <Link
            to="/reservations"
            className="mt-6 inline-flex items-center justify-center rounded-full bg-lavender-600 px-8 py-3 font-body text-sm font-semibold uppercase tracking-widest text-primary-foreground transition-all hover:bg-lavender-700"
          >
            Bekijk beschikbaarheid
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-display text-3xl font-light text-foreground md:text-4xl">
            Meer inspiratie voor je <span className="font-semibold italic text-lavender-600">uitje</span>
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <Link to="/vrijgezellenfeest-limburg" className="group overflow-hidden rounded-2xl border border-border/60 bg-card transition-all hover:border-lavender-400/50">
            <img src={home3} alt="Vrijgezellenfeest in Limburg" className="h-48 w-full object-cover" />
            <div className="p-6">
              <h3 className="font-display text-xl font-semibold text-foreground group-hover:text-lavender-600">Vrijgezellenfeest Limburg</h3>
              <p className="mt-2 font-body text-sm text-muted-foreground">Het perfecte feest voor de bruid-to-be en haar vriendinnen.</p>
            </div>
          </Link>
          <Link to="/vriendinnenuitje-limburg" className="group overflow-hidden rounded-2xl border border-border/60 bg-card transition-all hover:border-lavender-400/50">
            <img src={home4} alt="Vriendinnenuitje in Limburg" className="h-48 w-full object-cover" />
            <div className="p-6">
              <h3 className="font-display text-xl font-semibold text-foreground group-hover:text-lavender-600">Vriendinnenuitje Limburg</h3>
              <p className="mt-2 font-body text-sm text-muted-foreground">Een unieke dag uit met je beste vriendinnen.</p>
            </div>
          </Link>
          <Link to="/trouwjurken-passen-voor-de-lol" className="group overflow-hidden rounded-2xl border border-border/60 bg-card transition-all hover:border-lavender-400/50">
            <img src={home2} alt="Trouwjurken passen voor de lol" className="h-48 w-full object-cover" />
            <div className="p-6">
              <h3 className="font-display text-xl font-semibold text-foreground group-hover:text-lavender-600">Trouwjurken passen voor de lol</h3>
              <p className="mt-2 font-body text-sm text-muted-foreground">Ontdek funfitting: jurken passen zonder bruiloft.</p>
            </div>
          </Link>
        </div>
      </section>
    </article>
  );
}

const reasons = [
  "De bruid-to-be staat volledig in de spotlight",
  "Jullie hebben de hele locatie exclusief voor jezelf",
  "Meer dan 200 prachtige trouwjurken in alle maten",
  "Professionele begeleiding en styling corner",
  "Optionele foto-shoot voor herinneringen die blijven",
  "Inclusief een sprankelend welkomstdrankje",
  "Gezelligheid en glamour gegarandeerd",
];
