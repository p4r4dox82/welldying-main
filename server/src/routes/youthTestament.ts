import { Router } from "express";
import { Model } from "mongoose";
import { YouthTestamentDocument } from "../models/youthTestament";

export default (YouthTestament: Model<YouthTestamentDocument>) => {
    let router = Router();

    router.get('/', async(req, res) => {
        let result = await YouthTestament.findOne({ pid: 12345678 });
        res.json(result);
    })

    router.get('/:pid', async(req, res) => {
        let pid = Number.parseInt(req.params.pid);

        let result = await YouthTestament.findOne({ pid: pid });
        res.json(result);
    });

    router.put('/', async (req, res) => {
        let pid = Number.parseInt(req.body.pid);
        let name = req.body.name;
        let imageName = req.body.imageName;
        let videoUrl = req.body.videoUrl;

        if(!await YouthTestament.findOneAndUpdate({ pid: pid, name: name, imageName: imageName, videoUrl: videoUrl })) {
            const youthTestament = new YouthTestament({ pid: pid, name: name, imageName: imageName, videoUrl: videoUrl });
            await youthTestament.save();

            res.sendStatus(201);
            return;
        }

        res.sendStatus(200);
        return;
    });

    

    return router;
}