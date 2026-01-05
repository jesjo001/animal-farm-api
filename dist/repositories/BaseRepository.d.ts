import { Model, Document, FilterQuery, UpdateQuery, QueryOptions } from 'mongoose';
export declare class BaseRepository<T extends Document> {
    protected model: Model<T>;
    constructor(model: Model<T>);
    find(filter?: FilterQuery<T>, options?: QueryOptions): Promise<T[]>;
    findOne(filter: FilterQuery<T>): Promise<T | null>;
    findById(id: string): Promise<T | null>;
    create(data: Partial<T>): Promise<T>;
    updateById(id: string, update: UpdateQuery<T>): Promise<T | null>;
    updateMany(filter: FilterQuery<T>, update: UpdateQuery<T>): Promise<import("mongoose").UpdateWriteOpResult>;
    deleteById(id: string): Promise<T | null>;
    count(filter?: FilterQuery<T>): Promise<number>;
    exists(filter: FilterQuery<T>): Promise<boolean>;
    aggregate(pipeline: any[]): Promise<any[]>;
}
//# sourceMappingURL=BaseRepository.d.ts.map