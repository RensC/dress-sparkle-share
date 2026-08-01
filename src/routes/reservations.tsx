import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { format } from "date-fns";
import { nl } from "date-fns/locale";
import { z } from "zod";
import {
  CalendarIcon,
  Clock,
  Users,
  Wine,
  Camera,
  Check,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  extraOptions,
  extrasTotal,
  formatEuro,
  type ExtraId,
  type SelectedExtra,
} from "@/lib/extras";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/reservations")({
  head: () => ({
    meta: [
      { title: "Reserveren — Dressperience" },
      {
        name: "description",
        content:
          "Boek je funfitting-ervaring bij Dressperience. Alleen op reservering. Kies je pakket en maak herinneringen met vriendinnen.",
      },
      {
        property: "og:title",
        content: "Reserveren — Dressperience",
      },
      {
        property: "og:description",
        content:
          "Boek je funfitting-ervaring bij Dressperience. Alleen op reservering.",
      },
    ],
  }),
  component: ReservationsPage,
});

const timeSlots = ["10:00", "14:00", "19:00"] as const;
const groupSizes = ["2", "3", "4", "5", "6"] as const;
const packageOptions = ["Sparkle", "Glamour", "VIP"] as const;

type TimeSlot = (typeof timeSlots)[number];
type GroupSize = (typeof groupSizes)[number];
type PackageName = (typeof packageOptions)[number];

const bookingSchema = z.object({
  packageName: z.enum([...packageOptions] as [PackageName, ...PackageName[]]),

  date: z.date({
    required_error: "Kies een datum",
    invalid_type_error: "Kies een datum",
  }),

  time: z.enum([...timeSlots] as [TimeSlot, ...TimeSlot[]], {
    required_error: "Kies een tijd",
    invalid_type_error: "Kies een tijd",
  }),

  groupSize: z.enum([...groupSizes] as [GroupSize, ...GroupSize[]], {
    required_error: "Kies een groepsgrootte",
    invalid_type_error: "Kies een groepsgrootte",
  }),


  name: z
    .string()
    .trim()
    .min(1, "Naam is verplicht")
    .max(100, "Naam mag maximaal 100 tekens bevatten"),

  email: z
    .string()
    .trim()
    .email("Ongeldig e-mailadres")
    .max(255, "E-mailadres is te lang"),

  phone: z
    .string()
    .trim()
    .min(6, "Ongeldig telefoonnummer")
    .max(30, "Telefoonnummer is te lang"),

  notes: z
    .string()
    .trim()
    .max(500, "Opmerkingen mogen maximaal 500 tekens bevatten")
    .optional(),
});

type Confirmation = z.infer<typeof bookingSchema>;

type ReservationResponse = {
  success?: boolean;
  message?: string;
  reservationId?: string;
  checkoutUrl?: string | null;
};

const DEPOSIT_AMOUNT = 50;

type PaymentStatusInfo = {
  reservation_date: string;
  reservation_time: string;
  package_name: string;
  group_size: number;
  payment_status: string;
  status: string;
  deposit_amount: number | string | null;
};

