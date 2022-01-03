import { Router } from "express";
import { Model } from "mongoose";
import { CommunityQuestionDocument } from "../../models/community/communityQuestion";

export default (CommunityQuestion: Model<CommunityQuestionDocument>) => {
    let router = Router();

    return router;
}