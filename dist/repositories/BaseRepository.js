"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
class BaseRepository {
    constructor(model) {
        this.model = model;
    }
    async find(filter = {}, options = {}) {
        return this.model.find(filter, null, options).exec();
    }
    async findOne(filter) {
        return this.model.findOne(filter).exec();
    }
    async findById(id) {
        return this.model.findById(id).exec();
    }
    async create(data) {
        return this.model.create(data);
    }
    async updateById(id, update) {
        return this.model.findByIdAndUpdate(id, update, { new: true }).exec();
    }
    async updateMany(filter, update) {
        return this.model.updateMany(filter, update).exec();
    }
    async deleteById(id) {
        return this.model.findByIdAndDelete(id).exec();
    }
    async count(filter = {}) {
        return this.model.countDocuments(filter).exec();
    }
    async exists(filter) {
        const count = await this.model.countDocuments(filter).limit(1).exec();
        return count > 0;
    }
    async aggregate(pipeline) {
        return this.model.aggregate(pipeline).exec();
    }
}
exports.BaseRepository = BaseRepository;
//# sourceMappingURL=BaseRepository.js.map