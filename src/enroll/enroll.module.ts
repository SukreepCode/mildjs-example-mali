import { Module } from '@mildjs/core';
import { EnrollController } from './enroll.controller';
import { EnrollService } from './enroll.service';

@Module({
  controllers: [EnrollController],
  providers: [EnrollService],
})
export class EnrollModule {}
