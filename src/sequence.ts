import {inject} from '@loopback/core';
import {
  FindRoute,
  InvokeMethod,
  ParseParams,
  Reject,
  RequestContext,
  RestBindings,
  Send,
  SequenceActions,
  SequenceHandler,
} from '@loopback/rest';
import * as dotenv from 'dotenv';
import {LoggerComponentKeys, LogTypes} from './components/logger/logger.keys';
import {LoggerFunction} from './components/logger/logger.types';
dotenv.config();

export class MySequence implements SequenceHandler {
  constructor(
    @inject(SequenceActions.FIND_ROUTE)
    protected findRoute: FindRoute,
    @inject(RestBindings.SequenceActions.INVOKE_METHOD)
    protected invoke: InvokeMethod,
    @inject(RestBindings.SequenceActions.PARSE_PARAMS)
    protected parseParams: ParseParams,
    @inject(RestBindings.SequenceActions.SEND)
    public send: Send,
    @inject(RestBindings.SequenceActions.REJECT)
    public reject: Reject,
    @inject(LoggerComponentKeys.CUSTOM_LOGGER_FN)
    public logger: LoggerFunction,
  ) {}

  async handle(context: RequestContext): Promise<void> {
    // should change to referer
    if (
      context.request.headers.host?.includes(
        process.env.ALLOWED_ORIGIN as string,
      )
    ) {
      const {request, response} = context;

      const route = this.findRoute(request);
      const args = await this.parseParams(request, route);

      this.logStarting(context);
      const result = await this.invoke(route, args);
      this.send(response, result);
      this.logEnding();
    } else {
      this.reject(context, {name: '403', message: 'Not allowed'});
    }
  }

  private log(message: string, level?: number): void {
    this.logger(level ?? LogTypes.INFO, message);
  }

  private logStarting(context: RequestContext): void {
    const startDate = new Date();
    this.log('\n************ STARTING **********');
    this.log(startDate.toLocaleTimeString());
    this.log('HOST: ' + context.request.headers.host);
    this.log('REFERER: ' + context.request.headers.referer);
    this.log('USER AGENT: ' + context.request.headers['user-agent']);
    this.log('IP: ' + context.request.socket.remoteAddress);
  }

  private logEnding() {
    const endDate = new Date();
    this.log('CLOSING AT ' + endDate.toLocaleTimeString());
  }
}
