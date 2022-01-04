import { Router } from "express";
import { Model } from "mongoose";
import { CommunityAnswerDocument } from "../../models/community/communityAnswer";
import { CommunityUserDocument } from "../../models/community/communityUser";
import { onlyAuthCommunityUser } from "./communityUser";

export default (CommunityAnswer: Model<CommunityAnswerDocument>) => {
    let router = Router();

    router.put('/', async (req, res) => {
        const id = Number.parseInt(req.body.id);
        const username = req.body.username;
        const answerData = req.body.answerData;
        const updatedDate = new Date().getTime();
        
        if(!await CommunityAnswer.findOneAndUpdate({ id: id }, {$set: { answerData : answerData, updatedDate: updatedDate }})) {
            console.log("ASD");
            const communityAnswer = new CommunityAnswer({ id: id, username: username, commentsIds: [], updatedDate: updatedDate, answerData: answerData, emotions: [], views: [], upload: "none" });
            communityAnswer.save();
        }

        res.sendStatus(200);
        return;
    })

    
    router.get('/', onlyAuthCommunityUser, async (req, res) => {
        let communityUser = req.communityUser!;
        
        let result = await CommunityAnswer.find().sort({'id': 'asc'});
        res.json(result);
    });

    router.get('/user', onlyAuthCommunityUser, async(req, res) => {
        let communityUser = req.communityUser!;

        let result = await CommunityAnswer.find({ username: communityUser.username }).sort({'id': 'asc'});
        res.json(result);
    })
    
    router.get('/:id', onlyAuthCommunityUser, async(req, res) => {
        let id = Number.parseInt(req.params.id);
        let result = await CommunityAnswer.findOne({ id: id });
        res.json(result);
    })
    

    return router;
}