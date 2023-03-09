import {inject} from '@loopback/core';
import {
  FindRoute,
  InvokeMethod,
  parseOperationArgs,
  Reject,
  RequestContext,
  RestBindings,
  Send,
  SequenceActions,
  SequenceHandler,
} from '@loopback/rest';
import * as dotenv from 'dotenv';
dotenv.config();

export class MySequence implements SequenceHandler {
  constructor(
    @inject(SequenceActions.FIND_ROUTE)
    protected findRoute: FindRoute,
    @inject(RestBindings.SequenceActions.PARSE_PARAMS)
    protected invoke: InvokeMethod,
    @inject(RestBindings.SequenceActions.SEND)
    public send: Send,
    @inject(RestBindings.SequenceActions.REJECT)
    public reject: Reject,
  ) {}

  log(message: string) {
    console.log(message);
  }

  async handle(context: RequestContext) {
    // should change to referer
    if (
      context.request.headers.host?.includes(
        process.env.ALLOWED_ORIGIN as string,
      )
    ) {
      const {request, response} = context;

      const route = this.findRoute(request);
      const args = await parseOperationArgs(request, route);

      const startDate = new Date();
      this.log('STARTING AT ' + startDate.toLocaleTimeString());
      this.log('HOST: ' + context.request.headers.host);
      this.log('REFERER: ' + context.request.headers.referer);
      this.log('USER AGENT: ' + context.request.headers['user-agent']);
      this.log('IP: ' + context.request.socket.remoteAddress);
      const result = await this.invoke(route, args);
      this.send(response, result);
      const endDate = new Date();
      this.log('CLOSING AT ' + endDate.toLocaleTimeString());
    } else {
      this.reject(context, {name: '403', message: 'Not allowed'});
    }
  }
}
