import {
  createLogger,
  transports,
  format,
  Logger as OrigionalLogger,
} from "winston";

const logger: Logger = createLogger({
  transports: [new transports.Console()],
  format: format.combine(
    format.colorize(),
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level}: ${message}`;
    })
  ),
});
export default logger;

export type Logger = OrigionalLogger;
