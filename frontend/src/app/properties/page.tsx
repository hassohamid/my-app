"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Property } from "@/lib/types";
import { MapPin, ImageIcon, X } from "lucide-react";
import { DatePicker } from "@/components/DatePicker";

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  // bokning
  const [bookingPropertyId, setBookingPropertyId] = useState<string | null>(null);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  const router = useRouter();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    // kolla om inloggad via token
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    const data = await api.properties.list();
    setProperties(data);
    setLoading(false);
  };

  const handleBookClick = (propertyId: string) => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
    setBookingPropertyId(propertyId);
  };

  const handleCheckInChange = (date: string) => {
    setCheckIn(date);
    if (checkOut && new Date(checkOut) <= new Date(date)) {
      setCheckOut("");
    }
  };

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingPropertyId) return;

    await api.bookings.create({
      check_in_date: checkIn,
      check_out_date: checkOut,
      property_id: bookingPropertyId,
    });

    setBookingPropertyId(null);
    setCheckIn("");
    setCheckOut("");
    router.push("/bookings");
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
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Boenden</h1>
      </div>

      {properties.length === 0 ? (
        <p className="text-[var(--muted)]">Inga boenden ännu.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <div
              key={property.id}
              className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden"
            >
              <div className="relative aspect-[4/3] bg-[var(--border)]">
                {property.image_url ? (
                  <Image
                    src={property.image_url}
                    alt={property.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-[var(--muted)]" strokeWidth={1} />
                  </div>
                )}
                {property.availability ? (
                  <span className="absolute top-3 right-3 px-2 py-1 text-xs rounded-full bg-green-500 text-white">
                    Tillgänglig
                  </span>
                ) : (
                  <span className="absolute top-3 right-3 px-2 py-1 text-xs rounded-full bg-red-500 text-white">
                    Ej tillgänglig
                  </span>
                )}
              </div>

              <div className="p-5">
                <h3 className="text-lg font-medium mb-1">{property.name}</h3>
                <div className="flex items-center gap-1 text-sm text-[var(--muted)] mb-3">
                  <MapPin className="w-3.5 h-3.5" />
                  {property.location}
                </div>
                <p className="text-sm text-[var(--muted)] mb-4 line-clamp-2">
                  {property.description}
                </p>
                <p className="text-xl font-semibold mb-4">
                  {property.price_per_night} SEK <span className="text-sm text-[var(--muted)] font-normal">/ natt</span>
                </p>

                {property.availability && (
                  <button
                    onClick={() => handleBookClick(property.id)}
                    className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--foreground)] text-[var(--background)] font-medium hover:opacity-90 transition-opacity"
                  >
                    Boka nu
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* bokningsmodal */}
      {bookingPropertyId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setBookingPropertyId(null)} />
          <div className="relative w-full max-w-md mx-4 bg-[var(--background)] rounded-2xl border border-[var(--border)] shadow-2xl p-6">
            <button onClick={() => setBookingPropertyId(null)} className="absolute top-4 right-4 p-2 rounded-lg hover:bg-[var(--card)]">
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-semibold mb-1">{properties.find(p => p.id === bookingPropertyId)?.name}</h2>
            <p className="text-sm text-[var(--muted)] mb-6">{properties.find(p => p.id === bookingPropertyId)?.price_per_night} SEK / natt</p>

            <form onSubmit={handleBook} className="space-y-4">
              <DatePicker label="Incheckning" value={checkIn} onChange={handleCheckInChange} />
              <DatePicker label="Utcheckning" value={checkOut} onChange={setCheckOut} minDate={checkIn ? new Date(new Date(checkIn).getTime() + 86400000).toISOString().split("T")[0] : undefined} />

              {checkIn && checkOut && (
                <div className="p-3 rounded-lg bg-[var(--card)] text-sm">
                  <div className="flex justify-between"><span className="text-[var(--muted)]">Nätter</span><span>{Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000)}</span></div>
                  <div className="flex justify-between mt-1 font-medium"><span>Totalt</span><span>{Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000) * (properties.find(p => p.id === bookingPropertyId)?.price_per_night || 0)} SEK</span></div>
                </div>
              )}

              <button type="submit" disabled={!checkIn || !checkOut} className="w-full py-3 rounded-lg bg-[var(--foreground)] text-[var(--background)] font-medium disabled:opacity-50">
                Bekräfta bokning
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
