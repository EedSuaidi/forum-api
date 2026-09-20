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

  it("should add a comment to database", async () => {
    const repository = new CommentRepositoryPostgres(pool, () => "added");

    const addedComment = await repository.addComment(threadId, {
      content: "added comment",
      owner: userId,
    });

    expect(addedComment).toEqual({
      id: "comment-added",
      content: "added comment",
      owner: userId,
    });
  });

  it("should get comment owner from database", async () => {
    const commentId = `comment-owner-${fixtureId}`;
    await pool.query({
      text: "INSERT INTO comments (id, thread_id, content, owner) VALUES ($1, $2, $3, $4)",
      values: [commentId, threadId, "comment", userId],
    });
    const repository = new CommentRepositoryPostgres(pool, () => "generated");

    await expect(repository.getCommentOwner(threadId, commentId)).resolves.toBe(
      userId,
    );
  });

  it("should verify an existing comment", async () => {
    const commentId = `comment-verify-${fixtureId}`;
    await pool.query({
      text: "INSERT INTO comments (id, thread_id, content, owner) VALUES ($1, $2, $3, $4)",
      values: [commentId, threadId, "comment", userId],
    });
    const repository = new CommentRepositoryPostgres(pool, () => "generated");

    await expect(
      repository.verifyComment(threadId, commentId),
    ).resolves.toBeUndefined();
  });

  it("should persist and soft delete a comment", async () => {
    const repository = new CommentRepositoryPostgres(pool, () => "generated");
    const addedComment = await repository.addComment(threadId, {
      content: "comment",
      owner: userId,
    });

    await expect(
      repository.getCommentOwner(threadId, addedComment.id),
    ).resolves.toBe(userId);
    await expect(
      repository.verifyComment(threadId, addedComment.id),
    ).resolves.toBeUndefined();

    await repository.deleteComment(threadId, addedComment.id);
    const comments = await repository.getComments(threadId);

    expect(addedComment.content).toEqual("comment");
    expect(comments.find(({ id }) => id === addedComment.id)).toEqual({
      id: addedComment.id,
      username,
      date: expect.any(Date),
      content: "comment",
      is_delete: true,
    });
  });

  it("should reject an unknown comment", async () => {
    const repository = new CommentRepositoryPostgres(pool, () => "generated");

    await expect(
      repository.getCommentOwner(threadId, "unknown-comment"),
    ).rejects.toThrowError("komentar tidak ditemukan");
    await expect(
      repository.verifyComment(threadId, "unknown-comment"),
    ).rejects.toThrowError("komentar tidak ditemukan");
  });
});
