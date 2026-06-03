import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Clock, Users, Wine, Camera, Check } from "lucide-react";

export const Route = createFileRoute("/reservations")({
  head: () => ({
    meta: [
      { title: "Reservations — Dressperience" },
      { name: "description", content: "Book your funfitting experience at Dressperience. Sessions available by reservation only. Choose your package and make memories with friends." },
      { property: "og:title", content: "Reservations — Dressperience" },
      { property: "og:description", content: "Book your funfitting experience at Dressperience. Sessions available by reservation only." },
    ],
  }),
  component: ReservationsPage,
});

function ReservationsPage() {
  return (
    <div className="min-h-screen">
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="font-body text-xs font-semibold uppercase tracking-widest text-lavender-600">
            Book Your Session
          </span>
          <h1 className="mt-4 font-display text-5xl font-light text-foreground md:text-6xl">
            <span className="font-semibold italic text-lavender-600">Reservations</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl font-body text-lg text-muted-foreground">
            All experiences are available by reservation only. Choose the package that fits your group and let us create something magical together.
          </p>
        </div>

        {/* Packages */}
        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          {packages.map((pkg) => (
            <div
              key={pkg.name}
              className={`relative flex flex-col rounded-2xl border p-8 transition-all hover:shadow-xl ${
                pkg.highlighted
                  ? "border-lavender-500 bg-lavender-500/5 shadow-lg shadow-lavender-500/10"
                  : "border-border/60 bg-card"
              }`}
            >
              {pkg.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-lavender-600 px-4 py-1 font-body text-xs font-semibold uppercase tracking-widest text-white">
                  Most Popular
                </span>
              )}
              <h3 className="font-display text-2xl font-semibold text-foreground">
                {pkg.name}
              </h3>
              <p className="mt-2 font-body text-sm text-muted-foreground">
                {pkg.description}
              </p>
              <div className="mt-6">
                <span className="font-display text-4xl font-light text-foreground">
                  {pkg.price}
                </span>
                <span className="font-body text-sm text-muted-foreground">
                  {pkg.priceNote}
                </span>
              </div>
              <ul className="mt-6 flex-1 space-y-3">
                {pkg.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check size={18} className="mt-0.5 shrink-0 text-lavender-500" />
                    <span className="font-body text-sm text-muted-foreground">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              <Link
                to="/contact"
                className={`mt-8 inline-flex items-center justify-center rounded-full px-8 py-3.5 font-body text-sm font-semibold uppercase tracking-widest transition-all ${
                  pkg.highlighted
                    ? "bg-lavender-600 text-primary-foreground hover:bg-lavender-700"
                    : "border border-border bg-background text-foreground hover:bg-blush-200/50"
                }`}
              >
                Request Booking
              </Link>
            </div>
          ))}
        </div>

        {/* Important Info */}
        <div className="mt-20 rounded-2xl border border-border/60 bg-card p-8 md:p-12">
          <h2 className="font-display text-3xl font-light text-foreground">
            Good to <span className="font-semibold italic text-lavender-600">Know</span>
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {infoCards.map((info) => (
              <div key={info.title} className="flex flex-col items-start gap-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-lavender-500/10 text-lavender-600">
                  <info.icon size={20} />
                </div>
                <h4 className="font-body text-base font-semibold text-foreground">
                  {info.title}
                </h4>
                <p className="font-body text-sm text-muted-foreground">
                  {info.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <p className="font-body text-lg text-muted-foreground">
            Have questions or want to book a custom experience?
          </p>
          <Link
            to="/contact"
            className="mt-6 inline-flex items-center justify-center rounded-full bg-lavender-600 px-10 py-4 font-body text-sm font-semibold uppercase tracking-widest text-primary-foreground transition-all hover:bg-lavender-700"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </div>
  );
}

const packages = [
  {
    name: "Sparkle",
    description: "Perfect for a quick, magical experience with your best friend.",
    price: "€89",
    priceNote: " / person",
    highlighted: false,
    features: [
      "2-hour funfitting session",
      "Up to 2 guests",
      "5 dresses to try on per person",
      "Complimentary welcome drink",
      "10 edited digital photos",
    ],
  },
  {
    name: "Glamour",
    description: "Our most popular experience for small groups of friends.",
    price: "€79",
    priceNote: " / person",
    highlighted: true,
    features: [
      "3-hour funfitting session",
      "Up to 4 guests",
      "8 dresses to try on per person",
      "Complimentary drinks & nibbles",
      "25 edited digital photos",
      "Private studio session",
    ],
  },
  {
    name: "Celebration",
    description: "The ultimate group experience for special occasions.",
    price: "€69",
    priceNote: " / person",
    highlighted: false,
    features: [
      "4-hour funfitting session",
      "Up to 6 guests",
      "Unlimited dress try-ons",
      "Full drinks & snacks included",
      "50+ edited digital photos",
      "Personal video montage",
    ],
  },
];

const infoCards = [
  {
    icon: Clock,
    title: "Advance Booking",
    description: "All sessions require at least 7 days advance reservation. Weekend slots fill up quickly!",
  },
  {
    icon: Users,
    title: "Group Size",
    description: "Our studio comfortably hosts up to 6 guests per session for the best experience.",
  },
  {
    icon: Wine,
    title: "Drinks & Snacks",
    description: "Complimentary prosecco, champagne, and refreshing mocktails are included in every package.",
  },
  {
    icon: Camera,
    title: "Photos",
    description: "Professional photos are taken during your session. Digital galleries are delivered within 5 days.",
  },
];
