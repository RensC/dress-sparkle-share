import { createFileRoute } from "@tanstack/react-router";
import { Award, Users, Heart, Sparkles } from "lucide-react";

import aboutImg from "@/assets/about.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Dressperience" },
      { name: "description", content: "Learn about Dressperience and our passion for creating unforgettable funfitting moments for women and their friends." },
      { property: "og:title", content: "About — Dressperience" },
      { property: "og:description", content: "Learn about Dressperience and our passion for creating unforgettable funfitting moments." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-blush-100/40 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="font-body text-xs font-semibold uppercase tracking-widest text-lavender-600">
                Our Story
              </span>
              <h1 className="mt-4 font-display text-5xl font-light text-foreground md:text-6xl">
                A Dream Born from
                <span className="block font-semibold italic text-lavender-600">Friendship & Joy</span>
              </h1>
              <p className="mt-6 font-body text-lg leading-relaxed text-muted-foreground">
                Dressperience was founded on a simple, beautiful idea: every woman deserves to feel like a bride, even if she is not getting married. Our funfitting sessions turn an ordinary day into an extraordinary celebration of friendship, beauty, and laughter.
              </p>
            </div>
            <div className="relative overflow-hidden rounded-2xl">
              <img
                src={aboutImg}
                alt="Elegant fitting room at Dressperience studio"
                className="h-[450px] w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Story Content */}
      <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <p className="font-body text-lg leading-relaxed text-muted-foreground">
            It all started when a group of friends decided to try on wedding dresses just for fun. The laughter, the twirls, the shared joy of seeing each other in something truly beautiful — it was magic. We knew we had to share this feeling with more women.
          </p>
          <p className="font-body text-lg leading-relaxed text-muted-foreground">
            At Dressperience, we have created a warm, welcoming space where you can leave the everyday behind and step into something extraordinary. Our curated collection features dresses for every style and silhouette, from timeless classics to modern showstoppers.
          </p>
          <p className="font-body text-lg leading-relaxed text-muted-foreground">
            Every session is intimate and personalized. With complimentary drinks, professional photography, and a relaxed atmosphere, we make sure your experience is as memorable as the dresses themselves.
          </p>
        </div>

        <blockquote className="mt-12 border-l-4 border-lavender-500 pl-6">
          <p className="font-display text-2xl font-light italic text-foreground md:text-3xl">
            "Every woman deserves to feel beautiful, celebrated, and completely herself."
          </p>
          <footer className="mt-3 font-body text-sm text-muted-foreground">
            — The Dressperience Team
          </footer>
        </blockquote>
      </section>

      {/* Values */}
      <section className="bg-blush-100/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="font-display text-4xl font-light text-foreground md:text-5xl">
              What We <span className="font-semibold italic text-lavender-600">Believe</span>
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
    title: "Inclusivity",
    description: "Every body is beautiful. Our dresses come in a wide range of sizes so every guest feels radiant.",
  },
  {
    icon: Sparkles,
    title: "Quality",
    description: "We curate only the finest dresses, ensuring every fitting feels like a luxury experience.",
  },
  {
    icon: Users,
    title: "Connection",
    description: "Our sessions are designed to bring friends closer and create lasting shared memories.",
  },
  {
    icon: Award,
    title: "Excellence",
    description: "From the moment you arrive to the final photo, every detail is crafted with care.",
  },
];
