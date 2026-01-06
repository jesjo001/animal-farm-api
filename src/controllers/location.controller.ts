import { Request, Response, NextFunction } from 'express';
import { createLocation as createLocationService, getLocationsByTenant } from '../services/location.service';
import { createLocationSchema } from '../utils/validators';

export const createLocation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    console.log('LocationController.createLocation called');
    const locationData = createLocationSchema.parse(req.body);

    console.log('Creating location with data:', locationData);
    console.log('Request tenantId:', req.tenantId);
    const newLocation = await createLocationService(req.tenantId!, locationData);
    res.status(201).json({
      message: 'Location created successfully',
      data: newLocation,
    });
  } catch (error) {
    console.error('Error creating location:', error);
    next(error);
  }
};

export const getTenantLocations = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const locations = await getLocationsByTenant(req.tenantId!);
    res.status(200).json({
      message: 'Locations fetched successfully',
      data: locations,
    });
  } catch (error) {
    next(error);
  }
};
