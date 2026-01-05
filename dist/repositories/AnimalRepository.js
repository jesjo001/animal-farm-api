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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnimalRepository = void 0;
const tsyringe_1 = require("tsyringe");
const Animal_model_1 = __importDefault(require("../models/Animal.model"));
const BaseRepository_1 = require("./BaseRepository");
let AnimalRepository = class AnimalRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(Animal_model_1.default);
    }
    async findByTagNumber(tenantId, tagNumber) {
        return this.findOne({ tenantId, tagNumber });
    }
    async findByType(tenantId, type) {
        return this.find({ tenantId, type, isActive: true });
    }
    async findByHealthStatus(tenantId, healthStatus) {
        return this.find({ tenantId, healthStatus, isActive: true });
    }
    async softDelete(id) {
        return this.updateById(id, { isActive: false });
    }
    async addWeightRecord(animalId, weight, measuredBy) {
        return this.model.findByIdAndUpdate(animalId, {
            $set: { weight },
            $push: {
                weightHistory: {
                    weight,
                    date: new Date(),
                    measuredBy,
                },
            },
        }, { new: true }).exec();
    }
    async getWeightHistory(animalId) {
        const animal = await this.model.findById(animalId).select('weightHistory').exec();
        return animal?.weightHistory || [];
    }
};
exports.AnimalRepository = AnimalRepository;
exports.AnimalRepository = AnimalRepository = __decorate([
    (0, tsyringe_1.singleton)(),
    __metadata("design:paramtypes", [])
], AnimalRepository);
//# sourceMappingURL=AnimalRepository.js.map