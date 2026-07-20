import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/algemene-voorwaarden")({
  head: () => ({
    meta: [
      { title: "Algemene Voorwaarden — Dressperience" },
      {
        name: "description",
        content:
          "Lees de algemene voorwaarden van Dressperience Posterholt. Reserveren, betaling, annulering, aansprakelijkheid en fotografie.",
      },
      { property: "og:title", content: "Algemene Voorwaarden — Dressperience" },
      {
        property: "og:description",
        content:
          "Lees de algemene voorwaarden van Dressperience Posterholt.",
      },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="min-h-screen">
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="font-body text-xs font-semibold uppercase tracking-widest text-lavender-600">
            Juridisch
          </span>

          <h1 className="mt-4 font-display text-4xl font-light text-foreground md:text-5xl">
            Algemene{" "}
            <span className="font-semibold italic text-lavender-600">
              Voorwaarden
            </span>
          </h1>

          <p className="mx-auto mt-4 max-w-xl font-body text-base text-muted-foreground">
            Deze voorwaarden gelden voor alle reserveringen en diensten van
            Dressperience Posterholt. Lees ze zorgvuldig door voordat je boekt.
          </p>
        </div>

        <article className="mt-12 space-y-10 rounded-2xl border border-border/60 bg-card p-8 md:p-12">
          <section>
            <h2 className="font-display text-2xl font-semibold text-foreground">
              1. Definities
            </h2>
            <p className="mt-3 font-body text-sm text-muted-foreground">
              In deze voorwaarden wordt verstaan onder:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5 font-body text-sm text-muted-foreground">
              <li>
                <strong className="text-foreground">Dressperience:</strong> De
                gebruiker van deze algemene voorwaarden, gevestigd te
                Posterholt.
              </li>
              <li>
                <strong className="text-foreground">Klant:</strong> De
                natuurlijke persoon of rechtspersoon die een reservering maakt
                voor de aangeboden diensten en optreedt als hoofdboeker voor
                eventuele mede-gast(en).
              </li>
              <li>
                <strong className="text-foreground">De Beleving:</strong> Het
                arrangement bestaande uit het passen van jurken, fotografie en
                consumpties.
              </li>
              <li>
                <strong className="text-foreground">Begeleider:</strong> Iedere
                persoon die aanwezig is tijdens De Beleving, maar geen actief
                gebruik maakt van het passen van de jurken en/of de uitgebreide
                fotoshoot.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-foreground">
              2. Reserveringen en Betaling
            </h2>
            <ul className="mt-3 list-decimal space-y-2 pl-5 font-body text-sm text-muted-foreground">
              <li>
                Dressperience werkt uitsluitend op reservering. Een reservering
                is pas definitief na schriftelijke bevestiging (via e-mail of
                WhatsApp) door Dressperience én na ontvangst van de vereiste
                aanbetaling.
              </li>
              <li>
                Dressperience is gerechtigd een aanbetaling van 50% van het
                totale boekingsbedrag te verlangen om de reservering definitief
                vast te leggen.
              </li>
              <li>
                Het resterende bedrag dient uiterlijk op de dag van de sessie
                vóór aanvang te worden voldaan via pin, overboeking of contante
                betaling.
              </li>
              <li>
                Bijkomende kosten voor onder andere extra fotopakketten of extra
                consumpties worden op de dag zelf verrekend.
              </li>
              <li>
                Voor groepen vanaf 6 personen (inclusief eventuele begeleiders)
                dient vooraf telefonisch of schriftelijk contact te worden
                opgenomen met Dressperience om de mogelijkheden en beschikbaarheid
                af te stemmen.
              </li>
              <li>
                Voor aanwezige personen die niet actief deelnemen aan het
                arrangement (begeleiders) geldt een vast tarief van €15,- per
                persoon. Dit bedrag dekt de gereserveerde ruimte en
                basisconsumpties, en wordt op de dag zelf verrekend.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-foreground">
              3. Wijzigingen en Annulering
            </h2>
            <ul className="mt-3 list-decimal space-y-2 pl-5 font-body text-sm text-muted-foreground">
              <li>
                Annulering of wijziging van de boeking door de klant dient
                schriftelijk (per e-mail of WhatsApp) te geschieden.
              </li>
              <li>
                Het aantal personen voor een reguliere boeking kan tot uiterlijk
                48 uur voor aanvang kosteloos worden gewijzigd.
              </li>
              <li>
                Indien de klant binnen 48 uur voor aanvang met minder personen
                verschijnt dan gereserveerd, vindt er geen restitutie of korting
                plaats op het afgesproken boekingsbedrag in verband met de reeds
                gemaakte voorbereidingen en gereserveerde tijd.
              </li>
              <li>
                Extra arrangementen (zoals de "Sweet and Chocolate Dream") worden
                verzorgd door een extern bedrijf. Wijzigingen in het aantal
                personen of annuleringen van deze specifieke arrangementen kunnen
                tot uiterlijk 48 uur voor aanvang worden doorgegeven. Bij een
                wijziging of annulering binnen 48 uur worden de volledige kosten
                van het externe arrangement in rekening gebracht.
              </li>
              <li>
                Bij een volledige annulering van de boeking tot 7 dagen voor
                aanvang is de klant geen kosten verschuldigd en wordt de aanbetaling
                gerestitueerd.
              </li>
              <li>
                Bij een volledige annulering tussen 7 dagen en 48 uur voor aanvang
                wordt de aanbetaling van 50€ ingehouden ter dekking van de
                gereserveerde tijd.
              </li>
              <li>
                Bij een volledige annulering binnen 48 uur voor aanvang, of bij het
                niet verschijnen zonder afmelding (no-show), is het volledige
                boekingsbedrag (100%) verschuldigd.
              </li>
              <li>
                Indien de klant te laat arriveert, wordt deze tijd in mindering
                gebracht op de duur van De Beleving, zonder recht op restitutie of
                korting.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-foreground">
              4. Gebruik van Jurken en Aansprakelijkheid
            </h2>
            <ul className="mt-3 list-decimal space-y-2 pl-5 font-body text-sm text-muted-foreground">
              <li>
                De klant en diens gasten verplichten zich zorgvuldig om te gaan
                met de eigendommen en jurken van Dressperience.
              </li>
              <li>
                Schade aan of onherstelbare vervuiling van jurken en accessoires
                (zoals vlekken door make-up/zelfbruiner, rode wijn, of scheuren
                door sieraden) wordt in rekening gebracht. De Klant (hoofdboeker)
                is hoofdelijk aansprakelijk voor schade veroorzaakt door zichzelf
                en diens gasten/begeleiders.
              </li>
              <li>
                Dressperience is niet aansprakelijk voor diefstal, verlies of
                schade aan persoonlijke eigendommen van de klant en diens gasten
                tijdens het verblijf.
              </li>
              <li>Deelname aan De Beleving is volledig op eigen risico.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-foreground">
              5. Fotografie, Auteursrecht en Levering
            </h2>
            <ul className="mt-3 list-decimal space-y-2 pl-5 font-body text-sm text-muted-foreground">
              <li>
                Het auteursrecht op alle gemaakte foto’s blijft te allen tijde
                eigendom van Dressperience.
              </li>
              <li>
                De klant ontvangt een licentie voor privégebruik (social media,
                privéprints). Commercieel gebruik of doorverkoop door de klant is
                niet toegestaan.
              </li>
              <li>
                Dressperience heeft het recht om de gemaakte foto’s te gebruiken
                voor promotiedoeleinden (website, portfolio, social media), tenzij
                de klant vóór of tijdens de sessie expliciet aangeeft hier bezwaar
                tegen te hebben.
              </li>
              <li>
                Dressperience streeft ernaar de digitale foto's binnen 3 werkdagen
                na de sessie te leveren. Aan deze termijn kunnen geen rechten worden
                ontleend.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-foreground">
              6. Consumpties en Allergieën
            </h2>
            <ul className="mt-3 list-decimal space-y-2 pl-5 font-body text-sm text-muted-foreground">
              <li>
                De consumpties en hapjes worden verzorgd door externe partners.
              </li>
              <li>
                Allergieën of dieetwensen dienen uiterlijk 48 uur voor de sessie
                schriftelijk te worden gemeld. Dressperience is niet aansprakelijk
                voor allergische reacties indien deze niet, of niet tijdig, zijn
                gemeld.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-foreground">
              7. Overmacht en Klachten
            </h2>
            <ul className="mt-3 list-decimal space-y-2 pl-5 font-body text-sm text-muted-foreground">
              <li>
                Dressperience heeft het recht de afspraak te verzetten in geval van
                overmacht (zoals ziekte of technische storingen). In dit geval
                wordt in overleg een nieuwe datum gepland of de aanbetaling
                gerestitueerd. Er kan geen aanspraak worden gemaakt op aanvullende
                schadevergoeding.
              </li>
              <li>
                Eventuele klachten over de dienstverlening of de foto's dienen
                binnen 14 dagen na De Beleving schriftelijk en gemotiveerd te
                worden gemeld bij Dressperience. Het indienen van een klacht
                schort de betalingsverplichting niet op.
              </li>
            </ul>
          </section>

          <div className="border-t border-border/60 pt-8 text-center">
            <p className="font-body text-sm text-muted-foreground">
              Heb je vragen over deze voorwaarden?{" "}
              <Link
                to="/contact"
                className="font-semibold text-lavender-600 hover:underline"
              >
                Neem contact op
              </Link>
            </p>
          </div>
        </article>
      </section>
    </div>
  );
}
