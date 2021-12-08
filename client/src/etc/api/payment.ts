import Axios from "axios";
import { apiAddress } from "../config";

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

export const rspSuccess = async(rsp: any, cellphone: string, productName: string) => {
    let response = await Axios.post(`${apiAddress}/order/payments/complete`, {
        imp_uid: rsp.imp_uid, merchant_uid: rsp.merchant_uid, cellphone: cellphone, productName: productName
    }, { withCredentials: true });
    let data = response.data;

    return data;
}

export const addNewOrder = async(orderData: OrderType) => {
    let response = await Axios.post(`${apiAddress}/order/addNewOrder`, {
        orderData: orderData
    }, { withCredentials: true });

    return response.status === 200;
}

export const getOrderData = async(merchant_uid: string) => {
    let response = await Axios.get(`${apiAddress}/order/iamport-webhook-check/${merchant_uid}`);
    let data : OrderType | null = response.data;

    return data;
}