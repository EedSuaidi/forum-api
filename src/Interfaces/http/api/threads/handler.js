import AddThreadUseCase from "../../../../Applications/use_case/AddThreadUseCase.js";
import GetThreadDetailUseCase from "../../../../Applications/use_case/GetThreadDetailUseCase.js";
import getAuthenticatedUser from "./getAuthenticatedUser.js";

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getThreadDetailHandler = this.getThreadDetailHandler.bind(this);
  }

  async postThreadHandler(req, res, next) {
    try {
      const owner = await getAuthenticatedUser(this._container, req);
      const addThreadUseCase = this._container.getInstance(
        AddThreadUseCase.name,
      );
      const addedThread = await addThreadUseCase.execute({
        ...req.body,
        owner,
      });

      res.status(201).json({
        status: "success",
        data: { addedThread },
      });
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
}

export default ThreadsHandler;
