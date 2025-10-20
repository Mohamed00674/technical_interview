import { Schema, model, Document, Types } from 'mongoose';

export interface IReply {
    _id?: Types.ObjectId;
    author: Types.ObjectId;
    content: string;
    createdAt?: Date;
    replies?: IReply[]; // nested replies
}

export interface IComment extends Document {
    blog: Types.ObjectId;
    author: Types.ObjectId;
    content: string;
    replies: IReply[];
    createdAt: Date;
    updatedAt: Date;
}

const ReplySchema = new Schema<IReply>(
    {
        author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        content: { type: String, required: true, trim: true },
        replies: {
            type: [
                /* recursive placeholder */
            ],
            default: [],
        },
        createdAt: { type: Date, default: Date.now },
    },
    { _id: true }, // each reply has its own _id
);

ReplySchema.add({
    replies: [ReplySchema],
});

const CommentSchema = new Schema<IComment>(
    {
        blog: { type: Schema.Types.ObjectId, ref: 'Blog', required: true },
        author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        content: { type: String, required: true, trim: true },
        replies: { type: [ReplySchema], default: [] },
    },
    { timestamps: true },
);

export const Comment = model<IComment>('Comment', CommentSchema);
