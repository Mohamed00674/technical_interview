import { Types } from 'mongoose';

import { Comment, IReply } from './comment.model';
import { io } from '../../../server';
import { handleCatch, ERROR_MAP } from '../../../middlewares/errorHandler';
import { PaginationOptions } from '../../../types/pagination';

export const fetchComments = async (
    blogId: string,
    { page = 1, limit = 10 }: PaginationOptions = {},
) => {
    try {
        const skip = (page - 1) * limit;

        const [comments, totalComments] = await Promise.all([
            Comment.find({ blog: blogId })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('author', 'username avatar') // populate author info
                .lean(),
            Comment.countDocuments({ blog: blogId }),
        ]);

        const result = comments.map((c) => ({
            ...c,
            repliesCount: c.replies?.length || 0,
            replies: undefined, // remove actual replies to avoid heavy payload
        }));

        return {
            comments: result,
            page,
            limit,
            totalComments,
        };
    } catch (err) {
        throw handleCatch(err);
    }
};

// Fetch paginated replies for a specific comment
export const fetchReplies = async (
    blogId: string,
    commentId: string,
    { page = 1, limit = 5 }: PaginationOptions = {},
) => {
    try {
        const comment = await Comment.findById(commentId).lean();

        if (!comment)
            throw {
                ...ERROR_MAP.NOT_FOUND,
                message: `Comment '${commentId}' not found.`,
            };

        if (blogId && comment.blog && comment.blog.toString() !== blogId) {
            throw {
                ...ERROR_MAP.NOT_FOUND,
                message: `Comment '${commentId}' does not belong to blog '${blogId}'.`,
            };
        }

        const start = (page - 1) * limit;
        const end = start + limit;

        const replies = comment.replies?.slice(start, end) || [];

        return {
            replies,
            page,
            limit,
            totalReplies: comment.replies?.length || 0,
        };
    } catch (err) {
        throw handleCatch(err);
    }
};

// Add a new comment to a blog
export const addComment = async (
    blogId: string,
    userId: string,
    content: string,
) => {
    try {
        const newComment = await Comment.create({
            blog: blogId,
            author: userId,
            content,
            replies: [],
        });

        io.to(blogId).emit('newComment', newComment);

        return newComment;
    } catch (err) {
        throw handleCatch(err);
    }
};

// Reply to a comment (or a nested reply)
export const replyToComment = async (
    commentId: string,
    userId: string,
    content: string,
    /**
     * Imagine this hierarchy:

        Comment A
        ├── Reply 1
        │     └── Reply 2
        │           └── Reply 3

     * If you want to reply to Reply 2, you need to tell the backend:

        "Inside Comment A → go to Reply 1 → then inside that go to Reply 2 → and insert my new reply there."

     * So the parentReplyIds array would look like this:

        parentReplyIds = ["reply1_id", "reply2_id"];
     *
     */
    parentReplyIds: string[] = [],
    blogId: string,
) => {
    try {
        const comment = await Comment.findById(commentId);

        if (!comment)
            throw {
                ...ERROR_MAP.NOT_FOUND,
                message: `Comment '${commentId}' not found.`,
            };

        if (blogId && comment.blog && comment.blog.toString() !== blogId) {
            throw {
                ...ERROR_MAP.NOT_FOUND,
                message: `Comment '${commentId}' does not belong to blog '${blogId}'.`,
            };
        }

        const newReply = {
            _id: new Types.ObjectId(),
            author: userId,
            content,
            replies: [],
            createdAt: new Date(),
        };

        if (parentReplyIds && parentReplyIds.length > 0) {
            // find the deepest nested reply target
            let currentLevel = comment.replies;

            for (const replyId of parentReplyIds) {
                const nextReply = currentLevel.find(
                    (r: any) => r._id.toString() === replyId,
                );

                if (!nextReply) throw new Error('Invalid reply nesting path');

                currentLevel = nextReply.replies ?? [];
            }

            currentLevel.push(newReply as unknown as IReply);
        } else {
            comment.replies.push(newReply as unknown as IReply);
        }

        await comment.save();

        const _blogId = comment.blog.toString();
        io.to(_blogId).emit('newReply', {
            commentId,
            newReply,
            parentReplyIds,
        });

        return newReply;
    } catch (err) {
        throw handleCatch(err);
    }
};
