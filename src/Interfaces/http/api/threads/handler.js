import AddThreadUseCase from "../../../../Applications/use_case/AddThreadUseCase.js";
import AddCommentUseCase from "../../../../Applications/use_case/AddCommentUseCase.js";
import DeleteCommentUseCase from "../../../../Applications/use_case/DeleteCommentUseCase.js";
import GetThreadDetailUseCase from "../../../../Applications/use_case/GetThreadDetailUseCase.js";
import AddReplyUseCase from "../../../../Applications/use_case/AddReplyUseCase.js";
import DeleteReplyUseCase from "../../../../Applications/use_case/DeleteReplyUseCase.js";
import AuthenticationTokenManager from "../../../../Applications/security/AuthenticationTokenManager.js";
import AuthenticationError from "../../../../Commons/exceptions/AuthenticationError.js";

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
    this.getThreadDetailHandler = this.getThreadDetailHandler.bind(this);
    this.postReplyHandler = this.postReplyHandler.bind(this);
    this.deleteReplyHandler = this.deleteReplyHandler.bind(this);
  }

  async _getAuthenticatedUser(req) {
    const authorization = req.headers.authorization;
    if (!authorization || !authorization.startsWith("Bearer ")) {
      throw new AuthenticationError("Missing authentication");
    }

    const tokenManager = this._container.getInstance(
      AuthenticationTokenManager.name,
    );
    const accessToken = authorization.substring(7);
    await tokenManager.verifyAccessToken(accessToken);
    const { id } = await tokenManager.decodePayload(accessToken);
    return id;
  }

  async postThreadHandler(req, res, next) {
    try {
      const owner = await this._getAuthenticatedUser(req);

      const addThreadUseCase = this._container.getInstance(
        AddThreadUseCase.name,
      );
      const addedThread = await addThreadUseCase.execute({
        ...req.body,
        owner,
      });

      res.status(201).json({
        status: "success",
        data: {
          addedThread,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async postCommentHandler(req, res, next) {
    try {
      const owner = await this._getAuthenticatedUser(req);
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
      const owner = await this._getAuthenticatedUser(req);
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

  async getThreadDetailHandler(req, res, next) {
    try {
      const getThreadDetailUseCase = this._container.getInstance(
        GetThreadDetailUseCase.name,
      );
      const thread = await getThreadDetailUseCase.execute(req.params.threadId);

      res.status(200).json({
        status: "success",
        data: { thread },
      });
    } catch (error) {
      next(error);
    }
  }

  async postReplyHandler(req, res, next) {
    try {
      const owner = await this._getAuthenticatedUser(req);
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
      const owner = await this._getAuthenticatedUser(req);
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

export default ThreadsHandler;
