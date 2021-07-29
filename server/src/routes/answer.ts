import { Router } from "express";
import { Model } from "mongoose";
import { AnswerDocument, AnswerType } from "../models/answer";
import { onlyAuthUser } from "./user";
import markdownPdf from 'markdown-pdf';
import axios from "axios";
import fs from 'fs';
import { mdToPdf } from 'md-to-pdf';

export default (Answer: Model<AnswerDocument>) => {
    let router = Router();

    router.put('/check', onlyAuthUser, async (req, res) => {
        let user = req.user!;
        let contentId = req.body.contentId;
        let check = req.body.check;

        if (await Answer.findOneAndUpdate({ username: user.username, contentId }, 
                                          { isChecked: check }))
            res.sendStatus(200);
        
        if (check) res.sendStatus(400);
        else res.sendStatus(200);
    });

    router.put('/', onlyAuthUser, async (req, res) => {
        let user = req.user!;


        let data: AnswerType = {
            username: user.username,
            contentId: Number.parseInt(req.body.contentId),
            message: req.body.message,
            length: req.body.length,
            updatedAt: new Date().getTime(),
        };
        console.log(data.message, data.length);

        if (data.message.length === 0) {
            await Answer.deleteOne({ username: data.username, contentId: data.contentId });
            
            res.sendStatus(202);
            return;
        }

        if (!await Answer.findOneAndUpdate({ username: data.username, contentId: data.contentId }, 
                                           { message: data.message, length: data.length, updatedAt: data.updatedAt })) {
            const answer = new Answer(data);
            await answer.save();

            res.sendStatus(201);
            return;
        }

        res.sendStatus(200);
        return;
    });

    router.get('/', onlyAuthUser, async (req, res) => {
        let user = req.user!;

        let result = await Answer.find({username: user.username });
        res.json(result);
    });

    router.get('/time', onlyAuthUser, async (req, res) => {
        let user = req.user!;

        let result = await Answer.find({username: user.username }, { contentId: true, updatedAt: true, isChecked: true });
        res.json(result);
    })

    router.get('/pdf', onlyAuthUser, async (req, res) => {
        let user = req.user!;
        let content = req.body.content;

        res.sendStatus(500);

        //const pdf = await mdToPdf({ content: md });

        //let response = await axios.post('/aws/pdf', formData);
        //res.json(response.data);
    })

    return router;
}