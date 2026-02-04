import { PayloadRequest } from "payload";
export declare const defaultGetToken: (tokenEndpoint: string, clientId: string, clientSecret: string, redirectUri: string, code: string, pkceEnabled?: boolean, req?: PayloadRequest) => Promise<string>;
