import { Router } from "express";
import { Model } from "mongoose";
import { CommunityQuestionDocument } from "../../models/community/communityQuestion";
import { onlyAuthCommunityUser } from "./communityUser";

export default (CommunityQuestion: Model<CommunityQuestionDocument>) => {
    let router = Router();

    router.put('/', async (req, res) => {
        let allQuestions = await CommunityQuestion.find().sort({ 'id': 'desc' });
        const id = allQuestions[0].id + 1;
        const username = req.body.username;
        const question = req.body.question;
        const tag = req.body.tag;
        const updatedDate = new Date().getTime();
        
        if(!await CommunityQuestion.findOneAndUpdate({ id: id }, {$set: { question : question, tag: tag, updatedDate: updatedDate }})) {
            const communityQuestion = new CommunityQuestion({ id: id, username: username, tag: tag, question: question, updatedDate: updatedDate });
            communityQuestion.save();
        }

        res.json({ id: id, status: 200 });
        return;
    })

    
    router.get('/', onlyAuthCommunityUser, async (req, res) => {
        let result = await CommunityQuestion.find().sort({'id': 'asc'});
        res.json(result);
    });

    router.get('/recent', onlyAuthCommunityUser, async (req, res) => {
        let result = await CommunityQuestion.find().sort({ 'updatedDate': 'desc' });
        res.json(result);
    })

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