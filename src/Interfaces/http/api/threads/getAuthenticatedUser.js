import AuthenticationTokenManager from "../../../../Applications/security/AuthenticationTokenManager.js";
import AuthenticationError from "../../../../Commons/exceptions/AuthenticationError.js";

const getAuthenticatedUser = async (container, req) => {
  const authorization = req.headers.authorization;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw new AuthenticationError("Missing authentication");
  }

  const tokenManager = container.getInstance(AuthenticationTokenManager.name);
  const accessToken = authorization.substring(7);
  await tokenManager.verifyAccessToken(accessToken);
  const { id } = await tokenManager.decodePayload(accessToken);
  return id;
};

export default getAuthenticatedUser;