function ReservationsPage() {
  const [packageName, setPackageName] =
    useState<PackageName>("Glamour");

  const [date, setDate] = useState<Date | undefined>();
  const [time, setTime] = useState<TimeSlot | "">("");
  const [groupSize, setGroupSize] = useState<GroupSize | "">("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [extrasState, setExtrasState] = useState<
    Partial<Record<ExtraId, { quantity: number; variant?: string }>>
  >({});

  const selectedExtras: SelectedExtra[] = extraOptions
    .filter((option) => extrasState[option.id])
    .map((option) => {
      const state = extrasState[option.id]!;
      const quantity = option.quantity ? state.quantity : 1;

      return {
        id: option.id,
        name: option.name,
        quantity,
        variant: option.variants ? (state.variant ?? option.variants[0]) : undefined,
        unitPrice: option.price,
        total: Number((option.price * quantity).toFixed(2)),
      };
    });

  const selectedExtrasTotal = extrasTotal(selectedExtras);

  function toggleExtra(id: ExtraId, checked: boolean) {
    setExtrasState((current) => {
      const next = { ...current };
      if (checked) {
        const option = extraOptions.find((item) => item.id === id)!;
        next[id] = {
          quantity: option.quantity?.min ?? 1,
          variant: option.variants?.[0],
        };
      } else {
        delete next[id];
      }
      return next;
    });
  }

  function updateExtra(
    id: ExtraId,
    patch: Partial<{ quantity: number; variant: string }>,
  ) {
    setExtrasState((current) =>
      current[id] ? { ...current, [id]: { ...current[id]!, ...patch } } : current,
    );
  }

  const [confirmation, setConfirmation] =
    useState<Confirmation | null>(null);

  const [confirmedExtras, setConfirmedExtras] = useState<SelectedExtra[]>([]);

  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const [paymentInfo, setPaymentInfo] = useState<PaymentStatusInfo | null>(null);
  const [paymentChecking, setPaymentChecking] = useState(false);
  const [paymentStatusError, setPaymentStatusError] = useState<string | null>(null);

  // After returning from Mollie: show the payment result
  useEffect(() => {
    const reservationId = new URLSearchParams(window.location.search).get(
      "betaling",
    );

    if (!reservationId) return;

    let cancelled = false;
    let attempts = 0;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const finalPaymentStatuses = new Set([
      "paid",
      "failed",
      "canceled",
      "cancelled",
      "expired",
    ]);

    setPaymentChecking(true);
    setPaymentStatusError(null);

    async function poll() {
      attempts += 1;

      try {
        const response = await fetch(
          `/api/public/reservation-status?id=${encodeURIComponent(
            reservationId,
          )}`,
        );

        if (!response.ok) {
          throw new Error(
            "De betaalstatus kon niet worden opgehaald.",
          );
        }

        const data = (await response.json()) as {
          success?: boolean;
          message?: string;
          reservation?: PaymentStatusInfo;
        };

        if (cancelled) return;

        if (!data.success || !data.reservation) {
          throw new Error(
            data.message ??
            "De betaalstatus kon niet worden opgehaald.",
          );
        }

        setPaymentInfo(data.reservation);

        if (
          !finalPaymentStatuses.has(data.reservation.payment_status) &&
          attempts < 5
        ) {
          timeoutId = setTimeout(() => {
            void poll();
          }, 2000);

          return;
        }

        setPaymentChecking(false);
      } catch (err) {
        if (cancelled) return;

        console.error("payment status check failed", err);

        setPaymentStatusError(
          err instanceof Error
            ? err.message
            : "De betaalstatus kon niet worden opgehaald.",
        );
        setPaymentChecking(false);
      }
    }

    void poll();
    window.scrollTo({ top: 0, behavior: "smooth" });

    return () => {
      cancelled = true;

      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  // Load already reserved time slots for the chosen date
  useEffect(() => {
    if (!date) {
      setBookedSlots([]);
      return;
    }

    let cancelled = false;
    const dateKey = format(date, "yyyy-MM-dd");

    setLoadingSlots(true);

    fetch(`/api/public/booked-slots?date=${dateKey}`)
      .then((res) => res.json())
      .then((data: { bookedSlots?: string[] }) => {
        if (cancelled) return;
        const taken = data.bookedSlots ?? [];
        setBookedSlots(taken);
        setTime((current) => (current && taken.includes(current) ? "" : current));
      })
      .catch(() => {
        if (!cancelled) setBookedSlots([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingSlots(false);
      });

    return () => {
      cancelled = true;
    };
  }, [date]);



  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError(null);

    const form = event.currentTarget;
    const formData = new FormData(form);

    const result = bookingSchema.safeParse({
      packageName,
      date,
      time,
      groupSize,
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      notes: formData.get("notes") || undefined,
    });

    if (!result.success) {
      setError(
        result.error.issues[0]?.message ??
        "Controleer het formulier.",
      );

      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(
        "/api/public/send-reservation",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            packageName: result.data.packageName,

            date: format(
              result.data.date,
              "yyyy-MM-dd",
            ),

            time: result.data.time,

            groupSize: Number.parseInt(
              result.data.groupSize,
              10,
            ),

            name: result.data.name,
            email: result.data.email,
            phone: result.data.phone,
            notes: result.data.notes ?? "",
            extras: selectedExtras,
          }),
        },
      );

      const data = (await response.json()) as ReservationResponse;

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ??
          "De reservering kon niet worden verstuurd.",
        );
      }

      // Deposit is mandatory: send the guest straight to Mollie
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }

      setConfirmation(result.data);
      setConfirmedExtras(selectedExtras);

      form.reset();

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (err) {
      console.error("Reserveringsfout:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Er ging iets mis bij het versturen.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  function resetForm() {
    setConfirmation(null);
    setPackageName("Glamour");
    setDate(undefined);
    setTime("");
    setGroupSize("");
    setExtrasState({});
    setConfirmedExtras([]);
    setError(null);
  }

  return (
    <div className="min-h-screen">
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="font-body text-xs font-semibold uppercase tracking-widest text-lavender-600">
            Boek je sessie
          </span>

          <h1 className="mt-4 font-display text-5xl font-light text-foreground md:text-6xl">
            <span className="font-semibold italic text-lavender-600">
              Reserveren
            </span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl font-body text-lg text-muted-foreground">
            Kies het arrangement dat bij jullie past en maak je klaar
            voor een dag vol glamour, gezelligheid en onvergetelijke
            herinneringen.
          </p>
        </div>

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
                  <li
                    key={feature}
                    className="flex items-start gap-3"
                  >
                    <Check
                      size={18}
                      className="mt-0.5 shrink-0 text-lavender-500"
                    />

                    <span className="font-body text-sm text-muted-foreground">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() => {
                  setPackageName(pkg.name);

                  document
                    .getElementById("booking-form")
                    ?.scrollIntoView({
                      behavior: "smooth",
                    });
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

        {(paymentChecking || paymentInfo || paymentStatusError) && (
          <div
            className={`mx-auto mt-16 max-w-2xl rounded-2xl border p-8 text-center ${
              paymentInfo?.payment_status === "paid"
                ? "border-lavender-500/40 bg-lavender-500/5"
                : paymentStatusError
                  ? "border-destructive/30 bg-destructive/5"
                  : "border-border/60 bg-card"
            }`}
          >
            <h2 className="font-display text-2xl font-light text-foreground">
              {paymentChecking
                ? "We controleren je betaling…"
                : paymentStatusError
                  ? "Betaalstatus niet beschikbaar"
                  : paymentInfo?.payment_status === "paid"
                    ? "Je aanbetaling is ontvangen"
                    : "Betaling nog niet afgerond"}
            </h2>

            <p className="mt-3 font-body text-sm text-muted-foreground">
              {paymentChecking
                ? "Een moment geduld, we halen de status van je betaling op."
                : paymentStatusError
                  ? paymentStatusError
                  : paymentInfo?.payment_status === "paid"
                    ? `Je reservering voor het ${paymentInfo.package_name}-pakket op ${paymentInfo.reservation_date} om ${paymentInfo.reservation_time} is definitief bevestigd. Je ontvangt een bevestiging per e-mail.`
                    : `We hebben nog geen aanbetaling van ${formatEuro(
                      Number(paymentInfo?.deposit_amount ?? DEPOSIT_AMOUNT),
                    )} ontvangen. Je reservering is daardoor nog niet definitief — probeer het opnieuw of neem contact met ons op.`}
            </p>
          </div>
        )}

        <div
          id="booking-form"
          className="mt-20 scroll-mt-24"
        >
          {confirmation ? (
            <div className="mx-auto max-w-2xl rounded-2xl border border-lavender-500/40 bg-lavender-500/5 p-8 text-center md:p-12">
              <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-lavender-600 text-white">
                <Sparkles size={28} />
              </div>

              <h2 className="mt-6 font-display text-3xl font-light text-foreground">
                Aanvraag{" "}
                <span className="font-semibold italic text-lavender-600">
                  ontvangen!
                </span>
              </h2>

              <p className="mt-3 font-body text-base text-muted-foreground">
                Bedankt, {confirmation.name}. We hebben je aanvraag
                ontvangen. Je ontvangt een e-mail op{" "}
                {confirmation.email}.
              </p>

              <dl className="mt-8 grid grid-cols-1 gap-4 text-left sm:grid-cols-2">
                <Detail
                  label="Pakket"
                  value={confirmation.packageName}
                />

                <Detail
                  label="Datum"
                  value={format(
                    confirmation.date,
                    "EEEE d MMMM yyyy",
                    {
                      locale: nl,
                    },
                  )}
                />

                <Detail
                  label="Tijd"
                  value={confirmation.time}
                />

                <Detail
                  label="Groepsgrootte"
                  value={`${confirmation.groupSize} gasten`}
                />

                <Detail
                  label="Telefoon"
                  value={confirmation.phone}
                />

                <Detail
                  label="E-mail"
                  value={confirmation.email}
                />
              </dl>

              {confirmedExtras.length > 0 && (
                <div className="mt-6 rounded-lg border border-border/60 bg-background p-4 text-left">
                  <p className="font-body text-xs font-semibold uppercase tracking-widest text-lavender-600">
                    Gekozen extra's
                  </p>

                  <ul className="mt-3 space-y-2">
                    {confirmedExtras.map((extra) => (
                      <li
                        key={extra.id}
                        className="flex items-center justify-between gap-4 font-body text-sm text-foreground"
                      >
                        <span>
                          {extra.quantity > 1 ? `${extra.quantity}× ` : ""}
                          {extra.name}
                          {extra.variant ? ` (${extra.variant})` : ""}
                        </span>

                        <span>{formatEuro(extra.total)}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-3 font-body text-sm font-semibold text-lavender-600">
                    <span>Totaal extra's</span>
                    <span>{formatEuro(extrasTotal(confirmedExtras))}</span>
                  </div>
                </div>
              )}



              <Button
                type="button"
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
                  Reserveer{" "}
                  <span className="font-semibold italic text-lavender-600">
                    online
                  </span>
                </h2>

                <p className="mx-auto mt-3 max-w-xl font-body text-base text-muted-foreground">
                  Vul het formulier in en rond je reservering af met
                  een aanbetaling van €{DEPOSIT_AMOUNT} via Mollie
                  (o.a. iDEAL). Je reservering is definitief zodra de
                  aanbetaling is ontvangen.
                </p>
              </div>

              <form
                className="mx-auto mt-10 max-w-2xl space-y-6"
                onSubmit={handleSubmit}
              >
                <div className="space-y-2">
                  <Label className="font-body text-sm font-medium">
                    Pakket
                  </Label>

                  <Select
                    value={packageName}
                    onValueChange={(value) =>
                      setPackageName(value as PackageName)
                    }
                    disabled={submitting}
                  >
                    <SelectTrigger className="rounded-lg border-border bg-background font-body">
                      <SelectValue placeholder="Kies een pakket" />
                    </SelectTrigger>

                    <SelectContent>
                      {packageOptions.map((item) => (
                        <SelectItem
                          key={item}
                          value={item}
                        >
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3 rounded-xl border border-border/60 bg-blush-200/20 p-5">
                  <div>
                    <Label className="font-body text-sm font-medium">
                      Extra's (optioneel)
                    </Label>

                    <p className="font-body text-xs text-muted-foreground">
                      Maak jullie Dressperience compleet met een extraatje.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {extraOptions.map((option) => {
                      const state = extrasState[option.id];
                      const checked = Boolean(state);

                      return (
                        <div
                          key={option.id}
                          className={cn(
                            "rounded-lg border bg-background p-4 transition-colors",
                            checked
                              ? "border-lavender-500 shadow-sm shadow-lavender-500/10"
                              : "border-border/60",
                          )}
                        >
                          <div className="flex items-start gap-3">
                            <Checkbox
                              id={`extra-${option.id}`}
                              checked={checked}
                              disabled={submitting}
                              onCheckedChange={(value) =>
                                toggleExtra(option.id, value === true)
                              }
                              className="mt-1"
                            />

                            <div className="flex-1">
                              <label
                                htmlFor={`extra-${option.id}`}
                                className="flex flex-wrap items-baseline justify-between gap-2"
                              >
                                <span className="font-body text-sm font-semibold text-foreground">
                                  {option.name}
                                </span>

                                <span className="font-body text-sm font-semibold text-lavender-600">
                                  {option.priceLabel}
                                </span>
                              </label>

                              <p className="mt-1 font-body text-xs italic text-muted-foreground">
                                {option.tagline}
                              </p>

                              <p className="mt-2 font-body text-xs text-muted-foreground">
                                {option.description}
                              </p>

                              {option.includes && (
                                <ul className="mt-3 space-y-1.5">
                                  {option.includes.map((item) => (
                                    <li
                                      key={item}
                                      className="flex items-start gap-2"
                                    >
                                      <Check
                                        size={14}
                                        className="mt-0.5 shrink-0 text-lavender-500"
                                      />

                                      <span className="font-body text-xs text-muted-foreground">
                                        {item}
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              )}

                              {checked &&
                                (option.quantity || option.variants) && (
                                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    {option.quantity && (
                                      <div className="space-y-1.5">
                                        <Label className="font-body text-xs font-medium">
                                          Aantal
                                        </Label>

                                        <Select
                                          value={String(state?.quantity ?? 1)}
                                          onValueChange={(value) =>
                                            updateExtra(option.id, {
                                              quantity: Number.parseInt(value, 10),
                                            })
                                          }
                                          disabled={submitting}
                                        >
                                          <SelectTrigger className="h-9 rounded-lg border-border bg-background font-body text-sm">
                                            <SelectValue />
                                          </SelectTrigger>

                                          <SelectContent>
                                            {Array.from(
                                              {
                                                length:
                                                  option.quantity.max -
                                                  option.quantity.min +
                                                  1,
                                              },
                                              (_, index) =>
                                                option.quantity!.min + index,
                                            ).map((value) => (
                                              <SelectItem
                                                key={value}
                                                value={String(value)}
                                              >
                                                {value}× {option.quantity!.unit}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    )}

                                    {option.variants && (
                                      <div className="space-y-1.5">
                                        <Label className="font-body text-xs font-medium">
                                          Variant
                                        </Label>

                                        <Select
                                          value={
                                            state?.variant ?? option.variants[0]
                                          }
                                          onValueChange={(value) =>
                                            updateExtra(option.id, {
                                              variant: value,
                                            })
                                          }
                                          disabled={submitting}
                                        >
                                          <SelectTrigger className="h-9 rounded-lg border-border bg-background font-body text-sm">
                                            <SelectValue />
                                          </SelectTrigger>

                                          <SelectContent>
                                            {option.variants.map((variant) => (
                                              <SelectItem
                                                key={variant}
                                                value={variant}
                                              >
                                                {variant}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    )}
                                  </div>
                                )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {selectedExtras.length > 0 && (
                    <div className="flex items-center justify-between rounded-lg bg-lavender-500/10 px-4 py-3">
                      <span className="font-body text-sm text-foreground">
                        Totaal extra's
                      </span>

                      <span className="font-body text-sm font-semibold text-lavender-600">
                        {formatEuro(selectedExtrasTotal)}
                      </span>
                    </div>
                  )}
                </div>



                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                  <div className="space-y-2 sm:col-span-1">
                    <Label className="font-body text-sm font-medium">
                      Datum
                    </Label>

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          disabled={submitting}
                          className={cn(
                            "w-full justify-start rounded-lg border-border bg-background font-body font-normal",
                            !date &&
                            "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />

                          {date
                            ? format(
                              date,
                              "d MMM yyyy",
                              {
                                locale: nl,
                              },
                            )
                            : "Kies datum"}
                        </Button>
                      </PopoverTrigger>

                      <PopoverContent
                        className="w-auto p-0"
                        align="start"
                      >
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          autoFocus
                          locale={nl}
                          disabled={(day) =>
                            day <
                            new Date(
                              new Date().setHours(
                                0,
                                0,
                                0,
                                0,
                              ),
                            )
                          }
                          className={cn(
                            "pointer-events-auto p-3",
                          )}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label className="font-body text-sm font-medium">
                      Tijd
                    </Label>

                    <Select
                      value={time}
                      onValueChange={(value) =>
                        setTime(value as TimeSlot)
                      }
                      disabled={submitting || !date || loadingSlots}
                    >
                      <SelectTrigger className="rounded-lg border-border bg-background font-body">
                        <SelectValue
                          placeholder={
                            !date
                              ? "Kies eerst een datum"
                              : loadingSlots
                                ? "Beschikbaarheid laden..."
                                : "Kies tijd"
                          }
                        />
                      </SelectTrigger>

                      <SelectContent>
                        {timeSlots.map((item) => {
                          const taken = bookedSlots.includes(item);

                          return (
                            <SelectItem
                              key={item}
                              value={item}
                              disabled={taken}
                            >
                              {item}
                              {taken ? " — volgeboekt" : ""}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>

                    {date && !loadingSlots && bookedSlots.length >= timeSlots.length && (
                      <p className="font-body text-xs text-destructive">
                        Deze dag is volledig volgeboekt. Kies een andere datum.
                      </p>
                    )}

                  </div>

                  <div className="space-y-2">
                    <Label className="font-body text-sm font-medium">
                      Aantal gasten
                    </Label>

                    <Select
                      value={groupSize}
                      onValueChange={(value) =>
                        setGroupSize(value as GroupSize)
                      }
                      disabled={submitting}
                    >
                      <SelectTrigger className="rounded-lg border-border bg-background font-body">
                        <SelectValue placeholder="Kies aantal" />
                      </SelectTrigger>

                      <SelectContent>
                        {groupSizes.map((item) => (
                          <SelectItem
                            key={item}
                            value={item}
                          >
                            {item} gasten
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label
                      htmlFor="name"
                      className="font-body text-sm font-medium"
                    >
                      Naam
                    </Label>

                    <Input
                      id="name"
                      name="name"
                      placeholder="Je naam"
                      maxLength={100}
                      autoComplete="name"
                      disabled={submitting}
                      required
                      className="rounded-lg border-border bg-background font-body"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="phone"
                      className="font-body text-sm font-medium"
                    >
                      Telefoon
                    </Label>

                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+31 6 12 34 56 78"
                      maxLength={30}
                      autoComplete="tel"
                      disabled={submitting}
                      required
                      className="rounded-lg border-border bg-background font-body"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="font-body text-sm font-medium"
                  >
                    E-mail
                  </Label>

                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="jij@voorbeeld.nl"
                    maxLength={255}
                    autoComplete="email"
                    disabled={submitting}
                    required
                    className="rounded-lg border-border bg-background font-body"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="notes"
                    className="font-body text-sm font-medium"
                  >
                    Opmerkingen (optioneel)
                  </Label>

                  <Textarea
                    id="notes"
                    name="notes"
                    rows={4}
                    maxLength={500}
                    disabled={submitting}
                    placeholder="Speciale gelegenheid, dieetwensen of vragen..."
                    className="resize-none rounded-lg border-border bg-background font-body"
                  />
                </div>

                {error && (
                  <p
                    className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 font-body text-sm text-destructive"
                    role="alert"
                  >
                    {error}
                  </p>
                )}

                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-full bg-lavender-600 py-3.5 font-body text-sm font-semibold uppercase tracking-widest text-primary-foreground transition-all hover:bg-lavender-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting
                    ? "Bezig met versturen..."
                    : "Reservering bevestigen"}
                </Button>

                <p className="text-center font-body text-xs text-muted-foreground">
                  Door te reserveren ga je akkoord met onze{" "}
                  <Link
                    to="/algemene-voorwaarden"
                    className="font-semibold text-lavender-600 hover:underline"
                  >
                    algemene voorwaarden
                  </Link>
                  .
                </p>
              </form>
            </div>
          )}
        </div>

        <div className="mt-20 rounded-2xl border border-border/60 bg-card p-8 md:p-12">
          <h2 className="font-display text-3xl font-light text-foreground">
            Goed om te{" "}
            <span className="font-semibold italic text-lavender-600">
              weten
            </span>
          </h2>

          <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {infoCards.map((info) => (
              <div
                key={info.title}
                className="flex flex-col items-start gap-3"
              >
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
      </section>
    </div>
  );
}

function Detail({
                  label,
                  value,
                }: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-border/60 bg-background p-4">
      <dt className="font-body text-xs font-semibold uppercase tracking-widest text-lavender-600">
        {label}
      </dt>

      <dd className="mt-1 font-body text-sm text-foreground">
        {value}
      </dd>
    </div>
  );
}

type PackageCard = {
  name: PackageName;
  description: string;
  price: string;
  priceNote: string;
  highlighted: boolean;
  features: string[];
};

type InfoCard = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const packages = [
  {
    name: "Sparkle",
    description: "Perfect voor een korte, magische ervaring.",
    price: "€49,50",
    priceNote: " / persoon",
    highlighted: false,
    features: [
      "1.5 uur",
      "Ontvangst met feestelijke bubbels",
      "2 jurken passen per persoon",
      "Vrij gebruik van accessoires",
    ],
  },
  {
    name: "Glamour",
    description: "Onze populairste ervaring.",
    price: "€59,50",
    priceNote: " / persoon",
    highlighted: true,
    features: [
      "2 tot 2.5 uur",
      "Ontvangst met feestelijke bubbels",
      "3 jurken passen per persoon",
      "Vrij gebruik van accessoires",
      "Kleine traktatie van onze lokale bakkerij",
    ],
  },
  {
    name: "VIP",
    description:
      "Ultieme verwennerij met extra aandacht, tijd en styling om écht te stralen.",
    price: "€75,-",
    priceNote: " / persoon",
    highlighted: false,
    features: [
      "2.5 tot 3 uur",
      "Ontvangst met feestelijke bubbels",
      "3 jurken passen per persoon",
      "Extra styling en aandacht",
      "Luxe hapje van onze lokale bakkerij",
      "1 Dressperience cocktail",
      "1 bewerkte digitale foto",
      "Onbeperkt koffie, thee en fruitwater",
    ],
  },
] satisfies PackageCard[];

const infoCards = [
  {
    icon: Clock,
    title: "Vooraf reserveren",
    description: "Weekendplekken zijn snel volgeboekt!",
  },
  {
    icon: Users,
    title: "Groepsgrootte",
    description:
      "Voor groepen groter dan 6 personen nemen jullie het beste even contact op voor de beste ervaring.",
  },
  {
    icon: Wine,
    title: "High tea",
    description:
      "Luxe high tea met lekkernijen van onze lokale bakkerij zijn optioneel bij te boeken.",
  },
  {
    icon: Camera,
    title: "Foto's",
    description:
      "Professionele foto's worden tijdens je sessie gemaakt. Foto's zijn binnen 48 uur beschikbaar via een persoonlijke link.",
  },
] satisfies InfoCard[];