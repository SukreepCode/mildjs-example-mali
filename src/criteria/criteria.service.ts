
import { Repository, DeleteResult } from 'typeorm';
import { CriteriaEntity } from './criteria.entity';
import { HttpException, Injectable } from '@mildjs/core';
import { InjectRepository } from '@mildjs/typeorm';

@Injectable()
export class CriteriaService {

  constructor(
    @InjectRepository(CriteriaEntity)
    private readonly repo: Repository<CriteriaEntity>,
  ) { }

  async createOrUpdate(item: CriteriaEntity): Promise<CriteriaEntity> {
    return await this.repo.save(item);
  }

  async findById(id: number): Promise<CriteriaEntity> {
    return await this.repo.findOne({ id });
  }

  async findAll(): Promise<CriteriaEntity[]> {
    return await this.repo.find();
  }

  async delete(id: number): Promise<DeleteResult> {
    return await this.repo.delete({ id });
  }
}