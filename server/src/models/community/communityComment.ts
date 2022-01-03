import { Schema, Document } from "mongoose";
import { Emotion } from "./communityAnswer";

export interface CommunityComment {
    id: number,
    userId: string,
    comment: string,
    emotions: Emotion[],
    recomments: CommunityComment[],
}

export type CommunityCommentDocument = Document & CommunityComment;

export const communityCommentSchema = new Schema<CommunityCommentDocument>({
    id: Number,
    userId: String,
    comment: String,
    emotions: [{
        emotion: String,
        number: Number
    }],
    recommentIds: [Number],
});