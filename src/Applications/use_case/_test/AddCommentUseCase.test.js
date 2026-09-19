import { vi } from "vitest";
import ThreadRepository from "../../../Domains/threads/ThreadRepository.js";
import CommentRepository from "../../../Domains/comments/CommentRepository.js";
import AddCommentUseCase from "../AddCommentUseCase.js";

describe("AddCommentUseCase", () => {
  it("should verify thread and add a comment", async () => {
    const threadRepository = new ThreadRepository();
    const commentRepository = new CommentRepository();
    threadRepository.verifyThread = vi.fn().mockResolvedValue();
    commentRepository.addComment = vi.fn().mockResolvedValue({
      id: "comment-1",
      content: "comment",
      owner: "user-1",
    });
    const useCase = new AddCommentUseCase({
      threadRepository,
      commentRepository,
    });

    const result = await useCase.execute("thread-1", {
      content: "comment",
      owner: "user-1",
    });

    expect(threadRepository.verifyThread).toHaveBeenCalledWith("thread-1");
    expect(commentRepository.addComment).toHaveBeenCalledWith(
      "thread-1",
      expect.objectContaining({
        content: "comment",
        owner: "user-1",
      }),
    );
    expect(result.id).toEqual("comment-1");
  });
});
