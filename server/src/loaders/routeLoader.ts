import { Application } from 'express';
import errorHandler from '../handlers/errorHandler';
import userRouter from '../routes/user';
import contentRouter from '../routes/content';
import sectionRouter from '../routes/section';
import answerRouter from '../routes/answer';
import awsRouter from '../routes/aws';
import subscriberRouter from '../routes/subscriber';
import { ModelsType } from './mongooseLoader';
import { AWSServices } from './awsLoader';

export default async (app : Application, models: ModelsType, awsServices: AWSServices) => {
    app.use('/user', userRouter(models.User, awsServices.sns));
    app.use('/content', contentRouter(models.Content));
    app.use('/section', sectionRouter(models.Section));
    app.use('/answer', answerRouter(models.Answer));
    app.use('/aws', awsRouter(awsServices));
    app.use('/subscriber', subscriberRouter(models.Subscriber));

    app.use(errorHandler);
}