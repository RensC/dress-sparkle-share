import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { format, parseISO } from "date-fns";
import { nl } from "date-fns/locale";
import { CalendarOff, Plus, Trash2 } from "lucide-react";
import {
  listBlockedSlots,
  createBlockedSlot,
  deleteBlockedSlot,
} from "@/lib/reservations.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const timeSlots = ["10:00", "14:00", "19:00"];
const WHOLE_DAY = "all";

export function BlockedSlotsPanel() {
  const qc = useQueryClient();
  const fetchBlocked = useServerFn(listBlockedSlots);
  const create = useServerFn(createBlockedSlot);
  const remove = useServerFn(deleteBlockedSlot);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "blocked-slots"],
    queryFn: () => fetchBlocked(),
  });

  const [date, setDate] = useState("");
  const [slot, setSlot] = useState<string>(WHOLE_DAY);
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAdd() {
    if (!date) {
      setError("Kies eerst een datum.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await create({
        data: {
          date,
          timeSlot: slot === WHOLE_DAY ? null : slot,
          reason: reason || undefined,
        },
      });
      setReason("");
      qc.invalidateQueries({ queryKey: ["admin", "blocked-slots"] });
    } catch (err) {
      setError(
        err instanceof Error && err.message.includes("duplicate")
          ? "Deze blokkade bestaat al."
          : "Blokkade kon niet worden opgeslagen.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleRemove(id: string) {
    await remove({ data: { id } });
    qc.invalidateQueries({ queryKey: ["admin", "blocked-slots"] });
  }

  const blocked = data?.blockedSlots ?? [];

  return (
    <section className="mt-12 rounded-2xl border border-border/60 bg-card p-6">
      <div className="flex items-center gap-2">
        <CalendarOff size={18} className="text-lavender-600" />
        <h2 className="font-display text-2xl font-light text-foreground">
          Niet beschikbaar <span className="font-semibold italic text-lavender-600">maken</span>
        </h2>
      </div>
      <p className="mt-1 font-body text-sm text-muted-foreground">
        Blokkeer een hele dag of een los tijdvak. Geblokkeerde tijden zijn niet
        meer te kiezen in het reserveringsformulier.
      </p>

      <div className="mt-6 grid gap-3 md:grid-cols-[auto_200px_1fr_auto] md:items-end">
        <div className="space-y-1">
          <Label className="font-body text-xs">Datum</Label>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="font-body"
          />
        </div>
        <div className="space-y-1">
          <Label className="font-body text-xs">Tijdvak</Label>
          <Select value={slot} onValueChange={setSlot}>
            <SelectTrigger className="font-body">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={WHOLE_DAY}>Hele dag</SelectItem>
              {timeSlots.map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label className="font-body text-xs">Notitie (optioneel)</Label>
          <Input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Bijv. vakantie of privéreservering"
            className="font-body"
          />
        </div>
        <Button
          onClick={handleAdd}
          disabled={saving}
          className="rounded-full font-body"
        >
          <Plus size={16} className="mr-1" />
          Blokkeren
        </Button>
      </div>

      {error && (
        <p className="mt-3 font-body text-sm text-destructive">{error}</p>
      )}

      <div className="mt-6 space-y-2">
        {isLoading ? (
          <p className="font-body text-sm text-muted-foreground">Laden...</p>
        ) : blocked.length === 0 ? (
          <p className="font-body text-sm text-muted-foreground">
            Nog geen geblokkeerde dagen of tijdvakken.
          </p>
        ) : (
          blocked.map((b) => (
            <div
              key={b.id}
              className="flex items-center justify-between rounded-xl border border-border/60 bg-background px-4 py-3"
            >
              <div className="font-body text-sm">
                <span className="font-medium text-foreground">
                  {format(parseISO(b.blocked_date), "d MMMM yyyy", { locale: nl })}
                </span>{" "}
                <span className="text-muted-foreground">
                  — {b.time_slot ? `${b.time_slot} uur` : "hele dag"}
                </span>
                {b.reason && (
                  <div className="text-xs text-muted-foreground">{b.reason}</div>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemove(b.id)}
                className="text-muted-foreground hover:text-destructive"
                aria-label="Blokkade verwijderen"
              >
                <Trash2 size={16} />
              </Button>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
