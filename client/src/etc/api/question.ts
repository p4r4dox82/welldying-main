import Axios from "axios";
import { apiAddress } from "../config";


export interface Question {
    id: number,
    type: 'question' | 'post',
    title: string,
    message: string,
    placeholder: string,
    contents: number[],
}

export const getQuestions = async () => {
    let response = await Axios.get(`${apiAddress}/question`);
    let data : Question[] = response.data;

    return data;
}

export const getQuestion = async (id: number) => {
    let response = await Axios.get(`${apiAddress}/question/${id}`);
    let data : Question | null = response.data;

    return data;
}

export const writeQuestion = async (id: number, type: 'question' | 'post', title: string, message: string, placeholder: string, contents: number[]) => {
    let response = await Axios.post(`${apiAddress}/question`, {
        id, type, title, message, placeholder, contents
    }, { withCredentials: true });

    return response.status === 200;
}
