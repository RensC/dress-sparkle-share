import { createFileRoute, useNavigate, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Inloggen — Dressperience" }] }),
  beforeLoad: async () => {
    if (typeof window === "undefined") return;
    const { data } = await supabase.auth.getUser();
    if (data.user) throw redirect({ to: "/admin" });
  },
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session?.user) navigate({ to: "/admin", replace: true });
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setInfo(null);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        setInfo("Account aangemaakt. Controleer je inbox om je e-mailadres te bevestigen.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Er ging iets mis");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-200px)] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-2xl border border-border/60 bg-card p-8 md:p-10">
        <div className="text-center">
          <h1 className="font-display text-3xl font-light text-foreground">
            {mode === "signin" ? "Inloggen" : "Account aanmaken"}
          </h1>
          <p className="mt-2 font-body text-sm text-muted-foreground">
            Beheer reserveringen via het admin-paneel.
          </p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              maxLength={255}
              autoComplete="email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Wachtwoord</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
            />
          </div>

          {error && <p className="font-body text-sm text-destructive">{error}</p>}
          {info && <p className="font-body text-sm text-lavender-700">{info}</p>}

          <Button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-lavender-600 py-3 font-body text-sm font-semibold uppercase tracking-widest text-primary-foreground hover:bg-lavender-700"
          >
            {loading ? "Bezig..." : mode === "signin" ? "Inloggen" : "Account aanmaken"}
          </Button>
        </form>

        <button
          onClick={() => {
            setMode(mode === "signin" ? "signup" : "signin");
            setError(null);
            setInfo(null);
          }}
          className="mt-6 w-full font-body text-sm text-lavender-600 underline hover:text-lavender-700"
        >
          {mode === "signin" ? "Nog geen account? Maak er een aan." : "Heb je al een account? Log in."}
        </button>
      </div>
    </div>
  );
}
