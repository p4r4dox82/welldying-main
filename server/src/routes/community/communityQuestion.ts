import { Router } from "express";
import { Model } from "mongoose";
import { CommunityQuestionDocument } from "../../models/community/communityQuestion";
import { onlyAuthCommunityUser } from "./communityUser";

export default (CommunityQuestion: Model<CommunityQuestionDocument>) => {
    let router = Router();

    router.put('/', async (req, res) => {
        const id = Number.parseInt(req.body.id);
        const username = req.body.username;
        const question = req.body.question;
        const tag = req.body.tag;
        
        if(!await CommunityQuestion.findOneAndUpdate({ id: id }, {$set: { question : question, tag: tag }})) {
            const communityQuestion = new CommunityQuestion({ id: id, username: username, tag: tag, question: question });
            communityQuestion.save();
        }

        res.sendStatus(200);
        return;
    })

    
    router.get('/', onlyAuthCommunityUser, async (req, res) => {
        let result = await CommunityQuestion.find().sort({'id': 'asc'});
        res.json(result);
    });

    router.get('/user', onlyAuthCommunityUser, async(req, res) => {
        let communityUser = req.communityUser!;

        let result = await CommunityQuestion.find({ username: communityUser.username }).sort({'id': 'asc'});
        res.json(result);
    })
    
    router.get('/:id', onlyAuthCommunityUser, async(req, res) => {
        let id = Number.parseInt(req.params.id);
        let result = await CommunityQuestion.findOne({ id: id });
        res.json(result);
    })

    return router;
}