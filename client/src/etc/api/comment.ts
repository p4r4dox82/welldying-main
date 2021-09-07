import Axios from "axios";
import { apiAddress } from "../config";


export interface Comment {
    id: number,
    writer: string,
    detail: string,
    date: number,
    userdata: { likes: string[] },
    declare: string,
}

export const getComments = async () => {
    let response = await Axios.get(`${apiAddress}/comment`);
    let data : Comment[] = response.data;

    return data;
}

export const getComment = async (id: number) => {
    let response = await Axios.get(`${apiAddress}/comment/${id}`);
    let data : Comment | null = response.data;

    return data;
}

export const writeComment = async (id: number, writer: string, detail: string, date: number, userdata: { likes: string[] }, declare: string) => {
    let response = await Axios.put(`${apiAddress}/comment`, {
        id, writer, detail, date, userdata, declare
    }, { withCredentials: true });

    return response.status === 200;
}
