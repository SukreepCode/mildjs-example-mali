import { Module } from '@mildjs/core';
import { CriteriaController } from './criteria.controller';
import { CriteriaService } from './criteria.service';

@Module({
  controllers: [CriteriaController],
  providers: [CriteriaService],
})
export class CriteriaModule {}
