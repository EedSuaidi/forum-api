import CommentRepository from "../../Domains/comments/CommentRepository.js";
import NotFoundError from "../../Commons/exceptions/NotFoundError.js";

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(threadId, newComment) {
    const { content, owner } = newComment;
    const id = `comment-${this._idGenerator()}`;
    const query = {
      text: "INSERT INTO comments (id, thread_id, content, owner) VALUES($1, $2, $3, $4) RETURNING id, content, owner",
      values: [id, threadId, content, owner],
    };

    const result = await this._pool.query(query);
    return result.rows[0];
  }

  async getCommentOwner(threadId, commentId) {
    const result = await this._pool.query({
      text: "SELECT owner FROM comments WHERE id = $1 AND thread_id = $2",
      values: [commentId, threadId],
    });
    if (!result.rowCount) throw new NotFoundError("komentar tidak ditemukan");
    return result.rows[0].owner;
  }

  async verifyComment(threadId, commentId) {
    const result = await this._pool.query({
      text: "SELECT id FROM comments WHERE id = $1 AND thread_id = $2",
      values: [commentId, threadId],
    });
    if (!result.rowCount) throw new NotFoundError("komentar tidak ditemukan");
  }

  async deleteComment(threadId, commentId) {
    await this._pool.query({
      text: "UPDATE comments SET is_delete = TRUE WHERE id = $1 AND thread_id = $2",
      values: [commentId, threadId],
    });
  }

  async getComments(threadId) {
    const result = await this._pool.query({
      text: `SELECT c.id, c.date, c.content, c.is_delete,
        u.username
        FROM comments c
        INNER JOIN users u ON u.id = c.owner
        WHERE c.thread_id = $1
        ORDER BY c.date ASC`,
      values: [threadId],
    });
    return result.rows.map((comment) => ({
      id: comment.id,
      username: comment.username,
      date: comment.date,
      content: comment.content,
      is_delete: comment.is_delete,
    }));
  }
}

export default CommentRepositoryPostgres;
