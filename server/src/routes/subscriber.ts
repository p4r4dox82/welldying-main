import { Router } from "express";
import { Model } from "mongoose";
import { SubscriberDocument, SubscriberType } from "../models/subscriber";
import { onlyAdmin } from "./user";
import { Parser } from 'json2csv';

export default (Subscriber: Model<SubscriberDocument>) => {
    let router = Router();

    router.get('/', onlyAdmin, async (req, res) => {
        let result = await Subscriber.find();
        res.json(result);
    });

    router.get('/download', onlyAdmin, async (req, res) => {
        const fields = [
          {
           label: 'Email Address',
            value: 'email'
          }
        ];

        const rawData = await Subscriber.find();
        const data = rawData.map((doc) => ({
            email: `${doc.emailFront}@${doc.emailBack}`,
        }));
      
        const json2csv = new Parser({ fields });
        const csv = json2csv.parse(data);
        res.header('Content-Type', 'text/csv');
        res.attachment('subscribers.csv');
        res.send(csv);
    })

    router.post('/', async (req, res) => {
        let data: SubscriberType = {
            emailFront: req.body.emailFront,
            emailBack: req.body.emailBack,
        };

        const subscriber = new Subscriber(data);        
        subscriber.save();
        
        res.sendStatus(200);
        return;
    });

    router.delete('/', async (req, res) => {
        let data: SubscriberType = {
            emailFront: req.body.emailFront,
            emailBack: req.body.emailBack,
        };

        await Subscriber.deleteOne(data);

        res.sendStatus(200);
        return;
    })

    return router;
}