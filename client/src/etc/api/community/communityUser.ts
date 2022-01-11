import Axios, { AxiosRequestConfig } from 'axios';
import store from '../../../store';
import { clearCommunityUser, setCommunityUser } from '../../../store/communityUser';
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
    username: string,
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

const authConfig: AxiosRequestConfig = {
    validateStatus: (status: number) => (200 <= status && status < 300) || status === 401,
    withCredentials: true,
}

export const setCommunityUserInfo = async () => {
    let response = await Axios.get(`${apiAddress}/communityUser`, authConfig);

    if (response.status === 200) {
        let data = response.data as CommunityUser;
        store.dispatch(setCommunityUser(data));
    }
    else {
        store.dispatch(clearCommunityUser());
    }
}

export const communityLogin = async (username: string, password: string) => {
    const response = await Axios.post(`${apiAddress}/communityUser/login`, {
        username, password
    }, authConfig);

    if (response.status === 200) {
        await setCommunityUserInfo();
        return true;
    } else {
        return false;
    }
}

export const communityLogout = async () => {
    let response = await Axios.post(`${apiAddress}/communityUser/logout`, undefined, authConfig);

    if (response.status === 200) {
        await setCommunityUserInfo();
        return true;
    } else {
        return false;
    }
}

export const communitySignUp = async(username: string, password: string) => {
    let response = await Axios.put(`${apiAddress}/communityUser/signup`, {
        username, password
    }, { withCredentials: true });

    return response.status === 200;
}

export const addNewUser = async(username: string, password: string, name: string, phoneNumber: string) => {
    let response = await Axios.post(`${apiAddress}/communityUser`, {
        username, password, name, phoneNumber
    }, { withCredentials: true });

    return response.status === 200;
}

export const modifyUserInformation = async(data: any) => {
    let response = await Axios.put(`${apiAddress}/communityUser`, {
        data
    }, { withCredentials: true });

    return response.status === 200;
}

export const getCommunityUsers = async() => {
    let response = await Axios.get(`${apiAddress}/communityUser/all`, { withCredentials: true });
    let data: CommunityUser[] | null = response.data;

    return data;
}

export const getUserByRearPhoneNumber = async(rearPhoneNumber: number) => {
    let response = await Axios.get(`${apiAddress}/communityUser/find/${rearPhoneNumber}`, { withCredentials: true });
    let data: CommunityUser | null = response.data;

    return data;
}