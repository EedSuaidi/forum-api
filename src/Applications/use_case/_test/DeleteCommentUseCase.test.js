import { vi } from "vitest";
import ThreadRepository from "../../../Domains/threads/ThreadRepository.js";
import CommentRepository from "../../../Domains/comments/CommentRepository.js";
import DeleteCommentUseCase from "../DeleteCommentUseCase.js";

describe("DeleteCommentUseCase", () => {
  it("should only allow the comment owner to delete", async () => {
    const threadRepository = new ThreadRepository();
    const commentRepository = new CommentRepository();
    threadRepository.verifyThread = vi.fn().mockResolvedValue();
    commentRepository.getCommentOwner = vi.fn().mockResolvedValue("user-1");
    commentRepository.deleteComment = vi.fn().mockResolvedValue();
    const useCase = new DeleteCommentUseCase({
      threadRepository,
      commentRepository,
    });

    await useCase.execute("thread-1", "comment-1", "user-1");

    expect(commentRepository.deleteComment).toHaveBeenCalledWith(
      "thread-1",
      "comment-1",
    );
    await expect(
      useCase.execute("thread-1", "comment-1", "user-2"),
    ).rejects.toThrowError("DELETE_COMMENT.NOT_OWNER");
  });
});
