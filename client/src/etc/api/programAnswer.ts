import Axios from "axios";
import store from "../../store";
import { apiAddress } from "../config";

export interface ProgramAnswerData {
    imageUri: string,
    answer: string,
}

export interface programAnswer {
    name: string,
    pid: number,
    answerData: ProgramAnswerData[],
}

export const getProgramAnswer = async (pid: number) => {
    let response = await Axios.get(`${apiAddress}/programAnswer/${pid}`, { withCredentials: true });

    return response.data as programAnswer;
}

export const writeProgramAnswers = async (data: programAnswer) => {
    let response = await Axios.post(`${apiAddress}/programAnswer`, {
        data
    }, { withCredentials: true });

    return response.status === 200;
}