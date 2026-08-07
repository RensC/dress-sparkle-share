import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Pagina niet gevonden</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          De pagina die je zoekt bestaat niet of is verplaatst.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Terug naar home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Deze pagina kon niet worden geladen
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Er ging iets mis aan onze kant. Probeer het opnieuw of ga terug naar de homepage.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Probeer opnieuw
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Naar home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Dressperience — Funfitting met vriendinnen" },
      { name: "description", content: "Pas samen met vriendinnen prachtige trouwjurken voor de lol. Een unieke ervaring met foto's en drankjes inbegrepen. Boek vandaag jouw funfitting-sessie!" },
      { name: "author", content: "Dressperience" },
      { property: "og:title", content: "Dressperience — Funfitting met vriendinnen" },
      { property: "og:description", content: "Pas samen met vriendinnen prachtige trouwjurken voor de lol. Een unieke ervaring met foto's en drankjes inbegrepen." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://dress-sparkle-share.lovable.app/" },
      { property: "og:site_name", content: "Dressperience" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@dressperience" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              name: "Dressperience",
              url: "https://dress-sparkle-share.lovable.app/",
              logo: "https://dress-sparkle-share.lovable.app/favicon.png",
              description: "Dressperience organiseert funfitting-ervaringen in Posterholt, Limburg: samen met vriendinnen prachtige trouwjurken passen voor de lol.",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Heerbaan 54",
                addressLocality: "Posterholt",
                postalCode: "6061 EE",
                addressCountry: "NL",
              },
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+31642515172",
                email: "info@dressperience.com",
                contactType: "customer service",
                areaServed: "NL",
                availableLanguage: "Dutch",
              },
              sameAs: [
                "https://www.instagram.com/dressperience_limburg",
                "https://www.facebook.com/people/Dressperience/61587489742533/",
              ],
            },
            {
              "@type": "WebSite",
              name: "Dressperience",
              url: "https://dress-sparkle-share.lovable.app/",
              inLanguage: "nl",
              publisher: {
                "@type": "Organization",
                name: "Dressperience",
              },
            },
          ],
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="nl">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </QueryClientProvider>
  );
}
