import { Schema, Document } from "mongoose";
import { Emotion } from "./communityAnswer";

export interface CommunityRecomment {
    id: number,
    username: string,
    commentId: number,
    recomment: string,
}

export type CommunityRecommentDocument = Document & CommunityRecomment;

export const communityRecommentSchema = new Schema<CommunityRecommentDocument>({
    id: Number,
    username: String,
    commentId: Number,
    recomment: String,
});