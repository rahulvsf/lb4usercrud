import {Component, ProviderMap} from '@loopback/core';
import {LoggerComponentKeys} from './logger.keys';
import {LoggerProvider} from './logger.provider';

export class LoggerComponent implements Component {
  providers?: ProviderMap;
  constructor() {
    this.providers = {
      [LoggerComponentKeys.CUSTOM_LOGGER.key]: LoggerProvider,
    };
  }
}
