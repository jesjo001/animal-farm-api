import { z } from 'zod';

// Animal validation schemas
export const createAnimalSchema = z.object({
  tagNumber: z.string().min(1, 'Tag number is required'),
  breed: z.string().min(1, 'Breed is required'),
  type: z.string().min(1, 'Type is required'),
  birthDate: z.string().transform((str) => new Date(str)),
  gender: z.enum(['male', 'female']),
  location: z.string().optional(),
  healthStatus: z.enum(['healthy', 'sick', 'injured', 'deceased']).optional(),
  weight: z.number().positive().optional(),
  notes: z.string().optional(),
});

// Production validation schemas
export const createProductionSchema = z.object({
  date: z.string().transform((str) => new Date(str)),
  totalEggs: z.number().int().min(0),
  gradeBreakdown: z.object({
    gradeA: z.number().int().min(0),
    gradeB: z.number().int().min(0),
    gradeC: z.number().int().min(0),
    broken: z.number().int().min(0),
  }),
  notes: z.string().optional(),
});

// Event validation schemas
export const createEventSchema = z.object({
  eventType: z.enum(['birth', 'death', 'vet_visit', 'vaccination', 'other']),
  date: z.string().transform((str) => new Date(str)),
  animalId: z.string().optional(),
  count: z.number().int().min(1).optional(),
  description: z.string().optional(),
  cost: z.number().positive().optional(),
});

// Location validation schemas
export const createLocationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.enum(['barn', 'pen', 'field', 'coop', 'stable'], { required_error: 'Invalid location type' }),
  capacity: z.number().int().positive('Capacity must be a positive number'),
  description: z.string().optional(),
});

// Auth validation schemas
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const registerSchema = z.object({
  farmName: z.string().min(1),
  ownerName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(6),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  newPassword: z.string().min(6),
});