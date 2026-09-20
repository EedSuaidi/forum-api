import NewThread from "../NewThread.js";

describe("NewThread entities", () => {
  it("should reject incomplete payload", () => {
    expect(() => new NewThread({ owner: "user-1" })).toThrowError(
      "NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY",
    );
  });

  it("should reject invalid payload types", () => {
    expect(
      () => new NewThread({ title: 123, body: "body", owner: "user-1" }),
    ).toThrowError("NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION");
  });

  it("should create a thread correctly", () => {
    const thread = new NewThread({
      title: "title",
      body: "body",
      owner: "user-1",
    });

    expect(thread.title).toEqual("title");
    expect(thread.body).toEqual("body");
    expect(thread.owner).toEqual("user-1");
  });
});
