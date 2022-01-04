import { Schema, Document } from "mongoose";

export interface AnswerData {
    imageUri: string,
    answer: string,
    title: string,
}

export interface Emotion {
    emotion: string,
    usernames: string[]
}

export interface CommunityAnswer {
    id: number,
    username: string,
    commentIds: number[],
    updatedDate: number,
    answerData: AnswerData,
    emotions: Emotion[],
    views: string[],
    upload: string
}

export type CommunityAnswerDocument = Document & CommunityAnswer;

export const communityAnswerSchema = new Schema<CommunityAnswerDocument>({
    id: Number,
    username: String,
    commentIds: [Number],
    updatedDate: Number,
    answerData: {
        imageUri: String,
        answer: String,
        title: String,
    },
    emotions: [{
        emotion: String,
        usernames: [String]
    }],
    views: [String],
    uplaod: String
});