import crypto from "crypto";
export const encodeBase64Url = (buffer) => {
    return buffer.toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/g, '');
};
export const defaultGetPkceCodes = () => {
    const verifier = encodeBase64Url(crypto.randomBytes(32));
    const challenge = encodeBase64Url(crypto.createHash('sha256').update(verifier).digest());
    return { verifier, challenge, challengeMethod: 'S256' };
};
//# sourceMappingURL=default-get-pkce-codes.js.map