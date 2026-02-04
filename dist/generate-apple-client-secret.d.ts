/**
 * Utilities for generating an Apple OAuth2 client secret JWT.
 *
 * - AppleClientSecretParams: Interface describing the required parameters for generating the client secret.
 * - generateAppleClientSecret: Asynchronously generates a signed JWT to be used as the Apple OAuth2 client secret.
 *
 * Usage:
 *   const jwt = await generateAppleClientSecret({
 *     teamId: "...",
 *     clientId: "...",
 *     keyId: "...",
 *     privateKey: "...",
 *     exp: 1234567890, // optional, seconds since epoch
 *   });
 */
export interface AppleClientSecretParams {
    /**
     * Your Apple Developer Team ID.
     */
    teamId: string;
    /**
     * Your Apple Service Client ID (the identifier for your app/service).
     */
    clientId: string;
    /**
     * The Key ID from your Apple Developer account.
     */
    keyId: string;
    /**
     * The contents of your Apple private key (.p8 file).
     */
    authKeyContent: string;
    /**
     * Optional expiration time (in seconds since epoch). Defaults to 6 months from now.
     */
    exp?: number;
}
/**
 * Generate a signed JWT to use as the Apple OAuth2 client secret.
 *
 * @param params - AppleClientSecretParams object containing required Apple OAuth credentials.
 * @returns Promise<string> - The signed JWT client secret.
 * @throws Error if any required parameter is missing.
 */
export declare function generateAppleClientSecret({ teamId, clientId, keyId, authKeyContent, exp, }: AppleClientSecretParams): Promise<string>;
