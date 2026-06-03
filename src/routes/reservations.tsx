import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { format } from "date-fns";
import { nl } from "date-fns/locale";
import { z } from "zod";
import { CalendarIcon, Clock, Users, Wine, Camera, Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createReservation } from "@/lib/reservations.functions";

export const Route = createFileRoute("/reservations")({
  head: () => ({
    meta: [
      { title: "Reserveren — Dressperience" },
      { name: "description", content: "Boek je funfitting-ervaring bij Dressperience. Alleen op reservering. Kies je pakket en maak herinneringen met vriendinnen." },
      { property: "og:title", content: "Reserveren — Dressperience" },
      { property: "og:description", content: "Boek je funfitting-ervaring bij Dressperience. Alleen op reservering." },
    ],
  }),
  component: ReservationsPage,
});

const timeSlots = ["10:00", "11:30", "13:00", "14:30", "16:00"];
const groupSizes = ["1", "2", "3", "4", "5", "6"];
const packageOptions = ["Sparkle", "Glamour", "Celebration"] as const;

const bookingSchema = z.object({
  packageName: z.enum(packageOptions),
  date: z.date({ message: "Kies een datum" }),
  time: z.string().min(1, "Kies een tijd"),
  groupSize: z.string().min(1, "Kies een groepsgrootte"),
  name: z.string().trim().min(1, "Naam is verplicht").max(100),
  email: z.string().trim().email("Ongeldig e-mailadres").max(255),
  phone: z.string().trim().min(6, "Ongeldig telefoonnummer").max(30),
  notes: z.string().trim().max(500).optional(),
});

type Confirmation = z.infer<typeof bookingSchema>;

