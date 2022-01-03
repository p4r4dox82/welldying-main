import Axios from 'axios';
import { apiAddress } from '../../config';

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