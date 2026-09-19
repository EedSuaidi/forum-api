import { vi } from "vitest";
import CommentRepository from "../../../Domains/comments/CommentRepository.js";
import ReplyRepository from "../../../Domains/replies/ReplyRepository.js";
import DeleteReplyUseCase from "../DeleteReplyUseCase.js";

describe("DeleteReplyUseCase", () => {
  it("should only allow the reply owner to delete", async () => {
    const commentRepository = new CommentRepository();
    const replyRepository = new ReplyRepository();
    commentRepository.verifyComment = vi.fn().mockResolvedValue();
    replyRepository.getReplyOwner = vi.fn().mockResolvedValue("user-1");
    replyRepository.deleteReply = vi.fn().mockResolvedValue();
    const useCase = new DeleteReplyUseCase({
      commentRepository,
      replyRepository,
    });

    await useCase.execute("thread-1", "comment-1", "reply-1", "user-1");

    expect(replyRepository.deleteReply).toHaveBeenCalledWith(
      "comment-1",
      "reply-1",
    );
    await expect(
      useCase.execute("thread-1", "comment-1", "reply-1", "user-2"),
    ).rejects.toThrowError("DELETE_REPLY.NOT_OWNER");
  });
});
