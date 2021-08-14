import { Schema, Document } from "mongoose";

export interface SectionType {
    id: number;
    title: string;
    tag: string;
    detail: string;
    imageurl: string;
    questions: number[];
};

export type SectionDocument = Document & SectionType;

export const sectionSchema = new Schema<SectionDocument>({
    id: { type: Number, unique: true },
    title: String,
    tag: String,
    detail: String,
    imageurl: String,
    questions: [Number],
});
