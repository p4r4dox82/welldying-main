import { Router } from "express";
import { Model } from "mongoose";
import { CommunityCommentDocument } from "../../models/community/communityComment";
import { onlyAuthCommunityUser } from "./communityUser";

export default (CommunityComment: Model<CommunityCommentDocument>) => {
    let router = Router();

    router.get('/find', onlyAuthCommunityUser, async(req, res) => {
        let result = await CommunityComment.find();
        
        res.json(result);
    })

    router.post('/find/answer', onlyAuthCommunityUser, async(req, res) => {
        const questionId = Number.parseInt(req.body.questionId);
        const username = req.body.username;

        let result = await CommunityComment.find({ answerQuestionId: questionId, answerUsername: username }).sort({ 'numbering': 'asc' });

        res.json(result);
    })

    router.put('/write', onlyAuthCommunityUser, async(req, res) => {
        const username = req.body.username;
        const answerUsername = req.body.answerUsername;
        const answerQuestionId = Number.parseInt(req.body.answerQuestionId);
        const comment = req.body.comment;
        const numbering = Number.parseInt(req.body.numbering);
        const updatedDate = new Date().getTime();

        if(!await CommunityComment.findOneAndUpdate({ username: username, answerUsername: answerUsername, answerQuestionId: answerQuestionId, numbering: numbering }, { $set: { comment: comment, updatedDate: updatedDate } })) {
            let communityComment = new CommunityComment({ username: username, answerQuestionId: answerQuestionId, answerUsername: answerUsername, numbering: numbering, comment: comment, emotions: [], updatedDate: updatedDate });
            communityComment.save();
        }

        res.sendStatus(200);
        return;
    })
    router.post('/find/answerAndUsername', onlyAuthCommunityUser, async(req, res) => {
        const username = req.body.username;
        const answerUsername = req.body.answerUsername;
        const answerQuestionId = Number.parseInt(req.body.answerQuestionId);

        let result = await CommunityComment.find({ username: username, answerUsername: answerUsername, answerQuestionId: answerQuestionId }).sort({ 'numbering': 'desc' });
        res.json(result);
    })

    return router;
}