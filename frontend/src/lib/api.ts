const API_URL = "http://localhost:3001";

// hämta token från localStorage
function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

// spara token
export function setToken(token: string) {
  localStorage.setItem("token", token);
}

// radera token
export function clearToken() {
  localStorage.removeItem("token");
}

// generisk fetch med auth header
async function fetchApi<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(error.error || "Request failed");
  }

  return res.json();
}

// auth
export const api = {
  auth: {
    register: (email: string, password: string) =>
      fetchApi<{ user: unknown; session: { access_token: string } }>("/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }),
    login: (email: string, password: string) =>
      fetchApi<{ user: unknown; session: { access_token: string } }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }),
    logout: () => fetchApi("/auth/logout", { method: "POST" }),
  },

  properties: {
    list: () => fetchApi<Property[]>("/properties"),
    mine: () => fetchApi<Property[]>("/properties/mine"),
    get: (id: string) => fetchApi<Property>(`/properties/${id}`),
    create: (data: PropertyInput) =>
      fetchApi<Property>("/properties", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: PropertyInput) =>
      fetchApi<Property>(`/properties/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string) =>
      fetchApi<{ success: boolean }>(`/properties/${id}`, { method: "DELETE" }),
  },

  bookings: {
    list: () => fetchApi<BookingWithProperty[]>("/bookings"),
    get: (id: string) => fetchApi<BookingWithProperty>(`/bookings/${id}`),
    create: (data: BookingInput) =>
      fetchApi<Booking>("/bookings", { method: "POST", body: JSON.stringify(data) }),
    delete: (id: string) =>
      fetchApi<{ success: boolean }>(`/bookings/${id}`, { method: "DELETE" }),
  },
};

// types
import type { Property, Booking } from "./types";

interface PropertyInput {
  name: string;
  description: string;
  location: string;
  price_per_night: number;
  availability?: boolean;
  image_url?: string;
}

interface BookingInput {
  check_in_date: string;
  check_out_date: string;
  property_id: string;
}

interface BookingWithProperty extends Booking {
  properties: Property;
}
