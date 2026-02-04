import { parseCookies } from "payload";
export const defaultGetToken = async (tokenEndpoint, clientId, clientSecret, redirectUri, code, pkceEnabled = false, req) => {
    const params = new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
    });
    if (pkceEnabled) {
        const cookies = req?.headers ? parseCookies(req.headers) : null;
        const codeVerifier = cookies?.get("pkce_verifier");
        codeVerifier && params.append("code_verifier", codeVerifier);
    }
    const tokenResponse = await fetch(tokenEndpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "application/json",
        },
        body: params.toString(),
    });
    const tokenData = await tokenResponse.json();
    const accessToken = tokenData?.access_token;
    if (typeof accessToken !== "string")
        throw new Error(`No access token: ${JSON.stringify(tokenData)}`);
    return accessToken;
};
//# sourceMappingURL=default-get-token.js.map