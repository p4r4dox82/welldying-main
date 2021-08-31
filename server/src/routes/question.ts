import { Router } from "express";
import { Model } from "mongoose";
import { QuestionDocument, QuestionType } from "../models/question";
import { onlyAdmin } from "./user";


export default (Question: Model<QuestionDocument>) => {
    let router = Router();

    router.get('/', async (req, res) => {
        let result = await Question.find().sort({'id': 'asc'});
        res.json(result);
        res.end();
    });

    router.get('/:id', async (req, res) => {
        let id = Number.parseInt(req.params.id);
        let result = await Question.findOne({ id });
        res.json(result);
    });

    router.post('/', onlyAdmin, async (req, res, next) => {
        let data: QuestionType = {
            id: Number.parseInt(req.body.id),
            type: req.body.type,
            title: req.body.title,
            message: req.body.message,
            placeholder: req.body.placeholder,
            contents: req.body.contents,
        };

        if (!await Question.findOneAndUpdate({ id: data.id },
                { type: data.type, title: data.title, message: data.message, placeholder: data.placeholder, contents: data.contents })) {
            const question = new Question(data);
            question.save();
        }

        res.sendStatus(200);
        return;
    });

    return router;
}
