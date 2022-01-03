import { Schema, Document } from "mongoose";

export interface CommunityQuestion {
    id: number,
    question: string,
    tag: string,
}

export type CommunityQuestionDocument = Document & CommunityQuestion;

export const communityQuestionSchema = new Schema<CommunityQuestionDocument>({
    id: Number,
    question: String,
    tag: String,
});