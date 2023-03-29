import {inject} from '@loopback/core';
import {
  FindRoute,
  HttpErrors,
  InvokeMethod,
  InvokeMiddleware,
  ParseParams,
  Reject,
  RequestContext,
  RestBindings,
  Send,
  SequenceActions,
  SequenceHandler,
} from '@loopback/rest';
import * as dotenv from 'dotenv';
import {AuthenticateFn, AuthenticationBindings} from 'loopback4-authentication';
import {
  AuthorizationBindings,
  AuthorizeErrorKeys,
  AuthorizeFn,
  UserPermissionsFn,
} from 'loopback4-authorization';
import {LoggerComponentKeys, LogTypes} from './components/logger/logger.keys';
import {LoggerFunction} from './components/logger/logger.types';
import {jwtMiddleware} from './middleware/jwtheader';
import {User} from './models';
dotenv.config();

export class MySequence implements SequenceHandler {
  @inject(SequenceActions.INVOKE_MIDDLEWARE, {optional: true})
  protected invokeMiddleware: InvokeMiddleware = () => false;

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
    @inject(AuthenticationBindings.USER_AUTH_ACTION)
    protected authenticateRequest: AuthenticateFn<User>,
    @inject(AuthorizationBindings.USER_PERMISSIONS)
    private readonly getPermissions: UserPermissionsFn<string>,
    @inject(AuthorizationBindings.AUTHORIZE_ACTION)
    protected checkAuthorization: AuthorizeFn,
  ) {}

  async handle(context: RequestContext): Promise<void> {
    try {
      const {request, response} = context;

      const finished = await this.invokeMiddleware(context, {
        middlewareList: [jwtMiddleware],
      });
      if (finished) return;

      const route = this.findRoute(request);
      const args = await this.parseParams(request, route);

      const authUser: User = await this.authenticateRequest(request);

      // get permissions for user
      const permissions = this.getPermissions(
        authUser.permissions,
        authUser.role.permissions,
      );

      // check access
      const isAccessAllowed: boolean = await this.checkAuthorization(
        permissions,
        request,
      );

      if (!isAccessAllowed) {
        throw new HttpErrors.Forbidden(AuthorizeErrorKeys.NotAllowedAccess);
      }
      this.logStarting(context);

      const result = await this.invoke(route, args);
      this.send(response, result);
      this.logEnding();
    } catch (error) {
      this.logError();
      this.reject(context, error);
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

  private logError() {
    const errorTime = new Date();
    this.log(
      'Error Occured at - ' + errorTime.toLocaleTimeString(),
      LogTypes.ERROR,
    );
  }
}
