import { Link } from "@tanstack/react-router";
import { Instagram, Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-border/40 bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          <div className="space-y-4">
            <h3 className="font-display text-2xl font-semibold text-lavender-700">
              Dressperience
            </h3>
            <p className="font-body text-sm leading-relaxed text-muted-foreground max-w-xs">
              Onvergetelijke funfitting-ervaringen voor jou en je vriendinnen. Pas prachtige trouwjurken, leg de momenten vast en maak herinneringen voor altijd.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-body text-sm font-semibold uppercase tracking-widest text-foreground">
              Ontdek
            </h4>
            <div className="flex flex-col gap-2">
              {[
                { to: "/", label: "Home" },
                { to: "/gallery", label: "Galerij" },
                { to: "/about", label: "Over ons" },
                { to: "/reservations", label: "Reserveren" },
                { to: "/contact", label: "Contact" },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="font-body text-sm text-muted-foreground transition-colors hover:text-lavender-600"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-body text-sm font-semibold uppercase tracking-widest text-foreground">
              Contact
            </h4>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <MapPin size={16} className="shrink-0 text-lavender-500" />
                <span>Heerbaan 54, 6061 EE Posterholt</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail size={16} className="shrink-0 text-lavender-500" />
                <a href="mailto:hello@dressperience.nl" className="hover:text-lavender-600 transition-colors">
                  hello@dressperience.nl
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Phone size={16} className="shrink-0 text-lavender-500" />
                <a href="tel:+31612345678" className="hover:text-lavender-600 transition-colors">
                  +31 6 12 34 56 78
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Instagram size={16} className="shrink-0 text-lavender-500" />
                <a href="https://instagram.com/dressperience" target="_blank" rel="noopener noreferrer" className="hover:text-lavender-600 transition-colors">
                  @dressperience
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-border/40 pt-8 text-center">
          <p className="font-body text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Dressperience. Alle rechten voorbehouden.
          </p>
        </div>
      </div>
    </footer>
  );
}
