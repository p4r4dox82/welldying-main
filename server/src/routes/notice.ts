import { Router } from "express";
import { Model } from "mongoose";
import { NoticeDocument, NoticeType } from "../models/notice";
import { onlyAdmin } from "./user";


export default (Notice: Model<NoticeDocument>) => {
    let router = Router();

    router.get('/', async (req, res) => {
        let result = await Notice.find().sort({'id': 'asc'});
        res.json(result);
        res.end();
    });

    router.get('/rev', async (req, res) => {
        let result = await Notice.find().sort({'id': 'desc'});
        res.json(result);
        res.end();
    });

    router.get('/:id', async (req, res) => {
        let id = Number.parseInt(req.params.id);
        let result = await Notice.findOne({ id });
        res.json(result);
    });

    router.post('/', onlyAdmin, async (req, res, next) => {
        let data: NoticeType = {
            id: Number.parseInt(req.body.id),
            classification: req.body.classification,
            title: req.body.title,
            detail: req.body.detail,
            date: new Date().getTime(),
            views: Number.parseInt(req.body.views),
        };

        if (!await Notice.findOneAndUpdate({ id: data.id },
                { classification: data.classification, title: data.title, detail: data.detail, date: data.date, views: data.views})) {
            const notice = new Notice(data);
            notice.save();
        }

        res.sendStatus(200);
        return;
    });

    return router;
}
