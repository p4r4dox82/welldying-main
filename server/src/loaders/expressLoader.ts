import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import rateLimiter from 'express-rate-limit';

// Allow 300 requests per IP per 10 minutes
const globalRateLimiter = rateLimiter({
    windowMs: 10 * 60 * 1000,
    max: 3000,
    message: "This IP has been temporally inactivated in order to prevent DOS attack.",
});

// Allow 5 POST requests per IP per 30 seconds
const postRateLimiter = rateLimiter({
    windowMs: 30 * 1000,
    max: 50,
    message: "This IP has been temporally inactivated in order to prevent DOS attack.",
});

export default async (app : express.Application) => {
    app.use(cors({
        origin: true,
        credentials: true,
    }));
    app.use(cors({
        origin: 'https://localhost:3000',
        credentials: true,
    }));
    app.use(cors({
        origin: 'http://localhost:3000',
        credentials: true,
    }));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.set('trust proxy', 1);

    app.use(globalRateLimiter);
    app.post('/', postRateLimiter);

    app.get('/status', (req, res) => {
        res.status(200).end();
    });

    app.head('/status', (req, res) => {
        res.status(200).end();
    });
}