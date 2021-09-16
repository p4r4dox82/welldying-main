import Axios from "axios";
import { apiAddress } from "../config";

export interface Category {
    id: number;
    title: string;
    tag: string;
    contents: number[];
}

export const getCategorys = async () => {
    let response = await Axios.get(`${apiAddress}/category`);
    let data: Category[] = response.data;

    return data;
}

export const getCategory = async (id: number) => {
    let response = await Axios.get(`${apiAddress}/category/${id}`);
    let data: Category | null = response.data;

    return data;
}

export const writeCategory = async (id: number, title: string, tag: string, contents: number[]) => {
    let response = await Axios.post(`${apiAddress}/category`, {
        id, title, tag, contents,
    }, { withCredentials: true });
    console.log('asd');

    return response.status === 200;
}
