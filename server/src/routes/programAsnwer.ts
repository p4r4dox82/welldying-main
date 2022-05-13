import { Router } from "express";
import { Model } from "mongoose";
import { ProgramAnswerDocument, programAnswerType, answerData } from "../models/programAnswer";

export default (ProgramAnswer: Model<ProgramAnswerDocument>) => {
    let router = Router();

    router.get('/', async(req, res) => {
        let result = await ProgramAnswer.findOne({ pid: 105526735 });
        res.json(result);
    })

    router.get('/', async (req, res) => {

        let result = await ProgramAnswer.findOne({ pid: 105526735 });
        res.json(result);
    });

    router.post('/', async(req, res, next) => {
        let data: programAnswerType = req.body.data;

        if (!await ProgramAnswer.findOneAndUpdate({ pid: data.pid }, data)) {
            const programAnswer = new ProgramAnswer(data);
            console.log(data);
            programAnswer.save();
        }

        res.sendStatus(200);
        return;
    })

    return router;
}
