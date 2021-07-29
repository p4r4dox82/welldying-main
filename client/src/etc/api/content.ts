import Axios from "axios";
import { apiAddress } from "../config";


export interface Content {
    id: number,
    type: 'question' | 'post',
    title: string,
    message: string,
    placeholder: string,
}

export const getContents = async () => {
    let response = await Axios.get(`${apiAddress}/content`);
    let data : Content[] = response.data;

    return data;
}

export const getContent = async (id: number) => {
    let response = await Axios.get(`${apiAddress}/content/${id}`);
    let data : Content | null = response.data;

    return data;
}

export const writeContent = async (id: number, type: 'question' | 'post', title: string, message: string, placeholder: string) => {
    let response = await Axios.post(`${apiAddress}/content`, {
        id, type, title, message, placeholder,
    }, { withCredentials: true });

    return response.status === 200;
}
