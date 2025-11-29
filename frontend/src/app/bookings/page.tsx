"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Booking, Property } from "@/lib/types";

interface BookingWithProperty extends Booking {
  properties: Property;
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<BookingWithProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const data = await api.bookings.list();
    setBookings(data);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    await api.bookings.delete(id);
    loadBookings();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("sv-SE");
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-12">
        <p className="text-[var(--muted)]">Laddar...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-semibold tracking-tight mb-8">Mina bokningar</h1>

      {bookings.length === 0 ? (
        <p className="text-[var(--muted)]">Du har inga bokningar ännu.</p>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="p-6 rounded-xl border border-[var(--border)] bg-[var(--card)] flex items-center justify-between"
            >
              <div className="flex-1">
                <h3 className="text-lg font-medium mb-1">
                  {booking.properties.name}
                </h3>
                <p className="text-sm text-[var(--muted)] mb-2">
                  {booking.properties.location}
                </p>
                <div className="flex items-center gap-6 text-sm">
                  <div>
                    <span className="text-[var(--muted)]">Incheckning: </span>
                    <span className="font-medium">{formatDate(booking.check_in_date)}</span>
                  </div>
                  <div>
                    <span className="text-[var(--muted)]">Utcheckning: </span>
                    <span className="font-medium">{formatDate(booking.check_out_date)}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-medium mb-2">
                  {booking.total_price} SEK
                </p>
                <button
                  onClick={() => handleDelete(booking.id)}
                  className="px-4 py-2 text-sm rounded-lg border border-red-500/20 text-red-500 hover:bg-red-500/10 transition-colors"
                >
                  Avboka
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
