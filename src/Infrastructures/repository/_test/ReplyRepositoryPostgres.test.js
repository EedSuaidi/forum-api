import UsersTableTestHelper from "../../../../tests/UsersTableTestHelper.js";
import pool from "../../database/postgres/pool.js";
import ReplyRepositoryPostgres from "../ReplyRepositoryPostgres.js";

describe("ThreadRepositoryPostgres replies", () => {
  const fixtureId = Date.now().toString();
  const threadId = `thread-reply-${fixtureId}`;
  const commentId = `comment-reply-${fixtureId}`;
  const userId = `user-reply-${fixtureId}`;
  const username = `replytester${fixtureId}`;

  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ id: userId, username });
    await pool.query({
      text: "INSERT INTO threads (id, title, body, owner) VALUES ($1, $2, $3, $4)",
      values: [threadId, "title", "body", userId],
    });
    await pool.query({
      text: "INSERT INTO comments (id, thread_id, content, owner) VALUES ($1, $2, $3, $4)",
      values: [commentId, threadId, "comment", userId],
    });
  });

  afterAll(async () => {
    await pool.query({
      text: "DELETE FROM replies WHERE comment_id = $1",
      values: [commentId],
    });
    await pool.query({
      text: "DELETE FROM comments WHERE id = $1",
      values: [commentId],
    });
    await pool.query({
      text: "DELETE FROM threads WHERE id = $1",
      values: [threadId],
    });
    await pool.query({
      text: "DELETE FROM users WHERE id = $1",
      values: [userId],
    });
    await pool.end();
  });

  it("should persist and soft delete a reply in thread detail", async () => {
    const repository = new ReplyRepositoryPostgres(pool, () => "generated");
    const addedReply = await repository.addReply(commentId, {
      content: "reply",
      owner: userId,
    });

    expect(addedReply.content).toEqual("reply");
    await expect(
      repository.getReplyOwner(commentId, addedReply.id),
    ).resolves.toBe(userId);
    await repository.deleteReply(commentId, addedReply.id);

    const replies = await repository.getReplies(commentId);
    expect(replies[0]).toEqual({
      id: addedReply.id,
      content: "reply",
      date: expect.any(Date),
      username,
      is_delete: true,
    });
  });

  it("should reject an unknown reply", async () => {
    const repository = new ReplyRepositoryPostgres(pool, () => "generated");

    await expect(
      repository.getReplyOwner(commentId, "unknown-reply"),
    ).rejects.toThrowError("balasan tidak ditemukan");
  });
});
