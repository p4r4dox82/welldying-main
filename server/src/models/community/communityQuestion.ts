import { Schema, Document } from "mongoose";

export interface CommunityQuestion {
    id: number,
    username: string,
    question: string,
    tag: string,
    updatedDate: number
}

export type CommunityQuestionDocument = Document & CommunityQuestion;

export const communityQuestionSchema = new Schema<CommunityQuestionDocument>({
    id: Number,
    username: String,
    question: String,
    tag: String,
    updatedDate: Number,
});