import UsersTableTestHelper from "../../../../tests/UsersTableTestHelper.js";
import pool from "../../database/postgres/pool.js";
import ThreadRepositoryPostgres from "../ThreadRepositoryPostgres.js";

describe("ThreadRepositoryPostgres", () => {
  const fixtureId = Date.now().toString();
  const threadId = `thread-test-${fixtureId}`;
  const userId = `user-test-${fixtureId}`;
  const username = `threadtester${fixtureId}`;

  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ id: userId, username });
    await pool.query({
      text: "INSERT INTO threads (id, title, body, owner) VALUES ($1, $2, $3, $4)",
      values: [threadId, "title", "body", userId],
    });
  });

  afterAll(async () => {
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

  it("should return thread detail without comments", async () => {
    const repository = new ThreadRepositoryPostgres(pool, () => "generated");

    await expect(repository.getThreadDetail(threadId)).resolves.toMatchObject({
      id: threadId,
      title: "title",
      body: "body",
      username,
    });
  });

  it("should reject an unknown thread", async () => {
    const repository = new ThreadRepositoryPostgres(pool, () => "generated");

    await expect(
      repository.verifyThread("unknown-thread"),
    ).rejects.toThrowError("thread tidak ditemukan");
  });
});
