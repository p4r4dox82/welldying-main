import { Router } from "express";
import { Model } from "mongoose";
import { ProgramAnswerDocument, programAnswerType, answerData } from "../models/programAnswer";
import { onlyAuthUser } from "./user";
import markdownPdf from 'markdown-pdf';
import axios from "axios";
import fs from 'fs';
import { mdToPdf } from 'md-to-pdf';

export default (ProgramAnswer: Model<ProgramAnswerDocument>) => {
    let router = Router();

    router.get('/:pid', async (req, res) => {
        const pid = Number.parseInt(req.params.pid);

        let result = await ProgramAnswer.findOne({ pid: pid });
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
