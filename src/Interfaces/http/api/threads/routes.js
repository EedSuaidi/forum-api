import express from "express";

const createThreadsRouter = (handler) => {
  const router = express.Router();

  router.post("/", handler.postThreadHandler);
  router.post("/:threadId/comments", handler.postCommentHandler);
  router.delete("/:threadId/comments/:commentId", handler.deleteCommentHandler);
  router.post(
    "/:threadId/comments/:commentId/replies",
    handler.postReplyHandler,
  );
  router.delete(
    "/:threadId/comments/:commentId/replies/:replyId",
    handler.deleteReplyHandler,
  );
  router.get("/:threadId", handler.getThreadDetailHandler);

  return router;
};

export default createThreadsRouter;
