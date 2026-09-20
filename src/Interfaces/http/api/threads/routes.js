import express from "express";

const createThreadsRouter = ({ threadsHandler }) => {
  const router = express.Router();

  router.post("/", threadsHandler.postThreadHandler);
  router.get("/:threadId", threadsHandler.getThreadDetailHandler);

  return router;
};

export default createThreadsRouter;
