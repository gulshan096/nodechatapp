import { createLogger, format, transports } from "winston";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logFolder = path.join(__dirname, "log");
if (!fs.existsSync(logFolder)) {
  fs.mkdirSync(logFolder);
}

const today = new Date();
const dateString = today.toISOString().split("T")[0]; // Format: YYYY-MM-DD
const logFileName = path.join(logFolder, `${dateString}.log`);

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.printf(({ level, message, timestamp }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    // new transports.Console(),
    new transports.File({ filename: logFileName }), // Logs to a daily file
  ],
});

export default logger;
