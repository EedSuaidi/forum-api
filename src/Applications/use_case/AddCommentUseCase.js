import NewComment from "../../Domains/threads/entities/NewComment.js";

class AddCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(threadId, useCasePayload) {
    await this._threadRepository.verifyThread(threadId);
    const newComment = new NewComment(useCasePayload);
    return this._commentRepository.addComment(threadId, newComment);
  }
}

export default AddCommentUseCase;
