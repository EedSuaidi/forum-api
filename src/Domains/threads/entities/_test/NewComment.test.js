import NewComment from "../NewComment.js";

describe("NewComment entities", () => {
  it("should reject incomplete payload", () => {
    expect(() => new NewComment({ owner: "user-1" })).toThrowError(
      "NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY",
    );
  });

  it("should reject invalid payload types", () => {
    expect(
      () => new NewComment({ content: 123, owner: "user-1" }),
    ).toThrowError("NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION");
  });

  it("should create a comment correctly", () => {
    const comment = new NewComment({ content: "comment", owner: "user-1" });

    expect(comment.content).toEqual("comment");
    expect(comment.owner).toEqual("user-1");
  });
});
