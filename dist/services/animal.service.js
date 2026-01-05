"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnimalService = void 0;
const tsyringe_1 = require("tsyringe");
const mongoose_1 = __importDefault(require("mongoose"));
const AnimalRepository_1 = require("../repositories/AnimalRepository");
const audit_service_1 = require("./audit.service");
const errors_1 = require("../utils/errors");
const pagination_util_1 = require("../utils/pagination.util");
let AnimalService = class AnimalService {
    constructor(animalRepository, auditService) {
        this.animalRepository = animalRepository;
        this.auditService = auditService;
    }
    async getAnimals(filters, options) {
        const { page, limit } = options;
        const skip = (page - 1) * limit;
        const [animals, total] = await Promise.all([
            this.animalRepository.find(filters, { skip, limit, sort: { createdAt: -1 } }),
            this.animalRepository.count(filters),
        ]);
        return (0, pagination_util_1.createPaginatedResponse)(animals, total, options);
    }
    async getAnimalById(id, tenantId) {
        const animal = await this.animalRepository.findOne({ _id: id, tenantId, isActive: true });
        if (!animal) {
            throw new errors_1.NotFoundError('Animal not found');
        }
        return animal;
    }
    async createAnimal(data, tenantId, userId) {
        // Check if tag number is unique within tenant
        const existingAnimal = await this.animalRepository.findByTagNumber(tenantId, data.tagNumber);
        if (existingAnimal) {
            throw new errors_1.ConflictError('Tag number already exists');
        }
        const animal = await this.animalRepository.create({
            ...data,
            tenantId: new mongoose_1.default.Types.ObjectId(tenantId),
            createdBy: new mongoose_1.default.Types.ObjectId(userId),
        });
        // Create audit log
        await this.auditService.logActivity(tenantId, userId, 'create', 'animal', animal._id.toString(), undefined, data);
        return animal;
    }
    async updateAnimal(id, data, tenantId, userId) {
        const animal = await this.getAnimalById(id, tenantId);
        // Check tag number uniqueness if updating
        if (data.tagNumber && data.tagNumber !== animal.tagNumber) {
            const existingAnimal = await this.animalRepository.findByTagNumber(tenantId, data.tagNumber);
            if (existingAnimal) {
                throw new errors_1.ConflictError('Tag number already exists');
            }
        }
        const oldValues = { ...animal.toObject() };
        const updatedAnimal = await this.animalRepository.updateById(id, data);
        // Create audit log
        await this.auditService.logActivity(tenantId, userId, 'update', 'animal', id, oldValues, data);
        return updatedAnimal;
    }
    async deleteAnimal(id, tenantId, userId) {
        const animal = await this.getAnimalById(id, tenantId);
        await this.animalRepository.softDelete(id);
        // Create audit log
        await this.auditService.logActivity(tenantId, userId, 'delete', 'animal', id, animal.toObject());
    }
    async addWeightRecord(animalId, weight, tenantId, userId) {
        const animal = await this.getAnimalById(animalId, tenantId);
        const updatedAnimal = await this.animalRepository.addWeightRecord(animalId, weight, userId);
        if (!updatedAnimal) {
            throw new errors_1.NotFoundError('Animal not found after update');
        }
        // Create audit log
        await this.auditService.logActivity(tenantId, userId, 'update', 'animal', animalId, { weightHistory: animal.weightHistory }, { weightHistory: updatedAnimal.weightHistory });
        return updatedAnimal;
    }
    async getWeightHistory(animalId, tenantId) {
        await this.getAnimalById(animalId, tenantId); // Verify animal exists
        return this.animalRepository.getWeightHistory(animalId);
    }
    async getAnimalStats(tenantId) {
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
};
exports.AnimalService = AnimalService;
exports.AnimalService = AnimalService = __decorate([
    (0, tsyringe_1.singleton)(),
    __param(0, (0, tsyringe_1.inject)(AnimalRepository_1.AnimalRepository)),
    __param(1, (0, tsyringe_1.inject)(audit_service_1.AuditService)),
    __metadata("design:paramtypes", [AnimalRepository_1.AnimalRepository,
        audit_service_1.AuditService])
], AnimalService);
//# sourceMappingURL=animal.service.js.map