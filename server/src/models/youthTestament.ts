import { Schema, Document } from "mongoose";

export interface YouthTestamentType {
    id: number,
    pid: number,
    name: string,
    week1: string[],
    week2: string[],
    week3: string[]
}

export type YouthTestamentDocument = Document & YouthTestamentType;

export const youthTestamentSchema = new Schema<YouthTestamentDocument>({
    id: Number,
    pid: Number,
    name: String,
    week1: [String],
    week2: [String],
    week3: [String]
})
