import UsersTableTestHelper from "../../../../tests/UsersTableTestHelper.js";
import pool from "../../database/postgres/pool.js";
import ThreadRepositoryPostgres from "../ThreadRepositoryPostgres.js";

describe("ThreadRepositoryPostgres comments and detail", () => {
  const fixtureId = Date.now().toString();
  const threadId = `thread-test-${fixtureId}`;
  const userId = `user-test-${fixtureId}`;
  const username = `threadtester${fixtureId}`;

  beforeEach(async () => {
    await UsersTableTestHelper.addUser({ id: userId, username });
    await pool.query({
      text: "INSERT INTO threads (id, title, body, owner) VALUES ($1, $2, $3, $4)",
      values: [threadId, "title", "body", userId],
    });
  });

  afterEach(async () => {
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
  });

  afterAll(async () => {
    await pool.end();
  });

  it("should persist comment and return thread detail including deleted content", async () => {
    const repository = new ThreadRepositoryPostgres(pool, () => "generated");
    const addedComment = await repository.addComment(threadId, {
      content: "comment",
      owner: userId,
    });
    await repository.deleteComment(threadId, addedComment.id);
    const detail = await repository.getThreadDetail(threadId);

    expect(addedComment.content).toEqual("comment");
    expect(detail.comments[0].content).toEqual("**komentar telah dihapus**");
  });

  it("should reject an unknown thread", async () => {
    const repository = new ThreadRepositoryPostgres(pool, () => "generated");

    await expect(
      repository.verifyThread("unknown-thread"),
    ).rejects.toThrowError("thread tidak ditemukan");
  });
});
