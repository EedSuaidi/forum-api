import NewComment from "../../Domains/threads/entities/NewComment.js";

class AddCommentUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(threadId, useCasePayload) {
    await this._threadRepository.verifyThread(threadId);
    const newComment = new NewComment(useCasePayload);
    return this._threadRepository.addComment(threadId, newComment);
  }
}

export default AddCommentUseCase;
