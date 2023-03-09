import {Entity, model, property, hasOne} from '@loopback/repository';
import {Customer} from './customer.model';
import {Role} from './role.model';

@model()
export class User extends Entity {
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

  @hasOne(() => Customer)
  customer: Customer;

  @hasOne(() => Role)
  role: Role;

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
