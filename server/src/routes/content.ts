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
        console.log('getcontents');
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
            title: req.body.title,
            type: req.body.type,
            category: Number.parseInt(req.body.category),
            userdata: { likes: req.body.userdata.likes, bookmark: req.body.userdata.bookmark, read: req.body.userdata.read, },
            tag: req.body.tag,
            date: new Date().getTime(),
            source: req.body.source,
            detail: { summary: req.body.detail.summary, },
            comments: req.body.coments,
            question: Number.parseInt(req.body.question),
            thumbnailUrl: req.body.thumbnailUrl,
        };

        if (!await Content.findOneAndUpdate({ id: data.id },
                { title: data.title, type: data.type, category: data.category, userdata: data.userdata, tag: data.tag, date: data.date, source: data.source, detail: data.detail, comments: data.comments, question: data.question, thumbnailUrl: data.thumbnailUrl })) {
            const content = new Content(data);
            content.save();
        }

        res.sendStatus(200);
        return;
    });

    router.put('/comment', async (req, res) => {
        let id: number = Number.parseInt(req.body.id);
        let comments: number[] = req.body.comments;

        await Content.findOneAndUpdate({ id }, {
            comments
        });

        res.send(200);
    });

    router.put('/userdata', async (req, res) => {
      let id: number = Number.parseInt(req.body.id);
      let userdata: { likes: string[], bookmark: string[], read: string[] } = req.body.userdata;

      await Content.findOneAndUpdate({ id }, {
        userdata
      });

      res.send(200);
    })

    return router;
}
