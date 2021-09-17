import { Schema, Document } from "mongoose";

export interface imageData {
    imageUrl: string;
    cropX: number;
    cropY: number;
}

export interface ContentType {
    id: number;
    title: string;
    type: string;
    category: number[];
    userdata: { likes: string[]; bookmark: string[]; read: string[]; };
    tag: string;
    date: number;
    source: string;
    detail: { summary: string; oneline: string; };
    comments: number[];
    question: number;
    imageData: imageData;
};

export type ContentDocument = Document & ContentType;

export const contentSchema = new Schema<ContentDocument>({
    id: { type: Number, unique: true, required: true},
    title: String,
    type: String,
    category: [Number],
    userdata: { likes: [String], bookmark: [String], read: [String], },
    tag: String,
    date: { type: Number, default: new Date(), },
    source: String,
    detail: { summary: String, oneline: String },
    comments: [Number],
    question: Number,
    imageData: { imageUrl: String, cropX: Number, cropY: Number },
});
