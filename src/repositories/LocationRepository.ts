import { singleton } from 'tsyringe';
import { Location, ILocation } from '../models/Location.model';
import { BaseRepository } from './BaseRepository';

@singleton()
export class LocationRepository extends BaseRepository<ILocation> {
  constructor() {
    super(Location);
    console.log('LocationRepository initialized with model:', Location.modelName);
  }

  async create(data: Partial<ILocation>): Promise<ILocation> {
    console.log('LocationRepository.create called with:', data);
    try {
      const result = await super.create(data);
      console.log('LocationRepository.create result:', result);
      return result;
    } catch (error) {
      console.error('LocationRepository.create error:', error);
      throw error;
    }
  }
}
