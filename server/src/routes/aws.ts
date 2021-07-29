import aws from "aws-sdk";
import { Router } from "express";
import multer from "multer";
import multerS3 from "multer-s3";
import path from "path";
import config from "../config";
import { AWSServices } from "../loaders/awsLoader";
import { onlyAuthUser } from "./user";

export default ({ s3, sns }: AWSServices) => {
    let router = Router();
    let uploadCnt = 1;

    const upload = multer({
        storage: multerS3({
            s3,
            bucket: config.awsS3BucketName,
            key: function (req, file, cb) {
                let extension = path.extname(file.originalname);
                cb(null, Date.now().toString() + uploadCnt + extension);
            },
            acl: 'public-read',
        })
    });
        
    // The image is stored in S3 link in response.data.location.
    router.post('/image', onlyAuthUser, (req, res, next) => {
        console.log(req.image?.size);
        if (req.image && req.image.size > 5000000) res.sendStatus(413);
        else next();
    }, upload.single('image'), (req, res) => {
        res.json(req.file);
        uploadCnt++;
    });

    router.post('/pdf', onlyAuthUser, upload.single('file'), (req, res) => {
        res.json(req.file);
        uploadCnt++;
    });


    return router;
}