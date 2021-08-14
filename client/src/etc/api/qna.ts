import Axios from "axios";
import { apiAddress } from "../config";


export interface Qna {
    id: number,
    writer: string,
    title: string,
    detail: string,
    date: number,
    answerdate: number,
    open: string,
    state: string,
    password: string,
    classification: string,
    sns_notice: string,
    answer: string,
    faq: boolean,
}

export const getQnas = async () => {
    let response = await Axios.get(`${apiAddress}/qna`);
    let data : Qna[] = response.data;

    return data;
}

export const getrevQnas = async () => {
    let response = await Axios.get(`${apiAddress}/qna/rev`);
    let data : Qna[] = response.data;

    return data;
}

export const getQna = async (id: number) => {
    let response = await Axios.get(`${apiAddress}/qna/${id}`);
    let data : Qna | null = response.data;

    return data;
}

export const writeQna = async (id: number, writer: string, title: string, detail: string, date: number, answerdate: number, open: string, state: string, password: string, classification: string, sns_notice: string, answer: string, faq: boolean) => {
    let response = await Axios.post(`${apiAddress}/qna`, {
        id, writer, title, detail, date, answerdate, open, state, password, classification, sns_notice, answer
    }, { withCredentials: true });

    return response.status === 200;
}
