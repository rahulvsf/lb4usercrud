import {Provider, ValueOrPromise} from '@loopback/core';
import {verify} from 'jsonwebtoken';
import {IAuthUser, VerifyFunction} from 'loopback4-authentication';
import {User} from '../models';

export class BearerTokenVerifierProvider
  implements Provider<VerifyFunction.BearerFn>
{
  constructor() {}

  value(): ValueOrPromise<VerifyFunction.BearerFn<IAuthUser>> {
    return async token => {
      const user = verify(token, process.env.JWT_SECRET as string) as User;
      return user;
    };
  }
}
