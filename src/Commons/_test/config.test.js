import { afterEach, describe, expect, it } from "vitest";

const originalNodeEnv = process.env.NODE_ENV;

afterEach(() => {
  process.env.NODE_ENV = originalNodeEnv;
});

describe("config", () => {
  it("should load the default environment configuration", async () => {
    process.env.NODE_ENV = "production";

    const { default: config } = await import("../config.js?production");

    expect(config.app.host).toEqual("0.0.0.0");
  });

  it("should enable request debug logging in development", async () => {
    process.env.NODE_ENV = "development";

    const { default: config } = await import("../config.js?development");

    expect(config.app.debug).toEqual({ request: ["error"] });
  });
});
