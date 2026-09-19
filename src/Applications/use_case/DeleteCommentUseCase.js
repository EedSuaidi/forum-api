class DeleteCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(threadId, commentId, owner) {
    await this._threadRepository.verifyThread(threadId);
    const commentOwner = await this._commentRepository.getCommentOwner(
      threadId,
      commentId,
    );

    if (commentOwner !== owner) {
      throw new Error("DELETE_COMMENT.NOT_OWNER");
    }

    await this._commentRepository.deleteComment(threadId, commentId);
  }
}

export default DeleteCommentUseCase;
