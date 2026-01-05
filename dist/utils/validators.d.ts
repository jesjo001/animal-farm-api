import { z } from 'zod';
export declare const createAnimalSchema: z.ZodObject<{
    tagNumber: z.ZodString;
    breed: z.ZodString;
    type: z.ZodString;
    birthDate: z.ZodEffects<z.ZodString, Date, string>;
    gender: z.ZodEnum<["male", "female"]>;
    location: z.ZodOptional<z.ZodString>;
    healthStatus: z.ZodOptional<z.ZodEnum<["healthy", "sick", "injured", "deceased"]>>;
    weight: z.ZodOptional<z.ZodNumber>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    type: string;
    tagNumber: string;
    breed: string;
    birthDate: Date;
    gender: "male" | "female";
    location?: string | undefined;
    healthStatus?: "healthy" | "sick" | "injured" | "deceased" | undefined;
    weight?: number | undefined;
    notes?: string | undefined;
}, {
    type: string;
    tagNumber: string;
    breed: string;
    birthDate: string;
    gender: "male" | "female";
    location?: string | undefined;
    healthStatus?: "healthy" | "sick" | "injured" | "deceased" | undefined;
    weight?: number | undefined;
    notes?: string | undefined;
}>;
export declare const createProductionSchema: z.ZodObject<{
    date: z.ZodEffects<z.ZodString, Date, string>;
    totalEggs: z.ZodNumber;
    gradeBreakdown: z.ZodObject<{
        gradeA: z.ZodNumber;
        gradeB: z.ZodNumber;
        gradeC: z.ZodNumber;
        broken: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        gradeA: number;
        gradeB: number;
        gradeC: number;
        broken: number;
    }, {
        gradeA: number;
        gradeB: number;
        gradeC: number;
        broken: number;
    }>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    date: Date;
    totalEggs: number;
    gradeBreakdown: {
        gradeA: number;
        gradeB: number;
        gradeC: number;
        broken: number;
    };
    notes?: string | undefined;
}, {
    date: string;
    totalEggs: number;
    gradeBreakdown: {
        gradeA: number;
        gradeB: number;
        gradeC: number;
        broken: number;
    };
    notes?: string | undefined;
}>;
export declare const createEventSchema: z.ZodObject<{
    eventType: z.ZodEnum<["birth", "death", "vet_visit", "vaccination", "other"]>;
    date: z.ZodEffects<z.ZodString, Date, string>;
    animalId: z.ZodOptional<z.ZodString>;
    count: z.ZodOptional<z.ZodNumber>;
    description: z.ZodOptional<z.ZodString>;
    cost: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    date: Date;
    eventType: "birth" | "death" | "vet_visit" | "vaccination" | "other";
    description?: string | undefined;
    animalId?: string | undefined;
    count?: number | undefined;
    cost?: number | undefined;
}, {
    date: string;
    eventType: "birth" | "death" | "vet_visit" | "vaccination" | "other";
    description?: string | undefined;
    animalId?: string | undefined;
    count?: number | undefined;
    cost?: number | undefined;
}>;
export declare const createTransactionSchema: z.ZodObject<{
    transactionType: z.ZodEnum<["income", "expense"]>;
    amount: z.ZodNumber;
    date: z.ZodEffects<z.ZodString, Date, string>;
    category: z.ZodString;
    productType: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    animalId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    date: Date;
    transactionType: "income" | "expense";
    amount: number;
    category: string;
    description?: string | undefined;
    animalId?: string | undefined;
    productType?: string | undefined;
}, {
    date: string;
    transactionType: "income" | "expense";
    amount: number;
    category: string;
    description?: string | undefined;
    animalId?: string | undefined;
    productType?: string | undefined;
}>;
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export declare const registerSchema: z.ZodObject<{
    farmName: z.ZodString;
    ownerName: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    phone: z.ZodOptional<z.ZodString>;
    address: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    ownerName: string;
    email: string;
    password: string;
    farmName: string;
    phone?: string | undefined;
    address?: string | undefined;
}, {
    ownerName: string;
    email: string;
    password: string;
    farmName: string;
    phone?: string | undefined;
    address?: string | undefined;
}>;
export declare const changePasswordSchema: z.ZodObject<{
    currentPassword: z.ZodString;
    newPassword: z.ZodString;
}, "strip", z.ZodTypeAny, {
    currentPassword: string;
    newPassword: string;
}, {
    currentPassword: string;
    newPassword: string;
}>;
export declare const resetPasswordSchema: z.ZodObject<{
    token: z.ZodString;
    newPassword: z.ZodString;
}, "strip", z.ZodTypeAny, {
    newPassword: string;
    token: string;
}, {
    newPassword: string;
    token: string;
}>;
//# sourceMappingURL=validators.d.ts.map