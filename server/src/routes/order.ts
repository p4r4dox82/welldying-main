import { Router } from "express";
import { Model } from "mongoose";
import Axios from 'axios';
import { OrderDocument, OrderType } from "../models/order";
import user, { onlyAdmin } from "./user";
import { UserDocument } from "../models/user";
import { SMS } from "aws-sdk";

export default (Order: Model<OrderDocument>, User: Model<UserDocument>, sns: AWS.SNS) => {
    let router = Router();

    const sendSMS = async (message: string, phoneNumber: string) => {
      await sns.publish({
          Message: message,
          PhoneNumber: phoneNumber,
      }).promise();
  }

    router.post('/payments/complete', async(req, res, next) => {
        try {
            const { imp_uid, merchant_uid, username, cellphone } = req.body; // req의 body에서 imp_uid, merchant_uid 추출
            // 액세스 토큰(access token) 발급 받기
            const getToken = await Axios.post('https://api.iamport.kr/users/getToken', {
                imp_key: "6241629403610731", // REST API 키
                imp_secret: "0ef47e9e5b67e36d3fa159a12ba8285644dc2c06640f7a131457632cc00df32c647d5adce627c21c"
            }, { headers : { "Content-Type": "application/json" }})
            const { access_token } = getToken.data.response;
            const getPaymentData = await Axios.get(`https://api.iamport.kr/payments/${imp_uid}`, { headers: {Authorization: access_token} });
            const paymentData = getPaymentData.data.response;

            const order = await Order.findById(paymentData.merchant_uid);
            const amountToBePaid = order?.amount;

            const { amount, status } = paymentData;
            if(amount === amountToBePaid) {
              await Order.findByIdAndUpdate(merchant_uid, { $set: paymentData });
              switch(status) {
                case "ready":
                  const { vbank_num, vbank_date, vbank_name } = paymentData;
                  await User.findByIdAndUpdate(username, { $set: { vbank_num, vbank_date, vbank_name }});
                  let data = await sendSMS(`가상계좌 발급이 성공되었습니다. 계죄번호 ${vbank_num} ${vbank_date} ${vbank_name}`, cellphone);
                  res.send({ status: "vbankIssued", message: "가상계좌 발급 성공" });
                  break;
                case "paid":
                  res.send({ status: "success", message: "일반 결제 성공"});
                  break;
              }
            } else {
              throw { status: "forgery", message: "위조된 결제시도" };
            }
          } catch (e) {
            res.status(400).send(e);
          }
    });

    return router;
}