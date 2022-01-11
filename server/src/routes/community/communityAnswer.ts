import { Router } from "express";
import { Model } from "mongoose";
import { CommunityAnswerDocument } from "../../models/community/communityAnswer";
import { CommunityUserDocument } from "../../models/community/communityUser";
import question from "../question";
import { onlyAuthCommunityUser } from "./communityUser";

export default (CommunityAnswer: Model<CommunityAnswerDocument>) => {
    let router = Router();

    router.put('/', async (req, res) => {
        const username = req.body.username;
        const questionId = Number.parseInt(req.body.questionId);
        const answerData = req.body.answerData;
        const updatedDate = new Date().getTime();
        const upload = req.body.upload;
        
        if(!await CommunityAnswer.findOneAndUpdate({ username: username, questionId: questionId }, {$set: { answerData : answerData, updatedDate: updatedDate }})) {
            const communityAnswer = new CommunityAnswer({ username: username, questionId: questionId, commentsIds: [], updatedDate: updatedDate, answerData: answerData, emotions: [], views: [], upload: (upload ? "save" : "none") });
            communityAnswer.save();
        }

        res.sendStatus(200);
        return;
    })

    
    router.get('/', onlyAuthCommunityUser, async (req, res) => {
        let communityUser = req.user!;
        
        let result = await CommunityAnswer.find().sort({'updatedDate': 'asc'});
        res.json(result);
    });

    router.get('/user', onlyAuthCommunityUser, async(req, res) => {
        let communityUser = req.user!;

        let result = await CommunityAnswer.find({ username: communityUser.username }).sort({'id': 'asc'});
        res.json(result);
    })
    
    router.get('/:questionId', onlyAuthCommunityUser, async(req, res) => {
        let communityUser = req.user;
        let questionId = Number.parseInt(req.params.questionId);
        let result = await CommunityAnswer.findOne({ username: communityUser?.username, questionId: questionId });
        res.json(result);
    })

    router.post('/find/usernameQuestionId', onlyAuthCommunityUser, async(req, res) => {
        let username = req.body.username;
        let questionId = Number.parseInt(req.body.questionId);
        let result = await CommunityAnswer.findOne({ username: username, questionId: questionId });

        res.json(result);
    })
    

    return router;
}