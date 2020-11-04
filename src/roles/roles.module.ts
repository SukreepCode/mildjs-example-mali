import { Module } from '@mildjs/core';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';


@Module({
  controllers: [RolesController],
  providers: [RolesService],
})
export class RolesModule {}
