import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";

import properties from "./routes/properties.js";
import bookings from "./routes/bookings.js";
import auth from "./routes/auth.js";

const app = new Hono();

// cors för frontend
app.use("*", cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

// routes
app.route("/properties", properties);
app.route("/bookings", bookings);
app.route("/auth", auth);

// health check
app.get("/", (c) => c.json({ status: "ok" }));

const port = 3001;
console.log(`Hono server running on http://localhost:${port}`);
serve({ fetch: app.fetch, port });
