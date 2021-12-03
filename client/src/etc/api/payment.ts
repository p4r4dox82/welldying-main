import Axios from "axios";
import { apiAddress } from "../config";

export interface OrderType {
    merchant_uid: string;
    amount: number;
    orderName: string;
    orderEmail: string;
    orderCellphone: string;
    zipCode: string;
    fullAddress: string;
    detailAddress: string;
};

export const rspSuccess = async(rsp: any) => {
    let response = await Axios.post(`${apiAddress}/payments/complete`, {
        imp_uid: rsp.imp_uid, merchant_uid: rsp.merchant_uid
    }, { withCredentials: true });
    let data = response.data;

    return data;
}

export const addNewOrder = async(orderData: OrderType) => {
    let response = await Axios.post(`${apiAddress}/addNewOrder`, {
        merchant_uid: orderData.merchant_uid, amount: orderData.amount, orderName: orderData.orderName
    }, { withCredentials: true });

    return response.status === 200;
}