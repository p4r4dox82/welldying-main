import { Router } from "express";
import { Model } from "mongoose";
import { ContentDocument, ContentType } from "../models/content";
import { onlyAdmin } from "./user";


export default (Content: Model<ContentDocument>) => {
    let router = Router();

    router.get('/', async (req, res) => {
        let result = await Content.find().sort({'id': 'asc'});
        res.json(result);
        res.end();
    });

    router.get('/:id', async (req, res) => {
        let id = Number.parseInt(req.params.id);
        let result = await Content.findOne({ id });
        res.json(result);
    });

    router.post('/', onlyAdmin, async (req, res, next) => {
        let data: ContentType = {
            id: Number.parseInt(req.body.id),
            type: req.body.type,
            title: req.body.title,
            category: Number.parseInt(req.body.category),
            likes: Number.parseInt(req.body.likes),
            tag: req.body.tag,
        };

        if (!await Content.findOneAndUpdate({ id: data.id },
                { type: data.type, title: data.title, category: data.category, likes: data.likes, tag: data.tag})) {
            const content = new Content(data);
            content.save();
        }

        res.sendStatus(200);
        return;
    });

    return router;
}
