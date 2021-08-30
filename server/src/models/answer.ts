import { Schema, Document } from "mongoose";

export interface AnswerType {
    username: string;
    questionId: number;
    message: string;
    length: string;
    isChecked?: boolean;
    updatedAt: number;
    imageUrl: string;
};

export type AnswerDocument = Document & AnswerType;

export const answerSchema = new Schema<AnswerDocument>({
    username: String,
    questionId: Number,
    message: String,
    length: Number,
    isChecked: Boolean,
    updatedAt: { type: Number, default: new Date(), },
    imageUrl: String,
});

answerSchema.index({username: true, questionId: true}, {unique: true});
