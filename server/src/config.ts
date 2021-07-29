import dotenv from 'dotenv';

let nodeEnv = process.env.NODE_ENV || 'development';

console.log(`Trying to load environment: ${nodeEnv}`);

let env: dotenv.DotenvConfigOutput | undefined = undefined;

if (nodeEnv == 'development')
    env = dotenv.config({path: '.env.development'});
if (nodeEnv == 'production')
    env = dotenv.config({path: '.env.production'});

if (!env) {
    throw new Error("Couldn't find environment file!");
} else if (env.error) {
    throw new Error(`Following error occured while loading environment file: ${env.error}`);
}

export default {
    port: Number.parseInt(process.env.PORT || '5000'),
    host: process.env.HOST || 'localhost',

    user: process.env.USER || 'root',
    password: process.env.PASSWORD || 'root',
    kakaoId: process.env.KAKAO_ID || '',
    kakaoSecret: process.env.KAKAO_SECRET || '',
    googleClientId: process.env.GOOGLE_CLIENT_ID || '',

    mongodbUri: process.env.MONGODB_URI || '',
    awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    awsS3BucketName: process.env.AWS_S3_BUCKET_NAME || 'welldying-attachment',

    sessionSecret: process.env.SESSION_SECRET || '',
    adminSecret: process.env.ADMIN_SECRET || '',

    isTesting: !!process.env.IS_TESTING,
};
