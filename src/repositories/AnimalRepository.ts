import { singleton } from 'tsyringe';
import Animal, { IAnimal } from '../models/Animal.model';
import { BaseRepository } from './BaseRepository';

@singleton()
export class AnimalRepository extends BaseRepository<IAnimal> {
  constructor() {
    super(Animal);
  }

  async findByTagNumber(tenantId: string, tagNumber: string): Promise<IAnimal | null> {
    return this.findOne({ tenantId, tagNumber });
  }

  async findByType(tenantId: string, type: string): Promise<IAnimal[]> {
    return this.find({ tenantId, type, isActive: true });
  }

  async findByHealthStatus(tenantId: string, healthStatus: string): Promise<IAnimal[]> {
    return this.find({ tenantId, healthStatus, isActive: true });
  }

  async softDelete(id: string): Promise<IAnimal | null> {
    return this.updateById(id, { isActive: false });
  }

  async addWeightRecord(animalId: string, weight: number, measuredBy: string): Promise<IAnimal | null> {
    return this.model.findByIdAndUpdate(
      animalId,
      {
        $set: { weight },
        $push: {
          weightHistory: {
            weight,
            date: new Date(),
            measuredBy,
          },
        },
      },
      { new: true }
    ).exec();
  }

  async getWeightHistory(animalId: string): Promise<IAnimal['weightHistory']> {
    const animal = await this.model.findById(animalId).select('weightHistory').exec();
    return animal?.weightHistory || [];
  }
}