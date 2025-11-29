import { Hono } from "hono";
import { supabase } from "../lib/supabase.js";

const app = new Hono();

// POST /auth/register
app.post("/register", async (c) => {
  const { email, password } = await c.req.json<{ email: string; password: string }>();

  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) return c.json({ error: error.message }, 400);
  return c.json({ user: data.user, session: data.session }, 201);
});

// POST /auth/login
app.post("/login", async (c) => {
  const { email, password } = await c.req.json<{ email: string; password: string }>();

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return c.json({ error: error.message }, 401);
  return c.json({ user: data.user, session: data.session });
});

// POST /auth/logout
app.post("/logout", async (c) => {
  await supabase.auth.signOut();
  return c.json({ success: true });
});

export default app;
