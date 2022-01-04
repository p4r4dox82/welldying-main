import express from 'express';
import expressLoader from './expressLoader';
import mongooseLoader from './mongooseLoader';
import sessionLoader from './sessionLoader';
import awsLoader from './awsLoader';
import passportLoader from './passportLoader';
import routeLoader from './routeLoader';

export default async (app : express.Application) => {
    await expressLoader(app);
    console.log('Express loaded!');

    const models = await mongooseLoader(app);
    console.log('Successfully connected to mongoDB!');

    await sessionLoader(app);
    console.log('Successfully initialized sessions!');

    const awsServices = await awsLoader(app);
    console.log('Successfully connected to Amazon Web Service!');

    await passportLoader(app, models.User, models.CommunityUser);
    console.log('Got ready to log in with passport!');

    await routeLoader(app, models, awsServices);
    console.log('Now ready to get queries!');    
}