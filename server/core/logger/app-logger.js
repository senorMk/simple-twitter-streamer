import winston from "winston";
import * as rotate from "winston-daily-rotate-file";
import config from "../config/config.dev.js";
import * as fs from "fs";

const dir = config.logFileDir;

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

let logger = winston.createLogger({
  transports: [
    new winston.transports.DailyRotateFile({
      level: "info",
      filename: config.logFileName,
      dirname: config.logFileDir,
      maxsize: 20971520, //20MB
      maxFiles: 25,
      datePattern: ".dd-MM-yyyy",
    }),
    new winston.transports.Console({
      colorize: true,
      level: "info",
    }),
  ],
});

export default logger;
