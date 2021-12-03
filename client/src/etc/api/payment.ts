import Axios from "axios";
import { apiAddress } from "../config";

export const rspSuccess = async(rsp: any) => {
    let response = await Axios.post(`${apiAddress}/payments/complete`, {
        imp_uid: rsp.imp_uid, merchant_uid: rsp.merchant_uid
    }, {withCredentials: true});
    let data = response.data;

    return data;
}