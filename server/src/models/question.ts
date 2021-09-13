import { Schema, Document } from "mongoose";

export interface QuestionType {
    id: number;
    title: string;
    message: string;
    placeholder: string;
    contents: number[];
    userdata: { exceptuser: string[] };
};

export type QuestionDocument = Document & QuestionType;

export const questionSchema = new Schema<QuestionDocument>({
    id: { type: Number, unique: true, required: true},
    title: String,
    message: String,
    placeholder: String,
    contents: [Number],
    userdata: { exceptuser: [String] },
});
