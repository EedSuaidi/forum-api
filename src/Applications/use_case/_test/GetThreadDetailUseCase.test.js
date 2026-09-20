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
    const mockedDetail = { id: "thread-1", title: "title" };
    threadRepository.getThreadDetail = vi.fn().mockResolvedValue(mockedDetail);
    commentRepository.getComments = vi
      .fn()
      .mockResolvedValue([
        { id: "comment-1", content: "comment", is_delete: true },
      ]);
    replyRepository.getReplies = vi
      .fn()
      .mockResolvedValue([
        { id: "reply-1", content: "reply", is_delete: true },
      ]);
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
      id: "thread-1",
      title: "title",
      comments: [
        {
          id: "comment-1",
          content: "**komentar telah dihapus**",
          replies: [{ id: "reply-1", content: "**balasan telah dihapus**" }],
        },
      ],
    });
  });

  it("should keep active comments and replies unchanged", async () => {
    const threadRepository = new ThreadRepository();
    const commentRepository = new CommentRepository();
    const replyRepository = new ReplyRepository();
    threadRepository.getThreadDetail = vi.fn().mockResolvedValue({
      id: "thread-1",
    });
    commentRepository.getComments = vi
      .fn()
      .mockResolvedValue([
        { id: "comment-1", content: "comment", is_delete: false },
      ]);
    replyRepository.getReplies = vi
      .fn()
      .mockResolvedValue([
        { id: "reply-1", content: "reply", is_delete: false },
      ]);
    const useCase = new GetThreadDetailUseCase({
      threadRepository,
      commentRepository,
      replyRepository,
    });

    await expect(useCase.execute("thread-1")).resolves.toEqual({
      id: "thread-1",
      comments: [
        {
          id: "comment-1",
          content: "comment",
          replies: [{ id: "reply-1", content: "reply" }],
        },
      ],
    });
  });
});
