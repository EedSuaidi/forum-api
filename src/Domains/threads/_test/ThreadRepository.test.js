import ThreadRepository from "../ThreadRepository.js";

describe("ThreadRepository interface", () => {
  it("should throw error when invoking unimplemented methods", async () => {
    const repository = new ThreadRepository();

    await expect(repository.addThread()).rejects.toThrowError(
      "THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED",
    );
    await expect(repository.verifyThread()).rejects.toThrowError(
      "THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED",
    );
    await expect(repository.getThreadDetail()).rejects.toThrowError(
      "THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED",
    );
  });
});
