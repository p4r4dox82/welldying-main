import { Schema, Document } from "mongoose";

export interface OrderType {
  merchant_uid: number;
  amount: number;
};

export type OrderDocument = Document & OrderType;

export const orderSchema = new Schema<OrderDocument>({
    merchant_uid: { type: Number, unique: true, required: true},
    amount: Number,
});