function ReservationsPage() {
  const [packageName, setPackageName] = useState<(typeof packageOptions)[number]>("Glamour");
  const [date, setDate] = useState<Date | undefined>();
  const [time, setTime] = useState<string>("");
  const [groupSize, setGroupSize] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);
  const submitReservation = useServerFn(createReservation);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const result = bookingSchema.safeParse({
      packageName,
      date,
      time,
      groupSize,
      name: fd.get("name"),
      email: fd.get("email"),
      phone: fd.get("phone"),
      notes: fd.get("notes") || undefined,
    });
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Controleer het formulier");
      return;
    }

    setSubmitting(true);
    try {
      await submitReservation({
        data: {
          packageName: result.data.packageName,
          date: format(result.data.date, "yyyy-MM-dd"),
          time: result.data.time,
          groupSize: parseInt(result.data.groupSize, 10),
          name: result.data.name,
          email: result.data.email,
          phone: result.data.phone,
          notes: result.data.notes,
        },
      });
      setConfirmation(result.data);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Er ging iets mis bij het versturen.");
    } finally {
      setSubmitting(false);
    }
  }

  function resetForm() {
    setConfirmation(null);
    setDate(undefined);
    setTime("");
    setGroupSize("");
  }



  return (
    <div className="min-h-screen">
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="font-body text-xs font-semibold uppercase tracking-widest text-lavender-600">
            Boek je sessie
          </span>
          <h1 className="mt-4 font-display text-5xl font-light text-foreground md:text-6xl">
            <span className="font-semibold italic text-lavender-600">Reserveren</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl font-body text-lg text-muted-foreground">
            Alle ervaringen zijn alleen op reservering. Kies het pakket dat bij jouw groep past en laat ons samen iets magisch creëren.
          </p>
        </div>

        {/* Pakketten */}
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
                  Meest gekozen
                </span>
              )}
              <h3 className="font-display text-2xl font-semibold text-foreground">{pkg.name}</h3>
              <p className="mt-2 font-body text-sm text-muted-foreground">{pkg.description}</p>
              <div className="mt-6">
                <span className="font-display text-4xl font-light text-foreground">{pkg.price}</span>
                <span className="font-body text-sm text-muted-foreground">{pkg.priceNote}</span>
              </div>
              <ul className="mt-6 flex-1 space-y-3">
                {pkg.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check size={18} className="mt-0.5 shrink-0 text-lavender-500" />
                    <span className="font-body text-sm text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => {
                  setPackageName(pkg.name as (typeof packageOptions)[number]);
                  document.getElementById("booking-form")?.scrollIntoView({ behavior: "smooth" });
                }}
                className={`mt-8 inline-flex items-center justify-center rounded-full px-8 py-3.5 font-body text-sm font-semibold uppercase tracking-widest transition-all ${
                  pkg.highlighted
                    ? "bg-lavender-600 text-primary-foreground hover:bg-lavender-700"
                    : "border border-border bg-background text-foreground hover:bg-blush-200/50"
                }`}
              >
                Kies {pkg.name}
              </button>
            </div>
          ))}
        </div>

        {/* Boekingsformulier of bevestiging */}
        <div id="booking-form" className="mt-20 scroll-mt-24">
          {confirmation ? (
            <div className="mx-auto max-w-2xl rounded-2xl border border-lavender-500/40 bg-lavender-500/5 p-8 md:p-12 text-center">
              <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-lavender-600 text-white">
                <Sparkles size={28} />
              </div>
              <h2 className="mt-6 font-display text-3xl font-light text-foreground">
                Boeking <span className="font-semibold italic text-lavender-600">bevestigd!</span>
              </h2>
              <p className="mt-3 font-body text-base text-muted-foreground">
                Bedankt, {confirmation.name}. We hebben je aanvraag ontvangen en sturen binnen 24 uur een bevestiging naar {confirmation.email}.
              </p>

              <dl className="mt-8 grid grid-cols-1 gap-4 text-left sm:grid-cols-2">
                <Detail label="Pakket" value={confirmation.packageName} />
                <Detail label="Datum" value={format(confirmation.date, "EEEE d MMMM yyyy", { locale: nl })} />
                <Detail label="Tijd" value={confirmation.time} />
                <Detail label="Groepsgrootte" value={`${confirmation.groupSize} ${confirmation.groupSize === "1" ? "gast" : "gasten"}`} />
                <Detail label="Telefoon" value={confirmation.phone} />
                <Detail label="E-mail" value={confirmation.email} />
              </dl>

              <Button
                onClick={resetForm}
                className="mt-8 rounded-full bg-lavender-600 px-8 py-3 font-body text-sm font-semibold uppercase tracking-widest text-primary-foreground hover:bg-lavender-700"
              >
                Nieuwe reservering
              </Button>
            </div>
          ) : (
            <div className="rounded-2xl border border-border/60 bg-card p-8 md:p-12">
              <div className="text-center">
                <h2 className="font-display text-3xl font-light text-foreground md:text-4xl">
                  Reserveer <span className="font-semibold italic text-lavender-600">online</span>
                </h2>
                <p className="mx-auto mt-3 max-w-xl font-body text-base text-muted-foreground">
                  Vul het formulier in en ontvang direct een voorlopige bevestiging.
                </p>
              </div>

              <form className="mx-auto mt-10 max-w-2xl space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label className="font-body text-sm font-medium">Pakket</Label>
                  <Select value={packageName} onValueChange={setPackageName}>
                    <SelectTrigger className="rounded-lg border-border bg-background font-body">
                      <SelectValue placeholder="Kies een pakket" />
                    </SelectTrigger>
                    <SelectContent>
                      {packageOptions.map((p) => (
                        <SelectItem key={p} value={p}>{p}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                  <div className="space-y-2 sm:col-span-1">
                    <Label className="font-body text-sm font-medium">Datum</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          className={cn(
                            "w-full justify-start rounded-lg border-border bg-background font-body font-normal",
                            !date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "d MMM yyyy", { locale: nl }) : "Kies datum"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          initialFocus
                          locale={nl}
                          disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label className="font-body text-sm font-medium">Tijd</Label>
                    <Select value={time} onValueChange={setTime}>
                      <SelectTrigger className="rounded-lg border-border bg-background font-body">
                        <SelectValue placeholder="Kies tijd" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((t) => (
                          <SelectItem key={t} value={t}>{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="font-body text-sm font-medium">Aantal gasten</Label>
                    <Select value={groupSize} onValueChange={setGroupSize}>
                      <SelectTrigger className="rounded-lg border-border bg-background font-body">
                        <SelectValue placeholder="Kies aantal" />
                      </SelectTrigger>
                      <SelectContent>
                        {groupSizes.map((g) => (
                          <SelectItem key={g} value={g}>
                            {g} {g === "1" ? "gast" : "gasten"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="font-body text-sm font-medium">Naam</Label>
                    <Input id="name" name="name" placeholder="Je naam" maxLength={100} required className="rounded-lg border-border bg-background font-body" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="font-body text-sm font-medium">Telefoon</Label>
                    <Input id="phone" name="phone" type="tel" placeholder="+31 6 12 34 56 78" maxLength={30} required className="rounded-lg border-border bg-background font-body" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="font-body text-sm font-medium">E-mail</Label>
                  <Input id="email" name="email" type="email" placeholder="jij@voorbeeld.nl" maxLength={255} required className="rounded-lg border-border bg-background font-body" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes" className="font-body text-sm font-medium">Opmerkingen (optioneel)</Label>
                  <Textarea id="notes" name="notes" rows={4} maxLength={500} placeholder="Speciale gelegenheid, dieetwensen of vragen..." className="rounded-lg border-border bg-background font-body resize-none" />
                </div>

                {error && <p className="font-body text-sm text-destructive">{error}</p>}

                <Button
                  type="submit"
                  className="w-full rounded-full bg-lavender-600 py-3.5 font-body text-sm font-semibold uppercase tracking-widest text-primary-foreground transition-all hover:bg-lavender-700"
                >
                  Reservering bevestigen
                </Button>
                <p className="text-center font-body text-xs text-muted-foreground">
                  Sessies vereisen minimaal 7 dagen vooraf reserveren. We bevestigen je boeking per e-mail.
                </p>
              </form>
            </div>
          )}
        </div>

        {/* Goed om te weten */}
        <div className="mt-20 rounded-2xl border border-border/60 bg-card p-8 md:p-12">
          <h2 className="font-display text-3xl font-light text-foreground">
            Goed om te <span className="font-semibold italic text-lavender-600">weten</span>
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {infoCards.map((info) => (
              <div key={info.title} className="flex flex-col items-start gap-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-lavender-500/10 text-lavender-600">
                  <info.icon size={20} />
                </div>
                <h4 className="font-body text-base font-semibold text-foreground">{info.title}</h4>
                <p className="font-body text-sm text-muted-foreground">{info.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border/60 bg-background p-4">
      <dt className="font-body text-xs font-semibold uppercase tracking-widest text-lavender-600">{label}</dt>
      <dd className="mt-1 font-body text-sm text-foreground">{value}</dd>
    </div>
  );
}

const packages = [
  {
    name: "Sparkle",
    description: "Perfect voor een korte, magische ervaring met je beste vriendin.",
    price: "€89",
    priceNote: " / persoon",
    highlighted: false,
    features: [
      "Funfitting-sessie van 2 uur",
      "Tot 2 gasten",
      "5 jurken passen per persoon",
      "Welkomstdrankje inbegrepen",
      "10 bewerkte digitale foto's",
    ],
  },
  {
    name: "Glamour",
    description: "Onze populairste ervaring voor kleine groepjes vriendinnen.",
    price: "€79",
    priceNote: " / persoon",
    highlighted: true,
    features: [
      "Funfitting-sessie van 3 uur",
      "Tot 4 gasten",
      "8 jurken passen per persoon",
      "Drankjes & hapjes inbegrepen",
      "25 bewerkte digitale foto's",
      "Privé studio-sessie",
    ],
  },
  {
    name: "Celebration",
    description: "De ultieme groepservaring voor bijzondere gelegenheden.",
    price: "€69",
    priceNote: " / persoon",
    highlighted: false,
    features: [
      "Funfitting-sessie van 4 uur",
      "Tot 6 gasten",
      "Onbeperkt jurken passen",
      "Volledige drankjes & snacks",
      "50+ bewerkte digitale foto's",
      "Persoonlijke videomontage",
    ],
  },
];

const infoCards = [
  {
    icon: Clock,
    title: "Vooraf reserveren",
    description: "Alle sessies vereisen minimaal 7 dagen vooraf boeken. Weekendplekken zijn snel volgeboekt!",
  },
  {
    icon: Users,
    title: "Groepsgrootte",
    description: "Onze studio biedt comfortabel plaats aan maximaal 6 gasten per sessie voor de beste ervaring.",
  },
  {
    icon: Wine,
    title: "Drankjes & snacks",
    description: "Complimentaire prosecco, champagne en verfrissende mocktails zijn bij elk pakket inbegrepen.",
  },
  {
    icon: Camera,
    title: "Foto's",
    description: "Professionele foto's worden tijdens je sessie gemaakt. Digitale galerij wordt binnen 5 dagen geleverd.",
  },
];
