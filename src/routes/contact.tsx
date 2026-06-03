import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Mail, Phone, Instagram, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Dressperience" },
      { name: "description", content: "Get in touch with Dressperience. Book your funfitting session, ask questions, or just say hello. We would love to hear from you." },
      { property: "og:title", content: "Contact — Dressperience" },
      { property: "og:description", content: "Get in touch with Dressperience. Book your funfitting session or ask us anything." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <div className="min-h-screen">
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="font-body text-xs font-semibold uppercase tracking-widest text-lavender-600">
            Reach Out
          </span>
          <h1 className="mt-4 font-display text-5xl font-light text-foreground md:text-6xl">
            <span className="font-semibold italic text-lavender-600">Contact</span> Us
          </h1>
          <p className="mx-auto mt-4 max-w-2xl font-body text-lg text-muted-foreground">
            Have questions about funfitting or ready to book your experience? We would love to hear from you.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Contact Form */}
          <div className="rounded-2xl border border-border/60 bg-card p-8 md:p-10">
            <h2 className="font-display text-2xl font-semibold text-foreground">
              Send a Message
            </h2>
            <p className="mt-2 font-body text-sm text-muted-foreground">
              Fill out the form below and we will get back to you within 24 hours.
            </p>
            <form
              className="mt-8 space-y-6"
              onSubmit={(e) => {
                e.preventDefault();
                alert("Thank you for your message! We will be in touch soon.");
              }}
            >
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name" className="font-body text-sm font-medium">
                    Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="Your name"
                    className="rounded-lg border-border bg-background font-body"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-body text-sm font-medium">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="rounded-lg border-border bg-background font-body"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject" className="font-body text-sm font-medium">
                  Subject
                </Label>
                <Input
                  id="subject"
                  placeholder="Booking inquiry, question, etc."
                  className="rounded-lg border-border bg-background font-body"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message" className="font-body text-sm font-medium">
                  Message
                </Label>
                <Textarea
                  id="message"
                  placeholder="Tell us about your ideal funfitting experience..."
                  rows={5}
                  className="rounded-lg border-border bg-background font-body resize-none"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full rounded-full bg-lavender-600 py-3 font-body text-sm font-semibold uppercase tracking-widest text-primary-foreground transition-all hover:bg-lavender-700"
              >
                Send Message
              </Button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col justify-center space-y-10">
            <div>
              <h2 className="font-display text-2xl font-semibold text-foreground">
                Visit Us
              </h2>
              <p className="mt-2 font-body text-sm text-muted-foreground">
                Our studio is nestled in the heart of Posterholt, designed to be your private escape into glamour.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-lavender-500/10 text-lavender-600">
                  <MapPin size={18} />
                </div>
                <div>
                  <h4 className="font-body text-sm font-semibold text-foreground">Address</h4>
                  <p className="mt-1 font-body text-sm text-muted-foreground">
                    Heerbaan 54<br />
                    6061 EE Posterholt<br />
                    The Netherlands
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-lavender-500/10 text-lavender-600">
                  <Mail size={18} />
                </div>
                <div>
                  <h4 className="font-body text-sm font-semibold text-foreground">Email</h4>
                  <a
                    href="mailto:hello@dressperience.nl"
                    className="mt-1 block font-body text-sm text-muted-foreground hover:text-lavender-600 transition-colors"
                  >
                    hello@dressperience.nl
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-lavender-500/10 text-lavender-600">
                  <Phone size={18} />
                </div>
                <div>
                  <h4 className="font-body text-sm font-semibold text-foreground">Phone</h4>
                  <a
                    href="tel:+31612345678"
                    className="mt-1 block font-body text-sm text-muted-foreground hover:text-lavender-600 transition-colors"
                  >
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
                  <a
                    href="https://instagram.com/dressperience"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 block font-body text-sm text-muted-foreground hover:text-lavender-600 transition-colors"
                  >
                    @dressperience
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-lavender-500/10 text-lavender-600">
                  <Clock size={18} />
                </div>
                <div>
                  <h4 className="font-body text-sm font-semibold text-foreground">Hours</h4>
                  <p className="mt-1 font-body text-sm text-muted-foreground">
                    Tuesday — Saturday: 10:00 – 18:00<br />
                    Sunday & Monday: By appointment
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Placeholder */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="relative h-[400px] w-full overflow-hidden rounded-2xl bg-blush-200/40">
          <iframe
            title="Dressperience Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2520.0!2d6.0!3d51.1!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTHCsDA2JzAwLjAiTiA2wrAwMCcwMC4wIkU!5e0!3m2!1sen!2snl!4v1600000000000!5m2!1sen!2snl"
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
