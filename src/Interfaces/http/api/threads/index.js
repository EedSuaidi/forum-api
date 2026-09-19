import ThreadsHandler from "./handler.js";
import CommentsHandler from "./commentsHandler.js";
import RepliesHandler from "./repliesHandler.js";
import createThreadsRouter from "./routes.js";

export default (container) => {
  const threadsHandler = new ThreadsHandler(container);
  const commentsHandler = new CommentsHandler(container);
  const repliesHandler = new RepliesHandler(container);
  return createThreadsRouter({
    threadsHandler,
    commentsHandler,
    repliesHandler,
  });
};
