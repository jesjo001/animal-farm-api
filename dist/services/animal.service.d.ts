import { AnimalRepository } from '../repositories/AnimalRepository';
import { AuditService } from './audit.service';
import { CreateAnimalDTO, PaginationOptions, PaginatedResponse } from '../types';
export declare class AnimalService {
    private animalRepository;
    private auditService;
    constructor(animalRepository: AnimalRepository, auditService: AuditService);
    getAnimals(filters: any, options: PaginationOptions): Promise<PaginatedResponse<any>>;
    getAnimalById(id: string, tenantId: string): Promise<any>;
    createAnimal(data: CreateAnimalDTO, tenantId: string, userId: string): Promise<any>;
    updateAnimal(id: string, data: Partial<CreateAnimalDTO>, tenantId: string, userId: string): Promise<any>;
    deleteAnimal(id: string, tenantId: string, userId: string): Promise<void>;
    addWeightRecord(animalId: string, weight: number, tenantId: string, userId: string): Promise<any>;
    getWeightHistory(animalId: string, tenantId: string): Promise<any[]>;
    getAnimalStats(tenantId: string): Promise<any>;
}
//# sourceMappingURL=animal.service.d.ts.map