import Axios, { AxiosRequestConfig } from "axios";
import { ShowContentType } from "../../components/SignupFill";
import store from "../../store";
import user, { setUser, clearUser } from "../../store/user";
import { apiAddress } from "../config";

interface UserPost {
    username: string;
    password: string;
    name: string;
    birthYear: number;
    birthMonth: number;
    birthDate: number;
    sex: 'male' | 'female';
    email: string;
    cellphone : string;
    phoneCodeDigest : string;
    agreeMessage: boolean;
    showContent: ShowContentType;
}

export interface User {
    username: string;
    passwordHash: string;
    passwordSalt: string;
    name: string;
    birthYear: number;
    birthMonth: number;
    birthDate: number;
    sex: string;
    email: string;
    cellphone: string;
    agreeMessage: boolean;
    showContent: string;
    phoneCodeDigest?: string;
    phoneUserDigest?: string;
    kakaoId?: string;
    googleId?: string;
};

const authConfig: AxiosRequestConfig = {
    validateStatus: (status: number) => (200 <= status && status < 300) || status === 401,
    withCredentials: true,
}


export const register = async (data: UserPost) => {

    const response = await Axios.post(`${apiAddress}/user`, data, { withCredentials: true });

    if (response.status !== 200) throw response.data;
    else return response.data;
}

export interface UserPut {
    username: string;
    password: string;
    name: string;
    birthYear: number;
    birthMonth: number;
    birthDate: number;
    sex: 'male' | 'female';
    email: string;
    imageUri: string;
    cellphone: string;
}

interface UserPassword {
    username: string;
    password: string;
}

export const getUser = async (cellphone: string) =>  {
  let response = await Axios.get(`${apiAddress}/user/findcellphone/${cellphone}`);
  let data : User | null = response.data;

  return data;
}

export const getUserid = async (username: string) =>  {
  let response = await Axios.get(`${apiAddress}/user/findusername/${username}`);
  let data : User | null = response.data;

  return data;
}

export const modifyUserInfo = async (data: UserPut) => {
    // TODO: Validate data

    const response = await Axios.put(`${apiAddress}/user`, data, { withCredentials: true });

    await setUserInfo();

    if (response.status !== 200) throw response.data;
    else return response.data;
}

export const modifyUserPassword = async (data: UserPassword) => {
  const response = await Axios.put(`${apiAddress}/user/password`, data, { withCredentials: true });

  if(response.status !== 200) throw response.data;
  else return response.data;

}

export const login = async (username: string, password: string) => {
    const response = await Axios.post(`${apiAddress}/user/login`, {
        username, password
    }, authConfig);

    if (response.status === 200) {
        await setUserInfo();
        return true;
    } else {
        return false;
    }
}

export const logout = async () => {
    let response = await Axios.post(`${apiAddress}/user/logout`, undefined, authConfig);

    if (response.status === 200) {
        await setUserInfo();
        return true;
    } else {
        return false;
    }
}

export const oauthConnect = async (service: string, id: string, token: string) => {
    const response = await Axios.post(`${apiAddress}/user/connect/${service}`, {
        id, token
    }, authConfig);

    if (response.status === 200) {
        await setUserInfo();
        return true;
    } else {
        return false;
    }
}

export const oauthLogin = async (service: string, id: string, token: string) => {
    const response = await Axios.post(`${apiAddress}/user/login/${service}`, {
        id, token
    }, authConfig);

    if (response.status === 200) {
        if (response.data.loggedIn) {
            await setUserInfo();
            return { loggedIn: true };
        }
        return { loggedIn: false };
    } else {
        return false;
    }
}

export const checkUsernameDuplicate = async (username: string) => {
    const response = await Axios.post(`${apiAddress}/user/duplicate`, {
        username
    });

    return response.data.duplicate as boolean;
}


export const checkCellphoneDuplicate = async (cellphone: string) => {
    const response = await Axios.post(`${apiAddress}/user/duplicate/cellphone`, {
        cellphone
    });

    return response.data.duplicate as boolean;
}

export const verifyPhone = async (cellphoneFront: string, cellphoneMiddle: string, cellphoneRear: string) => {
    const response = await Axios.post(`${apiAddress}/user/verify/phone`, {
        cellphoneFront, cellphoneMiddle, cellphoneRear,
    }, { withCredentials: true });

    return response.status === 200;
}

export const verifyPhoneCheck = async (cellphoneFront: string, cellphoneMiddle: string, cellphoneRear: string, code: number) => {
    const response = await Axios.post(`${apiAddress}/user/verify/phone/check`, {
        cellphoneFront, cellphoneMiddle, cellphoneRear, code,
    }, { withCredentials: true });

    console.log(response.data);
    return response.data as {
        isVerified: boolean,
        phoneCodeDigest: string,
    };
}

export interface UserGiveInfo {
    username: string;
    name: string;
    phonenumber: string;
    accept: number;
}

export interface DeathInfo {
    agree: boolean;
    answerArray: Array<string>;
}

export interface UserData {
    username: string;
    password: string;
    name: string;
    birthYear: number;
    birthMonth: number;
    birthDate: number;
    sex: 'male' | 'female';
    email: string;
    cellphone : string;
    kakaoId?: string;
    googleId?: string;
    bookname: string[];
    DeathInfo: DeathInfo;
    UsersInfo: { give: UserGiveInfo[], get: UserGiveInfo[] };
    imageUri: string;
}


export const setUserInfo = async () => {
    let response = await Axios.get(`${apiAddress}/user`, authConfig);

    if (response.status === 200) {
        let data = response.data as UserData;
        store.dispatch(setUser(data));
    }
    else {
        store.dispatch(clearUser());
    }
}

export const setBookName = async (username: string, bookname: string[]) => {
    let response = await Axios.put(`${apiAddress}/user/bookname`, {
         username, bookname
    }, { withCredentials: true });

    return response.status === 200;
}

export const setUserDeathInfo = async (username: string, DeathInfo: DeathInfo) => {
    let response = await Axios.put(`${apiAddress}/user/deathinfo`, {
        username, DeathInfo
    }, { withCredentials: true });

    return response.status === 200;
}

export const setUsers = async (username: string, UsersInfo: { give: UserGiveInfo[], get: UserGiveInfo[] }, userposition: number, sendmessage: boolean, name: string) => {
    let response = await Axios.put(`${apiAddress}/user/users`, {
        username, UsersInfo, userposition, sendmessage, name
    }, { withCredentials: true });

    return response.status === 200;
}

export const getUsers = async () => {
    let response = await Axios.get(`${apiAddress}/user/usersInfo`);
    let data : UserData[] = response.data;

    return data;
}

export interface UserProfile {
    username: string;
    imageUri: string;
    name: string;
    birthYear: number;
    birthMonth: number;
    birthDate: number;
    sex: 'male' | 'female';
}

export const setProfile = async (data: UserProfile) => {
    let response = await Axios.put(`${apiAddress}/user/profile`, {
        data
    }, { withCredentials: true});
    
    await setUserInfo();

    if (response.status !== 200) throw response.data;
    else return response.data;
}