"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Property } from "@/lib/types";
import { MapPin, ImageIcon, Plus, X } from "lucide-react";

export default function MyPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // formulärfält
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [pricePerNight, setPricePerNight] = useState("");
  const [availability, setAvailability] = useState(true);
  const [imageUrl, setImageUrl] = useState("");

  const router = useRouter();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const data = await api.properties.mine();
    setProperties(data);
    setLoading(false);
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setLocation("");
    setPricePerNight("");
    setAvailability(true);
    setImageUrl("");
    setEditingId(null);
    setShowModal(false);
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (property: Property) => {
    setName(property.name);
    setDescription(property.description);
    setLocation(property.location);
    setPricePerNight(property.price_per_night.toString());
    setAvailability(property.availability);
    setImageUrl(property.image_url || "");
    setEditingId(property.id);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const propertyData = {
      name,
      description,
      location,
      price_per_night: parseInt(pricePerNight),
      availability,
      image_url: imageUrl || undefined,
    };

    if (editingId) {
      await api.properties.update(editingId, propertyData);
    } else {
      await api.properties.create(propertyData);
    }

    resetForm();
    loadData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Är du säker på att du vill radera detta boende?")) return;
    await api.properties.delete(id);
    loadData();
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
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Mina boenden</h1>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--foreground)] text-[var(--background)] text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Lägg till
        </button>
      </div>

      {properties.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-[var(--muted)] mb-4">Du har inga boenden ännu.</p>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--border)] text-sm font-medium hover:bg-[var(--card)] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Skapa ditt första boende
          </button>
        </div>
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

                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(property)}
                    className="flex-1 px-3 py-2 text-sm rounded-lg border border-[var(--border)] hover:bg-[var(--background)] transition-colors"
                  >
                    Redigera
                  </button>
                  <button
                    onClick={() => handleDelete(property.id)}
                    className="flex-1 px-3 py-2 text-sm rounded-lg border border-red-500/20 text-red-500 hover:bg-red-500/10 transition-colors"
                  >
                    Radera
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={resetForm} />
          <div className="relative w-full max-w-lg mx-4 bg-[var(--background)] rounded-2xl border border-[var(--border)] shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
              <h2 className="text-xl font-semibold">
                {editingId ? "Redigera boende" : "Nytt boende"}
              </h2>
              <button onClick={resetForm} className="p-2 rounded-lg hover:bg-[var(--card)] transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2">Namn</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 rounded-lg" required />
                </div>
                <div>
                  <label className="block text-sm mb-2">Plats</label>
                  <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full px-4 py-3 rounded-lg" required />
                </div>
              </div>

              <div>
                <label className="block text-sm mb-2">Beskrivning</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-4 py-3 rounded-lg resize-none" rows={3} required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2">Pris per natt (SEK)</label>
                  <input type="number" value={pricePerNight} onChange={(e) => setPricePerNight(e.target.value)} className="w-full px-4 py-3 rounded-lg" required />
                </div>
                <div>
                  <label className="block text-sm mb-2">Bild-URL</label>
                  <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." className="w-full px-4 py-3 rounded-lg" />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input type="checkbox" id="availability" checked={availability} onChange={(e) => setAvailability(e.target.checked)} className="w-5 h-5" />
                <label htmlFor="availability" className="text-sm">Tillgänglig för bokning</label>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="submit" className="flex-1 px-6 py-3 rounded-lg bg-[var(--foreground)] text-[var(--background)] font-medium hover:opacity-90 transition-opacity">
                  {editingId ? "Spara ändringar" : "Skapa boende"}
                </button>
                <button type="button" onClick={resetForm} className="px-6 py-3 rounded-lg border border-[var(--border)] font-medium hover:bg-[var(--card)] transition-colors">
                  Avbryt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
