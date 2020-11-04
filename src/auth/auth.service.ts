import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { CreateUserDto } from '../users/dtos/users.dto';
import { Repository, InjectRepository, Service, Container } from 'typeorm-di';
import { HttpException } from '@mildjs/core';
import { DataStoredInToken, TokenData } from './auth.interface';
import { UsersEntity } from '../users/users.entity';
import { vars } from '../app/config';

@Service()
export class AuthService {
  public async login(user: UsersEntity): Promise<{ token: string; user: UsersEntity }> {
    const token = this.createToken(user).token;
    return { token, user };
  }

  public createToken(user: UsersEntity): TokenData {
    const dataStoredInToken: DataStoredInToken = { id: user.id };
    const secret: string = vars.jwtSecret;
    const expiresIn: number = vars.jwtExpirationInterval * 60;

    const JWTtoken = jwt.sign(dataStoredInToken, secret, { expiresIn });

    return { expiresIn, token: JWTtoken };
  }
}
