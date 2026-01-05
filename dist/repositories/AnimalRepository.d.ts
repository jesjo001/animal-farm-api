import { IAnimal } from '../models/Animal.model';
import { BaseRepository } from './BaseRepository';
export declare class AnimalRepository extends BaseRepository<IAnimal> {
    constructor();
    findByTagNumber(tenantId: string, tagNumber: string): Promise<IAnimal | null>;
    findByType(tenantId: string, type: string): Promise<IAnimal[]>;
    findByHealthStatus(tenantId: string, healthStatus: string): Promise<IAnimal[]>;
    softDelete(id: string): Promise<IAnimal | null>;
    addWeightRecord(animalId: string, weight: number, measuredBy: string): Promise<IAnimal | null>;
    getWeightHistory(animalId: string): Promise<IAnimal['weightHistory']>;
}
//# sourceMappingURL=AnimalRepository.d.ts.map