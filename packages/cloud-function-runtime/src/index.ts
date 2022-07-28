import logger, { Logger } from "./utils/logger";
import { createServer } from "./utils/server";

export async function init() {
  try {
    // Starting the HTTP server
    logger.info("Starting HTTP server");
    const port = 3000;
    const app = createServer();

    app.listen(port);

    // Register global process events and graceful shutdown
    registerProcessEvents(logger);

    logger.info(`Application running on port: ${port}`);
  } catch (e) {
    logger.error("An error occurred while initializing application.", e);
  }
}

function registerProcessEvents(logger: Logger) {
  process.on("uncaughtException", (error: Error) => {
    logger.error("UncaughtException", error);
  });

  process.on("unhandledRejection", (reason: any, promise: any) => {
    logger.info(reason, promise);
  });

  process.on("SIGTERM", async () => {
    logger.info("Starting graceful shutdown");
    process.exit(0);
  });
}

init();
