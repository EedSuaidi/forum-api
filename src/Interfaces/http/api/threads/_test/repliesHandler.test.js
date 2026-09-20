import { vi } from "vitest";
import AddReplyUseCase from "../../../../../Applications/use_case/AddReplyUseCase.js";
import DeleteReplyUseCase from "../../../../../Applications/use_case/DeleteReplyUseCase.js";
import AuthenticationTokenManager from "../../../../../Applications/security/AuthenticationTokenManager.js";
import RepliesHandler from "../repliesHandler.js";

const createResponse = () => ({
  status: vi.fn().mockReturnThis(),
  json: vi.fn(),
});

const createContainer = ({ addReply, deleteReply } = {}) => {
  const instances = {
    [AuthenticationTokenManager.name]: {
      verifyAccessToken: vi.fn().mockResolvedValue(),
      decodePayload: vi.fn().mockResolvedValue({ id: "user-123" }),
    },
    [AddReplyUseCase.name]: { execute: addReply },
    [DeleteReplyUseCase.name]: { execute: deleteReply },
  };

  return { getInstance: vi.fn((name) => instances[name]) };
};

describe("RepliesHandler", () => {
  it("should post a reply", async () => {
    const addedReply = { id: "reply-123" };
    const addReply = vi.fn().mockResolvedValue(addedReply);
    const handler = new RepliesHandler(createContainer({ addReply }));
    const response = createResponse();

    await handler.postReplyHandler(
      {
        headers: { authorization: "Bearer access-token" },
        params: { threadId: "thread-123", commentId: "comment-123" },
        body: { content: "content" },
      },
      response,
      vi.fn(),
    );

    expect(addReply).toHaveBeenCalledWith("thread-123", "comment-123", {
      content: "content",
      owner: "user-123",
    });
    expect(response.status).toHaveBeenCalledWith(201);
    expect(response.json).toHaveBeenCalledWith({
      status: "success",
      data: { addedReply },
    });
  });

  it("should delete a reply", async () => {
    const deleteReply = vi.fn().mockResolvedValue();
    const handler = new RepliesHandler(createContainer({ deleteReply }));
    const response = createResponse();

    await handler.deleteReplyHandler(
      {
        headers: { authorization: "Bearer access-token" },
        params: {
          threadId: "thread-123",
          commentId: "comment-123",
          replyId: "reply-123",
        },
      },
      response,
      vi.fn(),
    );

    expect(deleteReply).toHaveBeenCalledWith(
      "thread-123",
      "comment-123",
      "reply-123",
      "user-123",
    );
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith({ status: "success" });
  });

  it("should pass reply errors to next", async () => {
    const error = new Error("failed");
    const next = vi.fn();
    const handler = new RepliesHandler(
      createContainer({ addReply: vi.fn().mockRejectedValue(error) }),
    );

    await handler.postReplyHandler(
      {
        headers: { authorization: "Bearer access-token" },
        params: { threadId: "thread-123", commentId: "comment-123" },
        body: {},
      },
      createResponse(),
      next,
    );

    expect(next).toHaveBeenCalledWith(error);
  });

  it("should pass delete reply errors to next", async () => {
    const error = new Error("failed");
    const next = vi.fn();
    const handler = new RepliesHandler(
      createContainer({ deleteReply: vi.fn().mockRejectedValue(error) }),
    );

    await handler.deleteReplyHandler(
      {
        headers: { authorization: "Bearer access-token" },
        params: {
          threadId: "thread-123",
          commentId: "comment-123",
          replyId: "reply-123",
        },
      },
      createResponse(),
      next,
    );

    expect(next).toHaveBeenCalledWith(error);
  });
});
