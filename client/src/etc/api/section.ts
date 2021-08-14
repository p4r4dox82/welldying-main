import Axios from "axios";
import { apiAddress } from "../config";

export interface Section {
    id: number;
    title: string;
    tag: string;
    detail: string;
    imageurl: string;
    questions: number[];
}

export const getSections = async () => {
    let response = await Axios.get(`${apiAddress}/section`);
    let data: Section[] = response.data;

    return data;
}

export const getSection = async (id: number) => {
    let response = await Axios.get(`${apiAddress}/section/${id}`);
    let data: Section | null = response.data;

    return data;
}

export const writeSection = async (id: number, title: string, tag: string, detail: string, imageurl: string, questions: number[]) => {
    let response = await Axios.post(`${apiAddress}/section`, {
        id, title, tag, detail, imageurl, questions,
    }, { withCredentials: true });

    return response.status === 200;
}
