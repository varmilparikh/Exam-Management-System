import "dotenv/config";
import app from "./app.js";
import prisma from "./config/prisma.js";
import { env } from "./config/env.js";

const SHUTDOWN_TIMEOUT_MS = 10_000;
let shuttingDown = false;
let disconnectPromise: Promise<void> | undefined;

function disconnectPrisma(): Promise<void> {
  disconnectPromise ??= prisma.$disconnect();
  return disconnectPromise;
}

const server = app.listen(env.PORT, "0.0.0.0", () => {
  console.log(`Server listening on port ${env.PORT}`);
});

server.on("error", (error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});

const gracefulShutdown = async (signal: string) => {
  if (shuttingDown) return;
  shuttingDown = true;

  console.log(`${signal} received. Closing server...`);

  const forceClose = setTimeout(() => {
    console.error("Shutdown timed out; closing active connections.");
    server.closeAllConnections();
    void disconnectPrisma().catch((error: unknown) => {
      console.error("Error disconnecting Prisma:", error);
      process.exitCode = 1;
    });
  }, SHUTDOWN_TIMEOUT_MS);
  forceClose.unref();

  server.close((error) => {
    clearTimeout(forceClose);

    void disconnectPrisma()
      .then(() => {
        if (error) {
          console.error("Error closing HTTP server:", error);
          process.exitCode = 1;
          return;
        }

        console.log("Server and Prisma client stopped.");
      })
      .catch((disconnectError: unknown) => {
        console.error("Error disconnecting Prisma:", disconnectError);
        process.exitCode = 1;
      });
  });
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
