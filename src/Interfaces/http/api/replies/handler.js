import AddReplyUseCase from "../../../../Applications/use_case/AddReplyUseCase.js";
import DeleteReplyUseCase from "../../../../Applications/use_case/DeleteReplyUseCase.js";
import getAuthenticatedUser from "../threads/getAuthenticatedUser.js";

class RepliesHandler {
  constructor(container) {
    this._container = container;

    this.postReplyHandler = this.postReplyHandler.bind(this);
    this.deleteReplyHandler = this.deleteReplyHandler.bind(this);
  }

  async postReplyHandler(req, res, next) {
    try {
      const owner = await getAuthenticatedUser(this._container, req);
      const addReplyUseCase = this._container.getInstance(AddReplyUseCase.name);
      const addedReply = await addReplyUseCase.execute(
        req.params.threadId,
        req.params.commentId,
        { ...req.body, owner },
      );

      res.status(201).json({
        status: "success",
        data: { addedReply },
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteReplyHandler(req, res, next) {
    try {
      const owner = await getAuthenticatedUser(this._container, req);
      const deleteReplyUseCase = this._container.getInstance(
        DeleteReplyUseCase.name,
      );
      await deleteReplyUseCase.execute(
        req.params.threadId,
        req.params.commentId,
        req.params.replyId,
        owner,
      );

      res.status(200).json({ status: "success" });
    } catch (error) {
      next(error);
    }
  }
}

export default RepliesHandler;