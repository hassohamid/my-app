"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api, setToken } from "@/lib/api";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { session } = await api.auth.register(email, password);
      if (session?.access_token) {
        setToken(session.access_token);
      }
      window.location.href = "/properties";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registrering misslyckades");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-24">
      <h1 className="text-3xl font-semibold tracking-tight mb-2">Skapa konto</h1>
      <p className="text-[var(--muted)] mb-8">
        Har du redan ett konto?{" "}
        <Link href="/login" className="text-[var(--foreground)] underline">
          Logga in
        </Link>
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-4 rounded-lg bg-red-500/10 text-red-500 text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm mb-2">E-post</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-2">Lösenord</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg"
            minLength={6}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-lg bg-[var(--foreground)] text-[var(--background)] font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? "Skapar konto..." : "Skapa konto"}
        </button>
      </form>
    </div>
  );
}
