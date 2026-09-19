import { vi } from "vitest";
import CommentRepository from "../../../Domains/comments/CommentRepository.js";
import ReplyRepository from "../../../Domains/replies/ReplyRepository.js";
import AddReplyUseCase from "../AddReplyUseCase.js";

describe("AddReplyUseCase", () => {
  it("should verify comment and add a reply", async () => {
    const commentRepository = new CommentRepository();
    const replyRepository = new ReplyRepository();
    commentRepository.verifyComment = vi.fn().mockResolvedValue();
    replyRepository.addReply = vi.fn().mockResolvedValue({
      id: "reply-1",
      content: "reply",
      owner: "user-1",
    });
    const useCase = new AddReplyUseCase({ commentRepository, replyRepository });

    const result = await useCase.execute("thread-1", "comment-1", {
      content: "reply",
      owner: "user-1",
    });

    expect(commentRepository.verifyComment).toHaveBeenCalledWith(
      "thread-1",
      "comment-1",
    );
    expect(replyRepository.addReply).toHaveBeenCalledWith(
      "comment-1",
      expect.objectContaining({ content: "reply", owner: "user-1" }),
    );
    expect(result.id).toEqual("reply-1");
  });
});
