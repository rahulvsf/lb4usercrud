import {BindingKey} from '@loopback/context';

export namespace LoggerComponentKeys {
  export const CUSTOM_LOGGER = BindingKey.create<LogTypes>(
    'logger-component.logger',
  );
}

export enum LogTypes {
  INFO,
  ERROR,
}
