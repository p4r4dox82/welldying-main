import { Schema, Document } from "mongoose";

export interface answerData {
    imageUri: string,
    answer: string,
}

export interface programAnswerType {
    name: string,
    title: string,
    pid: number,
    answerData: answerData[],
}

export type ProgramAnswerDocument = Document & programAnswerType;

export const programAnswerSchema = new Schema<ProgramAnswerDocument>({
    name: String,
    title: String,
    pid: Number,
    answerData: [{imageUri: String, answer: String}],
});

programAnswerSchema.index({name: true, pid: true}, {unique: true});
