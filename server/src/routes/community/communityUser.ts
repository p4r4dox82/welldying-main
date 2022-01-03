import { Router } from "express";
import { Model } from "mongoose";
import { CommunityUserDocument } from "../../models/community/communityUser";

export default (CommunityUser: Model<CommunityUserDocument>) => {
    let router = Router();

    return router;
}