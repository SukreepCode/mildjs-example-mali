import App from './app/app';
import { UserModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { IndexModule } from './index/index.module';

import { UsersEntity } from './users/users.entity';
import { EnrollEntity } from './enroll/enroll.entity';
import { SemestersEntity} from './semesters/semesters.entity';

import { TypeOrmModule } from '@mildjs/typeorm';

export const app = new App({
    imports: [
        TypeOrmModule.forRoot({
            name: 'default',
            type: 'sqlite',
            database: './app.sqlite',
            synchronize: true,
            entities: [UsersEntity, EnrollEntity, SemestersEntity],
        }),
        UserModule,
        AuthModule,
        IndexModule,
    ]
});

