import { Router } from "express";
import { Model } from "mongoose";
import { CommentDocument, CommentType } from "../models/comment";
import { onlyAdmin } from "./user";


export default (Comment: Model<CommentDocument>) => {
    let router = Router();

    router.get('/', async (req, res) => {
        let result = await Comment.find().sort({'id': 'asc'});
        res.json(result);
        res.end();
    });

    router.get('/:id', async (req, res) => {
        let id = Number.parseInt(req.params.id);
        let result = await Comment.findOne({ id });
        res.json(result);
    });

    router.put('/', onlyAdmin, async (req, res, next) => {
        let data: CommentType = {
            id: Number.parseInt(req.body.id),
            writer: req.body.writer,
            detail: req.body.detail,
            date: new Date().getTime(),
            userdata: req.body.userdata,
            declare: req.body.declare,
        };

        if (!await Comment.findOneAndUpdate({ id: data.id },
                { writer: data.writer, detail: data.detail, date: data.date, userdata: data.userdata, declare: data.declare})) {
            const comment = new Comment(data);
            comment.save();
        }

        res.sendStatus(200);
        return;
    });

    return router;
}
