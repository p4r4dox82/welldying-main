import Axios from 'axios';
import { apiAddress } from '../../config';

export interface CommunityQuestion {
    id: number,
    username: string,
    question: string,
    tag: string,
    updatedDate: number
}

export const getCommunityQuestions = async() => {
    let response = await Axios.get(`${apiAddress}/communityQuestion`, { withCredentials: true });
    let data: CommunityQuestion[] | null = response.data;

    return data;
}

export const getCommunityQuestionsRecentOrder = async() => {
    let response = await Axios.get(`${apiAddress}/communityQuestion`, { withCredentials: true });
    let data: CommunityQuestion[] | null = response.data;

    return data;
}

export const getMyCommunityQuestion = async() => {
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

export const writeCommunityQuestion = async(username: string, question: string, tag: string) => {
    let response = await Axios.put(`${apiAddress}/communityQuestion`, {
        username, question, tag
    }, { withCredentials: true })

    return [response.data.status === 200, response.data.id];
}