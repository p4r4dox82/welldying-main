import { Router } from "express";
import { Model } from "mongoose";
import { CommunityCommentDocument } from "../../models/community/communityComment";

export default (CommunityComment: Model<CommunityCommentDocument>) => {
    let router = Router();

    return router;
}