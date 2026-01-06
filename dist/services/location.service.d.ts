import { ILocation } from '../models/Location.model';
export declare const createLocation: (tenantId: string, locationData: Partial<ILocation>) => Promise<ILocation>;
export declare const getLocationsByTenant: (tenantId: string) => Promise<ILocation[]>;
//# sourceMappingURL=location.service.d.ts.map