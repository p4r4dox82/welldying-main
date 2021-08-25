import { Schema, Document } from "mongoose";

export interface ContentType {
    id: number;
    type: string;
    title: string;
    category: number;
    likes: number;
    tag: string;
    comments: number[];
};

export type ContentDocument = Document & ContentType;

export const contentSchema = new Schema<ContentDocument>({
    id: { type: Number, unique: true, required: true},
    type: String,
    title: String,
    category: Number,
    likes: Number,
    tag: String,
    comments: [Number], 
});
