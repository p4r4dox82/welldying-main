import { Router } from "express";
import { Model } from "mongoose";
import { SectionDocument, SectionType } from "../models/section";
import { onlyAdmin } from "./user";


export default (Section: Model<SectionDocument>) => {
    let router = Router();

    router.get('/', async (req, res) => {
        let result = await Section.find().sort({id: 'asc'});
        res.json(result);
    });

    router.get('/:id', async (req, res) => {
        let id = Number.parseInt(req.params.id);
        let result = await Section.findOne({id: id});
        res.json(result);
    });

    router.post('/', onlyAdmin, async (req, res) => {
        let data: SectionType = {
            id: Number.parseInt(req.body.id),
            title: req.body.title,
            tag: req.body.tag,
            detail: req.body.detail,
            imageurl: req.body.imageurl,
            questions: req.body.questions,
        };

        if (!await Section.findOneAndUpdate({ id: data.id }, { title: data.title, tag: data.tag, detail: data.detail, imageurl: data.imageurl, questions: data.questions })) {
            const question = new Section(data);
            question.save();
        }


        res.sendStatus(200);
        return;
    });

    return router;
}
