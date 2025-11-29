# BnB-hanteringsapplikation

## Översikt

Bygg en Airbnb-liknande applikation där användare kan hantera bokningar.

**Stack:** Next.js (frontend + API routes), TypeScript, Supabase (databas + auth)

**Deadline:** 5 november 23:59  
**Presentation:** 6 november 09:00

---

## Krav

### API (Next.js API Routes)

- CRUD för Property (`/api/properties`)
- CRUD för Booking (`/api/bookings`)
- Automatisk beräkning av totalpris: `pricePerNight × antal nätter`
- Cookie-baserad autentisering via Supabase
- Strikt typning - INGEN `any`

### Frontend (Next.js + React)

- Registrera och logga in användare
- Skapa, läsa, uppdatera, radera properties
- Göra och visa bokningar
- Funktionalitet > design

### Databas (Supabase)

- Använd RLS (Row Level Security) för att skydda data
- Endast inloggade användare kan skapa/uppdatera/radera properties

---

## Modeller

### UserProfile

```
id: uuid (primary key)
name: text
email: text
is_admin: boolean (default false)
```

### Property

```
id: uuid (primary key)
name: text
description: text
location: text
price_per_night: integer
availability: boolean (default true)
user_id: uuid (foreign key -> auth.users)
created_at: timestamp
```

### Booking

```
id: uuid (primary key)
check_in_date: date
check_out_date: date
total_price: integer
user_id: uuid (foreign key -> auth.users)
property_id: uuid (foreign key -> properties)
created_at: timestamp
```

---

## Betygskriterier (G)

- [x] CRUD för Property fungerar
- [x] API-rutterna svarar korrekt
- [x] Endast inloggade kan skapa/uppdatera/radera properties
- [x] Frontend och backend är integrerade
- [x] Autentisering fungerar
- [x] Backend är strikt typad (ingen `any`)

---

## Regler för Agent

### MÅSTE FÖLJAS

1. **Ingen overengineering** - enkel, rak kod som löser uppgiften
2. **Läsbar kod** - en nybörjare ska kunna förstå
3. **Följ instruktionerna exakt** - ingen extra funktionalitet
4. **Kommentarer endast på svenska** - inga engelska kommentarer
5. **Kommentera sparsamt** - endast viktiga saker, gemener
6. **Använd MCP** - skapa tabeller, auth, RLS direkt via Supabase MCP

### Exempel på kommentar

```typescript
// hämtar alla properties för inloggad användare
const properties = await supabase.from("properties").select("*");
```

### UNDVIK

- Abstraktioner som inte behövs
- Generiska utility-funktioner
- Överdriven felhantering
- Komplexa designmönster
- Engelska kommentarer
- Kommentarer som förklarar uppenbara saker

---

## Projektstruktur (förslag)

```
/app
  /api
    /properties
      route.ts
    /bookings
      route.ts
    /auth
      route.ts
  /properties
    page.tsx
  /bookings
    page.tsx
  page.tsx
  layout.tsx
/components
/lib
  supabase.ts
  types.ts
```
