import {Provider, ValueOrPromise} from '@loopback/context';

export class LoggerProvider implements Provider<string> {
  value(): ValueOrPromise<string> {
    return 'Logger Provider';
  }
}
