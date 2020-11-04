import { Module } from '@mildjs/core';
import { SemestersController } from './semesters.controller';
import { SemestersService } from './semesters.service';
import { SemestersEntity } from './semesters.entity';

@Module({
  controllers: [SemestersController],
  providers: [SemestersService],
})
export class SemestersModule {}
