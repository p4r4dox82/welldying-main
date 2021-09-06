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
        cookie: { secure: true, sameSite: 'none', },
    };

    app.use(session(sessionOptions));
}