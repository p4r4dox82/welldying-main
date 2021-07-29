import { Schema, Document } from "mongoose";

export interface SectionType {
    id: number;
    title: string;
    contents: number[];
};

export type SectionDocument = Document & SectionType;

export const sectionSchema = new Schema<SectionDocument>({
    id: { type: Number, unique: true },
    title: String,
    contents: [Number],
});