import { Schema, Document } from "mongoose";

export interface QnaType {
  id: number;
  writer: string;
  title: string;
  detail: string;
  date: number;
  answerdate: number;
  open: string;
  state: string;
  password: string;
  classification: string;
  sns_notice: string;
  answer: string;
  faq:boolean;
};

export type QnaDocument = Document & QnaType;

export const qnaSchema = new Schema<QnaDocument>({
    id: { type: Number, unique: true, required: true},
    writer: String,
    title: String,
    detail: String,
    date: Number,
    answerdate: Number,
    open: String,
    state: String,
    password: String,
    classification: String,
    sns_notice: String,
    answer: String,
    faq: Boolean,
});
