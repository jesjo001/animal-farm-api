import { Request, Response, NextFunction } from 'express';
import { LocationService } from '../services/location.service';
export declare class LocationController {
    private readonly locationService;
    constructor(locationService: LocationService);
    createLocation: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getTenantLocations: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=location.controller.d.ts.map