import AddCommentUseCase from "../../../../Applications/use_case/AddCommentUseCase.js";
import DeleteCommentUseCase from "../../../../Applications/use_case/DeleteCommentUseCase.js";
import getAuthenticatedUser from "./getAuthenticatedUser.js";

class CommentsHandler {
  constructor(container) {
    this._container = container;

    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
  }

  async postCommentHandler(req, res, next) {
    try {
      const owner = await getAuthenticatedUser(this._container, req);
      const addCommentUseCase = this._container.getInstance(
        AddCommentUseCase.name,
      );
      const addedComment = await addCommentUseCase.execute(
        req.params.threadId,
        {
          ...req.body,
          owner,
        },
      );

      res.status(201).json({
        status: "success",
        data: { addedComment },
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteCommentHandler(req, res, next) {
    try {
      const owner = await getAuthenticatedUser(this._container, req);
      const deleteCommentUseCase = this._container.getInstance(
        DeleteCommentUseCase.name,
      );
      await deleteCommentUseCase.execute(
        req.params.threadId,
        req.params.commentId,
        owner,
      );

      res.status(200).json({ status: "success" });
    } catch (error) {
      next(error);
    }
  }
}

export default CommentsHandler;
