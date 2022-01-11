import { Router } from "express";
import { Model } from "mongoose";
import { CommunityRecommentDocument } from "../../models/community/communityRecomment";

export default (CommunityRecomment: Model<CommunityRecommentDocument>) => {
    let router = Router();

    return router;
}