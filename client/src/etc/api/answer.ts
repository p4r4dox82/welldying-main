import Axios from "axios";
import store from "../../store";
import { apiAddress } from "../config";

export interface Answer {
    username: string;
    questionId: number;
    length: number;
    message: string;
    isChecked?: boolean;
    updatedAt: number;
    imageData: { imageUrl: string, cropX: number, cropY: number };
    book: number;
};

export const getAnswers = async () => {
    if (!store.getState().user.loggedIn) return null;

    let response = await Axios.get(`${apiAddress}/answer`, { withCredentials: true });

    return response.data as Answer[];
}

interface AnswerTime {
    questionId: number;
    updatedAt: number;
    isChecked: boolean;
};

export const getAnswerTime = async () => {
    if (!store.getState().user.loggedIn) return undefined;

    let response = await Axios.get<AnswerTime[]>(`${apiAddress}/answer/time`, { withCredentials: true });

    return response.data;
}

export const writeAnswer = async (questionId: number, message: string, length: number, imageData: { imageUrl: string, cropX: number, cropY: number }) => {
    let response = await Axios.put(`${apiAddress}/answer`, {
        questionId, message, length, imageData, 
    }, { withCredentials: true });

    return response.status < 300;
}

export const addBook = async (questionId: number, book: number) => {
    let response = await Axios.put(`${apiAddress}/answer/book`, { questionId, book }, { withCredentials: true });

    return response.status < 300;
}

export const checkAnswer = async (questionId: number) => {
    let response = await Axios.put(`${apiAddress}/answer/check`, { questionId, check: true }, { withCredentials: true });

    return response.status < 300;
}

export const uncheckAnswer = async (questionId: number) => {
    let response = await Axios.put(`${apiAddress}/answer/check`, { questionId, check: false }, { withCredentials: true });

    return response.status < 300;
}
