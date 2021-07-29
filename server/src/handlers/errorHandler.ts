import { ErrorRequestHandler, NextFunction, Request, Response, Router } from "express"


const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
    console.log(error);
    res.status(500).json({
        error: error.message
    });
    next();
}

export default errorHandler;