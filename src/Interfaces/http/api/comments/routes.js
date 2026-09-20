import express from "express";

const createCommentsRouter = (commentsHandler) => {
  const router = express.Router();

  router.post("/:threadId/comments", commentsHandler.postCommentHandler);
  router.delete(
    "/:threadId/comments/:commentId",
    commentsHandler.deleteCommentHandler,
  );

  return router;
};

export default createCommentsRouter;
