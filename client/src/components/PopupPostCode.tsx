import React from 'react';
import DaumPostcode from "react-daum-postcode";
import { getOrderData, OrderType } from '../etc/api/payment';

interface Props {
    setOrderData: any;
    orderData: OrderType;
    setSearchPostCode: any;
}

function PopupPostCode(props: Props) {
	// 우편번호 검색 후 주소 클릭 시 실행될 함수, data callback 용
    let onCompletePost = (data: any) => {
        let fullAddress = data.address;
        let extraAddr = '';
    
        if (data.addressType === 'R') {
          if (data.bname !== '') {
            extraAddr += data.bname;
          }
          if (data.buildingName !== '') {
            extraAddr += extraAddr !== '' ? `, ${data.buildingName}` : data.buildingName;
          }
          fullAddress += extraAddr !== '' ? ` (${extraAddr})` : '';
        }
        
        props.setOrderData({...props.orderData, zipCode: data.zonecode, fullAddress: fullAddress});
        props.setSearchPostCode(false);
      };
 
    return(
        <div className = "popupPostCode">
            <div className="background"></div>
            <button type='button' className='closePopupPostCode' onClick = {() => props.setSearchPostCode(false)}>닫기</button>
            <DaumPostcode onComplete = {(e) => onCompletePost(e)} style = {{width: "500px", height: "500px", margin: "auto"}}></DaumPostcode>
        </div>
    )
}
 
export default PopupPostCode;