import { Schema, Document } from "mongoose";

export interface AnswerType {
    username: string;
    questionId: number;
    message: string;
    length: string;
    isChecked?: boolean;
    updatedAt: number;
    imageData: { imageUrl: string, cropX: number, cropY: number };
    book: number;
};

export type AnswerDocument = Document & AnswerType;

export const answerSchema = new Schema<AnswerDocument>({
    username: String,
    questionId: Number,
    message: String,
    length: Number,
    isChecked: Boolean,
    updatedAt: { type: Number, default: new Date(), },
    imageData: { imageUrl: String, cropX: Number, cropY: Number },
    book: Number,
});

answerSchema.index({username: true, questionId: true}, {unique: true});
