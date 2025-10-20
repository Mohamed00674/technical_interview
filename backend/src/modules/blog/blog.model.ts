import { Schema, model, Document, Types } from 'mongoose';

export interface IBlog extends Document {
    title: string;
    content: string;
    image: string;
    tags: string[];
    author: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const BlogSchema = new Schema<IBlog>(
    {
        title: { type: String, required: true, trim: true },
        content: { type: String, required: true },
        image: { type: String, default: null },
        tags: { type: [String], default: [] },
        author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    },
    { timestamps: true },
);

export const Blog = model<IBlog>('Blog', BlogSchema);
