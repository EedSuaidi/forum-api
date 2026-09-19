import express from "express";

const createThreadsRouter = ({
  threadsHandler,
  commentsHandler,
  repliesHandler,
}) => {
  const router = express.Router();

  router.post("/", threadsHandler.postThreadHandler);
  router.post("/:threadId/comments", commentsHandler.postCommentHandler);
  router.delete(
    "/:threadId/comments/:commentId",
    commentsHandler.deleteCommentHandler,
  );
  router.post(
    "/:threadId/comments/:commentId/replies",
    repliesHandler.postReplyHandler,
  );
  router.delete(
    "/:threadId/comments/:commentId/replies/:replyId",
    repliesHandler.deleteReplyHandler,
  );
  router.get("/:threadId", threadsHandler.getThreadDetailHandler);

  return router;
};

export default createThreadsRouter;
