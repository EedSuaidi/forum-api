class GetThreadDetailUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(threadId) {
    const thread = await this._threadRepository.getThreadDetail(threadId);
    const comments = await this._commentRepository.getComments(threadId);

    const commentsWithReplies = await Promise.all(
      comments.map(async (comment) => {
        const { is_delete: isCommentDeleted, ...commentData } = comment;
        const replies = await this._replyRepository.getReplies(comment.id);

        return {
          ...commentData,
          content: isCommentDeleted
            ? "**komentar telah dihapus**"
            : commentData.content,
          replies: replies.map((reply) => {
            const { is_delete: isReplyDeleted, ...replyData } = reply;

            return {
              ...replyData,
              content: isReplyDeleted
                ? "**balasan telah dihapus**"
                : replyData.content,
            };
          }),
        };
      }),
    );

    return { ...thread, comments: commentsWithReplies };
  }
}

export default GetThreadDetailUseCase;
