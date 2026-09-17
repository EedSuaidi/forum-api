class DeleteCommentUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(threadId, commentId, owner) {
    await this._threadRepository.verifyThread(threadId);
    const commentOwner = await this._threadRepository.getCommentOwner(
      threadId,
      commentId,
    );

    if (commentOwner !== owner) {
      throw new Error("DELETE_COMMENT.NOT_OWNER");
    }

    await this._threadRepository.deleteComment(threadId, commentId);
  }
}

export default DeleteCommentUseCase;
