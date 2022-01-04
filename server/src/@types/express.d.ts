import { CommunityUser } from "../models/community/communityUser";
import { UserType } from "../models/user";

interface VerifyPhone {
    phoneNumber: string,
    code: number,
    createdAt: number,
}

declare module 'express-serve-static-core' {

    export interface Request {
        user?: UserType;
        communityUser?: CommunityUser;
        image?: Blob;
    }


}


declare module 'express-session' {
    export interface Session {
        verifyPhone?: VerifyPhone;
        passport: {
            user?: string,
        };
    }
}