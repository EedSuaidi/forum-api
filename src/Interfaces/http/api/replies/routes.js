import express from "express";

const createRepliesRouter = (repliesHandler) => {
  const router = express.Router();

  router.post(
    "/:threadId/comments/:commentId/replies",
    repliesHandler.postReplyHandler,
  );
  router.delete(
    "/:threadId/comments/:commentId/replies/:replyId",
    repliesHandler.deleteReplyHandler,
  );

  return router;
};

export default createRepliesRouter;
