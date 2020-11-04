import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Repository, DeleteResult } from 'typeorm';
import { EnrollEntity } from './enroll.entity';

@Service()
export class EnrollService {
  constructor(
    @InjectRepository(EnrollEntity)
    private readonly repo: Repository<EnrollEntity>,
  ) {}

  async createOrUpdate(item: EnrollEntity): Promise<EnrollEntity> {
    return await this.repo.save(item);
  }

  async findById(id: number): Promise<EnrollEntity> {
    return await this.repo.findOne({ id });
  }

  async findAll(): Promise<EnrollEntity[]> {
    return await this.repo.find();
  }

  async delete(id: number): Promise<DeleteResult> {
    return await this.repo.delete({ id });
  }
}