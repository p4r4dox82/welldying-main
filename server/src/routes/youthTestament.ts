import { Router } from "express";
import { Model } from "mongoose";
import { YouthTestamentDocument } from "../models/youthTestament";

export default (YouthTestament: Model<YouthTestamentDocument>) => {
    let router = Router();

    router.get('/', async(req, res) => {
        let result = await YouthTestament.find().sort({'id': 'asc'});

        res.json(result);
    });

    router.get('/:pid', async(req, res) => {
        let pid = Number.parseInt(req.params.pid);

        let result = await YouthTestament.findOne({ pid: pid });
        res.json(result);
    });

    router.put('/', async (req, res) => {
        let id = await (await YouthTestament.find()).length + 1;
        let pid = Number.parseInt(req.body.pid);
        let name = req.body.name;
        let week1 = req.body.week1;
        let week2 = req.body.week2;
        let week3 = req.body.week3;

        if(!await YouthTestament.findOneAndUpdate({ pid: pid }, { name: name, week1: week1, week2: week2, week3: week3 })) {
            const youthTestament = new YouthTestament({ id: id, pid: pid, name: name, week1: week1, week2: week2, week3: week3 });
            await youthTestament.save();

            res.sendStatus(200);
            return;
        }

        res.sendStatus(200);
        return;
    });

    

    return router;
}