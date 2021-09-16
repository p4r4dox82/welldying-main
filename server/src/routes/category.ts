import { Router } from "express";
import { Model } from "mongoose";
import { CategoryDocument, CategoryType } from "../models/category";
import { onlyAdmin } from "./user";


export default (Category: Model<CategoryDocument>) => {
    let router = Router();

    router.get('/', async (req, res) => {
        let result = await Category.find().sort({id: 'asc'});
        res.json(result);
    });

    router.get('/:id', async (req, res) => {
        let id = Number.parseInt(req.params.id);
        let result = await Category.findOne({id: id});
        res.json(result);
    });

    router.post('/', onlyAdmin, async (req, res) => {
        let data: CategoryType = {
            id: Number.parseInt(req.body.id),
            title: req.body.title,
            tag: req.body.tag,
            contents: req.body.contents,
        };

        if (!await Category.findOneAndUpdate({ id: data.id }, { title: data.title, tag: data.tag, contents: data.contents })) {
            const category = new Category(data);
            category.save();
        }


        res.sendStatus(200);
        return;
    });

    return router;
}
