import { vi } from "vitest";
import AddThreadUseCase from "../../../../../Applications/use_case/AddThreadUseCase.js";
import GetThreadDetailUseCase from "../../../../../Applications/use_case/GetThreadDetailUseCase.js";
import AuthenticationTokenManager from "../../../../../Applications/security/AuthenticationTokenManager.js";
import ThreadsHandler from "../handler.js";

const createResponse = () => ({
  status: vi.fn().mockReturnThis(),
  json: vi.fn(),
});

const createContainer = ({ addThread, getThreadDetail } = {}) => {
  const tokenManager = {
    verifyAccessToken: vi.fn().mockResolvedValue(),
    decodePayload: vi.fn().mockResolvedValue({ id: "user-123" }),
  };
  const instances = {
    [AuthenticationTokenManager.name]: tokenManager,
    [AddThreadUseCase.name]: { execute: addThread },
    [GetThreadDetailUseCase.name]: { execute: getThreadDetail },
  };

  return {
    getInstance: vi.fn((name) => instances[name]),
  };
};

describe("ThreadsHandler", () => {
  it("should post a thread", async () => {
    const addedThread = { id: "thread-123" };
    const addThread = vi.fn().mockResolvedValue(addedThread);
    const handler = new ThreadsHandler(createContainer({ addThread }));
    const response = createResponse();

    await handler.postThreadHandler(
      {
        headers: { authorization: "Bearer access-token" },
        body: { title: "title", body: "body" },
      },
      response,
      vi.fn(),
    );

    expect(addThread).toHaveBeenCalledWith({
      title: "title",
      body: "body",
      owner: "user-123",
    });
    expect(response.status).toHaveBeenCalledWith(201);
    expect(response.json).toHaveBeenCalledWith({
      status: "success",
      data: { addedThread },
    });
  });

  it("should pass post thread errors to next", async () => {
    const error = new Error("failed");
    const next = vi.fn();
    const handler = new ThreadsHandler(
      createContainer({ addThread: vi.fn().mockRejectedValue(error) }),
    );

    await handler.postThreadHandler(
      {
        headers: { authorization: "Bearer access-token" },
        body: {},
      },
      createResponse(),
      next,
    );

    expect(next).toHaveBeenCalledWith(error);
  });

  it("should return thread detail", async () => {
    const thread = { id: "thread-123" };
    const getThreadDetail = vi.fn().mockResolvedValue(thread);
    const handler = new ThreadsHandler(createContainer({ getThreadDetail }));
    const response = createResponse();

    await handler.getThreadDetailHandler(
      { params: { threadId: "thread-123" } },
      response,
      vi.fn(),
    );

    expect(getThreadDetail).toHaveBeenCalledWith("thread-123");
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith({
      status: "success",
      data: { thread },
    });
  });

  it("should pass thread detail errors to next", async () => {
    const error = new Error("failed");
    const next = vi.fn();
    const handler = new ThreadsHandler(
      createContainer({ getThreadDetail: vi.fn().mockRejectedValue(error) }),
    );

    await handler.getThreadDetailHandler(
      { params: { threadId: "thread-123" } },
      createResponse(),
      next,
    );

    expect(next).toHaveBeenCalledWith(error);
  });
});
