import Axios from "axios";
import { apiAddress } from "../config";


export interface Question {
    id: number,
    title: string,
    message: string,
    placeholder: string,
    contents: number[],
    userdata: { exceptuser: string[] },
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

export const writeQuestion = async (id: number, title: string, message: string, placeholder: string, contents: number[]) => {
    let response = await Axios.post(`${apiAddress}/question`, {
        id, title, message, placeholder, contents
    }, { withCredentials: true });

    return response.status === 200;
}

export const deleteQuestion = async (id: number, exceptuser: string[]) => {
    let response = await Axios.put(`${apiAddress}/question/delete`, {
        id, exceptuser
    }, { withCredentials: true });

    return response.status === 200;
}