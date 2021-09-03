import mongoose from 'mongoose';
import session from "express-session";
import { Application } from 'express';
import connectMongo from 'connect-mongo';
import config from '../config';

export default async (app: Application) => {
    const MongoStore = connectMongo(session);

    let sessionOptions: session.SessionOptions = {
        secret: config.sessionSecret,
        resave: true,
        saveUninitialized: true,
        store: new MongoStore({ mongooseConnection: mongoose.connection }),
        proxy: true,
        cookie: { secure: true, sameSite: 'none', },
    };

    // if (!config.isTesting) sessionOptions = Object.assign(sessionOptions, {
    //     proxy: true,
    //     cookie: { secure: true, sameSite: 'none', },
    // } as session.SessionOptions);

    app.use(session(sessionOptions));
}