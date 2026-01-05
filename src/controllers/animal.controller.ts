import { Request, Response, NextFunction } from 'express';
import { AnimalService } from '../services/animal.service';
import { container } from 'tsyringe';
import { createAnimalSchema } from '../utils/validators';
import { getPaginationOptions } from '../utils/pagination.util';

const animalService = container.resolve(AnimalService);

export const getAnimals = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const options = getPaginationOptions(req.query);
    const filters: any = { tenantId: req.tenantId, isActive: true };

    if (req.query.type) filters.type = req.query.type;
    if (req.query.location) filters.location = req.query.location;
    if (req.query.healthStatus) filters.healthStatus = req.query.healthStatus;
    if (req.query.search) {
      filters.$or = [
        { tagNumber: { $regex: req.query.search, $options: 'i' } },
        { breed: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const result = await animalService.getAnimals(filters, options);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getAnimal = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const animal = await animalService.getAnimalById(req.params.id, req.tenantId!);

    res.json({
      success: true,
      data: animal,
    });
  } catch (error) {
    next(error);
  }
};

export const createAnimal = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = createAnimalSchema.parse(req.body);
    const animal = await animalService.createAnimal(data, req.tenantId!, req.user!._id.toString());

    res.status(201).json({
      success: true,
      message: 'Animal created successfully',
      data: animal,
    });
  } catch (error) {
    next(error);
  }
};

export const updateAnimal = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body;
    const animal = await animalService.updateAnimal(
      req.params.id,
      data,
      req.tenantId!,
      req.user!._id.toString()
    );

    res.json({
      success: true,
      message: 'Animal updated successfully',
      data: animal,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAnimal = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await animalService.deleteAnimal(req.params.id, req.tenantId!, req.user!._id.toString());

    res.json({
      success: true,
      message: 'Animal deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const addWeightRecord = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { weight } = req.body;
    const animal = await animalService.addWeightRecord(
      req.params.id,
      weight,
      req.tenantId!,
      req.user!._id.toString()
    );

    res.json({
      success: true,
      message: 'Weight record added successfully',
      data: animal,
    });
  } catch (error) {
    next(error);
  }
};

export const getWeightHistory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const history = await animalService.getWeightHistory(req.params.id, req.tenantId!);

    res.json({
      success: true,
      data: history,
    });
  } catch (error) {
    next(error);
  }
};

export const getAnimalStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = await animalService.getAnimalStats(req.tenantId!);

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};