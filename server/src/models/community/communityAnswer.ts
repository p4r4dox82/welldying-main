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
    username: string,
    questionId: number,
    commentIds: number[],
    updatedDate: number,
    answerData: AnswerData,
    emotions: Emotion[],
    views: string[],
    bookmarks: string[],
    upload: string
}

export type CommunityAnswerDocument = Document & CommunityAnswer;

export const communityAnswerSchema = new Schema<CommunityAnswerDocument>({
    username: String,
    questionId: Number,
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
    bookmarks: [String],
    uplaod: String
});