import { singleton, inject } from 'tsyringe';
import { BaseRepository } from '../repositories/BaseRepository';

@singleton()
export class TenantService {
  constructor(
    @inject('TenantRepository') private tenantRepository: BaseRepository<any>
  ) {}

  async createTenant(data: any) {
    // Implementation for creating tenant
    return this.tenantRepository.create(data);
  }

  async getTenantById(id: string) {
    return this.tenantRepository.findById(id);
  }

  async updateTenant(id: string, data: any) {
    return this.tenantRepository.updateById(id, data);
  }

  // Add other tenant-related methods
}
