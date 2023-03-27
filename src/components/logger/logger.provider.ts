import {Provider, ValueOrPromise} from '@loopback/context';
import winston from 'winston';
import {LogTypes} from './logger.keys';
import {LoggerFunction} from './logger.types';

// 3 --> error.log, combined.log and log to console options
const loggerOptions = {
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({filename: 'error.log', level: 'error'}),
    new winston.transports.File({filename: 'combined.log'}),
  ],
};

// Logger provider for exporting a
// winston logger
export class LoggerProvider implements Provider<LoggerFunction> {
  winston: winston.Logger;

  constructor() {
    this.winston = winston.createLogger(loggerOptions);
  }

  value(): ValueOrPromise<LoggerFunction> {
    return (level: number, message: string) => {
      this.loggerAction(level, message);
    };
  }

  loggerAction(level: number, message: string) {
    // error and info logging
    switch (level) {
      case LogTypes.ERROR:
        this.winston.error(message);
        break;
      case LogTypes.INFO:
        this.winston.info(message);
        break;
    }
  }
}
