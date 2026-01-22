export declare class TokenService {
    /**
     * Checks if a tenant has sufficient tokens.
     * @param tenantId The ID of the tenant.
     * @param required The number of tokens required.
     * @returns An object with `sufficient` boolean and current `balance`.
     */
    static checkSufficientBalance(tenantId: string, required: number): Promise<{
        sufficient: boolean;
        balance: number;
    }>;
    /**
     * Consumes tokens from a tenant's balance.
     * @param tenantId The ID of the tenant.
     * @param amount The number of tokens to consume.
     * @param reason A description of why the tokens are being consumed.
     * @param referenceId An ID for the transaction or resource.
     * @param userId The ID of the user performing the action.
     * @param quantity The quantity of items related to the token consumption.
     */
    static consumeTokens(tenantId: string, amount: number, reason: string, referenceId: string, userId: string, quantity: number): Promise<void>;
    /**
     * Adds tokens to a tenant's balance.
     * @param tenantId The ID of the tenant.
     * @param amount The number of tokens to add.
     */
    static addTokens(tenantId: string, amount: number): Promise<void>;
}
//# sourceMappingURL=token.service.d.ts.map