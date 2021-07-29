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
            message: req.body.message,
            placeholder: req.body.placeholder,
        };

        if (!await Content.findOneAndUpdate({ id: data.id }, 
                { type: data.type, title: data.title, message: data.message, placeholder: data.placeholder })) {
            const content = new Content(data);
            content.save();
        }
        
        res.sendStatus(200);
        return;
    });

    return router;
}