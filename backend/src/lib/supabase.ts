import { createClient } from "@supabase/supabase-js";
import type { Context } from "hono";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!;

// publik klient för operationer utan auth
export const supabase = createClient(supabaseUrl, supabaseKey);

// hämta user från auth header
export async function getUser(c: Context) {
  const authHeader = c.req.header("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  const token = authHeader.replace("Bearer ", "");
  const { data: { user } } = await supabase.auth.getUser(token);
  return user;
}
