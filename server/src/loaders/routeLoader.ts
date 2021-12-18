import { Application } from 'express';
import errorHandler from '../handlers/errorHandler';
import userRouter from '../routes/user';
import questionRouter from '../routes/question';
import sectionRouter from '../routes/section';
import contentRouter from '../routes/content';
import answerRouter from '../routes/answer';
import awsRouter from '../routes/aws';
import subscriberRouter from '../routes/subscriber';
import noticeRouter from '../routes/notice';
import newsRouter from '../routes/news';
import qnaRouter from '../routes/qna';
import commentRouter from '../routes/comment';
import categoryRouter from '../routes/category';
import orderRouter from '../routes/order';
import programAnswerRouter from '../routes/programAsnwer';
import { ModelsType } from './mongooseLoader';
import { AWSServices } from './awsLoader';

export default async (app : Application, models: ModelsType, awsServices: AWSServices) => {
    app.use('/user', userRouter(models.User, awsServices.sns));
    app.use('/question', questionRouter(models.Question));
    app.use('/section', sectionRouter(models.Section));
    app.use('/answer', answerRouter(models.Answer));
    app.use('/aws', awsRouter(awsServices));
    app.use('/subscriber', subscriberRouter(models.Subscriber));
    app.use('/content', contentRouter(models.Content));
    app.use('/notice', noticeRouter(models.Notice));
    app.use('/news', newsRouter(models.News));
    app.use('/qna', qnaRouter(models.Qna));
    app.use('/comment', commentRouter(models.Comment));
    app.use('/category', categoryRouter(models.Category));
    app.use('/order', orderRouter(models.Order, models.User, awsServices.sns));
    app.use('/programAnswer', programAnswerRouter(models.ProgramAnswer));

    app.use(errorHandler);
}
