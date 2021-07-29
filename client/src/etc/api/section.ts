import Axios from "axios";
import { apiAddress } from "../config";

export interface Section {
    id: number;
    title: string;
    contents: number[];
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

export const writeSection = async (id: number, title: string, contents: number[]) => {
    let response = await Axios.post(`${apiAddress}/section/`, {
        id, title, contents,
    }, { withCredentials: true });
    
    return response.status === 200;
}