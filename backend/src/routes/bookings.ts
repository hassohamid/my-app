import { Hono } from "hono";
import { supabase, getUser } from "../lib/supabase.js";
import type { BookingInput } from "../lib/types.js";

const app = new Hono();

// GET /bookings - hämta användarens bokningar
app.get("/", async (c) => {
  const user = await getUser(c);
  if (!user) return c.json({ error: "Unauthorized" }, 401);

  const { data, error } = await supabase
    .from("bookings")
    .select("*, properties(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return c.json({ error: error.message }, 500);
  return c.json(data);
});

// GET /bookings/:id - hämta en bokning
app.get("/:id", async (c) => {
  const user = await getUser(c);
  if (!user) return c.json({ error: "Unauthorized" }, 401);

  const id = c.req.param("id");
  const { data, error } = await supabase
    .from("bookings")
    .select("*, properties(*)")
    .eq("id", id)
    .single();

  if (error) return c.json({ error: "Not found" }, 404);
  return c.json(data);
});

// POST /bookings - skapa bokning med automatisk prisberäkning
app.post("/", async (c) => {
  const user = await getUser(c);
  if (!user) return c.json({ error: "Unauthorized" }, 401);

  const body = await c.req.json<BookingInput>();

  // hämta property för pris
  const { data: property } = await supabase
    .from("properties")
    .select("price_per_night")
    .eq("id", body.property_id)
    .single();

  if (!property) return c.json({ error: "Property not found" }, 404);

  // beräkna antal nätter och totalpris
  const checkIn = new Date(body.check_in_date);
  const checkOut = new Date(body.check_out_date);
  const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
  const total_price = property.price_per_night * nights;

  const { data, error } = await supabase
    .from("bookings")
    .insert({
      ...body,
      user_id: user.id,
      total_price,
    })
    .select()
    .single();

  if (error) return c.json({ error: error.message }, 500);
  return c.json(data, 201);
});

// DELETE /bookings/:id - radera bokning
app.delete("/:id", async (c) => {
  const user = await getUser(c);
  if (!user) return c.json({ error: "Unauthorized" }, 401);

  const id = c.req.param("id");
  const { error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", id);

  if (error) return c.json({ error: error.message }, 500);
  return c.json({ success: true });
});

export default app;
