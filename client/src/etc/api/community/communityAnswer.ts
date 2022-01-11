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
    username: string,
    questionId: number,
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

export const getCommunityAnswer = async(questionId: number) => {
    // if (!store.getState().communityUser.loggedIn) return null;

    let response = await Axios.get(`${apiAddress}/communityAnswer/${questionId}`, { withCredentials: true });
    let data: CommunityAnswer | null = response.data;

    return data;
    // if(response.data.username !== store.getState().communityUser.communityUser!.username) {
    //     return null;
    // } else {
    //     return response.data;
    // }
}

export const getCommunityAnswerByUsernameAndQuestionId = async(username: string, questionId: number) => {
    let response = await Axios.post(`${apiAddress}/communityAnswer/find/usernameQuestionId`, {
        username, questionId
    }, { withCredentials: true });
    let data: CommunityAnswer | null = response.data;

    return data;
}

export const writeCommunityAnswer = async(username: string, questionId: number, answerData: any, upload: boolean) => {
    let response = await Axios.put(`${apiAddress}/communityAnswer`, {
        username, questionId, answerData, upload
    }, { withCredentials: true })

    return response.status === 200;
}