import {Next} from '@loopback/core';
import {Middleware, MiddlewareContext} from '@loopback/rest';
import * as dotenv from 'dotenv';
dotenv.config();

import * as jwt from 'jsonwebtoken';

export const jwtMiddleware: Middleware = async (
  context: MiddlewareContext,
  next: Next,
) => {
  const {request} = context;

  const userId = request.headers.cookie?.split('=')[1];
  // emulate permissions array
  const permissions = ['ViewUser'];
  const rolePermissions = ['UpdateUser', 'UpdateRole', 'ViewRole'];
  if (userId) {
    const token = jwt.sign(
      {userId, permissions, role: {permissions: rolePermissions}},
      process.env.JWT_SECRET as string,
    );
    request.headers.authorization = `Bearer ${token}`;
  }

  const result = await next();
  return result;
};
