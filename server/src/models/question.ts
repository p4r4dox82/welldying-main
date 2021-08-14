import { Schema, Document } from "mongoose";

export interface QuestionType {
    id: number;
    type: 'question' | 'post';
    title: string;
    message: string;
    placeholder: string;
};

export type QuestionDocument = Document & QuestionType;

export const questionSchema = new Schema<QuestionDocument>({
    id: { type: Number, unique: true, required: true},
    type: { type: String, required: true},
    title: String,
    message: String,
    placeholder: String,
});
