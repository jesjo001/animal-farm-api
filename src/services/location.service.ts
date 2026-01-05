import { LocationRepository } from '../repositories/LocationRepository';
import { container } from 'tsyringe';
import { ILocation } from '../models/Location.model';

const locationRepository = container.resolve(LocationRepository);

export const createLocation = async (tenantId: string, locationData: Partial<ILocation>): Promise<ILocation> => {
  try {
    console.log('LocationService.createLocation called with:', { tenantId, locationData });
    
    // Convert tenantId to ObjectId if needed
    const data = { 
      ...locationData, 
      tenantId: tenantId // Mongoose should handle string to ObjectId conversion
    };
    
    console.log('Creating location with final data:', data);
    
    const result = await locationRepository.create(data);
    
    console.log('Location created successfully:', result);
    
    return result;
  } catch (error) {
    console.error('Error in LocationService.createLocation:', error);
    throw error;
  }
};

export const getLocationsByTenant = async (tenantId: string): Promise<ILocation[]> => {
  return locationRepository.find({ tenantId });
};
