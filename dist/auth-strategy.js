import crypto from "crypto";
import { jwtVerify } from "jose";
import { extractJWT, } from "payload";
export const createAuthStrategy = (pluginOptions, subFieldName) => {
    const authStrategy = {
        name: pluginOptions.strategyName,
        authenticate: async ({ headers, payload }) => {
            try {
                const token = extractJWT({ headers, payload });
                if (!token)
                    return { user: null };
                let jwtUser = null;
                try {
                    const secret = crypto
                        .createHash("sha256")
                        .update(payload.config.secret)
                        .digest("hex")
                        .slice(0, 32);
                    const { payload: verifiedPayload } = await jwtVerify(token, new TextEncoder().encode(secret), { algorithms: ["HS256"] });
                    jwtUser = verifiedPayload;
                }
                catch (e) {
                    // Handle token expiration
                    if (e.code === "ERR_JWT_EXPIRED")
                        return { user: null };
                    throw e;
                }
                if (!jwtUser)
                    return { user: null };
                // Find the user by email from the verified jwt token
                // coerce userCollection to CollectionSlug because it is already checked
                // in `modify-auth-collection.ts` that it is a valud collection slug
                const userCollection = ((typeof jwtUser.collection === "string" &&
                    jwtUser.collection) ||
                    pluginOptions.authCollection ||
                    "users");
                let user = null;
                if (pluginOptions.resolveUserIdentity) {
                    user = await pluginOptions.resolveUserIdentity(jwtUser, payload);
                    return { user };
                }
                else if (pluginOptions.useEmailAsIdentity) {
                    if (!jwtUser.email || typeof jwtUser.email !== "string") {
                        payload.logger.warn("Using email as identity but no email is found in jwt token");
                        return { user: null };
                    }
                    const usersQuery = await payload.find({
                        collection: userCollection,
                        where: { email: { equals: jwtUser.email } },
                    });
                    if (usersQuery.docs.length === 0) {
                        // coerce to User because `userCollection` is a valid auth collection, checked by `modify-auth-collection.ts` already
                        user = (await payload.create({
                            collection: userCollection,
                            data: jwtUser,
                        }));
                    }
                    else {
                        // coerce to User because payload warns that some collection may not have property `collection` - i.e. `PayloadMigration;
                        user = usersQuery.docs[0];
                    }
                }
                else {
                    if (typeof jwtUser[subFieldName] !== "string") {
                        payload.logger.warn(`No ${subFieldName} found in jwt token. Make sure the jwt token contains the ${subFieldName} field`);
                        return { user: null };
                    }
                    const usersQuery = await payload.find({
                        collection: userCollection,
                        where: { [subFieldName]: { equals: jwtUser[subFieldName] } },
                    });
                    if (usersQuery.docs.length === 0) {
                        // coerce to User because payload warns that some collection may not have property `collection` - i.e. `PayloadMigration;
                        user = (await payload.create({
                            collection: userCollection,
                            data: jwtUser,
                        }));
                    }
                    else {
                        // coerce to User because payload warns that some collection may not have property `collection` - i.e. `PayloadMigration;
                        user = usersQuery.docs[0];
                    }
                }
                user.collection = userCollection;
                // Return the user object
                return { user };
            }
            catch (e) {
                payload.logger.error(e);
                return { user: null };
            }
        },
    };
    return authStrategy;
};
//# sourceMappingURL=auth-strategy.js.map