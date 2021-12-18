import { Schema, Document } from "mongoose";

export interface OrderType {
  merchant_uid: string;
  amount: number;
  productName: string;
  orderName: string;
  orderEmail: string;
  orderCellphone: string;
  zipCode: string;
  fullAddress: string;
  detailAddress: string;
  success: string;
};

export type OrderDocument = Document & OrderType;

export const orderSchema = new Schema<OrderDocument>({
    merchant_uid: { type: String, unique: true, required: true},
    amount: Number,
    productName: String,
    orderName: String,
    orderEmail: String,
    orderCellphone: String,
    zipCode: String,
    fullAddress: String,
    detailAddress: String,
    success: String
});
