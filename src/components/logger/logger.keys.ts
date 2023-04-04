import {BindingKey} from '@loopback/context';
import {LoggerFunction} from './logger.types';

export namespace LoggerComponentKeys {
  export const CUSTOM_LOGGER_FN = BindingKey.create<LoggerFunction>(
    'logger-component.logger-fn',
  );
}

export enum LogTypes {
  INFO,
  ERROR,
}
