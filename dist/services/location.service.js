"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLocationsByTenant = exports.createLocation = void 0;
const LocationRepository_1 = require("../repositories/LocationRepository");
const tsyringe_1 = require("tsyringe");
const mongoose_1 = require("mongoose");
const locationRepository = tsyringe_1.container.resolve(LocationRepository_1.LocationRepository);
const createLocation = async (tenantId, locationData) => {
    try {
        console.log('LocationService.createLocation called with:', { tenantId, locationData });
        // Convert tenantId to ObjectId if needed
        const data = {
            ...locationData,
            tenantId: new mongoose_1.Types.ObjectId(tenantId) // Convert string to ObjectId
        };
        console.log('Creating location with final data:', data);
        const result = await locationRepository.create(data);
        console.log('Location created successfully:', result);
        return result;
    }
    catch (error) {
        console.error('Error in LocationService.createLocation:', error);
        throw error;
    }
};
exports.createLocation = createLocation;
const getLocationsByTenant = async (tenantId) => {
    return locationRepository.find({ tenantId });
};
exports.getLocationsByTenant = getLocationsByTenant;
//# sourceMappingURL=location.service.js.map