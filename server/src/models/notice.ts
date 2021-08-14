import { Schema, Document } from "mongoose";

export interface NoticeType {
  id: number;
  classification: string;
  title: string;
  detail: string;
  date: number;
  views: number;
};

export type NoticeDocument = Document & NoticeType;

export const noticeSchema = new Schema<NoticeDocument>({
    id: { type: Number, unique: true, required: true},
    classification: String,
    title: String,
    detail: String,
    date: Number,
    views: Number,
});
