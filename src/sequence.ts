import {inject} from '@loopback/core';
import {
  FindRoute,
  HttpErrors,
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
import {AuthenticateFn, AuthenticationBindings} from 'loopback4-authentication';
import {
  AuthorizationBindings,
  AuthorizeErrorKeys,
  AuthorizeFn,
  UserPermissionsFn,
} from 'loopback4-authorization';

import {User} from './models';
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
    @inject(AuthenticationBindings.USER_AUTH_ACTION)
    protected authenticateRequest: AuthenticateFn<User>,
    @inject(AuthorizationBindings.USER_PERMISSIONS)
    private readonly getPermissions: UserPermissionsFn<string>,
    @inject(AuthorizationBindings.AUTHORIZE_ACTION)
    protected checkAuthorization: AuthorizeFn,
  ) {}

  async handle(context: RequestContext): Promise<void> {
    try {
      if (
        // TODO: should change to referer
        !context.request.headers.host?.includes(
          process.env.ALLOWED_ORIGIN as string,
        )
      ) {
        throw new HttpErrors.Forbidden('INVALID ORIGIN');
      }
      const {request, response} = context;

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

      const result = await this.invoke(route, args);
      this.send(response, result);
    } catch (error) {
      this.reject(context, error);
    }
  }
}
