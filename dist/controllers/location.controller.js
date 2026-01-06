"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTenantLocations = exports.createLocation = void 0;
const location_service_1 = require("../services/location.service");
const validators_1 = require("../utils/validators");
const createLocation = async (req, res, next) => {
    try {
        console.log('LocationController.createLocation called');
        const locationData = validators_1.createLocationSchema.parse(req.body);
        console.log('Creating location with data:', locationData);
        console.log('Request tenantId:', req.tenantId);
        const newLocation = await (0, location_service_1.createLocation)(req.tenantId, locationData);
        res.status(201).json({
            message: 'Location created successfully',
            data: newLocation,
        });
    }
    catch (error) {
        console.error('Error creating location:', error);
        next(error);
    }
};
exports.createLocation = createLocation;
const getTenantLocations = async (req, res, next) => {
    try {
        const locations = await (0, location_service_1.getLocationsByTenant)(req.tenantId);
        res.status(200).json({
            message: 'Locations fetched successfully',
            data: locations,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getTenantLocations = getTenantLocations;
//# sourceMappingURL=location.controller.js.map