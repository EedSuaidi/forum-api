class DeleteReplyUseCase {
  constructor({ commentRepository, replyRepository }) {
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(threadId, commentId, replyId, owner) {
    await this._commentRepository.verifyComment(threadId, commentId);
    const replyOwner = await this._replyRepository.getReplyOwner(
      commentId,
      replyId,
    );

    if (replyOwner !== owner) {
      throw new Error("DELETE_REPLY.NOT_OWNER");
    }

    await this._replyRepository.deleteReply(commentId, replyId);
  }
}

export default DeleteReplyUseCase;
