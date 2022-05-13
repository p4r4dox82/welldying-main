import { Schema, Document } from "mongoose";

export interface YouthTestamentType {
    pid: number,
    name: string,
    imageName: string[],
    videoUrl: string[],
}

export type YouthTestamentDocument = Document & YouthTestamentType;

export const youthTestamentSchema = new Schema<YouthTestamentDocument>({
    pid: Number,
    name: String,
    imageName: [String],
    videoUrl: [String]
})
