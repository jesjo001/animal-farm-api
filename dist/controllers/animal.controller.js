"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAnimalStats = exports.getWeightHistory = exports.addWeightRecord = exports.deleteAnimal = exports.updateAnimal = exports.createAnimal = exports.getAnimal = exports.getAnimals = void 0;
const animal_service_1 = require("../services/animal.service");
const tsyringe_1 = require("tsyringe");
const validators_1 = require("../utils/validators");
const pagination_util_1 = require("../utils/pagination.util");
const animalService = tsyringe_1.container.resolve(animal_service_1.AnimalService);
const getAnimals = async (req, res, next) => {
    try {
        const options = (0, pagination_util_1.getPaginationOptions)(req.query);
        const filters = { tenantId: req.tenantId, isActive: true };
        if (req.query.type)
            filters.type = req.query.type;
        if (req.query.location)
            filters.location = req.query.location;
        if (req.query.healthStatus)
            filters.healthStatus = req.query.healthStatus;
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
    }
    catch (error) {
        next(error);
    }
};
exports.getAnimals = getAnimals;
const getAnimal = async (req, res, next) => {
    try {
        const animal = await animalService.getAnimalById(req.params.id, req.tenantId);
        res.json({
            success: true,
            data: animal,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAnimal = getAnimal;
const createAnimal = async (req, res, next) => {
    try {
        const data = validators_1.createAnimalSchema.parse(req.body);
        const animal = await animalService.createAnimal(data, req.tenantId, req.user._id.toString());
        res.status(201).json({
            success: true,
            message: 'Animal created successfully',
            data: animal,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createAnimal = createAnimal;
const updateAnimal = async (req, res, next) => {
    try {
        const data = req.body;
        const animal = await animalService.updateAnimal(req.params.id, data, req.tenantId, req.user._id.toString());
        res.json({
            success: true,
            message: 'Animal updated successfully',
            data: animal,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateAnimal = updateAnimal;
const deleteAnimal = async (req, res, next) => {
    try {
        await animalService.deleteAnimal(req.params.id, req.tenantId, req.user._id.toString());
        res.json({
            success: true,
            message: 'Animal deleted successfully',
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteAnimal = deleteAnimal;
const addWeightRecord = async (req, res, next) => {
    try {
        const { weight } = req.body;
        const animal = await animalService.addWeightRecord(req.params.id, weight, req.tenantId, req.user._id.toString());
        res.json({
            success: true,
            message: 'Weight record added successfully',
            data: animal,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.addWeightRecord = addWeightRecord;
const getWeightHistory = async (req, res, next) => {
    try {
        const history = await animalService.getWeightHistory(req.params.id, req.tenantId);
        res.json({
            success: true,
            data: history,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getWeightHistory = getWeightHistory;
const getAnimalStats = async (req, res, next) => {
    try {
        const stats = await animalService.getAnimalStats(req.tenantId);
        res.json({
            success: true,
            data: stats,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAnimalStats = getAnimalStats;
//# sourceMappingURL=animal.controller.js.map