import express from 'express';
import config from './config';
import loader from './loaders';

const startServer = async () => {
    const app = express();

    await loader(app);
    
    app.listen(config.port, () => {
        console.log(`Listening on port ${config.port}!`);
    }).on('error', (error) => {
        throw error;
    }); 
}

startServer();