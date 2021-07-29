import { Schema, Document } from "mongoose";

export interface ContentType {
    id: number;
    type: 'question' | 'post';
    title: string;
    message: string;
    placeholder: string;
};

export type ContentDocument = Document & ContentType;

export const contentSchema = new Schema<ContentDocument>({
    id: { type: Number, unique: true, required: true},
    type: { type: String, required: true},
    title: String,
    message: String,    
    placeholder: String,
});