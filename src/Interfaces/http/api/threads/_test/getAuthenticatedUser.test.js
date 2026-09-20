import { vi } from "vitest";
import AuthenticationTokenManager from "../../../../../Applications/security/AuthenticationTokenManager.js";
import AuthenticationError from "../../../../../Commons/exceptions/AuthenticationError.js";
import getAuthenticatedUser from "../getAuthenticatedUser.js";

describe("getAuthenticatedUser", () => {
  it("should return authenticated user id", async () => {
    const tokenManager = {
      verifyAccessToken: vi.fn().mockResolvedValue(),
      decodePayload: vi.fn().mockResolvedValue({ id: "user-123" }),
    };
    const container = {
      getInstance: vi.fn().mockReturnValue(tokenManager),
    };

    const userId = await getAuthenticatedUser(container, {
      headers: { authorization: "Bearer access-token" },
    });

    expect(container.getInstance).toHaveBeenCalledWith(
      AuthenticationTokenManager.name,
    );
    expect(tokenManager.verifyAccessToken).toHaveBeenCalledWith("access-token");
    expect(tokenManager.decodePayload).toHaveBeenCalledWith("access-token");
    expect(userId).toEqual("user-123");
  });

  it.each([undefined, "Basic access-token", "Bearer"])(
    "should reject invalid authorization header: %s",
    async (authorization) => {
      await expect(
        getAuthenticatedUser(
          { getInstance: vi.fn() },
          { headers: { authorization } },
        ),
      ).rejects.toThrowError(AuthenticationError);
    },
  );
});
