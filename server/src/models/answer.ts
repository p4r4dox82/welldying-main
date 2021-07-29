import { Schema, Document } from "mongoose";

export interface AnswerType {
    username: string;
    contentId: number;
    message: string;
    length: string;
    isChecked?: boolean;
    updatedAt: number;
};

export type AnswerDocument = Document & AnswerType;

export const answerSchema = new Schema<AnswerDocument>({
    username: String,
    contentId: Number,
    message: String,    
    length: Number,
    isChecked: Boolean,
    updatedAt: { type: Number, default: new Date(), }
});

answerSchema.index({username: true, contentId: true}, {unique: true});