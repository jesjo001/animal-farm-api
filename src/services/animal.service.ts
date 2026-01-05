import { singleton, inject } from 'tsyringe';
import mongoose from 'mongoose';
import { AnimalRepository } from '../repositories/AnimalRepository';
import { AuditService } from './audit.service';
import { CreateAnimalDTO, PaginationOptions, PaginatedResponse } from '../types';
import { ConflictError, NotFoundError } from '../utils/errors';
import { getPaginationOptions, createPaginatedResponse } from '../utils/pagination.util';

@singleton()
export class AnimalService {
  constructor(
    @inject(AnimalRepository) private animalRepository: AnimalRepository,
    @inject(AuditService) private auditService: AuditService
  ) {}

  async getAnimals(
    filters: any,
    options: PaginationOptions
  ): Promise<PaginatedResponse<any>> {
    const { page, limit } = options;
    const skip = (page - 1) * limit;

    const [animals, total] = await Promise.all([
      this.animalRepository.find(filters, { skip, limit, sort: { createdAt: -1 } }),
      this.animalRepository.count(filters),
    ]);

    return createPaginatedResponse(animals, total, options);
  }

  async getAnimalById(id: string, tenantId: string): Promise<any> {
    const animal = await this.animalRepository.findOne({ _id: id, tenantId, isActive: true });
    if (!animal) {
      throw new NotFoundError('Animal not found');
    }
    return animal;
  }

  async createAnimal(data: CreateAnimalDTO, tenantId: string, userId: string): Promise<any> {
    // Check if tag number is unique within tenant
    const existingAnimal = await this.animalRepository.findByTagNumber(tenantId, data.tagNumber);
    if (existingAnimal) {
      throw new ConflictError('Tag number already exists');
    }

    const animal = await this.animalRepository.create({
      ...data,
      tenantId: new mongoose.Types.ObjectId(tenantId),
      createdBy: new mongoose.Types.ObjectId(userId),
    });

    // Create audit log
    await this.auditService.logActivity(
      tenantId,
      userId,
      'create',
      'animal',
      animal._id.toString(),
      undefined,
      data
    );

    return animal;
  }

  async updateAnimal(id: string, data: Partial<CreateAnimalDTO>, tenantId: string, userId: string): Promise<any> {
    const animal = await this.getAnimalById(id, tenantId);

    // Check tag number uniqueness if updating
    if (data.tagNumber && data.tagNumber !== animal.tagNumber) {
      const existingAnimal = await this.animalRepository.findByTagNumber(tenantId, data.tagNumber);
      if (existingAnimal) {
        throw new ConflictError('Tag number already exists');
      }
    }

    const oldValues = { ...animal.toObject() };
    const updatedAnimal = await this.animalRepository.updateById(id, data);

    // Create audit log
    await this.auditService.logActivity(
      tenantId,
      userId,
      'update',
      'animal',
      id,
      oldValues,
      data
    );

    return updatedAnimal;
  }

  async deleteAnimal(id: string, tenantId: string, userId: string): Promise<void> {
    const animal = await this.getAnimalById(id, tenantId);

    await this.animalRepository.softDelete(id);

    // Create audit log
    await this.auditService.logActivity(
      tenantId,
      userId,
      'delete',
      'animal',
      id,
      animal.toObject()
    );
  }

  async addWeightRecord(animalId: string, weight: number, tenantId: string, userId: string): Promise<any> {
    const animal = await this.getAnimalById(animalId, tenantId);

    const updatedAnimal = await this.animalRepository.addWeightRecord(animalId, weight, userId);

    if (!updatedAnimal) {
      throw new NotFoundError('Animal not found after update');
    }

    // Create audit log
    await this.auditService.logActivity(
      tenantId,
      userId,
      'update',
      'animal',
      animalId,
      { weightHistory: animal.weightHistory },
      { weightHistory: updatedAnimal.weightHistory }
    );

    return updatedAnimal;
  }

  async getWeightHistory(animalId: string, tenantId: string): Promise<any[]> {
    await this.getAnimalById(animalId, tenantId); // Verify animal exists
    return this.animalRepository.getWeightHistory(animalId);
  }

  async getAnimalStats(tenantId: string): Promise<any> {
    const [totalAnimals, healthyCount, sickCount, deceasedCount] = await Promise.all([
      this.animalRepository.count({ tenantId, isActive: true }),
      this.animalRepository.count({ tenantId, healthStatus: 'healthy', isActive: true }),
      this.animalRepository.count({ tenantId, healthStatus: 'sick', isActive: true }),
      this.animalRepository.count({ tenantId, healthStatus: 'deceased', isActive: true }),
    ]);

    return {
      total: totalAnimals,
      healthy: healthyCount,
      sick: sickCount,
      deceased: deceasedCount,
      healthyPercentage: totalAnimals > 0 ? (healthyCount / totalAnimals * 100).toFixed(2) : 0,
    };
  }
}