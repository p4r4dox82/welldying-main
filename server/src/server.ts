import express from 'express';
import config from './config';
import cors from 'cors';
import loader from './loaders';

const startServer = async () => {
    const app = express();

    await loader(app);

    app.use(cors());
    
    app.listen(config.port, () => {
        console.log(`Listening on port ${config.port}!`);
    }).on('error', (error) => {
        throw error;
    }); 
}

startServer();