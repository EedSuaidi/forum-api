import CommentRepository from "../CommentRepository.js";

describe("CommentRepository interface", () => {
  it("should throw error when invoking unimplemented methods", async () => {
    const repository = new CommentRepository();

    await expect(repository.addComment()).rejects.toThrowError(
      "COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED",
    );
    await expect(repository.getCommentOwner()).rejects.toThrowError(
      "COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED",
    );
    await expect(repository.verifyComment()).rejects.toThrowError(
      "COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED",
    );
    await expect(repository.deleteComment()).rejects.toThrowError(
      "COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED",
    );
    await expect(repository.getComments()).rejects.toThrowError(
      "COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED",
    );
  });
});
