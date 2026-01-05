import { LocationRepository } from '../repositories/LocationRepository';
import { ILocation } from '../models/Location.model';
export declare class LocationService {
    private readonly locationRepository;
    constructor(locationRepository: LocationRepository);
    createLocation(tenantId: string, locationData: Partial<ILocation>): Promise<ILocation>;
    getLocationsByTenant(tenantId: string): Promise<ILocation[]>;
}
//# sourceMappingURL=location.service.d.ts.map