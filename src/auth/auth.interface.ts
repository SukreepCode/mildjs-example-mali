import { Request } from 'express';
import { UsersEntity } from '../users/users.entity';

export interface DataStoredInToken {
  id: number;
}

export interface TokenData {
  token: string;
  expiresIn: number;
}

export interface RequestWithUser extends Request {
  user: UsersEntity;
}
