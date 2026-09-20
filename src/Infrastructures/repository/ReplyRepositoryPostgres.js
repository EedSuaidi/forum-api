import ReplyRepository from "../../Domains/replies/ReplyRepository.js";
import NotFoundError from "../../Commons/exceptions/NotFoundError.js";

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(commentId, newReply) {
    const { content, owner } = newReply;
    const id = `reply-${this._idGenerator()}`;
    const result = await this._pool.query({
      text: "INSERT INTO replies (id, comment_id, content, owner) VALUES($1, $2, $3, $4) RETURNING id, content, owner",
      values: [id, commentId, content, owner],
    });
    return result.rows[0];
  }

  async getReplyOwner(commentId, replyId) {
    const result = await this._pool.query({
      text: "SELECT owner FROM replies WHERE id = $1 AND comment_id = $2",
      values: [replyId, commentId],
    });
    if (!result.rowCount) throw new NotFoundError("balasan tidak ditemukan");
    return result.rows[0].owner;
  }

  async deleteReply(commentId, replyId) {
    await this._pool.query({
      text: "UPDATE replies SET is_delete = TRUE WHERE id = $1 AND comment_id = $2",
      values: [replyId, commentId],
    });
  }

  async getReplies(commentId) {
    const result = await this._pool.query({
      text: `SELECT r.id, r.date, r.content, r.is_delete,
        u.username
        FROM replies r
        INNER JOIN users u ON u.id = r.owner
        WHERE r.comment_id = $1
        ORDER BY r.date ASC`,
      values: [commentId],
    });
    return result.rows;
  }
}

export default ReplyRepositoryPostgres;
