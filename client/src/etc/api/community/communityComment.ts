import Axios from 'axios';
import { apiAddress } from '../../config';
import { Emotion } from './communityAnswer';

export interface CommunityComment {
    answerUsername: string,
    answerQuestionId: number,
    username: string,
    numbering: number,
    comment: string,
    emotions: Emotion[],
    updatedDate: number;
}

export const getCommunityComments = async() => {
    let response = await Axios.get(`${apiAddress}/communityComment/find`, { withCredentials: true });
    let data: CommunityComment[] | null = response.data;

    return data;
}

export const getCommunityCommentsByAnswerData = async(username: string, questionId: number) => {
    let response = await Axios.post(`${apiAddress}/communityComment/find/answer`, {
        username, questionId
    }, { withCredentials: true });
    let data: CommunityComment[] | null = response.data;

    return data;
}

export const writeCommunityComment = async(username: string, answerUsername: string, answerQuestionId: number, comment: string, numbering:number) => {
    let response = await Axios.put(`${apiAddress}/communityComment/write`, {
        username, answerUsername, answerQuestionId, comment, numbering
    }, { withCredentials: true });

    return response.status === 200;
}

export const getCommunityCommentsByAnswerDataAndUsername = async(username: string, answerQuestionId: number, answerUsername: string) => {
    let response = await Axios.post(`${apiAddress}/communityComment/find/answerAndUsername`, {
        username, answerUsername, answerQuestionId
    }, { withCredentials: true });
    let data: CommunityComment[] | null = response.data;

    return data;
}