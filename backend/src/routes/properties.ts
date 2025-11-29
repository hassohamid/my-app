import { Hono } from "hono";
import { supabase, getUser } from "../lib/supabase.js";
import type { PropertyInput } from "../lib/types.js";

const app = new Hono();

// GET /properties - hämta alla
app.get("/", async (c) => {
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return c.json({ error: error.message }, 500);
  return c.json(data);
});

// GET /properties/mine - hämta användarens egna
app.get("/mine", async (c) => {
  const user = await getUser(c);
  if (!user) return c.json({ error: "Unauthorized" }, 401);

  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return c.json({ error: error.message }, 500);
  return c.json(data);
});

// GET /properties/:id - hämta en
app.get("/:id", async (c) => {
  const id = c.req.param("id");
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return c.json({ error: "Not found" }, 404);
  return c.json(data);
});

// POST /properties - skapa ny
app.post("/", async (c) => {
  const user = await getUser(c);
  if (!user) return c.json({ error: "Unauthorized" }, 401);

  const body = await c.req.json<PropertyInput>();
  const { data, error } = await supabase
    .from("properties")
    .insert({ ...body, user_id: user.id })
    .select()
    .single();

  if (error) return c.json({ error: error.message }, 500);
  return c.json(data, 201);
});

// PUT /properties/:id - uppdatera
app.put("/:id", async (c) => {
  const user = await getUser(c);
  if (!user) return c.json({ error: "Unauthorized" }, 401);

  const id = c.req.param("id");
  const body = await c.req.json<PropertyInput>();
  const { data, error } = await supabase
    .from("properties")
    .update(body)
    .eq("id", id)
    .select()
    .single();

  if (error) return c.json({ error: error.message }, 500);
  return c.json(data);
});

// DELETE /properties/:id - radera
app.delete("/:id", async (c) => {
  const user = await getUser(c);
  if (!user) return c.json({ error: "Unauthorized" }, 401);

  const id = c.req.param("id");
  const { error } = await supabase
    .from("properties")
    .delete()
    .eq("id", id);

  if (error) return c.json({ error: error.message }, 500);
  return c.json({ success: true });
});

export default app;
