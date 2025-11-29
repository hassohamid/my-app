"use client";

import Link from "next/link";
import { ArrowRight, Search, Shield, Home } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function HomePage() {
  const [availableCount, setAvailableCount] = useState(0);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(!!localStorage.getItem("token"));
    api.properties.list().then((data) => {
      const available = data.filter((p) => p.availability).length;
      setAvailableCount(available);
    });
  }, []);

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--card)] to-[var(--background)]" />
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, var(--foreground) 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }} />

        <div className="relative max-w-6xl mx-auto px-6 py-32 md:py-40">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--foreground)]/5 border border-[var(--border)] text-sm text-[var(--muted)] mb-8">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              {availableCount} boenden tillgängliga
            </div>

            <h1 className="text-5xl md:text-7xl font-semibold tracking-tight leading-[1.1] mb-6">
              Hitta ditt
              <br />
              <span className="text-[var(--muted)]">perfekta boende</span>
            </h1>

            <p className="text-xl text-[var(--muted)] mb-10 leading-relaxed max-w-xl">
              Upptäck unika boenden över hela Sverige. Från strandvillor till fjällstugor.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/properties"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[var(--foreground)] text-[var(--background)] font-medium hover:opacity-90 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Utforska boenden
                <ArrowRight className="w-4 h-4" />
              </Link>
              {!loggedIn && (
              <Link
                href="/register"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl border border-[var(--border)] font-medium hover:bg-[var(--card)] transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Skapa konto
              </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* features */}
      <section className="border-t border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)]">
              <div className="w-12 h-12 rounded-xl bg-[var(--foreground)]/5 flex items-center justify-center mb-4">
                <Search className="w-6 h-6" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-medium mb-2">Sök enkelt</h3>
              <p className="text-[var(--muted)] text-sm leading-relaxed">
                Hitta boenden som passar dina behov med vårt enkla sökverktyg.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)]">
              <div className="w-12 h-12 rounded-xl bg-[var(--foreground)]/5 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-medium mb-2">Säker bokning</h3>
              <p className="text-[var(--muted)] text-sm leading-relaxed">
                Alla transaktioner är skyddade och säkra.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)]">
              <div className="w-12 h-12 rounded-xl bg-[var(--foreground)]/5 flex items-center justify-center mb-4">
                <Home className="w-6 h-6" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-medium mb-2">Lista ditt boende</h3>
              <p className="text-[var(--muted)] text-sm leading-relaxed">
                Tjäna pengar genom att hyra ut din fastighet.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
