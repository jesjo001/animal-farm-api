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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationController = void 0;
const tsyringe_1 = require("tsyringe");
const location_service_1 = require("../services/location.service");
const express_validator_1 = require("express-validator");
let LocationController = class LocationController {
    constructor(locationService) {
        this.locationService = locationService;
        this.createLocation = async (req, res, next) => {
            try {
                const locationData = (0, express_validator_1.matchedData)(req);
                const newLocation = await this.locationService.createLocation(req.tenantId, locationData);
                res.status(201).json({
                    message: 'Location created successfully',
                    data: newLocation,
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.getTenantLocations = async (req, res, next) => {
            try {
                const locations = await this.locationService.getLocationsByTenant(req.tenantId);
                res.status(200).json({
                    message: 'Locations fetched successfully',
                    data: locations,
                });
            }
            catch (error) {
                next(error);
            }
        };
    }
};
exports.LocationController = LocationController;
exports.LocationController = LocationController = __decorate([
    (0, tsyringe_1.singleton)(),
    __param(0, (0, tsyringe_1.inject)(location_service_1.LocationService)),
    __metadata("design:paramtypes", [location_service_1.LocationService])
], LocationController);
//# sourceMappingURL=location.controller.js.map