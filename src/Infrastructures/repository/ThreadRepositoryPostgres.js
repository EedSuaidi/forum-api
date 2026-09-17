import ThreadRepository from "../../Domains/threads/ThreadRepository.js";
import NotFoundError from "../../Commons/exceptions/NotFoundError.js";

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(newThread) {
    const { title, body, owner } = newThread;
    const id = `thread-${this._idGenerator()}`;

    const query = {
      text: "INSERT INTO threads VALUES($1, $2, $3, $4) RETURNING id, title, owner",
      values: [id, title, body, owner],
    };

    const result = await this._pool.query(query);
    return result.rows[0];
  }

  async verifyThread(threadId) {
    const query = {
      text: "SELECT id FROM threads WHERE id = $1",
      values: [threadId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError("thread tidak ditemukan");
    }
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
    const query = {
      text: "SELECT owner FROM comments WHERE id = $1 AND thread_id = $2",
      values: [commentId, threadId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError("komentar tidak ditemukan");
    }

    return result.rows[0].owner;
  }

  async verifyComment(threadId, commentId) {
    const query = {
      text: "SELECT id FROM comments WHERE id = $1 AND thread_id = $2",
      values: [commentId, threadId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError("komentar tidak ditemukan");
    }
  }

  async deleteComment(threadId, commentId) {
    const query = {
      text: "UPDATE comments SET is_delete = TRUE WHERE id = $1 AND thread_id = $2",
      values: [commentId, threadId],
    };

    await this._pool.query(query);
  }

  async addReply(commentId, newReply) {
    const { content, owner } = newReply;
    const id = `reply-${this._idGenerator()}`;

    const query = {
      text: "INSERT INTO replies (id, comment_id, content, owner) VALUES($1, $2, $3, $4) RETURNING id, content, owner",
      values: [id, commentId, content, owner],
    };

    const result = await this._pool.query(query);
    return result.rows[0];
  }

  async getReplyOwner(commentId, replyId) {
    const query = {
      text: "SELECT owner FROM replies WHERE id = $1 AND comment_id = $2",
      values: [replyId, commentId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError("balasan tidak ditemukan");
    }

    return result.rows[0].owner;
  }

  async deleteReply(commentId, replyId) {
    const query = {
      text: "UPDATE replies SET is_delete = TRUE WHERE id = $1 AND comment_id = $2",
      values: [replyId, commentId],
    };

    await this._pool.query(query);
  }

  async getThreadDetail(threadId) {
    const query = {
      text: `SELECT
        t.id,
        t.title,
        t.body,
        t.created_at AS date,
        u.username,
        c.id AS comment_id,
        cu.username AS comment_username,
        c.date AS comment_date,
        c.content AS comment_content,
        c.is_delete AS comment_is_delete,
        r.id AS reply_id,
        r.content AS reply_content,
        r.date AS reply_date,
        r.is_delete AS reply_is_delete,
        ru.username AS reply_username
      FROM threads t
      INNER JOIN users u ON u.id = t.owner
      LEFT JOIN comments c ON c.thread_id = t.id
      LEFT JOIN users cu ON cu.id = c.owner
      LEFT JOIN replies r ON r.comment_id = c.id
      LEFT JOIN users ru ON ru.id = r.owner
      WHERE t.id = $1
      ORDER BY c.date ASC, r.date ASC`,
      values: [threadId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError("thread tidak ditemukan");
    }

    const [threadRow] = result.rows;
    const comments = new Map();
    result.rows.forEach((row) => {
      if (!row.comment_id) return;

      if (!comments.has(row.comment_id)) {
        comments.set(row.comment_id, {
          id: row.comment_id,
          username: row.comment_username,
          date: row.comment_date,
          replies: [],
          content: row.comment_is_delete
            ? "**komentar telah dihapus**"
            : row.comment_content,
        });
      }

      if (row.reply_id) {
        comments.get(row.comment_id).replies.push({
          id: row.reply_id,
          content: row.reply_is_delete
            ? "**balasan telah dihapus**"
            : row.reply_content,
          date: row.reply_date,
          username: row.reply_username,
        });
      }
    });

    return {
      id: threadRow.id,
      title: threadRow.title,
      body: threadRow.body,
      date: threadRow.date,
      username: threadRow.username,
      comments: [...comments.values()],
    };
  }
}

export default ThreadRepositoryPostgres;
