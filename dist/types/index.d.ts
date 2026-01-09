export interface PaginationOptions {
    page: number;
    limit: number;
}
export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
export interface CreateAnimalDTO {
    tagNumber: string;
    breed: string;
    type: string;
    birthDate: Date;
    gender: 'male' | 'female';
    location?: string;
    healthStatus?: 'healthy' | 'sick' | 'injured' | 'deceased';
    weight?: number;
    notes?: string;
}
export interface CreateProductionDTO {
    date: Date;
    totalEggs: number;
    gradeBreakdown: {
        gradeA: number;
        gradeB: number;
        gradeC: number;
        broken: number;
    };
    notes?: string;
}
export interface CreateEventDTO {
    eventType: 'birth' | 'death' | 'vet_visit' | 'vaccination' | 'other';
    date: Date;
    animalId?: string;
    count?: number;
    description?: string;
    cost?: number;
}
export interface CreateTransactionDTO {
    transactionType: 'income' | 'expense';
    amount: number;
    date: Date;
    category: string;
    productType?: string;
    description?: string;
    animalId?: string;
    paymentMethod?: 'cash' | 'bank_transfer' | 'mobile_money' | 'credit_card' | 'check' | 'flutterwave';
    paymentStatus?: 'pending' | 'completed' | 'failed' | 'cancelled';
    paymentReference?: string;
    paymentId?: string;
    customerEmail?: string;
    customerName?: string;
}
export interface LoginDTO {
    email: string;
    password: string;
}
export interface RegisterDTO {
    farmName: string;
    ownerName: string;
    email: string;
    password: string;
    phone?: string;
    address?: string;
    referralCode?: string;
}
export interface PaymentData {
    amount: number;
    currency: string;
    customerEmail: string;
    customerName: string;
    customerPhone?: string;
    paymentDescription: string;
    redirectUrl?: string;
    tenantId: string;
    userId: string;
    transactionType?: 'income' | 'expense';
    category?: string;
}
export interface ChangePasswordDTO {
    currentPassword: string;
    newPassword: string;
}
export interface ResetPasswordDTO {
    token: string;
    newPassword: string;
}
export interface JWTPayload {
    userId: string;
    tenantId: string;
    role: string;
    email: string;
}
//# sourceMappingURL=index.d.ts.map