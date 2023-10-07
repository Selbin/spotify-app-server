import { createLogger, transports, format } from 'winston';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const logLevels = {
    error: 0,
    warn: 1,
    info: 2,
    verbose: 3,
    debug: 4
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const logFile = join(__dirname, 'logs', 'app.log');

// Configure Winston
const logger = createLogger({
    levels: logLevels,
    format: format.combine(
        format.colorize(),
        format.timestamp(),
        format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level}] ${message}`;
        })
    ),
    transports: [new transports.File({ filename: logFile }), new transports.Console()]
});

export default logger;
