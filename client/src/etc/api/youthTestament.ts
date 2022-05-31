import Axios from "axios";
import { apiAddress } from "../config";

export interface YouthTestamentData {
    id: number,
    pid: number,
    name: string,
    week1: string[],
    week2: string[],
    week3: string[]
}

export const getYouthTestaments = async () => {
    let response = await Axios.get(`${apiAddress}/youthTestament`);
    let data: YouthTestamentData[] = response.data;

    return data;
}

export const getYouthTestament = async (pid: number) => {
    let response = await Axios.get(`${apiAddress}/youthTestament/${pid}`);

    return response.data as YouthTestamentData;
}

export const writeYouthTestament = async (pid: number, name: string, week1: string[], week2: string[], week3: string[]) => {
    let response = await Axios.put(`${apiAddress}/youthTestament`, {
        pid: pid, name: name, week1: week1, week2: week2, week3: week3
    }, { withCredentials: true });

    return response.status === 200;
}