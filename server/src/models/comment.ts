import { Schema, Document } from "mongoose";

export interface CommentType {
    id: number;
    writer: string;
    detail: string;
    date: number;
    userdata: { likes: string[] };
    declare: string;
};

export type CommentDocument = Document & CommentType;

export const commentSchema = new Schema<CommentDocument>({
    id: { type: Number, unique: true, required: true},
    writer: String,
    detail: String,
    date: Number,
    userdata: {likes: [String] },
    declare: String,
});
