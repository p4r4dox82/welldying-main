import { Router } from "express";
import { Model } from "mongoose";
import { CommunityAnswerDocument } from "../../models/community/communityAnswer";

export default (CommunityAnswer: Model<CommunityAnswerDocument>) => {
    let router = Router();

    return router;
}