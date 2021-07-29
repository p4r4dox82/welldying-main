import Axios from "axios";
import store from "../../store";
import { apiAddress } from "../config";

export interface Answer {
    username: string;
    contentId: number;
    length: number;
    message: string;
    isChecked?: boolean;
    updatedAt: number;
};

export const getAnswers = async () => {
    if (!store.getState().user.loggedIn) return null;

    let response = await Axios.get(`${apiAddress}/answer`, { withCredentials: true });

    return response.data as Answer[];
}

interface AnswerTime {
    contentId: number;
    updatedAt: number;
    isChecked: boolean;
};

export const getAnswerTime = async () => {
    if (!store.getState().user.loggedIn) return undefined;

    let response = await Axios.get<AnswerTime[]>(`${apiAddress}/answer/time`, { withCredentials: true });

    return response.data;
}

export const writeAnswer = async (contentId: number, message: string, length: number) => {
    let response = await Axios.put(`${apiAddress}/answer`, {
        contentId, message, length
    }, { withCredentials: true });

    return response.status < 300;
}

export const checkAnswer = async (contentId: number) => {
    let response = await Axios.put(`${apiAddress}/answer/check`, { contentId, check: true }, { withCredentials: true });

    return response.status < 300;
}

export const uncheckAnswer = async (contentId: number) => {
    let response = await Axios.put(`${apiAddress}/answer/check`, { contentId, check: false }, { withCredentials: true });

    return response.status < 300;
}
