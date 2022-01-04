import Axios from 'axios';
import store from '../../../store';
import { apiAddress } from '../../config';

export interface AnswerData {
    imageUri: string,
    answer: string,
    title: string,
}

export interface Emotion {
    emotion: string,
    usernames: string[]
}

export interface CommunityAnswer {
    id: number,
    username: string,
    commentIds: number[],
    updatedDate: number,
    answerData: AnswerData,
    emotions: Emotion[],
    views: string[],
    upload: string
}

export const getCommunityAnswers = async() => {
    let response = await Axios.get(`${apiAddress}/communityAnswer`, { withCredentials: true });
    let data: CommunityAnswer[] | null = response.data;

    return data;
}

export const getMyCommunityAnswer = async(username: string) => {
    let response = await Axios.get(`${apiAddress}/communityAnswer/user`, { withCredentials: true });
    let data: CommunityAnswer[] | null = response.data;

    return data;
}

export const getCommunityAnswer = async(id: number) => {
    // if (!store.getState().communityUser.loggedIn) return null;

    let response = await Axios.get(`${apiAddress}/communityAnswer/${id}`, { withCredentials: true });
    let data: CommunityAnswer | null = response.data;

    return data;
    // if(response.data.username !== store.getState().communityUser.communityUser!.username) {
    //     return null;
    // } else {
    //     return response.data;
    // }
}  

export const writeCommunityAnswer = async(id: number, username: string, answerData: any, updatedDate: string) => {
    let response = await Axios.put(`${apiAddress}/communityAnswer`, {
        id, username, answerData, updatedDate
    }, { withCredentials: true })

    return response.status === 200;
}