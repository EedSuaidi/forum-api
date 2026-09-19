import NewReply from "../../Domains/threads/entities/NewReply.js";

class AddReplyUseCase {
  constructor({ commentRepository, replyRepository }) {
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(threadId, commentId, useCasePayload) {
    await this._commentRepository.verifyComment(threadId, commentId);
    const newReply = new NewReply(useCasePayload);
    return this._replyRepository.addReply(commentId, newReply);
  }
}

export default AddReplyUseCase;
