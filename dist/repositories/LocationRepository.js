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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationRepository = void 0;
const tsyringe_1 = require("tsyringe");
const Location_model_1 = require("../models/Location.model");
const BaseRepository_1 = require("./BaseRepository");
let LocationRepository = class LocationRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(Location_model_1.Location);
        console.log('LocationRepository initialized with model:', Location_model_1.Location.modelName);
    }
    async create(data) {
        console.log('LocationRepository.create called with:', data);
        try {
            const result = await super.create(data);
            console.log('LocationRepository.create result:', result);
            return result;
        }
        catch (error) {
            console.error('LocationRepository.create error:', error);
            throw error;
        }
    }
};
exports.LocationRepository = LocationRepository;
exports.LocationRepository = LocationRepository = __decorate([
    (0, tsyringe_1.singleton)(),
    __metadata("design:paramtypes", [])
], LocationRepository);
//# sourceMappingURL=LocationRepository.js.map