import NewReply from "../../Domains/threads/entities/NewReply.js";

class AddReplyUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(threadId, commentId, useCasePayload) {
    await this._threadRepository.verifyComment(threadId, commentId);
    const newReply = new NewReply(useCasePayload);
    return this._threadRepository.addReply(commentId, newReply);
  }
}

export default AddReplyUseCase;
