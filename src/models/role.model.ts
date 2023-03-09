import {Entity, model, property} from '@loopback/repository';
import {Roles} from '../enums/roles';

@model()
export class Role extends Entity {
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
  name: string;

  @property({
    type: 'string',
    jsonSchema: {
      enum: Object.keys(Roles),
    },
    required: true,
  })
  key: string;

  @property({
    type: 'string',
  })
  description?: string;

  @property({
    type: 'number',
  })
  userId?: number;

  constructor(data?: Partial<Role>) {
    super(data);
  }
}

export interface RoleRelations {
  // describe navigational properties here
}

export type RoleWithRelations = Role & RoleRelations;
