import Axios from "axios";
import { apiAddress } from "../config";


export interface Notice {
    id: number,
    classification: string,
    title: string,
    detail: string,
    date: number,
    views: number,
}

export const getNotices = async () => {
    let response = await Axios.get(`${apiAddress}/notice`);
    let data : Notice[] = response.data;

    return data;
}

export const getrevNotices = async () => {
    let response = await Axios.get(`${apiAddress}/notice/rev`);
    let data : Notice[] = response.data;

    return data;
}

export const getNotice = async (id: number) => {
    let response = await Axios.get(`${apiAddress}/notice/${id}`);
    let data : Notice | null = response.data;

    return data;
}

export const writeNotice = async (id: number, classification: string, title: string, detail: string, date: number, views: number) => {
    let response = await Axios.post(`${apiAddress}/notice`, {
        id, classification, title, detail, date, views,
    }, { withCredentials: true });

    return response.status === 200;
}
