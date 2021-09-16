import { Schema, Document } from "mongoose";

export interface CategoryType {
    id: number;
    title: string;
    tag: string;
    contents: number[];
};

export type CategoryDocument = Document & CategoryType;

export const categorySchema = new Schema<CategoryDocument>({
    id: { type: Number, unique: true },
    title: String,
    tag: String,
    contents: [Number],
});
