import NewReply from "../NewReply.js";

describe("NewReply entities", () => {
  it("should reject incomplete payload", () => {
    expect(() => new NewReply({ owner: "user-1" })).toThrowError(
      "NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY",
    );
  });

  it("should reject invalid payload types", () => {
    expect(() => new NewReply({ content: 123, owner: "user-1" })).toThrowError(
      "NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION",
    );
  });

  it("should create a reply correctly", () => {
    const reply = new NewReply({ content: "reply", owner: "user-1" });

    expect(reply.content).toEqual("reply");
    expect(reply.owner).toEqual("user-1");
  });
});
