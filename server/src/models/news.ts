import { Schema, Document } from "mongoose";

export interface NewsType {
  id: number;
  imageurl: string;
  company: string;
  title: string;
  detail: string;
  date: string;
  tag: string;
};

export type NewsDocument = Document & NewsType;

export const newsSchema = new Schema<NewsDocument>({
    id: { type: Number, unique: true, required: true},
    imageurl: String,
    company: String,
    title: String,
    detail: String,
    date: String,
    tag: String,
});
