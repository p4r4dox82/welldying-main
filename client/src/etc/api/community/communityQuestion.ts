import Axios from 'axios';
import { apiAddress } from '../../config';

export interface CommunityQuestion {
    id: number,
    username: string,
    question: string,
    tag: string,
}

export const getCommunityQuestions = async() => {
    let response = await Axios.get(`${apiAddress}/communityQuestion`, { withCredentials: true });
    let data: CommunityQuestion[] | null = response.data;

    return data;
}

export const getMyCommunityQuestion = async(username: string) => {
    let response = await Axios.get(`${apiAddress}/communityQuestion/user`, { withCredentials: true });
    let data: CommunityQuestion[] | null = response.data;

    return data;
}

export const getCommunityQuestion = async(id: number) => {
    // if (!store.getState().communityUser.loggedIn) return null;

    let response = await Axios.get(`${apiAddress}/communityQuestion/${id}`, { withCredentials: true });
    let data: CommunityQuestion | null = response.data;

    return data;
    // if(response.data.username !== store.getState().communityUser.communityUser!.username) {
    //     return null;
    // } else {
    //     return response.data;
    // }
}  

export const writeCommunityQuestion = async(id: number, username: string, question: string, tag: string) => {
    let response = await Axios.put(`${apiAddress}/communityQuestion`, {
        id, username, question, tag
    }, { withCredentials: true })

    return response.status === 200;
}