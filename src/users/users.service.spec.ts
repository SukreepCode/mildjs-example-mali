import { assignObject } from '@mildjs/core';
import { UsersService } from './users.service';
import { UsersEntity } from './users.entity';
import { Repository } from 'typeorm';
import { MockRepository } from '../app/test';

const userData = assignObject(new UsersEntity(), {
    id: 1,
    username: 'thada',
    password: 'aaa'
});

const allUserData: UsersEntity[] = [userData];

describe('Test Module: Providers', () => {
    let service: UsersService;

    beforeEach(async () => {
        service = new UsersService(new MockRepository<UsersEntity>(allUserData));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should be findAll', () => {
        expect(service.findAll()).resolves.toBe(allUserData);
    });

});