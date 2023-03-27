import {Component, ProviderMap} from '@loopback/core';
import {LoggerComponentKeys} from './logger.keys';
import {LoggerProvider} from './logger.provider';

// created a new component from scratch
// added a LoggerProvider
export class LoggerComponent implements Component {
  providers?: ProviderMap;
  constructor() {
    this.providers = {
      [LoggerComponentKeys.CUSTOM_LOGGER_FN.key]: LoggerProvider,
    };
  }
}
