import { Application } from "express";
import mongoose, { model } from "mongoose";
import config from "../config";
import { userSchema, UserDocument } from "../models/user";
import { contentSchema } from "../models/content";
import { sectionSchema } from "../models/section";
import { answerSchema } from "../models/answer";
import { subscriberSchema } from "../models/subscriber";



const f = async (app: Application) => {
    await mongoose.connect(config.mongodbUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    return {
        User: model('user', userSchema, 'users'),
        Content: model('content', contentSchema, 'contents'),
        Section: model('section', sectionSchema, 'sections'),
        Answer: model('answer', answerSchema, 'answers'),
        Subscriber: model('subscriber', subscriberSchema, 'subscribers'),
    }
}

export default f;
type ThenArg<T> = T extends PromiseLike<infer U> ? U : T
export type ModelsType = ThenArg<ReturnType<typeof f> >;