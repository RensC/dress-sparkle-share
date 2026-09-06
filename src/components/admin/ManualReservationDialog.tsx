import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { createManualReservation } from "@/lib/reservations.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const timeSlots = ["10:00", "14:00", "19:00"];
const packages = ["Sparkle", "Glamour", "VIP"];

export function ManualReservationDialog() {
  const create = useServerFn(createManualReservation);
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [packageName, setPackageName] = useState(packages[0]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState(timeSlots[0]);
  const [customTime, setCustomTime] = useState("");
  const [groupSize, setGroupSize] = useState("4");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

  function reset() {
    setPackageName(packages[0]);
    setDate("");
    setTime(timeSlots[0]);
    setCustomTime("");
    setGroupSize("4");
    setName("");
    setEmail("");
    setPhone("");
    setNotes("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await create({
        data: {
          packageName,
          date,
          time: time === "custom" ? customTime.trim() : time,
          groupSize: Number(groupSize),
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          notes: notes.trim() || undefined,
        },
      });
      await qc.invalidateQueries({ queryKey: ["admin", "reservations"] });
      toast.success("Reservering toegevoegd");
      reset();
      setOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Opslaan mislukt");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-full font-body text-sm">
          <Plus size={16} className="mr-2" />
          Reservering toevoegen
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl font-light">
            Handmatige reservering
          </DialogTitle>
          <DialogDescription className="font-body">
            Deze reservering wordt direct bevestigd, zonder aanbetaling.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 font-body">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Pakket</Label>
              <Select value={packageName} onValueChange={setPackageName}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {packages.map((p) => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="mr-group">Groepsgrootte</Label>
              <Input
                id="mr-group"
                type="number"
                min={1}
                max={12}
                value={groupSize}
                onChange={(e) => setGroupSize(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="mr-date">Datum</Label>
              <Input
                id="mr-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Tijd</Label>
              <Select value={time} onValueChange={setTime}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {timeSlots.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                  <SelectItem value="custom">Andere tijd…</SelectItem>
                </SelectContent>
              </Select>
              {time === "custom" && (
                <Input
                  type="time"
                  value={customTime}
                  onChange={(e) => setCustomTime(e.target.value)}
                  required
                />
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mr-name">Naam</Label>
            <Input id="mr-name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="mr-email">E-mail</Label>
              <Input
                id="mr-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mr-phone">Telefoon</Label>
              <Input id="mr-phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mr-notes">Opmerkingen</Label>
            <Textarea
              id="mr-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={saving} className="rounded-full">
              {saving ? "Opslaan…" : "Reservering opslaan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
