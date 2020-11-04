import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Repository, DeleteResult } from 'typeorm';
import { RolesEntity } from './roles.entity';

@Service()
export class RolesService {
  constructor(
    @InjectRepository(RolesEntity)
    private readonly repo: Repository<RolesEntity>,
  ) {}

  async createOrUpdate(item: RolesEntity): Promise<RolesEntity> {
    return await this.repo.save(item);
  }

  async findById(id: string): Promise<RolesEntity> {
    return await this.repo.findOne({ id });
  }

  async findAll(): Promise<RolesEntity[]> {
    return await this.repo.find();
  }

  async delete(id: string): Promise<DeleteResult> {
    return await this.repo.delete({ id });
  }
}