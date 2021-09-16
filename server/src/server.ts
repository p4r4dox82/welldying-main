import express from 'express';
import config from './config';
import loader from './loaders';

const startServer = async () => {
    const app = express();

    await loader(app);

    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });
    
    app.listen(config.port, () => {
        console.log(`Listening on port ${config.port}!`);
    }).on('error', (error) => {
        throw error;
    }); 
}

startServer();