import { vi } from "vitest";
import ThreadRepository from "../../../Domains/threads/ThreadRepository.js";
import AddCommentUseCase from "../AddCommentUseCase.js";
import DeleteCommentUseCase from "../DeleteCommentUseCase.js";
import GetThreadDetailUseCase from "../GetThreadDetailUseCase.js";

describe("Comment use cases", () => {
  it("should verify thread and add a comment", async () => {
    const threadRepository = new ThreadRepository();
    threadRepository.verifyThread = vi.fn().mockResolvedValue();
    threadRepository.addComment = vi.fn().mockResolvedValue({
      id: "comment-1",
      content: "comment",
      owner: "user-1",
    });
    const useCase = new AddCommentUseCase({ threadRepository });

    const result = await useCase.execute("thread-1", {
      content: "comment",
      owner: "user-1",
    });

    expect(threadRepository.verifyThread).toHaveBeenCalledWith("thread-1");
    expect(threadRepository.addComment).toHaveBeenCalledWith(
      "thread-1",
      expect.objectContaining({
        content: "comment",
        owner: "user-1",
      }),
    );
    expect(result.id).toEqual("comment-1");
  });

  it("should only allow the comment owner to delete", async () => {
    const threadRepository = new ThreadRepository();
    threadRepository.verifyThread = vi.fn().mockResolvedValue();
    threadRepository.getCommentOwner = vi.fn().mockResolvedValue("user-1");
    threadRepository.deleteComment = vi.fn().mockResolvedValue();
    const useCase = new DeleteCommentUseCase({ threadRepository });

    await useCase.execute("thread-1", "comment-1", "user-1");

    expect(threadRepository.deleteComment).toHaveBeenCalledWith(
      "thread-1",
      "comment-1",
    );
    await expect(
      useCase.execute("thread-1", "comment-1", "user-2"),
    ).rejects.toThrowError("DELETE_COMMENT.NOT_OWNER");
  });

  it("should return thread detail", async () => {
    const threadRepository = new ThreadRepository();
    const detail = { id: "thread-1", comments: [] };
    threadRepository.getThreadDetail = vi.fn().mockResolvedValue(detail);
    const useCase = new GetThreadDetailUseCase({ threadRepository });

    await expect(useCase.execute("thread-1")).resolves.toEqual(detail);
  });
});
