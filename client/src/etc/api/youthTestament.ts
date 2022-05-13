import Axios from "axios";
import { apiAddress } from "../config";

export interface YouthTestamentData {
    pid: number,
    name: string,
    imageName: string[],
    videoUrl: string[],
}

export const getYouthTestament = async (pid: number) => {
    let response = await Axios.get(`${apiAddress}/youthTestament/${pid}`);

    return response.data as YouthTestamentData;
}

export const writeYouthTestament = async (data: YouthTestamentData) => {
    let response = await Axios.post(`${apiAddress}/youthTestament`, {
        pid: data.pid, name: data.name, imageName: data.imageName, videoUrl: data.videoUrl
    }, { withCredentials: true });

    return response.status === 200;
}