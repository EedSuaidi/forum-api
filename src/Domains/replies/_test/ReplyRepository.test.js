import ReplyRepository from "../ReplyRepository.js";

describe("ReplyRepository interface", () => {
  it("should throw error when invoking unimplemented methods", async () => {
    const repository = new ReplyRepository();

    await expect(repository.addReply()).rejects.toThrowError(
      "REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED",
    );
    await expect(repository.getReplyOwner()).rejects.toThrowError(
      "REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED",
    );
    await expect(repository.deleteReply()).rejects.toThrowError(
      "REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED",
    );
    await expect(repository.getReplies()).rejects.toThrowError(
      "REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED",
    );
  });
});
