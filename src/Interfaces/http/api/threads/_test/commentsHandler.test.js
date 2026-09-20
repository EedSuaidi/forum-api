import { vi } from "vitest";
import AddCommentUseCase from "../../../../../Applications/use_case/AddCommentUseCase.js";
import DeleteCommentUseCase from "../../../../../Applications/use_case/DeleteCommentUseCase.js";
import AuthenticationTokenManager from "../../../../../Applications/security/AuthenticationTokenManager.js";
import CommentsHandler from "../commentsHandler.js";

const createResponse = () => ({
  status: vi.fn().mockReturnThis(),
  json: vi.fn(),
});

const createContainer = ({ addComment, deleteComment } = {}) => {
  const instances = {
    [AuthenticationTokenManager.name]: {
      verifyAccessToken: vi.fn().mockResolvedValue(),
      decodePayload: vi.fn().mockResolvedValue({ id: "user-123" }),
    },
    [AddCommentUseCase.name]: { execute: addComment },
    [DeleteCommentUseCase.name]: { execute: deleteComment },
  };

  return { getInstance: vi.fn((name) => instances[name]) };
};

describe("CommentsHandler", () => {
  it("should post a comment", async () => {
    const addedComment = { id: "comment-123" };
    const addComment = vi.fn().mockResolvedValue(addedComment);
    const handler = new CommentsHandler(createContainer({ addComment }));
    const response = createResponse();

    await handler.postCommentHandler(
      {
        headers: { authorization: "Bearer access-token" },
        params: { threadId: "thread-123" },
        body: { content: "content" },
      },
      response,
      vi.fn(),
    );

    expect(addComment).toHaveBeenCalledWith("thread-123", {
      content: "content",
      owner: "user-123",
    });
    expect(response.status).toHaveBeenCalledWith(201);
    expect(response.json).toHaveBeenCalledWith({
      status: "success",
      data: { addedComment },
    });
  });

  it("should delete a comment", async () => {
    const deleteComment = vi.fn().mockResolvedValue();
    const handler = new CommentsHandler(createContainer({ deleteComment }));
    const response = createResponse();

    await handler.deleteCommentHandler(
      {
        headers: { authorization: "Bearer access-token" },
        params: { threadId: "thread-123", commentId: "comment-123" },
      },
      response,
      vi.fn(),
    );

    expect(deleteComment).toHaveBeenCalledWith(
      "thread-123",
      "comment-123",
      "user-123",
    );
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith({ status: "success" });
  });

  it("should pass comment errors to next", async () => {
    const error = new Error("failed");
    const next = vi.fn();
    const handler = new CommentsHandler(
      createContainer({ addComment: vi.fn().mockRejectedValue(error) }),
    );

    await handler.postCommentHandler(
      {
        headers: { authorization: "Bearer access-token" },
        params: { threadId: "thread-123" },
        body: {},
      },
      createResponse(),
      next,
    );

    expect(next).toHaveBeenCalledWith(error);
  });

  it("should pass delete comment errors to next", async () => {
    const error = new Error("failed");
    const next = vi.fn();
    const handler = new CommentsHandler(
      createContainer({ deleteComment: vi.fn().mockRejectedValue(error) }),
    );

    await handler.deleteCommentHandler(
      {
        headers: { authorization: "Bearer access-token" },
        params: { threadId: "thread-123", commentId: "comment-123" },
      },
      createResponse(),
      next,
    );

    expect(next).toHaveBeenCalledWith(error);
  });
});
