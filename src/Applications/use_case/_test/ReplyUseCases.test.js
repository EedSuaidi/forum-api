import { vi } from "vitest";
import ThreadRepository from "../../../Domains/threads/ThreadRepository.js";
import AddReplyUseCase from "../AddReplyUseCase.js";
import DeleteReplyUseCase from "../DeleteReplyUseCase.js";

describe("Reply use cases", () => {
  it("should verify comment and add a reply", async () => {
    const threadRepository = new ThreadRepository();
    threadRepository.verifyComment = vi.fn().mockResolvedValue();
    threadRepository.addReply = vi.fn().mockResolvedValue({
      id: "reply-1",
      content: "reply",
      owner: "user-1",
    });
    const useCase = new AddReplyUseCase({ threadRepository });

    const result = await useCase.execute("thread-1", "comment-1", {
      content: "reply",
      owner: "user-1",
    });

    expect(threadRepository.verifyComment).toHaveBeenCalledWith(
      "thread-1",
      "comment-1",
    );
    expect(threadRepository.addReply).toHaveBeenCalledWith(
      "comment-1",
      expect.objectContaining({ content: "reply", owner: "user-1" }),
    );
    expect(result.id).toEqual("reply-1");
  });

  it("should only allow the reply owner to delete", async () => {
    const threadRepository = new ThreadRepository();
    threadRepository.verifyComment = vi.fn().mockResolvedValue();
    threadRepository.getReplyOwner = vi.fn().mockResolvedValue("user-1");
    threadRepository.deleteReply = vi.fn().mockResolvedValue();
    const useCase = new DeleteReplyUseCase({ threadRepository });

    await useCase.execute("thread-1", "comment-1", "reply-1", "user-1");

    expect(threadRepository.deleteReply).toHaveBeenCalledWith(
      "comment-1",
      "reply-1",
    );
    await expect(
      useCase.execute("thread-1", "comment-1", "reply-1", "user-2"),
    ).rejects.toThrowError("DELETE_REPLY.NOT_OWNER");
  });
});
