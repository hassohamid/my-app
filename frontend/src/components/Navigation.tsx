"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { clearToken } from "@/lib/api";

export function Navigation() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // kolla om inloggad via token
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    // lyssna på storage-ändringar (för när man loggar in/ut i annan tab)
    const handleStorage = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const handleLogout = () => {
    clearToken();
    window.location.href = "/";
  };

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md z-50">
      <div className="max-w-6xl mx-auto h-full px-6 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Link href="/" className="flex items-center gap-2.5 mr-8">
            <Image src="/logo.png" alt="Logo" width={28} height={28} className="rounded-md" />
            <span className="text-base font-medium tracking-tight">
              Hasso<span className="text-[var(--muted)]">Bnb</span>
            </span>
          </Link>

          <Link
            href="/"
            className={`relative px-4 py-2 text-sm font-medium transition-colors after:absolute after:bottom-0 after:left-4 after:right-4 after:h-0.5 after:bg-[var(--foreground)] after:transition-transform after:duration-200 ${
              isActive("/")
                ? "text-[var(--foreground)] after:scale-x-100"
                : "text-[var(--muted)] hover:text-[var(--foreground)] after:scale-x-0 hover:after:scale-x-100"
            }`}
          >
            Hem
          </Link>
          <Link
            href="/properties"
            className={`relative px-4 py-2 text-sm font-medium transition-colors after:absolute after:bottom-0 after:left-4 after:right-4 after:h-0.5 after:bg-[var(--foreground)] after:transition-transform after:duration-200 ${
              isActive("/properties")
                ? "text-[var(--foreground)] after:scale-x-100"
                : "text-[var(--muted)] hover:text-[var(--foreground)] after:scale-x-0 hover:after:scale-x-100"
            }`}
          >
            Boenden
          </Link>
          {isLoggedIn && (
            <>
              <Link
                href="/my-properties"
                className={`relative px-4 py-2 text-sm font-medium transition-colors after:absolute after:bottom-0 after:left-4 after:right-4 after:h-0.5 after:bg-[var(--foreground)] after:transition-transform after:duration-200 ${
                  isActive("/my-properties")
                    ? "text-[var(--foreground)] after:scale-x-100"
                    : "text-[var(--muted)] hover:text-[var(--foreground)] after:scale-x-0 hover:after:scale-x-100"
                }`}
              >
                Mina boenden
              </Link>
              <Link
                href="/bookings"
                className={`relative px-4 py-2 text-sm font-medium transition-colors after:absolute after:bottom-0 after:left-4 after:right-4 after:h-0.5 after:bg-[var(--foreground)] after:transition-transform after:duration-200 ${
                  isActive("/bookings")
                    ? "text-[var(--foreground)] after:scale-x-100"
                    : "text-[var(--muted)] hover:text-[var(--foreground)] after:scale-x-0 hover:after:scale-x-100"
                }`}
              >
                Bokningar
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-3 text-sm">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg border border-[var(--border)] hover:bg-[var(--card)] transition-colors"
            >
              Logga ut
            </button>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
              >
                Logga in
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 rounded-lg bg-[var(--foreground)] text-[var(--background)] font-medium hover:opacity-90 transition-opacity"
              >
                Registrera
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
