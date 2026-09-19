import { vi } from "vitest";
import ThreadRepository from "../../../Domains/threads/ThreadRepository.js";
import CommentRepository from "../../../Domains/comments/CommentRepository.js";
import ReplyRepository from "../../../Domains/replies/ReplyRepository.js";
import GetThreadDetailUseCase from "../GetThreadDetailUseCase.js";

describe("GetThreadDetailUseCase", () => {
  it("should return thread detail", async () => {
    const threadRepository = new ThreadRepository();
    const commentRepository = new CommentRepository();
    const replyRepository = new ReplyRepository();
    const detail = { id: "thread-1", title: "title" };
    threadRepository.getThreadDetail = vi.fn().mockResolvedValue(detail);
    commentRepository.getComments = vi
      .fn()
      .mockResolvedValue([{ id: "comment-1", content: "comment" }]);
    replyRepository.getReplies = vi.fn().mockResolvedValue([]);
    const useCase = new GetThreadDetailUseCase({
      threadRepository,
      commentRepository,
      replyRepository,
    });

    const result = await useCase.execute("thread-1");

    expect(threadRepository.getThreadDetail).toHaveBeenCalledWith("thread-1");
    expect(commentRepository.getComments).toHaveBeenCalledWith("thread-1");
    expect(replyRepository.getReplies).toHaveBeenCalledWith("comment-1");
    expect(result).toEqual({
      ...detail,
      comments: [{ id: "comment-1", content: "comment", replies: [] }],
    });
  });
});
