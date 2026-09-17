class DeleteReplyUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(threadId, commentId, replyId, owner) {
    await this._threadRepository.verifyComment(threadId, commentId);
    const replyOwner = await this._threadRepository.getReplyOwner(
      commentId,
      replyId,
    );

    if (replyOwner !== owner) {
      throw new Error("DELETE_REPLY.NOT_OWNER");
    }

    await this._threadRepository.deleteReply(commentId, replyId);
  }
}

export default DeleteReplyUseCase;
