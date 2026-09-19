import UsersTableTestHelper from "../../../../tests/UsersTableTestHelper.js";
import pool from "../../database/postgres/pool.js";
import CommentRepositoryPostgres from "../CommentRepositoryPostgres.js";

describe("CommentRepositoryPostgres", () => {
  const fixtureId = Date.now().toString();
  const threadId = `thread-comment-${fixtureId}`;
  const userId = `user-comment-${fixtureId}`;
  const username = `commenttester${fixtureId}`;

  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ id: userId, username });
    await pool.query({
      text: "INSERT INTO threads (id, title, body, owner) VALUES ($1, $2, $3, $4)",
      values: [threadId, "title", "body", userId],
    });
  });

  afterAll(async () => {
    await pool.query({
      text: "DELETE FROM comments WHERE thread_id = $1",
      values: [threadId],
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

  it("should persist and soft delete a comment", async () => {
    const repository = new CommentRepositoryPostgres(pool, () => "generated");
    const addedComment = await repository.addComment(threadId, {
      content: "comment",
      owner: userId,
    });

    await repository.deleteComment(threadId, addedComment.id);
    const comments = await repository.getComments(threadId);

    expect(addedComment.content).toEqual("comment");
    expect(comments[0].content).toEqual("**komentar telah dihapus**");
  });

  it("should reject an unknown comment", async () => {
    const repository = new CommentRepositoryPostgres(pool, () => "generated");

    await expect(
      repository.verifyComment(threadId, "unknown-comment"),
    ).rejects.toThrowError("komentar tidak ditemukan");
  });
});
