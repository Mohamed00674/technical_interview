import { Router, Response } from 'express';

import * as blogService from './blog.service';
import { authenticate, authorizeRoles } from '../../middlewares/auth';
import { withTryCatchRoutePromise as handlePromise } from '../../middlewares/promise';
import commentRoutes from './comment/comment.routes';
import { fetchingRateLimit, modificationRateLimit } from '../../utils/limiting';

const blogRoutes = Router();

blogRoutes.get(
    '/get',
    fetchingRateLimit,
    handlePromise((req, res) => {
        return blogService.fetchAllBlogs(req.query);
    }),
);

blogRoutes.get(
    '/get/:id',
    fetchingRateLimit,
    handlePromise((req, res) => {
        return blogService.fetchBlogById(req.params.id);
    }),
);

blogRoutes.post(
    '/add',
    modificationRateLimit,
    authenticate,
    authorizeRoles('creator'),
    handlePromise(
        (req, res) => {
            const user = req.user!;
            const title = req.body?.title;
            const content = req.body?.content;
            const image = req.body?.image;
            const tags = req.body?.tags;

            return blogService.addBlogPost({
                title,
                content,
                image,
                tags,
                author: user.id,
            });
        },
        {
            showSuccessMessage: true,
            successMessage: 'Blog created successfully',
            returnResultAsData: false,
        },
    ),
);

blogRoutes.put(
    '/edit/:id',
    modificationRateLimit,
    authenticate,
    authorizeRoles('creator', 'editor'),
    handlePromise(
        (req, res) => {
            const user = req.user!;
            return blogService.editBlogPost(
                req.params.id,
                user.id,
                user.roles,
                req.body,
            );
        },
        {
            showSuccessMessage: true,
            successMessage: 'Blog updated successfully',
            returnResultAsData: false,
        },
    ),
);

blogRoutes.delete(
    '/delete/:id',
    modificationRateLimit,
    authenticate,
    authorizeRoles('admin'),
    handlePromise(
        (req, res) => {
            return blogService.deleteBlogPost(req.params.id);
        },
        {
            showSuccessMessage: true,
            successMessage: 'Blog deleted successfully',
            returnResultAsData: false,
        },
    ),
);

const rootBlogRoutes = Router();

rootBlogRoutes.use('/', blogRoutes);
rootBlogRoutes.use('/:blogId/comment', commentRoutes);

export default rootBlogRoutes;
