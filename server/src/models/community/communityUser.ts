import { Schema, Document } from "mongoose";

export interface UserInformation {
    name: string,
    nickName: string,
    birth: string,
    sex: "male" | "female",
    phoneNumber: string,
    profileImageUri: string,
    zipCode: number,
    fullAddress: string,
    detailAddress: string,
    email: string,
}

export interface UserNotice {
    date: number,
    checked: string,
    notice: string,
}

export interface CommunityUser {
    id: string,
    password: string,
    signIn: boolean,
    userInformation: UserInformation,
    answerIds: number[],
    bookmarkedAnswerIds: number[],
    personalTags: string[],
    bookTitles: string[],
    notices: UserNotice,
    questionsIds: number[],
}

export type CommunityUserDocument = Document & CommunityUser;

export const communityUserSchema = new Schema<CommunityUserDocument>({
    id: String,
    password: String,
    signIn: Boolean,
    userInformation: { name: String,
        nickName: String,
        birth: String,
        sex: String,
        phoneNumber: String,
        profileImageUri: String,
        zipCode: Number,
        fullAddress: String,
        detailAddress: String,
        email: String,
    },
    answerIds: [Number],
    bookmarkedAnswerIds: [Number],
    personalTags: [String],
    bookTitles: [String],
    notices: {
        date: Number,
        checked: String,
        notice: String,
    },
    questionsIds: [Number],
});
