import { HttpException, Injectable } from '@mildjs/core';
import { InjectRepository } from '@mildjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';

import { isEmptyObject } from '../app/util';
import { CreateUserDto } from './dtos/users.dto';
import { UsersEntity } from './users.entity';
import { assignObject } from '../app/util';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(UsersEntity)
    private repository: Repository<UsersEntity>
  ) { }

  public findAll(): Promise<UsersEntity[]> {
    const users = this.repository.find();
    return users;
  }

  public async findById(id: number): Promise<UsersEntity> {
    const user: UsersEntity = await this.repository.findOne({ id });
    if (!user) throw new HttpException(409, `The user is not found`);
    return user;
  }

  public async findByEmail(username: string): Promise<UsersEntity> {
    const user: UsersEntity = await this.repository.findOne({ username });
    if (!user) throw new HttpException(409, `The user is not found`);
    return user;
  }

  public async create(userData: CreateUserDto): Promise<UsersEntity> {
    if (isEmptyObject(userData)) throw new HttpException(400, `The data is not 'CreateUserDto' type`);

    const findUser: UsersEntity = await this.repository.findOne({ username: userData.username });
    if (findUser) throw new HttpException(409, `You're username ${userData.username} already exists`);

    let user = assignObject(new UsersEntity(), userData);

    // Note: The password should be hashed from the client side
    return this.repository.save(user);
  }

  public async update(id: number, userData: CreateUserDto): Promise<UsersEntity> {
    if (isEmptyObject(userData)) throw new HttpException(400, `You're not userData`);

    const user: UsersEntity = await this.repository.findOne({ id });
    if (!user) throw new HttpException(409, `The user is not found`);

    // Note: The password should be hashed from the client side
    return this.repository.save(user);
  }

  public async delete(id: number): Promise<DeleteResult> {
    const user: UsersEntity = await this.repository.findOne({ id });
    if (!user) throw new HttpException(409, `You're not user`);

    return this.repository.delete({ id });
  }
}
