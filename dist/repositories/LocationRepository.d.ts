import { ILocation } from '../models/Location.model';
import { BaseRepository } from './BaseRepository';
export declare class LocationRepository extends BaseRepository<ILocation> {
    constructor();
    create(data: Partial<ILocation>): Promise<ILocation>;
}
//# sourceMappingURL=LocationRepository.d.ts.map