import {hasOne, model, property} from '@loopback/repository';
import {IAuthUser} from 'loopback4-authentication';
import {UserPermission, UserPermissionsOverride} from 'loopback4-authorization';
import {SoftDeleteEntity} from 'loopback4-soft-delete';
import {Customer} from './customer.model';
import {Role} from './role.model';

@model({
  name: 'users',
})
export class User
  extends SoftDeleteEntity
  implements IAuthUser, UserPermissionsOverride<string>
{
  @property({
    type: 'string',
    required: true,
  })
  fname: string;

  @property({
    type: 'number',
    id: true,
    generated: false,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  mname: string;

  @property({
    type: 'string',
    required: true,
  })
  lname: string;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'string',
    required: true,
  })
  phone: string;
  @property({
    type: 'string',
    required: true,
  })
  address: string;

  @property({
    type: 'string',
    required: true,
  })
  created: string;

  // has one relation to customer
  @hasOne(() => Customer)
  customer: Customer;

  // has one relation to role
  @hasOne(() => Role)
  role: Role;

  @property({
    type: 'string',
    required: true,
  })
  username: string;

  @property({
    type: 'string',
  })
  password?: string;

  @property({
    type: 'array',
    itemType: 'object',
  })
  permissions: UserPermission<string>[];

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
