import {MiddlewareSequence, RequestContext} from '@loopback/rest';

export class MySequence extends MiddlewareSequence {
  log(message: string) {
    console.log(message);
  }

  async handle(context: RequestContext) {
    const startDate = new Date();
    this.log('STARTING AT ' + startDate.toLocaleTimeString());
    this.log('HOST: ' + context.request.headers.host);
    this.log('REFERER: ' + context.request.headers.referer);
    this.log('USER AGENT: ' + context.request.headers['user-agent']);
    this.log('IP: ' + context.request.socket.remoteAddress);
    await super.handle(context);
    const endDate = new Date();
    this.log('CLOSING AT ' + endDate.toLocaleTimeString());
    this.log('AFTER REQUEST');
  }
}
