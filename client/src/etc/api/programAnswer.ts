import Axios from "axios";
import store from "../../store";
import { apiAddress } from "../config";

export interface ProgramAnswerData {
    imageUri: string,
    answer: string,
}

export interface programAnswer {
    name: string,
    title: string,
    pid: number,
    answerData: ProgramAnswerData[],
}

export const getProgramAnswer = async (pid: number) => {
    let response = await Axios.get(`${apiAddress}/programAnswer/${pid}`);

    return response.data as programAnswer;
}

export const writeProgramAnswers = async (data: programAnswer) => {
    let response = await Axios.put(`${apiAddress}/programAnswer`, {
        data
    }, { withCredentials: true });

    return response.status === 200;
}

export const writeProgramAnswerTitle = async (pid: number, title: string) => {
    let response = await Axios.put(`${apiAddress}/programAnswer/title`, {
        pid, title
    }, { withCredentials: true });

    return response.status === 200;
}