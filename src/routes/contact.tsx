import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Mail, Phone, Instagram, Clock } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Dressperience" },
      { name: "description", content: "Neem contact op met Dressperience. Boek je funfitting-sessie, stel een vraag of zeg gewoon hallo. We horen graag van je." },
      { property: "og:title", content: "Contact — Dressperience" },
      { property: "og:description", content: "Neem contact op met Dressperience. Boek je funfitting-sessie of stel ons een vraag." },
    ],
  }),
  component: ContactPage,
});

const schema = z.object({
  name: z.string().trim().min(1, "Naam is verplicht").max(100),
  email: z.string().trim().email("Ongeldig e-mailadres").max(255),
  subject: z.string().trim().min(1, "Onderwerp is verplicht").max(150),
  message: z.string().trim().min(1, "Bericht is verplicht").max(1000),
});

function ContactPage() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const result = schema.safeParse({
      name: fd.get("name"),
      email: fd.get("email"),
      subject: fd.get("subject"),
      message: fd.get("message"),
    });
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Controleer het formulier");
      return;
    }
    setSent(true);
    e.currentTarget.reset();
  }

  return (
    <div className="min-h-screen">
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="font-body text-xs font-semibold uppercase tracking-widest text-lavender-600">
            Neem contact op
          </span>
          <h1 className="mt-4 font-display text-5xl font-light text-foreground md:text-6xl">
            <span className="font-semibold italic text-lavender-600">Contact</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl font-body text-lg text-muted-foreground">
            Vragen over funfitting of klaar om je ervaring te boeken? We horen graag van je.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div className="rounded-2xl border border-border/60 bg-card p-8 md:p-10">
            <h2 className="font-display text-2xl font-semibold text-foreground">
              Stuur een bericht
            </h2>
            <p className="mt-2 font-body text-sm text-muted-foreground">
              Vul het formulier in en we reageren binnen 24 uur.
            </p>

            {sent ? (
              <div className="mt-8 rounded-xl border border-lavender-500/40 bg-lavender-500/5 p-6 text-center">
                <p className="font-display text-xl text-lavender-700">Bedankt voor je bericht!</p>
                <p className="mt-2 font-body text-sm text-muted-foreground">
                  We nemen binnenkort contact met je op.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="mt-4 font-body text-sm text-lavender-600 underline hover:text-lavender-700"
                >
                  Nieuw bericht versturen
                </button>
              </div>
            ) : (
              <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="font-body text-sm font-medium">Naam</Label>
                    <Input id="name" name="name" placeholder="Je naam" maxLength={100} className="rounded-lg border-border bg-background font-body" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="font-body text-sm font-medium">E-mail</Label>
                    <Input id="email" name="email" type="email" placeholder="jij@voorbeeld.nl" maxLength={255} className="rounded-lg border-border bg-background font-body" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject" className="font-body text-sm font-medium">Onderwerp</Label>
                  <Input id="subject" name="subject" placeholder="Boekingsvraag, vraag, enz." maxLength={150} className="rounded-lg border-border bg-background font-body" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message" className="font-body text-sm font-medium">Bericht</Label>
                  <Textarea id="message" name="message" placeholder="Vertel ons over je ideale funfitting-ervaring..." rows={5} maxLength={1000} className="rounded-lg border-border bg-background font-body resize-none" required />
                </div>
                {error && <p className="font-body text-sm text-destructive">{error}</p>}
                <Button type="submit" className="w-full rounded-full bg-lavender-600 py-3 font-body text-sm font-semibold uppercase tracking-widest text-primary-foreground transition-all hover:bg-lavender-700">
                  Verstuur bericht
                </Button>
              </form>
            )}
          </div>

          <div className="flex flex-col justify-center space-y-10">
            <div>
              <h2 className="font-display text-2xl font-semibold text-foreground">
                Bezoek ons
              </h2>
              <p className="mt-2 font-body text-sm text-muted-foreground">
                Onze studio bevindt zich in het hart van Posterholt en is ontworpen als jouw privé-ontsnapping naar glamour.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-lavender-500/10 text-lavender-600">
                  <MapPin size={18} />
                </div>
                <div>
                  <h4 className="font-body text-sm font-semibold text-foreground">Adres</h4>
                  <p className="mt-1 font-body text-sm text-muted-foreground">
                    Heerbaan 54<br />
                    6061 EE Posterholt<br />
                    Nederland
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-lavender-500/10 text-lavender-600">
                  <Mail size={18} />
                </div>
                <div>
                  <h4 className="font-body text-sm font-semibold text-foreground">E-mail</h4>
                  <a href="mailto:hello@dressperience.nl" className="mt-1 block font-body text-sm text-muted-foreground hover:text-lavender-600 transition-colors">
                    hello@dressperience.nl
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-lavender-500/10 text-lavender-600">
                  <Phone size={18} />
                </div>
                <div>
                  <h4 className="font-body text-sm font-semibold text-foreground">Telefoon</h4>
                  <a href="tel:+31612345678" className="mt-1 block font-body text-sm text-muted-foreground hover:text-lavender-600 transition-colors">
                    +31 6 12 34 56 78
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-lavender-500/10 text-lavender-600">
                  <Instagram size={18} />
                </div>
                <div>
                  <h4 className="font-body text-sm font-semibold text-foreground">Instagram</h4>
                  <a href="https://instagram.com/dressperience" target="_blank" rel="noopener noreferrer" className="mt-1 block font-body text-sm text-muted-foreground hover:text-lavender-600 transition-colors">
                    @dressperience
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-lavender-500/10 text-lavender-600">
                  <Clock size={18} />
                </div>
                <div>
                  <h4 className="font-body text-sm font-semibold text-foreground">Openingstijden</h4>
                  <p className="mt-1 font-body text-sm text-muted-foreground">
                    Dinsdag — Zaterdag: 10:00 – 18:00<br />
                    Zondag & Maandag: Op afspraak
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="relative h-[400px] w-full overflow-hidden rounded-2xl bg-blush-200/40">
          <iframe
            title="Dressperience locatie"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2520.0!2d6.0!3d51.1!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTHCsDA2JzAwLjAiTiA2wrAwMCcwMC4wIkU!5e0!3m2!1snl!2snl!4v1600000000000!5m2!1snl!2snl"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="grayscale-[20%]"
          />
        </div>
      </section>
    </div>
  );
}
