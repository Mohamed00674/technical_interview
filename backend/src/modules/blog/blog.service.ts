import { Blog } from "./blog.model";
import { handleCatch, ERROR_MAP } from "../../middlewares/errorHandler";
import { UserRole } from "../user/user.model";
import { CacheService } from "../../utils/cache";
import { PaginationWithSearchOptions } from "../../types/pagination-with-search";

export const fetchAllBlogs = async ({
  page = 1,
  limit = 10,
  search = "",
}: PaginationWithSearchOptions = {}) => {
  try {
    const cacheKey = `blogs:page=${page}:limit=${limit}:search=${search}`;

    const cached = await CacheService.get(cacheKey);
    if (cached) return cached;

    const filter = search ? { title: { $regex: search, $options: "i" } } : {};

    const blogs = await Blog.find(filter)
      .populate("author", "username fullname avatar") // only author, no comments
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    await CacheService.set(cacheKey, blogs, "ONE_MINUTES");
    return blogs;
  } catch (err) {
    throw handleCatch(err);
  }
};

export const fetchBlogById = async (id: string) => {
  try {
    const cacheKey = `blog:${id}`;
    const cached = await CacheService.get(cacheKey);
    if (cached) return cached;

    const blog = await Blog.findById(id)
      .select("-comments")
      .populate("author", "username fullname avatar")
      .lean();

    if (!blog) throw ERROR_MAP.NOT_FOUND;

    await CacheService.set(cacheKey, blog, "ONE_MINUTES");
    return blog;
  } catch (err) {
    throw handleCatch(err);
  }
};

export const addBlogPost = async (data: {
  title: string;
  content: string;
  image?: string;
  tags?: string[];
  author: string;
}) => {
  try {
    const blog = await Blog.create({
      title: data.title,
      content: data.content,
      image: data.image,
      tags: data.tags,
      author: data.author,
    });

    return blog;
  } catch (err) {
    throw handleCatch(err);
  }
};

export const editBlogPost = async (
  blogId: string,
  userId: string,
  roles: UserRole[],
  updates: any
) => {
  try {
    const blog = await Blog.findById(blogId);

    if (!blog)
      throw {
        ...ERROR_MAP.NOT_FOUND,
        message: `Blog post '${blogId}' not found.`,
      };

    // Only Admin/Editor can edit any blog, Creator can only edit their own
    if (
      roles.includes("creator") &&
      !roles.includes("editor") &&
      blog.author.toString() !== userId
    ) {
      throw ERROR_MAP.UNAUTHORIZED;
    }

    Object.assign(blog, updates);
    await blog.save();

    // Clear blog cache after edit
    await CacheService.clear(`blog:${blogId}`);

    return blog;
  } catch (err) {
    throw handleCatch(err);
  }
};

export const deleteBlogPost = async (blogId: string) => {
  try {
    const blog = await Blog.findByIdAndDelete(blogId);

    if (!blog)
      throw {
        ...ERROR_MAP.NOT_FOUND,
        message: `Blog post '${blogId}' not found.`,
      };

    // Clear blog cache
    await CacheService.clear(`blog:${blogId}`);

    return blog;
  } catch (err) {
    throw handleCatch(err);
  }
};
