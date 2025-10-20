import { Router } from "express";

import { authenticate, authorizeRoles } from "../../../middlewares/auth";
import { withTryCatchRoutePromise as handlePromise } from "../../../middlewares/promise";
import * as commentService from "./comment.service";
import {
  commentReplyRateLimit,
  fetchingRateLimit,
  modificationRateLimit,
} from "../../../utils/limiting";

const commentRoutes = Router({ mergeParams: true });

commentRoutes.get(
  "/",
  fetchingRateLimit,
  handlePromise((req, res) => {
    const { blogId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    return commentService.fetchComments(blogId, { page, limit });
  })
);

commentRoutes.get(
  "/:commentId/replies",
  fetchingRateLimit,
  handlePromise((req, res) => {
    const { blogId, commentId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 5;

    return commentService.fetchReplies(blogId, commentId, { page, limit });
  })
);

commentRoutes.post(
  "/add",
  modificationRateLimit,
  authenticate,
  authorizeRoles("creator", "editor"),
  handlePromise(
    (req, res) => {
      const user = req.user!;
      const { content } = req.body;
      const { blogId } = req.params;

      return commentService.addComment(blogId, user.id, content);
    },
    {
      successMessage: "Comment added successfully",
      showSuccessMessage: true,
      returnResultAsData: false,
    }
  )
);

commentRoutes.post(
  "/:commentId/reply/add",
  commentReplyRateLimit,
  authenticate,
  authorizeRoles("creator", "editor"),
  handlePromise(
    (req, res) => {
      const user = req.user!;
      const { content, parentReplyIds } = req.body;
      const { blogId, commentId } = req.params;

      return commentService.replyToComment(
        commentId,
        user.id,
        content,
        parentReplyIds,
        blogId
      );
    },
    {
      successMessage: "Reply added successfully",
      showSuccessMessage: true,
      returnResultAsData: false,
    }
  )
);

export default commentRoutes;
