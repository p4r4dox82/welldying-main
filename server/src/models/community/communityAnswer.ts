import { Schema, Document } from "mongoose";

export interface AnswerData {
    imageUri: string,
    answer: string
}

export interface Emotion {
    emotion: string,
    number: number,
}

export interface CommunityAnswer {
    id: number,
    userId: string,
    commentIds: number[],
    updatedDate: string,
    answerData: AnswerData,
    emotions: Emotion[],
    views: number,
}

export type CommunityAnswerDocument = Document & CommunityAnswer;

export const communityAnswerSchema = new Schema<CommunityAnswerDocument>({
    id: Number,
    userId: String,
    commentIds: [Number],
    updatedDate: String,
    answerData: {
        imageUri: String,
        answer: String  
    },
    emotions: [{
        emotion: String,
        number: Number,
    }],
    views: Number,
});