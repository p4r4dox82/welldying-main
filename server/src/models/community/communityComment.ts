import { Schema, Document } from "mongoose";
import { Emotion } from "./communityAnswer";

export interface CommunityComment {
    answerUsername: string,
    answerQuestionId: number,
    username: string,
    numbering: number,
    comment: string,
    emotions: Emotion[],
    updatedDate: number
}

export type CommunityCommentDocument = Document & CommunityComment;

export const communityCommentSchema = new Schema<CommunityCommentDocument>({
    answerUsername: String,
    answerQuestionId: Number,
    username: String,
    numbering: Number,
    comment: String,
    emotions: {
        emotion: String,
        usernames: [String]
    },
    updatedDate: Number
});