"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Location = void 0;
const mongoose_1 = require("mongoose");
const LocationSchema = new mongoose_1.Schema({
    tenantId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Tenant',
        required: true,
        index: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50,
    },
    type: {
        type: String,
        required: true,
        enum: ['barn', 'pen', 'field', 'coop', 'stable'],
    },
    capacity: {
        type: Number,
        required: true,
        min: 1,
    },
    description: {
        type: String,
        trim: true,
        maxlength: 200,
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        },
    },
    toObject: { virtuals: true },
});
exports.Location = (0, mongoose_1.model)('Location', LocationSchema);
//# sourceMappingURL=Location.model.js.map