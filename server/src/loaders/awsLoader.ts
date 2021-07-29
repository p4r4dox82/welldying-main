
import express from 'express';
import aws from 'aws-sdk';
import config from '../config';


const f = async (app: Express.Application) => {   
    aws.config.update({ region: 'ap-northeast-1' });
         
    let s3 = new aws.S3();
    let sns = new aws.SNS();

    try {
        await s3.createBucket({ Bucket: config.awsS3BucketName }).promise();
        console.log(`Created a new S3 bucket named ${ config.awsS3BucketName }!`);
    } catch (e) {

    }

    await sns.setSMSAttributes({
        attributes: {
            'DefaultSMSType': 'Transactional',
        }
    }).promise();

    return {
        s3, sns,
    };
}

export default f;
type ThenArg<T> = T extends PromiseLike<infer U> ? U : T
export type AWSServices = ThenArg<ReturnType<typeof f> >;