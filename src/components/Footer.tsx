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
                { to: "/faq", label: "FAQ" },
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
                <MapPin size={16} className="shrink-0 text-lavender-500"/>
                <span>Heerbaan 54, 6061 EE Posterholt</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail size={16} className="shrink-0 text-lavender-500"/>
                <a href="mailto:info@dressperience.com" className="hover:text-lavender-600 transition-colors">
                  info@dressperience.com
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Phone size={16} className="shrink-0 text-lavender-500"/>
                <a href="tel:+31642515172" className="hover:text-lavender-600 transition-colors">
                  +31 642515172
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Instagram size={16} className="shrink-0 text-lavender-500"/>
                <a href="https://instagram.com/dressperience" target="_blank" rel="noopener noreferrer"
                   className="hover:text-lavender-600 transition-colors">
                  @dressperience
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="shrink-0 text-lavender-500"
                  aria-hidden="true"
                >
                  <path
                    d="M24 12a12 12 0 1 0-13.88 11.85v-8.39H7.08V12h3.04V9.36c0-3 1.79-4.66 4.53-4.66 1.31 0 2.68.23 2.68.23v2.95h-1.51c-1.49 0-1.96.93-1.96 1.88V12h3.33l-.53 3.46h-2.8v8.39A12 12 0 0 0 24 12z"/>
                </svg>

                <a
                  href="https://facebook.com/dressperience"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-lavender-600 transition-colors"
                >
                  Dressperience
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
