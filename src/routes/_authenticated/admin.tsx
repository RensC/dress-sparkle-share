import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
import { format, parseISO } from "date-fns";
import { nl } from "date-fns/locale";
import { Search, Trash2, LogOut, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  listReservations,
  updateReservationStatus,
  deleteReservation,
} from "@/lib/reservations.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type Status = "pending" | "confirmed" | "cancelled" | "completed";

const reservationsQueryOptions = queryOptions({
  queryKey: ["admin", "reservations"],
  queryFn: () => listReservations(),
});

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin — Dressperience" }] }),
  loader: ({ context }) => context.queryClient.ensureQueryData(reservationsQueryOptions),
  component: AdminPage,
  errorComponent: ({ error }) => (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center font-body">
      <p className="text-destructive">Kon reserveringen niet laden: {error.message}</p>
    </div>
  ),
});

const statusLabels: Record<Status, string> = {
  pending: "In afwachting",
  confirmed: "Bevestigd",
  cancelled: "Geannuleerd",
  completed: "Afgerond",
};

const statusStyles: Record<Status, string> = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-lavender-100 text-lavender-700",
  cancelled: "bg-rose-100 text-rose-700",
  completed: "bg-emerald-100 text-emerald-800",
};

function AdminPage() {
  const { data } = useSuspenseQuery(reservationsQueryOptions);
  const qc = useQueryClient();
  const update = useServerFn(updateReservationStatus);
  const remove = useServerFn(deleteReservation);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | Status>("all");

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return data.reservations.filter((r) => {
      const matchesStatus = statusFilter === "all" || r.status === statusFilter;
      if (!matchesStatus) return false;
      if (!term) return true;
      return (
        r.name.toLowerCase().includes(term) ||
        r.email.toLowerCase().includes(term) ||
        r.phone.toLowerCase().includes(term) ||
        r.package_name.toLowerCase().includes(term)
      );
    });
  }, [data.reservations, search, statusFilter]);

  const counts = useMemo(() => {
    return data.reservations.reduce(
      (acc, r) => {
        acc.total += 1;
        acc[r.status as Status] = (acc[r.status as Status] ?? 0) + 1;
        return acc;
      },
      { total: 0, pending: 0, confirmed: 0, cancelled: 0, completed: 0 } as Record<string, number>,
    );
  }, [data.reservations]);

  async function handleStatusChange(id: string, status: Status) {
    await update({ data: { id, status } });
    qc.invalidateQueries({ queryKey: ["admin", "reservations"] });
  }

  async function handleDelete(id: string) {
    await remove({ data: { id } });
    qc.invalidateQueries({ queryKey: ["admin", "reservations"] });
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="font-body text-xs font-semibold uppercase tracking-widest text-lavender-600">
            Beheer
          </span>
          <h1 className="mt-2 font-display text-4xl font-light text-foreground md:text-5xl">
            <span className="font-semibold italic text-lavender-600">Reserveringen</span>
          </h1>
        </div>
        <Button
          variant="outline"
          onClick={handleLogout}
          className="rounded-full font-body text-sm"
        >
          <LogOut size={16} className="mr-2" />
          Uitloggen
        </Button>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-5">
        <StatCard label="Totaal" value={counts.total} />
        <StatCard label="In afwachting" value={counts.pending ?? 0} accent />
        <StatCard label="Bevestigd" value={counts.confirmed ?? 0} />
        <StatCard label="Afgerond" value={counts.completed ?? 0} />
        <StatCard label="Geannuleerd" value={counts.cancelled ?? 0} />
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Zoek op naam, e-mail, telefoon of pakket..."
            className="pl-10 font-body"
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as "all" | Status)}>
          <SelectTrigger className="w-[200px] font-body">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle statussen</SelectItem>
            <SelectItem value="pending">In afwachting</SelectItem>
            <SelectItem value="confirmed">Bevestigd</SelectItem>
            <SelectItem value="completed">Afgerond</SelectItem>
            <SelectItem value="cancelled">Geannuleerd</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-border/60 bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Datum & tijd</TableHead>
              <TableHead>Gast</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Pakket</TableHead>
              <TableHead className="text-center">Groep</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Acties</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-12 text-center font-body text-sm text-muted-foreground">
                  <Sparkles className="mx-auto mb-3 text-lavender-400" size={24} />
                  Geen reserveringen gevonden.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-body">
                    <div className="font-medium text-foreground">
                      {format(parseISO(r.reservation_date), "d MMM yyyy", { locale: nl })}
                    </div>
                    <div className="text-xs text-muted-foreground">{r.reservation_time}</div>
                  </TableCell>
                  <TableCell className="font-body">
                    <div className="font-medium text-foreground">{r.name}</div>
                    {r.notes && (
                      <div className="mt-1 max-w-xs truncate text-xs text-muted-foreground" title={r.notes}>
                        {r.notes}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-body text-sm">
                    <a href={`mailto:${r.email}`} className="block text-foreground hover:text-lavender-600">
                      {r.email}
                    </a>
                    <a href={`tel:${r.phone}`} className="block text-xs text-muted-foreground hover:text-lavender-600">
                      {r.phone}
                    </a>
                  </TableCell>
                  <TableCell className="font-body text-sm text-foreground">{r.package_name}</TableCell>
                  <TableCell className="text-center font-body text-sm">{r.group_size}</TableCell>
                  <TableCell>
                    <Select
                      value={r.status}
                      onValueChange={(v) => handleStatusChange(r.id, v as Status)}
                    >
                      <SelectTrigger
                        className={`h-8 w-[150px] rounded-full border-0 font-body text-xs font-medium ${statusStyles[r.status as Status]}`}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {(Object.keys(statusLabels) as Status[]).map((s) => (
                          <SelectItem key={s} value={s}>{statusLabels[s]}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                          <Trash2 size={16} />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Reservering verwijderen?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Deze actie kan niet ongedaan worden gemaakt. De reservering van {r.name} op{" "}
                            {format(parseISO(r.reservation_date), "d MMM yyyy", { locale: nl })} wordt permanent verwijderd.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuleren</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(r.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Verwijderen
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <p className="mt-6 text-center font-body text-xs text-muted-foreground">
        Toont {filtered.length} van {data.reservations.length} reserveringen. •{" "}
        <Link to="/" className="underline hover:text-lavender-600">Terug naar de website</Link>
      </p>
    </div>
  );
}

function StatCard({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className={`rounded-xl border border-border/60 p-4 ${accent ? "bg-lavender-500/5" : "bg-card"}`}>
      <div className="font-body text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="mt-1 font-display text-3xl font-light text-foreground">{value}</div>
    </div>
  );
}
