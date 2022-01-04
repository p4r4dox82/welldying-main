import { Router } from "express";
import { Model } from "mongoose";
import { NewsDocument, NewsType } from "../models/news";
import { onlyAdmin } from "./user";


export default (News: Model<NewsDocument>) => {
    let router = Router();

    router.get('/', async (req, res) => {
        let result = await News.find().sort({'id': 'asc'});
        res.json(result);
        res.end();
    });
    
    router.get('/rev', async (req, res) => {
        let result = await News.find().sort({'id': 'desc'});
        res.json(result);
        res.end();
    });

    router.get('/:id', async (req, res) => {
        let id = Number.parseInt(req.params.id);
        let result = await News.findOne({ id });
        res.json(result);
    });

    router.post('/', onlyAdmin, async (req, res, next) => {
        let data: NewsType = {
            id: Number.parseInt(req.body.id),
            imageurl: req.body.imageurl,
            company: req.body.company,
            title: req.body.title,
            detail: req.body.detail,
            date: req.body.date,
            tag: req.body.tag,
        };

        if (!await News.findOneAndUpdate({ id: data.id },
                { imageurl: data.imageurl, company: data.company, title: data.title, detail: data.detail, date: data.date, tag: data.tag})) {
            const news = new News(data);
            news.save();
        }

        res.sendStatus(200);
        return;
    });

    return router;
}
