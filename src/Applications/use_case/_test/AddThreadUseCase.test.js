import { vi } from "vitest";
import ThreadRepository from "../../../Domains/threads/ThreadRepository.js";
import NewThread from "../../../Domains/threads/entities/NewThread.js";
import AddThreadUseCase from "../AddThreadUseCase.js";

describe("AddThreadUseCase", () => {
  it("should orchestrate the add thread action correctly", async () => {
    const useCasePayload = {
      title: "sebuah thread",
      body: "sebuah body thread",
      owner: "user-123",
    };
    const mockedAddedThread = {
      id: "thread-123",
      title: useCasePayload.title,
      owner: useCasePayload.owner,
    };
    const threadRepository = new ThreadRepository();
    threadRepository.addThread = vi.fn().mockResolvedValue(mockedAddedThread);
    const useCase = new AddThreadUseCase({ threadRepository });

    const result = await useCase.execute(useCasePayload);

    expect(result).toEqual({
      id: "thread-123",
      title: useCasePayload.title,
      owner: useCasePayload.owner,
    });
    expect(threadRepository.addThread).toHaveBeenCalledWith(
      new NewThread(useCasePayload),
    );
  });
});
