"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordSchema = exports.changePasswordSchema = exports.registerSchema = exports.loginSchema = exports.createLocationSchema = exports.createEventSchema = exports.createProductionSchema = exports.createAnimalSchema = void 0;
const zod_1 = require("zod");
// Animal validation schemas
exports.createAnimalSchema = zod_1.z.object({
    tagNumber: zod_1.z.string().min(1, 'Tag number is required'),
    breed: zod_1.z.string().min(1, 'Breed is required'),
    type: zod_1.z.string().min(1, 'Type is required'),
    birthDate: zod_1.z.string().transform((str) => new Date(str)),
    gender: zod_1.z.enum(['male', 'female']),
    location: zod_1.z.string().optional(),
    healthStatus: zod_1.z.enum(['healthy', 'sick', 'injured', 'deceased']).optional(),
    weight: zod_1.z.number().positive().optional(),
    notes: zod_1.z.string().optional(),
});
// Production validation schemas
exports.createProductionSchema = zod_1.z.object({
    date: zod_1.z.string().transform((str) => new Date(str)),
    totalEggs: zod_1.z.number().int().min(0),
    gradeBreakdown: zod_1.z.object({
        gradeA: zod_1.z.number().int().min(0),
        gradeB: zod_1.z.number().int().min(0),
        gradeC: zod_1.z.number().int().min(0),
        broken: zod_1.z.number().int().min(0),
    }),
    notes: zod_1.z.string().optional(),
});
// Event validation schemas
exports.createEventSchema = zod_1.z.object({
    eventType: zod_1.z.enum(['birth', 'death', 'vet_visit', 'vaccination', 'other']),
    date: zod_1.z.string().transform((str) => new Date(str)),
    animalId: zod_1.z.string().optional(),
    count: zod_1.z.number().int().min(1).optional(),
    description: zod_1.z.string().optional(),
    cost: zod_1.z.number().positive().optional(),
});
// Location validation schemas
exports.createLocationSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name is required'),
    type: zod_1.z.enum(['barn', 'pen', 'field', 'coop', 'stable'], { required_error: 'Invalid location type' }),
    capacity: zod_1.z.number().int().positive('Capacity must be a positive number'),
    description: zod_1.z.string().optional(),
});
// Auth validation schemas
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
});
exports.registerSchema = zod_1.z.object({
    farmName: zod_1.z.string().min(1),
    ownerName: zod_1.z.string().min(1),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
    phone: zod_1.z.string().optional(),
    address: zod_1.z.string().optional(),
});
exports.changePasswordSchema = zod_1.z.object({
    currentPassword: zod_1.z.string().min(1),
    newPassword: zod_1.z.string().min(6),
});
exports.resetPasswordSchema = zod_1.z.object({
    token: zod_1.z.string().min(1),
    newPassword: zod_1.z.string().min(6),
});
//# sourceMappingURL=validators.js.map