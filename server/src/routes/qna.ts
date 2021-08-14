import { Router } from "express";
import { Model } from "mongoose";
import { QnaDocument, QnaType } from "../models/qna";
import { onlyAdmin } from "./user";


export default (Qna: Model<QnaDocument>) => {
    let router = Router();

    router.get('/', async (req, res) => {
        let result = await Qna.find().sort({'id': 'asc'});
        res.json(result);
        res.end();
    });

    router.get('/rev', async (req, res) => {
        let result = await Qna.find().sort({'id': 'desc'});
        res.json(result);
        res.end();
    });

    router.get('/:id', async (req, res) => {
        let id = Number.parseInt(req.params.id);
        let result = await Qna.findOne({ id });
        res.json(result);
    });

    router.post('/', onlyAdmin, async (req, res, next) => {
        let data: QnaType = {
            id: Number.parseInt(req.body.id),
            writer: req.body.writer,
            title: req.body.title,
            detail: req.body.detail,
            date: new Date().getTime(),
            answerdate: new Date().getTime(),
            open: req.body.open,
            state: req.body.state,
            password: req.body.password,
            classification: req.body.classification,
            sns_notice: req.body.sns_notice,
            answer: req.body.answer,
            faq: req.body.faq,
        };

        if (!await Qna.findOneAndUpdate({ id: data.id },
                { writer: data.writer, title: data.title, detail: data.detail, date: data.date, answerdate: data.answerdate, open: data.open, state: data.state, password: data.password, classification: data.classification, sns_notice: data.sns_notice, answer: data.answer, faq: data.faq})) {
            const qna = new Qna(data);
            qna.save();
        }

        res.sendStatus(200);
        return;
    });

    return router;
}
