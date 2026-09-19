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
      comments.map(async (comment) => ({
        ...comment,
        replies: await this._replyRepository.getReplies(comment.id),
      })),
    );

    return { ...thread, comments: commentsWithReplies };
  }
}

export default GetThreadDetailUseCase;
