import Axios from "axios";
import { apiAddress } from "../config";


export interface News {
    id: number,
    imageurl: string,
    company: string,
    title: string,
    detail: string,
    date: string,
    tag: string,
}

export const getNewses = async () => {
    let response = await Axios.get(`${apiAddress}/news`);
    let data : News[] = response.data;

    return data;
}

export const getrevNewses = async () => {
    let response = await Axios.get(`${apiAddress}/news/rev`);
    let data : News[] = response.data;

    return data;
}


export const getNews = async (id: number) => {
    let response = await Axios.get(`${apiAddress}/news/${id}`);
    let data : News | null = response.data;

    return data;
}

export const writeNews = async (id: number, imageurl: string, company: string, title: string, detail: string, date: string, tag: string) => {
    let response = await Axios.post(`${apiAddress}/news`, {
        id, imageurl, company, title, detail, date, tag,
    }, { withCredentials: true });

    return response.status === 200;
}
