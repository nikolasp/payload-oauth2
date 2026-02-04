/// <reference types="node" />
/// <reference types="node" />
export declare const encodeBase64Url: (buffer: Buffer) => string;
export declare const defaultGetPkceCodes: () => {
    verifier: string;
    challenge: string;
    challengeMethod: string;
};
