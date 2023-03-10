import {Next} from '@loopback/core';
import {Middleware, MiddlewareContext} from '@loopback/rest';

export const jwtMiddleware: Middleware = async (
  context: MiddlewareContext,
  next: Next,
) => {
  console.log('MIDDLEWARE JWTTT');
  const {request} = context;
  console.log('JWT MIDDLEWARE ', request.headers.cookie);
  const result = await next();
  return result;
};
