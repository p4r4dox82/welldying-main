import Axios from "axios";
import { apiAddress } from "../config";

export interface Userdata {
  likes: string[],
  bookmark: string[],
  read: string[],
}

export interface imageData {
  imageUrl: string,
  cropX: number,
  cropY: number,
}

export interface Content {
    id: number,
    title: string,
    type: string,
    category: number,
    userdata: { likes: string[], bookmark: string[], read: string[], },
    tag: string,
    date: number,
    source: string,
    detail: { summary: string, online: string },
    comments: number[],
    question: number,
    imageData: { imageUrl: string, cropX: number, cropY: number };
}

export const getContents = async () => {
    let response = await Axios.get(`${apiAddress}/content`);
    let data : Content[] = response.data;

    return data;
}

export const getContent = async (id: number) => {
    let response = await Axios.get(`${apiAddress}/content/${id}`);
    let data : Content | null = response.data;

    return data;
}

export const writeContent = async (id: number, title: string, type: string, category: number, userdata: { likes: string[], bookmark: string[], read: string[], }, tag: string, date: number, source: string, detail: {summary: string, oneline: string}, comments: number[], question: number, imageData: imageData) => {
    let response = await Axios.post(`${apiAddress}/content`, {
        id, title, type, category, userdata, tag, date, source, detail, comments, question, imageData
    }, { withCredentials: true });

    return response.status === 200;
}

export const contentComment = async(id: number, comments: number[]) => {
  let response = await Axios.put(`${apiAddress}/content/comment`, {
    id, comments
  }, { withCredentials: true });

  return response.status === 200;
}

export const content_userdata = async(id: number, userdata: { likes: string[], bookmark: string[], read: string[], }) => {
  let response = await Axios.put(`${apiAddress}/content/userdata`, {
    id, userdata
  }, { withCredentials: true });

  return response.status === 200;
}
