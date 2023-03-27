import {BindingKey} from '@loopback/context';
import {LoggerFunction} from './logger.types';

// created a custom binding
// for the context
export namespace LoggerComponentKeys {
  export const CUSTOM_LOGGER_FN = BindingKey.create<LoggerFunction>(
    'logger-component.logger-fn',
  );
}

export enum LogTypes {
  INFO,
  ERROR,
}
