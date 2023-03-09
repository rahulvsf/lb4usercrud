import {Provider, ValueOrPromise} from '@loopback/context';
import winston from 'winston';
import {LogTypes} from './logger.keys';

type LoggerFunction = (level: number, message: string) => void;

const loggerOptions = {
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({filename: 'error.log', level: 'error'}),
    new winston.transports.File({filename: 'combined.log'}),
  ],
};

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
