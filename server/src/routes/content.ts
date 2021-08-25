import { Router } from "express";
import { Model } from "mongoose";
import { ContentDocument, ContentType } from "../models/content";
import { onlyAdmin } from "./user";
import multer from 'multer';
import fs from 'fs';

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
  }),
});


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
            comments: req.body.coments
        };

        if (!await Content.findOneAndUpdate({ id: data.id },
                { type: data.type, title: data.title, category: data.category, likes: data.likes, tag: data.tag, comments: data.comments})) {
            const content = new Content(data);
            content.save();
        }

        res.sendStatus(200);
        return;
    });

    router.put('/comment', async (req, res) => {
        let user = req.user!;
        let id: number = Number.parseInt(req.body.id);
        let comments: number[] = req.body.comments;

        await Content.findOneAndUpdate({ id }, {
            comments
        });

        res.send(200);
    });

    return router;
}
