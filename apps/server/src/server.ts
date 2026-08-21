import dns from "node:dns";
dns.setDefaultResultOrder("ipv4first"); // Fixes IPv6 resolution issues on Render

import app from "./app";
import { env } from "./config/env";

const server = app.listen(env.PORT, () => {
  console.log(`🚀 Beyownd Backend running on http://localhost:${env.PORT}`);
  console.log(`🌍 Environment: ${env.NODE_ENV}`);
});

// Graceful Shutdown Logic
const shutdown = (signal: string) => {
  console.log(`\n⚠️  Received ${signal}. Closing HTTP server gracefully...`);
  server.close(() => {
    console.log("🛑 HTTP server closed. Process exiting.");
    process.exit(0);
  });
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));