// src/services/token.service.ts
import { BadRequestError } from "../utils/errors";

// Define a simple in-memory token store for demonstration purposes
const tokenStore: { [key: string]: number } = {};

export class TokenService {
    /**
     * Checks if a tenant has sufficient tokens.
     * @param tenantId The ID of the tenant.
     * @param required The number of tokens required.
     * @returns An object with `sufficient` boolean and current `balance`.
     */
    static async checkSufficientBalance(tenantId: string, required: number): Promise<{ sufficient: boolean; balance: number }> {
        const balance = tokenStore[tenantId] || 0;
        return {
            sufficient: balance >= required,
            balance,
        };
    }

    /**
     * Consumes tokens from a tenant's balance.
     * @param tenantId The ID of the tenant.
     * @param amount The number of tokens to consume.
     * @param reason A description of why the tokens are being consumed.
     * @param referenceId An ID for the transaction or resource.
     * @param userId The ID of the user performing the action.
     * @param quantity The quantity of items related to the token consumption.
     */
    static async consumeTokens(tenantId: string, amount: number, reason: string, referenceId: string, userId: string, quantity: number): Promise<void> {
        const balance = tokenStore[tenantId] || 0;
        if (balance < amount) {
            throw new BadRequestError('Insufficient tokens.');
        }
        tokenStore[tenantId] -= amount;
        console.log(`Consumed ${amount} tokens from tenant ${tenantId} for ${reason}. New balance: ${tokenStore[tenantId]}`);
    }

    /**
     * Adds tokens to a tenant's balance.
     * @param tenantId The ID of the tenant.
     * @param amount The number of tokens to add.
     */
    static async addTokens(tenantId: string, amount: number): Promise<void> {
        if (!tokenStore[tenantId]) {
            tokenStore[tenantId] = 0;
        }
        tokenStore[tenantId] += amount;
        console.log(`Added ${amount} tokens to tenant ${tenantId}. New balance: ${tokenStore[tenantId]}`);
    }
}